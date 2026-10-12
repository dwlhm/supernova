package author

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"os/exec"
	"strings"
	"sync"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

type authorCLIArtifact struct {
	Target   contracts.Framework `json:"target"`
	FileName string              `json:"fileName"`
	Code     string              `json:"code"`
	Group    string              `json:"group,omitempty"`
}

type authorCLIResponse struct {
	Success         bool                  `json:"success"`
	Components      map[string]string     `json:"components"`
	ComponentGroups map[string]string     `json:"componentGroups,omitempty"`
	Artifacts       []authorCLIArtifact   `json:"artifacts,omitempty"`
	NewTokens       []out.DiscoveredToken `json:"newTokens,omitempty"`
	Error           string                `json:"error,omitempty"`
}

// CLIAuthor implements out.MitosisAuthor by invoking the Node.js author CLI.
type CLIAuthor struct {
	cliPath string
}

var _ out.MitosisAuthor = (*CLIAuthor)(nil)

// NewCLIAuthor creates a new CLIAuthor for the given cli.js path.
func NewCLIAuthor(cliPath string) *CLIAuthor {
	return &CLIAuthor{
		cliPath: cliPath,
	}
}

func extractJSON(data []byte) []byte {
	trimmed := bytes.TrimSpace(data)
	if json.Valid(trimmed) {
		return trimmed
	}
	start := bytes.IndexByte(trimmed, '{')
	end := bytes.LastIndexByte(trimmed, '}')
	if start != -1 && end != -1 && end > start {
		candidate := trimmed[start : end+1]
		if json.Valid(candidate) {
			return candidate
		}
	}
	// If there are multiple JSON-like chunks (e.g. error replacing { ... } then {"success": ...}),
	// locate {"success" or "success" key
	if idx := bytes.Index(trimmed, []byte(`"success"`)); idx != -1 {
		startCandidate := bytes.LastIndexByte(trimmed[:idx], '{')
		if startCandidate != -1 && end > startCandidate {
			candidate := trimmed[startCandidate : end+1]
			if json.Valid(candidate) {
				return candidate
			}
		}
	}
	return trimmed
}

// AuthorDesignSystem executes the Mitosis author CLI passing author request via stdin.
func (c *CLIAuthor) AuthorDesignSystem(ctx context.Context, req out.AuthorRequest) (*out.AuthorResult, error) {
	reqBytes, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal author request: %w", err)
	}

	slog.Info(fmt.Sprintf("[AUTHOR-CLI] Running author CLI: %s for %d component(s)", c.cliPath, len(req.Components)))

	cmd := exec.CommandContext(ctx, "node", c.cliPath)
	cmd.Stdin = bytes.NewReader(reqBytes)

	pr, pw := io.Pipe()
	var stdoutBuf, stderrBuf bytes.Buffer
	cmd.Stdout = &stdoutBuf
	cmd.Stderr = io.MultiWriter(&stderrBuf, pw)

	var scanWg sync.WaitGroup
	scanWg.Add(1)
	go func() {
		defer scanWg.Done()
		scanner := bufio.NewScanner(pr)
		buf := make([]byte, 64*1024)
		scanner.Buffer(buf, 1024*1024)
		for scanner.Scan() {
			line := scanner.Text()
			slog.Info(fmt.Sprintf("[AUTHOR-AGENT] %s", line))
		}
		if scanErr := scanner.Err(); scanErr != nil && scanErr != io.EOF {
			slog.Debug(fmt.Sprintf("[AUTHOR-AGENT] stderr scanner stopped: %v", scanErr))
		}
	}()

	runErr := cmd.Run()
	_ = pw.Close()
	scanWg.Wait()

	if stdoutBuf.Len() > 0 {
		var resp authorCLIResponse
		if jsonErr := json.Unmarshal(extractJSON(stdoutBuf.Bytes()), &resp); jsonErr == nil {
			if !resp.Success {
				errMsg := resp.Error
				if errMsg == "" {
					errMsg = "author CLI reported failure without error message"
				}
				return nil, fmt.Errorf("author CLI failed: %s", errMsg)
			}

			artifacts := make([]domain.CompiledArtifact, 0, len(resp.Artifacts))
			for _, art := range resp.Artifacts {
				group := art.Group
				if group == "" && resp.ComponentGroups != nil {
					baseName := strings.Split(art.FileName, ".")[0]
					group = resp.ComponentGroups[baseName]
				}
				artifacts = append(artifacts, domain.CompiledArtifact{
					Target:   art.Target,
					FileName: art.FileName,
					Code:     art.Code,
					Group:    group,
				})
			}

			return &out.AuthorResult{
				Components:      resp.Components,
				ComponentGroups: resp.ComponentGroups,
				Artifacts:       artifacts,
				NewTokens:       resp.NewTokens,
			}, nil
		} else {
			slog.Error(fmt.Sprintf("[AUTHOR-CLI] [ERROR] Failed to unmarshal author output: %v (stdout: %s)", jsonErr, stdoutBuf.String()))
		}
	}

	if runErr != nil {
		stderrMsg := strings.TrimSpace(stderrBuf.String())
		if stderrMsg != "" {
			return nil, fmt.Errorf("author CLI failed: %w (stderr: %s)", runErr, stderrMsg)
		}
		return nil, fmt.Errorf("author CLI failed: %w", runErr)
	}

	return nil, fmt.Errorf("unexpected empty response from author CLI")
}

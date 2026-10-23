package author

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"strings"
	"sync"

	"github.com/dwlhm/supernova/apps/api/internal/adapter/nodecli"
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
	sandbox nodecli.Sandbox
}

var _ out.MitosisAuthor = (*CLIAuthor)(nil)

// NewCLIAuthor creates a new CLIAuthor for the given cli.js path.
// authorEnvKeys are the only extra variables the author CLI needs: LLM provider settings.
var authorEnvKeys = []string{"LLM_BASE_URL", "LLM_API_KEY", "LLM_MODEL", "LLM_TIMEOUT", "OPENCODE_SESSION"}

func NewCLIAuthor(cliPath string, sandbox nodecli.Sandbox) *CLIAuthor {
	sandbox.EnvKeys = append(append([]string{}, sandbox.EnvKeys...), authorEnvKeys...)
	return &CLIAuthor{cliPath: cliPath, sandbox: sandbox}
}

// AuthorDesignSystem executes the Mitosis author CLI passing author request via stdin.
func (c *CLIAuthor) AuthorDesignSystem(ctx context.Context, req out.AuthorRequest) (*out.AuthorResult, error) {
	reqBytes, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal author request: %w", err)
	}

	slog.Info(fmt.Sprintf("[AUTHOR-CLI] Running author CLI: %s for %d component(s)", c.cliPath, len(req.Components)))

	cmd := nodecli.Command(ctx, c.cliPath, c.sandbox)
	if req.ComponentName != "" {
		cmd.Args = append(cmd.Args, "--component", req.ComponentName)
	}
	if req.CompileOnly {
		cmd.Args = append(cmd.Args, "--compile-only")
	}
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
		if jsonErr := json.Unmarshal(nodecli.ExtractJSON(stdoutBuf.Bytes()), &resp); jsonErr == nil {
			if !resp.Success {
				errMsg := resp.Error
				if errMsg == "" {
					errMsg = "author CLI reported failure without error message"
				}
				return nil, fmt.Errorf("author CLI failed: %s", errMsg)
			}

			return sanitizeResult(resp), nil
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

// sanitizeResult is the trust boundary for LLM output: component names, groups and file names
// that could escape their target directory or inject code are dropped before reaching the core.
func sanitizeResult(resp authorCLIResponse) *out.AuthorResult {
	result := &out.AuthorResult{
		Components:      make(map[string]string, len(resp.Components)),
		ComponentGroups: make(map[string]string, len(resp.ComponentGroups)),
		NewTokens:       resp.NewTokens,
	}
	for name, src := range resp.Components {
		if !domain.ValidComponentName(name) {
			slog.Warn("[AUTHOR-CLI] Dropping component with unsafe name", "name", name)
			continue
		}
		result.Components[name] = src
	}
	for name, group := range resp.ComponentGroups {
		if g := domain.NormalizeGroup(group); g != "" && domain.ValidComponentName(name) {
			result.ComponentGroups[name] = g
		}
	}
	for _, art := range resp.Artifacts {
		group := domain.NormalizeGroup(art.Group)
		if !domain.ValidFileName(art.FileName) || (art.Group != "" && group == "") {
			slog.Warn("[AUTHOR-CLI] Dropping artifact with unsafe path", "file", art.FileName, "group", art.Group)
			continue
		}
		if group == "" {
			baseName, _, _ := strings.Cut(art.FileName, ".")
			group = result.ComponentGroups[baseName]
		}
		result.Artifacts = append(result.Artifacts, domain.CompiledArtifact{
			Target:   art.Target,
			FileName: art.FileName,
			Code:     art.Code,
			Group:    group,
		})
	}
	return result
}

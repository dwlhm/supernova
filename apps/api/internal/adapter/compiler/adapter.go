package compiler

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"strings"

	"github.com/dwlhm/supernova/apps/api/internal/adapter/nodecli"
	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

type compileRequest struct {
	ComponentName string                `json:"componentName"`
	Source        string                `json:"source"`
	Targets       []contracts.Framework `json:"targets,omitempty"`
}

type compileArtifact struct {
	Target   contracts.Framework `json:"target"`
	FileName string              `json:"fileName"`
	Code     string              `json:"code"`
}

type compileError struct {
	Target  string `json:"target,omitempty"`
	Message string `json:"message"`
	Line    *int   `json:"line,omitempty"`
}

type compileResponse struct {
	Success   bool              `json:"success"`
	Artifacts []compileArtifact `json:"artifacts"`
	Errors    []compileError    `json:"errors"`
}

// CLICompiler implements out.MitosisCompiler by invoking the Node.js compiler CLI.
type CLICompiler struct {
	cliPath string
	sandbox nodecli.Sandbox
}

var _ out.MitosisCompiler = (*CLICompiler)(nil)

// NewCLICompiler creates a new CLICompiler for the given cli.js path.
func NewCLICompiler(cliPath string, sandbox nodecli.Sandbox) *CLICompiler {
	return &CLICompiler{cliPath: cliPath, sandbox: sandbox}
}

// Compile executes the Mitosis compiler CLI passing component details via stdin.
func (c *CLICompiler) Compile(
	ctx context.Context,
	componentName string,
	source string,
	targets []contracts.Framework,
) ([]domain.CompiledArtifact, []string, error) {
	reqPayload := compileRequest{
		ComponentName: componentName,
		Source:        source,
		Targets:       targets,
	}

	reqBytes, err := json.Marshal(reqPayload)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to marshal compile request: %w", err)
	}

	slog.Info(fmt.Sprintf("[COMPILER-CLI] Running compiler CLI: %s for component %s", c.cliPath, componentName))

	cmd := nodecli.Command(ctx, c.cliPath, c.sandbox)
	cmd.Stdin = bytes.NewReader(reqBytes)

	var stdoutBuf, stderrBuf bytes.Buffer
	cmd.Stdout = &stdoutBuf
	cmd.Stderr = &stderrBuf

	runErr := cmd.Run()

	if stderrBuf.Len() > 0 {
		slog.Warn(fmt.Sprintf("[COMPILER-CLI] [STDERR] %s", strings.TrimSpace(stderrBuf.String())))
	}

	if stdoutBuf.Len() > 0 {
		var resp compileResponse
		if jsonErr := json.Unmarshal(nodecli.ExtractJSON(stdoutBuf.Bytes()), &resp); jsonErr == nil {
			artifacts := make([]domain.CompiledArtifact, 0, len(resp.Artifacts))
			for _, art := range resp.Artifacts {
				artifacts = append(artifacts, domain.CompiledArtifact{
					Target:   art.Target,
					FileName: art.FileName,
					Code:     art.Code,
				})
			}

			var errMsgs []string
			for _, e := range resp.Errors {
				if e.Target != "" {
					errMsgs = append(errMsgs, fmt.Sprintf("[%s] %s", e.Target, e.Message))
				} else {
					errMsgs = append(errMsgs, e.Message)
				}
			}

			if len(errMsgs) > 0 {
				return artifacts, errMsgs, nil
			}

			if runErr != nil && !resp.Success {
				return artifacts, []string{fmt.Sprintf("compiler failed: %v", runErr)}, nil
			}

			return artifacts, nil, nil
		} else {
			slog.Error(fmt.Sprintf("[COMPILER-CLI] [ERROR] Failed to unmarshal compiler output: %v (stdout: %s)", jsonErr, stdoutBuf.String()))
		}
	}

	if runErr != nil {
		stderrMsg := strings.TrimSpace(stderrBuf.String())
		if stderrMsg != "" {
			return nil, nil, fmt.Errorf("compiler CLI failed: %w (stderr: %s)", runErr, stderrMsg)
		}
		return nil, nil, fmt.Errorf("compiler CLI failed: %w", runErr)
	}

	return nil, nil, fmt.Errorf("unexpected empty response from compiler CLI")
}

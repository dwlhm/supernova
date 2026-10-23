package author_test

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"

	authoradapter "github.com/dwlhm/supernova/apps/api/internal/adapter/author"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/nodecli"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func createTempCLIScript(t *testing.T, scriptContent string) string {
	t.Helper()
	tmpDir := t.TempDir()
	scriptPath := filepath.Join(tmpDir, "mock-cli.cjs")
	if err := os.WriteFile(scriptPath, []byte(scriptContent), 0o755); err != nil {
		t.Fatalf("failed to write mock cli script: %v", err)
	}
	return scriptPath
}

func TestCLIAuthor_Success(t *testing.T) {
	script := `
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8');
const req = JSON.parse(input);

process.stderr.write('[AGENT] Starting authoring session\n');
process.stderr.write('[AGENT:TOOL] testCompile: compiling "Button" (100 chars)...\n');

const resp = {
  success: true,
  components: {
    Button: 'export default function Button() { return <button />; }'
  },
  componentGroups: {
    Button: 'components'
  },
  artifacts: [
    {
      target: 'mitosis',
      fileName: 'Button.lite.tsx',
      code: 'export default function Button() { return <button />; }',
      group: 'components'
    },
    {
      target: 'react',
      fileName: 'Button.tsx',
      code: 'export const Button = () => <button />;',
      group: 'components'
    }
  ],
  newTokens: [
    {
      name: 'color/button-primary',
      type: 'color',
      value: '#2563eb',
      description: 'Primary button color'
    }
  ]
};

process.stdout.write(JSON.stringify(resp));
process.exit(0);
`
	cliPath := createTempCLIScript(t, script)
	cliAuthor := authoradapter.NewCLIAuthor(cliPath, nodecli.Sandbox{})

	req := out.AuthorRequest{
		Components: []contracts.FigmaComponentSpec{
			{Id: "c-1", Name: "Button"},
		},
		Targets: []contracts.Framework{contracts.Mitosis, contracts.React},
	}

	result, err := cliAuthor.AuthorDesignSystem(context.Background(), req)
	if err != nil {
		t.Fatalf("expected author to succeed, got error: %v", err)
	}

	if result == nil {
		t.Fatal("expected non-nil result")
	}

	if len(result.Components) != 1 || result.Components["Button"] == "" {
		t.Errorf("expected Button component in result, got %+v", result.Components)
	}

	if result.ComponentGroups["Button"] != "components" {
		t.Errorf("expected Button group 'components', got %v", result.ComponentGroups["Button"])
	}

	if len(result.Artifacts) != 2 {
		t.Fatalf("expected 2 artifacts, got %d", len(result.Artifacts))
	}

	if len(result.NewTokens) != 1 || result.NewTokens[0].Name != "color/button-primary" {
		t.Errorf("expected 1 new token color/button-primary, got %+v", result.NewTokens)
	}
}

func TestCLIAuthor_StdoutWithPreambleLog(t *testing.T) {
	script := `
const resp = {
  success: true,
  components: {
    Button: 'export default function Button() { return <button />; }'
  },
  componentGroups: {
    Button: 'components'
  },
  artifacts: [
    {
      target: 'react',
      fileName: 'Button.tsx',
      code: 'export const Button = () => <button />;',
      group: 'components'
    }
  ],
  newTokens: []
};

// Simulate third-party stdout pollution before actual JSON response
process.stdout.write("error replacing { code: 'test' }\n");
process.stdout.write(JSON.stringify(resp));
process.exit(0);
`
	cliPath := createTempCLIScript(t, script)
	cliAuthor := authoradapter.NewCLIAuthor(cliPath, nodecli.Sandbox{})

	req := out.AuthorRequest{
		Components: []contracts.FigmaComponentSpec{
			{Id: "c-1", Name: "Button"},
		},
		Targets: []contracts.Framework{contracts.React},
	}

	result, err := cliAuthor.AuthorDesignSystem(context.Background(), req)
	if err != nil {
		t.Fatalf("expected author to succeed despite stdout preamble log, got error: %v", err)
	}

	if result == nil {
		t.Fatal("expected non-nil result")
	}

	if len(result.Components) != 1 || result.Components["Button"] == "" {
		t.Errorf("expected Button component in result, got %+v", result.Components)
	}

	if len(result.Artifacts) != 1 {
		t.Errorf("expected 1 artifact, got %d", len(result.Artifacts))
	}
}

func TestCLIAuthor_FailureResponse(t *testing.T) {
	script := `
const resp = {
  success: false,
  components: {},
  componentGroups: {},
  artifacts: [],
  newTokens: [],
  error: 'LLM context overflow'
};

process.stdout.write(JSON.stringify(resp));
process.exit(1);
`
	cliPath := createTempCLIScript(t, script)
	cliAuthor := authoradapter.NewCLIAuthor(cliPath, nodecli.Sandbox{})

	req := out.AuthorRequest{
		Components: []contracts.FigmaComponentSpec{
			{Id: "c-1", Name: "Button"},
		},
	}

	_, err := cliAuthor.AuthorDesignSystem(context.Background(), req)
	if err == nil {
		t.Fatal("expected error from failed author CLI, got nil")
	}

	expectedErr := "LLM context overflow"
	if !strings.Contains(err.Error(), expectedErr) {
		t.Errorf("expected error to contain %q, got: %v", expectedErr, err)
	}
}

func TestCLIAuthor_ProcessCrash(t *testing.T) {
	script := `
process.stderr.write('Fatal node crash!\n');
process.exit(1);
`
	cliPath := createTempCLIScript(t, script)
	cliAuthor := authoradapter.NewCLIAuthor(cliPath, nodecli.Sandbox{})

	req := out.AuthorRequest{
		Components: []contracts.FigmaComponentSpec{
			{Id: "c-1", Name: "Button"},
		},
	}

	_, err := cliAuthor.AuthorDesignSystem(context.Background(), req)
	if err == nil {
		t.Fatal("expected error on process crash, got nil")
	}
}

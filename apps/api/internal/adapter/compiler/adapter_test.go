package compiler_test

import (
	"context"
	"os"
	"path/filepath"
	"testing"

	"github.com/dwlhm/supernova/apps/api/internal/adapter/compiler"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/nodecli"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func TestCLICompilerSuccess(t *testing.T) {
	// Create mock node script that returns successful compilation
	dir := t.TempDir()
	scriptPath := filepath.Join(dir, "mock-cli.js")
	scriptContent := `
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8');
const req = JSON.parse(input);
const res = {
  success: true,
  artifacts: [
    { target: 'react', fileName: req.componentName + '.tsx', code: 'export const Button = () => null;' }
  ],
  errors: []
};
console.log(JSON.stringify(res));
`
	if err := os.WriteFile(scriptPath, []byte(scriptContent), 0755); err != nil {
		t.Fatalf("failed to write mock cli: %v", err)
	}

	comp := compiler.NewCLICompiler(scriptPath, nodecli.Sandbox{})
	artifacts, errors, err := comp.Compile(context.Background(), "Button", "const Button = 1;", []contracts.Framework{contracts.React})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(errors) > 0 {
		t.Fatalf("unexpected errors: %v", errors)
	}
	if len(artifacts) != 1 || artifacts[0].FileName != "Button.tsx" {
		t.Fatalf("unexpected artifacts: %+v", artifacts)
	}
}

func TestCLICompilerErrors(t *testing.T) {
	// Create mock node script that returns compilation errors and exit code 1
	dir := t.TempDir()
	scriptPath := filepath.Join(dir, "mock-cli-err.js")
	scriptContent := `
const res = {
  success: false,
  artifacts: [],
  errors: [
    { target: 'react', message: 'Syntax error: unexpected token' }
  ]
};
console.log(JSON.stringify(res));
process.exit(1);
`
	if err := os.WriteFile(scriptPath, []byte(scriptContent), 0755); err != nil {
		t.Fatalf("failed to write mock cli: %v", err)
	}

	comp := compiler.NewCLICompiler(scriptPath, nodecli.Sandbox{})
	artifacts, errMsgs, err := comp.Compile(context.Background(), "Button", "invalid code", []contracts.Framework{contracts.React})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(artifacts) != 0 {
		t.Errorf("expected 0 artifacts, got %d", len(artifacts))
	}
	if len(errMsgs) != 1 || errMsgs[0] != "[react] Syntax error: unexpected token" {
		t.Errorf("unexpected error messages: %v", errMsgs)
	}
}

func TestCLICompilerStdoutWithPreambleLog(t *testing.T) {
	dir := t.TempDir()
	scriptPath := filepath.Join(dir, "mock-cli-preamble.js")
	scriptContent := `
const res = {
  success: true,
  artifacts: [
    { target: 'react', fileName: 'Button.tsx', code: 'export const Button = () => null;' }
  ],
  errors: []
};
process.stdout.write("error replacing { code: 'test' }\n");
process.stdout.write(JSON.stringify(res));
`
	if err := os.WriteFile(scriptPath, []byte(scriptContent), 0755); err != nil {
		t.Fatalf("failed to write mock cli: %v", err)
	}

	comp := compiler.NewCLICompiler(scriptPath, nodecli.Sandbox{})
	artifacts, errors, err := comp.Compile(context.Background(), "Button", "const Button = 1;", []contracts.Framework{contracts.React})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(errors) > 0 {
		t.Fatalf("unexpected errors: %v", errors)
	}
	if len(artifacts) != 1 || artifacts[0].FileName != "Button.tsx" {
		t.Fatalf("unexpected artifacts: %+v", artifacts)
	}
}

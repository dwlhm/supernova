package nodecli_test

import (
	"context"
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"slices"
	"strings"
	"testing"

	"github.com/dwlhm/supernova/apps/api/internal/adapter/nodecli"
)

func TestEnv_ForwardsOnlyAllowlistedKeys(t *testing.T) {
	vars := map[string]string{
		"PATH": "/bin", "HOME": "/home/x", "LLM_API_KEY": "llm",
		"API_TOKEN": "api-secret", "GITHUB_TOKEN": "gh-secret", "AWS_SECRET_ACCESS_KEY": "aws",
	}
	lookup := func(k string) (string, bool) { v, ok := vars[k]; return v, ok }

	env := nodecli.Env(lookup, []string{"LLM_API_KEY"})

	for _, want := range []string{"PATH=/bin", "HOME=/home/x", "LLM_API_KEY=llm"} {
		if !slices.Contains(env, want) {
			t.Errorf("env %v missing %q", env, want)
		}
	}
	for _, kv := range env {
		for _, secret := range []string{"API_TOKEN=", "GITHUB_TOKEN=", "AWS_SECRET_ACCESS_KEY="} {
			if strings.HasPrefix(kv, secret) {
				t.Errorf("secret leaked into child env: %s", kv)
			}
		}
	}
}

func TestArgs_EnablePermissionModelWithResolvedPaths(t *testing.T) {
	real := t.TempDir()
	link := filepath.Join(t.TempDir(), "link")
	if err := os.Symlink(real, link); err != nil {
		t.Fatal(err)
	}
	cli := filepath.Join(real, "cli.js")

	args := nodecli.Args(cli, nodecli.Sandbox{ReadPaths: []string{link}})

	cliResolved, _ := filepath.EvalSymlinks(real)
	if args[0] != "--permission" || args[len(args)-1] != filepath.Join(cliResolved, "cli.js") {
		t.Fatalf("unexpected args layout: %v", args)
	}
	realResolved, _ := filepath.EvalSymlinks(real)
	for _, want := range []string{"--allow-fs-read=" + link, "--allow-fs-read=" + realResolved} {
		if !slices.Contains(args, want) {
			t.Errorf("args %v missing %q", args, want)
		}
	}
	for _, a := range args {
		if strings.HasPrefix(a, "--allow-fs-write") || a == "--allow-child-process" {
			t.Errorf("sandbox must not grant %s", a)
		}
	}
}

// TestCommand_SandboxBlocksSecretsFilesAndProcesses runs real node to prove the guarantees
// LLM-authored code relies on: no secret env, no reads outside the allowlist, no spawning.
func TestCommand_SandboxBlocksSecretsFilesAndProcesses(t *testing.T) {
	if _, err := exec.LookPath("node"); err != nil {
		t.Skip("node not installed")
	}
	outside, err := filepath.Abs("nodecli.go")
	if err != nil {
		t.Fatal(err)
	}
	script := filepath.Join(t.TempDir(), "probe.cjs")
	probe := `const r = {};
try { require('fs').readFileSync(` + jsString(outside) + `); r.read = 'allowed'; } catch (e) { r.read = e.code; }
try { require('fs').writeFileSync(require('os').tmpdir() + '/x', 'x'); r.write = 'allowed'; } catch (e) { r.write = e.code; }
try { require('child_process').execSync('true'); r.spawn = 'allowed'; } catch (e) { r.spawn = e.code; }
r.apiToken = process.env.API_TOKEN || null;
process.stdout.write(JSON.stringify(r));`
	if err := os.WriteFile(script, []byte(probe), 0o644); err != nil {
		t.Fatal(err)
	}
	t.Setenv("API_TOKEN", "must-not-leak")

	out, err := nodecli.Command(context.Background(), script, nodecli.Sandbox{}).Output()
	if err != nil {
		t.Fatalf("node failed: %v (%s)", err, out)
	}
	var r map[string]any
	if err := json.Unmarshal(out, &r); err != nil {
		t.Fatalf("bad probe output %q: %v", out, err)
	}
	for _, k := range []string{"read", "write", "spawn"} {
		if r[k] != "ERR_ACCESS_DENIED" {
			t.Errorf("%s = %v, want ERR_ACCESS_DENIED", k, r[k])
		}
	}
	if r["apiToken"] != nil {
		t.Errorf("API_TOKEN leaked into sandbox: %v", r["apiToken"])
	}
}

func jsString(s string) string {
	b, _ := json.Marshal(s)
	return string(b)
}

// Package nodecli runs the Node.js CLIs (author, compiler) as sandboxed child processes.
//
// LLM-authored code is executed inside these processes, so they get only an allowlisted
// environment (no API_TOKEN/GITHUB_TOKEN) and run under the Node permission model: no child
// processes, no filesystem writes, and filesystem reads limited to Sandbox.ReadPaths plus the
// OS temp dir (where workspace clones live).
package nodecli

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
)

// baseEnvKeys are forwarded to every CLI: process basics and network/TLS settings.
var baseEnvKeys = []string{
	"PATH", "HOME", "TMPDIR", "LANG", "LC_ALL", "TZ",
	"NODE_EXTRA_CA_CERTS", "HTTP_PROXY", "HTTPS_PROXY", "NO_PROXY",
	"http_proxy", "https_proxy", "no_proxy",
}

// Sandbox describes what a CLI process may read and which extra env vars it receives.
type Sandbox struct {
	ReadPaths []string
	EnvKeys   []string
}

// Command builds a sandboxed `node <cliPath>` command.
func Command(ctx context.Context, cliPath string, sb Sandbox) *exec.Cmd {
	cmd := exec.CommandContext(ctx, "node", Args(cliPath, sb)...)
	cmd.Env = Env(os.LookupEnv, sb.EnvKeys)
	return cmd
}

// Args returns the node arguments enabling the permission model for cliPath. The entry path is
// symlink-resolved so Node's startup realpath never has to traverse non-allowlisted links
// (e.g. macOS /var -> /private/var).
func Args(cliPath string, sb Sandbox) []string {
	entry := resolve(cliPath)
	args := []string{"--permission", "--allow-worker", "--disable-warning=SecurityWarning"}
	for _, p := range readPaths(entry, sb.ReadPaths) {
		args = append(args, "--allow-fs-read="+p)
	}
	return append(args, entry)
}

func resolve(p string) string {
	if abs, err := filepath.Abs(p); err == nil {
		p = abs
	}
	if real, err := filepath.EvalSymlinks(p); err == nil {
		return real
	}
	if dir, err := filepath.EvalSymlinks(filepath.Dir(p)); err == nil {
		return filepath.Join(dir, filepath.Base(p))
	}
	return p
}

// Env returns KEY=VALUE pairs for the base allowlist plus extraKeys that are set.
func Env(lookup func(string) (string, bool), extraKeys []string) []string {
	env := make([]string, 0, len(baseEnvKeys)+len(extraKeys))
	for _, keys := range [][]string{baseEnvKeys, extraKeys} {
		for _, k := range keys {
			if v, ok := lookup(k); ok {
				env = append(env, k+"="+v)
			}
		}
	}
	return env
}

// readPaths adds the CLI's own directory and the temp dir, and includes the symlink-resolved
// form of every path because Node checks permissions on both (e.g. /tmp -> /private/tmp).
func readPaths(cliPath string, configured []string) []string {
	candidates := append([]string{filepath.Dir(cliPath), os.TempDir()}, configured...)
	seen := make(map[string]bool, len(candidates)*2)
	out := make([]string, 0, len(candidates)*2)
	add := func(p string) {
		if p != "" && !seen[p] {
			seen[p] = true
			out = append(out, p)
		}
	}
	for _, p := range candidates {
		abs, err := filepath.Abs(p)
		if err != nil {
			continue
		}
		add(abs)
		if real, err := filepath.EvalSymlinks(abs); err == nil {
			add(real)
		}
	}
	return out
}

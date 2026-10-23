// Package config loads and validates the API server configuration from the environment.
package config

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// GitHub holds the pull-request publisher and webhook settings.
type GitHub struct {
	Token         string
	Repo          string
	BaseBranch    string
	WebhookSecret string
}

// Config is the fully resolved server configuration. Every filesystem path is absolute or empty.
type Config struct {
	Port           string
	APIToken       string
	InsecureNoAuth bool
	DevMockLLM     bool
	AuthorBin      string
	CompilerBin    string
	ExtractionsDir string
	DocsDir        string
	GeneratedDir   string
	DatabasePath   string
	// NodeReadPaths are the only directories the sandboxed Node CLIs may read (besides their own
	// directory and the OS temp dir): the workspace packages and node_modules.
	NodeReadPaths []string
	GitHub        GitHub
}

// ErrMissingAPIToken is returned when authentication is not configured and not explicitly disabled.
var ErrMissingAPIToken = errors.New("API_TOKEN is required; set SUPERNOVA_INSECURE_NO_AUTH=true to run without auth in local development")

// Load builds a Config from getenv. Repository-relative defaults are resolved against repoRoot
// (the directory containing go.work); an empty repoRoot disables those defaults.
func Load(getenv func(string) string, repoRoot string) (Config, error) {
	env := func(key, def string) string {
		if v := strings.TrimSpace(getenv(key)); v != "" {
			return v
		}
		return def
	}
	fromRoot := func(rel string) string {
		if repoRoot == "" {
			return ""
		}
		return filepath.Join(repoRoot, rel)
	}

	cfg := Config{
		Port:           env("PORT", "8080"),
		APIToken:       env("API_TOKEN", ""),
		InsecureNoAuth: env("SUPERNOVA_INSECURE_NO_AUTH", "") == "true",
		DevMockLLM:     env("SUPERNOVA_DEV_MOCK_LLM", "") == "true",
		AuthorBin:      absPath(env("AUTHOR_BIN", fromRoot("packages/mitosis-author/dist/cli.js"))),
		CompilerBin:    absPath(env("COMPILER_BIN", fromRoot("packages/mitosis-compiler/dist/cli.js"))),
		ExtractionsDir: absPath(env("EXTRACTIONS_DIR", fromRoot("var/extractions"))),
		DocsDir:        absPath(env("APPS_DOCS_DIR", "")),
		GeneratedDir:   absPath(env("GENERATED_DIR", "")),
		DatabasePath:   absPath(env("DATABASE_PATH", fromRoot("var/supernova.db"))),
		NodeReadPaths:  nodeReadPaths(env("NODE_READ_PATHS", ""), fromRoot),
		GitHub: GitHub{
			Token:         env("GITHUB_TOKEN", ""),
			Repo:          env("GITHUB_REPO", ""),
			BaseBranch:    env("GITHUB_BASE_BRANCH", "main"),
			WebhookSecret: env("GITHUB_WEBHOOK_SECRET", ""),
		},
	}
	return cfg, cfg.validate()
}

func nodeReadPaths(raw string, fromRoot func(string) string) []string {
	if raw == "" {
		if fromRoot("") == "" {
			return nil
		}
		return []string{fromRoot("node_modules"), fromRoot("packages")}
	}
	var paths []string
	for _, p := range filepath.SplitList(raw) {
		if p = strings.TrimSpace(p); p != "" {
			paths = append(paths, absPath(p))
		}
	}
	return paths
}

func (c Config) validate() error {
	if c.APIToken == "" && !c.InsecureNoAuth {
		return ErrMissingAPIToken
	}
	if len(c.NodeReadPaths) == 0 {
		return fmt.Errorf("NODE_READ_PATHS is required when the repository root cannot be detected")
	}
	if c.ExtractionsDir == "" {
		return fmt.Errorf("EXTRACTIONS_DIR is required when the repository root cannot be detected")
	}
	for name, bin := range map[string]string{"AUTHOR_BIN": c.AuthorBin, "COMPILER_BIN": c.CompilerBin} {
		if bin == "" {
			return fmt.Errorf("%s is required when the repository root cannot be detected", name)
		}
		if _, err := os.Stat(bin); err != nil {
			return fmt.Errorf("%s %q is not usable (run `pnpm build` first): %w", name, bin, err)
		}
	}
	return nil
}

// FindRepoRoot walks up from dir to the nearest directory containing go.work. Returns "" if none.
func FindRepoRoot(dir string) string {
	for d := absPath(dir); d != ""; {
		if _, err := os.Stat(filepath.Join(d, "go.work")); err == nil {
			return d
		}
		parent := filepath.Dir(d)
		if parent == d {
			return ""
		}
		d = parent
	}
	return ""
}

func absPath(p string) string {
	if p == "" {
		return ""
	}
	abs, err := filepath.Abs(p)
	if err != nil {
		return p
	}
	return abs
}

package config_test

import (
	"errors"
	"os"
	"path/filepath"
	"testing"

	"github.com/dwlhm/supernova/apps/api/internal/config"
)

func fakeRepo(t *testing.T) string {
	t.Helper()
	root := t.TempDir()
	for _, f := range []string{
		"go.work",
		"packages/mitosis-author/dist/cli.js",
		"packages/mitosis-compiler/dist/cli.js",
	} {
		p := filepath.Join(root, f)
		if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(p, nil, 0o644); err != nil {
			t.Fatal(err)
		}
	}
	return root
}

func envOf(m map[string]string) func(string) string {
	return func(k string) string { return m[k] }
}

func TestLoad_RequiresAPITokenUnlessInsecureOptIn(t *testing.T) {
	root := fakeRepo(t)

	if _, err := config.Load(envOf(nil), root); !errors.Is(err, config.ErrMissingAPIToken) {
		t.Fatalf("expected ErrMissingAPIToken, got %v", err)
	}
	cfg, err := config.Load(envOf(map[string]string{"SUPERNOVA_INSECURE_NO_AUTH": "true"}), root)
	if err != nil || !cfg.InsecureNoAuth {
		t.Fatalf("expected insecure opt-in to load, got cfg=%+v err=%v", cfg, err)
	}
	if _, err := config.Load(envOf(map[string]string{"SUPERNOVA_INSECURE_NO_AUTH": "1"}), root); !errors.Is(err, config.ErrMissingAPIToken) {
		t.Fatalf("only the literal \"true\" may disable auth, got %v", err)
	}
}

func TestLoad_ResolvesDefaultsFromRepoRoot(t *testing.T) {
	root := fakeRepo(t)
	cfg, err := config.Load(envOf(map[string]string{"API_TOKEN": "s3cret"}), root)
	if err != nil {
		t.Fatalf("Load: %v", err)
	}
	want := map[string]string{
		"ExtractionsDir": filepath.Join(root, "var/extractions"),
		"DocsDir":        "",
		"GeneratedDir":   "",
		"AuthorBin":      filepath.Join(root, "packages/mitosis-author/dist/cli.js"),
		"CompilerBin":    filepath.Join(root, "packages/mitosis-compiler/dist/cli.js"),
	}
	got := map[string]string{
		"ExtractionsDir": cfg.ExtractionsDir, "DocsDir": cfg.DocsDir, "GeneratedDir": cfg.GeneratedDir,
		"AuthorBin": cfg.AuthorBin, "CompilerBin": cfg.CompilerBin,
	}
	for k, w := range want {
		if got[k] != w {
			t.Errorf("%s = %q, want %q", k, got[k], w)
		}
	}
	wantRead := []string{filepath.Join(root, "node_modules"), filepath.Join(root, "packages")}
	if len(cfg.NodeReadPaths) != 2 || cfg.NodeReadPaths[0] != wantRead[0] || cfg.NodeReadPaths[1] != wantRead[1] {
		t.Errorf("NodeReadPaths = %v, want %v", cfg.NodeReadPaths, wantRead)
	}
	if cfg.Port != "8080" || cfg.GitHub.BaseBranch != "main" {
		t.Errorf("unexpected scalar defaults: port=%q base=%q", cfg.Port, cfg.GitHub.BaseBranch)
	}
}

func TestLoad_EnvOverridesAndMissingBinaries(t *testing.T) {
	root := fakeRepo(t)
	custom := t.TempDir()
	cfg, err := config.Load(envOf(map[string]string{
		"API_TOKEN": "x", "EXTRACTIONS_DIR": custom, "APPS_DOCS_DIR": "", "PORT": "9090",
	}), root)
	if err != nil {
		t.Fatalf("Load: %v", err)
	}
	if cfg.ExtractionsDir != custom || cfg.Port != "9090" {
		t.Errorf("env overrides not applied: %+v", cfg)
	}

	if _, err := config.Load(envOf(map[string]string{"API_TOKEN": "x"}), ""); err == nil {
		t.Fatal("expected an error when no repo root and no explicit paths are given")
	}
	if _, err := config.Load(envOf(map[string]string{
		"API_TOKEN": "x", "AUTHOR_BIN": filepath.Join(root, "missing.js"),
	}), root); err == nil {
		t.Fatal("expected an error for a missing AUTHOR_BIN")
	}
}

func TestFindRepoRoot(t *testing.T) {
	root := fakeRepo(t)
	nested := filepath.Join(root, "apps", "api", "cmd")
	if err := os.MkdirAll(nested, 0o755); err != nil {
		t.Fatal(err)
	}
	if got := config.FindRepoRoot(nested); got != root {
		t.Fatalf("FindRepoRoot = %q, want %q", got, root)
	}
}

func TestLoadDotEnv_DoesNotOverrideExistingEnv(t *testing.T) {
	path := filepath.Join(t.TempDir(), ".env")
	content := "# comment\nexport SN_TEST_A=\"from-file\"\nSN_TEST_B=kept\nINVALID_LINE\n"
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatal(err)
	}
	t.Setenv("SN_TEST_B", "from-env")
	t.Setenv("SN_TEST_A", "")
	os.Unsetenv("SN_TEST_A")

	if err := config.LoadDotEnv(path); err != nil {
		t.Fatalf("LoadDotEnv: %v", err)
	}
	if v := os.Getenv("SN_TEST_A"); v != "from-file" {
		t.Errorf("SN_TEST_A = %q, want from-file", v)
	}
	if v := os.Getenv("SN_TEST_B"); v != "from-env" {
		t.Errorf("SN_TEST_B = %q, want from-env", v)
	}
	if err := config.LoadDotEnv(filepath.Join(t.TempDir(), "absent")); err != nil {
		t.Errorf("missing file must not error: %v", err)
	}
}

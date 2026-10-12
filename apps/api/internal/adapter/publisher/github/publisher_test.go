package github_test

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/dwlhm/supernova/apps/api/internal/adapter/publisher/github"
	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func TestGitHubPublisher_Name(t *testing.T) {
	pub := github.NewPublisher("dummy-token", "owner/repo", "main")
	if pub.Name() != string(contracts.PullRequest) {
		t.Errorf("expected publisher name %q, got %q", string(contracts.PullRequest), pub.Name())
	}
}

func TestGitHubPublisher_GetExistingSources_EmptyConfig(t *testing.T) {
	ctx := context.Background()

	// Empty token and repo
	pub := github.NewPublisher("", "", "main")
	sources, err := pub.GetExistingSources(ctx)
	if err != nil {
		t.Fatalf("expected nil error for empty config, got %v", err)
	}
	if len(sources) != 0 {
		t.Errorf("expected empty map for empty config, got %v", sources)
	}

	// Empty repo only
	pubWithToken := github.NewPublisher("some-token", "", "main")
	sources, err = pubWithToken.GetExistingSources(ctx)
	if err != nil {
		t.Fatalf("expected nil error for empty repo, got %v", err)
	}
	if len(sources) != 0 {
		t.Errorf("expected empty map for empty repo, got %v", sources)
	}

	// Invalid repo format
	pubBadRepo := github.NewPublisher("some-token", "invalid-repo-without-slash", "main")
	_, err = pubBadRepo.GetExistingSources(ctx)
	if err == nil {
		t.Fatalf("expected error for invalid repo format, got nil")
	}
}

func TestGitHubPublisher_GetExistingSources_CloneFailureRecovery(t *testing.T) {
	ctx := context.Background()

	// Non-routable host should log warning, mask token, and recover gracefully with empty map
	pub := github.NewPublisher("secret-gh-token", "owner/repo", "main")
	pub.SetBaseURL("http://127.0.0.1:0")

	sources, err := pub.GetExistingSources(ctx)
	if err != nil {
		t.Fatalf("expected nil error on clone failure (recoverable), got %v", err)
	}
	if len(sources) != 0 {
		t.Errorf("expected empty map on clone failure, got %v", sources)
	}
}

func TestGitHubPublisher_GetExistingComponentInfo_EmptyConfig(t *testing.T) {
	ctx := context.Background()

	pub := github.NewPublisher("", "", "main")
	names, dir, cleanup, err := pub.GetExistingComponentInfo(ctx)
	if err != nil {
		t.Fatalf("expected nil error for empty config, got %v", err)
	}
	if len(names) != 0 || dir != "" {
		t.Errorf("expected empty names and dir, got names=%v, dir=%s", names, dir)
	}
	cleanup()

	pubBadRepo := github.NewPublisher("some-token", "invalid-repo-without-slash", "main")
	_, _, _, err = pubBadRepo.GetExistingComponentInfo(ctx)
	if err == nil {
		t.Fatalf("expected error for invalid repo format, got nil")
	}
}

func TestGitHubPublisher_GetExistingComponentInfo_CloneFailureRecovery(t *testing.T) {
	ctx := context.Background()

	pub := github.NewPublisher("secret-gh-token", "owner/repo", "main")
	pub.SetBaseURL("http://127.0.0.1:0")

	names, dir, cleanup, err := pub.GetExistingComponentInfo(ctx)
	if err != nil {
		t.Fatalf("expected nil error on clone failure (recoverable), got %v", err)
	}
	if len(names) != 0 || dir != "" {
		t.Errorf("expected empty names and dir on clone failure, got names=%v, dir=%s", names, dir)
	}
	cleanup()
}

func TestScanSourcesFromDir(t *testing.T) {
	// Test 1: Empty directory without src
	emptyDir := t.TempDir()
	sources := github.ScanSourcesFromDir(emptyDir)
	if len(sources) != 0 {
		t.Errorf("expected empty map for directory without src, got %v", sources)
	}

	// Test 2: Directory with src, but no .lite.tsx files
	srcOnlyDir := t.TempDir()
	_ = os.MkdirAll(filepath.Join(srcOnlyDir, "src", "tokens"), 0755)
	_ = os.WriteFile(filepath.Join(srcOnlyDir, "src", "tokens", "tokens.json"), []byte("{}"), 0644)
	sources = github.ScanSourcesFromDir(srcOnlyDir)
	if len(sources) != 0 {
		t.Errorf("expected empty map for src without .lite.tsx, got %v", sources)
	}

	// Test 3: Directory with components and icons
	fixtureDir := t.TempDir()
	compDir := filepath.Join(fixtureDir, "src", "components")
	iconDir := filepath.Join(fixtureDir, "src", "icons")
	_ = os.MkdirAll(compDir, 0755)
	_ = os.MkdirAll(iconDir, 0755)

	btnCode := "export default function Button() { return <button />; }"
	iconCode := "export default function IconClose() { return <svg />; }"
	_ = os.WriteFile(filepath.Join(compDir, "Button.lite.tsx"), []byte(btnCode), 0644)
	_ = os.WriteFile(filepath.Join(iconDir, "IconClose.lite.tsx"), []byte(iconCode), 0644)
	// Non-.lite.tsx file to ensure it's ignored
	_ = os.WriteFile(filepath.Join(compDir, "Button.tsx"), []byte("const B = () => null;"), 0644)

	sources = github.ScanSourcesFromDir(fixtureDir)
	if len(sources) < 2 {
		t.Fatalf("expected at least 2 sources, got %d: %v", len(sources), sources)
	}
	if sources["Button"] != btnCode {
		t.Errorf("expected Button code %q, got %q", btnCode, sources["Button"])
	}
	if sources["IconClose"] != iconCode {
		t.Errorf("expected IconClose code %q, got %q", iconCode, sources["IconClose"])
	}
}

func TestGitHubPublisher_GetExistingComponentSource_EmptyConfig(t *testing.T) {
	ctx := context.Background()

	// Empty token and repo
	pub := github.NewPublisher("", "", "main")
	src, err := pub.GetExistingComponentSource(ctx, "Button")
	if err != nil {
		t.Fatalf("expected nil error for empty config, got %v", err)
	}
	if src != "" {
		t.Errorf("expected empty string for empty config, got %q", src)
	}

	// Empty repo only
	pubWithToken := github.NewPublisher("some-token", "", "main")
	src, err = pubWithToken.GetExistingComponentSource(ctx, "Button")
	if err != nil {
		t.Fatalf("expected nil error for empty repo, got %v", err)
	}
	if src != "" {
		t.Errorf("expected empty string for empty repo, got %q", src)
	}

	// Invalid repo format
	pubBadRepo := github.NewPublisher("some-token", "invalid-repo-without-slash", "main")
	_, err = pubBadRepo.GetExistingComponentSource(ctx, "Button")
	if err == nil {
		t.Fatalf("expected error for invalid repo format, got nil")
	}
}

func TestGitHubPublisher_Publish_EmptyConfig(t *testing.T) {
	ctx := context.Background()
	pub := github.NewPublisher("", "", "main")

	job := &domain.Job{
		ID: "test-job-empty-cfg",
	}

	// Should skip cleanly without error
	if err := pub.Publish(ctx, job); err != nil {
		t.Fatalf("expected publish with empty config to skip without error, got: %v", err)
	}
}

func TestGitHubPublisher_Publish_PureMitosisAndTokens(t *testing.T) {
	ctx := context.Background()

	var recordedTreeEntries []struct {
		Path    string `json:"path"`
		Mode    string `json:"mode"`
		Type    string `json:"type"`
		Content string `json:"content"`
	}

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		path := r.URL.Path

		switch {
		case r.Method == http.MethodGet && strings.HasPrefix(path, "/repos/owner/repo/git/ref/"):
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"ref": "refs/heads/main",
				"object": map[string]string{
					"sha": "base-sha-123",
				},
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/git/trees":
			body, _ := io.ReadAll(r.Body)
			var payload struct {
				BaseTree string `json:"base_tree"`
				Tree     []struct {
					Path    string `json:"path"`
					Mode    string `json:"mode"`
					Type    string `json:"type"`
					Content string `json:"content"`
				} `json:"tree"`
			}
			_ = json.Unmarshal(body, &payload)
			recordedTreeEntries = payload.Tree
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"sha": "tree-sha-456",
			})
		case r.Method == http.MethodGet && strings.HasPrefix(path, "/repos/owner/repo/git/commits/"):
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"sha": "base-sha-123",
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/git/commits":
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"sha": "commit-sha-789",
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/git/refs":
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"ref": "refs/heads/branch-name",
				"object": map[string]string{
					"sha": "commit-sha-789",
				},
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/pulls":
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"number":   101,
				"html_url": "https://github.com/owner/repo/pull/101",
			})
		default:
			http.NotFound(w, r)
		}
	}))
	defer server.Close()

	pub := github.NewPublisher("mock-token", "owner/repo", "main")
	pub.SetBaseURL(server.URL)

	job := &domain.Job{
		ID: "job-gh-test",
		Document: contracts.FigmaDocument{
			Name: "GitHub Test DS",
			Tokens: []contracts.FigmaToken{
				{
					Name:  "color/primary",
					Type:  "color",
					Value: "#3b82f6",
				},
			},
		},
		Artifacts: []domain.CompiledArtifact{
			{
				Target:   contracts.Framework("mitosis"),
				FileName: "Button.lite.tsx",
				Code:     "export default function Button() { return <button />; }",
			},
			{
				Target:   contracts.Framework("mitosis"),
				FileName: "utils.ts",
				Code:     "export function cn() {}",
				Group:    "components",
			},
			{
				Target:   contracts.Framework("tokens"),
				FileName: "tokens.json",
				Code:     "[\n  {\n    \"name\": \"color/primary\"\n  }\n]",
			},
			{
				Target:   contracts.Framework("tokens"),
				FileName: "theme.css",
				Code:     "@theme {\n  --color-primary: #3b82f6;\n}\n",
			},
			{
				Target:   contracts.Framework("tokens"),
				FileName: "tokens.css",
				Code:     ":root {\n  --color-primary: #3b82f6;\n}\n",
			},
			{
				Target:   contracts.Framework("tokens"),
				FileName: "tokens.ts",
				Code:     "export const tokens = {} as const;\n\nexport type Tokens = typeof tokens;\n",
			},
			{
				Target:   contracts.React,
				FileName: "Button.tsx",
				Code:     "export const Button = () => null;",
			},
		},
	}

	if err := pub.Publish(ctx, job); err != nil {
		t.Fatalf("Publish failed: %v", err)
	}

	if job.PublishResults == nil || job.PublishResults.PullRequestUrl == nil {
		t.Fatalf("expected PR url to be set")
	}
	if *job.PublishResults.PullRequestUrl != "https://github.com/owner/repo/pull/101" {
		t.Errorf("unexpected PR url: %s", *job.PublishResults.PullRequestUrl)
	}

	pathsInTree := make(map[string]string)
	for _, entry := range recordedTreeEntries {
		pathsInTree[entry.Path] = entry.Content
	}

	// Verify expected files committed under src/components and src/tokens
	expectedPaths := []string{
		"src/components/Button.lite.tsx",
		"src/components/utils.ts",
		"src/tokens/tokens.json",
		"src/tokens/theme.css",
		"src/tokens/tokens.css",
		"src/tokens/tokens.ts",
	}
	for _, p := range expectedPaths {
		if _, ok := pathsInTree[p]; !ok {
			t.Errorf("missing expected git tree entry: %s", p)
		}
	}

	// Verify NO target framework files committed
	for p := range pathsInTree {
		if strings.HasPrefix(p, "react/") || strings.HasSuffix(p, ".tsx") && !strings.HasSuffix(p, ".lite.tsx") {
			t.Errorf("forbidden framework entry in git tree: %s", p)
		}
	}
}

func TestGitHubPublisher_IconsDirectoryPlacement(t *testing.T) {
	ctx := context.Background()

	var recordedTreeEntries []struct {
		Path    string `json:"path"`
		Mode    string `json:"mode"`
		Type    string `json:"type"`
		Content string `json:"content"`
	}

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		path := r.URL.Path

		switch {
		case r.Method == http.MethodGet && strings.HasPrefix(path, "/repos/owner/repo/git/ref/"):
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"ref": "refs/heads/main",
				"object": map[string]string{
					"sha": "base-sha-123",
				},
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/git/trees":
			body, _ := io.ReadAll(r.Body)
			var payload struct {
				BaseTree string `json:"base_tree"`
				Tree     []struct {
					Path    string `json:"path"`
					Mode    string `json:"mode"`
					Type    string `json:"type"`
					Content string `json:"content"`
				} `json:"tree"`
			}
			_ = json.Unmarshal(body, &payload)
			recordedTreeEntries = payload.Tree
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"sha": "tree-sha-456",
			})
		case r.Method == http.MethodGet && strings.HasPrefix(path, "/repos/owner/repo/git/commits/"):
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"sha": "base-sha-123",
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/git/commits":
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"sha": "commit-sha-789",
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/git/refs":
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"ref": "refs/heads/branch-name",
				"object": map[string]string{
					"sha": "commit-sha-789",
				},
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/pulls":
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"number":   102,
				"html_url": "https://github.com/owner/repo/pull/102",
			})
		default:
			http.NotFound(w, r)
		}
	}))
	defer server.Close()

	pub := github.NewPublisher("mock-token", "owner/repo", "main")
	pub.SetBaseURL(server.URL)

	job := &domain.Job{
		ID: "job-gh-icons-test",
		Document: contracts.FigmaDocument{
			Name: "Icons Test DS",
		},
		Artifacts: []domain.CompiledArtifact{
			{
				Target:   contracts.Framework("mitosis"),
				FileName: "IconClose.lite.tsx",
				Code:     "export default function IconClose() { return <svg />; }",
				Group:    "icons",
			},
			{
				Target:   contracts.Framework("mitosis"),
				FileName: "Button.lite.tsx",
				Code:     "export default function Button() { return <button />; }",
				Group:    "components",
			},
		},
	}

	if err := pub.Publish(ctx, job); err != nil {
		t.Fatalf("Publish failed: %v", err)
	}

	pathsInTree := make(map[string]string)
	for _, entry := range recordedTreeEntries {
		pathsInTree[entry.Path] = entry.Content
	}

	if _, ok := pathsInTree["src/icons/IconClose.lite.tsx"]; !ok {
		t.Errorf("missing expected tree entry src/icons/IconClose.lite.tsx, found: %v", pathsInTree)
	}

	if _, ok := pathsInTree["src/components/Button.lite.tsx"]; !ok {
		t.Errorf("missing expected tree entry src/components/Button.lite.tsx, found: %v", pathsInTree)
	}
}

func TestGitHubPublisher_UtilsPlacement_Deduplication(t *testing.T) {
	ctx := context.Background()

	var recordedTreeEntries []struct {
		Path    string `json:"path"`
		Mode    string `json:"mode"`
		Type    string `json:"type"`
		Content string `json:"content"`
	}

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		path := r.URL.Path

		switch {
		case r.Method == http.MethodGet && strings.HasPrefix(path, "/repos/owner/repo/git/ref/"):
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"ref": "refs/heads/main",
				"object": map[string]string{
					"sha": "base-sha-123",
				},
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/git/trees":
			body, _ := io.ReadAll(r.Body)
			var payload struct {
				BaseTree string `json:"base_tree"`
				Tree     []struct {
					Path    string `json:"path"`
					Mode    string `json:"mode"`
					Type    string `json:"type"`
					Content string `json:"content"`
				} `json:"tree"`
			}
			_ = json.Unmarshal(body, &payload)
			recordedTreeEntries = payload.Tree
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"sha": "tree-sha-456",
			})
		case r.Method == http.MethodGet && strings.HasPrefix(path, "/repos/owner/repo/git/commits/"):
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"sha": "base-sha-123",
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/git/commits":
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"sha": "commit-sha-789",
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/git/refs":
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"ref": "refs/heads/branch-name",
				"object": map[string]string{
					"sha": "commit-sha-789",
				},
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/pulls":
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"number":   103,
				"html_url": "https://github.com/owner/repo/pull/103",
			})
		default:
			http.NotFound(w, r)
		}
	}))
	defer server.Close()

	pub := github.NewPublisher("mock-token", "owner/repo", "main")
	pub.SetBaseURL(server.URL)

	job := &domain.Job{
		ID: "job-gh-utils-test",
		Document: contracts.FigmaDocument{
			Name: "Utils Test DS",
		},
		Artifacts: []domain.CompiledArtifact{
			{
				Target:   contracts.Framework("mitosis"),
				FileName: "utils.ts",
				Code:     "export function cn() { return ''; }",
				Group:    "components",
			},
			{
				Target:   contracts.Framework("mitosis"),
				FileName: "src/components/utils.ts",
				Code:     "export function cn() { return ''; }",
				Group:    "components",
			},
		},
	}

	if err := pub.Publish(ctx, job); err != nil {
		t.Fatalf("Publish failed: %v", err)
	}

	utilsEntriesCount := 0
	for _, entry := range recordedTreeEntries {
		if entry.Path == "src/components/utils.ts" {
			utilsEntriesCount++
		}
	}
	if utilsEntriesCount != 1 {
		t.Errorf("expected exactly 1 src/components/utils.ts in tree entries, got %d", utilsEntriesCount)
	}
}

func TestGitHubPublisher_DocumentationArtifactsRouting(t *testing.T) {
	ctx := context.Background()

	var recordedTreeEntries []struct {
		Path    string `json:"path"`
		Mode    string `json:"mode"`
		Type    string `json:"type"`
		Content string `json:"content"`
	}

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		path := r.URL.Path

		switch {
		case r.Method == http.MethodGet && strings.HasPrefix(path, "/repos/owner/repo/git/ref/"):
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"ref": "refs/heads/main",
				"object": map[string]string{
					"sha": "base-sha-123",
				},
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/git/trees":
			body, _ := io.ReadAll(r.Body)
			var payload struct {
				BaseTree string `json:"base_tree"`
				Tree     []struct {
					Path    string `json:"path"`
					Mode    string `json:"mode"`
					Type    string `json:"type"`
					Content string `json:"content"`
				} `json:"tree"`
			}
			_ = json.Unmarshal(body, &payload)
			recordedTreeEntries = payload.Tree
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"sha": "tree-sha-456",
			})
		case r.Method == http.MethodGet && strings.HasPrefix(path, "/repos/owner/repo/git/commits/"):
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"sha": "base-sha-123",
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/git/commits":
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"sha": "commit-sha-789",
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/git/refs":
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"ref": "refs/heads/branch-name",
				"object": map[string]string{
					"sha": "commit-sha-789",
				},
			})
		case r.Method == http.MethodPost && path == "/repos/owner/repo/pulls":
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"number":   104,
				"html_url": "https://github.com/owner/repo/pull/104",
			})
		default:
			http.NotFound(w, r)
		}
	}))
	defer server.Close()

	pub := github.NewPublisher("mock-token", "owner/repo", "main")
	pub.SetBaseURL(server.URL)

	tokensDocCode := "# Design Tokens\n"
	indexDocCode := "# Component Catalog\n"
	buttonDocCode := "# Button\n"

	job := &domain.Job{
		ID: "job-gh-docs-test",
		Document: contracts.FigmaDocument{
			Name: "Docs Test DS",
		},
		Artifacts: []domain.CompiledArtifact{
			{
				Target:   contracts.Framework("docs"),
				FileName: "tokens.md",
				Code:     tokensDocCode,
				Group:    "docs",
			},
			{
				Target:   contracts.Framework("docs"),
				FileName: "index.md",
				Code:     indexDocCode,
				Group:    "docs",
			},
			{
				Target:   contracts.Framework("docs"),
				FileName: "button.md",
				Code:     buttonDocCode,
				Group:    "docs",
			},
			// Duplicate entry to test deduplication
			{
				Target:   contracts.Framework("docs"),
				FileName: "button.md",
				Code:     buttonDocCode,
				Group:    "docs",
			},
		},
	}

	if err := pub.Publish(ctx, job); err != nil {
		t.Fatalf("Publish failed: %v", err)
	}

	treePathCounts := make(map[string]int)
	treeContents := make(map[string]string)
	for _, entry := range recordedTreeEntries {
		treePathCounts[entry.Path]++
		treeContents[entry.Path] = entry.Content
	}

	expectedDocs := map[string]string{
		"docs/tokens.md":            tokensDocCode,
		"docs/components/index.md":  indexDocCode,
		"docs/components/button.md": buttonDocCode,
	}

	for expectedPath, expectedContent := range expectedDocs {
		if content, ok := treeContents[expectedPath]; !ok {
			t.Errorf("missing expected doc entry in tree: %s", expectedPath)
		} else if content != expectedContent {
			t.Errorf("unexpected content for %s: got %q, expected %q", expectedPath, content, expectedContent)
		}
		if treePathCounts[expectedPath] != 1 {
			t.Errorf("expected exactly 1 entry in tree for %s, got %d", expectedPath, treePathCounts[expectedPath])
		}
	}
}

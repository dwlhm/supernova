package download_test

import (
	"archive/zip"
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"testing"
	"time"

	"github.com/dwlhm/supernova/apps/api/internal/adapter/memstore"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/publisher/download"
	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func TestDownloadPublisher(t *testing.T) {
	ctx := context.Background()
	store := memstore.New()
	pub := download.NewPublisher(store)

	if pub.Name() != "download" {
		t.Errorf("expected name 'download', got %s", pub.Name())
	}

	mitosisCode := "export default function Button() { return <button>Mitosis</button>; }"
	tokensJSONCode := "[\n  {\n    \"name\": \"color/brand\",\n    \"value\": \"#10b981\"\n  }\n]"
	themeCSSCode := "@theme {\n  --color-brand: #10b981;\n}\n"
	tokensCSSCode := ":root {\n  --color-brand: #10b981;\n}\n"

	job := &domain.Job{
		ID:        "job-abc",
		Status:    contracts.JobStatusPublishing,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Artifacts: []domain.CompiledArtifact{
			{
				Target:   contracts.Framework("figma"),
				FileName: "figma-document.json",
				Code:     `{"name":"Test Doc"}`,
			},
			{
				Target:   contracts.Framework("mitosis"),
				FileName: "Button.lite.tsx",
				Code:     mitosisCode,
			},
			{
				Target:   contracts.Framework("tokens"),
				FileName: "tokens.json",
				Code:     tokensJSONCode,
			},
			{
				Target:   contracts.Framework("tokens"),
				FileName: "theme.css",
				Code:     themeCSSCode,
			},
			{
				Target:   contracts.Framework("tokens"),
				FileName: "tokens.css",
				Code:     tokensCSSCode,
			},
			{
				Target:   contracts.React,
				FileName: "Button.tsx",
				Code:     "const ReactButton = () => null;",
			},
		},
	}

	if err := store.Save(ctx, job); err != nil {
		t.Fatalf("failed to save job: %v", err)
	}

	if err := pub.Publish(ctx, job); err != nil {
		t.Fatalf("Publish failed: %v", err)
	}

	if job.PublishResults == nil || job.PublishResults.DownloadUrl == nil {
		t.Fatalf("expected download url to be set")
	}
	expectedURL := "/v1/jobs/job-abc/download"
	if *job.PublishResults.DownloadUrl != expectedURL {
		t.Errorf("expected %s, got %s", expectedURL, *job.PublishResults.DownloadUrl)
	}

	zipBytes, err := store.GetZip(ctx, "job-abc")
	if err != nil {
		t.Fatalf("failed to get zip from store: %v", err)
	}

	zr, err := zip.NewReader(bytes.NewReader(zipBytes), int64(len(zipBytes)))
	if err != nil {
		t.Fatalf("failed to read zip: %v", err)
	}

	filesInZip := make(map[string]string)
	for _, f := range zr.File {
		rc, err := f.Open()
		if err != nil {
			t.Fatalf("failed to open zip file %s: %v", f.Name, err)
		}
		content, _ := io.ReadAll(rc)
		rc.Close()
		filesInZip[f.Name] = string(content)
	}

	// Verify pure Mitosis and Tailwind CSS artifacts are present under src/
	if content, ok := filesInZip["figma-document.json"]; !ok {
		t.Errorf("missing expected zip entry figma-document.json")
	} else if content != `{"name":"Test Doc"}` {
		t.Errorf("unexpected content for figma-document.json: %s", content)
	}

	if content, ok := filesInZip["src/components/Button.lite.tsx"]; !ok {
		t.Errorf("missing expected zip entry src/components/Button.lite.tsx")
	} else if content != mitosisCode {
		t.Errorf("unexpected content for src/components/Button.lite.tsx: %s", content)
	}

	if content, ok := filesInZip["src/tokens/tokens.json"]; !ok {
		t.Errorf("missing expected zip entry src/tokens/tokens.json")
	} else if content != tokensJSONCode {
		t.Errorf("unexpected content for src/tokens/tokens.json: %s", content)
	}

	if content, ok := filesInZip["src/tokens/theme.css"]; !ok {
		t.Errorf("missing expected zip entry src/tokens/theme.css")
	} else if content != themeCSSCode {
		t.Errorf("unexpected content for src/tokens/theme.css: %s", content)
	}

	if content, ok := filesInZip["src/tokens/tokens.css"]; !ok {
		t.Errorf("missing expected zip entry src/tokens/tokens.css")
	} else if content != tokensCSSCode {
		t.Errorf("unexpected content for src/tokens/tokens.css: %s", content)
	}

	// Verify target framework files (react, vue, svelte, angular) are NOT in the zip
	forbiddenPrefixes := []string{"react/", "svelte/", "vue3/", "vue2/", "angular/"}
	for name := range filesInZip {
		for _, prefix := range forbiddenPrefixes {
			if len(name) >= len(prefix) && name[:len(prefix)] == prefix {
				t.Errorf("forbidden framework directory found in zip: %s", name)
			}
		}
		if name == "Button.tsx" {
			t.Errorf("target framework file found in zip: %s", name)
		}
	}
}

func TestDownloadPublisher_RejectsUnsafeArtifactPaths(t *testing.T) {
	unsafe := []domain.CompiledArtifact{
		{Target: contracts.Mitosis, FileName: "../../../etc/cron.d/x", Code: "x"},
		{Target: contracts.Mitosis, FileName: "components/Card.lite.tsx", Code: "x"},
		{Target: contracts.Mitosis, FileName: "/abs.lite.tsx", Code: "x"},
		{Target: contracts.Mitosis, FileName: "Card.lite.tsx", Group: "../escape", Code: "x"},
		{Target: contracts.Framework("tokens"), FileName: "..", Code: "x"},
		{Target: contracts.Framework("docs"), FileName: "a/../../b.md", Code: "x"},
	}
	for i, art := range unsafe {
		store := memstore.New()
		job := &domain.Job{
			ID:        fmt.Sprintf("job-unsafe-%d", i),
			Status:    contracts.JobStatusPublishing,
			Artifacts: []domain.CompiledArtifact{art},
		}
		if err := store.Save(context.Background(), job); err != nil {
			t.Fatal(err)
		}
		err := download.NewPublisher(store).Publish(context.Background(), job)
		if !errors.Is(err, domain.ErrUnsafeArtifact) {
			t.Errorf("artifact %+v: expected ErrUnsafeArtifact, got %v", art, err)
		}
		if _, zipErr := store.GetZip(context.Background(), job.ID); zipErr == nil {
			t.Errorf("artifact %+v: zip must not be stored when an artifact is unsafe", art)
		}
	}
}

func TestDownloadPublisher_IconsDirectoryPlacement(t *testing.T) {
	ctx := context.Background()
	store := memstore.New()
	pub := download.NewPublisher(store)

	iconCode := "export default function IconSearch() { return <svg>search</svg>; }"
	btnCode := "export default function Button() { return <button>Click</button>; }"

	job := &domain.Job{
		ID:        "job-icons-test",
		Status:    contracts.JobStatusPublishing,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Artifacts: []domain.CompiledArtifact{
			{
				Target:   contracts.Framework("mitosis"),
				FileName: "Button.lite.tsx",
				Code:     btnCode,
				Group:    "components",
			},
			{
				Target:   contracts.Framework("mitosis"),
				FileName: "IconSearch.lite.tsx",
				Code:     iconCode,
				Group:    "icons",
			},
		},
	}

	if err := store.Save(ctx, job); err != nil {
		t.Fatalf("failed to save job: %v", err)
	}

	if err := pub.Publish(ctx, job); err != nil {
		t.Fatalf("Publish failed: %v", err)
	}

	zipBytes, err := store.GetZip(ctx, "job-icons-test")
	if err != nil {
		t.Fatalf("failed to get zip from store: %v", err)
	}

	zr, err := zip.NewReader(bytes.NewReader(zipBytes), int64(len(zipBytes)))
	if err != nil {
		t.Fatalf("failed to read zip: %v", err)
	}

	filesInZip := make(map[string]string)
	for _, f := range zr.File {
		rc, err := f.Open()
		if err != nil {
			t.Fatalf("failed to open zip file %s: %v", f.Name, err)
		}
		content, _ := io.ReadAll(rc)
		rc.Close()
		filesInZip[f.Name] = string(content)
	}

	if content, ok := filesInZip["src/icons/IconSearch.lite.tsx"]; !ok {
		t.Errorf("missing expected zip entry src/icons/IconSearch.lite.tsx")
	} else if content != iconCode {
		t.Errorf("unexpected content for src/icons/IconSearch.lite.tsx: %s", content)
	}

	if content, ok := filesInZip["src/components/Button.lite.tsx"]; !ok {
		t.Errorf("missing expected zip entry src/components/Button.lite.tsx")
	} else if content != btnCode {
		t.Errorf("unexpected content for src/components/Button.lite.tsx: %s", content)
	}
}

func TestDownloadPublisher_UtilsPlacement_Deduplication(t *testing.T) {
	ctx := context.Background()
	store := memstore.New()
	pub := download.NewPublisher(store)

	utilsCode := "export function cn() { return ''; }"

	job := &domain.Job{
		ID:        "job-utils-zip-test",
		Status:    contracts.JobStatusPublishing,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Artifacts: []domain.CompiledArtifact{
			{
				Target:   contracts.Framework("mitosis"),
				FileName: "utils.ts",
				Code:     utilsCode,
				Group:    "components",
			},
			{
				Target:   contracts.Framework("mitosis"),
				FileName: "utils.ts",
				Code:     utilsCode,
				Group:    "components",
			},
		},
	}

	if err := store.Save(ctx, job); err != nil {
		t.Fatalf("failed to save job: %v", err)
	}

	if err := pub.Publish(ctx, job); err != nil {
		t.Fatalf("Publish failed: %v", err)
	}

	zipBytes, err := store.GetZip(ctx, "job-utils-zip-test")
	if err != nil {
		t.Fatalf("failed to get zip from store: %v", err)
	}

	zr, err := zip.NewReader(bytes.NewReader(zipBytes), int64(len(zipBytes)))
	if err != nil {
		t.Fatalf("failed to read zip: %v", err)
	}

	utilsEntryCount := 0
	for _, f := range zr.File {
		if f.Name == "src/components/utils.ts" {
			utilsEntryCount++
		}
	}
	if utilsEntryCount != 1 {
		t.Errorf("expected exactly 1 src/components/utils.ts in zip, got %d", utilsEntryCount)
	}
}

func TestDownloadPublisher_DocumentationArtifactsRouting(t *testing.T) {
	ctx := context.Background()
	store := memstore.New()
	pub := download.NewPublisher(store)

	tokensDocCode := "# Design Tokens\n"
	indexDocCode := "# Component Catalog\n"
	buttonDocCode := "# Button\n"

	job := &domain.Job{
		ID:        "job-docs-zip-test",
		Status:    contracts.JobStatusPublishing,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
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

	if err := store.Save(ctx, job); err != nil {
		t.Fatalf("failed to save job: %v", err)
	}

	if err := pub.Publish(ctx, job); err != nil {
		t.Fatalf("Publish failed: %v", err)
	}

	zipBytes, err := store.GetZip(ctx, "job-docs-zip-test")
	if err != nil {
		t.Fatalf("failed to get zip from store: %v", err)
	}

	zr, err := zip.NewReader(bytes.NewReader(zipBytes), int64(len(zipBytes)))
	if err != nil {
		t.Fatalf("failed to read zip: %v", err)
	}

	filesInZip := make(map[string]string)
	entryCounts := make(map[string]int)
	for _, f := range zr.File {
		entryCounts[f.Name]++
		rc, err := f.Open()
		if err != nil {
			t.Fatalf("failed to open zip file %s: %v", f.Name, err)
		}
		content, _ := io.ReadAll(rc)
		rc.Close()
		filesInZip[f.Name] = string(content)
	}

	expectedDocs := map[string]string{
		"docs/tokens.md":            tokensDocCode,
		"docs/components/index.md":  indexDocCode,
		"docs/components/button.md": buttonDocCode,
	}

	for expectedPath, expectedContent := range expectedDocs {
		content, ok := filesInZip[expectedPath]
		if !ok {
			t.Errorf("missing expected doc path in zip: %s", expectedPath)
		} else if content != expectedContent {
			t.Errorf("unexpected content for %s: got %q, expected %q", expectedPath, content, expectedContent)
		}
		if entryCounts[expectedPath] != 1 {
			t.Errorf("expected exactly 1 entry for %s, got %d", expectedPath, entryCounts[expectedPath])
		}
	}
}

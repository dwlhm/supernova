package http_test

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/dwlhm/supernova/apps/api/internal/adapter/compiler"
	httpAdapter "github.com/dwlhm/supernova/apps/api/internal/adapter/http"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/memstore"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/publisher/download"
	"github.com/dwlhm/supernova/apps/api/internal/core/app"
	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

type e2eMockAuthor struct {
	source string
}

func (m *e2eMockAuthor) AuthorDesignSystem(ctx context.Context, req out.AuthorRequest) (*out.AuthorResult, error) {
	comps := make(map[string]string, len(req.Components))
	for _, comp := range req.Components {
		name := domain.NormalizeComponentName(comp.Name)
		comps[name] = m.source
	}
	return &out.AuthorResult{
		Components: comps,
	}, nil
}

func TestE2E_ExtractionPipelineWithRealCompiler(t *testing.T) {
	// 1. Locate the built Mitosis compiler CLI
	wd, err := os.Getwd()
	if err != nil {
		t.Fatalf("failed to get working dir: %v", err)
	}
	cliPath := filepath.Join(wd, "..", "..", "..", "..", "..", "packages", "mitosis-compiler", "bin", "cli.js")
	if _, err := os.Stat(cliPath); err != nil {
		t.Fatalf("compiler CLI not found at %s: %v", cliPath, err)
	}

	// 2. Wire Hexagonal dependencies
	store := memstore.New()
	compilerAdapter := compiler.NewCLICompiler(cliPath)
	authorMock := &e2eMockAuthor{
		source: `
import { useState } from '@builder.io/mitosis';

export default function Button(props: { text?: string; disabled?: boolean }) {
  const [clicked, setClicked] = useState(false);

  return (
    <button
      disabled={props.disabled}
      onClick={() => setClicked(true)}
      style={{ padding: '8px 16px', background: clicked ? '#10b981' : '#18a0fb', color: '#ffffff' }}
    >
      {props.text || 'Submit'}
    </button>
  );
}
`,
	}
	downloadPub := download.NewPublisher(store)
	service := app.NewService(store, authorMock, compilerAdapter, []out.ArtifactPublisher{downloadPub})
	router := httpAdapter.NewRouter(service, "")
	server := httptest.NewServer(router)
	defer server.Close()

	// 3. Post extraction request to HTTP server
	reqBody := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "E2E Design System",
			Tokens: []contracts.FigmaToken{
				{
					Id:    "token-brand",
					Name:  "color/brand",
					Type:  "color",
					Value: "#18a0fb",
				},
			},
			Components: []contracts.FigmaComponentSpec{
				{
					Id:   "btn-1",
					Name: "Button",
					Node: map[string]any{"width": 120, "height": 40},
				},
			},
		},
		Targets: &[]contracts.Framework{
			contracts.React,
			contracts.Svelte,
			contracts.Vue3,
			contracts.Vue2,
			contracts.Angular,
		},
		Publishers: &[]contracts.PublisherType{
			contracts.Download,
		},
	}

	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		t.Fatalf("failed to marshal request: %v", err)
	}

	postRes, err := http.Post(server.URL+"/v1/extractions", "application/json", bytes.NewReader(jsonBytes))
	if err != nil {
		t.Fatalf("failed to POST extraction: %v", err)
	}
	defer postRes.Body.Close()

	if postRes.StatusCode != http.StatusAccepted {
		t.Fatalf("expected status 202, got %d", postRes.StatusCode)
	}

	var extractionResp contracts.ExtractionResponse
	if err := json.NewDecoder(postRes.Body).Decode(&extractionResp); err != nil {
		t.Fatalf("failed to decode extraction response: %v", err)
	}
	jobID := extractionResp.JobId.String()

	// 4. Poll job status until succeeded
	deadline := time.Now().Add(10 * time.Second)
	var finalJob contracts.JobResponse
	for time.Now().Before(deadline) {
		getRes, err := http.Get(server.URL + "/v1/jobs/" + jobID)
		if err != nil {
			t.Fatalf("polling error: %v", err)
		}
		if getRes.StatusCode != http.StatusOK {
			t.Fatalf("expected status 200 during polling, got %d", getRes.StatusCode)
		}

		var job contracts.JobResponse
		if err := json.NewDecoder(getRes.Body).Decode(&job); err != nil {
			getRes.Body.Close()
			t.Fatalf("failed to decode job: %v", err)
		}
		getRes.Body.Close()

		if job.Status == contracts.JobStatusSucceeded || job.Status == contracts.JobStatusFailed {
			finalJob = job
			break
		}
		time.Sleep(50 * time.Millisecond)
	}

	if finalJob.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected job to succeed, got status: %s (error: %+v)", finalJob.Status, finalJob.Error)
	}

	// 5. Verify published download URL is present
	if finalJob.PublishResults == nil || finalJob.PublishResults.DownloadUrl == nil {
		t.Fatalf("expected download URL in publish results, got nil")
	}

	downloadPath := *finalJob.PublishResults.DownloadUrl
	zipRes, err := http.Get(server.URL + downloadPath)
	if err != nil {
		t.Fatalf("failed to download zip: %v", err)
	}
	defer zipRes.Body.Close()

	if zipRes.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200 for download, got %d", zipRes.StatusCode)
	}

	var zipBuf bytes.Buffer
	if _, err := zipBuf.ReadFrom(zipRes.Body); err != nil {
		t.Fatalf("failed to read zip body: %v", err)
	}

	// 6. Inspect ZIP contents: must contain pure Mitosis component + Tailwind CSS tokens
	zipReader, err := zip.NewReader(bytes.NewReader(zipBuf.Bytes()), int64(zipBuf.Len()))
	if err != nil {
		t.Fatalf("failed to parse zip archive: %v", err)
	}

	filesInZip := make(map[string]bool)
	for _, f := range zipReader.File {
		filesInZip[f.Name] = true
	}

	expectedFiles := []string{
		"src/components/Button.lite.tsx",
		"src/components/utils.ts",
		"src/tokens/tokens.json",
		"src/tokens/theme.css",
		"src/tokens/tokens.css",
		"src/tokens/tokens.ts",
	}

	for _, expected := range expectedFiles {
		if !filesInZip[expected] {
			t.Errorf("missing expected file in zip archive: %s (found: %v)", expected, filesInZip)
		}
	}

	forbiddenPrefixes := []string{
		"react/",
		"svelte/",
		"vue3/",
		"vue2/",
		"angular/",
	}
	for name := range filesInZip {
		for _, prefix := range forbiddenPrefixes {
			if strings.HasPrefix(name, prefix) {
				t.Errorf("found forbidden framework file in zip archive: %s", name)
			}
		}
	}
}

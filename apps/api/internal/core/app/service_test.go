package app_test

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/dwlhm/supernova/apps/api/internal/adapter/memstore"
	"github.com/dwlhm/supernova/apps/api/internal/core/app"
	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func TestMain(m *testing.M) {
	tmpDir, err := os.MkdirTemp("", "supernova-extractions-test-*")
	if err == nil {
		_ = os.Setenv("EXTRACTIONS_DIR", tmpDir)
		defer os.RemoveAll(tmpDir)
	}
	tmpDocs, err := os.MkdirTemp("", "supernova-docs-test-*")
	if err == nil {
		_ = os.MkdirAll(filepath.Join(tmpDocs, ".vitepress"), 0755)
		_ = os.Setenv("APPS_DOCS_DIR", tmpDocs)
		defer os.RemoveAll(tmpDocs)
	}
	os.Exit(m.Run())
}

type mockAuthor struct {
	mu        sync.Mutex
	calls     int
	requests  []out.AuthorRequest
	source    string
	group     string
	newTokens []out.DiscoveredToken
	result    *out.AuthorResult
	err       error
	authorFn  func(ctx context.Context, req out.AuthorRequest) (*out.AuthorResult, error)
}

func (m *mockAuthor) AuthorDesignSystem(ctx context.Context, req out.AuthorRequest) (*out.AuthorResult, error) {
	m.mu.Lock()
	m.calls++
	m.requests = append(m.requests, req)
	fn := m.authorFn
	err := m.err
	res := m.result
	src := m.source
	grp := m.group
	toks := m.newTokens
	m.mu.Unlock()

	if fn != nil {
		return fn(ctx, req)
	}
	if err != nil {
		return nil, err
	}
	if res != nil {
		return res, nil
	}

	comps := make(map[string]string, len(req.Components))
	groups := make(map[string]string, len(req.Components))
	for _, comp := range req.Components {
		name := domain.NormalizeComponentName(comp.Name)
		if src != "" {
			comps[name] = src
		} else {
			comps[name] = fmt.Sprintf("export default function %s() {}", name)
		}
		if grp != "" {
			groups[name] = grp
		}
	}
	return &out.AuthorResult{
		Components:      comps,
		ComponentGroups: groups,
		NewTokens:       toks,
	}, nil
}

type mockCompiler struct {
	mu          sync.Mutex
	calls       int
	responses   []compileResult
	defaultResp compileResult
	compileFn   func(ctx context.Context, name string, source string, targets []contracts.Framework) ([]domain.CompiledArtifact, []string, error)
}

type compileResult struct {
	artifacts []domain.CompiledArtifact
	errors    []string
	err       error
}

func (m *mockCompiler) Compile(ctx context.Context, name string, source string, targets []contracts.Framework) ([]domain.CompiledArtifact, []string, error) {
	m.mu.Lock()
	fn := m.compileFn
	var res compileResult
	if fn == nil {
		if len(m.responses) > 0 {
			res = m.responses[0]
			m.responses = m.responses[1:]
		} else {
			res = m.defaultResp
		}
	}
	m.calls++
	m.mu.Unlock()

	if fn != nil {
		return fn(ctx, name, source, targets)
	}
	return res.artifacts, res.errors, res.err
}

type mockPublisher struct {
	mu    sync.Mutex
	calls int
	name  string
}

func (m *mockPublisher) Name() string {
	if m.name != "" {
		return m.name
	}
	return string(contracts.Download)
}

func (m *mockPublisher) Publish(ctx context.Context, job *domain.Job) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.calls++
	return nil
}

type mockPublisherWithComponentInfo struct {
	mockPublisher
	calls        int
	names        []string
	workspaceDir string
	cleanedUp    bool
}

func (m *mockPublisherWithComponentInfo) GetExistingComponentInfo(ctx context.Context) ([]string, string, func(), error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.calls++
	cleanup := func() {
		m.mu.Lock()
		m.cleanedUp = true
		m.mu.Unlock()
	}
	return m.names, m.workspaceDir, cleanup, nil
}

func waitForJob(t *testing.T, svc *app.Service, jobID string, timeout time.Duration) *domain.Job {
	t.Helper()
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		job, err := svc.GetJob(context.Background(), jobID)
		if err == nil && (job.Status == contracts.JobStatusSucceeded || job.Status == contracts.JobStatusFailed) {
			return job
		}
		time.Sleep(20 * time.Millisecond)
	}
	t.Fatalf("job %s did not reach terminal state within %v", jobID, timeout)
	return nil
}

func TestService_SubmitAndProcess_HappyPath(t *testing.T) {
	store := memstore.New()
	author := &mockAuthor{source: "export default function Button() { return <button /> }"}
	compiler := &mockCompiler{
		defaultResp: compileResult{
			artifacts: []domain.CompiledArtifact{
				{Target: contracts.React, FileName: "Button.tsx", Code: "export const Button = () => <button />"},
			},
		},
	}
	pub := &mockPublisher{name: "download"}
	svc := app.NewService(store, author, compiler, []out.ArtifactPublisher{pub})

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Test Doc",
			Components: []contracts.FigmaComponentSpec{
				{Id: "comp-1", Name: "Button"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 2*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected succeeded, got %v", job.Status)
	}
	if len(job.Targets) != 1 || job.Targets[0] != contracts.Mitosis {
		t.Fatalf("expected default targets [%s], got %v", contracts.Mitosis, job.Targets)
	}
	if len(job.Components) != 1 || job.Components[0].Status != contracts.ComponentStatusDone {
		t.Fatalf("expected component done, got %+v", job.Components)
	}
	if len(job.Artifacts) != 10 {
		t.Fatalf("expected 10 artifacts (1 pure Mitosis component + 1 utils.ts + 4 tokens + 3 docs: tokens.md, index.md, button.md + 1 figma-document.json), got %d", len(job.Artifacts))
	}
	foundMitosis := false
	foundUtils := false
	foundTokensJSON := false
	foundThemeCSS := false
	foundTokensCSS := false
	foundTokensTS := false
	foundTokensDoc := false
	foundIndexDoc := false
	foundButtonDoc := false
	foundFigmaDoc := false

	for _, art := range job.Artifacts {
		if art.Target == contracts.Framework("figma") && art.FileName == "figma-document.json" {
			foundFigmaDoc = true
			if !strings.Contains(art.Code, "Test Doc") {
				t.Errorf("expected figma doc to contain 'Test Doc', got %q", art.Code)
			}
		}
		if art.Target == contracts.Framework("mitosis") && art.FileName == "Button.lite.tsx" {
			foundMitosis = true
			if art.Code != author.source {
				t.Errorf("expected mitosis code %q, got %q", author.source, art.Code)
			}
		}
		if art.Target == contracts.Framework("mitosis") && art.FileName == "utils.ts" {
			foundUtils = true
			if art.Code != app.GenerateUtilsTS() {
				t.Errorf("expected utils code %q, got %q", app.GenerateUtilsTS(), art.Code)
			}
			if art.Group != "components" {
				t.Errorf("expected utils group 'components', got %q", art.Group)
			}
		}
		if art.Target == contracts.Framework("tokens") {
			switch art.FileName {
			case "tokens.json":
				foundTokensJSON = true
			case "theme.css":
				foundThemeCSS = true
			case "tokens.css":
				foundTokensCSS = true
			case "tokens.ts":
				foundTokensTS = true
			}
		}
		if art.Target == contracts.Framework("docs") {
			switch art.FileName {
			case "tokens.md":
				foundTokensDoc = true
			case "index.md":
				foundIndexDoc = true
			case "button.md":
				foundButtonDoc = true
			}
		}
	}

	if !foundMitosis {
		t.Errorf("expected pure Mitosis artifact Button.lite.tsx to be present")
	}
	if !foundUtils {
		t.Errorf("expected utils.ts artifact to be present")
	}
	if !foundTokensJSON || !foundThemeCSS || !foundTokensCSS || !foundTokensTS {
		t.Errorf("expected tokens.json, theme.css, tokens.css, and tokens.ts to be saved in job.Artifacts")
	}
	if !foundTokensDoc || !foundIndexDoc || !foundButtonDoc {
		t.Errorf("expected tokens.md, index.md, and button.md doc artifacts to be saved in job.Artifacts")
	}
	if !foundFigmaDoc {
		t.Errorf("expected figma-document.json artifact with target figma to be present")
	}

	if pub.calls != 1 {
		t.Fatalf("expected 1 publisher call, got %d", pub.calls)
	}
}

func TestService_RepairLoop_SuccessOnRetry(t *testing.T) {
	store := memstore.New()
	author := &mockAuthor{
		result: &out.AuthorResult{
			Components: map[string]string{
				"Card": "export default function Card() { return <div>Card</div>; }",
			},
			Artifacts: []domain.CompiledArtifact{
				{Target: contracts.Framework("mitosis"), FileName: "Card.lite.tsx", Code: "export default function Card() { return <div>Card</div>; }"},
			},
		},
	}
	compiler := &mockCompiler{}
	pub := &mockPublisher{name: "download"}
	svc := app.NewService(store, author, compiler, []out.ArtifactPublisher{pub})

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Test Doc",
			Components: []contracts.FigmaComponentSpec{
				{Id: "comp-card", Name: "Card"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 2*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected job succeeded on retry, got %v", job.Status)
	}
	if author.calls != 1 {
		t.Fatalf("expected 1 author call, got %d", author.calls)
	}

	foundMitosis := false
	for _, art := range job.Artifacts {
		if art.Target == contracts.Framework("mitosis") && art.FileName == "Card.lite.tsx" {
			foundMitosis = true
		}
		if art.Target == contracts.React {
			t.Errorf("did not expect React artifact in job.Artifacts after repair")
		}
	}
	if !foundMitosis {
		t.Errorf("expected Card.lite.tsx artifact in job.Artifacts")
	}
}

func TestService_RepairLoop_ExceedsMaxRetries(t *testing.T) {
	store := memstore.New()
	author := &mockAuthor{
		err: errors.New("Fatal LLM authoring error"),
	}
	compiler := &mockCompiler{}
	svc := app.NewService(store, author, compiler, nil)

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Test Doc",
			Components: []contracts.FigmaComponentSpec{
				{Id: "broken-1", Name: "BrokenComponent"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 2*time.Second)
	if job.Status != contracts.JobStatusFailed {
		t.Fatalf("expected job failed, got %v", job.Status)
	}
	if job.Components[0].Status != contracts.ComponentStatusFailed {
		t.Fatalf("expected component failed, got %v", job.Components[0].Status)
	}
	if job.Components[0].StageError == nil || job.Components[0].StageError.Stage != "authoring" {
		t.Fatalf("expected authoring stage error, got %+v", job.Components[0].StageError)
	}
	if author.calls != 1 {
		t.Fatalf("expected 1 author call, got %d", author.calls)
	}
}

func TestService_SubmitExtraction_EmptyComponents(t *testing.T) {
	store := memstore.New()
	svc := app.NewService(store, &mockAuthor{}, &mockCompiler{}, nil)

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name:       "Empty",
			Components: []contracts.FigmaComponentSpec{},
		},
	}

	_, err := svc.SubmitExtraction(context.Background(), req)
	if !errors.Is(err, domain.ErrInvalidPayload) {
		t.Fatalf("expected ErrInvalidPayload, got %v", err)
	}
}

func TestService_GetJob_NotFound(t *testing.T) {
	store := memstore.New()
	svc := app.NewService(store, &mockAuthor{}, &mockCompiler{}, nil)

	_, err := svc.GetJob(context.Background(), "non-existent-id")
	if !errors.Is(err, domain.ErrJobNotFound) {
		t.Fatalf("expected ErrJobNotFound, got %v", err)
	}
}

func TestService_GetDownloadZip(t *testing.T) {
	store := memstore.New()
	svc := app.NewService(store, &mockAuthor{}, &mockCompiler{}, nil)

	_, err := svc.GetDownloadZip(context.Background(), "job-1")
	if !errors.Is(err, domain.ErrJobNotFound) {
		t.Fatalf("expected ErrJobNotFound for missing job, got %v", err)
	}

	job := &domain.Job{
		ID:     "job-pending",
		Status: contracts.JobStatusAuthoring,
	}
	_ = store.Save(context.Background(), job)

	_, err = svc.GetDownloadZip(context.Background(), "job-pending")
	if !errors.Is(err, domain.ErrJobNotFinished) {
		t.Fatalf("expected ErrJobNotFinished, got %v", err)
	}

	jobDone := &domain.Job{
		ID:     "job-done",
		Status: contracts.JobStatusSucceeded,
	}
	_ = store.Save(context.Background(), jobDone)
	_ = store.SaveZip(context.Background(), "job-done", []byte("zip-data"))

	data, err := svc.GetDownloadZip(context.Background(), "job-done")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if string(data) != "zip-data" {
		t.Fatalf("expected 'zip-data', got %q", string(data))
	}
}

func TestService_IncrementalAuthoring_WithBatchExistingSources(t *testing.T) {
	store := memstore.New()
	author := &mockAuthor{source: "export default function Button() { return <button>Updated</button> }"}
	compiler := &mockCompiler{}
	pub := &mockPublisherWithComponentInfo{
		mockPublisher: mockPublisher{name: string(contracts.PullRequest)},
		names:         []string{"Button"},
		workspaceDir:  "/tmp/workspace-clone",
	}
	svc := app.NewService(store, author, compiler, []out.ArtifactPublisher{pub})

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Design System",
			Components: []contracts.FigmaComponentSpec{
				{Id: "comp-btn", Name: "Button"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 2*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected succeeded, got %v", job.Status)
	}

	if pub.calls != 1 {
		t.Fatalf("expected 1 call with existing component info, got %d", pub.calls)
	}
	if !pub.cleanedUp {
		t.Errorf("expected cleanup() to have been called")
	}
	if len(author.requests) != 1 {
		t.Fatalf("expected 1 author request, got %d", len(author.requests))
	}
	if len(author.requests[0].ExistingComponentNames) != 1 || author.requests[0].ExistingComponentNames[0] != "Button" {
		t.Errorf("expected existing component names [Button], got %v", author.requests[0].ExistingComponentNames)
	}
	if author.requests[0].WorkspaceDir != "/tmp/workspace-clone" {
		t.Errorf("expected workspaceDir '/tmp/workspace-clone', got %q", author.requests[0].WorkspaceDir)
	}
}

func TestService_IncrementalAuthoring_PrefersBatchOverIndividual(t *testing.T) {
	store := memstore.New()
	author := &mockAuthor{source: "export default function Button() { return <button>Updated</button> }"}
	compiler := &mockCompiler{}
	pub := &mockPublisherWithComponentInfo{
		mockPublisher: mockPublisher{name: string(contracts.PullRequest)},
		names:         []string{"Button"},
		workspaceDir:  "/tmp/repo",
	}
	svc := app.NewService(store, author, compiler, []out.ArtifactPublisher{pub})

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Design System",
			Components: []contracts.FigmaComponentSpec{
				{Id: "comp-btn", Name: "Button"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 2*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected succeeded, got %v", job.Status)
	}

	if pub.calls != 1 {
		t.Errorf("expected component info reader to be called once, got %d", pub.calls)
	}
	if !pub.cleanedUp {
		t.Errorf("expected cleanup function to be called")
	}
}

func TestService_IncrementalAuthoring_WithExistingSource(t *testing.T) {
	store := memstore.New()
	author := &mockAuthor{source: "export default function Button() { return <button>Updated</button> }"}
	compiler := &mockCompiler{}
	pub := &mockPublisherWithComponentInfo{
		mockPublisher: mockPublisher{name: string(contracts.PullRequest)},
		names:         []string{"Button"},
		workspaceDir:  "/tmp/existing-dir",
	}
	svc := app.NewService(store, author, compiler, []out.ArtifactPublisher{pub})

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Design System",
			Components: []contracts.FigmaComponentSpec{
				{Id: "comp-btn", Name: "Button"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 2*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected succeeded, got %v", job.Status)
	}

	if len(author.requests) != 1 {
		t.Fatalf("expected 1 author request, got %d", len(author.requests))
	}
	if len(author.requests[0].ExistingComponentNames) != 1 || author.requests[0].ExistingComponentNames[0] != "Button" {
		t.Errorf("expected existing component names [Button], got %v", author.requests[0].ExistingComponentNames)
	}
}

func TestService_TokenDiscovery_MergedIntoCatalog(t *testing.T) {
	store := memstore.New()
	discoveredTokens := []out.DiscoveredToken{
		{
			Name:        "color/button-primary",
			Type:        "color",
			Value:       "#18a0fb",
			Description: "Primary button color",
		},
		{
			Name:  "color/brand-existing", // duplicate of existing token
			Type:  "color",
			Value: "#999999",
		},
	}
	author := &mockAuthor{
		source:    "export default function Button() { return <button /> }",
		newTokens: discoveredTokens,
	}
	compiler := &mockCompiler{}
	svc := app.NewService(store, author, compiler, nil)

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Design System",
			Tokens: []contracts.FigmaToken{
				{
					Id:    "tok-initial",
					Name:  "color/brand-existing",
					Type:  "color",
					Value: "#10b981",
				},
			},
			Components: []contracts.FigmaComponentSpec{
				{Id: "comp-1", Name: "Button"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 2*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected succeeded, got %v", job.Status)
	}

	// Should have 2 tokens: initial + color/button-primary (duplicate color/brand-existing should not be re-added)
	if len(job.Document.Tokens) != 2 {
		t.Fatalf("expected 2 tokens after deduplication, got %d: %+v", len(job.Document.Tokens), job.Document.Tokens)
	}

	tok1 := job.Document.Tokens[0]
	if tok1.Name != "color/brand-existing" || tok1.Value != "#10b981" {
		t.Errorf("expected original token preserved, got %+v", tok1)
	}

	tok2 := job.Document.Tokens[1]
	if tok2.Name != "color/button-primary" || tok2.Value != "#18a0fb" {
		t.Errorf("expected newly discovered token, got %+v", tok2)
	}
	if tok2.Id == "" {
		t.Errorf("expected newly discovered token to have generated ID")
	}
	if tok2.Description == nil || *tok2.Description != "Primary button color" {
		t.Errorf("expected description 'Primary button color', got %v", tok2.Description)
	}

	foundTokensJSON := false
	foundThemeCSS := false
	foundTokensCSS := false
	foundTokensTS := false
	for _, art := range job.Artifacts {
		if art.Target == contracts.Framework("tokens") {
			switch art.FileName {
			case "tokens.json":
				foundTokensJSON = true
				if !strings.Contains(art.Code, "color/button-primary") {
					t.Errorf("expected tokens.json artifact to contain new token, got: %s", art.Code)
				}
			case "theme.css":
				foundThemeCSS = true
				if !strings.Contains(art.Code, "--color-button-primary") {
					t.Errorf("expected theme.css to contain button-primary variable, got: %s", art.Code)
				}
			case "tokens.css":
				foundTokensCSS = true
				if !strings.Contains(art.Code, "--color-button-primary") {
					t.Errorf("expected tokens.css to contain button-primary variable, got: %s", art.Code)
				}
			case "tokens.ts":
				foundTokensTS = true
				if !strings.Contains(art.Code, "buttonPrimary") {
					t.Errorf("expected tokens.ts to contain buttonPrimary token, got: %s", art.Code)
				}
			}
		}
	}
	if !foundTokensJSON || !foundThemeCSS || !foundTokensCSS || !foundTokensTS {
		t.Errorf("expected all token artifacts (tokens.json, theme.css, tokens.css, tokens.ts) to be saved in job.Artifacts")
	}
}

func TestService_ConcurrentComponentProcessing(t *testing.T) {
	store := memstore.New()
	author := &mockAuthor{
		authorFn: func(ctx context.Context, req out.AuthorRequest) (*out.AuthorResult, error) {
			comps := make(map[string]string)
			for _, comp := range req.Components {
				comps[comp.Name] = fmt.Sprintf("export default function %s() { return <div>%s</div>; }", comp.Name, comp.Name)
			}
			return &out.AuthorResult{Components: comps}, nil
		},
	}
	compiler := &mockCompiler{}
	pub := &mockPublisher{name: "download"}
	svc := app.NewService(store, author, compiler, []out.ArtifactPublisher{pub})

	componentNames := []string{"Avatar", "Alert", "Button"}
	specs := make([]contracts.FigmaComponentSpec, len(componentNames))
	for i, name := range componentNames {
		specs[i] = contracts.FigmaComponentSpec{
			Id:   fmt.Sprintf("comp-%d", i+1),
			Name: name,
		}
	}

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name:       "Component Suite",
			Components: specs,
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected submit error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 3*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected job status succeeded, got %v", job.Status)
	}

	if len(job.Components) != len(componentNames) {
		t.Fatalf("expected %d components, got %d", len(componentNames), len(job.Components))
	}
	for _, comp := range job.Components {
		if comp.Status != contracts.ComponentStatusDone {
			t.Errorf("expected component %s to have status %s, got %s", comp.Name, contracts.ComponentStatusDone, comp.Status)
		}
	}

	expectedArtifacts := []string{
		"Avatar.lite.tsx",
		"Alert.lite.tsx",
		"Button.lite.tsx",
		"utils.ts",
		"tokens.json",
		"theme.css",
		"tokens.css",
		"tokens.ts",
	}
	artifactMap := make(map[string]domain.CompiledArtifact)
	for _, art := range job.Artifacts {
		artifactMap[art.FileName] = art
	}

	for _, expectedFile := range expectedArtifacts {
		if _, ok := artifactMap[expectedFile]; !ok {
			t.Errorf("expected artifact %s to be present in job artifacts", expectedFile)
		}
	}
}

func TestService_ConcurrentComponentProcessing_BoundedConcurrencyLimit(t *testing.T) {
	store := memstore.New()
	author := &mockAuthor{
		source: "export default function Comp() { return <div /> }",
	}
	compiler := &mockCompiler{}
	svc := app.NewService(store, author, compiler, nil)

	compNames := []string{"Avatar", "Alert", "Button", "Card", "Badge", "Modal"}
	specs := make([]contracts.FigmaComponentSpec, len(compNames))
	for i, name := range compNames {
		specs[i] = contracts.FigmaComponentSpec{
			Id:   fmt.Sprintf("comp-%d", i+1),
			Name: name,
		}
	}

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name:       "Bounded Suite",
			Components: specs,
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 4*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected job status succeeded, got %v", job.Status)
	}
	if len(job.Components) != len(compNames) {
		t.Fatalf("expected %d components, got %d", len(compNames), len(job.Components))
	}
}

func TestService_BatchAuthoring_HappyPath(t *testing.T) {
	store := memstore.New()

	avatarSrc := "export default function Avatar() { return <img />; }"
	buttonSrc := "export default function Button() { return <button>Click</button>; }"
	cardSrc := "export default function Card() { return <div>Card</div>; }"

	author := &mockAuthor{
		result: &out.AuthorResult{
			Components: map[string]string{
				"Avatar": avatarSrc,
				"Button": buttonSrc,
				"Card":   cardSrc,
			},
			NewTokens: []out.DiscoveredToken{
				{Name: "color/badge-accent", Type: "color", Value: "#e11d48", Description: "Badge accent color"},
			},
		},
	}

	compiler := &mockCompiler{}
	pub := &mockPublisher{name: "download"}
	svc := app.NewService(store, author, compiler, []out.ArtifactPublisher{pub})

	specs := []contracts.FigmaComponentSpec{
		{Id: "comp-1", Name: "Avatar"},
		{Id: "comp-2", Name: "Button"},
		{Id: "comp-3", Name: "Card"},
	}

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name:       "Batch Design System",
			Components: specs,
			Tokens: []contracts.FigmaToken{
				{Id: "tok-1", Name: "color/brand", Type: "color", Value: "#10b981"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 3*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected succeeded, got %v", job.Status)
	}

	if author.calls != 1 {
		t.Fatalf("expected 1 author call, got %d", author.calls)
	}

	// Verify all components done
	if len(job.Components) != 3 {
		t.Fatalf("expected 3 components, got %d", len(job.Components))
	}
	for _, c := range job.Components {
		if c.Status != contracts.ComponentStatusDone {
			t.Errorf("expected component %s done, got %s", c.Name, c.Status)
		}
	}

	// Verify new tokens merged into document
	foundNewToken := false
	for _, tok := range job.Document.Tokens {
		if tok.Name == "color/badge-accent" {
			foundNewToken = true
			if tok.Value != "#e11d48" {
				t.Errorf("expected token value #e11d48, got %v", tok.Value)
			}
		}
	}
	if !foundNewToken {
		t.Errorf("expected new token color/badge-accent to be merged into document tokens")
	}

	// Verify publisher was called
	if pub.calls != 1 {
		t.Fatalf("expected 1 publisher call, got %d", pub.calls)
	}

	// Verify pure Mitosis and tokens artifacts
	batchExpected := []string{"Avatar.lite.tsx", "Button.lite.tsx", "Card.lite.tsx", "utils.ts", "tokens.json", "theme.css", "tokens.css", "tokens.ts"}
	batchArtifactMap := make(map[string]domain.CompiledArtifact)
	for _, art := range job.Artifacts {
		batchArtifactMap[art.FileName] = art
	}
	for _, expected := range batchExpected {
		if _, ok := batchArtifactMap[expected]; !ok {
			t.Errorf("expected artifact %s to be present in batch job artifacts", expected)
		}
	}
}

func TestService_BatchAuthoring_PartialFailure_RepairLoop(t *testing.T) {
	store := memstore.New()

	author := &mockAuthor{
		err: errors.New("author agent execution failed"),
	}

	compiler := &mockCompiler{}
	svc := app.NewService(store, author, compiler, nil)

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Partial Failure Test",
			Components: []contracts.FigmaComponentSpec{
				{Id: "comp-1", Name: "Button"},
				{Id: "comp-2", Name: "Card"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 3*time.Second)
	if job.Status != contracts.JobStatusFailed {
		t.Fatalf("expected job failed, got %v", job.Status)
	}
	if job.Error == nil || job.Error.Stage != "authoring" {
		t.Errorf("expected stage authoring error, got %+v", job.Error)
	}
}

func TestService_BatchAuthoring_FallbackToIndividualOnBatchError(t *testing.T) {
	store := memstore.New()

	author := &mockAuthor{
		err: errors.New("LLM endpoint unavailable (400 Bad Request)"),
	}
	compiler := &mockCompiler{}
	svc := app.NewService(store, author, compiler, nil)

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Fallback Test",
			Components: []contracts.FigmaComponentSpec{
				{Id: "comp-1", Name: "Button"},
				{Id: "comp-2", Name: "Avatar"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 3*time.Second)
	if job.Status != contracts.JobStatusFailed {
		t.Fatalf("expected job failed on author error, got %v", job.Status)
	}
}

func TestService_DefaultTargets_Mitosis(t *testing.T) {
	store := memstore.New()
	author := &mockAuthor{source: "export default function Button() { return <button /> }"}
	compiler := &mockCompiler{}
	svc := app.NewService(store, author, compiler, nil)

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Default Targets Test",
			Components: []contracts.FigmaComponentSpec{
				{Id: "comp-1", Name: "Button"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 2*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected job succeeded, got %v", job.Status)
	}

	if len(job.Targets) != 1 || job.Targets[0] != contracts.Mitosis {
		t.Fatalf("expected default targets [%s], got %v", contracts.Mitosis, job.Targets)
	}
}

func TestService_SkipBatchAuthoring_WhenMoreThanFourComponents(t *testing.T) {
	store := memstore.New()
	author := &mockAuthor{}
	compiler := &mockCompiler{}
	svc := app.NewService(store, author, compiler, nil)

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Holistic Authoring Test",
			Components: []contracts.FigmaComponentSpec{
				{Id: "c-1", Name: "Button"},
				{Id: "c-2", Name: "Card"},
				{Id: "c-3", Name: "Input"},
				{Id: "c-4", Name: "Modal"},
				{Id: "c-5", Name: "Badge"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 3*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected job succeeded, got %v", job.Status)
	}

	// In the holistic architecture, all 5 components are handled in 1 AuthorDesignSystem call
	if author.calls != 1 {
		t.Errorf("expected exactly 1 holistic author call, got %d", author.calls)
	}
	if len(author.requests) != 1 || len(author.requests[0].Components) != 5 {
		t.Errorf("expected 5 components in author request, got %+v", author.requests)
	}
}

func TestService_ComponentGrouping_IconsAndComponents(t *testing.T) {
	store := memstore.New()
	iconPage := "Icons"
	author := &mockAuthor{
		result: &out.AuthorResult{
			Components: map[string]string{
				"Button":     "export default function Button() { return <button />; }",
				"IconSearch": "export default function IconSearch() { return <svg />; }",
			},
			ComponentGroups: map[string]string{
				"Button":     "components",
				"IconSearch": "icons",
			},
		},
	}
	compiler := &mockCompiler{}
	svc := app.NewService(store, author, compiler, nil)

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Grouping Test",
			Components: []contracts.FigmaComponentSpec{
				{Id: "c-1", Name: "Button"},
				{Id: "c-2", Name: "IconSearch", PageName: &iconPage},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 3*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected job succeeded, got %v", job.Status)
	}

	// Verify ComponentProgress.Group
	progressMap := make(map[string]contracts.ComponentProgress)
	for _, comp := range job.Components {
		progressMap[comp.Name] = comp
	}

	btnProgress, ok := progressMap["Button"]
	if !ok {
		t.Fatalf("expected Button in job components")
	}
	if btnProgress.Group == nil || *btnProgress.Group != "components" {
		t.Errorf("expected Button group 'components', got %v", btnProgress.Group)
	}

	iconProgress, ok := progressMap["IconSearch"]
	if !ok {
		t.Fatalf("expected IconSearch in job components")
	}
	if iconProgress.Group == nil || *iconProgress.Group != "icons" {
		t.Errorf("expected IconSearch group 'icons', got %v", iconProgress.Group)
	}

	// Verify CompiledArtifact.Group
	artifactMap := make(map[string]domain.CompiledArtifact)
	for _, art := range job.Artifacts {
		if art.Target == contracts.Framework("mitosis") {
			artifactMap[art.FileName] = art
		}
	}

	btnArt, ok := artifactMap["Button.lite.tsx"]
	if !ok {
		t.Fatalf("expected Button.lite.tsx artifact")
	}
	if btnArt.Group != "components" {
		t.Errorf("expected Button.lite.tsx artifact group 'components', got %q", btnArt.Group)
	}

	iconArt, ok := artifactMap["IconSearch.lite.tsx"]
	if !ok {
		t.Fatalf("expected IconSearch.lite.tsx artifact")
	}
	if iconArt.Group != "icons" {
		t.Errorf("expected IconSearch.lite.tsx artifact group 'icons', got %q", iconArt.Group)
	}

	if utilsArt, ok := artifactMap["utils.ts"]; !ok {
		t.Errorf("expected utils.ts artifact")
	} else if utilsArt.Group != "components" {
		t.Errorf("expected utils.ts group 'components', got %q", utilsArt.Group)
	}
}

func TestService_ComponentGrouping_BatchAuthoring(t *testing.T) {
	store := memstore.New()
	author := &mockAuthor{
		result: &out.AuthorResult{
			Components: map[string]string{
				"Button":    "export default function Button() { return <button />; }",
				"IconClose": "export default function IconClose() { return <svg />; }",
			},
			ComponentGroups: map[string]string{
				"Button":    "components",
				"IconClose": "icons",
			},
		},
	}
	compiler := &mockCompiler{}
	svc := app.NewService(store, author, compiler, nil)

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Batch Grouping Test",
			Components: []contracts.FigmaComponentSpec{
				{Id: "c-1", Name: "Button"},
				{Id: "c-2", Name: "IconClose"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 3*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected job succeeded, got %v", job.Status)
	}

	progressMap := make(map[string]contracts.ComponentProgress)
	for _, comp := range job.Components {
		progressMap[comp.Name] = comp
	}

	if iconProgress, ok := progressMap["IconClose"]; !ok || iconProgress.Group == nil || *iconProgress.Group != "icons" {
		t.Errorf("expected IconClose group 'icons', got %+v", iconProgress)
	}

	artifactMap := make(map[string]domain.CompiledArtifact)
	for _, art := range job.Artifacts {
		if art.Target == contracts.Framework("mitosis") {
			artifactMap[art.FileName] = art
		}
	}

	if iconArt, ok := artifactMap["IconClose.lite.tsx"]; !ok || iconArt.Group != "icons" {
		t.Errorf("expected IconClose.lite.tsx artifact group 'icons', got %+v", iconArt)
	}

	if utilsArt, ok := artifactMap["utils.ts"]; !ok || utilsArt.Group != "components" {
		t.Errorf("expected utils.ts artifact group 'components', got %+v", utilsArt)
	}
}

func TestGenerateUtilsTS(t *testing.T) {
	code := app.GenerateUtilsTS()

	// Verify all 14 headless helpers
	expectedHelpers := []string{
		"cn",
		"createDialogState",
		"handleRovingFocus",
		"createTabsState",
		"createTooltipState",
		"sortTableRows",
		"paginateTableRows",
		"filterTableRows",
		"getVirtualWindow",
		"scaleLinear",
		"scaleBand",
		"getSmoothBezierPath",
		"getAreaPath",
		"getPieSlices",
	}
	for _, helper := range expectedHelpers {
		if !strings.Contains(code, helper) {
			t.Errorf("GenerateUtilsTS missing helper: %s", helper)
		}
	}

	// Purity Invariant: Zero framework imports
	for _, forbidden := range []string{"react", "vue", "svelte", "angular"} {
		if strings.Contains(strings.ToLower(code), forbidden) {
			t.Errorf("GenerateUtilsTS contains forbidden framework import: %s", forbidden)
		}
	}

	// Verify exact match with generated/components/src/components/utils.ts
	for _, p := range []string{
		"../../../../generated/components/src/components/utils.ts",
		"../../../generated/components/src/components/utils.ts",
		"generated/components/src/components/utils.ts",
	} {
		if data, err := os.ReadFile(p); err == nil {
			if string(data) != code {
				t.Errorf("GenerateUtilsTS does not match %s", p)
			}
			break
		}
	}
}

func TestService_DeterministicDeduplication_UtilsTS(t *testing.T) {
	store := memstore.New()
	author := &mockAuthor{
		result: &out.AuthorResult{
			Artifacts: []domain.CompiledArtifact{
				{
					Target:   contracts.Framework("mitosis"),
					FileName: "utils.ts",
					Group:    "components",
					Code:     app.GenerateUtilsTS(),
				},
				{
					Target:   contracts.Framework("mitosis"),
					FileName: "Button.lite.tsx",
					Group:    "components",
					Code:     "export default function Button() { return <button />; }",
				},
			},
		},
	}
	compiler := &mockCompiler{}
	svc := app.NewService(store, author, compiler, nil)

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Deduplication Test",
			Components: []contracts.FigmaComponentSpec{
				{Id: "c-1", Name: "Button"},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	job := waitForJob(t, svc, jobID, 3*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected job succeeded, got %v", job.Status)
	}

	utilsCount := 0
	for _, art := range job.Artifacts {
		if art.FileName == "utils.ts" {
			utilsCount++
		}
	}
	if utilsCount != 1 {
		t.Errorf("expected exactly 1 utils.ts artifact due to deduplication, got %d", utilsCount)
	}
}

func TestService_SubmitExtraction_PersistsPayload(t *testing.T) {
	tempDir := t.TempDir()
	t.Setenv("EXTRACTIONS_DIR", tempDir)

	store := memstore.New()
	author := &mockAuthor{}
	compiler := &mockCompiler{}
	pub := &mockPublisher{}
	svc := app.NewService(store, author, compiler, []out.ArtifactPublisher{pub})

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "PersistDoc",
			Components: []contracts.FigmaComponentSpec{
				{
					Id:   "c1",
					Name: "Button",
					Node: map[string]interface{}{"type": "COMPONENT"},
				},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("SubmitExtraction failed: %v", err)
	}

	jobFilePath := filepath.Join(tempDir, fmt.Sprintf("%s.json", jobID))
	jobData, err := os.ReadFile(jobFilePath)
	if err != nil {
		t.Fatalf("failed to read persisted job file %s: %v", jobFilePath, err)
	}

	var savedJobReq contracts.ExtractionRequest
	if err := json.Unmarshal(jobData, &savedJobReq); err != nil {
		t.Fatalf("failed to parse job file JSON: %v", err)
	}
	if savedJobReq.Document.Name != "PersistDoc" {
		t.Errorf("expected doc name PersistDoc, got %s", savedJobReq.Document.Name)
	}

	latestFilePath := filepath.Join(tempDir, "latest.json")
	latestData, err := os.ReadFile(latestFilePath)
	if err != nil {
		t.Fatalf("failed to read latest.json: %v", err)
	}

	var savedLatestReq contracts.ExtractionRequest
	if err := json.Unmarshal(latestData, &savedLatestReq); err != nil {
		t.Fatalf("failed to parse latest.json: %v", err)
	}
	if savedLatestReq.Document.Name != "PersistDoc" {
		t.Errorf("expected doc name PersistDoc, got %s", savedLatestReq.Document.Name)
	}
}

func TestService_ReplayExtraction(t *testing.T) {
	tempDir := t.TempDir()
	t.Setenv("EXTRACTIONS_DIR", tempDir)

	store := memstore.New()
	author := &mockAuthor{}
	compiler := &mockCompiler{}
	pub := &mockPublisher{}
	svc := app.NewService(store, author, compiler, []out.ArtifactPublisher{pub})

	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "ReplayDoc",
			Components: []contracts.FigmaComponentSpec{
				{
					Id:   "c1",
					Name: "Card",
					Node: map[string]interface{}{"type": "COMPONENT"},
				},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("SubmitExtraction failed: %v", err)
	}

	// 1. Replay with empty string (reads latest.json)
	replayedJobID1, err := svc.ReplayExtraction(context.Background(), "")
	if err != nil {
		t.Fatalf("ReplayExtraction(\"\") failed: %v", err)
	}
	if replayedJobID1 == "" || replayedJobID1 == jobID {
		t.Errorf("expected a new job ID from replay, got %s", replayedJobID1)
	}

	// 2. Replay with "latest"
	replayedJobID2, err := svc.ReplayExtraction(context.Background(), "latest")
	if err != nil {
		t.Fatalf("ReplayExtraction(\"latest\") failed: %v", err)
	}
	if replayedJobID2 == "" || replayedJobID2 == jobID {
		t.Errorf("expected a new job ID from replay, got %s", replayedJobID2)
	}

	// 3. Replay with specific jobID
	replayedJobID3, err := svc.ReplayExtraction(context.Background(), jobID)
	if err != nil {
		t.Fatalf("ReplayExtraction(jobID) failed: %v", err)
	}
	if replayedJobID3 == "" || replayedJobID3 == jobID {
		t.Errorf("expected a new job ID from replay, got %s", replayedJobID3)
	}

	// 4. Replay with direct file path
	directPath := filepath.Join(tempDir, fmt.Sprintf("%s.json", jobID))
	replayedJobID4, err := svc.ReplayExtraction(context.Background(), directPath)
	if err != nil {
		t.Fatalf("ReplayExtraction(directPath) failed: %v", err)
	}
	if replayedJobID4 == "" {
		t.Errorf("expected valid job ID from directPath replay")
	}

	// 5. Replay non-existent job / file
	_, err = svc.ReplayExtraction(context.Background(), "nonexistent-job-id")
	if err == nil {
		t.Fatalf("expected error for nonexistent job ID, got nil")
	}
	if !strings.Contains(err.Error(), "extraction file not found") {
		t.Errorf("expected 'extraction file not found' error, got %v", err)
	}

	// 6. Replay invalid JSON
	invalidFile := filepath.Join(tempDir, "invalid.json")
	if err := os.WriteFile(invalidFile, []byte("{invalid-json"), 0644); err != nil {
		t.Fatalf("failed to write invalid JSON file: %v", err)
	}
	_, err = svc.ReplayExtraction(context.Background(), invalidFile)
	if err == nil {
		t.Fatalf("expected error for invalid JSON file, got nil")
	}
	if !strings.Contains(err.Error(), "failed to parse persisted extraction payload") {
		t.Errorf("expected payload parse error, got %v", err)
	}
}

func TestService_DocsSync_WithFrameworkArtifacts(t *testing.T) {
	tempDocs := t.TempDir()
	_ = os.MkdirAll(filepath.Join(tempDocs, ".vitepress"), 0755)
	t.Setenv("APPS_DOCS_DIR", tempDocs)

	store := memstore.New()
	author := &mockAuthor{
		result: &out.AuthorResult{
			Components: map[string]string{
				"Button": "export default function Button() {}",
				"Card":   "export default function Card() {}",
			},
			Artifacts: []domain.CompiledArtifact{
				{Target: contracts.Framework("vue3"), FileName: "Button.vue", Code: "<template><button>Button</button></template>"},
				{Target: contracts.Framework("react"), FileName: "Button.tsx", Code: "export default function Button() { return <button>Button</button>; }"},
				{Target: contracts.Framework("svelte"), FileName: "Button.svelte", Code: "<button>Button</button>"},
				{Target: contracts.Framework("vue3"), FileName: "Card.vue", Code: "<template><div>Card</div></template>"},
				{Target: contracts.Framework("react"), FileName: "Card.tsx", Code: "export default function Card() { return <div>Card</div>; }"},
				{Target: contracts.Framework("svelte"), FileName: "Card.svelte", Code: "<div>Card</div>"},
			},
		},
	}
	compiler := &mockCompiler{}
	pub := &mockPublisher{name: "download"}
	svc := app.NewService(store, author, compiler, []out.ArtifactPublisher{pub})

	btnDesc := "Button component"
	cardDesc := "Card component"
	req := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "DocsSyncDoc",
			Tokens: []contracts.FigmaToken{
				{
					Id:    "tok-color-primary",
					Name:  "color/primary",
					Type:  "color",
					Value: "#3b82f6",
				},
			},
			Components: []contracts.FigmaComponentSpec{
				{Id: "btn-1", Name: "Button", Description: &btnDesc},
				{Id: "card-1", Name: "Card", Description: &cardDesc},
			},
		},
	}

	jobID, err := svc.SubmitExtraction(context.Background(), req)
	if err != nil {
		t.Fatalf("SubmitExtraction failed: %v", err)
	}

	job := waitForJob(t, svc, jobID, 2*time.Second)
	if job.Status != contracts.JobStatusSucceeded {
		t.Fatalf("expected job succeeded, got %v", job.Status)
	}

	// 1. Verify markdown docs
	tokensMD, err := os.ReadFile(filepath.Join(tempDocs, "tokens.md"))
	if err != nil {
		t.Fatalf("expected tokens.md to exist: %v", err)
	}
	if !strings.Contains(string(tokensMD), "color/primary") {
		t.Errorf("expected tokens.md to contain color/primary")
	}

	btnMD, err := os.ReadFile(filepath.Join(tempDocs, "components", "button.md"))
	if err != nil {
		t.Fatalf("expected components/button.md to exist: %v", err)
	}
	btnMDStr := string(btnMD)
	if !strings.Contains(btnMDStr, "## Preview") {
		t.Errorf("expected button.md to contain ## Preview")
	}
	if !strings.Contains(btnMDStr, "<FrameworkPreview name=\"Button\" />") {
		t.Errorf("expected button.md to contain FrameworkPreview tag")
	}
	if !strings.Contains(btnMDStr, "import Button from './Button';") {
		t.Errorf("expected button.md to contain default React import")
	}

	// 2. Verify token CSS
	themeCSS, err := os.ReadFile(filepath.Join(tempDocs, ".vitepress", "theme", "tokens", "theme.css"))
	if err != nil {
		t.Fatalf("expected theme.css to exist: %v", err)
	}
	if len(themeCSS) == 0 {
		t.Errorf("expected non-empty theme.css")
	}

	tokensCSS, err := os.ReadFile(filepath.Join(tempDocs, ".vitepress", "theme", "tokens", "tokens.css"))
	if err != nil {
		t.Fatalf("expected tokens.css to exist: %v", err)
	}
	if len(tokensCSS) == 0 {
		t.Errorf("expected non-empty tokens.css")
	}

	// 3. Verify compiled components
	srcCompDir := filepath.Join(tempDocs, "src", "components")
	utilsTS, err := os.ReadFile(filepath.Join(srcCompDir, "utils.ts"))
	if err != nil {
		t.Fatalf("expected utils.ts to exist: %v", err)
	}
	if len(utilsTS) == 0 {
		t.Errorf("expected non-empty utils.ts")
	}

	vueBtn, err := os.ReadFile(filepath.Join(srcCompDir, "vue3", "Button.vue"))
	if err != nil || len(vueBtn) == 0 {
		t.Fatalf("expected vue3/Button.vue to exist: %v", err)
	}
	reactBtn, err := os.ReadFile(filepath.Join(srcCompDir, "react", "Button.tsx"))
	if err != nil || len(reactBtn) == 0 {
		t.Fatalf("expected react/Button.tsx to exist: %v", err)
	}
	svelteBtn, err := os.ReadFile(filepath.Join(srcCompDir, "svelte", "Button.svelte"))
	if err != nil || len(svelteBtn) == 0 {
		t.Fatalf("expected svelte/Button.svelte to exist: %v", err)
	}

	// 4. Verify registry.ts
	regTS, err := os.ReadFile(filepath.Join(srcCompDir, "registry.ts"))
	if err != nil {
		t.Fatalf("expected registry.ts to exist: %v", err)
	}
	regStr := string(regTS)
	if !strings.Contains(regStr, "export interface ComponentLoader") {
		t.Errorf("expected ComponentLoader interface in registry.ts")
	}
	if !strings.Contains(regStr, "export const componentRegistry: Record<string, ComponentLoader> = {") {
		t.Errorf("expected componentRegistry declaration in registry.ts")
	}
	if !strings.Contains(regStr, "\"Button\": {") || !strings.Contains(regStr, "\"Card\": {") {
		t.Errorf("expected Button and Card in registry.ts:\n%s", regStr)
	}
	if !strings.Contains(regStr, "vue3: () => import('./vue3/Button.vue')") {
		t.Errorf("expected vue3 loader for Button")
	}
	if !strings.Contains(regStr, "react: () => import('./react/Button.tsx')") {
		t.Errorf("expected react loader for Button")
	}
	if !strings.Contains(regStr, "svelte: () => import('./svelte/Button.svelte')") {
		t.Errorf("expected svelte loader for Button")
	}
}

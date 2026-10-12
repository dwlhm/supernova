package http_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	httpadapter "github.com/dwlhm/supernova/apps/api/internal/adapter/http"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/memstore"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/publisher/download"
	"github.com/dwlhm/supernova/apps/api/internal/core/app"
	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func TestMain(m *testing.M) {
	tmpDir, err := os.MkdirTemp("", "supernova-extractions-http-test-*")
	if err == nil {
		_ = os.Setenv("EXTRACTIONS_DIR", tmpDir)
		defer os.RemoveAll(tmpDir)
	}
	os.Exit(m.Run())
}

type mockAuthor struct{}

func (m *mockAuthor) AuthorDesignSystem(ctx context.Context, req out.AuthorRequest) (*out.AuthorResult, error) {
	comps := make(map[string]string, len(req.Components))
	var artifacts []domain.CompiledArtifact
	for _, comp := range req.Components {
		name := domain.NormalizeComponentName(comp.Name)
		code := "export default function " + name + "() {}"
		comps[name] = code
		artifacts = append(artifacts, domain.CompiledArtifact{
			Target:   contracts.Framework("mitosis"),
			FileName: name + ".lite.tsx",
			Code:     code,
			Group:    "components",
		})
	}
	return &out.AuthorResult{
		Components: comps,
		Artifacts:  artifacts,
	}, nil
}

type mockCompiler struct{}

func (m *mockCompiler) Compile(ctx context.Context, compName string, src string, targets []contracts.Framework) ([]domain.CompiledArtifact, []string, error) {
	return []domain.CompiledArtifact{
		{
			Target:   contracts.React,
			FileName: compName + ".tsx",
			Code:     src,
		},
	}, nil, nil
}

func setupTestServer() (http.Handler, *memstore.MemoryStore) {
	store := memstore.New()
	author := &mockAuthor{}
	comp := &mockCompiler{}
	downloadPub := download.NewPublisher(store)
	svc := app.NewService(store, author, comp, []out.ArtifactPublisher{downloadPub})
	router := httpadapter.NewRouter(svc, "secret-token")
	return router, store
}

func TestHealthEndpoint(t *testing.T) {
	router, _ := setupTestServer()

	req := httptest.NewRequest(http.MethodGet, "/v1/health", nil)
	rec := httptest.NewRecorder()

	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}

	var resp contracts.HealthResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if resp.Status != "ok" {
		t.Errorf("expected status 'ok', got %s", resp.Status)
	}
}

func TestAuthMiddleware(t *testing.T) {
	router, _ := setupTestServer()

	// Missing auth header
	req := httptest.NewRequest(http.MethodPost, "/v1/extractions", bytes.NewReader([]byte("{}")))
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 for missing auth, got %d", rec.Code)
	}

	// Invalid auth header
	req = httptest.NewRequest(http.MethodPost, "/v1/extractions", bytes.NewReader([]byte("{}")))
	req.Header.Set("Authorization", "Bearer wrong-token")
	rec = httptest.NewRecorder()
	router.ServeHTTP(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 for wrong token, got %d", rec.Code)
	}
}

func TestSubmitAndGetJob(t *testing.T) {
	router, store := setupTestServer()

	extractReq := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Design System",
			Components: []contracts.FigmaComponentSpec{
				{
					Id:   "comp-1",
					Name: "Button",
					Node: map[string]interface{}{"type": "COMPONENT"},
				},
			},
		},
	}
	body, _ := json.Marshal(extractReq)

	req := httptest.NewRequest(http.MethodPost, "/v1/extractions", bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer secret-token")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusAccepted {
		t.Fatalf("expected 202 Accepted, got %d (body: %s)", rec.Code, rec.Body.String())
	}

	var extResp contracts.ExtractionResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &extResp); err != nil {
		t.Fatalf("failed to parse extraction response: %v", err)
	}
	jobID := extResp.JobId.String()

	// Get Job endpoint
	getReq := httptest.NewRequest(http.MethodGet, "/v1/jobs/"+jobID, nil)
	getReq.Header.Set("Authorization", "Bearer secret-token")
	getRec := httptest.NewRecorder()
	router.ServeHTTP(getRec, getReq)

	if getRec.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d", getRec.Code)
	}

	var jobResp contracts.JobResponse
	if err := json.Unmarshal(getRec.Body.Bytes(), &jobResp); err != nil {
		t.Fatalf("failed to parse job response: %v", err)
	}
	if jobResp.JobId != jobID {
		t.Errorf("expected job id %s, got %s", jobID, jobResp.JobId)
	}
	if len(jobResp.Targets) != 1 || jobResp.Targets[0] != contracts.Mitosis {
		t.Errorf("expected targets [%s], got %v", contracts.Mitosis, jobResp.Targets)
	}

	// Download zip before succeeded should return 409
	dlReq := httptest.NewRequest(http.MethodGet, "/v1/jobs/"+jobID+"/download", nil)
	dlReq.Header.Set("Authorization", "Bearer secret-token")
	dlRec := httptest.NewRecorder()
	router.ServeHTTP(dlRec, dlReq)
	if dlRec.Code != http.StatusConflict && dlRec.Code != http.StatusNotFound {
		t.Errorf("expected 409 Conflict or 404 for unready job, got %d", dlRec.Code)
	}

	// Mock completed job in store
	_ = store.UpdateStatus(context.Background(), jobID, contracts.JobStatusSucceeded, nil)
	_ = store.SaveZip(context.Background(), jobID, []byte("mock-zip-content"))

	dlRec = httptest.NewRecorder()
	router.ServeHTTP(dlRec, dlReq)
	if dlRec.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for download, got %d", dlRec.Code)
	}
	if dlRec.Body.String() != "mock-zip-content" {
		t.Errorf("unexpected body %s", dlRec.Body.String())
	}
}

func TestCORSPreflight(t *testing.T) {
	router, _ := setupTestServer()

	req := httptest.NewRequest(http.MethodOptions, "/v1/extractions", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("expected 204 No Content for OPTIONS, got %d", rec.Code)
	}
	if rec.Header().Get("Access-Control-Allow-Origin") != "*" {
		t.Errorf("expected Access-Control-Allow-Origin: *")
	}
}

func TestReplayExtractionEndpoint(t *testing.T) {
	tempDir := t.TempDir()
	t.Setenv("EXTRACTIONS_DIR", tempDir)

	router, _ := setupTestServer()

	// 1. Replay when no extraction exists returns 404
	replayReq := httptest.NewRequest(http.MethodPost, "/v1/extractions/replay", bytes.NewReader([]byte("{}")))
	replayReq.Header.Set("Authorization", "Bearer secret-token")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, replayReq)

	if rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404 Not Found when no extraction exists, got %d (body: %s)", rec.Code, rec.Body.String())
	}

	// 2. Submit initial extraction
	extractReq := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Replay Test Design System",
			Components: []contracts.FigmaComponentSpec{
				{
					Id:   "comp-1",
					Name: "Button",
					Node: map[string]interface{}{"type": "COMPONENT"},
				},
			},
		},
	}
	body, _ := json.Marshal(extractReq)

	subReq := httptest.NewRequest(http.MethodPost, "/v1/extractions", bytes.NewReader(body))
	subReq.Header.Set("Authorization", "Bearer secret-token")
	subRec := httptest.NewRecorder()
	router.ServeHTTP(subRec, subReq)

	if subRec.Code != http.StatusAccepted {
		t.Fatalf("expected 202 Accepted on submit, got %d", subRec.Code)
	}

	var extResp contracts.ExtractionResponse
	if err := json.Unmarshal(subRec.Body.Bytes(), &extResp); err != nil {
		t.Fatalf("failed to parse extraction response: %v", err)
	}
	initialJobID := extResp.JobId.String()

	// 3. Replay latest (empty body) -> 202 Accepted
	replayLatestReq := httptest.NewRequest(http.MethodPost, "/v1/extractions/replay", bytes.NewReader([]byte("{}")))
	replayLatestReq.Header.Set("Authorization", "Bearer secret-token")
	replayLatestRec := httptest.NewRecorder()
	router.ServeHTTP(replayLatestRec, replayLatestReq)

	if replayLatestRec.Code != http.StatusAccepted {
		t.Fatalf("expected 202 Accepted on replay latest, got %d (body: %s)", replayLatestRec.Code, replayLatestRec.Body.String())
	}

	var replayResp contracts.ExtractionResponse
	if err := json.Unmarshal(replayLatestRec.Body.Bytes(), &replayResp); err != nil {
		t.Fatalf("failed to parse replay response: %v", err)
	}
	if replayResp.JobId.String() == "" || replayResp.JobId.String() == initialJobID {
		t.Errorf("expected new job ID from replay, got %s", replayResp.JobId.String())
	}

	// 4. Replay by specific JobID in JSON payload -> 202 Accepted
	replayPayload, _ := json.Marshal(map[string]string{"jobId": initialJobID})
	replayByIDReq := httptest.NewRequest(http.MethodPost, "/v1/extractions/replay", bytes.NewReader(replayPayload))
	replayByIDReq.Header.Set("Authorization", "Bearer secret-token")
	replayByIDRec := httptest.NewRecorder()
	router.ServeHTTP(replayByIDRec, replayByIDReq)

	if replayByIDRec.Code != http.StatusAccepted {
		t.Fatalf("expected 202 Accepted on replay by jobId, got %d (body: %s)", replayByIDRec.Code, replayByIDRec.Body.String())
	}

	// 5. Replay with nonexistent JobID -> 404 Not Found
	nonexistentPayload, _ := json.Marshal(map[string]string{"jobId": "unknown-job-id"})
	nonexistentReq := httptest.NewRequest(http.MethodPost, "/v1/extractions/replay", bytes.NewReader(nonexistentPayload))
	nonexistentReq.Header.Set("Authorization", "Bearer secret-token")
	nonexistentRec := httptest.NewRecorder()
	router.ServeHTTP(nonexistentRec, nonexistentReq)

	if nonexistentRec.Code != http.StatusNotFound {
		t.Fatalf("expected 404 Not Found for nonexistent jobId, got %d", nonexistentRec.Code)
	}

	// 6. Method not allowed for GET /v1/extractions/replay
	getReplayReq := httptest.NewRequest(http.MethodGet, "/v1/extractions/replay", nil)
	getReplayReq.Header.Set("Authorization", "Bearer secret-token")
	getReplayRec := httptest.NewRecorder()
	router.ServeHTTP(getReplayRec, getReplayReq)

	if getReplayRec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405 Method Not Allowed for GET, got %d", getReplayRec.Code)
	}
}

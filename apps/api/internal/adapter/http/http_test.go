package http_test

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	httpadapter "github.com/dwlhm/supernova/apps/api/internal/adapter/http"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/memstore"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/publisher/download"
	"github.com/dwlhm/supernova/apps/api/internal/core/app"
	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

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

func setupTestServer(t *testing.T) (http.Handler, *memstore.MemoryStore) {
	t.Helper()
	store := memstore.New()
	author := &mockAuthor{}
	downloadPub := download.NewPublisher(store)
	svc := app.NewService(store, author, []out.ArtifactPublisher{downloadPub}, app.Paths{ExtractionsDir: t.TempDir()})
	router := httpadapter.NewRouter(svc, "secret-token")
	return router, store
}

func TestHealthEndpoint(t *testing.T) {
	router, _ := setupTestServer(t)

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
	router, _ := setupTestServer(t)

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
	router, store := setupTestServer(t)

	extractReq := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Design System",
			Components: []contracts.FigmaComponentSpec{
				{
					Id:   "comp-1",
					Name: "Button",
					Node: contracts.FigmaSceneNode{Id: "comp-1", Name: "Button", Type: "COMPONENT"},
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
	router, _ := setupTestServer(t)

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
	router, _ := setupTestServer(t)

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
					Node: contracts.FigmaSceneNode{Id: "comp-1", Name: "Button", Type: "COMPONENT"},
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

	// 5. Unknown but well-formed job ID -> 404; paths, non-UUIDs and malformed JSON -> 400
	for body, want := range map[string]int{
		`{"jobId":"00000000-0000-0000-0000-000000000000"}`: http.StatusNotFound,
		`{"jobId":"unknown-job-id"}`:                       http.StatusBadRequest,
		`{"jobId":"../../.env.json"}`:                      http.StatusBadRequest,
		`{"jobId":"/etc/passwd"}`:                          http.StatusBadRequest,
		`{"jobId":`:                                        http.StatusBadRequest,
	} {
		req := httptest.NewRequest(http.MethodPost, "/v1/extractions/replay", bytes.NewReader([]byte(body)))
		req.Header.Set("Authorization", "Bearer secret-token")
		rec := httptest.NewRecorder()
		router.ServeHTTP(rec, req)
		if rec.Code != want {
			t.Errorf("replay %s: expected %d, got %d (body: %s)", body, want, rec.Code, rec.Body.String())
		}
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

func TestAuthMiddleware_RejectsWrongOrMalformedTokens(t *testing.T) {
	router, _ := setupTestServer(t)
	cases := map[string]int{
		"":                     http.StatusUnauthorized,
		"secret-token":         http.StatusUnauthorized,
		"Bearer ":              http.StatusUnauthorized,
		"Bearer secret-toke":   http.StatusUnauthorized,
		"Bearer secret-token!": http.StatusUnauthorized,
		"Basic secret-token":   http.StatusUnauthorized,
		"Bearer secret-token":  http.StatusNotFound,
	}
	for header, want := range cases {
		req := httptest.NewRequest(http.MethodGet, "/v1/jobs/00000000-0000-0000-0000-000000000000", nil)
		if header != "" {
			req.Header.Set("Authorization", header)
		}
		rec := httptest.NewRecorder()
		router.ServeHTTP(rec, req)
		if rec.Code != want {
			t.Errorf("Authorization %q: expected %d, got %d", header, want, rec.Code)
		}
	}
}

func TestHandleJobEvents_SSEStream(t *testing.T) {
	router, _ := setupTestServer(t)

	// 1. Submit extraction
	extReq := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "SSE Test",
			Components: []contracts.FigmaComponentSpec{
				{Id: "btn-1", Name: "Button"},
			},
		},
	}
	body, _ := json.Marshal(extReq)
	req := httptest.NewRequest(http.MethodPost, "/v1/extractions", bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer secret-token")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusAccepted {
		t.Fatalf("expected 202 Accepted, got %d", rec.Code)
	}

	var extResp contracts.ExtractionResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &extResp); err != nil {
		t.Fatalf("failed to unmarshal extraction response: %v", err)
	}

	// 2. Connect to SSE events
	eventsReq := httptest.NewRequest(http.MethodGet, "/v1/jobs/"+extResp.JobId.String()+"/events", nil)
	eventsReq.Header.Set("Authorization", "Bearer secret-token")
	eventsRec := httptest.NewRecorder()
	router.ServeHTTP(eventsRec, eventsReq)

	if eventsRec.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for SSE, got %d", eventsRec.Code)
	}
	contentType := eventsRec.Header().Get("Content-Type")
	if contentType != "text/event-stream" {
		t.Errorf("expected text/event-stream, got %q", contentType)
	}

	// 3. 404 for non-existent job
	badReq := httptest.NewRequest(http.MethodGet, "/v1/jobs/00000000-0000-0000-0000-000000000000/events", nil)
	badReq.Header.Set("Authorization", "Bearer secret-token")
	badRec := httptest.NewRecorder()
	router.ServeHTTP(badRec, badReq)
	if badRec.Code != http.StatusNotFound {
		t.Errorf("expected 404 for unknown job, got %d", badRec.Code)
	}
}

func TestSubmitSyncAndApply(t *testing.T) {
	router, _ := setupTestServer(t)

	syncReq := contracts.SyncRequest{
		Document: contracts.FigmaDocument{
			Name: "HTTP Test Design System",
			Components: []contracts.FigmaComponentSpec{
				{
					Id:   "comp-btn",
					Name: "Button",
					Node: contracts.FigmaSceneNode{Id: "n-btn", Name: "Button", Type: "FRAME"},
				},
			},
			Tokens: []contracts.FigmaToken{
				{Id: "tok-1", Name: "color.primary", Type: "color", Value: "#e55514"},
			},
		},
	}

	bodyBytes, _ := json.Marshal(syncReq)

	// 1. First sync -> expect 1 new component
	req := httptest.NewRequest(http.MethodPost, "/v1/syncs", bytes.NewReader(bodyBytes))
	req.Header.Set("Authorization", "Bearer secret-token")
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 for submit sync, got %d: %s", rec.Code, rec.Body.String())
	}

	var planResp contracts.SyncPlanResponse
	if err := json.NewDecoder(rec.Body).Decode(&planResp); err != nil {
		t.Fatalf("failed to decode sync plan: %v", err)
	}

	if planResp.Summary.New != 1 || planResp.Summary.Unchanged != 0 {
		t.Fatalf("expected 1 new component, got: %+v", planResp.Summary)
	}

	// 2. Apply sync plan -> expect 202 Accepted
	applyURL := fmt.Sprintf("/v1/syncs/%s/apply", planResp.SyncId)
	applyReq := httptest.NewRequest(http.MethodPost, applyURL, nil)
	applyReq.Header.Set("Authorization", "Bearer secret-token")
	applyRec := httptest.NewRecorder()
	router.ServeHTTP(applyRec, applyReq)

	if applyRec.Code != http.StatusAccepted {
		t.Fatalf("expected 202 for apply sync, got %d: %s", applyRec.Code, applyRec.Body.String())
	}

	var extResp contracts.ExtractionResponse
	if err := json.NewDecoder(applyRec.Body).Decode(&extResp); err != nil {
		t.Fatalf("failed to decode extraction response: %v", err)
	}

	// Wait for background job to finish
	time.Sleep(100 * time.Millisecond)

	// 3. Second sync with identical document -> expect 0 new, 1 unchanged!
	req2 := httptest.NewRequest(http.MethodPost, "/v1/syncs", bytes.NewReader(bodyBytes))
	req2.Header.Set("Authorization", "Bearer secret-token")
	req2.Header.Set("Content-Type", "application/json")
	rec2 := httptest.NewRecorder()
	router.ServeHTTP(rec2, req2)

	if rec2.Code != http.StatusOK {
		t.Fatalf("expected 200 for second sync, got %d: %s", rec2.Code, rec2.Body.String())
	}

	var planResp2 contracts.SyncPlanResponse
	if err := json.NewDecoder(rec2.Body).Decode(&planResp2); err != nil {
		t.Fatalf("failed to decode second sync plan: %v", err)
	}

	if planResp2.Summary.New != 0 || planResp2.Summary.Unchanged != 1 {
		t.Fatalf("expected 0 new and 1 unchanged on identical second sync, got: %+v", planResp2.Summary)
	}
	if planResp2.Components[0].Status != contracts.Unchanged {
		t.Errorf("expected component status unchanged, got %s", planResp2.Components[0].Status)
	}

	// 4. Apply second sync plan -> should succeed immediately using unchanged snapshot
	applyURL2 := fmt.Sprintf("/v1/syncs/%s/apply", planResp2.SyncId)
	applyReq2 := httptest.NewRequest(http.MethodPost, applyURL2, nil)
	applyReq2.Header.Set("Authorization", "Bearer secret-token")
	applyRec2 := httptest.NewRecorder()
	router.ServeHTTP(applyRec2, applyReq2)

	if applyRec2.Code != http.StatusAccepted {
		t.Fatalf("expected 202 for second apply sync, got %d: %s", applyRec2.Code, applyRec2.Body.String())
	}
}

func TestReplaySyncEndpoint(t *testing.T) {
	router, _ := setupTestServer(t)

	// 1. Replay when no extraction exists returns 404
	replayReq := httptest.NewRequest(http.MethodPost, "/v1/syncs/replay", bytes.NewReader([]byte("{}")))
	replayReq.Header.Set("Authorization", "Bearer secret-token")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, replayReq)

	if rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404 Not Found when no extraction exists, got %d", rec.Code)
	}

	// 2. Submit initial extraction to persist latest.json
	extractReq := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name: "Replay Sync DS",
			Components: []contracts.FigmaComponentSpec{
				{
					Id:   "comp-replay-1",
					Name: "Button",
					Node: contracts.FigmaSceneNode{Id: "comp-replay-1", Name: "Button", Type: "COMPONENT"},
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

	// 3. Call POST /v1/syncs/replay with empty body (defaults to latest)
	replayLatestReq := httptest.NewRequest(http.MethodPost, "/v1/syncs/replay", bytes.NewReader([]byte("{}")))
	replayLatestReq.Header.Set("Authorization", "Bearer secret-token")
	replayLatestRec := httptest.NewRecorder()
	router.ServeHTTP(replayLatestRec, replayLatestReq)

	if replayLatestRec.Code != http.StatusOK {
		t.Fatalf("expected 200 OK on replay sync latest, got %d: %s", replayLatestRec.Code, replayLatestRec.Body.String())
	}

	var planResp contracts.SyncPlanResponse
	if err := json.Unmarshal(replayLatestRec.Body.Bytes(), &planResp); err != nil {
		t.Fatalf("failed to decode replay sync plan: %v", err)
	}

	if planResp.DocumentName != "Replay Sync DS" {
		t.Errorf("expected doc name 'Replay Sync DS', got %s", planResp.DocumentName)
	}
	if planResp.Summary.Total != 1 {
		t.Errorf("expected total 1 component, got %d", planResp.Summary.Total)
	}
	if planResp.SyncId == "" {
		t.Fatalf("expected non-empty sync ID")
	}

	// 4. Apply the sync plan obtained from replay
	applyURL := fmt.Sprintf("/v1/syncs/%s/apply", planResp.SyncId)
	applyReq := httptest.NewRequest(http.MethodPost, applyURL, nil)
	applyReq.Header.Set("Authorization", "Bearer secret-token")
	applyRec := httptest.NewRecorder()
	router.ServeHTTP(applyRec, applyReq)

	if applyRec.Code != http.StatusAccepted {
		t.Fatalf("expected 202 Accepted on apply replayed sync, got %d", applyRec.Code)
	}

	// 5. Invalid target paths rejected with 400
	for _, badTarget := range []string{"../../etc/passwd", "/etc/passwd", "not-a-uuid"} {
		badBody := fmt.Sprintf(`{"jobId": %q}`, badTarget)
		badReq := httptest.NewRequest(http.MethodPost, "/v1/syncs/replay", bytes.NewReader([]byte(badBody)))
		badReq.Header.Set("Authorization", "Bearer secret-token")
		badRec := httptest.NewRecorder()
		router.ServeHTTP(badRec, badReq)
		if badRec.Code != http.StatusBadRequest {
			t.Errorf("expected 400 for bad replay target %s, got %d", badTarget, badRec.Code)
		}
	}
}

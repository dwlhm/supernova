package http_test

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"net/http/httptest"
	"testing"

	httpadapter "github.com/dwlhm/supernova/apps/api/internal/adapter/http"
	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

type mockWebhookService struct {
	webhookCalled bool
	lastEventType string
	lastPayload   []byte
}

func (m *mockWebhookService) SubmitExtraction(ctx context.Context, req contracts.ExtractionRequest) (string, error) {
	return "mock-job-id", nil
}
func (m *mockWebhookService) ReplayExtraction(ctx context.Context, fileOrJobID string) (string, error) {
	return "mock-job-id", nil
}
func (m *mockWebhookService) GetJob(ctx context.Context, jobID string) (*domain.Job, error) {
	return nil, nil
}
func (m *mockWebhookService) GetDownloadZip(ctx context.Context, jobID string) ([]byte, error) {
	return nil, nil
}
func (m *mockWebhookService) SubscribeJobEvents(ctx context.Context, jobID string) (<-chan contracts.JobEvent, func(), error) {
	return nil, func() {}, nil
}
func (m *mockWebhookService) SubmitSync(ctx context.Context, req contracts.SyncRequest) (*domain.SyncPlan, error) {
	return nil, nil
}
func (m *mockWebhookService) ReplaySync(ctx context.Context, fileOrJobID string, opts ...*contracts.ExtractionOptions) (*domain.SyncPlan, error) {
	return nil, nil
}
func (m *mockWebhookService) ApplySync(ctx context.Context, syncID string, req *contracts.ApplySyncRequest) (string, error) {
	return "mock-job-id", nil
}
func (m *mockWebhookService) GetSyncPlan(ctx context.Context, syncID string) (*domain.SyncPlan, error) {
	return nil, nil
}
func (m *mockWebhookService) HandleGitHubWebhook(ctx context.Context, eventType string, payload []byte) error {
	m.webhookCalled = true
	m.lastEventType = eventType
	m.lastPayload = payload
	return nil
}

func signPayload(secret string, payload []byte) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(payload)
	return "sha256=" + hex.EncodeToString(mac.Sum(nil))
}

func TestHandleGitHubWebhook_HMACVerification(t *testing.T) {
	secret := "my-webhook-secret"
	mockSvc := &mockWebhookService{}
	router := httpadapter.NewRouter(mockSvc, "api-token", secret)

	payload := []byte(`{"action":"created","issue":{"number":1}}`)

	// 1. Missing signature -> 401
	req := httptest.NewRequest(http.MethodPost, "/v1/webhooks/github", bytes.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected status 401 for missing signature, got %d", w.Code)
	}

	// 2. Invalid signature -> 401
	req = httptest.NewRequest(http.MethodPost, "/v1/webhooks/github", bytes.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Hub-Signature-256", "sha256=invalidhex000000000000000000000000000000000000000000000000000000")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected status 401 for invalid signature, got %d", w.Code)
	}

	// 3. Valid signature -> 200 OK
	req = httptest.NewRequest(http.MethodPost, "/v1/webhooks/github", bytes.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-GitHub-Event", "issue_comment")
	req.Header.Set("X-Hub-Signature-256", signPayload(secret, payload))
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200 for valid signature, got %d: %s", w.Code, w.Body.String())
	}
	if !mockSvc.webhookCalled {
		t.Errorf("expected HandleGitHubWebhook to be invoked")
	}
	if mockSvc.lastEventType != "issue_comment" {
		t.Errorf("expected eventType issue_comment, got %s", mockSvc.lastEventType)
	}
}

func TestHandleGitHubWebhook_MethodNotAllowed(t *testing.T) {
	mockSvc := &mockWebhookService{}
	router := httpadapter.NewRouter(mockSvc, "api-token")

	req := httptest.NewRequest(http.MethodGet, "/v1/webhooks/github", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	if w.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected status 405 for GET, got %d", w.Code)
	}
}

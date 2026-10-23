package app_test

import (
	"context"
	"fmt"
	"strings"
	"testing"

	"github.com/dwlhm/supernova/apps/api/internal/adapter/memstore"
	"github.com/dwlhm/supernova/apps/api/internal/core/app"
	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

type mockPRManager struct {
	branchReturned  string
	branchErr       error
	fileContent     map[string]string
	committedBranch string
	committedArts   []domain.CompiledArtifact
	committedMsg    string
	committedSha    string
	commitErr       error
	commentsCreated []string
}

func newMockPRManager() *mockPRManager {
	return &mockPRManager{
		branchReturned:  "supernova/test-ds",
		fileContent:     make(map[string]string),
		committedSha:    "mock-commit-sha-abc123",
		commentsCreated: make([]string, 0),
	}
}

func (m *mockPRManager) GetPullRequestBranch(ctx context.Context, owner, repo string, prNumber int) (string, error) {
	if m.branchErr != nil {
		return "", m.branchErr
	}
	return m.branchReturned, nil
}

func (m *mockPRManager) GetFileContent(ctx context.Context, owner, repo, filePath, ref string) (string, error) {
	if content, ok := m.fileContent[filePath]; ok {
		return content, nil
	}
	return "", nil
}

func (m *mockPRManager) CommitArtifacts(ctx context.Context, owner, repo, branch string, artifacts []domain.CompiledArtifact, message string) (string, error) {
	if m.commitErr != nil {
		return "", m.commitErr
	}
	m.committedBranch = branch
	m.committedArts = artifacts
	m.committedMsg = message
	return m.committedSha, nil
}

func (m *mockPRManager) CreateComment(ctx context.Context, owner, repo string, prNumber int, comment string) error {
	m.commentsCreated = append(m.commentsCreated, comment)
	return nil
}

func TestWebhook_HandleGitHubWebhook_IgnoredEvents(t *testing.T) {
	ctx := context.Background()
	store := memstore.New()
	author := &mockAuthor{}
	pm := newMockPRManager()
	svc := app.NewService(store, author, nil, app.Paths{}, pm)

	// 1. Unsupported event type
	if err := svc.HandleGitHubWebhook(ctx, "push", []byte(`{}`)); err != nil {
		t.Fatalf("expected nil for non issue_comment event, got %v", err)
	}

	// 2. Action != created
	payloadEdited := []byte(`{"action":"edited","comment":{"body":"/supernova regenerate Button"}}`)
	if err := svc.HandleGitHubWebhook(ctx, "issue_comment", payloadEdited); err != nil {
		t.Fatalf("expected nil for edited action, got %v", err)
	}

	// 3. Sender is bot
	payloadBot := []byte(`{
		"action": "created",
		"sender": {"login": "supernova[bot]", "type": "Bot"},
		"issue": {"number": 1, "pull_request": {}},
		"comment": {"body": "/supernova regenerate Button"}
	}`)
	if err := svc.HandleGitHubWebhook(ctx, "issue_comment", payloadBot); err != nil {
		t.Fatalf("expected nil for bot sender, got %v", err)
	}

	// 4. Issue is not a PR (pull_request is nil)
	payloadNonPR := []byte(`{
		"action": "created",
		"sender": {"login": "alice", "type": "User"},
		"issue": {"number": 10},
		"comment": {"body": "/supernova regenerate Button"}
	}`)
	if err := svc.HandleGitHubWebhook(ctx, "issue_comment", payloadNonPR); err != nil {
		t.Fatalf("expected nil for non-PR issue, got %v", err)
	}

	// 5. Normal comment (not bot command)
	payloadNormal := []byte(`{
		"action": "created",
		"sender": {"login": "alice", "type": "User"},
		"issue": {"number": 10, "pull_request": {}},
		"comment": {"body": "Looks great, let's merge soon!"}
	}`)
	if err := svc.HandleGitHubWebhook(ctx, "issue_comment", payloadNormal); err != nil {
		t.Fatalf("expected nil for normal comment, got %v", err)
	}
}

func TestWebhook_HandleGitHubWebhook_InvalidComponentName(t *testing.T) {
	ctx := context.Background()
	store := memstore.New()
	author := &mockAuthor{}
	pm := newMockPRManager()
	svc := app.NewService(store, author, nil, app.Paths{}, pm)

	payload := []byte(`{
		"action": "created",
		"sender": {"login": "alice", "type": "User"},
		"issue": {"number": 42, "pull_request": {}},
		"repository": {"owner": {"login": "owner"}, "name": "repo"},
		"comment": {"body": "/supernova regenerate ../etc/passwd: malicious path"}
	}`)

	err := svc.HandleGitHubWebhook(ctx, "issue_comment", payload)
	if err == nil {
		t.Fatal("expected error for invalid component name")
	}

	if len(pm.commentsCreated) == 0 {
		t.Fatalf("expected error comment to be posted on PR")
	}
	if !strings.Contains(pm.commentsCreated[0], "Invalid component name") {
		t.Errorf("unexpected comment content: %s", pm.commentsCreated[0])
	}
}

func TestWebhook_HandleGitHubWebhook_SuccessfulRegeneration(t *testing.T) {
	ctx := context.Background()
	store := memstore.New()
	pm := newMockPRManager()
	pm.fileContent["src/components/Button.lite.tsx"] = "export default function Button() { return <button>Old</button>; }"

	// Seed snapshot in store
	_ = store.SaveComponentSnapshot(ctx, &domain.ComponentSnapshot{
		DocumentName:  "test-ds",
		ComponentName: "Button",
		ContentHash:   "hash-123",
		SourceCode:    "export default function Button() { return <button>Old</button>; }",
		Spec: &contracts.FigmaComponentSpec{
			Name: "Button",
		},
	})

	var receivedReq out.AuthorRequest
	author := &mockAuthor{
		authorFn: func(ctx context.Context, req out.AuthorRequest) (*out.AuthorResult, error) {
			receivedReq = req
			return &out.AuthorResult{
				Components: map[string]string{
					"Button": "export default function Button() { return <button className=\"bg-blue-600\">New</button>; }",
				},
				Artifacts: []domain.CompiledArtifact{
					{
						Target:   contracts.React,
						FileName: "Button.tsx",
						Code:     "export const Button = () => <button>New</button>;",
					},
				},
			}, nil
		},
	}

	svc := app.NewService(store, author, nil, app.Paths{}, pm)

	payload := []byte(`{
		"action": "created",
		"sender": {"login": "reviewer", "type": "User"},
		"issue": {"number": 105, "pull_request": {}},
		"repository": {"owner": {"login": "owner"}, "name": "repo"},
		"comment": {"body": "/supernova regenerate Button: please change background to primary blue"}
	}`)

	err := svc.HandleGitHubWebhook(ctx, "issue_comment", payload)
	if err != nil {
		t.Fatalf("HandleGitHubWebhook failed: %v", err)
	}

	// Verify author request parameters
	if receivedReq.ComponentName != "Button" {
		t.Errorf("expected ComponentName Button, got %s", receivedReq.ComponentName)
	}
	if receivedReq.FeedbackNotes != "please change background to primary blue" {
		t.Errorf("expected FeedbackNotes, got %s", receivedReq.FeedbackNotes)
	}
	if receivedReq.ExistingSource != pm.fileContent["src/components/Button.lite.tsx"] {
		t.Errorf("expected existing source from PR branch, got %s", receivedReq.ExistingSource)
	}

	// Verify commit to branch
	if pm.committedBranch != "supernova/test-ds" {
		t.Errorf("expected commit to branch %s, got %s", "supernova/test-ds", pm.committedBranch)
	}
	if len(pm.committedArts) < 2 {
		t.Errorf("expected at least 2 artifacts (mitosis + react), got %d", len(pm.committedArts))
	}
	expectedMsg := "fix(Button): regenerate component from review feedback (PR #105)"
	if pm.committedMsg != expectedMsg {
		t.Errorf("expected commit message %q, got %q", expectedMsg, pm.committedMsg)
	}

	// Verify PR status comment
	if len(pm.commentsCreated) == 0 {
		t.Fatalf("expected PR comment to be posted")
	}
	comment := pm.commentsCreated[0]
	if !strings.Contains(comment, "successfully regenerated component **Button**") {
		t.Errorf("unexpected comment body: %s", comment)
	}
	if !strings.Contains(comment, "mock-commit-sha-abc123") {
		t.Errorf("expected commit SHA in comment body: %s", comment)
	}
	if !strings.Contains(comment, "please change background to primary blue") {
		t.Errorf("expected feedback summary in comment body: %s", comment)
	}
}

func TestWebhook_HandleGitHubWebhook_AuthorFailure(t *testing.T) {
	ctx := context.Background()
	store := memstore.New()
	pm := newMockPRManager()

	author := &mockAuthor{
		authorFn: func(ctx context.Context, req out.AuthorRequest) (*out.AuthorResult, error) {
			return nil, fmt.Errorf("mitosis lint syntax error")
		},
	}

	svc := app.NewService(store, author, nil, app.Paths{}, pm)

	payload := []byte(`{
		"action": "created",
		"sender": {"login": "reviewer", "type": "User"},
		"issue": {"number": 105, "pull_request": {}},
		"repository": {"owner": {"login": "owner"}, "name": "repo"},
		"comment": {"body": "/supernova regenerate Button: fix border"}
	}`)

	err := svc.HandleGitHubWebhook(ctx, "issue_comment", payload)
	if err == nil {
		t.Fatal("expected error on author failure")
	}

	if len(pm.commentsCreated) == 0 {
		t.Fatalf("expected failure comment to be posted on PR")
	}
	if !strings.Contains(pm.commentsCreated[0], "failed to regenerate component **Button**") {
		t.Errorf("unexpected comment content: %s", pm.commentsCreated[0])
	}
}

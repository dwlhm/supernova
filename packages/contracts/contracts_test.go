package contracts_test

import (
	"encoding/json"
	"reflect"
	"testing"
	"time"

	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
	"github.com/google/uuid"
)

func ptr[T any](v T) *T {
	return &v
}

func TestExtractionRequest_RoundTrip(t *testing.T) {
	original := contracts.ExtractionRequest{
		Document: contracts.FigmaDocument{
			Name:         "Supernova UI Kit",
			Version:      ptr("1.2.0"),
			LastModified: ptr("2025-01-15T10:00:00Z"),
			Tokens: []contracts.FigmaToken{
				{
					Id:          "token-primary",
					Name:        "color.brand.primary",
					Type:        "color",
					Value:       map[string]any{"r": 0.1, "g": 0.5, "b": 0.9, "a": 1.0},
					Description: ptr("Brand primary color"),
				},
				{
					Id:          "token-spacing-md",
					Name:        "spacing.md",
					Type:        "spacing",
					Value:       16.0,
					Description: ptr("Standard 16px padding"),
				},
			},
			Components: []contracts.FigmaComponentSpec{
				{
					Id:               "comp-btn-primary",
					Name:             "Button",
					Key:              ptr("btn-key-123"),
					Description:      ptr("Primary interactive button"),
					ComponentSetName: ptr("Buttons"),
					Properties: &map[string]any{
						"variant":  "primary",
						"disabled": false,
						"label":    "Click me",
					},
					Node: map[string]any{
						"type":       "FRAME",
						"name":       "Button",
						"layoutMode": "HORIZONTAL",
						"fills": []any{
							map[string]any{"type": "SOLID", "color": map[string]any{"r": 0.1, "g": 0.5, "b": 0.9}},
						},
						"children": []any{
							map[string]any{"type": "TEXT", "characters": "Click me"},
						},
					},
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
			contracts.PullRequest,
		},
		Options: &contracts.ExtractionOptions{
			PrTitle:    ptr("feat(ui): update design components"),
			BranchName: ptr("feature/design-tokens-v2"),
		},
	}

	data, err := json.Marshal(original)
	if err != nil {
		t.Fatalf("failed to marshal ExtractionRequest: %v", err)
	}

	var parsed contracts.ExtractionRequest
	if err := json.Unmarshal(data, &parsed); err != nil {
		t.Fatalf("failed to unmarshal ExtractionRequest: %v", err)
	}

	// Verify Document fields
	if parsed.Document.Name != original.Document.Name {
		t.Errorf("Document.Name mismatch: got %q, want %q", parsed.Document.Name, original.Document.Name)
	}
	if *parsed.Document.Version != *original.Document.Version {
		t.Errorf("Document.Version mismatch: got %q, want %q", *parsed.Document.Version, *original.Document.Version)
	}
	if *parsed.Document.LastModified != *original.Document.LastModified {
		t.Errorf("Document.LastModified mismatch: got %q, want %q", *parsed.Document.LastModified, *original.Document.LastModified)
	}

	// Verify Tokens
	if len(parsed.Document.Tokens) != len(original.Document.Tokens) {
		t.Fatalf("Tokens length mismatch: got %d, want %d", len(parsed.Document.Tokens), len(original.Document.Tokens))
	}
	for i, tok := range parsed.Document.Tokens {
		orig := original.Document.Tokens[i]
		if tok.Id != orig.Id || tok.Name != orig.Name || tok.Type != orig.Type {
			t.Errorf("Token[%d] mismatch: got %+v, want %+v", i, tok, orig)
		}
		if *tok.Description != *orig.Description {
			t.Errorf("Token[%d].Description mismatch: got %q, want %q", i, *tok.Description, *orig.Description)
		}
	}

	// Verify Components
	if len(parsed.Document.Components) != len(original.Document.Components) {
		t.Fatalf("Components length mismatch: got %d, want %d", len(parsed.Document.Components), len(original.Document.Components))
	}
	comp := parsed.Document.Components[0]
	origComp := original.Document.Components[0]
	if comp.Id != origComp.Id || comp.Name != origComp.Name {
		t.Errorf("Component mismatch: got id=%q name=%q, want id=%q name=%q", comp.Id, comp.Name, origComp.Id, origComp.Name)
	}
	if *comp.Key != *origComp.Key || *comp.Description != *origComp.Description || *comp.ComponentSetName != *origComp.ComponentSetName {
		t.Errorf("Component optional fields mismatch")
	}
	if comp.Node["type"] != "FRAME" || comp.Node["layoutMode"] != "HORIZONTAL" {
		t.Errorf("Component.Node content mismatch: %+v", comp.Node)
	}

	// Verify Targets
	if parsed.Targets == nil || len(*parsed.Targets) != 5 {
		t.Fatalf("Targets mismatch: got %+v", parsed.Targets)
	}
	expectedTargets := []contracts.Framework{contracts.React, contracts.Svelte, contracts.Vue3, contracts.Vue2, contracts.Angular}
	if !reflect.DeepEqual(*parsed.Targets, expectedTargets) {
		t.Errorf("Targets content mismatch: got %+v, want %+v", *parsed.Targets, expectedTargets)
	}

	// Verify Publishers
	if parsed.Publishers == nil || len(*parsed.Publishers) != 2 {
		t.Fatalf("Publishers mismatch: got %+v", parsed.Publishers)
	}
	expectedPublishers := []contracts.PublisherType{contracts.Download, contracts.PullRequest}
	if !reflect.DeepEqual(*parsed.Publishers, expectedPublishers) {
		t.Errorf("Publishers content mismatch: got %+v, want %+v", *parsed.Publishers, expectedPublishers)
	}

	// Verify Options
	if parsed.Options == nil || *parsed.Options.PrTitle != "feat(ui): update design components" || *parsed.Options.BranchName != "feature/design-tokens-v2" {
		t.Errorf("Options mismatch: got %+v", parsed.Options)
	}
}

func TestJobResponse_RoundTrip(t *testing.T) {
	now := time.Date(2025, 2, 28, 14, 30, 0, 0, time.UTC)
	updated := now.Add(5 * time.Minute)

	original := contracts.JobResponse{
		JobId:  "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
		Status: contracts.JobStatusSucceeded,
		Targets: []contracts.Framework{
			contracts.React,
			contracts.Vue3,
		},
		Publishers: []contracts.PublisherType{
			contracts.Download,
			contracts.PullRequest,
		},
		Components: []contracts.ComponentProgress{
			{
				Name:   "Button",
				Status: contracts.ComponentStatusDone,
			},
			{
				Name:   "Modal",
				Status: contracts.ComponentStatusFailed,
				StageError: &contracts.StageError{
					Stage:   "compiling",
					Message: "syntax error in Mitosis transform",
				},
			},
		},
		PublishResults: &contracts.PublishResults{
			DownloadUrl:    ptr("https://storage.supernova.dev/jobs/9b1deb4d/artifacts.zip"),
			PullRequestUrl: ptr("https://github.com/my-org/ui-kit/pull/42"),
		},
		Error: &contracts.StageError{
			Stage:   "compiling",
			Message: "one or more components failed during compilation",
		},
		CreatedAt: now,
		UpdatedAt: updated,
	}

	data, err := json.Marshal(original)
	if err != nil {
		t.Fatalf("failed to marshal JobResponse: %v", err)
	}

	var parsed contracts.JobResponse
	if err := json.Unmarshal(data, &parsed); err != nil {
		t.Fatalf("failed to unmarshal JobResponse: %v", err)
	}

	if parsed.JobId != original.JobId {
		t.Errorf("JobId mismatch: got %q, want %q", parsed.JobId, original.JobId)
	}
	if parsed.Status != original.Status {
		t.Errorf("Status mismatch: got %q, want %q", parsed.Status, original.Status)
	}
	if !reflect.DeepEqual(parsed.Targets, original.Targets) {
		t.Errorf("Targets mismatch: got %+v, want %+v", parsed.Targets, original.Targets)
	}
	if !reflect.DeepEqual(parsed.Publishers, original.Publishers) {
		t.Errorf("Publishers mismatch: got %+v, want %+v", parsed.Publishers, original.Publishers)
	}

	// Verify Components progress
	if len(parsed.Components) != 2 {
		t.Fatalf("Components length mismatch: got %d, want 2", len(parsed.Components))
	}
	if parsed.Components[0].Name != "Button" || parsed.Components[0].Status != contracts.ComponentStatusDone || parsed.Components[0].StageError != nil {
		t.Errorf("Component[0] mismatch: %+v", parsed.Components[0])
	}
	if parsed.Components[1].Name != "Modal" || parsed.Components[1].Status != contracts.ComponentStatusFailed {
		t.Errorf("Component[1] mismatch: %+v", parsed.Components[1])
	}
	if parsed.Components[1].StageError == nil || parsed.Components[1].StageError.Stage != "compiling" {
		t.Errorf("Component[1].StageError mismatch: %+v", parsed.Components[1].StageError)
	}

	// Verify PublishResults
	if parsed.PublishResults == nil || *parsed.PublishResults.DownloadUrl != *original.PublishResults.DownloadUrl {
		t.Errorf("PublishResults.DownloadUrl mismatch")
	}
	if *parsed.PublishResults.PullRequestUrl != *original.PublishResults.PullRequestUrl {
		t.Errorf("PublishResults.PullRequestUrl mismatch")
	}

	// Verify Error
	if parsed.Error == nil || parsed.Error.Stage != "compiling" || parsed.Error.Message != original.Error.Message {
		t.Errorf("Error mismatch: %+v", parsed.Error)
	}

	// Verify Timestamps (converted to UTC for comparison)
	if !parsed.CreatedAt.Equal(original.CreatedAt) {
		t.Errorf("CreatedAt mismatch: got %v, want %v", parsed.CreatedAt, original.CreatedAt)
	}
	if !parsed.UpdatedAt.Equal(original.UpdatedAt) {
		t.Errorf("UpdatedAt mismatch: got %v, want %v", parsed.UpdatedAt, original.UpdatedAt)
	}
}

func TestExtractionResponse_RoundTrip(t *testing.T) {
	id, err := uuid.Parse("123e4567-e89b-12d3-a456-426614174000")
	if err != nil {
		t.Fatalf("failed to parse UUID: %v", err)
	}
	now := time.Now().UTC().Truncate(time.Second)

	original := contracts.ExtractionResponse{
		JobId:     id,
		Status:    contracts.JobStatusQueued,
		CreatedAt: now,
	}

	data, err := json.Marshal(original)
	if err != nil {
		t.Fatalf("failed to marshal ExtractionResponse: %v", err)
	}

	var parsed contracts.ExtractionResponse
	if err := json.Unmarshal(data, &parsed); err != nil {
		t.Fatalf("failed to unmarshal ExtractionResponse: %v", err)
	}

	if parsed.JobId != original.JobId {
		t.Errorf("JobId mismatch: got %v, want %v", parsed.JobId, original.JobId)
	}
	if parsed.Status != original.Status {
		t.Errorf("Status mismatch: got %v, want %v", parsed.Status, original.Status)
	}
	if !parsed.CreatedAt.Equal(original.CreatedAt) {
		t.Errorf("CreatedAt mismatch: got %v, want %v", parsed.CreatedAt, original.CreatedAt)
	}
}

func TestFigmaColor_RoundTrip(t *testing.T) {
	original := contracts.FigmaColor{
		R: 0.25,
		G: 0.5,
		B: 0.75,
		A: 1.0,
	}

	data, err := json.Marshal(original)
	if err != nil {
		t.Fatalf("failed to marshal FigmaColor: %v", err)
	}

	var parsed contracts.FigmaColor
	if err := json.Unmarshal(data, &parsed); err != nil {
		t.Fatalf("failed to unmarshal FigmaColor: %v", err)
	}

	if parsed != original {
		t.Errorf("FigmaColor mismatch: got %+v, want %+v", parsed, original)
	}
}

func TestEnums(t *testing.T) {
	// Frameworks
	frameworks := []contracts.Framework{
		contracts.React,
		contracts.Svelte,
		contracts.Vue3,
		contracts.Vue2,
		contracts.Angular,
	}
	expectedFw := []string{"react", "svelte", "vue3", "vue2", "angular"}
	for i, fw := range frameworks {
		if string(fw) != expectedFw[i] {
			t.Errorf("Framework[%d]: got %q, want %q", i, fw, expectedFw[i])
		}
	}

	// Publishers
	publishers := []contracts.PublisherType{
		contracts.Download,
		contracts.PullRequest,
	}
	expectedPub := []string{"download", "pull_request"}
	for i, pub := range publishers {
		if string(pub) != expectedPub[i] {
			t.Errorf("PublisherType[%d]: got %q, want %q", i, pub, expectedPub[i])
		}
	}

	// JobStatus
	jobStatuses := []contracts.JobStatus{
		contracts.JobStatusQueued,
		contracts.JobStatusAuthoring,
		contracts.JobStatusCompiling,
		contracts.JobStatusPublishing,
		contracts.JobStatusSucceeded,
		contracts.JobStatusFailed,
	}
	expectedJob := []string{"queued", "authoring", "compiling", "publishing", "succeeded", "failed"}
	for i, js := range jobStatuses {
		if string(js) != expectedJob[i] {
			t.Errorf("JobStatus[%d]: got %q, want %q", i, js, expectedJob[i])
		}
	}

	// ComponentStatus
	compStatuses := []contracts.ComponentStatus{
		contracts.ComponentStatusPending,
		contracts.ComponentStatusAuthoring,
		contracts.ComponentStatusCompiling,
		contracts.ComponentStatusDone,
		contracts.ComponentStatusFailed,
	}
	expectedComp := []string{"pending", "authoring", "compiling", "done", "failed"}
	for i, cs := range compStatuses {
		if string(cs) != expectedComp[i] {
			t.Errorf("ComponentStatus[%d]: got %q, want %q", i, cs, expectedComp[i])
		}
	}
}

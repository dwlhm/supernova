package memstore_test

import (
	"context"
	"testing"
	"time"

	"github.com/dwlhm/supernova/apps/api/internal/adapter/memstore"
	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func TestMemoryStore(t *testing.T) {
	ctx := context.Background()
	store := memstore.New()

	job := &domain.Job{
		ID:           "test-job-1",
		DocumentName: "Test Doc",
		Status:       contracts.JobStatusQueued,
		CreatedAt:    time.Now().UTC(),
		UpdatedAt:    time.Now().UTC(),
	}

	if err := store.Save(ctx, job); err != nil {
		t.Fatalf("Save failed: %v", err)
	}

	retrieved, err := store.Get(ctx, "test-job-1")
	if err != nil {
		t.Fatalf("Get failed: %v", err)
	}
	if retrieved.ID != job.ID {
		t.Errorf("expected ID %s, got %s", job.ID, retrieved.ID)
	}

	// Test UpdateStatus
	if err := store.UpdateStatus(ctx, "test-job-1", contracts.JobStatusCompiling, nil); err != nil {
		t.Fatalf("UpdateStatus failed: %v", err)
	}
	retrieved, _ = store.Get(ctx, "test-job-1")
	if retrieved.Status != contracts.JobStatusCompiling {
		t.Errorf("expected status compiling, got %s", retrieved.Status)
	}

	// Test UpdateComponent
	compProgress := contracts.ComponentProgress{
		Name:   "Button",
		Status: contracts.ComponentStatusDone,
	}
	if err := store.UpdateComponent(ctx, "test-job-1", compProgress); err != nil {
		t.Fatalf("UpdateComponent failed: %v", err)
	}
	retrieved, _ = store.Get(ctx, "test-job-1")
	if len(retrieved.Components) != 1 || retrieved.Components[0].Name != "Button" {
		t.Errorf("unexpected components: %+v", retrieved.Components)
	}

	// Test SaveArtifacts
	artifact := domain.CompiledArtifact{
		Target:   contracts.React,
		FileName: "Button.tsx",
		Code:     "export default function Button() {}",
	}
	if err := store.SaveArtifacts(ctx, "test-job-1", []domain.CompiledArtifact{artifact}); err != nil {
		t.Fatalf("SaveArtifacts failed: %v", err)
	}
	retrieved, _ = store.Get(ctx, "test-job-1")
	if len(retrieved.Artifacts) != 1 {
		t.Fatalf("expected 1 artifact, got %d", len(retrieved.Artifacts))
	}

	// Test SaveZip and GetZip
	zipData := []byte("PK\x03\x04mockzipdata")
	if err := store.SaveZip(ctx, "test-job-1", zipData); err != nil {
		t.Fatalf("SaveZip failed: %v", err)
	}
	retrievedZip, err := store.GetZip(ctx, "test-job-1")
	if err != nil {
		t.Fatalf("GetZip failed: %v", err)
	}
	if string(retrievedZip) != string(zipData) {
		t.Errorf("zip data mismatch")
	}

	// Test SavePublishResults
	pubURL := "https://example.com/dl"
	if err := store.SavePublishResults(ctx, "test-job-1", &contracts.PublishResults{DownloadUrl: &pubURL}); err != nil {
		t.Fatalf("SavePublishResults failed: %v", err)
	}
	retrieved, _ = store.Get(ctx, "test-job-1")
	if retrieved.PublishResults == nil || *retrieved.PublishResults.DownloadUrl != pubURL {
		t.Errorf("expected download url %s, got %+v", pubURL, retrieved.PublishResults)
	}
}

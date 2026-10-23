package sqlite_test

import (
	"context"
	"path/filepath"
	"testing"
	"time"

	"github.com/dwlhm/supernova/apps/api/internal/adapter/sqlite"
	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func TestSQLiteStore_CompleteLifecycleAndPersistence(t *testing.T) {
	ctx := context.Background()
	dbDir := t.TempDir()
	dbPath := filepath.Join(dbDir, "test.db")

	// Phase 1: Initialize store and insert job, run, tasks, artifacts
	store, err := sqlite.New(dbPath)
	if err != nil {
		t.Fatalf("failed to create sqlite store: %v", err)
	}

	job := &domain.Job{
		ID:           "job-123",
		DocumentName: "Design System",
		Document: contracts.FigmaDocument{
			Components: []contracts.FigmaComponentSpec{
				{Id: "comp-1", Name: "Button"},
			},
		},
		Targets:    []contracts.Framework{contracts.React, contracts.Vue3},
		Publishers: []contracts.PublisherType{contracts.Download},
		Status:     contracts.JobStatusQueued,
		CreatedAt:  time.Now().UTC(),
		UpdatedAt:  time.Now().UTC(),
	}

	if err := store.Save(ctx, job); err != nil {
		t.Fatalf("failed to save job: %v", err)
	}

	// Update Component
	compProg := contracts.ComponentProgress{
		Name:   "Button",
		Status: contracts.ComponentStatusAuthoring,
	}
	if err := store.UpdateComponent(ctx, job.ID, compProg); err != nil {
		t.Fatalf("failed to update component: %v", err)
	}

	// Run & Task
	run := &domain.Run{
		ID:        "run-123",
		JobID:     job.ID,
		Status:    domain.RunRunning,
		CreatedAt: time.Now().UTC(),
	}
	if err := store.SaveRun(ctx, run); err != nil {
		t.Fatalf("failed to save run: %v", err)
	}

	task := &domain.Task{
		ID:            "task-btn",
		RunID:         run.ID,
		ComponentName: "Button",
		Status:        domain.TaskAuthoring,
		AttemptCount:  1,
		MaxAttempts:   3,
		CreatedAt:     time.Now().UTC(),
	}
	if err := store.UpdateTask(ctx, job.ID, task); err != nil {
		t.Fatalf("failed to update task: %v", err)
	}

	// Artifacts
	artifacts := []domain.CompiledArtifact{
		{Target: contracts.React, FileName: "Button.tsx", Code: "export const Button = () => <button>Click</button>;"},
	}
	if err := store.SaveArtifacts(ctx, job.ID, artifacts); err != nil {
		t.Fatalf("failed to save artifacts: %v", err)
	}

	// Zip
	zipBytes := []byte("PK-test-zip-content")
	if err := store.SaveZip(ctx, job.ID, zipBytes); err != nil {
		t.Fatalf("failed to save zip: %v", err)
	}

	// Close store to test persistence
	if err := store.Close(); err != nil {
		t.Fatalf("failed to close store: %v", err)
	}

	// Phase 2: Reopen store from disk and assert all data is preserved
	reopenedStore, err := sqlite.New(dbPath)
	if err != nil {
		t.Fatalf("failed to reopen sqlite store: %v", err)
	}
	defer reopenedStore.Close()

	loadedJob, err := reopenedStore.Get(ctx, job.ID)
	if err != nil {
		t.Fatalf("failed to get job after restart: %v", err)
	}
	if loadedJob.DocumentName != "Design System" {
		t.Errorf("expected document name 'Design System', got '%s'", loadedJob.DocumentName)
	}
	if len(loadedJob.Components) != 1 || loadedJob.Components[0].Status != contracts.ComponentStatusAuthoring {
		t.Errorf("expected 1 authoring component, got: %+v", loadedJob.Components)
	}
	if len(loadedJob.Artifacts) != 1 || loadedJob.Artifacts[0].FileName != "Button.tsx" {
		t.Errorf("expected 1 artifact 'Button.tsx', got: %+v", loadedJob.Artifacts)
	}

	loadedRun, err := reopenedStore.GetRun(ctx, run.ID)
	if err != nil {
		t.Fatalf("failed to get run after restart: %v", err)
	}
	if loadedRun.Status != domain.RunRunning {
		t.Errorf("expected run status running, got %s", loadedRun.Status)
	}
	if len(loadedRun.Tasks) != 1 || loadedRun.Tasks[0].ComponentName != "Button" {
		t.Errorf("expected 1 task for Button, got: %+v", loadedRun.Tasks)
	}

	loadedTasks, err := reopenedStore.GetTasks(ctx, job.ID)
	if err != nil {
		t.Fatalf("failed to get tasks after restart: %v", err)
	}
	if len(loadedTasks) != 1 || loadedTasks[0].Status != domain.TaskAuthoring {
		t.Errorf("expected 1 task authoring, got: %+v", loadedTasks)
	}

	loadedZip, err := reopenedStore.GetZip(ctx, job.ID)
	if err != nil {
		t.Fatalf("failed to get zip: %v", err)
	}
	if string(loadedZip) != string(zipBytes) {
		t.Errorf("expected zip %s, got %s", zipBytes, loadedZip)
	}
}

func TestSQLiteStore_SnapshotsAndSyncPlans(t *testing.T) {
	ctx := context.Background()
	dbDir := t.TempDir()
	dbPath := filepath.Join(dbDir, "snapshots.db")

	store, err := sqlite.New(dbPath)
	if err != nil {
		t.Fatalf("failed to create sqlite store: %v", err)
	}
	defer store.Close()

	docName := "MyDesignSystem"

	// 1. Snapshot test
	snap := &domain.Snapshot{
		ID:           "snap-1",
		DocumentName: docName,
		TokensHash:   "hash-tokens-1",
		Tokens: []contracts.FigmaToken{
			{Id: "t-1", Name: "color.primary", Type: "color", Value: "#123456"},
		},
		CreatedAt: time.Now().UTC(),
	}
	if err := store.SaveSnapshot(ctx, snap); err != nil {
		t.Fatalf("failed to save snapshot: %v", err)
	}

	loadedSnap, err := store.GetLatestSnapshot(ctx, docName)
	if err != nil {
		t.Fatalf("failed to get latest snapshot: %v", err)
	}
	if loadedSnap.ID != snap.ID || loadedSnap.TokensHash != snap.TokensHash {
		t.Errorf("expected snapshot %s, got %s", snap.ID, loadedSnap.ID)
	}
	if len(loadedSnap.Tokens) != 1 || loadedSnap.Tokens[0].Name != "color.primary" {
		t.Errorf("expected 1 token 'color.primary', got: %+v", loadedSnap.Tokens)
	}

	// 2. Component Snapshot test
	compSnap := &domain.ComponentSnapshot{
		DocumentName:  docName,
		ComponentName: "Button",
		ContentHash:   "hash-comp-button-v1",
		SourceCode:    "export default function Button() { return <button />; }",
		UpdatedAt:     time.Now().UTC(),
	}
	if err := store.SaveComponentSnapshot(ctx, compSnap); err != nil {
		t.Fatalf("failed to save component snapshot: %v", err)
	}

	loadedComp, err := store.GetComponentSnapshot(ctx, docName, "Button")
	if err != nil {
		t.Fatalf("failed to get component snapshot: %v", err)
	}
	if loadedComp.ContentHash != compSnap.ContentHash || loadedComp.SourceCode != compSnap.SourceCode {
		t.Errorf("component snapshot mismatch: got %+v", loadedComp)
	}

	allComps, err := store.GetComponentSnapshots(ctx, docName)
	if err != nil {
		t.Fatalf("failed to get all component snapshots: %v", err)
	}
	if len(allComps) != 1 || allComps["Button"] == nil {
		t.Fatalf("expected map with 'Button', got: %+v", allComps)
	}

	// 3. Sync Plan test
	plan := &domain.SyncPlan{
		SyncID:       "plan-123",
		DocumentName: docName,
		Summary: contracts.SyncSummary{
			Total:         1,
			New:           0,
			Changed:       1,
			Unchanged:     0,
			Removed:       0,
			TokensChanged: false,
		},
		Components: []contracts.ComponentDiff{
			{Name: "Button", Status: contracts.Changed},
		},
		CreatedAt: time.Now().UTC(),
	}
	if err := store.SaveSyncPlan(ctx, plan); err != nil {
		t.Fatalf("failed to save sync plan: %v", err)
	}

	loadedPlan, err := store.GetSyncPlan(ctx, plan.SyncID)
	if err != nil {
		t.Fatalf("failed to get sync plan: %v", err)
	}
	if loadedPlan.SyncID != plan.SyncID || len(loadedPlan.Components) != 1 {
		t.Errorf("plan mismatch: got %+v", loadedPlan)
	}
}

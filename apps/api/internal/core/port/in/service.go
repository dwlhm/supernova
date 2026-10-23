package in

import (
	"context"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

// Service defines inbound use cases for extraction job management.
type Service interface {
	// SubmitExtraction validates and enqueues a new extraction request, returning the generated job ID.
	SubmitExtraction(ctx context.Context, req contracts.ExtractionRequest) (string, error)

	// ReplayExtraction reads a previously persisted extraction request from disk and enqueues a new job.
	ReplayExtraction(ctx context.Context, fileOrJobID string) (string, error)

	// GetJob retrieves the current state and progress of an extraction job.
	GetJob(ctx context.Context, jobID string) (*domain.Job, error)

	// GetDownloadZip retrieves the generated zip archive for a succeeded extraction job.
	GetDownloadZip(ctx context.Context, jobID string) ([]byte, error)

	// SubscribeJobEvents opens a subscription channel for real-time SSE job and task events.
	SubscribeJobEvents(ctx context.Context, jobID string) (<-chan contracts.JobEvent, func(), error)

	// SubmitSync computes a diff plan comparing incoming document against the latest snapshot.
	SubmitSync(ctx context.Context, req contracts.SyncRequest) (*domain.SyncPlan, error)

	// ReplaySync reads a persisted extraction request from disk and computes a diff plan.
	ReplaySync(ctx context.Context, fileOrJobID string, opts ...*contracts.ExtractionOptions) (*domain.SyncPlan, error)

	// ApplySync triggers an incremental execution job based on a pre-computed sync plan.
	ApplySync(ctx context.Context, syncID string, req *contracts.ApplySyncRequest) (string, error)

	// GetSyncPlan retrieves a stored sync plan by ID.
	GetSyncPlan(ctx context.Context, syncID string) (*domain.SyncPlan, error)

	// HandleGitHubWebhook processes verified GitHub webhook events and executes PR bot commands.
	HandleGitHubWebhook(ctx context.Context, eventType string, payload []byte) error
}

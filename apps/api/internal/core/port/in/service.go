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
}

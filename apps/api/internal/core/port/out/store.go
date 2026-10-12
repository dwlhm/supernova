package out

import (
	"context"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

// JobStore defines the storage port for extraction jobs and artifacts.
type JobStore interface {
	Save(ctx context.Context, job *domain.Job) error
	Get(ctx context.Context, jobID string) (*domain.Job, error)
	Update(ctx context.Context, job *domain.Job) error
	UpdateComponent(ctx context.Context, jobID string, progress contracts.ComponentProgress) error
	UpdateStatus(ctx context.Context, jobID string, status contracts.JobStatus, stageErr *contracts.StageError) error
	SaveArtifacts(ctx context.Context, jobID string, artifacts []domain.CompiledArtifact) error
	SaveZip(ctx context.Context, jobID string, zipBytes []byte) error
	GetZip(ctx context.Context, jobID string) ([]byte, error)
	SavePublishResults(ctx context.Context, jobID string, results *contracts.PublishResults) error
}

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
	SaveRun(ctx context.Context, run *domain.Run) error
	GetRun(ctx context.Context, runID string) (*domain.Run, error)
	UpdateRun(ctx context.Context, run *domain.Run) error
	UpdateTask(ctx context.Context, jobID string, task *domain.Task) error
	GetTasks(ctx context.Context, jobID string) ([]*domain.Task, error)
	SaveArtifacts(ctx context.Context, jobID string, artifacts []domain.CompiledArtifact) error
	SaveZip(ctx context.Context, jobID string, zipBytes []byte) error
	GetZip(ctx context.Context, jobID string) ([]byte, error)
	SavePublishResults(ctx context.Context, jobID string, results *contracts.PublishResults) error

	// Snapshot and Sync methods for incremental pipeline
	SaveSnapshot(ctx context.Context, snap *domain.Snapshot) error
	GetLatestSnapshot(ctx context.Context, documentName string) (*domain.Snapshot, error)
	SaveComponentSnapshot(ctx context.Context, compSnap *domain.ComponentSnapshot) error
	GetComponentSnapshot(ctx context.Context, documentName, componentName string) (*domain.ComponentSnapshot, error)
	GetComponentSnapshots(ctx context.Context, documentName string) (map[string]*domain.ComponentSnapshot, error)
	SaveSyncPlan(ctx context.Context, plan *domain.SyncPlan) error
	GetSyncPlan(ctx context.Context, syncID string) (*domain.SyncPlan, error)
}

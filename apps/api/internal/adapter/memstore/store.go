package memstore

import (
	"context"
	"sync"
	"time"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

// MemoryStore provides a thread-safe in-memory implementation of out.JobStore.
type MemoryStore struct {
	mu   sync.RWMutex
	jobs map[string]*domain.Job
	zips map[string][]byte
}

var _ out.JobStore = (*MemoryStore)(nil)

// New initializes an empty MemoryStore.
func New() *MemoryStore {
	return &MemoryStore{
		jobs: make(map[string]*domain.Job),
		zips: make(map[string][]byte),
	}
}

// Save stores a job into the memory store.
func (s *MemoryStore) Save(ctx context.Context, job *domain.Job) error {
	if job == nil {
		return domain.ErrInvalidPayload
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	s.jobs[job.ID] = cloneJob(job)
	return nil
}

// Get retrieves a job by ID.
func (s *MemoryStore) Get(ctx context.Context, jobID string) (*domain.Job, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	job, exists := s.jobs[jobID]
	if !exists {
		return nil, domain.ErrJobNotFound
	}

	return cloneJob(job), nil
}

// Update replaces an existing job's state.
func (s *MemoryStore) Update(ctx context.Context, job *domain.Job) error {
	if job == nil {
		return domain.ErrInvalidPayload
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.jobs[job.ID]; !exists {
		return domain.ErrJobNotFound
	}

	s.jobs[job.ID] = cloneJob(job)
	return nil
}

// UpdateComponent updates the progress of a specific component in the job.
func (s *MemoryStore) UpdateComponent(ctx context.Context, jobID string, progress contracts.ComponentProgress) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	job, exists := s.jobs[jobID]
	if !exists {
		return domain.ErrJobNotFound
	}

	found := false
	for i, c := range job.Components {
		if c.Name == progress.Name {
			job.Components[i] = progress
			found = true
			break
		}
	}
	if !found {
		job.Components = append(job.Components, progress)
	}
	job.UpdatedAt = time.Now().UTC()
	return nil
}

// UpdateStatus updates the overall status and optional stage error of the job.
func (s *MemoryStore) UpdateStatus(ctx context.Context, jobID string, status contracts.JobStatus, stageErr *contracts.StageError) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	job, exists := s.jobs[jobID]
	if !exists {
		return domain.ErrJobNotFound
	}

	job.Status = status
	if stageErr != nil {
		errCopy := *stageErr
		job.Error = &errCopy
	}
	job.UpdatedAt = time.Now().UTC()
	return nil
}

// SaveArtifacts appends compiled artifacts to the job.
func (s *MemoryStore) SaveArtifacts(ctx context.Context, jobID string, artifacts []domain.CompiledArtifact) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	job, exists := s.jobs[jobID]
	if !exists {
		return domain.ErrJobNotFound
	}

	job.Artifacts = append(job.Artifacts, artifacts...)
	job.UpdatedAt = time.Now().UTC()
	return nil
}

// SaveZip stores the zipped archive bytes for a job.
func (s *MemoryStore) SaveZip(ctx context.Context, jobID string, zipBytes []byte) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	data := make([]byte, len(zipBytes))
	copy(data, zipBytes)
	s.zips[jobID] = data
	return nil
}

// GetZip retrieves the zipped archive bytes for a job.
func (s *MemoryStore) GetZip(ctx context.Context, jobID string) ([]byte, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	data, exists := s.zips[jobID]
	if !exists {
		return nil, domain.ErrJobNotFound
	}

	res := make([]byte, len(data))
	copy(res, data)
	return res, nil
}

// SavePublishResults updates the publish results for a job.
func (s *MemoryStore) SavePublishResults(ctx context.Context, jobID string, results *contracts.PublishResults) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	job, exists := s.jobs[jobID]
	if !exists {
		return domain.ErrJobNotFound
	}

	if results != nil {
		prCopy := *results
		job.PublishResults = &prCopy
	} else {
		job.PublishResults = nil
	}
	job.UpdatedAt = time.Now().UTC()
	return nil
}

func cloneJob(j *domain.Job) *domain.Job {
	if j == nil {
		return nil
	}
	cp := *j
	if j.Targets != nil {
		cp.Targets = make([]contracts.Framework, len(j.Targets))
		copy(cp.Targets, j.Targets)
	}
	if j.Publishers != nil {
		cp.Publishers = make([]contracts.PublisherType, len(j.Publishers))
		copy(cp.Publishers, j.Publishers)
	}
	if j.Components != nil {
		cp.Components = make([]contracts.ComponentProgress, len(j.Components))
		copy(cp.Components, j.Components)
	}
	if j.Artifacts != nil {
		cp.Artifacts = make([]domain.CompiledArtifact, len(j.Artifacts))
		copy(cp.Artifacts, j.Artifacts)
	}
	if j.PublishResults != nil {
		prCopy := *j.PublishResults
		cp.PublishResults = &prCopy
	}
	if j.Error != nil {
		errCopy := *j.Error
		cp.Error = &errCopy
	}
	return &cp
}

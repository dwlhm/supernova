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
	mu        sync.RWMutex
	jobs      map[string]*domain.Job
	runs      map[string]*domain.Run
	zips      map[string][]byte
	snapshots map[string][]*domain.Snapshot
	compSnaps map[string]map[string]*domain.ComponentSnapshot
	plans     map[string]*domain.SyncPlan
}

var _ out.JobStore = (*MemoryStore)(nil)

// New initializes an empty MemoryStore.
func New() *MemoryStore {
	return &MemoryStore{
		jobs:      make(map[string]*domain.Job),
		runs:      make(map[string]*domain.Run),
		zips:      make(map[string][]byte),
		snapshots: make(map[string][]*domain.Snapshot),
		compSnaps: make(map[string]map[string]*domain.ComponentSnapshot),
		plans:     make(map[string]*domain.SyncPlan),
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

// SaveRun stores an authoring Run into the memory store.
func (s *MemoryStore) SaveRun(ctx context.Context, run *domain.Run) error {
	if run == nil {
		return domain.ErrInvalidPayload
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.runs[run.ID] = cloneRun(run)
	return nil
}

// GetRun retrieves a Run by ID.
func (s *MemoryStore) GetRun(ctx context.Context, runID string) (*domain.Run, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	run, exists := s.runs[runID]
	if !exists {
		return nil, domain.ErrJobNotFound
	}
	return cloneRun(run), nil
}

// UpdateRun updates an existing Run.
func (s *MemoryStore) UpdateRun(ctx context.Context, run *domain.Run) error {
	if run == nil {
		return domain.ErrInvalidPayload
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, exists := s.runs[run.ID]; !exists {
		return domain.ErrJobNotFound
	}
	s.runs[run.ID] = cloneRun(run)
	return nil
}

// UpdateTask updates or appends a component task for a job.
func (s *MemoryStore) UpdateTask(ctx context.Context, jobID string, task *domain.Task) error {
	if task == nil {
		return domain.ErrInvalidPayload
	}
	s.mu.Lock()
	defer s.mu.Unlock()

	job, exists := s.jobs[jobID]
	if !exists {
		return domain.ErrJobNotFound
	}

	found := false
	for i, t := range job.Tasks {
		if t.ID == task.ID || t.ComponentName == task.ComponentName {
			job.Tasks[i] = cloneTask(task)
			found = true
			break
		}
	}
	if !found {
		job.Tasks = append(job.Tasks, cloneTask(task))
	}
	job.UpdatedAt = time.Now().UTC()
	return nil
}

// GetTasks returns all tasks for a job.
func (s *MemoryStore) GetTasks(ctx context.Context, jobID string) ([]*domain.Task, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	job, exists := s.jobs[jobID]
	if !exists {
		return nil, domain.ErrJobNotFound
	}

	res := make([]*domain.Task, len(job.Tasks))
	for i, t := range job.Tasks {
		res[i] = cloneTask(t)
	}
	return res, nil
}

// SaveArtifacts adds or updates compiled artifacts for the job by Target and FileName.
func (s *MemoryStore) SaveArtifacts(ctx context.Context, jobID string, artifacts []domain.CompiledArtifact) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	job, exists := s.jobs[jobID]
	if !exists {
		return domain.ErrJobNotFound
	}

	for _, newArt := range artifacts {
		found := false
		for i, existing := range job.Artifacts {
			if existing.Target == newArt.Target && existing.FileName == newArt.FileName {
				job.Artifacts[i] = newArt
				found = true
				break
			}
		}
		if !found {
			job.Artifacts = append(job.Artifacts, newArt)
		}
	}
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
	if j.Tasks != nil {
		cp.Tasks = make([]*domain.Task, len(j.Tasks))
		for i, t := range j.Tasks {
			cp.Tasks[i] = cloneTask(t)
		}
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

func cloneTask(t *domain.Task) *domain.Task {
	if t == nil {
		return nil
	}
	cp := *t
	if t.Artifacts != nil {
		cp.Artifacts = make([]domain.CompiledArtifact, len(t.Artifacts))
		copy(cp.Artifacts, t.Artifacts)
	}
	return &cp
}

func cloneRun(r *domain.Run) *domain.Run {
	if r == nil {
		return nil
	}
	cp := *r
	if r.Tasks != nil {
		cp.Tasks = make([]*domain.Task, len(r.Tasks))
		for i, t := range r.Tasks {
			cp.Tasks[i] = cloneTask(t)
		}
	}
	if r.FinishedAt != nil {
		fCopy := *r.FinishedAt
		cp.FinishedAt = &fCopy
	}
	return &cp
}

// SaveSnapshot saves a document-level tokens snapshot.
func (s *MemoryStore) SaveSnapshot(ctx context.Context, snap *domain.Snapshot) error {
	if snap == nil {
		return domain.ErrInvalidPayload
	}
	s.mu.Lock()
	defer s.mu.Unlock()

	cp := *snap
	s.snapshots[snap.DocumentName] = append(s.snapshots[snap.DocumentName], &cp)
	return nil
}

// GetLatestSnapshot returns the most recent snapshot for a document.
func (s *MemoryStore) GetLatestSnapshot(ctx context.Context, documentName string) (*domain.Snapshot, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	snaps, ok := s.snapshots[documentName]
	if !ok || len(snaps) == 0 {
		return nil, domain.ErrJobNotFound
	}
	latest := snaps[len(snaps)-1]
	cp := *latest
	return &cp, nil
}

// SaveComponentSnapshot stores or updates a component snapshot.
func (s *MemoryStore) SaveComponentSnapshot(ctx context.Context, compSnap *domain.ComponentSnapshot) error {
	if compSnap == nil {
		return domain.ErrInvalidPayload
	}
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, ok := s.compSnaps[compSnap.DocumentName]; !ok {
		s.compSnaps[compSnap.DocumentName] = make(map[string]*domain.ComponentSnapshot)
	}
	cp := *compSnap
	s.compSnaps[compSnap.DocumentName][compSnap.ComponentName] = &cp
	return nil
}

// GetComponentSnapshot retrieves a specific component snapshot.
func (s *MemoryStore) GetComponentSnapshot(ctx context.Context, documentName, componentName string) (*domain.ComponentSnapshot, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if documentName == "" {
		for _, docSnaps := range s.compSnaps {
			if snap, ok := docSnaps[componentName]; ok {
				cp := *snap
				return &cp, nil
			}
		}
		return nil, domain.ErrComponentNotFound
	}

	docSnaps, ok := s.compSnaps[documentName]
	if !ok {
		return nil, domain.ErrComponentNotFound
	}
	snap, ok := docSnaps[componentName]
	if !ok {
		return nil, domain.ErrComponentNotFound
	}
	cp := *snap
	return &cp, nil
}

// GetComponentSnapshots returns all component snapshots for a document.
func (s *MemoryStore) GetComponentSnapshots(ctx context.Context, documentName string) (map[string]*domain.ComponentSnapshot, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	docSnaps, ok := s.compSnaps[documentName]
	if !ok {
		return make(map[string]*domain.ComponentSnapshot), nil
	}
	result := make(map[string]*domain.ComponentSnapshot, len(docSnaps))
	for k, v := range docSnaps {
		cp := *v
		result[k] = &cp
	}
	return result, nil
}

// SaveSyncPlan stores a calculated sync plan.
func (s *MemoryStore) SaveSyncPlan(ctx context.Context, plan *domain.SyncPlan) error {
	if plan == nil {
		return domain.ErrInvalidPayload
	}
	s.mu.Lock()
	defer s.mu.Unlock()

	cp := *plan
	s.plans[plan.SyncID] = &cp
	return nil
}

// GetSyncPlan retrieves a stored sync plan by ID.
func (s *MemoryStore) GetSyncPlan(ctx context.Context, syncID string) (*domain.SyncPlan, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	plan, ok := s.plans[syncID]
	if !ok {
		return nil, domain.ErrJobNotFound
	}
	cp := *plan
	return &cp, nil
}

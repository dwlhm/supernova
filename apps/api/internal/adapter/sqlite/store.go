package sqlite

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
	_ "modernc.org/sqlite"
)

// Store implements out.JobStore using an embedded SQLite database.
type Store struct {
	db *sql.DB
	mu sync.RWMutex
}

var _ out.JobStore = (*Store)(nil)

// New initializes a SQLite-backed JobStore and runs migrations.
func New(dsn string) (*Store, error) {
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open sqlite db: %w", err)
	}

	// Single connection write pool or busy_timeout for concurrency safety
	db.SetMaxOpenConns(1)

	s := &Store{db: db}
	if err := s.migrate(); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("failed to migrate sqlite schema: %w", err)
	}

	return s, nil
}

// Close closes the database connection.
func (s *Store) Close() error {
	return s.db.Close()
}

func (s *Store) migrate() error {
	query := `
	PRAGMA journal_mode = WAL;
	PRAGMA busy_timeout = 5000;

	CREATE TABLE IF NOT EXISTS jobs (
		id TEXT PRIMARY KEY,
		document_name TEXT NOT NULL,
		document_json TEXT NOT NULL,
		options_json TEXT,
		targets_json TEXT NOT NULL,
		publishers_json TEXT NOT NULL,
		status TEXT NOT NULL,
		run_id TEXT,
		error_json TEXT,
		publish_results_json TEXT,
		created_at TEXT NOT NULL,
		updated_at TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS runs (
		id TEXT PRIMARY KEY,
		job_id TEXT NOT NULL,
		status TEXT NOT NULL,
		created_at TEXT NOT NULL,
		finished_at TEXT
	);

	CREATE TABLE IF NOT EXISTS tasks (
		id TEXT PRIMARY KEY,
		run_id TEXT NOT NULL,
		job_id TEXT NOT NULL,
		component_name TEXT NOT NULL,
		status TEXT NOT NULL,
		attempt_count INTEGER NOT NULL DEFAULT 0,
		max_attempts INTEGER NOT NULL DEFAULT 3,
		error TEXT,
		created_at TEXT NOT NULL,
		updated_at TEXT NOT NULL,
		UNIQUE(job_id, component_name)
	);

	CREATE TABLE IF NOT EXISTS components (
		job_id TEXT NOT NULL,
		name TEXT NOT NULL,
		status TEXT NOT NULL,
		group_name TEXT,
		stage_error_json TEXT,
		PRIMARY KEY (job_id, name)
	);

	CREATE TABLE IF NOT EXISTS artifacts (
		job_id TEXT NOT NULL,
		target TEXT NOT NULL,
		file_name TEXT NOT NULL,
		code TEXT NOT NULL,
		group_name TEXT,
		PRIMARY KEY (job_id, target, file_name)
	);

	CREATE TABLE IF NOT EXISTS job_zips (
		job_id TEXT PRIMARY KEY,
		zip_data BLOB NOT NULL
	);

	CREATE TABLE IF NOT EXISTS snapshots (
		id TEXT PRIMARY KEY,
		document_name TEXT NOT NULL,
		tokens_hash TEXT NOT NULL,
		tokens_json TEXT NOT NULL,
		created_at TEXT NOT NULL
	);

	CREATE INDEX IF NOT EXISTS idx_snapshots_doc ON snapshots(document_name, created_at DESC);

	CREATE TABLE IF NOT EXISTS component_snapshots (
		document_name TEXT NOT NULL,
		component_name TEXT NOT NULL,
		content_hash TEXT NOT NULL,
		spec_json TEXT,
		source_code TEXT,
		updated_at TEXT NOT NULL,
		PRIMARY KEY (document_name, component_name)
	);

	CREATE TABLE IF NOT EXISTS sync_plans (
		id TEXT PRIMARY KEY,
		document_name TEXT NOT NULL,
		plan_json TEXT NOT NULL,
		created_at TEXT NOT NULL
	);
	`
	_, err := s.db.Exec(query)
	return err
}

// Save stores a new job into SQLite.
func (s *Store) Save(ctx context.Context, job *domain.Job) error {
	if job == nil {
		return domain.ErrInvalidPayload
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	docJSON, err := json.Marshal(job.Document)
	if err != nil {
		return fmt.Errorf("failed to marshal document: %w", err)
	}

	var optJSON []byte
	if job.Options != nil {
		optJSON, _ = json.Marshal(job.Options)
	}

	targetsJSON, _ := json.Marshal(job.Targets)
	publishersJSON, _ := json.Marshal(job.Publishers)

	var errJSON []byte
	if job.Error != nil {
		errJSON, _ = json.Marshal(job.Error)
	}

	var pubResJSON []byte
	if job.PublishResults != nil {
		pubResJSON, _ = json.Marshal(job.PublishResults)
	}

	query := `
	INSERT INTO jobs (id, document_name, document_json, options_json, targets_json, publishers_json, status, run_id, error_json, publish_results_json, created_at, updated_at)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT(id) DO UPDATE SET
		document_name=excluded.document_name,
		document_json=excluded.document_json,
		options_json=excluded.options_json,
		targets_json=excluded.targets_json,
		publishers_json=excluded.publishers_json,
		status=excluded.status,
		run_id=excluded.run_id,
		error_json=excluded.error_json,
		publish_results_json=excluded.publish_results_json,
		updated_at=excluded.updated_at
	`
	now := time.Now().UTC().Format(time.RFC3339Nano)
	createdAt := job.CreatedAt.Format(time.RFC3339Nano)
	if job.CreatedAt.IsZero() {
		createdAt = now
	}

	_, err = s.db.ExecContext(ctx, query,
		job.ID,
		job.DocumentName,
		string(docJSON),
		string(optJSON),
		string(targetsJSON),
		string(publishersJSON),
		string(job.Status),
		job.RunID,
		string(errJSON),
		string(pubResJSON),
		createdAt,
		now,
	)
	if err != nil {
		return fmt.Errorf("failed to insert/update job: %w", err)
	}

	// Persist components
	for _, comp := range job.Components {
		var compErrJSON []byte
		if comp.StageError != nil {
			compErrJSON, _ = json.Marshal(comp.StageError)
		}
		var groupName string
		if comp.Group != nil {
			groupName = *comp.Group
		}
		compQuery := `
		INSERT INTO components (job_id, name, status, group_name, stage_error_json)
		VALUES (?, ?, ?, ?, ?)
		ON CONFLICT(job_id, name) DO UPDATE SET
			status=excluded.status,
			group_name=excluded.group_name,
			stage_error_json=excluded.stage_error_json
		`
		_, _ = s.db.ExecContext(ctx, compQuery, job.ID, comp.Name, string(comp.Status), groupName, string(compErrJSON))
	}

	return nil
}

// Get retrieves a job and its components, tasks, and artifacts.
func (s *Store) Get(ctx context.Context, jobID string) (*domain.Job, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	query := `
	SELECT id, document_name, document_json, options_json, targets_json, publishers_json, status, run_id, error_json, publish_results_json, created_at, updated_at
	FROM jobs WHERE id = ?
	`
	row := s.db.QueryRowContext(ctx, query, jobID)

	var j domain.Job
	var docJSON, optJSON, targetsJSON, pubJSON, errJSON, pubResJSON sql.NullString
	var statusStr, createdStr, updatedStr string
	var runID sql.NullString

	err := row.Scan(
		&j.ID,
		&j.DocumentName,
		&docJSON,
		&optJSON,
		&targetsJSON,
		&pubJSON,
		&statusStr,
		&runID,
		&errJSON,
		&pubResJSON,
		&createdStr,
		&updatedStr,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrJobNotFound
		}
		return nil, fmt.Errorf("failed to query job: %w", err)
	}

	j.Status = contracts.JobStatus(statusStr)
	if runID.Valid {
		j.RunID = runID.String
	}
	j.CreatedAt, _ = time.Parse(time.RFC3339Nano, createdStr)
	j.UpdatedAt, _ = time.Parse(time.RFC3339Nano, updatedStr)

	if docJSON.Valid && docJSON.String != "" {
		_ = json.Unmarshal([]byte(docJSON.String), &j.Document)
	}
	if optJSON.Valid && optJSON.String != "" {
		var opt contracts.ExtractionOptions
		if err := json.Unmarshal([]byte(optJSON.String), &opt); err == nil {
			j.Options = &opt
		}
	}
	if targetsJSON.Valid && targetsJSON.String != "" {
		_ = json.Unmarshal([]byte(targetsJSON.String), &j.Targets)
	}
	if pubJSON.Valid && pubJSON.String != "" {
		_ = json.Unmarshal([]byte(pubJSON.String), &j.Publishers)
	}
	if errJSON.Valid && errJSON.String != "" && errJSON.String != "null" {
		var stageErr contracts.StageError
		if err := json.Unmarshal([]byte(errJSON.String), &stageErr); err == nil {
			j.Error = &stageErr
		}
	}
	if pubResJSON.Valid && pubResJSON.String != "" && pubResJSON.String != "null" {
		var pubRes contracts.PublishResults
		if err := json.Unmarshal([]byte(pubResJSON.String), &pubRes); err == nil {
			j.PublishResults = &pubRes
		}
	}

	// Fetch components
	compQuery := `SELECT name, status, group_name, stage_error_json FROM components WHERE job_id = ? ORDER BY name ASC`
	rows, err := s.db.QueryContext(ctx, compQuery, jobID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var cp contracts.ComponentProgress
			var status, group, errStr sql.NullString
			if err := rows.Scan(&cp.Name, &status, &group, &errStr); err == nil {
				cp.Status = contracts.ComponentStatus(status.String)
				if group.Valid && group.String != "" {
					g := group.String
					cp.Group = &g
				}
				if errStr.Valid && errStr.String != "" && errStr.String != "null" {
					var se contracts.StageError
					if err := json.Unmarshal([]byte(errStr.String), &se); err == nil {
						cp.StageError = &se
					}
				}
				j.Components = append(j.Components, cp)
			}
		}
	}

	// Fetch tasks
	tasksQuery := `SELECT id, run_id, component_name, status, attempt_count, max_attempts, error, created_at, updated_at FROM tasks WHERE job_id = ? ORDER BY component_name ASC`
	tRows, err := s.db.QueryContext(ctx, tasksQuery, jobID)
	if err == nil {
		defer tRows.Close()
		for tRows.Next() {
			var t domain.Task
			var status, errMsg, cAt, uAt string
			if err := tRows.Scan(&t.ID, &t.RunID, &t.ComponentName, &status, &t.AttemptCount, &t.MaxAttempts, &errMsg, &cAt, &uAt); err == nil {
				t.Status = domain.TaskStatus(status)
				t.Error = errMsg
				t.CreatedAt, _ = time.Parse(time.RFC3339Nano, cAt)
				t.UpdatedAt, _ = time.Parse(time.RFC3339Nano, uAt)
				j.Tasks = append(j.Tasks, &t)
			}
		}
	}

	// Fetch artifacts
	artQuery := `SELECT target, file_name, code, group_name FROM artifacts WHERE job_id = ? ORDER BY target, file_name ASC`
	aRows, err := s.db.QueryContext(ctx, artQuery, jobID)
	if err == nil {
		defer aRows.Close()
		for aRows.Next() {
			var a domain.CompiledArtifact
			var target, group sql.NullString
			if err := aRows.Scan(&target, &a.FileName, &a.Code, &group); err == nil {
				a.Target = contracts.Framework(target.String)
				if group.Valid {
					a.Group = group.String
				}
				j.Artifacts = append(j.Artifacts, a)
			}
		}
	}

	return &j, nil
}

// Update updates an existing job's attributes.
func (s *Store) Update(ctx context.Context, job *domain.Job) error {
	return s.Save(ctx, job)
}

// UpdateComponent updates a component's progress.
func (s *Store) UpdateComponent(ctx context.Context, jobID string, progress contracts.ComponentProgress) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	var compErrJSON []byte
	if progress.StageError != nil {
		compErrJSON, _ = json.Marshal(progress.StageError)
	}
	var groupName string
	if progress.Group != nil {
		groupName = *progress.Group
	}

	query := `
	INSERT INTO components (job_id, name, status, group_name, stage_error_json)
	VALUES (?, ?, ?, ?, ?)
	ON CONFLICT(job_id, name) DO UPDATE SET
		status=excluded.status,
		group_name=excluded.group_name,
		stage_error_json=excluded.stage_error_json
	`
	_, err := s.db.ExecContext(ctx, query, jobID, progress.Name, string(progress.Status), groupName, string(compErrJSON))
	if err != nil {
		return fmt.Errorf("failed to update component: %w", err)
	}

	_, _ = s.db.ExecContext(ctx, `UPDATE jobs SET updated_at = ? WHERE id = ?`, time.Now().UTC().Format(time.RFC3339Nano), jobID)
	return nil
}

// UpdateStatus updates the job's overall status.
func (s *Store) UpdateStatus(ctx context.Context, jobID string, status contracts.JobStatus, stageErr *contracts.StageError) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	var errJSON []byte
	if stageErr != nil {
		errJSON, _ = json.Marshal(stageErr)
	}

	query := `UPDATE jobs SET status = ?, error_json = ?, updated_at = ? WHERE id = ?`
	now := time.Now().UTC().Format(time.RFC3339Nano)
	res, err := s.db.ExecContext(ctx, query, string(status), string(errJSON), now, jobID)
	if err != nil {
		return fmt.Errorf("failed to update job status: %w", err)
	}
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return domain.ErrJobNotFound
	}
	return nil
}

// SaveRun stores an authoring Run into SQLite.
func (s *Store) SaveRun(ctx context.Context, run *domain.Run) error {
	if run == nil {
		return domain.ErrInvalidPayload
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	query := `
	INSERT INTO runs (id, job_id, status, created_at, finished_at)
	VALUES (?, ?, ?, ?, ?)
	ON CONFLICT(id) DO UPDATE SET
		status=excluded.status,
		finished_at=excluded.finished_at
	`
	var finAt string
	if run.FinishedAt != nil {
		finAt = run.FinishedAt.Format(time.RFC3339Nano)
	}
	_, err := s.db.ExecContext(ctx, query, run.ID, run.JobID, string(run.Status), run.CreatedAt.Format(time.RFC3339Nano), finAt)
	return err
}

// GetRun retrieves a Run by ID including its tasks.
func (s *Store) GetRun(ctx context.Context, runID string) (*domain.Run, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	query := `SELECT id, job_id, status, created_at, finished_at FROM runs WHERE id = ?`
	row := s.db.QueryRowContext(ctx, query, runID)

	var r domain.Run
	var statusStr, createdStr, finStr string
	err := row.Scan(&r.ID, &r.JobID, &statusStr, &createdStr, &finStr)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrJobNotFound
		}
		return nil, fmt.Errorf("failed to query run: %w", err)
	}

	r.Status = domain.RunStatus(statusStr)
	r.CreatedAt, _ = time.Parse(time.RFC3339Nano, createdStr)
	if finStr != "" {
		t, _ := time.Parse(time.RFC3339Nano, finStr)
		r.FinishedAt = &t
	}

	// Fetch tasks for this run
	tasksQuery := `SELECT id, run_id, component_name, status, attempt_count, max_attempts, error, created_at, updated_at FROM tasks WHERE run_id = ? ORDER BY component_name ASC`
	rows, err := s.db.QueryContext(ctx, tasksQuery, runID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var t domain.Task
			var tStatus, errMsg, cAt, uAt string
			if err := rows.Scan(&t.ID, &t.RunID, &t.ComponentName, &tStatus, &t.AttemptCount, &t.MaxAttempts, &errMsg, &cAt, &uAt); err == nil {
				t.Status = domain.TaskStatus(tStatus)
				t.Error = errMsg
				t.CreatedAt, _ = time.Parse(time.RFC3339Nano, cAt)
				t.UpdatedAt, _ = time.Parse(time.RFC3339Nano, uAt)
				r.Tasks = append(r.Tasks, &t)
			}
		}
	}

	return &r, nil
}

// UpdateRun updates an existing Run.
func (s *Store) UpdateRun(ctx context.Context, run *domain.Run) error {
	return s.SaveRun(ctx, run)
}

// UpdateTask updates or creates a Task in SQLite.
func (s *Store) UpdateTask(ctx context.Context, jobID string, task *domain.Task) error {
	if task == nil {
		return domain.ErrInvalidPayload
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	query := `
	INSERT INTO tasks (id, run_id, job_id, component_name, status, attempt_count, max_attempts, error, created_at, updated_at)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT(job_id, component_name) DO UPDATE SET
		status=excluded.status,
		attempt_count=excluded.attempt_count,
		max_attempts=excluded.max_attempts,
		error=excluded.error,
		updated_at=excluded.updated_at
	`
	now := time.Now().UTC().Format(time.RFC3339Nano)
	cAt := task.CreatedAt.Format(time.RFC3339Nano)
	if task.CreatedAt.IsZero() {
		cAt = now
	}

	_, err := s.db.ExecContext(ctx, query,
		task.ID,
		task.RunID,
		jobID,
		task.ComponentName,
		string(task.Status),
		task.AttemptCount,
		task.MaxAttempts,
		task.Error,
		cAt,
		now,
	)
	return err
}

// GetTasks retrieves all tasks for a job.
func (s *Store) GetTasks(ctx context.Context, jobID string) ([]*domain.Task, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	query := `SELECT id, run_id, component_name, status, attempt_count, max_attempts, error, created_at, updated_at FROM tasks WHERE job_id = ? ORDER BY component_name ASC`
	rows, err := s.db.QueryContext(ctx, query, jobID)
	if err != nil {
		return nil, fmt.Errorf("failed to query tasks: %w", err)
	}
	defer rows.Close()

	var tasks []*domain.Task
	for rows.Next() {
		var t domain.Task
		var tStatus, errMsg, cAt, uAt string
		if err := rows.Scan(&t.ID, &t.RunID, &t.ComponentName, &tStatus, &t.AttemptCount, &t.MaxAttempts, &errMsg, &cAt, &uAt); err != nil {
			return nil, err
		}
		t.Status = domain.TaskStatus(tStatus)
		t.Error = errMsg
		t.CreatedAt, _ = time.Parse(time.RFC3339Nano, cAt)
		t.UpdatedAt, _ = time.Parse(time.RFC3339Nano, uAt)
		tasks = append(tasks, &t)
	}

	return tasks, nil
}

// SaveArtifacts persists compiled artifacts into SQLite.
func (s *Store) SaveArtifacts(ctx context.Context, jobID string, artifacts []domain.CompiledArtifact) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	query := `
	INSERT INTO artifacts (job_id, target, file_name, code, group_name)
	VALUES (?, ?, ?, ?, ?)
	ON CONFLICT(job_id, target, file_name) DO UPDATE SET
		code=excluded.code,
		group_name=excluded.group_name
	`
	for _, art := range artifacts {
		_, err := s.db.ExecContext(ctx, query, jobID, string(art.Target), art.FileName, art.Code, art.Group)
		if err != nil {
			return fmt.Errorf("failed to save artifact: %w", err)
		}
	}

	_, _ = s.db.ExecContext(ctx, `UPDATE jobs SET updated_at = ? WHERE id = ?`, time.Now().UTC().Format(time.RFC3339Nano), jobID)
	return nil
}

// SaveZip persists the zip archive bytes for a job.
func (s *Store) SaveZip(ctx context.Context, jobID string, zipBytes []byte) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	query := `
	INSERT INTO job_zips (job_id, zip_data)
	VALUES (?, ?)
	ON CONFLICT(job_id) DO UPDATE SET zip_data=excluded.zip_data
	`
	_, err := s.db.ExecContext(ctx, query, jobID, zipBytes)
	return err
}

// GetZip retrieves the zip archive bytes for a job.
func (s *Store) GetZip(ctx context.Context, jobID string) ([]byte, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	query := `SELECT zip_data FROM job_zips WHERE job_id = ?`
	row := s.db.QueryRowContext(ctx, query, jobID)

	var data []byte
	err := row.Scan(&data)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrJobNotFound
		}
		return nil, fmt.Errorf("failed to get zip: %w", err)
	}

	return data, nil
}

// SavePublishResults updates the publish results for a job.
func (s *Store) SavePublishResults(ctx context.Context, jobID string, results *contracts.PublishResults) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	var pubResJSON []byte
	if results != nil {
		pubResJSON, _ = json.Marshal(results)
	}

	query := `UPDATE jobs SET publish_results_json = ?, updated_at = ? WHERE id = ?`
	now := time.Now().UTC().Format(time.RFC3339Nano)
	_, err := s.db.ExecContext(ctx, query, string(pubResJSON), now, jobID)
	return err
}

// SaveSnapshot saves a document-level tokens snapshot.
func (s *Store) SaveSnapshot(ctx context.Context, snap *domain.Snapshot) error {
	if snap == nil {
		return domain.ErrInvalidPayload
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	tokensJSON, err := json.Marshal(snap.Tokens)
	if err != nil {
		return fmt.Errorf("failed to marshal tokens: %w", err)
	}

	query := `
	INSERT INTO snapshots (id, document_name, tokens_hash, tokens_json, created_at)
	VALUES (?, ?, ?, ?, ?)
	`
	_, err = s.db.ExecContext(ctx, query, snap.ID, snap.DocumentName, snap.TokensHash, string(tokensJSON), snap.CreatedAt.Format(time.RFC3339Nano))
	return err
}

// GetLatestSnapshot returns the most recent snapshot for a document.
func (s *Store) GetLatestSnapshot(ctx context.Context, documentName string) (*domain.Snapshot, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	query := `
	SELECT id, document_name, tokens_hash, tokens_json, created_at
	FROM snapshots
	WHERE document_name = ?
	ORDER BY created_at DESC
	LIMIT 1
	`
	row := s.db.QueryRowContext(ctx, query, documentName)

	var snap domain.Snapshot
	var tokensJSON, createdAtStr string
	err := row.Scan(&snap.ID, &snap.DocumentName, &snap.TokensHash, &tokensJSON, &createdAtStr)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrJobNotFound
		}
		return nil, fmt.Errorf("failed to get latest snapshot: %w", err)
	}

	snap.CreatedAt, _ = time.Parse(time.RFC3339Nano, createdAtStr)
	_ = json.Unmarshal([]byte(tokensJSON), &snap.Tokens)
	return &snap, nil
}

// SaveComponentSnapshot stores or updates a component snapshot.
func (s *Store) SaveComponentSnapshot(ctx context.Context, compSnap *domain.ComponentSnapshot) error {
	if compSnap == nil {
		return domain.ErrInvalidPayload
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	var specJSON []byte
	if compSnap.Spec != nil {
		specJSON, _ = json.Marshal(compSnap.Spec)
	}

	query := `
	INSERT INTO component_snapshots (document_name, component_name, content_hash, spec_json, source_code, updated_at)
	VALUES (?, ?, ?, ?, ?, ?)
	ON CONFLICT(document_name, component_name) DO UPDATE SET
		content_hash = excluded.content_hash,
		spec_json = excluded.spec_json,
		source_code = excluded.source_code,
		updated_at = excluded.updated_at
	`
	_, err := s.db.ExecContext(ctx, query,
		compSnap.DocumentName,
		compSnap.ComponentName,
		compSnap.ContentHash,
		string(specJSON),
		compSnap.SourceCode,
		compSnap.UpdatedAt.Format(time.RFC3339Nano),
	)
	return err
}

// GetComponentSnapshot retrieves a specific component snapshot.
func (s *Store) GetComponentSnapshot(ctx context.Context, documentName, componentName string) (*domain.ComponentSnapshot, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var row *sql.Row
	if documentName == "" {
		query := `
		SELECT document_name, component_name, content_hash, spec_json, source_code, updated_at
		FROM component_snapshots
		WHERE component_name = ?
		ORDER BY updated_at DESC LIMIT 1
		`
		row = s.db.QueryRowContext(ctx, query, componentName)
	} else {
		query := `
		SELECT document_name, component_name, content_hash, spec_json, source_code, updated_at
		FROM component_snapshots
		WHERE document_name = ? AND component_name = ?
		`
		row = s.db.QueryRowContext(ctx, query, documentName, componentName)
	}

	var snap domain.ComponentSnapshot
	var specJSON, updatedAtStr string
	err := row.Scan(&snap.DocumentName, &snap.ComponentName, &snap.ContentHash, &specJSON, &snap.SourceCode, &updatedAtStr)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrComponentNotFound
		}
		return nil, fmt.Errorf("failed to get component snapshot: %w", err)
	}

	snap.UpdatedAt, _ = time.Parse(time.RFC3339Nano, updatedAtStr)
	if specJSON != "" {
		var spec contracts.FigmaComponentSpec
		if err := json.Unmarshal([]byte(specJSON), &spec); err == nil {
			snap.Spec = &spec
		}
	}
	return &snap, nil
}

// GetComponentSnapshots returns all component snapshots for a document.
func (s *Store) GetComponentSnapshots(ctx context.Context, documentName string) (map[string]*domain.ComponentSnapshot, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	query := `
	SELECT document_name, component_name, content_hash, spec_json, source_code, updated_at
	FROM component_snapshots
	WHERE document_name = ?
	`
	rows, err := s.db.QueryContext(ctx, query, documentName)
	if err != nil {
		return nil, fmt.Errorf("failed to query component snapshots: %w", err)
	}
	defer rows.Close()

	result := make(map[string]*domain.ComponentSnapshot)
	for rows.Next() {
		var snap domain.ComponentSnapshot
		var specJSON, updatedAtStr string
		if err := rows.Scan(&snap.DocumentName, &snap.ComponentName, &snap.ContentHash, &specJSON, &snap.SourceCode, &updatedAtStr); err != nil {
			return nil, fmt.Errorf("failed to scan component snapshot: %w", err)
		}
		snap.UpdatedAt, _ = time.Parse(time.RFC3339Nano, updatedAtStr)
		if specJSON != "" {
			var spec contracts.FigmaComponentSpec
			if err := json.Unmarshal([]byte(specJSON), &spec); err == nil {
				snap.Spec = &spec
			}
		}
		result[snap.ComponentName] = &snap
	}
	return result, rows.Err()
}

// SaveSyncPlan stores a calculated sync plan.
func (s *Store) SaveSyncPlan(ctx context.Context, plan *domain.SyncPlan) error {
	if plan == nil {
		return domain.ErrInvalidPayload
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	planJSON, err := json.Marshal(plan)
	if err != nil {
		return fmt.Errorf("failed to marshal sync plan: %w", err)
	}

	query := `
	INSERT INTO sync_plans (id, document_name, plan_json, created_at)
	VALUES (?, ?, ?, ?)
	ON CONFLICT(id) DO UPDATE SET plan_json = excluded.plan_json, created_at = excluded.created_at
	`
	_, err = s.db.ExecContext(ctx, query, plan.SyncID, plan.DocumentName, string(planJSON), plan.CreatedAt.Format(time.RFC3339Nano))
	return err
}

// GetSyncPlan retrieves a stored sync plan by ID.
func (s *Store) GetSyncPlan(ctx context.Context, syncID string) (*domain.SyncPlan, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	query := `SELECT plan_json FROM sync_plans WHERE id = ?`
	row := s.db.QueryRowContext(ctx, query, syncID)

	var planJSON string
	err := row.Scan(&planJSON)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrJobNotFound
		}
		return nil, fmt.Errorf("failed to get sync plan: %w", err)
	}

	var plan domain.SyncPlan
	if err := json.Unmarshal([]byte(planJSON), &plan); err != nil {
		return nil, fmt.Errorf("failed to unmarshal sync plan: %w", err)
	}
	return &plan, nil
}

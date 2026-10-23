package domain

import (
	"time"

	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

// TaskStatus represents the lifecycle state of an individual component task.
type TaskStatus = contracts.TaskStatus

const (
	TaskQueued    TaskStatus = contracts.Queued
	TaskAuthoring TaskStatus = contracts.Authoring
	TaskVerifying TaskStatus = contracts.Verifying
	TaskReady     TaskStatus = contracts.Ready
	TaskFailed    TaskStatus = contracts.Failed
)

// Task represents an isolated authoring and compilation task for a single component.
type Task struct {
	ID            string             `json:"id"`
	RunID         string             `json:"runId"`
	ComponentName string             `json:"componentName"`
	Status        TaskStatus         `json:"status"`
	AttemptCount  int                `json:"attemptCount"`
	MaxAttempts   int                `json:"maxAttempts"`
	Error         string             `json:"error,omitempty"`
	Artifacts     []CompiledArtifact `json:"artifacts,omitempty"`
	CreatedAt     time.Time          `json:"createdAt"`
	UpdatedAt     time.Time          `json:"updatedAt"`
}

// RunStatus represents the state of a complete execution run.
type RunStatus string

const (
	RunQueued    RunStatus = "queued"
	RunRunning   RunStatus = "running"
	RunSucceeded RunStatus = "succeeded"
	RunFailed    RunStatus = "failed"
)

// Run represents a holistic authoring session containing component tasks.
type Run struct {
	ID         string     `json:"id"`
	JobID      string     `json:"jobId"`
	Status     RunStatus  `json:"status"`
	Tasks      []*Task    `json:"tasks"`
	CreatedAt  time.Time  `json:"createdAt"`
	FinishedAt *time.Time `json:"finishedAt,omitempty"`
}

// TaskStatusToComponentStatus maps granular TaskStatus to contracts.ComponentStatus.
func TaskStatusToComponentStatus(ts TaskStatus) contracts.ComponentStatus {
	switch ts {
	case TaskQueued:
		return contracts.ComponentStatusPending
	case TaskAuthoring:
		return contracts.ComponentStatusAuthoring
	case TaskVerifying:
		return contracts.ComponentStatusCompiling
	case TaskReady:
		return contracts.ComponentStatusDone
	case TaskFailed:
		return contracts.ComponentStatusFailed
	default:
		return contracts.ComponentStatusPending
	}
}

// ToContract converts a domain Task to contracts.ComponentTask.
func (t *Task) ToContract() contracts.ComponentTask {
	runID := t.RunID
	attemptCount := t.AttemptCount
	maxAttempts := t.MaxAttempts
	createdAt := t.CreatedAt
	updatedAt := t.UpdatedAt

	ct := contracts.ComponentTask{
		Id:            t.ID,
		ComponentName: t.ComponentName,
		Status:        t.Status,
		RunId:         &runID,
		AttemptCount:  &attemptCount,
		MaxAttempts:   &maxAttempts,
		CreatedAt:     &createdAt,
		UpdatedAt:     &updatedAt,
	}
	if t.Error != "" {
		errStr := t.Error
		ct.Error = &errStr
	}
	return ct
}

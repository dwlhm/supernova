package domain

import (
	"time"

	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

// CompiledArtifact represents a single framework-specific file compiled by Mitosis.
type CompiledArtifact struct {
	Target   contracts.Framework `json:"target"`
	FileName string              `json:"fileName"`
	Code     string              `json:"code"`
	Group    string              `json:"group,omitempty"`
}

// Job represents the domain state of an extraction and code generation process.
type Job struct {
	ID             string                        `json:"id"`
	DocumentName   string                        `json:"documentName"`
	Document       contracts.FigmaDocument       `json:"document"`
	Options        *contracts.ExtractionOptions  `json:"options,omitempty"`
	Targets        []contracts.Framework         `json:"targets"`
	Publishers     []contracts.PublisherType     `json:"publishers"`
	Status         contracts.JobStatus           `json:"status"`
	Components     []contracts.ComponentProgress `json:"components"`
	Artifacts      []CompiledArtifact            `json:"artifacts,omitempty"`
	PublishResults *contracts.PublishResults     `json:"publishResults,omitempty"`
	CreatedAt      time.Time                     `json:"createdAt"`
	UpdatedAt      time.Time                     `json:"updatedAt"`
	Error          *contracts.StageError         `json:"error,omitempty"`
}

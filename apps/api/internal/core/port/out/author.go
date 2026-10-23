package out

import (
	"context"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

// AuthorRequest defines the payload for holistic design system authoring.
type AuthorRequest struct {
	ComponentName          string                         `json:"componentName,omitempty"`
	Components             []contracts.FigmaComponentSpec `json:"components"`
	Tokens                 []contracts.FigmaToken         `json:"tokens"`
	ExistingSource         string                         `json:"existingSource,omitempty"`
	FeedbackNotes          string                         `json:"feedbackNotes,omitempty"`
	CompileOnly            bool                           `json:"compileOnly,omitempty"`
	ExistingComponentNames []string                       `json:"existingComponentNames"`
	WorkspaceDir           string                         `json:"workspaceDir,omitempty"`
	Targets                []contracts.Framework          `json:"targets,omitempty"`
	TokenClasses           []string                       `json:"tokenClasses,omitempty"`
}

// DiscoveredToken represents a new design token discovered by the authoring agent.
type DiscoveredToken struct {
	Name        string `json:"name"`
	Type        string `json:"type"`
	Value       any    `json:"value"`
	Description string `json:"description,omitempty"`
}

// AuthorResult contains the authored components, groups, compiled artifacts, and discovered tokens.
type AuthorResult struct {
	Components      map[string]string         `json:"components"`
	ComponentGroups map[string]string         `json:"componentGroups,omitempty"`
	Artifacts       []domain.CompiledArtifact `json:"artifacts,omitempty"`
	NewTokens       []DiscoveredToken         `json:"newTokens,omitempty"`
}

// MitosisAuthor defines the port for holistic design system authoring via LLM.
type MitosisAuthor interface {
	AuthorDesignSystem(ctx context.Context, req AuthorRequest) (*AuthorResult, error)
}

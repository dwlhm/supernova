package domain

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"sort"
	"time"

	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

// Snapshot represents a persisted state of a document and its design tokens.
type Snapshot struct {
	ID           string                 `json:"id"`
	DocumentName string                 `json:"documentName"`
	TokensHash   string                 `json:"tokensHash"`
	Tokens       []contracts.FigmaToken `json:"tokens"`
	CreatedAt    time.Time              `json:"createdAt"`
}

// ComponentSnapshot represents a persisted state and latest source code of a component.
type ComponentSnapshot struct {
	DocumentName  string                        `json:"documentName"`
	ComponentName string                        `json:"componentName"`
	ContentHash   string                        `json:"contentHash"`
	Spec          *contracts.FigmaComponentSpec `json:"spec,omitempty"`
	SourceCode    string                        `json:"sourceCode,omitempty"` // Mitosis .lite.tsx source
	UpdatedAt     time.Time                     `json:"updatedAt"`
}

// SyncPlan represents the calculated diff plan before execution.
type SyncPlan struct {
	SyncID       string                       `json:"syncId"`
	DocumentName string                       `json:"documentName"`
	Summary      contracts.SyncSummary        `json:"summary"`
	Components   []contracts.ComponentDiff    `json:"components"`
	Tokens       contracts.TokenDiff          `json:"tokens"`
	CreatedAt    time.Time                    `json:"createdAt"`
	Document     *contracts.FigmaDocument     `json:"document,omitempty"`
	Targets      []contracts.Framework        `json:"targets,omitempty"`
	Publishers   []contracts.PublisherType    `json:"publishers,omitempty"`
	Options      *contracts.ExtractionOptions `json:"options,omitempty"`
}

// HashComponentSpec returns a deterministic SHA-256 hash of a FigmaComponentSpec.
func HashComponentSpec(spec contracts.FigmaComponentSpec) string {
	// Normalize name
	normalizedSpec := spec
	normalizedSpec.Name = NormalizeComponentName(spec.Name)

	raw, err := json.Marshal(normalizedSpec)
	if err != nil {
		h := sha256.Sum256([]byte(normalizedSpec.Name))
		return hex.EncodeToString(h[:])
	}
	h := sha256.Sum256(raw)
	return hex.EncodeToString(h[:])
}

// HashTokens returns a deterministic SHA-256 hash of a slice of FigmaToken.
// It sorts tokens by name to guarantee identical output regardless of input slice order.
func HashTokens(tokens []contracts.FigmaToken) string {
	if len(tokens) == 0 {
		return ""
	}

	sorted := make([]contracts.FigmaToken, len(tokens))
	copy(sorted, tokens)
	sort.Slice(sorted, func(i, j int) bool {
		return sorted[i].Name < sorted[j].Name
	})

	raw, err := json.Marshal(sorted)
	if err != nil {
		return ""
	}
	h := sha256.Sum256(raw)
	return hex.EncodeToString(h[:])
}

package author

import (
	"context"
	"fmt"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

// DevMockAuthor implements out.MitosisAuthor for fast local dev/debug mode without invoking external LLMs.
type DevMockAuthor struct{}

var _ out.MitosisAuthor = (*DevMockAuthor)(nil)

// NewDevMockAuthor creates a new DevMockAuthor.
func NewDevMockAuthor() *DevMockAuthor {
	return &DevMockAuthor{}
}

// AuthorDesignSystem returns a deterministic valid component template immediately.
func (m *DevMockAuthor) AuthorDesignSystem(ctx context.Context, req out.AuthorRequest) (*out.AuthorResult, error) {
	compName := req.ComponentName
	if compName == "" && len(req.Components) > 0 {
		compName = domain.NormalizeComponentName(req.Components[0].Name)
	}
	if compName == "" {
		compName = "Component"
	}

	code := req.ExistingSource
	if code == "" {
		code = fmt.Sprintf("export default function %s(props: any) {\n  return <div className=\"p-4 rounded border\">%s Component (Dev Mock)</div>;\n}\n", compName, compName)
	}

	return &out.AuthorResult{
		Components: map[string]string{
			compName: code,
		},
		Artifacts: []domain.CompiledArtifact{
			{
				Target:   contracts.Framework("mitosis"),
				FileName: compName + ".lite.tsx",
				Group:    domain.GroupComponents,
				Code:     code,
			},
		},
	}, nil
}

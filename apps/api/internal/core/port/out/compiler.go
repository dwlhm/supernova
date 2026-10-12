package out

import (
	"context"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

// MitosisCompiler defines the port for compiling Mitosis component source into framework-specific artifacts.
// If compilation issues occur, compileErrors will contain the diagnostic messages for the repair loop.
type MitosisCompiler interface {
	Compile(ctx context.Context, componentName string, source string, targets []contracts.Framework) ([]domain.CompiledArtifact, []string, error)
}

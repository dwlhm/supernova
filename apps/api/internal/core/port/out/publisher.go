package out

import (
	"context"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
)

// ArtifactPublisher defines the port for publishing compiled component artifacts.
type ArtifactPublisher interface {
	Name() string
	Publish(ctx context.Context, job *domain.Job) error
}

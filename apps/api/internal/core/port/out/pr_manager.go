package out

import (
	"context"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
)

// PullRequestManager defines the port for interacting with pull requests and their branches.
type PullRequestManager interface {
	// GetPullRequestBranch retrieves the head branch name for a given pull request.
	GetPullRequestBranch(ctx context.Context, owner, repo string, prNumber int) (string, error)

	// GetFileContent retrieves the raw text content of a file at a specific branch or commit ref.
	GetFileContent(ctx context.Context, owner, repo, filePath, ref string) (string, error)

	// CommitArtifacts writes artifacts to the specified branch and returns the new commit SHA.
	CommitArtifacts(ctx context.Context, owner, repo, branch string, artifacts []domain.CompiledArtifact, message string) (string, error)

	// CreateComment posts a feedback or status comment on a pull request.
	CreateComment(ctx context.Context, owner, repo string, prNumber int, comment string) error
}

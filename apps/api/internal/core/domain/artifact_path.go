package domain

import (
	"errors"
	"fmt"
	"path"
	"regexp"
	"strings"

	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

// Artifact groups determine the source directory a component is published under.
const (
	GroupComponents = "components"
	GroupIcons      = "icons"
)

var (
	// ErrUnsafeArtifact marks an artifact whose name or group could escape its target directory.
	ErrUnsafeArtifact = errors.New("unsafe artifact path")
	// ErrUnpublishedTarget marks artifacts (e.g. framework previews) that are never published.
	ErrUnpublishedTarget = errors.New("artifact target is not published")

	reComponentName = regexp.MustCompile(`^[A-Z][A-Za-z0-9]{0,63}$`)
	reFileName      = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$`)
)

// ValidComponentName reports whether name is a PascalCase identifier safe for code and paths.
func ValidComponentName(name string) bool {
	return reComponentName.MatchString(name)
}

// ValidFileName reports whether name is a bare file name with no directory or traversal parts.
func ValidFileName(name string) bool {
	return reFileName.MatchString(name) && !strings.Contains(name, "..")
}

// NormalizeGroup maps a raw group to a known group, or "" when it is not recognised.
func NormalizeGroup(raw string) string {
	switch g := strings.ToLower(strings.TrimSpace(raw)); g {
	case GroupComponents, GroupIcons:
		return g
	default:
		return ""
	}
}

// ArtifactPath is the single source of truth for where an artifact lives in a published
// repository tree (PR) or archive (ZIP). It never returns a path outside the tree.
func ArtifactPath(art CompiledArtifact) (string, error) {
	if !ValidFileName(art.FileName) {
		return "", fmt.Errorf("%w: file name %q", ErrUnsafeArtifact, art.FileName)
	}
	var dir string
	switch art.Target {
	case contracts.Mitosis:
		group := GroupComponents
		if art.Group != "" {
			if group = NormalizeGroup(art.Group); group == "" {
				return "", fmt.Errorf("%w: group %q", ErrUnsafeArtifact, art.Group)
			}
		}
		if art.FileName == "utils.ts" {
			group = GroupComponents
		}
		dir = "src/" + group
	case contracts.Framework("tokens"):
		dir = "src/tokens"
	case contracts.Framework("docs"):
		dir = "docs/components"
		if art.FileName == "tokens.md" {
			dir = "docs"
		}
	case contracts.Framework("figma"):
		dir = "."
	default:
		return "", ErrUnpublishedTarget
	}
	return path.Clean(path.Join(dir, art.FileName)), nil
}

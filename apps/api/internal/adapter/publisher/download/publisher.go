package download

import (
	"archive/zip"
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"log/slog"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

// DownloadPublisher implements out.ArtifactPublisher to package artifacts into a zip file.
type DownloadPublisher struct {
	store out.JobStore
}

var _ out.ArtifactPublisher = (*DownloadPublisher)(nil)

// NewPublisher creates a new DownloadPublisher.
func NewPublisher(store out.JobStore) *DownloadPublisher {
	return &DownloadPublisher{
		store: store,
	}
}

// Name returns the identifier for this publisher.
func (p *DownloadPublisher) Name() string {
	return string(contracts.Download)
}

// Publish creates a zip archive in memory and saves it to the store.
func (p *DownloadPublisher) Publish(ctx context.Context, job *domain.Job) error {
	slog.Info(fmt.Sprintf("[DOWNLOAD] [%s] Generating zip archive with %d file(s)...", job.ID, len(job.Artifacts)))

	var buf bytes.Buffer
	zw := zip.NewWriter(&buf)
	seenZipPaths := make(map[string]bool)

	for _, art := range job.Artifacts {
		entryPath, err := domain.ArtifactPath(art)
		if errors.Is(err, domain.ErrUnpublishedTarget) {
			continue
		}
		if err != nil {
			slog.Error(fmt.Sprintf("[DOWNLOAD] [ERROR] [%s] Refusing artifact: %v", job.ID, err))
			return err
		}

		if seenZipPaths[entryPath] {
			continue
		}
		seenZipPaths[entryPath] = true

		w, err := zw.Create(entryPath)
		if err != nil {
			wrapErr := fmt.Errorf("failed to create zip entry %s: %w", entryPath, err)
			slog.Error(fmt.Sprintf("[DOWNLOAD] [ERROR] [%s] Failed to create zip: %v", job.ID, wrapErr))
			return wrapErr
		}
		if _, err := io.WriteString(w, art.Code); err != nil {
			wrapErr := fmt.Errorf("failed to write zip entry %s: %w", entryPath, err)
			slog.Error(fmt.Sprintf("[DOWNLOAD] [ERROR] [%s] Failed to create zip: %v", job.ID, wrapErr))
			return wrapErr
		}
	}

	if err := zw.Close(); err != nil {
		wrapErr := fmt.Errorf("failed to finalize zip archive: %w", err)
		slog.Error(fmt.Sprintf("[DOWNLOAD] [ERROR] [%s] Failed to create zip: %v", job.ID, wrapErr))
		return wrapErr
	}

	if err := p.store.SaveZip(ctx, job.ID, buf.Bytes()); err != nil {
		wrapErr := fmt.Errorf("failed to save zip archive to store: %w", err)
		slog.Error(fmt.Sprintf("[DOWNLOAD] [ERROR] [%s] Failed to create zip: %v", job.ID, wrapErr))
		return wrapErr
	}

	if job.PublishResults == nil {
		job.PublishResults = &contracts.PublishResults{}
	}
	downloadURL := fmt.Sprintf("/v1/jobs/%s/download", job.ID)
	job.PublishResults.DownloadUrl = &downloadURL

	if err := p.store.SavePublishResults(ctx, job.ID, job.PublishResults); err != nil {
		wrapErr := fmt.Errorf("failed to save publish results: %w", err)
		slog.Error(fmt.Sprintf("[DOWNLOAD] [ERROR] [%s] Failed to create zip: %v", job.ID, wrapErr))
		return wrapErr
	}

	slog.Info(fmt.Sprintf("[DOWNLOAD] [%s] Zip archive created (%d bytes, url: %s)", job.ID, buf.Len(), downloadURL))
	return nil
}

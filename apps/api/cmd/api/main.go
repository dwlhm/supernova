package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	authoradapter "github.com/dwlhm/supernova/apps/api/internal/adapter/author"
	httpadapter "github.com/dwlhm/supernova/apps/api/internal/adapter/http"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/memstore"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/nodecli"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/publisher/download"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/publisher/github"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/sqlite"
	"github.com/dwlhm/supernova/apps/api/internal/config"
	"github.com/dwlhm/supernova/apps/api/internal/core/app"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	"github.com/dwlhm/supernova/apps/api/internal/infra/logger"
)

func main() {
	logger.Init(slog.LevelInfo)

	cfg, err := loadConfig()
	if err != nil {
		slog.Error("invalid configuration", "error", err)
		os.Exit(1)
	}
	logConfig(cfg)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	if err := run(ctx, newServer(cfg)); err != nil {
		slog.Error("server stopped with error", "error", err)
		os.Exit(1)
	}
	slog.Info("Server stopped cleanly")
}

func loadConfig() (config.Config, error) {
	cwd, err := os.Getwd()
	if err != nil {
		return config.Config{}, err
	}
	root := config.FindRepoRoot(cwd)
	if root != "" {
		if err := config.LoadDotEnv(filepath.Join(root, ".env")); err != nil {
			return config.Config{}, fmt.Errorf("load .env: %w", err)
		}
	}
	return config.Load(os.Getenv, root)
}

func logConfig(cfg config.Config) {
	slog.Info("Supernova API configured",
		"port", cfg.Port,
		"auth_enabled", cfg.APIToken != "",
		"author_bin", cfg.AuthorBin,
		"compiler_bin", cfg.CompilerBin,
		"extractions_dir", cfg.ExtractionsDir,
		"docs_dir", cfg.DocsDir,
		"generated_dir", cfg.GeneratedDir,
		"node_read_paths", cfg.NodeReadPaths,
		"github_repo", cfg.GitHub.Repo,
		"github_token_set", cfg.GitHub.Token != "",
		"github_base_branch", cfg.GitHub.BaseBranch,
	)
	if cfg.APIToken == "" {
		slog.Warn("AUTH DISABLED via SUPERNOVA_INSECURE_NO_AUTH=true — never use this outside local development")
	}
}

func newServer(cfg config.Config) *http.Server {
	var store out.JobStore
	if cfg.DatabasePath != "" {
		if err := os.MkdirAll(filepath.Dir(cfg.DatabasePath), 0o755); err != nil {
			slog.Warn("failed to create db directory, using memstore", "error", err)
			store = memstore.New()
		} else {
			sqlStore, err := sqlite.New(cfg.DatabasePath)
			if err != nil {
				slog.Warn("failed to open sqlite database, using memstore", "error", err)
				store = memstore.New()
			} else {
				slog.Info("SQLite database initialized", "path", cfg.DatabasePath)
				store = sqlStore
			}
		}
	} else {
		store = memstore.New()
	}
	sandbox := nodecli.Sandbox{ReadPaths: cfg.NodeReadPaths}
	publishers := []out.ArtifactPublisher{
		download.NewPublisher(store),
		github.NewPublisher(cfg.GitHub.Token, cfg.GitHub.Repo, cfg.GitHub.BaseBranch, store),
	}
	var author out.MitosisAuthor
	if cfg.DevMockLLM {
		slog.Warn("Running in DEV MOCK LLM mode: authoring will use fast deterministic mock components (SUPERNOVA_DEV_MOCK_LLM=true)")
		author = authoradapter.NewDevMockAuthor()
	} else {
		author = authoradapter.NewCLIAuthor(cfg.AuthorBin, sandbox)
	}

	svc := app.NewService(
		store,
		author,
		publishers,
		app.Paths{ExtractionsDir: cfg.ExtractionsDir, DocsDir: cfg.DocsDir, GeneratedDir: cfg.GeneratedDir},
	)
	return &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      httpadapter.NewRouter(svc, cfg.APIToken, cfg.GitHub.WebhookSecret),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}
}

// run serves until ctx is cancelled, then shuts the HTTP server down gracefully.
func run(ctx context.Context, server *http.Server) error {
	errCh := make(chan error, 1)
	go func() {
		slog.Info("Starting Supernova API server", "addr", server.Addr)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
		close(errCh)
	}()

	select {
	case err := <-errCh:
		return err
	case <-ctx.Done():
	}

	slog.Info("Shutting down server gracefully...")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return server.Shutdown(shutdownCtx)
}

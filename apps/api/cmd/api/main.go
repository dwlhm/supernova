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
	"strings"
	"syscall"
	"time"

	authoradapter "github.com/dwlhm/supernova/apps/api/internal/adapter/author"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/compiler"
	httpadapter "github.com/dwlhm/supernova/apps/api/internal/adapter/http"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/memstore"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/publisher/download"
	"github.com/dwlhm/supernova/apps/api/internal/adapter/publisher/github"
	"github.com/dwlhm/supernova/apps/api/internal/core/app"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	"github.com/dwlhm/supernova/apps/api/internal/infra/logger"
)

func main() {
	logger.Init(slog.LevelInfo)

	loadDotEnv(".env", "../.env", "../../.env")

	port := getEnv("PORT", "8080")
	apiToken := getEnv("API_TOKEN", "")
	compilerBin := getEnv("COMPILER_BIN", "../../packages/mitosis-compiler/bin/cli.js")
	authorBin := getEnv("AUTHOR_BIN", "../../packages/mitosis-author/dist/cli.js")
	githubToken := getEnv("GITHUB_TOKEN", "")
	githubRepo := getEnv("GITHUB_REPO", "")
	githubBaseBranch := getEnv("GITHUB_BASE_BRANCH", "main")

	slog.Info("==================================================")
	slog.Info("  SUPERNOVA API SERVER STARTING")
	slog.Info("==================================================")
	slog.Info(fmt.Sprintf("Config: PORT=%s", port))
	slog.Info(fmt.Sprintf("Config: API_TOKEN=%s", logger.MaskSecret(apiToken)))
	slog.Info(fmt.Sprintf("Config: COMPILER_BIN=%s", compilerBin))
	slog.Info(fmt.Sprintf("Config: AUTHOR_BIN=%s", authorBin))
	slog.Info(fmt.Sprintf("Config: GITHUB_REPO=%s", githubRepo))
	slog.Info(fmt.Sprintf("Config: GITHUB_TOKEN=%s", logger.MaskSecret(githubToken)))
	slog.Info(fmt.Sprintf("Config: GITHUB_BASE_BRANCH=%s", githubBaseBranch))
	slog.Info("==================================================")

	if _, err := os.Stat(compilerBin); err != nil {
		if alt := "packages/mitosis-compiler/bin/cli.js"; fileExists(alt) {
			compilerBin = alt
		} else {
			slog.Warn(fmt.Sprintf("Warning: COMPILER_BIN %q not found: %v", compilerBin, err))
		}
	}
	if abs, err := filepath.Abs(compilerBin); err == nil {
		compilerBin = abs
	}

	if _, err := os.Stat(authorBin); err != nil {
		if alt := "packages/mitosis-author/dist/cli.js"; fileExists(alt) {
			authorBin = alt
		} else {
			slog.Warn(fmt.Sprintf("Warning: AUTHOR_BIN %q not found: %v", authorBin, err))
		}
	}
	if abs, err := filepath.Abs(authorBin); err == nil {
		authorBin = abs
	}

	authorAdapter := authoradapter.NewCLIAuthor(authorBin)
	compilerAdapter := compiler.NewCLICompiler(compilerBin)
	store := memstore.New()

	downloadPub := download.NewPublisher(store)
	githubPub := github.NewPublisher(githubToken, githubRepo, githubBaseBranch, store)

	publishers := []out.ArtifactPublisher{
		downloadPub,
		githubPub,
	}

	svc := app.NewService(store, authorAdapter, compilerAdapter, publishers)
	router := httpadapter.NewRouter(svc, apiToken)

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	go func() {
		slog.Info(fmt.Sprintf("Starting Supernova API server on port %s", port))
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error(fmt.Sprintf("Server failed to start: %v", err))
			os.Exit(1)
		}
	}()

	<-stop
	slog.Info("Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		slog.Error(fmt.Sprintf("Server forced to shutdown: %v", err))
		os.Exit(1)
	}

	slog.Info("Server stopped cleanly")
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func fileExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && !info.IsDir()
}

func loadDotEnv(filenames ...string) {
	for _, filename := range filenames {
		data, err := os.ReadFile(filename)
		if err != nil {
			continue
		}
		lines := strings.Split(string(data), "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			parts := strings.SplitN(line, "=", 2)
			if len(parts) == 2 {
				key := strings.TrimSpace(parts[0])
				val := strings.TrimSpace(parts[1])
				val = strings.Trim(val, `"'`)
				if os.Getenv(key) == "" {
					os.Setenv(key, val)
				}
			}
		}
	}
}

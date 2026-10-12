package app

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/in"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
	"github.com/google/uuid"
)

const (
	defaultMaxRetries  = 2
	defaultConcurrency = 4
)

// Service implements the inbound Service port orchestrating the extraction lifecycle.
type Service struct {
	store       out.JobStore
	author      out.MitosisAuthor
	compiler    out.MitosisCompiler
	publishers  map[string]out.ArtifactPublisher
	maxRetries  int
	concurrency int
}

var _ in.Service = (*Service)(nil)

// NewService creates a new extraction application service.
func NewService(
	store out.JobStore,
	author out.MitosisAuthor,
	compiler out.MitosisCompiler,
	publishers []out.ArtifactPublisher,
) *Service {
	pubMap := make(map[string]out.ArtifactPublisher, len(publishers))
	for _, p := range publishers {
		pubMap[p.Name()] = p
	}

	return &Service{
		store:       store,
		author:      author,
		compiler:    compiler,
		publishers:  pubMap,
		maxRetries:  defaultMaxRetries,
		concurrency: defaultConcurrency,
	}
}

// SetConcurrency overrides default worker pool concurrency limit (useful for testing).
func (s *Service) SetConcurrency(concurrency int) {
	if concurrency > 0 {
		s.concurrency = concurrency
	}
}

// SetMaxRetries overrides default repair loop retries (useful for testing).
func (s *Service) SetMaxRetries(retries int) {
	s.maxRetries = retries
}

func getExtractionsDir() string {
	if dir := os.Getenv("EXTRACTIONS_DIR"); dir != "" {
		return dir
	}
	return "var/extractions"
}

// SubmitExtraction validates and enqueues a new extraction request, launching asynchronous processing.
func (s *Service) SubmitExtraction(ctx context.Context, req contracts.ExtractionRequest) (string, error) {
	if len(req.Document.Components) == 0 {
		return "", domain.ErrInvalidPayload
	}

	targets := []contracts.Framework{
		contracts.Mitosis,
	}
	if req.Targets != nil && len(*req.Targets) > 0 {
		targets = *req.Targets
	}

	publishers := []contracts.PublisherType{
		contracts.Download,
	}
	if req.Publishers != nil && len(*req.Publishers) > 0 {
		publishers = *req.Publishers
	}

	componentsProgress := make([]contracts.ComponentProgress, len(req.Document.Components))
	for i, comp := range req.Document.Components {
		compName := domain.NormalizeComponentName(comp.Name)
		compGroup := resolveComponentGroup("", compName, comp)
		componentsProgress[i] = contracts.ComponentProgress{
			Name:   compName,
			Status: contracts.ComponentStatusPending,
			Group:  &compGroup,
		}
	}

	jobID := uuid.New().String()
	now := time.Now().UTC()

	job := &domain.Job{
		ID:             jobID,
		DocumentName:   req.Document.Name,
		Document:       req.Document,
		Options:        req.Options,
		Targets:        targets,
		Publishers:     publishers,
		Status:         contracts.JobStatusQueued,
		Components:     componentsProgress,
		Artifacts:      make([]domain.CompiledArtifact, 0),
		PublishResults: &contracts.PublishResults{},
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	extractionsDir := getExtractionsDir()
	if err := os.MkdirAll(extractionsDir, 0755); err == nil {
		if data, err := json.MarshalIndent(req, "", "  "); err == nil {
			jobFile := filepath.Join(extractionsDir, fmt.Sprintf("%s.json", jobID))
			latestFile := filepath.Join(extractionsDir, "latest.json")
			if writeErr := os.WriteFile(jobFile, data, 0644); writeErr != nil {
				slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to persist extraction payload to %s: %v", jobID, jobFile, writeErr))
			} else {
				_ = os.WriteFile(latestFile, data, 0644)
				slog.Info(fmt.Sprintf("[JOB] [%s] Persisted extraction payload to %s and latest.json", jobID, jobFile))
			}
		}
	}

	if err := s.store.Save(ctx, job); err != nil {
		return "", fmt.Errorf("failed to save initial job: %w", err)
	}

	slog.Info(fmt.Sprintf("[JOB] [%s] Extraction job enqueued: doc=%s components=%d targets=%v publishers=%v",
		jobID, req.Document.Name, len(req.Document.Components), targets, publishers))

	go s.processJob(context.Background(), jobID)

	return jobID, nil
}

// ReplayExtraction reads a previously persisted extraction request from disk and enqueues a new job.
func (s *Service) ReplayExtraction(ctx context.Context, fileOrJobID string) (string, error) {
	extractionsDir := getExtractionsDir()
	var targetPath string

	trimmed := strings.TrimSpace(fileOrJobID)
	if trimmed == "" || trimmed == "latest" {
		targetPath = filepath.Join(extractionsDir, "latest.json")
	} else if strings.HasSuffix(trimmed, ".json") || strings.Contains(trimmed, string(filepath.Separator)) {
		targetPath = trimmed
	} else {
		targetPath = filepath.Join(extractionsDir, fmt.Sprintf("%s.json", trimmed))
	}

	data, err := os.ReadFile(targetPath)
	if err != nil {
		return "", fmt.Errorf("extraction file not found: %w", err)
	}

	var req contracts.ExtractionRequest
	if err := json.Unmarshal(data, &req); err != nil {
		return "", fmt.Errorf("failed to parse persisted extraction payload: %w", err)
	}

	slog.Info(fmt.Sprintf("[REPLAY] Replaying extraction from %s (doc=%s, components=%d)", targetPath, req.Document.Name, len(req.Document.Components)))
	return s.SubmitExtraction(ctx, req)
}

// GetJob retrieves an extraction job by its identifier.
func (s *Service) GetJob(ctx context.Context, jobID string) (*domain.Job, error) {
	return s.store.Get(ctx, jobID)
}

// GetDownloadZip retrieves the generated zip archive for a succeeded extraction job.
func (s *Service) GetDownloadZip(ctx context.Context, jobID string) ([]byte, error) {
	job, err := s.store.Get(ctx, jobID)
	if err != nil {
		return nil, err
	}

	if job.Status != contracts.JobStatusSucceeded {
		return nil, domain.ErrJobNotFinished
	}

	zipBytes, err := s.store.GetZip(ctx, jobID)
	if err != nil {
		return nil, err
	}
	if len(zipBytes) == 0 {
		return nil, domain.ErrJobNotFinished
	}

	return zipBytes, nil
}

// ExecuteJob drives the lifecycle of an extraction: holistic authoring -> token resolution -> publishing.
func (s *Service) ExecuteJob(ctx context.Context, jobID string) {
	job, err := s.store.Get(ctx, jobID)
	if err != nil {
		slog.Error(fmt.Sprintf("[JOB] [ERROR] [%s] Failed to fetch job from store: %v", jobID, err))
		return
	}

	if err := s.store.UpdateStatus(ctx, jobID, contracts.JobStatusAuthoring, nil); err != nil {
		slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to update status to Authoring: %v", jobID, err))
	}

	totalComponents := len(job.Document.Components)
	slog.Info(fmt.Sprintf("[JOB] [%s] Processing started for %d component(s)", jobID, totalComponents))

	// Mark all components as Authoring initially
	for _, compSpec := range job.Document.Components {
		compName := domain.NormalizeComponentName(compSpec.Name)
		compGroup := resolveComponentGroup("", compName, compSpec)
		if err := s.store.UpdateComponent(ctx, jobID, contracts.ComponentProgress{
			Name:   compName,
			Status: contracts.ComponentStatusAuthoring,
			Group:  &compGroup,
		}); err != nil {
			slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] [%s] Failed to update component status to authoring: %v", jobID, compName, err))
		}
	}

	// Retrieve existing component information from PullRequest publisher, if supported
	var existingNames []string
	var workspaceDir string
	if pub, ok := s.publishers[string(contracts.PullRequest)]; ok {
		if infoReader, ok := pub.(interface {
			GetExistingComponentInfo(ctx context.Context) ([]string, string, func(), error)
		}); ok {
			names, wsDir, cleanup, err := infoReader.GetExistingComponentInfo(ctx)
			if err != nil {
				slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to get existing component info: %v", jobID, err))
			} else {
				if cleanup != nil {
					defer cleanup()
				}
				existingNames = names
				workspaceDir = wsDir
				slog.Info(fmt.Sprintf("[JOB] [%s] Found %d existing component(s), workspaceDir=%s", jobID, len(existingNames), workspaceDir))
			}
		}
	}

	// Request holistic design system authoring
	slog.Info(fmt.Sprintf("[JOB] [%s] Requesting holistic authoring for %d component(s)...", jobID, totalComponents))
	authorReq := out.AuthorRequest{
		Components:             job.Document.Components,
		Tokens:                 job.Document.Tokens,
		ExistingComponentNames: existingNames,
		WorkspaceDir:           workspaceDir,
		Targets:                job.Targets,
		TokenClasses:           ExtractTailwindUtilityClasses(job.Document.Tokens),
	}

	result, authorErr := s.author.AuthorDesignSystem(ctx, authorReq)
	if authorErr != nil {
		slog.Error(fmt.Sprintf("[JOB] [ERROR] [%s] Authoring failed: %v", jobID, authorErr))
		stageErr := &contracts.StageError{
			Stage:   "authoring",
			Message: authorErr.Error(),
		}
		for _, compSpec := range job.Document.Components {
			compName := domain.NormalizeComponentName(compSpec.Name)
			compGroup := resolveComponentGroup("", compName, compSpec)
			_ = s.store.UpdateComponent(ctx, jobID, contracts.ComponentProgress{
				Name:       compName,
				Status:     contracts.ComponentStatusFailed,
				Group:      &compGroup,
				StageError: stageErr,
			})
		}
		if err := s.store.UpdateStatus(ctx, jobID, contracts.JobStatusFailed, stageErr); err != nil {
			slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to update status to failed: %v", jobID, err))
		}
		return
	}

	// 1. Merge discovered new tokens into catalog
	if len(result.NewTokens) > 0 {
		var tokensMu sync.Mutex
		tokensMu.Lock()
		existingTokenNames := make(map[string]struct{}, len(job.Document.Tokens))
		for _, tok := range job.Document.Tokens {
			existingTokenNames[tok.Name] = struct{}{}
		}
		hasNew := false
		for _, tok := range result.NewTokens {
			if _, exists := existingTokenNames[tok.Name]; !exists {
				existingTokenNames[tok.Name] = struct{}{}
				var desc *string
				if tok.Description != "" {
					d := tok.Description
					desc = &d
				}
				job.Document.Tokens = append(job.Document.Tokens, contracts.FigmaToken{
					Id:          uuid.NewString()[:8],
					Name:        tok.Name,
					Type:        tok.Type,
					Value:       tok.Value,
					Description: desc,
				})
				hasNew = true
			}
		}
		tokensMu.Unlock()

		if hasNew {
			slog.Info(fmt.Sprintf("[JOB] [%s] Discovered %d new design token(s)", jobID, len(result.NewTokens)))
			if currentJob, err := s.store.Get(ctx, jobID); err == nil {
				currentJob.Document.Tokens = job.Document.Tokens
				_ = s.store.Update(ctx, currentJob)
			} else {
				_ = s.store.Update(ctx, job)
			}
		}
	}

	// 2. Prepare and save artifacts
	artifacts := result.Artifacts
	if len(artifacts) == 0 && len(result.Components) > 0 {
		for compName, code := range result.Components {
			rawGroup := ""
			if result.ComponentGroups != nil {
				rawGroup = result.ComponentGroups[compName]
			}
			compGroup := resolveComponentGroup(rawGroup, compName, contracts.FigmaComponentSpec{Name: compName})
			artifacts = append(artifacts, domain.CompiledArtifact{
				Target:   contracts.Framework("mitosis"),
				FileName: compName + ".lite.tsx",
				Code:     code,
				Group:    compGroup,
			})
		}
	}

	// Ensure group is resolved on all component artifacts
	for i := range artifacts {
		if artifacts[i].Group == "" && result.ComponentGroups != nil {
			baseName := strings.Split(artifacts[i].FileName, ".")[0]
			if g, ok := result.ComponentGroups[baseName]; ok {
				artifacts[i].Group = domain.CamelToKebab(strings.ToLower(strings.TrimSpace(g)))
			}
		}
	}

	// Deterministic deduplication: ensure utils.ts is emitted into artifacts exactly once
	hasUtils := false
	for _, art := range artifacts {
		if art.FileName == "utils.ts" || strings.HasSuffix(art.FileName, "/utils.ts") {
			hasUtils = true
			break
		}
	}
	if !hasUtils {
		if curJob, err := s.store.Get(ctx, jobID); err == nil {
			for _, art := range curJob.Artifacts {
				if art.FileName == "utils.ts" || strings.HasSuffix(art.FileName, "/utils.ts") {
					hasUtils = true
					break
				}
			}
		}
	}
	if !hasUtils {
		artifacts = append(artifacts, domain.CompiledArtifact{
			Target:   contracts.Framework("mitosis"),
			FileName: "utils.ts",
			Group:    "components",
			Code:     GenerateUtilsTS(),
		})
	}

	if len(artifacts) > 0 {
		if err := s.store.SaveArtifacts(ctx, jobID, artifacts); err != nil {
			slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to save artifacts: %v", jobID, err))
		}
	}

	// 3. Mark components with their respective compiled status / group
	for _, compSpec := range job.Document.Components {
		compName := domain.NormalizeComponentName(compSpec.Name)
		rawGroup := ""
		if result.ComponentGroups != nil {
			rawGroup = result.ComponentGroups[compName]
		}
		compGroup := resolveComponentGroup(rawGroup, compName, compSpec)

		if err := s.store.UpdateComponent(ctx, jobID, contracts.ComponentProgress{
			Name:   compName,
			Status: contracts.ComponentStatusDone,
			Group:  &compGroup,
		}); err != nil {
			slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] [%s] Failed to update component status to done: %v", jobID, compName, err))
		}
	}

	// 4. Token artifacts generation
	tokens := make([]contracts.FigmaToken, len(job.Document.Tokens))
	copy(tokens, job.Document.Tokens)

	resolved := ResolveTokens(tokens)
	tokensJSON, err := json.MarshalIndent(resolved, "", "  ")
	if err != nil {
		tokensJSON = []byte("[]")
	}

	tokenArtifacts := []domain.CompiledArtifact{
		{
			Target:   contracts.Framework("tokens"),
			FileName: "tokens.json",
			Code:     string(tokensJSON),
		},
		{
			Target:   contracts.Framework("tokens"),
			FileName: "theme.css",
			Code:     GenerateThemeCSS(resolved),
		},
		{
			Target:   contracts.Framework("tokens"),
			FileName: "tokens.css",
			Code:     GenerateTokensCSS(resolved),
		},
		{
			Target:   contracts.Framework("tokens"),
			FileName: "tokens.ts",
			Code:     GenerateTokensTS(resolved),
		},
	}
	if err := s.store.SaveArtifacts(ctx, jobID, tokenArtifacts); err != nil {
		slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to save token artifacts: %v", jobID, err))
	}

	// 5. Documentation artifacts generation
	tokensDoc := GenerateTokensDoc(job.Document.Tokens)
	indexDoc := GenerateComponentsIndexDoc(job.Document.Components)

	docArtifacts := []domain.CompiledArtifact{
		{
			Target:   contracts.Framework("docs"),
			FileName: "tokens.md",
			Group:    "docs",
			Code:     tokensDoc,
		},
		{
			Target:   contracts.Framework("docs"),
			FileName: "index.md",
			Group:    "docs",
			Code:     indexDoc,
		},
	}

	for _, comp := range job.Document.Components {
		compName := domain.NormalizeComponentName(comp.Name)
		kebabName := domain.CamelToKebab(compName)
		docArtifacts = append(docArtifacts, domain.CompiledArtifact{
			Target:   contracts.Framework("docs"),
			FileName: kebabName + ".md",
			Group:    "docs",
			Code:     GenerateComponentDoc(comp),
		})
	}

	if err := s.store.SaveArtifacts(ctx, jobID, docArtifacts); err != nil {
		slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to save doc artifacts: %v", jobID, err))
	}

	if curJob, err := s.store.Get(ctx, jobID); err == nil {
		job = curJob
	}

	// If local apps/docs directory exists, write these docs to apps/docs/tokens.md and apps/docs/components/
	if docsDir := findAppsDocsDir(); docsDir != "" {
		tokensPath := filepath.Join(docsDir, "tokens.md")
		if err := os.WriteFile(tokensPath, []byte(tokensDoc), 0644); err != nil {
			slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to write tokens.md to %s: %v", jobID, docsDir, err))
		}
		compDir := filepath.Join(docsDir, "components")
		if err := os.MkdirAll(compDir, 0755); err == nil {
			indexPath := filepath.Join(compDir, "index.md")
			if err := os.WriteFile(indexPath, []byte(indexDoc), 0644); err != nil {
				slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to write index.md to %s: %v", jobID, compDir, err))
			}
			for _, comp := range job.Document.Components {
				compName := domain.NormalizeComponentName(comp.Name)
				kebabName := domain.CamelToKebab(compName)
				compPath := filepath.Join(compDir, kebabName+".md")
				if err := os.WriteFile(compPath, []byte(GenerateComponentDoc(comp)), 0644); err != nil {
					slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to write %s.md to %s: %v", jobID, kebabName, compDir, err))
				}
			}
		}

		tokensThemeDir := filepath.Join(docsDir, ".vitepress", "theme", "tokens")
		if err := os.MkdirAll(tokensThemeDir, 0755); err == nil {
			_ = os.WriteFile(filepath.Join(tokensThemeDir, "theme.css"), []byte(GenerateThemeCSS(resolved)), 0644)
			_ = os.WriteFile(filepath.Join(tokensThemeDir, "tokens.css"), []byte(GenerateTokensCSS(resolved)), 0644)
		}

		srcCompDir := filepath.Join(docsDir, "src", "components")
		_ = os.MkdirAll(filepath.Join(srcCompDir, "vue3"), 0755)
		_ = os.MkdirAll(filepath.Join(srcCompDir, "react"), 0755)
		_ = os.MkdirAll(filepath.Join(srcCompDir, "svelte"), 0755)

		_ = os.WriteFile(filepath.Join(srcCompDir, "utils.ts"), []byte(GenerateUtilsTS()), 0644)

		componentNames := make(map[string]bool)
		for _, art := range job.Artifacts {
			var targetDir string
			switch art.Target {
			case contracts.Vue3:
				targetDir = filepath.Join(srcCompDir, "vue3")
			case contracts.React:
				targetDir = filepath.Join(srcCompDir, "react")
			case contracts.Svelte:
				targetDir = filepath.Join(srcCompDir, "svelte")
			}
			if targetDir != "" {
				baseName := strings.TrimSuffix(strings.TrimSuffix(strings.TrimSuffix(art.FileName, ".vue"), ".tsx"), ".svelte")
				componentNames[baseName] = true
				_ = os.WriteFile(filepath.Join(targetDir, art.FileName), []byte(art.Code), 0644)
			}
		}

		sortedNames := make([]string, 0, len(componentNames))
		for name := range componentNames {
			sortedNames = append(sortedNames, name)
		}
		sort.Strings(sortedNames)

		var regSb strings.Builder
		regSb.WriteString("// Auto-generated component registry for VitePress Multi-Framework Preview\n")
		regSb.WriteString("export interface ComponentLoader {\n")
		regSb.WriteString("  vue3?: () => Promise<any>;\n")
		regSb.WriteString("  react?: () => Promise<any>;\n")
		regSb.WriteString("  svelte?: () => Promise<any>;\n")
		regSb.WriteString("}\n\n")
		regSb.WriteString("export const componentRegistry: Record<string, ComponentLoader> = {\n")
		for _, name := range sortedNames {
			regSb.WriteString(fmt.Sprintf("  %q: {\n", name))
			regSb.WriteString(fmt.Sprintf("    vue3: () => import('./vue3/%s.vue'),\n", name))
			regSb.WriteString(fmt.Sprintf("    react: () => import('./react/%s.tsx'),\n", name))
			regSb.WriteString(fmt.Sprintf("    svelte: () => import('./svelte/%s.svelte'),\n", name))
			regSb.WriteString("  },\n")
		}
		regSb.WriteString("};\n")
		_ = os.WriteFile(filepath.Join(srcCompDir, "registry.ts"), []byte(regSb.String()), 0644)
	}

	// Figma document snapshot artifact generation
	if docJSON, err := json.MarshalIndent(job.Document, "", "  "); err == nil {
		figmaArtifacts := []domain.CompiledArtifact{
			{
				Target:   contracts.Framework("figma"),
				FileName: "figma-document.json",
				Code:     string(docJSON),
			},
		}
		if err := s.store.SaveArtifacts(ctx, jobID, figmaArtifacts); err != nil {
			slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to save figma document artifact: %v", jobID, err))
		}

		if genDir := findGeneratedDir(); genDir != "" {
			figmaPath := filepath.Join(genDir, "figma-document.json")
			if err := os.WriteFile(figmaPath, docJSON, 0644); err != nil {
				slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to write figma-document.json to %s: %v", jobID, genDir, err))
			} else {
				slog.Info(fmt.Sprintf("[JOB] [%s] Persisted figma-document.json to %s", jobID, figmaPath))
			}
		}
	}

	currentJob, err := s.store.Get(ctx, jobID)
	if err == nil {
		if currentJob.Status == contracts.JobStatusSucceeded || currentJob.Status == contracts.JobStatusFailed {
			return
		}
		job = currentJob
	} else {
		slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to fetch updated job for publishing: %v", jobID, err))
	}

	// 6. Move to publishing stage
	if err := s.store.UpdateStatus(ctx, jobID, contracts.JobStatusPublishing, nil); err != nil {
		slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to update status to publishing: %v", jobID, err))
	}

	slog.Info(fmt.Sprintf("[PUBLISH] [%s] Starting publishing artifacts with %d publisher(s)...", jobID, len(job.Publishers)))
	for _, pubType := range job.Publishers {
		if pub, ok := s.publishers[string(pubType)]; ok {
			if err := pub.Publish(ctx, job); err != nil {
				slog.Error(fmt.Sprintf("[PUBLISH] [ERROR] [%s] Publisher %s failed: %v", jobID, pubType, err))
			} else {
				slog.Info(fmt.Sprintf("[PUBLISH] [%s] Publisher %s completed successfully", jobID, pubType))
			}
		} else {
			slog.Warn(fmt.Sprintf("[PUBLISH] [WARN] [%s] Publisher %s not found in registered publishers", jobID, pubType))
		}
	}

	if err := s.store.UpdateStatus(ctx, jobID, contracts.JobStatusSucceeded, nil); err != nil {
		slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to update status to succeeded: %v", jobID, err))
	}
	slog.Info(fmt.Sprintf("[JOB] [%s] Extraction SUCCEEDED (%d components processed)", jobID, len(job.Document.Components)))
}

func (s *Service) processJob(ctx context.Context, jobID string) {
	s.ExecuteJob(ctx, jobID)
}

func resolveComponentGroup(rawGroup, compName string, compSpec contracts.FigmaComponentSpec) string {
	group := strings.ToLower(strings.TrimSpace(rawGroup))
	if group == "" {
		if compSpec.PageName != nil && strings.EqualFold(*compSpec.PageName, "icons") {
			return "icons"
		}
		if strings.Contains(strings.ToLower(compName), "icon") {
			return "icons"
		}
		return "components"
	}
	return domain.CamelToKebab(group)
}

// GenerateUtilsTS returns the TypeScript source defining headless UI helpers and the standard cn utility.
func GenerateUtilsTS() string {
	return `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// 1. A11y & Headless UI Primitives (Radix / Zag / Headless UI patterns)
// ---------------------------------------------------------------------------

export interface DialogStateOptions {
  id?: string;
  open?: boolean;
  onClose?: () => void;
}

export function createDialogState(options: DialogStateOptions = {}) {
  const baseId = options.id || 'dialog';
  const titleId = ` + "`" + `${baseId}-title` + "`" + `;
  const descriptionId = ` + "`" + `${baseId}-description` + "`" + `;

  return {
    isOpen: options.open ?? false,
    titleId,
    descriptionId,
    getBackdropProps() {
      return {
        'aria-hidden': 'true' as const,
        onClick: () => {
          if (options.onClose) options.onClose();
        },
      };
    },
    getContentProps(role: 'dialog' | 'alertdialog' = 'alertdialog') {
      return {
        role,
        'aria-modal': 'true' as const,
        'aria-labelledby': titleId,
        'aria-describedby': descriptionId,
        tabIndex: -1,
        onKeyDown: (event: any) => {
          if (event && event.key === 'Escape') {
            if (options.onClose) options.onClose();
          }
        },
      };
    },
    getTitleProps() {
      return { id: titleId };
    },
    getDescriptionProps() {
      return { id: descriptionId };
    },
  };
}

export function handleRovingFocus(
  event: { key: string; preventDefault?: () => void },
  currentIndex: number,
  totalItems: number,
  onSelect: (index: number) => void
): void {
  if (totalItems <= 0) return;
  let nextIndex = currentIndex;

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIndex = (currentIndex + 1) % totalItems;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIndex = (currentIndex - 1 + totalItems) % totalItems;
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = totalItems - 1;
      break;
    default:
      return;
  }

  if (event.preventDefault) event.preventDefault();
  onSelect(nextIndex);
}

export interface TabsStateOptions<T extends { id: string }> {
  tabs: T[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function createTabsState<T extends { id: string }>(options: TabsStateOptions<T>) {
  const activeId = options.activeId || (options.tabs[0]?.id ?? '');

  return {
    activeId,
    getTabListProps() {
      return {
        role: 'tablist' as const,
        onKeyDown: (event: any) => {
          const currentIndex = options.tabs.findIndex((t) => t.id === activeId);
          handleRovingFocus(event, currentIndex >= 0 ? currentIndex : 0, options.tabs.length, (nextIdx) => {
            const nextTab = options.tabs[nextIdx];
            if (nextTab && options.onSelect) options.onSelect(nextTab.id);
          });
        },
      };
    },
    getTabTriggerProps(tabId: string, index: number) {
      const isSelected = tabId === activeId;
      return {
        role: 'tab' as const,
        id: ` + "`" + `tab-${tabId}` + "`" + `,
        'aria-selected': isSelected,
        'aria-controls': ` + "`" + `panel-${tabId}` + "`" + `,
        tabIndex: isSelected ? 0 : -1,
        onClick: () => {
          if (options.onSelect) options.onSelect(tabId);
        },
      };
    },
    getTabPanelProps(tabId: string) {
      return {
        role: 'tabpanel' as const,
        id: ` + "`" + `panel-${tabId}` + "`" + `,
        'aria-labelledby': ` + "`" + `tab-${tabId}` + "`" + `,
        tabIndex: 0,
        hidden: tabId !== activeId,
      };
    },
  };
}

export function createTooltipState(options: { id?: string } = {}) {
  const tooltipId = options.id || 'tooltip';
  return {
    id: tooltipId,
    getTriggerProps() {
      return { 'aria-describedby': tooltipId };
    },
    getContentProps() {
      return { role: 'tooltip' as const, id: tooltipId };
    },
  };
}

// ---------------------------------------------------------------------------
// 2. Table Headless Model (TanStack Table patterns)
// ---------------------------------------------------------------------------

export function sortTableRows<T>(
  rows: T[],
  sortKey: keyof T | string,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  if (!sortKey || !Array.isArray(rows)) return rows ? [...rows] : [];
  const key = sortKey as keyof T;
  const modifier = direction === 'desc' ? -1 : 1;

  return [...rows].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA === valB) return 0;
    if (valA == null) return 1;
    if (valB == null) return -1;
    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * modifier;
    }
    return String(valA).localeCompare(String(valB), undefined, { numeric: true }) * modifier;
  });
}

export function paginateTableRows<T>(
  rows: T[],
  page: number = 1,
  pageSize: number = 10
): {
  data: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const totalItems = rows ? rows.length : 0;
  const safePageSize = pageSize > 0 ? pageSize : 10;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * safePageSize;
  const data = rows ? rows.slice(start, start + safePageSize) : [];

  return {
    data,
    totalPages,
    totalItems,
    currentPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

export function filterTableRows<T>(
  rows: T[],
  query: string,
  searchKeys?: Array<keyof T>
): T[] {
  if (!query || !query.trim() || !Array.isArray(rows)) return rows ? [...rows] : [];
  const q = query.toLowerCase().trim();

  return rows.filter((row) => {
    const keys = searchKeys || (Object.keys(row as any) as Array<keyof T>);
    return keys.some((k) => {
      const val = row[k];
      return val != null && String(val).toLowerCase().includes(q);
    });
  });
}

// ---------------------------------------------------------------------------
// 3. Virtual Scroll Windowing (TanStack Virtual patterns)
// ---------------------------------------------------------------------------

export interface VirtualWindowOptions {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  scrollTop: number;
  overscan?: number;
}

export function getVirtualWindow(options: VirtualWindowOptions) {
  const { totalItems, itemHeight, containerHeight, scrollTop, overscan = 3 } = options;
  if (totalItems <= 0 || itemHeight <= 0) {
    return {
      startIndex: 0,
      endIndex: 0,
      virtualItems: [] as Array<{ index: number; start: number; size: number }>,
      paddingTop: 0,
      paddingBottom: 0,
      totalHeight: 0,
    };
  }

  const totalHeight = totalItems * itemHeight;
  const rawStart = Math.floor(Math.max(0, scrollTop) / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);

  const startIndex = Math.max(0, rawStart - overscan);
  const endIndex = Math.min(totalItems, rawStart + visibleCount + overscan);

  const virtualItems: Array<{ index: number; start: number; size: number }> = [];
  for (let i = startIndex; i < endIndex; i++) {
    virtualItems.push({ index: i, start: i * itemHeight, size: itemHeight });
  }

  const paddingTop = startIndex * itemHeight;
  const paddingBottom = Math.max(0, (totalItems - endIndex) * itemHeight);

  return {
    startIndex,
    endIndex,
    virtualItems,
    paddingTop,
    paddingBottom,
    totalHeight,
  };
}

// ---------------------------------------------------------------------------
// 4. Chart Geometry & SVG Math (D3 Scale & Shape patterns)
// ---------------------------------------------------------------------------

export function scaleLinear(options: { domain: [number, number]; range: [number, number] }) {
  const [d0, d1] = options.domain;
  const [r0, r1] = options.range;
  const spanD = d1 - d0 === 0 ? 1 : d1 - d0;
  const spanR = r1 - r0;

  const fn = (value: number): number => {
    return r0 + ((value - d0) / spanD) * spanR;
  };

  fn.ticks = (count: number = 5): number[] => {
    const step = (d1 - d0) / Math.max(1, count - 1);
    const result: number[] = [];
    for (let i = 0; i < count; i++) {
      result.push(d0 + i * step);
    }
    return result;
  };

  return fn;
}

export function scaleBand(options: { domain: string[]; range: [number, number]; padding?: number }) {
  const { domain, range, padding = 0.1 } = options;
  const n = domain.length;
  const span = range[1] - range[0];
  const step = n > 0 ? span / (n - padding) : 0;
  const bandwidth = step * (1 - padding);

  const fn = (key: string): number => {
    const idx = domain.indexOf(key);
    return idx >= 0 ? range[0] + idx * step : range[0];
  };

  fn.bandwidth = bandwidth;
  fn.step = step;
  return fn;
}

export function getSmoothBezierPath(points: Array<{ x: number; y: number }>): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return ` + "`" + `M ${points[0]!.x} ${points[0]!.y}` + "`" + `;
  if (points.length === 2) {
    return ` + "`" + `M ${points[0]!.x} ${points[0]!.y} L ${points[1]!.x} ${points[1]!.y}` + "`" + `;
  }

  let path = ` + "`" + `M ${points[0]!.x} ${points[0]!.y}` + "`" + `;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` + "`" + ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}` + "`" + `;
  }

  return path;
}

export function getAreaPath(points: Array<{ x: number; y: number }>, baselineY: number = 100): string {
  if (!points || points.length === 0) return '';
  const curve = getSmoothBezierPath(points);
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return ` + "`" + `${curve} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z` + "`" + `;
}

export function getPieSlices(values: number[], radius: number = 50, innerRadius: number = 0) {
  const total = values.reduce((acc, v) => acc + (v > 0 ? v : 0), 0);
  if (total <= 0) return [];

  let currentAngle = 0;
  return values.map((val, index) => {
    const fraction = val > 0 ? val / total : 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + fraction * 2 * Math.PI;
    currentAngle = endAngle;

    const x1 = radius + radius * Math.sin(startAngle);
    const y1 = radius - radius * Math.cos(startAngle);
    const x2 = radius + radius * Math.sin(endAngle);
    const y2 = radius - radius * Math.cos(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    let path = '';
    if (innerRadius > 0) {
      const ix1 = radius + innerRadius * Math.sin(endAngle);
      const iy1 = radius - innerRadius * Math.cos(endAngle);
      const ix2 = radius + innerRadius * Math.sin(startAngle);
      const iy2 = radius - innerRadius * Math.cos(startAngle);
      path = ` + "`" + `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${ix1.toFixed(2)} ${iy1.toFixed(2)} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2.toFixed(2)} ${iy2.toFixed(2)} Z` + "`" + `;
    } else {
      path = ` + "`" + `M ${radius} ${radius} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z` + "`" + `;
    }

    return {
      index,
      value: val,
      fraction,
      startAngle,
      endAngle,
      path,
      isDonut: innerRadius > 0,
    };
  });
}
`
}

func findAppsDocsDir() string {
	if dir := os.Getenv("APPS_DOCS_DIR"); dir != "" {
		return dir
	}
	candidates := []string{"apps/docs", "../docs", "../apps/docs", "../../apps/docs", "../../../apps/docs", "../../../../apps/docs"}
	for _, dir := range candidates {
		if info, err := os.Stat(dir); err == nil && info.IsDir() {
			if vp, err := os.Stat(filepath.Join(dir, ".vitepress")); err == nil && vp.IsDir() {
				return dir
			}
		}
	}
	return ""
}

func findGeneratedDir() string {
	candidates := []string{
		"generated/components",
		"../generated/components",
		"../../generated/components",
		"../../../generated/components",
		"../../../../generated/components",
	}
	for _, dir := range candidates {
		if info, err := os.Stat(dir); err == nil && info.IsDir() {
			return dir
		}
	}
	return ""
}

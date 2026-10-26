package app

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
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
	publishers  map[string]out.ArtifactPublisher
	prManager   out.PullRequestManager
	paths       Paths
	maxRetries  int
	concurrency int
	broker      *EventBroker
}

// Paths are the filesystem locations the service reads and writes. Empty DocsDir/GeneratedDir
// disables syncing into those directories.
type Paths struct {
	ExtractionsDir string
	DocsDir        string
	GeneratedDir   string
}

var _ in.Service = (*Service)(nil)

// NewService creates a new extraction application service.
func NewService(
	store out.JobStore,
	author out.MitosisAuthor,
	publishers []out.ArtifactPublisher,
	paths Paths,
	prManager ...out.PullRequestManager,
) *Service {
	pubMap := make(map[string]out.ArtifactPublisher, len(publishers))
	var pm out.PullRequestManager
	for _, p := range publishers {
		pubMap[p.Name()] = p
		if pm == nil {
			if m, ok := p.(out.PullRequestManager); ok {
				pm = m
			}
		}
	}
	if len(prManager) > 0 && prManager[0] != nil {
		pm = prManager[0]
	}

	return &Service{
		store:       store,
		author:      author,
		publishers:  pubMap,
		prManager:   pm,
		paths:       paths,
		maxRetries:  defaultMaxRetries,
		concurrency: defaultConcurrency,
		broker:      NewEventBroker(),
	}
}

// SubscribeJobEvents provides a real-time event channel for SSE subscribers.
func (s *Service) SubscribeJobEvents(ctx context.Context, jobID string) (<-chan contracts.JobEvent, func(), error) {
	if _, err := s.store.Get(ctx, jobID); err != nil {
		return nil, nil, err
	}
	ch, unsub := s.broker.Subscribe(jobID)
	return ch, unsub, nil
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

	extractionsDir := s.paths.ExtractionsDir
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

// ReplayExtraction re-enqueues a previously persisted extraction request. target must be
// empty/"latest" or a job ID; arbitrary paths are rejected so callers cannot read other files.
func (s *Service) ReplayExtraction(ctx context.Context, target string) (string, error) {
	targetPath, err := s.replayPath(target)
	if err != nil {
		return "", err
	}

	data, err := os.ReadFile(targetPath)
	if errors.Is(err, fs.ErrNotExist) {
		return "", domain.ErrExtractionNotFound
	}
	if err != nil {
		return "", fmt.Errorf("read persisted extraction: %w", err)
	}

	var req contracts.ExtractionRequest
	if err := json.Unmarshal(data, &req); err != nil {
		return "", fmt.Errorf("failed to parse persisted extraction payload: %w", err)
	}

	slog.Info("[REPLAY] Replaying extraction", "path", targetPath, "doc", req.Document.Name, "components", len(req.Document.Components))
	return s.SubmitExtraction(ctx, req)
}

func (s *Service) replayPath(target string) (string, error) {
	target = strings.TrimSpace(target)
	if target == "" || target == "latest" {
		return filepath.Join(s.paths.ExtractionsDir, "latest.json"), nil
	}
	id, err := uuid.Parse(target)
	if err != nil {
		return "", fmt.Errorf("%w: replay target must be a job ID or \"latest\"", domain.ErrInvalidPayload)
	}
	return filepath.Join(s.paths.ExtractionsDir, id.String()+".json"), nil
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

// saveTokenArtifacts generates tokens.json, theme.css, tokens.css, and tokens.ts
// and persists them to the store and the configured docs theme directory.
func (s *Service) saveTokenArtifacts(ctx context.Context, jobID string, resolved []contracts.FigmaToken) {
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

	if docsDir := s.paths.DocsDir; docsDir != "" {
		tokensThemeDir := filepath.Join(docsDir, ".vitepress", "theme", "tokens")
		if err := os.MkdirAll(tokensThemeDir, 0755); err == nil {
			_ = os.WriteFile(filepath.Join(tokensThemeDir, "theme.css"), []byte(GenerateThemeCSS(resolved)), 0644)
			_ = os.WriteFile(filepath.Join(tokensThemeDir, "tokens.css"), []byte(GenerateTokensCSS(resolved)), 0644)
		}
	}
}

// ExecuteJob drives the lifecycle of an extraction: worker pool task authoring -> token resolution -> publishing.
func (s *Service) ExecuteJob(ctx context.Context, jobID string) {
	job, err := s.store.Get(ctx, jobID)
	if err != nil {
		slog.Error(fmt.Sprintf("[JOB] [ERROR] [%s] Failed to fetch job from store: %v", jobID, err))
		return
	}

	totalComponents := len(job.Document.Components)
	slog.Info(fmt.Sprintf("[JOB] [%s] Processing started for %d component(s)", jobID, totalComponents))

	now := time.Now().UTC()
	runID := uuid.New().String()
	run := &domain.Run{
		ID:        runID,
		JobID:     jobID,
		Status:    domain.RunRunning,
		CreatedAt: now,
	}

	tasks := make([]*domain.Task, totalComponents)
	for i, compSpec := range job.Document.Components {
		compName := domain.NormalizeComponentName(compSpec.Name)
		compGroup := resolveComponentGroup("", compName, compSpec)
		taskID := uuid.New().String()
		tasks[i] = &domain.Task{
			ID:            taskID,
			RunID:         runID,
			ComponentName: compName,
			Status:        domain.TaskQueued,
			AttemptCount:  0,
			MaxAttempts:   s.maxRetries + 1,
			CreatedAt:     now,
			UpdatedAt:     now,
		}
		_ = s.store.UpdateComponent(ctx, jobID, contracts.ComponentProgress{
			Name:   compName,
			Status: contracts.ComponentStatusPending,
			Group:  &compGroup,
		})
	}
	run.Tasks = tasks
	_ = s.store.SaveRun(ctx, run)
	job.RunID = runID
	job.Tasks = tasks
	_ = s.store.Update(ctx, job)

	if err := s.store.UpdateStatus(ctx, jobID, contracts.JobStatusAuthoring, nil); err != nil {
		slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to update status to Authoring: %v", jobID, err))
	}

	s.broker.Publish(jobID, contracts.JobEvent{
		EventType: "job_status",
		JobId:     jobID,
		RunId:     &runID,
		Status:    StringPtr(string(contracts.JobStatusAuthoring)),
	})

	// Retrieve existing component information from PullRequest publisher, only if PR publisher is active (R7 guard)
	var existingNames []string
	var workspaceDir string
	var infoCleanup func()
	hasPRPublisher := false
	for _, p := range job.Publishers {
		if p == contracts.PullRequest {
			hasPRPublisher = true
			break
		}
	}
	if !hasPRPublisher && len(s.publishers) == 1 {
		if _, ok := s.publishers[string(contracts.PullRequest)]; ok {
			hasPRPublisher = true
		}
	}
	if hasPRPublisher {
		if pub, ok := s.publishers[string(contracts.PullRequest)]; ok {
			if infoReader, ok := pub.(interface {
				GetExistingComponentInfo(ctx context.Context) ([]string, string, func(), error)
			}); ok {
				names, wsDir, cleanup, err := infoReader.GetExistingComponentInfo(ctx)
				if err != nil {
					slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to get existing component info: %v", jobID, err))
				} else {
					infoCleanup = cleanup
					existingNames = names
					workspaceDir = wsDir
					slog.Info(fmt.Sprintf("[JOB] [%s] Found %d existing component(s), workspaceDir=%s", jobID, len(existingNames), workspaceDir))
				}
			}
		}
	}

	// 1. Resolve tokens and extract deterministic utility classes BEFORE authoring
	tokens := make([]contracts.FigmaToken, len(job.Document.Tokens))
	copy(tokens, job.Document.Tokens)
	resolvedTokens := ResolveTokens(tokens)
	tokenClasses := ExtractTailwindUtilityClasses(resolvedTokens)

	// Persist initial token artifacts before starting authoring
	s.saveTokenArtifacts(ctx, jobID, resolvedTokens)

	// Retrieve existing snapshots for incremental sync diffing
	docName := job.DocumentName
	if docName == "" {
		docName = job.Document.Name
	}
	if docName == "" {
		docName = "Design System"
	}
	existingComps, _ := s.store.GetComponentSnapshots(ctx, docName)
	if existingComps == nil {
		existingComps = make(map[string]*domain.ComponentSnapshot)
	}

	// 2. Launch worker pool for single-component authoring tasks
	type compTaskItem struct {
		spec           contracts.FigmaComponentSpec
		task           *domain.Task
		diffStatus     contracts.DiffStatus
		existingSource string
		currHash       string
	}

	taskCh := make(chan compTaskItem, totalComponents)
	for i, compSpec := range job.Document.Components {
		compName := domain.NormalizeComponentName(compSpec.Name)
		currHash := domain.HashComponentSpec(compSpec)
		status := contracts.New
		existingSource := ""

		if prevComp, ok := existingComps[compName]; ok && prevComp != nil {
			if prevComp.ContentHash == currHash && prevComp.SourceCode != "" {
				status = contracts.Unchanged
				existingSource = prevComp.SourceCode
			} else {
				status = contracts.Changed
				existingSource = prevComp.SourceCode
			}
		}

		taskCh <- compTaskItem{
			spec:           compSpec,
			task:           tasks[i],
			diffStatus:     status,
			existingSource: existingSource,
			currHash:       currHash,
		}
	}
	close(taskCh)

	workerCount := s.concurrency
	if workerCount <= 0 {
		workerCount = defaultConcurrency
	}
	if workerCount > totalComponents {
		workerCount = totalComponents
	}

	var workerWg sync.WaitGroup
	var resultsMu sync.Mutex
	authoredComponents := make(map[string]string)
	componentGroups := make(map[string]string)
	allArtifacts := make([]domain.CompiledArtifact, 0)
	var allNewTokens []out.DiscoveredToken
	var successCount, failureCount int

	slog.Info(fmt.Sprintf("[JOB] [%s] Starting worker pool with %d workers for %d tasks", jobID, workerCount, totalComponents))

	for w := 0; w < workerCount; w++ {
		workerWg.Add(1)
		go func(workerIdx int) {
			defer workerWg.Done()
			for item := range taskCh {
				compName := item.task.ComponentName
				compGroup := resolveComponentGroup("", compName, item.spec)

				// Transition task to authoring
				item.task.Status = domain.TaskAuthoring
				item.task.UpdatedAt = time.Now().UTC()
				_ = s.store.UpdateTask(ctx, jobID, item.task)
				_ = s.store.UpdateComponent(ctx, jobID, contracts.ComponentProgress{
					Name:   compName,
					Status: contracts.ComponentStatusAuthoring,
					Group:  &compGroup,
				})

				s.broker.Publish(jobID, contracts.JobEvent{
					EventType: "task_status",
					JobId:     jobID,
					RunId:     &runID,
					Status:    StringPtr(string(domain.TaskAuthoring)),
					Task: func() *contracts.ComponentTask {
						t := item.task.ToContract()
						return &t
					}(),
				})

				var compArtifacts []domain.CompiledArtifact
				var compSource string
				var compErr error
				var compTokens []out.DiscoveredToken

				// If component is UNCHANGED, compile existing source directly (0 LLM calls)
				compileOnly := (item.diffStatus == contracts.Unchanged)
				if compileOnly {
					slog.Info(fmt.Sprintf("[JOB] [%s] Component %s is UNCHANGED (hash=%s), compiling existing source without LLM", jobID, compName, item.currHash))
				} else if item.diffStatus == contracts.Changed {
					slog.Info(fmt.Sprintf("[JOB] [%s] Component %s is CHANGED, authoring with existingSource context", jobID, compName))
				}

				// Deterministic attempt loop per component
				for attempt := 1; attempt <= item.task.MaxAttempts; attempt++ {
					item.task.AttemptCount = attempt
					item.task.UpdatedAt = time.Now().UTC()

					taskCtx, taskCancel := context.WithTimeout(ctx, 3*time.Minute)
					singleReq := out.AuthorRequest{
						ComponentName:          compName,
						Components:             []contracts.FigmaComponentSpec{item.spec},
						Tokens:                 resolvedTokens,
						ExistingSource:         item.existingSource,
						CompileOnly:            compileOnly,
						ExistingComponentNames: existingNames,
						WorkspaceDir:           workspaceDir,
						Targets:                job.Targets,
						TokenClasses:           tokenClasses,
					}

					res, err := s.author.AuthorDesignSystem(taskCtx, singleReq)
					taskCancel()

					if err == nil && res != nil {
						if src, ok := res.Components[compName]; ok && src != "" {
							compSource = src
						}
						if len(res.Artifacts) > 0 {
							compArtifacts = res.Artifacts
						}
						if len(res.NewTokens) > 0 {
							compTokens = res.NewTokens
						}

						// If we got authored components or artifacts, move to verifying
						item.task.Status = domain.TaskVerifying
						item.task.UpdatedAt = time.Now().UTC()
						_ = s.store.UpdateTask(ctx, jobID, item.task)

						s.broker.Publish(jobID, contracts.JobEvent{
							EventType: "task_status",
							JobId:     jobID,
							RunId:     &runID,
							Status:    StringPtr(string(domain.TaskVerifying)),
							Task: func() *contracts.ComponentTask {
								t := item.task.ToContract()
								return &t
							}(),
						})

						if len(compArtifacts) > 0 || compSource != "" {
							compErr = nil
							break
						}
					}

					compErr = err
					if compErr == nil {
						compErr = fmt.Errorf("no code generated for %s", compName)
					}
					slog.Warn(fmt.Sprintf("[JOB] [%s] [%s] Attempt %d/%d failed: %v", jobID, compName, attempt, item.task.MaxAttempts, compErr))
				}

				if compErr != nil {
					// Task failed permanently
					item.task.Status = domain.TaskFailed
					item.task.Error = compErr.Error()
					item.task.UpdatedAt = time.Now().UTC()
					_ = s.store.UpdateTask(ctx, jobID, item.task)

					stageErr := &contracts.StageError{
						Stage:   "authoring",
						Message: compErr.Error(),
					}
					_ = s.store.UpdateComponent(ctx, jobID, contracts.ComponentProgress{
						Name:       compName,
						Status:     contracts.ComponentStatusFailed,
						Group:      &compGroup,
						StageError: stageErr,
					})

					s.broker.Publish(jobID, contracts.JobEvent{
						EventType: "task_status",
						JobId:     jobID,
						RunId:     &runID,
						Status:    StringPtr(string(domain.TaskFailed)),
						Error:     &item.task.Error,
						Task: func() *contracts.ComponentTask {
							t := item.task.ToContract()
							return &t
						}(),
					})

					resultsMu.Lock()
					failureCount++
					resultsMu.Unlock()
				} else {
					// Task succeeded
					item.task.Status = domain.TaskReady
					item.task.Artifacts = compArtifacts
					item.task.UpdatedAt = time.Now().UTC()
					_ = s.store.UpdateTask(ctx, jobID, item.task)

					_ = s.store.UpdateComponent(ctx, jobID, contracts.ComponentProgress{
						Name:   compName,
						Status: contracts.ComponentStatusDone,
						Group:  &compGroup,
					})

					if len(compArtifacts) > 0 {
						_ = s.store.SaveArtifacts(ctx, jobID, compArtifacts)
					}

					s.broker.Publish(jobID, contracts.JobEvent{
						EventType: "task_status",
						JobId:     jobID,
						RunId:     &runID,
						Status:    StringPtr(string(domain.TaskReady)),
						Task: func() *contracts.ComponentTask {
							t := item.task.ToContract()
							return &t
						}(),
					})

					resultsMu.Lock()
					successCount++
					if compSource != "" {
						authoredComponents[compName] = compSource
					}
					componentGroups[compName] = compGroup
					allArtifacts = append(allArtifacts, compArtifacts...)
					allNewTokens = append(allNewTokens, compTokens...)
					resultsMu.Unlock()
				}
			}
		}(w)
	}

	workerWg.Wait()
	if infoCleanup != nil {
		infoCleanup()
		infoCleanup = nil
	}
	finTime := time.Now().UTC()

	// If no components succeeded, mark the entire job as failed
	if successCount == 0 {
		errMsg := "all component authoring tasks failed"
		stageErr := &contracts.StageError{
			Stage:   "authoring",
			Message: errMsg,
		}
		_ = s.store.UpdateStatus(ctx, jobID, contracts.JobStatusFailed, stageErr)
		run.Status = domain.RunFailed
		run.FinishedAt = &finTime
		_ = s.store.UpdateRun(ctx, run)

		s.broker.Publish(jobID, contracts.JobEvent{
			EventType: "job_failed",
			JobId:     jobID,
			RunId:     &runID,
			Status:    StringPtr(string(contracts.JobStatusFailed)),
			Error:     &errMsg,
		})
		slog.Error(fmt.Sprintf("[JOB] [ERROR] [%s] %s", jobID, errMsg))
		return
	}

	// 3. Merge discovered new tokens into catalog
	if len(allNewTokens) > 0 {
		var tokensMu sync.Mutex
		tokensMu.Lock()
		existingTokenNames := make(map[string]struct{}, len(job.Document.Tokens))
		for _, tok := range job.Document.Tokens {
			existingTokenNames[tok.Name] = struct{}{}
		}
		hasNew := false
		for _, tok := range allNewTokens {
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
			slog.Info(fmt.Sprintf("[JOB] [%s] Discovered %d new design token(s)", jobID, len(allNewTokens)))
			if currentJob, err := s.store.Get(ctx, jobID); err == nil {
				currentJob.Document.Tokens = job.Document.Tokens
				_ = s.store.Update(ctx, currentJob)
			} else {
				_ = s.store.Update(ctx, job)
			}
		}
	}

	// 4. Synthesize artifacts if only components map was returned
	if len(allArtifacts) == 0 && len(authoredComponents) > 0 {
		for compName, code := range authoredComponents {
			compGroup := componentGroups[compName]
			allArtifacts = append(allArtifacts, domain.CompiledArtifact{
				Target:   contracts.Framework("mitosis"),
				FileName: compName + ".lite.tsx",
				Code:     code,
				Group:    compGroup,
			})
		}
	}

	// Ensure group is resolved on all component artifacts
	for i := range allArtifacts {
		if allArtifacts[i].Group == "" {
			baseName := strings.Split(allArtifacts[i].FileName, ".")[0]
			if g, ok := componentGroups[baseName]; ok {
				allArtifacts[i].Group = domain.NormalizeGroup(g)
			}
		}
	}

	// Deterministic deduplication: ensure utils.ts is emitted into artifacts exactly once
	hasUtils := false
	for _, art := range allArtifacts {
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
		allArtifacts = append(allArtifacts, domain.CompiledArtifact{
			Target:   contracts.Framework("mitosis"),
			FileName: "utils.ts",
			Group:    "components",
			Code:     GenerateUtilsTS(),
		})
	}

	if len(allArtifacts) > 0 {
		if err := s.store.SaveArtifacts(ctx, jobID, allArtifacts); err != nil {
			slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to save artifacts: %v", jobID, err))
		}
	}

	// 5. Update token artifacts if any new tokens were discovered
	if len(allNewTokens) > 0 {
		updatedTokens := make([]contracts.FigmaToken, len(job.Document.Tokens))
		copy(updatedTokens, job.Document.Tokens)
		updatedResolved := ResolveTokens(updatedTokens)
		s.saveTokenArtifacts(ctx, jobID, updatedResolved)
	}

	// 6. Documentation artifacts generation
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

	// If a docs directory is configured, write these docs to <docs>/tokens.md and <docs>/components/
	if docsDir := s.paths.DocsDir; docsDir != "" {
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

		srcCompDir := filepath.Join(docsDir, "src", "components")
		previewCompDir := filepath.Join(docsDir, ".vitepress", "theme", "preview")
		for _, baseDir := range []string{srcCompDir, previewCompDir} {
			_ = os.MkdirAll(filepath.Join(baseDir, "vue3"), 0755)
			_ = os.MkdirAll(filepath.Join(baseDir, "react"), 0755)
			_ = os.MkdirAll(filepath.Join(baseDir, "svelte"), 0755)
			_ = os.WriteFile(filepath.Join(baseDir, "utils.ts"), []byte(GenerateUtilsTS()), 0644)
		}

		componentNames := make(map[string]bool)
		for _, art := range job.Artifacts {
			var subDir string
			switch art.Target {
			case contracts.Vue3:
				subDir = "vue3"
			case contracts.React:
				subDir = "react"
			case contracts.Svelte:
				subDir = "svelte"
			}
			if subDir != "" && domain.ValidFileName(art.FileName) {
				baseName := strings.TrimSuffix(strings.TrimSuffix(strings.TrimSuffix(art.FileName, ".vue"), ".tsx"), ".svelte")
				componentNames[baseName] = true
				_ = os.WriteFile(filepath.Join(srcCompDir, subDir, art.FileName), []byte(art.Code), 0644)
				_ = os.WriteFile(filepath.Join(previewCompDir, subDir, art.FileName), []byte(art.Code), 0644)
			}
		}

		sortedNames := make([]string, 0, len(componentNames))
		for name := range componentNames {
			sortedNames = append(sortedNames, name)
		}
		sort.Strings(sortedNames)

		metaByComp := buildComponentMetadataMap(job.Document.Components, componentGroups)
		metaJSON, err := json.MarshalIndent(metaByComp, "", "  ")
		if err != nil {
			metaJSON = []byte("{}")
		}

		var regSb strings.Builder
		regSb.WriteString("// Auto-generated component registry for VitePress Multi-Framework Preview\n")
		regSb.WriteString("export interface ComponentLoader {\n")
		regSb.WriteString("  vue3?: () => Promise<any>;\n")
		regSb.WriteString("  react?: () => Promise<any>;\n")
		regSb.WriteString("  svelte?: () => Promise<any>;\n")
		regSb.WriteString("}\n\n")
		regSb.WriteString("export interface ComponentMeta {\n")
		regSb.WriteString("  name: string;\n")
		regSb.WriteString("  group?: string;\n")
		regSb.WriteString("  variants?: Record<string, string[]>;\n")
		regSb.WriteString("  totalVariants?: number;\n")
		regSb.WriteString("}\n\n")
		regSb.WriteString("export const componentRegistry: Record<string, ComponentLoader> = {\n")
		for _, name := range sortedNames {
			regSb.WriteString(fmt.Sprintf("  %q: {\n", name))
			regSb.WriteString(fmt.Sprintf("    vue3: () => import('./vue3/%s.vue'),\n", name))
			regSb.WriteString(fmt.Sprintf("    react: () => import('./react/%s.tsx'),\n", name))
			regSb.WriteString(fmt.Sprintf("    svelte: () => import('./svelte/%s.svelte'),\n", name))
			regSb.WriteString("  },\n")
		}
		regSb.WriteString("};\n\n")
		regSb.WriteString(fmt.Sprintf("export const componentMetadata: Record<string, ComponentMeta> = %s;\n", string(metaJSON)))
		regContent := []byte(regSb.String())
		_ = os.WriteFile(filepath.Join(srcCompDir, "registry.ts"), regContent, 0644)
		_ = os.WriteFile(filepath.Join(previewCompDir, "registry.ts"), regContent, 0644)
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

		if genDir := s.paths.GeneratedDir; genDir != "" {
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

	// 7. Move to publishing stage
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

	// Update snapshots in persistent store for incremental diffing
	nowSnap := time.Now().UTC()
	for compName, src := range authoredComponents {
		for _, compSpec := range job.Document.Components {
			if domain.NormalizeComponentName(compSpec.Name) == compName {
				currHash := domain.HashComponentSpec(compSpec)
				specCopy := compSpec
				_ = s.store.SaveComponentSnapshot(ctx, &domain.ComponentSnapshot{
					DocumentName:  docName,
					ComponentName: compName,
					ContentHash:   currHash,
					Spec:          &specCopy,
					SourceCode:    src,
					UpdatedAt:     nowSnap,
				})
				break
			}
		}
	}

	_ = s.store.SaveSnapshot(ctx, &domain.Snapshot{
		ID:           uuid.New().String(),
		DocumentName: docName,
		TokensHash:   domain.HashTokens(job.Document.Tokens),
		Tokens:       job.Document.Tokens,
		CreatedAt:    nowSnap,
	})

	if err := s.store.UpdateStatus(ctx, jobID, contracts.JobStatusSucceeded, nil); err != nil {
		slog.Warn(fmt.Sprintf("[JOB] [WARN] [%s] Failed to update status to succeeded: %v", jobID, err))
	}
	run.Status = domain.RunSucceeded
	run.FinishedAt = &finTime
	_ = s.store.UpdateRun(ctx, run)

	s.broker.Publish(jobID, contracts.JobEvent{
		EventType: "job_completed",
		JobId:     jobID,
		RunId:     &runID,
		Status:    StringPtr(string(contracts.JobStatusSucceeded)),
	})

	slog.Info(fmt.Sprintf("[JOB] [%s] Extraction SUCCEEDED (%d succeeded, %d failed out of %d components)",
		jobID, successCount, failureCount, totalComponents))
}

func (s *Service) processJob(ctx context.Context, jobID string) {
	s.ExecuteJob(ctx, jobID)
}

func resolveComponentGroup(rawGroup, compName string, compSpec contracts.FigmaComponentSpec) string {
	if group := domain.NormalizeGroup(rawGroup); group != "" {
		return group
	}
	if compSpec.PageName != nil && strings.EqualFold(*compSpec.PageName, domain.GroupIcons) {
		return domain.GroupIcons
	}
	if strings.Contains(strings.ToLower(compName), "icon") {
		return domain.GroupIcons
	}
	return domain.GroupComponents
}

type componentMetaEntry struct {
	Name          string              `json:"name"`
	Group         string              `json:"group,omitempty"`
	Variants      map[string][]string `json:"variants"`
	TotalVariants int                 `json:"totalVariants"`
}

func buildComponentMetadataMap(components []contracts.FigmaComponentSpec, groups map[string]string) map[string]componentMetaEntry {
	res := make(map[string]componentMetaEntry, len(components))
	for _, comp := range components {
		compName := domain.NormalizeComponentName(comp.Name)
		group := groups[compName]
		if group == "" {
			group = resolveComponentGroup("", compName, comp)
		}
		variants := make(map[string][]string)
		if comp.Properties != nil {
			for rawKey, val := range *comp.Properties {
				cleanKey := strings.TrimSpace(strings.Split(rawKey, "#")[0])
				if cleanKey == "" {
					continue
				}
				if valMap, ok := val.(map[string]interface{}); ok {
					var opts []string
					if rawOpts, ok := valMap["variantOptions"].([]interface{}); ok {
						for _, o := range rawOpts {
							s := strings.TrimSpace(fmt.Sprintf("%v", o))
							if s != "" {
								opts = append(opts, s)
							}
						}
					} else if rawOpts, ok := valMap["variantOptions"].([]string); ok {
						for _, o := range rawOpts {
							s := strings.TrimSpace(o)
							if s != "" {
								opts = append(opts, s)
							}
						}
					}
					if len(opts) > 0 {
						variants[cleanKey] = opts
					}
				}
			}
		}
		total := 0
		if len(variants) > 0 {
			total = 1
			for _, opts := range variants {
				total *= len(opts)
			}
		}
		res[compName] = componentMetaEntry{
			Name:          compName,
			Group:         group,
			Variants:      variants,
			TotalVariants: total,
		}
	}
	return res
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

package app

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"log/slog"
	"os"
	"sort"
	"time"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
	"github.com/google/uuid"
)

// CalculateSyncPlan calculates a granular diff plan between the incoming document and previous snapshot.
func CalculateSyncPlan(ctx context.Context, store out.JobStore, req contracts.SyncRequest) (*domain.SyncPlan, error) {
	docName := req.Document.Name
	if docName == "" {
		docName = "Design System"
	}

	// 1. Retrieve previous snapshot & component snapshots
	prevSnap, _ := store.GetLatestSnapshot(ctx, docName)
	existingComps, _ := store.GetComponentSnapshots(ctx, docName)
	if existingComps == nil {
		existingComps = make(map[string]*domain.ComponentSnapshot)
	}

	// 2. Token diff calculation
	prevTokensHash := ""
	var prevTokens []contracts.FigmaToken
	if prevSnap != nil {
		prevTokensHash = prevSnap.TokensHash
		prevTokens = prevSnap.Tokens
	}

	currTokensHash := domain.HashTokens(req.Document.Tokens)
	tokenChanged := (currTokensHash != prevTokensHash)

	prevTokenMap := make(map[string]contracts.FigmaToken, len(prevTokens))
	for _, t := range prevTokens {
		prevTokenMap[t.Name] = t
	}
	currTokenMap := make(map[string]contracts.FigmaToken, len(req.Document.Tokens))
	for _, t := range req.Document.Tokens {
		currTokenMap[t.Name] = t
	}

	var addedTokens, modifiedTokens, removedTokens []string
	for name, currT := range currTokenMap {
		prevT, exists := prevTokenMap[name]
		if !exists {
			addedTokens = append(addedTokens, name)
		} else {
			currRaw, _ := json.Marshal(currT)
			prevRaw, _ := json.Marshal(prevT)
			if string(currRaw) != string(prevRaw) {
				modifiedTokens = append(modifiedTokens, name)
			}
		}
	}
	for name := range prevTokenMap {
		if _, exists := currTokenMap[name]; !exists {
			removedTokens = append(removedTokens, name)
		}
	}
	sort.Strings(addedTokens)
	sort.Strings(modifiedTokens)
	sort.Strings(removedTokens)

	tokenDiff := contracts.TokenDiff{
		Changed:      tokenChanged,
		Added:        &addedTokens,
		Modified:     &modifiedTokens,
		Removed:      &removedTokens,
		PreviousHash: &prevTokensHash,
		CurrentHash:  &currTokensHash,
	}

	// 3. Component diff calculation
	incomingMap := make(map[string]contracts.FigmaComponentSpec, len(req.Document.Components))
	for _, spec := range req.Document.Components {
		name := domain.NormalizeComponentName(spec.Name)
		incomingMap[name] = spec
	}

	var compDiffs []contracts.ComponentDiff
	var newCount, changedCount, unchangedCount, removedCount int

	for name, spec := range incomingMap {
		currHash := domain.HashComponentSpec(spec)
		prevComp, exists := existingComps[name]

		if !exists {
			newCount++
			compDiffs = append(compDiffs, contracts.ComponentDiff{
				Name:        name,
				Status:      contracts.New,
				CurrentHash: &currHash,
			})
		} else {
			prevHash := prevComp.ContentHash
			if currHash == prevHash {
				unchangedCount++
				compDiffs = append(compDiffs, contracts.ComponentDiff{
					Name:         name,
					Status:       contracts.Unchanged,
					PreviousHash: &prevHash,
					CurrentHash:  &currHash,
				})
			} else {
				changedCount++
				summary := "Component visual spec or properties changed"
				compDiffs = append(compDiffs, contracts.ComponentDiff{
					Name:          name,
					Status:        contracts.Changed,
					PreviousHash:  &prevHash,
					CurrentHash:   &currHash,
					ChangeSummary: &summary,
				})
			}
		}
	}

	// Check removed components
	for name, prevComp := range existingComps {
		if _, exists := incomingMap[name]; !exists {
			prevHash := prevComp.ContentHash
			removedCount++
			compDiffs = append(compDiffs, contracts.ComponentDiff{
				Name:         name,
				Status:       contracts.Removed,
				PreviousHash: &prevHash,
			})
		}
	}

	// Sort component diffs by name deterministically
	sort.Slice(compDiffs, func(i, j int) bool {
		return compDiffs[i].Name < compDiffs[j].Name
	})

	var defaultTargets []contracts.Framework
	if req.Targets != nil && len(*req.Targets) > 0 {
		defaultTargets = *req.Targets
	} else {
		defaultTargets = []contracts.Framework{contracts.Mitosis}
	}

	var defaultPublishers []contracts.PublisherType
	if req.Publishers != nil && len(*req.Publishers) > 0 {
		defaultPublishers = *req.Publishers
	} else {
		defaultPublishers = []contracts.PublisherType{contracts.Download}
	}

	syncID := uuid.New().String()
	now := time.Now().UTC()

	plan := &domain.SyncPlan{
		SyncID:       syncID,
		DocumentName: docName,
		Summary: contracts.SyncSummary{
			Total:         len(incomingMap),
			New:           newCount,
			Changed:       changedCount,
			Unchanged:     unchangedCount,
			Removed:       removedCount,
			TokensChanged: tokenChanged,
		},
		Components: compDiffs,
		Tokens:     tokenDiff,
		CreatedAt:  now,
		Document:   &req.Document,
		Targets:    defaultTargets,
		Publishers: defaultPublishers,
		Options:    req.Options,
	}

	return plan, nil
}

// SubmitSync computes and stores a sync diff plan.
func (s *Service) SubmitSync(ctx context.Context, req contracts.SyncRequest) (*domain.SyncPlan, error) {
	if len(req.Document.Components) == 0 && len(req.Document.Tokens) == 0 {
		return nil, domain.ErrInvalidPayload
	}

	plan, err := CalculateSyncPlan(ctx, s.store, req)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate sync plan: %w", err)
	}

	if err := s.store.SaveSyncPlan(ctx, plan); err != nil {
		return nil, fmt.Errorf("failed to save sync plan: %w", err)
	}

	return plan, nil
}

// GetSyncPlan retrieves a stored sync plan.
func (s *Service) GetSyncPlan(ctx context.Context, syncID string) (*domain.SyncPlan, error) {
	if syncID == "" {
		return nil, domain.ErrInvalidPayload
	}
	return s.store.GetSyncPlan(ctx, syncID)
}

// ApplySync enqueues an incremental extraction job from a stored sync plan.
func (s *Service) ApplySync(ctx context.Context, syncID string, req *contracts.ApplySyncRequest) (string, error) {
	plan, err := s.store.GetSyncPlan(ctx, syncID)
	if err != nil {
		return "", err
	}
	if plan.Document == nil {
		return "", domain.ErrInvalidPayload
	}

	extractionReq := contracts.ExtractionRequest{
		Document:   *plan.Document,
		SyncId:     &syncID,
		Targets:    &plan.Targets,
		Publishers: &plan.Publishers,
		Options:    plan.Options,
	}

	// Apply overrides if provided in ApplySyncRequest
	if req != nil {
		if req.Targets != nil && len(*req.Targets) > 0 {
			extractionReq.Targets = req.Targets
		}
		if req.Publishers != nil && len(*req.Publishers) > 0 {
			extractionReq.Publishers = req.Publishers
		}
		if req.Options != nil {
			extractionReq.Options = req.Options
		}
	}

	return s.SubmitExtraction(ctx, extractionReq)
}

// ReplaySync reads a persisted extraction request from disk and computes a diff plan.
func (s *Service) ReplaySync(ctx context.Context, target string, opts ...*contracts.ExtractionOptions) (*domain.SyncPlan, error) {
	targetPath, err := s.replayPath(target)
	if err != nil {
		return nil, err
	}

	data, err := os.ReadFile(targetPath)
	if errors.Is(err, fs.ErrNotExist) {
		return nil, domain.ErrExtractionNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("read persisted extraction: %w", err)
	}

	var extractionReq contracts.ExtractionRequest
	if err := json.Unmarshal(data, &extractionReq); err != nil {
		return nil, fmt.Errorf("failed to parse persisted extraction payload: %w", err)
	}

	var options *contracts.ExtractionOptions
	if len(opts) > 0 && opts[0] != nil {
		options = opts[0]
	} else {
		options = extractionReq.Options
	}

	syncReq := contracts.SyncRequest{
		Document:   extractionReq.Document,
		Targets:    extractionReq.Targets,
		Publishers: extractionReq.Publishers,
		Options:    options,
	}

	slog.Info("[REPLAY] Computing sync diff plan from persisted extraction", "path", targetPath, "doc", syncReq.Document.Name, "components", len(syncReq.Document.Components))
	return s.SubmitSync(ctx, syncReq)
}

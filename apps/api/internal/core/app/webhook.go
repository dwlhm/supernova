package app

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"regexp"
	"strings"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

var (
	reBotCommand = regexp.MustCompile(`(?m)^\s*/supernova\s+regenerate\s+([^\s:]+)(?:\s*:\s*(.+))?\s*$`)
)

type githubIssueCommentEvent struct {
	Action string `json:"action"`
	Issue  struct {
		Number      int       `json:"number"`
		Title       string    `json:"title"`
		PullRequest *struct{} `json:"pull_request,omitempty"`
	} `json:"issue"`
	Comment struct {
		ID   int64  `json:"id"`
		Body string `json:"body"`
	} `json:"comment"`
	Repository struct {
		Owner struct {
			Login string `json:"login"`
		} `json:"owner"`
		Name     string `json:"name"`
		FullName string `json:"full_name"`
	} `json:"repository"`
	Sender struct {
		Login string `json:"login"`
		Type  string `json:"type"`
	} `json:"sender"`
}

// HandleGitHubWebhook processes verified GitHub webhook events (e.g. PR review comments).
func (s *Service) HandleGitHubWebhook(ctx context.Context, eventType string, payload []byte) error {
	if eventType != "issue_comment" {
		slog.Debug(fmt.Sprintf("[WEBHOOK] Ignoring unsupported GitHub event type: %s", eventType))
		return nil
	}

	var event githubIssueCommentEvent
	if err := json.Unmarshal(payload, &event); err != nil {
		return fmt.Errorf("failed to parse issue_comment payload: %w", err)
	}

	// Only process newly created comments
	if event.Action != "created" {
		return nil
	}

	// Ignore comments from bots to prevent recursive loops
	if strings.EqualFold(event.Sender.Type, "Bot") || strings.HasSuffix(strings.ToLower(event.Sender.Login), "[bot]") {
		return nil
	}

	// Must be on a Pull Request (GitHub issue comments on PRs have pull_request != nil)
	if event.Issue.PullRequest == nil {
		slog.Debug(fmt.Sprintf("[WEBHOOK] Issue #%d is not a Pull Request, ignoring", event.Issue.Number))
		return nil
	}

	// Match bot command
	matches := reBotCommand.FindStringSubmatch(event.Comment.Body)
	if len(matches) < 2 {
		return nil // Not a bot command, normal discussion comment
	}

	rawCompName := strings.TrimSpace(matches[1])
	if !domain.ValidComponentName(rawCompName) {
		errMsg := fmt.Sprintf("⚠️ Supernova command error: Invalid component name %q. Component names must be PascalCase alphanumeric identifiers.", rawCompName)
		if s.prManager != nil {
			_ = s.prManager.CreateComment(ctx, event.Repository.Owner.Login, event.Repository.Name, event.Issue.Number, errMsg)
		}
		return fmt.Errorf("invalid component name %q", rawCompName)
	}
	compName := rawCompName

	notes := ""
	if len(matches) >= 3 {
		notes = strings.TrimSpace(matches[2])
	}

	return s.regenerateComponentForPR(ctx, event, compName, notes)
}

func (s *Service) regenerateComponentForPR(ctx context.Context, event githubIssueCommentEvent, compName string, notes string) error {
	owner := event.Repository.Owner.Login
	repo := event.Repository.Name
	prNumber := event.Issue.Number

	if s.prManager == nil {
		return errors.New("pull request manager is not configured")
	}

	slog.Info(fmt.Sprintf("[WEBHOOK] Processing /supernova regenerate for %s on PR #%d (%s/%s)", compName, prNumber, owner, repo))

	branch, err := s.prManager.GetPullRequestBranch(ctx, owner, repo, prNumber)
	if err != nil {
		errMsg := fmt.Sprintf("⚠️ Supernova failed to fetch PR branch for #%d: %v", prNumber, err)
		_ = s.prManager.CreateComment(ctx, owner, repo, prNumber, errMsg)
		return err
	}

	// Try reading existing source from PR branch
	filePath := fmt.Sprintf("src/components/%s.lite.tsx", compName)
	existingSource, getSrcErr := s.prManager.GetFileContent(ctx, owner, repo, filePath, branch)
	if getSrcErr != nil {
		slog.Warn(fmt.Sprintf("[WEBHOOK] Could not read existing %s from branch %s: %v", filePath, branch, getSrcErr))
	}

	// Check if we have component snapshot in database
	var spec *contracts.FigmaComponentSpec
	var tokens []contracts.FigmaToken
	if s.store != nil {
		compSnap, _ := s.store.GetComponentSnapshot(ctx, "", compName)
		if compSnap != nil && compSnap.Spec != nil {
			spec = compSnap.Spec
		}
		if existingSource == "" && compSnap != nil && compSnap.SourceCode != "" {
			existingSource = compSnap.SourceCode
		}

		// Also try to find latest tokens
		if compSnap != nil && compSnap.DocumentName != "" {
			if snap, _ := s.store.GetLatestSnapshot(ctx, compSnap.DocumentName); snap != nil {
				tokens = snap.Tokens
			}
		}
	}

	// Prepare Author request
	req := out.AuthorRequest{
		ComponentName:  compName,
		ExistingSource: existingSource,
		FeedbackNotes:  notes,
		Targets:        []contracts.Framework{contracts.Framework("mitosis"), contracts.React, contracts.Vue3, contracts.Svelte},
	}
	if spec != nil {
		req.Components = []contracts.FigmaComponentSpec{*spec}
	}
	if len(tokens) > 0 {
		req.Tokens = tokens
	}

	authorResult, err := s.author.AuthorDesignSystem(ctx, req)
	if err != nil {
		errMsg := fmt.Sprintf("⚠️ Supernova failed to regenerate component **%s**:\n```\n%v\n```", compName, err)
		_ = s.prManager.CreateComment(ctx, owner, repo, prNumber, errMsg)
		return fmt.Errorf("authoring failed for %s: %w", compName, err)
	}

	// Collect artifacts for this component
	artifacts := make([]domain.CompiledArtifact, 0, len(authorResult.Artifacts)+1)
	if code, ok := authorResult.Components[compName]; ok && code != "" {
		artifacts = append(artifacts, domain.CompiledArtifact{
			Target:   contracts.Framework("mitosis"),
			FileName: compName + ".lite.tsx",
			Group:    domain.GroupComponents,
			Code:     code,
		})
	}
	for _, art := range authorResult.Artifacts {
		if strings.HasPrefix(art.FileName, compName+".") {
			artifacts = append(artifacts, art)
		}
	}

	if len(artifacts) == 0 {
		errMsg := fmt.Sprintf("⚠️ Supernova author produced no artifacts for component **%s**.", compName)
		_ = s.prManager.CreateComment(ctx, owner, repo, prNumber, errMsg)
		return fmt.Errorf("no artifacts generated for %s", compName)
	}

	commitMsg := fmt.Sprintf("fix(%s): regenerate component from review feedback (PR #%d)", compName, prNumber)
	commitSha, err := s.prManager.CommitArtifacts(ctx, owner, repo, branch, artifacts, commitMsg)
	if err != nil {
		errMsg := fmt.Sprintf("⚠️ Supernova regenerated **%s**, but failed to commit to branch `%s`:\n```\n%v\n```", compName, branch, err)
		_ = s.prManager.CreateComment(ctx, owner, repo, prNumber, errMsg)
		return fmt.Errorf("commit failed for %s: %w", compName, err)
	}

	// Post success comment
	var noteSummary string
	if notes != "" {
		noteSummary = fmt.Sprintf("\n> Feedback: *%s*\n", notes)
	}
	successMsg := fmt.Sprintf("✅ Supernova successfully regenerated component **%s**.%s\nCommit: `%s` on branch `%s`.", compName, noteSummary, commitSha, branch)
	_ = s.prManager.CreateComment(ctx, owner, repo, prNumber, successMsg)

	slog.Info(fmt.Sprintf("[WEBHOOK] Successfully regenerated and committed %s to %s (commit %s)", compName, branch, commitSha))
	return nil
}

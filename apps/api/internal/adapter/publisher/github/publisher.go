package github

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/dwlhm/supernova/apps/api/internal/core/app"
	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/out"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
	gh "github.com/google/go-github/v69/github"
)

// GitHubPublisher implements out.ArtifactPublisher to create branches and PRs on GitHub.
type GitHubPublisher struct {
	token      string
	repo       string // "owner/repo"
	baseBranch string // e.g. "main"
	store      out.JobStore
	baseURL    string
}

var _ out.ArtifactPublisher = (*GitHubPublisher)(nil)

// NewPublisher creates a new GitHubPublisher.
func NewPublisher(token, repo, baseBranch string, store ...out.JobStore) *GitHubPublisher {
	var s out.JobStore
	if len(store) > 0 {
		s = store[0]
	}
	if baseBranch == "" {
		baseBranch = "main"
	}
	return &GitHubPublisher{
		token:      token,
		repo:       repo,
		baseBranch: baseBranch,
		store:      s,
	}
}

// SetBaseURL overrides the GitHub API base URL (useful for testing with httptest).
func (p *GitHubPublisher) SetBaseURL(baseURL string) {
	p.baseURL = baseURL
}

func (p *GitHubPublisher) newClient() *gh.Client {
	client := gh.NewClient(nil).WithAuthToken(p.token)
	if p.baseURL != "" {
		baseURLStr := p.baseURL
		if !strings.HasSuffix(baseURLStr, "/") {
			baseURLStr += "/"
		}
		if parsedURL, err := url.Parse(baseURLStr); err == nil {
			client.BaseURL = parsedURL
		}
	}
	return client
}

// Name returns the identifier for this publisher.
func (p *GitHubPublisher) Name() string {
	return string(contracts.PullRequest)
}

// ScanSourcesFromDir scans a cloned repository directory for .lite.tsx component and icon sources in src/.
func ScanSourcesFromDir(rootDir string) map[string]string {
	sources := make(map[string]string)
	srcDir := filepath.Join(rootDir, "src")
	if fi, err := os.Stat(srcDir); err != nil || !fi.IsDir() {
		slog.Info("[GITHUB] No src directory found in repository clone; considering all components new")
		return sources
	}

	err := filepath.WalkDir(srcDir, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() && strings.HasSuffix(d.Name(), ".lite.tsx") {
			compName := strings.TrimSuffix(d.Name(), ".lite.tsx")
			content, err := os.ReadFile(path)
			if err != nil {
				slog.Warn(fmt.Sprintf("[GITHUB] Failed to read component file %s: %v", path, err))
				return nil
			}
			sources[compName] = string(content)
			if normalized := domain.NormalizeComponentName(compName); normalized != "" && normalized != compName {
				sources[normalized] = string(content)
			}
		}
		return nil
	})
	if err != nil {
		slog.Warn(fmt.Sprintf("[GITHUB] Error walking src directory: %v", err))
	}

	if len(sources) == 0 {
		slog.Info("[GITHUB] No .lite.tsx files found in repository clone; considering all components new")
	}

	return sources
}

// GetExistingSources pre-fetches existing .lite.tsx component sources by shallow cloning the repository
// into a temporary directory and scanning the src directory tree.
func (p *GitHubPublisher) GetExistingSources(ctx context.Context) (map[string]string, error) {
	sources := make(map[string]string)
	if p.token == "" || p.repo == "" {
		return sources, nil
	}

	parts := strings.Split(p.repo, "/")
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		return nil, fmt.Errorf("invalid repo format %q, expected 'owner/repo'", p.repo)
	}
	owner, repoName := parts[0], strings.TrimSuffix(parts[1], ".git")

	baseBranch := p.baseBranch
	if baseBranch == "" {
		baseBranch = "main"
	}

	tmpDir, err := os.MkdirTemp("", "supernova-clone-*")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp directory for repo clone: %w", err)
	}
	defer os.RemoveAll(tmpDir)

	host := "github.com"
	if p.baseURL != "" {
		if parsedURL, err := url.Parse(p.baseURL); err == nil && parsedURL.Host != "" {
			host = parsedURL.Host
		}
	}
	cloneURL := fmt.Sprintf("https://x-access-token:%s@%s/%s/%s.git", p.token, host, owner, repoName)

	cmd := exec.CommandContext(ctx, "git", "clone", "--depth", "1", "--branch", baseBranch, cloneURL, tmpDir)
	output, err := cmd.CombinedOutput()
	if err != nil {
		errStr := fmt.Sprintf("git clone failed: %v, output: %s", err, string(output))
		if p.token != "" {
			errStr = strings.ReplaceAll(errStr, p.token, "***")
		}
		slog.Warn(fmt.Sprintf("[GITHUB] %s (proceeding without existing sources)", errStr))
		return sources, nil
	}

	sources = ScanSourcesFromDir(tmpDir)
	if len(sources) > 0 {
		slog.Info(fmt.Sprintf("[GITHUB] Pre-fetched %d existing component source(s) from %s", len(sources), p.repo))
	}

	return sources, nil
}

// GetExistingComponentInfo clones the repo into a temporary workspace directory and collects component names.
// The caller is responsible for invoking cleanup() when finished with workspaceDir.
func (p *GitHubPublisher) GetExistingComponentInfo(ctx context.Context) (names []string, workspaceDir string, cleanup func(), err error) {
	noOpCleanup := func() {}
	if p.token == "" || p.repo == "" {
		return nil, "", noOpCleanup, nil
	}

	parts := strings.Split(p.repo, "/")
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		return nil, "", noOpCleanup, fmt.Errorf("invalid repo format %q, expected 'owner/repo'", p.repo)
	}
	owner, repoName := parts[0], strings.TrimSuffix(parts[1], ".git")

	baseBranch := p.baseBranch
	if baseBranch == "" {
		baseBranch = "main"
	}

	tmpDir, err := os.MkdirTemp("", "supernova-clone-*")
	if err != nil {
		return nil, "", noOpCleanup, fmt.Errorf("failed to create temp directory for repo clone: %w", err)
	}

	cleanupFunc := func() {
		_ = os.RemoveAll(tmpDir)
	}

	host := "github.com"
	if p.baseURL != "" {
		if parsedURL, err := url.Parse(p.baseURL); err == nil && parsedURL.Host != "" {
			host = parsedURL.Host
		}
	}
	cloneURL := fmt.Sprintf("https://x-access-token:%s@%s/%s/%s.git", p.token, host, owner, repoName)

	cmd := exec.CommandContext(ctx, "git", "clone", "--depth", "1", "--branch", baseBranch, cloneURL, tmpDir)
	output, err := cmd.CombinedOutput()
	if err != nil {
		errStr := fmt.Sprintf("git clone failed: %v, output: %s", err, string(output))
		if p.token != "" {
			errStr = strings.ReplaceAll(errStr, p.token, "***")
		}
		slog.Warn(fmt.Sprintf("[GITHUB] %s (proceeding without existing components)", errStr))
		_ = os.RemoveAll(tmpDir)
		return nil, "", noOpCleanup, nil
	}

	var compNames []string
	srcDir := filepath.Join(tmpDir, "src")
	if fi, err := os.Stat(srcDir); err == nil && fi.IsDir() {
		_ = filepath.WalkDir(srcDir, func(path string, d os.DirEntry, err error) error {
			if err != nil {
				return err
			}
			if !d.IsDir() && strings.HasSuffix(d.Name(), ".lite.tsx") {
				name := strings.TrimSuffix(d.Name(), ".lite.tsx")
				compNames = append(compNames, name)
			}
			return nil
		})
	}

	slog.Info(fmt.Sprintf("[GITHUB] Found %d existing component(s) in %s", len(compNames), p.repo))
	return compNames, tmpDir, cleanupFunc, nil
}

// GetExistingComponentSource fetches the source of an existing component from the repository, if available.
func (p *GitHubPublisher) GetExistingComponentSource(ctx context.Context, compName string) (string, error) {
	if p.token == "" || p.repo == "" {
		return "", nil
	}

	parts := strings.Split(p.repo, "/")
	if len(parts) != 2 {
		return "", fmt.Errorf("invalid repo format %q, expected 'owner/repo'", p.repo)
	}
	owner, repoName := parts[0], parts[1]

	baseBranch := p.baseBranch
	if baseBranch == "" {
		baseBranch = "main"
	}

	client := p.newClient()
	filePath := fmt.Sprintf("src/components/%s.lite.tsx", compName)

	fileContent, _, resp, err := client.Repositories.GetContents(ctx, owner, repoName, filePath, &gh.RepositoryContentGetOptions{
		Ref: baseBranch,
	})
	if err != nil {
		if resp != nil && resp.StatusCode == http.StatusNotFound {
			return "", nil
		}
		return "", fmt.Errorf("failed to get existing component source for %s: %w", compName, err)
	}

	if fileContent == nil {
		return "", nil
	}

	content, err := fileContent.GetContent()
	if err != nil {
		return "", fmt.Errorf("failed to decode existing component content for %s: %w", compName, err)
	}

	return content, nil
}

// Publish creates a branch, commits artifacts, and opens a Pull Request on GitHub.
func (p *GitHubPublisher) Publish(ctx context.Context, job *domain.Job) error {
	if p.token == "" || p.repo == "" {
		slog.Warn(fmt.Sprintf("[GITHUB] [%s] GitHub publisher skipped: GITHUB_TOKEN or GITHUB_REPO not configured", job.ID))
		return nil
	}

	parts := strings.Split(p.repo, "/")
	if len(parts) != 2 {
		err := fmt.Errorf("invalid repo format %q, expected 'owner/repo'", p.repo)
		slog.Error(fmt.Sprintf("[GITHUB] [ERROR] [%s] repository parsing failed: %v", job.ID, err))
		return err
	}
	owner, repoName := parts[0], parts[1]

	client := p.newClient()

	baseBranch := p.baseBranch
	if baseBranch == "" {
		baseBranch = "main"
	}

	slog.Info(fmt.Sprintf("[GITHUB] [%s] Starting PR creation on %s (base: %s)", job.ID, p.repo, baseBranch))

	baseRef, _, err := client.Git.GetRef(ctx, owner, repoName, "refs/heads/"+baseBranch)
	if err != nil {
		wrapErr := fmt.Errorf("failed to get base ref %s: %w", baseBranch, err)
		slog.Error(fmt.Sprintf("[GITHUB] [ERROR] [%s] get base ref failed: %v", job.ID, wrapErr))
		return wrapErr
	}
	baseSHA := baseRef.GetObject().GetSHA()
	slog.Info(fmt.Sprintf("[GITHUB] [%s] Base commit SHA: %s", job.ID, baseSHA))

	var treeEntries []*gh.TreeEntry
	seenPaths := make(map[string]bool)
	for _, art := range job.Artifacts {
		if art.Target == contracts.Framework("mitosis") {
			fileName := art.FileName
			if art.FileName == "utils.ts" || art.FileName == "components/utils.ts" || art.FileName == "src/components/utils.ts" {
				fileName = "src/components/utils.ts"
			} else if strings.HasPrefix(fileName, "src/") {
				// already has src/ prefix
			} else if strings.HasPrefix(fileName, "components/") || strings.HasPrefix(fileName, "icons/") {
				fileName = "src/" + fileName
			} else if art.Group == "icons" {
				fileName = fmt.Sprintf("src/icons/%s", strings.TrimPrefix(fileName, "/"))
			} else if art.Group != "" && art.Group != "components" {
				fileName = fmt.Sprintf("src/%s/%s", art.Group, strings.TrimPrefix(fileName, "/"))
			} else {
				fileName = fmt.Sprintf("src/components/%s", strings.TrimPrefix(fileName, "/"))
			}
			if seenPaths[fileName] {
				continue
			}
			seenPaths[fileName] = true
			treeEntries = append(treeEntries, &gh.TreeEntry{
				Path:    gh.Ptr(fileName),
				Mode:    gh.Ptr("100644"),
				Type:    gh.Ptr("blob"),
				Content: gh.Ptr(art.Code),
			})
		}
	}

	for _, art := range job.Artifacts {
		if art.Target == contracts.Framework("docs") {
			baseName := filepath.Base(art.FileName)
			var docPath string
			if baseName == "tokens.md" {
				docPath = "docs/tokens.md"
			} else if baseName == "index.md" {
				docPath = "docs/components/index.md"
			} else {
				docPath = "docs/components/" + baseName
			}
			if seenPaths[docPath] {
				continue
			}
			seenPaths[docPath] = true
			treeEntries = append(treeEntries, &gh.TreeEntry{
				Path:    gh.Ptr(docPath),
				Mode:    gh.Ptr("100644"),
				Type:    gh.Ptr("blob"),
				Content: gh.Ptr(art.Code),
			})
		}
	}

	tokenArtifacts := make(map[string]string)
	for _, art := range job.Artifacts {
		if art.Target == contracts.Framework("tokens") {
			name := art.FileName
			name = strings.TrimPrefix(name, "src/tokens/")
			name = strings.TrimPrefix(name, "tokens/")
			name = strings.TrimPrefix(name, "/")
			tokenArtifacts[name] = art.Code
		}
	}

	tokens := job.Document.Tokens
	if tokens == nil {
		tokens = []contracts.FigmaToken{}
	}
	resolved := app.ResolveTokens(tokens)

	// tokens.json
	tokensJSONCode, ok := tokenArtifacts["tokens.json"]
	if !ok {
		tokensJSON, err := json.MarshalIndent(resolved, "", "  ")
		if err != nil {
			wrapErr := fmt.Errorf("failed to serialize tokens for PR: %w", err)
			slog.Error(fmt.Sprintf("[GITHUB] [ERROR] [%s] serialize tokens failed: %v", job.ID, wrapErr))
			return wrapErr
		}
		tokensJSONCode = string(tokensJSON)
	}
	treeEntries = append(treeEntries, &gh.TreeEntry{
		Path:    gh.Ptr("src/tokens/tokens.json"),
		Mode:    gh.Ptr("100644"),
		Type:    gh.Ptr("blob"),
		Content: gh.Ptr(tokensJSONCode),
	})

	// theme.css
	themeCSSCode, ok := tokenArtifacts["theme.css"]
	if !ok {
		themeCSSCode = app.GenerateThemeCSS(resolved)
	}
	treeEntries = append(treeEntries, &gh.TreeEntry{
		Path:    gh.Ptr("src/tokens/theme.css"),
		Mode:    gh.Ptr("100644"),
		Type:    gh.Ptr("blob"),
		Content: gh.Ptr(themeCSSCode),
	})

	// tokens.css
	tokensCSSCode, ok := tokenArtifacts["tokens.css"]
	if !ok {
		tokensCSSCode = app.GenerateTokensCSS(resolved)
	}
	treeEntries = append(treeEntries, &gh.TreeEntry{
		Path:    gh.Ptr("src/tokens/tokens.css"),
		Mode:    gh.Ptr("100644"),
		Type:    gh.Ptr("blob"),
		Content: gh.Ptr(tokensCSSCode),
	})

	// tokens.ts
	tokensTSCode, ok := tokenArtifacts["tokens.ts"]
	if !ok {
		tokensTSCode = app.GenerateTokensTS(resolved)
	}
	treeEntries = append(treeEntries, &gh.TreeEntry{
		Path:    gh.Ptr("src/tokens/tokens.ts"),
		Mode:    gh.Ptr("100644"),
		Type:    gh.Ptr("blob"),
		Content: gh.Ptr(tokensTSCode),
	})

	tree, _, err := client.Git.CreateTree(ctx, owner, repoName, baseSHA, treeEntries)
	if err != nil {
		wrapErr := fmt.Errorf("failed to create git tree: %w", err)
		slog.Error(fmt.Sprintf("[GITHUB] [ERROR] [%s] create git tree failed: %v", job.ID, wrapErr))
		return wrapErr
	}
	slog.Info(fmt.Sprintf("[GITHUB] [%s] Created tree with %d blobs", job.ID, len(treeEntries)))

	commitMsg := fmt.Sprintf("feat(design-system): sync components from Figma [%s]", job.ID)
	if job.Options != nil && job.Options.PrTitle != nil && *job.Options.PrTitle != "" {
		commitMsg = *job.Options.PrTitle
	}

	parentCommit, _, err := client.Git.GetCommit(ctx, owner, repoName, baseSHA)
	if err != nil {
		wrapErr := fmt.Errorf("failed to get parent commit: %w", err)
		slog.Error(fmt.Sprintf("[GITHUB] [ERROR] [%s] get parent commit failed: %v", job.ID, wrapErr))
		return wrapErr
	}

	newCommit := &gh.Commit{
		Message: gh.Ptr(commitMsg),
		Tree:    tree,
		Parents: []*gh.Commit{parentCommit},
	}

	createdCommit, _, err := client.Git.CreateCommit(ctx, owner, repoName, newCommit, nil)
	if err != nil {
		wrapErr := fmt.Errorf("failed to create commit: %w", err)
		slog.Error(fmt.Sprintf("[GITHUB] [ERROR] [%s] create commit failed: %v", job.ID, wrapErr))
		return wrapErr
	}
	slog.Info(fmt.Sprintf("[GITHUB] [%s] Created commit %s", job.ID, createdCommit.GetSHA()))

	shortID := job.ID
	if len(shortID) > 8 {
		shortID = shortID[:8]
	}
	branchName := fmt.Sprintf("supernova/figma-%s", shortID)
	if job.Options != nil && job.Options.BranchName != nil && *job.Options.BranchName != "" {
		branchName = *job.Options.BranchName
	}

	ref := &gh.Reference{
		Ref: gh.Ptr("refs/heads/" + branchName),
		Object: &gh.GitObject{
			SHA: createdCommit.SHA,
		},
	}
	_, _, err = client.Git.CreateRef(ctx, owner, repoName, ref)
	if err != nil {
		wrapErr := fmt.Errorf("failed to create ref %s: %w", branchName, err)
		slog.Error(fmt.Sprintf("[GITHUB] [ERROR] [%s] create ref failed: %v", job.ID, wrapErr))
		return wrapErr
	}
	slog.Info(fmt.Sprintf("[GITHUB] [%s] Created/updated branch %s", job.ID, branchName))

	prTitle := commitMsg
	prBody := fmt.Sprintf("Automated PR created by Supernova Figma sync for job `%s`.\n\nCommitted Mitosis universal sources and design tokens.", job.ID)
	newPR := &gh.NewPullRequest{
		Title: gh.Ptr(prTitle),
		Head:  gh.Ptr(branchName),
		Base:  gh.Ptr(baseBranch),
		Body:  gh.Ptr(prBody),
	}

	pr, _, err := client.PullRequests.Create(ctx, owner, repoName, newPR)
	if err != nil {
		wrapErr := fmt.Errorf("failed to create pull request: %w", err)
		slog.Error(fmt.Sprintf("[GITHUB] [ERROR] [%s] create pull request failed: %v", job.ID, wrapErr))
		return wrapErr
	}

	prURL := pr.GetHTMLURL()
	prNumber := pr.GetNumber()
	slog.Info(fmt.Sprintf("[GITHUB] [%s] Created Pull Request #%d: %s", job.ID, prNumber, prURL))

	if job.PublishResults == nil {
		job.PublishResults = &contracts.PublishResults{}
	}
	job.PublishResults.PullRequestUrl = &prURL

	if p.store != nil {
		if err := p.store.SavePublishResults(ctx, job.ID, job.PublishResults); err != nil {
			slog.Warn(fmt.Sprintf("[GITHUB] [WARN] [%s] Failed to save publish results: %v", job.ID, err))
		}
	}

	return nil
}

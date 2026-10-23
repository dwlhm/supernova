package github

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

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
var _ out.PullRequestManager = (*GitHubPublisher)(nil)

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

	cacheDir := filepath.Join(os.TempDir(), "supernova-repo-cache", owner, repoName)
	_ = os.MkdirAll(filepath.Dir(cacheDir), 0755)

	host := "github.com"
	if p.baseURL != "" {
		if parsedURL, err := url.Parse(p.baseURL); err == nil && parsedURL.Host != "" {
			host = parsedURL.Host
		}
	}
	cloneURL := fmt.Sprintf("https://x-access-token:%s@%s/%s/%s.git", p.token, host, owner, repoName)

	if fi, err := os.Stat(filepath.Join(cacheDir, ".git")); err == nil && fi.IsDir() {
		// Cached repository exists: fetch and reset to latest baseBranch
		_ = exec.CommandContext(ctx, "git", "-C", cacheDir, "fetch", "--depth", "1", "origin", baseBranch).Run()
		_ = exec.CommandContext(ctx, "git", "-C", cacheDir, "checkout", baseBranch).Run()
		_ = exec.CommandContext(ctx, "git", "-C", cacheDir, "reset", "--hard", "origin/"+baseBranch).Run()
	} else {
		_ = os.RemoveAll(cacheDir)
		cmd := exec.CommandContext(ctx, "git", "clone", "--depth", "1", "--branch", baseBranch, cloneURL, cacheDir)
		output, err := cmd.CombinedOutput()
		if err != nil {
			errStr := fmt.Sprintf("git clone failed: %v, output: %s", err, string(output))
			if p.token != "" {
				errStr = strings.ReplaceAll(errStr, p.token, "***")
			}
			slog.Warn(fmt.Sprintf("[GITHUB] %s (proceeding without existing components)", errStr))
			_ = os.RemoveAll(cacheDir)
			return nil, "", noOpCleanup, nil
		}
	}

	tmpDir := cacheDir
	cleanupFunc := noOpCleanup

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

	// Check if repository needs bootstrapping (e.g. package.json not yet on baseBranch)
	_, _, resp, err := client.Repositories.GetContents(ctx, owner, repoName, "package.json", &gh.RepositoryContentGetOptions{Ref: baseBranch})
	isUnbootstrapped := err != nil && resp != nil && resp.StatusCode == http.StatusNotFound

	treeEntries, err := buildTreeEntries(job.Artifacts)
	if err != nil {
		slog.Error(fmt.Sprintf("[GITHUB] [ERROR] [%s] Refusing artifacts: %v", job.ID, err))
		return err
	}

	if isUnbootstrapped {
		slog.Info(fmt.Sprintf("[GITHUB] [%s] Target repository has no package.json; bootstrapping design system scaffolding", job.ID))
		for p, content := range defaultScaffolding {
			treeEntries = append(treeEntries, &gh.TreeEntry{
				Path:    gh.Ptr(p),
				Mode:    gh.Ptr("100644"),
				Type:    gh.Ptr("blob"),
				Content: gh.Ptr(content),
			})
		}
	}

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

	docSlug := domain.CamelToKebab(domain.NormalizeComponentName(job.DocumentName))
	if docSlug == "" {
		docSlug = "sync"
	}
	branchName := fmt.Sprintf("supernova/%s", docSlug)
	if job.Options != nil && job.Options.BranchName != nil && *job.Options.BranchName != "" {
		branchName = *job.Options.BranchName
	}

	// Update existing branch ref or create a new one
	existingRef, _, getRefErr := client.Git.GetRef(ctx, owner, repoName, "refs/heads/"+branchName)
	if getRefErr == nil && existingRef != nil {
		existingRef.Object.SHA = createdCommit.SHA
		_, _, err = client.Git.UpdateRef(ctx, owner, repoName, existingRef, true)
		if err != nil {
			wrapErr := fmt.Errorf("failed to update ref %s: %w", branchName, err)
			slog.Error(fmt.Sprintf("[GITHUB] [ERROR] [%s] update ref failed: %v", job.ID, wrapErr))
			return wrapErr
		}
		slog.Info(fmt.Sprintf("[GITHUB] [%s] Updated existing branch %s to %s", job.ID, branchName, createdCommit.GetSHA()))
	} else {
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
		slog.Info(fmt.Sprintf("[GITHUB] [%s] Created branch %s", job.ID, branchName))
	}

	// Check if an open PR for this branch already exists
	var prURL string
	prs, _, listErr := client.PullRequests.List(ctx, owner, repoName, &gh.PullRequestListOptions{
		Head:  fmt.Sprintf("%s:%s", owner, branchName),
		State: "open",
	})
	if listErr == nil && len(prs) > 0 {
		prURL = prs[0].GetHTMLURL()
		prNumber := prs[0].GetNumber()
		slog.Info(fmt.Sprintf("[GITHUB] [%s] Updated existing Pull Request #%d: %s", job.ID, prNumber, prURL))
	} else {
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

		prURL = pr.GetHTMLURL()
		prNumber := pr.GetNumber()
		slog.Info(fmt.Sprintf("[GITHUB] [%s] Created Pull Request #%d: %s", job.ID, prNumber, prURL))
	}

	if job.PublishResults == nil {
		job.PublishResults = &contracts.PublishResults{}
	}
	job.PublishResults.PullRequestUrl = &prURL
	job.PublishResults.BranchName = &branchName
	sha := createdCommit.GetSHA()
	job.PublishResults.CommitSha = &sha

	if p.store != nil {
		if err := p.store.SavePublishResults(ctx, job.ID, job.PublishResults); err != nil {
			slog.Warn(fmt.Sprintf("[GITHUB] [WARN] [%s] Failed to save publish results: %v", job.ID, err))
		}
	}

	return nil
}

var defaultScaffolding = map[string]string{
	"package.json": `{
  "name": "@supernova-ds/core",
  "version": "0.1.0",
  "description": "Multi-framework Design System generated by Supernova",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "src"
  ],
  "scripts": {
    "build": "pnpm compile && tsc",
    "compile": "node scripts/compile.mjs",
    "typecheck": "tsc --noEmit",
    "test": "node --test test/*.test.js",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "changeset publish"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.2"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.12",
    "@supernova/mitosis-compiler": "workspace:*",
    "@types/node": "^22.13.9",
    "typescript": "^5.8.2"
  }
}
`,
	"tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
`,
	"README.md": `# Supernova Design System

Multi-framework design system generated directly from Figma using Supernova.

## Structure
- ` + "`src/components/`" + `: Mitosis universal components (` + "`*.lite.tsx`" + `)
- ` + "`src/tokens/`" + `: Design tokens (` + "`tokens.json`" + `, ` + "`theme.css`" + `, ` + "`tokens.css`" + `)
- ` + "`src/icons/`" + `: SVG icon components

## Publishing
Versioning and releases are automatically handled by Changesets and GitHub Actions.
To propose version bumps in PRs, run ` + "`pnpm changeset`" + `.
`,
	".changeset/config.json": `{
  "$schema": "https://unpkg.com/@changesets/config/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
`,
	".changeset/README.md": `# Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.
When creating pull requests that change components or tokens, add a changeset with ` + "`pnpm changeset`" + `.
`,
	".github/workflows/ci.yml": `name: CI

on:
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm typecheck
      - run: pnpm test
`,
	".github/workflows/release.yml": `name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release & Publish
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm version-packages
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
`,
	"scripts/compile.mjs": `#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const componentsDir = path.resolve(rootDir, 'src/components');
const distDir = path.resolve(rootDir, 'dist');

async function main() {
  console.log('[compile] Multi-framework compilation for Supernova Design System...');
  await fs.mkdir(distDir, { recursive: true });
}

main().catch((err) => {
  console.error('[compile] Error:', err);
  process.exit(1);
});
`,
}

// buildTreeEntries maps artifacts to repository blobs using the shared domain layout.
// The first artifact for a given path wins; unpublished targets are skipped.
func buildTreeEntries(artifacts []domain.CompiledArtifact) ([]*gh.TreeEntry, error) {
	entries := make([]*gh.TreeEntry, 0, len(artifacts))
	seen := make(map[string]bool, len(artifacts))
	for _, art := range artifacts {
		p, err := domain.ArtifactPath(art)
		if errors.Is(err, domain.ErrUnpublishedTarget) {
			continue
		}
		if err != nil {
			return nil, err
		}
		if seen[p] {
			continue
		}
		seen[p] = true
		entries = append(entries, &gh.TreeEntry{
			Path:    gh.Ptr(p),
			Mode:    gh.Ptr("100644"),
			Type:    gh.Ptr("blob"),
			Content: gh.Ptr(art.Code),
		})
	}
	return entries, nil
}

// GetPullRequestBranch retrieves the head branch name for a given pull request.
func (p *GitHubPublisher) GetPullRequestBranch(ctx context.Context, owner, repo string, prNumber int) (string, error) {
	client := p.newClient()
	pr, _, err := client.PullRequests.Get(ctx, owner, repo, prNumber)
	if err != nil {
		return "", fmt.Errorf("failed to get pull request #%d: %w", prNumber, err)
	}
	if pr == nil || pr.Head == nil || pr.Head.Ref == nil {
		return "", fmt.Errorf("pull request #%d head ref is missing", prNumber)
	}
	return *pr.Head.Ref, nil
}

// GetFileContent retrieves the raw text content of a file at a specific branch or commit ref.
func (p *GitHubPublisher) GetFileContent(ctx context.Context, owner, repo, filePath, ref string) (string, error) {
	client := p.newClient()
	opts := &gh.RepositoryContentGetOptions{}
	if ref != "" {
		opts.Ref = ref
	}
	fileContent, _, resp, err := client.Repositories.GetContents(ctx, owner, repo, filePath, opts)
	if err != nil {
		if resp != nil && resp.StatusCode == http.StatusNotFound {
			return "", nil
		}
		return "", fmt.Errorf("failed to get content for %s at %s: %w", filePath, ref, err)
	}
	if fileContent == nil {
		return "", nil
	}
	content, err := fileContent.GetContent()
	if err != nil {
		return "", fmt.Errorf("failed to decode content for %s: %w", filePath, err)
	}
	return content, nil
}

// CommitArtifacts writes artifacts to the specified branch and returns the new commit SHA.
func (p *GitHubPublisher) CommitArtifacts(ctx context.Context, owner, repo, branch string, artifacts []domain.CompiledArtifact, message string) (string, error) {
	client := p.newClient()

	ref, _, err := client.Git.GetRef(ctx, owner, repo, "refs/heads/"+branch)
	if err != nil {
		return "", fmt.Errorf("failed to get branch ref %s: %w", branch, err)
	}
	baseSHA := ref.GetObject().GetSHA()

	treeEntries, err := buildTreeEntries(artifacts)
	if err != nil {
		return "", fmt.Errorf("failed to build tree entries: %w", err)
	}

	tree, _, err := client.Git.CreateTree(ctx, owner, repo, baseSHA, treeEntries)
	if err != nil {
		return "", fmt.Errorf("failed to create tree: %w", err)
	}

	parentCommit, _, err := client.Git.GetCommit(ctx, owner, repo, baseSHA)
	if err != nil {
		return "", fmt.Errorf("failed to get parent commit %s: %w", baseSHA, err)
	}

	newCommit := &gh.Commit{
		Message: gh.Ptr(message),
		Tree:    tree,
		Parents: []*gh.Commit{parentCommit},
	}
	createdCommit, _, err := client.Git.CreateCommit(ctx, owner, repo, newCommit, nil)
	if err != nil {
		return "", fmt.Errorf("failed to create commit: %w", err)
	}

	ref.Object.SHA = createdCommit.SHA
	_, _, err = client.Git.UpdateRef(ctx, owner, repo, ref, true)
	if err != nil {
		return "", fmt.Errorf("failed to update branch ref %s: %w", branch, err)
	}

	return createdCommit.GetSHA(), nil
}

// CreateComment posts a feedback or status comment on a pull request.
func (p *GitHubPublisher) CreateComment(ctx context.Context, owner, repo string, prNumber int, comment string) error {
	client := p.newClient()
	newComment := &gh.IssueComment{
		Body: gh.Ptr(comment),
	}
	_, _, err := client.Issues.CreateComment(ctx, owner, repo, prNumber, newComment)
	if err != nil {
		return fmt.Errorf("failed to create comment on #%d: %w", prNumber, err)
	}
	return nil
}

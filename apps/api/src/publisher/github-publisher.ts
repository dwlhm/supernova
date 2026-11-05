import * as fs from 'node:fs';
import * as path from 'node:path';
import { findRepoRoot } from '../config.js';
import { artifactPath } from '../domain/artifact-path.js';
import {
  camelToKebab,
  DomainError,
  normalizeComponentName,
  type CompiledArtifact,
  type Job,
} from '../domain/models.js';
import type { JobStore } from '../store/store.js';
import type { ArtifactPublisher, PullRequestManager } from './download-publisher.js';
import { buildPullRequestBody } from './pr-body.js';

interface GitTreeEntry {
  path: string;
  mode: '100644';
  type: 'blob';
  content: string;
}

const GITHUB_REQUEST_TIMEOUT_MS = 30_000;

const SCAFFOLD_REL_PATHS = [
  'package.json',
  'tsconfig.json',
  'README.md',
  '.changeset/config.json',
  '.changeset/README.md',
  '.github/workflows/ci.yml',
  '.github/workflows/release.yml',
  'scripts/compile.mjs',
];

function loadDefaultScaffolding(): Record<string, string> {
  const root = findRepoRoot(process.cwd());
  const out: Record<string, string> = {};
  if (!root) return out;
  const tplRoot = path.join(root, 'templates', 'ds-repo');
  for (const rel of SCAFFOLD_REL_PATHS) {
    const abs = path.join(tplRoot, rel);
    if (fs.existsSync(abs)) {
      out[rel] = fs.readFileSync(abs, 'utf8');
    }
  }
  return out;
}

export function buildTreeEntries(artifacts: CompiledArtifact[]): GitTreeEntry[] {
  const entries: GitTreeEntry[] = [];
  const seen = new Set<string>();
  for (const art of artifacts) {
    let p: string;
    try {
      p = artifactPath(art);
    } catch (err) {
      if (err instanceof DomainError && err.code === 'UNPUBLISHED_TARGET') continue;
      throw err;
    }
    if (seen.has(p)) continue;
    seen.add(p);
    entries.push({ path: p, mode: '100644', type: 'blob', content: art.code });
  }
  return entries;
}

export class GitHubPublisher implements ArtifactPublisher, PullRequestManager {
  private baseURL = 'https://api.github.com';

  constructor(
    private readonly token: string,
    private readonly repo: string,
    private readonly baseBranch = 'main',
    private readonly store?: JobStore
  ) {}

  setBaseURL(url: string): void {
    this.baseURL = url.replace(/\/+$/, '');
  }

  name(): string {
    return 'pull_request';
  }

  repoFullName(): string {
    return this.repo;
  }

  private async requestJSON<T = any>(
    method: string,
    endpoint: string,
    body?: unknown
  ): Promise<{ status: number; data: T }> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS),
    });
    const text = await res.text();
    let data: any = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text.slice(0, 200) };
      }
    }
    return { status: res.status, data };
  }

  /** Like requestJSON, but any non-2xx response becomes a descriptive error. */
  private async requestOK<T = any>(what: string, method: string, endpoint: string, body?: unknown): Promise<T> {
    const res = await this.requestJSON<T>(method, endpoint, body);
    if (res.status < 200 || res.status >= 300) {
      const detail = (res.data as { message?: string })?.message;
      throw new Error(`GitHub: failed to ${what}: HTTP ${res.status}${detail ? `: ${detail}` : ''}`);
    }
    return res.data;
  }

  /** Head SHA of a branch, or null when the branch does not exist. */
  private async branchHead(owner: string, repo: string, branch: string): Promise<string | null> {
    const res = await this.requestJSON('GET', `/repos/${owner}/${repo}/git/ref/heads/${branch}`);
    if (res.status === 404) return null;
    if (res.status >= 400 || !res.data?.object?.sha) {
      throw new Error(`GitHub: failed to get ref ${branch}: HTTP ${res.status}`);
    }
    return res.data.object.sha;
  }

  /** Commits `tree` on top of `parentSHA` and fast-forwards the branch (never force-pushes). */
  private async commitTree(
    owner: string,
    repo: string,
    parentSHA: string,
    tree: GitTreeEntry[],
    message: string
  ): Promise<string> {
    const treeData = await this.requestOK('create git tree', 'POST', `/repos/${owner}/${repo}/git/trees`, {
      base_tree: parentSHA,
      tree,
    });
    const commitData = await this.requestOK('create commit', 'POST', `/repos/${owner}/${repo}/git/commits`, {
      message,
      tree: treeData.sha,
      parents: [parentSHA],
    });
    return commitData.sha;
  }

  async publish(job: Job): Promise<void> {
    if (!this.token || !this.repo) return;
    const parts = this.repo.split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error(`invalid repo format "${this.repo}", expected "owner/repo"`);
    }
    const [owner, repoName] = parts;
    const baseBranch = this.baseBranch || 'main';

    const baseSHA = await this.branchHead(owner, repoName, baseBranch);
    if (!baseSHA) throw new Error(`GitHub: base branch ${baseBranch} not found`);

    const pkgRes = await this.requestJSON('GET', `/repos/${owner}/${repoName}/contents/package.json?ref=${encodeURIComponent(baseBranch)}`);
    if (pkgRes.status >= 400 && pkgRes.status !== 404) {
      throw new Error(`GitHub: failed to probe package.json: HTTP ${pkgRes.status}`);
    }
    const treeEntries = buildTreeEntries(job.artifacts);
    if (pkgRes.status === 404) {
      for (const [p, content] of Object.entries(loadDefaultScaffolding())) {
        treeEntries.push({ path: p, mode: '100644', type: 'blob', content });
      }
    }

    const docSlug = camelToKebab(normalizeComponentName(job.documentName)) || 'sync';
    const branchName = job.options?.branchName || `supernova/${docSlug}`;
    const commitMsg = job.options?.prTitle || `feat(design-system): sync components from Figma [${job.id}]`;

    // Stack on the existing PR branch so review commits (incl. `/supernova regenerate`) survive re-syncs.
    const branchSHA = await this.branchHead(owner, repoName, branchName);
    const commitSHA = await this.commitTree(owner, repoName, branchSHA ?? baseSHA, treeEntries, commitMsg);
    if (branchSHA) {
      await this.requestOK('update branch', 'PATCH', `/repos/${owner}/${repoName}/git/refs/heads/${branchName}`, { sha: commitSHA, force: false });
    } else {
      await this.requestOK('create branch', 'POST', `/repos/${owner}/${repoName}/git/refs`, { ref: `refs/heads/${branchName}`, sha: commitSHA });
    }

    const prs = await this.requestOK<Array<{ html_url: string; number: number }>>('list pull requests', 'GET', `/repos/${owner}/${repoName}/pulls?head=${encodeURIComponent(`${owner}:${branchName}`)}&state=open`);
    let prURL: string | undefined = prs[0]?.html_url;
    let prNumber: number | undefined = prs[0]?.number;
    if (!prURL) {
      const created = await this.requestOK('create pull request', 'POST', `/repos/${owner}/${repoName}/pulls`, {
        title: commitMsg, head: branchName, base: baseBranch,
        body: `Automated PR created by Supernova Figma sync for job \`${job.id}\`.`,
      });
      prURL = created.html_url;
      prNumber = created.number;
    }

    if (prNumber) {
      const richBody = buildPullRequestBody({ owner, repo: repoName, branchName, prNumber, commitSha: commitSHA, job });
      await this.requestOK('update pull request body', 'PATCH', `/repos/${owner}/${repoName}/pulls/${prNumber}`, { body: richBody });
    }

    job.publishResults = { ...(job.publishResults || {}), pullRequestUrl: prURL, branchName, commitSha: commitSHA };
    if (this.store) await this.store.savePublishResults(job.id, job.publishResults);
  }

  async getPullRequestBranch(owner: string, repo: string, prNumber: number): Promise<string> {
    const res = await this.requestJSON('GET', `/repos/${owner}/${repo}/pulls/${prNumber}`);
    if (res.status >= 400 || !res.data?.head?.ref) {
      throw new Error(`failed to get pull request #${prNumber}`);
    }
    return res.data.head.ref;
  }

  async getFileContent(owner: string, repo: string, filePath: string, ref: string): Promise<string> {
    const q = ref ? `?ref=${encodeURIComponent(ref)}` : '';
    const res = await this.requestJSON('GET', `/repos/${owner}/${repo}/contents/${filePath}${q}`);
    if (res.status === 404) return '';
    if (res.status >= 400) throw new Error(`GitHub: failed to get content for ${filePath}: HTTP ${res.status}`);
    return res.data?.content ? Buffer.from(res.data.content, 'base64').toString('utf8') : '';
  }

  async commitArtifacts(
    owner: string,
    repo: string,
    branch: string,
    artifacts: CompiledArtifact[],
    message: string
  ): Promise<string> {
    const headSHA = await this.branchHead(owner, repo, branch);
    if (!headSHA) throw new Error(`GitHub: branch ${branch} not found`);
    const sha = await this.commitTree(owner, repo, headSHA, buildTreeEntries(artifacts), message);
    await this.requestOK('update branch', 'PATCH', `/repos/${owner}/${repo}/git/refs/heads/${branch}`, { sha, force: false });
    return sha;
  }

  async createComment(owner: string, repo: string, prNumber: number, comment: string): Promise<void> {
    await this.requestOK(`comment on #${prNumber}`, 'POST', `/repos/${owner}/${repo}/issues/${prNumber}/comments`, { body: comment });
  }
}

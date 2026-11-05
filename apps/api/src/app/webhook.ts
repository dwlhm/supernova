import { GROUP_COMPONENTS, GROUP_ICONS, validComponentName } from '../domain/artifact-path.js';
import { DomainError, type CompiledArtifact, type FigmaComponentSpec, type FigmaToken } from '../domain/models.js';
import type { PullRequestManager } from '../publisher/download-publisher.js';
import type { JobStore } from '../store/store.js';
import type { MitosisAuthor } from './author-runner.js';
import { resolveComponentGroup } from './docs-writer.js';

const RE_BOT_COMMAND = /^\s*\/supernova\s+regenerate\s+([^\s:]+)(?:\s*:\s*(.+))?\s*$/m;

const TRUSTED_ASSOCIATIONS = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);

interface GitHubIssueCommentEvent {
  action?: string;
  issue?: {
    number: number;
    pull_request?: Record<string, unknown>;
  };
  comment?: {
    body?: string;
    author_association?: string;
  };
  repository?: {
    owner: { login: string };
    name: string;
    full_name?: string;
  };
  sender?: {
    login: string;
    type: string;
  };
}

interface RegenerateCommand {
  owner: string;
  repo: string;
  prNumber: number;
  componentName: string;
  notes: string;
}

export interface WebhookDeps {
  store: JobStore;
  author: MitosisAuthor;
  prManager?: PullRequestManager;
}

export interface WebhookResult {
  accepted: boolean;
  /** Settles when background regeneration ends; never rejects (failures are reported on the PR). */
  completion: Promise<void>;
}

function parseRegenerateCommand(
  eventType: string,
  payload: string | Uint8Array,
  prManager?: PullRequestManager
): RegenerateCommand | null {
  if (eventType !== 'issue_comment') return null;
  const text = typeof payload === 'string' ? payload : Buffer.from(payload).toString('utf8');
  let event: GitHubIssueCommentEvent;
  try {
    event = JSON.parse(text) as GitHubIssueCommentEvent;
  } catch {
    throw new DomainError('INVALID_PAYLOAD', 'webhook payload is not valid JSON');
  }

  if (event.action !== 'created' || !event.issue?.pull_request) return null;
  const senderType = (event.sender?.type || '').toLowerCase();
  const senderLogin = (event.sender?.login || '').toLowerCase();
  if (senderType === 'bot' || senderLogin.endsWith('[bot]')) return null;
  if (!TRUSTED_ASSOCIATIONS.has(event.comment?.author_association || '')) return null;

  const match = RE_BOT_COMMAND.exec(event.comment?.body || '');
  if (!match) return null;
  if (!prManager) throw new Error('pull request manager is not configured');

  const owner = event.repository?.owner.login || '';
  const repo = event.repository?.name || '';
  if (`${owner}/${repo}`.toLowerCase() !== prManager.repoFullName().toLowerCase()) return null;

  return {
    owner,
    repo,
    prNumber: event.issue.number,
    componentName: (match[1] || '').trim(),
    notes: (match[2] || '').trim(),
  };
}

export function processGitHubWebhook(
  eventType: string,
  payload: string | Uint8Array,
  deps: WebhookDeps
): WebhookResult {
  const cmd = parseRegenerateCommand(eventType, payload, deps.prManager);
  if (!cmd || !deps.prManager) return { accepted: false, completion: Promise.resolve() };
  const prManager = deps.prManager;
  const completion = regenerateComponent(cmd, deps, prManager).catch(async (err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[API] regenerate ${cmd.componentName} on PR #${cmd.prNumber} failed: ${msg}`);
    await prManager
      .createComment(cmd.owner, cmd.repo, cmd.prNumber, `⚠️ Supernova failed to regenerate **${cmd.componentName}**:\n\`\`\`\n${msg}\n\`\`\``)
      .catch((commentErr) => console.error('[API] failed to report webhook error on PR:', commentErr));
  });
  return { accepted: true, completion };
}

async function regenerateComponent(
  cmd: RegenerateCommand,
  deps: WebhookDeps,
  prManager: PullRequestManager
): Promise<void> {
  const { owner, repo, prNumber, notes } = cmd;
  const rawCompName = cmd.componentName;
  if (!validComponentName(rawCompName)) {
    throw new Error(`Invalid component name "${rawCompName}". Component names must be PascalCase alphanumeric identifiers.`);
  }

  const branch = await prManager.getPullRequestBranch(owner, repo, prNumber);

  let spec: FigmaComponentSpec | undefined;
  let tokens: FigmaToken[] = [];
  let savedGroup: string | undefined;
  let snapSource = '';

  const sourceJob = await deps.store.getLatestJobByBranch(branch);
  if (sourceJob) {
    const compProg = sourceJob.components.find((c) => c.name === rawCompName);
    if (compProg?.group) savedGroup = compProg.group;
    const compSnap = await deps.store.getComponentSnapshot(sourceJob.documentName, rawCompName);
    if (compSnap?.spec) spec = compSnap.spec;
    if (compSnap?.sourceCode) snapSource = compSnap.sourceCode;
    const snap = await deps.store.getLatestSnapshot(sourceJob.documentName);
    if (snap?.tokens) tokens = snap.tokens;
  }

  let group = resolveComponentGroup(savedGroup, rawCompName, spec);
  let existingSource = await prManager.getFileContent(owner, repo, `src/${group}/${rawCompName}.lite.tsx`, branch);
  if (!existingSource) {
    const altGroup = group === GROUP_ICONS ? GROUP_COMPONENTS : GROUP_ICONS;
    const altSource = await prManager.getFileContent(owner, repo, `src/${altGroup}/${rawCompName}.lite.tsx`, branch);
    if (altSource) {
      existingSource = altSource;
      group = altGroup;
    } else if (snapSource) {
      existingSource = snapSource;
    }
  }

  const authorResult = await deps.author.authorDesignSystem({
    componentName: rawCompName,
    existingSource,
    feedbackNotes: notes,
    targets: ['mitosis', 'react', 'vue3', 'svelte', 'vue2', 'angular'],
    ...(spec ? { components: [spec] } : {}),
    ...(tokens.length > 0 ? { tokens } : {}),
  });

  const resolvedGroup = resolveComponentGroup(authorResult.componentGroups[rawCompName] || group, rawCompName, spec);
  const artifacts: CompiledArtifact[] = [];
  const compCode = authorResult.components[rawCompName];
  if (compCode) {
    artifacts.push({ target: 'mitosis', fileName: `${rawCompName}.lite.tsx`, group: resolvedGroup, code: compCode });
  }
  for (const art of authorResult.artifacts.filter((a) => a.fileName.startsWith(`${rawCompName}.`))) {
    artifacts.push({ ...art, group: art.group || resolvedGroup });
  }
  if (artifacts.length === 0) throw new Error(`author produced no artifacts for ${rawCompName}`);

  const commitMsg = `fix(${rawCompName}): regenerate component from review feedback (PR #${prNumber})`;
  const commitSha = await prManager.commitArtifacts(owner, repo, branch, artifacts, commitMsg);
  const noteSummary = notes ? `\n> Feedback: *${notes}*\n` : '';
  await prManager.createComment(
    owner,
    repo,
    prNumber,
    `✅ Supernova successfully regenerated component **${rawCompName}**.${noteSummary}\nCommit: \`${commitSha}\` on branch \`${branch}\`.`
  );
}

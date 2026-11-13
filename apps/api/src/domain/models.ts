import * as crypto from 'node:crypto';
import type {
  ApplySyncRequest,
  ComponentDiff,
  ComponentProgress,
  ComponentStatus,
  ComponentTask,
  DiffStatus,
  ErrorResponse,
  ExtractionOptions,
  ExtractionRequest,
  ExtractionResponse,
  FigmaComponentSpec,
  FigmaDocument,
  FigmaToken,
  Framework,
  HealthResponse,
  JobEvent,
  JobResponse,
  JobStatus,
  PublishResults,
  PublisherType,
  StageError,
  SyncPlanResponse,
  SyncRequest,
  SyncSummary,
  TaskStatus,
  TokenDiff,
} from '@komerce-design/contracts';

export type {
  ApplySyncRequest,
  ComponentDiff,
  ComponentProgress,
  ComponentStatus,
  ComponentTask,
  DiffStatus,
  ErrorResponse,
  ExtractionOptions,
  ExtractionRequest,
  ExtractionResponse,
  FigmaComponentSpec,
  FigmaDocument,
  FigmaToken,
  Framework,
  HealthResponse,
  JobEvent,
  JobResponse,
  JobStatus,
  PublishResults,
  PublisherType,
  StageError,
  SyncPlanResponse,
  SyncRequest,
  SyncSummary,
  TaskStatus,
  TokenDiff,
};

export type DomainErrorCode =
  | 'INVALID_PAYLOAD'
  | 'PAYLOAD_TOO_LARGE'
  | 'WEBHOOK_NOT_CONFIGURED'
  | 'JOB_NOT_FOUND'
  | 'JOB_NOT_FINISHED'
  | 'EXTRACTION_NOT_FOUND'
  | 'SYNC_PLAN_NOT_FOUND'
  | 'UNSAFE_ARTIFACT'
  | 'UNPUBLISHED_TARGET';

export class DomainError extends Error {
  readonly code: DomainErrorCode;

  constructor(code: DomainErrorCode, message: string) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
  }
}

export interface CompiledArtifact {
  target: string;
  fileName: string;
  code: string;
  group?: string;
}

export interface Task {
  id: string;
  runId: string;
  componentName: string;
  status: TaskStatus;
  attemptCount: number;
  maxAttempts: number;
  error?: string;
  artifacts?: CompiledArtifact[];
  createdAt: string;
  updatedAt: string;
}

export function taskToContract(t: Task): ComponentTask {
  return {
    id: t.id,
    runId: t.runId,
    componentName: t.componentName,
    status: t.status,
    attemptCount: t.attemptCount,
    maxAttempts: t.maxAttempts,
    ...(t.error ? { error: t.error } : {}),
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

export type RunStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export interface Run {
  id: string;
  jobId: string;
  status: RunStatus;
  tasks: Task[];
  createdAt: string;
  finishedAt?: string;
}

export interface Job {
  id: string;
  runId?: string;
  documentName: string;
  document: FigmaDocument;
  options?: ExtractionOptions;
  /** Components forced through LLM authoring even when unchanged. */
  selectedComponents?: string[];
  targets: Framework[];
  publishers: PublisherType[];
  status: JobStatus;
  tasks: Task[];
  components: ComponentProgress[];
  artifacts: CompiledArtifact[];
  publishResults?: PublishResults;
  error?: StageError;
  createdAt: string;
  updatedAt: string;
}

export interface Snapshot {
  id: string;
  documentName: string;
  tokensHash: string;
  tokens: FigmaToken[];
  createdAt: string;
}

export interface ComponentSnapshot {
  documentName: string;
  componentName: string;
  contentHash: string;
  spec?: FigmaComponentSpec;
  sourceCode?: string;
  /** Set for siblings authored alongside a Figma component (e.g. StepperItem for Stepper); they have no own spec. */
  derivedFrom?: string;
  /** Artifact group of a derived sibling (`components` or `examples`). */
  group?: string;
  updatedAt: string;
}

export interface SyncPlan {
  syncId: string;
  documentName: string;
  summary: SyncSummary;
  components: ComponentDiff[];
  tokens: TokenDiff;
  createdAt: string;
  document?: FigmaDocument;
  targets?: Framework[];
  publishers?: PublisherType[];
  options?: ExtractionOptions;
}

const RE_SUFFIX = /#.*$/;
const RE_SPLIT = /[^a-zA-Z0-9]+/;
const RE_ACRONYM = /^[A-Z0-9]+$/;
const RE_CAMEL = /([a-z0-9])([A-Z])/g;

export function normalizeComponentName(rawName: string): string {
  const clean = (rawName || '').replace(RE_SUFFIX, '').trim();
  if (!clean) return 'Component';
  const parts = clean.split(RE_SPLIT).filter(Boolean);
  if (parts.length === 0) return 'Component';
  const result = parts
    .map((part) => (RE_ACRONYM.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('');
  return result || 'Component';
}

export function camelToKebab(s: string): string {
  return s
    .replace(/^--/, '')
    .replace(RE_CAMEL, '$1-$2')
    .toLowerCase()
    .replace(/[_/]/g, '-');
}

export function hashComponentSpec(spec: FigmaComponentSpec): string {
  const normalized = { ...spec, name: normalizeComponentName(spec.name) };
  const raw = JSON.stringify(normalized);
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export function hashTokens(tokens: FigmaToken[]): string {
  if (!tokens || tokens.length === 0) return '';
  const sorted = [...tokens].sort((a, b) => a.name.localeCompare(b.name));
  const raw = JSON.stringify(sorted);
  return crypto.createHash('sha256').update(raw).digest('hex');
}

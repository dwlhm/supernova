import { artifactPath } from '../domain/artifact-path.js';
import { DomainError, type CompiledArtifact, type Job } from '../domain/models.js';
import type { JobStore } from '../store/store.js';
import { createZipArchive, type ZipEntry } from './zip.js';

export interface ArtifactPublisher {
  name(): string;
  publish(job: Job): Promise<void>;
  getExistingComponentInfo?(): Promise<{
    names: string[];
    workspaceDir: string;
    cleanup: () => void;
  }>;
}

export interface PullRequestManager {
  /** `owner/repo` this manager is authorized to act on; webhooks for other repos are ignored. */
  repoFullName(): string;
  getPullRequestBranch(owner: string, repo: string, prNumber: number): Promise<string>;
  getFileContent(owner: string, repo: string, filePath: string, ref: string): Promise<string>;
  commitArtifacts(
    owner: string,
    repo: string,
    branch: string,
    artifacts: CompiledArtifact[],
    message: string
  ): Promise<string>;
  createComment(owner: string, repo: string, prNumber: number, comment: string): Promise<void>;
}

export class DownloadPublisher implements ArtifactPublisher {
  constructor(private readonly store: JobStore) {}

  name(): string {
    return 'download';
  }

  async publish(job: Job): Promise<void> {
    const entries: ZipEntry[] = [];
    const seen = new Set<string>();

    for (const art of job.artifacts) {
      let entryPath: string;
      try {
        entryPath = artifactPath(art);
      } catch (err) {
        if (err instanceof DomainError && err.code === 'UNPUBLISHED_TARGET') {
          continue;
        }
        throw err;
      }
      if (seen.has(entryPath)) continue;
      seen.add(entryPath);
      entries.push({ path: entryPath, content: art.code });
    }

    const zipBytes = createZipArchive(entries);
    await this.store.saveZip(job.id, zipBytes);

    if (!job.publishResults) {
      job.publishResults = {};
    }
    job.publishResults.downloadUrl = `/v1/jobs/${job.id}/download`;
    await this.store.savePublishResults(job.id, job.publishResults);
  }
}

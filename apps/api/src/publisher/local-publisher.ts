import { execFile } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { artifactPath } from '../domain/artifact-path.js';
import { DomainError, type CompiledArtifact, type Job } from '../domain/models.js';
import type { JobStore } from '../store/store.js';
import type { ArtifactPublisher } from './download-publisher.js';

const execFileAsync = promisify(execFile);

export interface LocalPublisherOptions {
  store?: JobStore;
  docsDir?: string;
  compileLibrary?: boolean;
}

export function writeArtifactsToWorkspace(
  workspaceDir: string,
  artifacts: CompiledArtifact[],
  docsDir?: string
): number {
  const seen = new Set<string>();
  let written = 0;
  const resolvedDocsDir =
    docsDir ??
    (fs.existsSync(path.join(workspaceDir, 'apps', 'docs'))
      ? path.join(workspaceDir, 'apps', 'docs')
      : '');

  for (const art of artifacts) {
    let relPath: string;
    try {
      relPath = artifactPath(art);
    } catch (err) {
      if (err instanceof DomainError && err.code === 'UNPUBLISHED_TARGET') continue;
      throw err;
    }
    if (seen.has(relPath)) continue;
    seen.add(relPath);

    if (art.target === 'docs') {
      if (!resolvedDocsDir) continue;
      const targetPath =
        art.fileName === 'tokens.md'
          ? path.join(resolvedDocsDir, 'tokens.md')
          : path.join(resolvedDocsDir, 'components', art.fileName);
      if (
        art.fileName === 'index.md' &&
        fs.existsSync(targetPath) &&
        fs.readFileSync(targetPath, 'utf8').includes('<ComponentCatalog')
      ) {
        continue;
      }
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, art.code, 'utf8');
      written++;
      continue;
    }

    const destPath = path.join(workspaceDir, relPath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, art.code, 'utf8');
    written++;
  }
  return written;
}

export async function runWorkspaceDocsCompile(workspaceDir: string): Promise<void> {
  const docsScript = path.join(workspaceDir, 'apps', 'docs', 'scripts', 'compile-docs-components.mjs');
  if (!fs.existsSync(docsScript)) return;
  await execFileAsync(process.execPath, [docsScript], {
    cwd: workspaceDir,
    env: { ...process.env, DS_REPO_DIR: workspaceDir },
  });
}

export async function runWorkspaceLibraryCompile(workspaceDir: string): Promise<void> {
  const scriptPath = path.join(workspaceDir, 'scripts', 'compile-library.mjs');
  if (fs.existsSync(scriptPath)) {
    const mod = (await import(pathToFileURL(scriptPath).href)) as {
      compileLibrary?: (opts?: { rootDir?: string; quiet?: boolean }) => Promise<unknown>;
    };
    if (typeof mod.compileLibrary === 'function') {
      await mod.compileLibrary({ rootDir: workspaceDir, quiet: true });
    }
  }
  await runWorkspaceDocsCompile(workspaceDir);
}

export class LocalWorkspacePublisher implements ArtifactPublisher {
  private readonly store?: JobStore;
  private readonly docsDir?: string;
  private readonly shouldCompileLibrary: boolean;

  constructor(
    readonly workspaceDir: string,
    opts: LocalPublisherOptions = {}
  ) {
    this.store = opts.store;
    this.docsDir = opts.docsDir;
    this.shouldCompileLibrary = opts.compileLibrary ?? false;
  }

  name(): string {
    return 'local';
  }

  async publish(job: Job): Promise<void> {
    if (!this.workspaceDir) return;
    const filesWritten = writeArtifactsToWorkspace(this.workspaceDir, job.artifacts, this.docsDir);
    if (this.shouldCompileLibrary) {
      await runWorkspaceLibraryCompile(this.workspaceDir);
    }
    job.publishResults = {
      ...(job.publishResults || {}),
      workspaceDir: this.workspaceDir,
      filesWritten,
    };
    if (this.store) {
      await this.store.savePublishResults(job.id, job.publishResults);
    }
  }
}

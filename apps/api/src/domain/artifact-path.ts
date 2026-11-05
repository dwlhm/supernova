import * as path from 'node:path';
import { DomainError, type CompiledArtifact } from './models.js';

export const GROUP_COMPONENTS = 'components';
export const GROUP_ICONS = 'icons';

const RE_COMPONENT_NAME = /^[A-Z][A-Za-z0-9]{0,63}$/;
const RE_FILE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

export function validComponentName(name: string): boolean {
  return RE_COMPONENT_NAME.test(name);
}

export function validFileName(name: string): boolean {
  return RE_FILE_NAME.test(name) && !name.includes('..');
}

export function normalizeGroup(raw?: string): string {
  const g = (raw ?? '').trim().toLowerCase();
  if (g === GROUP_COMPONENTS || g === GROUP_ICONS) return g;
  return '';
}

export function artifactPath(art: CompiledArtifact): string {
  if (!validFileName(art.fileName)) {
    throw new DomainError('UNSAFE_ARTIFACT', `unsafe artifact path: file name "${art.fileName}"`);
  }

  let dir: string;
  switch (art.target) {
    case 'mitosis': {
      let group = GROUP_COMPONENTS;
      if (art.group) {
        group = normalizeGroup(art.group);
        if (!group) {
          throw new DomainError('UNSAFE_ARTIFACT', `unsafe artifact path: group "${art.group}"`);
        }
      }
      if (art.fileName === 'utils.ts') {
        group = GROUP_COMPONENTS;
      }
      dir = `src/${group}`;
      break;
    }
    case 'tokens':
      dir = 'src/tokens';
      break;
    case 'docs':
      dir = art.fileName === 'tokens.md' ? 'docs' : 'docs/components';
      break;
    default:
      throw new DomainError('UNPUBLISHED_TARGET', 'artifact target is not published');
  }

  return path.posix.normalize(path.posix.join(dir, art.fileName));
}

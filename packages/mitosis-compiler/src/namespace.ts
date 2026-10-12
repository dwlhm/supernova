import type { CompiledArtifact, TargetFramework } from './types.js';

const PASCAL_PREFIX_REGEX = /^([A-Z]+(?=[A-Z][a-z]|$)|[A-Z][a-z]+)/;

function getGroupKeyAndSub(name: string): { key: string; sub: string } {
  const match = name.match(PASCAL_PREFIX_REGEX);
  const key = match ? match[0] : name;
  const sub = name.slice(key.length) || 'Root';
  return { key, sub };
}

function getTargetExtension(target: TargetFramework): string {
  switch (target) {
    case 'vue3':
    case 'vue2':
      return '.vue';
    case 'svelte':
      return '.svelte';
    case 'react':
    case 'angular':
    default:
      return '';
  }
}

export function generateNamespaceIndex(
  componentNames: string[],
  target: TargetFramework
): CompiledArtifact | null {
  if (!componentNames || componentNames.length === 0 || target === 'mitosis') {
    return null;
  }

  const sortedNames = Array.from(new Set(componentNames)).sort((a, b) =>
    a.localeCompare(b)
  );

  if (sortedNames.length === 0) {
    return null;
  }

  const ext = getTargetExtension(target);

  if (target === 'angular') {
    // Angular components are exported with `export default class <Name>` by Mitosis.
    // Angular receives named re-exports only, with no namespace objects.
    const exports = sortedNames.map(
      (name) => `export { default as ${name} } from './${name}${ext}';`
    );
    return {
      target,
      fileName: 'index.ts',
      code: exports.join('\n') + '\n',
    };
  }

  // Prefix grouping
  const groupMap = new Map<string, Array<{ name: string; sub: string }>>();
  for (const name of sortedNames) {
    const { key, sub } = getGroupKeyAndSub(name);
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key)!.push({ name, sub });
  }

  // A group is only created if >= 2 components share that group key
  const validGroups = new Map<string, Array<{ name: string; sub: string }>>();
  const namespaceComponentNames = new Set<string>();

  for (const [key, members] of groupMap.entries()) {
    if (members.length >= 2) {
      validGroups.set(key, members);
      for (const m of members) {
        namespaceComponentNames.add(m.name);
      }
    }
  }

  // Detect collision: component name matches group key (e.g. Table)
  const collidingGroupKeys = new Set<string>();
  for (const key of validGroups.keys()) {
    if (sortedNames.includes(key)) {
      collidingGroupKeys.add(key);
    }
  }

  // Target-specific imports: only needed for components used in namespace objects
  const importLines: string[] = [];
  for (const name of sortedNames) {
    if (!namespaceComponentNames.has(name)) {
      continue;
    }
    if (collidingGroupKeys.has(name)) {
      importLines.push(`import ${name}Component from './${name}${ext}';`);
    } else {
      importLines.push(`import ${name} from './${name}${ext}';`);
    }
  }

  // Target-specific exports
  const exportLines: string[] = [];
  for (const name of sortedNames) {
    if (collidingGroupKeys.has(name)) {
      exportLines.push(`export { ${name}Component as ${name}Root };`);
    } else {
      exportLines.push(`export { default as ${name} } from './${name}${ext}';`);
    }
  }

  // Namespace definitions
  const sortedGroupKeys = Array.from(validGroups.keys()).sort((a, b) =>
    a.localeCompare(b)
  );
  const namespaceLines: string[] = [];

  for (const key of sortedGroupKeys) {
    const members = validGroups.get(key)!;
    const sortedMembers = [...members].sort((a, b) =>
      a.sub.localeCompare(b.sub)
    );
    const entries = sortedMembers.map((m) => {
      const valueIdentifier = collidingGroupKeys.has(m.name)
        ? `${m.name}Component`
        : m.name;
      return `${m.sub}: ${valueIdentifier}`;
    });
    namespaceLines.push(
      `export const ${key} = { ${entries.join(', ')} } as const;`
    );
  }

  const sections: string[] = [];
  if (importLines.length > 0) {
    sections.push(importLines.join('\n'));
  }
  if (exportLines.length > 0) {
    sections.push(exportLines.join('\n'));
  }
  if (namespaceLines.length > 0) {
    sections.push(namespaceLines.join('\n'));
  }

  const code = sections.join('\n\n') + '\n';

  return {
    target,
    fileName: 'index.ts',
    code,
  };
}

import * as fs from 'node:fs';
import * as path from 'node:path';

export interface ComponentKnowledgeEntry {
  rules: string[];
  updatedAt: string;
}

export interface ProjectKnowledge {
  version: number;
  globalRules: string[];
  components: Record<string, ComponentKnowledgeEntry>;
}

const DEFAULT_KNOWLEDGE: ProjectKnowledge = {
  version: 1,
  globalRules: [],
  components: {},
};

export function resolveKnowledgeFilePath(workspaceDir: string): string {
  return path.join(workspaceDir, 'src', 'knowledge.json');
}

export function loadProjectKnowledge(workspaceDir: string): ProjectKnowledge {
  const filePath = resolveKnowledgeFilePath(workspaceDir);
  if (!fs.existsSync(filePath)) {
    return {
      version: DEFAULT_KNOWLEDGE.version,
      globalRules: [...DEFAULT_KNOWLEDGE.globalRules],
      components: {},
    };
  }
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Partial<ProjectKnowledge>;
    const globalRules = Array.isArray(raw.globalRules)
      ? raw.globalRules.filter((r): r is string => typeof r === 'string' && r.trim().length > 0)
      : [];
    const components: Record<string, ComponentKnowledgeEntry> = {};
    if (raw.components && typeof raw.components === 'object') {
      for (const [name, entry] of Object.entries(raw.components)) {
        if (!entry || typeof entry !== 'object') continue;
        const rules = Array.isArray(entry.rules)
          ? entry.rules.filter((r): r is string => typeof r === 'string' && r.trim().length > 0)
          : [];
        components[name] = {
          rules,
          updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : new Date().toISOString(),
        };
      }
    }
    return {
      version: typeof raw.version === 'number' ? raw.version : 1,
      globalRules,
      components,
    };
  } catch {
    return {
      version: DEFAULT_KNOWLEDGE.version,
      globalRules: [...DEFAULT_KNOWLEDGE.globalRules],
      components: {},
    };
  }
}

export function saveProjectKnowledge(workspaceDir: string, kb: ProjectKnowledge): void {
  const filePath = resolveKnowledgeFilePath(workspaceDir);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(kb, null, 2)}\n`, 'utf8');
}

export function recordComponentKnowledgeRule(
  workspaceDir: string,
  componentName: string,
  rule: string
): ProjectKnowledge {
  const cleanRule = rule.trim();
  const kb = loadProjectKnowledge(workspaceDir);
  if (!cleanRule || !componentName) return kb;

  const existing = kb.components[componentName]?.rules ?? [];
  const normalizedExisting = new Set(existing.map((r) => r.trim().toLowerCase()));
  if (!normalizedExisting.has(cleanRule.toLowerCase())) {
    existing.push(cleanRule);
  }
  kb.components[componentName] = {
    rules: existing,
    updatedAt: new Date().toISOString(),
  };
  saveProjectKnowledge(workspaceDir, kb);
  return kb;
}

export function buildComponentKnowledgeNotes(
  workspaceDir: string,
  componentName: string,
  familyNames: Iterable<string> = [],
  extraNotes?: string
): string {
  const kb = loadProjectKnowledge(workspaceDir);
  const targetNames = new Set<string>([componentName, ...familyNames]);
  const componentRules: string[] = [];

  for (const name of targetNames) {
    const entry = kb.components[name];
    if (!entry?.rules?.length) continue;
    for (const r of entry.rules) {
      const labeled = name === componentName ? r : `[${name}] ${r}`;
      if (!componentRules.includes(labeled)) componentRules.push(labeled);
    }
  }

  for (const [knownName, entry] of Object.entries(kb.components)) {
    if (targetNames.has(knownName) || !entry?.rules?.length) continue;
    if (componentName.startsWith(knownName) || knownName.startsWith(componentName)) {
      for (const r of entry.rules) {
        const labeled = `[${knownName}] ${r}`;
        if (!componentRules.includes(labeled)) componentRules.push(labeled);
      }
    }
  }

  const sections: string[] = [];
  if (kb.globalRules.length > 0 || componentRules.length > 0) {
    const lines = ['Persistent Project Knowledge Base Rules (MUST be preserved across sync & regen):'];
    for (const r of kb.globalRules) lines.push(`- [Global] ${r}`);
    for (const r of componentRules) lines.push(`- [${componentName}] ${r}`);
    sections.push(lines.join('\n'));
  }

  const trimmedExtra = (extraNotes ?? '').trim();
  if (sections.length === 0) {
    return trimmedExtra;
  }
  if (trimmedExtra) {
    sections.push(`Current Review / Regeneration Request:\n${trimmedExtra}`);
  }

  return sections.join('\n\n');
}

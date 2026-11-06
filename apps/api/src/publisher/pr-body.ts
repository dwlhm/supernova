import { GROUP_COMPONENTS, GROUP_EXAMPLES, GROUP_ICONS } from '../domain/artifact-path.js';
import { camelToKebab, normalizeComponentName, type Job } from '../domain/models.js';

export interface PullRequestBodyParams {
  owner: string;
  repo: string;
  branchName: string;
  prNumber: number;
  commitSha: string;
  job: Job;
}

function extractComponentNames(job: Job): Array<{ name: string; group: string; slug: string }> {
  const seen = new Map<string, { name: string; group: string; slug: string }>();
  for (const art of job.artifacts || []) {
    if (art.target === 'mitosis' && art.fileName.endsWith('.lite.tsx') && art.group !== GROUP_EXAMPLES) {
      const name = art.fileName.slice(0, -'.lite.tsx'.length);
      const group = art.group === GROUP_ICONS ? GROUP_ICONS : GROUP_COMPONENTS;
      const slug = camelToKebab(normalizeComponentName(name));
      seen.set(name, { name, group, slug });
    }
  }
  if (seen.size === 0) {
    for (const c of job.components || []) {
      const slug = camelToKebab(normalizeComponentName(c.name));
      seen.set(c.name, { name: c.name, group: c.group || 'components', slug });
    }
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function buildPullRequestBody(params: PullRequestBodyParams): string {
  const { owner, repo, branchName, prNumber, commitSha, job } = params;
  const previewBase = `https://${owner}.github.io/${repo}/pr-preview/pr-${prNumber}`;
  const repoBase = `https://github.com/${owner}/${repo}`;
  const shortSha = commitSha.slice(0, 7);
  const components = extractComponentNames(job);
  const tokenCount = job.document?.tokens?.length ?? 0;

  const compRows = components.map(
    (c, idx) =>
      `| ${idx + 1} | [**${c.name}** ↗](${previewBase}/components/${c.slug}) | [\`src/${c.group}/${c.name}.lite.tsx\`](${repoBase}/blob/${branchName}/src/${c.group}/${c.name}.lite.tsx) | [\`docs/components/${c.slug}.md\`](${repoBase}/blob/${branchName}/docs/components/${c.slug}.md) |`
  );

  return [
    `## 🚀 Supernova Design System Sync — ${job.documentName || 'Design System'}`,
    '',
    `Automated Pull Request generated from Figma extraction job \`${job.id}\` (commit [\`${shortSha}\`](${repoBase}/commit/${commitSha})).`,
    '',
    '### 🌐 Live Interactive UI Preview (Tinggal Klik)',
    '',
    '| Halaman Preview | Deskripsi | Link Langsung |',
    '| :--- | :--- | :--- |',
    `| 🎨 **Multi-Framework Showcase** | Preview dashboard & side-by-side (**React · Vue 3 · Svelte**) | [**Buka Live Showcase ↗**](${previewBase}/showcase) |`,
    `| 🧩 **Component Catalog** | Katalog interaktif seluruh **${components.length} komponen** (Light/Dark & Variants) | [**Buka Component Catalog ↗**](${previewBase}/components/) |`,
    `| 🎛️ **Design Tokens Reference** | Dokumentasi visual **${tokenCount} design tokens** (\`theme.css\` & \`tokens.css\`) | [**Buka Design Tokens ↗**](${previewBase}/tokens) |`,
    '',
    `### 🧩 Daftar Komponen (${components.length} Komponen — Klik untuk Preview & Source)`,
    '',
    '| # | Live Preview Komponen | Mitosis Source (`.lite.tsx`) | Markdown Docs |',
    '| :---: | :--- | :--- | :--- |',
    ...compRows,
    '',
    '### 🛠️ File Token & Konfigurasi',
    '',
    `- [\`src/tokens/tokens.json\`](${repoBase}/blob/${branchName}/src/tokens/tokens.json) — Raw & resolved Figma tokens (${tokenCount} tokens)`,
    `- [\`src/tokens/theme.css\`](${repoBase}/blob/${branchName}/src/tokens/theme.css) — Tailwind v4 \`@theme\` CSS variables`,
    `- [\`src/tokens/tokens.css\`](${repoBase}/blob/${branchName}/src/tokens/tokens.css) — Root CSS custom properties`,
    `- [\`src/tokens/tokens.ts\`](${repoBase}/blob/${branchName}/src/tokens/tokens.ts) — Typed TypeScript token dictionary`,
    '',
    '> 💡 **AI Regeneration via PR Comment**: Tulis komentar `/supernova regenerate <NamaKomponen>: <instruksi revisi>` di PR ini untuk meregenerasi komponen tertentu secara otomatis.',
  ].join('\n');
}

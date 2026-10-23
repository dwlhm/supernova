import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsComponentsDir = path.resolve(__dirname, '../components');
const generatedComponentsDir = path.resolve(__dirname, '../../../generated/components/docs/components');

function toPascal(fileName) {
  const base = path.basename(fileName, '.md');
  if (base === 'tabler-truck-delivery') return 'IconTruckDelivery';
  if (base.toLowerCase() === 'fab') return 'FAB';
  return base
    .split('-')
    .map(p => {
      const lower = p.toLowerCase();
      if (lower === 'otp') return 'OTP';
      if (lower === 'fab') return 'FAB';
      return p.charAt(0).toUpperCase() + p.slice(1);
    })
    .join('');
}

async function processDir(dir) {
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (!file.endsWith('.md') || file === 'index.md') continue;
      const fullPath = path.join(dir, file);
      let content = await fs.readFile(fullPath, 'utf8');

      const compName = toPascal(file);
      const previewBlock = `## Live Preview\n\n<FrameworkPreview name="${compName}" />\n\n`;

      if (content.includes('<FrameworkPreview')) {
        // Already injected, skip or ensure name is correct
        continue;
      }

      if (content.includes('## Usage')) {
        content = content.replace('## Usage', `${previewBlock}## Usage`);
      } else {
        // Fallback: append after first paragraph
        const lines = content.split('\n');
        let insertIdx = 2;
        while (insertIdx < lines.length && lines[insertIdx].trim() !== '') {
          insertIdx++;
        }
        lines.splice(insertIdx + 1, 0, `\n${previewBlock}`);
        content = lines.join('\n');
      }

      await fs.writeFile(fullPath, content, 'utf8');
      console.log(`[inject-previews] Injected preview for ${compName} in ${file}`);
    }
  } catch (err) {
    console.error(`[inject-previews] Error processing ${dir}:`, err);
  }
}

async function run() {
  console.log('[inject-previews] Updating docs components...');
  await processDir(docsComponentsDir);
  await processDir(generatedComponentsDir);
  console.log('[inject-previews] Done!');
}

run();

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWatch = process.argv.includes('--watch');
const distDir = path.resolve(__dirname, 'dist');
const srcDir = path.resolve(__dirname, 'src');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

async function buildPlugin() {
  console.log('[figma-plugin] Building plugin bundle...');
  const startTime = Date.now();

  try {
    // 1. Build main code (sandbox thread)
    await esbuild.build({
      entryPoints: [path.join(srcDir, 'code.ts')],
      bundle: true,
      outfile: path.join(distDir, 'code.js'),
      target: 'es2020',
      platform: 'browser',
      format: 'iife',
      sourcemap: false,
      logLevel: 'warning',
    });

    // 2. Build UI script (iframe thread)
    const uiResult = await esbuild.build({
      entryPoints: [path.join(srcDir, 'ui.ts')],
      bundle: true,
      write: false,
      target: 'es2020',
      platform: 'browser',
      format: 'iife',
      logLevel: 'warning',
    });

    const uiJs = uiResult.outputFiles[0].text;
    fs.writeFileSync(path.join(distDir, 'ui.js'), uiJs, 'utf8');

    // 3. Build standalone extractor for node test suites
    await esbuild.build({
      entryPoints: [path.join(srcDir, 'extractor.ts')],
      bundle: true,
      outfile: path.join(distDir, 'extractor.js'),
      target: 'es2020',
      platform: 'node',
      format: 'esm',
      logLevel: 'warning',
    });

    // 4. Inject compiled UI JS into dist/ui.html
    const htmlTemplate = fs.readFileSync(path.join(srcDir, 'ui.html'), 'utf8');
    const finalHtml = htmlTemplate.includes('<!-- INJECT_SCRIPT -->')
      ? htmlTemplate.replace('<!-- INJECT_SCRIPT -->', `<script>\n${uiJs}\n</script>`)
      : htmlTemplate.replace('</body>', `<script>\n${uiJs}\n</script>\n</body>`);

    fs.writeFileSync(path.join(distDir, 'ui.html'), finalHtml, 'utf8');

    console.log(`[figma-plugin] Build completed in ${Date.now() - startTime}ms.`);
  } catch (err) {
    console.error('[figma-plugin] Build failed:', err);
    if (!isWatch) {
      process.exit(1);
    }
  }
}

async function main() {
  await buildPlugin();

  if (isWatch) {
    console.log('[figma-plugin] Watching src/ for changes...');
    let debounceTimer = null;
    fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
      if (filename) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          console.log(`[figma-plugin] File changed: ${filename}, rebuilding...`);
          buildPlugin();
        }, 150);
      }
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

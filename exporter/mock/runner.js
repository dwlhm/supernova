#!/usr/bin/env node

/**
 * Supernova Mock Exporter Runner
 * Allows developing and testing the Supernova exporter locally without connecting to Supernova Cloud.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { MockSupernova, createMockContext, loadMockData } = require('./mock-sdk');

const exporterDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(exporterDir, '..');
const defaultOutputDir = path.join(rootDir, 'output');
const manifestJsonPath = path.join(rootDir, 'exporter.json');
const configJsonPath = path.join(rootDir, 'config.json');
const { validateExporterPackage } = require('../scripts/validate-package');

// Parse CLI options
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    watch: false,
    theme: null,
    outDir: defaultOutputDir,
    dataDir: null,
    clean: false,
    skipBuild: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--watch' || arg === '-w') {
      options.watch = true;
    } else if (arg === '--theme' || arg === '-t') {
      options.theme = args[++i];
    } else if (arg === '--out' || arg === '-o') {
      options.outDir = path.resolve(process.cwd(), args[++i]);
    } else if (arg === '--data' || arg === '-d') {
      options.dataDir = path.resolve(process.cwd(), args[++i]);
    } else if (arg === '--clean') {
      options.clean = true;
    } else if (arg === '--no-build') {
      options.skipBuild = true;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Supernova Mock Exporter Runner
Run and debug your Supernova exporter locally with zero external network dependencies.

Usage:
  node exporter/mock/runner.js [options]
  npm run export:mock [options]

Options:
  -w, --watch            Watch exporter/src and mock data for changes and re-run
  -t, --theme <id>       Apply a specific theme (e.g., 'theme-dark')
  -o, --out <path>       Output directory (default: <root>/output)
  -d, --data <path>      Custom mock data folder
  --clean                Clean output directory before writing files
  --no-build             Skip running tsup before export
  -v, --verbose          Print verbose log details
  -h, --help             Show this help message

Examples:
  npm run export:mock
  npm run dev:mock
  npm run export:mock -- --theme theme-dark
`);
}

/**
 * Load default config from config.json
 */
function loadExporterConfig() {
  const config = {
    exportTokens: true,
    exportComponents: true,
    componentExtension: '.lite.tsx',
    useCssVariables: true,
    generateIndexFile: true,
    showDisclaimer: true,
    disclaimerText: 'This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.',
    tokensDir: 'tokens',
    componentsDir: 'components',
    indent: 2,
  };

  const raw = JSON.parse(fs.readFileSync(configJsonPath, 'utf-8'));
  if (!Array.isArray(raw)) throw new Error('Root config.json must contain exporter configuration entries');
  for (const item of raw) {
    if (item.key && item.default !== undefined) config[item.key] = item.default;
  }

  return config;
}

/**
 * Build exporter with tsup
 */
function buildExporter() {
  const startTime = Date.now();
  try {
    execSync('npx tsup', {
      cwd: exporterDir,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return Date.now() - startTime;
  } catch (err) {
    console.error('\n❌ Exporter build failed:');
    if (err.stdout) console.error(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    throw err;
  }
}

/**
 * Format bytes to readable size
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/**
 * Execute the exporter with mock data
 */
async function runMockExport(options) {
  const totalStartTime = Date.now();

  console.log(`\n==================================================`);
  console.log(`🚀 Running Supernova Exporter with Mock Data`);
  console.log(`==================================================`);

  // Step 1: Build if needed
  if (!options.skipBuild) {
    process.stdout.write(`⚙️  Compiling exporter bundle... `);
    const buildDuration = buildExporter();
    console.log(`✓ (${buildDuration}ms)`);
  }

  validateExporterPackage(rootDir);
  const manifest = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf-8'));
  const distIndexPath = path.resolve(rootDir, manifest.executable);

  // Step 2: Initialize Mock SDK & Context
  const mockSdk = new MockSupernova({ dataDir: options.dataDir });
  const mockContext = createMockContext({ themeId: options.theme });
  const exporterConfig = loadExporterConfig();

  const { tokens, groups, themes } = loadMockData(options.dataDir);
  console.log(`📦 Mock Data: ${tokens.length} tokens, ${groups.length} groups, ${themes.length} themes`);
  if (options.theme) {
    const activeTheme = themes.find(t => t.id === options.theme);
    console.log(`🎨 Active Theme: ${activeTheme ? activeTheme.name : options.theme} (${options.theme})`);
  } else {
    console.log(`🎨 Active Theme: Default (Base Tokens)`);
  }
  console.log(`📂 Destination: ${path.relative(rootDir, options.outDir) || options.outDir}`);

  // Step 3: Polyfill global Pulsar bridge
  let exportHandler = null;
  globalThis.Pulsar = {
    exportConfig: () => exporterConfig,
    export: (fn) => {
      exportHandler = fn;
    },
  };

  // Step 4: Load bundle and execute
  // Invalidate require cache to ensure updated code is loaded in watch mode
  delete require.cache[require.resolve(distIndexPath)];
  require(distIndexPath);

  if (typeof exportHandler !== 'function') {
    throw new Error('Exporter did not register an export handler via Pulsar.export()');
  }

  const outputFiles = await exportHandler(mockSdk, mockContext);

  if (!Array.isArray(outputFiles)) {
    throw new Error(`Expected exporter to return an array of output files, got ${typeof outputFiles}`);
  }

  // Step 5: Clean output directory if requested
  if (options.clean && fs.existsSync(options.outDir)) {
    fs.rmSync(options.outDir, { recursive: true, force: true });
  }

  // Step 6: Write files
  console.log(`\n📄 Generated Output Files:`);
  let totalBytes = 0;

  for (const file of outputFiles) {
    const fileRelDir = file.path || '';
    const targetDir = path.join(options.outDir, fileRelDir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const fullFilePath = path.join(targetDir, file.name);
    let content = file.content;
    if (typeof content !== 'string') {
      content = Buffer.from(content || '');
    }

    fs.writeFileSync(fullFilePath, content, typeof content === 'string' ? 'utf-8' : undefined);
    const stat = fs.statSync(fullFilePath);
    totalBytes += stat.size;

    const displayRelPath = path.relative(rootDir, fullFilePath);
    console.log(`  ✓ ${displayRelPath.padEnd(45)} (${formatSize(stat.size)})`);
  }

  const duration = Date.now() - totalStartTime;
  console.log(`\n✨ Export complete! Written ${outputFiles.length} files (${formatSize(totalBytes)}) in ${duration}ms`);
}

/**
 * Watch mode handler
 */
function startWatcher(options) {
  const watchPaths = [
    path.join(exporterDir, 'src'),
    options.dataDir || path.join(__dirname, 'data'),
    configJsonPath,
    manifestJsonPath,
  ];

  console.log(`\n👀 Watching for changes in:`);
  for (const p of watchPaths) {
    if (fs.existsSync(p)) {
      console.log(`   - ${path.relative(rootDir, p)}`);
    }
  }
  console.log(`   (Press Ctrl+C to exit)\n`);

  let isRunning = false;
  let debounceTimer = null;

  const triggerRun = (filename) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      if (isRunning) return;
      isRunning = true;
      try {
        console.log(`\n🔄 Change detected (${filename}), re-exporting...`);
        await runMockExport(options);
      } catch (err) {
        console.error(`\n❌ Error during export:`, err.message);
      } finally {
        isRunning = false;
      }
    }, 100);
  };

  for (const watchPath of watchPaths) {
    if (fs.existsSync(watchPath)) {
      fs.watch(watchPath, { recursive: true }, (_eventType, filename) => {
        if (!filename) return;
        // Ignore dist and temp files
        if (filename.includes('dist') || filename.includes('node_modules') || filename.startsWith('.')) return;
        triggerRun(filename);
      });
    }
  }
}

// Main execution
async function main() {
  const options = parseArgs();

  try {
    await runMockExport(options);

    if (options.watch) {
      startWatcher(options);
    }
  } catch (err) {
    console.error('\n❌ Mock exporter execution failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  runMockExport,
  parseArgs,
};

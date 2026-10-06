#!/usr/bin/env node

/**
 * Supernova Cloud Data Fetcher CLI
 *
 * Fetches real design system data (tokens, token groups, themes, components)
 * directly from Supernova Cloud using the Supernova SDK.
 */

const fs = require('fs');
const path = require('path');
const { Supernova } = require('@supernovaio/supernova-sdk');

const repoRoot = path.resolve(__dirname, '..');
const envPath = path.join(repoRoot, '.env');

/**
 * Lightweight .env parser without external dependencies.
 */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) {
      continue;
    }

    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();

    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = val;
    }
  }
}

/**
 * Parse CLI arguments.
 */
function parseArgs(args) {
  const options = {
    syncMock: false,
    outDir: 'reference',
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--sync-mock' || arg === '-s') {
      options.syncMock = true;
    } else if (arg.startsWith('--out=')) {
      options.outDir = arg.slice('--out='.length);
    } else if (arg === '-o' || arg === '--out') {
      if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        options.outDir = args[++i];
      }
    }
  }

  return options;
}

/**
 * Print CLI usage instructions.
 */
function printUsage() {
  console.log(`
Usage: node scripts/fetch-supernova-data.js [options]

Fetch real design system data directly from Supernova Cloud using your API key.

Options:
  -s, --sync-mock         Also sync fetched data into exporter/mock/data/
  -o, --out <dir>         Output directory relative to repo root (default: "reference")
  -h, --help              Show this help message

Environment Variables:
  SUPERNOVA_API_KEY               Supernova API Token (required)
  SUPERNOVA_WORKSPACE_ID          Target workspace ID (optional, defaults to first workspace)
  SUPERNOVA_DESIGN_SYSTEM_ID      Target design system ID (optional, defaults to first design system)

Examples:
  node scripts/fetch-supernova-data.js
  node scripts/fetch-supernova-data.js --sync-mock
  node scripts/fetch-supernova-data.js --out=reference/v2
`);
}

/**
 * Validate that SUPERNOVA_API_KEY is configured.
 */
function validateApiKey() {
  const apiKey = process.env.SUPERNOVA_API_KEY ? process.env.SUPERNOVA_API_KEY.trim() : '';
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.error(`
❌ Error: Missing or invalid SUPERNOVA_API_KEY

Please configure your Supernova API Key before running this command:
  1. Copy .env.example to .env:
     cp .env.example .env
  2. Edit .env and set your Supernova Personal Access Token:
     SUPERNOVA_API_KEY=your_actual_token_here

Tokens can be generated in Supernova Cloud:
  Profile Settings / Workspace Settings -> API Tokens -> Generate Token
`);
    process.exit(1);
  }
  return apiKey;
}

/**
 * Safe JSON serializer excluding internal SDK fields and breaking circular references.
 */
function safeStringify(data, space = 2) {
  const ancestors = [];
  return JSON.stringify(
    data,
    function replacer(key, value) {
      if (
        typeof key === 'string' &&
        (key.startsWith('_') || key === 'dataBridge' || key === 'dataCore' || key === 'sdk')
      ) {
        return undefined;
      }
      if (typeof value !== 'object' || value === null) {
        return value;
      }
      while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
        ancestors.pop();
      }
      if (ancestors.includes(value)) {
        return undefined;
      }
      ancestors.push(value);
      return value;
    },
    space
  );
}

/**
 * Main execution flow.
 */
async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printUsage();
    process.exit(0);
  }

  // Load environment variables from .env if present
  loadEnvFile(envPath);

  // Validate API key
  const apiKey = validateApiKey();

  console.log('==================================================');
  console.log('⚡ Supernova Cloud Data Fetcher');
  console.log('==================================================');
  console.log('Connecting to Supernova Cloud...');

  const sdk = new Supernova(apiKey);

  // Authenticate user
  const me = await sdk.me();
  const userName = me.name || me.email || me.id || 'User';
  console.log(`✓ Authenticated as: ${userName} (${me.email || me.id || ''})`);

  // Fetch workspaces
  const workspaces = await sdk.workspaces();
  if (!workspaces || workspaces.length === 0) {
    throw new Error('No workspaces found for the authenticated Supernova account.');
  }

  let targetWorkspace;
  if (process.env.SUPERNOVA_WORKSPACE_ID) {
    targetWorkspace = workspaces.find((w) => w.id === process.env.SUPERNOVA_WORKSPACE_ID);
    if (!targetWorkspace) {
      throw new Error(`Workspace with ID "${process.env.SUPERNOVA_WORKSPACE_ID}" not found.`);
    }
  } else {
    targetWorkspace = workspaces[0];
  }
  console.log(`✓ Workspace: ${targetWorkspace.name || targetWorkspace.id} (${targetWorkspace.id})`);

  // Fetch design systems
  const designSystems = await sdk.designSystems(targetWorkspace.id);
  if (!designSystems || designSystems.length === 0) {
    throw new Error(`No design systems found in workspace "${targetWorkspace.name || targetWorkspace.id}".`);
  }

  let targetDesignSystem;
  if (process.env.SUPERNOVA_DESIGN_SYSTEM_ID) {
    targetDesignSystem = designSystems.find((ds) => ds.id === process.env.SUPERNOVA_DESIGN_SYSTEM_ID);
    if (!targetDesignSystem) {
      throw new Error(`Design System with ID "${process.env.SUPERNOVA_DESIGN_SYSTEM_ID}" not found.`);
    }
  } else {
    targetDesignSystem = designSystems[0];
  }
  console.log(`✓ Design System: ${targetDesignSystem.name || targetDesignSystem.id} (${targetDesignSystem.id})`);

  // Fetch active version
  const activeVersion = await sdk.activeDesignSystemVersion(targetDesignSystem.id);
  if (!activeVersion) {
    throw new Error(`No active version found for design system "${targetDesignSystem.name || targetDesignSystem.id}".`);
  }
  console.log(`✓ Active Version: ${activeVersion.name || activeVersion.id} (${activeVersion.id})`);

  // Fetch all assets
  console.log('📦 Fetching design system assets...');
  const [tokens, tokenGroups, themes, components] = await Promise.all([
    activeVersion.tokens(),
    activeVersion.tokenGroups(),
    activeVersion.themes(),
    activeVersion.components()
  ]);

  let designComponents = [];
  try {
    designComponents = (await activeVersion.designComponents()) || [];
  } catch {
    // Optional if not populated or supported
  }

  console.log(`✓ Fetched: ${tokens.length} tokens, ${tokenGroups.length} groups, ${themes.length} themes, ${components.length} components`);
  if (designComponents.length > 0) {
    console.log(`  (${designComponents.length} design components)`);
  }

  // Prepare metadata
  const meta = {
    timestamp: new Date().toISOString(),
    workspace: {
      id: targetWorkspace.id,
      name: targetWorkspace.name || null
    },
    designSystem: {
      id: targetDesignSystem.id,
      name: targetDesignSystem.name || null
    },
    version: {
      id: activeVersion.id,
      name: activeVersion.name || null
    },
    itemCounts: {
      tokens: tokens.length,
      tokenGroups: tokenGroups.length,
      themes: themes.length,
      components: components.length,
      designComponents: designComponents.length
    }
  };

  // Determine output directory
  const outDir = path.resolve(repoRoot, options.outDir);
  fs.mkdirSync(outDir, { recursive: true });

  // Serialize and write JSON artifacts
  const artifacts = [
    { name: 'tokens.json', content: safeStringify(tokens) },
    { name: 'token-groups.json', content: safeStringify(tokenGroups) },
    { name: 'themes.json', content: safeStringify(themes) },
    { name: 'components.json', content: safeStringify(components) },
    { name: 'meta.json', content: safeStringify(meta) }
  ];

  console.log(`\n📂 Writing artifacts to "${options.outDir}/":`);
  for (const file of artifacts) {
    const filePath = path.join(outDir, file.name);
    fs.writeFileSync(filePath, file.content, 'utf8');
    const relPath = path.relative(repoRoot, filePath);
    const sizeKb = (Buffer.byteLength(file.content, 'utf8') / 1024).toFixed(1);
    console.log(`  ✓ ${relPath} (${sizeKb} KB)`);
  }

  // If --sync-mock is specified, also write data files to exporter/mock/data/
  if (options.syncMock) {
    const mockDataDir = path.resolve(repoRoot, 'exporter/mock/data');
    fs.mkdirSync(mockDataDir, { recursive: true });

    console.log('\n🔄 Syncing mock fixtures to "exporter/mock/data/":');
    const mockArtifacts = artifacts.filter((a) => a.name !== 'meta.json');
    for (const file of mockArtifacts) {
      const filePath = path.join(mockDataDir, file.name);
      fs.writeFileSync(filePath, file.content, 'utf8');
      const relPath = path.relative(repoRoot, filePath);
      const sizeKb = (Buffer.byteLength(file.content, 'utf8') / 1024).toFixed(1);
      console.log(`  ✓ ${relPath} (${sizeKb} KB)`);
    }
  }

  console.log('\n✨ Supernova data fetch completed successfully!');
}

main().catch((err) => {
  console.error(`\n❌ Fetch failed: ${err.message}`);
  process.exit(1);
});

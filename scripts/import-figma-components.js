#!/usr/bin/env node

/**
 * Supernova Figma Component Sets Discoverer & Importer
 *
 * Discovers component sets (and standalone components) directly from the
 * Figma REST API and synchronizes them into components.catalog.json.
 */

const fs = require('fs');
const path = require('path');

const { loadEnvFile } = require('./figma-to-mitosis');

// Automatically load .env from repository root if present
loadEnvFile(path.resolve(__dirname, '..', '.env'));

const DEFAULT_FILE_KEY = 'wLWN7FdmqCslghDJPWIweW';
const DEFAULT_CATALOG_PATH = 'components.catalog.json';

// ---------------------------------------------------------------------------
// Helpers: String manipulation & Name normalization
// ---------------------------------------------------------------------------

/**
 * Normalizes component names into clean PascalCase identifiers.
 * e.g. "Input/Text" -> "InputText"
 * e.g. "Input/File-Drop-Zone" -> "InputFileDropZone"
 * e.g. "Date Picker" -> "DatePicker"
 * e.g. "Alert dialog" -> "AlertDialog"
 * e.g. "Logo / Brand" -> "LogoBrand"
 *
 * @param {string} rawName - Raw component name from Figma
 * @returns {string} Clean PascalCase component identifier
 */
function normalizeComponentName(rawName) {
  if (!rawName || typeof rawName !== 'string') {
    return 'Component';
  }

  // Strip Figma property suffixes such as "#101:1"
  const clean = rawName.replace(/#.*$/, '').trim();

  // Split on any non-alphanumeric separator (slash, space, dash, underscore, dot)
  const parts = clean.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (parts.length === 0) {
    return 'Component';
  }

  return parts
    .map((part) => {
      if (part.length === 0) return '';
      // Preserve acronyms that are already all uppercase (e.g. OTP, FAB, UI)
      if (/^[A-Z0-9]+$/.test(part)) {
        return part;
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
}

// ---------------------------------------------------------------------------
// Helpers: Catalog Data Mapping & Merging
// ---------------------------------------------------------------------------

/**
 * Map a discovered Figma component or component set item into standard catalog shape
 * compatible with scripts/process-pr-components.js.
 *
 * @param {object} item - Figma component or component set item
 * @param {string} fileId - Figma file key
 * @returns {object} Standard components.catalog.json entry
 */
function mapFigmaItemToCatalogEntry(item, fileId) {
  const nodeId = item.node_id || item.nodeId || '';
  const key = item.key || null;
  const name = item.name || 'Component';
  const pascalName = normalizeComponentName(name);
  const updatedAt = item.updated_at || item.created_at || new Date().toISOString();

  return {
    id: String(key || nodeId || pascalName),
    name: pascalName,
    rawName: name,
    description: item.description || '',
    brandId: null,
    hasMitosisDefinition: false,
    fileId: fileId,
    nodeId: nodeId,
    sourceId: key,
    componentPropertyDefinitions: item.componentPropertyDefinitions || [],
    variantPropertyValues: item.variantPropertyValues || {},
    updatedAt: updatedAt,
    ...(item.sceneHash ? { sceneHash: item.sceneHash } : {}),
    figma: {
      fileId: fileId,
      nodeId: nodeId,
      sourceId: key,
      key: key,
      name: name,
      thumbnailUrl: item.thumbnail_url || null,
      componentPropertyDefinitions: item.componentPropertyDefinitions || [],
      variantPropertyValues: item.variantPropertyValues || {},
      variants: item.variants || [],
      updatedAt: updatedAt,
    },
  };
}

/**
 * Read and parse components.catalog.json safely.
 * Returns an empty array if missing or invalid.
 *
 * @param {string} catalogPath - Path to catalog file
 * @returns {Array<object>} Catalog entries
 */
function readCatalogFile(catalogPath) {
  const fullPath = path.resolve(process.cwd(), catalogPath);
  if (!fs.existsSync(fullPath)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(fullPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed && Array.isArray(parsed.components)) {
      return parsed.components;
    }
    return [];
  } catch (err) {
    console.warn(`[import-figma-components] Warning: Failed reading catalog at ${fullPath}: ${err.message}`);
    return [];
  }
}

/**
 * Find index of an existing catalog entry matching candidate item by nodeId or normalized name.
 *
 * @param {Array<object>} catalog - Existing catalog items
 * @param {object} candidate - Discovered item to match
 * @returns {number} Index or -1 if not found
 */
function findExistingCatalogIndex(catalog, candidate) {
  const candNodeId = candidate.nodeId || candidate.node_id || candidate.figma?.nodeId;
  const candKey = candidate.key || candidate.sourceId || candidate.figma?.sourceId;
  const candPascal = normalizeComponentName(candidate.name || candidate.rawName);

  return catalog.findIndex((existing) => {
    const existNodeId = existing.nodeId || existing.node_id || existing.figma?.nodeId;
    if (candNodeId && existNodeId && candNodeId === existNodeId) {
      return true;
    }
    const existKey = existing.sourceId || existing.key || existing.figma?.sourceId;
    if (candKey && existKey && candKey === existKey) {
      return true;
    }
    const existPascal = normalizeComponentName(existing.name || existing.rawName);
    if (existPascal && candPascal && existPascal.toLowerCase() === candPascal.toLowerCase()) {
      return true;
    }
    return false;
  });
}

/**
 * Merge discovered entries into existing catalog.
 * Preserves existing catalog entries, supplements metadata, and appends new entries.
 *
 * @param {Array<object>} existingCatalog - Current catalog entries
 * @param {Array<object>} newEntries - Newly discovered catalog entries
 * @param {boolean} preserveExisting - If false, only new entries are returned
 * @returns {{ mergedCatalog: Array<object>, addedCount: number, preservedCount: number }}
 */
function mergeCatalogEntries(existingCatalog, newEntries, preserveExisting = true) {
  if (!preserveExisting) {
    return {
      mergedCatalog: [...newEntries],
      addedCount: newEntries.length,
      preservedCount: 0,
    };
  }

  const merged = existingCatalog.map((entry) => ({ ...entry }));
  let preservedCount = 0;
  let addedCount = 0;

  for (const newEntry of newEntries) {
    const existingIdx = findExistingCatalogIndex(merged, newEntry);
    if (existingIdx !== -1) {
      // Existing entry: preserve its fields, supplement missing Figma metadata
      const existing = merged[existingIdx];
      preservedCount++;

      const figmaMerged = {
        ...(newEntry.figma || {}),
        ...(existing.figma || {}),
      };

      merged[existingIdx] = {
        ...newEntry,
        ...existing,
        figma: figmaMerged,
      };
    } else {
      // New entry
      merged.push(newEntry);
      addedCount++;
    }
  }

  return {
    mergedCatalog: merged,
    addedCount,
    preservedCount,
  };
}

/**
 * Filter items by name or comma-separated list of names.
 * Matches against raw name, normalized PascalCase name, or case-insensitive substrings.
 *
 * @param {Array<object>} items - Discovered items
 * @param {string|Array<string>} filter - Filter list or comma-separated string
 * @returns {Array<object>} Filtered items
 */
function filterComponents(items, filter) {
  if (!filter) {
    return items;
  }

  const rawFilters = Array.isArray(filter) ? filter : String(filter).split(',');
  const normalizedFilters = rawFilters
    .map((f) => f.trim().toLowerCase())
    .filter(Boolean);

  if (normalizedFilters.length === 0) {
    return items;
  }

  return items.filter((item) => {
    const raw = (item.name || item.rawName || '').toLowerCase();
    const pascal = normalizeComponentName(item.name || item.rawName).toLowerCase();
    return normalizedFilters.some((f) => {
      const filterNorm = normalizeComponentName(f).toLowerCase();
      return raw === f || pascal === f || pascal === filterNorm || raw === filterNorm;
    });
  });
}

// ---------------------------------------------------------------------------
// Helpers: Figma API Response Parsers
// ---------------------------------------------------------------------------

/**
 * Parse Figma component_sets API JSON payload.
 *
 * @param {object} payload - Parsed JSON response from /component_sets
 * @param {string} fileId - Figma file ID
 * @returns {Array<object>} Discovered component set descriptors
 */
function parseComponentSetsResponse(payload, fileId = '') {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const rawSets = payload.meta?.component_sets || [];
  return rawSets.map((set) => ({
    type: 'COMPONENT_SET',
    key: set.key || null,
    file_key: set.file_key || fileId,
    node_id: set.node_id || set.nodeId || '',
    name: set.name || '',
    description: set.description || '',
    thumbnail_url: set.thumbnail_url || null,
    created_at: set.created_at || null,
    updated_at: set.updated_at || null,
    containing_frame: set.containing_frame || null,
  }));
}

/**
 * Parse Figma components API JSON payload for standalone components.
 * Filters out components that belong to component sets and icons.
 *
 * @param {object} payload - Parsed JSON response from /components
 * @param {string} fileId - Figma file ID
 * @param {object} options - Filtering options ({ includeIcons, seenNodeIds })
 * @returns {Array<object>} Discovered standalone component descriptors
 */
function parseComponentsResponse(payload, fileId = '', options = {}) {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const { includeIcons = false, seenNodeIds = new Set() } = options;
  const rawComponents = payload.meta?.components || [];
  const results = [];

  for (const comp of rawComponents) {
    const frame = comp.containing_frame || {};
    const pageName = (frame.pageName || '').trim();

    // Skip variant components that belong to a component set
    if (comp.component_set_id || frame.containingComponentSet || frame.containingStateGroup) {
      continue;
    }

    // Skip icon collections by default (e.g. "Icons" page or "Tabler Icon" frame)
    if (!includeIcons) {
      const isIconPage = pageName.toLowerCase() === 'icons';
      const isIconFrame = (frame.name || '').toLowerCase().includes('tabler icon');
      const isIconName = (comp.name || '').toLowerCase().startsWith('tabler/') || (comp.name || '').toLowerCase().startsWith('icon/');
      if (isIconPage || isIconFrame || isIconName) {
        continue;
      }
    }

    const nodeId = comp.node_id || comp.nodeId || '';
    if (seenNodeIds.has(nodeId)) {
      continue;
    }

    results.push({
      type: 'COMPONENT',
      key: comp.key || null,
      file_key: comp.file_key || fileId,
      node_id: nodeId,
      name: comp.name || '',
      description: comp.description || '',
      thumbnail_url: comp.thumbnail_url || null,
      created_at: comp.created_at || null,
      updated_at: comp.updated_at || null,
      containing_frame: frame,
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Core: Figma Discovery Function
// ---------------------------------------------------------------------------

/**
 * Discover all component sets directly from the Figma REST API.
 * Also retrieves standalone components if they exist outside component sets.
 *
 * @param {string} fileId - Figma file ID / key
 * @param {string} token - Figma access token
 * @param {object} [options] - Additional discovery options
 * @returns {Promise<Array<object>>} Discovered Figma component descriptors
 */
async function discoverFigmaComponentSets(fileId, token, options = {}) {
  const effectiveFileId = fileId || process.env.FIGMA_FILE_KEY || DEFAULT_FILE_KEY;
  const effectiveToken = token || process.env.FIGMA_ACCESS_TOKEN;

  if (!effectiveFileId) {
    throw new Error('Figma fileId is required.');
  }
  if (!effectiveToken) {
    throw new Error('Figma access token is required (pass via argument or set FIGMA_ACCESS_TOKEN env var).');
  }

  const {
    includeStandalone = true,
    includeIcons = false,
    fetchFn = fetch,
  } = options;

  // 1. Fetch component sets: /v1/files/:file_key/component_sets
  const setsUrl = `https://api.figma.com/v1/files/${encodeURIComponent(effectiveFileId)}/component_sets`;
  let setsRes;
  try {
    setsRes = await fetchFn(setsUrl, {
      method: 'GET',
      headers: {
        'X-Figma-Token': effectiveToken,
      },
    });
  } catch (err) {
    throw new Error(`Failed to connect to Figma API: ${err.message}`);
  }

  if (setsRes.status === 401 || setsRes.status === 403) {
    throw new Error(`Invalid or unauthorized Figma access token (HTTP ${setsRes.status}) for file "${effectiveFileId}".`);
  }
  if (setsRes.status === 404) {
    throw new Error(`Figma file "${effectiveFileId}" not found (HTTP 404).`);
  }
  if (setsRes.status === 429) {
    throw new Error(`Figma API rate limit exceeded (HTTP 429). Please retry later.`);
  }
  if (!setsRes.ok) {
    throw new Error(`Figma API request failed with HTTP ${setsRes.status}: ${setsRes.statusText}`);
  }

  const setsPayload = await setsRes.json();
  const componentSets = parseComponentSetsResponse(setsPayload, effectiveFileId);

  const seenNodeIds = new Set(componentSets.map((s) => s.node_id));
  let standaloneComponents = [];

  // 2. Fetch standalone components if requested: /v1/files/:file_key/components
  if (includeStandalone) {
    try {
      const compsUrl = `https://api.figma.com/v1/files/${encodeURIComponent(effectiveFileId)}/components`;
      const compsRes = await fetchFn(compsUrl, {
        method: 'GET',
        headers: {
          'X-Figma-Token': effectiveToken,
        },
      });

      if (compsRes.ok) {
        const compsPayload = await compsRes.json();
        standaloneComponents = parseComponentsResponse(compsPayload, effectiveFileId, {
          includeIcons,
          seenNodeIds,
        });
      } else {
        console.warn(`[import-figma-components] Warning: Standalone component discovery HTTP ${compsRes.status}`);
      }
    } catch (err) {
      console.warn(`[import-figma-components] Warning: Standalone component fetch failed: ${err.message}`);
    }
  }

  return [...componentSets, ...standaloneComponents];
}

// ---------------------------------------------------------------------------
// Core: Import Orchestration Function
// ---------------------------------------------------------------------------

/**
 * Import Figma component sets and populate components.catalog.json.
 *
 * @param {object} options - Execution options
 * @returns {Promise<object>} Import result summary
 */
async function importFigmaComponents(options = {}) {
  const snapshot = options.figmaSnapshot ? require('./figma-snapshot').loadSnapshot(options.figmaSnapshot) : null;
  const fileId = options.file || options.fileId || snapshot?.fileKey || process.env.FIGMA_FILE_KEY || DEFAULT_FILE_KEY;
  if (snapshot && fileId !== snapshot.fileKey) throw new Error('Requested Figma file does not match snapshot');
  const token = options.token || process.env.FIGMA_ACCESS_TOKEN;
  const outPath = options.out || options.catalog || DEFAULT_CATALOG_PATH;
  const dryRun = Boolean(options.dryRun || options['dry-run']);
  const merge = options.merge !== undefined ? Boolean(options.merge) : true;
  const only = options.only || null;
  const includeIcons = Boolean(options.includeIcons || options['include-icons']);
  const includeStandalone = options.includeStandalone !== undefined ? Boolean(options.includeStandalone) : true;
  const silent = Boolean(options.silent);

  // Discovered items may be provided directly (e.g. for offline testing)
  let discovered = snapshot ? require('./figma-snapshot').discoverSnapshotComponents(snapshot, { includeStandalone, includeIcons }) : options.discovered || options.items || null;

  if (!discovered) {
    if (!token) {
      throw new Error('FIGMA_ACCESS_TOKEN is required (pass via --token or set FIGMA_ACCESS_TOKEN env var).');
    }
    discovered = await discoverFigmaComponentSets(fileId, token, {
      includeStandalone,
      includeIcons,
      fetchFn: options.fetchFn || fetch,
    });
  }

  // Apply --only filter if specified
  const filtered = only ? filterComponents(discovered, only) : discovered;

  // Map discovered items into catalog entry shapes
  const catalogEntries = filtered.map((item) => mapFigmaItemToCatalogEntry(item, fileId));

  // Read existing catalog
  const existingCatalog = readCatalogFile(outPath);

  // Merge entries
  const { mergedCatalog, addedCount, preservedCount } = mergeCatalogEntries(
    existingCatalog,
    catalogEntries,
    merge
  );

  const componentSetCount = filtered.filter((i) => i.type === 'COMPONENT_SET').length;
  const standaloneCount = filtered.filter((i) => i.type === 'COMPONENT').length;

  const result = {
    success: true,
    fileId,
    outPath,
    dryRun,
    merge,
    filter: only || 'all',
    counts: {
      discoveredTotal: discovered.length,
      filteredTotal: filtered.length,
      componentSets: componentSetCount,
      standalone: standaloneCount,
      existingCatalog: existingCatalog.length,
      added: addedCount,
      preserved: preservedCount,
      finalTotal: mergedCatalog.length,
    },
    items: filtered,
    catalog: mergedCatalog,
  };

  // Mutate file on disk if not in dry-run mode
  if (!dryRun) {
    const fullOutPath = path.resolve(process.cwd(), outPath);
    fs.mkdirSync(path.dirname(fullOutPath), { recursive: true });
    fs.writeFileSync(fullOutPath, JSON.stringify(mergedCatalog, null, 2) + '\n', 'utf8');
  }

  // Print summary report
  if (!silent) {
    printDiscoveryReport(result);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Helpers: CLI Output Reporting
// ---------------------------------------------------------------------------

/**
 * Print formatted summary table to console.
 */
function printDiscoveryReport(summary) {
  const banner = '==================================================';
  console.log(`\n${banner}`);
  console.log('Figma Component Sets Discovery & Import');
  console.log(banner);
  console.log(`Figma File:   ${summary.fileId}`);
  console.log(`Output:       ${summary.outPath}`);
  console.log(`Mode:         ${summary.dryRun ? '[DRY RUN] Preview only (no files written)' : 'Active (catalog updated)'}`);
  console.log(`Merge:        ${summary.merge ? 'Enabled (preserve existing catalog)' : 'Disabled (replace catalog)'}`);
  console.log(`Filter:       ${summary.filter}`);
  console.log(`Discovered:   ${summary.counts.filteredTotal} items (${summary.counts.componentSets} component sets, ${summary.counts.standalone} standalone)`);

  console.log('\nDiscovered Component Sets & Components:');
  if (summary.items.length === 0) {
    console.log('  (no matching components found)');
  } else {
    const colPad = 26;
    for (let i = 0; i < summary.items.length; i++) {
      const item = summary.items[i];
      const idx = String(i + 1).padStart(3, ' ');
      const type = item.type === 'COMPONENT_SET' ? '[SET]' : '[CMP]';
      const cleanName = normalizeComponentName(item.name).padEnd(colPad);
      const rawName = item.name !== cleanName.trim() ? ` (${item.name})` : '';
      const nodeId = item.node_id ? `[node: ${item.node_id}]` : '';
      console.log(`  ${idx}. ${type} ${cleanName} ${nodeId}${rawName}`);
    }
  }

  console.log(`\nCatalog Summary:`);
  console.log(`  Existing items:       ${summary.counts.existingCatalog}`);
  console.log(`  New items added:      ${summary.counts.added}`);
  console.log(`  Preserved items:      ${summary.counts.preserved}`);
  console.log(`  Final total items:    ${summary.counts.finalTotal}`);
  if (summary.dryRun) {
    console.log(`\n[DRY RUN] Finished preview without writing to ${summary.outPath}.`);
  } else {
    console.log(`\n✓ Catalog successfully updated at ${summary.outPath}.`);
  }
  console.log(`${banner}\n`);
}

// ---------------------------------------------------------------------------
// Helpers: CLI Argument Parsing
// ---------------------------------------------------------------------------

/**
 * Parse CLI options.
 */
function parseCliArgs(argv) {
  const options = {
    file: null,
    token: null,
    out: DEFAULT_CATALOG_PATH,
    dryRun: false,
    merge: true,
    all: true,
    only: null,
    includeIcons: false,
    includeStandalone: true,
    silent: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--dry-run' || arg === '-d') {
      options.dryRun = true;
    } else if (arg === '--all') {
      options.all = true;
    } else if (arg === '--merge') {
      options.merge = true;
    } else if (arg === '--no-merge' || arg === '--merge=false') {
      options.merge = false;
    } else if (arg === '--merge=true') {
      options.merge = true;
    } else if (arg === '--no-standalone') {
      options.includeStandalone = false;
    } else if (arg === '--include-icons') {
      options.includeIcons = true;
    } else if (arg === '--silent' || arg === '-s') {
      options.silent = true;
    } else if (arg.startsWith('--figma-snapshot=')) {
      options.figmaSnapshot = arg.slice('--figma-snapshot='.length);
    } else if (arg === '--figma-snapshot') {
      options.figmaSnapshot = argv[++i];
    } else if (arg.startsWith('--file=')) {
      options.file = arg.slice('--file='.length);
    } else if (arg === '--file' || arg === '-f') {
      options.file = argv[++i];
    } else if (arg.startsWith('--token=')) {
      options.token = arg.slice('--token='.length);
    } else if (arg === '--token' || arg === '-t') {
      options.token = argv[++i];
    } else if (arg.startsWith('--out=')) {
      options.out = arg.slice('--out='.length);
    } else if (arg === '--out' || arg === '-o') {
      options.out = argv[++i];
    } else if (arg.startsWith('--only=')) {
      options.only = arg.slice('--only='.length);
    } else if (arg === '--only') {
      options.only = argv[++i];
    }
  }

  return options;
}

function printCliHelp() {
  console.log(`
Figma Component Sets Discoverer & Importer

Usage:
  node scripts/import-figma-components.js [options]

Options:
  --figma-snapshot=<path> Discover offline from a complete saved file; no network fallback
  --dry-run               Output summary table without mutating components.catalog.json
  --only=<names>          Filter to import only matching component names (comma-separated)
  --all                   Import all discovered component sets (default)
  --out=<path>            Custom output catalog path (default: components.catalog.json)
  --merge                 Preserve existing entries in catalog (default: true)
  --no-merge              Overwrite catalog with only discovered entries
  --file=<key>            Figma file key (default: FIGMA_FILE_KEY or ${DEFAULT_FILE_KEY})
  --token=<token>         Figma access token (default: FIGMA_ACCESS_TOKEN)
  --include-icons         Include icon components from Icons page (default: false)
  --no-standalone         Only import component sets, ignore standalone components
  --silent                Suppress console output
  -h, --help              Show this help message

Examples:
  node scripts/import-figma-components.js --dry-run
  node scripts/import-figma-components.js --only=Button,Badge,Checkbox
  node scripts/import-figma-components.js --out=components.catalog.json
`);
}

/**
 * CLI Runner
 */
async function runCli() {
  const options = parseCliArgs(process.argv.slice(2));

  if (options.help) {
    printCliHelp();
    return;
  }

  await importFigmaComponents(options);
}

// ---------------------------------------------------------------------------
// Exports & Entrypoint
// ---------------------------------------------------------------------------

module.exports = {
  DEFAULT_FILE_KEY,
  DEFAULT_CATALOG_PATH,
  normalizeComponentName,
  parseComponentSetsResponse,
  parseComponentsResponse,
  mapFigmaItemToCatalogEntry,
  readCatalogFile,
  findExistingCatalogIndex,
  mergeCatalogEntries,
  filterComponents,
  discoverFigmaComponentSets,
  importFigmaComponents,
  parseCliArgs,
  runCli,
};

if (require.main === module) {
  runCli().catch((err) => {
    console.error(`[import-figma-components] ERROR: ${err.message}`);
    process.exit(1);
  });
}

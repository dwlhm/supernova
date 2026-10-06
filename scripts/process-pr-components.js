#!/usr/bin/env node

/**
 * Supernova Component PR Processor & Drift Detector
 *
 * Manages the component template lifecycle and drift detection between
 * Figma, Supernova catalog, and Git:
 * - Reads components.catalog.json and .components-manifest.json (or git base).
 * - Computes deterministic SHA-256 fingerprint for each component.
 * - Detects new, changed, and unchanged components.
 * - Regenerates templates for new/changed components using scripts/figma-to-mitosis.js.
 * - Preserves existing custom code for unchanged components.
 * - Updates .components-manifest.json with new fingerprints.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const {
  fetchFigmaNode,
  fetchFigmaNodesBatch,
  transpileFigmaNodeToMitosisArtifacts,
  loadTokens,
  loadEnvFile,
} = require('./figma-to-mitosis');

const { validateComposition, readCompositionRegistry, sourceHash, validateOwnedRemovals, pruneOwnedOutputs } = require('./component-composition');

// Automatically load .env from repository root if present
loadEnvFile(path.resolve(__dirname, '..', '.env'));

// ---------------------------------------------------------------------------
// Helpers: String manipulation
// ---------------------------------------------------------------------------

function toPascalCase(str) {
  if (!str) return 'Component';
  const clean = str.replace(/#.*$/, '').trim();
  const camel = clean
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
  return camel.length > 0 ? camel : 'Component';
}

function toKebabCase(str) {
  if (!str) return '';
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
}

function toCamelCase(str) {
  if (!str) return '';
  const clean = str.replace(/#.*$/, '').trim();
  return clean
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

// ---------------------------------------------------------------------------
// Helpers: Canonicalization & Deterministic Fingerprinting
// ---------------------------------------------------------------------------

/**
 * Recursively sort object keys for deterministic serialization.
 */
function canonicalize(val) {
  if (val === null || val === undefined) return null;
  if (typeof val !== 'object') return val;
  if (Array.isArray(val)) {
    return val.map(canonicalize);
  }
  const sortedKeys = Object.keys(val).sort();
  const result = {};
  for (const key of sortedKeys) {
    result[key] = canonicalize(val[key]);
  }
  return result;
}

/**
 * Compute deterministic SHA-256 fingerprint for a catalog component.
 * Incorporates node metadata, properties, variants, and Figma lastModified/scene hash.
 *
 * @param {object} component - Component entry from components.catalog.json
 * @returns {string} SHA-256 hex digest
 */
function computeFingerprint(component) {
  if (!component || typeof component !== 'object') {
    return '';
  }

  const figma = component.figma || {};
  const payload = {
    id: component.id || null,
    name: component.name || null,
    description: component.description || '',
    brandId: component.brandId || null,
    fileId: component.fileId || figma.fileId || null,
    nodeId: component.nodeId || figma.nodeId || null,
    sourceId: component.sourceId || figma.sourceId || null,
    updatedAt: component.updatedAt || figma.updatedAt || component.lastModified || figma.lastModified || null,
    sceneHash: component.sceneHash || figma.sceneHash || null,
    nodeHash: component.nodeHash || figma.nodeHash || null,
    componentPropertyDefinitions: component.componentPropertyDefinitions || figma.componentPropertyDefinitions || [],
    variantPropertyValues: component.variantPropertyValues || figma.variantPropertyValues || null,
    variants: figma.variants || component.variants || [],
    ...(component.composition != null ? { composition: component.composition } : {}),
  };

  // If explicit scene node or fixture is attached, include it
  if (component.node || figma.node) {
    payload.node = component.node || figma.node;
  }

  const canonicalJson = JSON.stringify(canonicalize(payload));
  return crypto.createHash('sha256').update(canonicalJson).digest('hex');
}

// ---------------------------------------------------------------------------
// Helpers: Catalog & Manifest I/O
// ---------------------------------------------------------------------------

/**
 * Read and parse components.catalog.json safely.
 * Returns an empty array if missing or invalid.
 */
function readCatalog(catalogPath) {
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
    console.warn(`[process-pr-components] Warning: Failed reading catalog at ${fullPath}: ${err.message}`);
    return [];
  }
}

/**
 * Normalize manifest data into standard structure: { version, components: { [name]: entry } }
 */
function normalizeManifest(data) {
  if (!data || typeof data !== 'object') {
    return { version: '1.0.0', components: {} };
  }

  const normalized = {
    version: data.version || '1.0.0',
    components: {},
  };

  if (Array.isArray(data)) {
    for (const item of data) {
      if (item && item.name) {
        normalized.components[toPascalCase(item.name)] = item;
      }
    }
    return normalized;
  }

  if (Array.isArray(data.components)) {
    for (const item of data.components) {
      if (item && item.name) {
        normalized.components[toPascalCase(item.name)] = item;
      }
    }
    return normalized;
  }

  if (data.components && typeof data.components === 'object') {
    for (const [key, val] of Object.entries(data.components)) {
      if (val && typeof val === 'object') {
        normalized.components[toPascalCase(key)] = val;
      }
    }
    return normalized;
  }

  // Object keyed by component names directly
  for (const [key, val] of Object.entries(data)) {
    if (key !== 'version' && key !== 'lastUpdated' && key !== 'generatedAt' && typeof val === 'object' && val !== null) {
      normalized.components[toPascalCase(key)] = val;
    }
  }

  return normalized;
}

/**
 * Extract fingerprint or hash string from manifest entry.
 */
function getManifestFingerprint(entry) {
  if (!entry || typeof entry !== 'object') return null;
  return entry.fingerprint || entry.hash || null;
}

/**
 * Load baseline manifest from git ref (e.g. origin/main) or local file.
 */
function loadBaselineManifest(manifestPath, baseRef) {
  if (baseRef) {
    // 1. Direct file path check
    if (typeof baseRef === 'string') {
      const directPath = path.resolve(process.cwd(), baseRef);
      if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
        try {
          const raw = fs.readFileSync(directPath, 'utf8');
          return normalizeManifest(JSON.parse(raw));
        } catch (err) {
          console.warn(`[process-pr-components] Warning: Failed reading base manifest file ${directPath}: ${err.message}`);
        }
      }
    }

    // 2. Git show <baseRef>:<relPath>
    const effectiveRef = typeof baseRef === 'string' && baseRef !== 'true' && baseRef !== '' ? baseRef : 'origin/main';
    try {
      const gitRoot = execSync('git rev-parse --show-toplevel', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();
      const absManifest = path.resolve(process.cwd(), manifestPath);
      const relToGit = path.relative(gitRoot, absManifest).replace(/\\/g, '/');
      const gitCmd = `git show ${effectiveRef}:${relToGit}`;
      const gitStdout = execSync(gitCmd, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      if (gitStdout && gitStdout.trim()) {
        return normalizeManifest(JSON.parse(gitStdout));
      }
    } catch {
      // Git show failed (ref does not exist or file does not exist in base ref); fall back to local file
    }
  }

  // 3. Fall back to local manifest file
  const localPath = path.resolve(process.cwd(), manifestPath);
  if (fs.existsSync(localPath)) {
    try {
      const raw = fs.readFileSync(localPath, 'utf8');
      return normalizeManifest(JSON.parse(raw));
    } catch (err) {
      console.warn(`[process-pr-components] Warning: Failed reading local manifest at ${localPath}: ${err.message}`);
    }
  }

  return { version: '1.0.0', components: {} };
}

// ---------------------------------------------------------------------------
// Helpers: Figma Node Resolution & Synthetic Fallback
// ---------------------------------------------------------------------------

/**
 * Synthesize a minimal Figma COMPONENT node from catalog component metadata.
 */
function createSyntheticFigmaNode(component) {
  const compProps = {};

  if (Array.isArray(component.componentPropertyDefinitions)) {
    for (const prop of component.componentPropertyDefinitions) {
      const propKey = prop.name || prop.codeName;
      if (propKey) {
        compProps[propKey] = {
          type: prop.type || 'TEXT',
          defaultValue: prop.defaultValue !== undefined ? prop.defaultValue : '',
          ...(prop.options ? { options: prop.options } : {}),
        };
      }
    }
  } else if (component.componentPropertyDefinitions && typeof component.componentPropertyDefinitions === 'object') {
    Object.assign(compProps, component.componentPropertyDefinitions);
  }

  const pascalName = toPascalCase(component.name);

  return {
    id: component.nodeId || '1:1',
    name: pascalName,
    type: 'COMPONENT',
    layoutMode: 'NONE',
    fills: [],
    strokes: [],
    componentPropertyDefinitions: compProps,
    children: [
      {
        id: `${component.nodeId || '1:1'}:label`,
        name: `${pascalName}Text`,
        type: 'TEXT',
        characters: component.description || pascalName,
      },
    ],
  };
}

/**
 * Resolve Figma node: from fixture file, embedded node, Figma REST API, or synthetic mock.
 */
async function resolveFigmaNode(component, options = {}) {
  const { mock = false, token = null, fixturesDir = null, nodeCache = null, snapshot = null } = options;
  if (snapshot) return require('./figma-snapshot').resolveSnapshotNode(snapshot, component.nodeId || component.figma?.nodeId, component.fileId || component.figma?.fileId || snapshot.fileKey);

  // 1. Explicit fixture path on component
  if (component.fixture || component.fixturePath) {
    const fixturePath = path.resolve(process.cwd(), component.fixture || component.fixturePath);
    if (fs.existsSync(fixturePath)) {
      return JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    }
  }

  // 2. Embedded scene node
  if (component.node || component.figmaNode) {
    return component.node || component.figmaNode;
  }

  // 3. Search in fixtures directory
  if (fixturesDir && fs.existsSync(fixturesDir)) {
    const pascalName = toPascalCase(component.name);
    const kebabName = toKebabCase(component.name);
    const lowerName = component.name.toLowerCase();

    const candidates = [
      path.join(fixturesDir, `${pascalName}.figma.json`),
      path.join(fixturesDir, `${kebabName}.figma.json`),
      path.join(fixturesDir, `${lowerName}.figma.json`),
      path.join(fixturesDir, `${component.name}.figma.json`),
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return JSON.parse(fs.readFileSync(candidate, 'utf8'));
      }
    }
  }

  const fileId = component.fileId || (component.figma && component.figma.fileId);
  const nodeId = component.nodeId || (component.figma && component.figma.nodeId);

  // 4. Batch cache lookup if available
  if (nodeCache && nodeId) {
    const targetNode =
      nodeCache[nodeId] ||
      nodeCache[decodeURIComponent(nodeId)] ||
      nodeCache[encodeURIComponent(nodeId)] ||
      nodeCache[nodeId.replace(':', '-')] ||
      nodeCache[nodeId.replace('-', ':')];

    if (targetNode) {
      if (targetNode.document) {
        const documentNode = targetNode.document;
        // Enrich with component metadata if available
        if (!documentNode.componentPropertyDefinitions) {
          if (targetNode.componentSets) {
            const setMeta = targetNode.componentSets[nodeId] || Object.values(targetNode.componentSets)[0];
            if (setMeta && setMeta.componentPropertyDefinitions) {
              documentNode.componentPropertyDefinitions = setMeta.componentPropertyDefinitions;
            }
          }
          if (!documentNode.componentPropertyDefinitions && targetNode.components) {
            const compMeta = targetNode.components[nodeId] || Object.values(targetNode.components)[0];
            if (compMeta && compMeta.componentPropertyDefinitions) {
              documentNode.componentPropertyDefinitions = compMeta.componentPropertyDefinitions;
            }
          }
        }
        return documentNode;
      }
      return targetNode;
    }
  }

  // 5. Fetch via Figma REST API if credentials and coordinates exist
  const effectiveToken = token || process.env.FIGMA_ACCESS_TOKEN;

  if (!mock && effectiveToken && fileId && nodeId) {
    return await fetchFigmaNode(fileId, nodeId, effectiveToken);
  }

  // 6. Offline / Mock fallback
  return createSyntheticFigmaNode(component);
}

// ---------------------------------------------------------------------------
// Summary Report Formatter
// ---------------------------------------------------------------------------

function printSummaryReport({
  catalogPath,
  manifestPath,
  componentsDir,
  baseRef,
  dryRun,
  isMockMode,
  results,
  counts,
}) {
  const banner = '==================================================';
  console.log(`\n${banner}`);
  console.log('Component PR Drift Detection Summary');
  console.log(banner);
  console.log(`Catalog:     ${catalogPath} (${counts.total} items)`);
  console.log(`Manifest:    ${manifestPath}`);
  console.log(`Baseline:    ${baseRef ? `git:${baseRef}` : 'local manifest'}`);
  console.log(`Target Dir:  ${componentsDir}`);
  console.log(`Mode:        ${isMockMode ? 'Mock / Offline' : 'Figma REST API'}`);
  if (dryRun) {
    console.log('Status:      [DRY RUN] No files written');
  }

  console.log('\nComponent Actions:');
  if (results.length === 0) {
    console.log('  (no components found to process)');
  } else {
    for (const r of results) {
      const tag = `[${r.status.toUpperCase()}]`.padEnd(13);
      const hashSnippet = r.fingerprint ? ` (${r.fingerprint.slice(0, 8)})` : '';
      if (r.status === 'new') {
        console.log(`  ✓ ${tag} ${r.name.padEnd(16)} -> Generated ${r.file}${hashSnippet}`);
      } else if (r.status === 'updated') {
        console.log(`  ✓ ${tag} ${r.name.padEnd(16)} -> Regenerated ${r.file}${hashSnippet}`);
      } else if (r.status === 'preserved') {
        console.log(`  • ${tag} ${r.name.padEnd(16)} -> Preserved custom code${hashSnippet}`);
      } else if (r.status === 'failed') {
        console.log(`  ✗ ${tag} ${r.name.padEnd(16)} -> Error: ${r.error}`);
      }
    }
  }

  console.log('\nSummary:');
  console.log(`  Total catalog items:   ${counts.total}`);
  console.log(`  New generated:         ${counts.new}`);
  console.log(`  Updated (regenerated): ${counts.updated}`);
  console.log(`  Preserved (unchanged): ${counts.preserved}`);
  if (counts.failed > 0) {
    console.log(`  Failed:                ${counts.failed}`);
  }
  console.log(`${banner}\n`);
}

// ---------------------------------------------------------------------------
// Main Processor Function
// ---------------------------------------------------------------------------

/**
 * Process PR components and manage template drift.
 *
 * @param {object} options
 * @param {string} [options.catalog] - Path to components.catalog.json
 * @param {string} [options.manifest] - Path to .components-manifest.json
 * @param {string} [options.base] - Git baseline ref or baseline manifest path
 * @param {string} [options.componentsDir] - Target components directory
 * @param {boolean} [options.dryRun] - Preview actions without writing files
 * @param {boolean} [options.mock] - Force offline/mock mode
 * @param {string} [options.token] - Figma access token
 * @param {string} [options.tokens] - Custom design tokens path
 * @param {string} [options.fixturesDir] - Path to fixtures directory
 * @param {boolean} [options.silent] - Suppress stdout output
 * @returns {Promise<object>} Processing outcome and summary
 */
async function processPrComponents(options = {}) {
  const {
    catalog: catalogArg = 'components.catalog.json',
    compositionRegistry: compositionRegistryArg = 'components.composition.json',
    figmaSnapshot: figmaSnapshotArg = null,
    manifest: manifestArg = '.components-manifest.json',
    base: baseRef = null,
    componentsDir: componentsDirArg = 'components',
    dryRun = false,
    mock = false,
    token = null,
    tokens: tokensPath = null,
    fixturesDir = path.join(__dirname, 'fixtures'),
    silent = false,
  } = options;

  const snapshot = figmaSnapshotArg ? require('./figma-snapshot').loadSnapshot(figmaSnapshotArg) : null;
  const cwd = process.cwd();
  const catalogPath = path.resolve(cwd, catalogArg);
  const manifestPath = path.resolve(cwd, manifestArg);
  const componentsDir = path.resolve(cwd, componentsDirArg);

  // 1. Read catalog
  let catalog = readCatalog(catalogPath);

  // 2. Read baseline manifest. An unavailable catalog is never deletion input.
  const baselineManifest = loadBaselineManifest(manifestPath, baseRef);
  let authoritativeCatalog = false;
  try {
    const parsed = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    authoritativeCatalog = Array.isArray(parsed) || !!(parsed && Array.isArray(parsed.components));
  } catch (_) { /* Legacy empty-read behavior is safe only without owned files. */ }
  if (!authoritativeCatalog && Object.values(baselineManifest.components).some(entry => entry.outputs?.length)) throw new Error('Catalog unavailable or invalid; preserving owned outputs and manifest');
  if (authoritativeCatalog) catalog = readCompositionRegistry(path.resolve(cwd, compositionRegistryArg), catalog, toPascalCase);

  // 3. Prepare updated manifest
  const updatedManifest = {
    version: baselineManifest.version || '1.0.0',
    lastUpdated: new Date().toISOString(),
    components: { ...baselineManifest.components },
  };

  // Validate the complete output namespace before fetching or writing anything.
  const outputOwners = new Map();
  const publicExports = new Map();
  for (const component of catalog) {
    if (!component || !component.name) continue;
    const rootName = toPascalCase(component.name);
    const names = component.composition != null ? validateComposition(component.composition, rootName).parts.map(part => part.name) : [rootName];
    for (const name of names) {
      if (outputOwners.has(name)) throw new Error(`Generated output collision ${name}: ${outputOwners.get(name)} and ${rootName}`);
      outputOwners.set(name, rootName);
      for (const symbol of [name, `${name}Props`]) {
        if (publicExports.has(symbol)) throw new Error(`Generated public export collision ${symbol}`);
        publicExports.set(symbol, rootName);
      }
    }
  }
  if (snapshot) for (const component of catalog) {
    if (component && component.name) require('./figma-snapshot').resolveSnapshotNode(snapshot, component.nodeId || component.figma?.nodeId, component.fileId || component.figma?.fileId || snapshot.fileKey);
  }
  const catalogRoots = new Set(catalog.filter(c => c && c.name).map(c => toPascalCase(c.name)));
  for (const [name, entry] of Object.entries(baselineManifest.components)) {
    if (authoritativeCatalog && !catalogRoots.has(name)) validateOwnedRemovals(entry.outputs, new Set(outputOwners.keys()), componentsDir);
  }
  const tokens = loadTokens(tokensPath);
  const isMockMode = !!snapshot || mock || (!token && !process.env.FIGMA_ACCESS_TOKEN);
  const effectiveToken = token || process.env.FIGMA_ACCESS_TOKEN;

  // Batch pre-fetch remote Figma component nodes (chunk size 50)
  const nodeCache = {};
  if (!snapshot && !isMockMode && effectiveToken) {
    const remoteComponentsByFile = new Map();
    for (const component of catalog) {
      if (!component || !component.name) continue;

      const fileId = component.fileId || (component.figma && component.figma.fileId);
      const nodeId = component.nodeId || (component.figma && component.figma.nodeId);
      if (!fileId || !nodeId) continue;

      // Skip components that have local fixtures or embedded nodes
      if (component.fixture || component.fixturePath) continue;
      if (component.node || component.figmaNode) continue;
      if (fixturesDir && fs.existsSync(fixturesDir)) {
        const pascalName = toPascalCase(component.name);
        const kebabName = toKebabCase(component.name);
        const lowerName = component.name.toLowerCase();
        const candidates = [
          path.join(fixturesDir, `${pascalName}.figma.json`),
          path.join(fixturesDir, `${kebabName}.figma.json`),
          path.join(fixturesDir, `${lowerName}.figma.json`),
          path.join(fixturesDir, `${component.name}.figma.json`),
        ];
        if (candidates.some((c) => fs.existsSync(c))) continue;
      }

      if (!remoteComponentsByFile.has(fileId)) {
        remoteComponentsByFile.set(fileId, []);
      }
      remoteComponentsByFile.get(fileId).push(nodeId);
    }

    for (const [fileId, nodeIds] of remoteComponentsByFile.entries()) {
      if (nodeIds.length > 0) {
        if (!silent) {
          console.log(`[process-pr-components] Batch fetching ${nodeIds.length} component nodes from Figma file "${fileId}" (chunk size 50)...`);
        }
        try {
          const batchResults = await fetchFigmaNodesBatch(fileId, nodeIds, effectiveToken, 50);
          Object.assign(nodeCache, batchResults);
        } catch (err) {
          if (!silent) {
            console.warn(`[process-pr-components] Warning: Batch fetch failed (${err.message}). Falling back to individual fetches.`);
          }
        }
      }
    }
  }

  const results = [];
  let newCount = 0;
  let updatedCount = 0;
  let preservedCount = 0;
  let failedCount = 0;

  for (const component of catalog) {
    if (!component || !component.name) continue;

    const pascalName = toPascalCase(component.name);
    const componentFileName = `${pascalName}.lite.tsx`;
    const componentFilePath = path.join(componentsDir, componentFileName);
    const relativeFilePath = path.relative(cwd, componentFilePath).replace(/\\/g, '/');

    // Compute deterministic SHA-256 fingerprint
    // Baseline manifest lookup. Introducing offline snapshot mode must not
    // invalidate unchanged legacy templates/custom edits by itself.
    const baselineEntry = baselineManifest.components[pascalName] || baselineManifest.components[component.name];
    const snapshotNode = snapshot ? require('./figma-snapshot').resolveSnapshotNode(snapshot, component.nodeId || component.figma?.nodeId, component.fileId || component.figma?.fileId || snapshot.fileKey) : null;
    const useSnapshotFingerprint = snapshotNode && (component.composition != null || !baselineEntry || baselineEntry.snapshot);
    const currentFingerprint = computeFingerprint(useSnapshotFingerprint ? { ...component, sceneHash: sourceHash(JSON.stringify(snapshotNode)) } : component);
    const baselineFingerprint = getManifestFingerprint(baselineEntry);
    const expectedNames = component.composition != null ? component.composition.parts.map(part => part.name) : [pascalName];
    const fileExists = expectedNames.every(name => fs.existsSync(path.join(componentsDir, `${name}.lite.tsx`)));

    // Determine lifecycle state
    const isNew = !baselineEntry || !baselineFingerprint;
    const isChanged = baselineFingerprint && baselineFingerprint !== currentFingerprint;
    const isUnchanged = baselineFingerprint && baselineFingerprint === currentFingerprint && fileExists;

    if (isUnchanged) {
      // UNCHANGED: preserve existing file intact (retains programmer custom edits)
      preservedCount++;
      updatedManifest.components[pascalName] = {
        ...baselineEntry,
        name: pascalName,
        fingerprint: baselineFingerprint,
        hash: baselineFingerprint,
        file: relativeFilePath,
      };

      results.push({
        name: pascalName,
        status: 'preserved',
        file: relativeFilePath,
        fingerprint: baselineFingerprint,
        reason: 'Fingerprint match, existing file preserved intact',
      });
      continue;
    }

    // NEW or CHANGED (or file missing on disk): regenerate template
    try {
      const figmaNode = await resolveFigmaNode(component, {
        mock: isMockMode,
        token: token || process.env.FIGMA_ACCESS_TOKEN,
        fixturesDir,
        nodeCache,
        snapshot,
      });

      const generatedSources = transpileFigmaNodeToMitosisArtifacts(figmaNode, {
        componentName: pascalName,
        composition: component.composition,
        tokens,
      });

      const priorOutputs = baselineEntry?.outputs || (baselineEntry ? [{ name: pascalName }] : []);
      for (const name of Object.keys(generatedSources)) {
        const target = path.join(componentsDir, `${name}.lite.tsx`);
        if (fs.existsSync(target) && !priorOutputs.some(output => output.name === name)) throw new Error(`Unowned output collision ${name}`);
        for (const [owner, entry] of Object.entries(baselineManifest.components)) {
          if (owner !== pascalName && (entry.outputs || [{ name: owner }]).some(output => output.name === name)) throw new Error(`Output ${name} owned by ${owner}`);
        }
      }
      validateOwnedRemovals(priorOutputs, new Set(Object.keys(generatedSources)), componentsDir);
      if (!dryRun) {
        fs.mkdirSync(componentsDir, { recursive: true });
        for (const [name, code] of Object.entries(generatedSources)) fs.writeFileSync(path.join(componentsDir, `${name}.lite.tsx`), code, 'utf8');
      }
      pruneOwnedOutputs(priorOutputs, new Set(Object.keys(generatedSources)), componentsDir, dryRun);

      updatedManifest.components[pascalName] = {
        ...(baselineEntry || {}),
        name: pascalName,
        id: component.id || (baselineEntry && baselineEntry.id) || null,
        fingerprint: currentFingerprint,
        hash: currentFingerprint,
        file: relativeFilePath,
        fileId: component.fileId || (component.figma && component.figma.fileId) || null,
        nodeId: component.nodeId || (component.figma && component.figma.nodeId) || null,
        updatedAt: component.updatedAt || (component.figma && component.figma.updatedAt) || null,
        lastGenerated: new Date().toISOString(),
        ...(snapshot ? { snapshot: { fileKey: snapshot.fileKey, version: snapshot.file.version, lastModified: snapshot.file.lastModified } } : {}),
        composition: component.composition || null,
        outputs: Object.entries(generatedSources).map(([name, code]) => ({ name, file: path.relative(cwd, path.join(componentsDir, `${name}.lite.tsx`)).replace(/\\/g, '/'), sourceHash: sourceHash(code) })),
      };

      if (isNew) {
        newCount++;
        results.push({
          name: pascalName,
          status: 'new',
          file: relativeFilePath,
          fingerprint: currentFingerprint,
          reason: 'New component generated',
        });
      } else {
        updatedCount++;
        results.push({
          name: pascalName,
          status: 'updated',
          file: relativeFilePath,
          fingerprint: currentFingerprint,
          previousFingerprint: baselineFingerprint,
          reason: 'Design drift detected, component regenerated',
        });
      }
    } catch (err) {
      failedCount++;
      results.push({
        name: pascalName,
        status: 'failed',
        file: relativeFilePath,
        error: err.message,
      });
      if (!silent) {
        console.error(`[process-pr-components] Error processing component ${pascalName}: ${err.message}`);
      }
    }
  }

  // Remove only unchanged, previously owned outputs of removed catalog entries.
  for (const [name, entry] of Object.entries(baselineManifest.components)) {
    if (!authoritativeCatalog || catalogRoots.has(name)) continue;
    pruneOwnedOutputs(entry.outputs, new Set(outputOwners.keys()), componentsDir, dryRun);
    delete updatedManifest.components[name];
  }

  // 4. Save updated manifest if not dry-run
  if (!dryRun) {
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, JSON.stringify(updatedManifest, null, 2) + '\n', 'utf8');
  }

  // 5. Print summary report
  if (!silent) {
    printSummaryReport({
      catalogPath,
      manifestPath,
      componentsDir,
      baseRef,
      dryRun,
      isMockMode,
      results,
      counts: {
        total: catalog.length,
        new: newCount,
        updated: updatedCount,
        preserved: preservedCount,
        failed: failedCount,
      },
    });
  }

  return {
    success: failedCount === 0,
    summary: {
      total: catalog.length,
      new: newCount,
      updated: updatedCount,
      preserved: preservedCount,
      failed: failedCount,
    },
    results,
    manifest: updatedManifest,
  };
}

// ---------------------------------------------------------------------------
// CLI Argument Parsing & Runner
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const result = {
    catalog: 'components.catalog.json',
    manifest: '.components-manifest.json',
    base: null,
    componentsDir: 'components',
    dryRun: false,
    mock: false,
    token: null,
    tokens: null,
    fixturesDir: path.join(__dirname, 'fixtures'),
    silent: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--dry-run') {
      result.dryRun = true;
    } else if (arg === '--mock') {
      result.mock = true;
    } else if (arg === '--silent') {
      result.silent = true;
    } else if (arg.startsWith('--composition-registry=')) {
      result.compositionRegistry = arg.slice(23);
    } else if (arg === '--composition-registry') {
      result.compositionRegistry = argv[++i];
    } else if (arg.startsWith('--figma-snapshot=')) {
      result.figmaSnapshot = arg.slice('--figma-snapshot='.length);
    } else if (arg === '--figma-snapshot') {
      result.figmaSnapshot = argv[++i];
    } else if (arg.startsWith('--catalog=')) {
      result.catalog = arg.slice(10);
    } else if (arg === '--catalog' || arg === '-c') {
      result.catalog = argv[++i];
    } else if (arg.startsWith('--manifest=')) {
      result.manifest = arg.slice(11);
    } else if (arg === '--manifest' || arg === '-m') {
      result.manifest = argv[++i];
    } else if (arg.startsWith('--base=')) {
      result.base = arg.slice(7);
    } else if (arg === '--base' || arg === '-b') {
      const next = argv[i + 1];
      if (next && !next.startsWith('-')) {
        result.base = argv[++i];
      } else {
        result.base = 'origin/main';
      }
    } else if (arg.startsWith('--components-dir=')) {
      result.componentsDir = arg.slice(17);
    } else if (arg.startsWith('--componentsDir=')) {
      result.componentsDir = arg.slice(16);
    } else if (arg === '--components-dir' || arg === '--componentsDir' || arg === '-d' || arg === '--out' || arg === '-o') {
      result.componentsDir = argv[++i];
    } else if (arg.startsWith('--out=')) {
      result.componentsDir = arg.slice(6);
    } else if (arg.startsWith('--token=')) {
      result.token = arg.slice(8);
    } else if (arg === '--token' || arg === '-t') {
      result.token = argv[++i];
    } else if (arg.startsWith('--tokens=')) {
      result.tokens = arg.slice(9);
    } else if (arg === '--tokens') {
      result.tokens = argv[++i];
    } else if (arg.startsWith('--fixtures-dir=')) {
      result.fixturesDir = arg.slice(15);
    } else if (arg === '--fixtures-dir') {
      result.fixturesDir = argv[++i];
    }
  }

  return result;
}

function printHelp() {
  console.log(`
Supernova Component PR Processor & Drift Detector

Usage:
  node scripts/process-pr-components.js [options]

Options:
  --catalog, -c         Path to components.catalog.json (default: components.catalog.json)
  --manifest, -m        Path to .components-manifest.json (default: .components-manifest.json)
  --base, -b            Git ref (e.g. origin/main) or file path to read baseline manifest
  --components-dir, -d  Directory for generated .lite.tsx components (default: components/)
  --figma-snapshot=<path>  Use saved full scene offline; never fetch missing nodes
  --dry-run             Preview actions without writing files
  --mock                Force offline/mock mode (skip Figma REST API calls)
  --token, -t           Figma personal access token (or set FIGMA_ACCESS_TOKEN env var)
  --tokens              Path to design tokens file (tokens.css or tokens.ts)
  --fixtures-dir        Path to directory with Figma JSON fixtures (default: scripts/fixtures/)
  --silent              Suppress summary output
  --help, -h            Display this help message

Examples:
  # Process with local catalog and manifest
  node scripts/process-pr-components.js

  # PR workflow with git baseline
  node scripts/process-pr-components.js --base=origin/main

  # Dry run preview
  node scripts/process-pr-components.js --dry-run
`);
}

// ---------------------------------------------------------------------------
// Exports & Entrypoint
// ---------------------------------------------------------------------------

module.exports = {
  processPrComponents,
  computeFingerprint,
  readCatalog,
  normalizeManifest,
  loadBaselineManifest,
  getManifestFingerprint,
  resolveFigmaNode,
  createSyntheticFigmaNode,
  parseArgs,
  toPascalCase,
  toKebabCase,
  toCamelCase,
  loadEnvFile,
};

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  processPrComponents(args)
    .then((res) => {
      if (!res.success) {
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error(`[process-pr-components] FATAL ERROR: ${err.message}`);
      process.exit(1);
    });
}

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const DEFAULT_ARTIFACT_DIRS = {
  tokensDir: 'tokens',
  componentsDir: 'components',
};

/**
 * Read artifact directory names declared in the repo-root config.json.
 * Falls back to DEFAULT_ARTIFACT_DIRS for any missing/invalid entry and for
 * any unparseable/missing config.json. Never throws.
 */
function readArtifactDirNames() {
  const names = { ...DEFAULT_ARTIFACT_DIRS };
  try {
    const raw = fs.readFileSync(path.join(rootDir, 'config.json'), 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { ...DEFAULT_ARTIFACT_DIRS };
    }
    for (const entry of parsed) {
      if (!entry || typeof entry !== 'object') continue;
      if (entry.key === 'tokensDir' && typeof entry.default === 'string' && entry.default.length > 0) {
        names.tokensDir = entry.default;
      }
      if (entry.key === 'componentsDir' && typeof entry.default === 'string' && entry.default.length > 0) {
        names.componentsDir = entry.default;
      }
    }
  } catch (e) {
    return { ...DEFAULT_ARTIFACT_DIRS };
  }
  return names;
}

/**
 * Resolve the export root using, in priority order:
 *   1. --source=<dir> or --source <dir> present in argv
 *   2. process.env.SUPERNOVA_EXPORT_DIR
 *   3. repo root
 * Relative values are resolved against the repo root.
 */
function resolveExportRoot(argv) {
  const args = Array.isArray(argv) ? argv : process.argv;
  let source = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg !== 'string') continue;
    if (arg.startsWith('--source=')) {
      source = arg.slice('--source='.length);
      break;
    }
    if (arg === '--source') {
      const next = args[i + 1];
      if (typeof next === 'string') {
        source = next;
      }
      break;
    }
  }

  if (!source) {
    source = process.env.SUPERNOVA_EXPORT_DIR || null;
  }
  if (!source) {
    return rootDir;
  }
  return path.resolve(rootDir, source);
}

/**
 * Resolve the concrete export paths derived from a root. Pure derivation:
 * the only I/O is config.json reads and existence checks.
 */
function resolveExportPaths(opts) {
  const options = opts || {};
  const root = options.root !== undefined && options.root !== null
    ? path.resolve(rootDir, options.root)
    : resolveExportRoot(options.argv);
  const names = readArtifactDirNames();
  const tokensDir = path.resolve(root, names.tokensDir);
  const componentsDir = path.resolve(root, names.componentsDir);
  const runtimeDir = path.resolve(componentsDir, '..', 'runtime');

  return {
    root,
    tokensDir,
    componentsDir,
    runtimeDir,
    hasTokens: fs.existsSync(tokensDir),
    hasComponents: fs.existsSync(componentsDir),
    hasRuntime: fs.existsSync(runtimeDir),
  };
}

module.exports = {
  rootDir,
  DEFAULT_ARTIFACT_DIRS,
  readArtifactDirNames,
  resolveExportRoot,
  resolveExportPaths,
};

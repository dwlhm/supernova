const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SNAPSHOT_VERSION = 1;
function validateSnapshot(snapshot) {
  if (!snapshot || snapshot.snapshotVersion !== SNAPSHOT_VERSION || typeof snapshot.fileKey !== 'string' || !/^[A-Za-z0-9_-]+$/.test(snapshot.fileKey)) throw new Error('Invalid Figma snapshot identity/version');
  const file = snapshot.file;
  if (!file || typeof file !== 'object' || file.document?.type !== 'DOCUMENT' || typeof file.version !== 'string' || typeof file.lastModified !== 'string') throw new Error('Invalid Figma snapshot: complete file document/version/lastModified required');
  const nodes = new Map();
  function visit(node) {
    if (!node || typeof node !== 'object' || typeof node.id !== 'string' || typeof node.type !== 'string' || nodes.has(node.id)) throw new Error('Invalid Figma snapshot: invalid or duplicate scene node');
    nodes.set(node.id, node);
    if (node.children !== undefined && !Array.isArray(node.children)) throw new Error('Invalid Figma snapshot: children must be array');
    for (const child of node.children || []) visit(child);
  }
  visit(file.document);
  for (const key of ['components', 'componentSets']) if (!file[key] || typeof file[key] !== 'object' || Array.isArray(file[key])) throw new Error(`Invalid Figma snapshot: ${key} metadata required`);
  return { ...snapshot, nodes };
}
function loadSnapshot(filePath) {
  return validateSnapshot(JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8')));
}
function resolveSnapshotNode(snapshot, nodeId, fileKey = snapshot.fileKey) {
  if (fileKey !== snapshot.fileKey) throw new Error(`Snapshot file ${snapshot.fileKey} does not match requested file ${fileKey}`);
  const canonicalId = typeof nodeId === 'string' ? nodeId.replace(/^(\d+)-(\d+)$/, '$1:$2') : nodeId;
  const node = snapshot.nodes.get(canonicalId);
  if (!node) throw new Error(`Node ${nodeId} is absent from Figma snapshot; offline mode does not fetch or synthesize missing nodes`);
  return node;
}
function discoverSnapshotComponents(snapshot, options = {}) {
  const { parseComponentSetsResponse, parseComponentsResponse } = require('./import-figma-components');
  const sets = [];
  const components = [];
  function visit(node, parent, pageName = '', inSet = false) {
    const page = node.type === 'CANVAS' ? node.name : pageName;
    const metadata = (node.type === 'COMPONENT_SET' ? snapshot.file.componentSets : snapshot.file.components)[node.id] || {};
    const item = { ...metadata, node_id: node.id, file_key: snapshot.fileKey, name: node.name, description: node.description || metadata.description || '', updated_at: snapshot.file.lastModified, containing_frame: { name: parent?.name || '', pageName: page, containingComponentSet: inSet } };
    if (node.type === 'COMPONENT_SET') sets.push(item);
    if (node.type === 'COMPONENT') components.push(item);
    for (const child of node.children || []) visit(child, node, page, inSet || node.type === 'COMPONENT_SET');
  }
  visit(snapshot.file.document, null);
  const descriptors = [
    ...parseComponentSetsResponse({ meta: { component_sets: sets } }, snapshot.fileKey),
    ...(options.includeStandalone === false ? [] : parseComponentsResponse({ meta: { components } }, snapshot.fileKey, { includeIcons: !!options.includeIcons })),
  ];
  return descriptors.map(item => {
    const node = snapshot.nodes.get(item.node_id);
    const variantValues = child => Object.fromEntries(Object.entries(child.componentProperties || {}).filter(([, value]) => value.type === 'VARIANT').map(([key, value]) => [key, value.value]));
    return { ...item, componentPropertyDefinitions: node.componentPropertyDefinitions || [], variantPropertyValues: variantValues(node), sceneHash: crypto.createHash('sha256').update(JSON.stringify(node)).digest('hex'), variants: node.type === 'COMPONENT_SET' ? (node.children || []).map(child => ({ id: child.id, name: child.name, variantPropertyValues: variantValues(child), origin: { fileId: snapshot.fileKey, nodeId: child.id, sourceId: snapshot.file.components[child.id]?.key || null }, updatedAt: snapshot.file.lastModified })) : [] };
  });
}
async function cacheFigmaFile(options = {}) {
  const { fileKey, token, fetchFn = fetch, refresh = false } = options;
  if (typeof fileKey !== 'string' || !/^[A-Za-z0-9_-]+$/.test(fileKey)) throw new Error('A valid Figma file key is required');
  const cachePath = path.resolve(options.out || path.join('.cache', 'figma', `${fileKey}.json`));
  if (fs.existsSync(cachePath) && !refresh) {
    const snapshot = loadSnapshot(cachePath);
    if (snapshot.fileKey !== fileKey) throw new Error('Existing snapshot belongs to a different Figma file');
    return { cachePath, reused: true, snapshot };
  }
  if (!token) throw new Error('FIGMA_ACCESS_TOKEN is required to fetch the initial snapshot');
  const response = await fetchFn(`https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}?geometry=paths`, { headers: { 'X-Figma-Token': token }, signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error(`Figma file snapshot request failed with HTTP ${response.status}`);
  const snapshot = { snapshotVersion: SNAPSHOT_VERSION, fileKey, fetchedAt: new Date().toISOString(), geometry: 'paths', file: await response.json() };
  const validated = validateSnapshot(snapshot);
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  const temporaryPath = `${cachePath}.${crypto.randomBytes(8).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(temporaryPath, JSON.stringify(snapshot), { encoding: 'utf8', mode: 0o600, flag: 'wx' });
    fs.renameSync(temporaryPath, cachePath);
  } finally {
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
  }
  return { cachePath, reused: false, snapshot: validated };
}
module.exports = { loadSnapshot, validateSnapshot, resolveSnapshotNode, discoverSnapshotComponents, cacheFigmaFile };

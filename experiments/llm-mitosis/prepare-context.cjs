const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const Module = require('node:module');
const esbuild = require('esbuild');
const { loadSnapshot, resolveSnapshotNode } = require('../../scripts/figma-snapshot');

const ROOT = path.resolve(__dirname, '../..');
const INPUTS = { snapshot: '.cache/figma/wLWN7FdmqCslghDJPWIweW.json', tokens: 'reference/tokens.json', groups: 'reference/token-groups.json', metadata: 'reference/meta.json' };
const SELECTIONS = { Checkbox: '2179:474', TextField: '3344:287', DataTable: '2571:20661', TableHeaderRow: '2299:102', TableBodyRow: '2299:111', TableCellValue: '2301:206', Chart: '3038:311' };
const FIELDS = new Set('id type name description visible componentId componentProperties componentPropertyDefinitions componentPropertyReferences isExposedInstance exposedInstances absoluteBoundingBox absoluteRenderBounds size relativeTransform constraints layoutMode layoutWrap layoutSizingHorizontal layoutSizingVertical primaryAxisSizingMode counterAxisSizingMode primaryAxisAlignItems counterAxisAlignItems layoutAlign layoutGrow layoutPositioning paddingLeft paddingRight paddingTop paddingBottom itemSpacing counterAxisSpacing fills strokes strokeWeight strokeAlign strokeTopWeight strokeBottomWeight strokeLeftWeight strokeRightWeight cornerRadius rectangleCornerRadii opacity blendMode effects boundVariables styles characters style characterStyleOverrides styleOverrideTable textAutoResize textTruncation maxLines clipsContent'.split(' '));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const read = relative => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
function normalizer() {
  const entry = path.join(ROOT, 'exporter/src/tokens/normalize.ts');
  const bundle = esbuild.buildSync({ entryPoints: [entry], bundle: true, platform: 'node', format: 'cjs', write: false });
  const loaded = new Module(entry, module);
  loaded.filename = entry;
  loaded.paths = Module._nodeModulePaths(path.dirname(entry));
  loaded._compile(bundle.outputFiles[0].text, entry);
  return loaded.exports.normalizeTokens;
}
function projectParent(record) {
  if (record.parentGroupId && record.parent?.id && record.parentGroupId !== record.parent.id) throw new Error(`Conflicting parent identity: ${record.id}`);
  return { ...record, parentGroupId: record.parentGroupId || record.parent?.id || null };
}
function projectLegacyValue(value) {
  if (Array.isArray(value)) return value.map(projectLegacyValue);
  if (!value || typeof value !== 'object') return value;
  const result = Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, projectLegacyValue(entry)]));
  if (typeof value.hex === 'string' && ['r', 'g', 'b', 'a'].every(key => typeof value[key] === 'number')) {
    if (!Number.isInteger(value.a) || value.a < 0 || value.a > 255) throw new Error('Legacy color alpha must be a byte');
    result.a = value.a / 255;
    // The normalizer's legacy hex path expects RGB; use rgba to retain original byte opacity.
    delete result.hex;
  }
  if (value.font) {
    if (typeof value.font.family !== 'string' || typeof value.font.subfamily !== 'string') throw new Error('Invalid legacy typography font');
    result.fontFamily = value.font.family;
    result.fontWeight = value.font.subfamily;
  }
  return result;
}
function main() {
  const snapshot = loadSnapshot(path.join(ROOT, INPUTS.snapshot));
  const originalTokens = read(INPUTS.tokens);
  const { tokens, collisions } = normalizer()(originalTokens.map(token => ({ ...projectParent(token), value: projectLegacyValue(token.value) })), read(INPUTS.groups).map(projectParent));
  const metadata = read(INPUTS.metadata);
  const origins = new Set(originalTokens.map(token => token.origin?.id).filter(Boolean));
  const artifacts = new Map();
  const scenes = [];
  for (const [name, nodeId] of Object.entries(SELECTIONS)) {
    const scene = resolveSnapshotNode(snapshot, nodeId);
    const omitted = new Set();
    const aliases = new Set();
    const references = new Set();
    const fontFamilies = new Set();
    let nodeCount = 0;
    function sanitize(value) {
      if (Array.isArray(value)) return value.map(sanitize);
      if (!value || typeof value !== 'object') return value;
      const result = {};
      for (const [key, entry] of Object.entries(value)) {
        if (/url|hyperlink/i.test(key)) { omitted.add(`nested.${key}`); continue; }
        result[key] = sanitize(entry);
      }
      return result;
    }
    function findAliases(value) {
      if (!value || typeof value !== 'object') return;
      if (value.type === 'VARIABLE_ALIAS' && typeof value.id === 'string') aliases.add(value.id);
      for (const entry of Object.values(value)) findAliases(entry);
    }
    function select(node) {
      nodeCount++;
      for (const [key, value] of Object.entries(node)) if (key !== 'children') findAliases(value);
      if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') references.add(node.id);
      if (node.style?.fontFamily) fontFamilies.add(node.style.fontFamily);
      if (node.componentId) references.add(node.componentId);
      const selected = {};
      for (const [key, value] of Object.entries(node)) {
        if (key === 'children') selected.children = value.map(select);
        else if (FIELDS.has(key)) selected[key] = sanitize(value);
        else omitted.add(key);
      }
      return selected;
    }
    const selected = select(scene);
    const provenance = { source: INPUTS.snapshot, snapshotVersion: snapshot.snapshotVersion, fileKey: snapshot.fileKey, nodeId, version: snapshot.file.version, lastModified: snapshot.file.lastModified, fetchedAt: snapshot.fetchedAt, sceneSha256: hash(JSON.stringify(scene)), selectedSha256: hash(JSON.stringify(selected)), nodeCount, fontFamilies: [...fontFamilies].sort() };
    const componentMetadata = {};
    for (const id of [nodeId, ...references]) {
      const entry = snapshot.file.components[id] || snapshot.file.componentSets[id];
      if (entry) componentMetadata[id] = sanitize(entry);
    }
    artifacts.set(`context/${name}.json`, { name, provenance, componentMetadata, omittedFields: [...omitted].sort(), variableAliases: [...aliases].sort(), unresolvedSupernovaAliases: [...aliases].filter(id => !origins.has(id)).sort(), scene: selected });
    scenes.push({ name, ...provenance, variantCount: scene.type === 'COMPONENT_SET' ? scene.children.length : 1, unresolvedSupernovaAliasCount: [...aliases].filter(id => !origins.has(id)).length });
  }
  const projection = 'Serialized SDK records project parentGroupId from parent.id before calling the existing exporter normalizeTokens. Legacy color byte alpha is divided by 255, with legacy hex omitted from normalized input so rgba retains opacity; typography font.family/subfamily project to fontFamily/fontWeight. Original values are preserved alongside normalized tokens.';
  const mismatch = 'Selected Figma scenes and this Supernova snapshot have unresolved token aliases. Per-scene font inventories and source typography values are recorded; reference typography includes both Inter and Plus Jakarta Sans. Authored token use is a semantic palette adaptation, not verified exact Figma token binding.';
  artifacts.set('context/tokens.json', { provenance: { sources: { tokens: INPUTS.tokens, groups: INPUTS.groups, metadata: INPUTS.metadata }, metadata, projection, mismatch }, tokens: tokens.map(token => { const original = originalTokens.find(entry => entry.id === token.id); return { ...token, source: { id: original.id, versionedId: original.versionedId, name: original.name, origin: original.origin, tokenType: original.tokenType, originalValue: original.value, parentGroupId: original.parent?.id || null } }; }), collisions });
  artifacts.set('manifest.json', { schemaVersion: 1, authoring: 'LLM authoring in this Codex session; preparation and compilation are deterministic local tools, not an automated LLM API pipeline.', sources: Object.fromEntries(Object.entries(INPUTS).map(([key, relative]) => [key, { path: relative, sha256: hash(fs.readFileSync(path.join(ROOT, relative))) }])), supernovaMetadata: metadata, tokenProjection: projection, tokenMismatch: mismatch, tokenCount: tokens.length, collisions, scenes });
  const css = ':root {\n' + tokens.map(token => `  ${token.cssName}: ${token.css};`).join('\n') + '\n}\n';
  // All reads, validation and normalization finish before publishing artifacts.
  for (const [relative, content] of artifacts) {
    const destination = path.join(__dirname, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, JSON.stringify(content, null, 2) + '\n');
  }
  fs.writeFileSync(path.join(__dirname, 'context/tokens.css'), css);
  console.log(JSON.stringify({ tokens: tokens.length, collisions: collisions.length, scenes: scenes.map(({ name, nodeCount, variantCount }) => ({ name, nodeCount, variantCount })) }, null, 2));
}
module.exports = { main, INPUTS, SELECTIONS };
if (require.main === module) {
  try { main(); } catch (error) { console.error(error); process.exitCode = 1; }
}

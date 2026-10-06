const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const NAME = /^[A-Z][A-Za-z0-9]*$/;
const PROP = /^[a-zA-Z][a-zA-Z0-9]*$/;
const TAGS = new Set('nav ol ul li a span div p table thead tbody tfoot tr th td caption section button label'.split(' '));
const TYPES = new Set(['string', 'boolean', 'number']);
const RESERVED = new Set(['children', 'className', 'constructor', 'prototype', '__proto__']);
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
function object(value, context) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${context}: expected object`);
  return value;
}
function keys(value, allowed, context) {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) throw new Error(`${context}: unsupported field ${key}`);
}
function validateComposition(value, expectedRoot) {
  const spec = object(value, 'composition');
  keys(spec, ['version', 'root', 'parts', 'examples'], 'composition');
  if (spec.version !== 1) throw new Error('composition.version: expected 1');
  if (typeof spec.root !== 'string' || !NAME.test(spec.root) || (expectedRoot && spec.root !== expectedRoot)) throw new Error('composition.root: must match component name');
  if (!Array.isArray(spec.parts) || !spec.parts.length) throw new Error('composition.parts: expected nonempty array');
  const names = new Set();
  for (const raw of spec.parts) {
    const part = object(raw, 'composition part');
    keys(part, ['name', 'sourceNodeId', 'tag', 'attributes', 'props', 'slot', 'defaultContent', 'classes'], 'composition part');
    if (typeof part.name !== 'string' || !NAME.test(part.name) || names.has(part.name)) throw new Error(`composition: invalid or duplicate part name ${part.name}`);
    names.add(part.name);
    if (typeof part.sourceNodeId !== 'string' || !part.sourceNodeId) throw new Error(`${part.name}: sourceNodeId required`);
    if (part.classes !== undefined && typeof part.classes !== 'string') throw new Error(`${part.name}: classes must be string`);
    if (!TAGS.has(part.tag)) throw new Error(`${part.name}: unsupported semantic tag ${part.tag}`);
    if (part.name === 'Slot' && part.slot === 'default') throw new Error('Slot: default slot conflicts with Mitosis built-in import');
    if (!['replace', 'default'].includes(part.slot)) throw new Error(`${part.name}: slot must be replace or default`);
    if (part.defaultContent !== undefined && (part.slot !== 'default' || typeof part.defaultContent !== 'string')) throw new Error(`${part.name}: defaultContent requires default slot and string`);
    for (const [name, type] of Object.entries(object(part.props || {}, `${part.name}.props`))) {
      if (!PROP.test(name) || RESERVED.has(name) || !TYPES.has(type)) throw new Error(`${part.name}: invalid public prop ${name}/${type}`);
    }
    const boundProps = new Set();
    for (const [name, value] of Object.entries(object(part.attributes || {}, `${part.name}.attributes`))) {
      if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(name) || /^on/i.test(name) || ['class', 'className', 'children', 'dangerouslySetInnerHTML', 'innerHTML', 'style'].includes(name)) throw new Error(`${part.name}: invalid native attribute ${name}`);
      if (value && typeof value === 'object') {
        keys(object(value, name), ['prop'], name);
        if (typeof value.prop !== 'string' || !own(part.props || {}, value.prop)) throw new Error(`${part.name}: undeclared attribute prop ${value.prop}`);
        boundProps.add(value.prop);
      } else if (!['string', 'boolean', 'number'].includes(typeof value) || (typeof value === 'number' && !Number.isFinite(value))) throw new Error(`${part.name}: invalid attribute value ${name}`);
    }
    for (const name of Object.keys(part.props || {})) if (!boundProps.has(name)) throw new Error(`${part.name}: public prop ${name} has no native attribute sink`);
  }
  for (const name of names) if (names.has(`${name}Props`)) throw new Error(`composition: public export collision ${name}Props`);
  if (!names.has(spec.root)) throw new Error('composition.root: missing root part');
  if (spec.examples !== undefined) {
    const examples = object(spec.examples, 'composition.examples');
    keys(examples, ['static', 'loop'], 'composition.examples');
    for (const [kind, example] of Object.entries(examples)) if (typeof example !== 'string') throw new Error(`composition.examples.${kind}: expected string`);
  }
  return spec;
}
function generateCompositionSources(root, spec, renderPart) {
  validateComposition(spec);
  const nodes = new Map();
  function visit(node) {
    if (node.id) {
      if (nodes.has(node.id)) throw new Error(`composition: duplicate source node ID ${node.id}`);
      nodes.set(node.id, node);
    }
    for (const child of node.children || []) visit(child);
  }
  visit(root);
  for (const part of spec.parts) if (!nodes.has(part.sourceNodeId)) throw new Error(`${part.name}: source node ${part.sourceNodeId} not found`);
  return Object.fromEntries(spec.parts.map(part => [part.name, renderPart(nodes.get(part.sourceNodeId), part, spec)]));
}
function readCompositionRegistry(filePath, catalog, normalizeName) {
  if (!fs.existsSync(filePath)) return catalog;
  const registry = object(JSON.parse(fs.readFileSync(filePath, 'utf8')), 'composition registry');
  const catalogNames = new Set(catalog.filter(c => c && c.name).map(c => normalizeName(c.name)));
  for (const [name, spec] of Object.entries(registry)) {
    if (!catalogNames.has(name)) throw new Error(`composition registry: unknown component ${name}`);
    validateComposition(spec, name);
  }
  return catalog.map(component => {
    const name = component.name ? normalizeName(component.name) : null;
    if (!own(registry, name)) return component;
    if (component.composition != null) throw new Error(`composition registry: conflicting inline contract for ${name}`);
    return { ...component, composition: registry[name] };
  });
}
function sourceHash(source) { return crypto.createHash('sha256').update(source).digest('hex'); }
// Removing an edited owned artifact is a conflict: preserve the file and fail
// before writing the replacement contract or sources.
function validateOwnedRemovals(outputs, keep, directory) {
  for (const output of outputs || []) {
    if (!output || typeof output.name !== 'string' || !NAME.test(output.name) || keep.has(output.name)) continue;
    const file = path.join(directory, `${output.name}.lite.tsx`);
    if (fs.existsSync(file) && output.sourceHash !== sourceHash(fs.readFileSync(file, 'utf8'))) throw new Error(`Cannot remove modified owned output ${output.name}; review or move the custom file first`);
  }
}
function pruneOwnedOutputs(outputs, keep, directory, dryRun = false) {
  validateOwnedRemovals(outputs, keep, directory);
  for (const output of outputs || []) {
    if (!output || !NAME.test(output.name) || keep.has(output.name)) continue;
    const file = path.join(directory, `${output.name}.lite.tsx`);
    if (fs.existsSync(file) && output.sourceHash === sourceHash(fs.readFileSync(file, 'utf8')) && !dryRun) fs.unlinkSync(file);
  }
}
function writeCompositionSources(directory, sources, spec) {
  validateComposition(spec);
  if (Object.keys(sources).length !== spec.parts.length || spec.parts.some(part => typeof sources[part.name] !== 'string')) throw new Error('composition: incomplete source group');
  const ownershipFile = path.join(directory, `.${spec.root}.composition.json`);
  let prior = { outputs: [] };
  if (fs.existsSync(ownershipFile)) prior = JSON.parse(fs.readFileSync(ownershipFile, 'utf8'));
  for (const name of Object.keys(sources)) {
    const file = path.join(directory, `${name}.lite.tsx`);
    if (fs.existsSync(file) && !prior.outputs.some(output => output.name === name)) throw new Error(`composition: unowned output collision ${name}`);
  }
  validateOwnedRemovals(prior.outputs, new Set(Object.keys(sources)), directory);
  fs.mkdirSync(directory, { recursive: true });
  for (const [name, source] of Object.entries(sources)) fs.writeFileSync(path.join(directory, `${name}.lite.tsx`), source, 'utf8');
  pruneOwnedOutputs(prior.outputs, new Set(Object.keys(sources)), directory);
  fs.writeFileSync(ownershipFile, JSON.stringify({ outputs: Object.entries(sources).map(([name, source]) => ({ name, sourceHash: sourceHash(source) })) }, null, 2) + '\n');
}
module.exports = { validateComposition, generateCompositionSources, readCompositionRegistry, sourceHash, validateOwnedRemovals, pruneOwnedOutputs, writeCompositionSources };

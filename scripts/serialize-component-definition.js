/** Local engineering authoring tool: compile a typed module, validate, emit property JSON. No cloud writes. */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/serialize-component-definition.js definition.ts');
const previous = require.extensions['.ts'];
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
  module._compile(output.outputText, filename);
};
try {
  const { parseDefinitions } = require('../exporter/src/components/schema.ts');
  const { generateComponentSource } = require('../exporter/src/components/ast.ts');
  const loaded = require(path.resolve(input));
  const definitions = parseDefinitions(Array.isArray(loaded.default) ? loaded.default : [loaded.default], true);
  const result = {};
  for (const definition of definitions) {
    if (!definition.designComponentId) generateComponentSource(definition);
    const { id, name, description, ...payload } = definition;
    if (Object.prototype.hasOwnProperty.call(result, id)) throw new Error(`Duplicate catalog id ${id}`);
    result[id] = JSON.stringify({ schemaVersion: 1, ...payload });
  }
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
} finally {
  if (previous) require.extensions['.ts'] = previous;
  else delete require.extensions['.ts'];
}

const fs = require('node:fs');
const path = require('node:path');
const mitosis = require('@builder.io/mitosis');

const ROOT = __dirname;
const TARGETS = {
  react: { extension: '.tsx', generate: () => mitosis.componentToReact({ typescript: true }) },
  vue: { extension: '.vue', generate: () => mitosis.componentToVue({ api: 'composition', typescript: true }) },
  vue2: { extension: '.vue', generate: () => mitosis.componentToVue({ api: 'options', defineComponent: false }) },
  svelte: { extension: '.svelte', generate: () => mitosis.componentToSvelte({ typescript: true }) },
};

// Parsing and compilation are complete before any generated artifact is touched.
function compileSources(sources, tokenCss) {
  if (!sources.length) throw new Error('No experiment source/*.lite.tsx components found');
  if (typeof tokenCss !== 'string' || !tokenCss.trim()) throw new Error('Prepared token CSS is required');
  const outputs = new Map();
  for (const [target, config] of Object.entries(TARGETS)) {
    const names = [];
    for (const { name, source } of sources) {
      if (!/^[A-Za-z_$][\w$]*$/.test(name) || names.includes(name)) throw new Error(`Invalid or duplicate component name: ${name}`);
      names.push(name);
      try {
        const component = mitosis.parseJsx(source, { typescript: true });
        const code = config.generate()({ component });
        if (typeof code !== 'string' || !code.trim()) throw new Error('Compiler emitted empty source');
        outputs.set(`${target}/${name}${config.extension}`, code);
      } catch (cause) {
        throw new Error(`Mitosis compilation failed: ${target}/${name}`, { cause });
      }
    }
    outputs.set(`${target}/index.ts`, names.map(name => `export { default as ${name} } from './${name}${target === 'react' ? '' : config.extension}';`).join('\n') + '\n');
    outputs.set(`${target}/tokens.css`, tokenCss);
  }
  return outputs;
}

function main() {
  const sourceDir = path.join(ROOT, 'source');
  const sources = fs.readdirSync(sourceDir).filter(file => file.endsWith('.lite.tsx')).sort().map(file => ({ name: file.slice(0, -'.lite.tsx'.length), source: fs.readFileSync(path.join(sourceDir, file), 'utf8') }));
  const outputs = compileSources(sources, fs.readFileSync(path.join(ROOT, 'context/tokens.css'), 'utf8'));
  const generatedDir = path.join(ROOT, 'generated');
  for (const [relative, content] of outputs) {
    const destination = path.join(generatedDir, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content);
  }
  // Remove stale compiler-owned files only after successful compilation.
  for (const [target, config] of Object.entries(TARGETS)) {
    for (const file of fs.readdirSync(path.join(generatedDir, target))) {
      if (file.endsWith(config.extension) && !outputs.has(`${target}/${file}`)) fs.unlinkSync(path.join(generatedDir, target, file));
    }
  }
  console.log(`Compiled ${sources.length} components into ${Object.keys(TARGETS).join(', ')} under experiments/llm-mitosis/generated`);
  return outputs;
}
module.exports = { main, compileSources, TARGETS };
if (require.main === module) {
  try { main(); } catch (error) { console.error(error); process.exitCode = 1; }
}

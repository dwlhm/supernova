/** Validate the exact directory selected by the Supernova GitHub importer. */
const fs = require('node:fs');
const path = require('node:path');

function validateExporterPackage(packageRoot) {
  const root = path.resolve(packageRoot);
  const readJson = (name) => {
    const filename = path.join(root, name);
    if (!fs.existsSync(filename)) throw new Error(`Missing ${name} in exporter package root ${root}`);
    try { return JSON.parse(fs.readFileSync(filename, 'utf8')); }
    catch { throw new Error(`Invalid JSON in ${filename}`); }
  };
  const manifest = readJson('exporter.json');
  readJson('config.json');
  const executable = manifest.executable;
  if (typeof executable !== 'string' || !executable || path.isAbsolute(executable) || /^[A-Za-z]:/.test(executable) || executable.split(/[\\/]/).some(part => !part || part === '.' || part === '..')) {
    throw new Error('exporter.json executable must be a safe relative file path');
  }
  const filename = path.join(root, executable);
  if (!fs.existsSync(filename) || !fs.statSync(filename).isFile() || fs.statSync(filename).size === 0) {
    throw new Error(`Missing or empty executable ${filename}; run npm run build:exporter and commit the bundled executable before refreshing Supernova`);
  }
  console.log(`Validated exporter package root: ${root}`);
  console.log(`Executable: ${executable} (${fs.statSync(filename).size} bytes)`);
  return root;
}

if (require.main === module) {
  try { validateExporterPackage(process.argv[2] || path.resolve(__dirname, '../..')); }
  catch (error) { console.error(`Exporter package validation failed: ${error.message}`); process.exitCode = 1; }
}
module.exports = { validateExporterPackage };

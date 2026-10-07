const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const dirsToClean = [
  path.join(rootDir, 'packages', 'tokens', 'src'),
  path.join(rootDir, 'packages', 'tokens', 'css'),
  path.join(rootDir, 'packages', 'react', 'src'),
  path.join(rootDir, 'packages', 'react', 'dist'),
  path.join(rootDir, 'packages', 'svelte', 'src'),
  path.join(rootDir, 'packages', 'vue', 'src'),
  path.join(rootDir, 'packages', 'vue', 'dist'),
  path.join(rootDir, 'packages', 'vue2', 'src'),
  path.join(rootDir, 'packages', 'vue2', 'dist'),
];

console.log('--- Cleaning Generated Artifacts ---');
for (const dir of dirsToClean) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Cleaned: ${path.relative(rootDir, dir)}`);
  }
}
console.log('Clean complete.\n');

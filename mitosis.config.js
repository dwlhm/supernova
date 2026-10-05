const fs = require('fs');
const path = require('path');

const REACT_BARREL = `// Auto-generated barrel file. Do not edit directly.
export { default as Button } from './Button';
export * from './Button';

export { default as Card } from './Card';
export * from './Card';

export { default as Badge } from './Badge';
export * from './Badge';

export { default as Input } from './Input';
export * from './Input';

export { default as Typography } from './Typography';
export * from './Typography';
`;

const SVELTE_AMBIENT = `declare module '*.svelte' {
  import type { ComponentType, SvelteComponent } from 'svelte';
  const component: ComponentType<SvelteComponent>;
  export default component;
}
`;

const SVELTE_BARREL = `// Auto-generated barrel file. Do not edit directly.
export { default as Button } from './Button.svelte';
export { default as Card } from './Card.svelte';
export { default as Badge } from './Badge.svelte';
export { default as Input } from './Input.svelte';
export { default as Typography } from './Typography.svelte';
`;

/**
 * Mitosis plugin to relocate output files from `packages/<target>/output/components/`
 * directly into `packages/<target>/src/`, clean up temporary directories,
 * and provide barrel index.ts exports.
 */
const moveToSrcPlugin = () => () => ({
  name: 'move-to-src-plugin',
  build: {
    post: async (targetContext, files) => {
      const target = targetContext.target;
      const targetSrcDir = path.resolve(__dirname, 'packages', target, 'src');
      if (!fs.existsSync(targetSrcDir)) {
        fs.mkdirSync(targetSrcDir, { recursive: true });
      }

      if (files && files.componentFiles) {
        for (const file of files.componentFiles) {
          const currentPath = path.resolve(file.outputDir, file.outputFilePath);
          const fileName = path.basename(file.outputFilePath);
          const destPath = path.join(targetSrcDir, fileName);
          fs.copyFileSync(currentPath, destPath);
        }
      }

      // Clean up the temporary nested output directory packages/<target>/output
      const tempOutputDir = path.resolve(__dirname, 'packages', target, 'output');
      if (fs.existsSync(tempOutputDir)) {
        fs.rmSync(tempOutputDir, { recursive: true, force: true });
      }

      // Generate barrel index.ts and necessary ambient declarations
      if (target === 'react') {
        fs.writeFileSync(path.join(targetSrcDir, 'index.ts'), REACT_BARREL, 'utf-8');
      } else if (target === 'svelte') {
        fs.writeFileSync(path.join(targetSrcDir, 'ambient.d.ts'), SVELTE_AMBIENT, 'utf-8');
        fs.writeFileSync(path.join(targetSrcDir, 'index.ts'), SVELTE_BARREL, 'utf-8');
      }
    },
  },
});

/** @type {import('@builder.io/mitosis').MitosisConfig} */
module.exports = {
  files: 'output/components/**/*.lite.tsx',
  targets: ['react', 'svelte'],
  dest: 'packages',
  commonOptions: {
    plugins: [moveToSrcPlugin()],
  },
  options: {
    react: {
      typescript: true,
    },
    svelte: {
      typescript: true,
    },
  },
};

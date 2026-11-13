import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { vue2SfcToModule, withDependents } from './framework-builds.mjs';
import { renderRegistry } from './registry.mjs';

describe('secondary framework preview builds (@komerce-design/docs)', () => {
  it('propagates a failure to every component that transitively imports it', () => {
    const sources = new Map([
      ['Badge', 'export default {}'],
      ['TableCellValue', 'import { BadgeModule } from "./Badge";'],
      ['Table', 'import TableCellValue from "./TableCellValue.vue";'],
      ['Avatar', 'import { cn } from "./utils";'],
    ]);
    const errors = withDependents(sources, { Badge: 'boom' });
    assert.deepEqual(Object.keys(errors).sort(), ['Badge', 'Table', 'TableCellValue']);
    assert.equal(errors.Table, 'Depends on TableCellValue, which failed to build.');
  });

  it('turns a Vue 2 SFC into an ES module with a render function and .js sibling imports', async () => {
    const compiler = await import('vue2/compiler-sfc');
    const sfc = `<template>\n  <Badge :label="label" />\n</template>\n\n<script lang="ts">\nimport Badge from "./Badge.vue";\nimport { cn } from "./utils";\n\nexport default {\n  name: "demo",\n  components: { Badge },\n  props: { label: { default: "" } },\n  data() {\n    return { cn };\n  },\n};\n</script>\n`;
    const code = vue2SfcToModule(sfc, 'Demo.vue', compiler);
    assert.match(code, /from "\.\/Badge\.js"/);
    assert.match(code, /from "\.\/utils"/, 'utils (exposed via data(), as Mitosis does) stays shared via the Vite resolver');
    assert.match(code, /__sfc__\.render = render;/);
    assert.match(code, /export default __sfc__;/);
    assert.throws(() => vue2SfcToModule('<template><template v-for="x in xs" :key="x"><i /></template></template>', 'Bad.vue', compiler), /cannot be keyed/);
  });

  it('registers only the framework modules that were built, plus their diagnostics', () => {
    const registry = renderRegistry({
      componentNames: ['Avatar', 'Badge'],
      exampleParents: ['Avatar'],
      metaMap: {},
      built: { vue2: new Set(['Avatar', 'Badge', 'AvatarExample']), angular: new Set(['Avatar']) },
      errors: { Badge: { angular: 'children' }, AvatarExample: { angular: 'Depends on X' } },
    });
    assert.match(registry, /'Avatar': \{ vue3: .*vue2: \(\) => import\('\.\/vue2\/Avatar\.js'\), angular: \(\) => import\('\.\/angular\/Avatar\.js'\) \}/);
    assert.match(registry, /'Badge': \{ vue3: .*vue2: \(\) => import\('\.\/vue2\/Badge\.js'\) \}/);
    assert.doesNotMatch(registry, /angular\/Badge\.js|angular\/AvatarExample\.js/);
    assert.match(registry, /export type PreviewFramework = 'vue3' \| 'react' \| 'svelte' \| 'vue2' \| 'angular';/);
    assert.match(registry, /"Badge": \{\s*"angular": "children"\s*\}/);
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { compileExamples, exampleParent, flattenExampleImports, toUsageSnippet } from './examples.mjs';

describe('composition examples (@komerce-design/docs)', () => {
  it('maps example names to their parent component', () => {
    assert.equal(exampleParent('StepperExample'), 'Stepper');
    assert.equal(exampleParent('Example'), undefined);
    assert.equal(exampleParent('Stepper'), undefined);
  });

  it('flattens component and icon imports for the flat preview directories only', () => {
    const src = `import A from '../components/A.lite';\nimport I from "../icons/I.lite";\nimport x from '../lib/x';`;
    assert.equal(flattenExampleImports(src), `import A from './A.lite';\nimport I from "./I.lite";\nimport x from '../lib/x';`);
  });

  it('turns sibling imports into one package import per framework', () => {
    const vue = `<template>\n  <Stepper><StepperItem /></Stepper>\n</template>\n\n<script setup lang="ts">\nimport Stepper from "./Stepper.vue";\nimport StepperItem from "./StepperItem.vue";\n</script>\n`;
    assert.equal(
      toUsageSnippet('vue3', vue),
      `<template>\n  <Stepper><StepperItem /></Stepper>\n</template>\n\n<script setup lang="ts">\nimport { Stepper, StepperItem } from '@komerce-design/vue3';\n</script>\n`
    );

    const react = `import * as React from "react";\nimport Stepper from "./Stepper";\n\nfunction StepperExample(props: any) {\n  return <Stepper />;\n}\n\nObject.assign(StepperExample, { Stepper });\n\nexport default StepperExample;\n`;
    const reactUsage = toUsageSnippet('react', react);
    assert.match(reactUsage, /^import \{ Stepper \} from '@komerce-design\/react';/);
    assert.doesNotMatch(reactUsage, /Object\.assign|props: any|from "\.\/Stepper"/);

    const angular = `import { Component } from "@angular/core";\nimport { StepperModule } from "./Stepper";\nimport { StepperItemModule } from "./StepperItem";\n@NgModule({\n  imports: [CommonModule, StepperModule, StepperItemModule],\n})\nexport class StepperExampleModule {}\n`;
    const angularUsage = toUsageSnippet('angular', angular);
    assert.match(angularUsage, /^import \{ StepperModule, StepperItemModule \} from '@komerce-design\/angular';/);
    assert.doesNotMatch(angularUsage, /from "\.\/Stepper/);
  });

  it('compiles only examples whose parent exists and fails loudly on broken examples', async () => {
    const written = [];
    const compileMitosis = async ({ componentName, source }) =>
      source.includes('BROKEN')
        ? { success: false, errors: [{ target: 'react', message: 'boom' }] }
        : { success: true, artifacts: ['react', 'vue2'].map((target) => ({ target, fileName: `${componentName}.${target}`, code: source })) };
    const run = (entries) =>
      compileExamples({
        compileMitosis,
        entries,
        componentNames: new Set(['Stepper']),
        readSource: async (p) => p,
        writeArtifact: async (a) => written.push(a.fileName),
      });

    const { parents, usage } = await run([
      { name: 'StepperExample', filePath: "import S from '../components/Stepper.lite';" },
      { name: 'GhostExample', filePath: 'x' },
    ]);
    assert.deepEqual(parents, ['Stepper']);
    assert.deepEqual(Object.keys(usage.Stepper).sort(), ['react', 'vue2']);
    assert.deepEqual(written, ['StepperExample.react', 'StepperExample.vue2'], 'every framework artifact is handed to the preview writer');

    await assert.rejects(run([{ name: 'StepperExample', filePath: 'BROKEN' }]), /Failed to compile example StepperExample: \[react\] boom/);
  });
});

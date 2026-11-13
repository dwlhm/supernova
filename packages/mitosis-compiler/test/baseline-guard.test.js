import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileMitosis, lintSource } from '../dist/index.js';

// Root src/ is the base every authoring run edits from; a source that fails the gate here would be re-taught to the LLM.
const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../src');

const sources = Object.fromEntries(
  ['components', 'icons', 'examples'].flatMap((group) => {
    const dir = path.join(SRC, group);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.lite.tsx'))
      .map((f) => [f.slice(0, -'.lite.tsx'.length), fs.readFileSync(path.join(dir, f), 'utf8')]);
  })
);

describe('root src/ baseline guard', () => {
  it('has baseline sources to guard', () => {
    assert.ok(Object.keys(sources).length > 40);
  });

  for (const [name, source] of Object.entries(sources)) {
    it(`${name} passes lint and type-check`, async () => {
      assert.deepStrictEqual(lintSource(source).map((e) => `${e.rule}@${e.line}: ${e.message}`), []);
      const res = await compileMitosis({ componentName: name, source, siblingSources: sources, targets: ['mitosis'], checks: { lint: false, types: true } });
      assert.deepStrictEqual(res.errors.map((e) => `${e.rule}@${e.line}: ${e.message}`), []);
    });
  }
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { compileMitosis } from '../dist/index.js';

const BADGE = `import { useDefaultProps } from '@builder.io/mitosis';
export interface BadgeProps { variant?: 'primary' | 'success'; children?: any; }
export default function Badge(props: BadgeProps) {
  useDefaultProps({ variant: 'primary' });
  return <span>{props.children}</span>;
}`;

const typeErrors = async (componentName, source, siblingSources = { Badge: BADGE }) => {
  const res = await compileMitosis({ componentName, source, siblingSources, targets: ['mitosis'], checks: { lint: false, types: true } });
  return res.success ? [] : res.errors;
};

describe('compileMitosis - types check', () => {
  it('rejects props a sibling does not declare', async () => {
    const errors = await typeErrors('Cell', `import Badge from './Badge.lite';
export default function Cell() { return <Badge label="Paid" variant="success" />; }`);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].target, 'types');
    assert.strictEqual(errors[0].line, 2);
    assert.match(errors[0].message, /Property 'label' does not exist on type 'IntrinsicAttributes & BadgeProps'/);
  });

  it('rejects members a ./utils helper does not return', async () => {
    const errors = await typeErrors('Tip', `import { createTooltipState } from './utils';
export default function Tip(props: { id?: string }) { return <span id={createTooltipState({ id: props.id }).triggerProps.id} />; }`);
    assert.ok(errors.some((e) => /triggerProps/.test(e.message)), JSON.stringify(errors));
  });

  it('accepts valid composition, including examples importing ../components', async () => {
    assert.deepStrictEqual(
      await typeErrors('BadgeExample', `import Badge from '../components/Badge.lite';
export default function BadgeExample() { return <Badge variant="success">Paid</Badge>; }`),
      []
    );
  });

  it('ignores gaps in Mitosis native element typings', async () => {
    assert.deepStrictEqual(
      await typeErrors('Head', `export default function Head() {
  return <th scope="col" data-ctrl="x"><svg viewBox="0 0 1 1"><path d="M0 0" strokeLinecap="round" /></svg></th>;
}`),
      []
    );
  });

  it('is opt-in and does not run without checks.types', async () => {
    const res = await compileMitosis({
      componentName: 'Cell',
      source: `import Badge from './Badge.lite';\nexport default function Cell() { return <Badge label="x" />; }`,
      siblingSources: { Badge: BADGE },
      targets: ['mitosis'],
      checks: { lint: false },
    });
    assert.strictEqual(res.success, true);
  });
});

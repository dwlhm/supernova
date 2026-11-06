import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { compileMitosis, lintSource, LINT_RULES } from '../dist/index.js';

const rulesOf = (source) => lintSource(source).map((e) => e.rule);

const component = (body, { props = 'className?: string; children?: any;', locals = '' } = {}) => `import { useDefaultProps, useStore, Show } from '@builder.io/mitosis';
import { cn, createTooltipState } from './utils';

export interface DemoProps { ${props} }

export default function Demo(props: DemoProps) {
  useDefaultProps({ className: '' });
  ${locals}
  return <div class={cn('flex', props.className)}>${body}</div>;
}
`;

describe('lintSource - no-children-condition rule', () => {
  it('allows rendering children and the projection guard', () => {
    const rules = rulesOf(component('{props.children}<Show when={props.children}><span>{props.children}</span></Show>'));
    assert.ok(!rules.includes(LINT_RULES.noChildrenCondition));
  });

  for (const [label, body] of [
    ['negated Show', '<Show when={!props.children}><span>fallback</span></Show>'],
    ['Show with else', '<Show when={props.children} else={<span>fallback</span>}>{props.children}</Show>'],
    ['ternary', "{props.children ? props.children : 'fallback'}"],
    ['Boolean() call', "<span class={cn(Boolean(props.children) ? 'a' : 'b')}>x</span>"],
  ]) {
    it(`flags branching on children (${label})`, () => {
      assert.ok(rulesOf(component(body)).includes(LINT_RULES.noChildrenCondition));
    });
  }
});

describe('lintSource - no-local-binding rule', () => {
  it('flags non-hook locals in the component body', () => {
    const errors = lintSource(component('<span />', { locals: 'const a11y = createTooltipState({ id: "x" });' })).filter(
      (e) => e.rule === LINT_RULES.noLocalBinding
    );
    assert.strictEqual(errors.length, 1);
    assert.match(errors[0].message, /"a11y"/);
  });

  it('allows Mitosis hook bindings', () => {
    const rules = rulesOf(component('<span />', { locals: 'const state = useStore({ open: false });' }));
    assert.ok(!rules.includes(LINT_RULES.noLocalBinding));
  });
});

describe('lintSource - single-arg-callback rule', () => {
  it('flags callbacks with more than one parameter', () => {
    const errors = lintSource(component('<span />', { props: 'onSelect?: (rowId: string, checked: boolean) => void;' })).filter(
      (e) => e.rule === LINT_RULES.singleArgCallback
    );
    assert.strictEqual(errors.length, 1);
    assert.match(errors[0].message, /"onSelect" takes 2 parameters/);
  });

  it('allows single-object and zero-argument callbacks', () => {
    const rules = rulesOf(component('<span />', { props: 'onSelect?: (e: { rowId: string; checked: boolean }) => void; onClose?: () => void;' }));
    assert.ok(!rules.includes(LINT_RULES.singleArgCallback));
  });
});

describe('Angular projection guard', () => {
  it('unwraps <Show when={props.children}> into plain content projection', async () => {
    const res = await compileMitosis({
      componentName: 'Demo',
      source: component('<Show when={props.children}>{props.children}</Show>'),
      targets: ['angular'],
      checks: { lint: false },
    });
    const code = res.artifacts.find((a) => a.target === 'angular').code;
    assert.match(code, /<ng-content><\/ng-content>/);
    assert.doesNotMatch(code, /\*ngIf="children"/);
  });
});

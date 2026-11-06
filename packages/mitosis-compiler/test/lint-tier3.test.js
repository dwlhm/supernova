import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { lintSource, LINT_RULES } from '../dist/index.js';

const rulesOf = (source) => lintSource(source).map((e) => e.rule);

const component = (body, defaults = "className: ''") => `import { useDefaultProps, For, Show } from '@builder.io/mitosis';
import { cn, getStepperStepState } from './utils';

export default function Stepper(props: StepperProps) {
  useDefaultProps({ ${defaults} });
  return (
    <ol class={cn('flex', props.className)}>
      ${body}
    </ol>
  );
}
`;

describe('lintSource - tier3-max-lines rule', () => {
  it('flags components over 80 non-blank lines', () => {
    const body = Array.from({ length: 80 }, (_, i) => `<li>${i}</li>`).join('\n');
    const errors = lintSource(component(body)).filter((e) => e.rule === LINT_RULES.tier3MaxLines);
    assert.strictEqual(errors.length, 1);
    assert.match(errors[0].message, /non-blank lines \(max 80\)/);
  });

  it('ignores blank lines when counting', () => {
    const body = Array.from({ length: 60 }, () => '\n\n').join('');
    assert.ok(!rulesOf(component(body)).includes(LINT_RULES.tier3MaxLines));
  });
});

describe('lintSource - no-fixture-defaults rule', () => {
  it('flags non-empty array defaults', () => {
    const errors = lintSource(component('', "steps: ['Cart', 'Shipping']")).filter(
      (e) => e.rule === LINT_RULES.noFixtureDefaults
    );
    assert.strictEqual(errors.length, 1);
    assert.match(errors[0].message, /"steps"/);
  });

  it('flags non-empty object defaults', () => {
    assert.ok(rulesOf(component('', "user: { name: 'Budi' }")).includes(LINT_RULES.noFixtureDefaults));
  });

  it('allows empty arrays, empty objects and scalar defaults', () => {
    const rules = rulesOf(component('', "steps: [], meta: {}, orientation: 'horizontal', current: 1"));
    assert.ok(!rules.includes(LINT_RULES.noFixtureDefaults));
  });
});

describe('lintSource - no-dual-mode-list rule', () => {
  it('flags children combined with <For each={props.X}>', () => {
    const body = `<Show when={props.children}>{props.children}</Show>
      <Show when={!props.children}><For each={props.steps}>{(step) => <li>{step}</li>}</For></Show>`;
    const errors = lintSource(component(body)).filter((e) => e.rule === LINT_RULES.noDualModeList);
    assert.strictEqual(errors.length, 1);
    assert.match(errors[0].message, /props\.steps/);
  });

  it('allows data-driven loops in components without children', () => {
    const body = `<For each={props.data}>{(point) => <li>{point.label}</li>}</For>`;
    assert.ok(!rulesOf(component(body)).includes(LINT_RULES.noDualModeList));
  });

  it('allows children with loops over derived state', () => {
    const body = `<Show when={props.children}>{props.children}</Show>
      <For each={getStepperStepState(0, 1, 2).items}>{(item) => <li>{item}</li>}</For>`;
    assert.ok(!rulesOf(component(body)).includes(LINT_RULES.noDualModeList));
  });
});

describe('lintSource - no-repeated-item-state rule', () => {
  it('flags per-item state helpers recomputed inside one <For> item', () => {
    const body = `<For each={props.steps}>{(step, index) => (
        <li class={getStepperStepState(index, props.current, 3).stepKey}>
          {getStepperStepState(index, props.current, 3).isCurrent ? step : ''}
        </li>
      )}</For>`;
    const errors = lintSource(component(body)).filter((e) => e.rule === LINT_RULES.noRepeatedItemState);
    assert.strictEqual(errors.length, 1);
    assert.match(errors[0].message, /recomputed 2 times/);
  });

  it('allows loop-invariant helpers repeated inside <For>', () => {
    const body = `<For each={props.steps}>{(step) => (
        <li class={getStepperStepState(0, props.current, 3).stepKey}>
          {getStepperStepState(0, props.current, 3).isCurrent ? step : ''}
        </li>
      )}</For>`;
    assert.ok(!rulesOf(component(body)).includes(LINT_RULES.noRepeatedItemState));
  });

  it('allows a single per-item helper call', () => {
    const body = `<For each={props.steps}>{(step, index) => <li class={getStepperStepState(index, 1, 3).stepKey}>{step}</li>}</For>`;
    assert.ok(!rulesOf(component(body)).includes(LINT_RULES.noRepeatedItemState));
  });
});

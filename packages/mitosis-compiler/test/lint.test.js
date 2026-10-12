import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  compileMitosis,
  lintSource,
  isColorUtility,
  normalizeClass,
  checkClasses,
  LINT_RULES,
} from '../dist/index.js';

describe('lintSource - no-any rule', () => {
  it('flags : any type annotation', () => {
    const errors = lintSource('export interface Props { value: any; }');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].rule, 'no-any');
    assert.strictEqual(errors[0].target, 'lint');
  });

  it('flags as any type assertion', () => {
    const errors = lintSource('const x = (foo as any).bar;');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].rule, 'no-any');
  });

  it('flags any[] array type', () => {
    const errors = lintSource('const items: any[] = [];');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].rule, 'no-any');
  });

  it('flags Record<string, any> generic parameter', () => {
    const errors = lintSource('type Data = Record<string, any>;');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].rule, 'no-any');
  });

  it('allows children?: any in component props interface', () => {
    const errors = lintSource(`
      export interface Props {
        children?: any;
      }
    `);
    assert.strictEqual(errors.length, 0);
  });

  it('ignores any in comments', () => {
    const errors = lintSource(`
      // any comment describing something
      /* any multiline
         comment */
      export interface Props {
        title: string;
      }
    `);
    assert.strictEqual(errors.length, 0);
  });
});

describe('lintSource - no-color-literal rule', () => {
  it('flags hex color literal #ff0000', () => {
    const errors = lintSource('const color = "#ff0000";');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].rule, 'no-color-literal');
  });

  it('flags rgb() color function', () => {
    const errors = lintSource('const color = "rgb(255, 0, 0)";');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].rule, 'no-color-literal');
  });

  it('flags conic-gradient() function', () => {
    const errors = lintSource('const bg = "conic-gradient(red, blue)";');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].rule, 'no-color-literal');
    assert.ok(errors[0].message.includes('conic-gradient'));
  });

  it('does not flag href="#" in JSX anchor', () => {
    const errors = lintSource('<a href="#">Home</a>');
    assert.strictEqual(errors.length, 0);
  });
});

describe('lintSource - no-arbitrary-color-class rule', () => {
  it('flags bg-[#123456]', () => {
    const errors = lintSource('<div className="bg-[#123456]" />');
    assert.ok(errors.some((e) => e.rule === 'no-arbitrary-color-class'));
  });
});

describe('lintSource - no-jsx-prop-value rule', () => {
  it('fails on legend={<ChartLegend items={items} />}', () => {
    const errors = lintSource('<Chart legend={<ChartLegend items={items} />} />');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].rule, LINT_RULES.noJsxPropValue);
    assert.strictEqual(errors[0].target, 'lint');
    assert.ok(errors[0].message.includes('legend'));
  });

  it('passes on <Show when={x} else={<Fallback />}>', () => {
    const errors = lintSource('<Show when={x} else={<Fallback />}><div>Content</div></Show>');
    assert.strictEqual(errors.length, 0);
  });

  it('passes on children={<Fallback />}', () => {
    const errors = lintSource('<Container children={<Fallback />} />');
    assert.strictEqual(errors.length, 0);
  });
});

describe('lintSource - no-prop-shadow rule', () => {
  it('fails on const values = props.values || [];', () => {
    const errors = lintSource('const values = props.values || [];');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].rule, LINT_RULES.noPropShadow);
    assert.strictEqual(errors[0].target, 'lint');
    assert.ok(errors[0].message.includes('values'));
  });

  it('passes on const items = props.values || [];', () => {
    const errors = lintSource('const items = props.values || [];');
    assert.strictEqual(errors.length, 0);
  });
});

describe('lintSource - no-onchange-text-input rule', () => {
  it('fails on <input type="text" onChange={(e) => ...} />', () => {
    const errors = lintSource('<input type="text" onChange={(e) => {}} />');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].rule, LINT_RULES.noOnChangeTextInput);
    assert.strictEqual(errors[0].target, 'lint');
  });

  it('fails on <input placeholder="name" onChange={(e) => ...} /> (default type is text)', () => {
    const errors = lintSource('<input placeholder="name" onChange={(e) => {}} />');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].rule, LINT_RULES.noOnChangeTextInput);
    assert.strictEqual(errors[0].target, 'lint');
  });

  it('fails on <textarea onChange={(e) => ...} />', () => {
    const errors = lintSource('<textarea onChange={(e) => {}} />');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].rule, LINT_RULES.noOnChangeTextInput);
    assert.strictEqual(errors[0].target, 'lint');
  });

  it('passes on <input type="checkbox" onChange={(e) => ...} />', () => {
    const errors = lintSource('<input type="checkbox" onChange={(e) => {}} />');
    assert.strictEqual(errors.length, 0);
  });

  it('passes on <input type="file" onChange={(e) => ...} />', () => {
    const errors = lintSource('<input type="file" onChange={(e) => {}} />');
    assert.strictEqual(errors.length, 0);
  });

  it('passes on <select onChange={(e) => ...}>', () => {
    const errors = lintSource('<select onChange={(e) => {}}><option value="1">1</option></select>');
    assert.strictEqual(errors.length, 0);
  });

  it('passes on <input type="text" onInput={(e) => ...} />', () => {
    const errors = lintSource('<input type="text" onInput={(e) => {}} />');
    assert.strictEqual(errors.length, 0);
  });
});

describe('compileMitosis lint integration', () => {
  const SOURCE_WITH_ANY = `
    export interface BadProps {
      data: any;
    }
    export default function Bad(props: BadProps) {
      return <div>{props.data}</div>;
    }
  `;

  it('fails with lint error by default when source contains any', async () => {
    const response = await compileMitosis({
      componentName: 'Bad',
      source: SOURCE_WITH_ANY,
    });
    assert.strictEqual(response.success, false);
    assert.strictEqual(response.artifacts.length, 0);
    assert.ok(response.errors.some((e) => e.rule === 'no-any'));
  });

  it('succeeds when checks: { lint: false }', async () => {
    const response = await compileMitosis({
      componentName: 'Bad',
      source: SOURCE_WITH_ANY,
      checks: { lint: false },
    });
    assert.strictEqual(response.success, true);
    assert.strictEqual(response.errors.length, 0);
    assert.strictEqual(response.artifacts.length, 1);
  });
});

describe('normalizeClass & isColorUtility', () => {
  it('normalizes variant prefixes and opacity modifiers', () => {
    assert.strictEqual(normalizeClass('hover:bg-primary-hover'), 'bg-primary-hover');
    assert.strictEqual(normalizeClass('bg-primary-default/50'), 'bg-primary-default');
    assert.strictEqual(
      normalizeClass('data-[state=open]:focus-visible:ring-focus-ring-primary'),
      'ring-focus-ring-primary'
    );
    assert.strictEqual(normalizeClass('!bg-primary-default'), 'bg-primary-default');
  });

  it('correctly classifies color vs non-color utilities', () => {
    assert.strictEqual(isColorUtility('text-sm'), false);
    assert.strictEqual(isColorUtility('text-foreground-default'), true);
    assert.strictEqual(isColorUtility('hover:bg-primary-hover'), true);
    assert.strictEqual(isColorUtility('bg-primary-default/50'), true);
    assert.strictEqual(isColorUtility('ring-2'), false);
    assert.strictEqual(isColorUtility('ring-offset-2'), false);
    assert.strictEqual(isColorUtility('border-t'), false);
    assert.strictEqual(isColorUtility('border-t-2'), false);
    assert.strictEqual(isColorUtility('bg-transparent'), false);
    assert.strictEqual(isColorUtility('shadow-lg'), false);
    assert.strictEqual(isColorUtility('stroke-2'), false);
    assert.strictEqual(isColorUtility('fill-chart-series-1'), true);
  });
});

describe('checkClasses', () => {
  it('flags disallowed color utility not in allowed set', () => {
    const errors = checkClasses(['bg-background-neutral'], ['bg-background-default']);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].target, 'render');
    assert.strictEqual(errors[0].rule, 'unknown-class');
    assert.strictEqual(errors[0].message, 'Unknown class "bg-background-neutral".');
  });

  it('passes allowed color utility matching normalized form', () => {
    const errors = checkClasses(
      ['focus-visible:ring-focus-ring-primary'],
      ['ring-focus-ring-primary']
    );
    assert.strictEqual(errors.length, 0);
  });

  it('ignores non-color utilities even if not in allowed set', () => {
    const errors = checkClasses(['text-sm', 'p-4', 'flex'], ['bg-background-default']);
    assert.strictEqual(errors.length, 0);
  });
});

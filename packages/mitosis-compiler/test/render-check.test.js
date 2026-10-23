import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { compileMitosis, renderCheck } from '../dist/index.js';

describe('renderCheck - variant-identical', () => {
  it('fails when different union variant values render identical markup', async () => {
    const source = `
      export interface ChartBarProps {
        type?: 'Bar' | 'Stacked Bar';
      }

      export default function ChartBar(props: ChartBarProps) {
        return (
          <div>
            <span>Static Bar</span>
          </div>
        );
      }
    `;

    const response = await compileMitosis({
      componentName: 'ChartBar',
      source,
      checks: { render: true },
    });

    assert.strictEqual(response.success, false);
    const err = response.errors.find((e) => e.rule === 'variant-identical');
    assert.ok(err, 'Expected error with rule "variant-identical"');
    assert.ok(
      err.message.includes('type'),
      `Expected error message to mention "type", got: ${err.message}`
    );
    assert.ok(
      err.message.includes("'Bar', 'Stacked Bar'"),
      `Expected error message to mention "'Bar', 'Stacked Bar'", got: ${err.message}`
    );
  });
});

describe('renderCheck - data-ignored', () => {
  it('fails when component ignores array data and renders identical markup', async () => {
    const source = `
      export interface ChartDatum {
        label: string;
        value: number;
      }

      export interface ChartRevenueProps {
        data?: ChartDatum[];
      }

      export default function ChartRevenue(props: ChartRevenueProps) {
        return (
          <div>
            <span>Revenue</span>
          </div>
        );
      }
    `;

    const response = await compileMitosis({
      componentName: 'ChartRevenue',
      source,
      checks: { render: true },
    });

    assert.strictEqual(response.success, false);
    const err = response.errors.find((e) => e.rule === 'data-ignored');
    assert.ok(err, 'Expected error with rule "data-ignored"');
    assert.ok(
      err.message.includes('data'),
      `Expected error message to mention "data", got: ${err.message}`
    );
  });
});

describe('renderCheck - unknown-class', () => {
  it('fails when component uses class not in allowedClasses', async () => {
    const source = `
      export default function UnknownClassChart() {
        return (
          <div class="bg-background-neutral">
            <span>Unknown class test</span>
          </div>
        );
      }
    `;

    const response = await compileMitosis({
      componentName: 'UnknownClassChart',
      source,
      checks: { render: true },
      allowedClasses: ['bg-background-default'],
    });

    assert.strictEqual(response.success, false);
    const err = response.errors.find((e) => e.rule === 'unknown-class');
    assert.ok(err, 'Expected error with rule "unknown-class"');
    assert.ok(
      err.message.includes('bg-background-neutral'),
      `Expected error message to mention "bg-background-neutral", got: ${err.message}`
    );
  });
});

describe('renderCheck - fully compliant data-driven component', () => {
  it('passes when variants produce distinct allowed classes, data is consumed via For, and empty data handled', async () => {
    const source = `
      import { For, Show } from '@builder.io/mitosis';

      export interface ChartDatum {
        label: string;
        value: number;
      }

      export interface MetricChartProps {
        variant?: 'solid' | 'outline';
        data?: ChartDatum[];
      }

      export default function MetricChart(props: MetricChartProps) {
        return (
          <div
            class={
              props.variant === 'outline'
                ? 'border-primary-default text-foreground-default'
                : 'bg-primary-default text-foreground-default'
            }
          >
            <Show when={props.data && props.data.length > 0}>
              <For each={props.data}>
                {(item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                )}
              </For>
            </Show>
            <Show when={!props.data || props.data.length === 0}>
              <span>Empty</span>
            </Show>
          </div>
        );
      }
    `;

    const response = await compileMitosis({
      componentName: 'MetricChart',
      source,
      checks: { render: true },
      allowedClasses: [
        'bg-primary-default',
        'border-primary-default',
        'text-foreground-default',
      ],
    });

    assert.strictEqual(response.success, true);
    assert.deepStrictEqual(response.errors, []);
  });
});

describe('renderCheck - sibling resolution', () => {
  it('resolves sibling components passed via siblingSources', async () => {
    const childSource = `
      export interface ChildProps {
        title?: string;
      }

      export default function Child(props: ChildProps) {
        return <span>{props.title || 'Child Default'}</span>;
      }
    `;

    const parentSource = `
      import Child from './Child.lite';

      export default function Parent() {
        return (
          <div>
            <Child title="From Parent" />
          </div>
        );
      }
    `;

    const response = await compileMitosis({
      componentName: 'Parent',
      source: parentSource,
      siblingSources: {
        Child: childSource,
      },
      checks: { render: true },
    });

    assert.strictEqual(response.success, true);
    assert.deepStrictEqual(response.errors, []);
  });
});

describe('renderCheck - render-crash', () => {
  it('catches render-crash when getter accesses props.data[0].value without bounds check', async () => {
    const source = `
      import { useStore } from '@builder.io/mitosis';

      export interface ChartDatum {
        label: string;
        value: number;
      }

      export interface CrashChartProps {
        data?: ChartDatum[];
      }

      export default function CrashChart(props: CrashChartProps) {
        const state = useStore({
          get formattedFirst() {
            return props.data[0].value.toFixed(2);
          },
        });

        return (
          <div>
            <span>{state.formattedFirst}</span>
          </div>
        );
      }
    `;

    const response = await compileMitosis({
      componentName: 'CrashChart',
      source,
      checks: { render: true },
    });

    assert.strictEqual(response.success, false);
    const err = response.errors.find((e) => e.rule === 'render-crash');
    assert.ok(err, 'Expected error with rule "render-crash"');
    assert.ok(
      err.message.includes('data'),
      `Expected error message to mention prop "data", got: ${err.message}`
    );
  });
});

describe("renderCheck - worker_threads timeout & sandboxing", () => {
  it("terminates infinite loops gracefully via timeout", async () => {
    const infiniteLoopSource = `
      export default function HangComp() {
        return (
          <div>
            {(() => {
              while (true) {}
              return "stuck";
            })()}
          </div>
        );
      }
    `;
    const errors = await renderCheck({
      componentName: "HangComp",
      source: infiniteLoopSource,
    }, 1000);
    const timeoutErr = errors.find((e) => e.rule === "render-timeout");
    assert.ok(timeoutErr, "Expected render-timeout error");
    assert.match(timeoutErr.message, /timed out/);
  });
});

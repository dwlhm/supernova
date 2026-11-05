import { checkClasses } from './classes.js';
import { extractPropsInfo } from './render-props.js';
import {
  KnownRenderError,
  React,
  ReactDomServer,
  loadRenderedComponent,
} from './render-loader.js';
import type { CompileError } from './types.js';

export * from './utils-headless.js';
export * from './utils-chart.js';

const { renderToStaticMarkup } = ReactDomServer;

export interface RenderCheckOptions {
  componentName: string;
  source: string;
  siblingSources?: Record<string, string>;
  allowedClasses?: string[];
}

export async function renderCheckCore(opts: RenderCheckOptions): Promise<CompileError[]> {
  const errors: CompileError[] = [];

  try {
    const Component = await loadRenderedComponent(
      opts.componentName,
      opts.source,
      opts.siblingSources,
      errors
    );
    if (typeof Component !== 'function') {
      errors.push({
        target: 'render',
        rule: 'render-crash',
        message: 'Component default export is not a function or component.',
      });
      return errors;
    }

    const { unionProps, synthesizableArrayProps } = extractPropsInfo(
      opts.source,
      opts.componentName
    );
    const baseProps: Record<string, any> = {};
    for (const prop of synthesizableArrayProps) {
      baseProps[prop.name] = prop.fixtureA;
    }

    const generatedHtmls: string[] = [];
    let baseHtml: string | null = null;
    try {
      const rendered = renderToStaticMarkup(React.createElement(Component, baseProps));
      baseHtml = rendered;
      generatedHtmls.push(rendered);
    } catch (err: unknown) {
      errors.push({ target: 'render', rule: 'render-crash', message: String(err) });
    }

    for (const prop of synthesizableArrayProps) {
      try {
        const emptyHtml = renderToStaticMarkup(
          React.createElement(Component, { ...baseProps, [prop.name]: [] })
        );
        generatedHtmls.push(emptyHtml);
      } catch (err: any) {
        errors.push({
          target: 'render',
          rule: 'render-crash',
          message: `Component crashed when rendering with empty array for prop "${prop.name}": ${err?.message || String(err)}`,
        });
      }
    }

    for (const unionProp of unionProps) {
      if (unionProp.values.length < 2) continue;
      const htmlToOptions = new Map<string, string[]>();
      for (const option of unionProp.values) {
        try {
          const html = renderToStaticMarkup(
            React.createElement(Component, { ...baseProps, [unionProp.name]: option })
          );
          generatedHtmls.push(html);
          const group = htmlToOptions.get(html) || [];
          group.push(option);
          htmlToOptions.set(html, group);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          errors.push({
            target: 'render',
            rule: 'render-crash',
            message: `Component crashed when rendering with prop "${unionProp.name}" = "${option}": ${message}`,
          });
        }
      }

      for (const [, identicalOptions] of htmlToOptions) {
        if (identicalOptions.length >= 2) {
          errors.push({
            target: 'render',
            rule: 'variant-identical',
            message: `Prop "${unionProp.name}": ${identicalOptions.map((o) => `'${o}'`).join(', ')} render identical markup — variant not implemented`,
          });
        }
      }
    }

    if (baseHtml !== null) {
      for (const prop of synthesizableArrayProps) {
        try {
          const htmlB = renderToStaticMarkup(
            React.createElement(Component, { ...baseProps, [prop.name]: prop.fixtureB })
          );
          generatedHtmls.push(htmlB);
          if (htmlB === baseHtml) {
            errors.push({
              target: 'render',
              rule: 'data-ignored',
              message: `Prop "${prop.name}" is ignored by renderer (different data produces identical markup)`,
            });
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          errors.push({
            target: 'render',
            rule: 'render-crash',
            message: `Component crashed when rendering with Fixture B for prop "${prop.name}": ${message}`,
          });
        }
      }
    }

    if (opts.allowedClasses && opts.allowedClasses.length > 0) {
      const classAttrRegex = /\b(?:class|className)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
      const allTokens: string[] = [];
      for (const html of generatedHtmls) {
        let match: RegExpExecArray | null;
        while ((match = classAttrRegex.exec(html)) !== null) {
          const classStr = match[1] ?? match[2] ?? '';
          allTokens.push(...classStr.trim().split(/\s+/).filter(Boolean));
        }
      }
      errors.push(...checkClasses(allTokens, opts.allowedClasses));
    }
  } catch (err: unknown) {
    if (err instanceof KnownRenderError) return errors;
    errors.push({ target: 'render', rule: 'render-harness', message: String(err) });
  }

  return errors;
}

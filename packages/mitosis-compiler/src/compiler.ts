import * as mitosisModule from '@builder.io/mitosis';
import { lintSource } from './lint.js';
import { renderCheck } from './render-check.js';
import { validateArtifact } from './validate.js';
import { normalizeMitosisSource } from './normalize.js';
import { adaptReactOutput } from './adapter-react.js';
import { adaptVue3Output } from './adapter-vue3.js';
import { adaptSvelteOutput } from './adapter-svelte.js';
import { adaptVue2Output } from './adapter-vue2.js';
import { adaptAngularOutput } from './adapter-angular.js';
import { COMPONENT_NAME_PATTERN, isValidComponentName } from './names.js';
import type {
  CompileError,
  CompileRequest,
  CompileResponse,
  CompiledArtifact,
  TargetFramework,
} from './types.js';

const mitosis = (mitosisModule as any).default ?? mitosisModule;
const parseJsx = mitosis.parseJsx ?? mitosisModule.parseJsx;
const componentToReact = mitosis.componentToReact ?? mitosisModule.componentToReact;
const componentToSvelte = mitosis.componentToSvelte ?? mitosisModule.componentToSvelte;
const componentToVue = mitosis.componentToVue ?? mitosisModule.componentToVue;
const componentToAngular = mitosis.componentToAngular ?? mitosisModule.componentToAngular;

const ALL_TARGETS: TargetFramework[] = ['mitosis'];

const SVG_CAMEL_TO_KEBAB: Record<string, string> = {
  strokeWidth: 'stroke-width',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  strokeDasharray: 'stroke-dasharray',
  strokeDashoffset: 'stroke-dashoffset',
  strokeMiterlimit: 'stroke-miterlimit',
  strokeOpacity: 'stroke-opacity',
  fillRule: 'fill-rule',
  fillOpacity: 'fill-opacity',
  clipRule: 'clip-rule',
  clipPath: 'clip-path',
  stopColor: 'stop-color',
  stopOpacity: 'stop-opacity',
  textAnchor: 'text-anchor',
  dominantBaseline: 'dominant-baseline',
  vectorEffect: 'vector-effect',
};

const SVG_KEBAB_TO_CAMEL: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(SVG_CAMEL_TO_KEBAB).map(([camel, kebab]) => [kebab, camel])
  ),
  maxlength: 'maxLength',
  minlength: 'minLength',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  autocomplete: 'autoComplete',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
};

function transformAstAttrs(node: any, attrMap: Record<string, string>) {
  if (!node || typeof node !== 'object') return;
  if (node['@type'] === '@builder.io/mitosis/node') {
    for (const [fromAttr, toAttr] of Object.entries(attrMap)) {
      if (node.properties && fromAttr in node.properties) {
        node.properties[toAttr] = node.properties[fromAttr];
        delete node.properties[fromAttr];
      }
      if (node.bindings && fromAttr in node.bindings) {
        node.bindings[toAttr] = node.bindings[fromAttr];
        delete node.bindings[fromAttr];
      }
    }
  }
  for (const val of Object.values(node)) {
    if (Array.isArray(val)) val.forEach((child) => transformAstAttrs(child, attrMap));
    else if (val && typeof val === 'object') transformAstAttrs(val, attrMap);
  }
}

function createSvgAttrPlugin(attrMap: Record<string, string>) {
  const runPre = (json: any) => {
    transformAstAttrs(json, attrMap);
    return json;
  };
  const plugin = () => ({ json: { pre: runPre } });
  plugin.json = { pre: runPre };
  return plugin as any;
}

const svgKebabPlugin = () => createSvgAttrPlugin(SVG_CAMEL_TO_KEBAB);

function cloneAst<T>(ast: T): T {
  return JSON.parse(JSON.stringify(ast));
}

export async function compileMitosis(req: CompileRequest): Promise<CompileResponse> {
  const targets: TargetFramework[] =
    req?.targets && req.targets.length > 0 ? req.targets : ALL_TARGETS;
  const effectiveSource = req?.normalize
    ? normalizeMitosisSource(req.source, req.componentName)
    : req.source;

  let parsed: any;
  try {
    parsed = parseJsx(effectiveSource, { typescript: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      artifacts: [],
      errors: [{ target: 'mitosis', message }],
    };
  }

  const componentName = req.componentName || parsed?.name || 'Component';
  if (!isValidComponentName(componentName)) {
    return {
      success: false,
      artifacts: [],
      errors: [
        {
          target: 'mitosis',
          message: `Invalid component name "${componentName}": must match ${COMPONENT_NAME_PATTERN}`,
        },
      ],
    };
  }
  const artifacts: CompiledArtifact[] = [];
  const errors: CompileError[] = [];

  if (req.checks?.lint !== false) {
    const lintErrors = lintSource(effectiveSource);
    if (lintErrors.length > 0) {
      errors.push(...lintErrors);
      return {
        success: false,
        artifacts: [],
        errors,
      };
    }
  }

  if (req.checks?.render === true) {
    const renderErrors = await renderCheck({
      componentName,
      source: effectiveSource,
      siblingSources: req.siblingSources,
      allowedClasses: req.allowedClasses,
    });
    errors.push(...renderErrors);
    if (renderErrors.length > 0) {
      return {
        success: false,
        artifacts: [],
        errors,
      };
    }
  }

  for (const target of targets) {
    try {
      const component = cloneAst(parsed);
      if (componentName) {
        component.name = componentName;
      }

      let code = '';
      let fileName = '';

      switch (target) {
        case 'mitosis': {
          code = effectiveSource;
          fileName = `${componentName}.lite.tsx`;
          break;
        }
        case 'react': {
          transformAstAttrs(component, SVG_KEBAB_TO_CAMEL);
          const generator = componentToReact({ typescript: true });
          const res = generator({ component });
          const rawReact = typeof res === 'string' ? res : await res;
          code = adaptReactOutput(rawReact);
          fileName = `${componentName}.tsx`;
          break;
        }
        case 'svelte': {
          const generator = componentToSvelte({ typescript: true, plugins: [svgKebabPlugin()] });
          const res = generator({ component });
          const rawSvelte = typeof res === 'string' ? res : await res;
          code = adaptSvelteOutput(rawSvelte, effectiveSource);
          fileName = `${componentName}.svelte`;
          break;
        }
        case 'vue3': {
          const generator = componentToVue({ api: 'composition', typescript: true, plugins: [svgKebabPlugin()] });
          const res = generator({ component });
          const rawVue3 = typeof res === 'string' ? res : await res;
          code = adaptVue3Output(rawVue3, effectiveSource);
          fileName = `${componentName}.vue`;
          break;
        }
        case 'vue2': {
          const generator = componentToVue({ api: 'options', defineComponent: false, typescript: true, plugins: [svgKebabPlugin()] });
          const res = generator({ component });
          const rawVue2 = typeof res === 'string' ? res : await res;
          code = adaptVue2Output(rawVue2, effectiveSource);
          fileName = `${componentName}.vue`;
          break;
        }
        case 'angular': {
          const generator = componentToAngular({ typescript: true, plugins: [svgKebabPlugin()] });
          const res = generator({ component });
          const rawAngular = typeof res === 'string' ? res : await res;
          code = adaptAngularOutput(rawAngular, effectiveSource);
          fileName = `${componentName}.ts`;
          break;
        }
        default: {
          errors.push({
            target,
            message: `Unsupported target framework: ${String(target)}`,
          });
          continue;
        }
      }

      const art: CompiledArtifact = {
        target,
        fileName,
        code,
      };
      artifacts.push(art);

      if (req.checks?.targets !== false) {
        const valErrors = await validateArtifact(art);
        if (valErrors.length > 0) {
          errors.push(...valErrors);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({
        target,
        message,
      });
    }
  }

  return {
    success: errors.length === 0,
    artifacts,
    errors,
  };
}

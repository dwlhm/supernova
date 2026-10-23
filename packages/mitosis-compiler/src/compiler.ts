import * as mitosisModule from '@builder.io/mitosis';
import { lintSource } from './lint.js';
import { renderCheck } from './render-check.js';
import { validateArtifact } from './validate.js';
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
};

function svgKebabPlugin() {
  const walk = (node: any) => {
    if (!node || typeof node !== 'object') return;
    if (node['@type'] === '@builder.io/mitosis/node') {
      for (const [camel, kebab] of Object.entries(SVG_CAMEL_TO_KEBAB)) {
        if (node.properties && camel in node.properties) {
          node.properties[kebab] = node.properties[camel];
          delete node.properties[camel];
        }
        if (node.bindings && camel in node.bindings) {
          node.bindings[kebab] = node.bindings[camel];
          delete node.bindings[camel];
        }
      }
    }
    for (const val of Object.values(node)) {
      if (Array.isArray(val)) {
        val.forEach(walk);
      } else if (val && typeof val === 'object') {
        walk(val);
      }
    }
  };
  const plugin = () => ({
    json: {
      pre: (json: any) => {
        walk(json);
        return json;
      },
    },
  });
  plugin.json = {
    pre: (json: any) => {
      walk(json);
      return json;
    },
  };
  return plugin as any;
}

function cloneAst<T>(ast: T): T {
  return JSON.parse(JSON.stringify(ast));
}

export async function compileMitosis(req: CompileRequest): Promise<CompileResponse> {
  const targets: TargetFramework[] =
    req?.targets && req.targets.length > 0 ? req.targets : ALL_TARGETS;

  let parsed: any;
  try {
    parsed = parseJsx(req.source, { typescript: true });
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
    const lintErrors = lintSource(req.source);
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
      source: req.source,
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
          code = req.source;
          fileName = `${componentName}.lite.tsx`;
          break;
        }
        case 'react': {
          const generator = componentToReact({ typescript: true });
          const res = generator({ component });
          code = typeof res === 'string' ? res : await res;
          fileName = `${componentName}.tsx`;
          break;
        }
        case 'svelte': {
          const generator = componentToSvelte({ typescript: true, plugins: [svgKebabPlugin()] });
          const res = generator({ component });
          code = typeof res === 'string' ? res : await res;
          fileName = `${componentName}.svelte`;
          break;
        }
        case 'vue3': {
          const generator = componentToVue({ api: 'composition', typescript: true, plugins: [svgKebabPlugin()] });
          const res = generator({ component });
          code = typeof res === 'string' ? res : await res;
          fileName = `${componentName}.vue`;
          break;
        }
        case 'vue2': {
          const generator = componentToVue({ api: 'options', defineComponent: false, typescript: true, plugins: [svgKebabPlugin()] });
          const res = generator({ component });
          code = typeof res === 'string' ? res : await res;
          fileName = `${componentName}.vue`;
          break;
        }
        case 'angular': {
          const generator = componentToAngular({ typescript: true, plugins: [svgKebabPlugin()] });
          const res = generator({ component });
          code = typeof res === 'string' ? res : await res;
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

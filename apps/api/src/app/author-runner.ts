import {
  runAuthorAgent,
  type DiscoveredToken,
} from '@komerce-design/mitosis-author';
import {
  compileMitosis,
  type TargetFramework,
} from '@komerce-design/mitosis-compiler';
import {
  normalizeComponentName,
  type CompiledArtifact,
  type FigmaComponentSpec,
  type FigmaToken,
  type Framework,
} from '../domain/models.js';

export interface AuthorRequest {
  componentName?: string;
  components?: FigmaComponentSpec[];
  tokens?: FigmaToken[];
  tokenClasses?: string[];
  existingSource?: string;
  /** Sources of sibling components by name, used to resolve imports during the quality gate. */
  siblingSources?: Record<string, string>;
  /** Siblings from the previous failed attempt, so a repair edits them instead of rewriting them blind. */
  siblingDrafts?: Record<string, string>;
  repairErrors?: string[];
  feedbackNotes?: string;
  existingComponentNames?: string[];
  workspaceDir?: string;
  targets?: Framework[];
  compileOnly?: boolean;
}

export interface AuthorResult {
  components: Record<string, string>;
  componentGroups: Record<string, string>;
  artifacts: CompiledArtifact[];
  newTokens: DiscoveredToken[];
}

export interface MitosisAuthor {
  authorDesignSystem(req: AuthorRequest): Promise<AuthorResult>;
}

const ALL_TARGETS: TargetFramework[] = [
  'mitosis', 'react', 'svelte', 'vue3', 'vue2', 'angular',
];

export class InProcessAuthor implements MitosisAuthor {
  async authorDesignSystem(req: AuthorRequest): Promise<AuthorResult> {
    const spec = req.components?.[0];
    const res = await runAuthorAgent({
      componentName: req.componentName,
      componentSpec: spec,
      components: req.components?.map((c) => ({
        componentName: normalizeComponentName(c.name),
        componentSpec: c,
        existingSource: req.existingSource,
        repairErrors: req.repairErrors,
      })),
      tokens: req.tokens,
      tokenClasses: req.tokenClasses,
      existingSource: req.existingSource,
      siblingSources: req.siblingSources,
      siblingDrafts: req.siblingDrafts,
      repairErrors: req.repairErrors,
      feedbackNotes: req.feedbackNotes,
      existingComponentNames: req.existingComponentNames,
      workspaceDir: req.workspaceDir,
      targets: ALL_TARGETS,
      compileOnly: req.compileOnly,
    });

    if (!res.success) {
      const err = new Error(res.error || 'Authoring failed') as Error & {
        partialComponents?: Record<string, string>;
      };
      err.partialComponents = res.components;
      throw err;
    }

    return {
      components: res.components,
      componentGroups: res.componentGroups,
      artifacts: res.artifacts,
      newTokens: res.newTokens,
    };
  }
}

function buildMockMitosisSource(compName: string): string {
  return `import { useStore, useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface ${compName}Props {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
  children?: any;
}

export default function ${compName}(props: ${compName}Props) {
  useDefaultProps({
    variant: 'primary',
    disabled: false,
    className: '',
  });

  const state = useStore({
    get rootClasses() {
      return props.variant === 'secondary' ? 'opacity-90' : 'opacity-100';
    },
  });

  return (
    <div class={cn('inline-flex items-center gap-2', state.rootClasses, props.className)}>
      {props.children}
    </div>
  );
}
`;
}

export class DevMockAuthor implements MitosisAuthor {
  async authorDesignSystem(req: AuthorRequest): Promise<AuthorResult> {
    const names: string[] = [];
    if (req.componentName) names.push(req.componentName);
    for (const c of req.components || []) {
      const n = normalizeComponentName(c.name);
      if (!names.includes(n)) names.push(n);
    }
    if (names.length === 0) names.push('Component');

    const components: Record<string, string> = {};
    const componentGroups: Record<string, string> = {};
    const artifacts: CompiledArtifact[] = [];

    for (const name of names) {
      const src = req.existingSource || buildMockMitosisSource(name);
      components[name] = src;
      componentGroups[name] = name.toLowerCase().includes('icon') ? 'icons' : 'components';
      const compiled = await compileMitosis({
        componentName: name,
        source: src,
        targets: ALL_TARGETS,
        checks: { lint: false, render: false },
        normalize: true,
      });
      if (compiled.success) {
        artifacts.push(...compiled.artifacts);
      } else {
        artifacts.push({
          target: 'mitosis',
          fileName: `${name}.lite.tsx`,
          code: src,
          group: componentGroups[name],
        });
      }
    }

    return { components, componentGroups, artifacts, newTokens: [] };
  }
}

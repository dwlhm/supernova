import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateComponentDoc,
  generateComponentsIndexDoc,
  generateTokensDoc,
} from '../dist/index.js';

describe('AST-Driven Documentation Generator (@supernova/api)', () => {
  it('extracts TypeScript Props interface and useDefaultProps from authored .lite.tsx source and formats description sections', () => {
    const spec = {
      id: '1:1',
      name: 'Button',
      description:
        'Description\nButtons trigger actions.\n\nVariant\nPrimary — Main CTA.\nWHEN TO USE:\n• Submitting forms\n• Primary actions\nUSAGE GUIDELINES:\n• Use concise labels',
      properties: {
        '⮑ Left icon#2367:20856': { type: 'INSTANCE_SWAP', defaultValue: '2367:20856' },
      },
    };

    const liteSource = `
      import { useStore, useDefaultProps } from '@builder.io/mitosis';
      import { cn } from './utils';

      export interface ButtonProps {
        variant?: 'primary' | 'secondary' | 'outline';
        size?: 'sm' | 'md' | 'lg';
        disabled?: boolean;
        className?: string;
        children?: any;
      }

      export default function Button(props: ButtonProps) {
        useDefaultProps({
          variant: 'primary',
          size: 'md',
          disabled: false,
          className: '',
        });
        return <button>{props.children}</button>;
      }
    `;

    const md = generateComponentDoc(spec, liteSource);

    assert.match(md, /# Button\n\nButtons trigger actions\./);
    assert.match(md, /### Variants\n\nPrimary — Main CTA\./);
    assert.match(md, /## When to Use/);
    assert.match(md, /- Submitting forms/);
    assert.match(md, /## Usage Guidelines/);
    assert.match(md, /- Use concise labels/);
    assert.match(md, /\| `variant` \| `'primary' \\\| 'secondary' \\\| 'outline'` \| `'primary'` \| primary, secondary, outline \|/);
    assert.match(md, /\| `disabled` \| `boolean` \| `false` \| - \|/);
    assert.match(md, /\| `children` \| `ReactNode \\\| Slot \\\| ng-content` \| `-` \| - \|/);
    assert.ok(!md.includes('2367:20856'));
    assert.ok(!md.includes('⮑'));
    assert.ok(!md.includes('instance_swap'));
  });

  it('sanitizes fallback Figma spec properties when .lite.tsx source is not provided', () => {
    const spec = {
      id: '1:2',
      name: 'Alert',
      properties: {
        'Tone#100': {
          type: 'VARIANT',
          defaultValue: 'info',
          variantOptions: ['info', 'warning', 'error'],
        },
        'State#101': {
          type: 'VARIANT',
          defaultValue: 'Default',
          variantOptions: ['Default', 'Hover', 'Pressed'],
        },
        '⮑ Icon#102': {
          type: 'INSTANCE_SWAP',
          defaultValue: '999:888',
        },
      },
    };

    const md = generateComponentDoc(spec);
    assert.match(md, /\| `tone` \|/);
    assert.ok(!md.includes('999:888'));
    assert.ok(!md.includes('State'));
  });

  it('generates clean tokens.md and components/index.md with canonical CSS variable names matching tokens.css', () => {
    const tokensDoc = generateTokensDoc([
      {
        id: '1',
        name: 'shadow/xs',
        type: 'shadow',
        value: [
          {
            type: 'DROP_SHADOW',
            color: 'rgba(0, 0, 0, 0.05)',
            offset: { x: 0, y: 1 },
            radius: 2,
            spread: 0,
          },
        ],
      },
      {
        id: '2',
        name: 'Semantic/color/background/default',
        type: 'color',
        value: '#ffffff',
      },
    ]);
    assert.match(tokensDoc, /0px 1px 2px 0px rgba\(0, 0, 0, 0\.05\)/);
    assert.match(tokensDoc, /\| `shadow\/xs` \| `--shadow-xs` \|/);
    assert.match(tokensDoc, /\| `Semantic\/color\/background\/default` \| `--color-background-default` \| `#ffffff` \|/);
    assert.ok(!tokensDoc.includes('--semantic-color-background-default'));
    assert.ok(!tokensDoc.includes('map['));

    const indexDoc = generateComponentsIndexDoc([
      { id: '1', name: 'Button', description: 'Primary button WHEN TO USE: everywhere' },
    ]);
    assert.match(indexDoc, /- \[Button\]\(\.\/button\.md\) — Primary button/);
  });

  it('generates unified Live Preview & Usage section without redundant static Usage code-group blocks', () => {
    const spec = { id: '1:10', name: 'Table', description: 'Data table component' };
    const md = generateComponentDoc(spec);
    assert.match(md, /## Live Preview & Usage/);
    assert.match(md, /<ComponentPreview name="Table" \/>/);
    assert.ok(!md.includes('\n## Usage\n'));
  });
});

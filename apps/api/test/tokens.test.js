import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveTokens,
  generateThemeCSS,
  generateTokensCSS,
  generateTokensTS,
  extractTailwindUtilityClasses,
} from '../dist/index.js';

describe('Token Engine (@komerce-design/api)', () => {
  it('resolves aliases, RGBA objects, and DROP_SHADOW arrays into valid CSS values', () => {
    const rawTokens = [
      {
        id: 'tok-base-blue',
        name: 'color/blue/600',
        type: 'color',
        value: { r: 0.145, g: 0.388, b: 0.921, a: 1 },
      },
      {
        id: 'tok-primary',
        name: 'color/primary/default',
        type: 'color',
        value: '',
        aliasTo: 'tok-base-blue',
      },
      {
        id: 'tok-shadow-sm',
        name: 'shadow/sm',
        type: 'shadow',
        value: [
          {
            type: 'DROP_SHADOW',
            color: 'rgba(10, 13, 18, 0.05)',
            offset: { x: 0, y: 1 },
            radius: 2,
            spread: 0,
            visible: true,
          },
        ],
      },
    ];

    const resolved = resolveTokens(rawTokens);
    assert.equal(resolved[0].value, '#2563eb');
    assert.equal(resolved[1].value, '#2563eb');
    assert.equal(resolved[2].value, '0px 1px 2px 0px rgba(10, 13, 18, 0.05)');
    assert.ok(!String(resolved[2].value).includes('map['));
    assert.ok(!String(resolved[2].value).includes('[object Object]'));
  });

  it('excludes reserved Tailwind v4 container sizes (--spacing-sm..2xl) from @theme in theme.css while keeping them in tokens.css', () => {
    const tokens = [
      { id: '1', name: 'spacing/sm', type: 'spacing', value: '8px' },
      { id: '2', name: 'spacing/md', type: 'spacing', value: '16px' },
      { id: '3', name: 'spacing/2xl', type: 'spacing', value: '32px' },
      { id: '4', name: 'spacing/button-gap', type: 'spacing', value: '8px' },
      { id: '5', name: 'color/primary/default', type: 'color', value: '#2563eb' },
    ];

    const themeCSS = generateThemeCSS(tokens);
    const tokensCSS = generateTokensCSS(tokens);
    const tokensTS = generateTokensTS(tokens);

    assert.ok(!themeCSS.includes('--spacing-sm:'));
    assert.ok(!themeCSS.includes('--spacing-md:'));
    assert.ok(!themeCSS.includes('--spacing-2xl:'));
    assert.ok(themeCSS.includes('--spacing-button-gap: 8px;'));
    assert.ok(themeCSS.includes('--color-primary-default: #2563eb;'));

    // tokens.css (:root) retains all custom properties
    assert.ok(tokensCSS.includes('--spacing-sm: 8px;'));
    assert.ok(tokensCSS.includes('--spacing-2xl: 32px;'));
    assert.ok(tokensTS.includes('"spacing-2xl": "32px"'));
  });

  it('normalizes Figma percentage opacity floats (50 -> 0.5) and font-weight names (Medium -> 500) so Tailwind v4 @theme utilities work', () => {
    const tokens = [
      { id: '1', name: 'Primitive/opacity/50', type: 'float', value: 50 },
      { id: '2', name: 'Semantic/opacity/disabled', type: 'float', value: 50 },
      { id: '3', name: 'Primitive/opacity/100', type: 'float', value: 100 },
      { id: '4', name: 'font/weight/medium', type: 'font', value: 'Medium' },
      { id: '5', name: 'font/weight/semibold', type: 'font', value: 'SemiBold' },
      { id: '6', name: 'font/line-height/24', type: 'font', value: 24 },
    ];

    const themeCSS = generateThemeCSS(tokens);
    assert.ok(themeCSS.includes('--opacity-50: 0.5;'));
    assert.ok(themeCSS.includes('--opacity-disabled: 0.5;'));
    assert.ok(themeCSS.includes('--opacity-100: 1;'));
    assert.ok(themeCSS.includes('--font-weight-medium: 500;'));
    assert.ok(themeCSS.includes('--font-weight-semibold: 600;'));
    assert.ok(themeCSS.includes('--font-line-height-24: 24px;'));
  });

  it('formats font family tokens with safe fallback font stacks in theme.css and tokens.css', () => {
    const tokens = [
      { id: '1', name: '🌱 Semantic/typography/body', type: 'font', value: 'Plus Jakarta Sans' },
      { id: '2', name: '🌱 Semantic/typography/headings', type: 'font', value: 'Plus Jakarta Sans' },
    ];

    const themeCSS = generateThemeCSS(tokens);
    const tokensCSS = generateTokensCSS(tokens);
    const expected = '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    assert.ok(themeCSS.includes(`--font-body: ${expected};`));
    assert.ok(themeCSS.includes(`--font-headings: ${expected};`));
    assert.ok(tokensCSS.includes(`--font-body: ${expected};`));
    assert.ok(tokensCSS.includes(`--font-headings: ${expected};`));
  });

  it('extracts deterministic Tailwind utility classes and state variants', () => {
    const tokens = [
      { id: '1', name: 'color/primary/default', type: 'color', value: '#2563eb' },
      { id: '2', name: 'borderRadius/md', type: 'borderRadius', value: '6px' },
    ];

    const classes = extractTailwindUtilityClasses(tokens);
    assert.ok(classes.includes('bg-primary-default'));
    assert.ok(classes.includes('hover:bg-primary-default'));
    assert.ok(classes.includes('text-primary-default'));
    assert.ok(classes.includes('rounded-md'));
  });

  it('emits both :root (Light Mode) and .dark (Dark Mode) in tokens.css directly from Figma valuesByMode', () => {
    const tokens = [
      {
        id: '1',
        name: '🌱 Semantic/colors/secondary/default',
        type: 'color',
        value: 'rgb(245, 245, 245)',
        valuesByMode: {
          '2021:3': 'rgb(245, 245, 245)',
          '2588:1': 'rgb(38, 38, 38)',
        },
      },
      {
        id: '2',
        name: '🌱 Semantic/colors/secondary/foreground',
        type: 'color',
        value: 'rgb(23, 23, 23)',
        valuesByMode: {
          '2021:3': 'rgb(23, 23, 23)',
          '2588:1': 'rgb(245, 245, 245)',
        },
      },
      {
        id: '3',
        name: '🌱 Semantic/colors/secondary/hover',
        type: 'color',
        value: 'rgb(250, 250, 250)',
        valuesByMode: {
          '2021:3': 'rgb(250, 250, 250)',
          '2588:1': 'rgb(64, 64, 64)',
        },
      },
    ];

    const tokensCSS = generateTokensCSS(tokens);
    assert.ok(tokensCSS.includes(':root {\n  --color-secondary-default: rgb(245, 245, 245);'));
    assert.ok(tokensCSS.includes('.dark {\n  color-scheme: dark;'));
    assert.ok(tokensCSS.includes('  --color-secondary-default: rgb(38, 38, 38);'));
    assert.ok(tokensCSS.includes('  --color-secondary-foreground: rgb(245, 245, 245);'));
    assert.ok(tokensCSS.includes('  --color-secondary-hover: rgb(64, 64, 64);'));
  });
});

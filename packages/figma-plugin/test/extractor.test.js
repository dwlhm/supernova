import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  serializeColor,
  serializeStroke,
  extractLayout,
  formatVariableToken,
  formatComponentSpec,
  serializeEffect,
  formatComponentSetSpec,
  resolveVariableAliases,
  markKnownVariableId,
  isKnownVariableId,
  collectBoundVariableIds,
  sanitizeForPostMessage,
  isDividerPage,
  isExcludedPage,
  isComponentsSectionHeader,
  isSectionHeader,
  getComponentPagesToScan,
} from '../dist/extractor.js';

describe('Figma Extractor Utilities', () => {
  test('serializeColor correctly formats rgb and rgba', () => {
    assert.equal(serializeColor({ r: 1, g: 0, b: 0 }), 'rgb(255, 0, 0)');
    assert.equal(serializeColor({ r: 0, g: 1, b: 0, a: 0.5 }), 'rgba(0, 255, 0, 0.5)');
    assert.equal(serializeColor({ r: 0.2, g: 0.4, b: 0.8 }, 0.75), 'rgba(51, 102, 204, 0.75)');
  });

  test('extractLayout extracts AutoLayout and geometry parameters', () => {
    const layout = extractLayout({
      width: 320,
      height: 48,
      layoutMode: 'HORIZONTAL',
      primaryAxisAlignItems: 'CENTER',
      counterAxisAlignItems: 'CENTER',
      paddingTop: 12,
      paddingRight: 16,
      paddingBottom: 12,
      paddingLeft: 16,
      itemSpacing: 8,
      cornerRadius: 6,
    });

    assert.equal(layout.width, 320);
    assert.equal(layout.height, 48);
    assert.equal(layout.layoutMode, 'HORIZONTAL');
    assert.equal(layout.paddingTop, 12);
    assert.equal(layout.paddingRight, 16);
    assert.equal(layout.itemSpacing, 8);
    assert.equal(layout.cornerRadius, 6);
  });

  test('formatVariableToken formats variable tokens with collection namespace', () => {
    const token = formatVariableToken(
      {
        id: 'var-123',
        name: 'primary',
        resolvedType: 'COLOR',
        valuesByMode: { modeA: '#18a0fb' },
        description: 'Brand primary color',
      },
      'colors'
    );

    assert.equal(token.id, 'var-123');
    assert.equal(token.name, 'colors/primary');
    assert.equal(token.type, 'color');
    assert.equal(token.value, '#18a0fb');
    assert.equal(token.description, 'Brand primary color');
  });

  test('formatVariableToken preserves multiple modes and mode mapping', () => {
    const token = formatVariableToken(
      {
        id: 'var-theme',
        name: 'bg-surface',
        resolvedType: 'COLOR',
        valuesByMode: {
          'mode:1': '#ffffff',
          'mode:2': '#121212',
        },
      },
      'Semantic',
      undefined,
      { 'mode:1': 'Light', 'mode:2': 'Dark' }
    );

    assert.equal(token.name, 'Semantic/bg-surface');
    assert.equal(token.value, '#ffffff');
    assert.deepEqual(token.valuesByMode, {
      'mode:1': '#ffffff',
      'mode:2': '#121212',
    });
    assert.deepEqual(token.modes, { 'mode:1': 'Light', 'mode:2': 'Dark' });
  });

  test('serializeStroke preserves stroke weight, alignment, dashes, and boundVariables', () => {
    const stroke = serializeStroke(
      {
        type: 'SOLID',
        color: { r: 0.1, g: 0.2, b: 0.3 },
        opacity: 0.9,
        boundVariables: {
          color: { id: 'var-border', type: 'VARIABLE_ALIAS' },
        },
      },
      2,
      'INSIDE',
      [4, 2]
    );

    assert.equal(stroke.type, 'SOLID');
    assert.equal(stroke.weight, 2);
    assert.equal(stroke.align, 'INSIDE');
    assert.deepEqual(stroke.dashes, [4, 2]);
    assert.equal(stroke.color, 'rgba(26, 51, 77, 0.9)');
    assert.deepEqual(stroke.boundVariables?.color?.id, 'var-border');
  });

  test('formatComponentSpec preserves component set hierarchy', () => {
    const spec = formatComponentSpec(
      {
        id: 'comp-btn-small',
        name: 'Size=Small, Variant=Primary',
        key: 'comp-key-xyz',
        description: 'Small primary button variant',
        parent: {
          type: 'COMPONENT_SET',
          name: 'Button',
        },
      },
      { width: 100, height: 32 }
    );

    assert.equal(spec.id, 'comp-btn-small');
    assert.equal(spec.name, 'Size=Small, Variant=Primary');
    assert.equal(spec.componentSetName, 'Button');
    assert.equal(spec.key, 'comp-key-xyz');
    assert.equal(spec.pageName, undefined);
    assert.deepEqual(spec.node, { width: 100, height: 32 });
  });

  test('formatComponentSpec attaches pageName when supplied', () => {
    const spec = formatComponentSpec(
      {
        id: 'comp-btn-small',
        name: 'Size=Small, Variant=Primary',
      },
      { width: 100, height: 32 },
      'Components Page'
    );

    assert.equal(spec.pageName, 'Components Page');
  });

  test('serializeEffect extracts shadow effect parameters', () => {
    const shadow = serializeEffect({
      type: 'DROP_SHADOW',
      visible: true,
      radius: 8,
      color: { r: 0, g: 0, b: 0, a: 0.15 },
      offset: { x: 0, y: 4 },
      spread: 2,
    });

    assert.equal(shadow.type, 'DROP_SHADOW');
    assert.equal(shadow.visible, true);
    assert.equal(shadow.radius, 8);
    assert.equal(shadow.color, 'rgba(0, 0, 0, 0.15)');
    assert.deepEqual(shadow.offset, { x: 0, y: 4 });
    assert.equal(shadow.spread, 2);
  });

  test('serializeEffect extracts blur effect parameters with defaults', () => {
    const blur = serializeEffect({
      type: 'LAYER_BLUR',
      radius: 12,
    });

    assert.equal(blur.type, 'LAYER_BLUR');
    assert.equal(blur.visible, true);
    assert.equal(blur.radius, 12);
    assert.equal(blur.color, undefined);
    assert.equal(blur.offset, undefined);
    assert.equal(blur.spread, undefined);
  });

  test('formatComponentSetSpec aggregates COMPONENT_SET and child variants', () => {
    const compSet = {
      id: 'set-avatar',
      name: 'Avatar',
      key: 'avatar-key-123',
      description: 'User avatar component with size and status variants',
      componentPropertyDefinitions: {
        Size: {
          type: 'VARIANT',
          defaultValue: 'Medium',
          variantOptions: ['Small', 'Medium', 'Large'],
        },
        Status: {
          type: 'VARIANT',
          defaultValue: 'Online',
          variantOptions: ['Online', 'Offline'],
        },
      },
    };

    const variants = [
      {
        id: 'var-1',
        name: 'Size=Small, Status=Online',
        properties: { Size: 'Small', Status: 'Online' },
        node: { width: 24, height: 24 },
      },
      {
        id: 'var-2',
        name: 'Size=Medium, Status=Online',
        properties: { Size: 'Medium', Status: 'Online' },
        node: { width: 32, height: 32 },
      },
      {
        id: 'var-3',
        name: 'Size=Large, Status=Offline',
        properties: { Size: 'Large', Status: 'Offline' },
        node: { width: 40, height: 40 },
      },
    ];

    const layout = {
      layoutMode: 'HORIZONTAL',
      width: 120,
      height: 40,
    };

    const spec = formatComponentSetSpec(compSet, variants, layout);

    assert.equal(spec.id, 'set-avatar');
    assert.equal(spec.name, 'Avatar');
    assert.equal(spec.key, 'avatar-key-123');
    assert.equal(spec.description, 'User avatar component with size and status variants');
    assert.equal(spec.properties?.Size?.defaultValue, 'Medium');
    assert.equal(spec.properties?.Status?.defaultValue, 'Online');
    assert.equal(spec.node.variantCount, 3);
    assert.equal(spec.node.layout?.width, 120);
    assert.equal(spec.node.layout?.layoutMode, 'HORIZONTAL');
    assert.equal(spec.node.variants.length, 3);
    assert.equal(spec.node.variants[0].name, 'Size=Small, Status=Online');
    assert.equal(spec.pageName, undefined);
  });

  test('formatComponentSetSpec attaches pageName when supplied', () => {
    const compSet = {
      id: 'set-avatar',
      name: 'Avatar',
    };
    const spec = formatComponentSetSpec(compSet, [], undefined, 'Components Page');
    assert.equal(spec.pageName, 'Components Page');
  });

  test('resolveVariableAliases resolves direct and chained aliases with cycle detection', () => {
    const tokens = [
      {
        id: 'color-base',
        name: 'base/blue',
        type: 'color',
        value: { r: 0.1, g: 0.5, b: 1, a: 1 },
      },
      {
        id: 'color-alias-1',
        name: 'semantic/primary',
        type: 'color',
        value: { type: 'VARIABLE_ALIAS', id: 'color-base' },
      },
      {
        id: 'color-alias-2',
        name: 'component/button-bg',
        type: 'color',
        value: { type: 'VARIABLE_ALIAS', id: 'VariableID:color-alias-1' },
      },
      {
        id: 'cycle-1',
        name: 'cycle/a',
        type: 'color',
        value: { type: 'VARIABLE_ALIAS', id: 'cycle-2' },
      },
      {
        id: 'cycle-2',
        name: 'cycle/b',
        type: 'color',
        value: { type: 'VARIABLE_ALIAS', id: 'cycle-1' },
      },
    ];

    const resolved = resolveVariableAliases(tokens);
    assert.equal(resolved.length, 5);
    // Base color converted from RGB map to rgb string
    assert.equal(resolved[0].value, 'rgb(26, 128, 255)');
    // Direct alias resolved to base color
    assert.equal(resolved[1].value, 'rgb(26, 128, 255)');
    // Chained alias resolved to base color
    assert.equal(resolved[2].value, 'rgb(26, 128, 255)');
    // Cycle handled safely without infinite loop
    assert.ok(resolved[3].value !== undefined);
    assert.ok(resolved[4].value !== undefined);
  });

  test('markKnownVariableId and isKnownVariableId handle bare and prefixed IDs', () => {
    const knownIds = new Set();
    markKnownVariableId('var-123', knownIds);

    assert.equal(isKnownVariableId('var-123', knownIds), true);
    assert.equal(isKnownVariableId('VariableID:var-123', knownIds), true);
    assert.equal(isKnownVariableId('var-999', knownIds), false);

    markKnownVariableId('VariableID:var-456', knownIds);
    assert.equal(isKnownVariableId('var-456', knownIds), true);
    assert.equal(isKnownVariableId('VariableID:var-456', knownIds), true);
  });

  test('collectBoundVariableIds extracts missing variable IDs across node and paint properties', () => {
    const knownIds = new Set();
    markKnownVariableId('local-fill-1', knownIds);

    const missingIds = new Set();
    const mockNode = {
      boundVariables: {
        fills: [
          { type: 'VARIABLE_ALIAS', id: 'local-fill-1' },
          { type: 'VARIABLE_ALIAS', id: 'ext-library-fill' },
        ],
        strokes: [
          { type: 'VARIABLE_ALIAS', id: 'VariableID:ext-library-stroke' },
        ],
        itemSpacing: { type: 'VARIABLE_ALIAS', id: 'ext-spacing-token' },
      },
      fills: [
        {
          type: 'SOLID',
          color: { r: 1, g: 0, b: 0 },
          boundVariables: {
            color: { type: 'VARIABLE_ALIAS', id: 'ext-paint-fill' },
          },
        },
      ],
      strokes: [
        {
          type: 'SOLID',
          color: { r: 0, g: 1, b: 0 },
          boundVariables: {
            color: { type: 'VARIABLE_ALIAS', id: 'ext-paint-stroke' },
          },
        },
      ],
      effects: [
        {
          type: 'DROP_SHADOW',
          boundVariables: {
            color: { type: 'VARIABLE_ALIAS', id: 'ext-effect-color' },
          },
        },
      ],
    };

    collectBoundVariableIds(mockNode, missingIds, knownIds);

    // Known local variable should NOT be in missingIds
    assert.equal(missingIds.has('local-fill-1'), false);
    assert.equal(missingIds.has('VariableID:local-fill-1'), false);

    // Missing external variables should be collected
    assert.equal(missingIds.has('ext-library-fill'), true);
    assert.equal(missingIds.has('VariableID:ext-library-stroke'), true);
    assert.equal(missingIds.has('ext-spacing-token'), true);
    assert.equal(missingIds.has('ext-paint-fill'), true);
    assert.equal(missingIds.has('ext-paint-stroke'), true);
    assert.equal(missingIds.has('ext-effect-color'), true);
  });

  test('extractLayout handles mixed corner radius and individual corner radii', () => {
    const mixedRadius = Symbol('figma.mixed');
    const layout = extractLayout({
      width: 120,
      height: 60,
      cornerRadius: mixedRadius,
      topLeftRadius: 8,
      topRightRadius: 12,
      bottomRightRadius: 16,
      bottomLeftRadius: 4,
    });

    assert.deepEqual(layout.cornerRadius, {
      topLeft: 8,
      topRight: 12,
      bottomRight: 16,
      bottomLeft: 4,
    });

    // When cornerRadius is mixed/symbol and no individual radii are provided, cornerRadius is not set
    const fallbackLayout = extractLayout({
      width: 100,
      height: 50,
      cornerRadius: mixedRadius,
    });
    assert.equal(fallbackLayout.cornerRadius, undefined);
  });

  test('sanitizeForPostMessage strips symbols and handles circular references', () => {
    const circularObj = {
      name: 'nested-node',
      mixedRadius: Symbol('figma.mixed'),
    };
    circularObj.self = circularObj;

    const data = {
      id: 'node-1',
      symbolProp: Symbol('hidden'),
      circular: circularObj,
      normalProp: 123,
    };

    const sanitized = sanitizeForPostMessage(data);

    assert.equal(sanitized.id, 'node-1');
    assert.equal(sanitized.normalProp, 123);
    assert.equal('symbolProp' in sanitized, false);
    assert.equal(sanitized.circular.name, 'nested-node');
    assert.equal('mixedRadius' in sanitized.circular, false);
    assert.equal(sanitized.circular.self, undefined);

    // undefined handling
    assert.equal(sanitizeForPostMessage(undefined), undefined);
  });

  describe('Section-Aware Page Filtering', () => {
    test('isDividerPage recognizes horizontal box drawings, dashes, and divider prefixes', () => {
      assert.equal(isDividerPage('─────────'), true);
      assert.equal(isDividerPage('---'), true);
      assert.equal(isDividerPage('—'), true);
      assert.equal(isDividerPage(' - - - '), true);
      assert.equal(isDividerPage('-- Divider'), true);
      assert.equal(isDividerPage('— Section Divider'), true);
      assert.equal(isDividerPage('─ Another Divider'), true);
      assert.equal(isDividerPage('Button'), false);
      assert.equal(isDividerPage('Alert Dialog'), false);
      assert.equal(isDividerPage('💠 Components'), false);
    });

    test('isExcludedPage detects patterns, playground, welcome, and non-component keywords', () => {
      assert.equal(isExcludedPage('🧩 Patterns'), true);
      assert.equal(isExcludedPage('🕹️ Playground'), true);
      assert.equal(isExcludedPage('Welcome to Design System'), true);
      assert.equal(isExcludedPage('Sandbox'), true);
      assert.equal(isExcludedPage('Archive'), true);
      assert.equal(isExcludedPage('Templates'), true);
      assert.equal(isExcludedPage('Scratchpad'), true);
      assert.equal(isExcludedPage('Button'), false);
      assert.equal(isExcludedPage('Alert Dialog'), false);
      assert.equal(isExcludedPage('Avatar'), false);
    });

    test('isComponentsSectionHeader identifies various component section headers', () => {
      assert.equal(isComponentsSectionHeader('💠 Components'), true);
      assert.equal(isComponentsSectionHeader('Components'), true);
      assert.equal(isComponentsSectionHeader('❖ Components'), true);
      assert.equal(isComponentsSectionHeader('UI Components'), true);
      assert.equal(isComponentsSectionHeader('Alert Dialog'), false);
      assert.equal(isComponentsSectionHeader('Avatar'), false);
      assert.equal(isComponentsSectionHeader('Colors'), false);
    });

    test('isSectionHeader identifies headers with emojis, symbols, and keywords', () => {
      assert.equal(isSectionHeader('🧱 Foundation'), true);
      assert.equal(isSectionHeader('🧩 Patterns'), true);
      assert.equal(isSectionHeader('🕹️ Playground'), true);
      assert.equal(isSectionHeader('Foundation'), true);
      assert.equal(isSectionHeader('Templates'), true);
      assert.equal(isSectionHeader('Alert Dialog'), false);
      assert.equal(isSectionHeader('Avatar'), false);
    });

    test('getComponentPagesToScan extracts only component pages from exact design system hierarchy', () => {
      const hierarchy = [
        '🧩 Patterns',
        '─────────',
        '🧱 Foundation',
        'Colors',
        'Grid',
        'Icons',
        'Logo',
        'Radius',
        'Shadows',
        'Spacing',
        'Typography',
        '─────────',
        '🕹️ Playground',
        '─────────',
        '💠 Components',
        'Alert Dialog',
        'Avatar',
      ];

      const selected = getComponentPagesToScan(hierarchy);
      assert.deepEqual(selected, ['Alert Dialog', 'Avatar']);
    });

    test('getComponentPagesToScan falls back when no Components section header exists', () => {
      const pages = ['Button', 'Card', '🕹️ Playground'];
      const selected = getComponentPagesToScan(pages);
      assert.deepEqual(selected, ['Button', 'Card']);
    });

    test('getComponentPagesToScan works with Figma PageNode object structures', () => {
      const objectHierarchy = [
        { name: '🧱 Foundation', type: 'PAGE' },
        { name: 'Colors', type: 'PAGE' },
        { name: '─────────', type: 'PAGE' },
        { name: '💠 Components', type: 'PAGE' },
        { name: 'Alert Dialog', type: 'PAGE' },
        { name: 'Avatar', type: 'PAGE' },
        { name: '─────────', type: 'PAGE' },
        { name: '🕹️ Playground', type: 'PAGE' },
      ];

      const selected = getComponentPagesToScan(objectHierarchy);
      assert.deepEqual(selected, [
        { name: 'Alert Dialog', type: 'PAGE' },
        { name: 'Avatar', type: 'PAGE' },
      ]);
    });

    test('getComponentPagesToScan stops at subsequent section header without divider', () => {
      const pages = [
        '💠 Components',
        'Button',
        'Input',
        '🧱 Foundation',
        'Colors',
      ];
      assert.deepEqual(getComponentPagesToScan(pages), ['Button', 'Input']);
    });
  });
});

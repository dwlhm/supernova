#!/usr/bin/env node

/**
 * Unit Test Suite for scripts/import-figma-components.js
 *
 * Verifies:
 * - Successful parsing of Figma component_sets payload.
 * - Parsing of standalone components (excluding variants and icons).
 * - Component name normalization into clean PascalCase identifiers.
 * - Filter handling (--only and --all).
 * - Catalog JSON mapping compatible with process-pr-components.js.
 * - Catalog writing and merging (--merge and --no-merge).
 * - Dry-run mode previews without mutating target files on disk.
 * - discoverFigmaComponentSets endpoint calls and headers.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  DEFAULT_FILE_KEY,
  DEFAULT_CATALOG_PATH,
  normalizeComponentName,
  parseComponentSetsResponse,
  parseComponentsResponse,
  mapFigmaItemToCatalogEntry,
  mergeCatalogEntries,
  filterComponents,
  discoverFigmaComponentSets,
  importFigmaComponents,
  parseCliArgs,
} = require('./import-figma-components');

const { computeFingerprint } = require('./process-pr-components');

console.log('🧪 Running Figma Component Importer Tests...\n');

// Helper to create an isolated temporary workspace for tests
function createTempWorkspace() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'supernova-figma-import-test-'));
  const catalogPath = path.join(tempDir, 'components.catalog.json');

  return {
    tempDir,
    catalogPath,
    cleanup: () => {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    },
  };
}

(async () => {
  // -------------------------------------------------------------------------
  // Test 1: Name Normalization into PascalCase
  // -------------------------------------------------------------------------
  console.log('Test 1: Verify component name normalization into clean PascalCase');
  {
    assert.strictEqual(normalizeComponentName('Button'), 'Button');
    assert.strictEqual(normalizeComponentName('Badge'), 'Badge');
    assert.strictEqual(normalizeComponentName('Checkbox'), 'Checkbox');
    assert.strictEqual(normalizeComponentName('Date Picker'), 'DatePicker');
    assert.strictEqual(normalizeComponentName('Alert dialog'), 'AlertDialog');
    assert.strictEqual(normalizeComponentName('Input/Text'), 'InputText');
    assert.strictEqual(normalizeComponentName('Input/File-Drop-Zone'), 'InputFileDropZone');
    assert.strictEqual(normalizeComponentName('Input/Text-Area'), 'InputTextArea');
    assert.strictEqual(normalizeComponentName('Input/OTP'), 'InputOTP');
    assert.strictEqual(normalizeComponentName('FAB'), 'FAB');
    assert.strictEqual(normalizeComponentName('Logo / Brand'), 'LogoBrand');
    assert.strictEqual(normalizeComponentName('Radio Button'), 'RadioButton');
    assert.strictEqual(normalizeComponentName('Switch Button'), 'SwitchButton');
    assert.strictEqual(normalizeComponentName('tabler/truck-delivery'), 'TablerTruckDelivery');
    assert.strictEqual(normalizeComponentName(''), 'Component');
    assert.strictEqual(normalizeComponentName(null), 'Component');

    console.log('  ✓ Clean PascalCase normalization verified for all naming styles\n');
  }

  // -------------------------------------------------------------------------
  // Test 2: Parsing Figma component_sets Payload
  // -------------------------------------------------------------------------
  console.log('Test 2: Verify parsing of Figma component_sets payload');
  {
    const mockPayload = {
      status: 200,
      error: false,
      meta: {
        component_sets: [
          {
            key: 'set-key-1',
            file_key: 'testFileKey',
            node_id: '10:100',
            name: 'Button',
            description: 'Interactive button control',
            thumbnail_url: 'https://example.com/button.png',
            created_at: '2026-01-01T00:00:00Z',
            updated_at: '2026-01-02T00:00:00Z',
          },
          {
            key: 'set-key-2',
            file_key: 'testFileKey',
            node_id: '20:200',
            name: 'Input/Text',
            description: 'Standard text input field',
            thumbnail_url: 'https://example.com/input-text.png',
            created_at: '2026-01-03T00:00:00Z',
            updated_at: '2026-01-04T00:00:00Z',
          },
        ],
      },
    };

    const parsed = parseComponentSetsResponse(mockPayload, 'testFileKey');

    assert.strictEqual(parsed.length, 2);
    assert.strictEqual(parsed[0].type, 'COMPONENT_SET');
    assert.strictEqual(parsed[0].name, 'Button');
    assert.strictEqual(parsed[0].node_id, '10:100');
    assert.strictEqual(parsed[0].key, 'set-key-1');
    assert.strictEqual(parsed[0].description, 'Interactive button control');
    assert.strictEqual(parsed[0].thumbnail_url, 'https://example.com/button.png');

    assert.strictEqual(parsed[1].type, 'COMPONENT_SET');
    assert.strictEqual(parsed[1].name, 'Input/Text');
    assert.strictEqual(parsed[1].node_id, '20:200');

    // Empty or malformed payload returns empty array gracefully
    assert.deepStrictEqual(parseComponentSetsResponse(null), []);
    assert.deepStrictEqual(parseComponentSetsResponse({}), []);

    console.log('  ✓ Figma component_sets payload parsed successfully\n');
  }

  // -------------------------------------------------------------------------
  // Test 3: Parsing Standalone Components (Filtering Variants & Icons)
  // -------------------------------------------------------------------------
  console.log('Test 3: Verify parsing of standalone components and variant/icon filtering');
  {
    const mockComponentsPayload = {
      status: 200,
      error: false,
      meta: {
        components: [
          // Standalone UI component
          {
            key: 'comp-alert-dialog',
            file_key: 'testFileKey',
            node_id: '3429:327',
            name: 'Alert dialog',
            description: 'Dialog component',
            containing_frame: {
              name: 'Alert dialog',
              pageName: 'Alert Dialog',
            },
          },
          // Variant component inside a component set (must be excluded)
          {
            key: 'comp-btn-variant',
            file_key: 'testFileKey',
            node_id: '2266:2543',
            name: 'State=Default, Size=Small',
            containing_frame: {
              name: 'Button',
              containingComponentSet: { name: 'Button', nodeId: '2266:662' },
            },
          },
          // Icon on Icons page (must be excluded by default)
          {
            key: 'comp-icon-1',
            file_key: 'testFileKey',
            node_id: '88:88',
            name: 'receipt-dollar',
            containing_frame: {
              name: 'Tabler Icon',
              pageName: 'Icons',
            },
          },
        ],
      },
    };

    const standalone = parseComponentsResponse(mockComponentsPayload, 'testFileKey', {
      includeIcons: false,
      seenNodeIds: new Set(),
    });

    assert.strictEqual(standalone.length, 1);
    assert.strictEqual(standalone[0].name, 'Alert dialog');
    assert.strictEqual(standalone[0].node_id, '3429:327');
    assert.strictEqual(standalone[0].type, 'COMPONENT');

    // Including icons should allow the icon
    const withIcons = parseComponentsResponse(mockComponentsPayload, 'testFileKey', {
      includeIcons: true,
      seenNodeIds: new Set(),
    });
    assert.strictEqual(withIcons.length, 2);

    console.log('  ✓ Standalone components parsed; variant instances and icons excluded properly\n');
  }

  // -------------------------------------------------------------------------
  // Test 4: Filter Handling (--only and --all)
  // -------------------------------------------------------------------------
  console.log('Test 4: Verify filter handling (--only and --all)');
  {
    const items = [
      { name: 'Button', rawName: 'Button', type: 'COMPONENT_SET' },
      { name: 'Badge', rawName: 'Badge', type: 'COMPONENT_SET' },
      { name: 'Checkbox', rawName: 'Checkbox', type: 'COMPONENT_SET' },
      { name: 'DatePicker', rawName: 'Date Picker', type: 'COMPONENT_SET' },
      { name: 'InputText', rawName: 'Input/Text', type: 'COMPONENT_SET' },
      { name: 'AlertDialog', rawName: 'Alert dialog', type: 'COMPONENT' },
    ];

    // Filter by single name
    const onlyButton = filterComponents(items, 'Button');
    assert.strictEqual(onlyButton.length, 1);
    assert.strictEqual(onlyButton[0].name, 'Button');

    // Filter by comma-separated string
    const subset = filterComponents(items, 'Button,Badge,Checkbox');
    assert.strictEqual(subset.length, 3);
    assert.deepStrictEqual(subset.map((i) => i.name), ['Button', 'Badge', 'Checkbox']);

    // Filter by array
    const subsetArr = filterComponents(items, ['Button', 'Checkbox']);
    assert.strictEqual(subsetArr.length, 2);

    // Case-insensitive and normalized matching (e.g. "date picker" or "InputText")
    const matchCase = filterComponents(items, 'button, date picker');
    assert.strictEqual(matchCase.length, 2);
    assert.strictEqual(matchCase[0].name, 'Button');
    assert.strictEqual(matchCase[1].name, 'DatePicker');

    // Matching raw name with slashes: "Input/Text"
    const matchSlash = filterComponents(items, 'Input/Text');
    assert.strictEqual(matchSlash.length, 1);
    assert.strictEqual(matchSlash[0].name, 'InputText');

    // No filter / null / empty returns all items
    assert.strictEqual(filterComponents(items, null).length, items.length);
    assert.strictEqual(filterComponents(items, '').length, items.length);

    console.log('  ✓ Filter handling (--only and --all) functions accurately\n');
  }

  // -------------------------------------------------------------------------
  // Test 5: Catalog Shape Compatibility with process-pr-components.js
  // -------------------------------------------------------------------------
  console.log('Test 5: Verify catalog shape compatibility with process-pr-components.js');
  {
    const item = {
      type: 'COMPONENT_SET',
      key: 'btn-source-key',
      file_key: 'testFileKey',
      node_id: '123:456',
      name: 'Input/File-Drop-Zone',
      description: 'Drag and drop zone',
      thumbnail_url: 'https://example.com/dropzone.png',
      updated_at: '2026-03-01T00:00:00Z',
    };

    const entry = mapFigmaItemToCatalogEntry(item, 'testFileKey');

    // Verify fields required by computeFingerprint and resolveFigmaNode
    assert.strictEqual(entry.name, 'InputFileDropZone');
    assert.strictEqual(entry.fileId, 'testFileKey');
    assert.strictEqual(entry.nodeId, '123:456');
    assert.strictEqual(entry.sourceId, 'btn-source-key');
    assert.strictEqual(entry.description, 'Drag and drop zone');
    assert(Array.isArray(entry.componentPropertyDefinitions));
    assert(typeof entry.variantPropertyValues === 'object');
    assert(typeof entry.figma === 'object');
    assert.strictEqual(entry.figma.fileId, 'testFileKey');
    assert.strictEqual(entry.figma.nodeId, '123:456');

    // Verify computeFingerprint from process-pr-components works without error
    const hash = computeFingerprint(entry);
    assert.strictEqual(typeof hash, 'string');
    assert.strictEqual(hash.length, 64, 'Must yield a 64-char SHA-256 fingerprint');

    console.log('  ✓ Catalog shape is 100% compatible with process-pr-components.js\n');
  }

  // -------------------------------------------------------------------------
  // Test 6: Catalog Merging Logic (--merge and --no-merge)
  // -------------------------------------------------------------------------
  console.log('Test 6: Verify catalog merging logic (--merge and --no-merge)');
  {
    const existingCatalog = [
      {
        id: 'supernova-id-1',
        name: 'Alert Dialog',
        brandId: 'brand-uuid-123',
        hasMitosisDefinition: true,
        fileId: 'file-1',
        nodeId: '3429:327',
        sourceId: 'src-1',
        figma: {
          fileId: 'file-1',
          nodeId: '3429:327',
          sourceId: 'src-1',
        },
      },
      {
        id: 'supernova-id-2',
        name: 'ExistingOnlyComponent',
        brandId: 'brand-uuid-456',
        fileId: 'file-1',
        nodeId: '999:999',
      },
    ];

    const discoveredEntries = [
      // Matches existing Alert Dialog by nodeId '3429:327'
      mapFigmaItemToCatalogEntry(
        {
          key: 'src-1',
          node_id: '3429:327',
          name: 'Alert dialog',
          thumbnail_url: 'https://example.com/alert.png',
        },
        'file-1'
      ),
      // Brand new component
      mapFigmaItemToCatalogEntry(
        {
          key: 'btn-key',
          node_id: '2266:662',
          name: 'Button',
        },
        'file-1'
      ),
    ];

    // Case 1: Merge = true (preserve existing items, add new items)
    const { mergedCatalog, addedCount, preservedCount } = mergeCatalogEntries(
      existingCatalog,
      discoveredEntries,
      true
    );

    assert.strictEqual(preservedCount, 1, 'Should preserve Alert Dialog');
    assert.strictEqual(addedCount, 1, 'Should add Button');
    assert.strictEqual(mergedCatalog.length, 3, 'Total items should be 3 (Alert Dialog, ExistingOnly, Button)');

    // Ensure custom Supernova properties are retained on merged item
    const mergedAlert = mergedCatalog.find((c) => c.nodeId === '3429:327');
    assert.strictEqual(mergedAlert.id, 'supernova-id-1', 'Must preserve original id');
    assert.strictEqual(mergedAlert.brandId, 'brand-uuid-123', 'Must preserve original brandId');
    assert.strictEqual(mergedAlert.hasMitosisDefinition, true, 'Must preserve hasMitosisDefinition');
    assert.strictEqual(mergedAlert.figma.thumbnailUrl, 'https://example.com/alert.png', 'Must supplement figma metadata');

    // Case 2: Merge = false (replace catalog with only new items)
    const noMergeResult = mergeCatalogEntries(existingCatalog, discoveredEntries, false);
    assert.strictEqual(noMergeResult.mergedCatalog.length, 2);
    assert.strictEqual(noMergeResult.addedCount, 2);

    console.log('  ✓ Catalog merging retains custom metadata and prevents duplicate entries\n');
  }

  // -------------------------------------------------------------------------
  // Test 7: importFigmaComponents with Disk Writing & Dry-Run
  // -------------------------------------------------------------------------
  console.log('Test 7: Verify importFigmaComponents execution (dry-run vs active write)');
  {
    const ws = createTempWorkspace();

    try {
      const mockItems = [
        {
          type: 'COMPONENT_SET',
          key: 'set-btn',
          node_id: '1:1',
          name: 'Button',
          description: 'Button component',
        },
        {
          type: 'COMPONENT_SET',
          key: 'set-badge',
          node_id: '2:2',
          name: 'Badge',
          description: 'Badge component',
        },
      ];

      // Step A: Dry Run - file must NOT be written to disk
      const dryResult = await importFigmaComponents({
        out: ws.catalogPath,
        dryRun: true,
        items: mockItems,
        silent: true,
      });

      assert.strictEqual(dryResult.success, true);
      assert.strictEqual(dryResult.counts.finalTotal, 2);
      assert.strictEqual(fs.existsSync(ws.catalogPath), false, 'Dry-run must not create catalog file');

      // Step B: Active Write - file must be written to disk with valid JSON
      const activeResult = await importFigmaComponents({
        out: ws.catalogPath,
        dryRun: false,
        items: mockItems,
        silent: true,
      });

      assert.strictEqual(activeResult.success, true);
      assert.strictEqual(fs.existsSync(ws.catalogPath), true, 'Active run must write catalog file');

      const savedCatalog = JSON.parse(fs.readFileSync(ws.catalogPath, 'utf8'));
      assert.strictEqual(savedCatalog.length, 2);
      assert.strictEqual(savedCatalog[0].name, 'Button');
      assert.strictEqual(savedCatalog[1].name, 'Badge');

      // Step C: Subsequent run with --only and --merge preserves existing Button and Badge
      const newItems = [
        {
          type: 'COMPONENT_SET',
          key: 'set-chk',
          node_id: '3:3',
          name: 'Checkbox',
        },
      ];

      const mergeResult = await importFigmaComponents({
        out: ws.catalogPath,
        dryRun: false,
        items: newItems,
        merge: true,
        silent: true,
      });

      assert.strictEqual(mergeResult.counts.finalTotal, 3);
      const updatedCatalog = JSON.parse(fs.readFileSync(ws.catalogPath, 'utf8'));
      assert.strictEqual(updatedCatalog.length, 3);
      assert(updatedCatalog.some((c) => c.name === 'Button'));
      assert(updatedCatalog.some((c) => c.name === 'Badge'));
      assert(updatedCatalog.some((c) => c.name === 'Checkbox'));
    } finally {
      ws.cleanup();
    }

    console.log('  ✓ Dry-run leaves disk untouched; active run creates and updates valid catalog JSON\n');
  }

  // -------------------------------------------------------------------------
  // Test 8: discoverFigmaComponentSets with Mocked Fetch
  // -------------------------------------------------------------------------
  console.log('Test 8: Verify discoverFigmaComponentSets API endpoints and headers');
  {
    const recordedCalls = [];
    const mockFetch = async (url, options) => {
      recordedCalls.push({ url, options });

      if (url.includes('/component_sets')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            meta: {
              component_sets: [
                {
                  key: 'mock-set-key',
                  node_id: '100:200',
                  name: 'Radio Button',
                  description: 'Select one option',
                },
              ],
            },
          }),
        };
      }

      if (url.includes('/components')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            meta: {
              components: [
                {
                  key: 'mock-standalone-key',
                  node_id: '300:400',
                  name: 'Alert Dialog',
                  containing_frame: { pageName: 'Alert Dialog' },
                },
              ],
            },
          }),
        };
      }

      return { ok: false, status: 404 };
    };

    const discovered = await discoverFigmaComponentSets('customFileKey', 'customToken', {
      fetchFn: mockFetch,
    });

    assert.strictEqual(discovered.length, 2);
    assert.strictEqual(discovered[0].name, 'Radio Button');
    assert.strictEqual(discovered[1].name, 'Alert Dialog');

    // Verify headers and URLs
    assert.strictEqual(recordedCalls.length, 2);
    assert(recordedCalls[0].url.includes('/v1/files/customFileKey/component_sets'));
    assert.strictEqual(recordedCalls[0].options.headers['X-Figma-Token'], 'customToken');
    assert(recordedCalls[1].url.includes('/v1/files/customFileKey/components'));
    assert.strictEqual(recordedCalls[1].options.headers['X-Figma-Token'], 'customToken');

    console.log('  ✓ discoverFigmaComponentSets sends proper X-Figma-Token header and requests endpoints\n');
  }

  // -------------------------------------------------------------------------
  // Test 9: CLI Argument Parsing
  // -------------------------------------------------------------------------
  console.log('Test 9: Verify CLI argument parsing');
  {
    const args = parseCliArgs([
      '--dry-run',
      '--only=Button,Badge',
      '--out=custom.catalog.json',
      '--file=customFileId',
      '--token=testToken123',
      '--no-merge',
      '--no-standalone',
    ]);

    assert.strictEqual(args.dryRun, true);
    assert.strictEqual(args.only, 'Button,Badge');
    assert.strictEqual(args.out, 'custom.catalog.json');
    assert.strictEqual(args.file, 'customFileId');
    assert.strictEqual(args.token, 'testToken123');
    assert.strictEqual(args.merge, false);
    assert.strictEqual(args.includeStandalone, false);

    console.log('  ✓ CLI argument parsing handles all flags properly\n');
  }

  console.log('🎉 All Figma Component Importer Tests Passed Successfully!\n');
})().catch((err) => {
  console.error(`❌ Test failed: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

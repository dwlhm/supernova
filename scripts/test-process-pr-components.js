#!/usr/bin/env node

/**
 * Test & Verification Suite for scripts/process-pr-components.js
 *
 * Verifies:
 * - New component gets generated and added to manifest.
 * - Unchanged component retains existing .lite.tsx file (including custom programmer edits).
 * - Changed component (different hash) overwrites existing file with fresh generated template.
 * - Missing catalog or empty catalog handled gracefully.
 * - Dry-run mode previews actions without disk mutation.
 * - Baseline manifest loading via --base (file path and git fallback).
 * - Deterministic fingerprint computation.
 * - Fixture resolution (e.g. AlertDialog fixture).
 * - CLI invocation and summary report output.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const mitosis = require('@builder.io/mitosis');

const {
  processPrComponents: processPrComponentsWithDependencies,
  computeFingerprint,
  readCatalog,
  normalizeManifest,
  loadBaselineManifest,
  resolveFigmaNode,
  loadEnvFile,
} = require('./process-pr-components');
const { buildCatalog } = require('./fetch-supernova-data');

// Each lifecycle fixture owns its catalog and registry; production contracts
// must not leak into tests that intentionally supply external catalogs.
const processPrComponents = options => processPrComponentsWithDependencies({
  compositionRegistry: path.join(path.dirname(options.catalog), 'components.composition.json'),
  ...options,
});

const rootDir = path.resolve(__dirname, '..');
const fixturesDir = path.join(__dirname, 'fixtures');

console.log('🧪 Running Component PR Drift Detector Tests...\n');

// Helper to create an isolated temporary workspace for tests
function createTempWorkspace() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'supernova-pr-test-'));
  const componentsDir = path.join(tempDir, 'components');
  const catalogPath = path.join(tempDir, 'components.catalog.json');
  const manifestPath = path.join(tempDir, '.components-manifest.json');
  fs.mkdirSync(componentsDir, { recursive: true });

  return {
    tempDir,
    componentsDir,
    catalogPath,
    manifestPath,
    cleanup: () => {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    },
  };
}

(async () => {
  // -------------------------------------------------------------------------
  // Test 1: Deterministic Fingerprint Computation
  // -------------------------------------------------------------------------
  console.log('Test 1: Verify deterministic SHA-256 fingerprint computation');
  {
    const compA = {
      id: 'comp-1',
      name: 'Button',
      description: 'Primary button',
      updatedAt: '2025-01-01T00:00:00Z',
      componentPropertyDefinitions: [
        { name: 'variant', type: 'VARIANT', options: ['primary', 'secondary'] },
        { name: 'disabled', type: 'BOOLEAN', defaultValue: false },
      ],
    };

    const compAClone = JSON.parse(JSON.stringify(compA));
    const hash1 = computeFingerprint(compA);
    const hash2 = computeFingerprint(compAClone);

    assert.strictEqual(hash1, hash2, 'Identical components must yield identical fingerprints');
    assert.strictEqual(typeof hash1, 'string');
    assert.strictEqual(hash1.length, 64, 'SHA-256 fingerprint must be 64 hex characters');

    // Modifying updatedAt changes fingerprint
    const compChangedDate = { ...compA, updatedAt: '2025-02-01T00:00:00Z' };
    assert.notStrictEqual(
      computeFingerprint(compChangedDate),
      hash1,
      'Changing updatedAt must change fingerprint'
    );

    // Modifying property definition changes fingerprint
    const compChangedProps = {
      ...compA,
      componentPropertyDefinitions: [
        ...compA.componentPropertyDefinitions,
        { name: 'size', type: 'VARIANT', options: ['sm', 'lg'] },
      ],
    };
    assert.notStrictEqual(
      computeFingerprint(compChangedProps),
      hash1,
      'Changing property definitions must change fingerprint'
    );

    // Modifying sceneHash changes fingerprint
    const compWithSceneHash = { ...compA, sceneHash: 'scene-hash-xyz' };
    assert.notStrictEqual(
      computeFingerprint(compWithSceneHash),
      hash1,
      'Adding sceneHash must change fingerprint'
    );

    console.log('  ✓ Deterministic SHA-256 fingerprint verified\n');
  }

  // -------------------------------------------------------------------------
  // Test 2 (Criterion a): New component gets generated and added to manifest
  // -------------------------------------------------------------------------
  console.log('Test 2: Verify new component gets generated and added to manifest');
  {
    const ws = createTempWorkspace();
    try {
      const catalogData = [
        {
          id: 'comp-btn',
          name: 'Button',
          description: 'A clickable button component',
          updatedAt: '2025-01-01T00:00:00Z',
          componentPropertyDefinitions: [
            { name: 'label', type: 'TEXT', defaultValue: 'Click Me' },
            { name: 'disabled', type: 'BOOLEAN', defaultValue: false },
          ],
        },
      ];
      fs.writeFileSync(ws.catalogPath, JSON.stringify(catalogData, null, 2), 'utf8');

      const outcome = await processPrComponents({
        catalog: ws.catalogPath,
        manifest: ws.manifestPath,
        componentsDir: ws.componentsDir,
        mock: true,
        silent: true,
      });

      assert.strictEqual(outcome.success, true, 'Process must succeed');
      assert.strictEqual(outcome.summary.new, 1, 'Exactly 1 new component must be reported');
      assert.strictEqual(outcome.summary.updated, 0);
      assert.strictEqual(outcome.summary.preserved, 0);

      // Verify file was generated
      const generatedFile = path.join(ws.componentsDir, 'Button.lite.tsx');
      assert(fs.existsSync(generatedFile), 'Button.lite.tsx must exist on disk');
      const fileContent = fs.readFileSync(generatedFile, 'utf8');
      assert(!fileContent.includes('useStore'), 'Stateless Figma output must not include an unused store');
      assert(fileContent.includes('export interface ButtonProps'));
      assert(fileContent.includes('export default function Button'));

      // Verify Mitosis parseJsx succeeds
      let parsed;
      assert.doesNotThrow(() => {
        parsed = mitosis.parseJsx(fileContent, { typescript: true });
      }, 'Generated .lite.tsx must be valid Mitosis JSX');
      assert.strictEqual(parsed.name, 'Button');

      // Verify manifest was created and contains entry
      assert(fs.existsSync(ws.manifestPath), '.components-manifest.json must exist');
      const manifest = JSON.parse(fs.readFileSync(ws.manifestPath, 'utf8'));
      assert(manifest.components && manifest.components.Button, 'Manifest must have Button entry');
      assert.strictEqual(manifest.components.Button.name, 'Button');
      assert.strictEqual(manifest.components.Button.fingerprint, computeFingerprint(catalogData[0]));
      assert.strictEqual(manifest.components.Button.hash, manifest.components.Button.fingerprint);

      console.log('  ✓ New component generated, valid Mitosis AST verified, manifest updated\n');
    } finally {
      ws.cleanup();
    }
  }

  // -------------------------------------------------------------------------
  // Test 3 (Criterion b): Unchanged component retains existing file & custom edits
  // -------------------------------------------------------------------------
  console.log('Test 3: Verify unchanged component retains existing file and custom programmer edits');
  {
    const ws = createTempWorkspace();
    try {
      const catalogData = [
        {
          id: 'comp-card',
          name: 'Card',
          description: 'A container card component',
          updatedAt: '2025-01-01T00:00:00Z',
          componentPropertyDefinitions: [
            { name: 'title', type: 'TEXT', defaultValue: 'Card Title' },
          ],
        },
      ];
      fs.writeFileSync(ws.catalogPath, JSON.stringify(catalogData, null, 2), 'utf8');

      // Initial run to generate the component and manifest
      await processPrComponents({
        catalog: ws.catalogPath,
        manifest: ws.manifestPath,
        componentsDir: ws.componentsDir,
        mock: true,
        silent: true,
      });

      const cardFile = path.join(ws.componentsDir, 'Card.lite.tsx');
      assert(fs.existsSync(cardFile));

      // Inject custom programmer edits into Card.lite.tsx
      const customComment = '// CUSTOM PROGRAMMER LOGIC - DO NOT OVERWRITE!';
      const customCode = `\n${customComment}\nconst customTracker = (e: any) => console.log('tracked', e);\n`;
      const originalCode = fs.readFileSync(cardFile, 'utf8');
      fs.writeFileSync(cardFile, customCode + originalCode, 'utf8');

      // Second run: catalog is UNCHANGED
      const secondOutcome = await processPrComponents({
        catalog: ws.catalogPath,
        manifest: ws.manifestPath,
        componentsDir: ws.componentsDir,
        mock: true,
        silent: true,
      });

      assert.strictEqual(secondOutcome.success, true);
      assert.strictEqual(secondOutcome.summary.new, 0, 'No new components');
      assert.strictEqual(secondOutcome.summary.updated, 0, 'No updated components');
      assert.strictEqual(secondOutcome.summary.preserved, 1, 'Card component must be preserved');

      // Verify custom programmer edits remain intact
      const preservedContent = fs.readFileSync(cardFile, 'utf8');
      assert(preservedContent.includes(customComment), 'Custom programmer comment must be retained');
      assert(preservedContent.includes('customTracker'), 'Custom programmer code must be retained');

      // Verify manifest retains the same fingerprint
      const manifest = JSON.parse(fs.readFileSync(ws.manifestPath, 'utf8'));
      assert.strictEqual(manifest.components.Card.fingerprint, computeFingerprint(catalogData[0]));

      console.log('  ✓ Unchanged component retained existing file with custom programmer modifications\n');
    } finally {
      ws.cleanup();
    }
  }

  // -------------------------------------------------------------------------
  // Test 4 (Criterion c): Changed component overwrites existing file with fresh template
  // -------------------------------------------------------------------------
  console.log('Test 4: Verify changed component (drift) overwrites existing file with fresh template');
  {
    const ws = createTempWorkspace();
    try {
      const initialCatalog = [
        {
          id: 'comp-input',
          name: 'Input',
          description: 'Basic input',
          updatedAt: '2025-01-01T00:00:00Z',
          componentPropertyDefinitions: [
            { name: 'placeholder', type: 'TEXT', defaultValue: 'Enter text' },
          ],
        },
      ];
      fs.writeFileSync(ws.catalogPath, JSON.stringify(initialCatalog, null, 2), 'utf8');

      // Initial run
      await processPrComponents({
        catalog: ws.catalogPath,
        manifest: ws.manifestPath,
        componentsDir: ws.componentsDir,
        mock: true,
        silent: true,
      });

      const inputFile = path.join(ws.componentsDir, 'Input.lite.tsx');
      assert(fs.existsSync(inputFile));

      // Inject custom code
      const customCodeMarker = '/* CUSTOM DEVELOPER CODE THAT SHOULD BE OVERWRITTEN */';
      fs.writeFileSync(inputFile, `${customCodeMarker}\n${fs.readFileSync(inputFile, 'utf8')}`, 'utf8');
      assert(fs.readFileSync(inputFile, 'utf8').includes(customCodeMarker));

      // Now introduce drift in catalog: update updatedAt and add new property
      const updatedCatalog = [
        {
          id: 'comp-input',
          name: 'Input',
          description: 'Updated input with helper text',
          updatedAt: '2025-03-01T12:00:00Z',
          componentPropertyDefinitions: [
            { name: 'placeholder', type: 'TEXT', defaultValue: 'Enter text' },
            { name: 'helperText', type: 'TEXT', defaultValue: 'Required field' },
            { name: 'isInvalid', type: 'BOOLEAN', defaultValue: false },
          ],
        },
      ];
      fs.writeFileSync(ws.catalogPath, JSON.stringify(updatedCatalog, null, 2), 'utf8');

      const driftOutcome = await processPrComponents({
        catalog: ws.catalogPath,
        manifest: ws.manifestPath,
        componentsDir: ws.componentsDir,
        mock: true,
        silent: true,
      });

      assert.strictEqual(driftOutcome.success, true);
      assert.strictEqual(driftOutcome.summary.new, 0);
      assert.strictEqual(driftOutcome.summary.updated, 1, 'Input component must be reported as updated');
      assert.strictEqual(driftOutcome.summary.preserved, 0);

      // Verify custom code was overwritten by fresh generated template
      const overwrittenContent = fs.readFileSync(inputFile, 'utf8');
      assert(
        !overwrittenContent.includes(customCodeMarker),
        'Custom developer code must be overwritten when design changes'
      );
      assert(overwrittenContent.includes('helperText?: string;'), 'Generated code must include new helperText prop');
      assert(overwrittenContent.includes('isInvalid?: boolean;'), 'Generated code must include new isInvalid prop');

      // Verify manifest has updated fingerprint
      const newManifest = JSON.parse(fs.readFileSync(ws.manifestPath, 'utf8'));
      const expectedFingerprint = computeFingerprint(updatedCatalog[0]);
      assert.strictEqual(newManifest.components.Input.fingerprint, expectedFingerprint);

      // Verify Mitosis parseJsx parses the regenerated file
      assert.doesNotThrow(() => {
        mitosis.parseJsx(overwrittenContent, { typescript: true });
      });

      console.log('  ✓ Drift detected, programmer custom code overwritten with fresh template, manifest updated\n');
    } finally {
      ws.cleanup();
    }
  }

  // -------------------------------------------------------------------------
  // Test 5 (Criterion d): Missing catalog or empty catalog handled gracefully
  // -------------------------------------------------------------------------
  console.log('Test 5: Verify missing catalog and empty catalog handled gracefully');
  {
    const ws = createTempWorkspace();
    try {
      // 5a: Missing catalog file
      const nonExistentCatalog = path.join(ws.tempDir, 'does-not-exist.json');
      const missingOutcome = await processPrComponents({
        catalog: nonExistentCatalog,
        manifest: ws.manifestPath,
        componentsDir: ws.componentsDir,
        mock: true,
        silent: true,
      });

      assert.strictEqual(missingOutcome.success, true, 'Must exit cleanly when catalog is missing');
      assert.strictEqual(missingOutcome.summary.total, 0, 'Total components must be 0');
      assert.strictEqual(missingOutcome.results.length, 0);

      // 5b: Empty catalog array
      fs.writeFileSync(ws.catalogPath, JSON.stringify([], null, 2), 'utf8');
      const emptyOutcome = await processPrComponents({
        catalog: ws.catalogPath,
        manifest: ws.manifestPath,
        componentsDir: ws.componentsDir,
        mock: true,
        silent: true,
      });

      assert.strictEqual(emptyOutcome.success, true, 'Must exit cleanly when catalog is empty array');
      assert.strictEqual(emptyOutcome.summary.total, 0);

      // 5c: Empty catalog object { components: [] }
      fs.writeFileSync(ws.catalogPath, JSON.stringify({ components: [] }, null, 2), 'utf8');
      const emptyObjOutcome = await processPrComponents({
        catalog: ws.catalogPath,
        manifest: ws.manifestPath,
        componentsDir: ws.componentsDir,
        mock: true,
        silent: true,
      });

      assert.strictEqual(emptyObjOutcome.success, true, 'Must exit cleanly when components array is empty');
      assert.strictEqual(emptyObjOutcome.summary.total, 0);

      console.log('  ✓ Missing catalog and empty catalog handled gracefully without error\n');
    } finally {
      ws.cleanup();
    }
  }

  // -------------------------------------------------------------------------
  // Test 6: Verify --dry-run mode previews actions without modifying disk
  // -------------------------------------------------------------------------
  console.log('Test 6: Verify --dry-run previews actions without writing files to disk');
  {
    const ws = createTempWorkspace();
    try {
      const catalogData = [
        {
          id: 'comp-badge',
          name: 'Badge',
          description: 'Badge tag',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ];
      fs.writeFileSync(ws.catalogPath, JSON.stringify(catalogData, null, 2), 'utf8');

      const outcome = await processPrComponents({
        catalog: ws.catalogPath,
        manifest: ws.manifestPath,
        componentsDir: ws.componentsDir,
        dryRun: true,
        mock: true,
        silent: true,
      });

      assert.strictEqual(outcome.success, true);
      assert.strictEqual(outcome.summary.new, 1, 'Should preview 1 new component');

      // Verify NO files were written
      const badgeFile = path.join(ws.componentsDir, 'Badge.lite.tsx');
      assert(!fs.existsSync(badgeFile), 'Badge.lite.tsx must NOT be created in dry-run mode');
      assert(!fs.existsSync(ws.manifestPath), '.components-manifest.json must NOT be created in dry-run mode');

      console.log('  ✓ Dry run preview completed without any disk mutation\n');
    } finally {
      ws.cleanup();
    }
  }

  // -------------------------------------------------------------------------
  // Test 7: Verify baseline manifest via --base
  // -------------------------------------------------------------------------
  console.log('Test 7: Verify baseline manifest loading via --base (file path and fallback)');
  {
    const ws = createTempWorkspace();
    try {
      // Create an external baseline manifest
      const baseManifestPath = path.join(ws.tempDir, 'baseline-manifest.json');
      const baseData = {
        version: '1.0.0',
        components: {
          Button: {
            name: 'Button',
            fingerprint: 'prior-base-fingerprint-12345',
            file: 'components/Button.lite.tsx',
          },
        },
      };
      fs.writeFileSync(baseManifestPath, JSON.stringify(baseData, null, 2), 'utf8');

      // Test loading baseline directly
      const loaded = loadBaselineManifest(ws.manifestPath, baseManifestPath);
      assert(loaded.components.Button, 'Baseline must load Button entry');
      assert.strictEqual(loaded.components.Button.fingerprint, 'prior-base-fingerprint-12345');

      // Test git fallback with nonexistent git ref falls back gracefully to local manifest
      const fallback = loadBaselineManifest(ws.manifestPath, 'non-existent-branch-ref-999');
      assert(fallback && typeof fallback.components === 'object', 'Fallback must return valid manifest');

      console.log('  ✓ Baseline manifest loaded from file and handled fallback gracefully\n');
    } finally {
      ws.cleanup();
    }
  }

  // -------------------------------------------------------------------------
  // Test 8: Verify fixture integration with AlertDialog fixture
  // -------------------------------------------------------------------------
  console.log('Test 8: Verify local fixture integration (AlertDialog.figma.json)');
  {
    const ws = createTempWorkspace();
    try {
      const catalogData = [
        {
          id: 'comp-alert-dialog',
          name: 'AlertDialog',
          description: 'A modal alert dialog',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ];
      fs.writeFileSync(ws.catalogPath, JSON.stringify(catalogData, null, 2), 'utf8');

      const outcome = await processPrComponents({
        catalog: ws.catalogPath,
        manifest: ws.manifestPath,
        componentsDir: ws.componentsDir,
        fixturesDir,
        mock: true,
        silent: true,
      });

      assert.strictEqual(outcome.success, true);
      assert.strictEqual(outcome.summary.new, 1);

      const alertFile = path.join(ws.componentsDir, 'AlertDialog.lite.tsx');
      assert(fs.existsSync(alertFile), 'AlertDialog.lite.tsx must be generated');

      const alertCode = fs.readFileSync(alertFile, 'utf8');
      assert(alertCode.includes('export interface AlertDialogProps'));
      assert(alertCode.includes('variant?: "default" | "danger" | "warning";'));
      assert(alertCode.includes('showIcon?: boolean;'));

      const parsedAst = mitosis.parseJsx(alertCode, { typescript: true });
      assert.strictEqual(parsedAst.name, 'AlertDialog');

      console.log('  ✓ Local fixture resolved, full props and AST verified\n');
    } finally {
      ws.cleanup();
    }
  }

  // -------------------------------------------------------------------------
  // Test 9: CLI Execution via child_process
  // -------------------------------------------------------------------------
  console.log('Test 9: Verify CLI invocation of scripts/process-pr-components.js');
  {
    const ws = createTempWorkspace();
    try {
      const catalogData = [
        {
          id: 'comp-modal',
          name: 'Modal',
          description: 'A popup modal component',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ];
      fs.writeFileSync(ws.catalogPath, JSON.stringify(catalogData, null, 2), 'utf8');

      const scriptPath = path.join(__dirname, 'process-pr-components.js');
      const cmd = `node "${scriptPath}" --catalog="${ws.catalogPath}" --manifest="${ws.manifestPath}" --components-dir="${ws.componentsDir}" --composition-registry="${path.join(ws.tempDir, 'components.composition.json')}" --mock`;

      const stdout = execSync(cmd, { encoding: 'utf8' });

      assert(stdout.includes('Component PR Drift Detection Summary'), 'CLI must output summary header');
      assert(stdout.includes('[NEW]'), 'CLI must report NEW action for Modal');
      assert(stdout.includes('Modal'), 'CLI must list component Modal');

      // Verify files generated on disk
      assert(fs.existsSync(path.join(ws.componentsDir, 'Modal.lite.tsx')));
      assert(fs.existsSync(ws.manifestPath));

      console.log('  ✓ CLI execution completed cleanly with exit code 0 and summary report\n');
    } finally {
      ws.cleanup();
    }
  }

  // -------------------------------------------------------------------------
  // Test 10: Automatic .env loading
  // -------------------------------------------------------------------------
  console.log('Test 10: Verify automatic .env loading');
  {
    const ws = createTempWorkspace();
    try {
      const testEnvPath = path.join(ws.tempDir, '.env.test');
      fs.writeFileSync(
        testEnvPath,
        '# Comment line\nTEST_VAR_A=hello_world\nTEST_VAR_B="quoted_val"\nTEST_VAR_C=\'single_quoted\'\n',
        'utf8'
      );

      loadEnvFile(testEnvPath);
      assert.strictEqual(process.env.TEST_VAR_A, 'hello_world');
      assert.strictEqual(process.env.TEST_VAR_B, 'quoted_val');
      assert.strictEqual(process.env.TEST_VAR_C, 'single_quoted');

      // Verify node scripts/process-pr-components.js picks up .env from repo root
      const scriptPath = path.join(__dirname, 'process-pr-components.js');
      const checkCmd = `node -e "require('${scriptPath.replace(/\\/g, '/')}'); if (!process.env.FIGMA_ACCESS_TOKEN) process.exit(1); console.log('OK');"`;
      const output = execSync(checkCmd, { cwd: rootDir, encoding: 'utf8' });
      assert(output.includes('OK'), 'scripts/process-pr-components.js must load .env from repo root');

      console.log('  ✓ Automatic .env loading and parser verified\n');
    } finally {
      ws.cleanup();
    }
  }

  // -------------------------------------------------------------------------
  // Test 11: Supernova data fetch catalog building
  // -------------------------------------------------------------------------
  console.log('Test 11: Verify buildCatalog links components with designComponents');
  {
    const sampleComponents = [
      {
        id: 'comp-btn-1',
        name: 'Button',
        description: 'Button component',
        brandId: 'brand-1',
        properties: [
          { id: 'prop-figma', codeName: 'figmaComponent', linkElementType: 'FigmaComponent' },
          { id: 'prop-mitosis', codeName: 'mitosisDefinition', propertyType: 'Text' },
        ],
        propertyValues: {
          'prop-figma': 'design-btn-1',
          'prop-mitosis': JSON.stringify({
            schemaVersion: 1,
            properties: [],
          }),
        },
      },
      {
        id: 'comp-icon-1',
        name: 'Icon',
        description: 'Icon component without designComponent link',
        properties: [],
      },
    ];

    const sampleDesignComponents = [
      {
        id: 'design-btn-1',
        name: 'Button',
        origin: {
          fileId: 'figma-file-xyz',
          nodeId: '100:200',
          sourceId: 'src-1',
        },
        componentPropertyDefinitions: [
          { id: 'figma-prop-1', name: 'variant', type: 'VARIANT', defaultValue: 'primary' },
        ],
        updatedAt: '2025-01-01T12:00:00Z',
      },
    ];

    const catalog = buildCatalog(sampleComponents, sampleDesignComponents);
    assert.strictEqual(catalog.length, 2, 'Catalog must contain 2 entries');

    const btnCatalog = catalog.find((c) => c.name === 'Button');
    assert(btnCatalog, 'Button must be in catalog');
    assert.strictEqual(btnCatalog.fileId, 'figma-file-xyz');
    assert.strictEqual(btnCatalog.nodeId, '100:200');
    assert.strictEqual(btnCatalog.hasMitosisDefinition, true);
    assert(btnCatalog.figma, 'Button must have figma origin');
    assert.strictEqual(btnCatalog.figma.fileId, 'figma-file-xyz');
    assert.strictEqual(btnCatalog.figma.nodeId, '100:200');
    assert.strictEqual(btnCatalog.componentPropertyDefinitions.length, 1);
    assert.strictEqual(btnCatalog.componentPropertyDefinitions[0].codeName, 'variant');

    const iconCatalog = catalog.find((c) => c.name === 'Icon');
    assert(iconCatalog, 'Icon must be in catalog');
    assert.strictEqual(iconCatalog.fileId, null);
    assert.strictEqual(iconCatalog.nodeId, null);
    assert.strictEqual(iconCatalog.hasMitosisDefinition, false);
    assert.strictEqual(iconCatalog.figma, null);

    console.log('  ✓ buildCatalog correctly links components and extracts Figma origin\n');
  }

  // -------------------------------------------------------------------------
  // Test 12: resolveFigmaNode batch cache lookup
  // -------------------------------------------------------------------------
  console.log('Test 12: Verify resolveFigmaNode utilizes batch nodeCache');
  {
    const cachedDoc = { id: '55:99', name: 'CachedComponent', type: 'COMPONENT', children: [] };
    const mockCache = {
      '55:99': {
        document: cachedDoc,
        componentSets: {
          '55:99': {
            componentPropertyDefinitions: [{ name: 'size', type: 'VARIANT' }],
          },
        },
      },
    };

    const component = {
      name: 'CachedComponent',
      fileId: 'fileXYZ',
      nodeId: '55:99',
    };

    const resolved = await resolveFigmaNode(component, { nodeCache: mockCache });
    assert.strictEqual(resolved.id, '55:99');
    assert.strictEqual(resolved.name, 'CachedComponent');
    assert.deepStrictEqual(resolved.componentPropertyDefinitions, [{ name: 'size', type: 'VARIANT' }]);

    console.log('  ✓ resolveFigmaNode successfully resolves from batch nodeCache with metadata\n');
  }

  console.log('🎉 All Component PR Drift Detector tests passed successfully!\n');
})().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});

// @ts-check
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/** @typedef {import('../src/index.js').ExtractionRequest} ExtractionRequest */
/** @typedef {import('../src/index.js').ExtractionResponse} ExtractionResponse */
/** @typedef {import('../src/index.js').JobResponse} JobResponse */
/** @typedef {import('../src/index.js').Framework} Framework */
/** @typedef {import('../src/index.js').PublisherType} PublisherType */
/** @typedef {import('../src/index.js').JobStatus} JobStatus */
/** @typedef {import('../src/index.js').ComponentStatus} ComponentStatus */
/** @typedef {import('../src/index.js').FigmaDocument} FigmaDocument */
/** @typedef {import('../src/index.js').FigmaComponentSpec} FigmaComponentSpec */
/** @typedef {import('../src/index.js').FigmaColor} FigmaColor */
/** @typedef {import('../src/index.js').ErrorResponse} ErrorResponse */
/** @typedef {import('../src/index.js').HealthResponse} HealthResponse */

describe('Contracts Schema & Serialization', () => {
  it('constructs and round-trips a valid ExtractionRequest matching schema typings', () => {
    /** @type {ExtractionRequest} */
    const request = {
      document: {
        name: 'Design System Production',
        version: '2.0.0',
        lastModified: '2025-02-28T12:00:00.000Z',
        tokens: [
          {
            id: 'tok-color-primary',
            name: 'color.brand.primary',
            type: 'color',
            value: { r: 0.1, g: 0.5, b: 0.9, a: 1.0 },
            description: 'Primary brand palette color',
          },
          {
            id: 'tok-space-sm',
            name: 'spacing.sm',
            type: 'spacing',
            value: 8,
          },
        ],
        components: [
          {
            id: 'comp-101',
            name: 'Button',
            key: 'btn-key-abc',
            description: 'Core clickable button component',
            componentSetName: 'ButtonVariants',
            pageName: 'Components',
            properties: {
              variant: 'outline',
              size: 'medium',
              disabled: false,
            },
            node: {
              id: '1:2',
              name: 'Button',
              type: 'COMPONENT',
              layoutMode: 'HORIZONTAL',
              paddingLeft: 16,
              paddingRight: 16,
              children: [
                {
                  id: '1:3',
                  name: 'Label',
                  type: 'TEXT',
                  characters: 'Button Text',
                },
              ],
            },
          },
        ],
      },
      targets: ['react', 'svelte', 'vue3', 'vue2', 'angular'],
      publishers: ['download', 'pull_request'],
      options: {
        prTitle: 'chore: sync tokens & components from Figma',
        branchName: 'supernova/sync-tokens-2025',
      },
    };

    const jsonString = JSON.stringify(request);
    /** @type {ExtractionRequest} */
    const parsed = JSON.parse(jsonString);

    assert.equal(parsed.document.name, 'Design System Production');
    assert.equal(parsed.document.version, '2.0.0');
    assert.equal(parsed.document.tokens.length, 2);
    assert.equal(parsed.document.tokens[0]?.name, 'color.brand.primary');
    assert.equal(parsed.document.components.length, 1);
    assert.equal(parsed.document.components[0]?.name, 'Button');
    assert.equal(parsed.document.components[0]?.pageName, 'Components');
    assert.equal(parsed.document.components[0]?.node?.['type'], 'COMPONENT');
    assert.deepEqual(parsed.targets, ['react', 'svelte', 'vue3', 'vue2', 'angular']);
    assert.deepEqual(parsed.publishers, ['download', 'pull_request']);
    assert.equal(parsed.options?.prTitle, 'chore: sync tokens & components from Figma');
    assert.equal(parsed.options?.branchName, 'supernova/sync-tokens-2025');
  });

  it('constructs and round-trips a valid JobResponse matching schema typings', () => {
    /** @type {JobResponse} */
    const response = {
      jobId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      status: 'succeeded',
      targets: ['react', 'vue3'],
      publishers: ['download', 'pull_request'],
      components: [
        {
          name: 'Button',
          status: 'done',
          group: 'components',
        },
        {
          name: 'Badge',
          status: 'failed',
          group: 'components',
          stageError: {
            stage: 'compiling',
            message: 'Vue3 SFC compiler syntax error in template',
          },
        },
      ],
      publishResults: {
        downloadUrl: 'https://downloads.supernova.dev/artifacts/f47ac10b.zip',
        pullRequestUrl: 'https://github.com/my-org/ui-kit/pull/101',
      },
      error: {
        stage: 'compiling',
        message: 'Partial failure during framework compilation',
      },
      createdAt: '2025-02-28T12:00:00.000Z',
      updatedAt: '2025-02-28T12:05:00.000Z',
    };

    const jsonString = JSON.stringify(response);
    /** @type {JobResponse} */
    const parsed = JSON.parse(jsonString);

    assert.equal(parsed.jobId, 'f47ac10b-58cc-4372-a567-0e02b2c3d479');
    assert.equal(parsed.status, 'succeeded');
    assert.deepEqual(parsed.targets, ['react', 'vue3']);
    assert.deepEqual(parsed.publishers, ['download', 'pull_request']);
    assert.equal(parsed.components.length, 2);
    assert.equal(parsed.components[0]?.name, 'Button');
    assert.equal(parsed.components[0]?.status, 'done');
    assert.equal(parsed.components[0]?.group, 'components');
    assert.equal(parsed.components[1]?.name, 'Badge');
    assert.equal(parsed.components[1]?.status, 'failed');
    assert.equal(parsed.components[1]?.group, 'components');
    assert.equal(parsed.components[1]?.stageError?.stage, 'compiling');
    assert.equal(parsed.publishResults?.downloadUrl, 'https://downloads.supernova.dev/artifacts/f47ac10b.zip');
    assert.equal(parsed.publishResults?.pullRequestUrl, 'https://github.com/my-org/ui-kit/pull/101');
    assert.equal(parsed.error?.stage, 'compiling');
    assert.equal(parsed.createdAt, '2025-02-28T12:00:00.000Z');
    assert.equal(parsed.updatedAt, '2025-02-28T12:05:00.000Z');
  });

  it('constructs and round-trips ExtractionResponse, ErrorResponse, and HealthResponse', () => {
    /** @type {ExtractionResponse} */
    const extraction = {
      jobId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'queued',
      createdAt: '2025-02-28T12:00:00.000Z',
    };
    const parsedExtraction = JSON.parse(JSON.stringify(extraction));
    assert.equal(parsedExtraction.jobId, extraction.jobId);
    assert.equal(parsedExtraction.status, extraction.status);

    /** @type {ErrorResponse} */
    const err = {
      code: 'UNAUTHORIZED',
      message: 'Missing or invalid authentication token',
      details: { attemptedPath: '/v1/extractions' },
    };
    const parsedErr = JSON.parse(JSON.stringify(err));
    assert.equal(parsedErr.code, 'UNAUTHORIZED');
    assert.equal(parsedErr.message, 'Missing or invalid authentication token');
    assert.equal(parsedErr.details?.attemptedPath, '/v1/extractions');

    /** @type {HealthResponse} */
    const health = {
      status: 'healthy',
      version: '1.0.0',
    };
    const parsedHealth = JSON.parse(JSON.stringify(health));
    assert.equal(parsedHealth.status, 'healthy');
    assert.equal(parsedHealth.version, '1.0.0');
  });

  it('verifies valid enum values match specification', () => {
    /** @type {Framework[]} */
    const frameworks = ['react', 'svelte', 'vue3', 'vue2', 'angular'];
    assert.equal(frameworks.length, 5);

    /** @type {PublisherType[]} */
    const publishers = ['download', 'pull_request'];
    assert.equal(publishers.length, 2);

    /** @type {JobStatus[]} */
    const jobStatuses = ['queued', 'authoring', 'compiling', 'publishing', 'succeeded', 'failed'];
    assert.equal(jobStatuses.length, 6);

    /** @type {ComponentStatus[]} */
    const componentStatuses = ['pending', 'authoring', 'compiling', 'done', 'failed'];
    assert.equal(componentStatuses.length, 5);
  });
});

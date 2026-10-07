/**
 * Mock Supernova SDK for local development without connecting to Supernova Cloud.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_DATA_DIR = path.join(__dirname, 'data');

/**
 * Deep clone utility
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Load mock fixtures from disk
 */
function loadMockData(customDir) {
  const dataDir = customDir || DEFAULT_DATA_DIR;
  const tokensPath = path.join(dataDir, 'tokens.json');
  const groupsPath = path.join(dataDir, 'token-groups.json');
  const themesPath = path.join(dataDir, 'themes.json');
  const componentsPath = path.join(dataDir, 'components.json');

  const tokens = fs.existsSync(tokensPath) ? JSON.parse(fs.readFileSync(tokensPath, 'utf-8')) : [];
  const groups = fs.existsSync(groupsPath) ? JSON.parse(fs.readFileSync(groupsPath, 'utf-8')) : [];
  const themes = fs.existsSync(themesPath) ? JSON.parse(fs.readFileSync(themesPath, 'utf-8')) : [];
  const components = fs.existsSync(componentsPath) ? JSON.parse(fs.readFileSync(componentsPath, 'utf-8')) : [];

  return { tokens, groups, themes, components };
}

/**
 * Mock AreaTokens implementing the Supernova SDK tokens API used by exporters
 */
class MockAreaTokens {
  constructor(tokens, groups, themes) {
    this._tokens = tokens;
    this._groups = groups;
    this._themes = themes;
  }

  async getTokens(_remoteVersionIdentifier, filter) {
    let result = deepClone(this._tokens);
    if (filter?.type) {
      result = result.filter(t => t.tokenType.toLowerCase() === filter.type.toLowerCase());
    }
    return result;
  }

  async getTokenGroups(_remoteVersionIdentifier, _filter) {
    return deepClone(this._groups);
  }

  async getTokenThemes(_remoteVersionIdentifier, _filter) {
    return deepClone(this._themes);
  }

  async computeTokensByApplyingThemes(allTokens, tokensOrThemes, themes) {
    const baseTokens = themes === undefined ? allTokens : tokensOrThemes;
    const appliedThemes = themes === undefined ? tokensOrThemes : themes;
    if (!appliedThemes || appliedThemes.length === 0) {
      return baseTokens;
    }

    const clonedTokens = deepClone(baseTokens);

    for (const theme of appliedThemes) {
      const overrides = theme.overrides || {};
      for (const token of clonedTokens) {
        if (overrides[token.id]) {
          const overrideData = overrides[token.id];
          // If the override is an object with a .value property, use it; otherwise the object itself is the value
          token.value = overrideData.value !== undefined ? overrideData.value : overrideData;
        }
      }
    }

    return clonedTokens;
  }
}

/**
 * Mock AreaComponents for potential component inspection
 */
class MockAreaComponents {
  constructor(components = []) {
    this._components = components;
  }

  async getComponents(_remoteVersionIdentifier, filter) {
    return deepClone(this._components).map(component => ({
      id: component.id, name: component.name, description: component.description || '', brandId: component.brandId || 'mock-brand',
      properties: [{ id: 'mock-mitosis-definition', codeName: 'mitosisDefinition', propertyType: 'Text' }],
      propertyValues: { 'mock-mitosis-definition': JSON.stringify({ schemaVersion: 1, properties: component.properties, behaviors: component.behaviors, root: component.root }) }
    })).filter(component => !filter?.brandId || component.brandId === filter.brandId);
  }

  async getDesignComponents(_remoteVersionIdentifier) {
    return [];
  }
}

/**
 * Mock Supernova instance mimicking @supernovaio/sdk-exporters Supernova class
 */
class MockSupernova {
  constructor(options = {}) {
    const { tokens, groups, themes, components } = loadMockData(options.dataDir);
    this.tokens = new MockAreaTokens(options.tokens || tokens, options.groups || groups, options.themes || themes);
    this.components = new MockAreaComponents(options.components || components);
  }
}

/**
 * Create a mock PulsarContext object
 */
function createMockContext(options = {}) {
  const themeId = options.themeId || null;
  return {
    executor: 'local',
    wsId: options.wsId || 'mock-workspace-id',
    dsId: options.dsId || 'mock-design-system-id',
    versionId: options.versionId || 'mock-version-id',
    brandId: options.brandId || null,
    themeId: themeId,
    themeIds: themeId ? [themeId] : null,
    contextIds: null,
    isPreview: options.isPreview ?? false
  };
}

module.exports = {
  MockSupernova,
  MockAreaTokens,
  MockAreaComponents,
  createMockContext,
  loadMockData
};

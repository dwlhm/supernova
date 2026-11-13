<template>
  <div class="vp-raw tokens-explorer">
    <div class="tokens-toolbar">
      <div class="tokens-tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="tokens-tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span class="tokens-tab-badge">{{ tab.count }}</span>
        </button>
      </div>
      <div class="tokens-search-wrap">
        <input
          v-model="query"
          type="search"
          placeholder="Cari token (mis. primary, chart, brand, heading, radius, shadow)..."
          class="tokens-search-input"
        />
      </div>
    </div>

    <div v-if="copiedText" class="tokens-copied-banner">
      Disalin ke clipboard: <code>{{ copiedText }}</code>
    </div>

    <!-- 1. COLORS -->
    <section v-if="activeTab === 'all' || activeTab === 'colors'" class="tokens-section">
      <div v-for="grp in filteredColorGroups" :key="grp.name" class="tokens-group">
        <div class="tokens-group-header">
          <h3 class="tokens-group-title">{{ grp.name }}</h3>
          <span class="tokens-group-count">{{ grp.items.length }} tokens</span>
        </div>
        <div class="tokens-color-grid">
          <div v-for="c in grp.items" :key="c.slug" class="token-color-card">
            <div class="token-swatch-pair">
              <div class="token-swatch" :style="{ backgroundColor: c.lightValue }" title="Light Mode">
                <span class="token-swatch-badge light">☀️ {{ c.lightHex }}</span>
              </div>
              <div class="token-swatch" :style="{ backgroundColor: c.darkValue }" title="Dark Mode">
                <span class="token-swatch-badge dark">🌙 {{ c.darkHex }}</span>
              </div>
            </div>
            <div class="token-card-body">
              <div class="token-card-title">{{ c.slug }}</div>
              <div class="token-card-rgb">{{ c.lightValue }}</div>
              <div class="token-chip-row">
                <button type="button" class="token-copy-chip primary" @click="copyToken(c.bgClass)" title="Klik untuk copy Tailwind bg class">
                  {{ c.bgClass }}
                </button>
                <button type="button" class="token-copy-chip" @click="copyToken(c.textClass)" title="Klik untuk copy Tailwind text class">
                  {{ c.textClass }}
                </button>
                <button type="button" class="token-copy-chip" @click="copyToken(c.borderClass)" title="Klik untuk copy Tailwind border class">
                  {{ c.borderClass }}
                </button>
                <button type="button" class="token-copy-chip var" @click="copyToken(c.cssVar)" title="Klik untuk copy CSS Variable">
                  {{ c.cssVar }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. TYPOGRAPHY -->
    <section v-if="(activeTab === 'all' || activeTab === 'typography') && filteredTypography.length > 0" class="tokens-section">
      <div class="tokens-group-header">
        <h3 class="tokens-group-title">Typography Scale (Plus Jakarta Sans)</h3>
        <span class="tokens-group-count">{{ filteredTypography.length }} styles</span>
      </div>
      <div class="tokens-typo-list">
        <div v-for="t in filteredTypography" :key="t.id" class="token-typo-card">
          <div class="token-typo-meta">
            <span class="token-typo-label">{{ t.label }}</span>
            <div class="token-typo-specs">
              <span>Size: <strong>{{ t.fontSize }}</strong></span>
              <span>Line: <strong>{{ t.lineHeight }}</strong></span>
              <span>Weight: <strong>{{ t.fontWeight }}</strong></span>
              <span>Tracking: <strong>{{ t.letterSpacing }}</strong></span>
            </div>
            <div class="token-chip-row">
              <button v-for="v in t.cssVars" :key="v" type="button" class="token-copy-chip var" @click="copyToken(v)">
                {{ v }}
              </button>
            </div>
          </div>
          <div
            class="token-typo-preview"
            :style="{ fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: t.fontWeight, letterSpacing: t.letterSpacing }"
          >
            {{ t.sample }}
          </div>
        </div>
      </div>
    </section>

    <!-- 3. RADIUS & SIZING -->
    <section v-if="activeTab === 'all' || activeTab === 'sizing'" class="tokens-section">
      <div v-if="filteredRadius.length > 0" class="tokens-group">
        <div class="tokens-group-header">
          <h3 class="tokens-group-title">Border Radius</h3>
          <span class="tokens-group-count">{{ filteredRadius.length }} tokens</span>
        </div>
        <div class="tokens-radius-grid">
          <div v-for="r in filteredRadius" :key="r.slug" class="token-radius-card">
            <div class="token-radius-box" :style="{ borderRadius: r.value }" />
            <div class="token-card-title">{{ r.value }}</div>
            <div class="token-chip-row">
              <button type="button" class="token-copy-chip primary" @click="copyToken(r.twClass)">{{ r.twClass }}</button>
              <button type="button" class="token-copy-chip var" @click="copyToken(r.cssVar)">{{ r.cssVar }}</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredSizing.length > 0" class="tokens-group">
        <div class="tokens-group-header">
          <h3 class="tokens-group-title">Control Heights & Spacing Scale</h3>
          <span class="tokens-group-count">{{ filteredSizing.length }} tokens</span>
        </div>
        <div class="tokens-sizing-list">
          <div v-for="s in filteredSizing" :key="s.cssVar" class="token-sizing-row">
            <div class="token-sizing-info">
              <span class="token-card-title">{{ s.label }}</span>
              <button type="button" class="token-copy-chip var" @click="copyToken(s.cssVar)">{{ s.cssVar }}</button>
            </div>
            <div class="token-sizing-bar-wrap">
              <div class="token-sizing-bar" :style="{ width: `${Math.min(100, Math.max(4, s.pxNumber))}%` }" />
              <span class="token-sizing-val">{{ s.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. SHADOWS & FOCUS RINGS -->
    <section v-if="(activeTab === 'all' || activeTab === 'shadows') && filteredShadows.length > 0" class="tokens-section">
      <div class="tokens-group-header">
        <h3 class="tokens-group-title">Elevation Shadows & Focus Rings</h3>
        <span class="tokens-group-count">{{ filteredShadows.length }} tokens</span>
      </div>
      <div class="tokens-shadow-grid">
        <div v-for="sh in filteredShadows" :key="sh.slug" class="token-shadow-card">
          <div class="token-shadow-preview-stage">
            <div class="token-shadow-surface" :style="{ boxShadow: sh.value }">
              <span>{{ sh.label }}</span>
            </div>
          </div>
          <div class="token-card-body">
            <div class="token-card-rgb">{{ sh.note }}</div>
            <div class="token-chip-row">
              <button type="button" class="token-copy-chip primary" @click="copyToken(sh.twClass)">{{ sh.twClass }}</button>
              <button type="button" class="token-copy-chip var" @click="copyToken(sh.cssVar)">{{ sh.cssVar }}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  COLOR_GROUP_ORDER,
  colorTokens,
  radiusTokens,
  shadowTokens,
  sizingTokens,
  typographySpecimens,
} from './tokens-catalog-data';

const activeTab = ref<'all' | 'colors' | 'typography' | 'sizing' | 'shadows'>('all');
const query = ref('');
const copiedText = ref('');

const tabs = [
  { id: 'all' as const, label: 'Semua Token', count: colorTokens.length + typographySpecimens.length + radiusTokens.length + shadowTokens.length + sizingTokens.length },
  { id: 'colors' as const, label: 'Warna (Colors)', count: colorTokens.length },
  { id: 'typography' as const, label: 'Tipografi', count: typographySpecimens.length },
  { id: 'sizing' as const, label: 'Radius & Dimensi', count: radiusTokens.length + sizingTokens.length },
  { id: 'shadows' as const, label: 'Shadow & Focus Ring', count: shadowTokens.length },
];

const q = computed(() => query.value.trim().toLowerCase());

const filteredColorGroups = computed(() =>
  COLOR_GROUP_ORDER.map((name) => ({
    name,
    items: colorTokens.filter(
      (c) =>
        c.group === name &&
        (!q.value || c.slug.includes(q.value) || c.cssVar.includes(q.value) || c.lightHex.toLowerCase().includes(q.value))
    ),
  })).filter((g) => g.items.length > 0)
);

const filteredTypography = computed(() =>
  typographySpecimens.filter((t) => !q.value || t.label.toLowerCase().includes(q.value) || t.fontSize.includes(q.value))
);

const filteredRadius = computed(() =>
  radiusTokens.filter((r) => !q.value || r.twClass.includes(q.value) || r.cssVar.includes(q.value) || r.value.includes(q.value))
);

const filteredSizing = computed(() =>
  sizingTokens.filter((s) => !q.value || s.label.toLowerCase().includes(q.value) || s.cssVar.includes(q.value) || s.value.includes(q.value))
);

const filteredShadows = computed(() =>
  shadowTokens.filter((s) => !q.value || s.label.toLowerCase().includes(q.value) || s.cssVar.includes(q.value) || s.twClass.includes(q.value))
);

function copyToken(text: string) {
  copiedText.value = text;
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  setTimeout(() => {
    if (copiedText.value === text) copiedText.value = '';
  }, 2200);
}
</script>

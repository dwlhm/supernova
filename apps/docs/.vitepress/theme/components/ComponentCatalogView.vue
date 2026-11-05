<template>
  <div class="my-2 flex flex-col gap-9 text-foreground-default">
    <!-- Header Banner & Search -->
    <div class="rounded-2xl border border-border-default bg-background-subtle p-6 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.06)] flex flex-col gap-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-default text-white shadow-2xs">
              Supernova UI
            </span>
            <span class="text-xs font-medium text-foreground-muted">
              {{ allComponents.length }} Production Components
            </span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-foreground-default tracking-tight">
            Component Catalog
          </h1>
          <p class="text-sm text-foreground-muted mt-1.5 max-w-2xl leading-relaxed">
            Explore universal design system components authored with Mitosis and compiled deterministically to React, Vue 3, and Svelte.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-default bg-background-default text-xs font-medium text-foreground-default whitespace-nowrap shadow-2xs">
            <FrameworkIcon name="react" :size="14" />
            <span>React 19</span>
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-default bg-background-default text-xs font-medium text-foreground-default whitespace-nowrap shadow-2xs">
            <FrameworkIcon name="vue3" :size="14" />
            <span>Vue 3</span>
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-default bg-background-default text-xs font-medium text-foreground-default whitespace-nowrap shadow-2xs">
            <FrameworkIcon name="svelte" :size="14" />
            <span>Svelte 4</span>
          </span>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-5 border-t border-border-default">
        <div class="relative w-full lg:w-64 shrink-0">
          <svg
            class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search components..."
            class="w-full min-h-[36px] pl-10 pr-4 py-1.5 rounded-xl border border-border-default bg-background-default text-sm text-foreground-default placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-default transition-all"
          />
        </div>

        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-[0.98]',
              selectedCategory === cat.id
                ? 'bg-primary-default text-white font-semibold shadow-xs'
                : 'bg-background-interactive text-foreground-muted hover:text-foreground-default'
            ]"
            @click="selectedCategory = cat.id"
          >
            <FrameworkIcon :name="cat.id" :size="13" />
            <span>{{ cat.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="filteredComponents.length === 0"
      class="text-center py-12 rounded-2xl border border-dashed border-border-default text-foreground-muted"
    >
      <p class="text-base font-semibold">No components match your search "{{ searchQuery }}"</p>
      <button
        type="button"
        class="mt-3 px-4 py-1.5 rounded-lg bg-background-interactive text-xs font-medium text-foreground-default cursor-pointer active:scale-[0.98]"
        @click="resetFilters"
      >
        Clear filters
      </button>
    </div>

    <div v-else class="flex flex-col gap-10">
      <div
        v-for="cat in visibleCategories"
        :key="cat.id"
        class="flex flex-col gap-5"
      >
        <div class="flex items-center justify-between gap-4 pb-3 border-b border-border-default">
          <div class="flex items-center gap-2.5">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-background-interactive text-primary-default">
              <FrameworkIcon :name="cat.id" :size="15" />
            </span>
            <h2 class="text-lg md:text-xl font-bold text-foreground-default tracking-tight">
              {{ cat.label }}
            </h2>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-background-interactive text-foreground-muted font-semibold">
              {{ getComponentsForCategory(cat.id).length }}
            </span>
          </div>
          <span class="text-xs text-foreground-muted hidden sm:inline">
            {{ cat.description }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <a
            v-for="comp in getComponentsForCategory(cat.id)"
            :key="comp.slug"
            :href="resolveHref(`/components/${comp.slug}`)"
            class="group p-4 rounded-2xl border border-border-default bg-background-subtle hover:bg-background-default hover:border-primary-default shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:shadow-md transition-all duration-150 flex flex-col justify-between no-underline active:scale-[0.99]"
          >
            <div>
              <!-- Concentric Visual Component Stage (16px outer - 4px inset = 12px inner rounded-xl) -->
              <CatalogCardArtwork
                :name="comp.name"
                :slug="comp.slug"
                :category="comp.category"
                class="mb-4 group-hover:border-primary-default/40 transition-colors"
              />

              <div class="px-1">
                <div class="flex items-center justify-between gap-3 mb-1.5">
                  <span class="text-base font-bold text-foreground-default group-hover:text-primary-default transition-colors truncate">
                    {{ comp.name }}
                  </span>
                  <span class="text-[11px] px-2 py-0.5 rounded-md bg-background-interactive text-foreground-muted font-mono shrink-0">
                    {{ comp.slug }}
                  </span>
                </div>
                <p class="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                  {{ comp.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between gap-4 pt-3.5 mt-4 px-1 border-t border-border-default/80 text-xs">
              <span class="text-primary-default font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0 group-hover:translate-x-0.5 transition-transform">
                View Component &rarr;
              </span>
              <div class="flex items-center gap-2 text-[11px] text-foreground-muted whitespace-nowrap shrink-0">
                <span class="inline-flex items-center gap-1">
                  <FrameworkIcon name="react" :size="11" /> React
                </span>
                <span class="inline-flex items-center gap-1">
                  <FrameworkIcon name="vue3" :size="11" /> Vue
                </span>
                <span class="inline-flex items-center gap-1">
                  <FrameworkIcon name="svelte" :size="11" /> Svelte
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { componentRegistry } from '../preview/registry';
import FrameworkIcon from './FrameworkIcon.vue';
import CatalogCardArtwork from './CatalogCardArtwork.vue';
import { CATALOG_CATEGORIES, buildCatalogComponents, type ComponentItem } from './catalog-data';

const props = withDefaults(
  defineProps<{
    baseUrl?: string;
  }>(),
  {
    baseUrl: '/',
  }
);

const searchQuery = ref('');
const selectedCategory = ref('all');
const categories = CATALOG_CATEGORIES;

function resolveHref(path: string): string {
  const base = (props.baseUrl || '/').replace(/\/+$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

const allComponents = computed<ComponentItem[]>(() => buildCatalogComponents(componentRegistry));

const filteredComponents = computed(() => {
  return allComponents.value.filter((comp) => {
    const matchesCategory =
      selectedCategory.value === 'all' || comp.category === selectedCategory.value;
    const q = searchQuery.value.trim().toLowerCase();
    const matchesSearch =
      !q ||
      comp.name.toLowerCase().includes(q) ||
      comp.slug.toLowerCase().includes(q) ||
      comp.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
});

const visibleCategories = computed(() => {
  return categories.filter((cat) => {
    if (cat.id === 'all') return false;
    if (selectedCategory.value !== 'all' && selectedCategory.value !== cat.id) return false;
    return getComponentsForCategory(cat.id).length > 0;
  });
});

function getComponentsForCategory(catId: string) {
  return filteredComponents.value.filter((comp) => comp.category === catId);
}

function resetFilters() {
  searchQuery.value = '';
  selectedCategory.value = 'all';
}
</script>

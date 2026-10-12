<template>
  <div class="framework-preview-container rounded-xl border border-border-default bg-background-default shadow-sm overflow-hidden my-6">
    <!-- Top bar with component name and Framework tabs -->
    <div class="flex items-center justify-between px-4 py-2.5 border-b border-border-default bg-background-subtle">
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
          {{ name }}
        </span>
      </div>

      <div class="flex items-center gap-1 bg-background-interactive p-1 rounded-lg text-xs font-medium">
        <button
          v-for="fw in frameworks"
          :key="fw.id"
          type="button"
          :class="[
            'flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer font-medium',
            activeFramework === fw.id
              ? 'bg-background-default text-foreground-default shadow-xs font-semibold'
              : 'text-foreground-muted hover:text-foreground-default'
          ]"
          @click="activeFramework = fw.id"
        >
          <span>{{ fw.icon }}</span>
          <span>{{ fw.label }}</span>
        </button>
      </div>
    </div>

    <!-- Preview Canvas inside ClientOnly -->
    <ClientOnly>
      <div class="p-8 flex items-center justify-center min-h-[140px] bg-background-default">
        <div v-if="loading" class="text-sm text-foreground-muted">
          Loading preview...
        </div>
        <div v-else-if="loadError" class="text-sm text-red-500">
          {{ loadError }}
        </div>
        <template v-else-if="loadedComponent">
          <!-- React Preview -->
          <ReactHost
            v-if="activeFramework === 'react'"
            :component="loadedComponent"
            :props="defaultProps"
          />

          <!-- Vue 3 Preview -->
          <component
            v-else-if="activeFramework === 'vue3'"
            :is="loadedComponent"
            v-bind="defaultProps || {}"
          />

          <!-- Svelte Preview -->
          <SvelteHost
            v-else-if="activeFramework === 'svelte'"
            :component="loadedComponent"
            :props="defaultProps"
          />
        </template>
      </div>
      <template #fallback>
        <div class="p-8 flex items-center justify-center min-h-[140px] text-sm text-foreground-muted">
          Loading preview...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, watch } from 'vue';
import { componentRegistry, type ComponentLoader } from '../../../src/components/registry';
import ReactHost from './ReactHost.vue';
import SvelteHost from './SvelteHost.vue';

const props = withDefaults(
  defineProps<{
    name: string;
    defaultProps?: Record<string, any>;
  }>(),
  {
    defaultProps: () => ({}),
  }
);

type Framework = 'react' | 'vue3' | 'svelte';

const frameworks = [
  { id: 'react' as const, label: 'React', icon: '⚛️' },
  { id: 'vue3' as const, label: 'Vue 3', icon: '🟢' },
  { id: 'svelte' as const, label: 'Svelte', icon: '🟠' },
];

const activeFramework = ref<Framework>('react');
const loadedComponent = shallowRef<any>(null);
const loading = ref(false);
const loadError = ref<string | null>(null);

function getLoader(name: string): ComponentLoader | undefined {
  if (componentRegistry[name]) return componentRegistry[name];
  const pascal = name
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
  if (componentRegistry[pascal]) return componentRegistry[pascal];
  return undefined;
}

async function loadActiveComponent() {
  const entry = getLoader(props.name);
  if (!entry) {
    loadError.value = `Component "${props.name}" not found in registry`;
    loadedComponent.value = null;
    return;
  }

  const loader = entry[activeFramework.value];
  if (!loader) {
    loadError.value = `Framework "${activeFramework.value}" not available for "${props.name}"`;
    loadedComponent.value = null;
    return;
  }

  loading.value = true;
  loadError.value = null;
  try {
    const mod = await loader();
    loadedComponent.value = mod.default || mod;
  } catch (err: any) {
    console.error(`[FrameworkPreview] Failed to load "${props.name}" (${activeFramework.value}):`, err);
    loadError.value = err?.message || String(err);
    loadedComponent.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadActiveComponent();
});

watch(
  () => [props.name, activeFramework.value],
  () => {
    loadActiveComponent();
  }
);
</script>

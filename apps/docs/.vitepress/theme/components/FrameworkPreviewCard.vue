<template>
  <div class="flex flex-col rounded-2xl border border-border-default bg-background-default shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
    <!-- Top bar with component name and Framework tabs -->
    <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-border-default bg-background-subtle rounded-t-2xl">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-primary-default"></span>
        <span class="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
          {{ normalizedComponentName }}
        </span>
      </div>

      <!-- Concentric radius: outer rounded-xl (12px) - p-1 (4px) = inner rounded-lg (8px) -->
      <div class="flex items-center gap-1 bg-background-interactive p-1 rounded-xl text-xs font-medium">
        <button
          v-for="fw in frameworks"
          :key="fw.id"
          type="button"
          :class="[
            'inline-flex items-center gap-1.5 min-h-[28px] px-3 py-1 rounded-lg transition-all duration-150 cursor-pointer font-medium active:scale-[0.98]',
            activeFramework === fw.id
              ? 'bg-background-default text-foreground-default shadow-xs font-semibold'
              : 'text-foreground-muted hover:text-foreground-default'
          ]"
          @click="activeFramework = fw.id"
        >
          <FrameworkIcon :name="fw.id" :size="14" />
          <span>{{ fw.label }}</span>
        </button>
      </div>
    </div>

    <!-- Variant & Boolean Controls bar -->
    <div
      v-if="!exampleLoader && (variantOptions.length > 0 || booleanOptions.length > 0)"
      class="flex flex-wrap items-center gap-3 px-4 py-2.5 border-b border-border-default/60 bg-background-subtle/50 text-xs"
    >
      <div
        v-for="opt in variantOptions"
        :key="opt.propKey"
        class="flex items-center gap-1.5"
      >
        <span class="text-foreground-muted font-medium">{{ opt.group }}:</span>
        <select
          :value="interactiveProps[opt.propKey] ?? ''"
          class="bg-background-default border border-border-default rounded-lg px-2.5 py-1 text-xs text-foreground-default font-medium focus:outline-none focus:ring-1 focus:ring-primary-default cursor-pointer"
          @change="(e: any) => setProp(opt.propKey, e.target.value)"
        >
          <option
            v-for="val in opt.values"
            :key="val.value"
            :value="val.value"
          >
            {{ val.label }}
          </option>
        </select>
      </div>

      <button
        v-for="bKey in booleanOptions"
        :key="bKey"
        type="button"
        :class="[
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer active:scale-[0.98]',
          interactiveProps[bKey]
            ? 'border-primary-default/50 bg-primary-default/15 text-primary-default font-semibold'
            : 'border-border-default bg-background-default text-foreground-muted hover:text-foreground-default'
        ]"
        @click="setProp(bKey, !interactiveProps[bKey])"
      >
        <span :class="['w-1.5 h-1.5 rounded-full', interactiveProps[bKey] ? 'bg-primary-default' : 'bg-foreground-muted/50']"></span>
        <span>{{ bKey }}</span>
      </button>
    </div>

    <!-- Preview Studio Canvas with subtle dot grid -->
    <div
      ref="canvasRef"
      class="p-8 flex-1 flex items-center justify-center min-h-[160px] bg-background-default transition-[padding] duration-150"
      style="background-image: radial-gradient(rgba(156, 163, 175, 0.16) 1px, transparent 1px); background-size: 16px 16px;"
      @mousedown="onCanvasBackdropClick"
      @keydown.esc="onEscapeKey"
    >
      <div v-if="loading" class="text-sm text-foreground-muted">
        Loading preview...
      </div>
      <div v-else-if="loadError" class="max-w-full overflow-x-auto whitespace-pre-wrap font-mono text-xs text-red-500">
        {{ loadError }}
      </div>
      <div
        v-else-if="loadedComponent"
        ref="stageRef"
        :class="stageWidthClass"
        :style="{
          paddingTop: popoverPadTop > 0 ? `${popoverPadTop}px` : undefined,
          paddingBottom: popoverPadBottom > 0 ? `${popoverPadBottom}px` : undefined,
        }"
      >
        <FrameworkComponentMount
          :name="normalizedComponentName"
          :framework="activeFramework"
          :component="loadedComponent"
          :props="resolvedProps"
        />
      </div>
    </div>

    <FrameworkUsagePanel
      :name="normalizedComponentName"
      :active-framework="activeFramework"
      :interactive-props="interactiveProps"
      @select-preview-framework="(fw) => (activeFramework = fw)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { componentMetadata, previewBuildErrors, type PreviewFramework } from '../preview/registry';
import FrameworkIcon from './FrameworkIcon.vue';
import FrameworkComponentMount from './FrameworkComponentMount.vue';
import FrameworkUsagePanel from './FrameworkUsagePanel.vue';
import {
  DEFAULT_PROPS_BY_COMPONENT,
  PREVIEW_FRAMEWORKS,
  applyPreviewStatePatch,
  buildInteractivePreviewProps,
  extractVariantOptions,
  getComponentLoader,
  getExampleLoader,
  getPreviewStageWidthClass,
  measurePopoverSpacing,
  normalizeRegistryComponentName,
} from './PreviewDefaults';

type Framework = PreviewFramework;

const props = withDefaults(
  defineProps<{ name: string; defaultProps?: Record<string, any>; initialFramework?: Framework }>(),
  { defaultProps: () => ({}), initialFramework: 'react' }
);

const frameworks = PREVIEW_FRAMEWORKS;

const activeFramework = ref<Framework>(props.initialFramework || 'react');
const loadedComponent = shallowRef<any>(null);
const loading = ref(false);
const loadError = ref<string | null>(null);

watch(() => props.initialFramework, (fw) => { if (fw) activeFramework.value = fw; });

const normalizedComponentName = computed(() => normalizeRegistryComponentName(props.name));
const compMeta = computed(() => {
  const key = normalizedComponentName.value;
  const meta = componentMetadata as Record<string, any> | undefined;
  if (!meta) return undefined;
  if (meta[key] || meta[props.name]) return meta[key] || meta[props.name];
  const lower = key.toLowerCase();
  const foundKey = Object.keys(meta).find((k) => k.toLowerCase() === lower);
  return foundKey ? meta[foundKey] : undefined;
});
const variantOptions = computed(() => extractVariantOptions(compMeta.value?.variants));
const booleanOptions = computed<string[]>(() => compMeta.value?.booleans || []);
const stageWidthClass = computed(() => getPreviewStageWidthClass(normalizedComponentName.value));
const exampleLoader = computed(() => getExampleLoader(props.name));

const interactiveProps = ref<Record<string, any>>({});
const canvasRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const popoverPadTop = ref(0);
const popoverPadBottom = ref(0);
let stageObserver: MutationObserver | null = null;

function syncPopoverSpacing() {
  const { top, bottom } = measurePopoverSpacing(stageRef.value);
  popoverPadTop.value = top;
  popoverPadBottom.value = bottom;
}

function onCanvasBackdropClick(e: MouseEvent) {
  if (!interactiveProps.value.open || normalizedComponentName.value === 'AlertDialog') return;
  const compRoot = stageRef.value?.querySelector(':scope > .contents > *, :scope > *:not(.contents)');
  if (compRoot && !compRoot.contains(e.target as Node)) {
    setProp('open', false);
  }
}

function onEscapeKey() {
  if (interactiveProps.value.open && normalizedComponentName.value !== 'AlertDialog') {
    setProp('open', false);
  }
}

function syncPreviewFocus(shouldFocus: boolean) {
  nextTick(() => {
    requestAnimationFrame(() => {
      const target = canvasRef.value?.querySelector<HTMLElement>(
        'input:not([disabled]), textarea:not([disabled]), button:not([disabled])'
      );
      if (shouldFocus) target?.focus({ preventScroll: true });
      else target?.blur();
    });
  });
}

function setProp(key: string, value: any) {
  if (key === 'previewState') {
    interactiveProps.value = applyPreviewStatePatch(normalizedComponentName.value, String(value), interactiveProps.value);
    syncPreviewFocus(String(value).toLowerCase() === 'focus');
    return;
  }
  if (key === 'disabled' && 'previewState' in interactiveProps.value) {
    const nextState = value ? 'disabled' : interactiveProps.value.previewState === 'disabled' ? 'default' : interactiveProps.value.previewState;
    interactiveProps.value = { ...interactiveProps.value, disabled: value, errorMessage: value ? '' : interactiveProps.value.errorMessage, previewState: nextState };
    return;
  }
  interactiveProps.value = { ...interactiveProps.value, [key]: value };
}

watch(
  () => [props.name, props.defaultProps, variantOptions.value],
  () => {
    const compKey = normalizedComponentName.value;
    const defaults: Record<string, any> = {
      ...(DEFAULT_PROPS_BY_COMPONENT[compKey] || DEFAULT_PROPS_BY_COMPONENT[props.name] || {}),
      ...(props.defaultProps || {}),
    };
    for (const opt of variantOptions.value) {
      const curVal = defaults[opt.propKey];
      if (typeof curVal === 'string') {
        const match = opt.values.find((v) => v.value.toLowerCase() === curVal.toLowerCase());
        if (match) defaults[opt.propKey] = match.value;
      } else if (curVal === undefined && opt.values.length > 0) {
        defaults[opt.propKey] = opt.values[0]!.value;
      }
    }
    interactiveProps.value = defaults;
  },
  { immediate: true }
);

const resolvedProps = computed(() =>
  exampleLoader.value ? {} : buildInteractivePreviewProps(interactiveProps.value, (patch) => {
    interactiveProps.value = { ...interactiveProps.value, ...patch };
  })
);

async function loadActiveComponent() {
  const entry = exampleLoader.value || getComponentLoader(props.name);
  if (!entry) {
    loadError.value = `Component "${props.name}" not found in registry`;
    loadedComponent.value = null;
    return;
  }
  const loader = entry[activeFramework.value];
  if (!loader) {
    const file = exampleLoader.value ? `${normalizedComponentName.value}Example` : normalizedComponentName.value;
    const reason = previewBuildErrors[file]?.[activeFramework.value];
    loadError.value = reason
      ? `${activeFramework.value} preview failed to build:\n${reason}`
      : `Framework "${activeFramework.value}" not available for "${props.name}"`;
    loadedComponent.value = null;
    return;
  }
  loading.value = true;
  loadError.value = null;
  try {
    const mod = await loader();
    loadedComponent.value = mod.default || mod;
  } catch (err: any) {
    loadError.value = err?.message || String(err);
    loadedComponent.value = null;
  } finally {
    loading.value = false;
    if (String(interactiveProps.value.previewState || '').toLowerCase() === 'focus') {
      syncPreviewFocus(true);
    }
  }
}

onMounted(() => {
  loadActiveComponent();
  if (canvasRef.value && typeof MutationObserver !== 'undefined') {
    stageObserver = new MutationObserver(() => syncPopoverSpacing());
    stageObserver.observe(canvasRef.value, { childList: true, subtree: true, attributes: true });
  }
});
onBeforeUnmount(() => {
  stageObserver?.disconnect();
});
watch(() => [props.name, activeFramework.value], loadActiveComponent);
watch(
  () => [interactiveProps.value, activeFramework.value, loadedComponent.value],
  () => {
    nextTick(() => {
      syncPopoverSpacing();
      requestAnimationFrame(syncPopoverSpacing);
    });
  },
  { deep: true }
);
</script>

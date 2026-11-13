<template>
  <div class="flex flex-col rounded-2xl border border-border-default bg-background-default shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
    <!-- Top bar with component name and Framework tabs -->
    <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-border-default bg-background-subtle rounded-t-2xl">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-primary-default"></span>
        <span class="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
          {{ normalizedComponentName }}
        </span>
        <span
          v-if="clickCount > 0"
          :key="clickCount"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-default/15 text-primary-default text-[11px] font-semibold transition-all"
        >
          <span>Clicked ({{ clickCount }})</span>
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

      <div
        v-if="'label' in interactiveProps"
        class="flex items-center gap-1.5"
      >
        <span class="text-foreground-muted font-medium">Label:</span>
        <input
          type="text"
          :value="formatInputPropValue(interactiveProps.label)"
          placeholder="Custom label..."
          class="w-32 bg-background-default border border-border-default rounded-lg px-2 py-1 text-xs text-foreground-default focus:outline-none focus:ring-1 focus:ring-primary-default"
          @input="(e: any) => setProp('label', e.target.value)"
        />
      </div>

      <div
        v-if="normalizedComponentName === 'DatePicker' && interactiveProps.showTime"
        class="flex items-center gap-1.5"
      >
        <span class="text-foreground-muted font-medium">Time Label:</span>
        <input
          type="text"
          :value="interactiveProps.timeLabel ?? 'Time'"
          placeholder="Time"
          class="w-24 bg-background-default border border-border-default rounded-lg px-2 py-1 text-xs text-foreground-default focus:outline-none focus:ring-1 focus:ring-primary-default"
          @input="(e: any) => setProp('timeLabel', e.target.value)"
        />
      </div>

      <div
        v-if="'placeholder' in interactiveProps"
        class="flex items-center gap-1.5"
      >
        <span class="text-foreground-muted font-medium">Placeholder:</span>
        <input
          type="text"
          :value="interactiveProps.placeholder ?? ''"
          placeholder="Custom placeholder..."
          class="w-36 bg-background-default border border-border-default rounded-lg px-2 py-1 text-xs text-foreground-default focus:outline-none focus:ring-1 focus:ring-primary-default"
          @input="(e: any) => setProp('placeholder', e.target.value)"
        />
      </div>

      <div
        v-if="'hint' in interactiveProps"
        class="flex items-center gap-1.5"
      >
        <span class="text-foreground-muted font-medium">Hint:</span>
        <input
          type="text"
          :value="formatInputPropValue(interactiveProps.hint)"
          :placeholder="normalizedComponentName === 'DatePicker' ? 'e.g. date => `date ${date.formatted}`' : 'e.g. val => `Hint: ${val}`'"
          class="w-48 bg-background-default border border-border-default rounded-lg px-2 py-1 text-xs text-foreground-default focus:outline-none focus:ring-1 focus:ring-primary-default"
          @input="(e: any) => setProp('hint', e.target.value)"
        />
      </div>

      <!-- Restriction options for file upload components -->
      <div
        v-if="isFileUploadComponent"
        class="flex items-center gap-1.5"
      >
        <span class="text-foreground-muted font-medium">Restriction:</span>
        <select
          :value="activeRestrictionPreset"
          class="bg-background-default border border-border-default rounded-lg px-2.5 py-1 text-xs text-foreground-default font-medium focus:outline-none focus:ring-1 focus:ring-primary-default cursor-pointer"
          @change="(e: any) => onRestrictionPresetChange(e.target.value)"
        >
          <option value="none">Default (Up to 10 MB)</option>
          <option value="pdf">PDF Only (Max 5 MB)</option>
          <option value="images">Images Only (Max 2 MB)</option>
          <option value="max1mb">Strict Limit (Max 1 MB)</option>
          <option value="error">Simulate Restriction Error</option>
          <option v-if="activeRestrictionPreset === 'custom'" value="custom">Custom</option>
        </select>
      </div>

      <div
        v-if="isFileUploadComponent"
        class="flex items-center gap-1.5"
      >
        <span class="text-foreground-muted font-medium">Accept:</span>
        <input
          type="text"
          :value="interactiveProps.accept ?? ''"
          placeholder="e.g. .pdf, .png"
          class="w-32 bg-background-default border border-border-default rounded-lg px-2 py-1 text-xs text-foreground-default focus:outline-none focus:ring-1 focus:ring-primary-default"
          @input="(e: any) => onCustomAcceptInput(e.target.value)"
        />
      </div>
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
const isFileUploadComponent = computed(() =>
  ['InputFileDropZone', 'InputFileInput', 'InputImageUploader', 'InputMultipleFileUpload'].includes(normalizedComponentName.value)
);
const activeRestrictionPreset = ref('none');

const interactiveProps = ref<Record<string, any>>({});
const clickCount = ref(0);
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

function formatInputPropValue(val: unknown): string {
  if (typeof val === 'function') {
    return (val as { __source?: string }).__source || val.toString();
  }
  return typeof val === 'string' ? val : '';
}

function parsePreviewTextOrCallback(raw: unknown): unknown {
  if (typeof raw !== 'string') return raw;
  const trimmed = raw.trim();
  if (/^(?:\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/.test(trimmed)) {
    try {
      const compiled = new Function(`return (${trimmed});`)();
      if (typeof compiled === 'function') {
        const safeFn = (arg: unknown) => {
          try {
            const res = compiled(arg);
            return res === undefined || res === null ? '' : String(res);
          } catch {
            return trimmed;
          }
        };
        (safeFn as { __source?: string }).__source = trimmed;
        return safeFn;
      }
    } catch {
      // Keep raw string while arrow expression is incomplete
    }
  }
  return raw;
}

function setProp(key: string, value: any) {
  if (key === 'previewState') {
    interactiveProps.value = applyPreviewStatePatch(normalizedComponentName.value, String(value), interactiveProps.value);
    syncPreviewFocus(String(value).toLowerCase() === 'focus');
    return;
  }
  if (key === 'error') {
    const nextErrMsg = value ? applyPreviewStatePatch(normalizedComponentName.value, 'error', interactiveProps.value).errorMessage : '';
    interactiveProps.value = { ...interactiveProps.value, error: value, errorMessage: nextErrMsg, state: value ? 'error' : 'default', previewState: value ? 'error' : 'default' };
    return;
  }
  if (key === 'disabled' && 'previewState' in interactiveProps.value) {
    const nextState = value ? 'disabled' : interactiveProps.value.previewState === 'disabled' ? 'default' : interactiveProps.value.previewState;
    interactiveProps.value = { ...interactiveProps.value, disabled: value, errorMessage: value ? '' : interactiveProps.value.errorMessage, previewState: nextState };
    return;
  }
  if (key === 'trigger') {
    interactiveProps.value = { ...interactiveProps.value, trigger: value, open: false };
    return;
  }
  if (key === 'icon') {
    interactiveProps.value = { ...interactiveProps.value, icon: value, showIcon: true };
    return;
  }
  if (key === 'leftIcon') {
    interactiveProps.value = { ...interactiveProps.value, leftIcon: value, showLeftIcon: true };
    return;
  }
  if (key === 'rightIcon') {
    interactiveProps.value = { ...interactiveProps.value, rightIcon: value, showRightIcon: true };
    return;
  }
  if (key === 'leadingIcon') {
    interactiveProps.value = { ...interactiveProps.value, leadingIcon: value, showLeadingIcon: true };
    return;
  }
  if (key === 'trailingIcon') {
    interactiveProps.value = { ...interactiveProps.value, trailingIcon: value, showTrailingIcon: true };
    return;
  }
  if (normalizedComponentName.value === 'DatePicker' && key === 'mode') {
    interactiveProps.value = {
      ...interactiveProps.value,
      mode: value,
      value: 0,
      displayValue: '',
      inputText: '',
      viewMode: '',
      month: 6,
      year: value === 'year' ? 2026 : 2025,
      selectedMonth: 0,
      selectedYear: 0,
      startMonth: 0,
      startYear: 0,
      endMonth: 7,
      endYear: 2025,
      endValue: 9,
      hoverMonth: 0,
      hoverYear: 0,
      hoverValue: 0,
      __rangeSelectingEnd: false,
      open: true,
    };
    return;
  }
  if (key === 'label') {
    const parsed = parsePreviewTextOrCallback(value);
    interactiveProps.value = { ...interactiveProps.value, label: parsed, ...(value ? { showLabel: true } : {}) };
    return;
  }
  if (key === 'hint') {
    const parsed = parsePreviewTextOrCallback(value);
    interactiveProps.value = { ...interactiveProps.value, hint: parsed, ...(value ? { showHint: true } : {}) };
    return;
  }
  interactiveProps.value = { ...interactiveProps.value, [key]: value };
}

function onRestrictionPresetChange(preset: string) {
  activeRestrictionPreset.value = preset;
  if (preset === 'pdf') {
    interactiveProps.value = {
      ...interactiveProps.value,
      accept: '.pdf,application/pdf',
      supportingText: 'Only PDF documents up to 5 MB',
      maxSizeBytes: 5 * 1024 * 1024,
      error: false,
      errorMessage: '',
      state: interactiveProps.value.fileName ? 'filled' : 'default',
      previewState: interactiveProps.value.fileName ? 'filled' : 'default',
    };
  } else if (preset === 'images') {
    interactiveProps.value = {
      ...interactiveProps.value,
      accept: 'image/png,image/jpeg,.png,.jpg',
      supportingText: 'PNG or JPG images up to 2 MB',
      maxSizeBytes: 2 * 1024 * 1024,
      error: false,
      errorMessage: '',
      state: interactiveProps.value.fileName ? 'filled' : 'default',
      previewState: interactiveProps.value.fileName ? 'filled' : 'default',
    };
  } else if (preset === 'max1mb') {
    interactiveProps.value = {
      ...interactiveProps.value,
      accept: '.pdf,.png,.jpg,image/png,image/jpeg,application/pdf',
      supportingText: 'Maximum file size is 1 MB',
      maxSizeBytes: 1 * 1024 * 1024,
      error: false,
      errorMessage: '',
      state: interactiveProps.value.fileName ? 'filled' : 'default',
      previewState: interactiveProps.value.fileName ? 'filled' : 'default',
    };
  } else if (preset === 'error') {
    interactiveProps.value = {
      ...interactiveProps.value,
      accept: '.pdf,application/pdf',
      supportingText: 'Only PDF documents up to 5 MB',
      error: true,
      errorMessage: 'File format not supported or size exceeds limit.',
      state: 'error',
      previewState: 'error',
    };
  } else {
    activeRestrictionPreset.value = 'none';
    interactiveProps.value = {
      ...interactiveProps.value,
      accept: '',
      supportingText: 'PNG, JPG, or PDF up to 10 MB',
      maxSizeBytes: 10 * 1024 * 1024,
      error: false,
      errorMessage: '',
      state: interactiveProps.value.fileName ? 'filled' : 'default',
      previewState: interactiveProps.value.fileName ? 'filled' : 'default',
    };
  }
}

function onCustomAcceptInput(val: string) {
  activeRestrictionPreset.value = 'custom';
  setProp('accept', val);
}

watch(
  () => [props.name, props.defaultProps, variantOptions.value],
  () => {
    activeRestrictionPreset.value = 'none';
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
    clickCount.value = 0;
  },
  { immediate: true }
);

const resolvedProps = computed(() => {
  if (exampleLoader.value) return {};
  const built = buildInteractivePreviewProps(interactiveProps.value, (patch) => {
    interactiveProps.value = { ...interactiveProps.value, ...patch };
  });
  const baseOnClick = built.onClick;
  built.onClick = () => {
    if (!interactiveProps.value.disabled) {
      clickCount.value += 1;
    }
    baseOnClick?.();
  };
  return built;
});

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

<template>
  <div class="framework-preview-container rounded-xl border border-border-default bg-background-default shadow-sm overflow-hidden my-6">
    <!-- Top bar with component name and Framework tabs -->
    <div class="flex items-center justify-between px-4 py-2.5 border-b border-border-default bg-background-subtle">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-primary-default"></span>
        <span class="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
          {{ normalizedComponentName }}
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

    <!-- Variant Controls bar -->
    <div
      v-if="variantOptions.length > 0"
      class="flex flex-wrap items-center gap-3 px-4 py-2 border-b border-border-default/60 bg-background-subtle/50 text-xs"
    >
      <div
        v-for="opt in variantOptions"
        :key="opt.group"
        class="flex items-center gap-1.5"
      >
        <span class="text-foreground-muted font-medium">{{ opt.group }}:</span>
        <select
          :value="interactiveProps[opt.propKey] || ''"
          class="bg-background-default border border-border-default rounded px-2 py-0.5 text-xs text-foreground-default font-medium focus:outline-none focus:ring-1 focus:ring-primary-default"
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
          <IsolatedFrame
            :framework="activeFramework"
            :component="loadedComponent"
            :props="resolvedProps"
            :is-dark="isDark"
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
import { ref, shallowRef, computed, onMounted, watch } from 'vue';
import { componentRegistry, componentMetadata, type ComponentLoader } from '../preview/registry';
import IsolatedFrame from './IsolatedFrame.vue';
import { useData } from 'vitepress';
const { isDark } = useData();
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

const DEFAULT_PROPS_BY_COMPONENT: Record<string, Record<string, any>> = {
  Button: { label: 'Click Me', variant: 'primary', roundness: 'default', showLabel: true },
  FAB: { label: 'New Action', variant: 'primary', size: 'regular' },
  Badge: { label: 'Active', variant: 'primary' },
  Avatar: { initialsText: 'KM', type: 'initials', size: 'regular', showStatus: true },
  InputText: { label: 'Email Address', placeholder: 'name@komerce.id', showLabel: true },
  InputTextArea: { label: 'Notes', placeholder: 'Enter description or comments...', showLabel: true },
  InputDropdown: { label: 'Select Department', placeholder: 'Choose an option...', showLabel: true },
  InputOTP: { label: 'Verification Code', showLabel: true },
  InputFileInput: { label: 'Attachment', buttonText: 'Browse file...', showLabel: true },
  InputFileDropZone: { primaryText: 'Drag and drop files here, or click to browse', supportingText: 'PNG, JPG, PDF up to 10MB' },
  InputImageUploader: { primaryText: 'Upload image', supportingText: 'Recommended 1200x630px' },
  Checkbox: { label: 'I agree to the terms and privacy policy', rightLabel: true, checked: true },
  RadioButton: { label: 'Fast Express Delivery (1-2 days)', rightLabel: true, checked: true },
  SwitchButton: { label: 'Enable email notifications', rightLabel: true, checked: true },
  Toggle: { label: 'Toggle State', checked: true },
  ToggleGroup: {},
  Slider: { value: 65, min: 0, max: 100 },
  DatePicker: { label: 'Select Date', placeholder: 'YYYY-MM-DD' },
  Progressbar: { progress: 70 },
  Spinner: { size: 24 },
  MetricCard: { labelText: 'Total Revenue', valueText: 'Rp 148.500.000', showValue: true, showTrend: true, trendText: '+18.4% vs last month' },
  Breadcrumb: { type: '2' },
  AlertDialog: { headingContent: 'Confirm Deletion', descriptionContent: 'Are you sure you want to permanently remove this component?', showDescription: true },
  Toast: { title: 'Changes Saved', message: 'Your configuration was successfully updated.' },
  Tooltip: { content: 'Helpful guidance or contextual tip' },
  Pagination: { currentPage: 2, totalPages: 10 },
  TabItem: { label: 'General', state: 'active' },
  Tabs: {},
  BubbleChat: { direction: 'incoming', textMessage: 'Hello! How can we assist your integration today?' },
  Table: {},
  Sidebar: { expanded: true },
  Topbar: {},
  MainMenu: { label: 'Dashboard', state: 'default' },
  MenuItem: { label: 'Settings', state: 'default' },
  Stepper: { current: 2, step1Label: 'Cart', step2Label: 'Checkout', step3Label: 'Payment', step4Label: 'Review' },
  IconPlaceholder: {},
  IconTruckDelivery: {},
  TablerTruckDelivery: {},
};

function resolvePascalName(name: string): string {
  if (!name) return '';
  return name
    .split(/[-_ ]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

const normalizedComponentName = computed(() => {
  const pascal = resolvePascalName(props.name);
  if (pascal === 'TablerTruckDelivery') return 'IconTruckDelivery';
  return pascal || props.name;
});

const compMeta = computed(() => {
  const key = normalizedComponentName.value;
  return (componentMetadata as any)?.[key] || (componentMetadata as any)?.[props.name];
});

const variantOptions = computed(() => {
  const variants = compMeta.value?.variants;
  if (!variants) return [];
  const seenKeys = new Set<string>();
  const result: Array<{ group: string; propKey: string; values: Array<{ label: string; value: string }> }> = [];
  for (const [group, values] of Object.entries(variants)) {
    let propKey = group.charAt(0).toLowerCase() + group.slice(1);
    if (group === 'Style') propKey = 'variant';
    if (seenKeys.has(propKey)) continue;
    seenKeys.add(propKey);
    const label = group.charAt(0).toUpperCase() + group.slice(1);
    result.push({
      group: label,
      propKey,
      values: (values as string[]).map((v) => ({
        label: v,
        value: v,
      })),
    });
  }
  return result;
});

const interactiveProps = ref<Record<string, any>>({});

function setProp(key: string, value: any) {
  interactiveProps.value = {
    ...interactiveProps.value,
    [key]: value,
  };
}

watch(
  () => [props.name, props.defaultProps, variantOptions.value],
  () => {
    const compKey = normalizedComponentName.value;
    const defaults = {
      ...(DEFAULT_PROPS_BY_COMPONENT[compKey] || DEFAULT_PROPS_BY_COMPONENT[props.name] || {}),
      ...(props.defaultProps || {}),
    };
    for (const opt of variantOptions.value) {
      const curVal = defaults[opt.propKey];
      if (typeof curVal === 'string') {
        const match = opt.values.find((v) => v.value.toLowerCase() === curVal.toLowerCase());
        if (match) {
          defaults[opt.propKey] = match.value;
        }
      } else if (curVal === undefined && opt.values.length > 0) {
        defaults[opt.propKey] = opt.values[0]!.value;
      }
    }
    interactiveProps.value = defaults;
  },
  { immediate: true }
);

const resolvedProps = computed(() => {
  return {
    ...interactiveProps.value,
    onCheckedChange: (val: boolean) => {
      interactiveProps.value = {
        ...interactiveProps.value,
        checked: val,
      };
    },
    'onUpdate:checked': (val: boolean) => {
      interactiveProps.value = {
        ...interactiveProps.value,
        checked: val,
      };
    },
    onChange: (e: any) => {
      if (typeof e === 'boolean') {
        interactiveProps.value = {
          ...interactiveProps.value,
          checked: e,
        };
      } else if (e && typeof e.target?.checked === 'boolean') {
        interactiveProps.value = {
          ...interactiveProps.value,
          checked: e.target.checked,
        };
      }
    },
  };
});

function getLoader(name: string): ComponentLoader | undefined {
  if (!name) return undefined;
  if (componentRegistry[name]) return componentRegistry[name];

  const pascal = resolvePascalName(name);
  if (componentRegistry[pascal]) return componentRegistry[pascal];

  if (pascal === 'TablerTruckDelivery' || pascal === 'TruckDelivery' || pascal === 'IconTruckDelivery') {
    return componentRegistry['IconTruckDelivery'] || componentRegistry['TruckDelivery'];
  }
  if (pascal === 'IconPlaceholder' || pascal === 'Placeholder') {
    return componentRegistry['IconPlaceholder'] || componentRegistry['Placeholder'];
  }
  if (pascal === 'InputFileInput' || pascal === 'FileInput') {
    return componentRegistry['InputFileInput'] || componentRegistry['FileInput'];
  }
  if (pascal === 'InputMultipleFileUpload' || pascal === 'MultipleFileUpload') {
    return componentRegistry['InputMultipleFileUpload'] || componentRegistry['MultipleFileUpload'];
  }

  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [key, loader] of Object.entries(componentRegistry)) {
    if (key.toLowerCase().replace(/[^a-z0-9]/g, '') === clean) {
      return loader;
    }
  }

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

<template>
  <div class="border-t border-border-default bg-background-subtle/50 rounded-b-2xl overflow-hidden">
    <div class="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-border-default/60">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-default hover:text-primary-default transition-colors cursor-pointer"
          @click="expanded = !expanded"
        >
          <svg
            class="w-3.5 h-3.5 text-foreground-muted transition-transform duration-150"
            :class="{ 'rotate-90': expanded }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span>Usage Code</span>
        </button>
        <span class="text-[11px] text-foreground-muted hidden sm:inline">
          • Synced with Live Preview state
        </span>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center gap-0.5 bg-background-interactive p-0.5 rounded-lg text-[11px] font-medium">
          <button
            v-for="fw in allFrameworks"
            :key="fw.id"
            type="button"
            :class="[
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer',
              selectedCodeFramework === fw.id
                ? 'bg-background-default text-foreground-default shadow-2xs font-semibold'
                : 'text-foreground-muted hover:text-foreground-default'
            ]"
            @click="selectFramework(fw.id)"
          >
            <FrameworkIcon :name="fw.id" :size="12" />
            <span>{{ fw.label }}</span>
          </button>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border-default bg-background-default text-xs font-medium text-foreground-default hover:bg-background-subtle transition-colors cursor-pointer active:scale-[0.98]"
          @click="copyCode"
        >
          <svg v-if="copied" class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg v-else class="w-3.5 h-3.5 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{{ copied ? 'Copied' : 'Copy' }}</span>
        </button>
      </div>
    </div>

    <div v-if="expanded" class="bg-[#0f1117] text-[#e6edf3] overflow-x-auto">
      <pre class="p-4 text-xs leading-relaxed font-mono m-0"><code>{{ usageCode }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import FrameworkIcon from './FrameworkIcon.vue';
import { generateLiveUsageCode, type UsageFramework } from './PreviewCodeGenerator';

const props = defineProps<{
  name: string;
  activeFramework: 'react' | 'vue3' | 'svelte';
  interactiveProps: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: 'select-preview-framework', fw: 'react' | 'vue3' | 'svelte'): void;
}>();

const allFrameworks: Array<{ id: UsageFramework; label: string }> = [
  { id: 'react', label: 'React' },
  { id: 'vue3', label: 'Vue 3' },
  { id: 'svelte', label: 'Svelte' },
  { id: 'vue2', label: 'Vue 2' },
  { id: 'angular', label: 'Angular' },
];

const expanded = ref(true);
const copied = ref(false);
const selectedCodeFramework = ref<UsageFramework>(props.activeFramework);

watch(
  () => props.activeFramework,
  (fw) => {
    selectedCodeFramework.value = fw;
  }
);

function selectFramework(fw: UsageFramework) {
  selectedCodeFramework.value = fw;
  expanded.value = true;
  if (fw === 'react' || fw === 'vue3' || fw === 'svelte') {
    emit('select-preview-framework', fw);
  }
}

const usageCode = computed(() =>
  generateLiveUsageCode(props.name, selectedCodeFramework.value, props.interactiveProps)
);

async function copyCode() {
  try {
    await navigator.clipboard.writeText(usageCode.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1800);
  } catch {
    // Fallback if clipboard API blocked in iframe
  }
}
</script>

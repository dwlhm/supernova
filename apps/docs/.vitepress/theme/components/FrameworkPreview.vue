<template>
  <ClientOnly>
    <div class="framework-preview-frame">
      <IsolatedFrame
        framework="vue3"
        :component="FrameworkPreviewCard"
        :props="{ name, defaultProps, initialFramework }"
        :is-dark="isDark"
        align="stretch"
        :min-height="160"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import IsolatedFrame from './IsolatedFrame.vue';
import FrameworkPreviewCard from './FrameworkPreviewCard.vue';

const { isDark } = useData();

withDefaults(
  defineProps<{
    name: string;
    defaultProps?: Record<string, any>;
    initialFramework?: 'react' | 'vue3' | 'svelte';
  }>(),
  {
    defaultProps: () => ({}),
    initialFramework: 'react',
  }
);
</script>

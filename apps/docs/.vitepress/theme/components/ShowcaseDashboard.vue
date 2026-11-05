<template>
  <ClientOnly>
    <div class="framework-preview-frame">
      <IsolatedFrame
        framework="vue3"
        :component="ShowcaseDashboardView"
        :is-dark="isDark"
        align="stretch"
        :min-height="260"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import IsolatedFrame from './IsolatedFrame.vue';
import ShowcaseDashboardView from './ShowcaseDashboardView.vue';

const { isDark } = useData();
</script>

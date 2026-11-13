<template>
  <ClientOnly>
    <div class="framework-preview-frame">
      <IsolatedFrame
        framework="vue3"
        :component="HeadlessTablePlaygroundView"
        :is-dark="isDark"
        align="stretch"
        :min-height="420"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import IsolatedFrame from './IsolatedFrame.vue';
import HeadlessTablePlaygroundView from './HeadlessTablePlaygroundView.vue';

const { isDark } = useData();
</script>

<template>
  <ClientOnly>
    <div class="framework-preview-frame">
      <IsolatedFrame
        framework="vue3"
        :component="ComponentCatalogView"
        :props="{ baseUrl: site.base }"
        :is-dark="isDark"
        align="stretch"
        :min-height="220"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import IsolatedFrame from './IsolatedFrame.vue';
import ComponentCatalogView from './ComponentCatalogView.vue';

const { isDark, site } = useData();
</script>

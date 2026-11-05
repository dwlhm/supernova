<template>
  <table v-if="tableWrapperMode === 'row'" class="border-collapse">
    <ReactHost
      v-if="framework === 'react'"
      tag="tbody"
      :component="component"
      :props="props"
    />
    <tbody v-else-if="framework === 'vue3'">
      <component :is="component" v-bind="props" />
    </tbody>
    <SvelteHost
      v-else-if="framework === 'svelte'"
      tag="tbody"
      :component="component"
      :props="props"
    />
  </table>
  <table v-else-if="tableWrapperMode === 'cell'" class="border-collapse">
    <tbody>
      <ReactHost
        v-if="framework === 'react'"
        tag="tr"
        :component="component"
        :props="props"
      />
      <tr v-else-if="framework === 'vue3'">
        <component :is="component" v-bind="props" />
      </tr>
      <SvelteHost
        v-else-if="framework === 'svelte'"
        tag="tr"
        :component="component"
        :props="props"
      />
    </tbody>
  </table>
  <template v-else>
    <ReactHost
      v-if="framework === 'react'"
      :component="component"
      :props="props"
    />
    <component
      :is="component"
      v-else-if="framework === 'vue3'"
      v-bind="props"
    />
    <SvelteHost
      v-else-if="framework === 'svelte'"
      :component="component"
      :props="props"
    />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ReactHost from './ReactHost.vue';
import SvelteHost from './SvelteHost.vue';

const compProps = defineProps<{
  name: string;
  framework: 'react' | 'vue3' | 'svelte';
  component: any;
  props?: Record<string, any>;
}>();

const tableWrapperMode = computed<'row' | 'cell' | null>(() => {
  const n = compProps.name;
  if (n === 'TableBodyRow' || n === 'TableHeaderRow') return 'row';
  if (/^Table.*Cell$/.test(n)) return 'cell';
  return null;
});
</script>

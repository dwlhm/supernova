<template>
  <table v-if="tableWrapperMode" class="border-collapse">
    <tbody v-if="tableWrapperMode === 'cell'">
      <component :is="host" v-if="host" tag="tr" :component="component" :props="rest" :content="content" />
      <tr v-else>
        <component :is="component" v-bind="rest"><template v-if="content !== undefined" #default>{{ content }}</template></component>
      </tr>
    </tbody>
    <template v-else>
      <component :is="host" v-if="host" tag="tbody" :component="component" :props="rest" :content="content" />
      <tbody v-else>
        <component :is="component" v-bind="rest"><template v-if="content !== undefined" #default>{{ content }}</template></component>
      </tbody>
    </template>
  </table>
  <template v-else>
    <component :is="host" v-if="host" :component="component" :props="rest" :content="content" />
    <component :is="component" v-else v-bind="rest"><template v-if="content !== undefined" #default>{{ content }}</template></component>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PreviewFramework } from '../preview/registry';
import AngularHost from './AngularHost.vue';
import ReactHost from './ReactHost.vue';
import SvelteHost from './SvelteHost.vue';
import Vue2Host from './Vue2Host.vue';

/** Foreign frameworks mount through a host; Vue 3 components render natively (no host). */
const HOSTS: Partial<Record<PreviewFramework, unknown>> = {
  react: ReactHost,
  svelte: SvelteHost,
  vue2: Vue2Host,
  angular: AngularHost,
};

const compProps = defineProps<{
  name: string;
  framework: PreviewFramework;
  component: any;
  props?: Record<string, any>;
}>();

const host = computed(() => HOSTS[compProps.framework]);

/** A string `children` fixture is text content: slot/projection per framework, never an attribute. */
const content = computed(() => (typeof compProps.props?.children === 'string' ? compProps.props.children : undefined));
const rest = computed(() => {
  const { children: _children, ...others } = compProps.props ?? {};
  return others;
});

const tableWrapperMode = computed<'row' | 'cell' | null>(() => {
  const n = compProps.name;
  if (n === 'TableBodyRow' || n === 'TableHeaderRow') return 'row';
  if (/^Table.*Cell$/.test(n)) return 'cell';
  return null;
});
</script>

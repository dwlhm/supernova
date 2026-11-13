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
import { computed, h, markRaw } from 'vue';
import type { PreviewFramework } from '../preview/registry';
import { ICON_PATHS } from '../preview/utils';
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

function createVue3Icon(pathData: string) {
  return markRaw((p: Record<string, any>) =>
    h(
      'svg',
      {
        'aria-hidden': 'true',
        class: p?.class || 'h-4 w-4 shrink-0',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '1.5',
      },
      [h('path', { d: pathData, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]
    )
  );
}

/** A string `children` fixture is text content: slot/projection per framework, never an attribute. */
const content = computed(() => (typeof compProps.props?.children === 'string' ? compProps.props.children : undefined));
const rest = computed(() => {
  const { children: _children, ...others } = compProps.props ?? {};
  if (!host.value) {
    for (const [k, v] of Object.entries(others)) {
      if ((k === 'icon' || k.endsWith('Icon')) && typeof v === 'string') {
        others[k] = v && ICON_PATHS[v] ? createVue3Icon(ICON_PATHS[v]!) : undefined;
      }
    }
  }
  return others;
});

const tableWrapperMode = computed<'row' | 'cell' | null>(() => {
  const n = compProps.name;
  if (n === 'TableBodyRow' || n === 'TableHeaderRow') return 'row';
  if (/^Table.*Cell$/.test(n)) return 'cell';
  return null;
});
</script>

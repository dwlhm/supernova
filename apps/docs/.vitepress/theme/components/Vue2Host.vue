<template>
  <component :is="tag || 'div'" ref="containerRef" class="vue2-host-container contents" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps<{
  component: any;
  props?: Record<string, any>;
  content?: string;
  tag?: string;
}>();

const containerRef = ref<HTMLElement | null>(null);
let vm: any = null;
let state: { props: Record<string, any>; content?: string } | null = null;
/** Bumped on every mount/unmount so a slow async mount never outlives a newer one. */
let generation = 0;

function destroy() {
  generation++;
  vm?.$destroy();
  vm?.$el?.remove?.();
  vm = null;
  state = null;
}

async function mount() {
  destroy();
  const container = containerRef.value;
  if (!container || !props.component) return;
  const current = generation;
  const Vue = (await import('vue2')).default;
  if (current !== generation) return;
  Vue.config.productionTip = false;
  Vue.config.devtools = false;
  const Comp = props.component.default || props.component;
  const reactive = Vue.observable({ props: { ...(props.props || {}) }, content: props.content });
  // Vue 2 replaces the mount target, so mount onto a placeholder owned by the frame document.
  const target = container.ownerDocument.createElement('div');
  container.appendChild(target);
  vm = new Vue({
    render: (h: any) => h(Comp, { props: reactive.props }, reactive.content !== undefined ? [reactive.content] : undefined),
  }).$mount(target);
  state = reactive;
}

onMounted(mount);
watch(() => props.component, mount);
watch(
  () => props.props,
  (next) => {
    if (state) state.props = { ...(next || {}) };
  },
  { deep: true }
);
watch(
  () => props.content,
  (next) => {
    if (state) state.content = next;
  }
);
onBeforeUnmount(destroy);
</script>

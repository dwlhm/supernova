<template>
  <div ref="containerRef" class="react-host-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps<{
  component: any;
  props?: any;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
let root: any = null;
let reactModule: any = null;

function render() {
  if (!root || !reactModule || !props.component) return;
  const createElement = reactModule.createElement || (reactModule.default && reactModule.default.createElement);
  if (!createElement) return;
  const Comp = props.component.default || props.component;
  root.render(createElement(Comp, props.props || {}));
}

onMounted(async () => {
  if (!containerRef.value) return;
  const [React, { createRoot }] = await Promise.all([
    import('react'),
    import('react-dom/client'),
  ]);
  reactModule = React;
  root = createRoot(containerRef.value);
  render();
});

watch(
  () => [props.component, props.props],
  () => {
    render();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (root) {
    root.unmount();
    root = null;
  }
});
</script>

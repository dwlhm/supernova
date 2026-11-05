<template>
  <component :is="tag || 'div'" ref="containerRef" class="svelte-host-container contents" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps<{
  component: any;
  props?: any;
  tag?: string;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
let instance: any = null;

function mountSvelte() {
  if (instance) {
    try {
      instance.$destroy();
    } catch {
      // ignore
    }
    instance = null;
  }
  if (!containerRef.value || !props.component) return;
  try {
    const Component = props.component.default || props.component;
    instance = new Component({
      target: containerRef.value,
      props: props.props || {},
    });
  } catch (err) {
    console.error('[SvelteHost] Failed to mount Svelte component:', err);
  }
}

onMounted(() => {
  mountSvelte();
});

watch(
  () => props.component,
  () => {
    mountSvelte();
  }
);

watch(
  () => props.props,
  (nextProps) => {
    if (instance && typeof instance.$set === 'function') {
      instance.$set(nextProps || {});
    } else {
      mountSvelte();
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (instance) {
    try {
      instance.$destroy();
    } catch {
      // ignore
    }
    instance = null;
  }
});
</script>

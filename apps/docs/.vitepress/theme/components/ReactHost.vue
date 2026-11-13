<template>
  <component :is="tag || 'div'" ref="containerRef" class="react-host-container contents" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { ICON_PATHS } from '../preview/utils';

const props = defineProps<{
  component: any;
  props?: any;
  content?: string;
  tag?: string;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
let root: any = null;
let reactModule: any = null;

function resolveReactProps(rawProps: Record<string, any> = {}, createElement: any): Record<string, any> {
  const out: Record<string, any> = { ...rawProps };
  for (const [k, v] of Object.entries(out)) {
    if ((k === 'icon' || k.endsWith('Icon')) && typeof v === 'string') {
      const pathData = v ? ICON_PATHS[v] : undefined;
      out[k] = pathData
        ? function PreviewIcon(iconProps: Record<string, any>) {
            return createElement(
              'svg',
              {
                'aria-hidden': 'true',
                className: iconProps?.className || 'h-4 w-4 shrink-0',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '1.5',
              },
              createElement('path', {
                d: pathData,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              })
            );
          }
        : undefined;
    }
  }
  return out;
}

function render() {
  if (!root || !reactModule || !props.component) return;
  const createElement = reactModule.createElement || (reactModule.default && reactModule.default.createElement);
  if (!createElement) return;
  const Comp = props.component.default || props.component;
  root.render(createElement(Comp, resolveReactProps(props.props || {}, createElement), props.content));
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
  () => [props.component, props.props, props.content],
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

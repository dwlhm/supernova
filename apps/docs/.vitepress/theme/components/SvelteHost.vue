<template>
  <component :is="tag || 'div'" ref="containerRef" class="svelte-host-container contents" />
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
let instance: any = null;
let lastIconSignature = '';

/**
 * Svelte 3 has no public API for slot content from code; this is the block shape its compiler emits for
 * `<slot>` content (`create`, `mount`, `update`, `destroy`), holding one text node of the frame document.
 */
function textSlot(doc: Document, text: string) {
  return () => {
    let node: Text;
    return {
      c() {
        node = doc.createTextNode(text);
      },
      m(target: Node, anchor?: Node | null) {
        target.insertBefore(node, anchor ?? null);
      },
      p() {},
      d(detaching: boolean) {
        if (detaching) node.remove();
      },
    };
  };
}

function svgSlot(doc: Document, pathData: string) {
  return () => {
    let svg: SVGSVGElement;
    return {
      c() {
        const ns = 'http://www.w3.org/2000/svg';
        svg = doc.createElementNS(ns, 'svg');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('class', 'h-4 w-4 shrink-0');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '1.5');
        const path = doc.createElementNS(ns, 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(path);
      },
      m(target: Node, anchor?: Node | null) {
        target.insertBefore(svg, anchor ?? null);
      },
      p() {},
      d(detaching: boolean) {
        if (detaching) svg.remove();
      },
    };
  };
}

function getIconSignature(rawProps: Record<string, any> = {}): string {
  return Object.entries(rawProps)
    .filter(([k]) => k === 'icon' || k.endsWith('Icon'))
    .map(([k, v]) => `${k}:${typeof v === 'string' ? v : ''}`)
    .join('|');
}

function buildSvelteInitProps(doc: Document, rawProps: Record<string, any> = {}) {
  const cleanProps: Record<string, any> = { ...rawProps };
  const slots: Record<string, any[]> = {};
  if (props.content !== undefined) {
    slots.default = [textSlot(doc, props.content)];
  }
  for (const [k, v] of Object.entries(cleanProps)) {
    if ((k === 'icon' || k.endsWith('Icon')) && typeof v === 'string') {
      const pathData = v ? ICON_PATHS[v] : undefined;
      if (pathData) {
        slots[k] = [svgSlot(doc, pathData)];
      }
      cleanProps[k] = undefined;
    }
  }
  if (Object.keys(slots).length > 0) {
    return { ...cleanProps, $$slots: slots, $$scope: { ctx: [] } };
  }
  return cleanProps;
}

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
    lastIconSignature = getIconSignature(props.props);
    instance = new Component({
      target: containerRef.value,
      props: buildSvelteInitProps(containerRef.value.ownerDocument, props.props || {}),
    });
  } catch (err) {
    console.error('[SvelteHost] Failed to mount Svelte component:', err);
  }
}

onMounted(() => {
  mountSvelte();
});

watch(() => props.content, mountSvelte);

watch(
  () => props.component,
  () => {
    mountSvelte();
  }
);

watch(
  () => props.props,
  (nextProps) => {
    const nextSig = getIconSignature(nextProps);
    if (nextSig !== lastIconSignature) {
      mountSvelte();
      return;
    }
    if (instance && typeof instance.$set === 'function') {
      const cleaned: Record<string, any> = { ...(nextProps || {}) };
      for (const [k, v] of Object.entries(cleaned)) {
        if ((k === 'icon' || k.endsWith('Icon')) && typeof v === 'string') cleaned[k] = undefined;
      }
      instance.$set(cleaned);
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

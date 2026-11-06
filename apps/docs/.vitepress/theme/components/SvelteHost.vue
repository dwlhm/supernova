<template>
  <component :is="tag || 'div'" ref="containerRef" class="svelte-host-container contents" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps<{
  component: any;
  props?: any;
  content?: string;
  tag?: string;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
let instance: any = null;

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

function slotProps(doc: Document) {
  if (props.content === undefined) return {};
  return { $$slots: { default: [textSlot(doc, props.content)] }, $$scope: { ctx: [] } };
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
    instance = new Component({
      target: containerRef.value,
      props: { ...(props.props || {}), ...slotProps(containerRef.value.ownerDocument) },
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

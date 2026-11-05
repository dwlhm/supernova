<template>
  <iframe
    ref="frameRef"
    class="isolated-preview-iframe"
    srcdoc="<!doctype html><html><head><meta charset='utf-8'></head><body></body></html>"
    :style="{
      width: '100%',
      height: `${frameHeight}px`,
      border: '0',
      display: 'block',
      overflow: 'hidden',
      backgroundColor: 'transparent',
    }"
    title="Isolated UI Preview"
    @load="onFrameLoad"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, createApp, h } from 'vue';
import { useRouter } from 'vitepress';
import previewFrameCss from '../preview-frame.css?inline';

const props = withDefaults(
  defineProps<{
    framework: 'react' | 'vue3' | 'svelte';
    component: any;
    props?: Record<string, any>;
    isDark?: boolean;
    align?: 'center' | 'stretch';
    minHeight?: number;
  }>(),
  {
    props: () => ({}),
    isDark: false,
    align: 'center',
    minHeight: 96,
  }
);

const router = useRouter();
const frameRef = ref<HTMLIFrameElement | null>(null);
const frameHeight = ref(props.minHeight);

let unmountCurrent: (() => void) | null = null;
let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;

function updateHeight() {
  const doc = frameRef.value?.contentDocument;
  if (!doc?.body) return;
  const el = doc.getElementById('app-root');
  if (!el) return;
  const rootRect = el.getBoundingClientRect();
  let maxBottom = Math.ceil(rootRect.height);
  const popovers = el.querySelectorAll('[role="dialog"], [role="listbox"], [role="tooltip"], .absolute');
  const win = doc.defaultView;
  for (let i = 0; i < popovers.length; i++) {
    const node = popovers[i] as HTMLElement;
    const st = win?.getComputedStyle(node);
    if (st && (st.display === 'none' || st.visibility === 'hidden' || st.opacity === '0')) {
      continue;
    }
    const r = node.getBoundingClientRect();
    if (r.height > 0 && r.width > 0) {
      const relBottom = Math.ceil(r.bottom - rootRect.top) + 12;
      if (relBottom > maxBottom) maxBottom = relBottom;
    }
  }
  const scrollH = el.scrollHeight;
  const targetH = Math.max(props.minHeight, maxBottom, scrollH);
  if (Math.abs(frameHeight.value - targetH) > 1) {
    frameHeight.value = targetH;
  }
}

function bindNavigationBridge(doc: Document) {
  if ((doc as any).__navBound) return;
  (doc as any).__navBound = true;
  doc.addEventListener('click', (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    const anchor = (e.target as HTMLElement | null)?.closest?.('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#')) {
      return;
    }
    e.preventDefault();
    router.go(href);
  });
}

function ensureFrameDocument(): HTMLElement | null {
  const doc = frameRef.value?.contentDocument;
  if (!doc || !doc.head || !doc.body) return null;

  if (!doc.head.querySelector('style[data-isolated-frame="true"]')) {
    const styleEl = doc.createElement('style');
    styleEl.setAttribute('data-isolated-frame', 'true');
    styleEl.textContent = previewFrameCss;
    doc.head.appendChild(styleEl);
  }

  let layoutStyle = doc.head.querySelector('style[data-isolated-layout="true"]') as HTMLStyleElement | null;
  if (!layoutStyle) {
    layoutStyle = doc.createElement('style');
    layoutStyle.setAttribute('data-isolated-layout', 'true');
    doc.head.appendChild(layoutStyle);
  }
  layoutStyle.textContent =
    props.align === 'stretch'
      ? `html, body { height: auto !important; min-height: 0 !important; overflow: hidden !important; } #app-root { width: 100%; height: auto !important; min-height: 0 !important; display: flow-root; padding: 4px 2px; }`
      : `html, body { height: auto !important; min-height: 0 !important; overflow: hidden !important; } #app-root { padding: 24px 16px; display: flex; align-items: center; justify-content: center; min-height: ${props.minHeight}px; width: 100%; }`;

  let rootEl = doc.getElementById('app-root');
  if (!rootEl) {
    rootEl = doc.createElement('div');
    rootEl.id = 'app-root';
    doc.body.appendChild(rootEl);
  }

  bindNavigationBridge(doc);
  return rootEl;
}

async function renderIntoFrame() {
  if (!props.component) return;
  const rootEl = ensureFrameDocument();
  const doc = frameRef.value?.contentDocument;
  const win = frameRef.value?.contentWindow as any;
  if (!rootEl || !doc || !win) return;

  if (props.isDark) {
    doc.documentElement.classList.add('dark');
  } else {
    doc.documentElement.classList.remove('dark');
  }

  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
  if (unmountCurrent) {
    try {
      unmountCurrent();
    } catch {
      // ignore unmount errors
    }
    unmountCurrent = null;
  }
  rootEl.innerHTML = '';

  const Comp = props.component.default || props.component;

  try {
    if (props.framework === 'react') {
      const [React, { createRoot }] = await Promise.all([
        import('react'),
        import('react-dom/client'),
      ]);
      const root = createRoot(rootEl);
      root.render(React.createElement(Comp, props.props || {}));
      unmountCurrent = () => root.unmount();
    } else if (props.framework === 'vue3') {
      const app = createApp({
        render() {
          return h(Comp, props.props || {});
        },
      });
      app.mount(rootEl);
      unmountCurrent = () => app.unmount();
    } else if (props.framework === 'svelte') {
      const instance = new Comp({
        target: rootEl,
        props: props.props || {},
      });
      unmountCurrent = () => instance.$destroy?.();
    }
  } catch (err) {
    console.error(`[IsolatedFrame] Render error (${props.framework}):`, err);
  }

  if (win.ResizeObserver) {
    resizeObserver = new win.ResizeObserver(() => updateHeight());
    resizeObserver!.observe(rootEl);
  }
  if (win.MutationObserver) {
    mutationObserver = new win.MutationObserver(() => updateHeight());
    mutationObserver!.observe(rootEl, { childList: true, subtree: true, attributes: true });
  }
  setTimeout(updateHeight, 20);
  setTimeout(updateHeight, 120);
}

function onFrameLoad() {
  renderIntoFrame();
}

onMounted(() => {
  if (frameRef.value?.contentDocument?.readyState === 'complete') {
    renderIntoFrame();
  }
});

watch(
  () => props.isDark,
  (dark) => {
    const doc = frameRef.value?.contentDocument;
    if (!doc) return;
    doc.documentElement.classList.toggle('dark', Boolean(dark));
  }
);

watch(
  () => [props.component, props.props, props.framework, props.align],
  () => {
    renderIntoFrame();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
  if (unmountCurrent) {
    try {
      unmountCurrent();
    } catch {
      // ignore
    }
    unmountCurrent = null;
  }
});
</script>

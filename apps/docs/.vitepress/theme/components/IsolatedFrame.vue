<template>
  <iframe
    ref="frameRef"
    class="w-full border-0 overflow-hidden transition-all duration-200"
    :style="{ height: `${frameHeight}px` }"
    @load="onFrameLoad"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps<{
  framework: 'react' | 'vue3' | 'svelte';
  component: any;
  props: Record<string, any>;
  isDark?: boolean;
}>();

const frameRef = ref<HTMLIFrameElement | null>(null);
const frameHeight = ref(120);

let unmountCurrent: (() => void) | null = null;
let resizeObserver: any = null;

function updateHeight() {
  if (!frameRef.value?.contentDocument?.body) return;
  const doc = frameRef.value.contentDocument;
  const el = doc.getElementById('app-root');
  if (el) {
    const scrollH = el.scrollHeight;
    frameHeight.value = Math.max(80, scrollH + 32);
  }
}

async function renderIntoFrame() {
  if (!frameRef.value?.contentDocument || !props.component) return;
  const doc = frameRef.value.contentDocument;
  const win = frameRef.value.contentWindow as any;
  if (!win) return;

  let rootEl = doc.getElementById('app-root');
  if (!rootEl) {
    setupFrame();
    rootEl = doc.getElementById('app-root');
    if (!rootEl) return;
  }

  // Sync theme
  if (props.isDark) {
    doc.documentElement.classList.add('dark');
  } else {
    doc.documentElement.classList.remove('dark');
  }

  // Cleanup prior mount & observer
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (unmountCurrent) {
    unmountCurrent();
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
      const { createApp, h } = await import('vue');
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
    resizeObserver.observe(rootEl);
  }
  setTimeout(updateHeight, 50);
}

function setupFrame() {
  if (!frameRef.value?.contentDocument) return;
  const doc = frameRef.value.contentDocument;

  // Grab styles from host document (Tailwind + tokens)
  if (!doc.head.querySelector('style[data-isolated-frame]')) {
    const linkEls = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel*="stylesheet"], link[as="style"]')
    );
    const hrefs = new Set<string>();
    for (const l of linkEls) {
      if (l.href) hrefs.add(l.href);
    }
    for (const s of Array.from(document.styleSheets)) {
      if (s.href) hrefs.add(s.href);
    }

    for (const href of hrefs) {
      const link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => sanitizeFrameStyles(doc);
      doc.head.appendChild(link);
    }

    // Inline style tags from host document
    for (const s of Array.from(document.querySelectorAll('style'))) {
      if (!s.hasAttribute('data-isolated-frame')) {
        doc.head.appendChild(s.cloneNode(true));
      }
    }

    const baseStyle = doc.createElement('style');
    baseStyle.setAttribute('data-isolated-frame', 'true');
    baseStyle.textContent = `
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        font-family: inherit;
      }
      #app-root {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 80px;
      }
    `;
    doc.head.appendChild(baseStyle);
  }

  sanitizeFrameStyles(doc);

  let root = doc.getElementById('app-root');
  if (!root) {
    root = doc.createElement('div');
    root.id = 'app-root';
    doc.body.appendChild(root);
  }

  renderIntoFrame();
}

function sanitizeFrameStyles(doc: Document) {
  // Strip VitePress unlayered button reset (button { background-color: transparent })
  // that clobbers Tailwind v4 layered utility classes
  for (const sheet of Array.from(doc.styleSheets)) {
    try {
      for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
        const r = sheet.cssRules[i] as CSSStyleRule;
        if (r.selectorText === 'button' && r.style?.backgroundColor === 'transparent') {
          sheet.deleteRule(i);
        }
      }
    } catch {
      // In case of any cross-origin sheet
    }
  }
}

function onFrameLoad() {
  setupFrame();
}

onMounted(() => {
  setupFrame();
});

watch(
  () => [props.component, props.props, props.framework, props.isDark],
  () => {
    renderIntoFrame();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (unmountCurrent) {
    unmountCurrent();
    unmountCurrent = null;
  }
});
</script>

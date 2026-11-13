<template>
  <component :is="tag || 'div'" ref="containerRef" class="angular-host-container contents" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { ICON_PATHS } from '../preview/utils';

const props = defineProps<{
  component: any;
  props?: Record<string, any>;
  content?: string;
  tag?: string;
}>();

type Subscription = { unsubscribe: () => void };

const containerRef = ref<HTMLElement | null>(null);
let app: any = null;
let componentRef: any = null;
let angularCore: any = null;
let subscriptions: Subscription[] = [];
/** Text projected into the component's `<ng-content>`. */
let contentNode: Text | null = null;
/** Bumped on every mount/unmount so a slow async mount never outlives a newer one. */
let generation = 0;
const angularIconCache = new Map<string, any>();

/** Angular is linked at build time (see `angularLinkerPlugin` in config.mts) and loaded only for this tab. */
async function loadAngular() {
  const [core, browser] = await Promise.all([import('@angular/core'), import('@angular/platform-browser')]);
  angularCore = core;
  return { core, browser };
}

function getAngularIconComponent(iconKey: string): any {
  const pathData = iconKey ? ICON_PATHS[iconKey] : undefined;
  if (!pathData || !angularCore) return undefined;
  if (angularIconCache.has(iconKey)) return angularIconCache.get(iconKey);
  const core = angularCore;
  class PreviewIconComponent {
    static ɵfac = () => new PreviewIconComponent();
    static ɵcmp = core.ɵɵdefineComponent({
      type: PreviewIconComponent,
      selectors: [['kd-preview-icon']],
      standalone: true,
      decls: 2,
      vars: 0,
      consts: [
        ['aria-hidden', 'true', 'viewBox', '0 0 24 24', 'fill', 'none', 'stroke', 'currentColor', 'stroke-width', '1.5', 1, 'h-4', 'w-4', 'shrink-0'],
        ['stroke-linecap', 'round', 'stroke-linejoin', 'round', 'd', pathData],
      ],
      template: function PreviewIcon_Template(rf: number) {
        if (rf & 1) {
          core.ɵɵnamespaceSVG();
          core.ɵɵelementStart(0, 'svg', 0);
          core.ɵɵelement(1, 'path', 1);
          core.ɵɵelementEnd();
        }
      },
      styles: ['[_nghost-%COMP%] { display: contents; }'],
    });
  }
  angularIconCache.set(iconKey, PreviewIconComponent);
  return PreviewIconComponent;
}

/** Inputs go through `setInput`; function props subscribe to the matching `@Output()` EventEmitter. */
function applyProps(next: Record<string, any> = {}) {
  if (!componentRef) return;
  const def = componentRef.componentType.ɵcmp ?? {};
  subscriptions.forEach((s) => s.unsubscribe());
  subscriptions = [];
  for (const [key, value] of Object.entries(next)) {
    if (def.outputs && key in def.outputs && typeof value === 'function') {
      subscriptions.push(componentRef.instance[key].subscribe(value));
    } else if (def.inputs && key in def.inputs) {
      const resolvedValue =
        (key === 'icon' || key.endsWith('Icon')) && typeof value === 'string' ? getAngularIconComponent(value) : value;
      componentRef.setInput(key, resolvedValue);
    }
  }
  componentRef.changeDetectorRef.detectChanges();
}

function destroy() {
  generation++;
  subscriptions.forEach((s) => s.unsubscribe());
  subscriptions = [];
  componentRef = null;
  contentNode = null;
  app?.destroy();
  app = null;
}

async function mount() {
  destroy();
  const container = containerRef.value;
  if (!container || !props.component) return;
  const current = generation;
  const { core, browser } = await loadAngular();
  const doc = container.ownerDocument;
  // One zoneless application per frame: styles and DOM belong to the iframe document, not the docs page.
  const created = await browser.createApplication({
    providers: [core.provideZonelessChangeDetection(), { provide: core.DOCUMENT, useValue: doc }],
  });
  if (current !== generation) {
    created.destroy();
    return;
  }
  app = created;
  const host = doc.createElement('div');
  container.appendChild(host);
  contentNode = props.content !== undefined ? doc.createTextNode(props.content) : null;
  componentRef = core.createComponent(props.component.default || props.component, {
    environmentInjector: app.injector,
    hostElement: host,
    projectableNodes: contentNode ? [[contentNode]] : [],
  });
  app.attachView(componentRef.hostView);
  applyProps(props.props);
}

onMounted(mount);
watch(() => props.component, mount);
watch(() => props.props, (next) => applyProps(next), { deep: true });
// Projection is fixed at creation: update text in place, remount when content appears or disappears.
watch(
  () => props.content,
  (next, prev) => {
    if (contentNode && next !== undefined && prev !== undefined) contentNode.textContent = next;
    else mount();
  }
);
onBeforeUnmount(destroy);
</script>

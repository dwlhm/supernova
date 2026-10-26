import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TabsItem {
  /** Stable identifier used for ARIA id wiring and selection callbacks. */
  id: string;
  /** Visible tab label. Keep labels short and parallel. */
  label: string;
  /** Optional leading icon glyph (emoji or single character) rendered at 12px. */
  icon?: string;
  /** Optional numeric value rendered inside the pill badge. */
  value?: number | string;
  /** Disabled tabs stay visible but cannot be selected. */
  disabled?: boolean;
}

export interface TabsProps {
  /** Two to eight peer tabs ordered by importance or natural sequence. */
  tabs?: TabsItem[];
  /** Controlled active tab id. When provided, the component is fully controlled. */
  activeId?: string;
  /** Initial active tab id for uncontrolled usage. */
  defaultActiveId?: string;
  /** Fired with the newly selected tab id. */
  onSelect?: (id: string) => void;
  /** Accessible name for the tablist. */
  ariaLabel?: string;
  /** Prefix used to build deterministic element ids for ARIA wiring. */
  idBase?: string;
  className?: string;
  /** Extra classes for the optional active tab panel wrapper. */
  panelClassName?: string;
  children?: any;
}

export default function Tabs(props: TabsProps) {
  useDefaultProps({
    tabs: [],
    activeId: '',
    defaultActiveId: '',
    ariaLabel: 'Tabs',
    idBase: 'tabs',
    className: '',
    panelClassName: '',
  });

  const state = useStore({
    internalActiveId: props.defaultActiveId || '',
    get enabledTabs() {
      return (props.tabs || []).filter((tab) => !tab.disabled);
    },
    get activeTabId() {
      if (props.activeId) {
        return props.activeId;
      }
      if (state.internalActiveId) {
        return state.internalActiveId;
      }
      return state.enabledTabs.length > 0 ? state.enabledTabs[0].id : '';
    },
    getTabId(tabId) {
      return `${props.idBase}-tab-${tabId}`;
    },
    getPanelId(tabId) {
      return `${props.idBase}-panel-${tabId}`;
    },
    isActive(tabId) {
      return state.activeTabId === tabId;
    },
    selectTab(tabId) {
      if (!tabId) {
        return;
      }
      state.internalActiveId = tabId;
      if (props.onSelect) {
        props.onSelect(tabId);
      }
    },
    handleKeyDown(event, currentTabId) {
      const items = state.enabledTabs;
      if (items.length === 0) {
        return;
      }
      const currentIndex = items.findIndex((tab) => tab.id === currentTabId);
      if (currentIndex === -1) {
        return;
      }
      let nextIndex = currentIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % items.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + items.length) % items.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = items.length - 1;
      } else {
        return;
      }
      event.preventDefault();
      state.selectTab(items[nextIndex].id);
    },
  });

  return (
    <div class={cn('inline-flex flex-col self-start', props.className)}>
      <div
        role="tablist"
        aria-label={props.ariaLabel}
        aria-orientation="horizontal"
        class={cn(
          'flex flex-row justify-center items-center gap-0 p-0-5 h-9 rounded-xl',
          'bg-components-tabs-all-color-container-background-default'
        )}
      >
        <For each={props.tabs}>
          {(tab) => (
            <button
              type="button"
              role="tab"
              id={state.getTabId(tab.id)}
              aria-selected={state.isActive(tab.id) ? 'true' : 'false'}
              aria-controls={state.getPanelId(tab.id)}
              tabIndex={state.isActive(tab.id) ? 0 : -1}
              disabled={tab.disabled}
              class={cn(
                'flex flex-row justify-center items-center gap-1 px-2 py-1 rounded-lg border text-sm font-medium leading-none transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-0',
                'disabled:opacity-50 disabled:pointer-events-none',
                state.isActive(tab.id)
                  ? 'bg-components-tabs-active-color-tab-background-default border-components-tabs-active-color-tab-border-default text-components-tabs-active-color-label-foreground-default shadow-sm'
                  : 'border-transparent text-components-tabs-inactive-color-label-foreground-default hover:bg-components-tabs-active-color-tab-background-default'
              )}
              onClick={() => state.selectTab(tab.id)}
              onKeyDown={(event: KeyboardEvent) => state.handleKeyDown(event, tab.id)}
            >
              <Show when={tab.icon}>
                <span
                  aria-hidden="true"
                  class={cn(
                    'flex items-center justify-center w-3 h-3 text-components-tabs-all-color-icon-foreground-default'
                  )}
                >
                  {tab.icon}
                </span>
              </Show>
              <span class="whitespace-nowrap">{tab.label}</span>
              <Show when={tab.value !== undefined && tab.value !== null}>
                <span
                  class={cn(
                    'flex flex-row justify-center items-center px-1 py-0-5 rounded-full text-xs font-medium leading-none',
                    'bg-components-tabs-all-color-num-background-default text-components-tabs-all-color-num-foreground-default'
                  )}
                >
                  {tab.value}
                </span>
              </Show>
            </button>
          )}
        </For>
      </div>
      <Show when={props.children}>
        <div
          role="tabpanel"
          id={state.getPanelId(state.activeTabId)}
          aria-labelledby={state.getTabId(state.activeTabId)}
          tabIndex={0}
          class={cn('mt-3 focus:outline-none', props.panelClassName)}
        >
          {props.children}
        </div>
      </Show>
    </div>
  );
}

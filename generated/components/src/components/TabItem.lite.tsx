import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TabItemProps {
  label?: string;
  active?: boolean;
  showIcon?: boolean;
  showNum?: boolean;
  num?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

export default function TabItem(props: TabItemProps) {
  useDefaultProps({
    label: 'Label',
    active: false,
    showIcon: false,
    showNum: false,
    num: '1',
    className: '',
  });

  const state = useStore({
    get tabClasses() {
      return props.active
        ? 'bg-components-tabs-active-color-tab-background-default border border-components-tabs-active-color-tab-border-default shadow-sm text-components-tabs-active-color-label-foreground-default'
        : 'border border-transparent text-components-tabs-inactive-color-label-foreground-default hover:bg-background-default';
    },
    handleClick() {
      if (props.onClick) {
        props.onClick();
      }
    },
  });

  return (
    <button
      type="button"
      role="tab"
      aria-selected={props.active}
      class={cn(
        'inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-rounded-lg px-2 py-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
        state.tabClasses,
        props.className
      )}
      onClick={() => state.handleClick()}
    >
      <Show when={props.showIcon}>
        <span class="flex shrink-0 items-center text-components-tabs-all-color-icon-foreground-default">
          <Show when={props.children}>
            {props.children}
          </Show>
          <Show when={!props.children}>
            <svg
              aria-hidden="true"
              class="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
            </svg>
          </Show>
        </span>
      </Show>
      <span class="truncate">{props.label}</span>
      <Show when={props.showNum}>
        <span class="inline-flex shrink-0 items-center rounded-rounded-full bg-components-tabs-all-color-num-background-default px-1 py-0.5 text-xs font-medium leading-none text-components-tabs-all-color-num-foreground-default">
          {props.num}
        </span>
      </Show>
    </button>
  );
}

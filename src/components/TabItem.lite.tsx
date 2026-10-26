import { Show, useDefaultProps, useStore } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TabItemProps {
  /** Text label rendered inside the tab. */
  label?: string;
  /** Shows or hides the leading icon. */
  showIcon?: boolean;
  /** Shows or hides the numeric value. */
  showNum?: boolean;
  /** Value rendered inside the numeric badge. */
  num?: string;
  /** Marks this tab as the currently selected tab of its group. */
  active?: boolean;
  /** Disables interaction with the tab. */
  disabled?: boolean;
  /** DOM id of the tab element, used for tablist wiring. */
  id?: string;
  /** DOM id of the tab panel controlled by this tab. */
  controlsId?: string;
  /** Additional custom CSS classes. */
  className?: string;
  /** Optional custom icon node rendered inside the leading icon slot. */
  children?: any;
  /** Fired when the tab is activated. */
  onClick?: () => void;
}

export default function TabItem(props: TabItemProps) {
  useDefaultProps({
    label: 'Label',
    showIcon: false,
    showNum: false,
    num: '1',
    active: false,
    disabled: false,
    className: '',
  });

  const state = useStore({
    get isActive() {
      return props.active === true;
    },
    get containerClasses() {
      return state.isActive
        ? 'bg-components-tabs-active-color-tab-background-default border-components-tabs-active-color-tab-border-default shadow-xs'
        : 'bg-transparent border-transparent hover:bg-background-subtle';
    },
    get labelClasses() {
      return state.isActive
        ? 'text-components-tabs-active-color-label-foreground-default'
        : 'text-components-tabs-inactive-color-label-foreground-default';
    },
    get iconClasses() {
      return state.isActive
        ? 'text-components-tabs-all-color-icon-foreground-default'
        : 'text-foreground-muted';
    },
    handleClick() {
      if (props.disabled) {
        return;
      }
      if (props.onClick) {
        props.onClick();
      }
    },
  });

  return (
    <button
      type="button"
      role="tab"
      id={props.id}
      aria-selected={state.isActive ? 'true' : 'false'}
      aria-controls={props.controlsId}
      disabled={props.disabled}
      class={cn(
        'inline-flex flex-row items-center justify-center gap-1 border rounded-components-tabs-all-size-tab-radius-default px-2 py-1 font-font-size-sm font-weight-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        state.containerClasses,
        state.labelClasses,
        props.className
      )}
      onClick={() => state.handleClick()}
    >
      <Show when={props.showIcon}>
        <span
          class={cn('inline-flex items-center justify-center w-3 h-3 shrink-0', state.iconClasses)}
          aria-hidden="true"
        >
          {props.children}
        </span>
      </Show>

      <span class="inline-flex items-center leading-none">{props.label}</span>

      <Show when={props.showNum}>
        <span
          class="inline-flex items-center justify-center rounded-rounded-full bg-components-tabs-all-color-num-background-default px-1 py-0-5 font-font-size-2xs font-weight-medium leading-none text-components-tabs-all-color-num-foreground-default"
        >
          {props.num}
        </span>
      </Show>
    </button>
  );
}

import { useStore, useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TooltipProps {
  /** Tooltip message (Figma: "Text content"). Overrides the default label. */
  textContent?: string;
  /** @deprecated use textContent */
  text?: string;
  /** Where the tooltip appears relative to its trigger. */
  position?: 'Top' | 'Bottom' | 'Left' | 'Right';
  /** Id used for the tooltip element and aria-describedby wiring. */
  id?: string;
  /** Prevents the tooltip from opening. */
  disabled?: boolean;
  className?: string;
  children?: any;
}

export default function Tooltip(props: TooltipProps) {
  useDefaultProps({
    textContent: 'Label',
    position: 'Top',
    id: 'tooltip',
    disabled: false,
    className: '',
  });

  const state = useStore({
    isOpen: false,
    show() {
      if (props.disabled) {
        return;
      }
      state.isOpen = true;
    },
    hide() {
      state.isOpen = false;
    },
    toggle() {
      if (props.disabled) {
        return;
      }
      state.isOpen = !state.isOpen;
    },
    handleKeyDown(event) {
      if (event && event.key === 'Escape' && state.isOpen) {
        state.hide();
      }
    },
    get normalizedPosition() {
      return (props.position || 'Top').toLowerCase();
    },
    get tooltipId() {
      return props.id || 'tooltip';
    },
    get label() {
      return props.textContent || props.text || '';
    },
    get openStateClasses() {
      return state.isOpen ? 'visible opacity-100' : 'invisible opacity-0';
    },
    get placementClasses() {
      switch (state.normalizedPosition) {
        case 'bottom':
          return 'left-1/2 top-full mt-2 -translate-x-1/2';
        case 'left':
          return 'right-full top-1/2 mr-2 -translate-y-1/2';
        case 'right':
          return 'left-full top-1/2 ml-2 -translate-y-1/2';
        case 'top':
        default:
          return 'bottom-full left-1/2 mb-2 -translate-x-1/2';
      }
    },
    get caretClasses() {
      switch (state.normalizedPosition) {
        case 'bottom':
          return 'left-1/2 -top-1 -translate-x-1/2';
        case 'left':
          return 'top-1/2 -right-1 -translate-y-1/2';
        case 'right':
          return 'top-1/2 -left-1 -translate-y-1/2';
        case 'top':
        default:
          return 'left-1/2 -bottom-1 -translate-x-1/2';
      }
    },
  });

  return (
    <span
      class={cn('group relative inline-flex items-center', props.className)}
      aria-describedby={state.tooltipId}
      onMouseEnter={() => state.show()}
      onMouseLeave={() => state.hide()}
      onFocus={() => state.show()}
      onBlur={() => state.hide()}
      onClick={() => state.toggle()}
      onKeyDown={(event: KeyboardEvent) => state.handleKeyDown(event)}
    >
      {props.children}
      <span
        role="tooltip"
        id={state.tooltipId}
        class={cn(
          'pointer-events-none absolute z-50 w-max max-w-xs rounded-rounded-lg bg-components-tooltip-accent-color-container-background-default px-2 py-1 text-center font-caption-medium text-components-tooltip-accent-color-label-text-default shadow-md transition-opacity duration-150',
          'invisible opacity-0',
          'group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100',
          state.openStateClasses,
          state.placementClasses
        )}
      >
        <span
          aria-hidden="true"
          class={cn(
            'absolute h-2 w-2 rotate-45 rounded-rounded-xs bg-components-tooltip-accent-color-caret-background-default',
            state.caretClasses
          )}
        />
        {state.label}
      </span>
    </span>
  );
}

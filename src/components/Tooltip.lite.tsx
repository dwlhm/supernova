import { useDefaultProps, useStore } from '@builder.io/mitosis';
import { cn, cva, createTooltipState, bindControllerProps } from './utils';

export interface TooltipProps {
  text?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  contentClassName?: string;
  dotClassName?: string;
  className?: string;
  children?: any;
}

export default function Tooltip(props: TooltipProps) {
  useDefaultProps({ text: 'Label', position: 'top', trigger: 'hover', id: 'tooltip', contentClassName: '', dotClassName: '', className: '' });
  const state = useStore({
    isHovered: false,
    isClickedOpen: false,
    handleMouseEnter() {
      if (props.trigger !== 'click') state.isHovered = true;
    },
    handleMouseLeave() {
      if (props.trigger !== 'click') state.isHovered = false;
    },
    handleClick() {
      if (props.trigger === 'click') {
        state.isClickedOpen = !(props.open ?? state.isClickedOpen);
        props.onOpenChange?.(state.isClickedOpen);
      }
    },
    handleKeyDown(event: { key?: string }) {
      if (event.key === 'Escape') {
        state.isHovered = false;
        state.isClickedOpen = false;
        props.onOpenChange?.(false);
      }
    },
  });

  return (
    <span
      data-ctrl={typeof bindControllerProps}
      onMouseEnter={() => state.handleMouseEnter()}
      onMouseLeave={() => state.handleMouseLeave()}
      onClick={() => state.handleClick()}
      onKeyDown={(event) => state.handleKeyDown(event)}
      class={cn('group relative inline-flex items-center justify-center', props.className)}
    >
      <span
        tabIndex={0}
        aria-describedby={createTooltipState({ id: props.id }).getTriggerProps()['aria-describedby']}
        class="inline-flex h-full w-full cursor-pointer select-none items-center justify-center focus:outline-none"
      >
        {props.children}
      </span>
      <span
        role={createTooltipState({ id: props.id }).getContentProps().role}
        id={createTooltipState({ id: props.id }).getContentProps().id}
        class={cn(
          'pointer-events-none absolute z-50 inline-flex items-center justify-center gap-0.5 whitespace-nowrap transition-all duration-150',
          props.open === true || (props.open !== false && (props.trigger === 'click' ? state.isClickedOpen : state.isHovered))
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0',
          props.trigger !== 'click' && props.open === undefined ? 'group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100' : '',
          cva(props.position, {
            top: 'bottom-full left-1/2 mb-1.5 -translate-x-1/2 flex-col',
            bottom: 'top-full left-1/2 mt-1.5 -translate-x-1/2 flex-col-reverse',
            left: 'right-full top-1/2 mr-1.5 -translate-y-1/2 flex-row',
            right: 'left-full top-1/2 ml-1.5 -translate-y-1/2 flex-row-reverse',
          }, 'top')
        )}
      >
        <span class={cn('inline-flex items-center justify-center rounded-lg bg-primary-default px-3 py-2 font-body text-sm font-normal leading-5 text-primary-foreground', props.contentClassName)}>
          {props.text}
        </span>
        <span aria-hidden="true" class={cn('h-1.5 w-1.5 shrink-0 rounded-full bg-primary-default', props.dotClassName || props.contentClassName)} />
      </span>
    </span>
  );
}

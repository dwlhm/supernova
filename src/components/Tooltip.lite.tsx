import { useStore, useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TooltipProps {
  text?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  id?: string;
  className?: string;
  children?: any;
}

export default function Tooltip(props: TooltipProps) {
  useDefaultProps({
    text: 'Label',
    position: 'top',
    id: 'tooltip',
    className: '',
  });

  const state = useStore({
    get positionClasses() {
      switch (props.position) {
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
  });

  return (
    <span class={cn('group relative inline-flex', props.className)}>
      {props.children}
      <span
        role="tooltip"
        id={props.id}
        class={cn(
          'pointer-events-none invisible absolute z-50 max-w-xs whitespace-nowrap rounded-rounded-lg bg-components-tooltip-accent-color-container-background-default px-2 py-1 text-xs font-medium text-components-tooltip-accent-color-label-text-default opacity-0 shadow-md transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100',
          state.positionClasses
        )}
      >
        {props.text}
      </span>
    </span>
  );
}

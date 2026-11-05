import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, createTooltipState, bindControllerProps } from './utils';

export interface TooltipProps {
  text?: string;
  textContent?: string;
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

  return (
    <span
      data-ctrl={typeof bindControllerProps}
      aria-describedby={props.children ? createTooltipState({ id: props.id }).triggerProps['aria-describedby'] : undefined}
      class={cn('group relative inline-flex items-center justify-center', props.className)}
    >
      <Show when={props.children}>{props.children}</Show>
      <span
        role={createTooltipState({ id: props.id }).tooltipProps?.role || 'tooltip'}
        id={createTooltipState({ id: props.id }).tooltipProps?.id || props.id}
        class={cn(
          'pointer-events-none z-50 inline-flex items-center justify-center gap-0.5 whitespace-nowrap transition-opacity',
          cva(
            props.position,
            {
              top: 'flex-col',
              bottom: 'flex-col-reverse',
              left: 'flex-row',
              right: 'flex-row-reverse',
            },
            'top'
          ),
          props.children
            ? cn(
                'invisible absolute opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100',
                cva(
                  props.position,
                  {
                    top: 'bottom-full left-1/2 mb-1.5 -translate-x-1/2',
                    bottom: 'left-1/2 top-full mt-1.5 -translate-x-1/2',
                    left: 'right-full top-1/2 mr-1.5 -translate-y-1/2',
                    right: 'left-full top-1/2 ml-1.5 -translate-y-1/2',
                  },
                  'top'
                )
              )
            : 'relative visible opacity-100'
        )}
      >
        <span class="inline-flex items-center justify-center rounded-lg bg-primary-default px-3 py-2 font-body text-sm font-normal leading-5 text-primary-foreground">
          {props.textContent || props.text}
        </span>
        <span
          aria-hidden="true"
          class="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-default"
        />
      </span>
    </span>
  );
}

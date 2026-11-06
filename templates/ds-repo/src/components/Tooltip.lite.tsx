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
    text: '',
    textContent: '',
    position: 'top',
    id: 'tooltip',
    className: '',
  });

  return (
    <span
      data-ctrl={typeof bindControllerProps}
      aria-describedby={createTooltipState({ id: props.id }).getTriggerProps()['aria-describedby']}
      class={cn('group relative inline-flex items-center justify-center', props.className)}
    >
      <Show when={props.children}>{props.children}</Show>
      <span
        role={createTooltipState({ id: props.id }).getContentProps().role}
        id={createTooltipState({ id: props.id }).getContentProps().id}
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
          )
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

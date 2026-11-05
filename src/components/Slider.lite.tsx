import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getSliderState, bindControllerProps } from './utils';

export interface SliderProps {
  id?: string;
  name?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  showValue?: boolean;
  className?: string;
  onValueChange?: (value: number) => void;
}

export default function Slider(props: SliderProps) {
  useDefaultProps({
    id: 'slider', name: 'slider', value: 0, min: 0, max: 100, step: 1,
    disabled: false, label: 'Slider', showValue: false, className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-2', props.className)}>
      <Show when={props.showValue}>
        <div class="flex items-center justify-between text-xs text-foreground-muted">
          <span>{props.label}</span>
          <span>{props.value}</span>
        </div>
      </Show>
      <div class={cn('relative flex h-5 w-full items-center', props.disabled && 'opacity-50')}>
        <div class="absolute inset-x-0 h-1.5 rounded-full bg-background-muted" />
        <div
          class="absolute left-0 h-1.5 rounded-full bg-primary-default"
          style={getSliderState(props).barStyle}
        />
        <input
          id={props.id} name={props.name} type="range" min={props.min} max={props.max} step={props.step}
          value={props.value} disabled={props.disabled} aria-label={props.label}
          class="peer absolute inset-0 z-10 h-5 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          onInput={(event) => !props.disabled && props.onValueChange && props.onValueChange(Number(event.target.value))}
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-default bg-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
          style={getSliderState(props).thumbStyle}
        />
      </div>
    </div>
  );
}

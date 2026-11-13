import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, getSliderState, bindControllerProps } from './utils';

export interface SliderProps {
  id?: string;
  name?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string | ((value: number) => string);
  showLabel?: boolean;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  hint?: string | ((value: number) => string);
  showHint?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  validating?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  trackClassName?: string;
  indicatorClassName?: string;
  className?: string;
  onValueChange?: (value: number) => void;
  onBlur?: (event: unknown) => void;
}

export default function Slider(props: SliderProps) {
  useDefaultProps({
    id: 'slider', name: 'slider', value: 0, min: 0, max: 100, step: 1,
    label: '', showLabel: true, showValue: false, hint: '', showHint: true,
    required: false, error: false, errorMessage: '', validating: false,
    disabled: false, ariaLabel: 'Slider', trackClassName: '', indicatorClassName: '', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-2', props.className)}>
      <Show when={(props.showLabel && getSliderState(props).resolvedLabel !== '') || props.showValue}>
        <div class="flex items-center justify-between gap-2">
          <Show when={props.showLabel && getSliderState(props).resolvedLabel !== ''}>
            <label for={props.id} class="flex items-center gap-1 text-sm font-medium text-foreground-default">
              {getSliderState(props).resolvedLabel}
              <Show when={props.required}><span aria-hidden="true" class="text-destructive-default">*</span></Show>
            </label>
          </Show>
          <Show when={props.showValue}>
            <span class="ml-auto text-sm font-medium text-foreground-muted">{getSliderState(props).displayValue}</span>
          </Show>
        </div>
      </Show>
      <div class={cn('relative flex h-5 w-full items-center rounded-full', props.disabled && 'opacity-50')}>
        <div class={cn('absolute inset-x-0 h-1.5 rounded-full bg-background-muted', props.trackClassName)} />
        <div
          class={cn('absolute left-0 h-1.5 rounded-full bg-primary-default', props.indicatorClassName)}
          style={getSliderState(props).barStyle}
        />
        <input
          id={props.id} name={props.name} type="range" min={props.min} max={props.max} step={props.step}
          value={props.value} disabled={props.disabled} required={props.required}
          aria-label={getSliderState(props).resolvedLabel || props.ariaLabel}
          aria-invalid={getSliderState(props).hasError || undefined}
          aria-describedby={(props.showHint || getSliderState(props).hasError) && getSliderState(props).helpText !== '' ? props.id + '-hint' : undefined}
          class="peer absolute inset-0 z-10 h-5 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          onInput={(event) => !props.disabled && props.onValueChange && props.onValueChange(Number(event.target.value))}
          onBlur={(event) => !props.disabled && props.onBlur && props.onBlur(event)}
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-default bg-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
          style={getSliderState(props).thumbStyle}
        />
      </div>
      <Show when={(props.showHint || getSliderState(props).hasError) && getSliderState(props).helpText !== ''}>
        <span id={props.id + '-hint'} class={cn('text-sm', getSliderState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')}>{getSliderState(props).helpText}</span>
      </Show>
    </div>
  );
}

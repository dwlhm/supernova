import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TableEmptyProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  showIcon?: boolean;
  icon?: any;
  showTitle?: boolean;
  showDescription?: boolean;
  showCTA?: boolean;
  colSpan?: number;
  onCtaClick?: () => void;
  className?: string;
  children?: any;
}

export default function TableEmpty(props: TableEmptyProps) {
  useDefaultProps({
    title: '', description: '', ctaLabel: '',
    showIcon: true, showTitle: true, showDescription: true, showCTA: false, colSpan: 5, className: '',
  });

  return (
    <tr>
      <td colSpan={props.colSpan} class="p-0">
        <div class={cn('flex flex-col items-center justify-center gap-4 rounded-lg px-8 py-10', props.className)}>
          <Show when={props.showIcon || Boolean(props.icon)}>
            <div class="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-background-muted text-foreground-muted">
              {props.icon}
              <Show when={!props.icon}>
                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </Show>
            </div>
          </Show>
          <div class="flex flex-col items-center justify-center gap-2">
            <Show when={props.showTitle && props.title}>
              <p class="text-center text-base font-semibold text-foreground-default">{props.title}</p>
            </Show>
            <Show when={props.showDescription && props.description}>
              <p class="text-center text-sm font-normal text-foreground-muted">{props.description}</p>
            </Show>
          </div>
          <Show when={props.showCTA && props.ctaLabel}>
            <button
              type="button"
              onClick={() => props.onCtaClick?.()}
              class="flex cursor-pointer flex-row items-center justify-center gap-2 rounded-lg bg-primary-default px-4 py-2 text-center text-sm font-medium text-primary-foreground select-none transition-all duration-150 hover:bg-primary-hover active:bg-primary-pressed active:scale-[0.97]"
            >
              {props.ctaLabel}
            </button>
          </Show>
          {props.children}
        </div>
      </td>
    </tr>
  );
}

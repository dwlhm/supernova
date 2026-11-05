import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, cva, bindControllerProps } from './utils';

export interface ToggleGroupItem {
  id: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  items?: ToggleGroupItem[];
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
  className?: string;
  children?: any;
  onToggle?: (id: string, checked: boolean) => void;
}

export default function ToggleGroup(props: ToggleGroupProps) {
  useDefaultProps({
    items: [],
    size: 'medium',
    showLabel: false,
    label: 'Toggle group',
    className: '',
  });

  return (
    <div
      data-ctrl={typeof bindControllerProps}
      role="group"
      aria-label={props.label}
      class={cn(
        'inline-flex flex-row items-center overflow-hidden rounded-lg border border-border-default bg-background-default shadow-sm',
        props.className
      )}
    >
      <Show when={props.children}>{props.children}</Show>
      <Show when={!props.children}>
        <For each={props.items}>
          {(item) => (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              aria-pressed={item.checked}
              aria-label={item.label}
              class={cn(
                'inline-flex items-center justify-center gap-1.5 border-l border-border-default first:border-l-0 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50',
                cva(props.size, { small: 'h-6 px-2 text-xs', large: 'h-9 px-3.5 text-sm', medium: 'h-8 px-2.5 text-xs' }, 'medium'),
                item.checked
                  ? 'bg-background-muted text-foreground-default'
                  : 'bg-background-default text-foreground-muted hover:bg-background-subtle hover:text-foreground-default'
              )}
              onClick={() => !item.disabled && props.onToggle && props.onToggle(item.id, !item.checked)}
            >
              <svg aria-hidden="true" class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zM6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" stroke-linejoin="round" />
              </svg>
              <span>{item.label}</span>
            </button>
          )}
        </For>
      </Show>
    </div>
  );
}

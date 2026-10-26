import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface ToggleGroupItem {
  id: string;
  label: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
}

export interface ToggleGroupRow {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  index: number;
}

export interface ToggleGroupProps {
  size?: 'Small' | 'Medium' | 'Large';
  label?: string;
  showLabel?: boolean;
  showToggle1?: boolean;
  showToggle2?: boolean;
  showToggle3?: boolean;
  showToggle4?: boolean;
  showToggle5?: boolean;
  toggles?: ToggleGroupItem[];
  disabled?: boolean;
  className?: string;
  onToggleChange?: (id: string, checked: boolean) => void;
}

export default function ToggleGroup(props: ToggleGroupProps) {
  useDefaultProps({
    size: 'Medium',
    showLabel: true,
    showToggle1: true,
    showToggle2: true,
    showToggle3: true,
    showToggle4: true,
    showToggle5: true,
    disabled: false,
    className: '',
  });

  const state = useStore({
    checkedFlags: [false, false, false, false, false],

    get rows() {
      const source = props.toggles || [];
      const visibleFlags = [
        props.showToggle1 !== false,
        props.showToggle2 !== false,
        props.showToggle3 !== false,
        props.showToggle4 !== false,
        props.showToggle5 !== false,
      ];
      const result: ToggleGroupRow[] = [];

      for (let index = 0; index < source.length && index < visibleFlags.length; index++) {
        if (!visibleFlags[index]) {
          continue;
        }

        const item = source[index];

        if (!item) {
          continue;
        }

        result.push({
          id: item.id,
          label: item.label,
          description: item.description ? item.description : '',
          checked:
            typeof item.checked === 'boolean'
              ? item.checked
              : state.checkedFlags[index] === true,
          disabled: props.disabled === true || item.disabled === true,
          index: index,
        });
      }

      return result;
    },

    get containerClasses() {
      return 'flex w-full flex-col justify-start items-start gap-4 rounded-xl p-5';
    },

    get groupLabelClasses() {
      switch (props.size) {
        case 'Small':
          return 'w-full text-foreground-muted font-label-bold';
        case 'Large':
          return 'w-full text-foreground-muted font-title-bold';
        case 'Medium':
        default:
          return 'w-full text-foreground-muted font-body-bold';
      }
    },

    get rowClasses() {
      switch (props.size) {
        case 'Small':
          return 'gap-2 px-2 py-1';
        case 'Large':
          return 'gap-3 px-3 py-2';
        case 'Medium':
        default:
          return 'gap-3 px-2 py-2';
      }
    },

    get rowLabelClasses() {
      switch (props.size) {
        case 'Small':
          return 'font-label-medium';
        case 'Large':
          return 'font-title-medium';
        case 'Medium':
        default:
          return 'font-body-medium';
      }
    },

    get rowDescriptionClasses() {
      switch (props.size) {
        case 'Small':
          return 'font-label-regular';
        case 'Large':
          return 'font-body-regular';
        case 'Medium':
        default:
          return 'font-caption-regular';
      }
    },

    get trackClasses() {
      switch (props.size) {
        case 'Small':
          return 'h-4 w-7';
        case 'Large':
          return 'h-6 w-11';
        case 'Medium':
        default:
          return 'h-5 w-9';
      }
    },

    get thumbClasses() {
      switch (props.size) {
        case 'Small':
          return 'h-3 w-3';
        case 'Large':
          return 'h-5 w-5';
        case 'Medium':
        default:
          return 'h-4 w-4';
      }
    },

    get trackColorClasses() {
      return props.disabled ? 'bg-border-subtle' : 'bg-border-default';
    },

    toggle: (index: number, id: string, checked: boolean) => {
      const nextFlags = state.checkedFlags.slice();
      nextFlags[index] = !checked;
      state.checkedFlags = nextFlags;

      if (props.onToggleChange) {
        props.onToggleChange(id, !checked);
      }
    },
  });

  return (
    <div
      role="group"
      aria-label={props.label ? props.label : undefined}
      class={cn(state.containerClasses, props.className)}
    >
      <Show when={props.showLabel !== false && !!props.label}>
        <span class={state.groupLabelClasses}>{props.label}</span>
      </Show>

      <For each={state.rows}>
        {(row) => (
          <button
            key={row.id}
            type="button"
            role="switch"
            aria-checked={row.checked ? 'true' : 'false'}
            disabled={row.disabled}
            class={cn(
              'flex w-full items-center justify-between rounded-md text-left transition-colors hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              state.rowClasses,
            )}
            onClick={() => state.toggle(row.index, row.id, row.checked)}
          >
            <span class="flex min-w-0 flex-col gap-1">
              <span class={cn('text-foreground-default', state.rowLabelClasses)}>
                {row.label}
              </span>
              <Show when={row.description !== ''}>
                <span class={cn('text-foreground-muted', state.rowDescriptionClasses)}>
                  {row.description}
                </span>
              </Show>
            </span>

            <span
              class={cn(
                'inline-flex shrink-0 items-center rounded-full px-1 transition-colors',
                state.trackClasses,
                row.checked ? 'bg-primary-default' : state.trackColorClasses,
              )}
            >
              <span
                class={cn(
                  'inline-block rounded-full bg-white shadow-xs transition-all',
                  state.thumbClasses,
                  row.checked ? 'ml-auto' : 'mr-auto',
                )}
              />
            </span>
          </button>
        )}
      </For>
    </div>
  );
}

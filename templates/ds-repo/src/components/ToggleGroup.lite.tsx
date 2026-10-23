import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';
import SwitchButton from './SwitchButton.lite';

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
  onToggle?: (id: string, checked: boolean) => void;
}

export default function ToggleGroup(props: ToggleGroupProps) {
  useDefaultProps({
    items: [],
    size: 'medium',
    showLabel: true,
    label: 'Settings',
    className: '',
  });

  const state = useStore({
    handleToggle(id: string, checked: boolean) {
      if (props.onToggle) {
        props.onToggle(id, checked);
      }
    },
  });

  return (
    <fieldset
      class={cn(
        'flex w-full flex-col rounded-rounded-lg border border-components-toggle-group-all-color-container-border-stroke-default',
        props.className
      )}
    >
      <Show when={props.showLabel}>
        <legend class="px-4 py-2 text-xs font-medium uppercase tracking-wide text-foreground-muted">
          {props.label}
        </legend>
      </Show>
      <For each={props.items}>
        {(item) => (
          <div
            key={item.id}
            class="flex items-center justify-between gap-4 border-t border-components-toggle-group-all-color-container-border-stroke-default px-4 py-3 first:border-t-0"
          >
            <span class="text-sm text-foreground-default">{item.label}</span>
            <SwitchButton
              checked={item.checked}
              disabled={item.disabled}
              size={props.size}
              label={item.label}
              leftLabel={false}
              rightLabel={false}
              onCheckedChange={(checked) => state.handleToggle(item.id, checked)}
            />
          </div>
        )}
      </For>
    </fieldset>
  );
}

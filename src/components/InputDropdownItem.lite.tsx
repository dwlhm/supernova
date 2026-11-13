import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface InputDropdownItemProps {
  value?: string;
  selected?: boolean;
  disabled?: boolean;
  children?: any;
  className?: string;
  onSelect?: (value: string) => void;
}

export default function InputDropdownItem(props: InputDropdownItemProps) {
  useDefaultProps({
    value: '',
    selected: false,
    disabled: false,
    className: '',
  });

  return (
    <button
      type="button"
      role="option"
      aria-selected={props.selected}
      disabled={props.disabled}
      class={cn(
        'flex w-full flex-row items-center justify-start gap-2.5 rounded-sm px-2 py-2 text-left text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        props.selected
          ? 'bg-background-muted font-medium text-foreground-default'
          : 'text-foreground-default hover:bg-background-muted',
        props.className
      )}
      onClick={() => !props.disabled && props.onSelect && props.onSelect(props.value || '')}
    >
      <span class="truncate">{props.children}</span>
    </button>
  );
}

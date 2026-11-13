import { useDefaultProps } from '@builder.io/mitosis';
import { cn, ICON_PATHS, bindControllerProps } from './utils';

export interface TableCheckboxBodyCellProps {
  checked?: boolean;
  ariaLabel?: string;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export default function TableCheckboxBodyCell(props: TableCheckboxBodyCellProps) {
  useDefaultProps({
    checked: false, ariaLabel: 'Select row', className: '',
  });

  return (
    <td
      data-ctrl={typeof bindControllerProps}
      class={cn('w-12 whitespace-nowrap border-t border-border-default px-4 py-3 text-center', props.className)}
    >
      <span class="relative inline-flex h-3.5 w-3.5 items-center justify-center">
        <input
          type="checkbox"
          checked={props.checked}
          aria-label={props.ariaLabel}
          class="peer absolute inset-0 h-3.5 w-3.5 cursor-pointer appearance-none rounded-sm border border-border-default bg-background-default checked:border-primary-default checked:bg-primary-default peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
          onChange={() => props.onCheckedChange && props.onCheckedChange(!props.checked)}
        />
        <svg
          aria-hidden="true"
          class={cn('pointer-events-none relative h-2.5 w-2.5 text-primary-foreground', props.checked ? 'opacity-100' : 'opacity-0')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
        >
          <path d={ICON_PATHS.check} stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </td>
  );
}

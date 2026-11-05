import { useDefaultProps } from '@builder.io/mitosis';
import { cn, ICON_PATHS, bindControllerProps } from './utils';

export interface TableCheckboxHeaderCellProps {
  checked?: boolean;
  indeterminate?: boolean;
  ariaLabel?: string;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export default function TableCheckboxHeaderCell(props: TableCheckboxHeaderCellProps) {
  useDefaultProps({
    checked: false, indeterminate: false, ariaLabel: 'Select all rows', className: '',
  });

  return (
    <th
      data-ctrl={typeof bindControllerProps}
      scope="col"
      class={cn('w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center', props.className)}
    >
      <span class="relative inline-flex h-4 w-4 items-center justify-center">
        <input
          type="checkbox"
          checked={props.checked}
          aria-checked={props.indeterminate ? 'mixed' : props.checked}
          aria-label={props.ariaLabel}
          class="peer absolute inset-0 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-border-default bg-background-default checked:border-primary-default checked:bg-primary-default peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
          onChange={() => props.onCheckedChange && props.onCheckedChange(!props.checked)}
        />
        <span
          class={cn('pointer-events-none absolute h-0.5 w-2 rounded-full bg-primary-foreground', props.indeterminate ? 'opacity-100' : 'opacity-0')}
          aria-hidden="true"
        />
        <svg
          aria-hidden="true"
          class={cn('pointer-events-none relative h-3 w-3 text-primary-foreground', props.checked && !props.indeterminate ? 'opacity-100' : 'opacity-0')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
        >
          <path d={ICON_PATHS.check} stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </th>
  );
}

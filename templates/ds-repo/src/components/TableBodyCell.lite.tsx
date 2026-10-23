import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';
import TableCellValue from './TableCellValue.lite';

export interface TableBodyCellProps {
  value?: string;
  secondaryValue?: string;
  badgeLabel?: string;
  statusLabel?: string;
  imageSrc?: string;
  avatarInitials?: string;
  href?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  children?: any;
}

export default function TableBodyCell(props: TableBodyCellProps) {
  useDefaultProps({
    value: '',
    secondaryValue: '',
    badgeLabel: '',
    statusLabel: '',
    imageSrc: '',
    avatarInitials: '',
    href: '',
    align: 'left',
    className: '',
  });

  const state = useStore({
    get cellClasses() {
      switch (props.align) {
        case 'center':
          return 'text-center';
        case 'right':
          return 'text-right';
        case 'left':
        default:
          return 'text-left';
      }
    },
  });

  return (
    <td
      class={cn(
        'border-t border-components-table-default-color-divider-border-default px-4 py-3 align-middle',
        state.cellClasses,
        props.className
      )}
    >
      <Show when={props.children}>
        {props.children}
      </Show>
      <Show when={!props.children}>
        <TableCellValue
          value={props.value}
          secondaryValue={props.secondaryValue}
          badgeLabel={props.badgeLabel}
          statusLabel={props.statusLabel}
          imageSrc={props.imageSrc}
          avatarInitials={props.avatarInitials}
          href={props.href}
          align={props.align}
        />
      </Show>
    </td>
  );
}

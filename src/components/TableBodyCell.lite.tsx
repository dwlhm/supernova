import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, bindControllerProps } from './utils';
import TableCellValue from './TableCellValue.lite';

export interface TableBodyCellProps {
  value?: string;
  secondaryValue?: string;
  badgeLabel?: string;
  buttonLabel?: string;
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
    value: 'Cell Value', secondaryValue: '', badgeLabel: '', buttonLabel: '', statusLabel: '',
    imageSrc: '', avatarInitials: '', href: '', align: 'left', className: '',
  });

  return (
    <td
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'border-t border-border-default px-4 py-3 align-middle',
        cva(props.align, { left: 'text-left', center: 'text-center', right: 'text-right' }, 'left'),
        props.className
      )}
    >
      <Show when={props.children}>{props.children}</Show>
      <Show when={!props.children}>
        <TableCellValue
          value={props.value}
          secondaryValue={props.secondaryValue}
          badgeLabel={props.badgeLabel}
          buttonLabel={props.buttonLabel}
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

import { useStore, useDefaultProps, For, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export type TableBodyRowAlign = 'left' | 'center' | 'right';

export interface TableBodyRowProps {
  showColumn1?: boolean;
  showColumn2?: boolean;
  showColumn3?: boolean;
  showColumn4?: boolean;
  showColumn5?: boolean;
  showColumn6?: boolean;
  showColumn7?: boolean;
  showColumn8?: boolean;
  showColumn9?: boolean;
  showColumn10?: boolean;
  column1Value?: string | number;
  column2Value?: string | number;
  column3Value?: string | number;
  column4Value?: string | number;
  column5Value?: string | number;
  column6Value?: string | number;
  column7Value?: string | number;
  column8Value?: string | number;
  column9Value?: string | number;
  column10Value?: string | number;
  align?: TableBodyRowAlign;
  showActions?: boolean;
  muted?: boolean;
  hoverable?: boolean;
  selected?: boolean;
  className?: string;
  children?: any;
}

export default function TableBodyRow(props: TableBodyRowProps) {
  useDefaultProps({
    showColumn1: true,
    showColumn2: true,
    showColumn3: true,
    showColumn4: true,
    showColumn5: true,
    showColumn6: false,
    showColumn7: false,
    showColumn8: false,
    showColumn9: false,
    showColumn10: false,
    align: 'left',
    showActions: false,
    muted: false,
    hoverable: true,
    selected: false,
    className: '',
  });

  const state = useStore({
    get cells() {
      return [
        { id: 'column-1', visible: props.showColumn1, value: props.column1Value },
        { id: 'column-2', visible: props.showColumn2, value: props.column2Value },
        { id: 'column-3', visible: props.showColumn3, value: props.column3Value },
        { id: 'column-4', visible: props.showColumn4, value: props.column4Value },
        { id: 'column-5', visible: props.showColumn5, value: props.column5Value },
        { id: 'column-6', visible: props.showColumn6, value: props.column6Value },
        { id: 'column-7', visible: props.showColumn7, value: props.column7Value },
        { id: 'column-8', visible: props.showColumn8, value: props.column8Value },
        { id: 'column-9', visible: props.showColumn9, value: props.column9Value },
        { id: 'column-10', visible: props.showColumn10, value: props.column10Value },
      ].filter((cell) => cell.visible);
    },
    get cellAlignClasses() {
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
    get cellToneClasses() {
      return props.muted
        ? 'text-components-table-default-color-cell-foreground-muted'
        : 'text-components-table-default-color-cell-foreground-default';
    },
    get rowClasses() {
      return cn(
        'border-b border-components-table-default-color-divider-border-default transition-colors',
        props.selected
          ? 'bg-background-muted'
          : 'bg-components-table-default-color-row-background-default',
        props.hoverable && !props.selected ? 'hover:bg-background-subtle' : '',
        props.className,
      );
    },
  });

  return (
    <tr class={state.rowClasses} aria-selected={props.selected ? 'true' : undefined}>
      <For each={state.cells}>
        {(cell, index) => (
          <td
            key={cell.id}
            class={cn(
              'px-4 py-3 align-middle text-sm leading-normal',
              state.cellAlignClasses,
              state.cellToneClasses,
            )}
          >
            {cell.value}
          </td>
        )}
      </For>
      <Show when={props.showActions}>
        <td
          class={cn(
            'whitespace-nowrap px-4 py-3 align-middle text-sm leading-normal',
            state.cellAlignClasses,
            state.cellToneClasses,
          )}
        >
          {props.children}
        </td>
      </Show>
    </tr>
  );
}

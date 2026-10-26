import { useStore, useDefaultProps, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TableHeaderRowProps {
  /** Shows or hides header column 1. Visible by default. */
  showColumn1?: boolean;
  /** Shows or hides header column 2. Visible by default. */
  showColumn2?: boolean;
  /** Shows or hides header column 3. Visible by default. */
  showColumn3?: boolean;
  /** Shows or hides header column 4. Visible by default. */
  showColumn4?: boolean;
  /** Shows or hides header column 5. Visible by default. */
  showColumn5?: boolean;
  /** Shows or hides header column 6. Hidden by default. */
  showColumn6?: boolean;
  /** Shows or hides header column 7. Hidden by default. */
  showColumn7?: boolean;
  /** Shows or hides header column 8. Hidden by default. */
  showColumn8?: boolean;
  /** Shows or hides header column 9. Hidden by default. */
  showColumn9?: boolean;
  /** Shows or hides header column 10. Hidden by default. */
  showColumn10?: boolean;
  /** Optional labels for the visible columns, in column order. */
  columnLabels?: string[];
  /** Optional text alignment per column, in column order. */
  columnAlignments?: Array<'left' | 'center' | 'right'>;
  /** Additional classes applied to the header row. */
  className?: string;
}

export default function TableHeaderRow(props: TableHeaderRowProps) {
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
    className: '',
  });

  const state = useStore({
    get visibleColumns() {
      const labels: string[] = props.columnLabels || [];
      const alignments: Array<'left' | 'center' | 'right'> = props.columnAlignments || [];
      const flags: boolean[] = [
        props.showColumn1 !== false,
        props.showColumn2 !== false,
        props.showColumn3 !== false,
        props.showColumn4 !== false,
        props.showColumn5 !== false,
        props.showColumn6 === true,
        props.showColumn7 === true,
        props.showColumn8 === true,
        props.showColumn9 === true,
        props.showColumn10 === true,
      ];

      const columns: Array<{ key: string; label: string; alignmentClass: string }> = [];

      for (let index = 0; index < flags.length; index++) {
        if (!flags[index]) {
          continue;
        }

        const alignment = alignments[index] || 'left';
        const label = labels[index] ? labels[index] : 'Column ' + (index + 1);

        columns.push({
          key: 'column-' + (index + 1),
          label,
          alignmentClass:
            alignment === 'center'
              ? 'justify-center text-center'
              : alignment === 'right'
                ? 'justify-end text-right'
                : 'justify-start text-left',
        });
      }

      return columns;
    },
  });

  return (
    <tr
      class={cn(
        'flex w-full flex-row items-start justify-start border-b border-components-table-default-color-container-border-default bg-components-table-default-color-header-background-default',
        props.className,
      )}
    >
      <For each={state.visibleColumns}>
        {(column) => (
          <th
            key={column.key}
            scope="col"
            class={cn(
              'flex min-w-0 flex-1 flex-row items-start whitespace-nowrap px-4 py-3 font-sans text-sm font-medium leading-normal text-components-table-default-color-header-foreground-default',
              column.alignmentClass,
            )}
          >
            {column.label}
          </th>
        )}
      </For>
    </tr>
  );
}

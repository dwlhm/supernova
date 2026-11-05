export interface TableColItem { id: string; label: string; align?: 'left' | 'center' | 'right'; }
export interface TableCellConfig {
  value?: string;
  secondaryValue?: string;
  badgeLabel?: string;
  buttonLabel?: string;
  imageSrc?: string;
  avatarInitials?: string;
  statusLabel?: string;
  href?: string;
  align?: 'left' | 'center' | 'right';
}
export type TableCellInput = string | TableCellConfig;
export interface TableRowItem { id: string; cells: TableCellInput[]; selected?: boolean; }
export interface TableRowCellItem {
  value: string;
  secondaryValue: string;
  badgeLabel: string;
  buttonLabel: string;
  imageSrc: string;
  avatarInitials: string;
  statusLabel: string;
  href: string;
  align: 'left' | 'center' | 'right';
}

export function getTableBodyRowCells(cells: TableCellInput[] = [], columns?: TableColItem[]): TableRowCellItem[] {
  return (cells || []).map((cell, index) => {
    const colAlign = columns?.[index]?.align || 'left';
    if (typeof cell === 'string') {
      return { value: cell, secondaryValue: '', badgeLabel: '', buttonLabel: '', imageSrc: '', avatarInitials: '', statusLabel: '', href: '', align: colAlign };
    }
    return {
      value: cell?.value || '',
      secondaryValue: cell?.secondaryValue || '',
      badgeLabel: cell?.badgeLabel || '',
      buttonLabel: cell?.buttonLabel || '',
      imageSrc: cell?.imageSrc || '',
      avatarInitials: cell?.avatarInitials || '',
      statusLabel: cell?.statusLabel || '',
      href: cell?.href || '',
      align: cell?.align || colAlign,
    };
  });
}

export function getTableState(props: {
  state?: string;
  columns?: TableColItem[];
  rows?: TableRowItem[];
  showNo?: boolean;
  showCheckbox?: boolean;
  pageSizeOptions?: number[];
}) {
  const columns = props.columns || [];
  const rows = props.state === 'empty' ? [] : (props.rows || []);
  const isEmpty = props.state === 'empty' || rows.length === 0;
  const colSpan = Math.max(1, columns.length + (props.showNo ? 1 : 0) + (props.showCheckbox ? 1 : 0));
  const selectedCount = rows.filter((r) => r.selected).length;
  const allSelected = rows.length > 0 && selectedCount === rows.length;
  const indeterminate = selectedCount > 0 && selectedCount < rows.length;
  const pageSizeOptions = props.pageSizeOptions && props.pageSizeOptions.length > 0 ? props.pageSizeOptions : [10, 20, 50];
  return { columns, rows, isEmpty, colSpan, allSelected, indeterminate, pageSizeOptions };
}

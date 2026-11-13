import { getPaginationEntries } from './core-date.js';

export interface CrumbItem { label: string; href?: string; }
export interface CrumbEntry { key: string; label: string; href: string; isEllipsis: boolean; isCurrent: boolean; originalIndex: number; }

export function getBreadcrumbState(props: { items?: CrumbItem[]; type?: string; showEllipsis?: boolean; maxItems?: number }): CrumbEntry[] {
  const all = props.items || [];
  const total = all.length;
  const rows: CrumbEntry[] = [];
  if (total === 0) return rows;
  let start = 0;
  const end = total - 1;
  let collapsed = false;
  if (props.type === '1') start = total - 1;
  else if (props.type === '2') start = total > 1 ? total - 2 : total - 1;
  else if (props.showEllipsis && total > (props.maxItems || 4)) collapsed = true;
  if (!collapsed) {
    for (let i = start; i <= end; i++) {
      rows.push({ key: `crumb-${i}`, label: all[i]!.label, href: all[i]!.href || '#', isEllipsis: false, isCurrent: i === end, originalIndex: i });
    }
    return rows;
  }
  rows.push({ key: 'crumb-first', label: all[0]!.label, href: all[0]!.href || '#', isEllipsis: false, isCurrent: false, originalIndex: 0 });
  rows.push({ key: 'crumb-ellipsis', label: '...', href: '#', isEllipsis: true, isCurrent: false, originalIndex: -1 });
  for (let i = end - 1; i <= end; i++) {
    rows.push({ key: `crumb-${i}`, label: all[i]!.label, href: all[i]!.href || '#', isEllipsis: false, isCurrent: i === end, originalIndex: i });
  }
  return rows;
}

export function getPaginationState(currentPage = 1, totalPages = 1, getPageAriaLabel?: (page: number) => string) {
  const total = totalPages > 0 ? totalPages : 1;
  const current = Math.min(Math.max(1, currentPage || 1), total);
  const entries = getPaginationEntries(current, total).map((e) => ({
    ...e,
    ariaLabel: e.isEllipsis ? undefined : (typeof getPageAriaLabel === 'function' ? getPageAriaLabel(e.page) : `Page ${e.label}`),
  }));
  return { current, total, canPrev: current > 1, canNext: current < total, entries };
}

export function getStepperStepState(index: number, current = 1, total = 0) {
  const pos = index + 1;
  return {
    isCompleted: pos < current,
    isCurrent: pos === current,
    isLast: index === total - 1,
    stepKey: pos < current ? 'completed' : pos === current ? 'active' : 'upcoming',
    prevCompleted: index < current,
  };
}

export function getProgressState(value = 0, label?: string | ((percentage: number) => string)) {
  const percentage = Math.min(100, Math.max(0, value || 0));
  const resolvedLabel = typeof label === 'function' ? label(percentage) : (label ?? 'Progress');
  return { percentage, barStyle: { width: `${percentage}%` }, resolvedLabel };
}

export function getAvatarState(props: { showStatus?: boolean; status?: string; alt?: string; initialsText?: string }) {
  const baseName = props.alt || props.initialsText || 'Avatar';
  const accessibleName = props.showStatus && props.status ? `${baseName} (${props.status})` : baseName;
  return { accessibleName };
}

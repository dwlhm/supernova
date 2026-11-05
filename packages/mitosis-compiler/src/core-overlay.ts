import { focusElementSafely, getNextRovingIndex, resolveId } from './core-a11y.js';

export interface DialogStateOptions {
  id?: string;
  open?: boolean;
  showDescription?: boolean;
  onClose?: () => void;
}

export function createDialogState(options: DialogStateOptions = {}) {
  const baseId = resolveId(options.id, 'dialog');
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;
  const hasDesc = options.showDescription !== false;
  return {
    isOpen: options.open ?? false, titleId, descriptionId,
    getBackdropProps: () => ({ 'aria-hidden': 'true' as const, onClick: () => options.onClose?.() }),
    getContentProps: (role: 'dialog' | 'alertdialog' = 'alertdialog') => ({
      role, 'aria-modal': 'true' as const, 'aria-labelledby': titleId, 'aria-describedby': hasDesc ? descriptionId : undefined,
      tabIndex: -1, onKeyDown: (event: { key?: string }) => { if (event?.key === 'Escape') options.onClose?.(); },
    }),
    getTitleProps: () => ({ id: titleId }), getDescriptionProps: () => ({ id: descriptionId }),
  };
}

export function handleRovingFocus(
  event: { key: string; preventDefault?: () => void; currentTarget?: unknown },
  currentIndex: number,
  totalItems: number,
  onSelect: (index: number) => void
): void {
  const nextIndex = getNextRovingIndex(event?.key, currentIndex, totalItems);
  if (nextIndex < 0) return;
  event.preventDefault?.();
  onSelect(nextIndex);
  const container = event?.currentTarget as { querySelectorAll?: (s: string) => unknown[] } | undefined;
  if (container && typeof container.querySelectorAll === 'function') {
    focusElementSafely(container.querySelectorAll('[role="tab"], button')[nextIndex]);
  }
}

export interface TabsStateOptions<T extends { id: string }> {
  tabs: T[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function createTabsState<T extends { id: string }>(options: TabsStateOptions<T>) {
  const activeId = options.activeId || (options.tabs[0]?.id ?? '');
  return {
    activeId,
    getTabListProps: () => ({
      role: 'tablist' as const,
      onKeyDown: (event: { key: string; preventDefault?: () => void; currentTarget?: unknown }) => {
        const idx = Math.max(0, options.tabs.findIndex((t) => t.id === activeId));
        handleRovingFocus(event, idx, options.tabs.length, (next) => {
          if (options.tabs[next]) options.onSelect?.(options.tabs[next]!.id);
        });
      },
    }),
    getTabTriggerProps: (id: string) => ({
      role: 'tab' as const, id: `tab-${id}`, 'aria-selected': id === activeId, 'aria-controls': `panel-${id}`, tabIndex: id === activeId ? 0 : -1, onClick: () => options.onSelect?.(id),
    }),
    getTabPanelProps: (id: string) => ({
      role: 'tabpanel' as const, id: `panel-${id}`, 'aria-labelledby': `tab-${id}`, tabIndex: 0, hidden: id !== activeId,
    }),
  };
}

export function createTooltipState(options: { id?: string } = {}) {
  const id = resolveId(options.id, 'tooltip');
  return { id, getTriggerProps: () => ({ 'aria-describedby': id }), getContentProps: () => ({ role: 'tooltip' as const, id }) };
}

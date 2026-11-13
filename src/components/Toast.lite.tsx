import { useDefaultProps, useStore, onMount, onUnMount, Show } from '@builder.io/mitosis';
import { cn, cva, getToastIconPath, ICON_PATHS, bindControllerProps, mergeDragStyle, createDragTimerBag, stopBagTimer, armBagTimer, pauseBagTimer, resumeBagTimer, startBagDrag, moveBagDrag, endBagDrag, getBagDeltaX, getBagDeltaY } from './utils';

export interface ToastProps {
  children?: any; id?: string; open?: boolean;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  placement?: 'inline' | 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  title?: string; description?: string; showDescription?: boolean;
  actionText?: string; showAction?: boolean; showClose?: boolean; closeLabel?: string; closeIcon?: any;
  timestamp?: string; showTimestamp?: boolean; duration?: number; pauseOnHover?: boolean;
  draggable?: boolean; swipeThreshold?: number; icon?: any;
  inlineStyle?: Record<string, string>; className?: string;
  onAction?: () => void; onClose?: () => void;
}

export default function Toast(props: ToastProps) {
  useDefaultProps({
    id: '', open: true, type: 'default', placement: 'inline', title: '', description: '', showDescription: false,
    actionText: 'Undo', showAction: false, showClose: false, closeLabel: 'Dismiss notification', timestamp: '',
    showTimestamp: true, duration: 0, pauseOnHover: true, draggable: true, swipeThreshold: 88, className: '',
  });
  const state = useStore({
    bag: createDragTimerBag(), isDragging: false, dragX: 0, dragY: 0,
    onEnter() { if (props.pauseOnHover !== false) pauseBagTimer(state.bag); },
    onLeave() { if (props.pauseOnHover !== false) resumeBagTimer(state.bag, props.open, () => props.onClose && props.onClose()); },
    onDown(e: { button?: number; clientX?: number; clientY?: number; pointerId?: number; target?: unknown; currentTarget?: unknown }) {
      if (startBagDrag(state.bag, e, props.draggable)) { state.isDragging = true; state.dragX = 0; state.dragY = 0; }
    },
    onMove(e: { clientX?: number; clientY?: number }) {
      if (moveBagDrag(state.bag, e)) { state.dragX = getBagDeltaX(state.bag); state.dragY = getBagDeltaY(state.bag); }
    },
    onEnd(e: { pointerId?: number; currentTarget?: unknown }, cancelled: boolean) {
      if (!state.isDragging) return;
      state.isDragging = false; state.dragX = 0; state.dragY = 0;
      if (endBagDrag(state.bag, e, props.placement, props.swipeThreshold, cancelled)) props.onClose && props.onClose();
      else if (cancelled || props.pauseOnHover !== false) resumeBagTimer(state.bag, props.open, () => props.onClose && props.onClose());
    },
  });
  onMount(() => { if ((props.duration || 0) > 0) armBagTimer(state.bag, props.duration || 0, props.open, () => props.onClose && props.onClose()); });
  onUnMount(() => { stopBagTimer(state.bag); });

  return (
    <Show when={props.open}>
      <div
        id={props.id || undefined} data-ctrl={typeof bindControllerProps}
        style={mergeDragStyle(props.inlineStyle, state.isDragging, state.dragX, state.dragY, props.placement, props.swipeThreshold)}
        role={props.type === 'error' ? 'alert' : 'status'} aria-live={props.type === 'error' ? 'assertive' : 'polite'}
        onMouseEnter={() => state.onEnter()} onMouseLeave={() => state.onLeave()}
        onPointerDown={(event) => state.onDown(event)} onPointerMove={(event) => state.onMove(event)} onPointerUp={(event) => state.onEnd(event, false)} onPointerCancel={(event) => state.onEnd(event, true)}
        onKeyDown={(event) => event.key === 'Escape' && props.onClose && props.onClose()}
        class={cn(
          'flex w-full max-w-md items-center gap-1.5 bg-background-default px-3 py-2 shadow-md transition-shadow hover:shadow-lg active:shadow-sm',
          props.draggable !== false && 'touch-none select-none',
          props.draggable !== false && (state.isDragging ? 'cursor-grabbing' : 'cursor-grab'),
          props.showDescription ? 'rounded-xl' : 'rounded-full',
          cva(props.placement, { inline: '', 'top-left': 'fixed top-4 left-4 z-50', 'top-center': 'fixed top-4 left-1/2 z-50 -translate-x-1/2', 'top-right': 'fixed top-4 right-4 z-50', 'bottom-left': 'fixed bottom-4 left-4 z-50', 'bottom-center': 'fixed bottom-4 left-1/2 z-50 -translate-x-1/2', 'bottom-right': 'fixed bottom-4 right-4 z-50' }, 'inline'),
          props.className
        )}
      >
        <span aria-hidden="true" class={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full p-1.5 text-foreground-on-accent', cva(props.type, { success: 'bg-success-default', error: 'bg-destructive-default', warning: 'bg-warning-default', info: 'bg-info-default', default: 'bg-foreground-subtle' }, 'default'))}>
          {props.icon}
          <Show when={!props.icon}><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d={getToastIconPath(props.type)} stroke-linecap="round" stroke-linejoin="round" /></svg></Show>
        </span>
        <span class="flex min-w-0 flex-1 flex-col gap-0.5">
          <Show when={props.title !== ''}><span class={cn('truncate text-sm font-semibold', cva(props.type, { success: 'text-success-default', error: 'text-destructive-default', warning: 'text-warning-default', info: 'text-info-default', default: 'text-foreground-default' }, 'default'))}>{props.title}</span></Show>
          <span class={cn('text-sm font-semibold empty:hidden', cva(props.type, { success: 'text-success-default', error: 'text-destructive-default', warning: 'text-warning-default', info: 'text-info-default', default: 'text-foreground-default' }, 'default'))}>{props.children}</span>
          <Show when={props.showDescription}><span class="text-xs text-foreground-muted">{props.description}</span></Show>
        </span>
        <Show when={props.showTimestamp && props.timestamp !== ''}><span class="shrink-0 text-xs text-foreground-muted">{props.timestamp}</span></Show>
        <Show when={props.showAction}><button type="button" class="shrink-0 cursor-pointer rounded-md bg-secondary-default px-2 py-1 text-xs font-medium text-secondary-foreground select-none transition-all duration-150 hover:bg-secondary-hover active:bg-background-interactive active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary" onClick={() => props.onAction && props.onAction()}>{props.actionText}</button></Show>
        <Show when={props.showClose}>
          <button type="button" aria-label={props.closeLabel} class="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-muted select-none transition-all duration-150 hover:bg-background-muted hover:text-foreground-default active:bg-background-interactive active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary" onClick={() => props.onClose && props.onClose()}>
            {props.closeIcon}
            <Show when={!props.closeIcon}><svg aria-hidden="true" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d={ICON_PATHS.close} stroke-linecap="round" /></svg></Show>
          </button>
        </Show>
      </div>
    </Show>
  );
}

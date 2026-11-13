import React, { useState, useSyncExternalStore } from 'react';
import {
  AlertDialog,
  FLOATING_PLACEMENTS,
  IconTruckDelivery,
  Progressbar,
  Toast,
  ToastViewport,
  computeDeckOffset,
  computeStackOffset,
  computeStackTrackHeight,
  groupByKey,
  parseFloatingPlacement,
  type FloatingPlacement,
  type OverlayToastEntry,
  type createOverlayController,
} from '@komerce-design/react';
import { useRenderCount } from './components/RerenderMonitor';

export type OverlayInstance = ReturnType<typeof createOverlayController>;

export interface RichToastMeta {
  progress?: number;
  progressLabel?: string;
  customIcon?: 'truck';
  badgeNote?: string;
}

const MAX_EXPANDED_VIEWPORT_PX = 380;

function resolveCardStyle(
  slot: number,
  expanded: boolean,
  heights: number[],
  vertical: 'top' | 'bottom'
): Record<string, string> {
  const anchorProp = vertical === 'bottom' ? 'bottom' : 'top';
  if (!expanded) {
    const deck = computeDeckOffset(slot, vertical, 10);
    return {
      position: 'absolute',
      left: '0px',
      right: '0px',
      [anchorProp]: '0px',
      transform: `translate3d(0, ${deck.offsetY}px, 0) scale(${deck.scale})`,
      opacity: String(deck.opacity),
      visibility: deck.hidden ? 'hidden' : 'visible',
      zIndex: String(deck.zIndex),
      pointerEvents: slot === 0 ? 'auto' : 'none',
      transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease',
    };
  }
  const stack = computeStackOffset(slot, heights, vertical, 10);
  return {
    position: 'absolute',
    left: '0px',
    right: '0px',
    [anchorProp]: '0px',
    transform: `translate3d(0, ${stack.offsetY}px, 0) scale(1)`,
    opacity: '1',
    visibility: 'visible',
    zIndex: String(stack.zIndex),
    pointerEvents: 'auto',
    transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease',
  };
}

function PlacementRegion(props: {
  placement: FloatingPlacement;
  entries: OverlayToastEntry[];
  overlay: OverlayInstance;
  forceExpanded?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const expanded = Boolean(props.forceExpanded || hovered);
  const parsed = parseFloatingPlacement(props.placement);
  const measured = props.entries.map((e) => heights[e.id] || (e.showDescription || e.meta ? 84 : 52));
  const trackH = computeStackTrackHeight(measured, expanded, 10, 10);
  const viewportH = expanded ? Math.min(trackH + 28, MAX_EXPANDED_VIEWPORT_PX) : trackH;

  const measureRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el && el.offsetHeight > 0 && heights[id] !== el.offsetHeight) {
      setHeights((prev) => (prev[id] === el.offsetHeight ? prev : { ...prev, [id]: el.offsetHeight }));
    }
  };

  return (
    <ToastViewport
      placement={props.placement}
      expanded={expanded}
      scrollable={expanded}
      ariaLabel={`Notifications (${props.placement})`}
      className={parsed.vertical === 'top' ? 'top-16 max-h-[min(70vh,380px)]' : 'bottom-6 max-h-[min(70vh,380px)]'}
      inlineStyle={{ height: `${viewportH}px` }}
      onMouseEnter={() => { setHovered(true); props.overlay.pauseToast(); }}
      onMouseLeave={() => { setHovered(false); props.overlay.resumeToast(); }}
    >
      <div className="relative w-full shrink-0" style={{ height: `${trackH}px` }}>
        {props.entries.map((entry, slot) => {
          const meta = (entry.meta || {}) as RichToastMeta;
          return (
            <div key={entry.id} ref={measureRef(entry.id)} style={resolveCardStyle(slot, expanded, measured, parsed.vertical)}>
              <Toast
                id={entry.id}
                open
                type={entry.type}
                placement="inline"
                title={entry.title}
                description={entry.description}
                showDescription={entry.showDescription}
                actionText={entry.actionText}
                showAction={entry.showAction}
                showClose={entry.showClose}
                timestamp={entry.timestamp}
                showTimestamp={entry.showTimestamp}
                draggable
                swipeThreshold={80}
                icon={meta.customIcon === 'truck' ? IconTruckDelivery : undefined}
                onClose={() => props.overlay.dismissToast(entry.id)}
                onAction={() => { entry.onAction?.(); props.overlay.dismissToast(entry.id); }}
              >
                {typeof meta.progress === 'number' && (
                  <div className="mt-1.5 w-full">
                    <Progressbar value={meta.progress} showLabel label={meta.progressLabel || 'Sinkronisasi manifest'} />
                  </div>
                )}
              </Toast>
            </div>
          );
        })}
      </div>
    </ToastViewport>
  );
}

export function IsolatedToastHost(props: { overlay: OverlayInstance; forceExpanded?: boolean }) {
  const queue = useSyncExternalStore(
    props.overlay.subscribeToastQueue,
    props.overlay.getToastQueueSnapshot,
    props.overlay.getToastQueueSnapshot
  );
  useRenderCount('overlay:toast', 'field');

  if (queue.length === 0) return null;
  const grouped = groupByKey(queue, (item) => item.placement);

  return (
    <>
      {FLOATING_PLACEMENTS.map((placement) => {
        const entries = grouped[placement];
        if (!entries || entries.length === 0) return null;
        return (
          <PlacementRegion
            key={placement}
            placement={placement}
            entries={entries}
            overlay={props.overlay}
            forceExpanded={props.forceExpanded}
          />
        );
      })}
    </>
  );
}

export function IsolatedDialogHost(props: { overlay: OverlayInstance }) {
  useSyncExternalStore(props.overlay.subscribeDialog, props.overlay.getDialogSnapshot, props.overlay.getDialogSnapshot);
  useRenderCount('overlay:dialog', 'field');
  return <AlertDialog {...props.overlay.bindDialog()} />;
}

import { useDefaultProps } from '@builder.io/mitosis';
import { cn, cva } from './utils';

export interface ToastViewportProps {
  children?: any;
  id?: string;
  placement?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  inline?: boolean;
  expanded?: boolean;
  scrollable?: boolean;
  ariaLabel?: string;
  inlineStyle?: Record<string, string>;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function ToastViewport(props: ToastViewportProps) {
  useDefaultProps({
    placement: 'top-right', inline: false, expanded: false, scrollable: true, ariaLabel: 'Notifications', className: '',
  });

  return (
    <div
      id={props.id || undefined}
      role="region"
      aria-label={props.ariaLabel || 'Notifications'}
      aria-live="polite"
      data-placement={props.placement || 'top-right'}
      data-expanded={props.expanded ? 'true' : 'false'}
      style={props.inlineStyle}
      onMouseEnter={() => props.onMouseEnter && props.onMouseEnter()}
      onMouseLeave={() => props.onMouseLeave && props.onMouseLeave()}
      class={cn(
        'flex w-full max-w-md gap-2.5 transition-all duration-200 ease-out',
        props.expanded
          ? 'rounded-2xl border border-border-default bg-background-default/95 p-3 shadow-xl backdrop-blur-md pointer-events-auto'
          : 'border-transparent bg-transparent p-0 shadow-none pointer-events-none [&>*]:pointer-events-auto',
        props.expanded && props.scrollable
          ? 'max-h-[calc(100vh-2.5rem)] overflow-y-auto overflow-x-hidden overscroll-contain'
          : 'overflow-visible',
        props.inline ? 'relative' : 'fixed z-50',
        !props.inline && cva(props.placement, {
          'top-left': 'top-4 left-4 flex-col items-start',
          'top-center': 'top-4 left-1/2 -translate-x-1/2 flex-col items-center',
          'top-right': 'top-4 right-4 flex-col items-end',
          'bottom-left': 'bottom-4 left-4 flex-col-reverse items-start',
          'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse items-center',
          'bottom-right': 'bottom-4 right-4 flex-col-reverse items-end',
        }, 'top-right'),
        props.inline && cva(props.placement, {
          'top-left': 'flex-col items-start',
          'top-center': 'flex-col items-center',
          'top-right': 'flex-col items-end',
          'bottom-left': 'flex-col-reverse items-start',
          'bottom-center': 'flex-col-reverse items-center',
          'bottom-right': 'flex-col-reverse items-end',
        }, 'top-right'),
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

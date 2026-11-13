import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, getAvatarState, bindControllerProps } from './utils';

export interface AvatarProps {
  size?: 'mini' | 'small' | 'regular' | 'large' | 'x-large';
  type?: 'image' | 'initials' | 'icon';
  showStatus?: boolean;
  initialsText?: string;
  src?: string;
  alt?: string;
  icon?: any;
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

export default function Avatar(props: AvatarProps) {
  useDefaultProps({
    size: 'mini', type: 'image', showStatus: true, initialsText: 'AB',
    src: '', alt: '', status: 'online', className: '',
  });

  return (
    <span
      data-ctrl={typeof bindControllerProps}
      role="img"
      aria-label={getAvatarState(props).accessibleName}
      class={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full bg-background-muted',
        cva(props.size, {
          mini: 'h-6 w-6 text-xs',
          small: 'h-8 w-8 text-xs',
          regular: 'h-9 w-9 text-sm',
          large: 'h-10 w-10 text-base',
          'x-large': 'h-14 w-14 text-xl',
        }, 'mini'),
        props.className
      )}
    >
      <Show when={props.type === 'image'}>
        <img src={props.src} alt="" class="h-full w-full rounded-full object-cover" />
      </Show>
      <Show when={props.type === 'icon'}>
        {props.icon}
        <Show when={!props.icon}>
          <svg
            aria-hidden="true"
            class={cn(
              'shrink-0 text-foreground-subtle',
              cva(props.size, { mini: 'h-3 w-3', small: 'h-4 w-4', regular: 'h-4 w-4', large: 'h-5 w-5', 'x-large': 'h-7 w-7' }, 'mini')
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke-linecap="round" />
          </svg>
        </Show>
      </Show>
      <Show when={props.type === 'initials'}>
        <span aria-hidden="true" class="text-center font-semibold uppercase leading-none text-foreground-subtle">
          {props.initialsText}
        </span>
      </Show>
      <Show when={props.showStatus}>
        <span
          class={cn(
            'absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background-default',
            cva(props.status, {
              offline: 'bg-background-interactive',
              busy: 'bg-destructive-default',
              away: 'bg-warning-default',
              online: 'bg-success-default',
            }, 'online')
          )}
          aria-hidden="true"
        />
      </Show>
    </span>
  );
}

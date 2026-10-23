import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface AvatarProps {
  size?: 'mini' | 'small' | 'regular' | 'large' | 'x-large';
  type?: 'image' | 'initials' | 'icon';
  showStatus?: boolean;
  initialsText?: string;
  src?: string;
  alt?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

export default function Avatar(props: AvatarProps) {
  useDefaultProps({
    size: 'regular',
    type: 'initials',
    showStatus: true,
    initialsText: 'AB',
    src: '',
    alt: '',
    status: 'online',
    className: '',
  });

  const state = useStore({
    get sizeClasses() {
      switch (props.size) {
        case 'mini':
          return 'h-6 w-6 text-xs';
        case 'small':
          return 'h-8 w-8 text-xs';
        case 'large':
          return 'h-10 w-10 text-sm';
        case 'x-large':
          return 'h-14 w-14 text-lg';
        case 'regular':
        default:
          return 'h-9 w-9 text-sm';
      }
    },
    get iconClasses() {
      switch (props.size) {
        case 'mini':
          return 'h-3 w-3';
        case 'large':
          return 'h-5 w-5';
        case 'x-large':
          return 'h-7 w-7';
        case 'small':
        case 'regular':
        default:
          return 'h-4 w-4';
      }
    },
    get statusClasses() {
      switch (props.status) {
        case 'offline':
          return 'bg-utility-spacer';
        case 'busy':
          return 'bg-destructive-default';
        case 'away':
          return 'bg-warning-default';
        case 'online':
        default:
          return 'bg-components-avatar-all-color-status-background-online';
      }
    },
    get accessibleName() {
      if (props.alt) {
        return props.alt;
      }
      if (props.initialsText) {
        return props.initialsText;
      }
      return 'Avatar';
    },
  });

  return (
    <span
      role="img"
      aria-label={state.accessibleName}
      class={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-rounded-full bg-components-avatar-all-color-container-background-default',
        state.sizeClasses,
        props.className
      )}
    >
      <Show when={props.type === 'image'}>
        <img src={props.src} alt="" class="h-full w-full rounded-rounded-full object-cover" />
      </Show>
      <Show when={props.type === 'icon'}>
        <svg
          aria-hidden="true"
          class={cn('shrink-0 text-components-avatar-all-color-icon-foreground-default', state.iconClasses)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke-linecap="round" />
        </svg>
      </Show>
      <Show when={props.type === 'initials'}>
        <span class="font-medium uppercase leading-none text-components-avatar-all-color-initials-foreground-default">
          {props.initialsText}
        </span>
      </Show>
      <Show when={props.showStatus}>
        <span
          class={cn(
            'absolute bottom-0 right-0 h-2 w-2 rounded-rounded-full border-2 border-components-avatar-all-color-status-border-default',
            state.statusClasses
          )}
          aria-hidden="true"
        />
      </Show>
    </span>
  );
}

import { Show, useDefaultProps, useStore } from '@builder.io/mitosis';
import { cn } from './utils';

export interface AvatarProps {
  /**
   * Visual prominence / layout density of the avatar.
   * mini: 24px, small: 32px, regular: 36px, large: 40px, x-large: 56px.
   */
  size?: 'mini' | 'small' | 'regular' | 'large' | 'x-large';
  /**
   * Identity source: a profile image, initials, or a generic icon fallback.
   */
  type?: 'image' | 'initials' | 'icon';
  /**
   * Shows or hides the presence indicator. Enable only when live status is relevant.
   */
  showStatus?: boolean;
  /**
   * Initials rendered by the `initials` variant. One or two uppercase characters.
   */
  initialsText?: string;
  /**
   * Profile image source, used by the `image` variant.
   */
  src?: string;
  /**
   * Accessible label / image alternative text.
   */
  alt?: string;
  /**
   * Person or entity name, used to derive initials and the accessible label.
   */
  name?: string;
  /**
   * Accessible description of the presence state.
   */
  statusLabel?: string;
  /**
   * Extra classes applied to the root element.
   */
  className?: string;
}

export default function Avatar(props: AvatarProps) {
  useDefaultProps({
    size: 'mini',
    type: 'image',
    showStatus: true,
    initialsText: 'AB',
    src: '',
    alt: '',
    name: '',
    statusLabel: 'Online',
    className: '',
  });

  const state = useStore({
    get isImage() {
      return props.type === 'image';
    },
    get isInitials() {
      return props.type === 'initials';
    },
    get isIcon() {
      return props.type === 'icon';
    },
    get initialsValue() {
      const provided = (props.initialsText || '').trim();
      if (provided) {
        return provided.slice(0, 2).toUpperCase();
      }
      const name = (props.name || '').trim();
      if (name) {
        const parts = name.split(/\s+/);
        if (parts.length > 1) {
          return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
      }
      return 'AB';
    },
    get accessibleLabel() {
      return props.alt || props.name || 'User avatar';
    },
    get containerSizeClasses() {
      switch (props.size) {
        case 'small':
          return 'w-8 h-8';
        case 'regular':
          return 'w-9 h-9';
        case 'large':
          return 'w-10 h-10';
        case 'x-large':
          return 'w-14 h-14';
        case 'mini':
        default:
          return 'w-6 h-6';
      }
    },
    get iconSizeClasses() {
      switch (props.size) {
        case 'small':
          return 'w-4 h-4';
        case 'regular':
          return 'w-4 h-4';
        case 'large':
          return 'w-5 h-5';
        case 'x-large':
          return 'w-7 h-7';
        case 'mini':
        default:
          return 'w-3 h-3';
      }
    },
    get initialsSizeClasses() {
      switch (props.size) {
        case 'small':
          return 'font-font-size-xs';
        case 'regular':
          return 'font-font-size-sm';
        case 'large':
          return 'font-font-size-sm';
        case 'x-large':
          return 'font-font-size-lg';
        case 'mini':
        default:
          return 'font-font-size-2xs';
      }
    },
    get containerClasses() {
      return cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden select-none',
        'rounded-components-avatar-circle-size-container-radius-default',
        'bg-components-avatar-all-color-container-background-default',
        state.containerSizeClasses
      );
    },
    get statusClasses() {
      return cn(
        'absolute bottom-0 right-0 block w-2 h-2 rounded-full',
        'border-2 border-components-avatar-all-color-status-border-default',
        'bg-components-avatar-all-color-status-background-online'
      );
    },
  });

  return (
    <div class={cn('relative inline-flex shrink-0 items-center justify-center', props.className)}>
      <div class={state.containerClasses}>
        <Show when={state.isImage}>
          <img
            src={props.src}
            alt={state.accessibleLabel}
            class="h-full w-full object-cover object-center"
          />
        </Show>

        <Show when={state.isInitials}>
          <span
            role="img"
            aria-label={state.accessibleLabel}
            class={cn(
              'uppercase leading-none font-weight-medium',
              'text-components-avatar-all-color-initials-foreground-default',
              state.initialsSizeClasses
            )}
          >
            {state.initialsValue}
          </span>
        </Show>

        <Show when={state.isIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            role="img"
            aria-label={state.accessibleLabel}
            class={cn(
              'text-components-avatar-all-color-icon-foreground-default',
              state.iconSizeClasses
            )}
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Show>
      </div>

      <Show when={props.showStatus}>
        <span class={state.statusClasses} aria-hidden="true"></span>
        <span class="sr-only">{props.statusLabel}</span>
      </Show>
    </div>
  );
}

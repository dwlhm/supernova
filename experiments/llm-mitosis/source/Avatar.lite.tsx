import { Show, useDefaultProps, useStore } from '@builder.io/mitosis';

export interface AvatarProps {
  color?: 'primary' | 'secondary' | 'positive';
  shape?: 'round' | 'square';
  size?: 'small' | 'medium';
  name?: string;
  initials?: string;
  src?: string;
  alt?: string;
}

export default function Avatar(props: AvatarProps) {
  useDefaultProps({
    color: 'primary',
    shape: 'round',
    size: 'medium',
    name: '',
    initials: '',
    alt: '',
  });

  const state = useStore({
    get initialsText() {
      if (props.initials && props.initials.trim()) {
        return props.initials.trim().slice(0, 2).toUpperCase();
      }
      if (props.name && props.name.trim()) {
        const parts = props.name.trim().split(/\s+/);
        if (parts.length >= 2) {
          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0].slice(0, 2).toUpperCase();
      }
      return '?';
    },
    get classes() {
      const base =
        'inline-flex items-center justify-center font-medium text-white overflow-hidden select-none shrink-0';
      const shapeCls = props.shape === 'square' ? 'rounded-lg' : 'rounded-full';
      const sizeCls = props.size === 'small' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
      let colorCls = 'bg-blue-600';
      if (props.color === 'secondary') {
        colorCls = 'bg-purple-600';
      } else if (props.color === 'positive') {
        colorCls = 'bg-green-600';
      }
      return [base, shapeCls, sizeCls, colorCls].join(' ');
    },
    get accessibleLabel() {
      return props.alt || props.name || 'User avatar';
    },
  });

  return (
    <div class={state.classes} role="img" aria-label={state.accessibleLabel}>
      <Show
        when={Boolean(props.src)}
        else={<span>{state.initialsText}</span>}
      >
        <img
          src={props.src}
          alt={state.accessibleLabel}
          class="w-full h-full object-cover"
        />
      </Show>
    </div>
  );
}

import { useDefaultProps, useStore } from '@builder.io/mitosis';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'positive' | 'gradient';
  styleType?: 'solid' | 'outline' | 'ghost';
  size?: 'small' | 'medium';
  disabled?: boolean;
  fullWidth?: boolean;
  label: string;
  onClick?: (event: any) => void;
}

export default function Button(props: ButtonProps) {
  useDefaultProps({
    variant: 'primary',
    styleType: 'solid',
    size: 'medium',
    disabled: false,
    fullWidth: false,
  });

  const state = useStore({
    get classes() {
      const base =
        'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer';
      const sizeCls =
        props.size === 'small'
          ? 'h-8 px-3 text-xs rounded-md gap-1.5'
          : 'h-10 px-4 text-sm rounded-lg gap-2';
      const widthCls = props.fullWidth ? 'w-full' : '';

      let colorCls = '';
      const variant = props.variant || 'primary';
      const styleType = props.styleType || 'solid';

      if (variant === 'primary') {
        if (styleType === 'outline') {
          colorCls =
            'border border-blue-600 text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500';
        } else if (styleType === 'ghost') {
          colorCls = 'text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500';
        } else {
          colorCls =
            'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500';
        }
      } else if (variant === 'secondary') {
        if (styleType === 'outline') {
          colorCls =
            'border border-purple-600 text-purple-600 hover:bg-purple-50 focus-visible:ring-purple-500';
        } else if (styleType === 'ghost') {
          colorCls =
            'text-purple-600 hover:bg-purple-50 focus-visible:ring-purple-500';
        } else {
          colorCls =
            'bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500';
        }
      } else if (variant === 'positive') {
        if (styleType === 'outline') {
          colorCls =
            'border border-green-600 text-green-600 hover:bg-green-50 focus-visible:ring-green-500';
        } else if (styleType === 'ghost') {
          colorCls =
            'text-green-600 hover:bg-green-50 focus-visible:ring-green-500';
        } else {
          colorCls =
            'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500';
        }
      } else if (variant === 'gradient') {
        if (styleType === 'outline') {
          colorCls =
            'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 focus-visible:ring-purple-500';
        } else if (styleType === 'ghost') {
          colorCls =
            'text-purple-600 hover:bg-purple-50 focus-visible:ring-purple-500';
        } else {
          colorCls =
            'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:opacity-95 focus-visible:ring-purple-500';
        }
      }

      return [base, sizeCls, widthCls, colorCls].filter(Boolean).join(' ');
    },
    handleClick(event) {
      if (props.onClick && !props.disabled) {
        props.onClick(event);
      }
    },
  });

  return (
    <button
      type="button"
      disabled={props.disabled}
      class={state.classes}
      onClick={(event) => state.handleClick(event)}
    >
      {props.label}
    </button>
  );
}

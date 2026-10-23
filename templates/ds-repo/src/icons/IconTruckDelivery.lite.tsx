import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface IconTruckDeliveryProps {
  size?: number;
  strokeWidth?: number;
  ariaLabel?: string;
  className?: string;
}

export default function IconTruckDelivery(props: IconTruckDeliveryProps) {
  useDefaultProps({
    size: 24,
    strokeWidth: 1.5,
    ariaLabel: 'Truck delivery',
    className: '',
  });

  return (
    <svg
      role="img"
      aria-label={props.ariaLabel}
      width={props.size}
      height={props.size}
      class={cn(
        'inline-block shrink-0 text-components-icon-truck-delivery-color-root-fill-default',
        props.className
      )}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={props.strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M5 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M15 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M5 18h-2v-11a1 1 0 0 1 1 -1h9v12h-4" />
      <path d="M15 9h5l2 3v6h-3" />
      <path d="M13 6h2l2 3" />
    </svg>
  );
}

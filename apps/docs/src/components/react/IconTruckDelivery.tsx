import * as React from "react";

export interface IconTruckDeliveryProps {
  size?: number;
  strokeWidth?: number;
  ariaLabel?: string;
  className?: string;
}

import { cn } from "./utils";

function IconTruckDelivery(props: IconTruckDeliveryProps) {
  props = {
    size: 24,
    strokeWidth: 1.5,
    ariaLabel: "Truck delivery",
    className: "",
    ...props,
  };
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-label={props.ariaLabel}
      width={props.size}
      height={props.size}
      className={cn(
        "inline-block shrink-0 text-components-icon-truck-delivery-color-root-fill-default",
        props.className
      )}
      stroke-width={props.strokeWidth}
    >
      <path d="M5 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M15 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M5 18h-2v-11a1 1 0 0 1 1 -1h9v12h-4" />
      <path d="M15 9h5l2 3v6h-3" />
      <path d="M13 6h2l2 3" />
    </svg>
  );
}

export default IconTruckDelivery;

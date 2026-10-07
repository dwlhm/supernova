import { useStore } from '@builder.io/mitosis';

export interface BadgeProps {
  label?: string;
  Label?: string;
  variant?: "primary" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline";
  Variant?: "primary" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline";
  children?: any;
  className?: string;
}

export default function Badge(props: BadgeProps) {
  const state = useStore({});

  return (
    <div className={"flex flex-row gap-1 px-2 py-1 justify-center items-center rounded-full " + (props.variant === 'secondary' ? 'bg-[#f5f5f5] text-[#171717]' : props.variant === 'destructive' ? 'bg-[#fff1f2] text-[#be123c]' : props.variant === 'success' ? 'bg-[#f0fdf4] text-[#15803d]' : props.variant === 'warning' ? 'bg-[#fffbeb] text-[#b45309]' : props.variant === 'info' ? 'bg-[#eff6ff] text-[#1d4ed8]' : props.variant === 'outline' ? 'bg-white border border-[#e5e5e5] text-[#0a0a0a]' : 'bg-[#ffe8d9] text-[#7a2e0c]') + (props.className ? " " + props.className : "")}>
      <p className="text-xs font-medium text-[#7a2e0c]">{props.label || "Badge"}</p>
      {props.children}
    </div>
  );
}

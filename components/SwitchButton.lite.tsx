export interface SwitchButtonProps {
  leftLabel?: boolean;
  rightLabel?: boolean;
  state?: "Off" | "On" | "Disabled";
  disabled?: boolean;
  size?: "Medium" | "Small" | "Large";
  onClick?: (event?: any) => void;
  children?: any;
  className?: string;
  label?: string;
  id?: string;
  ariaDescribedby?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  airplaneMode?: string;
  airplaneMode2?: string;
}

export default function SwitchButton(props: SwitchButtonProps) {
  return (
    <button type="button" onClick={(e) => props.onClick?.(e)} disabled={props.disabled || props.state === 'Disabled'} id={props.id} aria-describedby={props.ariaDescribedby} aria-label={props.ariaLabel} aria-labelledby={props.ariaLabelledby} className={"flex flex-row justify-center items-center cursor-pointer transition-colors " + (props.size === 'Medium' ? 'px-4 py-2 text-sm' : props.size === 'Large' ? 'px-6 py-3 text-lg' : 'px-3 py-1.5 text-xs') + (props.className ? " " + props.className : "")}>
      {props.leftLabel && (
        <div className="flex flex-row gap-3 px-2 justify-center items-center">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.airplaneMode ?? "Airplane mode"}</p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <div className="rounded-full bg-[#e5e5e5]">
          <div className="rounded-full bg-background-page" />
        </div>
      </div>
      {props.rightLabel && (
        <div className="flex flex-row gap-3 px-2 justify-center items-center">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.airplaneMode2 ?? "Airplane mode"}</p>
        </div>
      )}
      {props.label ?? props.children ?? 'Button'}
    </button>
  );
}

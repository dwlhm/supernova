export interface RadioButtonProps {
  leftLabel?: boolean;
  rightLabel?: boolean;
  state?: "off" | "on" | "Disabled";
  disabled?: boolean;
  size?: "Medium" | "Small" | "Large";
  onClick?: (event?: any) => void;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  leftLabelContent?: string;
  rightLabelContent?: string;
}

export default function RadioButton(props: RadioButtonProps) {
  return (
    <button type="button" onClick={(e) => props.onClick?.(e)} disabled={props.disabled || props.state === 'Disabled'} id={props.id} aria-describedby={props.ariaDescribedby} aria-label={props.ariaLabel} aria-labelledby={props.ariaLabelledby} className={"flex flex-row gap-2 items-center cursor-pointer transition-colors " + (props.size === 'Medium' ? 'px-4 py-2 text-sm' : props.size === 'Large' ? 'px-6 py-3 text-lg' : 'px-3 py-1.5 text-xs') + (props.className ? " " + props.className : "")}>
      {props.leftLabel && (
        <p className="text-sm font-normal text-[#0a0a0a]">{props.leftLabelContent ?? "Label"}</p>
      )}
      <div className="rounded-full bg-background-page border border-[#e5e5e5] shadow-sm" />
      {props.rightLabel && (
        <p className="text-sm font-normal text-[#0a0a0a]">{props.rightLabelContent ?? "Label"}</p>
      )}
    </button>
  );
}

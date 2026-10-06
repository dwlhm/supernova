export interface ToggleProps {
  showText?: boolean;
  state?: "Default" | "Active" | "Disabled";
  size?: "Medium" | "Large" | "Small";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  label?: string;
}

export default function Toggle(props: ToggleProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-row gap-1 justify-center items-center " + (props.size === 'Medium' ? 'p-1 text-xs' : props.size === 'Large' ? 'p-2 text-xs' : 'p-1 text-xs') + (props.className ? " " + props.className : "")}>
      <div>
        <div />
        <div className="border-1.5 border-[#0a0a0a]" />
        <div className="border-1.5 border-[#0a0a0a]" />
      </div>
      {props.showText && (
        <p className="text-xs font-normal text-center text-[#0a0a0a]">{props.label ?? "Bold"}</p>
      )}
      {props.children}
    </div>
  );
}

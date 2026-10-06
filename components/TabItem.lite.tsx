export interface TabItemProps {
  label?: string;
  showIcon?: boolean;
  icon?: any;
  showNum?: boolean;
  num?: string;
  state?: "Active" | "Default";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

export default function TabItem(props: TabItemProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg" + (props.className ? " " + props.className : "")}>
      <div className="flex flex-row gap-1 justify-center items-center">
        {props.showIcon && (
          <div>
            <div className="border-2 border-[#0a0a0a]" />
            <div className="border-2 border-[#0a0a0a]" />
            <div className="border-2 border-[#0a0a0a]" />
            <div className="border-2 border-[#0a0a0a]" />
          </div>
        )}
        <p className="text-sm font-medium text-[#0f0e0f]">{props.label ?? "Label"}</p>
        {props.showNum && (
          <div className="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]">
            <span className="text-xs font-medium text-[#7a2e0c]">{props.num ?? "1"}</span>
          </div>
        )}
      </div>
      {props.children}
    </div>
  );
}

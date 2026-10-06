export interface MainMenuProps {
  badgeLabel?: string;
  showTrailingIcon?: boolean;
  leadingIcon?: any;
  showLeadingIcon?: boolean;
  label?: string;
  showLabel?: boolean;
  showBadge?: boolean;
  state?: "Default" | "Hover" | "Pressed" | "Active" | "Active-Hover";
  onClick?: (event?: any) => void;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

export default function MainMenu(props: MainMenuProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-col gap-2 justify-center rounded-md" + (props.className ? " " + props.className : "")}>
      <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-3 justify-center items-center rounded-lg w-full cursor-pointer transition-colors">
        {props.showLeadingIcon !== false && (
          <div>
            <div className="border border-[#0a0a0a]" />
          </div>
        )}
        {props.showLabel !== false && (
          <p className="text-sm font-normal text-[#0a0a0a]">{props.label ?? "Menu"}</p>
        )}
        {props.showBadge && (
          <div className="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-xl bg-[#e55514]">
            <div className="flex flex-row gap-3 justify-center items-center">
              <p className="text-sm font-normal text-center text-[#fafafa]">{props.badgeLabel ?? "New"}</p>
            </div>
          </div>
        )}
        {props.showTrailingIcon !== false && (
          <div>
            <div className="border border-[#0a0a0a]" />
          </div>
        )}
      </button>
      {props.children}
    </div>
  );
}

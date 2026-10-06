export interface AvatarProps {
  showStatus?: boolean;
  initialsText?: string;
  size?: "mini" | "small" | "regular" | "large" | "x-large";
  type?: "image" | "initials" | "icon";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

export default function Avatar(props: AvatarProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-row justify-center items-center rounded-full " + (props.size === 'small' ? 'px-3 py-1.5 text-xs' : props.size === 'regular' ? 'px-4 py-2 text-sm' : props.size === 'large' ? 'px-6 py-3 text-lg' : '') + " " + (props.type === 'initials' ? 'bg-[#f5f5f5] text-[#525252]' : props.type === 'icon' ? 'bg-[#f5f5f5]' : '') + (props.className ? " " + props.className : "")}>
      {props.showStatus !== false && (
        <div className="bg-[#22c55e] border-2 border-white" />
      )}
      {props.children}
    </div>
  );
}

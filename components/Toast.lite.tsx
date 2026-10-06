export interface ToastProps {
  descriptionText?: string;
  actionText?: string;
  showDescription?: boolean;
  showActionButton?: boolean;
  showCloseButton?: boolean;
  toastText?: string;
  clock?: boolean;
  type?: "Default" | "Success" | "Error" | "Warning" | "Info";
  state?: "Default" | "Hover" | "Pressed";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  close?: string;
  timestamp?: string;
}

export default function Toast(props: ToastProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-row gap-2 px-3 py-2 items-center rounded-full shadow " + (props.type === 'Success' ? 'bg-background-page text-[#22c55e]' : props.type === 'Error' ? 'bg-background-page text-[#be123c]' : props.type === 'Warning' ? 'bg-background-page text-[#f59e0b]' : props.type === 'Info' ? 'bg-background-page text-[#3b82f6]' : 'bg-background-page text-[#0a0a0a]') + (props.className ? " " + props.className : "")}>
      <div className="flex flex-row gap-2 items-center w-full flex-1">
        <div className="flex flex-row gap-3 p-2 items-center rounded-full bg-[#525252]">
          <div>
            <div>
              <div>
                <div className="border border-white" />
                <div className="border border-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-[#0a0a0a]">{props.toastText ?? "Toast Text"}</p>
          {props.showDescription && (
            <p className="text-xs font-normal text-[#737373]">{props.descriptionText ?? "Toast description text here"}</p>
          )}
        </div>
      </div>
      {props.showActionButton && (
        <p className="text-sm font-medium text-[#0a0a0a]">{props.actionText ?? "Undo"}</p>
      )}
      {props.showCloseButton && (
        <span className="text-sm font-normal text-[#737373]">{props.close ?? "✕"}</span>
      )}
      {props.clock !== false && (
        <p className="text-xs font-normal text-[#737373]">{props.timestamp ?? "11.29.45 AM"}</p>
      )}
      {props.children}
    </div>
  );
}

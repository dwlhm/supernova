export interface InputFileDropZoneProps {
  labelText?: string;
  hintErrorText?: string;
  showRequired?: boolean;
  showHint?: boolean;
  primaryText?: string;
  supportingText?: string;
  fileName?: string;
  fileMetadata?: string;
  showLabel?: boolean;
  state?: "Default" | "Focus" | "Filled" | "Error" | "Disabled";
  onClick?: (event?: any) => void;
  showLeftIcon?: boolean;
  label?: string;
  showRightIcon?: boolean;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  requiredIndicator?: string;
}

export default function InputFileDropZone(props: InputFileDropZoneProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-col gap-3" + (props.className ? " " + props.className : "")}>
      {props.showLabel !== false && (
        <div className="flex flex-row gap-2 w-full">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.labelText ?? "Documents"}</p>
          {props.showRequired && (
            <span className="text-sm font-medium text-[#be123c]">{props.requiredIndicator ?? "*"}</span>
          )}
        </div>
      )}
      <div className="flex flex-col gap-3 p-6 justify-center items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full">
        <div>
          <div className="border border-[#0f0e0f]" />
        </div>
        <div className="flex flex-row gap-1 items-center">
          <p className="text-sm font-medium text-[#0f0e0f]">{props.primaryText ?? "Drag and drop files here, or"}</p>
          <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-1 justify-center items-center rounded-lg bg-[#f5f5f5] cursor-pointer transition-colors">
            {props.showLeftIcon !== false && (
              <div className="flex flex-row justify-center items-center">
                <div>
                  <div className="border-[#171717]" />
                </div>
              </div>
            )}
            {props.showLabel !== false && (
              <p className="text-sm font-medium text-center text-[#171717]">{props.label ?? "Browse"}</p>
            )}
            {props.showRightIcon !== false && (
              <div className="flex flex-row justify-center items-center">
                <div>
                  <div className="border-[#171717]" />
                </div>
              </div>
            )}
          </button>
        </div>
        <p className="text-sm font-normal text-[#737373]">{props.supportingText ?? "PNG, JPG, or PDF up to 10 MB"}</p>
      </div>
      {props.showHint !== false && (
        <div className="flex flex-col w-full">
          <p className="text-sm font-normal text-[#737373]">{props.hintErrorText ?? "You can upload one file."}</p>
        </div>
      )}
      {props.children}
    </div>
  );
}

import * as React from "react";

export interface InputFileInputProps {
  labelText?: string;
  buttonText?: string;
  fileName?: string;
  hintErrorText?: string;
  showRequired?: boolean;
  showHint?: boolean;
  showLabel?: boolean;
  state?: "Default" | "Focus" | "Filled" | "Error" | "Disabled";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  requiredIndicator?: string;
}

function InputFileInput(props: InputFileInputProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "flex flex-col gap-3" + (props.className ? " " + props.className : "")
      }
    >
      {props.showLabel !== false ? (
        <div className="flex flex-row gap-2 items-center w-full">
          <p className="text-sm font-medium text-[#0a0a0a]">
            {props.labelText ?? "Picture"}
          </p>
          {props.showRequired ? (
            <span className="text-sm font-medium text-[#be123c]">
              {props.requiredIndicator ?? "*"}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-row gap-3 px-3 py-1 items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full">
        <div className="flex flex-col gap-3 pr-1 items-center">
          <div className="flex flex-row gap-3 px-2 py-1 items-center w-full">
            <p className="text-sm font-medium text-[#0a0a0a]">
              {props.buttonText ?? "Choose File"}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-3 items-center w-full flex-1">
          <p className="text-base font-normal text-[#737373]">
            {props.fileName ?? "No file chosen"}
          </p>
        </div>
      </div>
      {props.showHint !== false ? (
        <div className="flex flex-row w-full">
          <p className="text-sm font-normal text-[#737373]">
            {props.hintErrorText ?? "Supported formats: PNG, JPG, or PDF."}
          </p>
        </div>
      ) : null}
      {props.children}
    </div>
  );
}

export default InputFileInput;

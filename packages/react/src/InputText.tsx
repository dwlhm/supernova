import * as React from "react";

export interface InputTextProps {
  labelText?: string;
  placeholderText?: string;
  hintErrorText?: string;
  characterCount?: string;
  showRequired?: boolean;
  icon?: any;
  showCharacterCount?: boolean;
  showHint?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  showLabel?: boolean;
  state?: "Default" | "Focus" | "Filled" | "Error" | "Disabled";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  requiredIndicator?: string;
}

function InputText(props: InputTextProps) {
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
            {props.labelText ?? "Username"}
          </p>
          {props.showRequired !== false ? (
            <span className="text-sm font-medium text-[#be123c]">
              {props.requiredIndicator ?? "*"}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-row gap-3 px-3 py-1 items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full">
        {props.showLeftIcon ? (
          <div>
            <div>
              <div>
                <div className="border-1.5 border-[#737373]" />
                <div className="border-1.5 border-[#737373]" />
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex flex-row gap-3 w-full flex-1">
          <p className="text-base font-normal text-[#525252]">
            {props.placeholderText ?? "Max Leiter"}
          </p>
        </div>
        {props.showRightIcon !== false ? (
          <div>
            <div>
              <div>
                <div className="border-1.5 border-[#737373]" />
                <div className="border-1.5 border-[#737373]" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {props.showHint !== false ? (
        <div className="flex flex-row gap-3 items-center w-full">
          <p className="text-sm font-normal text-[#737373]">
            {props.hintErrorText ??
              "Choose a unique username for your account."}
          </p>
          {props.showCharacterCount ? (
            <p className="text-sm font-normal text-right text-[#737373]">
              {props.characterCount ?? "0 / 200"}
            </p>
          ) : null}
        </div>
      ) : null}
      {props.children}
    </div>
  );
}

export default InputText;

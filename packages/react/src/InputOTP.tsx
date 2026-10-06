"use client";
import * as React from "react";

export interface InputOTPProps {
  labelText?: string;
  hintErrorText?: string;
  showRequired?: boolean;
  showHint?: boolean;
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

function InputOTP(props: InputOTPProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "flex flex-col" + (props.className ? " " + props.className : "")
      }
    >
      <div className="flex flex-col gap-3 w-full">
        {props.showLabel !== false ? (
          <div className="flex flex-row gap-2 items-center w-full">
            <p className="text-sm font-medium text-[#0a0a0a]">
              {props.labelText ?? "Label"}
            </p>
            {props.showRequired ? (
              <span className="text-sm font-medium text-[#be123c]">
                {props.requiredIndicator ?? "*"}
              </span>
            ) : null}
          </div>
        ) : null}
        <div className="flex flex-row">
          <div className="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm" />
          <div className="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm" />
          <div className="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm" />
          <div className="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm" />
          <div className="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm" />
          <div className="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm" />
        </div>
        {props.showHint !== false ? (
          <div className="flex flex-row gap-3 items-center w-full">
            <p className="text-sm font-normal text-[#737373]">
              {props.hintErrorText ??
                "Please enter the one-time password sent to your phone."}
            </p>
          </div>
        ) : null}
      </div>
      <button
        type="button"
        className="flex flex-row gap-2 px-4 py-2 justify-center items-center rounded-xl bg-[#e55514] cursor-pointer transition-colors"
        onClick={(event) => props.onClick?.()}
      >
        {props.showLeftIcon !== false ? (
          <div className="flex flex-row justify-center items-center">
            <div>
              <div className="border-white" />
            </div>
          </div>
        ) : null}
        {props.showLabel !== false ? (
          <p className="text-sm font-medium text-center text-white">
            {props.label ?? "Label"}
          </p>
        ) : null}
        {props.showRightIcon !== false ? (
          <div className="flex flex-row justify-center items-center">
            <div>
              <div className="border-white" />
            </div>
          </div>
        ) : null}
      </button>
      {props.children}
    </div>
  );
}

export default InputOTP;

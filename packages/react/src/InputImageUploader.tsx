"use client";
import * as React from "react";

export interface InputImageUploaderProps {
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

function InputImageUploader(props: InputImageUploaderProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "flex flex-col gap-3" + (props.className ? " " + props.className : "")
      }
    >
      {props.showLabel !== false ? (
        <div className="flex flex-row gap-2">
          <p className="text-sm font-medium text-[#0a0a0a]">
            {props.labelText ?? "Profile image"}
          </p>
          {props.showRequired !== false ? (
            <span className="text-sm font-medium text-[#be123c]">
              {props.requiredIndicator ?? "*"}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-row gap-4 p-3 items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full">
        <div className="flex flex-col justify-center items-center rounded-lg bg-[#f5f5f5]">
          <div>
            <div>
              <div>
                <div className="border border-[#0a0a0a]" />
                <div className="border border-[#0a0a0a]" />
                <div className="border border-[#0a0a0a]" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full flex-1">
          <p className="text-base font-normal text-[#0f0e0f]">
            {props.primaryText ?? "Upload an image"}
          </p>
          <p className="text-sm font-normal text-[#737373]">
            {props.supportingText ?? "Square JPG or PNG, up to 5 MB"}
          </p>
          <div className="flex flex-row gap-2">
            <button
              type="button"
              className="flex flex-row gap-2 px-2 py-1 justify-center items-center rounded-lg bg-[#f5f5f5] cursor-pointer transition-colors"
              onClick={(event) => props.onClick?.()}
            >
              {props.showLeftIcon !== false ? (
                <div className="flex flex-row justify-center items-center">
                  <div>
                    <div className="border-[#171717]" />
                  </div>
                </div>
              ) : null}
              {props.showLabel !== false ? (
                <p className="text-sm font-medium text-center text-[#171717]">
                  {props.label ?? "Choose image"}
                </p>
              ) : null}
              {props.showRightIcon !== false ? (
                <div className="flex flex-row justify-center items-center">
                  <div>
                    <div className="border-[#171717]" />
                  </div>
                </div>
              ) : null}
            </button>
          </div>
        </div>
      </div>
      {props.showHint !== false ? (
        <div className="flex flex-col w-full">
          <p className="text-sm font-normal text-[#737373]">
            {props.hintErrorText ?? "For best results, use a 1:1 image."}
          </p>
        </div>
      ) : null}
      {props.children}
    </div>
  );
}

export default InputImageUploader;

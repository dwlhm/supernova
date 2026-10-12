"use client";
import * as React from "react";

export interface OtpDigit {
  index: number;
  char: string;
}
export interface InputOTPProps {
  value?: string;
  length?: number;
  id?: string;
  label?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

import { cn } from "./utils";

function InputOTP(props: InputOTPProps) {
  props = {
    value: "",
    length: 6,
    id: "input-otp",
    label: "Label",
    hint: "Please enter the one-time password sent to your phone.",
    errorMessage: "",
    disabled: false,
    required: false,
    showLabel: true,
    showHint: true,
    className: "",
    ...props,
  };
  function hasError() {
    return props.errorMessage !== "";
  }

  function digits() {
    const total = props.length;
    const chars = props.value ? props.value.split("") : [];
    const rows: OtpDigit[] = [];
    for (let i = 0; i < total; i++) {
      rows.push({
        index: i,
        char: i < chars.length ? chars[i] : "",
      });
    }
    return rows;
  }

  function boxClasses() {
    if (hasError()) {
      return "border-components-input-otp-color-box-border-error";
    }
    return "border-components-input-otp-color-box-border-default focus:border-components-input-otp-color-box-border-focus";
  }

  function supportingText() {
    return hasError() ? props.errorMessage : props.hint;
  }

  function supportingClasses() {
    return hasError()
      ? "text-components-input-otp-color-supporting-text-foreground-error"
      : "text-components-input-otp-color-supporting-text-foreground-default";
  }

  function handleDigit(index: number, rawValue: string) {
    if (props.disabled) {
      return;
    }
    const total = props.length;
    const current = props.value || "";
    const chars: string[] = [];
    for (let i = 0; i < total; i++) {
      chars.push(i < current.length ? current[i] : "");
    }
    const nextChar = rawValue !== "" ? rawValue.slice(rawValue.length - 1) : "";
    chars[index] = nextChar;
    if (props.onChange) {
      props.onChange(chars.join(""));
    }
  }

  return (
    <div className={cn("flex w-full flex-col gap-3", props.className)}>
      {props.showLabel && props.label !== "" ? (
        <span className="flex items-center gap-1 text-sm font-medium text-components-input-otp-color-label-foreground-default">
          {props.label}
          {props.required ? (
            <span
              aria-hidden="true"
              className="text-components-input-otp-color-required-indicator-foreground-default"
            >
              *
            </span>
          ) : null}
        </span>
      ) : null}
      <div
        className="flex items-center gap-2.5"
        role="group"
        aria-label={props.label}
      >
        {digits()?.map((digit) => (
          <input
            type="text"
            maxlength="1"
            key={digit.index}
            value={digit.char}
            disabled={props.disabled}
            aria-label={props.label + " digit " + (digit.index + 1)}
            aria-invalid={hasError()}
            className={cn(
              "h-12 w-10 rounded-rounded-md border bg-components-input-otp-color-box-background-default text-center text-base font-medium text-components-input-otp-color-otp-value-foreground-filled outline-none transition-colors focus:ring-2 focus:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50",
              boxClasses()
            )}
            onInput={(event) => handleDigit(digit.index, event.target.value)}
          />
        ))}
      </div>
      {props.showHint ? (
        <span className={cn("text-xs", supportingClasses())}>
          {supportingText()}
        </span>
      ) : null}
    </div>
  );
}

export default InputOTP;

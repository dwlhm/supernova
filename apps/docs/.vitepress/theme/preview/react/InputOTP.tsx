"use client";
import * as React from "react";

export interface InputOTPProps {
  value?: string;
  length?: number;
  id?: string;
  name?: string;
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

import {
  cn,
  getOtpState,
  handleOtpInputEvent,
  handleOtpKeyDownEvent,
  handleOtpPasteEvent,
  bindControllerProps,
} from "./utils";

function InputOTP(props: InputOTPProps) {
  props = {
    value: "",
    length: 6,
    id: "input-otp",
    name: "otp",
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
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      id={props.id}
      data-ctrl={typeof bindControllerProps}
      className={cn("flex w-full flex-col gap-3", props.className)}
    >
      {props.showLabel && props.label !== "" ? (
        <span className="flex items-center gap-1 text-sm font-medium text-foreground-default">
          {props.label}
          {props.required ? (
            <span aria-hidden="true" className="text-destructive-default">
              *
            </span>
          ) : null}
        </span>
      ) : null}
      <div
        className="flex items-center gap-2.5"
        role="group"
        aria-label={props.label}
        onPaste={(event) =>
          !props.disabled &&
          handleOtpPasteEvent(event, props.length || 6, props.onChange)
        }
      >
        {getOtpState(props).digits?.map((digit) => (
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength="1"
            key={digit.index}
            value={digit.char}
            disabled={props.disabled}
            aria-label={props.label + " digit " + (digit.index + 1)}
            aria-invalid={getOtpState(props).hasError}
            aria-describedby={props.showHint ? props.id + "-hint" : undefined}
            className={cn(
              "h-9 w-9 rounded-md border bg-background-default text-center text-base font-medium text-foreground-default shadow-xs outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              getOtpState(props).hasError
                ? "border-destructive-border focus:ring-2 focus:ring-focus-ring-error"
                : "border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary"
            )}
            onKeyDown={(event) =>
              !props.disabled &&
              handleOtpKeyDownEvent(
                event,
                digit.index,
                props.value,
                props.length || 6,
                props.onChange
              )
            }
            onChange={(event) =>
              !props.disabled &&
              handleOtpInputEvent(
                event,
                digit.index,
                props.value,
                props.length || 6,
                props.onChange
              )
            }
          />
        ))}
      </div>
      {props.showHint ? (
        <span
          id={props.id + "-hint"}
          className={cn(
            "text-sm",
            getOtpState(props).hasError
              ? "text-destructive-foreground"
              : "text-foreground-muted"
          )}
        >
          {getOtpState(props).helpText}
        </span>
      ) : null}
    </div>
  );
}

export default InputOTP;

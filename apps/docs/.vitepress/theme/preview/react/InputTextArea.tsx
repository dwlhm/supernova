"use client";
import * as React from "react";

export interface InputTextAreaProps {
  value?: string;
  name?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  showLabel?: boolean;
  showHint?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
}

import { cn, getInputState, ICON_PATHS, bindControllerProps } from "./utils";

function InputTextArea(props: InputTextAreaProps) {
  props = {
    value: "",
    name: "input-textarea",
    id: "input-textarea",
    label: "Your message",
    placeholder: "Type your message here.",
    hint: "Your message will be copied to the support team.",
    errorMessage: "",
    disabled: false,
    required: false,
    rows: 4,
    showLabel: true,
    showHint: true,
    showCharacterCount: true,
    maxLength: 200,
    showLeftIcon: false,
    showRightIcon: false,
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      data-ctrl={typeof bindControllerProps}
      className={cn("flex w-full flex-col gap-3", props.className)}
    >
      {props.showLabel && props.label !== "" ? (
        <label
          className="flex items-center gap-1 text-sm font-medium text-foreground-default"
          htmlFor={props.id}
        >
          {props.label}
          {props.required ? (
            <span aria-hidden="true" className="text-destructive-default">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <div
        className={cn(
          "flex items-start gap-3 rounded-lg border px-3 py-1 shadow-xs transition-colors",
          props.disabled
            ? "border-border-default bg-background-muted cursor-not-allowed opacity-50"
            : getInputState(props).hasError
            ? "border-destructive-border bg-background-default focus-within:ring-2 focus-within:ring-focus-ring-error"
            : "border-border-default bg-background-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary"
        )}
      >
        {props.showLeftIcon ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={cn(
              "mt-2 h-4 w-4 shrink-0",
              getInputState(props).hasError
                ? "text-destructive-foreground"
                : "text-foreground-muted"
            )}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={ICON_PATHS.file}
            />
          </svg>
        ) : null}
        <textarea
          className="w-full resize-y bg-transparent py-2 text-base text-foreground-default outline-none placeholder:text-foreground-subtle disabled:cursor-not-allowed"
          id={props.id}
          name={props.name}
          rows={props.rows}
          value={props.value}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          disabled={props.disabled}
          required={props.required}
          aria-invalid={getInputState(props).hasError}
          aria-describedby={props.showHint ? props.id + "-hint" : undefined}
          onChange={(event) =>
            !props.disabled &&
            props.onValueChange &&
            props.onValueChange(event.target.value)
          }
        />
        {props.showRightIcon ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={cn(
              "mt-2 h-4 w-4 shrink-0",
              getInputState(props).hasError
                ? "text-destructive-foreground"
                : "text-foreground-muted"
            )}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={ICON_PATHS.checkCircle}
            />
          </svg>
        ) : null}
      </div>
      {props.showHint || props.showCharacterCount ? (
        <div className="flex items-start justify-between gap-2.5">
          {props.showHint ? (
            <span
              id={props.id + "-hint"}
              className={cn(
                "text-sm",
                getInputState(props).hasError
                  ? "text-destructive-foreground"
                  : "text-foreground-muted"
              )}
            >
              {getInputState(props).helpText}
            </span>
          ) : null}
          {props.showCharacterCount ? (
            <span
              className={cn(
                "ml-auto shrink-0 text-sm",
                getInputState(props).hasError
                  ? "text-destructive-foreground"
                  : "text-foreground-muted"
              )}
            >
              {getInputState(props).countText}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default InputTextArea;

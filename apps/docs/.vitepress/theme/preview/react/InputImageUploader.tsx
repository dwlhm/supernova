"use client";
import * as React from "react";

export interface InputImageUploaderProps {
  id?: string;
  name?: string;
  label?: string;
  primaryText?: string;
  supportingText?: string;
  fileName?: string;
  fileMetadata?: string;
  imageSrc?: string;
  hint?: string;
  errorMessage?: string;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  className?: string;
  onFileNameChange?: (fileName: string) => void;
  onFilesChange?: (files: unknown[]) => void;
  onPreviewChange?: (url: string) => void;
}

import {
  cn,
  getFileState,
  handleFileSelectEvent,
  clearFileInputEvent,
  ICON_PATHS,
  bindControllerProps,
} from "./utils";

function InputImageUploader(props: InputImageUploaderProps) {
  props = {
    id: "image-uploader",
    name: "image-file",
    label: "Profile image",
    primaryText: "Upload an image",
    supportingText: "Square JPG or PNG, up to 5 MB",
    fileName: "",
    fileMetadata: "",
    imageSrc: "",
    hint: "For best results, use a 1:1 image.",
    errorMessage: "",
    accept: "image/png,image/jpeg",
    disabled: false,
    required: true,
    showLabel: true,
    showHint: true,
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
          "flex items-center gap-4 rounded-lg border bg-background-default p-3 shadow-xs transition-colors",
          getFileState(props).hasError
            ? "border-destructive-border focus-within:ring-2 focus-within:ring-focus-ring-error"
            : "border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary",
          props.disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span
          aria-hidden="true"
          className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background-muted"
        >
          {props.imageSrc !== "" ? (
            <img
              alt=""
              className="h-full w-full object-cover"
              src={props.imageSrc}
            />
          ) : null}
          {props.imageSrc === "" ? (
            <svg
              className="h-8 w-8 text-foreground-subtle"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={ICON_PATHS.image}
              />
            </svg>
          ) : null}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="truncate text-sm font-medium text-foreground-default">
            {getFileState(props).hasFile ? (
              <>{props.fileName}</>
            ) : (
              <>{props.primaryText}</>
            )}
          </span>
          <span className="truncate text-sm text-foreground-muted">
            {getFileState(props).hasFile && props.fileMetadata !== "" ? (
              <>{props.fileMetadata}</>
            ) : (
              <>{props.supportingText}</>
            )}
          </span>
          <span className="flex items-center gap-2">
            <label
              htmlFor={props.id}
              className={cn(
                "inline-flex items-center rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover focus-within:ring-2 focus-within:ring-focus-ring-primary",
                props.disabled
                  ? "pointer-events-none cursor-not-allowed"
                  : "cursor-pointer"
              )}
            >
              {getFileState(props).hasFile ? <>Replace</> : <>Choose image</>}
              <input
                type="file"
                className="sr-only"
                id={props.id}
                name={props.name}
                accept={props.accept}
                disabled={props.disabled}
                required={props.required}
                aria-invalid={getFileState(props).hasError}
                onChange={(event) =>
                  !props.disabled &&
                  handleFileSelectEvent(
                    event,
                    props.onFileNameChange,
                    props.onFilesChange,
                    props.onPreviewChange
                  )
                }
              />
            </label>
            {getFileState(props).hasFile ? (
              <button
                type="button"
                className="inline-flex items-center rounded-lg px-2 py-0.5 text-sm font-medium text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                disabled={props.disabled}
                onClick={(event) =>
                  !props.disabled &&
                  clearFileInputEvent(
                    event,
                    props.onFileNameChange,
                    props.onFilesChange
                  )
                }
              >
                Remove
              </button>
            ) : null}
          </span>
        </span>
      </div>
      {props.showHint ? (
        <span
          id={props.id + "-hint"}
          className={cn(
            "text-sm",
            getFileState(props).hasError
              ? "text-destructive-foreground"
              : "text-foreground-muted"
          )}
        >
          {getFileState(props).helpText}
        </span>
      ) : null}
    </div>
  );
}

export default InputImageUploader;

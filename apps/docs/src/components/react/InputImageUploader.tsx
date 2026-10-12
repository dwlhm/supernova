"use client";
import * as React from "react";

export interface InputImageUploaderProps {
  id?: string;
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
}

import { cn } from "./utils";

function InputImageUploader(props: InputImageUploaderProps) {
  props = {
    id: "image-uploader",
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
  function hasError() {
    return props.errorMessage !== "";
  }

  function hasFile() {
    return props.fileName !== "";
  }

  function containerClasses() {
    if (hasError()) {
      return "border-components-input-image-uploader-color-container-border-error";
    }
    return "border-components-input-image-uploader-color-container-border-default focus-within:border-components-input-image-uploader-color-container-border-focus";
  }

  function supportingText() {
    return hasError() ? props.errorMessage : props.hint;
  }

  function supportingClasses() {
    return hasError()
      ? "text-components-input-image-uploader-color-helper-text-foreground-error"
      : "text-components-input-image-uploader-color-helper-text-foreground-default";
  }

  function setName(fileName: string) {
    if (props.onFileNameChange) {
      props.onFileNameChange(fileName);
    }
  }

  function clear() {
    setName("");
  }

  return (
    <div className={cn("flex w-full flex-col gap-3", props.className)}>
      {props.showLabel && props.label !== "" ? (
        <span className="flex items-center gap-1 text-sm font-medium text-components-input-image-uploader-color-label-foreground-default">
          {props.label}
          {props.required ? (
            <span
              aria-hidden="true"
              className="text-components-input-image-uploader-color-required-indicator-foreground-default"
            >
              *
            </span>
          ) : null}
        </span>
      ) : null}
      <div
        className={cn(
          "flex items-center gap-4 rounded-rounded-lg border bg-components-input-image-uploader-color-container-background-default p-3 transition-colors",
          containerClasses(),
          props.disabled && "opacity-50"
        )}
      >
        <span
          className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-rounded-lg bg-components-input-image-uploader-color-preview-background-default"
          aria-hidden="true"
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
              className="h-8 w-8 text-components-input-image-uploader-color-icon-fill-default"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path
                d="m21 15-5-5L5 21"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="8.5" cy="8.5" r="1.5" />
            </svg>
          ) : null}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="truncate text-sm font-medium text-components-input-image-uploader-color-primary-text-foreground-default">
            {hasFile() ? <>{props.fileName}</> : <>{props.primaryText}</>}
          </span>
          <span className="truncate text-xs text-components-input-image-uploader-color-supporting-text-foreground-default">
            {hasFile() && props.fileMetadata !== "" ? (
              <>{props.fileMetadata}</>
            ) : (
              <>{props.supportingText}</>
            )}
          </span>
          <span className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center rounded-rounded-sm border border-components-input-image-uploader-color-container-border-default bg-components-input-image-uploader-color-container-background-default px-3 py-1 text-xs font-medium text-components-input-image-uploader-color-primary-text-foreground-default focus-within:ring-2 focus-within:ring-focus-ring-primary">
              {hasFile() ? <>Replace</> : <>Browse</>}
              <input
                type="file"
                className="sr-only"
                id={props.id}
                accept={props.accept}
                disabled={props.disabled}
                required={props.required}
                aria-invalid={hasError()}
                onChange={(event) =>
                  setName(
                    event.target.files && event.target.files.length > 0
                      ? event.target.files[0].name
                      : ""
                  )
                }
              />
            </label>
            {hasFile() ? (
              <button
                type="button"
                className="inline-flex items-center rounded-rounded-sm px-2 py-1 text-xs font-medium text-components-input-image-uploader-color-primary-text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                onClick={(event) => clear()}
              >
                Remove
              </button>
            ) : null}
          </span>
        </span>
      </div>
      {props.showHint ? (
        <span className={cn("text-xs", supportingClasses())}>
          {supportingText()}
        </span>
      ) : null}
    </div>
  );
}

export default InputImageUploader;

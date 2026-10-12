"use client";
import * as React from "react";
import { useState } from "react";

export interface InputFileDropZoneProps {
  id?: string;
  label?: string;
  primaryText?: string;
  supportingText?: string;
  browseText?: string;
  fileName?: string;
  fileMetadata?: string;
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

function InputFileDropZone(props: InputFileDropZoneProps) {
  props = {
    id: "file-drop-zone",
    label: "Documents",
    primaryText: "Drag and drop files here, or",
    supportingText: "PNG, JPG, or PDF up to 10 MB",
    browseText: "browse",
    fileName: "",
    fileMetadata: "",
    hint: "You can upload one file.",
    errorMessage: "",
    accept: "image/png,image/jpeg,application/pdf",
    disabled: false,
    required: false,
    showLabel: true,
    showHint: true,
    className: "",
    ...props,
  };
  const [isDragging, setIsDragging] = useState(() => false);

  function hasError() {
    return props.errorMessage !== "";
  }

  function hasFile() {
    return props.fileName !== "";
  }

  function containerClasses() {
    if (hasError()) {
      return "border-components-input-file-drop-zone-color-container-border-error";
    }
    if (isDragging) {
      return "border-components-input-file-drop-zone-color-container-border-focus bg-background-subtle";
    }
    return "border-components-input-file-drop-zone-color-container-border-default border-dashed";
  }

  function supportingText() {
    return hasError() ? props.errorMessage : props.hint;
  }

  function supportingClasses() {
    return hasError()
      ? "text-components-input-file-drop-zone-color-supporting-text-foreground-error"
      : "text-components-input-file-drop-zone-color-supporting-text-foreground-default";
  }

  function setDragging(value: boolean) {
    setIsDragging(value);
  }

  function setName(fileName: string) {
    if (props.onFileNameChange) {
      props.onFileNameChange(fileName);
    }
  }

  return (
    <div className={cn("flex w-full flex-col gap-3", props.className)}>
      {props.showLabel && props.label !== "" ? (
        <span className="flex items-center gap-1 text-sm font-medium text-components-input-file-drop-zone-color-label-foreground-default">
          {props.label}
          {props.required ? (
            <span
              aria-hidden="true"
              className="text-components-input-file-drop-zone-color-required-indicator-foreground-default"
            >
              *
            </span>
          ) : null}
        </span>
      ) : null}
      <label
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-rounded-lg border bg-components-input-file-drop-zone-color-container-background-default px-6 py-6 text-center transition-colors",
          containerClasses(),
          props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}
        onDragEnter={(event) => setDragging(true)}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          setName(
            event.dataTransfer &&
              event.dataTransfer.files &&
              event.dataTransfer.files.length > 0
              ? event.dataTransfer.files[0].name
              : ""
          );
        }}
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6 shrink-0 text-components-input-file-drop-zone-color-vector-stroke-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            d="M12 16V4m0 0L8 8m4-4 4 4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
            stroke-linecap="round"
          />
        </svg>
        {!hasFile() ? (
          <span className="flex flex-col items-center gap-1">
            <span className="text-sm text-components-input-file-drop-zone-color-primary-text-foreground-default">
              {props.primaryText}
              <span className="font-medium underline underline-offset-2">
                {props.browseText}
              </span>
            </span>
            <span className="text-xs text-components-input-file-drop-zone-color-supporting-text-foreground-default">
              {props.supportingText}
            </span>
          </span>
        ) : null}
        {hasFile() ? (
          <span className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-components-input-file-drop-zone-color-file-name-foreground-filled">
              {props.fileName}
            </span>
            {props.fileMetadata !== "" ? (
              <span className="text-xs text-components-input-file-drop-zone-color-file-metadata-foreground-filled">
                {props.fileMetadata}
              </span>
            ) : null}
          </span>
        ) : null}
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
      {props.showHint ? (
        <span className={cn("text-xs", supportingClasses())}>
          {supportingText()}
        </span>
      ) : null}
    </div>
  );
}

export default InputFileDropZone;

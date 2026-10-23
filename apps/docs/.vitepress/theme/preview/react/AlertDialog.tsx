"use client";
import * as React from "react";

export interface AlertDialogProps {
  open?: boolean;
  heading?: string;
  description?: string;
  showDescription?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  destructive?: boolean;
  className?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

import { cn } from "./utils";

function AlertDialog(props: AlertDialogProps) {
  props = {
    open: false,
    heading: "Are you absolutely sure?",
    description:
      "This action cannot be undone. Please confirm that you want to continue.",
    showDescription: true,
    cancelLabel: "Cancel",
    confirmLabel: "Continue",
    destructive: false,
    className: "",
    ...props,
  };
  function headingId() {
    return "alert-dialog-heading";
  }

  function descriptionId() {
    return "alert-dialog-description";
  }

  function confirmClasses() {
    return props.destructive
      ? "bg-destructive-default text-destructive-on-destructive hover:bg-destructive-hover active:bg-destructive-pressed"
      : "bg-primary-default text-primary-on-primary hover:bg-primary-hover active:bg-primary-pressed";
  }

  function handleCancel() {
    if (props.onCancel) {
      props.onCancel();
    }
  }

  function handleConfirm() {
    if (props.onConfirm) {
      props.onConfirm();
    }
  }

  return (
    <>
      {props.open ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-overlay-backdrop"
              aria-hidden="true"
              onClick={(event) => handleCancel()}
            />
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={headingId()}
              aria-describedby={descriptionId()}
              className={cn(
                "relative z-10 w-full max-w-md rounded-rounded-xl border border-components-alert-dialog-default-color-dialog-border-default bg-components-alert-dialog-default-color-dialog-background-default p-6 shadow-xl",
                props.className
              )}
            >
              <h2
                className="text-lg font-semibold text-components-alert-dialog-default-color-heading-text-default"
                id={headingId()}
              >
                {props.heading}
              </h2>
              {props.showDescription ? (
                <p
                  className="mt-2 text-sm text-components-alert-dialog-default-color-description-text-default"
                  id={descriptionId()}
                >
                  {props.description}
                </p>
              ) : null}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-rounded-lg bg-components-button-secondary-color-container-background-default px-4 text-sm font-medium text-components-button-secondary-color-label-foreground-default transition-colors hover:bg-components-button-secondary-color-container-background-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                  onClick={(event) => handleCancel()}
                >
                  {props.cancelLabel}
                </button>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-9 items-center justify-center rounded-rounded-lg px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
                    confirmClasses()
                  )}
                  onClick={(event) => handleConfirm()}
                >
                  {props.confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default AlertDialog;

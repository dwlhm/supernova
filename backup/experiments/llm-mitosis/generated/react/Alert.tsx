"use client";
import * as React from "react";
import { useState } from "react";

export interface AlertProps {
  color?: "primary" | "secondary" | "positive";
  title: string;
  text: string;
  showIcon?: boolean;
  showAction?: boolean;
  actionLabel?: string;
  dismissible?: boolean;
  onAction?: () => void;
  onClose?: () => void;
}

function Alert(props: AlertProps) {
  props = {
    color: "primary",
    showIcon: true,
    showAction: false,
    actionLabel: "Action",
    dismissible: false,
    ...props,
  };
  const [dismissed, setDismissed] = useState(() => false);

  function containerClasses() {
    const base =
      "w-full p-4 rounded-xl border flex items-start gap-3 transition-all";
    if (props.color === "positive")
      return base + " bg-green-50 border-green-200 text-green-900";
    if (props.color === "secondary")
      return base + " bg-purple-50 border-purple-200 text-purple-900";
    return base + " bg-blue-50 border-blue-200 text-blue-900";
  }

  function iconWrapperClasses() {
    const color =
      props.color === "positive"
        ? "text-green-600"
        : props.color === "secondary"
        ? "text-purple-600"
        : "text-blue-600";
    return "flex-shrink-0 mt-0.5 " + color;
  }

  function actionButtonClasses() {
    const base =
      "text-xs font-semibold px-2.5 py-1.5 rounded-md transition-colors mt-2.5 cursor-pointer inline-block";
    if (props.color === "positive")
      return base + " text-green-800 bg-green-100 hover:bg-green-200";
    if (props.color === "secondary")
      return base + " text-purple-800 bg-purple-100 hover:bg-purple-200";
    return base + " text-blue-800 bg-blue-100 hover:bg-blue-200";
  }

  function handleAction() {
    if (props.onAction) {
      props.onAction();
    }
  }

  function handleClose() {
    setDismissed(true);
    if (props.onClose) {
      props.onClose();
    }
  }

  return (
    <>
      {!dismissed ? (
        <>
          <div role="alert" className={containerClasses()}>
            {props.showIcon ? (
              <div className={iconWrapperClasses()}>
                {props.color === "positive" ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
            ) : null}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm leading-5">
                {props.title}
              </div>
              <div className="text-sm mt-0.5 leading-relaxed opacity-90">
                {props.text}
              </div>
              {props.showAction ? (
                <div>
                  <button
                    type="button"
                    className={actionButtonClasses()}
                    onClick={(event) => handleAction()}
                  >
                    {props.actionLabel}
                  </button>
                </div>
              ) : null}
            </div>
            {props.dismissible ? (
              <button
                type="button"
                className="flex-shrink-0 -mr-1 -mt-1 p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Dismiss alert"
                onClick={(event) => handleClose()}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            ) : null}
          </div>
        </>
      ) : null}
    </>
  );
}

export default Alert;

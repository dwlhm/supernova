import * as React from "react";

export interface BubbleChatProps {
  direction?: "incoming" | "outgoing";
  type?: "text" | "file" | "image" | "video";
  messageState?: "default" | "error";
  text?: string;
  customText?: string;
  showCustomText?: boolean;
  showTime?: boolean;
  showStatus?: boolean;
  timeText?: string;
  statusText?: string;
  errorStatusText?: string;
  fileName?: string;
  fileMeta?: string;
  imageName?: string;
  imageMeta?: string;
  videoName?: string;
  videoMeta?: string;
  className?: string;
}

import { cn } from "./utils";

function BubbleChat(props: BubbleChatProps) {
  props = {
    direction: "incoming",
    type: "text",
    messageState: "default",
    text: "Message",
    customText: "Additional information",
    showCustomText: false,
    showTime: true,
    showStatus: false,
    timeText: "10:24 AM",
    statusText: "Received",
    errorStatusText: "Failed to send",
    fileName: "document.pdf",
    fileMeta: "2.4 MB",
    imageName: "image.jpg",
    imageMeta: "3.4 MB",
    videoName: "video.mp4",
    videoMeta: "24.8 MB",
    className: "",
    ...props,
  };
  function isOutgoing() {
    return props.direction === "outgoing";
  }

  function isError() {
    return props.messageState === "error";
  }

  function bubbleClasses() {
    if (isError()) {
      return "bg-components-bubble-chat-error-color-container-background-default border border-components-bubble-chat-error-color-container-border-default text-components-bubble-chat-error-color-message-foreground-default";
    }
    if (isOutgoing()) {
      return "bg-components-bubble-chat-outgoing-color-container-background-default text-components-bubble-chat-outgoing-color-message-foreground-default";
    }
    return "bg-components-bubble-chat-incoming-color-container-background-default text-components-bubble-chat-incoming-color-message-foreground-default";
  }

  function metaClasses() {
    if (isError()) {
      return "text-components-bubble-chat-error-color-metadata-foreground-default";
    }
    if (isOutgoing()) {
      return "text-components-bubble-chat-outgoing-color-timestamp-foreground-default";
    }
    return "text-components-bubble-chat-incoming-color-timestamp-foreground-default";
  }

  function previewMetaClasses() {
    if (isError()) {
      return "text-components-bubble-chat-error-color-metadata-foreground-default";
    }
    return "text-foreground-muted";
  }

  function displayStatus() {
    return isError() ? props.errorStatusText : props.statusText;
  }

  return (
    <div
      className={cn(
        "flex w-full",
        isOutgoing() ? "justify-end" : "justify-start",
        props.className
      )}
    >
      <div
        className={cn(
          "flex max-w-xs flex-col gap-1",
          isOutgoing() && "items-end"
        )}
      >
        <div className={cn("rounded-rounded-2xl px-4 py-3", bubbleClasses())}>
          {props.type === "text" ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {props.text}
            </p>
          ) : null}
          {props.type === "file" ? (
            <div className="flex items-center gap-2">
              <svg
                aria-hidden="true"
                className="h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  d="M14 3v5h5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span className="flex flex-col">
                <span className="truncate text-sm font-medium">
                  {props.fileName}
                </span>
                <span className={cn("text-xs", previewMetaClasses())}>
                  {props.fileMeta}
                </span>
              </span>
            </div>
          ) : null}
          {props.type === "image" || props.type === "video" ? (
            <div className="flex flex-col gap-2">
              <div
                className={cn(
                  "flex h-32 w-60 items-center justify-center rounded-rounded-xl bg-background-muted",
                  previewMetaClasses()
                )}
              >
                <svg
                  aria-hidden="true"
                  className="h-8 w-8 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  {props.type === "image" ? (
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  ) : null}
                  <path
                    d="m21 15-5-5L5 21"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                </svg>
              </div>
              <span className="flex flex-col">
                <span className="truncate text-sm font-medium">
                  {props.type === "image" ? (
                    <>{props.imageName}</>
                  ) : (
                    <>{props.videoName}</>
                  )}
                </span>
                <span className={cn("text-xs", previewMetaClasses())}>
                  {props.type === "image" ? (
                    <>{props.imageMeta}</>
                  ) : (
                    <>{props.videoMeta}</>
                  )}
                </span>
              </span>
            </div>
          ) : null}
          {props.showCustomText ? (
            <p className={cn("mt-2 text-xs", previewMetaClasses())}>
              {props.customText}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {props.showTime ? (
            <span className={cn("text-xs", metaClasses())}>
              {props.timeText}
            </span>
          ) : null}
          {props.showStatus || isError() ? (
            <span
              className={cn(
                "text-xs",
                isError()
                  ? "text-components-bubble-chat-error-color-status-foreground-default"
                  : metaClasses()
              )}
            >
              {displayStatus()}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default BubbleChat;

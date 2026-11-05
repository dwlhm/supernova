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

import { cn, ICON_PATHS, bindControllerProps } from "./utils";

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
    videoMeta: "24.8 MB • 01:08",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "flex w-full",
        props.direction === "outgoing" ? "justify-end" : "justify-start",
        props.className
      )}
    >
      <div
        className={cn(
          "flex max-w-xs flex-col gap-1",
          props.direction === "outgoing" && "items-end"
        )}
      >
        <div
          className={cn(
            "rounded-2xl p-4",
            props.messageState === "error"
              ? "border border-destructive-border bg-destructive-subtle text-destructive-foreground"
              : props.direction === "outgoing"
              ? "border border-border-default bg-background-default text-foreground-default"
              : "bg-background-muted text-foreground-default"
          )}
        >
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
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={ICON_PATHS.file}
                />
              </svg>
              <span className="flex flex-col">
                <span className="truncate text-sm font-medium">
                  {props.fileName}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    props.messageState === "error"
                      ? "text-destructive-foreground"
                      : "text-foreground-muted"
                  )}
                >
                  {props.fileMeta}
                </span>
              </span>
            </div>
          ) : null}
          {props.type === "image" || props.type === "video" ? (
            <div className="flex flex-col gap-2">
              <div
                className={cn(
                  "flex h-32 w-60 items-center justify-center rounded-xl bg-background-subtle",
                  props.messageState === "error"
                    ? "text-destructive-foreground"
                    : "text-foreground-muted"
                )}
              >
                <svg
                  aria-hidden="true"
                  className="h-8 w-8 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={
                      props.type === "image"
                        ? ICON_PATHS.image
                        : ICON_PATHS.video
                    }
                  />
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
                <span
                  className={cn(
                    "text-xs",
                    props.messageState === "error"
                      ? "text-destructive-foreground"
                      : "text-foreground-muted"
                  )}
                >
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
            <p
              className={cn(
                "mt-2 text-xs",
                props.messageState === "error"
                  ? "text-destructive-foreground"
                  : "text-foreground-muted"
              )}
            >
              {props.customText}
            </p>
          ) : null}
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          {props.showTime ? (
            <span
              className={cn(
                "text-xs",
                props.messageState === "error"
                  ? "text-destructive-foreground"
                  : "text-foreground-muted"
              )}
            >
              {props.timeText}
            </span>
          ) : null}
          {props.showStatus || props.messageState === "error" ? (
            <span
              className={cn(
                "text-xs",
                props.messageState === "error"
                  ? "text-destructive-foreground"
                  : "text-foreground-muted"
              )}
            >
              {props.messageState === "error" ? (
                <>{props.errorStatusText}</>
              ) : (
                <>{props.statusText}</>
              )}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default BubbleChat;

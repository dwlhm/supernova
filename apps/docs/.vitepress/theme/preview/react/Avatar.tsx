import * as React from "react";

export interface AvatarProps {
  size?: "mini" | "small" | "regular" | "large" | "x-large";
  type?: "image" | "initials" | "icon";
  showStatus?: boolean;
  initialsText?: string;
  src?: string;
  alt?: string;
  status?: "online" | "offline" | "busy" | "away";
  className?: string;
}

import { cn, cva, getAvatarState, bindControllerProps } from "./utils";

function Avatar(props: AvatarProps) {
  props = {
    size: "mini",
    type: "image",
    showStatus: true,
    initialsText: "AB",
    src: "",
    alt: "",
    status: "online",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <span
      role="img"
      data-ctrl={typeof bindControllerProps}
      aria-label={getAvatarState(props).accessibleName}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-background-muted",
        cva(
          props.size,
          {
            mini: "h-6 w-6 text-xs",
            small: "h-8 w-8 text-xs",
            regular: "h-9 w-9 text-sm",
            large: "h-10 w-10 text-base",
            "x-large": "h-14 w-14 text-lg",
          },
          "mini"
        ),
        props.className
      )}
    >
      {props.type === "image" && Boolean(props.src) ? (
        <img
          alt=""
          className="h-full w-full rounded-full object-cover"
          src={props.src}
        />
      ) : null}
      {props.type === "icon" || (props.type === "image" && !props.src) ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={cn(
            "shrink-0 text-foreground-subtle",
            cva(
              props.size,
              {
                mini: "h-3 w-3",
                small: "h-4 w-4",
                regular: "h-4 w-4",
                large: "h-5 w-5",
                "x-large": "h-7 w-7",
              },
              "mini"
            )
          )}
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
        </svg>
      ) : null}
      {props.type === "initials" ? (
        <span
          aria-hidden="true"
          className="font-medium uppercase leading-none text-foreground-subtle"
        >
          {props.initialsText}
        </span>
      ) : null}
      {props.showStatus ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background-default",
            cva(
              props.status,
              {
                offline: "bg-background-interactive",
                busy: "bg-destructive-default",
                away: "bg-warning-default",
                online: "bg-success-default",
              },
              "online"
            )
          )}
        />
      ) : null}
    </span>
  );
}

export default Avatar;

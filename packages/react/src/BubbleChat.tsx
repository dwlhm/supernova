import * as React from "react";

export interface BubbleChatProps {
  showTime?: boolean;
  showStatus?: boolean;
  showCustomText?: boolean;
  customText?: string;
  textMessage?: string;
  fileName?: string;
  fileMetadata?: string;
  imageName?: string;
  imageMetadata?: string;
  videoName?: string;
  videoMetadata?: string;
  incomingStatusText?: string;
  outgoingStatusText?: string;
  errorStatusText?: string;
  incomingTimeText?: string;
  outgoingTimeText?: string;
  direction?: "Incoming" | "Outgoing";
  type?: "Text" | "File" | "Image" | "Video";
  state?: "Default" | "Error";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

function BubbleChat(props: BubbleChatProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "flex flex-col gap-1 px-4 py-3 rounded-2xl " +
        (props.type === "File"
          ? "bg-[#f5f5f5] text-[#0a0a0a]"
          : props.type === "Image"
          ? "bg-[#f5f5f5] text-[#0a0a0a]"
          : props.type === "Video"
          ? "bg-[#f5f5f5] text-[#0a0a0a]"
          : "bg-[#f5f5f5] text-[#0a0a0a]") +
        (props.className ? " " + props.className : "")
      }
    >
      <p className="text-sm font-normal text-[#0a0a0a]">
        {props.textMessage ?? "Message"}
      </p>
      {props.showCustomText ? (
        <p className="text-xs font-normal text-right text-[#737373]">
          {props.customText ?? "Additional information"}
        </p>
      ) : null}
      <div className="flex flex-row gap-1 justify-between items-center w-full">
        {props.showStatus ? (
          <p className="text-xs font-normal text-[#737373]">
            {props.incomingStatusText ?? "Received"}
          </p>
        ) : null}
        {props.showTime !== false ? (
          <p className="text-xs font-normal text-right text-[#737373]">
            {props.incomingTimeText ?? "10:24 AM"}
          </p>
        ) : null}
      </div>
      {props.children}
    </div>
  );
}

export default BubbleChat;

import * as React from "react";

export interface TooltipProps {
  textContent?: string;
  position?: "Top" | "Bottom" | "Left" | "Right";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

function Tooltip(props: TooltipProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={"" + (props.className ? " " + props.className : "")}
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2 px-3 py-2 rounded-lg bg-[#e55514]">
          <div className="flex flex-row gap-3 justify-center items-center w-full">
            <p className="text-sm font-normal text-white">
              {props.textContent ?? "Label"}
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-[#e55514]" />
      </div>
      {props.children}
    </div>
  );
}

export default Tooltip;

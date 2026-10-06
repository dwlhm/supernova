import * as React from "react";

export interface ToggleGroupProps {
  showToggle1?: boolean;
  showToggle2?: boolean;
  showToggle3?: boolean;
  showToggle4?: boolean;
  showToggle5?: boolean;
  size?: "Medium" | "Small" | "Large";
  showText?: boolean;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  label?: string;
  label2?: string;
  label3?: string;
  label4?: string;
  label5?: string;
}

function ToggleGroup(props: ToggleGroupProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "flex flex-row rounded-lg border border-[#e5e5e5] shadow-sm " +
        (props.size === "Medium"
          ? "px-4 py-2 text-sm"
          : props.size === "Large"
          ? "px-6 py-3 text-lg"
          : "px-3 py-1.5 text-xs") +
        (props.className ? " " + props.className : "")
      }
    >
      {props.showToggle1 !== false ? (
        <div className="flex flex-row gap-1 p-1 justify-center items-center border border-[#e5e5e5]">
          <div>
            <div />
            <div className="border-1.5 border-[#0a0a0a]" />
            <div className="border-1.5 border-[#0a0a0a]" />
          </div>
          {props.showText !== false ? (
            <p className="text-xs font-normal text-center text-[#0a0a0a]">
              {props.label ?? "Bold"}
            </p>
          ) : null}
        </div>
      ) : null}
      {props.showToggle2 !== false ? (
        <div className="flex flex-row gap-1 p-1 justify-center items-center border border-[#e5e5e5]">
          <div>
            <div />
            <div className="border-1.5 border-[#0a0a0a]" />
            <div className="border-1.5 border-[#0a0a0a]" />
          </div>
          {props.showText !== false ? (
            <p className="text-xs font-normal text-center text-[#0a0a0a]">
              {props.label2 ?? "Bold"}
            </p>
          ) : null}
        </div>
      ) : null}
      {props.showToggle3 !== false ? (
        <div className="flex flex-row gap-1 p-1 justify-center items-center border border-[#e5e5e5]">
          <div>
            <div />
            <div className="border-1.5 border-[#0a0a0a]" />
            <div className="border-1.5 border-[#0a0a0a]" />
          </div>
          {props.showText !== false ? (
            <p className="text-xs font-normal text-center text-[#0a0a0a]">
              {props.label3 ?? "Bold"}
            </p>
          ) : null}
        </div>
      ) : null}
      {props.showToggle4 !== false ? (
        <div className="flex flex-row gap-1 p-1 justify-center items-center">
          <div>
            <div />
            <div className="border-1.5 border-[#0a0a0a]" />
            <div className="border-1.5 border-[#0a0a0a]" />
          </div>
          {props.showText !== false ? (
            <p className="text-xs font-normal text-center text-[#0a0a0a]">
              {props.label4 ?? "Bold"}
            </p>
          ) : null}
        </div>
      ) : null}
      {props.showToggle5 !== false ? (
        <div className="flex flex-row gap-1 p-1 justify-center items-center">
          <div>
            <div />
            <div className="border-1.5 border-[#0a0a0a]" />
            <div className="border-1.5 border-[#0a0a0a]" />
          </div>
          {props.showText !== false ? (
            <p className="text-xs font-normal text-center text-[#0a0a0a]">
              {props.label5 ?? "Bold"}
            </p>
          ) : null}
        </div>
      ) : null}
      {props.children}
    </div>
  );
}

export default ToggleGroup;

"use client";
import * as React from "react";

export interface TopbarProps {
  topbarContent?: any;
  onClick?: (event?: any) => void;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  home?: string;
  separator?: string;
  breadcrumb?: string;
  typeToSearch?: string;
}

function Topbar(props: TopbarProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "flex flex-row gap-3 px-4 py-3 items-center bg-background-page border border-[#e5e5e5]" +
        (props.className ? " " + props.className : "")
      }
    >
      <button
        type="button"
        className="flex flex-row gap-3 px-2 justify-center items-center cursor-pointer transition-colors"
        onClick={(event) => props.onClick?.()}
      >
        <div>
          <div />
          <div className="border-1.5 border-[#0a0a0a]" />
          <div className="border-1.5 border-[#0a0a0a]" />
        </div>
      </button>
      <div className="flex flex-row gap-2 items-center">
        <div className="flex flex-row gap-3 justify-center items-center">
          <p className="text-sm font-normal text-[#737373]">
            {props.home ?? "Home"}
          </p>
        </div>
        <span className="text-sm font-normal text-[#737373]">
          {props.separator ?? "/"}
        </span>
        <div className="flex flex-row gap-3 justify-center items-center">
          <p className="text-sm font-normal text-[#0a0a0a]">
            {props.breadcrumb ?? "Breadcrumb"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 justify-center items-end">
        <div className="flex flex-row gap-16 px-8 py-1 items-center rounded-lg bg-background-page border border-[#e5e5e5]">
          <div>
            <div className="border border-[#0a0a0a]" />
          </div>
          <div className="flex flex-row gap-3 items-center w-full flex-1">
            <p className="text-sm font-normal text-[#737373]">
              {props.typeToSearch ?? "Type to search..."}
            </p>
          </div>
        </div>
      </div>
      {props.children}
    </div>
  );
}

export default Topbar;

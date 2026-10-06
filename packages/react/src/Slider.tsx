"use client";
import * as React from "react";

export interface SliderProps {
  onClick?: (event?: any) => void;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

function Slider(props: SliderProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "rounded-full bg-[#f5f5f5]" +
        (props.className ? " " + props.className : "")
      }
    >
      <div className="bg-[#e55514]" />
      <button
        type="button"
        className="rounded-full bg-background-page border border-[#e55514] cursor-pointer transition-colors"
        onClick={(event) => props.onClick?.()}
      >
        Button
      </button>
      {props.children}
    </div>
  );
}

export default Slider;

import * as React from "react";

export interface DatePickerProps {
  hintText?: boolean;
  state?: "Closed" | "Open";
  type?:
    | "Date of Birth Picker"
    | "Picker with Input"
    | "Date and Time Picker"
    | "Natural Language Picker"
    | "Range Picker"
    | "Year Picker";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  label?: string;
  placeholder?: string;
  note?: string;
}

function DatePicker(props: DatePickerProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "flex flex-col gap-3 " +
        (props.type === "Range Picker"
          ? "text-[#737373]"
          : props.type === "Year Picker"
          ? "text-[#737373]"
          : "text-[#737373]") +
        (props.className ? " " + props.className : "")
      }
    >
      <div className="flex flex-row gap-3 items-center w-full">
        <p className="text-sm font-medium text-[#0a0a0a]">
          {props.label ?? "Date of Birth"}
        </p>
      </div>
      <div className="flex flex-row gap-16 px-3 py-1 items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full">
        <div className="flex flex-row gap-3 items-center w-full flex-1">
          <p className="text-base font-normal text-[#0a0a0a]">
            {props.placeholder ?? "Select a date"}
          </p>
          <div>
            <div />
            <div className="border-1.5 border-[#0a0a0a]" />
          </div>
        </div>
      </div>
      {props.hintText ? (
        <p className="text-xs font-normal text-[#737373]">
          {props.note ?? "Your post will be published on June 21, 2025."}
        </p>
      ) : null}
      {props.children}
    </div>
  );
}

export default DatePicker;

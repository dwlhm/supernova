import * as React from "react";

export interface TableHeaderRowProps {
  showColumn1?: boolean;
  showColumn2?: boolean;
  showColumn3?: boolean;
  showColumn4?: boolean;
  showColumn5?: boolean;
  showColumn6?: boolean;
  showColumn7?: boolean;
  showColumn8?: boolean;
  showColumn9?: boolean;
  showColumn10?: boolean;
  label?: string;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

function TableHeaderRow(props: TableHeaderRowProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "flex flex-row bg-[#f5f5f5] border border-[#e5e5e5]" +
        (props.className ? " " + props.className : "")
      }
    >
      {props.showColumn1 !== false ? (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">
            {props.label ?? "Column 1"}
          </p>
        </div>
      ) : null}
      {props.showColumn2 !== false ? (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">
            {props.label ?? "Column 2"}
          </p>
        </div>
      ) : null}
      {props.showColumn3 !== false ? (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">
            {props.label ?? "Column 3"}
          </p>
        </div>
      ) : null}
      {props.showColumn4 !== false ? (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">
            {props.label ?? "Column 4"}
          </p>
        </div>
      ) : null}
      {props.showColumn5 !== false ? (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">
            {props.label ?? "Column 5"}
          </p>
        </div>
      ) : null}
      {props.showColumn6 ? (
        <div className="flex flex-row px-4 py-3 flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">
            {props.label ?? "Column 6"}
          </p>
        </div>
      ) : null}
      {props.showColumn7 ? (
        <div className="flex flex-row px-4 py-3 flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">
            {props.label ?? "Column 7"}
          </p>
        </div>
      ) : null}
      {props.showColumn8 ? (
        <div className="flex flex-row px-4 py-3 flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">
            {props.label ?? "Column 8"}
          </p>
        </div>
      ) : null}
      {props.showColumn9 ? (
        <div className="flex flex-row px-4 py-3 flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">
            {props.label ?? "Column 9"}
          </p>
        </div>
      ) : null}
      {props.showColumn10 ? (
        <div className="flex flex-row px-4 py-3 flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">
            {props.label ?? "Column 10"}
          </p>
        </div>
      ) : null}
      {props.children}
    </div>
  );
}

export default TableHeaderRow;

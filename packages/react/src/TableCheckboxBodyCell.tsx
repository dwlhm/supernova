import * as React from "react";

export interface TableCheckboxBodyCellProps {
  leftLabel?: boolean;
  rightLabel?: boolean;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  leftLabelContent?: string;
  rightLabelContent?: string;
}

function TableCheckboxBodyCell(props: TableCheckboxBodyCellProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "flex flex-row px-4 py-3 justify-center items-center" +
        (props.className ? " " + props.className : "")
      }
    >
      <div className="flex flex-row gap-2 items-center">
        {props.leftLabel !== false ? (
          <p className="text-xs font-normal text-[#0a0a0a]">
            {props.leftLabelContent ?? "Label"}
          </p>
        ) : null}
        <div className="rounded bg-background-page border border-[#e5e5e5]" />
        {props.rightLabel !== false ? (
          <p className="text-xs font-normal text-[#0a0a0a]">
            {props.rightLabelContent ?? "Label"}
          </p>
        ) : null}
      </div>
      {props.children}
    </div>
  );
}

export default TableCheckboxBodyCell;

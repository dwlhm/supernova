import * as React from "react";

export interface TableCellValueProps {
  value?: string;
  showAffiliate?: boolean;
  showKomlabs?: boolean;
  showRajaOngkir?: boolean;
  showKomads?: boolean;
  showKomcards?: boolean;
  showKomchat?: boolean;
  showKomclass?: boolean;
  showKompack?: boolean;
  showKomplace?: boolean;
  showKomship?: boolean;
  showKomtim?: boolean;
  showKomed?: boolean;
  showKomstore?: boolean;
  showKomerce?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showMore?: boolean;
  slotName?: any;
  type?:
    | "Text"
    | "Image Text"
    | "Image"
    | "Action"
    | "Badge"
    | "Stacked Text"
    | "Link"
    | "Checkbox"
    | "Toggle"
    | "Avatar Text"
    | "Status"
    | "Number"
    | "Action (Icon)"
    | "Product"
    | "Slot";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

function TableCellValue(props: TableCellValueProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "flex flex-row items-center " +
        (props.type === "Image Text"
          ? "text-[#0a0a0a]"
          : props.type === "Image"
          ? "text-[#0a0a0a]"
          : props.type === "Stacked Text"
          ? "text-[#0a0a0a]"
          : props.type === "Avatar Text"
          ? "text-[#0a0a0a]"
          : props.type === "Status"
          ? "text-[#0a0a0a]"
          : props.type === "Number"
          ? "text-[#0a0a0a]"
          : "text-[#0a0a0a]") +
        (props.className ? " " + props.className : "")
      }
    >
      <p className="text-sm font-normal text-[#0a0a0a]">
        {props.value ?? "Cell Value"}
      </p>
      {props.children}
    </div>
  );
}

export default TableCellValue;

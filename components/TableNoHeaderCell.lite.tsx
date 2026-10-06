export interface TableNoHeaderCellProps {
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  noHeaderText?: string;
}

export default function TableNoHeaderCell(props: TableNoHeaderCellProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-row px-4 py-3 justify-center items-center" + (props.className ? " " + props.className : "")}>
      <span className="text-sm font-medium text-[#0a0a0a]">{props.noHeaderText ?? "No"}</span>
      {props.children}
    </div>
  );
}

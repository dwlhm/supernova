export interface TableNoBodyCellProps {
  no?: string;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

export default function TableNoBodyCell(props: TableNoBodyCellProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-row px-4 py-3 justify-center items-center" + (props.className ? " " + props.className : "")}>
      <span className="text-sm font-normal text-[#737373]">{props.no ?? "1"}</span>
      {props.children}
    </div>
  );
}

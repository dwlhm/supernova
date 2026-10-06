export interface TableBodyCellProps {
  cellValue?: any;
  value?: string;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

export default function TableBodyCell(props: TableBodyCellProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-row px-4 py-3 w-full" + (props.className ? " " + props.className : "")}>
      <div className="flex flex-row items-center w-full flex-1">
        <p className="text-sm font-normal text-[#0a0a0a]">{props.value ?? "Cell Value"}</p>
      </div>
      {props.children}
    </div>
  );
}

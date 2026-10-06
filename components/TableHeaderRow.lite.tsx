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

export default function TableHeaderRow(props: TableHeaderRowProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-row bg-[#f5f5f5] border border-[#e5e5e5]" + (props.className ? " " + props.className : "")}>
      {props.showColumn1 !== false && (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.label ?? "Column 1"}</p>
        </div>
      )}
      {props.showColumn2 !== false && (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.label ?? "Column 2"}</p>
        </div>
      )}
      {props.showColumn3 !== false && (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.label ?? "Column 3"}</p>
        </div>
      )}
      {props.showColumn4 !== false && (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.label ?? "Column 4"}</p>
        </div>
      )}
      {props.showColumn5 !== false && (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.label ?? "Column 5"}</p>
        </div>
      )}
      {props.showColumn6 && (
        <div className="flex flex-row px-4 py-3 flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.label ?? "Column 6"}</p>
        </div>
      )}
      {props.showColumn7 && (
        <div className="flex flex-row px-4 py-3 flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.label ?? "Column 7"}</p>
        </div>
      )}
      {props.showColumn8 && (
        <div className="flex flex-row px-4 py-3 flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.label ?? "Column 8"}</p>
        </div>
      )}
      {props.showColumn9 && (
        <div className="flex flex-row px-4 py-3 flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.label ?? "Column 9"}</p>
        </div>
      )}
      {props.showColumn10 && (
        <div className="flex flex-row px-4 py-3 flex-1">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.label ?? "Column 10"}</p>
        </div>
      )}
      {props.children}
    </div>
  );
}

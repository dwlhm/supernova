export interface TableBodyRowProps {
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
  value?: string;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

export default function TableBodyRow(props: TableBodyRowProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-row bg-background-page border border-[#e5e5e5]" + (props.className ? " " + props.className : "")}>
      {props.showColumn1 !== false && (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <div className="flex flex-row items-center w-full flex-1">
            <p className="text-sm font-normal text-[#0a0a0a]">{props.value ?? "Cell Value"}</p>
          </div>
        </div>
      )}
      {props.showColumn2 !== false && (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <div className="flex flex-row items-center w-full flex-1">
            <p className="text-sm font-normal text-[#0a0a0a]">{props.value ?? "Cell Value"}</p>
          </div>
        </div>
      )}
      {props.showColumn3 !== false && (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <div className="flex flex-row items-center w-full flex-1">
            <p className="text-sm font-normal text-[#0a0a0a]">{props.value ?? "Cell Value"}</p>
          </div>
        </div>
      )}
      {props.showColumn4 !== false && (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <div className="flex flex-row items-center w-full flex-1">
            <p className="text-sm font-normal text-[#0a0a0a]">{props.value ?? "Cell Value"}</p>
          </div>
        </div>
      )}
      {props.showColumn5 !== false && (
        <div className="flex flex-row px-4 py-3 w-full flex-1">
          <div className="flex flex-row items-center w-full flex-1">
            <p className="text-sm font-normal text-[#0a0a0a]">{props.value ?? "Cell Value"}</p>
          </div>
        </div>
      )}
      {props.showColumn6 && (
        <div className="flex flex-row px-4 py-3 flex-1">
          <div className="flex flex-row items-center w-full flex-1">
            <p className="text-sm font-normal text-[#0a0a0a]">{props.value ?? "Cell Value"}</p>
          </div>
        </div>
      )}
      {props.showColumn7 && (
        <div className="flex flex-row px-4 py-3 flex-1">
          <div className="flex flex-row items-center w-full flex-1">
            <p className="text-sm font-normal text-[#0a0a0a]">{props.value ?? "Cell Value"}</p>
          </div>
        </div>
      )}
      {props.showColumn8 && (
        <div className="flex flex-row px-4 py-3 flex-1">
          <div className="flex flex-row items-center w-full flex-1">
            <p className="text-sm font-normal text-[#0a0a0a]">{props.value ?? "Cell Value"}</p>
          </div>
        </div>
      )}
      {props.showColumn9 && (
        <div className="flex flex-row px-4 py-3 flex-1">
          <div className="flex flex-row items-center w-full flex-1">
            <p className="text-sm font-normal text-[#0a0a0a]">{props.value ?? "Cell Value"}</p>
          </div>
        </div>
      )}
      {props.showColumn10 && (
        <div className="flex flex-row px-4 py-3 flex-1">
          <div className="flex flex-row items-center w-full flex-1">
            <p className="text-sm font-normal text-[#0a0a0a]">{props.value ?? "Cell Value"}</p>
          </div>
        </div>
      )}
      {props.children}
    </div>
  );
}

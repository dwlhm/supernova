export interface PaginationProps {
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  previous?: string;
  text?: string;
  text2?: string;
  text3?: string;
  next?: string;
}

export default function Pagination(props: PaginationProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-row gap-1 items-center" + (props.className ? " " + props.className : "")}>
      <div className="flex flex-row gap-1 px-3 py-2 justify-center items-center rounded-lg">
        <div>
          <div className="border border-[#0a0a0a]" />
        </div>
        <div className="flex flex-row gap-3 justify-center items-center">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.previous ?? "Previous"}</p>
        </div>
      </div>
      <div className="flex flex-row gap-3 p-3 justify-center items-center rounded-lg">
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-sm font-medium text-[#0a0a0a]">{props.text ?? "1"}</span>
        </div>
      </div>
      <div className="flex flex-row gap-3 p-3 justify-center items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm">
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-sm font-medium text-[#0a0a0a]">{props.text2 ?? "2"}</span>
        </div>
      </div>
      <div className="flex flex-row gap-3 p-3 justify-center items-center rounded-lg">
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-sm font-medium text-[#0a0a0a]">{props.text3 ?? "3"}</span>
        </div>
      </div>
      <div className="flex flex-row gap-3 p-3 justify-center items-center rounded-lg">
        <div>
          <div className="border border-[#0a0a0a]" />
        </div>
      </div>
      <div className="flex flex-row gap-1 px-3 py-2 justify-center items-center rounded-lg">
        <div className="flex flex-row gap-3 justify-center items-center">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.next ?? "Next"}</p>
        </div>
        <div>
          <div className="border border-[#0a0a0a]" />
        </div>
      </div>
      {props.children}
    </div>
  );
}

export interface BreadcrumbProps {
  type?: "1" | "2" | "deep";
  showEllipsis?: boolean;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  home?: string;
  separator?: string;
  current?: string;
  ellipsis?: string;
}

export default function Breadcrumb(props: BreadcrumbProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-row gap-2" + (props.className ? " " + props.className : "")}>
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2">
          <p className="text-sm font-normal text-[#737373]">{props.home ?? "Home"}</p>
        </div>
        <span className="text-sm font-normal text-[#737373]">{props.separator ?? "/"}</span>
        <p className="text-sm font-normal text-[#737373]">{props.current ?? "Example path"}</p>
        <p className="text-sm font-normal text-[#737373]">{props.ellipsis ?? "..."}</p>
      </div>
      {props.children}
    </div>
  );
}

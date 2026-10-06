import * as React from "react";

export interface BreadcrumbProps {
  showEllipsis?: boolean;
  type?: "2" | "deep" | "1";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  home?: string;
  separator?: string;
  breadcrumb?: string;
}

function Breadcrumb(props: BreadcrumbProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "flex flex-row gap-2 items-center " +
        (props.type === "deep" ? "text-[#737373]" : "text-[#737373]") +
        (props.className ? " " + props.className : "")
      }
    >
      <div className="flex flex-row gap-3 justify-center items-center">
        <p className="text-sm font-normal text-[#737373]">
          {props.home ?? "Home"}
        </p>
      </div>
      <span className="text-sm font-normal text-[#737373]">
        {props.separator ?? "/"}
      </span>
      <div className="flex flex-row gap-3 justify-center items-center">
        <p className="text-sm font-normal text-[#0a0a0a]">
          {props.breadcrumb ?? "Breadcrumb"}
        </p>
      </div>
      {props.children}
    </div>
  );
}

export default Breadcrumb;

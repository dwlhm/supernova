import * as React from "react";

export interface LogoBrandProps {
  showWordmark?: boolean;
  brand?:
    | "Affiliate"
    | "Komlabs"
    | "Rajaongkir"
    | "Komads"
    | "Komcards"
    | "Komchat"
    | "Komclass"
    | "Kompack"
    | "Komplace"
    | "Komship"
    | "Komtim"
    | "Komed"
    | "Komstore"
    | "Komerce";
  color?: "Brand" | "Inverse" | "Monochrome";
  size?: "Large" | "Medium" | "Small" | "Extra Small";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

function LogoBrand(props: LogoBrandProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "flex flex-row gap-0 items-center " +
        (props.size === "Medium"
          ? "px-4 py-2 text-sm"
          : props.size === "Small"
          ? "px-3 py-1.5 text-xs"
          : "px-6 py-3 text-lg") +
        (props.className ? " " + props.className : "")
      }
    >
      <div>
        <div className="bg-[#666666]" />
        <div className="bg-[#808080]" />
        <div className="bg-[#808080]" />
        <div className="bg-[#808080]" />
        <div className="bg-[#666666]" />
      </div>
      {props.showWordmark !== false ? <div className="bg-[#0f0e0f]" /> : null}
      {props.children}
    </div>
  );
}

export default LogoBrand;

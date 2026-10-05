import * as React from "react";

// This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

export interface TypographyProps {
  children?: any;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "body-sm"
    | "caption";
  color?: string;
  align?: "left" | "center" | "right";
  weight?: "normal" | "medium" | "semibold" | "bold";
}

import { resolveVariantClass } from "./runtime/component-runtime";

function Typography(props: TypographyProps) {
  props = { variant: "body", align: "left", ...props };
  function variantClass() {
    return resolveVariantClass(
      {
        h1: "text-4xl font-bold tracking-tight",
        h2: "text-3xl font-semibold tracking-tight",
        h3: "text-2xl font-semibold",
        h4: "text-xl font-semibold",
        h5: "text-lg font-semibold",
        h6: "text-base font-semibold",
        "body-sm": "text-xs leading-normal",
        caption: "text-[11px] leading-tight text-slate-500",
        body: "text-sm leading-relaxed",
      },
      props.variant,
      "body"
    );
  }

  function alignClass() {
    return resolveVariantClass(
      {
        center: "text-center",
        right: "text-right",
        left: "text-left",
      },
      props.align,
      "left"
    );
  }

  function weightClass() {
    return resolveVariantClass(
      {
        bold: "font-bold",
        semibold: "font-semibold",
        medium: "font-medium",
        normal: "font-normal",
      },
      props.weight,
      undefined
    );
  }

  return (
    <div
      className={
        "m-0 text-slate-900" +
        " " +
        variantClass() +
        " " +
        alignClass() +
        " " +
        weightClass() +
        " " +
        (props.color || "")
      }
    >
      {props.children}
    </div>
  );
}

export default Typography;

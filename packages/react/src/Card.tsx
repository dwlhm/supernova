"use client";
import * as React from "react";

// This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

export interface CardProps {
  children?: any;
  title?: string;
  subtitle?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  bordered?: boolean;
  testId?: string;
  onClick?: (event: any) => void;
}

import {
  resolveVariantClass,
  dispatchEvent,
} from "./runtime/component-runtime";

function Card(props: CardProps) {
  props = {
    title: "",
    subtitle: "",
    padding: "md",
    shadow: "md",
    bordered: false,
    ...props,
  };
  function paddingClass() {
    return resolveVariantClass(
      {
        none: "p-0",
        sm: "p-3",
        lg: "p-6",
        md: "p-4",
      },
      props.padding,
      "md"
    );
  }

  function shadowClass() {
    return resolveVariantClass(
      {
        none: "shadow-none",
        sm: "shadow-sm",
        lg: "shadow-lg",
        md: "shadow-md",
      },
      props.shadow,
      "md"
    );
  }

  return (
    <div
      onClick={(event) => dispatchEvent(props.onClick, event, false)}
      data-testid={props.testId}
      className={
        "bg-white rounded-lg overflow-hidden transition-shadow duration-150" +
        " " +
        (props.bordered ? "border border-slate-200" : "border-0") +
        " " +
        shadowClass() +
        " " +
        paddingClass() +
        " " +
        (props.onClick ? "cursor-pointer hover:shadow-lg" : "")
      }
    >
      {props.title ? (
        <div className={props.subtitle ? "mb-1" : "mb-3"}>
          <h3 className="m-0 text-lg font-semibold text-slate-900 leading-snug">
            {props.title}
          </h3>
        </div>
      ) : null}
      {props.subtitle ? (
        <div className="mb-3">
          <p className="m-0 text-sm text-slate-500 leading-relaxed">
            {props.subtitle}
          </p>
        </div>
      ) : null}
      {props.children}
    </div>
  );
}

export default Card;

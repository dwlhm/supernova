"use client";
import * as React from "react";

// This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

export interface InputProps {
  name?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  helperText?: string;
  onChange?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  value?: string;
  placeholder?: string;
  type?: string;
}

import { dispatchEvent } from "./runtime/component-runtime";

function Input(props: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {props.label ? (
        <label className="text-xs font-medium text-slate-700">
          {props.label}
          {props.required ? (
            <span className="text-red-500 ml-0.5">*</span>
          ) : null}
        </label>
      ) : null}
      <input
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        required={props.required}
        type={props.type ?? "text"}
        placeholder={props.placeholder}
        onChange={(event) => dispatchEvent(props.onChange, event, false)}
        onFocus={(event) => dispatchEvent(props.onFocus, event, false)}
        onBlur={(event) => dispatchEvent(props.onBlur, event, false)}
        className={
          "w-full px-3 py-2 text-sm rounded-md border outline-none transition-colors duration-150 box-border disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed" +
          " " +
          (props.error
            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600")
        }
      />
      {props.error ? (
        <span className="text-xs text-red-600">{props.error}</span>
      ) : null}
      {!props.error && props.helperText ? (
        <span className="text-xs text-slate-500">{props.helperText}</span>
      ) : null}
    </div>
  );
}

export default Input;

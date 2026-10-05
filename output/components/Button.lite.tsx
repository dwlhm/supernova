// This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

import { useDefaultProps, useStore } from "@builder.io/mitosis";
import { resolveVariantClass, dispatchEvent } from "../runtime/component-runtime";
export interface ButtonProps {
    children?: any;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    fullWidth?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: (event: any) => void;
}
export default function Button(props: ButtonProps) {
    useDefaultProps({
        variant: "primary",
        size: "md",
        disabled: false,
        fullWidth: false,
        type: "button"
    });
    const state = useStore({
        get sizeClass() {
            return resolveVariantClass({ "sm": "px-3 py-1.5 text-xs rounded-sm gap-1.5", "lg": "px-6 py-3 text-base rounded-lg gap-2.5", "md": "px-4 py-2 text-sm rounded-md gap-2" }, props.size, "md");
        },
        get variantClass() {
            return resolveVariantClass({ "secondary": "bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-300 dark:bg-slate-800 dark:text-slate-100", "outline": "bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30", "ghost": "bg-transparent text-blue-600 border-transparent hover:bg-blue-50 dark:hover:bg-blue-950/30", "danger": "bg-red-600 text-white hover:bg-red-700 border-transparent", "primary": "bg-blue-600 text-white hover:bg-blue-700 border-transparent" }, props.variant, "primary");
        }
    });
    return (<button onClick={event => dispatchEvent(props.onClick, event, props.disabled)} className={"inline-flex items-center justify-center font-medium transition-colors duration-150 border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed" + " " + (props.fullWidth ? "w-full" : "w-auto") + " " + state.sizeClass + " " + state.variantClass} type={props.type || "button"} disabled={props.disabled}>{props.children}</button>);
}

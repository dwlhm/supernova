// This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

import { useDefaultProps, useStore } from "@builder.io/mitosis";
import { resolveVariantClass } from "../runtime/component-runtime";
export interface BadgeProps {
    children?: any;
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "outline";
    size?: "sm" | "md";
    rounded?: boolean;
}
export default function Badge(props: BadgeProps) {
    useDefaultProps({
        variant: "primary",
        size: "md",
        rounded: false
    });
    const state = useStore({
        get sizeClass() {
            return resolveVariantClass({ "sm": "px-1.5 py-0.5 text-[11px]", "md": "px-2 py-0.5 text-xs" }, props.size, "md");
        },
        get variantClass() {
            return resolveVariantClass({ "secondary": "bg-slate-100 text-slate-700 border-transparent", "success": "bg-green-100 text-green-700 border-transparent", "warning": "bg-amber-100 text-amber-800 border-transparent", "danger": "bg-red-100 text-red-700 border-transparent", "outline": "bg-transparent text-slate-700 border-slate-300", "primary": "bg-blue-100 text-blue-700 border-transparent" }, props.variant, "primary");
        }
    });
    return (<span className={"inline-flex items-center justify-center font-semibold leading-none border" + " " + (props.rounded ? "rounded-full" : "rounded") + " " + state.sizeClass + " " + state.variantClass}>{props.children}</span>);
}

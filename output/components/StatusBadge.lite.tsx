// This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

import { useDefaultProps, useStore } from "@builder.io/mitosis";
import { resolveVariantClass, dispatchEvent } from "../runtime/component-runtime";
export interface StatusBadgeProps {
    children?: any;
    icon?: any;
    text?: string;
    variant?: "success" | "warning" | "danger" | "info";
    testId?: string;
    onClick?: (event: any) => void;
}
export default function StatusBadge(props: StatusBadgeProps) {
    useDefaultProps({
        icon: "",
        text: "",
        variant: "success"
    });
    const state = useStore({
        get variantClass() {
            return resolveVariantClass({ "warning": "bg-amber-100 text-amber-800 border-amber-300", "danger": "bg-red-100 text-red-800 border-red-300", "info": "bg-blue-100 text-blue-800 border-blue-300", "success": "bg-green-100 text-green-800 border-green-300" }, props.variant, "success");
        }
    });
    return (<div onClick={event => dispatchEvent(props.onClick, event, false)} className={"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium" + " " + state.variantClass + " " + (props.onClick ? "cursor-pointer hover:opacity-90" : "")} data-testid={props.testId}>{props.icon && (<p className={"m-0 leading-none"}>{props.icon}</p>)}{props.text && (<p className={"m-0 leading-none"}>{props.text}</p>)}{props.children}</div>);
}

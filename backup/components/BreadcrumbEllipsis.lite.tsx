/* @composition {"root":"Breadcrumb","part":"BreadcrumbEllipsis","parts":["Breadcrumb","BreadcrumbList","BreadcrumbItem","BreadcrumbLink","BreadcrumbPage","BreadcrumbSeparator","BreadcrumbEllipsis"],"slot":"default","defaultContent":"…","examples":{"static":"import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@dwlhm/ui-react';\n\n<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href=\"/\">Home</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbPage>Products</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>","loop":"import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@dwlhm/ui-react';\n\n// The consumer supplies paths, including stable IDs and link destinations.\n<Breadcrumb>\n  <BreadcrumbList>\n    {paths.map((path, index) => (\n      <BreadcrumbItem key={path.id}>\n        {index > 0 && <BreadcrumbSeparator />}\n        {index === paths.length - 1\n          ? <BreadcrumbPage>{path.label}</BreadcrumbPage>\n          : <BreadcrumbLink href={path.href}>{path.label}</BreadcrumbLink>}\n      </BreadcrumbItem>\n    ))}\n  </BreadcrumbList>\n</Breadcrumb>"}} */
import { Slot } from "@builder.io/mitosis";

export interface BreadcrumbEllipsisProps {
  children?: any;
  className?: string;
}

export default function BreadcrumbEllipsis(props: BreadcrumbEllipsisProps) {
  return (
    <span aria-hidden={"true"} className={"" + (props.className ? " " + props.className : "")}><Slot>{"…"}</Slot></span>
  );
}

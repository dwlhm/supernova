/* @composition {"root":"Breadcrumb","part":"BreadcrumbLink","parts":["Breadcrumb","BreadcrumbList","BreadcrumbItem","BreadcrumbLink","BreadcrumbPage","BreadcrumbSeparator","BreadcrumbEllipsis"],"slot":"replace","examples":{"static":"import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@dwlhm/ui-react';\n\n<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href=\"/\">Home</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbPage>Products</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>","loop":"import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@dwlhm/ui-react';\n\n// The consumer supplies paths, including stable IDs and link destinations.\n<Breadcrumb>\n  <BreadcrumbList>\n    {paths.map((path, index) => (\n      <BreadcrumbItem key={path.id}>\n        {index > 0 && <BreadcrumbSeparator />}\n        {index === paths.length - 1\n          ? <BreadcrumbPage>{path.label}</BreadcrumbPage>\n          : <BreadcrumbLink href={path.href}>{path.label}</BreadcrumbLink>}\n      </BreadcrumbItem>\n    ))}\n  </BreadcrumbList>\n</Breadcrumb>"}} */
export interface BreadcrumbLinkProps {
  href?: string;
  children?: any;
  className?: string;
}

export default function BreadcrumbLink(props: BreadcrumbLinkProps) {
  return (
    <a href={props.href} className={"text-sm font-normal text-[#737373]" + (props.className ? " " + props.className : "")}>{props.children}</a>
  );
}

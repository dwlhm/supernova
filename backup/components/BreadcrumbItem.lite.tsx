/* @composition {"root":"Breadcrumb","part":"BreadcrumbItem","parts":["Breadcrumb","BreadcrumbList","BreadcrumbItem","BreadcrumbLink","BreadcrumbPage","BreadcrumbSeparator","BreadcrumbEllipsis"],"slot":"replace","examples":{"static":"import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@dwlhm/ui-react';\n\n<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href=\"/\">Home</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbPage>Products</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>","loop":"import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@dwlhm/ui-react';\n\n// The consumer supplies paths, including stable IDs and link destinations.\n<Breadcrumb>\n  <BreadcrumbList>\n    {paths.map((path, index) => (\n      <BreadcrumbItem key={path.id}>\n        {index > 0 && <BreadcrumbSeparator />}\n        {index === paths.length - 1\n          ? <BreadcrumbPage>{path.label}</BreadcrumbPage>\n          : <BreadcrumbLink href={path.href}>{path.label}</BreadcrumbLink>}\n      </BreadcrumbItem>\n    ))}\n  </BreadcrumbList>\n</Breadcrumb>"}} */
export interface BreadcrumbItemProps {
  children?: any;
  className?: string;
}

export default function BreadcrumbItem(props: BreadcrumbItemProps) {
  return (
    <li className={"flex flex-row gap-3 justify-center items-center" + (props.className ? " " + props.className : "")}>{props.children}</li>
  );
}

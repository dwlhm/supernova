import * as React from "react";

/* @composition {"root":"Breadcrumb","part":"BreadcrumbPage","parts":["Breadcrumb","BreadcrumbList","BreadcrumbItem","BreadcrumbLink","BreadcrumbPage","BreadcrumbSeparator","BreadcrumbEllipsis"],"slot":"replace","examples":{"static":"import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@dwlhm/ui-react';  <Breadcrumb>   <BreadcrumbList>     <BreadcrumbItem><BreadcrumbLink href=\"/\">Home</BreadcrumbLink></BreadcrumbItem>     <BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbPage>Products</BreadcrumbPage></BreadcrumbItem>   </BreadcrumbList> </Breadcrumb>","loop":"import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@dwlhm/ui-react';  // The consumer supplies paths, including stable IDs and link destinations. <Breadcrumb>   <BreadcrumbList>     {paths.map((path, index) => (       <BreadcrumbItem key={path.id}>         {index > 0 && <BreadcrumbSeparator />}         {index === paths.length - 1           ? <BreadcrumbPage>{path.label}</BreadcrumbPage>           : <BreadcrumbLink href={path.href}>{path.label}</BreadcrumbLink>}       </BreadcrumbItem>     ))}   </BreadcrumbList> </Breadcrumb>"}} */
export interface BreadcrumbPageProps {
  children?: any;
  className?: string;
}

function BreadcrumbPage(props: BreadcrumbPageProps) {
  return (
    <span
      aria-current="page"
      className={
        "text-sm font-normal text-[#0a0a0a]" +
        (props.className ? " " + props.className : "")
      }
    >
      {props.children}
    </span>
  );
}

export default BreadcrumbPage;

import * as React from "react";
import Breadcrumb from "./Breadcrumb";
import BreadcrumbItem from "./BreadcrumbItem";

function BreadcrumbExample(props: any) {
  return (
    <Breadcrumb type="deep" showEllipsis>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem isEllipsis />
      <BreadcrumbItem href="/components">Components</BreadcrumbItem>
      <BreadcrumbItem isCurrent>Breadcrumb</BreadcrumbItem>
    </Breadcrumb>
  );
}

Object.assign(BreadcrumbExample, { Breadcrumb, BreadcrumbItem });

export default BreadcrumbExample;

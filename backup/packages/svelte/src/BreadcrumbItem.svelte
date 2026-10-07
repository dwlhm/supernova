<script context="module" lang="ts">
  /* @composition {"root":"Breadcrumb","part":"BreadcrumbItem","parts":["Breadcrumb","BreadcrumbList","BreadcrumbItem","BreadcrumbLink","BreadcrumbPage","BreadcrumbSeparator","BreadcrumbEllipsis"],"slot":"replace","examples":{"static":"import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@dwlhm/ui-react';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href=\"/\">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbPage>Products</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>","loop":"import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@dwlhm/ui-react';

// The consumer supplies paths, including stable IDs and link destinations.
<Breadcrumb>
  <BreadcrumbList>
    {paths.map((path, index) => (
      <BreadcrumbItem key={path.id}>
        {index > 0 && <BreadcrumbSeparator />}
        {index === paths.length - 1
          ? <BreadcrumbPage>{path.label}</BreadcrumbPage>
          : <BreadcrumbLink href={path.href}>{path.label}</BreadcrumbLink>}
      </BreadcrumbItem>
    ))}
  </BreadcrumbList>
</Breadcrumb>"}} */
  export interface BreadcrumbItemProps {
    children?: any;
    className?: string;
  }
</script>

<script lang="ts">
  export let className: BreadcrumbItemProps["className"];
</script>

<li
  class={"flex flex-row gap-3 justify-center items-center" +
    (className ? " " + className : "")}
>
  <slot />
</li>
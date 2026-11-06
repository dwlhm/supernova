import Breadcrumb from '../components/Breadcrumb.lite';
import BreadcrumbItem from '../components/BreadcrumbItem.lite';

export default function BreadcrumbExample() {
  return (
    <Breadcrumb type="deep" showEllipsis={true}>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem isEllipsis={true} />
      <BreadcrumbItem href="/components">Components</BreadcrumbItem>
      <BreadcrumbItem isCurrent={true}>Breadcrumb</BreadcrumbItem>
    </Breadcrumb>
  );
}

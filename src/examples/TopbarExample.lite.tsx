import { useStore } from '@builder.io/mitosis';
import Topbar from '../components/Topbar.lite';
import TopbarTrigger from '../components/TopbarTrigger.lite';
import TopbarContent from '../components/TopbarContent.lite';
import Breadcrumb from '../components/Breadcrumb.lite';
import BreadcrumbItem from '../components/BreadcrumbItem.lite';

export default function TopbarExample() {
  const state = useStore({
    sidebarOpen: true,
  });

  return (
    <Topbar>
      <TopbarTrigger
        ariaLabel="Toggle sidebar"
        onClick={() => {
          state.sidebarOpen = !state.sidebarOpen;
        }}
      />
      <Breadcrumb className="w-auto">
        <BreadcrumbItem href="#home">Workspace</BreadcrumbItem>
        <BreadcrumbItem current={true} isLast={true}>
          {state.sidebarOpen ? 'Dashboard' : 'Dashboard (Full Width)'}
        </BreadcrumbItem>
      </Breadcrumb>
      <TopbarContent>
        <button
          type="button"
          class="inline-flex h-8 items-center justify-center rounded-md border border-border-default bg-background-default px-3 text-sm font-medium text-foreground-default transition-colors hover:bg-background-muted"
        >
          Feedback
        </button>
      </TopbarContent>
    </Topbar>
  );
}

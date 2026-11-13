import React, { useState, useEffect, useMemo } from 'react';
import {
  Avatar, Badge, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem,
  Button, FAB, IconPlaceholder, IconTruckDelivery, MainMenu, MenuItem,
  Sidebar, SidebarAccount, SidebarBrand, SidebarNav, SidebarSection,
  TabItem, Tabs, Topbar, TopbarContent, TopbarTrigger,
  createOverlayController, handleGroupKeyDown,
  type FloatingPlacement, type OverlayToastType,
} from '@komerce-design/react';
import { ToastAndOverlaySection } from './sections/ToastAndOverlaySection';
import { HeadlessFormSection } from './sections/HeadlessFormSection';
import { HeadlessTableSection } from './sections/HeadlessTableSection';
import { DataAndChartSection } from './sections/DataAndChartSection';
import { InteractiveFlowsSection } from './sections/InteractiveFlowsSection';
import { ProfiledSection, RerenderMonitorBar } from './components/RerenderMonitor';
import { IsolatedDialogHost, IsolatedToastHost } from './OverlayHosts';

export type SectionKey = 'overlays' | 'form' | 'table' | 'charts' | 'flows';

interface ShellState {
  isDark: boolean; sidebarExpanded: boolean; activeSection: SectionKey;
  showProfiler: boolean; forceExpandedToasts: boolean; fabPlacement: FloatingPlacement;
  expandedMenus: Record<string, boolean>; activeSubmenu: string; breadcrumbExpanded: boolean;
}

const SECTION_TABS: Array<{ id: SectionKey; label: string; subtitle: string; count: string }> = [
  { id: 'overlays', label: 'Toast & Overlays', count: '6 Pos', subtitle: 'Demonstrasi penuh penempatan 6 titik layar, tumpukan 3D/expanded, promise toast, custom children, AlertDialog, dan Tooltip.' },
  { id: 'form', label: 'Headless Form', count: '13', subtitle: 'Validasi tersinkronisasi & async AbortSignal pada 13 kontrol input dengan re-render terisolasi per field.' },
  { id: 'table', label: 'Headless Table', count: '14', subtitle: 'Pencarian, multi-filter kriteria & predikat terbuka, tri-state sorting, bulk actions, dan virtualisasi 10.000 baris.' },
  { id: 'charts', label: 'Charts & Metrics', count: '18', subtitle: 'Studio interaktif 12 mode visualisasi grafik, toggle seri legenda real-time, dan komposisi Card + Stat.' },
  { id: 'flows', label: 'Flows & Primitives', count: '28', subtitle: 'Eksplorasi FAB lintas 6 FloatingPlacement, Button, ToggleGroup, Stepper dua orientasi, BubbleChat, dan primitif ARIA/Tanggal.' },
];

const CONTROLLER_MENUS: Array<{ id: string; label: string; target: SectionKey; badge: string; children: string[] }> = [
  { id: 'ctrl-overlay', label: 'Overlay & Floating', target: 'overlays', badge: 'SRP', children: ['parseFloatingPlacement()', 'computeDeckOffset()', 'setToastPlacement()'] },
  { id: 'ctrl-form', label: 'createFormController', target: 'form', badge: 'Tier 1', children: ['bindField(name)', 'bindCheckboxField()', 'setFieldError()'] },
  { id: 'ctrl-table', label: 'createTableController', target: 'table', badge: 'Tier 1', children: ['setFilter(k, v)', 'retainValidIds()', 'getVirtualWindow()'] },
  { id: 'ctrl-chart', label: 'Chart & Collection', target: 'charts', badge: 'SSR', children: ['toggleListItem()', 'muteSeriesValues()', 'computeNiceTicks()'] },
];

function AppTopbar(props: {
  shell: ShellState; onToggleSidebar: () => void; onToggleDark: () => void;
  onToggleProfiler: () => void; onOpenDialog: () => void;
  onTriggerToast: (type: OverlayToastType, title: string, description: string) => void;
}) {
  return (
    <Topbar ariaLabel="Komerce Design System Topbar" className="sticky top-0 z-30 border-b border-border-default bg-background-default/95 backdrop-blur">
      <div className="flex items-center gap-3">
        <TopbarTrigger ariaLabel="Toggle sidebar" onClick={props.onToggleSidebar} />
        <div className="flex items-center gap-2">
          <IconTruckDelivery size={20} className="text-primary-default" />
          <span className="text-sm font-bold tracking-tight text-foreground-default">Komerce Supernova</span>
          <Badge variant="primary">React 19</Badge>
          <Badge variant="success">Composable + SRP</Badge>
        </div>
      </div>
      <TopbarContent className="flex items-center gap-2">
        <Button size="small" variant="outline" onClick={() => props.onTriggerToast('success', 'Toast Aktif', 'Posisi mengikuti konfigurasi FloatingPlacement saat ini.')}>+ Quick Toast</Button>
        <Button size="small" variant="secondary" onClick={props.onOpenDialog}>AlertDialog</Button>
        <Button size="small" variant={props.shell.showProfiler ? 'primary' : 'ghost'} onClick={props.onToggleProfiler}>⚡ Profiler</Button>
        <Button size="small" variant="ghost" onClick={props.onToggleDark}>{props.shell.isDark ? '☀️ Light' : '🌙 Dark'}</Button>
        <Avatar size="small" type="initials" initialsText="KD" status="online" showStatus />
      </TopbarContent>
    </Topbar>
  );
}

function AppSidebar(props: {
  shell: ShellState; onSelectSection: (section: SectionKey) => void;
  onToggleControllerMenu: (id: string) => void; onSelectSubmenu: (sub: string, target: SectionKey) => void;
}) {
  const { sidebarExpanded, activeSection, expandedMenus, activeSubmenu } = props.shell;
  return (
    <Sidebar expanded={sidebarExpanded} ariaLabel="Main Sidebar Navigation" className="shrink-0">
      <SidebarBrand expanded={sidebarExpanded}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-default text-primary-foreground font-bold">K</div>
          {sidebarExpanded && (
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight text-foreground-default">Komerce Design</span>
              <span className="text-[11px] text-foreground-muted">@komerce-design/react</span>
            </div>
          )}
        </div>
      </SidebarBrand>
      <SidebarNav expanded={sidebarExpanded}>
        <SidebarSection label="Focused Pages" expanded={sidebarExpanded}>
          {SECTION_TABS.map((item) => (
            <MainMenu key={item.id} active={activeSection === item.id} showBadge={sidebarExpanded} badgeLabel={item.count} leadingIcon={IconPlaceholder} onClick={() => props.onSelectSection(item.id)}>
              {item.label}
            </MainMenu>
          ))}
        </SidebarSection>
        <SidebarSection label="Composable Helpers" expanded={sidebarExpanded}>
          {CONTROLLER_MENUS.map((ctrl) => (
            <MenuItem
              key={ctrl.id} label={ctrl.label} expanded={sidebarExpanded && Boolean(expandedMenus[ctrl.id])}
              active={ctrl.children.includes(activeSubmenu)} showLabel={sidebarExpanded}
              showTrailingIcon={sidebarExpanded} showBadge={sidebarExpanded} badgeLabel={ctrl.badge}
              onClick={() => props.onToggleControllerMenu(ctrl.id)}
            >
              {ctrl.children.map((sub) => (
                <MenuItem key={sub} label={sub} active={activeSubmenu === sub} showLeadingIcon={false} showTrailingIcon={false} onClick={() => props.onSelectSubmenu(sub, ctrl.target)} />
              ))}
            </MenuItem>
          ))}
        </SidebarSection>
      </SidebarNav>
      <SidebarAccount expanded={sidebarExpanded}>
        <div className="flex items-center gap-2.5">
          <Avatar size="small" type="initials" initialsText="AK" status="online" showStatus />
          {sidebarExpanded && (
            <div className="flex flex-col truncate">
              <span className="truncate text-xs font-semibold text-foreground-default">Admin Komerce</span>
              <span className="truncate text-[11px] text-foreground-muted">engineering@komerce.id</span>
            </div>
          )}
        </div>
      </SidebarAccount>
    </Sidebar>
  );
}

export function App() {
  const [shell, setShell] = useState<ShellState>({
    isDark: false, sidebarExpanded: true, activeSection: 'overlays',
    showProfiler: false, forceExpandedToasts: false, fabPlacement: 'bottom-right',
    expandedMenus: { 'ctrl-overlay': true }, activeSubmenu: 'parseFloatingPlacement()', breadcrumbExpanded: false,
  });

  const toastSeqRef = React.useRef(1);
  const overlay = useMemo(() => createOverlayController({
    defaultDuration: 4500,
    defaultPlacement: 'top-right',
    maxToasts: 20,
    initialToast: { open: true, type: 'info', title: 'Selamat Datang di Komerce Showcase (#1)', description: 'Ubah posisi Toast ke 6 titik layar secara live di halaman Toast & Overlays.', duration: 5000 },
    initialDialog: { id: 'showcase-alert-dialog', open: false, heading: 'Konfirmasi Sinkronisasi Produksi', description: 'Apakah Anda yakin ingin mempublikasikan perubahan konfigurasi ke environment produksi?', cancelLabel: 'Batal', confirmLabel: 'Ya, Publikasikan' },
  }), []);

  useEffect(() => { document.documentElement.classList.toggle('dark', shell.isDark); }, [shell.isDark]);

  const activeMeta = SECTION_TABS.find((t) => t.id === shell.activeSection) || SECTION_TABS[0]!;
  const setSection = (activeSection: SectionKey) => setShell((s) => ({ ...s, activeSection }));
  const triggerToast = (type: OverlayToastType, title: string, description: string) => {
    toastSeqRef.current += 1;
    overlay.notify({ type, title: `${title} (#${toastSeqRef.current})`, description });
  };
  const openPublishDialog = () => {
    overlay.openDialog({ onConfirm: () => { overlay.success('Konfigurasi Dipublikasikan', { description: 'AlertDialog onConfirm berhasil dieksekusi.' }); } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-default text-foreground-default">
      <AppTopbar
        shell={shell}
        onToggleSidebar={() => setShell((s) => ({ ...s, sidebarExpanded: !s.sidebarExpanded }))}
        onToggleDark={() => setShell((s) => ({ ...s, isDark: !s.isDark }))}
        onToggleProfiler={() => setShell((s) => ({ ...s, showProfiler: !s.showProfiler }))}
        onOpenDialog={openPublishDialog}
        onTriggerToast={triggerToast}
      />
      <div className="flex flex-1">
        <AppSidebar
          shell={shell}
          onSelectSection={setSection}
          onToggleControllerMenu={(id) => setShell((s) => ({ ...s, expandedMenus: { ...s.expandedMenus, [id]: !s.expandedMenus[id] } }))}
          onSelectSubmenu={(activeSubmenu, activeSection) => setShell((s) => ({ ...s, activeSubmenu, activeSection }))}
        />
        <main className="flex-1 min-w-0 px-6 py-8 lg:px-10 lg:py-9 flex flex-col gap-8 max-w-6xl mx-auto w-full pb-24">
          <header className="flex flex-col gap-5 border-b border-border-default pb-6">
            <Breadcrumb ariaLabel="Page hierarchy">
              <BreadcrumbItem href="#workspace">Komerce Workspace</BreadcrumbItem>
              {!shell.breadcrumbExpanded ? <BreadcrumbEllipsis onClick={() => setShell((s) => ({ ...s, breadcrumbExpanded: true }))} /> : <BreadcrumbItem href="#react">@komerce-design/react</BreadcrumbItem>}
              <BreadcrumbItem current isLast>{activeMeta.label}</BreadcrumbItem>
            </Breadcrumb>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground-default">{activeMeta.label}</h1>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted max-w-3xl">{activeMeta.subtitle}</p>
            </div>
            <div onKeyDown={(e) => handleGroupKeyDown(e as unknown as { key?: string })}>
              <Tabs ariaLabel="Pilih Halaman Demonstrasi">
                {SECTION_TABS.map((tab) => (
                  <TabItem key={tab.id} active={shell.activeSection === tab.id} state={shell.activeSection === tab.id ? 'active' : 'default'} showNum num={tab.count} onClick={() => setSection(tab.id)}>
                    {tab.label}
                  </TabItem>
                ))}
              </Tabs>
            </div>
            {shell.showProfiler && <RerenderMonitorBar />}
          </header>

          {shell.activeSection === 'overlays' && (
            <ProfiledSection id="Page:Overlays">
              <ToastAndOverlaySection
                overlay={overlay}
                forceExpanded={shell.forceExpandedToasts}
                onForceExpandedChange={(forceExpandedToasts) => setShell((s) => ({ ...s, forceExpandedToasts }))}
              />
            </ProfiledSection>
          )}
          {shell.activeSection === 'form' && <ProfiledSection id="Page:Form"><HeadlessFormSection onNotify={triggerToast} /></ProfiledSection>}
          {shell.activeSection === 'table' && <ProfiledSection id="Page:Table"><HeadlessTableSection overlay={overlay} onNotify={triggerToast} /></ProfiledSection>}
          {shell.activeSection === 'charts' && <ProfiledSection id="Page:Charts"><DataAndChartSection /></ProfiledSection>}
          {shell.activeSection === 'flows' && (
            <ProfiledSection id="Page:Flows">
              <InteractiveFlowsSection
                fabPlacement={shell.fabPlacement}
                onFabPlacementChange={(fabPlacement) => setShell((s) => ({ ...s, fabPlacement }))}
                onNotify={triggerToast}
                onOpenDialog={openPublishDialog}
              />
            </ProfiledSection>
          )}
        </main>
      </div>

      <FAB
        variant="primary"
        size="extended"
        placement={shell.fabPlacement}
        icon={IconTruckDelivery}
        className={shell.fabPlacement.startsWith('top-') ? 'top-16' : undefined}
        onClick={() => overlay.info('Quick Dispatch Dibuat', { placement: shell.fabPlacement, description: `FAB mengapung di ${shell.fabPlacement} memicu toast pada posisi yang sama.` })}
      >
        Quick Order ({shell.fabPlacement})
      </FAB>

      <IsolatedToastHost overlay={overlay} forceExpanded={shell.forceExpandedToasts} />
      <IsolatedDialogHost overlay={overlay} />
    </div>
  );
}

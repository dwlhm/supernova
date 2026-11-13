var T=Object.defineProperty;var C=(a,n,r)=>n in a?T(a,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):a[n]=r;var l=(a,n,r)=>C(a,typeof n!="symbol"?n+"":n,r);import{ɵ as L,a as E,b as D,j as s,k as u,d as _,p as o,o as i,t as d,e as t,s as S,C as N,f as j,N as B,g as K,i as b,r as x}from"./core.vpEFnhB-.js";import P,{SidebarModule as k}from"./Sidebar.DoSKT-yN.js";import O,{SidebarBrandModule as h}from"./SidebarBrand.DRV4a7oq.js";import A,{SidebarNavModule as v}from"./SidebarNav.DDqaykMo.js";import F,{SidebarSectionModule as I}from"./SidebarSection.Cv7VW0B7.js";import J,{SidebarAccountModule as w}from"./SidebarAccount.CvhNJIF7.js";import W,{MainMenuModule as y}from"./MainMenu.BI8NkQn7.js";import{C as M,a as q}from"./common_module-chunk.B8w5oXjf.js";import"./theme.CecfD-Na.js";import"./framework.DPU9SBEx.js";function z(a,n){a&1&&(b(0),i(1,"Collapse Sidebar"),x())}function G(a,n){a&1&&(b(0),i(1,"Expand Sidebar"),x())}function H(a,n){a&1&&(b(0),s(1,"span",9),i(2,"Komerce"),o(),x())}function Q(a,n){a&1&&(b(0),s(1,"span",10)(2,"span",9),i(3,"Workspace"),o(),s(4,"span",11),i(5,"team@komerce.id"),o()(),x())}const m=class m{constructor(){l(this,"expanded",!0);l(this,"activeItem","dashboard")}};l(m,"ɵfac",function(r){return new(r||m)}),l(m,"ɵcmp",L({type:m,selectors:[["kd-sidebar-example"],["sidebar-example"]],standalone:!1,decls:21,vars:19,consts:[[1,"flex","flex-col","items-start","gap-3"],["type","button",1,"rounded-md","border","border-border-default","bg-background-default","px-2.5","py-1","text-xs","font-medium","text-foreground-default","hover:bg-background-muted",3,"click"],[4,"ngIf"],[3,"expanded"],["aria-hidden","true",1,"flex","h-6","w-6","shrink-0","items-center","justify-center","rounded-md","bg-primary-default","text-xs","font-semibold","text-primary-foreground"],["label","Management",3,"expanded"],[3,"click","active","showLabel","showTrailingIcon"],["badgeLabel","12",3,"click","active","showLabel","showTrailingIcon","showBadge"],["aria-hidden","true",1,"flex","h-8","w-8","shrink-0","items-center","justify-center","rounded-full","bg-background-subtle","text-xs","font-medium","text-foreground-muted"],[1,"truncate","text-sm","font-semibold","text-foreground-default"],[1,"flex","min-w-0","flex-1","flex-col"],[1,"truncate","text-xs","font-normal","text-foreground-muted"]],template:function(r,e){r&1&&(s(0,"div",0)(1,"button",1),u("click",function(){return e.expanded=!e.expanded}),_(2,z,2,0,"ng-container",2)(3,G,2,0,"ng-container",2),o(),s(4,"kd-sidebar",3)(5,"kd-sidebar-brand",3)(6,"span",4),i(7,"K"),o(),_(8,H,3,0,"ng-container",2),o(),s(9,"kd-sidebar-nav",3)(10,"kd-sidebar-section",5)(11,"kd-main-menu",6),u("click",function(){return e.activeItem="dashboard"}),i(12," Dashboard "),o(),s(13,"kd-main-menu",7),u("click",function(){return e.activeItem="orders"}),i(14," Orders "),o(),s(15,"kd-main-menu",6),u("click",function(){return e.activeItem="products"}),i(16," Products "),o()()(),s(17,"kd-sidebar-account",3)(18,"span",8),i(19,"LM"),o(),_(20,Q,6,0,"ng-container",2),o()()()),r&2&&(d(2),t("ngIf",e.expanded),d(),t("ngIf",!e.expanded),d(),t("expanded",e.expanded),d(),t("expanded",e.expanded),d(3),t("ngIf",e.expanded),d(),t("expanded",e.expanded),d(),t("expanded",e.expanded),d(),t("active",e.activeItem==="dashboard")("showLabel",e.expanded)("showTrailingIcon",e.expanded),d(2),t("active",e.activeItem==="orders")("showLabel",e.expanded)("showTrailingIcon",!1)("showBadge",e.expanded),d(2),t("active",e.activeItem==="products")("showLabel",e.expanded)("showTrailingIcon",e.expanded),d(2),t("expanded",e.expanded),d(3),t("ngIf",e.expanded))},dependencies:[q,P,O,A,F,W,J],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let c=m;(typeof ngDevMode>"u"||ngDevMode)&&S(c,[{type:N,args:[{standalone:!1,selector:"kd-sidebar-example, sidebar-example",template:`
    <div class="flex flex-col items-start gap-3">
      <button
        type="button"
        class="rounded-md border border-border-default bg-background-default px-2.5 py-1 text-xs font-medium text-foreground-default hover:bg-background-muted"
        (click)="
          expanded = !expanded;
        "
      >
        <ng-container *ngIf="expanded">Collapse Sidebar</ng-container
        ><ng-container *ngIf="!(expanded)">Expand Sidebar</ng-container>
      </button>
      <kd-sidebar [expanded]="expanded"
        ><kd-sidebar-brand [expanded]="expanded"
          ><span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-default text-xs font-semibold text-primary-foreground"
            aria-hidden="true"
            >K</span
          >
          <ng-container *ngIf="expanded"
            ><span
              class="truncate text-sm font-semibold text-foreground-default"
              >Komerce</span
            ></ng-container
          ></kd-sidebar-brand
        >
        <kd-sidebar-nav [expanded]="expanded"
          ><kd-sidebar-section label="Management" [expanded]="expanded"
            ><kd-main-menu
              [active]="activeItem === 'dashboard'"
              [showLabel]="expanded"
              [showTrailingIcon]="expanded"
              (click)="
          activeItem = 'dashboard';
        "
            >
              Dashboard
            </kd-main-menu>
            <kd-main-menu
              badgeLabel="12"
              [active]="activeItem === 'orders'"
              [showLabel]="expanded"
              [showTrailingIcon]="false"
              [showBadge]="expanded"
              (click)="
          activeItem = 'orders';
        "
            >
              Orders
            </kd-main-menu>
            <kd-main-menu
              [active]="activeItem === 'products'"
              [showLabel]="expanded"
              [showTrailingIcon]="expanded"
              (click)="
          activeItem = 'products';
        "
            >
              Products
            </kd-main-menu></kd-sidebar-section
          ></kd-sidebar-nav
        >
        <kd-sidebar-account [expanded]="expanded"
          ><span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-subtle text-xs font-medium text-foreground-muted"
            aria-hidden="true"
            >LM</span
          >
          <ng-container *ngIf="expanded"
            ><span class="flex min-w-0 flex-1 flex-col"
              ><span
                class="truncate text-sm font-semibold text-foreground-default"
                >Workspace</span
              >
              <span class="truncate text-xs font-normal text-foreground-muted"
                >team@komerce.id</span
              ></span
            ></ng-container
          ></kd-sidebar-account
        ></kd-sidebar
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&j(c,{className:"SidebarExample",filePath:"SidebarExample.ts",lineNumber:106});const p=class p{};l(p,"ɵfac",function(r){return new(r||p)}),l(p,"ɵmod",E({type:p})),l(p,"ɵinj",D({imports:[M,k,h,v,I,y,w]}));let f=p;(typeof ngDevMode>"u"||ngDevMode)&&S(f,[{type:B,args:[{declarations:[c],imports:[M,k,h,v,I,y,w],exports:[c]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&K(f,{declarations:[c],imports:[M,k,h,v,I,y,w],exports:[c]})})();export{f as SidebarExampleModule,c as default};

var T=Object.defineProperty;var C=(r,e,t)=>e in r?T(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var n=(r,e,t)=>C(r,typeof e!="symbol"?e+"":e,t);import{ɵ as D,a as v,b as I,j as i,k as O,p as b,o as c,d as N,t as l,e as m,s as h,C as F,f as j,N as L,g as w,i as x,r as M}from"./core.vpEFnhB-.js";import B,{TopbarModule as u}from"./Topbar.BEF6H0wr.js";import W,{TopbarTriggerModule as f}from"./TopbarTrigger.DEfK3mBv.js";import E,{TopbarContentModule as g}from"./TopbarContent.K78WCRmK.js";import S,{BreadcrumbModule as _}from"./Breadcrumb.CrCTYrxB.js";import J,{BreadcrumbItemModule as k}from"./BreadcrumbItem.ByPKTe2t.js";import{C as y,a as P}from"./common_module-chunk.B8w5oXjf.js";import"./theme.CecfD-Na.js";import"./framework.DPU9SBEx.js";function q(r,e){r&1&&(x(0),c(1,"Dashboard"),M())}function z(r,e){r&1&&(x(0),c(1,"Dashboard (Full Width)"),M())}const d=class d{constructor(){n(this,"sidebarOpen",!0)}};n(d,"ɵfac",function(t){return new(t||d)}),n(d,"ɵcmp",D({type:d,selectors:[["kd-topbar-example"],["topbar-example"]],standalone:!1,decls:11,vars:4,consts:[["ariaLabel","Toggle sidebar",3,"click"],["className","w-auto"],["href","#home"],[3,"current","isLast"],[4,"ngIf"],["type","button",1,"inline-flex","h-8","items-center","justify-center","rounded-md","border","border-border-default","bg-background-default","px-3","text-sm","font-medium","text-foreground-default","transition-colors","hover:bg-background-muted"]],template:function(t,s){t&1&&(i(0,"kd-topbar")(1,"kd-topbar-trigger",0),O("click",function(){return s.sidebarOpen=!s.sidebarOpen}),b(),i(2,"kd-breadcrumb",1)(3,"kd-breadcrumb-item",2),c(4,"Workspace"),b(),i(5,"kd-breadcrumb-item",3),N(6,q,2,0,"ng-container",4)(7,z,2,0,"ng-container",4),b()(),i(8,"kd-topbar-content")(9,"button",5),c(10," Feedback "),b()()()),t&2&&(l(5),m("current",!0)("isLast",!0),l(),m("ngIf",s.sidebarOpen),l(),m("ngIf",!s.sidebarOpen))},dependencies:[P,B,W,S,J,E],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=d;(typeof ngDevMode>"u"||ngDevMode)&&h(a,[{type:F,args:[{standalone:!1,selector:"kd-topbar-example, topbar-example",template:`
    <kd-topbar
      ><kd-topbar-trigger
        ariaLabel="Toggle sidebar"
        (click)="
          sidebarOpen = !sidebarOpen;
        "
      ></kd-topbar-trigger>
      <kd-breadcrumb className="w-auto"
        ><kd-breadcrumb-item href="#home">Workspace</kd-breadcrumb-item>
        <kd-breadcrumb-item [current]="true" [isLast]="true"
          ><ng-container *ngIf="sidebarOpen">Dashboard</ng-container
          ><ng-container *ngIf="!(sidebarOpen)"
            >Dashboard (Full Width)</ng-container
          ></kd-breadcrumb-item
        ></kd-breadcrumb
      >
      <kd-topbar-content
        ><button
          type="button"
          class="inline-flex h-8 items-center justify-center rounded-md border border-border-default bg-background-default px-3 text-sm font-medium text-foreground-default transition-colors hover:bg-background-muted"
        >
          Feedback
        </button></kd-topbar-content
      ></kd-topbar
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&j(a,{className:"TopbarExample",filePath:"TopbarExample.ts",lineNumber:49});const o=class o{};n(o,"ɵfac",function(t){return new(t||o)}),n(o,"ɵmod",v({type:o})),n(o,"ɵinj",I({imports:[y,u,f,_,k,g]}));let p=o;(typeof ngDevMode>"u"||ngDevMode)&&h(p,[{type:L,args:[{declarations:[a],imports:[y,u,f,_,k,g],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&w(p,{declarations:[a],imports:[y,u,f,_,k,g],exports:[a]})})();export{p as TopbarExampleModule,a as default};

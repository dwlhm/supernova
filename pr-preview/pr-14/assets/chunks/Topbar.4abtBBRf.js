var D=Object.defineProperty;var R=(t,a,e)=>a in t?D(t,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[a]=e;var r=(t,a,e)=>R(t,typeof a!="symbol"?a+"":a,e);import{E as w,ɵ as B,a as O,b as H,c as E,j as n,d as y,o as m,p as d,q as A,u as F,v as b,t as u,e as v,am as S,s as T,O as C,I as s,C as J,f as $,N as q,g as z,h as k,i as P,k as N,l as I,m as p,n as M,y as V,z as j,r as L,ao as G}from"./core.BqS-lykr.js";import{a as K,I as Q,b as U}from"./utils.BBpd638g.js";import{C as _,N as W}from"./common_module-chunk.DvGwmKFp.js";const X=["*"];function Y(t,a){if(t&1){const e=k();P(0),n(1,"button",6),N("click",function(){I(e);const h=p();return M(h.onToggleSidebar&&h.onToggleSidebar.emit())}),V(),n(2,"svg",7),j(3,"rect",8)(4,"path",9),d()(),L()}if(t&2){const e=p();u(),b("aria-label",e.sidebarToggleLabel)}}function Z(t,a){if(t&1){const e=k();P(0),n(1,"div",10),V(),n(2,"svg",11),j(3,"path",12),d(),G(),n(4,"input",13),N("input",function(h){I(e);const x=p();return M(x.onSearchChange&&x.onSearchChange.emit(h.target.value))}),d()(),L()}if(t&2){const e=p();u(3),b("d",e.ICON_PATHS.search),u(),b("value",e.searchValue)("placeholder",e.searchPlaceholder)("aria-label",e.searchPlaceholder)}}const l={showSearch:!1,searchPlaceholder:"Search",searchValue:"",showSidebarToggle:!0,sidebarToggleLabel:"Toggle sidebar",breadcrumbRoot:"Home",breadcrumbCurrent:"Breadcrumb",className:""},g=class g{constructor(){r(this,"cn",K);r(this,"ICON_PATHS",Q);r(this,"bindControllerProps",U);r(this,"className",l.className);r(this,"showSidebarToggle",l.showSidebarToggle);r(this,"sidebarToggleLabel",l.sidebarToggleLabel);r(this,"breadcrumbRoot",l.breadcrumbRoot);r(this,"breadcrumbCurrent",l.breadcrumbCurrent);r(this,"showSearch",l.showSearch);r(this,"searchValue",l.searchValue);r(this,"searchPlaceholder",l.searchPlaceholder);r(this,"onToggleSidebar",new w);r(this,"onSearchChange",new w)}};r(g,"ɵfac",function(e){return new(e||g)}),r(g,"ɵcmp",B({type:g,selectors:[["spn-topbar"],["topbar"]],inputs:{className:"className",showSidebarToggle:"showSidebarToggle",sidebarToggleLabel:"sidebarToggleLabel",breadcrumbRoot:"breadcrumbRoot",breadcrumbCurrent:"breadcrumbCurrent",showSearch:"showSearch",searchValue:"searchValue",searchPlaceholder:"searchPlaceholder"},outputs:{onToggleSidebar:"onToggleSidebar",onSearchChange:"onSearchChange"},standalone:!1,ngContentSelectors:X,decls:12,vars:7,consts:[[4,"ngIf"],["aria-label","Breadcrumb",1,"flex","items-center","gap-1.5","text-sm"],[1,"text-foreground-muted"],["aria-hidden","true",1,"text-foreground-muted"],["aria-current","page",1,"font-normal","text-foreground-default"],[1,"ml-auto","flex","flex-1","items-center","justify-end","gap-2"],["type","button",1,"inline-flex","h-8","w-8","shrink-0","items-center","justify-center","rounded-md","p-2","text-foreground-default","transition-colors","hover:bg-background-muted","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4"],["x","3","y","4","width","18","height","16","rx","2"],["d","M9 4v16","stroke-linecap","round"],[1,"ml-4","flex","h-8","w-full","max-w-xs","items-center","gap-2","rounded-lg","border","border-border-default","bg-background-default","px-3","focus-within:ring-2","focus-within:ring-focus-ring-primary"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4","shrink-0","text-foreground-muted"],["stroke-linecap","round"],["type","search",1,"w-full","bg-transparent","text-sm","text-foreground-default","outline-none","placeholder:text-foreground-muted",3,"input"]],template:function(e,o){e&1&&(E(),n(0,"header"),y(1,Y,5,1,"ng-container",0),n(2,"nav",1)(3,"span",2),m(4),d(),n(5,"span",3),m(6,"/"),d(),n(7,"span",4),m(8),d()(),y(9,Z,5,4,"ng-container",0),n(10,"div",5),A(11),d()()),e&2&&(F(o.cn("flex h-16 w-full items-center gap-2 border-b border-border-default bg-background-default px-6",o.className)),b("data-ctrl",typeof o.bindControllerProps),u(),v("ngIf",o.showSidebarToggle),u(3),S(o.breadcrumbRoot),u(4),S(o.breadcrumbCurrent),u(),v("ngIf",o.showSearch))},dependencies:[W],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let i=g;(typeof ngDevMode>"u"||ngDevMode)&&T(i,[{type:J,args:[{standalone:!1,selector:"spn-topbar, topbar",template:`
    <header
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex h-16 w-full items-center gap-2 border-b border-border-default bg-background-default px-6', className)"
    >
      <ng-container *ngIf="showSidebarToggle"
        ><button
          type="button"
          class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md p-2 text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          [attr.aria-label]="sidebarToggleLabel"
          (click)="onToggleSidebar && this.onToggleSidebar.emit()"
        >
          <svg
            aria-hidden="true"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <rect x="3" y="4" width="18" height="16" rx="2"></rect>
            <path d="M9 4v16" stroke-linecap="round"></path>
          </svg></button
      ></ng-container>
      <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm">
        <span class="text-foreground-muted">{{breadcrumbRoot}}</span>
        <span aria-hidden="true" class="text-foreground-muted">/</span>
        <span
          aria-current="page"
          class="font-normal text-foreground-default"
          >{{breadcrumbCurrent}}</span
        >
      </nav>
      <ng-container *ngIf="showSearch"
        ><div
          class="ml-4 flex h-8 w-full max-w-xs items-center gap-2 rounded-lg border border-border-default bg-background-default px-3 focus-within:ring-2 focus-within:ring-focus-ring-primary"
        >
          <svg
            aria-hidden="true"
            class="h-4 w-4 shrink-0 text-foreground-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path stroke-linecap="round" [attr.d]="ICON_PATHS.search"></path>
          </svg>
          <input
            type="search"
            class="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-foreground-muted"
            [attr.value]="searchValue"
            [attr.placeholder]="searchPlaceholder"
            [attr.aria-label]="searchPlaceholder"
            (input)="onSearchChange && this.onSearchChange.emit($any($event.target).value)"
          /></div
      ></ng-container>
      <div class="ml-auto flex flex-1 items-center justify-end gap-2">
        <ng-content></ng-content>
      </div>
    </header>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:s}],showSidebarToggle:[{type:s}],sidebarToggleLabel:[{type:s}],breadcrumbRoot:[{type:s}],breadcrumbCurrent:[{type:s}],showSearch:[{type:s}],searchValue:[{type:s}],searchPlaceholder:[{type:s}],onToggleSidebar:[{type:C}],onSearchChange:[{type:C}]});(typeof ngDevMode>"u"||ngDevMode)&&$(i,{className:"Topbar",filePath:"Topbar.ts",lineNumber:103});const c=class c{};r(c,"ɵfac",function(e){return new(e||c)}),r(c,"ɵmod",O({type:c})),r(c,"ɵinj",H({imports:[_]}));let f=c;(typeof ngDevMode>"u"||ngDevMode)&&T(f,[{type:q,args:[{declarations:[i],imports:[_],exports:[i]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&z(f,{declarations:[i],imports:[_],exports:[i]})})();export{f as TopbarModule,i as default};

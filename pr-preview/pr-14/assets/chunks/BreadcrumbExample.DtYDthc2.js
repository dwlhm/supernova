var C=Object.defineProperty;var I=(n,e,t)=>e in n?C(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var r=(n,e,t)=>I(n,typeof e!="symbol"?e+"":e,t);import{ɵ as M,a as v,b as B,j as l,o as i,p,d as y,k as E,t as m,e as c,s as h,C as D,f as N,N as T,g as w,i as f,z as j,r as b}from"./core.vpEFnhB-.js";import L,{BreadcrumbModule as _}from"./Breadcrumb.CrCTYrxB.js";import S,{BreadcrumbItemModule as g}from"./BreadcrumbItem.ByPKTe2t.js";import F,{BreadcrumbEllipsisModule as x}from"./BreadcrumbEllipsis.C_OK5kN4.js";import{C as k,a as H}from"./common_module-chunk.B8w5oXjf.js";import"./theme.CecfD-Na.js";import"./framework.DPU9SBEx.js";function J(n,e){n&1&&(f(0),j(1,"kd-breadcrumb-ellipsis"),b())}function P(n,e){n&1&&(f(0),l(1,"kd-breadcrumb-item",6),i(2,"Workspace"),p(),b())}function W(n,e){n&1&&(f(0),i(1,"Collapse middle items"),b())}function z(n,e){n&1&&(f(0),i(1,"Expand full path"),b())}const s=class s{constructor(){r(this,"expanded",!1)}};r(s,"ɵfac",function(t){return new(t||s)}),r(s,"ɵcmp",M({type:s,selectors:[["kd-breadcrumb-example"],["breadcrumb-example"]],standalone:!1,decls:13,vars:6,consts:[[1,"flex","flex-col","items-start","gap-2"],["href","#home"],[4,"ngIf"],["href","#components"],[3,"current","isLast"],["type","button",1,"text-xs","font-medium","text-primary-default","hover:underline",3,"click"],["href","#workspace"]],template:function(t,o){t&1&&(l(0,"div",0)(1,"kd-breadcrumb")(2,"kd-breadcrumb-item",1),i(3,"Home"),p(),y(4,J,2,0,"ng-container",2)(5,P,3,0,"ng-container",2),l(6,"kd-breadcrumb-item",3),i(7,"Components"),p(),l(8,"kd-breadcrumb-item",4),i(9," Breadcrumb "),p()(),l(10,"button",5),E("click",function(){return o.expanded=!o.expanded}),y(11,W,2,0,"ng-container",2)(12,z,2,0,"ng-container",2),p()()),t&2&&(m(4),c("ngIf",!o.expanded),m(),c("ngIf",o.expanded),m(3),c("current",!0)("isLast",!0),m(3),c("ngIf",o.expanded),m(),c("ngIf",!o.expanded))},dependencies:[H,L,S,F],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=s;(typeof ngDevMode>"u"||ngDevMode)&&h(a,[{type:D,args:[{standalone:!1,selector:"kd-breadcrumb-example, breadcrumb-example",template:`
    <div class="flex flex-col items-start gap-2">
      <kd-breadcrumb
        ><kd-breadcrumb-item href="#home">Home</kd-breadcrumb-item>
        <ng-container *ngIf="!expanded"
          ><kd-breadcrumb-ellipsis></kd-breadcrumb-ellipsis
        ></ng-container>
        <ng-container *ngIf="expanded"
          ><kd-breadcrumb-item href="#workspace"
            >Workspace</kd-breadcrumb-item
          ></ng-container
        >
        <kd-breadcrumb-item href="#components">Components</kd-breadcrumb-item>
        <kd-breadcrumb-item [current]="true" [isLast]="true">
          Breadcrumb
        </kd-breadcrumb-item></kd-breadcrumb
      >
      <button
        type="button"
        class="text-xs font-medium text-primary-default hover:underline"
        (click)="
          expanded = !expanded;
        "
      >
        <ng-container *ngIf="expanded">Collapse middle items</ng-container
        ><ng-container *ngIf="!(expanded)">Expand full path</ng-container>
      </button>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&N(a,{className:"BreadcrumbExample",filePath:"BreadcrumbExample.ts",lineNumber:49});const d=class d{};r(d,"ɵfac",function(t){return new(t||d)}),r(d,"ɵmod",v({type:d})),r(d,"ɵinj",B({imports:[k,_,g,x]}));let u=d;(typeof ngDevMode>"u"||ngDevMode)&&h(u,[{type:T,args:[{declarations:[a],imports:[k,_,g,x],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&w(u,{declarations:[a],imports:[k,_,g,x],exports:[a]})})();export{u as BreadcrumbExampleModule,a as default};

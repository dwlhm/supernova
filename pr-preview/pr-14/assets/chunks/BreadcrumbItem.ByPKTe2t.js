var N=Object.defineProperty;var M=(n,t,e)=>t in n?N(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var r=(n,t,e)=>M(n,typeof t!="symbol"?t+"":t,e);import{ɵ as j,a as w,b as D,c as L,j as x,d,p as I,u as C,v as y,t as a,e as f,s as v,I as i,C as P,f as T,N as O,g as B,i as u,q as b,r as m,m as g,ap as S,o as k,ao as E,A as F}from"./core.vpEFnhB-.js";import{a as J,d as q}from"./theme.CecfD-Na.js";import{C as h,N as z,a as A}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const U=["*","*",[["","separatorIcon",""],["","slot","separatoricon"]]],G=["*","*","[separatorIcon],[slot=separatorIcon]"];function H(n,t){if(n&1&&(u(0),x(1,"a",1),b(2),I(),m()),n&2){const e=g();a(),y("href",e.href,S)}}function K(n,t){if(n&1&&(u(0),x(1,"span"),b(2,1),I(),m()),n&2){const e=g();a(),C(e.cn("flex flex-row justify-center items-center gap-2.5 text-sm",e.current?"text-foreground-default font-medium":"text-foreground-muted font-normal")),y("aria-current",e.current?"page":void 0)}}function Q(n,t){n&1&&F(0)}function R(n,t){if(n&1&&(u(0),d(1,Q,1,0,"ng-container",3),m()),n&2){const e=g(2);a(),f("ngComponentOutlet",e.separatorIcon)}}function V(n,t){if(n&1&&(u(0),k(1),m()),n&2){const e=g(2);a(),E(e.separator)}}function W(n,t){if(n&1&&(u(0),x(1,"span",2),d(2,R,2,1,"ng-container",0),b(3,2),d(4,V,2,1,"ng-container",0),I(),m()),n&2){const e=g();a(2),f("ngIf",e.separatorIcon),a(2),f("ngIf",!e.separatorIcon)}}const p={href:"",current:!1,isLast:!1,separator:"/",className:""},l=class l{constructor(){r(this,"cn",J);r(this,"bindControllerProps",q);r(this,"className",p.className);r(this,"href",p.href);r(this,"current",p.current);r(this,"isLast",p.isLast);r(this,"separatorIcon");r(this,"separator",p.separator)}};r(l,"ɵfac",function(e){return new(e||l)}),r(l,"ɵcmp",j({type:l,selectors:[["kd-breadcrumb-item"],["breadcrumb-item"]],inputs:{className:"className",href:"href",current:"current",isLast:"isLast",separatorIcon:"separatorIcon",separator:"separator"},standalone:!1,ngContentSelectors:G,decls:4,vars:6,consts:[[4,"ngIf"],[1,"flex","flex-row","justify-center","items-center","gap-2.5","text-sm","font-normal","text-foreground-muted","hover:text-foreground-default","focus-visible:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary","rounded-xs","transition-colors"],["aria-hidden","true",1,"inline-flex","items-center","text-sm","font-normal","text-foreground-muted","select-none"],[4,"ngComponentOutlet"]],template:function(e,o){e&1&&(L(U),x(0,"li"),d(1,H,3,1,"ng-container",0)(2,K,3,3,"ng-container",0)(3,W,5,2,"ng-container",0),I()),e&2&&(C(o.cn("inline-flex flex-row items-center gap-1.5",o.className)),y("data-ctrl",typeof o.bindControllerProps),a(),f("ngIf",o.href&&!o.current),a(),f("ngIf",!o.href||o.current),a(),f("ngIf",!o.isLast))},dependencies:[z,A],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=l;(typeof ngDevMode>"u"||ngDevMode)&&v(s,[{type:P,args:[{standalone:!1,selector:"kd-breadcrumb-item, breadcrumb-item",template:`
    <li
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('inline-flex flex-row items-center gap-1.5', className)"
    >
      <ng-container *ngIf="href && !current"
        ><a
          class="flex flex-row justify-center items-center gap-2.5 text-sm font-normal text-foreground-muted hover:text-foreground-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary rounded-xs transition-colors"
          [attr.href]="href"
          ><ng-content></ng-content></a
      ></ng-container>
      <ng-container *ngIf="!href || current"
        ><span
          [attr.aria-current]="current ? 'page' : undefined"
          [class]="cn('flex flex-row justify-center items-center gap-2.5 text-sm', current ? 'text-foreground-default font-medium' : 'text-foreground-muted font-normal')"
          ><ng-content></ng-content></span
      ></ng-container>
      <ng-container *ngIf="!isLast"
        ><span
          aria-hidden="true"
          class="inline-flex items-center text-sm font-normal text-foreground-muted select-none"
          ><ng-container *ngIf="separatorIcon"><ng-container *ngComponentOutlet="separatorIcon"></ng-container></ng-container><ng-content select="[separatorIcon],[slot=separatorIcon]"></ng-content>
          <ng-container
            *ngIf="!separatorIcon"
            >{{separator}}</ng-container
          ></span
        ></ng-container
      >
    </li>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:i}],href:[{type:i}],current:[{type:i}],isLast:[{type:i}],separatorIcon:[{type:i}],separator:[{type:i}]});(typeof ngDevMode>"u"||ngDevMode)&&T(s,{className:"BreadcrumbItem",filePath:"BreadcrumbItem.ts",lineNumber:64});const c=class c{};r(c,"ɵfac",function(e){return new(e||c)}),r(c,"ɵmod",w({type:c})),r(c,"ɵinj",D({imports:[h]}));let _=c;(typeof ngDevMode>"u"||ngDevMode)&&v(_,[{type:O,args:[{declarations:[s],imports:[h],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&B(_,{declarations:[s],imports:[h],exports:[s]})})();export{_ as BreadcrumbItemModule,s as default};

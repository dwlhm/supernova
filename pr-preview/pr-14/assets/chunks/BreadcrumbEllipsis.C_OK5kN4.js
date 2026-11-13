var k=Object.defineProperty;var N=(n,t,e)=>t in n?k(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var r=(n,t,e)=>N(n,typeof t!="symbol"?t+"":t,e);import{E as L,ɵ as M,a as E,b as j,c as B,j as p,d as m,p as C,u as D,v as w,t as a,e as l,s as I,O as T,I as f,C as O,f as P,N as S,g as V,h as F,i as _,k as J,l as q,m as u,n as z,y as v,z as h,r as g,q as A,o as G,ao as H,A as K}from"./core.vpEFnhB-.js";import{a as Q,d as R}from"./theme.CecfD-Na.js";import{C as b,N as U,a as W}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const X=[[["","separatorIcon",""],["","slot","separatoricon"]]],Y=["[separatorIcon],[slot=separatorIcon]"];function Z(n,t){if(n&1){const e=F();_(0),p(1,"button",1),J("click",function(){q(e);const y=u();return z(y.onClick&&y.onClick.emit())}),v(),p(2,"svg",2),h(3,"circle",3)(4,"circle",4)(5,"circle",5),C()(),g()}if(n&2){const e=u();a(),w("aria-label",e.ariaLabel)}}function $(n,t){n&1&&(_(0),p(1,"span",6),v(),p(2,"svg",7),h(3,"circle",3)(4,"circle",4)(5,"circle",5),C()(),g())}function ee(n,t){n&1&&K(0)}function ne(n,t){if(n&1&&(_(0),m(1,ee,1,0,"ng-container",9),g()),n&2){const e=u(2);a(),l("ngComponentOutlet",e.separatorIcon)}}function te(n,t){if(n&1&&(_(0),G(1),g()),n&2){const e=u(2);a(),H(e.separator)}}function re(n,t){if(n&1&&(_(0),p(1,"span",8),m(2,ne,2,1,"ng-container",0),A(3),m(4,te,2,1,"ng-container",0),C(),g()),n&2){const e=u();a(2),l("ngIf",e.separatorIcon),a(2),l("ngIf",!e.separatorIcon)}}const d={isLast:!1,separator:"/",ariaLabel:"More pages",className:""},c=class c{constructor(){r(this,"cn",Q);r(this,"bindControllerProps",R);r(this,"className",d.className);r(this,"ariaLabel",d.ariaLabel);r(this,"isLast",d.isLast);r(this,"separatorIcon");r(this,"separator",d.separator);r(this,"onClick",new L)}};r(c,"ɵfac",function(e){return new(e||c)}),r(c,"ɵcmp",M({type:c,selectors:[["kd-breadcrumb-ellipsis"],["breadcrumb-ellipsis"]],inputs:{className:"className",ariaLabel:"ariaLabel",isLast:"isLast",separatorIcon:"separatorIcon",separator:"separator"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:Y,decls:4,vars:8,consts:[[4,"ngIf"],["type","button",1,"flex","h-5","w-5","cursor-pointer","flex-row","items-center","justify-center","rounded-xs","text-foreground-muted","hover:text-foreground-default","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"],["viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg",1,"h-3.5","w-3.5"],["cx","3","cy","7","r","1","fill","currentColor"],["cx","7","cy","7","r","1","fill","currentColor"],["cx","11","cy","7","r","1","fill","currentColor"],[1,"flex","flex-row","justify-center","items-center","w-3.5","h-3.5","text-foreground-muted"],["viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg",1,"w-3.5","h-3.5"],["aria-hidden","true",1,"inline-flex","items-center","text-sm","font-normal","text-foreground-muted","select-none"],[4,"ngComponentOutlet"]],template:function(e,o){e&1&&(B(X),p(0,"li"),m(1,Z,6,1,"ng-container",0)(2,$,6,0,"ng-container",0)(3,re,5,2,"ng-container",0),C()),e&2&&(D(o.cn("inline-flex flex-row items-center gap-1.5",o.className)),w("data-ctrl",typeof o.bindControllerProps)("role",o.onClick?void 0:"presentation")("aria-hidden",o.onClick?void 0:"true"),a(),l("ngIf",o.onClick),a(),l("ngIf",!o.onClick),a(),l("ngIf",!o.isLast))},dependencies:[U,W],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=c;(typeof ngDevMode>"u"||ngDevMode)&&I(s,[{type:O,args:[{standalone:!1,selector:"kd-breadcrumb-ellipsis, breadcrumb-ellipsis",template:`
    <li
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.role]="onClick ? undefined : 'presentation'"
      [attr.aria-hidden]="onClick ? undefined : 'true'"
      [class]="cn('inline-flex flex-row items-center gap-1.5', className)"
    >
      <ng-container *ngIf="onClick"
        ><button
          type="button"
          class="flex h-5 w-5 cursor-pointer flex-row items-center justify-center rounded-xs text-foreground-muted hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          [attr.aria-label]="ariaLabel"
          (click)="onClick && this.onClick.emit()"
        >
          <svg
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="h-3.5 w-3.5"
          >
            <circle cx="3" cy="7" r="1" fill="currentColor"></circle>
            <circle cx="7" cy="7" r="1" fill="currentColor"></circle>
            <circle cx="11" cy="7" r="1" fill="currentColor"></circle>
          </svg></button
      ></ng-container>
      <ng-container *ngIf="!onClick"
        ><span
          class="flex flex-row justify-center items-center w-3.5 h-3.5 text-foreground-muted"
          ><svg
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5"
          >
            <circle cx="3" cy="7" r="1" fill="currentColor"></circle>
            <circle cx="7" cy="7" r="1" fill="currentColor"></circle>
            <circle
              cx="11"
              cy="7"
              r="1"
              fill="currentColor"
            ></circle></svg></span
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
    `]}]}],null,{className:[{type:f}],ariaLabel:[{type:f}],isLast:[{type:f}],separatorIcon:[{type:f}],separator:[{type:f}],onClick:[{type:T}]});(typeof ngDevMode>"u"||ngDevMode)&&P(s,{className:"BreadcrumbEllipsis",filePath:"BreadcrumbEllipsis.ts",lineNumber:89});const i=class i{};r(i,"ɵfac",function(e){return new(e||i)}),r(i,"ɵmod",E({type:i})),r(i,"ɵinj",j({imports:[b]}));let x=i;(typeof ngDevMode>"u"||ngDevMode)&&I(x,[{type:S,args:[{declarations:[s],imports:[b],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&V(x,{declarations:[s],imports:[b],exports:[s]})})();export{x as BreadcrumbEllipsisModule,s as default};

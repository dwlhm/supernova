var w=Object.defineProperty;var E=(t,n,e)=>n in t?w(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e;var s=(t,n,e)=>E(t,typeof n!="symbol"?n+"":n,e);import{E as I,ɵ as j,a as M,b as k,c as D,j as c,d as P,p as f,u as T,v,t as l,e as u,s as b,O as B,I as m,C as S,f as V,N as O,g as z,i as g,y as F,z as J,r as _,q as N,h as q,k as G,l as U,m as C,n as A,an as H,o as K}from"./core.BqS-lykr.js";import{a as L,b as Q}from"./utils.BBpd638g.js";import{C as y,N as R}from"./common_module-chunk.DvGwmKFp.js";const h=["*","*"];function W(t,n){t&1&&(g(0),c(1,"span",1),F(),c(2,"svg",2),J(3,"circle",3)(4,"circle",4)(5,"circle",5),f()(),_())}function X(t,n){t&1&&(g(0),c(1,"span",6),N(2),f(),_())}function Y(t,n){if(t&1){const e=q();g(0),c(1,"a",7),G("click",function(){U(e);const x=C();return A(x.onNavigate&&x.onNavigate.emit(x.href||"#"))}),N(2,1),f(),_()}if(t&2){const e=C();l(),v("href",e.href,H)}}function Z(t,n){t&1&&(g(0),c(1,"span",8),K(2,"/"),f(),_())}const p={href:"#",isCurrent:!1,isEllipsis:!1,className:""},o=class o{constructor(){s(this,"cn",L);s(this,"bindControllerProps",Q);s(this,"className",p.className);s(this,"isEllipsis",p.isEllipsis);s(this,"isCurrent",p.isCurrent);s(this,"href",p.href);s(this,"onNavigate",new I)}};s(o,"ɵfac",function(e){return new(e||o)}),s(o,"ɵcmp",j({type:o,selectors:[["spn-breadcrumb-item"],["breadcrumb-item"]],inputs:{className:"className",isEllipsis:"isEllipsis",isCurrent:"isCurrent",href:"href"},outputs:{onNavigate:"onNavigate"},standalone:!1,ngContentSelectors:h,decls:5,vars:7,consts:[[4,"ngIf"],["aria-hidden","true",1,"inline-flex","items-center","justify-center","w-3.5","h-3.5","text-foreground-muted"],["viewBox","0 0 14 14","fill","none","stroke","currentColor","stroke-width","1.5",1,"w-3.5","h-3.5"],["cx","3","cy","7","r","1"],["cx","7","cy","7","r","1"],["cx","11","cy","7","r","1"],["aria-current","page",1,"flex","flex-row","justify-center","items-center","gap-2.5","text-sm","font-normal","text-foreground-default"],[1,"flex","flex-row","justify-center","items-center","gap-2.5","rounded-sm","text-sm","font-normal","text-foreground-muted","transition-colors","hover:text-foreground-default","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"],["aria-hidden","true",1,"text-sm","font-normal","text-foreground-muted"]],template:function(e,r){e&1&&(D(h),c(0,"li"),P(1,W,6,0,"ng-container",0)(2,X,3,0,"ng-container",0)(3,Y,3,1,"ng-container",0)(4,Z,3,0,"ng-container",0),f()),e&2&&(T(r.cn("flex flex-row justify-center items-center gap-1.5 text-sm font-normal",r.className)),v("data-ctrl",typeof r.bindControllerProps),l(),u("ngIf",r.isEllipsis),l(),u("ngIf",!r.isEllipsis&&r.isCurrent),l(),u("ngIf",!r.isEllipsis&&!r.isCurrent),l(),u("ngIf",!r.isCurrent))},dependencies:[R],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let i=o;(typeof ngDevMode>"u"||ngDevMode)&&b(i,[{type:S,args:[{standalone:!1,selector:"spn-breadcrumb-item, breadcrumb-item",template:`
    <li
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex flex-row justify-center items-center gap-1.5 text-sm font-normal', className)"
    >
      <ng-container *ngIf="isEllipsis"
        ><span
          class="inline-flex items-center justify-center w-3.5 h-3.5 text-foreground-muted"
          aria-hidden="true"
          ><svg
            class="w-3.5 h-3.5"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="3" cy="7" r="1"></circle>
            <circle cx="7" cy="7" r="1"></circle>
            <circle cx="11" cy="7" r="1"></circle></svg></span
      ></ng-container>
      <ng-container *ngIf="!isEllipsis && isCurrent"
        ><span
          aria-current="page"
          class="flex flex-row justify-center items-center gap-2.5 text-sm font-normal text-foreground-default"
          ><ng-content></ng-content></span
      ></ng-container>
      <ng-container *ngIf="!isEllipsis && !isCurrent"
        ><a
          class="flex flex-row justify-center items-center gap-2.5 rounded-sm text-sm font-normal text-foreground-muted transition-colors hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          [attr.href]="href"
          (click)="onNavigate && this.onNavigate.emit(href || '#')"
          ><ng-content></ng-content></a
      ></ng-container>
      <ng-container *ngIf="!isCurrent"
        ><span
          class="text-sm font-normal text-foreground-muted"
          aria-hidden="true"
          >/</span
        ></ng-container
      >
    </li>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:m}],isEllipsis:[{type:m}],isCurrent:[{type:m}],href:[{type:m}],onNavigate:[{type:B}]});(typeof ngDevMode>"u"||ngDevMode)&&V(i,{className:"BreadcrumbItem",filePath:"BreadcrumbItem.ts",lineNumber:75});const a=class a{};s(a,"ɵfac",function(e){return new(e||a)}),s(a,"ɵmod",M({type:a})),s(a,"ɵinj",k({imports:[y]}));let d=a;(typeof ngDevMode>"u"||ngDevMode)&&b(d,[{type:O,args:[{declarations:[i],imports:[y],exports:[i]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&z(d,{declarations:[i],imports:[y],exports:[i]})})();export{d as BreadcrumbItemModule,i as default};

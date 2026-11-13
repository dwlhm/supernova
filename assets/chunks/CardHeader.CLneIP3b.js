var h=Object.defineProperty;var M=(e,n,t)=>n in e?h(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t;var a=(e,n,t)=>M(e,typeof n!="symbol"?n+"":n,t);import{ɵ as j,a as k,b as w,c as D,j as r,d as u,i as g,q as C,p as l,r as f,u as T,t as o,e as d,s as v,I as m,C as O,f as H,N as S,g as P,m as p,o as I,ao as N,A as E}from"./core.vpEFnhB-.js";import{a as F}from"./theme.CMj9otVT.js";import{C as b,N as J,a as q}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const A=["*",[["","icon",""],["","slot","icon"]]],z=["*","[icon],[slot=icon]"];function B(e,n){if(e&1&&(g(0),r(1,"span",3),I(2),l(),f()),e&2){const t=p(2);o(2),N(t.title)}}function G(e,n){if(e&1&&(g(0),r(1,"span",4),I(2),l(),f()),e&2){const t=p(2);o(2),N(t.subtitle)}}function K(e,n){if(e&1&&(g(0),r(1,"div",2),u(2,B,3,1,"ng-container",0)(3,G,3,1,"ng-container",0),l(),f()),e&2){const t=p();o(2),d("ngIf",t.title),o(),d("ngIf",t.subtitle)}}function L(e,n){e&1&&E(0)}function Q(e,n){if(e&1&&(g(0),u(1,L,1,0,"ng-container",6),f()),e&2){const t=p(2);o(),d("ngComponentOutlet",t.icon)}}function R(e,n){if(e&1&&(g(0),r(1,"span",5),u(2,Q,2,1,"ng-container",0),C(3,1),l(),f()),e&2){const t=p();o(2),d("ngIf",t.icon)}}const y={title:"",subtitle:"",className:""},c=class c{constructor(){a(this,"cn",F);a(this,"className",y.className);a(this,"title",y.title);a(this,"subtitle",y.subtitle);a(this,"icon")}};a(c,"ɵfac",function(t){return new(t||c)}),a(c,"ɵcmp",j({type:c,selectors:[["kd-card-header"],["card-header"]],inputs:{className:"className",title:"title",subtitle:"subtitle",icon:"icon"},standalone:!1,ngContentSelectors:z,decls:6,vars:4,consts:[[4,"ngIf"],[1,"flex","shrink-0","items-center","gap-2"],[1,"flex","min-w-0","flex-1","flex-col","gap-0.5"],[1,"truncate","text-xs","font-medium","text-foreground-muted"],[1,"truncate","text-xs","font-normal","text-foreground-muted"],["aria-hidden","true",1,"flex","h-6","w-6","shrink-0","items-center","justify-center","rounded-md","bg-background-muted","p-1","text-foreground-default"],[4,"ngComponentOutlet"]],template:function(t,_){t&1&&(D(A),r(0,"div"),u(1,K,4,2,"ng-container",0),g(2),r(3,"div",1),C(4),l(),f(),u(5,R,4,1,"ng-container",0),l()),t&2&&(T(_.cn("flex items-start justify-between gap-2",_.className)),o(),d("ngIf",_.title||_.subtitle),o(4),d("ngIf",_.icon))},dependencies:[J,q],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=c;(typeof ngDevMode>"u"||ngDevMode)&&v(s,[{type:O,args:[{standalone:!1,selector:"kd-card-header, card-header",template:`
    <div [class]="cn('flex items-start justify-between gap-2', className)">
      <ng-container *ngIf="title || subtitle"
        ><div class="flex min-w-0 flex-1 flex-col gap-0.5">
          <ng-container *ngIf="title"
            ><span
              class="truncate text-xs font-medium text-foreground-muted"
              >{{title}}</span
            ></ng-container
          >
          <ng-container *ngIf="subtitle"
            ><span
              class="truncate text-xs font-normal text-foreground-muted"
              >{{subtitle}}</span
            ></ng-container
          >
        </div></ng-container
      >
      <ng-container><div class="flex shrink-0 items-center gap-2">
          <ng-content></ng-content></div
      ></ng-container>
      <ng-container *ngIf="icon"
        ><span
          class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-background-muted p-1 text-foreground-default"
          aria-hidden="true"
          ><ng-container *ngIf="icon"><ng-container *ngComponentOutlet="icon"></ng-container></ng-container><ng-content select="[icon],[slot=icon]"></ng-content></span
        ></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:m}],title:[{type:m}],subtitle:[{type:m}],icon:[{type:m}]});(typeof ngDevMode>"u"||ngDevMode)&&H(s,{className:"CardHeader",filePath:"CardHeader.ts",lineNumber:56});const i=class i{};a(i,"ɵfac",function(t){return new(t||i)}),a(i,"ɵmod",k({type:i})),a(i,"ɵinj",w({imports:[b]}));let x=i;(typeof ngDevMode>"u"||ngDevMode)&&v(x,[{type:S,args:[{declarations:[s],imports:[b],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&P(x,{declarations:[s],imports:[b],exports:[s]})})();export{x as CardHeaderModule,s as default};

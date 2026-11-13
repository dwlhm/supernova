var M=Object.defineProperty;var h=(e,n,t)=>n in e?M(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t;var a=(e,n,t)=>h(e,typeof n!="symbol"?n+"":n,t);import{ɵ as j,a as v,b as D,c as P,j as d,d as b,q as w,p,u as k,v as S,t as l,e as _,s as C,I as f,C as T,f as E,N as F,g as J,i as m,r as u,m as x,o as N,ao as I}from"./core.vpEFnhB-.js";import{a as q,d as O}from"./theme.CMj9otVT.js";import{C as y,a as z}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const A=["*"];function B(e,n){if(e&1&&(m(0),d(1,"span",2),N(2),p(),u()),e&2){const t=x(2);l(2),I(t.title)}}function G(e,n){if(e&1&&(m(0),d(1,"span",3),N(2),p(),u()),e&2){const t=x(2);l(2),I(t.description)}}function H(e,n){if(e&1&&(m(0),d(1,"figcaption",1),b(2,B,3,1,"ng-container",0)(3,G,3,1,"ng-container",0),p(),u()),e&2){const t=x();l(2),_("ngIf",t.title),l(),_("ngIf",t.description)}}const g={title:"",description:"",className:""},i=class i{constructor(){a(this,"cn",q);a(this,"bindControllerProps",O);a(this,"className",g.className);a(this,"title",g.title);a(this,"description",g.description)}};a(i,"ɵfac",function(t){return new(t||i)}),a(i,"ɵcmp",j({type:i,selectors:[["kd-chart"],["chart"]],inputs:{className:"className",title:"title",description:"description"},standalone:!1,ngContentSelectors:A,decls:3,vars:4,consts:[[4,"ngIf"],[1,"flex","flex-col","items-start","justify-start","gap-1"],[1,"text-base","leading-6","font-semibold","text-foreground-default"],[1,"text-sm","font-normal","text-foreground-muted"]],template:function(t,r){t&1&&(P(),d(0,"figure"),b(1,H,4,2,"ng-container",0),w(2),p()),t&2&&(k(r.cn("flex w-full flex-col items-start justify-start gap-4 rounded-lg border border-border-default bg-background-default px-5 py-5 shadow-sm",r.className)),S("data-ctrl",typeof r.bindControllerProps),l(),_("ngIf",r.title||r.description))},dependencies:[z],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=i;(typeof ngDevMode>"u"||ngDevMode)&&C(s,[{type:T,args:[{standalone:!1,selector:"kd-chart, chart",template:`
    <figure
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col items-start justify-start gap-4 rounded-lg border border-border-default bg-background-default px-5 py-5 shadow-sm', className)"
    >
      <ng-container *ngIf="title || description"
        ><figcaption class="flex flex-col items-start justify-start gap-1">
          <ng-container *ngIf="title"
            ><span
              class="text-base leading-6 font-semibold text-foreground-default"
              >{{title}}</span
            ></ng-container
          >
          <ng-container *ngIf="description"
            ><span
              class="text-sm font-normal text-foreground-muted"
              >{{description}}</span
            ></ng-container
          >
        </figcaption></ng-container
      >
      <ng-content></ng-content>
    </figure>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:f}],title:[{type:f}],description:[{type:f}]});(typeof ngDevMode>"u"||ngDevMode)&&E(s,{className:"Chart",filePath:"Chart.ts",lineNumber:59});const o=class o{};a(o,"ɵfac",function(t){return new(t||o)}),a(o,"ɵmod",v({type:o})),a(o,"ɵinj",D({imports:[y]}));let c=o;(typeof ngDevMode>"u"||ngDevMode)&&C(c,[{type:F,args:[{declarations:[s],imports:[y],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&J(c,{declarations:[s],imports:[y],exports:[s]})})();export{c as ChartModule,s as default};

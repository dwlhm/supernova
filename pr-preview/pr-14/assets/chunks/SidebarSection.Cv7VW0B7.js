var x=Object.defineProperty;var y=(s,t,e)=>t in s?x(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var a=(s,t,e)=>y(s,typeof t!="symbol"?t+"":t,e);import{ɵ as v,a as b,b as N,c as C,j as p,d as M,q as j,p as _,u,t as f,e as I,s as g,I as c,C as w,f as D,N as h,g as P,i as k,o as E,r as F,m as J,ao as S}from"./core.vpEFnhB-.js";import{a as T}from"./theme.CecfD-Na.js";import{C as m,a as q}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const O=["*"];function z(s,t){if(s&1&&(k(0),p(1,"div",1)(2,"span",2),E(3),_()(),F()),s&2){const e=J();f(3),S(e.label)}}const r={label:"",expanded:!0,className:""},d=class d{constructor(){a(this,"cn",T);a(this,"expanded",r.expanded);a(this,"className",r.className);a(this,"label",r.label)}};a(d,"ɵfac",function(e){return new(e||d)}),a(d,"ɵcmp",v({type:d,selectors:[["kd-sidebar-section"],["sidebar-section"]],inputs:{expanded:"expanded",className:"className",label:"label"},standalone:!1,ngContentSelectors:O,decls:4,vars:5,consts:[[4,"ngIf"],[1,"flex","flex-row","items-center","justify-start","gap-2","px-2","py-1"],[1,"text-xs","font-medium","text-foreground-muted"]],template:function(e,l){e&1&&(C(),p(0,"div"),M(1,z,4,1,"ng-container",0),p(2,"div"),j(3),_()()),e&2&&(u(l.cn("flex w-full flex-col justify-start gap-1",l.expanded?"items-start":"items-center",l.className)),f(),I("ngIf",l.expanded&&l.label!==""),f(),u(l.cn("flex w-full flex-col justify-start gap-1",l.expanded?"items-start":"items-center")))},dependencies:[q],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=d;(typeof ngDevMode>"u"||ngDevMode)&&g(n,[{type:w,args:[{standalone:!1,selector:"kd-sidebar-section, sidebar-section",template:`
    <div
      [class]="cn('flex w-full flex-col justify-start gap-1', expanded ? 'items-start' : 'items-center', className)"
    >
      <ng-container *ngIf="expanded && label !== ''"
        ><div class="flex flex-row items-center justify-start gap-2 px-2 py-1">
          <span
            class="text-xs font-medium text-foreground-muted"
            >{{label}}</span
          >
        </div></ng-container
      >
      <div
        [class]="cn('flex w-full flex-col justify-start gap-1', expanded ? 'items-start' : 'items-center')"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{expanded:[{type:c}],className:[{type:c}],label:[{type:c}]});(typeof ngDevMode>"u"||ngDevMode)&&D(n,{className:"SidebarSection",filePath:"SidebarSection.ts",lineNumber:44});const o=class o{};a(o,"ɵfac",function(e){return new(e||o)}),a(o,"ɵmod",b({type:o})),a(o,"ɵinj",N({imports:[m]}));let i=o;(typeof ngDevMode>"u"||ngDevMode)&&g(i,[{type:h,args:[{declarations:[n],imports:[m],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&P(i,{declarations:[n],imports:[m],exports:[n]})})();export{i as SidebarSectionModule,n as default};

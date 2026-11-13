var C=Object.defineProperty;var M=(n,a,e)=>a in n?C(n,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[a]=e;var t=(n,a,e)=>M(n,typeof a!="symbol"?a+"":a,e);import{ɵ as w,a as z,b as D,c as j,j as f,d as B,i as u,q as S,r as p,p as g,u as N,t as r,e as _,s as I,I as i,C as T,f as h,N as F,g as P,o as x,m as v,ao as y,an as k}from"./core.vpEFnhB-.js";import{a as E,e as J}from"./theme.CMj9otVT.js";import{C as b,a as q}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const O=["*"],A=()=>({sm:"text-base leading-5",md:"text-xl leading-6",lg:"text-2xl leading-7"});function G(n,a){if(n&1&&(u(0),f(1,"span",1),x(2),g(),p()),n&2){const e=v();r(2),y(e.label)}}function H(n,a){if(n&1&&(u(0),f(1,"span"),x(2),g(),p()),n&2){const e=v();r(),N(e.cn("max-w-full truncate font-semibold",e.cva(e.size,k(3,A),"md"),e.muted?"text-foreground-muted":"text-foreground-default")),r(),y(e.value)}}function K(n,a){if(n&1&&(u(0),f(1,"span",1),x(2),g(),p()),n&2){const e=v();r(2),y(e.label)}}const c={label:"",value:"",size:"md",muted:!1,reversed:!1,className:""},d=class d{constructor(){t(this,"Boolean",Boolean);t(this,"cn",E);t(this,"cva",J);t(this,"className",c.className);t(this,"reversed",c.reversed);t(this,"label",c.label);t(this,"value",c.value);t(this,"size",c.size);t(this,"muted",c.muted)}};t(d,"ɵfac",function(e){return new(e||d)}),t(d,"ɵcmp",w({type:d,selectors:[["kd-stat"],["stat"]],inputs:{className:"className",reversed:"reversed",label:"label",value:"value",size:"size",muted:"muted"},standalone:!1,ngContentSelectors:O,decls:6,vars:5,consts:[[4,"ngIf"],[1,"max-w-full","truncate","text-xs","font-normal","text-foreground-muted"]],template:function(e,s){e&1&&(j(),f(0,"div"),B(1,G,3,1,"ng-container",0)(2,H,3,4,"ng-container",0)(3,K,3,1,"ng-container",0),u(4),S(5),p(),g()),e&2&&(N(s.cn("flex min-w-0 flex-col items-start justify-start gap-0.5",s.className)),r(),_("ngIf",!s.reversed&&s.Boolean(s.label)),r(),_("ngIf",s.value),r(),_("ngIf",s.reversed&&s.Boolean(s.label)))},dependencies:[q],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let l=d;(typeof ngDevMode>"u"||ngDevMode)&&I(l,[{type:T,args:[{standalone:!1,selector:"kd-stat, stat",template:`
    <div
      [class]="cn('flex min-w-0 flex-col items-start justify-start gap-0.5', className)"
    >
      <ng-container *ngIf="!reversed && Boolean(label)"
        ><span
          class="max-w-full truncate text-xs font-normal text-foreground-muted"
          >{{label}}</span
        ></ng-container
      >
      <ng-container *ngIf="value"
        ><span
          [class]="cn('max-w-full truncate font-semibold', cva(size, {
          sm: 'text-base leading-5',
          md: 'text-xl leading-6',
          lg: 'text-2xl leading-7'
        }, 'md'), muted ? 'text-foreground-muted' : 'text-foreground-default')"
          >{{value}}</span
        ></ng-container
      >
      <ng-container *ngIf="reversed && Boolean(label)"
        ><span
          class="max-w-full truncate text-xs font-normal text-foreground-muted"
          >{{label}}</span
        ></ng-container
      >
      <ng-container><ng-content></ng-content></ng-container>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:i}],reversed:[{type:i}],label:[{type:i}],value:[{type:i}],size:[{type:i}],muted:[{type:i}]});(typeof ngDevMode>"u"||ngDevMode)&&h(l,{className:"Stat",filePath:"Stat.ts",lineNumber:64});const o=class o{};t(o,"ɵfac",function(e){return new(e||o)}),t(o,"ɵmod",z({type:o})),t(o,"ɵinj",D({imports:[b]}));let m=o;(typeof ngDevMode>"u"||ngDevMode)&&I(m,[{type:F,args:[{declarations:[l],imports:[b],exports:[l]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&P(m,{declarations:[l],imports:[b],exports:[l]})})();export{m as StatModule,l as default};

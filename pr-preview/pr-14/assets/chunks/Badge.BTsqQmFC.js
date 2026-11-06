var g=Object.defineProperty;var p=(o,t,e)=>t in o?g(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var n=(o,t,e)=>p(o,typeof t!="symbol"?t+"":t,e);import{ɵ as m,a as b,b as y,c as v,j as x,q as _,p as N,u as M,w,s as f,I as u,C,f as D,N as j,g as I}from"./core.BqS-lykr.js";import{a as h,d as F}from"./utils.BBpd638g.js";import{C as c}from"./common_module-chunk.DvGwmKFp.js";const P=["*"],S=()=>({secondary:"bg-secondary-default text-secondary-foreground",destructive:"bg-destructive-subtle text-destructive-foreground",success:"bg-success-subtle text-success-foreground",warning:"bg-warning-subtle text-warning-foreground",info:"bg-info-subtle text-info-foreground",outline:"border border-border-default bg-background-default text-foreground-default",primary:"bg-primary-subtle text-primary-subtle-foreground"}),l={variant:"primary",className:""},r=class r{constructor(){n(this,"cn",h);n(this,"cva",F);n(this,"variant",l.variant);n(this,"className",l.className)}};n(r,"ɵfac",function(e){return new(e||r)}),n(r,"ɵcmp",m({type:r,selectors:[["spn-badge"],["badge"]],inputs:{variant:"variant",className:"className"},standalone:!1,ngContentSelectors:P,decls:2,vars:3,template:function(e,i){e&1&&(v(),x(0,"span"),_(1),N()),e&2&&M(i.cn("inline-flex max-w-full items-center justify-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium leading-4",i.cva(i.variant,w(2,S),"primary"),i.className))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=r;(typeof ngDevMode>"u"||ngDevMode)&&f(s,[{type:C,args:[{standalone:!1,selector:"spn-badge, badge",template:`
    <span
      [class]="cn('inline-flex max-w-full items-center justify-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium leading-4', cva(variant, {
          secondary: 'bg-secondary-default text-secondary-foreground',
          destructive: 'bg-destructive-subtle text-destructive-foreground',
          success: 'bg-success-subtle text-success-foreground',
          warning: 'bg-warning-subtle text-warning-foreground',
          info: 'bg-info-subtle text-info-foreground',
          outline: 'border border-border-default bg-background-default text-foreground-default',
          primary: 'bg-primary-subtle text-primary-subtle-foreground'
        }, 'primary'), className)"
      ><ng-content></ng-content
    ></span>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{variant:[{type:u}],className:[{type:u}]});(typeof ngDevMode>"u"||ngDevMode)&&D(s,{className:"Badge",filePath:"Badge.ts",lineNumber:45});const a=class a{};n(a,"ɵfac",function(e){return new(e||a)}),n(a,"ɵmod",b({type:a})),n(a,"ɵinj",y({imports:[c]}));let d=a;(typeof ngDevMode>"u"||ngDevMode)&&f(d,[{type:j,args:[{declarations:[s],imports:[c],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&I(d,{declarations:[s],imports:[c],exports:[s]})})();export{d as BadgeModule,s as default};

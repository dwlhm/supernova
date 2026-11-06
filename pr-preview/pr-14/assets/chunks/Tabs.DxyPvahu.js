var m=Object.defineProperty;var u=(l,a,e)=>a in l?m(l,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[a]=e;var t=(l,a,e)=>u(l,typeof a!="symbol"?a+"":a,e);import{ɵ as b,a as g,b as y,c as _,j as N,q as C,p as M,u as v,v as D,s as f,I as d,C as L,f as j,N as P,g as x}from"./core.BqS-lykr.js";import{a as h,b as w}from"./utils.BBpd638g.js";import{C as c}from"./common_module-chunk.DvGwmKFp.js";const I=["*"],p={ariaLabel:"Tabs",className:""},o=class o{constructor(){t(this,"cn",h);t(this,"bindControllerProps",w);t(this,"ariaLabel",p.ariaLabel);t(this,"className",p.className)}};t(o,"ɵfac",function(e){return new(e||o)}),t(o,"ɵcmp",b({type:o,selectors:[["spn-tabs"],["tabs"]],inputs:{ariaLabel:"ariaLabel",className:"className"},standalone:!1,ngContentSelectors:I,decls:2,vars:4,consts:[["role","tablist"]],template:function(e,r){e&1&&(_(),N(0,"div",0),C(1),M()),e&2&&(v(r.cn("inline-flex h-9 flex-row items-center justify-center rounded-xl bg-background-muted p-0.5",r.className)),D("data-ctrl",typeof r.bindControllerProps)("aria-label",r.ariaLabel))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=o;(typeof ngDevMode>"u"||ngDevMode)&&f(s,[{type:L,args:[{standalone:!1,selector:"spn-tabs, tabs",template:`
    <div
      role="tablist"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-label]="ariaLabel"
      [class]="cn('inline-flex h-9 flex-row items-center justify-center rounded-xl bg-background-muted p-0.5', className)"
    >
      <ng-content></ng-content>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{ariaLabel:[{type:d}],className:[{type:d}]});(typeof ngDevMode>"u"||ngDevMode)&&j(s,{className:"Tabs",filePath:"Tabs.ts",lineNumber:34});const n=class n{};t(n,"ɵfac",function(e){return new(e||n)}),t(n,"ɵmod",g({type:n})),t(n,"ɵinj",y({imports:[c]}));let i=n;(typeof ngDevMode>"u"||ngDevMode)&&f(i,[{type:P,args:[{declarations:[s],imports:[c],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&x(i,{declarations:[s],imports:[c],exports:[s]})})();export{i as TabsModule,s as default};

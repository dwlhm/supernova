var u=Object.defineProperty;var y=(l,a,e)=>a in l?u(l,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[a]=e;var t=(l,a,e)=>y(l,typeof a!="symbol"?a+"":a,e);import{ɵ as b,a as _,b as g,c as N,j as v,k as M,q as w,p as D,u as h,v as k,s as f,I as d,C,f as L,N as j,g as x}from"./core.vpEFnhB-.js";import{a as G,M as I}from"./theme.CMj9otVT.js";import{C as c}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const K=["*"],p={ariaLabel:"Tabs",className:""},o=class o{constructor(){t(this,"cn",G);t(this,"handleGroupKeyDown",I);t(this,"ariaLabel",p.ariaLabel);t(this,"className",p.className)}};t(o,"ɵfac",function(e){return new(e||o)}),t(o,"ɵcmp",b({type:o,selectors:[["kd-tabs"],["tabs"]],inputs:{ariaLabel:"ariaLabel",className:"className"},standalone:!1,ngContentSelectors:K,decls:2,vars:3,consts:[["role","tablist",3,"keydown"]],template:function(e,i){e&1&&(N(),v(0,"div",0),M("keydown",function(m){return i.handleGroupKeyDown(m)}),w(1),D()),e&2&&(h(i.cn("inline-flex h-9 flex-row items-center justify-center rounded-xl bg-background-muted p-0.5",i.className)),k("aria-label",i.ariaLabel))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=o;(typeof ngDevMode>"u"||ngDevMode)&&f(n,[{type:C,args:[{standalone:!1,selector:"kd-tabs, tabs",template:`
    <div
      role="tablist"
      [attr.aria-label]="ariaLabel"
      (keydown)="handleGroupKeyDown($event)"
      [class]="cn('inline-flex h-9 flex-row items-center justify-center rounded-xl bg-background-muted p-0.5', className)"
    >
      <ng-content></ng-content>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{ariaLabel:[{type:d}],className:[{type:d}]});(typeof ngDevMode>"u"||ngDevMode)&&L(n,{className:"Tabs",filePath:"Tabs.ts",lineNumber:34});const s=class s{};t(s,"ɵfac",function(e){return new(e||s)}),t(s,"ɵmod",_({type:s})),t(s,"ɵinj",g({imports:[c]}));let r=s;(typeof ngDevMode>"u"||ngDevMode)&&f(r,[{type:j,args:[{declarations:[n],imports:[c],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&x(r,{declarations:[n],imports:[c],exports:[n]})})();export{r as TabsModule,n as default};

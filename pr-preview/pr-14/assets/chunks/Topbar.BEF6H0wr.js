var m=Object.defineProperty;var b=(r,a,e)=>a in r?m(r,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[a]=e;var t=(r,a,e)=>b(r,typeof a!="symbol"?a+"":a,e);import{ɵ as u,a as g,b as y,c as _,j as N,q as C,p as M,u as h,v,s as f,I as c,C as D,f as L,N as j,g as P}from"./core.vpEFnhB-.js";import{a as w,d as x}from"./theme.CecfD-Na.js";import{C as d}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const k=["*"],p={ariaLabel:"Application header",className:""},o=class o{constructor(){t(this,"cn",w);t(this,"bindControllerProps",x);t(this,"ariaLabel",p.ariaLabel);t(this,"className",p.className)}};t(o,"ɵfac",function(e){return new(e||o)}),t(o,"ɵcmp",u({type:o,selectors:[["kd-topbar"],["topbar"]],inputs:{ariaLabel:"ariaLabel",className:"className"},standalone:!1,ngContentSelectors:k,decls:2,vars:4,template:function(e,l){e&1&&(_(),N(0,"header"),C(1),M()),e&2&&(h(l.cn("flex h-16 w-full flex-row items-center justify-start gap-2.5 border-b border-border-default bg-background-default px-4 py-3",l.className)),v("aria-label",l.ariaLabel)("data-ctrl",typeof l.bindControllerProps))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=o;(typeof ngDevMode>"u"||ngDevMode)&&f(s,[{type:D,args:[{standalone:!1,selector:"kd-topbar, topbar",template:`
    <header
      [attr.aria-label]="ariaLabel"
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex h-16 w-full flex-row items-center justify-start gap-2.5 border-b border-border-default bg-background-default px-4 py-3', className)"
    >
      <ng-content></ng-content>
    </header>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{ariaLabel:[{type:c}],className:[{type:c}]});(typeof ngDevMode>"u"||ngDevMode)&&L(s,{className:"Topbar",filePath:"Topbar.ts",lineNumber:33});const n=class n{};t(n,"ɵfac",function(e){return new(e||n)}),t(n,"ɵmod",g({type:n})),t(n,"ɵinj",y({imports:[d]}));let i=n;(typeof ngDevMode>"u"||ngDevMode)&&f(i,[{type:j,args:[{declarations:[s],imports:[d],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&P(i,{declarations:[s],imports:[d],exports:[s]})})();export{i as TopbarModule,s as default};

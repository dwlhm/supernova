var p=Object.defineProperty;var f=(l,t,e)=>t in l?p(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var s=(l,t,e)=>f(l,typeof t!="symbol"?t+"":t,e);import{ɵ as m,a as u,b as g,c as y,j as _,q as N,p as M,u as v,v as C,s as d,I as b,C as D,f as j,N as P,g as x}from"./core.vpEFnhB-.js";import{a as I,d as h}from"./theme.CMj9otVT.js";import{C as i}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const S=["*"],k={className:""},o=class o{constructor(){s(this,"cn",I);s(this,"bindControllerProps",h);s(this,"className",k.className)}};s(o,"ɵfac",function(e){return new(e||o)}),s(o,"ɵcmp",m({type:o,selectors:[["kd-topbar-content"],["topbar-content"]],inputs:{className:"className"},standalone:!1,ngContentSelectors:S,decls:2,vars:3,template:function(e,r){e&1&&(y(),_(0,"div"),N(1),M()),e&2&&(v(r.cn("ml-auto flex flex-1 items-center justify-end gap-2.5",r.className)),C("data-ctrl",typeof r.bindControllerProps))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=o;(typeof ngDevMode>"u"||ngDevMode)&&d(n,[{type:D,args:[{standalone:!1,selector:"kd-topbar-content, topbar-content",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('ml-auto flex flex-1 items-center justify-end gap-2.5', className)"
    >
      <ng-content></ng-content>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:b}]});(typeof ngDevMode>"u"||ngDevMode)&&j(n,{className:"TopbarContent",filePath:"TopbarContent.ts",lineNumber:31});const a=class a{};s(a,"ɵfac",function(e){return new(e||a)}),s(a,"ɵmod",u({type:a})),s(a,"ɵinj",g({imports:[i]}));let c=a;(typeof ngDevMode>"u"||ngDevMode)&&d(c,[{type:P,args:[{declarations:[n],imports:[i],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&x(c,{declarations:[n],imports:[i],exports:[n]})})();export{c as TopbarContentModule,n as default};

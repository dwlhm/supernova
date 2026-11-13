var m=Object.defineProperty;var u=(d,t,e)=>t in d?m(d,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[t]=e;var s=(d,t,e)=>u(d,typeof t!="symbol"?t+"":t,e);import{ɵ as y,a as g,b as x,c as _,j as N,q as M,p as b,u as v,s as f,I as i,C as j,f as C,N as D,g as w}from"./core.vpEFnhB-.js";import{a as I}from"./theme.CecfD-Na.js";import{C as c}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const h=["*"],r={expanded:!0,className:""},o=class o{constructor(){s(this,"cn",I);s(this,"expanded",r.expanded);s(this,"className",r.className)}};s(o,"ɵfac",function(e){return new(e||o)}),s(o,"ɵcmp",y({type:o,selectors:[["kd-sidebar-brand"],["sidebar-brand"]],inputs:{expanded:"expanded",className:"className"},standalone:!1,ngContentSelectors:h,decls:2,vars:2,template:function(e,l){e&1&&(_(),N(0,"div"),M(1),b()),e&2&&v(l.cn("flex w-full flex-row items-center gap-2",l.expanded?"justify-start px-2 py-4":"justify-center px-2 pt-4 pb-2",l.className))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=o;(typeof ngDevMode>"u"||ngDevMode)&&f(n,[{type:j,args:[{standalone:!1,selector:"kd-sidebar-brand, sidebar-brand",template:`
    <div
      [class]="cn('flex w-full flex-row items-center gap-2', expanded ? 'justify-start px-2 py-4' : 'justify-center px-2 pt-4 pb-2', className)"
    >
      <ng-content></ng-content>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{expanded:[{type:i}],className:[{type:i}]});(typeof ngDevMode>"u"||ngDevMode)&&C(n,{className:"SidebarBrand",filePath:"SidebarBrand.ts",lineNumber:31});const a=class a{};s(a,"ɵfac",function(e){return new(e||a)}),s(a,"ɵmod",g({type:a})),s(a,"ɵinj",x({imports:[c]}));let p=a;(typeof ngDevMode>"u"||ngDevMode)&&f(p,[{type:D,args:[{declarations:[n],imports:[c],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&w(p,{declarations:[n],imports:[c],exports:[n]})})();export{p as SidebarBrandModule,n as default};

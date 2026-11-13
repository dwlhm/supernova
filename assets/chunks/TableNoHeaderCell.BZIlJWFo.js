var i=Object.defineProperty;var m=(c,t,e)=>t in c?i(c,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):c[t]=e;var s=(c,t,e)=>m(c,typeof t!="symbol"?t+"":t,e);import{ɵ as f,a as u,b as g,c as y,j as _,q as h,p as M,u as N,s as r,I as x,C as b,f as w,N as D,g as v}from"./core.vpEFnhB-.js";import{a as C}from"./theme.CMj9otVT.js";import{C as d}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const j=["*"],k={className:""},o=class o{constructor(){s(this,"cn",C);s(this,"className",k.className)}};s(o,"ɵfac",function(e){return new(e||o)}),s(o,"ɵcmp",f({type:o,selectors:[["kd-table-no-header-cell"],["table-no-header-cell"]],inputs:{className:"className"},standalone:!1,ngContentSelectors:j,decls:2,vars:2,consts:[["scope","col"]],template:function(e,p){e&1&&(y(),_(0,"th",0),h(1),M()),e&2&&N(p.cn("w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center text-sm font-medium text-foreground-default",p.className))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=o;(typeof ngDevMode>"u"||ngDevMode)&&r(n,[{type:b,args:[{standalone:!1,selector:"kd-table-no-header-cell, table-no-header-cell",template:`
    <th
      scope="col"
      [class]="cn('w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center text-sm font-medium text-foreground-default', className)"
    >
      <ng-content></ng-content>
    </th>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:x}]});(typeof ngDevMode>"u"||ngDevMode)&&w(n,{className:"TableNoHeaderCell",filePath:"TableNoHeaderCell.ts",lineNumber:31});const a=class a{};s(a,"ɵfac",function(e){return new(e||a)}),s(a,"ɵmod",u({type:a})),s(a,"ɵinj",g({imports:[d]}));let l=a;(typeof ngDevMode>"u"||ngDevMode)&&r(l,[{type:D,args:[{declarations:[n],imports:[d],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&v(l,{declarations:[n],imports:[d],exports:[n]})})();export{l as TableNoHeaderCellModule,n as default};

var f=Object.defineProperty;var u=(l,t,e)=>t in l?f(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var n=(l,t,e)=>u(l,typeof t!="symbol"?t+"":t,e);import{ɵ as y,a as g,b as _,j as b,o as x,p as M,u as N,t as v,x as w,s as m,I as p,C as D,f as C,N as h,g as I}from"./core.vpEFnhB-.js";import{a as j}from"./theme.CecfD-Na.js";import{C as c}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const i={no:1,className:""},o=class o{constructor(){n(this,"cn",j);n(this,"className",i.className);n(this,"no",i.no)}};n(o,"ɵfac",function(e){return new(e||o)}),n(o,"ɵcmp",y({type:o,selectors:[["kd-table-no-body-cell"],["table-no-body-cell"]],inputs:{className:"className",no:"no"},standalone:!1,decls:2,vars:3,template:function(e,r){e&1&&(b(0,"td"),x(1),M()),e&2&&(N(r.cn("w-12 whitespace-nowrap border-t border-border-default px-4 py-3 text-center text-sm font-normal text-foreground-muted",r.className)),v(),w(" ",r.no," "))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=o;(typeof ngDevMode>"u"||ngDevMode)&&m(s,[{type:D,args:[{standalone:!1,selector:"kd-table-no-body-cell, table-no-body-cell",template:`
    <td
      [class]="cn('w-12 whitespace-nowrap border-t border-border-default px-4 py-3 text-center text-sm font-normal text-foreground-muted', className)"
    >
      {{no}}
    </td>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:p}],no:[{type:p}]});(typeof ngDevMode>"u"||ngDevMode)&&C(s,{className:"TableNoBodyCell",filePath:"TableNoBodyCell.ts",lineNumber:31});const a=class a{};n(a,"ɵfac",function(e){return new(e||a)}),n(a,"ɵmod",g({type:a})),n(a,"ɵinj",_({imports:[c]}));let d=a;(typeof ngDevMode>"u"||ngDevMode)&&m(d,[{type:h,args:[{declarations:[s],imports:[c],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&I(d,{declarations:[s],imports:[c],exports:[s]})})();export{d as TableNoBodyCellModule,s as default};

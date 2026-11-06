var f=Object.defineProperty;var u=(l,t,e)=>t in l?f(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var s=(l,t,e)=>u(l,typeof t!="symbol"?t+"":t,e);import{ɵ as y,a as g,b as _,j as b,o as x,p as M,u as N,t as v,x as w,s as m,I as p,C as D,f as C,N as h,g as I}from"./core.BqS-lykr.js";import{a as j}from"./utils.BBpd638g.js";import{C as c}from"./common_module-chunk.DvGwmKFp.js";const i={no:1,className:""},o=class o{constructor(){s(this,"cn",j);s(this,"className",i.className);s(this,"no",i.no)}};s(o,"ɵfac",function(e){return new(e||o)}),s(o,"ɵcmp",y({type:o,selectors:[["spn-table-no-body-cell"],["table-no-body-cell"]],inputs:{className:"className",no:"no"},standalone:!1,decls:2,vars:3,template:function(e,r){e&1&&(b(0,"td"),x(1),M()),e&2&&(N(r.cn("w-12 whitespace-nowrap border-t border-border-default px-4 py-3 text-center text-sm text-foreground-muted",r.className)),v(),w(" ",r.no," "))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=o;(typeof ngDevMode>"u"||ngDevMode)&&m(n,[{type:D,args:[{standalone:!1,selector:"spn-table-no-body-cell, table-no-body-cell",template:`
    <td
      [class]="cn('w-12 whitespace-nowrap border-t border-border-default px-4 py-3 text-center text-sm text-foreground-muted', className)"
    >
      {{no}}
    </td>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:p}],no:[{type:p}]});(typeof ngDevMode>"u"||ngDevMode)&&C(n,{className:"TableNoBodyCell",filePath:"TableNoBodyCell.ts",lineNumber:31});const a=class a{};s(a,"ɵfac",function(e){return new(e||a)}),s(a,"ɵmod",g({type:a})),s(a,"ɵinj",_({imports:[c]}));let d=a;(typeof ngDevMode>"u"||ngDevMode)&&m(d,[{type:h,args:[{declarations:[n],imports:[c],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&I(d,{declarations:[n],imports:[c],exports:[n]})})();export{d as TableNoBodyCellModule,n as default};

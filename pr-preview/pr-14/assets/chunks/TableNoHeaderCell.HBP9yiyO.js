var f=Object.defineProperty;var u=(l,t,e)=>t in l?f(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var a=(l,t,e)=>u(l,typeof t!="symbol"?t+"":t,e);import{ɵ as g,a as y,b,j as _,o as N,p as h,u as x,t as M,x as v,s as m,I as r,C as w,f as D,N as C,g as I}from"./core.BqS-lykr.js";import{a as j}from"./utils.BBpd638g.js";import{C as d}from"./common_module-chunk.DvGwmKFp.js";const i={label:"No",className:""},o=class o{constructor(){a(this,"cn",j);a(this,"className",i.className);a(this,"label",i.label)}};a(o,"ɵfac",function(e){return new(e||o)}),a(o,"ɵcmp",g({type:o,selectors:[["spn-table-no-header-cell"],["table-no-header-cell"]],inputs:{className:"className",label:"label"},standalone:!1,decls:2,vars:3,consts:[["scope","col"]],template:function(e,p){e&1&&(_(0,"th",0),N(1),h()),e&2&&(x(p.cn("w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center text-sm font-medium text-foreground-default",p.className)),M(),v(" ",p.label," "))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=o;(typeof ngDevMode>"u"||ngDevMode)&&m(s,[{type:w,args:[{standalone:!1,selector:"spn-table-no-header-cell, table-no-header-cell",template:`
    <th
      scope="col"
      [class]="cn('w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center text-sm font-medium text-foreground-default', className)"
    >
      {{label}}
    </th>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:r}],label:[{type:r}]});(typeof ngDevMode>"u"||ngDevMode)&&D(s,{className:"TableNoHeaderCell",filePath:"TableNoHeaderCell.ts",lineNumber:32});const n=class n{};a(n,"ɵfac",function(e){return new(e||n)}),a(n,"ɵmod",y({type:n})),a(n,"ɵinj",b({imports:[d]}));let c=n;(typeof ngDevMode>"u"||ngDevMode)&&m(c,[{type:C,args:[{declarations:[s],imports:[d],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&I(c,{declarations:[s],imports:[d],exports:[s]})})();export{c as TableNoHeaderCellModule,s as default};

var i=Object.defineProperty;var f=(r,t,e)=>t in r?i(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var s=(r,t,e)=>f(r,typeof t!="symbol"?t+"":t,e);import{ɵ as m,a as u,b,c as g,j as y,q as _,p as N,u as C,v as M,s as p,I as v,C as D,f as h,N as P,g as j}from"./core.BqS-lykr.js";import{a as w,b as I}from"./utils.BBpd638g.js";import{C as d}from"./common_module-chunk.DvGwmKFp.js";const S=["*"],k={className:""},o=class o{constructor(){s(this,"cn",w);s(this,"bindControllerProps",I);s(this,"className",k.className)}};s(o,"ɵfac",function(e){return new(e||o)}),s(o,"ɵcmp",m({type:o,selectors:[["spn-table-header-row"],["table-header-row"]],inputs:{className:"className"},standalone:!1,ngContentSelectors:S,decls:2,vars:3,template:function(e,c){e&1&&(g(),y(0,"tr"),_(1),N()),e&2&&(C(c.cn("border-b border-border-default bg-background-subtle",c.className)),M("data-ctrl",typeof c.bindControllerProps))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=o;(typeof ngDevMode>"u"||ngDevMode)&&p(a,[{type:D,args:[{standalone:!1,selector:"spn-table-header-row, table-header-row",template:`
    <tr
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('border-b border-border-default bg-background-subtle', className)"
    >
      <ng-content></ng-content>
    </tr>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:v}]});(typeof ngDevMode>"u"||ngDevMode)&&h(a,{className:"TableHeaderRow",filePath:"TableHeaderRow.ts",lineNumber:31});const n=class n{};s(n,"ɵfac",function(e){return new(e||n)}),s(n,"ɵmod",u({type:n})),s(n,"ɵinj",b({imports:[d]}));let l=n;(typeof ngDevMode>"u"||ngDevMode)&&p(l,[{type:P,args:[{declarations:[a],imports:[d],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&j(l,{declarations:[a],imports:[d],exports:[a]})})();export{l as TableHeaderRowModule,a as default};

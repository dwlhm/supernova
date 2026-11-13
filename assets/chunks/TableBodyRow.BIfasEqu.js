var u=Object.defineProperty;var m=(l,t,e)=>t in l?u(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var s=(l,t,e)=>m(l,typeof t!="symbol"?t+"":t,e);import{ɵ as b,a as g,b as y,c as _,j as N,q as M,p as v,u as C,v as D,s as f,I as i,C as k,f as h,N as j,g as w}from"./core.vpEFnhB-.js";import{a as I}from"./theme.CMj9otVT.js";import{C as d}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const P=["*"],p={selected:!1,className:""},o=class o{constructor(){s(this,"cn",I);s(this,"selected",p.selected);s(this,"className",p.className)}};s(o,"ɵfac",function(e){return new(e||o)}),s(o,"ɵcmp",b({type:o,selectors:[["kd-table-body-row"],["table-body-row"]],inputs:{selected:"selected",className:"className"},standalone:!1,ngContentSelectors:P,decls:2,vars:3,template:function(e,r){e&1&&(_(),N(0,"tr"),M(1),v()),e&2&&(C(r.cn("border-b border-border-default transition-colors hover:bg-background-subtle",r.selected?"bg-primary-subtle":"bg-background-default",r.className)),D("aria-selected",r.selected))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=o;(typeof ngDevMode>"u"||ngDevMode)&&f(a,[{type:k,args:[{standalone:!1,selector:"kd-table-body-row, table-body-row",template:`
    <tr
      [attr.aria-selected]="selected"
      [class]="cn('border-b border-border-default transition-colors hover:bg-background-subtle', selected ? 'bg-primary-subtle' : 'bg-background-default', className)"
    >
      <ng-content></ng-content>
    </tr>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{selected:[{type:i}],className:[{type:i}]});(typeof ngDevMode>"u"||ngDevMode)&&h(a,{className:"TableBodyRow",filePath:"TableBodyRow.ts",lineNumber:32});const n=class n{};s(n,"ɵfac",function(e){return new(e||n)}),s(n,"ɵmod",g({type:n})),s(n,"ɵinj",y({imports:[d]}));let c=n;(typeof ngDevMode>"u"||ngDevMode)&&f(c,[{type:j,args:[{declarations:[a],imports:[d],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&w(c,{declarations:[a],imports:[d],exports:[a]})})();export{c as TableBodyRowModule,a as default};

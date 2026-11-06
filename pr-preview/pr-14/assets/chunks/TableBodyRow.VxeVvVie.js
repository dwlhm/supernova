var f=Object.defineProperty;var u=(r,t,e)=>t in r?f(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var s=(r,t,e)=>u(r,typeof t!="symbol"?t+"":t,e);import{ɵ as m,a as g,b as y,c as _,j as N,q as C,p as M,u as v,v as D,s as b,I as i,C as P,f as h,N as j,g as k}from"./core.BqS-lykr.js";import{a as w,b as I}from"./utils.BBpd638g.js";import{C as d}from"./common_module-chunk.DvGwmKFp.js";const S=["*"],p={selected:!1,className:""},o=class o{constructor(){s(this,"cn",w);s(this,"bindControllerProps",I);s(this,"selected",p.selected);s(this,"className",p.className)}};s(o,"ɵfac",function(e){return new(e||o)}),s(o,"ɵcmp",m({type:o,selectors:[["spn-table-body-row"],["table-body-row"]],inputs:{selected:"selected",className:"className"},standalone:!1,ngContentSelectors:S,decls:2,vars:3,template:function(e,l){e&1&&(_(),N(0,"tr"),C(1),M()),e&2&&(v(l.cn("border-b border-border-default transition-colors hover:bg-background-subtle",l.selected?"bg-primary-subtle":"bg-background-default",l.className)),D("data-ctrl",typeof l.bindControllerProps))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=o;(typeof ngDevMode>"u"||ngDevMode)&&b(a,[{type:P,args:[{standalone:!1,selector:"spn-table-body-row, table-body-row",template:`
    <tr
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('border-b border-border-default transition-colors hover:bg-background-subtle', selected ? 'bg-primary-subtle' : 'bg-background-default', className)"
    >
      <ng-content></ng-content>
    </tr>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{selected:[{type:i}],className:[{type:i}]});(typeof ngDevMode>"u"||ngDevMode)&&h(a,{className:"TableBodyRow",filePath:"TableBodyRow.ts",lineNumber:32});const n=class n{};s(n,"ɵfac",function(e){return new(e||n)}),s(n,"ɵmod",g({type:n})),s(n,"ɵinj",y({imports:[d]}));let c=n;(typeof ngDevMode>"u"||ngDevMode)&&b(c,[{type:j,args:[{declarations:[a],imports:[d],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&k(c,{declarations:[a],imports:[d],exports:[a]})})();export{c as TableBodyRowModule,a as default};

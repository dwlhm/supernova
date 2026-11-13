var m=Object.defineProperty;var g=(l,n,e)=>n in l?m(l,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[n]=e;var t=(l,n,e)=>g(l,typeof n!="symbol"?n+"":n,e);import{ɵ as u,a as y,b,c as _,j as N,q as v,p as M,u as x,an as C,v as D,s as f,I as i,C as h,f as P,N as j,g as I}from"./core.vpEFnhB-.js";import{a as F,e as S,d as k}from"./theme.CMj9otVT.js";import{C as d}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const w=["*"],J=()=>({left:"text-left",center:"text-center",right:"text-right"}),p={align:"left",className:""},o=class o{constructor(){t(this,"cn",F);t(this,"cva",S);t(this,"bindControllerProps",k);t(this,"align",p.align);t(this,"className",p.className)}};t(o,"ɵfac",function(e){return new(e||o)}),t(o,"ɵcmp",u({type:o,selectors:[["kd-table-body-cell"],["table-body-cell"]],inputs:{align:"align",className:"className"},standalone:!1,ngContentSelectors:w,decls:2,vars:4,template:function(e,r){e&1&&(_(),N(0,"td"),v(1),M()),e&2&&(x(r.cn("border-t border-border-default px-4 py-3 align-middle text-sm font-normal text-foreground-default",r.cva(r.align,C(3,J),"left"),r.className)),D("data-ctrl",typeof r.bindControllerProps))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=o;(typeof ngDevMode>"u"||ngDevMode)&&f(a,[{type:h,args:[{standalone:!1,selector:"kd-table-body-cell, table-body-cell",template:`
    <td
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('border-t border-border-default px-4 py-3 align-middle text-sm font-normal text-foreground-default', cva(align, {
          left: 'text-left',
          center: 'text-center',
          right: 'text-right'
        }, 'left'), className)"
    >
      <ng-content></ng-content>
    </td>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{align:[{type:i}],className:[{type:i}]});(typeof ngDevMode>"u"||ngDevMode)&&P(a,{className:"TableBodyCell",filePath:"TableBodyCell.ts",lineNumber:36});const s=class s{};t(s,"ɵfac",function(e){return new(e||s)}),t(s,"ɵmod",y({type:s})),t(s,"ɵinj",b({imports:[d]}));let c=s;(typeof ngDevMode>"u"||ngDevMode)&&f(c,[{type:j,args:[{declarations:[a],imports:[d],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&I(c,{declarations:[a],imports:[d],exports:[a]})})();export{c as TableBodyCellModule,a as default};

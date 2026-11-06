var m=Object.defineProperty;var g=(l,t,e)=>t in l?m(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var n=(l,t,e)=>g(l,typeof t!="symbol"?t+"":t,e);import{ɵ as u,a as y,b as _,c as h,j as N,q as M,p as b,u as x,v as C,s as f,I as p,C as v,f as D,N as P,g as j}from"./core.BqS-lykr.js";import{a as I,b as S}from"./utils.BBpd638g.js";import{C as i}from"./common_module-chunk.DvGwmKFp.js";const w=["*"],d={align:"left",className:""},o=class o{constructor(){n(this,"cn",I);n(this,"bindControllerProps",S);n(this,"align",d.align);n(this,"className",d.className)}};n(o,"ɵfac",function(e){return new(e||o)}),n(o,"ɵcmp",u({type:o,selectors:[["spn-table-header-cell"],["table-header-cell"]],inputs:{align:"align",className:"className"},standalone:!1,ngContentSelectors:w,decls:2,vars:3,consts:[["scope","col"]],template:function(e,r){e&1&&(h(),N(0,"th",0),M(1),b()),e&2&&(x(r.cn("px-4 py-3 text-sm font-medium text-foreground-muted",r.align==="center"?"text-center":r.align==="right"?"text-right":"text-left",r.className)),C("data-ctrl",typeof r.bindControllerProps))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=o;(typeof ngDevMode>"u"||ngDevMode)&&f(s,[{type:v,args:[{standalone:!1,selector:"spn-table-header-cell, table-header-cell",template:`
    <th
      scope="col"
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('px-4 py-3 text-sm font-medium text-foreground-muted', align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left', className)"
    >
      <ng-content></ng-content>
    </th>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{align:[{type:p}],className:[{type:p}]});(typeof ngDevMode>"u"||ngDevMode)&&D(s,{className:"TableHeaderCell",filePath:"TableHeaderCell.ts",lineNumber:33});const a=class a{};n(a,"ɵfac",function(e){return new(e||a)}),n(a,"ɵmod",y({type:a})),n(a,"ɵinj",_({imports:[i]}));let c=a;(typeof ngDevMode>"u"||ngDevMode)&&f(c,[{type:P,args:[{declarations:[s],imports:[i],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&j(c,{declarations:[s],imports:[i],exports:[s]})})();export{c as TableHeaderCellModule,s as default};

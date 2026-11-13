var m=Object.defineProperty;var u=(i,t,e)=>t in i?m(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var a=(i,t,e)=>u(i,typeof t!="symbol"?t+"":t,e);import{ɵ as v,a as g,b as h,z as y,u as N,an as _,v as M,s as f,I as d,C as b,f as C,N as w,g as z}from"./core.vpEFnhB-.js";import{a as D,e as k}from"./theme.CecfD-Na.js";import{C as c}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const I=()=>({horizontal:"h-px w-full",vertical:"h-full min-h-6 w-px self-stretch"}),p={orientation:"horizontal",className:""},o=class o{constructor(){a(this,"cn",D);a(this,"cva",k);a(this,"orientation",p.orientation);a(this,"className",p.className)}};a(o,"ɵfac",function(e){return new(e||o)}),a(o,"ɵcmp",v({type:o,selectors:[["kd-divider"],["divider"]],inputs:{orientation:"orientation",className:"className"},standalone:!1,decls:1,vars:4,consts:[["role","separator"]],template:function(e,r){e&1&&y(0,"div",0),e&2&&(N(r.cn("shrink-0 bg-border-default",r.cva(r.orientation,_(3,I),"horizontal"),r.className)),M("aria-orientation",r.orientation))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=o;(typeof ngDevMode>"u"||ngDevMode)&&f(n,[{type:b,args:[{standalone:!1,selector:"kd-divider, divider",template:`
    <div
      role="separator"
      [attr.aria-orientation]="orientation"
      [class]="cn('shrink-0 bg-border-default', cva(orientation, {
          horizontal: 'h-px w-full',
          vertical: 'h-full min-h-6 w-px self-stretch'
        }, 'horizontal'), className)"
    ></div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{orientation:[{type:d}],className:[{type:d}]});(typeof ngDevMode>"u"||ngDevMode)&&C(n,{className:"Divider",filePath:"Divider.ts",lineNumber:34});const s=class s{};a(s,"ɵfac",function(e){return new(e||s)}),a(s,"ɵmod",g({type:s})),a(s,"ɵinj",h({imports:[c]}));let l=s;(typeof ngDevMode>"u"||ngDevMode)&&f(l,[{type:w,args:[{declarations:[n],imports:[c],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&z(l,{declarations:[n],imports:[c],exports:[n]})})();export{l as DividerModule,n as default};

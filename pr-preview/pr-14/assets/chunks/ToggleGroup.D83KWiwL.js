var u=Object.defineProperty;var f=(l,s,a)=>s in l?u(l,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):l[s]=a;var e=(l,s,a)=>f(l,typeof s!="symbol"?s+"":s,a);import{ɵ as g,a as b,b as y,c as _,j as v,q as N,p as h,u as C,w as z,v as M,s as p,I as d,C as w,f as D,N as L,g as j}from"./core.BqS-lykr.js";import{a as P,d as I,b as F}from"./utils.BBpd638g.js";import{C as m}from"./common_module-chunk.DvGwmKFp.js";const S=["*"],k=()=>({small:"min-h-5",medium:"min-h-6",large:"min-h-9"}),c={size:"medium",ariaLabel:"Toggle group",className:""},r=class r{constructor(){e(this,"cn",P);e(this,"cva",I);e(this,"bindControllerProps",F);e(this,"size",c.size);e(this,"ariaLabel",c.ariaLabel);e(this,"className",c.className)}};e(r,"ɵfac",function(a){return new(a||r)}),e(r,"ɵcmp",g({type:r,selectors:[["spn-toggle-group"],["toggle-group"]],inputs:{size:"size",ariaLabel:"ariaLabel",className:"className"},standalone:!1,ngContentSelectors:S,decls:2,vars:6,consts:[["role","group"]],template:function(a,n){a&1&&(_(),v(0,"div",0),N(1),h()),a&2&&(C(n.cn("inline-flex flex-row justify-start items-start overflow-hidden rounded-lg border border-border-default bg-background-default shadow-sm",n.cva(n.size,z(5,k),"medium"),n.className)),M("data-ctrl",typeof n.bindControllerProps)("data-size",n.size)("aria-label",n.ariaLabel))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let t=r;(typeof ngDevMode>"u"||ngDevMode)&&p(t,[{type:w,args:[{standalone:!1,selector:"spn-toggle-group, toggle-group",template:`
    <div
      role="group"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.data-size]="size"
      [attr.aria-label]="ariaLabel"
      [class]="cn('inline-flex flex-row justify-start items-start overflow-hidden rounded-lg border border-border-default bg-background-default shadow-sm', cva(size, {
          small: 'min-h-5',
          medium: 'min-h-6',
          large: 'min-h-9'
        }, 'medium'), className)"
    >
      <ng-content></ng-content>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{size:[{type:d}],ariaLabel:[{type:d}],className:[{type:d}]});(typeof ngDevMode>"u"||ngDevMode)&&D(t,{className:"ToggleGroup",filePath:"ToggleGroup.ts",lineNumber:44});const o=class o{};e(o,"ɵfac",function(a){return new(a||o)}),e(o,"ɵmod",b({type:o})),e(o,"ɵinj",y({imports:[m]}));let i=o;(typeof ngDevMode>"u"||ngDevMode)&&p(i,[{type:L,args:[{declarations:[t],imports:[m],exports:[t]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&j(i,{declarations:[t],imports:[m],exports:[t]})})();export{i as ToggleGroupModule,t as default};

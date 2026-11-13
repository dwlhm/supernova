var b=Object.defineProperty;var f=(l,a,t)=>a in l?b(l,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[a]=t;var e=(l,a,t)=>f(l,typeof a!="symbol"?a+"":a,t);import{ɵ as g,a as _,b as y,c as h,j as v,k as w,q as N,p as C,u as M,an as z,v as D,s as p,I as i,C as k,f as L,N as j,g as P}from"./core.vpEFnhB-.js";import{a as I,e as K,M as F,d as G}from"./theme.CecfD-Na.js";import{C as c}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const S=["*"],J=()=>({small:"min-h-5",medium:"min-h-6",large:"min-h-9"}),u={size:"medium",ariaLabel:"Toggle group",className:""},r=class r{constructor(){e(this,"cn",I);e(this,"cva",K);e(this,"handleGroupKeyDown",F);e(this,"bindControllerProps",G);e(this,"size",u.size);e(this,"ariaLabel",u.ariaLabel);e(this,"className",u.className)}};e(r,"ɵfac",function(t){return new(t||r)}),e(r,"ɵcmp",g({type:r,selectors:[["kd-toggle-group"],["toggle-group"]],inputs:{size:"size",ariaLabel:"ariaLabel",className:"className"},standalone:!1,ngContentSelectors:S,decls:2,vars:6,consts:[["role","group",3,"keydown"]],template:function(t,o){t&1&&(h(),v(0,"div",0),w("keydown",function(m){return o.handleGroupKeyDown(m)}),N(1),C()),t&2&&(M(o.cn("inline-flex flex-row justify-start items-start overflow-hidden rounded-lg border border-border-default bg-background-default shadow-sm [&_button]:rounded-none [&_button]:shadow-none [&>button:not(:last-child)]:border-r [&>button:not(:last-child)]:border-border-default [&>*:not(:last-child)>button]:border-r [&>*:not(:last-child)>button]:border-border-default",o.cva(o.size,z(5,J),"medium"),o.className)),D("data-ctrl",typeof o.bindControllerProps)("data-size",o.size)("aria-label",o.ariaLabel))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=r;(typeof ngDevMode>"u"||ngDevMode)&&p(n,[{type:k,args:[{standalone:!1,selector:"kd-toggle-group, toggle-group",template:`
    <div
      role="group"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.data-size]="size"
      [attr.aria-label]="ariaLabel"
      (keydown)="handleGroupKeyDown($event)"
      [class]="cn('inline-flex flex-row justify-start items-start overflow-hidden rounded-lg border border-border-default bg-background-default shadow-sm [&_button]:rounded-none [&_button]:shadow-none [&>button:not(:last-child)]:border-r [&>button:not(:last-child)]:border-border-default [&>*:not(:last-child)>button]:border-r [&>*:not(:last-child)>button]:border-border-default', cva(size, {
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
    `]}]}],null,{size:[{type:i}],ariaLabel:[{type:i}],className:[{type:i}]});(typeof ngDevMode>"u"||ngDevMode)&&L(n,{className:"ToggleGroup",filePath:"ToggleGroup.ts",lineNumber:45});const s=class s{};e(s,"ɵfac",function(t){return new(t||s)}),e(s,"ɵmod",_({type:s})),e(s,"ɵinj",y({imports:[c]}));let d=s;(typeof ngDevMode>"u"||ngDevMode)&&p(d,[{type:j,args:[{declarations:[n],imports:[c],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&P(d,{declarations:[n],imports:[c],exports:[n]})})();export{d as ToggleGroupModule,n as default};

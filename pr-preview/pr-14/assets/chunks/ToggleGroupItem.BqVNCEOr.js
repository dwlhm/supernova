var g=Object.defineProperty;var m=(i,a,t)=>a in i?g(i,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[a]=t;var e=(i,a,t)=>m(i,typeof a!="symbol"?a+"":a,t);import{E as b,ɵ as f,a as y,b as _,c as h,j as v,k as C,q as x,p as P,u as w,w as N,v as M,s as c,O as k,I as l,C as z,f as D,N as L,g as j}from"./core.BqS-lykr.js";import{a as E,d as F,b as I}from"./utils.BBpd638g.js";import{C as u}from"./common_module-chunk.DvGwmKFp.js";const O=["*"],S=()=>({small:"h-5 min-w-5 px-0.5 py-1 text-xs",medium:"h-6 min-w-6 px-1 py-1 text-xs",large:"h-9 min-w-9 px-2 py-2 text-sm"}),d={size:"medium",pressed:!1,disabled:!1,ariaLabel:"Toggle option",className:""},r=class r{constructor(){e(this,"cn",E);e(this,"cva",F);e(this,"bindControllerProps",I);e(this,"disabled",d.disabled);e(this,"pressed",d.pressed);e(this,"ariaLabel",d.ariaLabel);e(this,"size",d.size);e(this,"className",d.className);e(this,"onPressedChange",new b)}};e(r,"ɵfac",function(t){return new(t||r)}),e(r,"ɵcmp",f({type:r,selectors:[["spn-toggle-group-item"],["toggle-group-item"]],inputs:{disabled:"disabled",pressed:"pressed",ariaLabel:"ariaLabel",size:"size",className:"className"},outputs:{onPressedChange:"onPressedChange"},standalone:!1,ngContentSelectors:O,decls:2,vars:7,consts:[["type","button",3,"click"]],template:function(t,s){t&1&&(h(),v(0,"button",0),C("click",function(){return!s.disabled&&s.onPressedChange&&s.onPressedChange.emit(!s.pressed)}),x(1),P()),t&2&&(w(s.cn("inline-flex flex-row items-center justify-center gap-1 border-l border-border-default first:border-l-0 font-paragraph-weight-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50",s.cva(s.size,N(6,S),"medium"),s.pressed?"bg-background-muted text-foreground-default":"bg-background-default text-foreground-muted hover:bg-background-subtle hover:text-foreground-default",s.className)),M("data-ctrl",typeof s.bindControllerProps)("disabled",s.disabled?"":null)("aria-pressed",s.pressed)("aria-label",s.ariaLabel))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=r;(typeof ngDevMode>"u"||ngDevMode)&&c(n,[{type:z,args:[{standalone:!1,selector:"spn-toggle-group-item, toggle-group-item",template:`
    <button
      type="button"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.disabled]="(disabled) ? '' : null"
      [attr.aria-pressed]="pressed"
      [attr.aria-label]="ariaLabel"
      [class]="cn('inline-flex flex-row items-center justify-center gap-1 border-l border-border-default first:border-l-0 font-paragraph-weight-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50', cva(size, {
          small: 'h-5 min-w-5 px-0.5 py-1 text-xs',
          medium: 'h-6 min-w-6 px-1 py-1 text-xs',
          large: 'h-9 min-w-9 px-2 py-2 text-sm'
        }, 'medium'), pressed ? 'bg-background-muted text-foreground-default' : 'bg-background-default text-foreground-muted hover:bg-background-subtle hover:text-foreground-default', className)"
      (click)="!disabled && onPressedChange && this.onPressedChange.emit(!pressed)"
    >
      <ng-content></ng-content>
    </button>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{disabled:[{type:l}],pressed:[{type:l}],ariaLabel:[{type:l}],size:[{type:l}],className:[{type:l}],onPressedChange:[{type:k}]});(typeof ngDevMode>"u"||ngDevMode)&&D(n,{className:"ToggleGroupItem",filePath:"ToggleGroupItem.ts",lineNumber:52});const o=class o{};e(o,"ɵfac",function(t){return new(t||o)}),e(o,"ɵmod",y({type:o})),e(o,"ɵinj",_({imports:[u]}));let p=o;(typeof ngDevMode>"u"||ngDevMode)&&c(p,[{type:L,args:[{declarations:[n],imports:[u],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&j(p,{declarations:[n],imports:[u],exports:[n]})})();export{p as ToggleGroupItemModule,n as default};

var g=Object.defineProperty;var x=(d,n,o)=>n in d?g(d,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):d[n]=o;var t=(d,n,o)=>x(d,typeof n!="symbol"?n+"":n,o);import{E as m,ɵ as y,a as _,b as h,c as M,j as w,k as N,q as L,p as S,u as E,an as f,e as C,v as D,s as v,O as u,I as a,C as k,f as j,N as I,g as F}from"./core.vpEFnhB-.js";import{a as O,e as P}from"./theme.CecfD-Na.js";import{C as c,c as T}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const z=["*"],J=()=>({"top-left":"top-4 left-4 flex-col items-start","top-center":"top-4 left-1/2 -translate-x-1/2 flex-col items-center","top-right":"top-4 right-4 flex-col items-end","bottom-left":"bottom-4 left-4 flex-col-reverse items-start","bottom-center":"bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse items-center","bottom-right":"bottom-4 right-4 flex-col-reverse items-end"}),q=()=>({"top-left":"flex-col items-start","top-center":"flex-col items-center","top-right":"flex-col items-end","bottom-left":"flex-col-reverse items-start","bottom-center":"flex-col-reverse items-center","bottom-right":"flex-col-reverse items-end"}),r={placement:"top-right",inline:!1,expanded:!1,scrollable:!0,ariaLabel:"Notifications",className:""},i=class i{constructor(){t(this,"cn",O);t(this,"cva",P);t(this,"id");t(this,"ariaLabel",r.ariaLabel);t(this,"placement",r.placement);t(this,"expanded",r.expanded);t(this,"inlineStyle");t(this,"scrollable",r.scrollable);t(this,"inline",r.inline);t(this,"className",r.className);t(this,"onMouseEnter",new m);t(this,"onMouseLeave",new m)}};t(i,"ɵfac",function(o){return new(o||i)}),t(i,"ɵcmp",y({type:i,selectors:[["kd-toast-viewport"],["toast-viewport"]],inputs:{id:"id",ariaLabel:"ariaLabel",placement:"placement",expanded:"expanded",inlineStyle:"inlineStyle",scrollable:"scrollable",inline:"inline",className:"className"},outputs:{onMouseEnter:"onMouseEnter",onMouseLeave:"onMouseLeave"},standalone:!1,ngContentSelectors:z,decls:2,vars:9,consts:[["role","region","aria-live","polite",3,"mouseenter","mouseleave","ngStyle"]],template:function(o,e){o&1&&(M(),w(0,"div",0),N("mouseenter",function(){return e.onMouseEnter&&e.onMouseEnter.emit()})("mouseleave",function(){return e.onMouseLeave&&e.onMouseLeave.emit()}),L(1),S()),o&2&&(E(e.cn("flex w-full max-w-md gap-2.5 transition-all duration-200 ease-out",e.expanded?"rounded-2xl border border-border-default bg-background-default/95 p-3 shadow-xl backdrop-blur-md pointer-events-auto":"border-transparent bg-transparent p-0 shadow-none pointer-events-none [&>*]:pointer-events-auto",e.expanded&&e.scrollable?"max-h-[calc(100vh-2.5rem)] overflow-y-auto overflow-x-hidden overscroll-contain":"overflow-visible",e.inline?"relative":"fixed z-50",!e.inline&&e.cva(e.placement,f(7,J),"top-right"),e.inline&&e.cva(e.placement,f(8,q),"top-right"),e.className)),C("ngStyle",e.inlineStyle),D("id",e.id||void 0)("aria-label",e.ariaLabel||"Notifications")("data-placement",e.placement||"top-right")("data-expanded",e.expanded?"true":"false"))},dependencies:[T],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let l=i;(typeof ngDevMode>"u"||ngDevMode)&&v(l,[{type:k,args:[{standalone:!1,selector:"kd-toast-viewport, toast-viewport",template:`
    <div
      role="region"
      aria-live="polite"
      [attr.id]="id || undefined"
      [attr.aria-label]="ariaLabel || 'Notifications'"
      [attr.data-placement]="placement || 'top-right'"
      [attr.data-expanded]="expanded ? 'true' : 'false'"
      [ngStyle]="inlineStyle"
      (mouseenter)="onMouseEnter && this.onMouseEnter.emit()"
      (mouseleave)="onMouseLeave && this.onMouseLeave.emit()"
      [class]="cn('flex w-full max-w-md gap-2.5 transition-all duration-200 ease-out', expanded ? 'rounded-2xl border border-border-default bg-background-default/95 p-3 shadow-xl backdrop-blur-md pointer-events-auto' : 'border-transparent bg-transparent p-0 shadow-none pointer-events-none [&>*]:pointer-events-auto', expanded && scrollable ? 'max-h-[calc(100vh-2.5rem)] overflow-y-auto overflow-x-hidden overscroll-contain' : 'overflow-visible', inline ? 'relative' : 'fixed z-50', !inline && cva(placement, {
          'top-left': 'top-4 left-4 flex-col items-start',
          'top-center': 'top-4 left-1/2 -translate-x-1/2 flex-col items-center',
          'top-right': 'top-4 right-4 flex-col items-end',
          'bottom-left': 'bottom-4 left-4 flex-col-reverse items-start',
          'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse items-center',
          'bottom-right': 'bottom-4 right-4 flex-col-reverse items-end'
        }, 'top-right'), inline && cva(placement, {
          'top-left': 'flex-col items-start',
          'top-center': 'flex-col items-center',
          'top-right': 'flex-col items-end',
          'bottom-left': 'flex-col-reverse items-start',
          'bottom-center': 'flex-col-reverse items-center',
          'bottom-right': 'flex-col-reverse items-end'
        }, 'top-right'), className)"
    >
      <ng-content></ng-content>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{id:[{type:a}],ariaLabel:[{type:a}],placement:[{type:a}],expanded:[{type:a}],inlineStyle:[{type:a}],scrollable:[{type:a}],inline:[{type:a}],className:[{type:a}],onMouseEnter:[{type:u}],onMouseLeave:[{type:u}]});(typeof ngDevMode>"u"||ngDevMode)&&j(l,{className:"ToastViewport",filePath:"ToastViewport.ts",lineNumber:75});const s=class s{};t(s,"ɵfac",function(o){return new(o||s)}),t(s,"ɵmod",_({type:s})),t(s,"ɵinj",h({imports:[c]}));let p=s;(typeof ngDevMode>"u"||ngDevMode)&&v(p,[{type:I,args:[{declarations:[l],imports:[c],exports:[l]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&F(p,{declarations:[l],imports:[c],exports:[l]})})();export{p as ToastViewportModule,l as default};

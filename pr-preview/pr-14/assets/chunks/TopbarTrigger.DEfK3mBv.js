var v=Object.defineProperty;var k=(a,e,n)=>e in a?v(a,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):a[e]=n;var t=(a,e,n)=>k(a,typeof e!="symbol"?e+"":e,n);import{E as h,ɵ as w,a as N,b as M,c as x,j as f,k as I,d as p,q as T,p as _,u as D,v as L,t as u,e as g,s as m,O as j,I as l,C as O,f as P,N as E,g as S,i as y,r as C,m as B,y as F,z as J,A as q}from"./core.vpEFnhB-.js";import{a as z,d as A}from"./theme.CecfD-Na.js";import{C as b,N as G,a as V}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const H=[[["","icon",""],["","slot","icon"]]],K=["[icon],[slot=icon]"];function Q(a,e){a&1&&q(0)}function R(a,e){if(a&1&&(y(0),p(1,Q,1,0,"ng-container",2),C()),a&2){const n=B();u(),g("ngComponentOutlet",n.icon)}}function U(a,e){a&1&&(y(0),F(),f(1,"svg",3),J(2,"rect",4)(3,"path",5),_(),C())}const d={ariaLabel:"Toggle sidebar",disabled:!1,className:""},r=class r{constructor(){t(this,"cn",z);t(this,"bindControllerProps",A);t(this,"disabled",d.disabled);t(this,"ariaLabel",d.ariaLabel);t(this,"className",d.className);t(this,"icon");t(this,"onClick",new h)}};t(r,"ɵfac",function(n){return new(n||r)}),t(r,"ɵcmp",w({type:r,selectors:[["kd-topbar-trigger"],["topbar-trigger"]],inputs:{disabled:"disabled",ariaLabel:"ariaLabel",className:"className",icon:"icon"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:K,decls:4,vars:8,consts:[["type","button",3,"click"],[4,"ngIf"],[4,"ngComponentOutlet"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4"],["x","3","y","4","width","18","height","16","rx","2"],["d","M9 4v16","stroke-linecap","round"]],template:function(n,o){n&1&&(x(H),f(0,"button",0),I("click",function(){return!o.disabled&&o.onClick&&o.onClick.emit()}),p(1,R,2,1,"ng-container",1),T(2),p(3,U,4,0,"ng-container",1),_()),n&2&&(D(o.cn("inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md px-2 text-foreground-default select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed",o.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer hover:bg-background-muted active:bg-background-interactive active:scale-[0.97]",o.className)),L("disabled",o.disabled?"":null)("aria-disabled",o.disabled)("aria-label",o.ariaLabel)("data-ctrl",typeof o.bindControllerProps),u(),g("ngIf",o.icon),u(2),g("ngIf",!o.icon))},dependencies:[G,V],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let i=r;(typeof ngDevMode>"u"||ngDevMode)&&m(i,[{type:O,args:[{standalone:!1,selector:"kd-topbar-trigger, topbar-trigger",template:`
    <button
      type="button"
      [attr.disabled]="(disabled) ? '' : null"
      [attr.aria-disabled]="disabled"
      [attr.aria-label]="ariaLabel"
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md px-2 text-foreground-default select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-background-muted active:bg-background-interactive active:scale-[0.97]', className)"
      (click)="!disabled && onClick && this.onClick.emit()"
    >
      <ng-container *ngIf="icon"><ng-container *ngComponentOutlet="icon"></ng-container></ng-container><ng-content select="[icon],[slot=icon]"></ng-content>
      <ng-container *ngIf="!icon"
        ><svg
          aria-hidden="true"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <rect x="3" y="4" width="18" height="16" rx="2"></rect>
          <path d="M9 4v16" stroke-linecap="round"></path></svg
      ></ng-container>
    </button>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{disabled:[{type:l}],ariaLabel:[{type:l}],className:[{type:l}],icon:[{type:l}],onClick:[{type:j}]});(typeof ngDevMode>"u"||ngDevMode)&&P(i,{className:"TopbarTrigger",filePath:"TopbarTrigger.ts",lineNumber:56});const s=class s{};t(s,"ɵfac",function(n){return new(n||s)}),t(s,"ɵmod",N({type:s})),t(s,"ɵinj",M({imports:[b]}));let c=s;(typeof ngDevMode>"u"||ngDevMode)&&m(c,[{type:E,args:[{declarations:[i],imports:[b],exports:[i]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&S(c,{declarations:[i],imports:[b],exports:[i]})})();export{c as TopbarTriggerModule,i as default};

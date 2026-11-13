var O=Object.defineProperty;var T=(n,a,t)=>a in n?O(n,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[a]=t;var o=(n,a,t)=>T(n,typeof a!="symbol"?a+"":a,t);import{E as M,ɵ as S,a as j,b as R,c as z,j as v,k as P,d,q as m,p as _,u as B,ar as D,an as A,v as y,t as s,e as g,s as w,O as H,I as r,C as E,f as F,N as J,g as q,i as f,r as b,m as h,y as C,z as x,A as N}from"./core.vpEFnhB-.js";import{a as G,e as V,I as K}from"./theme.CecfD-Na.js";import{C as I,N as Q,a as U}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const W=[[["","leftIcon",""],["","slot","lefticon"]],"*",[["","rightIcon",""],["","slot","righticon"]]],X=["[leftIcon],[slot=leftIcon]","*","[rightIcon],[slot=rightIcon]"],Y=(n,a,t,e,k,L)=>({primary:n,secondary:a,outline:t,ghost:e,destructive:k,link:L}),Z=()=>({large:"h-10 px-6 text-base gap-2",regular:"h-9 px-4 text-sm gap-2",small:"h-8 px-3 text-sm gap-1.5",mini:"h-6 px-2 text-xs gap-1.5"});function $(n,a){n&1&&N(0)}function ee(n,a){if(n&1&&(f(0),d(1,$,1,0,"ng-container",2),b()),n&2){const t=h();s(),g("ngComponentOutlet",t.leftIcon)}}function ne(n,a){if(n&1&&(f(0),C(),v(1,"svg",3),x(2,"path",4),_(),b()),n&2){const t=h();s(2),y("d",t.ICON_PATHS.plus)}}function te(n,a){n&1&&N(0)}function oe(n,a){if(n&1&&(f(0),d(1,te,1,0,"ng-container",2),b()),n&2){const t=h();s(),g("ngComponentOutlet",t.rightIcon)}}function ae(n,a){if(n&1&&(f(0),C(),v(1,"svg",3),x(2,"path",4),_(),b()),n&2){const t=h();s(2),y("d",t.ICON_PATHS.arrowRight)}}const i={type:"button",variant:"primary",size:"regular",roundness:"default",disabled:!1,showLeftIcon:!1,showRightIcon:!1,ariaLabel:"",className:""},u=class u{constructor(){o(this,"cn",G);o(this,"cva",V);o(this,"ICON_PATHS",K);o(this,"type",i.type);o(this,"disabled",i.disabled);o(this,"ariaLabel",i.ariaLabel);o(this,"variant",i.variant);o(this,"size",i.size);o(this,"roundness",i.roundness);o(this,"className",i.className);o(this,"leftIcon");o(this,"showLeftIcon",i.showLeftIcon);o(this,"rightIcon");o(this,"showRightIcon",i.showRightIcon);o(this,"onClick",new M)}};o(u,"ɵfac",function(t){return new(t||u)}),o(u,"ɵcmp",S({type:u,selectors:[["kd-button"]],inputs:{type:"type",disabled:"disabled",ariaLabel:"ariaLabel",variant:"variant",size:"size",roundness:"roundness",className:"className",leftIcon:"leftIcon",showLeftIcon:"showLeftIcon",rightIcon:"rightIcon",showRightIcon:"showRightIcon"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:X,decls:8,vars:18,consts:[[3,"click"],[4,"ngIf"],[4,"ngComponentOutlet"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4","shrink-0"],["stroke-linecap","round","stroke-linejoin","round"]],template:function(t,e){t&1&&(z(W),v(0,"button",0),P("click",function(){return!e.disabled&&e.onClick&&e.onClick.emit()}),d(1,ee,2,1,"ng-container",1),m(2),d(3,ne,3,1,"ng-container",1),m(4,1),d(5,oe,2,1,"ng-container",1),m(6,2),d(7,ae,3,1,"ng-container",1),_()),t&2&&(B(e.cn("inline-flex items-center justify-center font-medium select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed",e.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer active:scale-[0.97]",e.cva(e.variant,D(10,Y,e.cn("bg-primary-default text-primary-foreground shadow-xs",!e.disabled&&"hover:bg-primary-hover active:bg-primary-pressed"),e.cn("bg-secondary-default text-secondary-foreground shadow-xs focus-visible:bg-secondary-hover",!e.disabled&&"hover:bg-secondary-hover active:bg-background-interactive"),e.cn("border border-border-default bg-background-default text-foreground-default shadow-xs focus-visible:border-primary-border-emphasis",!e.disabled&&"hover:bg-background-muted active:bg-background-interactive"),e.cn("bg-ghost-default text-foreground-default",!e.disabled&&"hover:bg-ghost-hover active:bg-background-interactive"),e.cn("bg-destructive-background text-primary-foreground shadow-xs focus-visible:ring-focus-ring-error",!e.disabled&&"hover:bg-destructive-hover active:bg-destructive-pressed"),e.cn("bg-ghost-default text-primary-muted underline-offset-4",!e.disabled&&"hover:underline hover:text-primary-on-surface active:text-primary-pressed")),"primary"),e.cva(e.size,A(17,Z),"regular"),e.roundness==="round"?"rounded-full":"rounded-lg",e.className)),y("type",e.type||"button")("disabled",e.disabled?"":null)("aria-disabled",e.disabled)("aria-label",e.ariaLabel||void 0),s(),g("ngIf",e.leftIcon),s(2),g("ngIf",e.showLeftIcon&&!e.leftIcon),s(2),g("ngIf",e.rightIcon),s(2),g("ngIf",e.showRightIcon&&!e.rightIcon))},dependencies:[Q,U],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let c=u;(typeof ngDevMode>"u"||ngDevMode)&&w(c,[{type:E,args:[{standalone:!1,selector:"kd-button",template:`
    <button
      [attr.type]="type || 'button'"
      [attr.disabled]="(disabled) ? '' : null"
      [attr.aria-disabled]="disabled"
      [attr.aria-label]="ariaLabel || undefined"
      [class]="cn('inline-flex items-center justify-center font-medium select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.97]', cva(variant, {
          primary: cn('bg-primary-default text-primary-foreground shadow-xs', !disabled && 'hover:bg-primary-hover active:bg-primary-pressed'),
          secondary: cn('bg-secondary-default text-secondary-foreground shadow-xs focus-visible:bg-secondary-hover', !disabled && 'hover:bg-secondary-hover active:bg-background-interactive'),
          outline: cn('border border-border-default bg-background-default text-foreground-default shadow-xs focus-visible:border-primary-border-emphasis', !disabled && 'hover:bg-background-muted active:bg-background-interactive'),
          ghost: cn('bg-ghost-default text-foreground-default', !disabled && 'hover:bg-ghost-hover active:bg-background-interactive'),
          destructive: cn('bg-destructive-background text-primary-foreground shadow-xs focus-visible:ring-focus-ring-error', !disabled && 'hover:bg-destructive-hover active:bg-destructive-pressed'),
          link: cn('bg-ghost-default text-primary-muted underline-offset-4', !disabled && 'hover:underline hover:text-primary-on-surface active:text-primary-pressed')
        }, 'primary'), cva(size, {
          large: 'h-10 px-6 text-base gap-2',
          regular: 'h-9 px-4 text-sm gap-2',
          small: 'h-8 px-3 text-sm gap-1.5',
          mini: 'h-6 px-2 text-xs gap-1.5'
        }, 'regular'), roundness === 'round' ? 'rounded-full' : 'rounded-lg', className)"
      (click)="!disabled && onClick && this.onClick.emit()"
    >
      <ng-container *ngIf="leftIcon"><ng-container *ngComponentOutlet="leftIcon"></ng-container></ng-container><ng-content select="[leftIcon],[slot=leftIcon]"></ng-content>
      <ng-container *ngIf="showLeftIcon && !leftIcon"
        ><svg
          aria-hidden="true"
          class="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            [attr.d]="ICON_PATHS.plus"
          ></path></svg
      ></ng-container>
      <ng-content></ng-content>
      <ng-container *ngIf="rightIcon"><ng-container *ngComponentOutlet="rightIcon"></ng-container></ng-container><ng-content select="[rightIcon],[slot=rightIcon]"></ng-content>
      <ng-container *ngIf="showRightIcon && !rightIcon"
        ><svg
          aria-hidden="true"
          class="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            [attr.d]="ICON_PATHS.arrowRight"
          ></path></svg
      ></ng-container>
    </button>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{type:[{type:r}],disabled:[{type:r}],ariaLabel:[{type:r}],variant:[{type:r}],size:[{type:r}],roundness:[{type:r}],className:[{type:r}],leftIcon:[{type:r}],showLeftIcon:[{type:r}],rightIcon:[{type:r}],showRightIcon:[{type:r}],onClick:[{type:H}]});(typeof ngDevMode>"u"||ngDevMode)&&F(c,{className:"Button",filePath:"Button.ts",lineNumber:107});const l=class l{};o(l,"ɵfac",function(t){return new(t||l)}),o(l,"ɵmod",j({type:l})),o(l,"ɵinj",R({imports:[I]}));let p=l;(typeof ngDevMode>"u"||ngDevMode)&&w(p,[{type:J,args:[{declarations:[c],imports:[I],exports:[c]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&q(p,{declarations:[c],imports:[I],exports:[c]})})();export{p as ButtonModule,c as default};

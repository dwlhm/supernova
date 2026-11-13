var x=Object.defineProperty;var z=(t,o,n)=>o in t?x(t,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[o]=n;var a=(t,o,n)=>z(t,typeof o!="symbol"?o+"":o,n);import{E as N,ɵ as A,a as M,b as O,c as T,j as _,k as S,d as u,p as y,u as w,at as D,an as b,v as k,t as c,e as p,s as C,O as F,I as i,C as L,f as j,N as P,g as B,i as f,q as I,r as m,m as h,y as E,z as H,A as J}from"./core.vpEFnhB-.js";import{a as q,e as G,I as V}from"./theme.CecfD-Na.js";import{C as v,N as K,a as Q}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const R=[[["","icon",""],["","slot","icon"]],"*"],U=["[icon],[slot=icon]","*"],W=(t,o,n)=>({primary:t,secondary:o,outline:n}),X=()=>({small:"h-10 w-10",regular:"h-14 w-14",large:"h-24 w-24",extended:"h-10 w-auto gap-3 px-4 py-2"}),Y=()=>({inline:"","top-left":"fixed top-4 left-4 z-40","top-center":"fixed top-4 left-1/2 z-40 -translate-x-1/2","top-right":"fixed top-4 right-4 z-40","bottom-left":"fixed bottom-4 left-4 z-40","bottom-center":"fixed bottom-4 left-1/2 z-40 -translate-x-1/2","bottom-right":"fixed bottom-4 right-4 z-40"}),Z=()=>({small:"h-4 w-4",regular:"h-5 w-5",large:"h-7 w-7",extended:"h-5 w-5"});function $(t,o){t&1&&J(0)}function ee(t,o){if(t&1&&(f(0),u(1,$,1,0,"ng-container",2),m()),t&2){const n=h(2);c(),p("ngComponentOutlet",n.icon)}}function ne(t,o){if(t&1&&(f(0),E(),_(1,"svg",3),H(2,"path",4),y(),m()),t&2){const n=h(2);c(),w(n.cn("shrink-0",n.cva(n.size,b(3,Z),"small"))),c(),k("d",n.ICON_PATHS.plus)}}function te(t,o){if(t&1&&(f(0),u(1,ee,2,1,"ng-container",1),I(2),u(3,ne,3,4,"ng-container",1),m()),t&2){const n=h();c(),p("ngIf",n.icon),c(2),p("ngIf",!n.icon)}}function ae(t,o){t&1&&(f(0),_(1,"span",5),I(2,1),y(),m())}const r={type:"button",variant:"primary",size:"small",placement:"inline",disabled:!1,showIcon:!0,ariaLabel:"Action",className:""},d=class d{constructor(){a(this,"cn",q);a(this,"cva",G);a(this,"ICON_PATHS",V);a(this,"type",r.type);a(this,"ariaLabel",r.ariaLabel);a(this,"disabled",r.disabled);a(this,"variant",r.variant);a(this,"size",r.size);a(this,"placement",r.placement);a(this,"className",r.className);a(this,"showIcon",r.showIcon);a(this,"icon");a(this,"onClick",new N)}};a(d,"ɵfac",function(n){return new(n||d)}),a(d,"ɵcmp",A({type:d,selectors:[["kd-fab"],["fab"]],inputs:{type:"type",ariaLabel:"ariaLabel",disabled:"disabled",variant:"variant",size:"size",placement:"placement",className:"className",showIcon:"showIcon",icon:"icon"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:U,decls:3,vars:14,consts:[[3,"click"],[4,"ngIf"],[4,"ngComponentOutlet"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["stroke-linecap","round"],[1,"truncate","text-sm","font-medium"]],template:function(n,e){n&1&&(T(R),_(0,"button",0),S("click",function(){return!e.disabled&&e.onClick&&e.onClick.emit()}),u(1,te,4,2,"ng-container",1)(2,ae,3,0,"ng-container",1),y()),n&2&&(w(e.cn("inline-flex shrink-0 items-center justify-center rounded-full select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed",e.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer shadow-md active:scale-[0.97]",e.cva(e.variant,D(8,W,e.cn("bg-primary-default text-primary-foreground",!e.disabled&&"hover:bg-primary-hover active:bg-primary-pressed"),e.cn("bg-secondary-default text-secondary-foreground",!e.disabled&&"hover:bg-secondary-hover active:bg-background-interactive"),e.cn("border border-border-default bg-background-default text-foreground-default",!e.disabled&&"hover:bg-background-muted active:bg-background-interactive")),"primary"),e.cva(e.size,b(12,X),"small"),e.cva(e.placement,b(13,Y),"inline"),e.className)),k("type",e.type||"button")("aria-label",e.ariaLabel||"Action")("disabled",e.disabled?"":null)("aria-disabled",e.disabled),c(),p("ngIf",e.showIcon!==!1),c(),p("ngIf",e.size==="extended"))},dependencies:[K,Q],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=d;(typeof ngDevMode>"u"||ngDevMode)&&C(s,[{type:L,args:[{standalone:!1,selector:"kd-fab, fab",template:`
    <button
      [attr.type]="type || 'button'"
      [attr.aria-label]="ariaLabel || 'Action'"
      [attr.disabled]="(disabled) ? '' : null"
      [attr.aria-disabled]="disabled"
      [class]="cn('inline-flex shrink-0 items-center justify-center rounded-full select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-md active:scale-[0.97]', cva(variant, {
          primary: cn('bg-primary-default text-primary-foreground', !disabled && 'hover:bg-primary-hover active:bg-primary-pressed'),
          secondary: cn('bg-secondary-default text-secondary-foreground', !disabled && 'hover:bg-secondary-hover active:bg-background-interactive'),
          outline: cn('border border-border-default bg-background-default text-foreground-default', !disabled && 'hover:bg-background-muted active:bg-background-interactive')
        }, 'primary'), cva(size, {
          small: 'h-10 w-10',
          regular: 'h-14 w-14',
          large: 'h-24 w-24',
          extended: 'h-10 w-auto gap-3 px-4 py-2'
        }, 'small'), cva(placement, {
          inline: '',
          'top-left': 'fixed top-4 left-4 z-40',
          'top-center': 'fixed top-4 left-1/2 z-40 -translate-x-1/2',
          'top-right': 'fixed top-4 right-4 z-40',
          'bottom-left': 'fixed bottom-4 left-4 z-40',
          'bottom-center': 'fixed bottom-4 left-1/2 z-40 -translate-x-1/2',
          'bottom-right': 'fixed bottom-4 right-4 z-40'
        }, 'inline'), className)"
      (click)="!disabled && onClick && this.onClick.emit()"
    >
      <ng-container *ngIf="showIcon !== false"
        ><ng-container *ngIf="icon"><ng-container *ngComponentOutlet="icon"></ng-container></ng-container><ng-content select="[icon],[slot=icon]"></ng-content>
        <ng-container *ngIf="!icon"
          ><svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            [class]="cn('shrink-0', cva(size, {
          small: 'h-4 w-4',
          regular: 'h-5 w-5',
          large: 'h-7 w-7',
          extended: 'h-5 w-5'
        }, 'small'))"
          >
            <path
              stroke-linecap="round"
              [attr.d]="ICON_PATHS.plus"
            ></path></svg></ng-container
      ></ng-container>
      <ng-container *ngIf="size === 'extended'"
        ><span class="truncate text-sm font-medium"
          ><ng-content></ng-content></span
      ></ng-container>
    </button>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{type:[{type:i}],ariaLabel:[{type:i}],disabled:[{type:i}],variant:[{type:i}],size:[{type:i}],placement:[{type:i}],className:[{type:i}],showIcon:[{type:i}],icon:[{type:i}],onClick:[{type:F}]});(typeof ngDevMode>"u"||ngDevMode)&&j(s,{className:"FAB",filePath:"FAB.ts",lineNumber:102});const l=class l{};a(l,"ɵfac",function(n){return new(n||l)}),a(l,"ɵmod",M({type:l})),a(l,"ɵinj",O({imports:[v]}));let g=l;(typeof ngDevMode>"u"||ngDevMode)&&C(g,[{type:P,args:[{declarations:[s],imports:[v],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&B(g,{declarations:[s],imports:[v],exports:[s]})})();export{g as FABModule,s as default};

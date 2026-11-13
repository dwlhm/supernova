var k=Object.defineProperty;var I=(a,o,n)=>o in a?k(a,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):a[o]=n;var t=(a,o,n)=>I(a,typeof o!="symbol"?o+"":o,n);import{E as N,ɵ as x,a as T,b as M,c as O,j as u,k as P,d as p,q as y,p as f,u as S,v as w,t as d,e as m,s as C,O as D,I as s,C as j,f as A,N as E,g as H,i as _,r as b,m as v,y as B,z as F,o as J,ao as q,A as z}from"./core.vpEFnhB-.js";import{a as G,I as V,d as K}from"./theme.CecfD-Na.js";import{C as h,N as L,a as Q}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const R=[[["","icon",""],["","slot","icon"]],"*"],U=["[icon],[slot=icon]","*"];function W(a,o){a&1&&z(0)}function X(a,o){if(a&1&&(_(0),p(1,W,1,0,"ng-container",3),b()),a&2){const n=v();d(),m("ngComponentOutlet",n.icon)}}function Y(a,o){if(a&1&&(_(0),u(1,"span",4),B(),u(2,"svg",5),F(3,"path",6),f()(),b()),a&2){const n=v();d(3),w("d",n.ICON_PATHS.menu)}}function Z(a,o){if(a&1&&(_(0),u(1,"span",7),J(2),f(),b()),a&2){const n=v();d(2),q(n.num)}}const r={active:!1,disabled:!1,state:"default",showIcon:!1,showNum:!1,num:"",className:""},l=class l{constructor(){t(this,"cn",G);t(this,"ICON_PATHS",V);t(this,"bindControllerProps",K);t(this,"disabled",r.disabled);t(this,"active",r.active);t(this,"state",r.state);t(this,"className",r.className);t(this,"icon");t(this,"showIcon",r.showIcon);t(this,"showNum",r.showNum);t(this,"num",r.num);t(this,"onClick",new N)}};t(l,"ɵfac",function(n){return new(n||l)}),t(l,"ɵcmp",x({type:l,selectors:[["kd-tab-item"],["tab-item"]],inputs:{disabled:"disabled",active:"active",state:"state",className:"className",icon:"icon",showIcon:"showIcon",showNum:"showNum",num:"num"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:U,decls:7,vars:10,consts:[["type","button","role","tab",3,"click"],[4,"ngIf"],[1,"truncate"],[4,"ngComponentOutlet"],[1,"flex","shrink-0","items-center","text-foreground-muted"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-3.5","w-3.5"],["stroke-linecap","round"],[1,"inline-flex","shrink-0","items-center","rounded-full","bg-background-muted","px-1.5","py-0.5","text-xs","font-medium","leading-none","text-foreground-muted"]],template:function(n,e){n&1&&(O(R),u(0,"button",0),P("click",function(){return!e.disabled&&e.onClick&&e.onClick.emit()}),p(1,X,2,1,"ng-container",1),y(2),p(3,Y,4,1,"ng-container",1),u(4,"span",2),y(5,1),f(),p(6,Z,3,1,"ng-container",1),f()),n&2&&(S(e.cn("inline-flex h-7 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-sm font-medium select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed",e.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer active:scale-[0.98]",e.active||e.state==="active"?"border border-border-default bg-background-default text-foreground-default shadow-sm":e.cn("text-foreground-muted",!e.disabled&&"hover:text-foreground-default active:bg-background-interactive"),e.className)),w("data-ctrl",typeof e.bindControllerProps)("disabled",e.disabled?"":null)("aria-disabled",e.disabled)("aria-selected",e.active||e.state==="active")("tabIndex",e.active||e.state==="active"?0:-1),d(),m("ngIf",e.icon),d(2),m("ngIf",e.showIcon&&!e.icon),d(3),m("ngIf",e.showNum))},dependencies:[L,Q],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let i=l;(typeof ngDevMode>"u"||ngDevMode)&&C(i,[{type:j,args:[{standalone:!1,selector:"kd-tab-item, tab-item",template:`
    <button
      type="button"
      role="tab"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.disabled]="(disabled) ? '' : null"
      [attr.aria-disabled]="disabled"
      [attr.aria-selected]="active || state === 'active'"
      [attr.tabIndex]="active || state === 'active' ? 0 : -1"
      [class]="cn('inline-flex h-7 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-sm font-medium select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]', active || state === 'active' ? 'border border-border-default bg-background-default text-foreground-default shadow-sm' : cn('text-foreground-muted', !disabled && 'hover:text-foreground-default active:bg-background-interactive'), className)"
      (click)="!disabled && onClick && this.onClick.emit()"
    >
      <ng-container *ngIf="icon"><ng-container *ngComponentOutlet="icon"></ng-container></ng-container><ng-content select="[icon],[slot=icon]"></ng-content>
      <ng-container *ngIf="showIcon && !icon"
        ><span class="flex shrink-0 items-center text-foreground-muted"
          ><svg
            aria-hidden="true"
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              [attr.d]="ICON_PATHS.menu"
            ></path></svg></span
      ></ng-container>
      <span class="truncate"><ng-content></ng-content></span>
      <ng-container *ngIf="showNum"
        ><span
          class="inline-flex shrink-0 items-center rounded-full bg-background-muted px-1.5 py-0.5 text-xs font-medium leading-none text-foreground-muted"
          >{{num}}</span
        ></ng-container
      >
    </button>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{disabled:[{type:s}],active:[{type:s}],state:[{type:s}],className:[{type:s}],icon:[{type:s}],showIcon:[{type:s}],showNum:[{type:s}],num:[{type:s}],onClick:[{type:D}]});(typeof ngDevMode>"u"||ngDevMode)&&A(i,{className:"TabItem",filePath:"TabItem.ts",lineNumber:77});const c=class c{};t(c,"ɵfac",function(n){return new(n||c)}),t(c,"ɵmod",T({type:c})),t(c,"ɵinj",M({imports:[h]}));let g=c;(typeof ngDevMode>"u"||ngDevMode)&&C(g,[{type:E,args:[{declarations:[i],imports:[h],exports:[i]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&H(g,{declarations:[i],imports:[h],exports:[i]})})();export{g as TabItemModule,i as default};

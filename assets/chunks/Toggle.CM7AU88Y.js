var P=Object.defineProperty;var T=(a,s,t)=>s in a?P(a,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[s]=t;var n=(a,s,t)=>T(a,typeof s!="symbol"?s+"":s,t);import{E as y,ɵ as z,a as M,b as O,c as S,j as m,k as D,d as u,q as C,i as _,p as g,r as h,u as x,an as f,v as k,t as c,e as b,s as I,O as v,I as o,C as L,f as j,N as A,g as E,m as N,y as H,z as F,A as B}from"./core.vpEFnhB-.js";import{a as J,e as q,I as G,d as V}from"./theme.CMj9otVT.js";import{C as w,N as K,a as Q}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const R=[[["","icon",""],["","slot","icon"]],"*"],U=["[icon],[slot=icon]","*"],W=()=>({small:"min-w-5 h-5 px-2 py-1 gap-1.5 text-xs",medium:"min-w-6 h-6 px-3 py-1.5 gap-2 text-sm",large:"min-w-9 h-9 px-4 py-2 gap-2.5 text-base"}),X=()=>({small:"min-w-5 h-5 px-1.5 py-0.5 gap-1 text-xs",medium:"min-w-6 h-6 px-2 py-1 gap-1 text-sm",large:"min-w-9 h-9 px-3 py-1.5 gap-1 text-base"}),Y=()=>({small:"h-3 w-3",medium:"h-4 w-4",large:"h-5 w-5"});function Z(a,s){a&1&&B(0)}function $(a,s){if(a&1&&(_(0),u(1,Z,1,0,"ng-container",3),h()),a&2){const t=N();c(),b("ngComponentOutlet",t.icon)}}function ee(a,s){if(a&1&&(_(0),H(),m(1,"svg",4),F(2,"path",5),g(),h()),a&2){const t=N();c(),x(t.cn("shrink-0",t.cva(t.size,f(3,Y),"medium"))),c(),k("d",t.ICON_PATHS.plus)}}const r={pressed:!1,disabled:!1,size:"medium",showText:!1,showIcon:!1,className:"",ariaLabel:""},d=class d{constructor(){n(this,"cn",J);n(this,"cva",q);n(this,"ICON_PATHS",G);n(this,"bindControllerProps",V);n(this,"pressed",r.pressed);n(this,"disabled",r.disabled);n(this,"ariaLabel",r.ariaLabel);n(this,"showText",r.showText);n(this,"size",r.size);n(this,"className",r.className);n(this,"icon");n(this,"showIcon",r.showIcon);n(this,"onPressedChange",new y);n(this,"onClick",new y)}};n(d,"ɵfac",function(t){return new(t||d)}),n(d,"ɵcmp",z({type:d,selectors:[["kd-toggle"],["toggle"]],inputs:{pressed:"pressed",disabled:"disabled",ariaLabel:"ariaLabel",showText:"showText",size:"size",className:"className",icon:"icon",showIcon:"showIcon"},outputs:{onPressedChange:"onPressedChange",onClick:"onClick"},standalone:!1,ngContentSelectors:U,decls:7,vars:11,consts:[["type","button",3,"click"],[4,"ngIf"],[1,"truncate","font-medium"],[4,"ngComponentOutlet"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["stroke-linecap","round"]],template:function(t,e){t&1&&(S(R),m(0,"button",0),D("click",function(){return!e.disabled&&(e.onPressedChange?e.onPressedChange.emit(!e.pressed):e.onClick&&e.onClick.emit())}),u(1,$,2,1,"ng-container",1),C(2),u(3,ee,3,4,"ng-container",1),_(4),m(5,"span",2),C(6,1),g(),h(),g()),t&2&&(x(e.cn("inline-flex flex-row items-center justify-center rounded-lg font-medium select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed",e.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer active:scale-[0.97]",e.pressed?"bg-background-muted text-foreground-default shadow-sm":e.cn("bg-transparent text-foreground-default",!e.disabled&&"hover:bg-background-muted active:bg-background-interactive"),e.showText?e.cva(e.size,f(9,W),"medium"):e.cva(e.size,f(10,X),"medium"),e.className)),k("data-ctrl",typeof e.bindControllerProps)("aria-pressed",e.pressed)("aria-disabled",e.disabled)("aria-label",e.ariaLabel||void 0)("disabled",e.disabled?"":null),c(),b("ngIf",e.icon),c(2),b("ngIf",e.showIcon&&!e.icon))},dependencies:[K,Q],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let i=d;(typeof ngDevMode>"u"||ngDevMode)&&I(i,[{type:L,args:[{standalone:!1,selector:"kd-toggle, toggle",template:`
    <button
      type="button"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-pressed]="pressed"
      [attr.aria-disabled]="disabled"
      [attr.aria-label]="ariaLabel || undefined"
      [attr.disabled]="(disabled) ? '' : null"
      [class]="cn('inline-flex flex-row items-center justify-center rounded-lg font-medium select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.97]', pressed ? 'bg-background-muted text-foreground-default shadow-sm' : cn('bg-transparent text-foreground-default', !disabled && 'hover:bg-background-muted active:bg-background-interactive'), showText ? cva(size, {
          small: 'min-w-5 h-5 px-2 py-1 gap-1.5 text-xs',
          medium: 'min-w-6 h-6 px-3 py-1.5 gap-2 text-sm',
          large: 'min-w-9 h-9 px-4 py-2 gap-2.5 text-base'
        }, 'medium') : cva(size, {
          small: 'min-w-5 h-5 px-1.5 py-0.5 gap-1 text-xs',
          medium: 'min-w-6 h-6 px-2 py-1 gap-1 text-sm',
          large: 'min-w-9 h-9 px-3 py-1.5 gap-1 text-base'
        }, 'medium'), className)"
      (click)="!disabled && (onPressedChange ? this.onPressedChange.emit(!pressed) : onClick && this.onClick.emit())"
    >
      <ng-container *ngIf="icon"><ng-container *ngComponentOutlet="icon"></ng-container></ng-container><ng-content select="[icon],[slot=icon]"></ng-content>
      <ng-container *ngIf="showIcon && !icon"
        ><svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          [class]="cn('shrink-0', cva(size, {
          small: 'h-3 w-3',
          medium: 'h-4 w-4',
          large: 'h-5 w-5'
        }, 'medium'))"
        >
          <path stroke-linecap="round" [attr.d]="ICON_PATHS.plus"></path></svg
      ></ng-container>
      <ng-container><span class="truncate font-medium"><ng-content></ng-content></span
      ></ng-container>
    </button>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{pressed:[{type:o}],disabled:[{type:o}],ariaLabel:[{type:o}],showText:[{type:o}],size:[{type:o}],className:[{type:o}],icon:[{type:o}],showIcon:[{type:o}],onPressedChange:[{type:v}],onClick:[{type:v}]});(typeof ngDevMode>"u"||ngDevMode)&&j(i,{className:"Toggle",filePath:"Toggle.ts",lineNumber:80});const l=class l{};n(l,"ɵfac",function(t){return new(t||l)}),n(l,"ɵmod",M({type:l})),n(l,"ɵinj",O({imports:[w]}));let p=l;(typeof ngDevMode>"u"||ngDevMode)&&I(p,[{type:A,args:[{declarations:[i],imports:[w],exports:[i]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&E(p,{declarations:[i],imports:[w],exports:[i]})})();export{p as ToggleModule,i as default};

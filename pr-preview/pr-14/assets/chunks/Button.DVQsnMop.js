var C=Object.defineProperty;var N=(r,a,n)=>a in r?C(r,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[a]=n;var e=(r,a,n)=>N(r,typeof a!="symbol"?a+"":a,n);import{E as L,ɵ as M,a as S,b as R,c as T,j as g,k as j,d as h,q as z,p,u as O,w as v,v as f,t as c,e as m,s as y,O as P,I as o,C as D,f as A,N as H,g as E,i as _,y as k,z as w,r as x,m as I}from"./core.BqS-lykr.js";import{a as B,d as F,I as J}from"./utils.BBpd638g.js";import{C as b,N as q}from"./common_module-chunk.DvGwmKFp.js";const G=["*"],V=()=>({primary:"bg-primary-default text-primary-foreground shadow-xs hover:bg-primary-hover active:bg-primary-pressed",secondary:"bg-secondary-default text-secondary-foreground shadow-xs hover:bg-secondary-hover active:bg-background-interactive focus-visible:bg-secondary-hover",outline:"border border-border-default bg-background-default text-foreground-default shadow-xs hover:bg-background-muted active:bg-background-interactive focus-visible:border-primary-border-emphasis",ghost:"bg-ghost-default text-foreground-default hover:bg-ghost-hover",destructive:"bg-destructive-background text-primary-foreground shadow-xs hover:bg-destructive-hover active:bg-destructive-pressed focus-visible:ring-focus-ring-error",link:"bg-ghost-default text-primary-muted underline-offset-4 hover:underline hover:text-primary-on-surface"}),K=()=>({large:"h-10 px-6 text-base gap-2",regular:"h-9 px-4 text-sm gap-2",small:"h-8 px-3 text-sm gap-1.5",mini:"h-6 px-2 text-xs gap-1.5"});function Q(r,a){if(r&1&&(_(0),k(),g(1,"svg",2),w(2,"path",3),p(),x()),r&2){const n=I();c(2),f("d",n.ICON_PATHS.plus)}}function U(r,a){if(r&1&&(_(0),k(),g(1,"svg",2),w(2,"path",4),p(),x()),r&2){const n=I();c(2),f("d",n.ICON_PATHS.arrowRight)}}const s={type:"button",variant:"primary",size:"regular",roundness:"default",disabled:!1,showLeftIcon:!1,showRightIcon:!1,ariaLabel:"",className:""},l=class l{constructor(){e(this,"cn",B);e(this,"cva",F);e(this,"ICON_PATHS",J);e(this,"type",s.type);e(this,"disabled",s.disabled);e(this,"ariaLabel",s.ariaLabel);e(this,"variant",s.variant);e(this,"size",s.size);e(this,"roundness",s.roundness);e(this,"className",s.className);e(this,"showLeftIcon",s.showLeftIcon);e(this,"showRightIcon",s.showRightIcon);e(this,"onClick",new L)}};e(l,"ɵfac",function(n){return new(n||l)}),e(l,"ɵcmp",M({type:l,selectors:[["spn-button"]],inputs:{type:"type",disabled:"disabled",ariaLabel:"ariaLabel",variant:"variant",size:"size",roundness:"roundness",className:"className",showLeftIcon:"showLeftIcon",showRightIcon:"showRightIcon"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:G,decls:4,vars:10,consts:[[3,"click"],[4,"ngIf"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4","shrink-0"],["stroke-linecap","round"],["stroke-linecap","round","stroke-linejoin","round"]],template:function(n,t){n&1&&(T(),g(0,"button",0),j("click",function(){return!t.disabled&&t.onClick&&t.onClick.emit()}),h(1,Q,3,1,"ng-container",1),z(2),h(3,U,3,1,"ng-container",1),p()),n&2&&(O(t.cn("inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:pointer-events-none",t.cva(t.variant,v(8,V),"primary"),t.cva(t.size,v(9,K),"regular"),t.roundness==="round"?"rounded-full":"rounded-lg",t.className)),f("type",t.type||"button")("disabled",t.disabled?"":null)("aria-disabled",t.disabled)("aria-label",t.ariaLabel||void 0),c(),m("ngIf",t.showLeftIcon),c(2),m("ngIf",t.showRightIcon))},dependencies:[q],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let i=l;(typeof ngDevMode>"u"||ngDevMode)&&y(i,[{type:D,args:[{standalone:!1,selector:"spn-button",template:`
    <button
      [attr.type]="type || 'button'"
      [attr.disabled]="(disabled) ? '' : null"
      [attr.aria-disabled]="disabled"
      [attr.aria-label]="ariaLabel || undefined"
      [class]="cn('inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:pointer-events-none', cva(variant, {
          primary: 'bg-primary-default text-primary-foreground shadow-xs hover:bg-primary-hover active:bg-primary-pressed',
          secondary: 'bg-secondary-default text-secondary-foreground shadow-xs hover:bg-secondary-hover active:bg-background-interactive focus-visible:bg-secondary-hover',
          outline: 'border border-border-default bg-background-default text-foreground-default shadow-xs hover:bg-background-muted active:bg-background-interactive focus-visible:border-primary-border-emphasis',
          ghost: 'bg-ghost-default text-foreground-default hover:bg-ghost-hover',
          destructive: 'bg-destructive-background text-primary-foreground shadow-xs hover:bg-destructive-hover active:bg-destructive-pressed focus-visible:ring-focus-ring-error',
          link: 'bg-ghost-default text-primary-muted underline-offset-4 hover:underline hover:text-primary-on-surface'
        }, 'primary'), cva(size, {
          large: 'h-10 px-6 text-base gap-2',
          regular: 'h-9 px-4 text-sm gap-2',
          small: 'h-8 px-3 text-sm gap-1.5',
          mini: 'h-6 px-2 text-xs gap-1.5'
        }, 'regular'), roundness === 'round' ? 'rounded-full' : 'rounded-lg', className)"
      (click)="!disabled && onClick && this.onClick.emit()"
    >
      <ng-container *ngIf="showLeftIcon"
        ><svg
          aria-hidden="true"
          class="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path stroke-linecap="round" [attr.d]="ICON_PATHS.plus"></path></svg
      ></ng-container>
      <ng-content></ng-content>
      <ng-container *ngIf="showRightIcon"
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
    `]}]}],null,{type:[{type:o}],disabled:[{type:o}],ariaLabel:[{type:o}],variant:[{type:o}],size:[{type:o}],roundness:[{type:o}],className:[{type:o}],showLeftIcon:[{type:o}],showRightIcon:[{type:o}],onClick:[{type:P}]});(typeof ngDevMode>"u"||ngDevMode)&&A(i,{className:"Button",filePath:"Button.ts",lineNumber:99});const d=class d{};e(d,"ɵfac",function(n){return new(n||d)}),e(d,"ɵmod",S({type:d})),e(d,"ɵinj",R({imports:[b]}));let u=d;(typeof ngDevMode>"u"||ngDevMode)&&y(u,[{type:H,args:[{declarations:[i],imports:[b],exports:[i]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&E(u,{declarations:[i],imports:[b],exports:[i]})})();export{u as ButtonModule,i as default};

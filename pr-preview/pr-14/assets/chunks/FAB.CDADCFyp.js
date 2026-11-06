var _=Object.defineProperty;var h=(r,t,n)=>t in r?_(r,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[t]=n;var a=(r,t,n)=>h(r,typeof t!="symbol"?t+"":t,n);import{E as k,ɵ as w,a as C,b as N,c as z,j as g,k as I,y as M,z as S,p as b,d as x,u as f,w as u,v as y,t as p,e as D,s as v,O as L,I as o,C as j,f as A,N as O,g as P,i as T,q as E,r as H}from"./core.BqS-lykr.js";import{a as F,d as B,I as J}from"./utils.BBpd638g.js";import{C as m,N as q}from"./common_module-chunk.DvGwmKFp.js";const G=["*"],V=()=>({primary:"bg-primary-default text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed",secondary:"bg-secondary-default text-secondary-foreground hover:bg-secondary-hover active:bg-background-interactive",outline:"border border-border-default bg-background-default text-foreground-default hover:bg-background-muted active:bg-background-interactive"}),K=()=>({small:"h-10 w-10",regular:"h-14 w-14",large:"h-24 w-24",extended:"h-14 w-auto gap-3 px-4"}),Q=()=>({small:"h-4 w-4",regular:"h-5 w-5",large:"h-7 w-7",extended:"h-5 w-5"});function R(r,t){r&1&&(T(0),g(1,"span",4),E(2),b(),H())}const l={type:"button",variant:"primary",size:"small",disabled:!1,ariaLabel:"Action",className:""},d=class d{constructor(){a(this,"cn",F);a(this,"cva",B);a(this,"ICON_PATHS",J);a(this,"type",l.type);a(this,"ariaLabel",l.ariaLabel);a(this,"disabled",l.disabled);a(this,"variant",l.variant);a(this,"size",l.size);a(this,"className",l.className);a(this,"onClick",new k)}};a(d,"ɵfac",function(n){return new(n||d)}),a(d,"ɵcmp",w({type:d,selectors:[["spn-fab"],["fab"]],inputs:{type:"type",ariaLabel:"ariaLabel",disabled:"disabled",variant:"variant",size:"size",className:"className"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:G,decls:4,vars:12,consts:[[3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["stroke-linecap","round"],[4,"ngIf"],[1,"truncate","text-sm","font-medium"]],template:function(n,e){n&1&&(z(),g(0,"button",0),I("click",function(){return!e.disabled&&e.onClick&&e.onClick.emit()}),M(),g(1,"svg",1),S(2,"path",2),b(),x(3,R,3,0,"ng-container",3),b()),n&2&&(f(e.cn("inline-flex shrink-0 items-center justify-center rounded-full shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50",e.cva(e.variant,u(9,V),"primary"),e.cva(e.size,u(10,K),"small"),e.className)),y("type",e.type||"button")("aria-label",e.ariaLabel||"Action")("disabled",e.disabled?"":null),p(),f(e.cn("shrink-0",e.cva(e.size,u(11,Q),"small"))),p(),y("d",e.ICON_PATHS.plus),p(),D("ngIf",e.size==="extended"))},dependencies:[q],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=d;(typeof ngDevMode>"u"||ngDevMode)&&v(s,[{type:j,args:[{standalone:!1,selector:"spn-fab, fab",template:`
    <button
      [attr.type]="type || 'button'"
      [attr.aria-label]="ariaLabel || 'Action'"
      [attr.disabled]="(disabled) ? '' : null"
      [class]="cn('inline-flex shrink-0 items-center justify-center rounded-full shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50', cva(variant, {
          primary: 'bg-primary-default text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed',
          secondary: 'bg-secondary-default text-secondary-foreground hover:bg-secondary-hover active:bg-background-interactive',
          outline: 'border border-border-default bg-background-default text-foreground-default hover:bg-background-muted active:bg-background-interactive'
        }, 'primary'), cva(size, {
          small: 'h-10 w-10',
          regular: 'h-14 w-14',
          large: 'h-24 w-24',
          extended: 'h-14 w-auto gap-3 px-4'
        }, 'small'), className)"
      (click)="!disabled && onClick && this.onClick.emit()"
    >
      <svg
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
        <path stroke-linecap="round" [attr.d]="ICON_PATHS.plus"></path>
      </svg>
      <ng-container *ngIf="size === 'extended'"
        ><span class="truncate text-sm font-medium"
          ><ng-content></ng-content></span
      ></ng-container>
    </button>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{type:[{type:o}],ariaLabel:[{type:o}],disabled:[{type:o}],variant:[{type:o}],size:[{type:o}],className:[{type:o}],onClick:[{type:L}]});(typeof ngDevMode>"u"||ngDevMode)&&A(s,{className:"FAB",filePath:"FAB.ts",lineNumber:75});const i=class i{};a(i,"ɵfac",function(n){return new(n||i)}),a(i,"ɵmod",C({type:i})),a(i,"ɵinj",N({imports:[m]}));let c=i;(typeof ngDevMode>"u"||ngDevMode)&&v(c,[{type:O,args:[{declarations:[s],imports:[m],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&P(c,{declarations:[s],imports:[m],exports:[s]})})();export{c as FABModule,s as default};

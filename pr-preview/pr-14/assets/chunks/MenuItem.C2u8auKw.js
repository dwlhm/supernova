var L=Object.defineProperty;var N=(t,a,e)=>a in t?L(t,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[a]=e;var n=(t,a,e)=>N(t,typeof a!="symbol"?a+"":a,e);import{E as T,ɵ as M,a as B,b as P,c as S,j as g,k as D,d as j,p as d,i as p,q as O,r as m,u,v as y,t as r,e as b,s as x,O as E,I as i,C as A,f as H,N as F,g as J,y as w,z as I,m as h,o as k,am as C}from"./core.BqS-lykr.js";import{a as R,I as q,b as z}from"./utils.BBpd638g.js";import{C as v,N as G}from"./common_module-chunk.DvGwmKFp.js";const V=["*"];function K(t,a){if(t&1&&(p(0),g(1,"span"),w(),g(2,"svg",2),I(3,"circle",3)(4,"circle",4),d()(),m()),t&2){const e=h();r(),u(e.cn("flex shrink-0 items-center",e.active?"text-primary-subtle-foreground":"text-foreground-default"))}}function Q(t,a){if(t&1&&(p(0),g(1,"span"),k(2),d(),m()),t&2){const e=h();r(),u(e.cn("flex-1 truncate text-left",e.active?"text-primary-subtle-foreground":"text-foreground-default")),r(),C(e.label)}}function U(t,a){if(t&1&&(p(0),g(1,"span"),k(2),d(),m()),t&2){const e=h();r(),u(e.cn("inline-flex shrink-0 items-center rounded-xl px-2 py-0.5 text-xs font-medium leading-none",e.active?"bg-primary-default text-primary-foreground":"bg-primary-subtle text-primary-subtle-foreground")),r(),C(e.badgeLabel)}}function W(t,a){if(t&1&&(p(0),w(),g(1,"svg",5),I(2,"path",6),d(),m()),t&2){const e=h();r(),u(e.cn("h-4 w-4 shrink-0",e.active?"text-primary-subtle-foreground":"text-foreground-muted")),r(),y("d",e.ICON_PATHS.chevronRight)}}const s={label:"Menu",active:!1,showLabel:!0,showLeadingIcon:!0,showTrailingIcon:!0,showBadge:!1,badgeLabel:"New",className:""},f=class f{constructor(){n(this,"cn",R);n(this,"ICON_PATHS",q);n(this,"bindControllerProps",z);n(this,"className",s.className);n(this,"active",s.active);n(this,"showLeadingIcon",s.showLeadingIcon);n(this,"showLabel",s.showLabel);n(this,"label",s.label);n(this,"showBadge",s.showBadge);n(this,"badgeLabel",s.badgeLabel);n(this,"showTrailingIcon",s.showTrailingIcon);n(this,"onClick",new T)}};n(f,"ɵfac",function(e){return new(e||f)}),n(f,"ɵcmp",M({type:f,selectors:[["spn-menu-item"],["menu-item"]],inputs:{className:"className",active:"active",showLeadingIcon:"showLeadingIcon",showLabel:"showLabel",label:"label",showBadge:"showBadge",badgeLabel:"badgeLabel",showTrailingIcon:"showTrailingIcon"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:V,decls:9,vars:12,consts:[["type","button",3,"click"],[4,"ngIf"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4"],["cx","12","cy","12","r","3"],["cx","12","cy","12","r","9"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["stroke-linecap","round","stroke-linejoin","round"]],template:function(e,o){e&1&&(S(),g(0,"div")(1,"button",0),D("click",function(){return o.onClick&&o.onClick.emit()}),j(2,K,5,2,"ng-container",1)(3,Q,3,3,"ng-container",1)(4,U,3,3,"ng-container",1)(5,W,3,3,"ng-container",1),d(),p(6),g(7,"div"),O(8),d(),m(),d()),e&2&&(u(o.cn("flex w-full flex-col",o.className)),y("data-ctrl",typeof o.bindControllerProps),r(),u(o.cn("flex w-full items-center gap-2 rounded-md px-2 py-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",o.active?"bg-primary-subtle font-medium":"hover:bg-background-muted active:bg-background-interactive")),y("aria-current",o.active?"page":void 0),r(),b("ngIf",o.showLeadingIcon),r(),b("ngIf",o.showLabel),r(),b("ngIf",o.showBadge),r(),b("ngIf",o.showTrailingIcon),r(2),u(o.cn("ml-4 flex flex-col gap-1 border-l py-1 pl-2",o.active?"border-primary-default":"border-border-default")))},dependencies:[G],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let l=f;(typeof ngDevMode>"u"||ngDevMode)&&x(l,[{type:A,args:[{standalone:!1,selector:"spn-menu-item, menu-item",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col', className)"
    >
      <button
        type="button"
        [attr.aria-current]="active ? 'page' : undefined"
        [class]="cn('flex w-full items-center gap-2 rounded-md px-2 py-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', active ? 'bg-primary-subtle font-medium' : 'hover:bg-background-muted active:bg-background-interactive')"
        (click)="onClick && this.onClick.emit()"
      >
        <ng-container *ngIf="showLeadingIcon"
          ><span
            [class]="cn('flex shrink-0 items-center', active ? 'text-primary-subtle-foreground' : 'text-foreground-default')"
            ><svg
              aria-hidden="true"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <circle cx="12" cy="12" r="9"></circle></svg></span
        ></ng-container>
        <ng-container *ngIf="showLabel"
          ><span
            [class]="cn('flex-1 truncate text-left', active ? 'text-primary-subtle-foreground' : 'text-foreground-default')"
            >{{label}}</span
          ></ng-container
        >
        <ng-container *ngIf="showBadge"
          ><span
            [class]="cn('inline-flex shrink-0 items-center rounded-xl px-2 py-0.5 text-xs font-medium leading-none', active ? 'bg-primary-default text-primary-foreground' : 'bg-primary-subtle text-primary-subtle-foreground')"
            >{{badgeLabel}}</span
          ></ng-container
        >
        <ng-container *ngIf="showTrailingIcon"
          ><svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            [class]="cn('h-4 w-4 shrink-0', active ? 'text-primary-subtle-foreground' : 'text-foreground-muted')"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="ICON_PATHS.chevronRight"
            ></path></svg
        ></ng-container>
      </button>
      <ng-container><div
          [class]="cn('ml-4 flex flex-col gap-1 border-l py-1 pl-2', active ? 'border-primary-default' : 'border-border-default')"
        >
          <ng-content></ng-content></div
      ></ng-container>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:i}],active:[{type:i}],showLeadingIcon:[{type:i}],showLabel:[{type:i}],label:[{type:i}],showBadge:[{type:i}],badgeLabel:[{type:i}],showTrailingIcon:[{type:i}],onClick:[{type:E}]});(typeof ngDevMode>"u"||ngDevMode)&&H(l,{className:"MenuItem",filePath:"MenuItem.ts",lineNumber:101});const c=class c{};n(c,"ɵfac",function(e){return new(e||c)}),n(c,"ɵmod",B({type:c})),n(c,"ɵinj",P({imports:[v]}));let _=c;(typeof ngDevMode>"u"||ngDevMode)&&x(_,[{type:F,args:[{declarations:[l],imports:[v],exports:[l]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&J(_,{declarations:[l],imports:[v],exports:[l]})})();export{_ as MenuItemModule,l as default};

var k=Object.defineProperty;var C=(t,a,e)=>a in t?k(t,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[a]=e;var n=(t,a,e)=>C(t,typeof a!="symbol"?a+"":a,e);import{E as L,ɵ as N,a as M,b as T,c as B,j as g,k as P,d as S,p as u,u as p,v as y,t as r,e as f,s as w,O as D,I as s,C as j,f as O,N as E,g as A,i as h,y as v,z as I,r as b,m as _,q as H,o as F,am as J}from"./core.BqS-lykr.js";import{a as R,I as q,b as z}from"./utils.BBpd638g.js";import{C as x,N as G}from"./common_module-chunk.DvGwmKFp.js";const V=["*"];function K(t,a){if(t&1&&(h(0),g(1,"span"),v(),g(2,"svg",2),I(3,"rect",3)(4,"rect",4)(5,"rect",5)(6,"rect",6),u()(),b()),t&2){const e=_();r(),p(e.cn("flex shrink-0 items-center",e.active?"text-primary-subtle-foreground":"text-foreground-default"))}}function Q(t,a){if(t&1&&(h(0),g(1,"span"),H(2),u(),b()),t&2){const e=_();r(),p(e.cn("flex-1 truncate text-left",e.active?"text-primary-subtle-foreground":"text-foreground-default"))}}function U(t,a){if(t&1&&(h(0),g(1,"span"),F(2),u(),b()),t&2){const e=_();r(),p(e.cn("inline-flex shrink-0 items-center rounded-xl px-2 py-0.5 text-xs font-medium leading-none",e.active?"bg-primary-default text-primary-foreground":"bg-primary-subtle text-primary-subtle-foreground")),r(),J(e.badgeLabel)}}function W(t,a){if(t&1&&(h(0),v(),g(1,"svg",7),I(2,"path",8),u(),b()),t&2){const e=_();r(),p(e.cn("h-4 w-4 shrink-0",e.active?"text-primary-subtle-foreground":"text-foreground-muted")),r(),y("d",e.ICON_PATHS.chevronRight)}}const c={active:!1,showLabel:!0,showLeadingIcon:!0,showTrailingIcon:!0,showBadge:!1,badgeLabel:"",className:""},d=class d{constructor(){n(this,"cn",R);n(this,"ICON_PATHS",q);n(this,"bindControllerProps",z);n(this,"active",c.active);n(this,"className",c.className);n(this,"showLeadingIcon",c.showLeadingIcon);n(this,"showLabel",c.showLabel);n(this,"showBadge",c.showBadge);n(this,"badgeLabel",c.badgeLabel);n(this,"showTrailingIcon",c.showTrailingIcon);n(this,"onClick",new L)}};n(d,"ɵfac",function(e){return new(e||d)}),n(d,"ɵcmp",N({type:d,selectors:[["spn-main-menu"],["main-menu"]],inputs:{active:"active",className:"className",showLeadingIcon:"showLeadingIcon",showLabel:"showLabel",showBadge:"showBadge",badgeLabel:"badgeLabel",showTrailingIcon:"showTrailingIcon"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:V,decls:5,vars:8,consts:[["type","button",3,"click"],[4,"ngIf"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4"],["x","3","y","3","width","7","height","7","rx","1.5"],["x","14","y","3","width","7","height","7","rx","1.5"],["x","3","y","14","width","7","height","7","rx","1.5"],["x","14","y","14","width","7","height","7","rx","1.5"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["stroke-linecap","round","stroke-linejoin","round"]],template:function(e,o){e&1&&(B(),g(0,"button",0),P("click",function(){return o.onClick&&o.onClick.emit()}),S(1,K,7,2,"ng-container",1)(2,Q,3,2,"ng-container",1)(3,U,3,3,"ng-container",1)(4,W,3,3,"ng-container",1),u()),e&2&&(p(o.cn("flex w-full items-center gap-2 rounded-lg px-2 py-3 text-sm font-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",o.active?"bg-primary-subtle hover:bg-primary-muted":"hover:bg-background-muted active:bg-background-interactive",o.className)),y("data-ctrl",typeof o.bindControllerProps)("aria-current",o.active?"page":void 0),r(),f("ngIf",o.showLeadingIcon),r(),f("ngIf",o.showLabel),r(),f("ngIf",o.showBadge),r(),f("ngIf",o.showTrailingIcon))},dependencies:[G],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let i=d;(typeof ngDevMode>"u"||ngDevMode)&&w(i,[{type:j,args:[{standalone:!1,selector:"spn-main-menu, main-menu",template:`
    <button
      type="button"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-current]="active ? 'page' : undefined"
      [class]="cn('flex w-full items-center gap-2 rounded-lg px-2 py-3 text-sm font-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', active ? 'bg-primary-subtle hover:bg-primary-muted' : 'hover:bg-background-muted active:bg-background-interactive', className)"
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
            <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
            <rect
              x="14"
              y="14"
              width="7"
              height="7"
              rx="1.5"
            ></rect></svg></span
      ></ng-container>
      <ng-container *ngIf="showLabel"
        ><span
          [class]="cn('flex-1 truncate text-left', active ? 'text-primary-subtle-foreground' : 'text-foreground-default')"
          ><ng-content></ng-content></span
      ></ng-container>
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
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{active:[{type:s}],className:[{type:s}],showLeadingIcon:[{type:s}],showLabel:[{type:s}],showBadge:[{type:s}],badgeLabel:[{type:s}],showTrailingIcon:[{type:s}],onClick:[{type:D}]});(typeof ngDevMode>"u"||ngDevMode)&&O(i,{className:"MainMenu",filePath:"MainMenu.ts",lineNumber:97});const l=class l{};n(l,"ɵfac",function(e){return new(e||l)}),n(l,"ɵmod",M({type:l})),n(l,"ɵinj",T({imports:[x]}));let m=l;(typeof ngDevMode>"u"||ngDevMode)&&w(m,[{type:E,args:[{declarations:[i],imports:[x],exports:[i]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&A(m,{declarations:[i],imports:[x],exports:[i]})})();export{m as MainMenuModule,i as default};

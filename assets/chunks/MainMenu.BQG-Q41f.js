var L=Object.defineProperty;var T=(n,a,e)=>a in n?L(n,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[a]=e;var o=(n,a,e)=>T(n,typeof a!="symbol"?a+"":a,e);import{E as N,ɵ as O,a as B,b as P,c as j,j as u,k as S,d as m,q as x,p as h,u as b,v as y,t as i,e as c,s as v,O as D,I as r,C as A,f as E,N as H,g as F,i as f,r as p,m as _,y as C,z as k,o as J,ao as R,A as M}from"./core.vpEFnhB-.js";import{a as q,I as z,d as G}from"./theme.CMj9otVT.js";import{C as w,N as V,a as K}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const Q=[[["","leadingIcon",""],["","slot","leadingicon"]],[["","trailingIcon",""],["","slot","trailingicon"]],"*"],U=["[leadingIcon],[slot=leadingIcon]","[trailingIcon],[slot=trailingIcon]","*"];function W(n,a){n&1&&M(0)}function X(n,a){if(n&1&&(f(0),m(1,W,1,0,"ng-container",2),p()),n&2){const e=_();i(),c("ngComponentOutlet",e.leadingIcon)}}function Y(n,a){if(n&1&&(f(0),u(1,"span"),C(),u(2,"svg",3),k(3,"rect",4)(4,"rect",5)(5,"rect",6)(6,"rect",7),h()(),p()),n&2){const e=_();i(),b(e.cn("flex shrink-0 items-center",e.active?"text-foreground-inverse":"text-foreground-default"))}}function Z(n,a){if(n&1&&(f(0),u(1,"span"),x(2,2),h(),p()),n&2){const e=_();i(),b(e.cn("flex-1 truncate text-left",e.active?"text-primary-foreground":"text-foreground-default"))}}function $(n,a){if(n&1&&(f(0),u(1,"span"),J(2),h(),p()),n&2){const e=_();i(),b(e.cn("inline-flex shrink-0 items-center rounded-xl px-2 py-0.5 text-xs font-medium leading-none",e.active?"bg-primary-foreground text-foreground-default":"bg-primary-default text-foreground-inverse")),i(),R(e.badgeLabel)}}function ee(n,a){n&1&&M(0)}function ne(n,a){if(n&1&&(f(0),m(1,ee,1,0,"ng-container",2),p()),n&2){const e=_();i(),c("ngComponentOutlet",e.trailingIcon)}}function te(n,a){if(n&1&&(f(0),C(),u(1,"svg",8),k(2,"path",9),h(),p()),n&2){const e=_();i(),b(e.cn("h-4 w-4 shrink-0",e.active?"text-foreground-inverse":"text-foreground-default")),i(),y("d",e.ICON_PATHS.chevronRight)}}const s={active:!1,disabled:!1,showLabel:!0,showLeadingIcon:!0,showTrailingIcon:!0,showBadge:!1,badgeLabel:"",className:""},g=class g{constructor(){o(this,"cn",q);o(this,"ICON_PATHS",z);o(this,"bindControllerProps",G);o(this,"disabled",s.disabled);o(this,"active",s.active);o(this,"className",s.className);o(this,"leadingIcon");o(this,"showLeadingIcon",s.showLeadingIcon);o(this,"showLabel",s.showLabel);o(this,"showBadge",s.showBadge);o(this,"badgeLabel",s.badgeLabel);o(this,"trailingIcon");o(this,"showTrailingIcon",s.showTrailingIcon);o(this,"onClick",new N)}};o(g,"ɵfac",function(e){return new(e||g)}),o(g,"ɵcmp",O({type:g,selectors:[["kd-main-menu"],["main-menu"]],inputs:{disabled:"disabled",active:"active",className:"className",leadingIcon:"leadingIcon",showLeadingIcon:"showLeadingIcon",showLabel:"showLabel",showBadge:"showBadge",badgeLabel:"badgeLabel",trailingIcon:"trailingIcon",showTrailingIcon:"showTrailingIcon"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:U,decls:9,vars:12,consts:[["type","button",3,"click"],[4,"ngIf"],[4,"ngComponentOutlet"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4"],["x","3","y","3","width","7","height","7","rx","1.5"],["x","14","y","3","width","7","height","7","rx","1.5"],["x","3","y","14","width","7","height","7","rx","1.5"],["x","14","y","14","width","7","height","7","rx","1.5"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["stroke-linecap","round","stroke-linejoin","round"]],template:function(e,t){e&1&&(j(Q),u(0,"button",0),S("click",function(){return!t.disabled&&t.onClick&&t.onClick.emit()}),m(1,X,2,1,"ng-container",1),x(2),m(3,Y,7,2,"ng-container",1)(4,Z,3,2,"ng-container",1)(5,$,3,3,"ng-container",1)(6,ne,2,1,"ng-container",1),x(7,1),m(8,te,3,3,"ng-container",1),h()),e&2&&(b(t.cn("flex w-full items-center justify-center gap-2 rounded-lg px-2 py-3 text-sm font-normal select-none transition-colors duration-150 [&>svg]:text-current focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed",t.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer",t.active?"bg-primary-default text-primary-foreground":t.cn("text-foreground-default",!t.disabled&&"hover:bg-background-interactive active:bg-background-muted"),t.className)),y("data-ctrl",typeof t.bindControllerProps)("disabled",t.disabled?"":null)("aria-disabled",t.disabled)("aria-current",t.active?"page":void 0),i(),c("ngIf",t.leadingIcon),i(2),c("ngIf",t.showLeadingIcon&&!t.leadingIcon),i(),c("ngIf",t.showLabel),i(),c("ngIf",t.showBadge),i(),c("ngIf",t.trailingIcon),i(2),c("ngIf",t.showTrailingIcon&&!t.trailingIcon))},dependencies:[V,K],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let l=g;(typeof ngDevMode>"u"||ngDevMode)&&v(l,[{type:A,args:[{standalone:!1,selector:"kd-main-menu, main-menu",template:`
    <button
      type="button"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.disabled]="(disabled) ? '' : null"
      [attr.aria-disabled]="disabled"
      [attr.aria-current]="active ? 'page' : undefined"
      [class]="cn('flex w-full items-center justify-center gap-2 rounded-lg px-2 py-3 text-sm font-normal select-none transition-colors duration-150 [&>svg]:text-current focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer', active ? 'bg-primary-default text-primary-foreground' : cn('text-foreground-default', !disabled && 'hover:bg-background-interactive active:bg-background-muted'), className)"
      (click)="!disabled && onClick && this.onClick.emit()"
    >
      <ng-container *ngIf="leadingIcon"><ng-container *ngComponentOutlet="leadingIcon"></ng-container></ng-container><ng-content select="[leadingIcon],[slot=leadingIcon]"></ng-content>
      <ng-container *ngIf="showLeadingIcon && !leadingIcon"
        ><span
          [class]="cn('flex shrink-0 items-center', active ? 'text-foreground-inverse' : 'text-foreground-default')"
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
          [class]="cn('flex-1 truncate text-left', active ? 'text-primary-foreground' : 'text-foreground-default')"
          ><ng-content></ng-content></span
      ></ng-container>
      <ng-container *ngIf="showBadge"
        ><span
          [class]="cn('inline-flex shrink-0 items-center rounded-xl px-2 py-0.5 text-xs font-medium leading-none', active ? 'bg-primary-foreground text-foreground-default' : 'bg-primary-default text-foreground-inverse')"
          >{{badgeLabel}}</span
        ></ng-container
      >
      <ng-container *ngIf="trailingIcon"><ng-container *ngComponentOutlet="trailingIcon"></ng-container></ng-container><ng-content select="[trailingIcon],[slot=trailingIcon]"></ng-content>
      <ng-container *ngIf="showTrailingIcon && !trailingIcon"
        ><svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          [class]="cn('h-4 w-4 shrink-0', active ? 'text-foreground-inverse' : 'text-foreground-default')"
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
    `]}]}],null,{disabled:[{type:r}],active:[{type:r}],className:[{type:r}],leadingIcon:[{type:r}],showLeadingIcon:[{type:r}],showLabel:[{type:r}],showBadge:[{type:r}],badgeLabel:[{type:r}],trailingIcon:[{type:r}],showTrailingIcon:[{type:r}],onClick:[{type:D}]});(typeof ngDevMode>"u"||ngDevMode)&&E(l,{className:"MainMenu",filePath:"MainMenu.ts",lineNumber:105});const d=class d{};o(d,"ɵfac",function(e){return new(e||d)}),o(d,"ɵmod",B({type:d})),o(d,"ɵinj",P({imports:[w]}));let I=d;(typeof ngDevMode>"u"||ngDevMode)&&v(I,[{type:H,args:[{declarations:[l],imports:[w],exports:[l]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&F(I,{declarations:[l],imports:[w],exports:[l]})})();export{I as MainMenuModule,l as default};

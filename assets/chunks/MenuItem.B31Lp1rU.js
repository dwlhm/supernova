var N=Object.defineProperty;var O=(e,o,t)=>o in e?N(e,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[o]=t;var a=(e,o,t)=>O(e,typeof o!="symbol"?o+"":o,t);import{E as B,ɵ as P,a as S,b as D,c as j,j as g,k as A,d as m,q as x,p as u,u as h,v as w,t as i,e as s,s as y,O as E,I as l,C as H,f as F,N as J,g as R,i as f,r as p,m as b,y as k,z as C,o as L,ao as T,A as M}from"./core.vpEFnhB-.js";import{a as q,I as z,d as G}from"./theme.CMj9otVT.js";import{C as v,N as V,a as K}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const Q=[[["","leadingIcon",""],["","slot","leadingicon"]],[["","trailingIcon",""],["","slot","trailingicon"]],"*"],U=["[leadingIcon],[slot=leadingIcon]","[trailingIcon],[slot=trailingIcon]","*"];function W(e,o){e&1&&M(0)}function X(e,o){if(e&1&&(f(0),m(1,W,1,0,"ng-container",2),p()),e&2){const t=b();i(),s("ngComponentOutlet",t.leadingIcon)}}function Y(e,o){e&1&&(f(0),g(1,"span",3),k(),g(2,"svg",4),C(3,"circle",5)(4,"circle",6),u()(),p())}function Z(e,o){if(e&1&&(f(0),g(1,"span",7),L(2),u(),p()),e&2){const t=b();i(2),T(t.label)}}function $(e,o){if(e&1&&(f(0),g(1,"span",8),L(2),u(),p()),e&2){const t=b();i(2),T(t.badgeLabel)}}function ee(e,o){e&1&&M(0)}function ne(e,o){if(e&1&&(f(0),m(1,ee,1,0,"ng-container",2),p()),e&2){const t=b();i(),s("ngComponentOutlet",t.trailingIcon)}}function te(e,o){if(e&1&&(f(0),k(),g(1,"svg",9),C(2,"path",10),u(),p()),e&2){const t=b();i(),h(t.cn("h-4 w-4 shrink-0 text-foreground-default transition-transform duration-150",t.expanded&&"rotate-90")),i(),w("d",t.ICON_PATHS.chevronRight)}}function ae(e,o){e&1&&(f(0),g(1,"div",11),x(2,2),u(),p())}const r={label:"Menu Item",active:!1,expanded:!1,disabled:!1,showLabel:!0,showLeadingIcon:!0,showTrailingIcon:!0,showBadge:!1,badgeLabel:"",className:""},_=class _{constructor(){a(this,"cn",q);a(this,"ICON_PATHS",z);a(this,"bindControllerProps",G);a(this,"className",r.className);a(this,"disabled",r.disabled);a(this,"active",r.active);a(this,"expanded",r.expanded);a(this,"leadingIcon");a(this,"showLeadingIcon",r.showLeadingIcon);a(this,"showLabel",r.showLabel);a(this,"label",r.label);a(this,"showBadge",r.showBadge);a(this,"badgeLabel",r.badgeLabel);a(this,"trailingIcon");a(this,"showTrailingIcon",r.showTrailingIcon);a(this,"onClick",new B)}};a(_,"ɵfac",function(t){return new(t||_)}),a(_,"ɵcmp",P({type:_,selectors:[["kd-menu-item"],["menu-item"]],inputs:{className:"className",disabled:"disabled",active:"active",expanded:"expanded",leadingIcon:"leadingIcon",showLeadingIcon:"showLeadingIcon",showLabel:"showLabel",label:"label",showBadge:"showBadge",badgeLabel:"badgeLabel",trailingIcon:"trailingIcon",showTrailingIcon:"showTrailingIcon"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:U,decls:11,vars:16,consts:[["type","button",3,"click"],[4,"ngIf"],[4,"ngComponentOutlet"],[1,"flex","shrink-0","items-center","text-foreground-default"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4"],["cx","12","cy","12","r","3"],["cx","12","cy","12","r","9"],[1,"flex-1","truncate","text-left","text-foreground-default"],[1,"inline-flex","shrink-0","items-center","rounded-xl","bg-primary-default","px-2","py-0.5","text-xs","font-medium","leading-none","text-foreground-inverse"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["stroke-linecap","round","stroke-linejoin","round"],[1,"ml-4","flex","flex-col","gap-1","border-l","border-border-default","py-1","pl-2","text-sm","text-foreground-default"]],template:function(t,n){t&1&&(j(Q),g(0,"div")(1,"button",0),A("click",function(){return!n.disabled&&n.onClick&&n.onClick.emit()}),m(2,X,2,1,"ng-container",1),x(3),m(4,Y,5,0,"ng-container",1)(5,Z,3,1,"ng-container",1)(6,$,3,1,"ng-container",1)(7,ne,2,1,"ng-container",1),x(8,1),m(9,te,3,3,"ng-container",1),u(),m(10,ae,3,0,"ng-container",1),u()),t&2&&(h(n.cn("flex w-full flex-col gap-1",n.className)),w("data-ctrl",typeof n.bindControllerProps),i(),h(n.cn("flex w-full items-center gap-2 rounded-lg px-2 py-3 text-sm select-none transition-colors duration-150 [&>svg]:text-current focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed",n.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer",n.active?"bg-background-muted font-medium text-foreground-default":n.cn("font-normal text-foreground-default",!n.disabled&&"hover:bg-background-muted active:bg-background-interactive"))),w("disabled",n.disabled?"":null)("aria-disabled",n.disabled)("aria-current",n.active?"page":void 0)("aria-expanded",n.expanded),i(),s("ngIf",n.leadingIcon),i(2),s("ngIf",n.showLeadingIcon&&!n.leadingIcon),i(),s("ngIf",n.showLabel),i(),s("ngIf",n.showBadge),i(),s("ngIf",n.trailingIcon),i(2),s("ngIf",n.showTrailingIcon&&!n.trailingIcon),i(),s("ngIf",n.expanded))},dependencies:[V,K],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let c=_;(typeof ngDevMode>"u"||ngDevMode)&&y(c,[{type:H,args:[{standalone:!1,selector:"kd-menu-item, menu-item",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-1', className)"
    >
      <button
        type="button"
        [attr.disabled]="(disabled) ? '' : null"
        [attr.aria-disabled]="disabled"
        [attr.aria-current]="active ? 'page' : undefined"
        [attr.aria-expanded]="expanded"
        [class]="cn('flex w-full items-center gap-2 rounded-lg px-2 py-3 text-sm select-none transition-colors duration-150 [&>svg]:text-current focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer', active ? 'bg-background-muted font-medium text-foreground-default' : cn('font-normal text-foreground-default', !disabled && 'hover:bg-background-muted active:bg-background-interactive'))"
        (click)="!disabled && onClick && this.onClick.emit()"
      >
        <ng-container *ngIf="leadingIcon"><ng-container *ngComponentOutlet="leadingIcon"></ng-container></ng-container><ng-content select="[leadingIcon],[slot=leadingIcon]"></ng-content>
        <ng-container *ngIf="showLeadingIcon && !leadingIcon"
          ><span class="flex shrink-0 items-center text-foreground-default"
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
            class="flex-1 truncate text-left text-foreground-default"
            >{{label}}</span
          ></ng-container
        >
        <ng-container *ngIf="showBadge"
          ><span
            class="inline-flex shrink-0 items-center rounded-xl bg-primary-default px-2 py-0.5 text-xs font-medium leading-none text-foreground-inverse"
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
            [class]="cn('h-4 w-4 shrink-0 text-foreground-default transition-transform duration-150', expanded && 'rotate-90')"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="ICON_PATHS.chevronRight"
            ></path></svg
        ></ng-container>
      </button>
      <ng-container *ngIf="expanded"
        ><div
          class="ml-4 flex flex-col gap-1 border-l border-border-default py-1 pl-2 text-sm text-foreground-default"
        >
          <ng-content></ng-content></div
      ></ng-container>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:l}],disabled:[{type:l}],active:[{type:l}],expanded:[{type:l}],leadingIcon:[{type:l}],showLeadingIcon:[{type:l}],showLabel:[{type:l}],label:[{type:l}],showBadge:[{type:l}],badgeLabel:[{type:l}],trailingIcon:[{type:l}],showTrailingIcon:[{type:l}],onClick:[{type:E}]});(typeof ngDevMode>"u"||ngDevMode)&&F(c,{className:"MenuItem",filePath:"MenuItem.ts",lineNumber:112});const d=class d{};a(d,"ɵfac",function(t){return new(t||d)}),a(d,"ɵmod",S({type:d})),a(d,"ɵinj",D({imports:[v]}));let I=d;(typeof ngDevMode>"u"||ngDevMode)&&y(I,[{type:J,args:[{declarations:[c],imports:[v],exports:[c]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&R(I,{declarations:[c],imports:[v],exports:[c]})})();export{I as MenuItemModule,c as default};

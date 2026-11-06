var j=Object.defineProperty;var C=(t,a,e)=>a in t?j(t,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[a]=e;var n=(t,a,e)=>C(t,typeof a!="symbol"?a+"":a,e);import{ɵ as N,a as w,b as k,c as L,j as f,o as p,p as r,d as g,q as D,u as x,v as P,t as o,am as m,e as _,s as h,I as c,C as S,f as T,N as E,g as F,i as y,r as I,m as M}from"./core.BqS-lykr.js";import{a as J,b as K}from"./utils.BBpd638g.js";import{C as v,N as q}from"./common_module-chunk.DvGwmKFp.js";const O=["*"];function z(t,a){if(t&1&&(y(0),f(1,"span",4),p(2),r(),I()),t&2){const e=M();o(2),m(e.brand)}}function A(t,a){if(t&1&&(y(0),f(1,"span",6)(2,"span",7),p(3),r(),f(4,"span",8),p(5),r()(),I()),t&2){const e=M(2);o(3),m(e.accountLabel),o(2),m(e.accountMeta)}}function B(t,a){if(t&1&&(y(0),f(1,"div")(2,"div")(3,"span",5),p(4),r(),g(5,A,6,2,"ng-container",2),r()(),I()),t&2){const e=M();o(),x(e.cn("px-2",e.expanded?"":"flex justify-center")),o(),x(e.cn("flex items-center gap-2 rounded-xl bg-background-muted px-2 py-2",e.expanded?"":"justify-center")),o(2),m(e.accountInitials),o(),_("ngIf",e.expanded)}}const i={expanded:!1,brand:"Komerce",accountLabel:"Lionel Messi",accountMeta:"messi@gmail.com",accountInitials:"LM",brandInitials:"K",className:""},u=class u{constructor(){n(this,"cn",J);n(this,"bindControllerProps",K);n(this,"brand",i.brand);n(this,"expanded",i.expanded);n(this,"className",i.className);n(this,"brandInitials",i.brandInitials);n(this,"accountLabel",i.accountLabel);n(this,"accountMeta",i.accountMeta);n(this,"accountInitials",i.accountInitials)}};n(u,"ɵfac",function(e){return new(e||u)}),n(u,"ɵcmp",N({type:u,selectors:[["spn-sidebar"],["sidebar"]],inputs:{brand:"brand",expanded:"expanded",className:"className",brandInitials:"brandInitials",accountLabel:"accountLabel",accountMeta:"accountMeta",accountInitials:"accountInitials"},standalone:!1,ngContentSelectors:O,decls:9,vars:9,consts:[[1,"flex","flex-col"],["aria-hidden","true",1,"flex","h-8","w-8","shrink-0","items-center","justify-center","rounded-md","bg-primary-default","text-sm","font-semibold","text-primary-foreground"],[4,"ngIf"],["aria-label","Main",1,"flex","flex-col","gap-2","px-2"],[1,"truncate","text-sm","font-semibold","text-foreground-default"],["aria-hidden","true",1,"flex","h-8","w-8","shrink-0","items-center","justify-center","rounded-full","bg-background-subtle","text-xs","font-medium","text-foreground-muted"],[1,"flex","min-w-0","flex-col"],[1,"truncate","text-sm","font-medium","text-foreground-default"],[1,"truncate","text-xs","text-foreground-muted"]],template:function(e,s){e&1&&(L(),f(0,"aside")(1,"div",0)(2,"div")(3,"span",1),p(4),r(),g(5,z,3,1,"ng-container",2),r(),f(6,"nav",3),D(7),r()(),g(8,B,6,6,"ng-container",2),r()),e&2&&(x(s.cn("flex h-full shrink-0 flex-col justify-between border-r border-border-default bg-background-default pb-2",s.expanded?"w-60":"w-16",s.className)),P("data-ctrl",typeof s.bindControllerProps)("aria-label",s.brand),o(2),x(s.cn("flex items-center gap-2 px-2 py-4",s.expanded?"":"justify-center")),o(2),m(s.brandInitials),o(),_("ngIf",s.expanded),o(3),_("ngIf",s.accountLabel!==""||s.accountMeta!==""))},dependencies:[q],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let d=u;(typeof ngDevMode>"u"||ngDevMode)&&h(d,[{type:S,args:[{standalone:!1,selector:"spn-sidebar, sidebar",template:`
    <aside
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-label]="brand"
      [class]="cn('flex h-full shrink-0 flex-col justify-between border-r border-border-default bg-background-default pb-2', expanded ? 'w-60' : 'w-16', className)"
    >
      <div class="flex flex-col">
        <div
          [class]="cn('flex items-center gap-2 px-2 py-4', expanded ? '' : 'justify-center')"
        >
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-default text-sm font-semibold text-primary-foreground"
            aria-hidden="true"
            >{{brandInitials}}</span
          >
          <ng-container *ngIf="expanded"
            ><span
              class="truncate text-sm font-semibold text-foreground-default"
              >{{brand}}</span
            ></ng-container
          >
        </div>
        <nav aria-label="Main" class="flex flex-col gap-2 px-2">
          <ng-content></ng-content>
        </nav>
      </div>
      <ng-container *ngIf="accountLabel !== '' || accountMeta !== ''"
        ><div [class]="cn('px-2', expanded ? '' : 'flex justify-center')">
          <div
            [class]="cn('flex items-center gap-2 rounded-xl bg-background-muted px-2 py-2', expanded ? '' : 'justify-center')"
          >
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-subtle text-xs font-medium text-foreground-muted"
              aria-hidden="true"
              >{{accountInitials}}</span
            >
            <ng-container *ngIf="expanded"
              ><span class="flex min-w-0 flex-col"
                ><span
                  class="truncate text-sm font-medium text-foreground-default"
                  >{{accountLabel}}</span
                >
                <span
                  class="truncate text-xs text-foreground-muted"
                  >{{accountMeta}}</span
                ></span
              ></ng-container
            >
          </div>
        </div></ng-container
      >
    </aside>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{brand:[{type:c}],expanded:[{type:c}],className:[{type:c}],brandInitials:[{type:c}],accountLabel:[{type:c}],accountMeta:[{type:c}],accountInitials:[{type:c}]});(typeof ngDevMode>"u"||ngDevMode)&&T(d,{className:"Sidebar",filePath:"Sidebar.ts",lineNumber:90});const l=class l{};n(l,"ɵfac",function(e){return new(e||l)}),n(l,"ɵmod",w({type:l})),n(l,"ɵinj",k({imports:[v]}));let b=l;(typeof ngDevMode>"u"||ngDevMode)&&h(b,[{type:E,args:[{declarations:[d],imports:[v],exports:[d]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&F(b,{declarations:[d],imports:[v],exports:[d]})})();export{b as SidebarModule,d as default};

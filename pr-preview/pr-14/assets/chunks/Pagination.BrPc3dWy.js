var O=Object.defineProperty;var j=(t,a,n)=>a in t?O(t,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[a]=n;var r=(t,a,n)=>j(t,typeof a!="symbol"?a+"":a,n);import{E,ɵ as M,a as B,b as F,c as D,j as i,k as C,d as u,q as N,o as h,p as g,u as y,v as m,t as o,e as l,ao as L,s as S,O as H,I as s,C as V,f as $,N as J,g as R,i as b,r as f,m as c,y as w,z as A,A as T,h as q,l as z,n as G,x as K}from"./core.vpEFnhB-.js";import{a as Q,J as U,I as W,d as X}from"./theme.CecfD-Na.js";import{C as k,N as Y,b as Z,a as ee}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const ne=[[["","prevIcon",""],["","slot","previcon"]],[["","nextIcon",""],["","slot","nexticon"]]],te=["[prevIcon],[slot=prevIcon]","[nextIcon],[slot=nextIcon]"];function ae(t,a){t&1&&T(0)}function re(t,a){if(t&1&&(b(0),u(1,ae,1,0,"ng-container",5),f()),t&2){const n=c();o(),l("ngComponentOutlet",n.prevIcon)}}function oe(t,a){if(t&1&&(b(0),w(),i(1,"svg",6),A(2,"path",7),g(),f()),t&2){const n=c();o(2),m("d",n.ICON_PATHS.chevronLeft)}}function ie(t,a){if(t&1&&(b(0),i(1,"span",8),h(2),g(),f()),t&2){const n=c().$implicit;o(2),L(n.label)}}function se(t,a){if(t&1){const n=q();b(0),i(1,"button",0),C("click",function(){z(n);const v=c().$implicit,x=c();return G(!v.isCurrent&&x.onPageChange&&x.onPageChange.emit(v.page))}),h(2),g(),f()}if(t&2){const n=c().$implicit,e=c();o(),y(e.cn("inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium select-none transition-all duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",n.isCurrent?"border-border-default bg-background-default text-foreground-default shadow-xs":"border-transparent bg-transparent text-foreground-default hover:bg-background-muted active:bg-background-interactive")),m("aria-current",n.isCurrent?"page":void 0)("aria-label",n.ariaLabel||"Page "+n.label),o(),K(" ",n.label," ")}}function le(t,a){if(t&1&&(b(0),i(1,"li"),u(2,ie,3,1,"ng-container",1)(3,se,3,5,"ng-container",1),g(),f()),t&2){const n=a.$implicit;o(2),l("ngIf",n.isEllipsis),o(),l("ngIf",!n.isEllipsis)}}function ge(t,a){t&1&&T(0)}function ce(t,a){if(t&1&&(b(0),u(1,ge,1,0,"ng-container",5),f()),t&2){const n=c();o(),l("ngComponentOutlet",n.nextIcon)}}function ue(t,a){if(t&1&&(b(0),w(),i(1,"svg",6),A(2,"path",7),g(),f()),t&2){const n=c();o(2),m("d",n.ICON_PATHS.chevronRight)}}const P={currentPage:1,totalPages:1,previousLabel:"Previous",nextLabel:"Next",ariaLabel:"Pagination",className:""},_=class _{constructor(){r(this,"cn",Q);r(this,"getPaginationState",U);r(this,"ICON_PATHS",W);r(this,"bindControllerProps",X);r(this,"ariaLabel",P.ariaLabel);r(this,"className",P.className);r(this,"currentPage",P.currentPage);r(this,"totalPages",P.totalPages);r(this,"getPageAriaLabel");r(this,"previousLabel",P.previousLabel);r(this,"prevIcon");r(this,"nextLabel",P.nextLabel);r(this,"nextIcon");r(this,"onPageChange",new E)}trackByEntry0(a,n){return n.key}};r(_,"ɵfac",function(n){return new(n||_)}),r(_,"ɵcmp",M({type:_,selectors:[["kd-pagination"],["pagination"]],inputs:{ariaLabel:"ariaLabel",className:"className",currentPage:"currentPage",totalPages:"totalPages",getPageAriaLabel:"getPageAriaLabel",previousLabel:"previousLabel",prevIcon:"prevIcon",nextLabel:"nextLabel",nextIcon:"nextIcon"},outputs:{onPageChange:"onPageChange"},standalone:!1,ngContentSelectors:te,decls:15,vars:20,consts:[["type","button",3,"click"],[4,"ngIf"],[1,"hidden","sm:inline"],[1,"flex","items-center","gap-1"],[4,"ngFor","ngForOf","ngForTrackBy"],[4,"ngComponentOutlet"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4","shrink-0"],["stroke-linecap","round","stroke-linejoin","round"],["aria-hidden","true",1,"inline-flex","h-9","w-9","items-center","justify-center","text-sm","text-foreground-default"]],template:function(n,e){n&1&&(D(ne),i(0,"nav")(1,"button",0),C("click",function(){return e.getPaginationState(e.currentPage,e.totalPages,e.getPageAriaLabel).canPrev&&e.onPageChange&&e.onPageChange.emit(e.getPaginationState(e.currentPage,e.totalPages,e.getPageAriaLabel).current-1)}),u(2,re,2,1,"ng-container",1),N(3),u(4,oe,3,1,"ng-container",1),i(5,"span",2),h(6),g()(),i(7,"ol",3),u(8,le,4,2,"ng-container",4),g(),i(9,"button",0),C("click",function(){return e.getPaginationState(e.currentPage,e.totalPages,e.getPageAriaLabel).canNext&&e.onPageChange&&e.onPageChange.emit(e.getPaginationState(e.currentPage,e.totalPages,e.getPageAriaLabel).current+1)}),i(10,"span",2),h(11),g(),u(12,ce,2,1,"ng-container",1),N(13,1),u(14,ue,3,1,"ng-container",1),g()()),n&2&&(y(e.cn("flex items-center gap-1",e.className)),m("data-ctrl",typeof e.bindControllerProps)("aria-label",e.ariaLabel),o(),y(e.cn("inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50",e.getPaginationState(e.currentPage,e.totalPages,e.getPageAriaLabel).canPrev?"cursor-pointer hover:bg-background-muted active:bg-background-interactive active:scale-[0.97]":"cursor-not-allowed opacity-50")),m("disabled",e.getPaginationState(e.currentPage,e.totalPages,e.getPageAriaLabel).canPrev?null:"")("aria-label",e.previousLabel),o(),l("ngIf",e.prevIcon),o(2),l("ngIf",!e.prevIcon),o(2),L(e.previousLabel),o(2),l("ngForOf",e.getPaginationState(e.currentPage,e.totalPages,e.getPageAriaLabel).entries)("ngForTrackBy",e.trackByEntry0),o(),y(e.cn("inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50",e.getPaginationState(e.currentPage,e.totalPages,e.getPageAriaLabel).canNext?"cursor-pointer hover:bg-background-muted active:bg-background-interactive active:scale-[0.97]":"cursor-not-allowed opacity-50")),m("disabled",e.getPaginationState(e.currentPage,e.totalPages,e.getPageAriaLabel).canNext?null:"")("aria-label",e.nextLabel),o(2),L(e.nextLabel),o(),l("ngIf",e.nextIcon),o(2),l("ngIf",!e.nextIcon))},dependencies:[Y,Z,ee],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let d=_;(typeof ngDevMode>"u"||ngDevMode)&&S(d,[{type:V,args:[{standalone:!1,selector:"kd-pagination, pagination",template:`
    <nav
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-label]="ariaLabel"
      [class]="cn('flex items-center gap-1', className)"
    >
      <button
        type="button"
        [attr.disabled]="(!getPaginationState(currentPage, totalPages, getPageAriaLabel).canPrev) ? '' : null"
        [attr.aria-label]="previousLabel"
        [class]="cn('inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50', getPaginationState(currentPage, totalPages, getPageAriaLabel).canPrev ? 'cursor-pointer hover:bg-background-muted active:bg-background-interactive active:scale-[0.97]' : 'cursor-not-allowed opacity-50')"
        (click)="getPaginationState(currentPage, totalPages, getPageAriaLabel).canPrev && onPageChange && this.onPageChange.emit(getPaginationState(currentPage, totalPages, getPageAriaLabel).current - 1)"
      >
        <ng-container *ngIf="prevIcon"><ng-container *ngComponentOutlet="prevIcon"></ng-container></ng-container><ng-content select="[prevIcon],[slot=prevIcon]"></ng-content>
        <ng-container *ngIf="!prevIcon"
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
              [attr.d]="ICON_PATHS.chevronLeft"
            ></path></svg
        ></ng-container>
        <span class="hidden sm:inline">{{previousLabel}}</span>
      </button>
      <ol class="flex items-center gap-1">
        <ng-container
          *ngFor="let entry of getPaginationState(currentPage, totalPages, getPageAriaLabel).entries; trackBy: trackByEntry0"
          ><li>
            <ng-container *ngIf="entry.isEllipsis"
              ><span
                class="inline-flex h-9 w-9 items-center justify-center text-sm text-foreground-default"
                aria-hidden="true"
                >{{entry.label}}</span
              ></ng-container
            >
            <ng-container *ngIf="!entry.isEllipsis"
              ><button
                type="button"
                [attr.aria-current]="entry.isCurrent ? 'page' : undefined"
                [attr.aria-label]="entry.ariaLabel || 'Page ' + entry.label"
                [class]="cn('inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium select-none transition-all duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', entry.isCurrent ? 'border-border-default bg-background-default text-foreground-default shadow-xs' : 'border-transparent bg-transparent text-foreground-default hover:bg-background-muted active:bg-background-interactive')"
                (click)="!entry.isCurrent && onPageChange && this.onPageChange.emit(entry.page)"
              >
                {{entry.label}}
              </button></ng-container
            >
          </li></ng-container
        >
      </ol>
      <button
        type="button"
        [attr.disabled]="(!getPaginationState(currentPage, totalPages, getPageAriaLabel).canNext) ? '' : null"
        [attr.aria-label]="nextLabel"
        [class]="cn('inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50', getPaginationState(currentPage, totalPages, getPageAriaLabel).canNext ? 'cursor-pointer hover:bg-background-muted active:bg-background-interactive active:scale-[0.97]' : 'cursor-not-allowed opacity-50')"
        (click)="getPaginationState(currentPage, totalPages, getPageAriaLabel).canNext && onPageChange && this.onPageChange.emit(getPaginationState(currentPage, totalPages, getPageAriaLabel).current + 1)"
      >
        <span class="hidden sm:inline">{{nextLabel}}</span>
        <ng-container *ngIf="nextIcon"><ng-container *ngComponentOutlet="nextIcon"></ng-container></ng-container><ng-content select="[nextIcon],[slot=nextIcon]"></ng-content>
        <ng-container *ngIf="!nextIcon"
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
              [attr.d]="ICON_PATHS.chevronRight"
            ></path></svg
        ></ng-container>
      </button>
    </nav>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{ariaLabel:[{type:s}],className:[{type:s}],currentPage:[{type:s}],totalPages:[{type:s}],getPageAriaLabel:[{type:s}],previousLabel:[{type:s}],prevIcon:[{type:s}],nextLabel:[{type:s}],nextIcon:[{type:s}],onPageChange:[{type:H}]});(typeof ngDevMode>"u"||ngDevMode)&&$(d,{className:"Pagination",filePath:"Pagination.ts",lineNumber:135});const p=class p{};r(p,"ɵfac",function(n){return new(n||p)}),r(p,"ɵmod",B({type:p})),r(p,"ɵinj",F({imports:[k]}));let I=p;(typeof ngDevMode>"u"||ngDevMode)&&S(I,[{type:J,args:[{declarations:[d],imports:[k],exports:[d]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&R(I,{declarations:[d],imports:[k],exports:[d]})})();export{I as PaginationModule,d as default};

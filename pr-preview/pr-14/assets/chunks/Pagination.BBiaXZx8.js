var T=Object.defineProperty;var M=(r,a,t)=>a in r?T(r,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[a]=t;var n=(r,a,t)=>M(r,typeof a!="symbol"?a+"":a,t);import{E,ɵ as O,a as j,b as B,j as i,k as m,y as N,z as S,p as s,ao as F,o as P,d as w,u as L,v as u,t as o,am as h,e as y,s as I,O as D,I as d,C as H,f as A,N as V,g as $,i as v,r as C,m as f,h as J,l as R,n as z,x as G}from"./core.BqS-lykr.js";import{a as q,u as K,I as Q,b as U}from"./utils.BBpd638g.js";import{C as k,a as W,N as X}from"./common_module-chunk.DvGwmKFp.js";function Y(r,a){if(r&1&&(v(0),i(1,"span",8),P(2),s(),C()),r&2){const t=f().$implicit;o(2),h(t.label)}}function Z(r,a){if(r&1){const t=J();v(0),i(1,"button",9),m("click",function(){R(t);const b=f().$implicit,x=f();return z(!b.isCurrent&&x.onPageChange&&x.onPageChange.emit(b.page))}),P(2),s(),C()}if(r&2){const t=f().$implicit,e=f();o(),L(e.cn("inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",t.isCurrent?"border-border-default bg-background-default text-foreground-default shadow-xs":"border-transparent bg-transparent text-foreground-default hover:bg-background-muted")),u("aria-current",t.isCurrent?"page":void 0)("aria-label","Page "+t.label),o(),G(" ",t.label," ")}}function ee(r,a){if(r&1&&(v(0),i(1,"li"),w(2,Y,3,1,"ng-container",7)(3,Z,3,5,"ng-container",7),s(),C()),r&2){const t=a.$implicit;o(2),y("ngIf",t.isEllipsis),o(),y("ngIf",!t.isEllipsis)}}const p={currentPage:1,totalPages:1,previousLabel:"Previous",nextLabel:"Next",className:""},c=class c{constructor(){n(this,"cn",q);n(this,"getPaginationState",K);n(this,"ICON_PATHS",Q);n(this,"bindControllerProps",U);n(this,"className",p.className);n(this,"currentPage",p.currentPage);n(this,"totalPages",p.totalPages);n(this,"previousLabel",p.previousLabel);n(this,"nextLabel",p.nextLabel);n(this,"onPageChange",new E)}trackByEntry0(a,t){return t.key}};n(c,"ɵfac",function(t){return new(t||c)}),n(c,"ɵcmp",O({type:c,selectors:[["spn-pagination"],["pagination"]],inputs:{className:"className",currentPage:"currentPage",totalPages:"totalPages",previousLabel:"previousLabel",nextLabel:"nextLabel"},outputs:{onPageChange:"onPageChange"},standalone:!1,decls:13,vars:13,consts:[["aria-label","Pagination"],["type","button",1,"inline-flex","h-9","items-center","gap-1","rounded-lg","border","border-transparent","bg-transparent","px-3","text-sm","font-medium","text-foreground-default","transition-colors","hover:bg-background-muted","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary","disabled:cursor-not-allowed","disabled:opacity-50",3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4","shrink-0"],["stroke-linecap","round","stroke-linejoin","round"],[1,"hidden","sm:inline"],[1,"flex","items-center","gap-1"],[4,"ngFor","ngForOf","ngForTrackBy"],[4,"ngIf"],["aria-hidden","true",1,"inline-flex","h-9","w-9","items-center","justify-center","text-sm","text-foreground-default"],["type","button",3,"click"]],template:function(t,e){t&1&&(i(0,"nav",0)(1,"button",1),m("click",function(){return e.getPaginationState(e.currentPage,e.totalPages).canPrev&&e.onPageChange&&e.onPageChange.emit(e.getPaginationState(e.currentPage,e.totalPages).current-1)}),N(),i(2,"svg",2),S(3,"path",3),s(),F(),i(4,"span",4),P(5),s()(),i(6,"ol",5),w(7,ee,4,2,"ng-container",6),s(),i(8,"button",1),m("click",function(){return e.getPaginationState(e.currentPage,e.totalPages).canNext&&e.onPageChange&&e.onPageChange.emit(e.getPaginationState(e.currentPage,e.totalPages).current+1)}),i(9,"span",4),P(10),s(),N(),i(11,"svg",2),S(12,"path",3),s()()()),t&2&&(L(e.cn("flex items-center gap-1",e.className)),u("data-ctrl",typeof e.bindControllerProps),o(),u("disabled",e.getPaginationState(e.currentPage,e.totalPages).canPrev?null:"")("aria-label",e.previousLabel),o(2),u("d",e.ICON_PATHS.chevronLeft),o(2),h(e.previousLabel),o(2),y("ngForOf",e.getPaginationState(e.currentPage,e.totalPages).entries)("ngForTrackBy",e.trackByEntry0),o(),u("disabled",e.getPaginationState(e.currentPage,e.totalPages).canNext?null:"")("aria-label",e.nextLabel),o(2),h(e.nextLabel),o(2),u("d",e.ICON_PATHS.chevronRight))},dependencies:[W,X],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let l=c;(typeof ngDevMode>"u"||ngDevMode)&&I(l,[{type:H,args:[{standalone:!1,selector:"spn-pagination, pagination",template:`
    <nav
      aria-label="Pagination"
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex items-center gap-1', className)"
    >
      <button
        type="button"
        class="inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        [attr.disabled]="(!getPaginationState(currentPage, totalPages).canPrev) ? '' : null"
        [attr.aria-label]="previousLabel"
        (click)="getPaginationState(currentPage, totalPages).canPrev && onPageChange && this.onPageChange.emit(getPaginationState(currentPage, totalPages).current - 1)"
      >
        <svg
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
          ></path>
        </svg>
        <span class="hidden sm:inline">{{previousLabel}}</span>
      </button>
      <ol class="flex items-center gap-1">
        <ng-container
          *ngFor="let entry of getPaginationState(currentPage, totalPages).entries; trackBy: trackByEntry0"
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
                [attr.aria-label]="'Page ' + entry.label"
                [class]="cn('inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', entry.isCurrent ? 'border-border-default bg-background-default text-foreground-default shadow-xs' : 'border-transparent bg-transparent text-foreground-default hover:bg-background-muted')"
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
        class="inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        [attr.disabled]="(!getPaginationState(currentPage, totalPages).canNext) ? '' : null"
        [attr.aria-label]="nextLabel"
        (click)="getPaginationState(currentPage, totalPages).canNext && onPageChange && this.onPageChange.emit(getPaginationState(currentPage, totalPages).current + 1)"
      >
        <span class="hidden sm:inline">{{nextLabel}}</span>
        <svg
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
          ></path>
        </svg>
      </button>
    </nav>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:d}],currentPage:[{type:d}],totalPages:[{type:d}],previousLabel:[{type:d}],nextLabel:[{type:d}],onPageChange:[{type:D}]});(typeof ngDevMode>"u"||ngDevMode)&&A(l,{className:"Pagination",filePath:"Pagination.ts",lineNumber:125});const g=class g{};n(g,"ɵfac",function(t){return new(t||g)}),n(g,"ɵmod",j({type:g})),n(g,"ɵinj",B({imports:[k]}));let _=g;(typeof ngDevMode>"u"||ngDevMode)&&I(_,[{type:V,args:[{declarations:[l],imports:[k],exports:[l]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&$(_,{declarations:[l],imports:[k],exports:[l]})})();export{_ as PaginationModule,l as default};

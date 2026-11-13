var N=Object.defineProperty;var S=(n,t,e)=>t in n?N(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var o=(n,t,e)=>S(n,typeof t!="symbol"?t+"":t,e);import{E as k,ɵ as T,a as w,b as O,c as P,j as _,d as u,p as f,u as C,v,t as s,e as g,s as D,O as M,I as l,C as H,f as j,N as A,g as E,h as V,i as b,k as B,l as F,m as p,n as J,q as h,r as I,y as U,z as q,A as z}from"./core.vpEFnhB-.js";import{a as G,I as K,d as L}from"./theme.CMj9otVT.js";import{C as x,N as Q,a as R}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const W=["*",[["","sortIcon",""],["","slot","sorticon"]],"*"],X=["*","[sortIcon],[slot=sortIcon]","*"];function Y(n,t){n&1&&z(0)}function Z(n,t){if(n&1&&(b(0),u(1,Y,1,0,"ng-container",3),I()),n&2){const e=p(2);s(),g("ngComponentOutlet",e.sortIcon)}}function $(n,t){if(n&1&&(b(0),U(),_(1,"svg",4),q(2,"path",5),f(),I()),n&2){const e=p(2);s(),C(e.cn("h-3.5 w-3.5 shrink-0 transition-colors",e.sortDirection!=="none"?"text-foreground-default":"text-foreground-subtle")),s(),v("d",e.sortDirection==="asc"?e.ICON_PATHS.chevronUp:e.ICON_PATHS.chevronDown)}}function ee(n,t){if(n&1){const e=V();b(0),_(1,"button",2),B("click",function(){F(e);const y=p();return J(y.onSort&&y.onSort.emit())}),_(2,"span"),h(3),f(),u(4,Z,2,1,"ng-container",1),h(5,1),u(6,$,3,3,"ng-container",1),f(),I()}if(n&2){const e=p();s(),C(e.cn("inline-flex cursor-pointer items-center gap-1.5 rounded-xs font-medium text-foreground-default select-none hover:text-foreground-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",e.align==="right"&&"ml-auto flex-row-reverse")),s(3),g("ngIf",e.sortIcon),s(2),g("ngIf",!e.sortIcon)}}function ne(n,t){n&1&&(b(0),h(1,2),I())}const d={align:"left",sortable:!1,sortDirection:"none",className:""},c=class c{constructor(){o(this,"cn",G);o(this,"ICON_PATHS",K);o(this,"bindControllerProps",L);o(this,"sortable",d.sortable);o(this,"sortDirection",d.sortDirection);o(this,"align",d.align);o(this,"className",d.className);o(this,"sortIcon");o(this,"onSort",new k)}};o(c,"ɵfac",function(e){return new(e||c)}),o(c,"ɵcmp",T({type:c,selectors:[["kd-table-header-cell"],["table-header-cell"]],inputs:{sortable:"sortable",sortDirection:"sortDirection",align:"align",className:"className",sortIcon:"sortIcon"},outputs:{onSort:"onSort"},standalone:!1,ngContentSelectors:X,decls:3,vars:6,consts:[["scope","col"],[4,"ngIf"],["type","button",3,"click"],[4,"ngComponentOutlet"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2"],["stroke-linecap","round","stroke-linejoin","round"]],template:function(e,r){e&1&&(P(W),_(0,"th",0),u(1,ee,7,4,"ng-container",1)(2,ne,2,0,"ng-container",1),f()),e&2&&(C(r.cn("px-4 py-3 text-sm font-medium text-foreground-default",r.align==="center"?"text-center":r.align==="right"?"text-right":"text-left",r.className)),v("data-ctrl",typeof r.bindControllerProps)("aria-sort",r.sortable?r.sortDirection==="asc"?"ascending":r.sortDirection==="desc"?"descending":"none":void 0),s(),g("ngIf",r.sortable),s(),g("ngIf",!r.sortable))},dependencies:[Q,R],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=c;(typeof ngDevMode>"u"||ngDevMode)&&D(a,[{type:H,args:[{standalone:!1,selector:"kd-table-header-cell, table-header-cell",template:`
    <th
      scope="col"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-sort]="sortable ? sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none' : undefined"
      [class]="cn('px-4 py-3 text-sm font-medium text-foreground-default', align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left', className)"
    >
      <ng-container *ngIf="sortable"
        ><button
          type="button"
          [class]="cn('inline-flex cursor-pointer items-center gap-1.5 rounded-xs font-medium text-foreground-default select-none hover:text-foreground-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', align === 'right' && 'ml-auto flex-row-reverse')"
          (click)="onSort && this.onSort.emit()"
        >
          <span><ng-content></ng-content></span>
          <ng-container *ngIf="sortIcon"><ng-container *ngComponentOutlet="sortIcon"></ng-container></ng-container><ng-content select="[sortIcon],[slot=sortIcon]"></ng-content>
          <ng-container *ngIf="!sortIcon"
            ><svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              [class]="cn('h-3.5 w-3.5 shrink-0 transition-colors', sortDirection !== 'none' ? 'text-foreground-default' : 'text-foreground-subtle')"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                [attr.d]="sortDirection === 'asc' ? ICON_PATHS.chevronUp : ICON_PATHS.chevronDown"
              ></path></svg
          ></ng-container></button
      ></ng-container>
      <ng-container *ngIf="!sortable"><ng-content></ng-content></ng-container>
    </th>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{sortable:[{type:l}],sortDirection:[{type:l}],align:[{type:l}],className:[{type:l}],sortIcon:[{type:l}],onSort:[{type:M}]});(typeof ngDevMode>"u"||ngDevMode)&&j(a,{className:"TableHeaderCell",filePath:"TableHeaderCell.ts",lineNumber:68});const i=class i{};o(i,"ɵfac",function(e){return new(e||i)}),o(i,"ɵmod",w({type:i})),o(i,"ɵinj",O({imports:[x]}));let m=i;(typeof ngDevMode>"u"||ngDevMode)&&D(m,[{type:A,args:[{declarations:[a],imports:[x],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&E(m,{declarations:[a],imports:[x],exports:[a]})})();export{m as TableHeaderCellModule,a as default};

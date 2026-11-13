var S=Object.defineProperty;var j=(t,a,e)=>a in t?S(t,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[a]=e;var n=(t,a,e)=>j(t,typeof a!="symbol"?a+"":a,e);import{ɵ as M,a as k,b as A,c as D,j as x,d as v,i as g,q as P,r as u,p as y,u as T,an as _,v as h,t as l,e as f,s as w,I as o,C as F,f as E,N as J,g as V,z as C,m as p,o as I,ao as N}from"./core.vpEFnhB-.js";import{a as q,e as z,d as O}from"./theme.CMj9otVT.js";import{C as b,a as B}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const G=["*"],H=()=>({row:"flex-row items-center gap-2 font-normal",stacked:"flex-col items-start gap-0.5 font-medium"}),K=()=>({left:"justify-start text-left",center:"justify-center text-center",right:"justify-end text-right tabular-nums"}),L=()=>({none:"hidden",success:"bg-success-default",warning:"bg-warning-default",destructive:"bg-destructive-default",info:"bg-info-default"});function Q(t,a){if(t&1&&(g(0),C(1,"img",1),u()),t&2){const e=p();l(),h("src",e.imageSrc)("alt",e.imageAlt)}}function R(t,a){if(t&1&&(g(0),C(1,"span",2),u()),t&2){const e=p();l(),T(e.cn("h-2 w-2 shrink-0 rounded-full",e.cva(e.status,_(2,L),"none")))}}function U(t,a){if(t&1&&(g(0),x(1,"span",3),I(2),y(),u()),t&2){const e=p();l(2),N(e.secondaryText)}}function W(t,a){if(t&1&&(g(0),x(1,"span",4),I(2),y(),u()),t&2){const e=p();l(2),N(e.badgeText)}}const r={layout:"row",align:"left",status:"none",secondaryText:"",badgeText:"",imageSrc:"",imageAlt:"",className:""},d=class d{constructor(){n(this,"cn",q);n(this,"cva",z);n(this,"bindControllerProps",O);n(this,"layout",r.layout);n(this,"align",r.align);n(this,"className",r.className);n(this,"imageSrc",r.imageSrc);n(this,"imageAlt",r.imageAlt);n(this,"status",r.status);n(this,"secondaryText",r.secondaryText);n(this,"badgeText",r.badgeText)}};n(d,"ɵfac",function(e){return new(e||d)}),n(d,"ɵcmp",M({type:d,selectors:[["kd-table-cell-value"],["table-cell-value"]],inputs:{layout:"layout",align:"align",className:"className",imageSrc:"imageSrc",imageAlt:"imageAlt",status:"status",secondaryText:"secondaryText",badgeText:"badgeText"},standalone:!1,ngContentSelectors:G,decls:7,vars:9,consts:[[4,"ngIf"],[1,"h-7","w-7","shrink-0","rounded","object-cover"],["aria-hidden","true"],[1,"text-xs","font-normal","text-foreground-muted"],[1,"inline-flex","h-5","items-center","rounded-full","bg-primary-subtle","px-2","py-0.5","text-xs","font-medium","text-primary-subtle-foreground"]],template:function(e,s){e&1&&(D(),x(0,"span"),v(1,Q,2,2,"ng-container",0)(2,R,2,3,"ng-container",0),g(3),P(4),u(),v(5,U,3,1,"ng-container",0)(6,W,3,1,"ng-container",0),y()),e&2&&(T(s.cn("flex min-w-0 text-sm text-foreground-default",s.cva(s.layout,_(7,H),"row"),s.cva(s.align,_(8,K),"left"),s.className)),h("data-ctrl",typeof s.bindControllerProps),l(),f("ngIf",s.imageSrc!==""),l(),f("ngIf",s.status!=="none"),l(3),f("ngIf",s.secondaryText!==""),l(),f("ngIf",s.badgeText!==""))},dependencies:[B],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let i=d;(typeof ngDevMode>"u"||ngDevMode)&&w(i,[{type:F,args:[{standalone:!1,selector:"kd-table-cell-value, table-cell-value",template:`
    <span
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex min-w-0 text-sm text-foreground-default', cva(layout, {
          row: 'flex-row items-center gap-2 font-normal',
          stacked: 'flex-col items-start gap-0.5 font-medium'
        }, 'row'), cva(align, {
          left: 'justify-start text-left',
          center: 'justify-center text-center',
          right: 'justify-end text-right tabular-nums'
        }, 'left'), className)"
      ><ng-container *ngIf="imageSrc !== ''"
        ><img
          class="h-7 w-7 shrink-0 rounded object-cover"
          [attr.src]="imageSrc"
          [attr.alt]="imageAlt"
      /></ng-container>
      <ng-container *ngIf="status !== 'none'"
        ><span
          aria-hidden="true"
          [class]="cn('h-2 w-2 shrink-0 rounded-full', cva(status, {
          none: 'hidden',
          success: 'bg-success-default',
          warning: 'bg-warning-default',
          destructive: 'bg-destructive-default',
          info: 'bg-info-default'
        }, 'none'))"
        ></span
      ></ng-container>
      <ng-container><ng-content></ng-content></ng-container>
      <ng-container *ngIf="secondaryText !== ''"
        ><span
          class="text-xs font-normal text-foreground-muted"
          >{{secondaryText}}</span
        ></ng-container
      >
      <ng-container *ngIf="badgeText !== ''"
        ><span
          class="inline-flex h-5 items-center rounded-full bg-primary-subtle px-2 py-0.5 text-xs font-medium text-primary-subtle-foreground"
          >{{badgeText}}</span
        ></ng-container
      ></span
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{layout:[{type:o}],align:[{type:o}],className:[{type:o}],imageSrc:[{type:o}],imageAlt:[{type:o}],status:[{type:o}],secondaryText:[{type:o}],badgeText:[{type:o}]});(typeof ngDevMode>"u"||ngDevMode)&&E(i,{className:"TableCellValue",filePath:"TableCellValue.ts",lineNumber:83});const c=class c{};n(c,"ɵfac",function(e){return new(e||c)}),n(c,"ɵmod",k({type:c})),n(c,"ɵinj",A({imports:[b]}));let m=c;(typeof ngDevMode>"u"||ngDevMode)&&w(m,[{type:J,args:[{declarations:[i],imports:[b],exports:[i]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&V(m,{declarations:[i],imports:[b],exports:[i]})})();export{m as TableCellValueModule,i as default};

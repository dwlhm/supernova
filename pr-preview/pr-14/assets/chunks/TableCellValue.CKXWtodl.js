var x=Object.defineProperty;var C=(a,n,e)=>n in a?x(a,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[n]=e;var t=(a,n,e)=>C(a,typeof n!="symbol"?n+"":n,e);import{ɵ as N,a as S,b as j,c as M,j as I,d as A,i as f,q as D,r as m,p as P,u as y,w as d,v,t as u,e as _,s as b,I as r,C as k,f as F,N as T,g as E,z as w,m as h}from"./core.BqS-lykr.js";import{a as J,d as q,b as z}from"./utils.BBpd638g.js";import{C as p,N as O}from"./common_module-chunk.DvGwmKFp.js";const B=["*"],G=()=>({row:"flex-row items-center gap-2 font-normal",stacked:"flex-col items-start gap-0.5 font-medium"}),H=()=>({left:"justify-start text-left",center:"justify-center text-center",right:"justify-end text-right tabular-nums"}),K=()=>({none:"hidden",success:"bg-success-default",warning:"bg-warning-default",destructive:"bg-destructive-default",info:"bg-info-default"});function L(a,n){if(a&1&&(f(0),w(1,"img",1),m()),a&2){const e=h();u(),v("src",e.imageSrc)("alt",e.imageAlt)}}function Q(a,n){if(a&1&&(f(0),w(1,"span",2),m()),a&2){const e=h();u(),y(e.cn("h-2 w-2 shrink-0 rounded-full",e.cva(e.status,d(2,K),"none")))}}const i={layout:"row",align:"left",status:"none",imageSrc:"",imageAlt:"",className:""},c=class c{constructor(){t(this,"cn",J);t(this,"cva",q);t(this,"bindControllerProps",z);t(this,"layout",i.layout);t(this,"align",i.align);t(this,"className",i.className);t(this,"imageSrc",i.imageSrc);t(this,"imageAlt",i.imageAlt);t(this,"status",i.status)}};t(c,"ɵfac",function(e){return new(e||c)}),t(c,"ɵcmp",N({type:c,selectors:[["spn-table-cell-value"],["table-cell-value"]],inputs:{layout:"layout",align:"align",className:"className",imageSrc:"imageSrc",imageAlt:"imageAlt",status:"status"},standalone:!1,ngContentSelectors:B,decls:5,vars:7,consts:[[4,"ngIf"],[1,"h-7","w-7","shrink-0","rounded-sm","object-cover"],["aria-hidden","true"]],template:function(e,s){e&1&&(M(),I(0,"span"),A(1,L,2,2,"ng-container",0)(2,Q,2,3,"ng-container",0),f(3),D(4),m(),P()),e&2&&(y(s.cn("flex min-w-0 text-sm text-foreground-default",s.cva(s.layout,d(5,G),"row"),s.cva(s.align,d(6,H),"left"),s.className)),v("data-ctrl",typeof s.bindControllerProps),u(),_("ngIf",s.imageSrc!==""),u(),_("ngIf",s.status!=="none"))},dependencies:[O],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let o=c;(typeof ngDevMode>"u"||ngDevMode)&&b(o,[{type:k,args:[{standalone:!1,selector:"spn-table-cell-value, table-cell-value",template:`
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
          class="h-7 w-7 shrink-0 rounded-sm object-cover"
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
      <ng-container><ng-content></ng-content></ng-container
    ></span>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{layout:[{type:r}],align:[{type:r}],className:[{type:r}],imageSrc:[{type:r}],imageAlt:[{type:r}],status:[{type:r}]});(typeof ngDevMode>"u"||ngDevMode)&&F(o,{className:"TableCellValue",filePath:"TableCellValue.ts",lineNumber:67});const l=class l{};t(l,"ɵfac",function(e){return new(e||l)}),t(l,"ɵmod",S({type:l})),t(l,"ɵinj",j({imports:[p]}));let g=l;(typeof ngDevMode>"u"||ngDevMode)&&b(g,[{type:T,args:[{declarations:[o],imports:[p],exports:[o]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&E(g,{declarations:[o],imports:[p],exports:[o]})})();export{g as TableCellValueModule,o as default};

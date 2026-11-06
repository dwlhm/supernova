var y=Object.defineProperty;var x=(n,t,e)=>t in n?y(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var a=(n,t,e)=>x(n,typeof t!="symbol"?t+"":t,e);import{ɵ as C,a as N,b,j as c,d as h,p as u,u as _,v as M,t as p,e as v,s as g,I as d,C as F,f as k,N as I,g as D,i as P,z as w,o as B,r as O,m as T,am as j}from"./core.BqS-lykr.js";import{a as S,b as E}from"./utils.BBpd638g.js";import{C as m,a as J}from"./common_module-chunk.DvGwmKFp.js";function z(n,t){if(n&1&&(P(0),c(1,"li",1),w(2,"span",2),c(3,"span",3),B(4),u()(),O()),n&2){const e=t.$implicit,o=T();p(2),_(o.cn("h-2 w-2 shrink-0 rounded-full",e.colorClass)),p(2),j(e.label)}}const f={items:[],className:""},r=class r{constructor(){a(this,"cn",S);a(this,"bindControllerProps",E);a(this,"className",f.className);a(this,"items",f.items)}trackByItem0(t,e){return e.label}};a(r,"ɵfac",function(e){return new(e||r)}),a(r,"ɵcmp",C({type:r,selectors:[["spn-chart-legend"],["chart-legend"]],inputs:{className:"className",items:"items"},standalone:!1,decls:2,vars:5,consts:[[4,"ngFor","ngForOf","ngForTrackBy"],[1,"flex","items-center","gap-2"],["aria-hidden","true"],[1,"text-xs","text-foreground-muted"]],template:function(e,o){e&1&&(c(0,"ul"),h(1,z,5,3,"ng-container",0),u()),e&2&&(_(o.cn("flex flex-wrap items-center gap-4",o.className)),M("data-ctrl",typeof o.bindControllerProps),p(),v("ngForOf",o.items)("ngForTrackBy",o.trackByItem0))},dependencies:[J],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=r;(typeof ngDevMode>"u"||ngDevMode)&&g(s,[{type:F,args:[{standalone:!1,selector:"spn-chart-legend, chart-legend",template:`
    <ul
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex flex-wrap items-center gap-4', className)"
    >
      <ng-container *ngFor="let item of items; trackBy: trackByItem0"
        ><li class="flex items-center gap-2">
          <span
            aria-hidden="true"
            [class]="cn('h-2 w-2 shrink-0 rounded-full', item.colorClass)"
          ></span>
          <span class="text-xs text-foreground-muted">{{item.label}}</span>
        </li></ng-container
      >
    </ul>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:d}],items:[{type:d}]});(typeof ngDevMode>"u"||ngDevMode)&&k(s,{className:"ChartLegend",filePath:"ChartLegend.ts",lineNumber:44});const l=class l{};a(l,"ɵfac",function(e){return new(e||l)}),a(l,"ɵmod",N({type:l})),a(l,"ɵinj",b({imports:[m]}));let i=l;(typeof ngDevMode>"u"||ngDevMode)&&g(i,[{type:I,args:[{declarations:[s],imports:[m],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&D(i,{declarations:[s],imports:[m],exports:[s]})})();export{i as ChartLegendModule,s as default};

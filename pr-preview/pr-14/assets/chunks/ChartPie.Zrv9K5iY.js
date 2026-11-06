var S=Object.defineProperty;var P=(n,s,e)=>s in n?S(n,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[s]=e;var a=(n,s,e)=>P(n,typeof s!="symbol"?s+"":s,e);import{ɵ as R,a as N,b as T,j as f,y as v,d as h,p,u as x,v as g,t as d,e as _,s as k,I as l,C as M,f as I,N as F,g as j,i as C,z as B,r as b,m as w,w as L,o as y,am as D}from"./core.BqS-lykr.js";import{a as O,d as A,h as E,b as J}from"./utils.BBpd638g.js";import{C as m,a as W,N as z}from"./common_module-chunk.DvGwmKFp.js";const G=()=>({0:"stroke-chart-series-1",1:"stroke-chart-series-2",2:"stroke-chart-series-3",3:"stroke-chart-series-4",4:"stroke-chart-series-5"});function V(n,s){if(n&1&&(v(),C(0),B(1,"circle",4),b()),n&2){const e=s.$implicit,t=w();d(),x(t.cva(t.String(e.seriesIndex),L(6,G),"0")),g("r",t.getChartPieState(t.data,t.innerRadius).ringRadius)("stroke-width",t.getChartPieState(t.data,t.innerRadius).ringWidth)("stroke-dasharray",e.dashArray)("stroke-dashoffset",e.dashOffset)}}function $(n,s){if(n&1&&(C(0),f(1,"div",5)(2,"span",6),y(3,"Total"),p(),f(4,"span",7),y(5),p()(),b()),n&2){const e=w();d(5),D(e.getChartPieState(e.data,e.innerRadius).total)}}const c={data:[],innerRadius:0,showTooltip:!0,ariaLabel:"Pie chart",className:""},o=class o{constructor(){a(this,"String",String);a(this,"cn",O);a(this,"cva",A);a(this,"getChartPieState",E);a(this,"bindControllerProps",J);a(this,"className",c.className);a(this,"ariaLabel",c.ariaLabel);a(this,"data",c.data);a(this,"innerRadius",c.innerRadius);a(this,"showTooltip",c.showTooltip)}trackBySlice0(s,e){return e.key}};a(o,"ɵfac",function(e){return new(e||o)}),a(o,"ɵcmp",R({type:o,selectors:[["spn-chart-pie"],["chart-pie"]],inputs:{className:"className",ariaLabel:"ariaLabel",data:"data",innerRadius:"innerRadius",showTooltip:"showTooltip"},standalone:!1,decls:5,vars:7,consts:[[1,"relative","flex","items-center","justify-center"],["viewBox","0 0 100 100","role","img",1,"h-44","w-44","shrink-0","-rotate-90"],[4,"ngFor","ngForOf","ngForTrackBy"],[4,"ngIf"],["cx","50","cy","50","fill","none"],[1,"pointer-events-none","absolute","inset-0","flex","flex-col","items-center","justify-center","text-center","p-2"],[1,"w-16","truncate","text-xs","font-medium","text-foreground-muted"],[1,"w-16","truncate","text-sm","font-bold","text-foreground-default"]],template:function(e,t){e&1&&(f(0,"div")(1,"div",0),v(),f(2,"svg",1),h(3,V,2,7,"ng-container",2),p(),h(4,$,6,1,"ng-container",3),p()()),e&2&&(x(t.cn("relative flex w-full items-center justify-center",t.className)),g("data-ctrl",typeof t.bindControllerProps),d(2),g("aria-label",t.ariaLabel),d(),_("ngForOf",t.getChartPieState(t.data,t.innerRadius).slices)("ngForTrackBy",t.trackBySlice0),d(),_("ngIf",t.innerRadius>0&&t.showTooltip))},dependencies:[W,z],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let r=o;(typeof ngDevMode>"u"||ngDevMode)&&k(r,[{type:M,args:[{standalone:!1,selector:"spn-chart-pie, chart-pie",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('relative flex w-full items-center justify-center', className)"
    >
      <div class="relative flex items-center justify-center">
        <svg
          class="h-44 w-44 shrink-0 -rotate-90"
          viewBox="0 0 100 100"
          role="img"
          [attr.aria-label]="ariaLabel"
        >
          <ng-container
            *ngFor="let slice of getChartPieState(data, innerRadius).slices; trackBy: trackBySlice0"
          >
            <circle
              cx="50"
              cy="50"
              fill="none"
              [attr.r]="getChartPieState(data, innerRadius).ringRadius"
              [class]="cva(String(slice.seriesIndex), {
          '0': 'stroke-chart-series-1',
          '1': 'stroke-chart-series-2',
          '2': 'stroke-chart-series-3',
          '3': 'stroke-chart-series-4',
          '4': 'stroke-chart-series-5'
        }, '0')"
              [attr.stroke-width]="getChartPieState(data, innerRadius).ringWidth"
              [attr.stroke-dasharray]="slice.dashArray"
              [attr.stroke-dashoffset]="slice.dashOffset"
            ></circle>
          </ng-container>
        </svg>
        <ng-container *ngIf="innerRadius > 0 && showTooltip"
          ><div
            class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-2"
          >
            <span
              class="w-16 truncate text-xs font-medium text-foreground-muted"
              >Total</span
            >
            <span
              class="w-16 truncate text-sm font-bold text-foreground-default"
              >{{getChartPieState(data, innerRadius).total}}</span
            >
          </div></ng-container
        >
      </div>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:l}],ariaLabel:[{type:l}],data:[{type:l}],innerRadius:[{type:l}],showTooltip:[{type:l}]});(typeof ngDevMode>"u"||ngDevMode)&&I(r,{className:"ChartPie",filePath:"ChartPie.ts",lineNumber:87});const i=class i{};a(i,"ɵfac",function(e){return new(e||i)}),a(i,"ɵmod",N({type:i})),a(i,"ɵinj",T({imports:[m]}));let u=i;(typeof ngDevMode>"u"||ngDevMode)&&k(u,[{type:F,args:[{declarations:[r],imports:[m],exports:[r]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&j(u,{declarations:[r],imports:[m],exports:[r]})})();export{u as ChartPieModule,r as default};

var w=Object.defineProperty;var S=(o,s,t)=>s in o?w(o,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[s]=t;var a=(o,s,t)=>S(o,typeof s!="symbol"?s+"":s,t);import{ɵ as P,a as R,b as x,j as f,y as T,d as v,p as m,u,v as h,t as r,e as d,s as k,I as n,C as D,f as V,N as F,g as B,i as y,z as L,r as _,m as C,an as M,as as I,o as j,ao as O}from"./core.vpEFnhB-.js";import{a as z,e as A,m as E,d as J}from"./theme.CecfD-Na.js";import W,{TooltipModule as b}from"./Tooltip.NGGisPuL.js";import{C as N,b as $,a as G,c as q}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const H=()=>({0:"stroke-chart-series-1",1:"stroke-chart-series-2",2:"stroke-chart-series-3",3:"stroke-chart-series-4",4:"stroke-chart-series-5"}),K=(o,s)=>({left:o,top:s});function Q(o,s){if(o&1&&(T(),y(0),L(1,"circle",4),_()),o&2){const t=s.$implicit,e=C();r(),u(e.cva(e.String(t.seriesIndex),M(6,H),"0")),h("r",e.getChartPieState(e.data,e.innerRadius,e.formatTooltip,e.formatValue).ringRadius)("stroke-width",e.getChartPieState(e.data,e.innerRadius,e.formatTooltip,e.formatValue).ringWidth)("stroke-dasharray",t.dashArray)("stroke-dashoffset",t.dashOffset)}}function U(o,s){if(o&1&&(y(0),f(1,"div",5)(2,"kd-tooltip",6),L(3,"span",7),m()(),_()),o&2){const t=s.$implicit,e=C();r(),d("ngStyle",I(5,K,t.left,t.top)),r(),d("text",t.tooltipText)("position",e.tooltipPosition)("open",e.showTooltip?void 0:!1)("contentClassName",e.tooltipClassName)}}function X(o,s){if(o&1&&(y(0),f(1,"div",8)(2,"span"),j(3),m()(),_()),o&2){const t=C();r(2),u(t.cn("truncate font-semibold text-foreground-default",t.centerLabelClassName)),r(),O(t.centerLabel||t.getChartPieState(t.data,t.innerRadius,t.formatTooltip,t.formatValue).displayTotal)}}const i={data:[],innerRadius:0,centerLabel:"",showDataLabels:!0,showTooltip:!0,tooltipPosition:"top",tooltipClassName:"",chartClassName:"h-40 w-40",centerLabelClassName:"w-20 text-base",ariaLabel:"Pie chart",className:""},p=class p{constructor(){a(this,"String",String);a(this,"cn",z);a(this,"cva",A);a(this,"getChartPieState",E);a(this,"bindControllerProps",J);a(this,"className",i.className);a(this,"chartClassName",i.chartClassName);a(this,"ariaLabel",i.ariaLabel);a(this,"data",i.data);a(this,"innerRadius",i.innerRadius);a(this,"formatTooltip");a(this,"formatValue");a(this,"tooltipPosition",i.tooltipPosition);a(this,"showTooltip",i.showTooltip);a(this,"tooltipClassName",i.tooltipClassName);a(this,"showDataLabels",i.showDataLabels);a(this,"centerLabelClassName",i.centerLabelClassName);a(this,"centerLabel",i.centerLabel)}trackBySlice0(s,t){return t.key}trackBySlice1(s,t){return t.key}};a(p,"ɵfac",function(t){return new(t||p)}),a(p,"ɵcmp",P({type:p,selectors:[["kd-chart-pie"],["chart-pie"]],inputs:{className:"className",chartClassName:"chartClassName",ariaLabel:"ariaLabel",data:"data",innerRadius:"innerRadius",formatTooltip:"formatTooltip",formatValue:"formatValue",tooltipPosition:"tooltipPosition",showTooltip:"showTooltip",tooltipClassName:"tooltipClassName",showDataLabels:"showDataLabels",centerLabelClassName:"centerLabelClassName",centerLabel:"centerLabel"},standalone:!1,decls:6,vars:11,consts:[[1,"relative","flex","items-center","justify-center"],["viewBox","0 0 100 100","role","img"],[4,"ngFor","ngForOf","ngForTrackBy"],[4,"ngIf"],["cx","50","cy","50","fill","none"],[1,"absolute","z-10","-translate-x-1/2","-translate-y-1/2",3,"ngStyle"],[3,"text","position","open","contentClassName"],[1,"h-7","w-7","rounded-full"],[1,"pointer-events-none","absolute","inset-0","flex","flex-col","items-center","justify-center","p-2","text-center"]],template:function(t,e){t&1&&(f(0,"div")(1,"div",0),T(),f(2,"svg",1),v(3,Q,2,7,"ng-container",2),m(),v(4,U,4,8,"ng-container",2)(5,X,4,3,"ng-container",3),m()()),t&2&&(u(e.cn("relative flex w-full items-center justify-center",e.className)),h("data-ctrl",typeof e.bindControllerProps),r(2),u(e.cn("shrink-0 -rotate-90",e.chartClassName)),h("aria-label",e.ariaLabel),r(),d("ngForOf",e.getChartPieState(e.data,e.innerRadius,e.formatTooltip,e.formatValue).slices)("ngForTrackBy",e.trackBySlice0),r(),d("ngForOf",e.getChartPieState(e.data,e.innerRadius,e.formatTooltip,e.formatValue).slices)("ngForTrackBy",e.trackBySlice1),r(),d("ngIf",(e.innerRadius||0)>0&&(e.showDataLabels||e.showTooltip)))},dependencies:[$,G,q,W],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let l=p;(typeof ngDevMode>"u"||ngDevMode)&&k(l,[{type:D,args:[{standalone:!1,selector:"kd-chart-pie, chart-pie",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('relative flex w-full items-center justify-center', className)"
    >
      <div class="relative flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          role="img"
          [class]="cn('shrink-0 -rotate-90', chartClassName)"
          [attr.aria-label]="ariaLabel"
        >
          <ng-container
            *ngFor="let slice of getChartPieState(data, innerRadius, formatTooltip, formatValue).slices; trackBy: trackBySlice0"
          >
            <circle
              cx="50"
              cy="50"
              fill="none"
              [attr.r]="getChartPieState(data, innerRadius, formatTooltip, formatValue).ringRadius"
              [class]="cva(String(slice.seriesIndex), {
          '0': 'stroke-chart-series-1',
          '1': 'stroke-chart-series-2',
          '2': 'stroke-chart-series-3',
          '3': 'stroke-chart-series-4',
          '4': 'stroke-chart-series-5'
        }, '0')"
              [attr.stroke-width]="getChartPieState(data, innerRadius, formatTooltip, formatValue).ringWidth"
              [attr.stroke-dasharray]="slice.dashArray"
              [attr.stroke-dashoffset]="slice.dashOffset"
            ></circle>
          </ng-container>
        </svg>
        <ng-container
          *ngFor="let slice of getChartPieState(data, innerRadius, formatTooltip, formatValue).slices; trackBy: trackBySlice1"
          ><div
            class="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            [ngStyle]="{
          left: slice.left,
          top: slice.top
        }"
          >
            <kd-tooltip
              [text]="slice.tooltipText"
              [position]="tooltipPosition"
              [open]="showTooltip ? undefined : false"
              [contentClassName]="tooltipClassName"
              ><span class="h-7 w-7 rounded-full"></span
            ></kd-tooltip></div
        ></ng-container>
        <ng-container
          *ngIf="(innerRadius || 0) > 0 && (showDataLabels || showTooltip)"
          ><div
            class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-2 text-center"
          >
            <span
              [class]="cn('truncate font-semibold text-foreground-default', centerLabelClassName)"
              >{{centerLabel || getChartPieState(data, innerRadius, formatTooltip,
                  formatValue).displayTotal}}</span
            >
          </div></ng-container
        >
      </div>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:n}],chartClassName:[{type:n}],ariaLabel:[{type:n}],data:[{type:n}],innerRadius:[{type:n}],formatTooltip:[{type:n}],formatValue:[{type:n}],tooltipPosition:[{type:n}],showTooltip:[{type:n}],tooltipClassName:[{type:n}],showDataLabels:[{type:n}],centerLabelClassName:[{type:n}],centerLabel:[{type:n}]});(typeof ngDevMode>"u"||ngDevMode)&&V(l,{className:"ChartPie",filePath:"ChartPie.ts",lineNumber:124});const c=class c{};a(c,"ɵfac",function(t){return new(t||c)}),a(c,"ɵmod",R({type:c})),a(c,"ɵinj",x({imports:[N,b]}));let g=c;(typeof ngDevMode>"u"||ngDevMode)&&k(g,[{type:F,args:[{declarations:[l],imports:[N,b],exports:[l]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&B(g,{declarations:[l],imports:[N,b],exports:[l]})})();export{g as ChartPieModule,l as default};

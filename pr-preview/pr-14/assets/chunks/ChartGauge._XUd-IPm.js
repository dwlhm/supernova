var w=Object.defineProperty;var T=(i,s,e)=>s in i?w(i,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[s]=e;var a=(i,s,e)=>T(i,typeof s!="symbol"?s+"":s,e);import{ɵ as k,a as N,b as x,j as f,y as L,z as V,p as u,d as S,aq as P,o as h,u as C,v as d,t as n,e as y,ao as b,s as _,I as o,C as G,f as D,N as M,g as j,i as I,r as A,m as B}from"./core.vpEFnhB-.js";import{a as E,j as F,d as J}from"./theme.CecfD-Na.js";import q,{TooltipModule as v}from"./Tooltip.NGGisPuL.js";import{C as c,a as z}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";function H(i,s){if(i&1&&(I(0),f(1,"span",9),h(2),u(),A()),i&2){const e=B();n(2),b(e.label||e.getChartGaugeState(e.value,e.min,e.max,e.tooltip,e.formatTooltip,e.formatValue).displayValue)}}const l={value:75,min:0,max:100,label:"",tooltip:"",showDataLabels:!0,showTooltip:!0,tooltipPosition:"top",tooltipClassName:"",strokeClass:"stroke-chart-series-1",ariaLabel:"Gauge chart",className:""},m=class m{constructor(){a(this,"cn",E);a(this,"getChartGaugeState",F);a(this,"bindControllerProps",J);a(this,"className",l.className);a(this,"value",l.value);a(this,"min",l.min);a(this,"max",l.max);a(this,"tooltip",l.tooltip);a(this,"formatTooltip");a(this,"formatValue");a(this,"tooltipPosition",l.tooltipPosition);a(this,"showTooltip",l.showTooltip);a(this,"tooltipClassName",l.tooltipClassName);a(this,"ariaLabel",l.ariaLabel);a(this,"strokeClass",l.strokeClass);a(this,"showDataLabels",l.showDataLabels);a(this,"label",l.label)}};a(m,"ɵfac",function(e){return new(e||m)}),a(m,"ɵcmp",k({type:m,selectors:[["kd-chart-gauge"],["chart-gauge"]],inputs:{className:"className",value:"value",min:"min",max:"max",tooltip:"tooltip",formatTooltip:"formatTooltip",formatValue:"formatValue",tooltipPosition:"tooltipPosition",showTooltip:"showTooltip",tooltipClassName:"tooltipClassName",ariaLabel:"ariaLabel",strokeClass:"strokeClass",showDataLabels:"showDataLabels",label:"label"},standalone:!1,decls:13,vars:16,consts:[[1,"relative","flex","flex-col","items-center","justify-center"],[3,"text","position","open","contentClassName"],[1,"relative","flex","items-end","justify-center"],["viewBox","0 0 120 68","role","img",1,"h-28","w-48","shrink-0","overflow-visible"],["fill","none","stroke-width","12","stroke-linecap","butt",1,"stroke-background-muted"],["fill","none","stroke-width","12","stroke-linecap","butt"],[4,"ngIf"],[1,"flex","w-44","flex-row","items-center","justify-between","px-1"],[1,"text-xs","font-normal","text-foreground-muted"],[1,"absolute","bottom-1","text-center","text-2xl","font-semibold","text-foreground-default"]],template:function(e,t){e&1&&(f(0,"div")(1,"div",0)(2,"kd-tooltip",1)(3,"div",2),L(),f(4,"svg",3),V(5,"path",4)(6,"path",5),u(),S(7,H,3,1,"ng-container",6),u()(),P(),f(8,"div",7)(9,"span",8),h(10),u(),f(11,"span",8),h(12),u()()()()),e&2&&(C(t.cn("flex w-full flex-col items-center justify-start",t.className)),d("data-ctrl",typeof t.bindControllerProps),n(2),y("text",t.getChartGaugeState(t.value,t.min,t.max,t.tooltip,t.formatTooltip,t.formatValue).tooltipText)("position",t.tooltipPosition)("open",t.showTooltip?void 0:!1)("contentClassName",t.tooltipClassName),n(2),d("aria-label",t.ariaLabel),n(),d("d",t.getChartGaugeState(t.value,t.min,t.max,t.tooltip,t.formatTooltip,t.formatValue).arcPath),n(),C(t.strokeClass),d("d",t.getChartGaugeState(t.value,t.min,t.max,t.tooltip,t.formatTooltip,t.formatValue).arcPath)("stroke-dasharray",t.getChartGaugeState(t.value,t.min,t.max,t.tooltip,t.formatTooltip,t.formatValue).dashArray),n(),y("ngIf",t.showDataLabels),n(3),b(t.getChartGaugeState(t.value,t.min,t.max,t.tooltip,t.formatTooltip,t.formatValue).minLabel),n(2),b(t.getChartGaugeState(t.value,t.min,t.max,t.tooltip,t.formatTooltip,t.formatValue).maxLabel))},dependencies:[z,q],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let r=m;(typeof ngDevMode>"u"||ngDevMode)&&_(r,[{type:G,args:[{standalone:!1,selector:"kd-chart-gauge, chart-gauge",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col items-center justify-start', className)"
    >
      <div class="relative flex flex-col items-center justify-center">
        <kd-tooltip
          [text]="getChartGaugeState(value, min, max, tooltip, formatTooltip, formatValue).tooltipText"
          [position]="tooltipPosition"
          [open]="showTooltip ? undefined : false"
          [contentClassName]="tooltipClassName"
          ><div class="relative flex items-end justify-center">
            <svg
              class="h-28 w-48 shrink-0 overflow-visible"
              viewBox="0 0 120 68"
              role="img"
              [attr.aria-label]="ariaLabel"
            >
              <path
                fill="none"
                class="stroke-background-muted"
                stroke-width="12"
                stroke-linecap="butt"
                [attr.d]="getChartGaugeState(value, min, max, tooltip, formatTooltip, formatValue).arcPath"
              ></path>
              <path
                fill="none"
                stroke-width="12"
                stroke-linecap="butt"
                [attr.d]="getChartGaugeState(value, min, max, tooltip, formatTooltip, formatValue).arcPath"
                [class]="strokeClass"
                [attr.stroke-dasharray]="getChartGaugeState(value, min, max, tooltip, formatTooltip, formatValue).dashArray"
              ></path>
            </svg>
            <ng-container *ngIf="showDataLabels"
              ><span
                class="absolute bottom-1 text-center text-2xl font-semibold text-foreground-default"
                >{{label || getChartGaugeState(value, min, max, tooltip,
                    formatTooltip, formatValue).displayValue}}</span
              ></ng-container
            >
          </div></kd-tooltip
        >
        <div class="flex w-44 flex-row items-center justify-between px-1">
          <span
            class="text-xs font-normal text-foreground-muted"
            >{{getChartGaugeState(value, min, max, tooltip, formatTooltip,
                formatValue).minLabel}}</span
          >
          <span
            class="text-xs font-normal text-foreground-muted"
            >{{getChartGaugeState(value, min, max, tooltip, formatTooltip,
                formatValue).maxLabel}}</span
          >
        </div>
      </div>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:o}],value:[{type:o}],min:[{type:o}],max:[{type:o}],tooltip:[{type:o}],formatTooltip:[{type:o}],formatValue:[{type:o}],tooltipPosition:[{type:o}],showTooltip:[{type:o}],tooltipClassName:[{type:o}],ariaLabel:[{type:o}],strokeClass:[{type:o}],showDataLabels:[{type:o}],label:[{type:o}]});(typeof ngDevMode>"u"||ngDevMode)&&D(r,{className:"ChartGauge",filePath:"ChartGauge.ts",lineNumber:113});const p=class p{};a(p,"ɵfac",function(e){return new(e||p)}),a(p,"ɵmod",N({type:p})),a(p,"ɵinj",x({imports:[c,v]}));let g=p;(typeof ngDevMode>"u"||ngDevMode)&&_(g,[{type:M,args:[{declarations:[r],imports:[c,v],exports:[r]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&j(g,{declarations:[r],imports:[c,v],exports:[r]})})();export{g as ChartGaugeModule,r as default};

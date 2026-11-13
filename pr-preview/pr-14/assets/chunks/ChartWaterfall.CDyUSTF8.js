var L=Object.defineProperty;var B=(a,o,t)=>o in a?L(a,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[o]=t;var n=(a,o,t)=>B(a,typeof o!="symbol"?o+"":o,t);import{ɵ as I,a as j,b as F,j as r,d as g,p as c,u as C,v as k,t as l,e as f,s as N,I as s,C as V,f as W,N as D,g as P,i as m,r as u,m as h,z as b,as as M,o as w,ao as _}from"./core.vpEFnhB-.js";import{a as z,p as S,s as R,d as G}from"./theme.CecfD-Na.js";import O,{TooltipModule as v}from"./Tooltip.NGGisPuL.js";import{C as T,b as $,a as E,c as J}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const q=(a,o)=>({bottom:a,height:o});function A(a,o){if(a&1&&(m(0),r(1,"span",7),w(2),c(),u()),a&2){const t=o.$implicit;l(2),_(t)}}function H(a,o){if(a&1&&(m(0),r(1,"div",6),g(2,A,3,1,"ng-container",3),c(),u()),a&2){const t=h();l(2),f("ngForOf",t.yTicks)("ngForTrackBy",t.trackByTick0)}}function K(a,o){a&1&&(m(0),r(1,"div",8),b(2,"div",9)(3,"div",9)(4,"div",9)(5,"div",9)(6,"div",10),c(),u())}function Q(a,o){if(a&1&&(m(0),r(1,"span",14),w(2),c(),u()),a&2){const t=h().$implicit;l(2),_(t.displayValue)}}function U(a,o){if(a&1&&(m(0),r(1,"div",11)(2,"div",12),g(3,Q,3,1,"ng-container",1),r(4,"kd-tooltip",13),b(5,"div"),c()()(),u()),a&2){const t=o.$implicit,e=h();l(2),f("ngStyle",M(8,q,t.bottom,t.height)),l(),f("ngIf",e.showDataLabels),l(),f("text",t.tooltipText)("position",e.tooltipPosition)("open",e.showTooltip?void 0:!1)("contentClassName",e.tooltipClassName),l(),C(e.cn("h-full w-full rounded-xs transition-all duration-150",t.colorClass))}}function X(a,o){a&1&&(m(0),b(1,"div",15),u())}function Y(a,o){if(a&1&&(m(0),r(1,"span",16),w(2),c(),u()),a&2){const t=o.$implicit;l(2),_(t.label)}}const i={data:[],yTicks:[],maxValue:0,zoomRange:void 0,showGridLines:!0,showDataLabels:!1,showTooltip:!0,tooltipPosition:"top",tooltipClassName:"",ariaLabel:"Waterfall chart",className:""},x=class x{constructor(){n(this,"cn",z);n(this,"getChartWaterfallState",S);n(this,"sliceChartWindow",R);n(this,"bindControllerProps",G);n(this,"className",i.className);n(this,"yTicks",i.yTicks);n(this,"ariaLabel",i.ariaLabel);n(this,"showGridLines",i.showGridLines);n(this,"data",i.data);n(this,"zoomRange",i.zoomRange);n(this,"maxValue",i.maxValue);n(this,"formatTooltip");n(this,"formatValue");n(this,"showDataLabels",i.showDataLabels);n(this,"tooltipPosition",i.tooltipPosition);n(this,"showTooltip",i.showTooltip);n(this,"tooltipClassName",i.tooltipClassName)}trackByTick0(o,t){return t}trackByBar1(o,t){return t.key}trackByItem2(o,t){return t.label}};n(x,"ɵfac",function(t){return new(t||x)}),n(x,"ɵcmp",I({type:x,selectors:[["kd-chart-waterfall"],["chart-waterfall"]],inputs:{className:"className",yTicks:"yTicks",ariaLabel:"ariaLabel",showGridLines:"showGridLines",data:"data",zoomRange:"zoomRange",maxValue:"maxValue",formatTooltip:"formatTooltip",formatValue:"formatValue",showDataLabels:"showDataLabels",tooltipPosition:"tooltipPosition",showTooltip:"showTooltip",tooltipClassName:"tooltipClassName"},standalone:!1,decls:10,vars:11,consts:[[1,"flex","w-full","flex-row","items-end","justify-start","gap-2"],[4,"ngIf"],["role","img",1,"relative","flex","h-40","flex-1","flex-row","items-end","justify-between","gap-2","px-2"],[4,"ngFor","ngForOf","ngForTrackBy"],[1,"flex","w-full","flex-row","items-start","justify-start","gap-2"],[1,"flex","flex-1","flex-row","items-start","justify-between","px-2"],[1,"flex","h-40","w-7","flex-col","items-end","justify-between"],[1,"text-right","text-xs","font-normal","text-foreground-muted"],[1,"pointer-events-none","absolute","inset-0","flex","flex-col","justify-between"],[1,"h-px","w-full","bg-border-subtle"],[1,"h-px","w-full","bg-border-default"],[1,"relative","h-full","flex-1"],[1,"absolute","inset-x-1",3,"ngStyle"],["className","h-full w-full",3,"text","position","open","contentClassName"],[1,"pointer-events-none","absolute","bottom-full","left-1/2","mb-0.5","-translate-x-1/2","text-xs","font-medium","whitespace-nowrap","text-foreground-default"],[1,"h-px","w-7"],[1,"flex-1","text-center","text-xs","font-normal","text-foreground-muted"]],template:function(t,e){t&1&&(r(0,"div")(1,"div",0),g(2,H,3,2,"ng-container",1),r(3,"div",2),g(4,K,7,0,"ng-container",1)(5,U,6,11,"ng-container",3),c()(),r(6,"div",4),g(7,X,2,0,"ng-container",1),r(8,"div",5),g(9,Y,3,1,"ng-container",3),c()()()),t&2&&(C(e.cn("flex w-full flex-col items-start justify-start gap-3",e.className)),k("data-ctrl",typeof e.bindControllerProps),l(2),f("ngIf",e.yTicks&&e.yTicks.length>0),l(),k("aria-label",e.ariaLabel),l(),f("ngIf",e.showGridLines),l(),f("ngForOf",e.getChartWaterfallState(e.sliceChartWindow(e.data,e.zoomRange),e.maxValue,e.formatTooltip,e.formatValue).bars)("ngForTrackBy",e.trackByBar1),l(2),f("ngIf",e.yTicks&&e.yTicks.length>0),l(2),f("ngForOf",e.sliceChartWindow(e.data,e.zoomRange))("ngForTrackBy",e.trackByItem2))},dependencies:[$,E,J,O],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let d=x;(typeof ngDevMode>"u"||ngDevMode)&&N(d,[{type:V,args:[{standalone:!1,selector:"kd-chart-waterfall, chart-waterfall",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col items-start justify-start gap-3', className)"
    >
      <div class="flex w-full flex-row items-end justify-start gap-2">
        <ng-container *ngIf="yTicks && yTicks.length > 0"
          ><div class="flex h-40 w-7 flex-col items-end justify-between">
            <ng-container *ngFor="let tick of yTicks; trackBy: trackByTick0"
              ><span
                class="text-right text-xs font-normal text-foreground-muted"
                >{{tick}}</span
              ></ng-container
            >
          </div></ng-container
        >
        <div
          role="img"
          class="relative flex h-40 flex-1 flex-row items-end justify-between gap-2 px-2"
          [attr.aria-label]="ariaLabel"
        >
          <ng-container *ngIf="showGridLines"
            ><div
              class="pointer-events-none absolute inset-0 flex flex-col justify-between"
            >
              <div class="h-px w-full bg-border-subtle"></div>
              <div class="h-px w-full bg-border-subtle"></div>
              <div class="h-px w-full bg-border-subtle"></div>
              <div class="h-px w-full bg-border-subtle"></div>
              <div class="h-px w-full bg-border-default"></div></div
          ></ng-container>
          <ng-container
            *ngFor="let bar of getChartWaterfallState(sliceChartWindow(data, zoomRange), maxValue, formatTooltip, formatValue).bars; trackBy: trackByBar1"
            ><div class="relative h-full flex-1">
              <div
                class="absolute inset-x-1"
                [ngStyle]="{
          bottom: bar.bottom,
          height: bar.height
        }"
              >
                <ng-container *ngIf="showDataLabels"
                  ><span
                    class="pointer-events-none absolute bottom-full left-1/2 mb-0.5 -translate-x-1/2 text-xs font-medium whitespace-nowrap text-foreground-default"
                    >{{bar.displayValue}}</span
                  ></ng-container
                >
                <kd-tooltip
                  className="h-full w-full"
                  [text]="bar.tooltipText"
                  [position]="tooltipPosition"
                  [open]="showTooltip ? undefined : false"
                  [contentClassName]="tooltipClassName"
                  ><div
                    [class]="cn('h-full w-full rounded-xs transition-all duration-150', bar.colorClass)"
                  ></div
                ></kd-tooltip>
              </div></div
          ></ng-container>
        </div>
      </div>
      <div class="flex w-full flex-row items-start justify-start gap-2">
        <ng-container *ngIf="yTicks && yTicks.length > 0"
          ><div class="h-px w-7"></div
        ></ng-container>
        <div class="flex flex-1 flex-row items-start justify-between px-2">
          <ng-container
            *ngFor="let item of sliceChartWindow(data, zoomRange); trackBy: trackByItem2"
            ><span
              class="flex-1 text-center text-xs font-normal text-foreground-muted"
              >{{item.label}}</span
            ></ng-container
          >
        </div>
      </div>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:s}],yTicks:[{type:s}],ariaLabel:[{type:s}],showGridLines:[{type:s}],data:[{type:s}],zoomRange:[{type:s}],maxValue:[{type:s}],formatTooltip:[{type:s}],formatValue:[{type:s}],showDataLabels:[{type:s}],tooltipPosition:[{type:s}],showTooltip:[{type:s}],tooltipClassName:[{type:s}]});(typeof ngDevMode>"u"||ngDevMode)&&W(d,{className:"ChartWaterfall",filePath:"ChartWaterfall.ts",lineNumber:138});const p=class p{};n(p,"ɵfac",function(t){return new(t||p)}),n(p,"ɵmod",j({type:p})),n(p,"ɵinj",F({imports:[T,v]}));let y=p;(typeof ngDevMode>"u"||ngDevMode)&&N(y,[{type:D,args:[{declarations:[d],imports:[T,v],exports:[d]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&P(y,{declarations:[d],imports:[T,v],exports:[d]})})();export{y as ChartWaterfallModule,d as default};

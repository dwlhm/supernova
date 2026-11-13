var N=Object.defineProperty;var j=(a,o,t)=>o in a?N(a,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[o]=t;var s=(a,o,t)=>j(a,typeof o!="symbol"?o+"":o,t);import{ɵ as L,a as F,b as I,j as r,d,p as c,u as _,v as T,t as n,e as f,s as B,I as l,C as V,f as D,N as P,g as M,i as u,r as g,m as w,z as h,o as b,ao as v,w as R}from"./core.vpEFnhB-.js";import{a as z,f as S,s as G,d as O}from"./theme.CMj9otVT.js";import W,{TooltipModule as k}from"./Tooltip.BddMW6yj.js";import{C,b as $,a as E,c as J}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const q=a=>({height:a});function A(a,o){if(a&1&&(u(0),r(1,"span",8),b(2),c(),g()),a&2){const t=o.$implicit;n(2),v(t)}}function H(a,o){if(a&1&&(u(0),r(1,"div",7),d(2,A,3,1,"ng-container",4),c(),g()),a&2){const t=w();n(2),f("ngForOf",t.yTicks)("ngForTrackBy",t.trackByTick0)}}function K(a,o){a&1&&(u(0),r(1,"div",9),h(2,"div",10)(3,"div",10)(4,"div",10)(5,"div",10)(6,"div",11),c(),g())}function Q(a,o){if(a&1&&(u(0),r(1,"span",13),b(2),c(),g()),a&2){const t=w().$implicit;n(2),v(t.displayValue)}}function U(a,o){if(a&1&&(u(0),r(1,"div",14)(2,"kd-tooltip",15),h(3,"div"),c()(),g()),a&2){const t=o.$implicit,e=w(2);n(),f("ngStyle",R(7,q,t.height)),n(),f("text",t.tooltipText)("position",e.tooltipPosition)("open",e.showTooltip?void 0:!1)("contentClassName",e.tooltipClassName),n(),_(e.cn("h-full w-full transition-all duration-150",!e.stacked&&"rounded-t-xs",t.colorClass))}}function X(a,o){if(a&1&&(u(0),r(1,"div",12),d(2,Q,3,1,"ng-container",1),r(3,"div"),d(4,U,4,9,"ng-container",4),c()(),g()),a&2){const t=o.$implicit,e=w();n(2),f("ngIf",e.showDataLabels),n(),_(e.cn("flex w-full flex-1",e.stacked?"flex-col-reverse justify-start":"flex-row items-end justify-center gap-1")),n(),f("ngForOf",t.bars)("ngForTrackBy",e.trackByBar2)}}function Y(a,o){a&1&&(u(0),h(1,"div",16),g())}function Z(a,o){if(a&1&&(u(0),r(1,"span",17),b(2),c(),g()),a&2){const t=o.$implicit;n(2),v(t.label)}}const i={data:[],yTicks:[],maxValue:0,zoomRange:void 0,stacked:!1,showGridLines:!0,showDataLabels:!1,showTooltip:!0,tooltipPosition:"top",tooltipClassName:"",barColorClass:"bg-chart-series-1",ariaLabel:"Bar chart",className:""},y=class y{constructor(){s(this,"cn",z);s(this,"getChartBarState",S);s(this,"sliceChartWindow",G);s(this,"bindControllerProps",O);s(this,"className",i.className);s(this,"yTicks",i.yTicks);s(this,"ariaLabel",i.ariaLabel);s(this,"showGridLines",i.showGridLines);s(this,"data",i.data);s(this,"zoomRange",i.zoomRange);s(this,"barColorClass",i.barColorClass);s(this,"stacked",i.stacked);s(this,"maxValue",i.maxValue);s(this,"formatTooltip");s(this,"formatValue");s(this,"showDataLabels",i.showDataLabels);s(this,"tooltipPosition",i.tooltipPosition);s(this,"showTooltip",i.showTooltip);s(this,"tooltipClassName",i.tooltipClassName)}trackByTick0(o,t){return t}trackByRow1(o,t){return t.key}trackByBar2(o,t){return t.key}trackByItem3(o,t){return t.label}};s(y,"ɵfac",function(t){return new(t||y)}),s(y,"ɵcmp",L({type:y,selectors:[["kd-chart-bar"],["chart-bar"]],inputs:{className:"className",yTicks:"yTicks",ariaLabel:"ariaLabel",showGridLines:"showGridLines",data:"data",zoomRange:"zoomRange",barColorClass:"barColorClass",stacked:"stacked",maxValue:"maxValue",formatTooltip:"formatTooltip",formatValue:"formatValue",showDataLabels:"showDataLabels",tooltipPosition:"tooltipPosition",showTooltip:"showTooltip",tooltipClassName:"tooltipClassName"},standalone:!1,decls:11,vars:11,consts:[[1,"flex","w-full","flex-row","items-end","justify-start","gap-2"],[4,"ngIf"],["role","img",1,"relative","flex","h-40","flex-1","flex-col","items-start","justify-between"],[1,"relative","flex","h-full","w-full","flex-row","items-end","justify-between","gap-3","px-2"],[4,"ngFor","ngForOf","ngForTrackBy"],[1,"flex","w-full","flex-row","items-start","justify-start","gap-2"],[1,"flex","flex-1","flex-row","items-start","justify-between","px-2"],[1,"flex","h-40","w-7","flex-col","items-end","justify-between"],[1,"text-right","text-xs","font-normal","text-foreground-muted"],[1,"pointer-events-none","absolute","inset-0","flex","flex-col","justify-between"],[1,"h-px","w-full","bg-border-subtle"],[1,"h-px","w-full","bg-border-default"],[1,"flex","h-full","flex-1","flex-col","items-center","justify-end","gap-1"],[1,"text-xs","font-medium","text-foreground-default"],[1,"w-full",3,"ngStyle"],["className","h-full w-full",3,"text","position","open","contentClassName"],[1,"h-px","w-7"],[1,"flex-1","text-center","text-xs","font-normal","text-foreground-muted"]],template:function(t,e){t&1&&(r(0,"div")(1,"div",0),d(2,H,3,2,"ng-container",1),r(3,"div",2),d(4,K,7,0,"ng-container",1),r(5,"div",3),d(6,X,5,5,"ng-container",4),c()()(),r(7,"div",5),d(8,Y,2,0,"ng-container",1),r(9,"div",6),d(10,Z,3,1,"ng-container",4),c()()()),t&2&&(_(e.cn("flex w-full flex-col items-start justify-start gap-2",e.className)),T("data-ctrl",typeof e.bindControllerProps),n(2),f("ngIf",e.yTicks&&e.yTicks.length>0),n(),T("aria-label",e.ariaLabel),n(),f("ngIf",e.showGridLines),n(2),f("ngForOf",e.getChartBarState(e.sliceChartWindow(e.data,e.zoomRange),e.barColorClass,e.stacked,e.maxValue,e.formatTooltip,e.formatValue).rows)("ngForTrackBy",e.trackByRow1),n(2),f("ngIf",e.yTicks&&e.yTicks.length>0),n(2),f("ngForOf",e.sliceChartWindow(e.data,e.zoomRange))("ngForTrackBy",e.trackByItem3))},dependencies:[$,E,J,W],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let p=y;(typeof ngDevMode>"u"||ngDevMode)&&B(p,[{type:V,args:[{standalone:!1,selector:"kd-chart-bar, chart-bar",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col items-start justify-start gap-2', className)"
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
          class="relative flex h-40 flex-1 flex-col items-start justify-between"
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
          <div
            class="relative flex h-full w-full flex-row items-end justify-between gap-3 px-2"
          >
            <ng-container
              *ngFor="let row of getChartBarState(sliceChartWindow(data, zoomRange), barColorClass, stacked, maxValue, formatTooltip, formatValue).rows; trackBy: trackByRow1"
              ><div
                class="flex h-full flex-1 flex-col items-center justify-end gap-1"
              >
                <ng-container *ngIf="showDataLabels"
                  ><span
                    class="text-xs font-medium text-foreground-default"
                    >{{row.displayValue}}</span
                  ></ng-container
                >
                <div
                  [class]="cn('flex w-full flex-1', stacked ? 'flex-col-reverse justify-start' : 'flex-row items-end justify-center gap-1')"
                >
                  <ng-container
                    *ngFor="let bar of row.bars; trackBy: trackByBar2"
                    ><div
                      class="w-full"
                      [ngStyle]="{
          height: bar.height
        }"
                    >
                      <kd-tooltip
                        className="h-full w-full"
                        [text]="bar.tooltipText"
                        [position]="tooltipPosition"
                        [open]="showTooltip ? undefined : false"
                        [contentClassName]="tooltipClassName"
                        ><div
                          [class]="cn('h-full w-full transition-all duration-150', !stacked && 'rounded-t-xs', bar.colorClass)"
                        ></div
                      ></kd-tooltip></div
                  ></ng-container>
                </div></div
            ></ng-container>
          </div>
        </div>
      </div>
      <div class="flex w-full flex-row items-start justify-start gap-2">
        <ng-container *ngIf="yTicks && yTicks.length > 0"
          ><div class="h-px w-7"></div
        ></ng-container>
        <div class="flex flex-1 flex-row items-start justify-between px-2">
          <ng-container
            *ngFor="let item of sliceChartWindow(data, zoomRange); trackBy: trackByItem3"
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
    `]}]}],null,{className:[{type:l}],yTicks:[{type:l}],ariaLabel:[{type:l}],showGridLines:[{type:l}],data:[{type:l}],zoomRange:[{type:l}],barColorClass:[{type:l}],stacked:[{type:l}],maxValue:[{type:l}],formatTooltip:[{type:l}],formatValue:[{type:l}],showDataLabels:[{type:l}],tooltipPosition:[{type:l}],showTooltip:[{type:l}],tooltipClassName:[{type:l}]});(typeof ngDevMode>"u"||ngDevMode)&&D(p,{className:"ChartBar",filePath:"ChartBar.ts",lineNumber:148});const m=class m{};s(m,"ɵfac",function(t){return new(t||m)}),s(m,"ɵmod",F({type:m})),s(m,"ɵinj",I({imports:[C,k]}));let x=m;(typeof ngDevMode>"u"||ngDevMode)&&B(x,[{type:P,args:[{declarations:[p],imports:[C,k],exports:[p]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&M(x,{declarations:[p],imports:[C,k],exports:[p]})})();export{x as ChartBarModule,p as default};

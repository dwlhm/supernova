var P=Object.defineProperty;var B=(a,n,e)=>n in a?P(a,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[n]=e;var o=(a,n,e)=>B(a,typeof n!="symbol"?n+"":n,e);import{ɵ as D,a as V,b as I,j as c,d as f,y as x,p as d,u as y,v as b,t as s,e as r,s as N,I as i,C as F,f as j,N as S,g as z,i as p,r as g,m,z as C,as as R,o as v,ao as k}from"./core.vpEFnhB-.js";import{a as M,l as A,s as $,d as G}from"./theme.CecfD-Na.js";import W,{TooltipModule as T}from"./Tooltip.NGGisPuL.js";import{C as L,b as O,a as E,c as J}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const q=(a,n)=>({left:a,top:n});function H(a,n){if(a&1&&(p(0),c(1,"span",6),v(2),d(),g()),a&2){const e=n.$implicit;s(2),k(e)}}function K(a,n){if(a&1&&(p(0),c(1,"div",5),f(2,H,3,1,"ng-container",4),d(),g()),a&2){const e=m();s(2),r("ngForOf",e.yTicks)("ngForTrackBy",e.trackByTick0)}}function Q(a,n){a&1&&(p(0),c(1,"div",7),C(2,"div",8)(3,"div",8)(4,"div",8)(5,"div",8)(6,"div",9),d(),g())}function U(a,n){if(a&1&&(x(),p(0),C(1,"polygon"),g()),a&2){const e=m().$implicit,t=m();s(),y(t.cn(e.fillClass,"opacity-25")),b("points",e.areaPoints)}}function X(a,n){if(a&1&&(x(),p(0),c(1,"g"),f(2,U,2,3,"ng-container",1),C(3,"polyline",10),d(),g()),a&2){const e=n.$implicit,t=m();s(2),r("ngIf",t.area),s(),y(e.strokeClass),b("points",e.linePoints)}}function Y(a,n){if(a&1&&(p(0),c(1,"span",14),v(2),d(),g()),a&2){const e=m().$implicit;s(2),k(e.displayValue)}}function Z(a,n){if(a&1&&(p(0),C(1,"span"),g()),a&2){const e=m(2);s(),y(e.cn("h-2 w-2 origin-center rounded-full transition-transform duration-150 group-hover:scale-150",e.fillClass?e.fillClass.replace("fill-","bg-"):"bg-chart-series-1"))}}function ee(a,n){if(a&1&&(p(0),c(1,"div",11),f(2,Y,3,1,"ng-container",1),c(3,"kd-tooltip",12)(4,"div",13),f(5,Z,2,2,"ng-container",1),d()()(),g()),a&2){const e=n.$implicit,t=m();s(),r("ngStyle",R(7,q,`${e.x}%`,`${e.y}%`)),s(),r("ngIf",t.showDataLabels),s(),r("text",e.tooltipText)("position",t.tooltipPosition)("open",t.showTooltip?void 0:!1)("contentClassName",t.tooltipClassName),s(2),r("ngIf",t.showDots)}}function te(a,n){a&1&&(p(0),C(1,"div",17),g())}function ae(a,n){if(a&1&&(p(0),c(1,"span",18),v(2),d(),g()),a&2){const e=n.$implicit;s(2),k(e.label)}}function ne(a,n){if(a&1&&(p(0),c(1,"div",15),f(2,te,2,0,"ng-container",1),c(3,"div",16),f(4,ae,3,1,"ng-container",4),d()(),g()),a&2){const e=m();s(2),r("ngIf",e.yTicks&&e.yTicks.length>0),s(2),r("ngForOf",e.getChartLineState(e.sliceChartWindow(e.data,e.zoomRange),e.strokeClass,e.fillClass,e.maxValue).points)("ngForTrackBy",e.trackByPoint3)}}const l={data:[],yTicks:[],maxValue:0,zoomRange:void 0,area:!1,showGridLines:!0,showDataLabels:!1,showAxisLabels:!0,showDots:!0,showTooltip:!0,tooltipPosition:"top",tooltipClassName:"",strokeClass:"stroke-chart-series-1",fillClass:"fill-chart-series-1",chartClassName:"h-40",ariaLabel:"Line chart",className:""},h=class h{constructor(){o(this,"cn",M);o(this,"getChartLineState",A);o(this,"sliceChartWindow",$);o(this,"bindControllerProps",G);o(this,"className",l.className);o(this,"yTicks",l.yTicks);o(this,"chartClassName",l.chartClassName);o(this,"ariaLabel",l.ariaLabel);o(this,"showGridLines",l.showGridLines);o(this,"data",l.data);o(this,"zoomRange",l.zoomRange);o(this,"strokeClass",l.strokeClass);o(this,"fillClass",l.fillClass);o(this,"maxValue",l.maxValue);o(this,"formatTooltip");o(this,"formatValue");o(this,"area",l.area);o(this,"showDataLabels",l.showDataLabels);o(this,"tooltipPosition",l.tooltipPosition);o(this,"showTooltip",l.showTooltip);o(this,"tooltipClassName",l.tooltipClassName);o(this,"showDots",l.showDots);o(this,"showAxisLabels",l.showAxisLabels)}trackByTick0(n,e){return e}trackByLine1(n,e){return e.key}trackByPoint2(n,e){return e.key}trackByPoint3(n,e){return e.key}};o(h,"ɵfac",function(e){return new(e||h)}),o(h,"ɵcmp",D({type:h,selectors:[["kd-chart-line"],["chart-line"]],inputs:{className:"className",yTicks:"yTicks",chartClassName:"chartClassName",ariaLabel:"ariaLabel",showGridLines:"showGridLines",data:"data",zoomRange:"zoomRange",strokeClass:"strokeClass",fillClass:"fillClass",maxValue:"maxValue",formatTooltip:"formatTooltip",formatValue:"formatValue",area:"area",showDataLabels:"showDataLabels",tooltipPosition:"tooltipPosition",showTooltip:"showTooltip",tooltipClassName:"tooltipClassName",showDots:"showDots",showAxisLabels:"showAxisLabels"},standalone:!1,decls:9,vars:13,consts:[[1,"flex","w-full","flex-row","items-end","justify-start","gap-2"],[4,"ngIf"],["role","img"],["viewBox","0 0 100 100","preserveAspectRatio","none","aria-hidden","true",1,"absolute","inset-0","h-full","w-full","overflow-visible"],[4,"ngFor","ngForOf","ngForTrackBy"],[1,"flex","h-40","w-7","flex-col","items-end","justify-between"],[1,"text-right","text-xs","font-normal","text-foreground-muted"],["aria-hidden","true",1,"pointer-events-none","absolute","inset-0","flex","flex-col","justify-between"],[1,"border-t","border-border-subtle"],[1,"border-t","border-border-default"],["fill","none","stroke-width","2","vector-effect","non-scaling-stroke","stroke-linecap","round","stroke-linejoin","round"],[1,"absolute","z-10","-translate-x-1/2","-translate-y-1/2",3,"ngStyle"],[3,"text","position","open","contentClassName"],[1,"flex","h-5","w-5","items-center","justify-center"],[1,"pointer-events-none","absolute","bottom-full","left-1/2","mb-1","-translate-x-1/2","text-xs","font-medium","text-foreground-default"],[1,"flex","w-full","flex-row","items-start","justify-start","gap-2"],[1,"flex","flex-1","flex-row","items-start","justify-between"],[1,"h-px","w-7"],[1,"flex-1","truncate","text-center","text-xs","text-foreground-muted"]],template:function(e,t){e&1&&(c(0,"div")(1,"div",0),f(2,K,3,2,"ng-container",1),c(3,"div",2),f(4,Q,7,0,"ng-container",1),x(),c(5,"svg",3),f(6,X,4,4,"ng-container",4),d(),f(7,ee,6,10,"ng-container",4),d()(),f(8,ne,5,3,"ng-container",1),d()),e&2&&(y(t.cn("flex w-full flex-col gap-2",t.className)),b("data-ctrl",typeof t.bindControllerProps),s(2),r("ngIf",t.yTicks&&t.yTicks.length>0),s(),y(t.cn("relative flex-1",t.chartClassName)),b("aria-label",t.ariaLabel),s(),r("ngIf",t.showGridLines),s(2),r("ngForOf",t.getChartLineState(t.sliceChartWindow(t.data,t.zoomRange),t.strokeClass,t.fillClass,t.maxValue,t.formatTooltip,t.formatValue).lines)("ngForTrackBy",t.trackByLine1),s(),r("ngForOf",t.getChartLineState(t.sliceChartWindow(t.data,t.zoomRange),t.strokeClass,t.fillClass,t.maxValue,t.formatTooltip,t.formatValue).points)("ngForTrackBy",t.trackByPoint2),s(),r("ngIf",t.showAxisLabels))},dependencies:[O,E,J,W],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let u=h;(typeof ngDevMode>"u"||ngDevMode)&&N(u,[{type:F,args:[{standalone:!1,selector:"kd-chart-line, chart-line",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-2', className)"
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
          [class]="cn('relative flex-1', chartClassName)"
          [attr.aria-label]="ariaLabel"
        >
          <ng-container *ngIf="showGridLines"
            ><div
              class="pointer-events-none absolute inset-0 flex flex-col justify-between"
              aria-hidden="true"
            >
              <div class="border-t border-border-subtle"></div>
              <div class="border-t border-border-subtle"></div>
              <div class="border-t border-border-subtle"></div>
              <div class="border-t border-border-subtle"></div>
              <div class="border-t border-border-default"></div></div
          ></ng-container>
          <svg
            class="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <ng-container
              *ngFor="let line of getChartLineState(sliceChartWindow(data, zoomRange), strokeClass, fillClass, maxValue, formatTooltip, formatValue).lines; trackBy: trackByLine1"
            >
              <g>
                <ng-container *ngIf="area">
                  <polygon
                    [class]="cn(line.fillClass, 'opacity-25')"
                    [attr.points]="line.areaPoints"
                  ></polygon>
                </ng-container>
                <polyline
                  fill="none"
                  stroke-width="2"
                  vector-effect="non-scaling-stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  [class]="line.strokeClass"
                  [attr.points]="line.linePoints"
                ></polyline>
              </g>
            </ng-container>
          </svg>
          <ng-container
            *ngFor="let point of getChartLineState(sliceChartWindow(data, zoomRange), strokeClass, fillClass, maxValue, formatTooltip, formatValue).points; trackBy: trackByPoint2"
            ><div
              class="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              [ngStyle]="{
          left: \`\${point.x}%\`,
          top: \`\${point.y}%\`
        }"
            >
              <ng-container *ngIf="showDataLabels"
                ><span
                  class="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 text-xs font-medium text-foreground-default"
                  >{{point.displayValue}}</span
                ></ng-container
              >
              <kd-tooltip
                [text]="point.tooltipText"
                [position]="tooltipPosition"
                [open]="showTooltip ? undefined : false"
                [contentClassName]="tooltipClassName"
                ><div class="flex h-5 w-5 items-center justify-center">
                  <ng-container *ngIf="showDots"
                    ><span
                      [class]="cn('h-2 w-2 origin-center rounded-full transition-transform duration-150 group-hover:scale-150', fillClass ? fillClass.replace('fill-', 'bg-') : 'bg-chart-series-1')"
                    ></span
                  ></ng-container></div
              ></kd-tooltip></div
          ></ng-container>
        </div>
      </div>
      <ng-container *ngIf="showAxisLabels"
        ><div class="flex w-full flex-row items-start justify-start gap-2">
          <ng-container *ngIf="yTicks && yTicks.length > 0"
            ><div class="h-px w-7"></div
          ></ng-container>
          <div class="flex flex-1 flex-row items-start justify-between">
            <ng-container
              *ngFor="let point of getChartLineState(sliceChartWindow(data, zoomRange), strokeClass, fillClass, maxValue).points; trackBy: trackByPoint3"
              ><span
                class="flex-1 truncate text-center text-xs text-foreground-muted"
                >{{point.label}}</span
              ></ng-container
            >
          </div>
        </div></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:i}],yTicks:[{type:i}],chartClassName:[{type:i}],ariaLabel:[{type:i}],showGridLines:[{type:i}],data:[{type:i}],zoomRange:[{type:i}],strokeClass:[{type:i}],fillClass:[{type:i}],maxValue:[{type:i}],formatTooltip:[{type:i}],formatValue:[{type:i}],area:[{type:i}],showDataLabels:[{type:i}],tooltipPosition:[{type:i}],showTooltip:[{type:i}],tooltipClassName:[{type:i}],showDots:[{type:i}],showAxisLabels:[{type:i}]});(typeof ngDevMode>"u"||ngDevMode)&&j(u,{className:"ChartLine",filePath:"ChartLine.ts",lineNumber:181});const _=class _{};o(_,"ɵfac",function(e){return new(e||_)}),o(_,"ɵmod",V({type:_})),o(_,"ɵinj",I({imports:[L,T]}));let w=_;(typeof ngDevMode>"u"||ngDevMode)&&N(w,[{type:S,args:[{declarations:[u],imports:[L,T],exports:[u]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&z(w,{declarations:[u],imports:[L,T],exports:[u]})})();export{w as ChartLineModule,u as default};

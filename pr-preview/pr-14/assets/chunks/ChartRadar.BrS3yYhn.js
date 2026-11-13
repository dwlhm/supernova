var V=Object.defineProperty;var S=(o,e,t)=>e in o?V(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var r=(o,e,t)=>S(o,typeof e!="symbol"?e+"":e,t);import{ɵ as w,a as N,b as F,j as u,y as g,d as C,p as _,u as T,v as c,t as n,e as l,s as b,I as s,C as R,f as P,N as M,g as D,i as m,z as k,r as y,m as B,o as O,x as L,as as j}from"./core.vpEFnhB-.js";import{a as $,n as I,d as z}from"./theme.CecfD-Na.js";import A,{TooltipModule as x}from"./Tooltip.NGGisPuL.js";import{C as v,b as E,c as J}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const G=(o,e)=>({left:o,top:e});function q(o,e){if(o&1&&(g(),m(0),k(1,"polygon",3),y()),o&2){const t=e.$implicit;n(),c("points",t.points)}}function H(o,e){if(o&1&&(g(),m(0),k(1,"line",4),y()),o&2){const t=e.$implicit;n(),c("x1",t.x1)("y1",t.y1)("x2",t.x2)("y2",t.y2)}}function K(o,e){if(o&1&&(g(),m(0),k(1,"circle",6),y()),o&2){const t=e.$implicit;n(),T(t.fillClass),c("cx",t.cx)("cy",t.cy)}}function Q(o,e){if(o&1&&(g(),m(0),u(1,"g"),k(2,"polygon",5),C(3,K,2,4,"ng-container",2),_(),y()),o&2){const t=e.$implicit,a=B();n(2),T(a.cn(t.fillClass,t.strokeClass,"fill-opacity-20")),c("points",t.points),n(),l("ngForOf",t.dots)("ngForTrackBy",a.trackByDot3)}}function U(o,e){if(o&1&&(g(),m(0),u(1,"text",7),O(2),_(),y()),o&2){const t=e.$implicit;n(),c("x",t.x)("y",t.y),n(),L(" ",t.label," ")}}function W(o,e){if(o&1&&(m(0),u(1,"div",8)(2,"kd-tooltip",9),k(3,"span",10),_()(),y()),o&2){const t=e.$implicit,a=B();n(),l("ngStyle",j(5,G,t.left,t.top)),n(),l("text",t.tooltipText)("position",a.tooltipPosition)("open",a.showTooltip?void 0:!1)("contentClassName",a.tooltipClassName)}}const i={data:[],rings:3,maxValue:100,showTooltip:!0,tooltipPosition:"top",tooltipClassName:"",ariaLabel:"Radar chart",className:""},f=class f{constructor(){r(this,"cn",$);r(this,"getChartRadarState",I);r(this,"bindControllerProps",z);r(this,"className",i.className);r(this,"ariaLabel",i.ariaLabel);r(this,"data",i.data);r(this,"rings",i.rings);r(this,"maxValue",i.maxValue);r(this,"formatTooltip");r(this,"formatValue");r(this,"tooltipPosition",i.tooltipPosition);r(this,"showTooltip",i.showTooltip);r(this,"tooltipClassName",i.tooltipClassName)}trackByRing0(e,t){return t.key}trackBySpoke1(e,t){return t.key}trackBySerie2(e,t){return t.key}trackByDot3(e,t){return t.key}trackByAxis4(e,t){return t.key}trackBySpot5(e,t){return t.key}};r(f,"ɵfac",function(t){return new(t||f)}),r(f,"ɵcmp",w({type:f,selectors:[["kd-chart-radar"],["chart-radar"]],inputs:{className:"className",ariaLabel:"ariaLabel",data:"data",rings:"rings",maxValue:"maxValue",formatTooltip:"formatTooltip",formatValue:"formatValue",tooltipPosition:"tooltipPosition",showTooltip:"showTooltip",tooltipClassName:"tooltipClassName"},standalone:!1,decls:8,vars:14,consts:[[1,"relative","flex","h-44","w-44","items-center","justify-center"],["viewBox","0 0 200 200","role","img",1,"h-44","w-44","shrink-0","overflow-visible"],[4,"ngFor","ngForOf","ngForTrackBy"],["fill","none","stroke-width","1",1,"stroke-border-default"],["stroke-width","1",1,"stroke-border-default"],["stroke-width","1.5"],["r","2.5"],["text-anchor","middle","dominant-baseline","middle",1,"fill-foreground-muted","text-xs","font-normal"],[1,"absolute","z-10","-translate-x-1/2","-translate-y-1/2",3,"ngStyle"],[3,"text","position","open","contentClassName"],[1,"block","h-5","w-5","rounded-full"]],template:function(t,a){t&1&&(u(0,"div")(1,"div",0),g(),u(2,"svg",1),C(3,q,2,1,"ng-container",2)(4,H,2,4,"ng-container",2)(5,Q,4,5,"ng-container",2)(6,U,3,3,"ng-container",2),_(),C(7,W,4,8,"ng-container",2),_()()),t&2&&(T(a.cn("flex w-full flex-col items-center justify-start",a.className)),c("data-ctrl",typeof a.bindControllerProps),n(2),c("aria-label",a.ariaLabel),n(),l("ngForOf",a.getChartRadarState(a.data,a.rings,a.maxValue,a.formatTooltip,a.formatValue).ringPolygons)("ngForTrackBy",a.trackByRing0),n(),l("ngForOf",a.getChartRadarState(a.data,a.rings,a.maxValue,a.formatTooltip,a.formatValue).spokes)("ngForTrackBy",a.trackBySpoke1),n(),l("ngForOf",a.getChartRadarState(a.data,a.rings,a.maxValue,a.formatTooltip,a.formatValue).series)("ngForTrackBy",a.trackBySerie2),n(),l("ngForOf",a.getChartRadarState(a.data,a.rings,a.maxValue,a.formatTooltip,a.formatValue).axes)("ngForTrackBy",a.trackByAxis4),n(),l("ngForOf",a.getChartRadarState(a.data,a.rings,a.maxValue,a.formatTooltip,a.formatValue).hotspots)("ngForTrackBy",a.trackBySpot5))},dependencies:[E,J,A],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let p=f;(typeof ngDevMode>"u"||ngDevMode)&&b(p,[{type:R,args:[{standalone:!1,selector:"kd-chart-radar, chart-radar",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col items-center justify-start', className)"
    >
      <div class="relative flex h-44 w-44 items-center justify-center">
        <svg
          class="h-44 w-44 shrink-0 overflow-visible"
          viewBox="0 0 200 200"
          role="img"
          [attr.aria-label]="ariaLabel"
        >
          <ng-container
            *ngFor="let ring of getChartRadarState(data, rings, maxValue, formatTooltip, formatValue).ringPolygons; trackBy: trackByRing0"
          >
            <polygon
              fill="none"
              class="stroke-border-default"
              stroke-width="1"
              [attr.points]="ring.points"
            ></polygon>
          </ng-container>
          <ng-container
            *ngFor="let spoke of getChartRadarState(data, rings, maxValue, formatTooltip, formatValue).spokes; trackBy: trackBySpoke1"
          >
            <line
              class="stroke-border-default"
              stroke-width="1"
              [attr.x1]="spoke.x1"
              [attr.y1]="spoke.y1"
              [attr.x2]="spoke.x2"
              [attr.y2]="spoke.y2"
            ></line>
          </ng-container>
          <ng-container
            *ngFor="let serie of getChartRadarState(data, rings, maxValue, formatTooltip, formatValue).series; trackBy: trackBySerie2"
          >
            <g>
              <polygon
                stroke-width="1.5"
                [attr.points]="serie.points"
                [class]="cn(serie.fillClass, serie.strokeClass, 'fill-opacity-20')"
              ></polygon>
              <ng-container
                *ngFor="let dot of serie.dots; trackBy: trackByDot3"
              >
                <circle
                  r="2.5"
                  [attr.cx]="dot.cx"
                  [attr.cy]="dot.cy"
                  [class]="dot.fillClass"
                ></circle>
              </ng-container>
            </g>
          </ng-container>
          <ng-container
            *ngFor="let axis of getChartRadarState(data, rings, maxValue, formatTooltip, formatValue).axes; trackBy: trackByAxis4"
          >
            <text
              text-anchor="middle"
              dominant-baseline="middle"
              class="fill-foreground-muted text-xs font-normal"
              [attr.x]="axis.x"
              [attr.y]="axis.y"
            >
              {{axis.label}}
            </text>
          </ng-container>
        </svg>
        <ng-container
          *ngFor="let spot of getChartRadarState(data, rings, maxValue, formatTooltip, formatValue).hotspots; trackBy: trackBySpot5"
          ><div
            class="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            [ngStyle]="{
          left: spot.left,
          top: spot.top
        }"
          >
            <kd-tooltip
              [text]="spot.tooltipText"
              [position]="tooltipPosition"
              [open]="showTooltip ? undefined : false"
              [contentClassName]="tooltipClassName"
              ><span class="block h-5 w-5 rounded-full"></span
            ></kd-tooltip></div
        ></ng-container>
      </div>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:s}],ariaLabel:[{type:s}],data:[{type:s}],rings:[{type:s}],maxValue:[{type:s}],formatTooltip:[{type:s}],formatValue:[{type:s}],tooltipPosition:[{type:s}],showTooltip:[{type:s}],tooltipClassName:[{type:s}]});(typeof ngDevMode>"u"||ngDevMode)&&P(p,{className:"ChartRadar",filePath:"ChartRadar.ts",lineNumber:137});const d=class d{};r(d,"ɵfac",function(t){return new(t||d)}),r(d,"ɵmod",N({type:d})),r(d,"ɵinj",F({imports:[v,x]}));let h=d;(typeof ngDevMode>"u"||ngDevMode)&&b(h,[{type:M,args:[{declarations:[p],imports:[v,x],exports:[p]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&D(h,{declarations:[p],imports:[v,x],exports:[p]})})();export{h as ChartRadarModule,p as default};

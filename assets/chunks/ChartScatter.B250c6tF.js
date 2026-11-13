var L=Object.defineProperty;var S=(e,a,t)=>a in e?L(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t;var n=(e,a,t)=>S(e,typeof a!="symbol"?a+"":a,t);import{ɵ as j,a as P,b as I,j as r,d as u,p as f,u as C,v,t as s,e as c,s as N,I as i,C as B,f as F,N as D,g as M,i as d,r as m,m as y,z as h,as as X,o as T,ao as b}from"./core.vpEFnhB-.js";import{a as G,o as Y,d as O}from"./theme.CMj9otVT.js";import V,{TooltipModule as k}from"./Tooltip.BddMW6yj.js";import{C as w,b as $,a as z,c as E}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const J=(e,a)=>({left:e,top:a});function q(e,a){if(e&1&&(d(0),r(1,"span",5),T(2),f(),m()),e&2){const t=a.$implicit;s(2),b(t)}}function A(e,a){if(e&1&&(d(0),r(1,"div",4),u(2,q,3,1,"ng-container",3),f(),m()),e&2){const t=y();s(2),c("ngForOf",t.yTicks)("ngForTrackBy",t.trackByTick0)}}function H(e,a){e&1&&(d(0),r(1,"div",6),h(2,"div",7)(3,"div",7)(4,"div",7)(5,"div",7)(6,"div",8),f(),m())}function K(e,a){if(e&1&&(d(0),r(1,"span",12),T(2),f(),m()),e&2){const t=y().$implicit;s(2),b(t.label)}}function Q(e,a){if(e&1&&(d(0),r(1,"div",9),u(2,K,3,1,"ng-container",1),r(3,"kd-tooltip",10)(4,"span",11),h(5,"span"),f()()(),m()),e&2){const t=a.$implicit,o=y();s(),c("ngStyle",X(8,J,t.left,t.top)),s(),c("ngIf",o.showDataLabels),s(),c("text",t.tooltipText)("position",o.tooltipPosition)("open",o.showTooltip?void 0:!1)("contentClassName",o.tooltipClassName),s(2),C(o.cn("block h-2 w-2 rounded-full transition-transform duration-150 group-hover:scale-150",t.colorClass))}}function R(e,a){e&1&&(d(0),h(1,"div",15),m())}function U(e,a){if(e&1&&(d(0),r(1,"span",16),T(2),f(),m()),e&2){const t=a.$implicit;s(2),b(t)}}function W(e,a){if(e&1&&(d(0),r(1,"div",13),u(2,R,2,0,"ng-container",1),r(3,"div",14),u(4,U,3,1,"ng-container",3),f()(),m()),e&2){const t=y();s(2),c("ngIf",t.yTicks&&t.yTicks.length>0),s(2),c("ngForOf",t.xTicks)("ngForTrackBy",t.trackByXTick2)}}const l={data:[],yTicks:[],xTicks:[],maxX:100,maxY:100,showGridLines:!0,showDataLabels:!1,showTooltip:!0,tooltipPosition:"top",tooltipClassName:"",ariaLabel:"Scatter chart",className:""},x=class x{constructor(){n(this,"cn",G);n(this,"getChartScatterState",Y);n(this,"bindControllerProps",O);n(this,"className",l.className);n(this,"yTicks",l.yTicks);n(this,"ariaLabel",l.ariaLabel);n(this,"showGridLines",l.showGridLines);n(this,"data",l.data);n(this,"maxX",l.maxX);n(this,"maxY",l.maxY);n(this,"formatTooltip");n(this,"formatValue");n(this,"showDataLabels",l.showDataLabels);n(this,"tooltipPosition",l.tooltipPosition);n(this,"showTooltip",l.showTooltip);n(this,"tooltipClassName",l.tooltipClassName);n(this,"xTicks",l.xTicks)}trackByTick0(a,t){return t}trackByPt1(a,t){return t.key}trackByXTick2(a,t){return t}};n(x,"ɵfac",function(t){return new(t||x)}),n(x,"ɵcmp",j({type:x,selectors:[["kd-chart-scatter"],["chart-scatter"]],inputs:{className:"className",yTicks:"yTicks",ariaLabel:"ariaLabel",showGridLines:"showGridLines",data:"data",maxX:"maxX",maxY:"maxY",formatTooltip:"formatTooltip",formatValue:"formatValue",showDataLabels:"showDataLabels",tooltipPosition:"tooltipPosition",showTooltip:"showTooltip",tooltipClassName:"tooltipClassName",xTicks:"xTicks"},standalone:!1,decls:7,vars:9,consts:[[1,"flex","w-full","flex-row","items-end","justify-start","gap-2"],[4,"ngIf"],["role","img",1,"relative","flex","h-40","flex-1","flex-col","items-start","justify-start"],[4,"ngFor","ngForOf","ngForTrackBy"],[1,"flex","h-40","w-7","flex-col","items-end","justify-between"],[1,"text-right","text-xs","font-normal","text-foreground-muted"],[1,"pointer-events-none","absolute","inset-0","flex","flex-col","justify-between"],[1,"h-px","w-full","bg-border-subtle"],[1,"h-px","w-full","bg-border-default"],[1,"absolute","z-10","-translate-x-1/2","-translate-y-1/2",3,"ngStyle"],[3,"text","position","open","contentClassName"],[1,"flex","h-5","w-5","items-center","justify-center"],[1,"pointer-events-none","absolute","bottom-full","left-1/2","mb-0.5","-translate-x-1/2","text-xs","font-medium","whitespace-nowrap","text-foreground-muted"],[1,"flex","w-full","flex-row","items-start","justify-start","gap-2"],[1,"flex","flex-1","flex-row","items-start","justify-between"],[1,"h-px","w-7"],[1,"text-xs","font-normal","text-foreground-muted"]],template:function(t,o){t&1&&(r(0,"div")(1,"div",0),u(2,A,3,2,"ng-container",1),r(3,"div",2),u(4,H,7,0,"ng-container",1)(5,Q,6,11,"ng-container",3),f()(),u(6,W,5,3,"ng-container",1),f()),t&2&&(C(o.cn("flex w-full flex-col items-start justify-start gap-3",o.className)),v("data-ctrl",typeof o.bindControllerProps),s(2),c("ngIf",o.yTicks&&o.yTicks.length>0),s(),v("aria-label",o.ariaLabel),s(),c("ngIf",o.showGridLines),s(),c("ngForOf",o.getChartScatterState(o.data,o.maxX,o.maxY,o.formatTooltip,o.formatValue).points)("ngForTrackBy",o.trackByPt1),s(),c("ngIf",o.xTicks&&o.xTicks.length>0))},dependencies:[$,z,E,V],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let p=x;(typeof ngDevMode>"u"||ngDevMode)&&N(p,[{type:B,args:[{standalone:!1,selector:"kd-chart-scatter, chart-scatter",template:`
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
          class="relative flex h-40 flex-1 flex-col items-start justify-start"
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
            *ngFor="let pt of getChartScatterState(data, maxX, maxY, formatTooltip, formatValue).points; trackBy: trackByPt1"
            ><div
              class="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              [ngStyle]="{
          left: pt.left,
          top: pt.top
        }"
            >
              <ng-container *ngIf="showDataLabels"
                ><span
                  class="pointer-events-none absolute bottom-full left-1/2 mb-0.5 -translate-x-1/2 text-xs font-medium whitespace-nowrap text-foreground-muted"
                  >{{pt.label}}</span
                ></ng-container
              >
              <kd-tooltip
                [text]="pt.tooltipText"
                [position]="tooltipPosition"
                [open]="showTooltip ? undefined : false"
                [contentClassName]="tooltipClassName"
                ><span class="flex h-5 w-5 items-center justify-center"
                  ><span
                    [class]="cn('block h-2 w-2 rounded-full transition-transform duration-150 group-hover:scale-150', pt.colorClass)"
                  ></span></span
              ></kd-tooltip></div
          ></ng-container>
        </div>
      </div>
      <ng-container *ngIf="xTicks && xTicks.length > 0"
        ><div class="flex w-full flex-row items-start justify-start gap-2">
          <ng-container *ngIf="yTicks && yTicks.length > 0"
            ><div class="h-px w-7"></div
          ></ng-container>
          <div class="flex flex-1 flex-row items-start justify-between">
            <ng-container *ngFor="let xTick of xTicks; trackBy: trackByXTick2"
              ><span
                class="text-xs font-normal text-foreground-muted"
                >{{xTick}}</span
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
    `]}]}],null,{className:[{type:i}],yTicks:[{type:i}],ariaLabel:[{type:i}],showGridLines:[{type:i}],data:[{type:i}],maxX:[{type:i}],maxY:[{type:i}],formatTooltip:[{type:i}],formatValue:[{type:i}],showDataLabels:[{type:i}],tooltipPosition:[{type:i}],showTooltip:[{type:i}],tooltipClassName:[{type:i}],xTicks:[{type:i}]});(typeof ngDevMode>"u"||ngDevMode)&&F(p,{className:"ChartScatter",filePath:"ChartScatter.ts",lineNumber:138});const g=class g{};n(g,"ɵfac",function(t){return new(t||g)}),n(g,"ɵmod",P({type:g})),n(g,"ɵinj",I({imports:[w,k]}));let _=g;(typeof ngDevMode>"u"||ngDevMode)&&N(_,[{type:D,args:[{declarations:[p],imports:[w,k],exports:[p]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&M(_,{declarations:[p],imports:[w,k],exports:[p]})})();export{_ as ChartScatterModule,p as default};

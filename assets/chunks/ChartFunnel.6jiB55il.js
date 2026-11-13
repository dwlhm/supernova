var T=Object.defineProperty;var k=(s,o,t)=>o in s?T(s,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[o]=t;var e=(s,o,t)=>k(s,typeof o!="symbol"?o+"":o,t);import{ɵ as L,a as D,b as F,j as m,d as y,p as f,u as h,v as P,t as r,e as c,s as w,I as n,C as S,f as M,N as j,g as I,i as x,o as C,z as V,r as b,m as N,ao as v,w as B}from"./core.vpEFnhB-.js";import{a as O,i as E,d as J}from"./theme.CMj9otVT.js";import $,{TooltipModule as g}from"./Tooltip.BddMW6yj.js";import{C as _,b as z,a as q,c as A}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const G=s=>({width:s});function H(s,o){if(s&1&&(x(0),m(1,"span",8),C(2),f(),b()),s&2){const t=N().$implicit;r(2),v(t.displayValue)}}function K(s,o){if(s&1&&(x(0),m(1,"div",2)(2,"span",3),C(3),f(),m(4,"div",4)(5,"div",5)(6,"kd-tooltip",6),V(7,"div"),f()(),y(8,H,3,1,"ng-container",7),f()(),b()),s&2){const t=o.$implicit,a=N();r(3),v(t.label),r(2),c("ngStyle",B(9,G,t.width)),r(),c("text",t.tooltipText)("position",a.tooltipPosition)("open",a.showTooltip?void 0:!1)("contentClassName",a.tooltipClassName),r(),h(a.cn("h-7 w-full rounded-sm transition-all duration-150",t.colorClass)),r(),c("ngIf",a.showDataLabels)}}const i={data:[],showDataLabels:!0,showTooltip:!0,tooltipPosition:"top",tooltipClassName:"",ariaLabel:"Funnel chart",className:""},d=class d{constructor(){e(this,"cn",O);e(this,"getChartFunnelState",E);e(this,"bindControllerProps",J);e(this,"ariaLabel",i.ariaLabel);e(this,"className",i.className);e(this,"data",i.data);e(this,"formatTooltip");e(this,"formatValue");e(this,"tooltipPosition",i.tooltipPosition);e(this,"showTooltip",i.showTooltip);e(this,"tooltipClassName",i.tooltipClassName);e(this,"showDataLabels",i.showDataLabels)}trackByStep0(o,t){return t.key}};e(d,"ɵfac",function(t){return new(t||d)}),e(d,"ɵcmp",L({type:d,selectors:[["kd-chart-funnel"],["chart-funnel"]],inputs:{ariaLabel:"ariaLabel",className:"className",data:"data",formatTooltip:"formatTooltip",formatValue:"formatValue",tooltipPosition:"tooltipPosition",showTooltip:"showTooltip",tooltipClassName:"tooltipClassName",showDataLabels:"showDataLabels"},standalone:!1,decls:2,vars:6,consts:[["role","img"],[4,"ngFor","ngForOf","ngForTrackBy"],[1,"flex","w-full","flex-row","items-center","justify-start","gap-3"],[1,"w-16","shrink-0","truncate","text-right","text-xs","font-medium","text-foreground-muted"],[1,"flex","flex-1","flex-row","items-center","justify-start","gap-2.5"],[3,"ngStyle"],["className","w-full",3,"text","position","open","contentClassName"],[4,"ngIf"],[1,"shrink-0","text-xs","font-semibold","text-foreground-default"]],template:function(t,a){t&1&&(m(0,"div",0),y(1,K,9,11,"ng-container",1),f()),t&2&&(h(a.cn("flex w-full flex-col items-start justify-start gap-3",a.className)),P("data-ctrl",typeof a.bindControllerProps)("aria-label",a.ariaLabel),r(),c("ngForOf",a.getChartFunnelState(a.data,a.formatTooltip,a.formatValue).steps)("ngForTrackBy",a.trackByStep0))},dependencies:[z,q,A,$],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let l=d;(typeof ngDevMode>"u"||ngDevMode)&&w(l,[{type:S,args:[{standalone:!1,selector:"kd-chart-funnel, chart-funnel",template:`
    <div
      role="img"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-label]="ariaLabel"
      [class]="cn('flex w-full flex-col items-start justify-start gap-3', className)"
    >
      <ng-container
        *ngFor="let step of getChartFunnelState(data, formatTooltip, formatValue).steps; trackBy: trackByStep0"
        ><div class="flex w-full flex-row items-center justify-start gap-3">
          <span
            class="w-16 shrink-0 truncate text-right text-xs font-medium text-foreground-muted"
            >{{step.label}}</span
          >
          <div class="flex flex-1 flex-row items-center justify-start gap-2.5">
            <div
              [ngStyle]="{
          width: step.width
        }"
            >
              <kd-tooltip
                className="w-full"
                [text]="step.tooltipText"
                [position]="tooltipPosition"
                [open]="showTooltip ? undefined : false"
                [contentClassName]="tooltipClassName"
                ><div
                  [class]="cn('h-7 w-full rounded-sm transition-all duration-150', step.colorClass)"
                ></div
              ></kd-tooltip>
            </div>
            <ng-container *ngIf="showDataLabels"
              ><span
                class="shrink-0 text-xs font-semibold text-foreground-default"
                >{{step.displayValue}}</span
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
    `]}]}],null,{ariaLabel:[{type:n}],className:[{type:n}],data:[{type:n}],formatTooltip:[{type:n}],formatValue:[{type:n}],tooltipPosition:[{type:n}],showTooltip:[{type:n}],tooltipClassName:[{type:n}],showDataLabels:[{type:n}]});(typeof ngDevMode>"u"||ngDevMode)&&M(l,{className:"ChartFunnel",filePath:"ChartFunnel.ts",lineNumber:88});const p=class p{};e(p,"ɵfac",function(t){return new(t||p)}),e(p,"ɵmod",D({type:p})),e(p,"ɵinj",F({imports:[_,g]}));let u=p;(typeof ngDevMode>"u"||ngDevMode)&&w(u,[{type:j,args:[{declarations:[l],imports:[_,g],exports:[l]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&I(u,{declarations:[l],imports:[_,g],exports:[l]})})();export{u as ChartFunnelModule,l as default};

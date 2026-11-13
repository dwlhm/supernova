var L=Object.defineProperty;var B=(a,s,t)=>s in a?L(a,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[s]=t;var o=(a,s,t)=>B(a,typeof s!="symbol"?s+"":s,t);import{ɵ as V,a as P,b as z,j as p,d as w,p as d,u as C,v as D,t as l,e as i,s as y,I as n,C as I,f as F,N as M,g as H,i as u,r as g,m as _,z as N,w as v,o as k,ao as T}from"./core.vpEFnhB-.js";import{a as j,k as R,d as O}from"./theme.CMj9otVT.js";import $,{TooltipModule as h}from"./Tooltip.BddMW6yj.js";import{C as b,b as E,a as J,c as W}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const S=a=>({width:a});function q(a,s){if(a&1&&(u(0),p(1,"div",4)(2,"kd-tooltip",5),N(3,"div"),d()(),g()),a&2){const t=s.$implicit,e=_(2);l(),i("ngStyle",v(7,S,t.shareWidth)),l(),i("text",t.tooltipText)("position",e.tooltipPosition)("open",e.showTooltip?void 0:!1)("contentClassName",e.tooltipClassName),l(),C(e.cn("h-2 w-full rounded-xs transition-all duration-150",t.seriesColorClass,e.barClassName))}}function A(a,s){if(a&1&&(u(0),p(1,"div",2),w(2,q,4,9,"ng-container",3),d(),g()),a&2){const t=_();l(2),i("ngForOf",t.getChartHorizontalBarState(t.data,t.barColorClass,t.maxValue,t.valueSuffix,t.formatTooltip,t.formatValue).rows)("ngForTrackBy",t.trackByRow0)}}function G(a,s){if(a&1&&(u(0),p(1,"span",8),k(2),d(),g()),a&2){const t=_().$implicit;l(2),T(t.label)}}function K(a,s){if(a&1&&(u(0),p(1,"span",9),k(2),d(),g()),a&2){const t=_().$implicit;l(2),T(t.displayValue)}}function Q(a,s){if(a&1&&(u(0),p(1,"div",6),w(2,G,3,1,"ng-container",1),p(3,"kd-tooltip",7)(4,"div"),N(5,"div",4),d()(),w(6,K,3,1,"ng-container",1),d(),g()),a&2){const t=s.$implicit,e=_(2);l(2),i("ngIf",e.showLabels),l(),i("text",t.tooltipText)("position",e.tooltipPosition)("open",e.showTooltip?void 0:!1)("contentClassName",e.tooltipClassName),l(),C(e.cn("flex w-full flex-row items-center justify-start bg-background-muted",e.barClassName)),l(),C(e.cn("h-full rounded-sm transition-all duration-150",t.colorClass)),i("ngStyle",v(11,S,t.width)),l(),i("ngIf",e.showDataLabels)}}function U(a,s){if(a&1&&(u(0),w(1,Q,7,13,"ng-container",3),g()),a&2){const t=_();l(),i("ngForOf",t.getChartHorizontalBarState(t.data,t.barColorClass,t.maxValue,t.valueSuffix,t.formatTooltip,t.formatValue).rows)("ngForTrackBy",t.trackByRow1)}}const r={data:[],maxValue:100,valueSuffix:"%",stacked:!1,showLabels:!0,showDataLabels:!0,showTooltip:!0,tooltipPosition:"top",tooltipClassName:"",barColorClass:"bg-chart-series-1",barClassName:"h-5 rounded-sm",ariaLabel:"Horizontal bar chart",className:""},m=class m{constructor(){o(this,"cn",j);o(this,"getChartHorizontalBarState",R);o(this,"bindControllerProps",O);o(this,"ariaLabel",r.ariaLabel);o(this,"className",r.className);o(this,"stacked",r.stacked);o(this,"data",r.data);o(this,"barColorClass",r.barColorClass);o(this,"maxValue",r.maxValue);o(this,"valueSuffix",r.valueSuffix);o(this,"formatTooltip");o(this,"formatValue");o(this,"tooltipPosition",r.tooltipPosition);o(this,"showTooltip",r.showTooltip);o(this,"tooltipClassName",r.tooltipClassName);o(this,"barClassName",r.barClassName);o(this,"showLabels",r.showLabels);o(this,"showDataLabels",r.showDataLabels)}trackByRow0(s,t){return t.key}trackByRow1(s,t){return t.key}};o(m,"ɵfac",function(t){return new(t||m)}),o(m,"ɵcmp",V({type:m,selectors:[["kd-chart-horizontal-bar"],["chart-horizontal-bar"]],inputs:{ariaLabel:"ariaLabel",className:"className",stacked:"stacked",data:"data",barColorClass:"barColorClass",maxValue:"maxValue",valueSuffix:"valueSuffix",formatTooltip:"formatTooltip",formatValue:"formatValue",tooltipPosition:"tooltipPosition",showTooltip:"showTooltip",tooltipClassName:"tooltipClassName",barClassName:"barClassName",showLabels:"showLabels",showDataLabels:"showDataLabels"},standalone:!1,decls:3,vars:6,consts:[["role","img"],[4,"ngIf"],[1,"flex","w-full","flex-row","items-center","gap-0.5"],[4,"ngFor","ngForOf","ngForTrackBy"],[3,"ngStyle"],["className","w-full",3,"text","position","open","contentClassName"],[1,"flex","w-full","flex-row","items-center","justify-start","gap-2"],["className","flex-1",3,"text","position","open","contentClassName"],[1,"w-16","shrink-0","truncate","text-right","text-xs","font-normal","text-foreground-muted"],[1,"w-9","shrink-0","text-right","text-xs","font-medium","text-foreground-default"]],template:function(t,e){t&1&&(p(0,"div",0),w(1,A,3,2,"ng-container",1)(2,U,2,2,"ng-container",1),d()),t&2&&(C(e.cn("flex w-full flex-col items-start justify-start gap-3",e.className)),D("data-ctrl",typeof e.bindControllerProps)("aria-label",e.ariaLabel),l(),i("ngIf",e.stacked),l(),i("ngIf",!e.stacked))},dependencies:[E,J,W,$],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let c=m;(typeof ngDevMode>"u"||ngDevMode)&&y(c,[{type:I,args:[{standalone:!1,selector:"kd-chart-horizontal-bar, chart-horizontal-bar",template:`
    <div
      role="img"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-label]="ariaLabel"
      [class]="cn('flex w-full flex-col items-start justify-start gap-3', className)"
    >
      <ng-container *ngIf="stacked"
        ><div class="flex w-full flex-row items-center gap-0.5">
          <ng-container
            *ngFor="let row of getChartHorizontalBarState(data, barColorClass, maxValue, valueSuffix, formatTooltip, formatValue).rows; trackBy: trackByRow0"
            ><div
              [ngStyle]="{
          width: row.shareWidth
        }"
            >
              <kd-tooltip
                className="w-full"
                [text]="row.tooltipText"
                [position]="tooltipPosition"
                [open]="showTooltip ? undefined : false"
                [contentClassName]="tooltipClassName"
                ><div
                  [class]="cn('h-2 w-full rounded-xs transition-all duration-150', row.seriesColorClass, barClassName)"
                ></div
              ></kd-tooltip></div
          ></ng-container></div
      ></ng-container>
      <ng-container *ngIf="!stacked"
        ><ng-container
          *ngFor="let row of getChartHorizontalBarState(data, barColorClass, maxValue, valueSuffix, formatTooltip, formatValue).rows; trackBy: trackByRow1"
          ><div class="flex w-full flex-row items-center justify-start gap-2">
            <ng-container *ngIf="showLabels"
              ><span
                class="w-16 shrink-0 truncate text-right text-xs font-normal text-foreground-muted"
                >{{row.label}}</span
              ></ng-container
            >
            <kd-tooltip
              className="flex-1"
              [text]="row.tooltipText"
              [position]="tooltipPosition"
              [open]="showTooltip ? undefined : false"
              [contentClassName]="tooltipClassName"
              ><div
                [class]="cn('flex w-full flex-row items-center justify-start bg-background-muted', barClassName)"
              >
                <div
                  [class]="cn('h-full rounded-sm transition-all duration-150', row.colorClass)"
                  [ngStyle]="{
          width: row.width
        }"
                ></div></div
            ></kd-tooltip>
            <ng-container *ngIf="showDataLabels"
              ><span
                class="w-9 shrink-0 text-right text-xs font-medium text-foreground-default"
                >{{row.displayValue}}</span
              ></ng-container
            >
          </div></ng-container
        ></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{ariaLabel:[{type:n}],className:[{type:n}],stacked:[{type:n}],data:[{type:n}],barColorClass:[{type:n}],maxValue:[{type:n}],valueSuffix:[{type:n}],formatTooltip:[{type:n}],formatValue:[{type:n}],tooltipPosition:[{type:n}],showTooltip:[{type:n}],tooltipClassName:[{type:n}],barClassName:[{type:n}],showLabels:[{type:n}],showDataLabels:[{type:n}]});(typeof ngDevMode>"u"||ngDevMode)&&F(c,{className:"ChartHorizontalBar",filePath:"ChartHorizontalBar.ts",lineNumber:123});const f=class f{};o(f,"ɵfac",function(t){return new(t||f)}),o(f,"ɵmod",P({type:f})),o(f,"ɵinj",z({imports:[b,h]}));let x=f;(typeof ngDevMode>"u"||ngDevMode)&&y(x,[{type:M,args:[{declarations:[c],imports:[b,h],exports:[c]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&H(x,{declarations:[c],imports:[b,h],exports:[c]})})();export{x as ChartHorizontalBarModule,c as default};

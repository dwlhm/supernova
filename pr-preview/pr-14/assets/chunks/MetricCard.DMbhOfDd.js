var S=Object.defineProperty;var k=(t,s,e)=>s in t?S(t,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[s]=e;var n=(t,s,e)=>k(t,typeof s!="symbol"?s+"":s,e);import{ɵ as C,a as P,b as V,c as N,j as c,o as b,p as i,d as _,i as g,q as j,r as f,u as v,v as T,t as r,am as h,e as d,s as I,I as a,C as L,f as F,N as B,g as E,m,w as D,y as H,z as M,x as J}from"./core.BqS-lykr.js";import{a as O,d as q,t as z,b as G}from"./utils.BBpd638g.js";import{C as y,N as R,b as $}from"./common_module-chunk.DvGwmKFp.js";const A=["*"],K=()=>({success:"bg-success-subtle text-success-foreground",warning:"bg-warning-subtle text-warning-foreground",error:"bg-destructive-subtle text-destructive-foreground",info:"bg-info-subtle text-info-foreground",default:"bg-background-muted text-foreground-muted"}),Q=()=>({down:"bg-destructive-subtle text-destructive-foreground",neutral:"bg-background-muted text-foreground-muted",up:"bg-success-subtle text-success-foreground"});function U(t,s){if(t&1&&(g(0),c(1,"span"),b(2),i(),f()),t&2){const e=m();r(),v(e.cn("inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium leading-4",e.cva(e.statusVariant,D(3,K),"default"))),r(),h(e.statusLabel)}}function W(t,s){t&1&&(g(0),c(1,"span",4),H(),c(2,"svg",5),M(3,"path",6),i()(),f())}function X(t,s){if(t&1&&(g(0),c(1,"p",7),b(2),i(),f()),t&2){const e=m();r(2),J(" ",e.value," ")}}function Y(t,s){if(t&1&&(g(0),c(1,"span"),b(2),i(),f()),t&2){const e=m(2);r(),v(e.cn("inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold leading-4",e.cva(e.trendDirection,D(3,Q),"up"))),r(),h(e.trendText)}}function Z(t,s){if(t&1&&(g(0),c(1,"span",9),b(2),i(),f()),t&2){const e=m(2);r(2),h(e.descriptionText)}}function ee(t,s){if(t&1&&(g(0),c(1,"div",8),_(2,Y,3,4,"ng-container",2)(3,Z,3,1,"ng-container",2),i(),f()),t&2){const e=m();r(2),d("ngIf",e.showTrend),r(),d("ngIf",e.showDescription)}}function te(t,s){if(t&1&&(g(0),c(1,"div",10),M(2,"div",11),i(),f()),t&2){const e=m();r(),T("aria-valuenow",e.getProgressState(e.progress).percentage)("aria-valuemin",0)("aria-valuemax",100)("aria-label",e.label),r(),d("ngStyle",e.getProgressState(e.progress).barStyle)}}const o={label:"Total Revenue",value:"$45,231.89",showValue:!0,trendText:"+20.1%",showTrend:!0,trendDirection:"up",descriptionText:"from last month",showDescription:!0,showIcon:!0,showStatus:!0,statusLabel:"On track",statusVariant:"default",showProgress:!1,progress:0,className:""},x=class x{constructor(){n(this,"cn",O);n(this,"cva",q);n(this,"getProgressState",z);n(this,"bindControllerProps",G);n(this,"className",o.className);n(this,"label",o.label);n(this,"showStatus",o.showStatus);n(this,"statusVariant",o.statusVariant);n(this,"statusLabel",o.statusLabel);n(this,"showIcon",o.showIcon);n(this,"showValue",o.showValue);n(this,"value",o.value);n(this,"showTrend",o.showTrend);n(this,"showDescription",o.showDescription);n(this,"trendDirection",o.trendDirection);n(this,"trendText",o.trendText);n(this,"descriptionText",o.descriptionText);n(this,"showProgress",o.showProgress);n(this,"progress",o.progress)}};n(x,"ɵfac",function(e){return new(e||x)}),n(x,"ɵcmp",C({type:x,selectors:[["spn-metric-card"],["metric-card"]],inputs:{className:"className",label:"label",showStatus:"showStatus",statusVariant:"statusVariant",statusLabel:"statusLabel",showIcon:"showIcon",showValue:"showValue",value:"value",showTrend:"showTrend",showDescription:"showDescription",trendDirection:"trendDirection",trendText:"trendText",descriptionText:"descriptionText",showProgress:"showProgress",progress:"progress"},standalone:!1,ngContentSelectors:A,decls:12,vars:9,consts:[[1,"flex","items-center","justify-between","gap-2"],[1,"flex-1","truncate","text-xs","font-medium","text-foreground-muted"],[4,"ngIf"],[1,"w-full"],["aria-hidden","true",1,"flex","h-6","w-6","shrink-0","items-center","justify-center","rounded-md","bg-background-muted","p-1","text-foreground-default"],["viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4"],["d","M4 20V10M10 20V4M16 20v-7M22 20H2","stroke-linecap","round"],[1,"truncate","text-xl","leading-6","font-semibold","text-foreground-default"],[1,"flex","flex-wrap","items-center","gap-1"],[1,"truncate","text-xs","text-foreground-muted"],["role","progressbar",1,"h-2","w-full","overflow-hidden","rounded-full","bg-background-muted"],[1,"h-2","rounded-full","bg-chart-series-1",3,"ngStyle"]],template:function(e,l){e&1&&(N(),c(0,"article")(1,"div",0)(2,"span",1),b(3),i(),_(4,U,3,4,"ng-container",2)(5,W,4,0,"ng-container",2),i(),_(6,X,3,1,"ng-container",2)(7,ee,4,2,"ng-container",2)(8,te,3,5,"ng-container",2),g(9),c(10,"div",3),j(11),i(),f(),i()),e&2&&(v(l.cn("flex w-full flex-col gap-2 rounded-lg border border-border-default bg-background-default p-4 shadow-sm",l.className)),T("data-ctrl",typeof l.bindControllerProps),r(3),h(l.label),r(),d("ngIf",l.showStatus),r(),d("ngIf",l.showIcon),r(),d("ngIf",l.showValue),r(),d("ngIf",l.showTrend||l.showDescription),r(),d("ngIf",l.showProgress))},dependencies:[R,$],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let u=x;(typeof ngDevMode>"u"||ngDevMode)&&I(u,[{type:L,args:[{standalone:!1,selector:"spn-metric-card, metric-card",template:`
    <article
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-2 rounded-lg border border-border-default bg-background-default p-4 shadow-sm', className)"
    >
      <div class="flex items-center justify-between gap-2">
        <span
          class="flex-1 truncate text-xs font-medium text-foreground-muted"
          >{{label}}</span
        >
        <ng-container *ngIf="showStatus"
          ><span
            [class]="cn('inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium leading-4', cva(statusVariant, {
          success: 'bg-success-subtle text-success-foreground',
          warning: 'bg-warning-subtle text-warning-foreground',
          error: 'bg-destructive-subtle text-destructive-foreground',
          info: 'bg-info-subtle text-info-foreground',
          default: 'bg-background-muted text-foreground-muted'
        }, 'default'))"
            >{{statusLabel}}</span
          ></ng-container
        >
        <ng-container *ngIf="showIcon"
          ><span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-background-muted p-1 text-foreground-default"
            aria-hidden="true"
            ><svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                d="M4 20V10M10 20V4M16 20v-7M22 20H2"
                stroke-linecap="round"
              ></path></svg></span
        ></ng-container>
      </div>
      <ng-container *ngIf="showValue"
        ><p
          class="truncate text-xl leading-6 font-semibold text-foreground-default"
        >
          {{value}}
        </p></ng-container
      >
      <ng-container *ngIf="showTrend || showDescription"
        ><div class="flex flex-wrap items-center gap-1">
          <ng-container *ngIf="showTrend"
            ><span
              [class]="cn('inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold leading-4', cva(trendDirection, {
          down: 'bg-destructive-subtle text-destructive-foreground',
          neutral: 'bg-background-muted text-foreground-muted',
          up: 'bg-success-subtle text-success-foreground'
        }, 'up'))"
              >{{trendText}}</span
            ></ng-container
          >
          <ng-container *ngIf="showDescription"
            ><span
              class="truncate text-xs text-foreground-muted"
              >{{descriptionText}}</span
            ></ng-container
          >
        </div></ng-container
      >
      <ng-container *ngIf="showProgress"
        ><div
          class="h-2 w-full overflow-hidden rounded-full bg-background-muted"
          role="progressbar"
          [attr.aria-valuenow]="getProgressState(progress).percentage"
          [attr.aria-valuemin]="0"
          [attr.aria-valuemax]="100"
          [attr.aria-label]="label"
        >
          <div
            class="h-2 rounded-full bg-chart-series-1"
            [ngStyle]="getProgressState(progress).barStyle"
          ></div></div
      ></ng-container>
      <ng-container><div class="w-full"><ng-content></ng-content></div
      ></ng-container>
    </article>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:a}],label:[{type:a}],showStatus:[{type:a}],statusVariant:[{type:a}],statusLabel:[{type:a}],showIcon:[{type:a}],showValue:[{type:a}],value:[{type:a}],showTrend:[{type:a}],showDescription:[{type:a}],trendDirection:[{type:a}],trendText:[{type:a}],descriptionText:[{type:a}],showProgress:[{type:a}],progress:[{type:a}]});(typeof ngDevMode>"u"||ngDevMode)&&F(u,{className:"MetricCard",filePath:"MetricCard.ts",lineNumber:137});const p=class p{};n(p,"ɵfac",function(e){return new(e||p)}),n(p,"ɵmod",P({type:p})),n(p,"ɵinj",V({imports:[y]}));let w=p;(typeof ngDevMode>"u"||ngDevMode)&&I(w,[{type:B,args:[{declarations:[u],imports:[y],exports:[u]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&E(w,{declarations:[u],imports:[y],exports:[u]})})();export{w as MetricCardModule,u as default};

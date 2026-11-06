var k=Object.defineProperty;var T=(t,a,e)=>a in t?k(t,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[a]=e;var o=(t,a,e)=>T(t,typeof a!="symbol"?a+"":a,e);import{ɵ as F,a as N,b as D,j as s,d as h,p as i,u as y,v as w,t as r,e as l,s as L,I as c,C as I,f as P,N as S,g as M,i as f,z as C,r as u,m as p,ap as A,o as x,am as v}from"./core.BqS-lykr.js";import{a as G,e as j,b as O}from"./utils.BBpd638g.js";import{C as B,a as $,N as z,b as E}from"./common_module-chunk.DvGwmKFp.js";const J=t=>({height:t});function q(t,a){t&1&&(f(0),s(1,"div",3),C(2,"div",4)(3,"div",4)(4,"div",4)(5,"div",4)(6,"div",4),i(),u())}function H(t,a){if(t&1&&(f(0),C(1,"div",6),u()),t&2){const e=a.$implicit,n=p(2);r(),y(n.cn("w-full rounded-sm transition-all duration-150 group-hover:brightness-110 group-focus:brightness-110",e.colorClass)),l("ngStyle",A(3,J,e.height))}}function K(t,a){if(t&1&&(f(0),s(1,"div",9),C(2,"span"),s(3,"span",10),x(4),i()(),u()),t&2){const e=a.$implicit,n=p(3);r(2),y(n.cn("h-2 w-2 shrink-0 rounded-full",e.colorClass)),r(2),v(e.value)}}function Q(t,a){if(t&1&&(f(0),s(1,"div",7)(2,"span",8),x(3),i(),h(4,K,5,3,"ng-container",2),i(),u()),t&2){const e=p().$implicit,n=p();r(3),v(e.label),r(),l("ngForOf",e.bars)("ngForTrackBy",n.trackByBar2)}}function R(t,a){if(t&1&&(f(0),s(1,"div",5),h(2,H,2,5,"ng-container",2)(3,Q,5,3,"ng-container",1),i(),u()),t&2){const e=a.$implicit,n=p();r(),w("tabindex",0),r(),l("ngForOf",e.bars)("ngForTrackBy",n.trackByBar1),r(),l("ngIf",n.showTooltip)}}function U(t,a){if(t&1&&(f(0),s(1,"span",14),x(2),i(),u()),t&2){const e=p().$implicit;r(2),v(e.value)}}function V(t,a){if(t&1&&(f(0),s(1,"span",12),h(2,U,3,1,"ng-container",1),s(3,"span",13),x(4),i()(),u()),t&2){const e=a.$implicit,n=p(2);r(2),l("ngIf",n.showDataLabels),r(2),v(e.label)}}function W(t,a){if(t&1&&(f(0),s(1,"div",11),h(2,V,5,2,"ng-container",2),i(),u()),t&2){const e=p();r(2),l("ngForOf",e.getChartBarState(e.data,e.colorClass).rows)("ngForTrackBy",e.trackByPoint3)}}const d={data:[],colorClass:"bg-chart-series-1",showGridLines:!0,showDataLabels:!0,showAxisLabels:!0,showTooltip:!0,ariaLabel:"Bar chart",className:""},_=class _{constructor(){o(this,"cn",G);o(this,"getChartBarState",j);o(this,"bindControllerProps",O);o(this,"className",d.className);o(this,"ariaLabel",d.ariaLabel);o(this,"showGridLines",d.showGridLines);o(this,"data",d.data);o(this,"colorClass",d.colorClass);o(this,"showTooltip",d.showTooltip);o(this,"showAxisLabels",d.showAxisLabels);o(this,"showDataLabels",d.showDataLabels)}trackByPoint0(a,e){return e.label}trackByBar1(a,e){return e.key}trackByBar2(a,e){return e.key}trackByPoint3(a,e){return e.label}};o(_,"ɵfac",function(e){return new(e||_)}),o(_,"ɵcmp",F({type:_,selectors:[["spn-chart-bar"],["chart-bar"]],inputs:{className:"className",ariaLabel:"ariaLabel",showGridLines:"showGridLines",data:"data",colorClass:"colorClass",showTooltip:"showTooltip",showAxisLabels:"showAxisLabels",showDataLabels:"showDataLabels"},standalone:!1,decls:5,vars:8,consts:[["role","img",1,"relative","flex","h-44","w-full","items-end","gap-2"],[4,"ngIf"],[4,"ngFor","ngForOf","ngForTrackBy"],["aria-hidden","true",1,"pointer-events-none","absolute","inset-0","flex","flex-col","justify-between"],[1,"border-t","border-border-subtle"],[1,"group","relative","flex","h-full","flex-1","items-end","justify-center","gap-1","cursor-pointer","outline-none"],[3,"ngStyle"],["role","tooltip",1,"pointer-events-none","absolute","bottom-full","mb-2","left-1/2","-translate-x-1/2","z-30","invisible","opacity-0","scale-95","transition-all","duration-150","group-hover:visible","group-hover:opacity-100","group-hover:scale-100","group-focus-within:visible","group-focus-within:opacity-100","group-focus-within:scale-100","flex","flex-col","gap-0.5","rounded-lg","border","border-border-default","bg-background-default","px-2.5","py-1.5","shadow-lg","backdrop-blur-sm","min-w-20","whitespace-nowrap"],[1,"text-xs","font-medium","text-foreground-muted"],[1,"flex","items-center","gap-1.5"],[1,"text-xs","font-bold","text-foreground-default"],[1,"flex","w-full","items-start","gap-2"],[1,"flex","min-w-0","flex-1","flex-col","items-center","gap-0.5","text-center"],[1,"w-full","truncate","text-xs","text-foreground-muted"],[1,"text-xs","font-medium","text-foreground-default"]],template:function(e,n){e&1&&(s(0,"div")(1,"div",0),h(2,q,7,0,"ng-container",1)(3,R,4,4,"ng-container",2),i(),h(4,W,3,2,"ng-container",1),i()),e&2&&(y(n.cn("flex w-full flex-col gap-2",n.className)),w("data-ctrl",typeof n.bindControllerProps),r(),w("aria-label",n.ariaLabel),r(),l("ngIf",n.showGridLines),r(),l("ngForOf",n.getChartBarState(n.data,n.colorClass).rows)("ngForTrackBy",n.trackByPoint0),r(),l("ngIf",n.showAxisLabels))},dependencies:[$,z,E],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let g=_;(typeof ngDevMode>"u"||ngDevMode)&&L(g,[{type:I,args:[{standalone:!1,selector:"spn-chart-bar, chart-bar",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-2', className)"
    >
      <div
        class="relative flex h-44 w-full items-end gap-2"
        role="img"
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
            <div class="border-t border-border-subtle"></div></div
        ></ng-container>
        <ng-container
          *ngFor="let point of getChartBarState(data, colorClass).rows; trackBy: trackByPoint0"
          ><div
            class="group relative flex h-full flex-1 items-end justify-center gap-1 cursor-pointer outline-none"
            [attr.tabindex]="0"
          >
            <ng-container *ngFor="let bar of point.bars; trackBy: trackByBar1"
              ><div
                [class]="cn('w-full rounded-sm transition-all duration-150 group-hover:brightness-110 group-focus:brightness-110', bar.colorClass)"
                [ngStyle]="{
          height: bar.height
        }"
              ></div
            ></ng-container>
            <ng-container *ngIf="showTooltip"
              ><div
                role="tooltip"
                class="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 invisible opacity-0 scale-95 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-hover:scale-100 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:scale-100 flex flex-col gap-0.5 rounded-lg border border-border-default bg-background-default px-2.5 py-1.5 shadow-lg backdrop-blur-sm min-w-20 whitespace-nowrap"
              >
                <span
                  class="text-xs font-medium text-foreground-muted"
                  >{{point.label}}</span
                >
                <ng-container
                  *ngFor="let bar of point.bars; trackBy: trackByBar2"
                  ><div class="flex items-center gap-1.5">
                    <span
                      [class]="cn('h-2 w-2 shrink-0 rounded-full', bar.colorClass)"
                    ></span>
                    <span
                      class="text-xs font-bold text-foreground-default"
                      >{{bar.value}}</span
                    >
                  </div></ng-container
                >
              </div></ng-container
            >
          </div></ng-container
        >
      </div>
      <ng-container *ngIf="showAxisLabels"
        ><div class="flex w-full items-start gap-2">
          <ng-container
            *ngFor="let point of getChartBarState(data, colorClass).rows; trackBy: trackByPoint3"
            ><span
              class="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center"
              ><ng-container *ngIf="showDataLabels"
                ><span
                  class="text-xs font-medium text-foreground-default"
                  >{{point.value}}</span
                ></ng-container
              >
              <span
                class="w-full truncate text-xs text-foreground-muted"
                >{{point.label}}</span
              ></span
            ></ng-container
          >
        </div></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:c}],ariaLabel:[{type:c}],showGridLines:[{type:c}],data:[{type:c}],colorClass:[{type:c}],showTooltip:[{type:c}],showAxisLabels:[{type:c}],showDataLabels:[{type:c}]});(typeof ngDevMode>"u"||ngDevMode)&&P(g,{className:"ChartBar",filePath:"ChartBar.ts",lineNumber:127});const b=class b{};o(b,"ɵfac",function(e){return new(e||b)}),o(b,"ɵmod",N({type:b})),o(b,"ɵinj",D({imports:[B]}));let m=b;(typeof ngDevMode>"u"||ngDevMode)&&L(m,[{type:S,args:[{declarations:[g],imports:[B],exports:[g]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&M(m,{declarations:[g],imports:[B],exports:[g]})})();export{m as ChartBarModule,g as default};

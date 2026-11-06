var B=Object.defineProperty;var T=(t,a,e)=>a in t?B(t,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[a]=e;var s=(t,a,e)=>T(t,typeof a!="symbol"?a+"":a,e);import{ɵ as F,a as N,b as P,j as l,d as f,y as k,p as i,u as v,v as m,t as o,e as p,s as I,I as r,C as S,f as D,N as M,g as $,i as g,z as y,r as u,m as d,aq as A,o as x,am as C}from"./core.BqS-lykr.js";import{a as j,f as G,b as O}from"./utils.BBpd638g.js";import{C as L,a as z,N as V,b as E}from"./common_module-chunk.DvGwmKFp.js";const J=(t,a)=>({left:t,top:a});function R(t,a){t&1&&(g(0),l(1,"div",4),y(2,"div",5)(3,"div",5)(4,"div",5)(5,"div",5)(6,"div",5),i(),u())}function q(t,a){if(t&1&&(k(),g(0),y(1,"polygon"),u()),t&2){const e=d().$implicit,n=d();o(),v(n.cn(e.fillClass,"opacity-20")),m("points",e.areaPoints)}}function H(t,a){if(t&1&&(k(),g(0),l(1,"g"),f(2,q,2,3,"ng-container",1),y(3,"polyline",6),i(),u()),t&2){const e=a.$implicit,n=d();o(2),p("ngIf",n.area),o(),v(e.strokeClass),m("points",e.linePoints)}}function K(t,a){if(t&1&&(g(0),l(1,"div",11),y(2,"span"),l(3,"span",12),x(4),i()(),u()),t&2){const e=a.$implicit,n=d(3);o(2),v(n.cn("h-2 w-2 shrink-0 rounded-full",e.colorClass)),o(2),C(e.value)}}function Q(t,a){if(t&1&&(g(0),l(1,"div",9)(2,"span",10),x(3),i(),f(4,K,5,3,"ng-container",3),i(),u()),t&2){const e=d().$implicit,n=d();o(3),C(e.label),o(),p("ngForOf",e.valuesList)("ngForTrackBy",n.trackByValItem2)}}function U(t,a){if(t&1&&(g(0),l(1,"div",7)(2,"div",8),y(3,"span"),i(),f(4,Q,5,3,"ng-container",1),i(),u()),t&2){const e=a.$implicit,n=d();o(),p("ngStyle",A(5,J,`${e.x}%`,`${e.y}%`)),m("tabindex",0),o(2),v(n.cn("h-2 w-2 rounded-full transition-transform duration-150 group-hover:scale-150 group-focus:scale-150",n.fillClass?n.fillClass.replace("fill-","bg-"):"bg-chart-series-1")),o(),p("ngIf",n.showTooltip)}}function W(t,a){if(t&1&&(g(0),l(1,"span",16),x(2),i(),u()),t&2){const e=d().$implicit;o(2),C(e.value)}}function X(t,a){if(t&1&&(g(0),l(1,"span",14),f(2,W,3,1,"ng-container",1),l(3,"span",15),x(4),i()(),u()),t&2){const e=a.$implicit,n=d(2);o(2),p("ngIf",n.showDataLabels),o(2),C(e.label)}}function Y(t,a){if(t&1&&(g(0),l(1,"div",13),f(2,X,5,2,"ng-container",3),i(),u()),t&2){const e=d();o(2),p("ngForOf",e.getChartLineState(e.data,e.strokeClass,e.fillClass).points)("ngForTrackBy",e.trackByPoint3)}}const c={data:[],area:!1,showGridLines:!0,showDataLabels:!1,showAxisLabels:!0,showTooltip:!0,strokeClass:"stroke-chart-series-1",fillClass:"fill-chart-series-1",ariaLabel:"Line chart",className:""},h=class h{constructor(){s(this,"cn",j);s(this,"getChartLineState",G);s(this,"bindControllerProps",O);s(this,"className",c.className);s(this,"ariaLabel",c.ariaLabel);s(this,"showGridLines",c.showGridLines);s(this,"data",c.data);s(this,"strokeClass",c.strokeClass);s(this,"fillClass",c.fillClass);s(this,"area",c.area);s(this,"showTooltip",c.showTooltip);s(this,"showAxisLabels",c.showAxisLabels);s(this,"showDataLabels",c.showDataLabels)}trackByLine0(a,e){return e.key}trackByPoint1(a,e){return e.key}trackByValItem2(a,e){return e.key}trackByPoint3(a,e){return e.key}};s(h,"ɵfac",function(e){return new(e||h)}),s(h,"ɵcmp",F({type:h,selectors:[["spn-chart-line"],["chart-line"]],inputs:{className:"className",ariaLabel:"ariaLabel",showGridLines:"showGridLines",data:"data",strokeClass:"strokeClass",fillClass:"fillClass",area:"area",showTooltip:"showTooltip",showAxisLabels:"showAxisLabels",showDataLabels:"showDataLabels"},standalone:!1,decls:7,vars:10,consts:[["role","img",1,"relative","h-44","w-full"],[4,"ngIf"],["viewBox","0 0 100 100","preserveAspectRatio","none","aria-hidden","true",1,"absolute","inset-0","h-full","w-full","overflow-visible"],[4,"ngFor","ngForOf","ngForTrackBy"],["aria-hidden","true",1,"pointer-events-none","absolute","inset-0","flex","flex-col","justify-between"],[1,"border-t","border-border-subtle"],["fill","none","stroke-width","2","vector-effect","non-scaling-stroke","stroke-linecap","round","stroke-linejoin","round"],[1,"group","absolute","z-10","-translate-x-1/2","-translate-y-1/2","cursor-pointer","outline-none",3,"ngStyle"],[1,"flex","h-5","w-5","items-center","justify-center"],["role","tooltip",1,"pointer-events-none","absolute","bottom-full","mb-2","left-1/2","-translate-x-1/2","z-30","invisible","opacity-0","scale-95","transition-all","duration-150","group-hover:visible","group-hover:opacity-100","group-hover:scale-100","group-focus-within:visible","group-focus-within:opacity-100","group-focus-within:scale-100","flex","flex-col","gap-0.5","rounded-lg","border","border-border-default","bg-background-default","px-2.5","py-1.5","shadow-lg","backdrop-blur-sm","min-w-20","whitespace-nowrap"],[1,"text-xs","font-medium","text-foreground-muted"],[1,"flex","items-center","gap-1.5"],[1,"text-xs","font-bold","text-foreground-default"],[1,"flex","w-full","items-start","gap-2"],[1,"flex","min-w-0","flex-1","flex-col","items-center","gap-0.5","text-center"],[1,"w-full","truncate","text-xs","text-foreground-muted"],[1,"text-xs","font-medium","text-foreground-default"]],template:function(e,n){e&1&&(l(0,"div")(1,"div",0),f(2,R,7,0,"ng-container",1),k(),l(3,"svg",2),f(4,H,4,4,"ng-container",3),i(),f(5,U,5,8,"ng-container",3),i(),f(6,Y,3,2,"ng-container",1),i()),e&2&&(v(n.cn("flex w-full flex-col gap-2",n.className)),m("data-ctrl",typeof n.bindControllerProps),o(),m("aria-label",n.ariaLabel),o(),p("ngIf",n.showGridLines),o(2),p("ngForOf",n.getChartLineState(n.data,n.strokeClass,n.fillClass).lines)("ngForTrackBy",n.trackByLine0),o(),p("ngForOf",n.getChartLineState(n.data,n.strokeClass,n.fillClass).points)("ngForTrackBy",n.trackByPoint1),o(),p("ngIf",n.showAxisLabels))},dependencies:[z,V,E],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let _=h;(typeof ngDevMode>"u"||ngDevMode)&&I(_,[{type:S,args:[{standalone:!1,selector:"spn-chart-line, chart-line",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-2', className)"
    >
      <div
        class="relative h-44 w-full"
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
        <svg
          class="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <ng-container
            *ngFor="let line of getChartLineState(data, strokeClass, fillClass).lines; trackBy: trackByLine0"
          >
            <g>
              <ng-container *ngIf="area">
                <polygon
                  [class]="cn(line.fillClass, 'opacity-20')"
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
          *ngFor="let point of getChartLineState(data, strokeClass, fillClass).points; trackBy: trackByPoint1"
          ><div
            class="group absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none"
            [attr.tabindex]="0"
            [ngStyle]="{
          left: \`\${point.x}%\`,
          top: \`\${point.y}%\`
        }"
          >
            <div class="flex h-5 w-5 items-center justify-center">
              <span
                [class]="cn('h-2 w-2 rounded-full transition-transform duration-150 group-hover:scale-150 group-focus:scale-150', fillClass ? fillClass.replace('fill-', 'bg-') : 'bg-chart-series-1')"
              ></span>
            </div>
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
                  *ngFor="let valItem of point.valuesList; trackBy: trackByValItem2"
                  ><div class="flex items-center gap-1.5">
                    <span
                      [class]="cn('h-2 w-2 shrink-0 rounded-full', valItem.colorClass)"
                    ></span>
                    <span
                      class="text-xs font-bold text-foreground-default"
                      >{{valItem.value}}</span
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
            *ngFor="let point of getChartLineState(data, strokeClass, fillClass).points; trackBy: trackByPoint3"
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
    `]}]}],null,{className:[{type:r}],ariaLabel:[{type:r}],showGridLines:[{type:r}],data:[{type:r}],strokeClass:[{type:r}],fillClass:[{type:r}],area:[{type:r}],showTooltip:[{type:r}],showAxisLabels:[{type:r}],showDataLabels:[{type:r}]});(typeof ngDevMode>"u"||ngDevMode)&&D(_,{className:"ChartLine",filePath:"ChartLine.ts",lineNumber:160});const b=class b{};s(b,"ɵfac",function(e){return new(e||b)}),s(b,"ɵmod",N({type:b})),s(b,"ɵinj",P({imports:[L]}));let w=b;(typeof ngDevMode>"u"||ngDevMode)&&I(w,[{type:M,args:[{declarations:[_],imports:[L],exports:[_]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&$(w,{declarations:[_],imports:[L],exports:[_]})})();export{w as ChartLineModule,_ as default};

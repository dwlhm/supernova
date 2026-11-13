var p=Object.defineProperty;var f=(l,t,e)=>t in l?p(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var s=(l,t,e)=>f(l,typeof t!="symbol"?t+"":t,e);import{ɵ as m,a as u,b as g,c as y,j as _,q as N,p as M,u as v,v as C,s as d,I as b,C as D,f as j,N as x,g as P}from"./core.vpEFnhB-.js";import{a as w,d as h}from"./theme.CecfD-Na.js";import{C as i}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const I=["*"],S={className:""},o=class o{constructor(){s(this,"cn",w);s(this,"bindControllerProps",h);s(this,"className",S.className)}};s(o,"ɵfac",function(e){return new(e||o)}),s(o,"ɵcmp",m({type:o,selectors:[["kd-chart-legend"],["chart-legend"]],inputs:{className:"className"},standalone:!1,ngContentSelectors:I,decls:2,vars:3,template:function(e,c){e&1&&(y(),_(0,"div"),N(1),M()),e&2&&(v(c.cn("flex flex-row flex-wrap items-center justify-start gap-4",c.className)),C("data-ctrl",typeof c.bindControllerProps))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=o;(typeof ngDevMode>"u"||ngDevMode)&&d(a,[{type:D,args:[{standalone:!1,selector:"kd-chart-legend, chart-legend",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex flex-row flex-wrap items-center justify-start gap-4', className)"
    >
      <ng-content></ng-content>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:b}]});(typeof ngDevMode>"u"||ngDevMode)&&j(a,{className:"ChartLegend",filePath:"ChartLegend.ts",lineNumber:31});const n=class n{};s(n,"ɵfac",function(e){return new(e||n)}),s(n,"ɵmod",u({type:n})),s(n,"ɵinj",g({imports:[i]}));let r=n;(typeof ngDevMode>"u"||ngDevMode)&&d(r,[{type:x,args:[{declarations:[a],imports:[i],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&P(r,{declarations:[a],imports:[i],exports:[a]})})();export{r as ChartLegendModule,a as default};

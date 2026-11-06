var _=Object.defineProperty;var M=(o,t,e)=>t in o?_(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var n=(o,t,e)=>M(o,typeof t!="symbol"?t+"":t,e);import{ɵ as v,a as C,b as h,j as i,o as r,p as m,t as l,e as c,s as y,C as x,f as D,N,g as S}from"./core.BqS-lykr.js";import b,{StepperModule as u}from"./Stepper.Dr3lDnJX.js";import L,{StepperItemModule as f}from"./StepperItem.BCCXbhiR.js";import{C as g}from"./common_module-chunk.DvGwmKFp.js";import"./utils.BBpd638g.js";const a=class a{};n(a,"ɵfac",function(e){return new(e||a)}),n(a,"ɵcmp",v({type:a,selectors:[["spn-stepper-example"],["stepper-example"]],standalone:!1,decls:9,vars:5,consts:[["orientation","horizontal","ariaLabel","Checkout progress"],["status","completed",3,"step"],["status","active",3,"step"],["status","upcoming",3,"step"],["status","upcoming",3,"step","isLast"]],template:function(e,w){e&1&&(i(0,"spn-stepper",0)(1,"spn-stepper-item",1),r(2," Cart "),m(),i(3,"spn-stepper-item",2),r(4," Shipping "),m(),i(5,"spn-stepper-item",3),r(6," Payment "),m(),i(7,"spn-stepper-item",4),r(8," Review "),m()()),e&2&&(l(),c("step",1),l(2),c("step",2),l(2),c("step",3),l(2),c("step",4)("isLast",!0))},dependencies:[b,L],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=a;(typeof ngDevMode>"u"||ngDevMode)&&y(s,[{type:x,args:[{standalone:!1,selector:"spn-stepper-example, stepper-example",template:`
    <spn-stepper orientation="horizontal" ariaLabel="Checkout progress"
      ><spn-stepper-item status="completed" [step]="1"> Cart </spn-stepper-item>
      <spn-stepper-item status="active" [step]="2"> Shipping </spn-stepper-item>
      <spn-stepper-item status="upcoming" [step]="3">
        Payment
      </spn-stepper-item>
      <spn-stepper-item status="upcoming" [step]="4" [isLast]="true">
        Review
      </spn-stepper-item></spn-stepper
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&D(s,{className:"StepperExample",filePath:"StepperExample.ts",lineNumber:31});const p=class p{};n(p,"ɵfac",function(e){return new(e||p)}),n(p,"ɵmod",C({type:p})),n(p,"ɵinj",h({imports:[g,u,f]}));let d=p;(typeof ngDevMode>"u"||ngDevMode)&&y(d,[{type:N,args:[{declarations:[s],imports:[g,u,f],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&S(d,{declarations:[s],imports:[g,u,f],exports:[s]})})();export{d as StepperExampleModule,s as default};

var p=Object.defineProperty;var f=(l,t,e)=>t in l?p(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var a=(l,t,e)=>f(l,typeof t!="symbol"?t+"":t,e);import{ɵ as m,a as u,b as g,c as b,j as y,q as _,p as N,u as M,v as C,s as i,I as v,C as D,f as P,N as w,g as h}from"./core.vpEFnhB-.js";import{a as j,d as x}from"./theme.CecfD-Na.js";import{C as c}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const k=["*"],I={className:""},o=class o{constructor(){a(this,"cn",j);a(this,"bindControllerProps",x);a(this,"className",I.className)}};a(o,"ɵfac",function(e){return new(e||o)}),a(o,"ɵcmp",m({type:o,selectors:[["kd-card"],["card"]],inputs:{className:"className"},standalone:!1,ngContentSelectors:k,decls:2,vars:3,template:function(e,d){e&1&&(b(),y(0,"article"),_(1),N()),e&2&&(M(d.cn("flex w-full flex-col gap-2 rounded-lg border border-border-default bg-background-default p-4 shadow-sm",d.className)),C("data-ctrl",typeof d.bindControllerProps))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=o;(typeof ngDevMode>"u"||ngDevMode)&&i(s,[{type:D,args:[{standalone:!1,selector:"kd-card, card",template:`
    <article
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-2 rounded-lg border border-border-default bg-background-default p-4 shadow-sm', className)"
    >
      <ng-content></ng-content>
    </article>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:v}]});(typeof ngDevMode>"u"||ngDevMode)&&P(s,{className:"Card",filePath:"Card.ts",lineNumber:31});const n=class n{};a(n,"ɵfac",function(e){return new(e||n)}),a(n,"ɵmod",u({type:n})),a(n,"ɵinj",g({imports:[c]}));let r=n;(typeof ngDevMode>"u"||ngDevMode)&&i(r,[{type:w,args:[{declarations:[s],imports:[c],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&h(r,{declarations:[s],imports:[c],exports:[s]})})();export{r as CardModule,s as default};

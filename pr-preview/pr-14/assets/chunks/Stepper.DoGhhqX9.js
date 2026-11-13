var u=Object.defineProperty;var g=(i,t,e)=>t in i?u(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var a=(i,t,e)=>g(i,typeof t!="symbol"?t+"":t,e);import{ɵ as y,a as b,b as w,c as v,j as _,q as N,p as C,u as d,v as M,t as x,s as m,I as f,C as D,f as L,N as P,g as j}from"./core.vpEFnhB-.js";import{a as h,d as k}from"./theme.CecfD-Na.js";import{C as p}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const I=["*"],c={orientation:"horizontal",ariaLabel:"Progress",className:""},s=class s{constructor(){a(this,"cn",h);a(this,"bindControllerProps",k);a(this,"ariaLabel",c.ariaLabel);a(this,"orientation",c.orientation);a(this,"className",c.className)}};a(s,"ɵfac",function(e){return new(e||s)}),a(s,"ɵcmp",y({type:s,selectors:[["kd-stepper"],["stepper"]],inputs:{ariaLabel:"ariaLabel",orientation:"orientation",className:"className"},standalone:!1,ngContentSelectors:I,decls:3,vars:6,template:function(e,n){e&1&&(v(),_(0,"nav")(1,"ol"),N(2),C()()),e&2&&(d(n.cn("w-full bg-background-default",n.orientation!=="vertical"&&"overflow-x-auto py-1",n.className)),M("data-ctrl",typeof n.bindControllerProps)("aria-label",n.ariaLabel),x(),d(n.cn("flex items-start justify-start",n.orientation==="vertical"&&"w-full flex-col",n.orientation==="horizontal"&&"w-full min-w-max flex-row sm:min-w-full",n.orientation==="responsive"&&"w-full flex-col md:min-w-full md:flex-row")))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let o=s;(typeof ngDevMode>"u"||ngDevMode)&&m(o,[{type:D,args:[{standalone:!1,selector:"kd-stepper, stepper",template:`
    <nav
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-label]="ariaLabel"
      [class]="cn('w-full bg-background-default', orientation !== 'vertical' && 'overflow-x-auto py-1', className)"
    >
      <ol
        [class]="cn('flex items-start justify-start', orientation === 'vertical' && 'w-full flex-col', orientation === 'horizontal' && 'w-full min-w-max flex-row sm:min-w-full', orientation === 'responsive' && 'w-full flex-col md:min-w-full md:flex-row')"
      >
        <ng-content></ng-content>
      </ol>
    </nav>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{ariaLabel:[{type:f}],orientation:[{type:f}],className:[{type:f}]});(typeof ngDevMode>"u"||ngDevMode)&&L(o,{className:"Stepper",filePath:"Stepper.ts",lineNumber:42});const l=class l{};a(l,"ɵfac",function(e){return new(e||l)}),a(l,"ɵmod",b({type:l})),a(l,"ɵinj",w({imports:[p]}));let r=l;(typeof ngDevMode>"u"||ngDevMode)&&m(r,[{type:P,args:[{declarations:[o],imports:[p],exports:[o]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&j(r,{declarations:[o],imports:[p],exports:[o]})})();export{r as StepperModule,o as default};

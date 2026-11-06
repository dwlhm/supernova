var u=Object.defineProperty;var g=(r,t,e)=>t in r?u(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var a=(r,t,e)=>g(r,typeof t!="symbol"?t+"":t,e);import{ɵ as b,a as y,b as _,c as v,j as N,q as C,p as M,u as d,v as w,t as D,s as m,I as c,C as L,f as P,N as j,g as h}from"./core.BqS-lykr.js";import{a as x,b as I}from"./utils.BBpd638g.js";import{C as f}from"./common_module-chunk.DvGwmKFp.js";const k=["*"],p={orientation:"horizontal",ariaLabel:"Progress",className:""},l=class l{constructor(){a(this,"cn",x);a(this,"bindControllerProps",I);a(this,"ariaLabel",p.ariaLabel);a(this,"className",p.className);a(this,"orientation",p.orientation)}};a(l,"ɵfac",function(e){return new(e||l)}),a(l,"ɵcmp",b({type:l,selectors:[["spn-stepper"],["stepper"]],inputs:{ariaLabel:"ariaLabel",className:"className",orientation:"orientation"},standalone:!1,ngContentSelectors:k,decls:3,vars:6,template:function(e,o){e&1&&(v(),N(0,"nav")(1,"ol"),C(2),M()()),e&2&&(d(o.cn("w-full bg-background-default",o.className)),w("data-ctrl",typeof o.bindControllerProps)("aria-label",o.ariaLabel),D(),d(o.cn("flex items-start justify-start",o.orientation==="vertical"?"flex-col":"w-full flex-row")))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=l;(typeof ngDevMode>"u"||ngDevMode)&&m(n,[{type:L,args:[{standalone:!1,selector:"spn-stepper, stepper",template:`
    <nav
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-label]="ariaLabel"
      [class]="cn('w-full bg-background-default', className)"
    >
      <ol
        [class]="cn('flex items-start justify-start', orientation === 'vertical' ? 'flex-col' : 'w-full flex-row')"
      >
        <ng-content></ng-content>
      </ol>
    </nav>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{ariaLabel:[{type:c}],className:[{type:c}],orientation:[{type:c}]});(typeof ngDevMode>"u"||ngDevMode)&&P(n,{className:"Stepper",filePath:"Stepper.ts",lineNumber:42});const s=class s{};a(s,"ɵfac",function(e){return new(e||s)}),a(s,"ɵmod",y({type:s})),a(s,"ɵinj",_({imports:[f]}));let i=s;(typeof ngDevMode>"u"||ngDevMode)&&m(i,[{type:j,args:[{declarations:[n],imports:[f],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&h(i,{declarations:[n],imports:[f],exports:[n]})})();export{i as StepperModule,n as default};

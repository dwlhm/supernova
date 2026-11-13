var h=Object.defineProperty;var C=(n,r,t)=>r in n?h(n,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[r]=t;var o=(n,r,t)=>C(n,typeof r!="symbol"?r+"":r,t);import{ɵ as M,a as w,b as F,j as l,k as c,o as f,p as u,d as L,t as d,u as g,e as b,s as k,C as T,f as D,N,g as z,h as B,i as j,l as E,m as v,n as I,r as V,ao as O}from"./core.vpEFnhB-.js";import P,{StepperModule as _}from"./Stepper.BQHtrv9c.js";import R,{StepperItemModule as x}from"./StepperItem.CLcpZwCK.js";import{a as A}from"./theme.CMj9otVT.js";import{C as y,b as H}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";import"./StepperIndicator.bXy6fA4k.js";import"./StepperConnector.BWgrYSce.js";function J(n,r){if(n&1){const t=B();j(0),l(1,"kd-stepper-item",5),c("click",function(){const a=E(t).index,S=v();return I(S.activeStep=a)}),f(2),u(),V()}if(n&2){const t=r.$implicit,e=r.index,a=v();d(),b("index",e)("status",a.activeStep>e?"completed":a.activeStep===e?"active":"upcoming")("orientation",a.orientation)("isLast",e===5),d(),O(t)}}const p=class p{constructor(){o(this,"cn",A);o(this,"activeStep",1);o(this,"orientation","responsive");o(this,"steps",["Cart","Shipping","Payment","Review","Step 5","Step 6"])}trackByLabel0(r,t){return r}};o(p,"ɵfac",function(t){return new(t||p)}),o(p,"ɵcmp",M({type:p,selectors:[["kd-stepper-example"],["stepper-example"]],standalone:!1,decls:10,vars:9,consts:[[1,"flex","w-full","flex-col","gap-4"],[1,"flex","flex-wrap","items-center","justify-end","gap-1.5"],["type","button",3,"click"],["ariaLabel","Checkout progress",3,"orientation"],[4,"ngFor","ngForOf","ngForTrackBy"],[3,"click","index","status","orientation","isLast"]],template:function(t,e){t&1&&(l(0,"div",0)(1,"div",1)(2,"button",2),c("click",function(){return e.orientation="responsive"}),f(3," Responsive (Auto) "),u(),l(4,"button",2),c("click",function(){return e.orientation="horizontal"}),f(5," Horizontal "),u(),l(6,"button",2),c("click",function(){return e.orientation="vertical"}),f(7," Vertical "),u()(),l(8,"kd-stepper",3),L(9,J,3,5,"ng-container",4),u()()),t&2&&(d(2),g(e.cn("cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",e.orientation==="responsive"?"border-primary-default bg-primary-default text-primary-foreground":"border-border-default bg-background-default text-foreground-muted hover:text-foreground-default")),d(2),g(e.cn("cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",e.orientation==="horizontal"?"border-primary-default bg-primary-default text-primary-foreground":"border-border-default bg-background-default text-foreground-muted hover:text-foreground-default")),d(2),g(e.cn("cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",e.orientation==="vertical"?"border-primary-default bg-primary-default text-primary-foreground":"border-border-default bg-background-default text-foreground-muted hover:text-foreground-default")),d(2),b("orientation",e.orientation),d(),b("ngForOf",e.steps)("ngForTrackBy",e.trackByLabel0))},dependencies:[H,P,R],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let i=p;(typeof ngDevMode>"u"||ngDevMode)&&k(i,[{type:T,args:[{standalone:!1,selector:"kd-stepper-example, stepper-example",template:`
    <div class="flex w-full flex-col gap-4">
      <div class="flex flex-wrap items-center justify-end gap-1.5">
        <button
          type="button"
          [class]="cn('cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors', orientation === 'responsive' ? 'border-primary-default bg-primary-default text-primary-foreground' : 'border-border-default bg-background-default text-foreground-muted hover:text-foreground-default')"
          (click)="
          orientation = 'responsive';
        "
        >
          Responsive (Auto)
        </button>
        <button
          type="button"
          [class]="cn('cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors', orientation === 'horizontal' ? 'border-primary-default bg-primary-default text-primary-foreground' : 'border-border-default bg-background-default text-foreground-muted hover:text-foreground-default')"
          (click)="
          orientation = 'horizontal';
        "
        >
          Horizontal
        </button>
        <button
          type="button"
          [class]="cn('cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors', orientation === 'vertical' ? 'border-primary-default bg-primary-default text-primary-foreground' : 'border-border-default bg-background-default text-foreground-muted hover:text-foreground-default')"
          (click)="
          orientation = 'vertical';
        "
        >
          Vertical
        </button>
      </div>
      <kd-stepper ariaLabel="Checkout progress" [orientation]="orientation"
        ><ng-container
          *ngFor="let label of steps; index as index; trackBy: trackByLabel0"
          ><kd-stepper-item
            [index]="index"
            [status]="activeStep > index ? 'completed' : activeStep === index ? 'active' : 'upcoming'"
            [orientation]="orientation"
            [isLast]="index === 5"
            (click)="
          activeStep = index;
        "
            >{{label}}</kd-stepper-item
          ></ng-container
        ></kd-stepper
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&D(i,{className:"StepperExample",filePath:"StepperExample.ts",lineNumber:68});const s=class s{};o(s,"ɵfac",function(t){return new(t||s)}),o(s,"ɵmod",w({type:s})),o(s,"ɵinj",F({imports:[y,_,x]}));let m=s;(typeof ngDevMode>"u"||ngDevMode)&&k(m,[{type:N,args:[{declarations:[i],imports:[y,_,x],exports:[i]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&z(m,{declarations:[i],imports:[y,_,x],exports:[i]})})();export{m as StepperExampleModule,i as default};

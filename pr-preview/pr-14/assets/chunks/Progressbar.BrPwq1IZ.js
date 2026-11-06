var y=Object.defineProperty;var w=(l,t,e)=>t in l?y(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var a=(l,t,e)=>w(l,typeof t!="symbol"?t+"":t,e);import{ɵ as h,a as x,b as N,j as u,d as S,z as C,p as c,u as P,v as m,t as i,e as b,s as _,I as d,C as M,f as I,N as L,g as D,i as j,o as v,r as k,m as E,am as F,x as J}from"./core.BqS-lykr.js";import{a as T,t as z,b as O}from"./utils.BBpd638g.js";import{C as f,N as q,b as A}from"./common_module-chunk.DvGwmKFp.js";function B(l,t){if(l&1&&(j(0),u(1,"div",3)(2,"span"),v(3),c(),u(4,"span"),v(5),c()(),k()),l&2){const e=E();i(3),F(e.label),i(2),J("",e.getProgressState(e.value).percentage," %")}}const p={value:0,label:"Progress",showLabel:!1,className:""},o=class o{constructor(){a(this,"cn",T);a(this,"getProgressState",z);a(this,"bindControllerProps",O);a(this,"className",p.className);a(this,"showLabel",p.showLabel);a(this,"label",p.label);a(this,"value",p.value)}};a(o,"ɵfac",function(e){return new(e||o)}),a(o,"ɵcmp",h({type:o,selectors:[["spn-progressbar"],["progressbar"]],inputs:{className:"className",showLabel:"showLabel",label:"label",value:"value"},standalone:!1,decls:4,vars:9,consts:[[4,"ngIf"],["role","progressbar",1,"h-2","w-full","overflow-hidden","rounded-full","bg-background-muted"],[1,"h-2","rounded-full","bg-primary-default","transition-all",3,"ngStyle"],[1,"flex","items-center","justify-between","text-xs","text-foreground-muted"]],template:function(e,s){e&1&&(u(0,"div"),S(1,B,6,2,"ng-container",0),u(2,"div",1),C(3,"div",2),c()()),e&2&&(P(s.cn("flex w-full flex-col gap-2",s.className)),m("data-ctrl",typeof s.bindControllerProps),i(),b("ngIf",s.showLabel),i(),m("aria-valuenow",s.getProgressState(s.value).percentage)("aria-valuemin",0)("aria-valuemax",100)("aria-label",s.label),i(),b("ngStyle",s.getProgressState(s.value).barStyle))},dependencies:[q,A],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=o;(typeof ngDevMode>"u"||ngDevMode)&&_(n,[{type:M,args:[{standalone:!1,selector:"spn-progressbar, progressbar",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-2', className)"
    >
      <ng-container *ngIf="showLabel"
        ><div
          class="flex items-center justify-between text-xs text-foreground-muted"
        >
          <span>{{label}}</span>
          <span>{{getProgressState(value).percentage}} %</span>
        </div></ng-container
      >
      <div
        role="progressbar"
        class="h-2 w-full overflow-hidden rounded-full bg-background-muted"
        [attr.aria-valuenow]="getProgressState(value).percentage"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="100"
        [attr.aria-label]="label"
      >
        <div
          class="h-2 rounded-full bg-primary-default transition-all"
          [ngStyle]="getProgressState(value).barStyle"
        ></div>
      </div>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:d}],showLabel:[{type:d}],label:[{type:d}],value:[{type:d}]});(typeof ngDevMode>"u"||ngDevMode)&&I(n,{className:"Progressbar",filePath:"Progressbar.ts",lineNumber:59});const r=class r{};a(r,"ɵfac",function(e){return new(e||r)}),a(r,"ɵmod",x({type:r})),a(r,"ɵinj",N({imports:[f]}));let g=r;(typeof ngDevMode>"u"||ngDevMode)&&_(g,[{type:L,args:[{declarations:[n],imports:[f],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&D(g,{declarations:[n],imports:[f],exports:[n]})})();export{g as ProgressbarModule,n as default};

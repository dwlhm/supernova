var h=Object.defineProperty;var P=(l,s,e)=>s in l?h(l,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[s]=e;var t=(l,s,e)=>P(l,typeof s!="symbol"?s+"":s,e);import{ɵ as S,a as k,b as x,j as d,d as v,z as I,p as u,u as m,t as g,e as f,v as L,s as _,I as r,C as M,f as D,N as j,g as T,i as y,o as N,r as w,m as C,ao as E,x as F}from"./core.vpEFnhB-.js";import{a as J,K as z}from"./theme.CMj9otVT.js";import{C as b,a as K,c as O}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";function q(l,s){if(l&1&&(y(0),d(1,"span"),N(2),u(),w()),l&2){const e=C(2);g(2),F("",e.getProgressState(e.value,e.label).percentage," %")}}function A(l,s){if(l&1&&(y(0),d(1,"div",3)(2,"span"),N(3),u(),v(4,q,3,1,"ng-container",0),u(),w()),l&2){const e=C();g(3),E(e.getProgressState(e.value,e.label).resolvedLabel),g(),f("ngIf",e.showPercentage)}}const o={value:0,label:"Progress",showLabel:!1,showPercentage:!0,trackClassName:"",indicatorClassName:"",className:""},c=class c{constructor(){t(this,"cn",J);t(this,"getProgressState",z);t(this,"className",o.className);t(this,"showLabel",o.showLabel);t(this,"value",o.value);t(this,"label",o.label);t(this,"showPercentage",o.showPercentage);t(this,"trackClassName",o.trackClassName);t(this,"indicatorClassName",o.indicatorClassName)}};t(c,"ɵfac",function(e){return new(e||c)}),t(c,"ɵcmp",S({type:c,selectors:[["kd-progressbar"],["progressbar"]],inputs:{className:"className",showLabel:"showLabel",value:"value",label:"label",showPercentage:"showPercentage",trackClassName:"trackClassName",indicatorClassName:"indicatorClassName"},standalone:!1,decls:4,vars:12,consts:[[4,"ngIf"],["role","progressbar"],[3,"ngStyle"],[1,"flex","items-center","justify-between","text-xs","text-foreground-muted"]],template:function(e,a){e&1&&(d(0,"div"),v(1,A,5,2,"ng-container",0),d(2,"div",1),I(3,"div",2),u()()),e&2&&(m(a.cn("flex w-full flex-col gap-2",a.className)),g(),f("ngIf",a.showLabel),g(),m(a.cn("h-2 w-full overflow-hidden rounded-full bg-background-muted",a.trackClassName)),L("aria-valuenow",a.getProgressState(a.value,a.label).percentage)("aria-valuemin",0)("aria-valuemax",100)("aria-label",a.getProgressState(a.value,a.label).resolvedLabel),g(),m(a.cn("h-2 rounded-full bg-primary-default transition-all",a.indicatorClassName)),f("ngStyle",a.getProgressState(a.value,a.label).barStyle))},dependencies:[K,O],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=c;(typeof ngDevMode>"u"||ngDevMode)&&_(n,[{type:M,args:[{standalone:!1,selector:"kd-progressbar, progressbar",template:`
    <div [class]="cn('flex w-full flex-col gap-2', className)">
      <ng-container *ngIf="showLabel"
        ><div
          class="flex items-center justify-between text-xs text-foreground-muted"
        >
          <span>{{getProgressState(value, label).resolvedLabel}}</span>
          <ng-container *ngIf="showPercentage"
            ><span
              >{{getProgressState(value, label).percentage}} %</span
            ></ng-container
          >
        </div></ng-container
      >
      <div
        role="progressbar"
        [attr.aria-valuenow]="getProgressState(value, label).percentage"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="100"
        [attr.aria-label]="getProgressState(value, label).resolvedLabel"
        [class]="cn('h-2 w-full overflow-hidden rounded-full bg-background-muted', trackClassName)"
      >
        <div
          [class]="cn('h-2 rounded-full bg-primary-default transition-all', indicatorClassName)"
          [ngStyle]="getProgressState(value, label).barStyle"
        ></div>
      </div>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:r}],showLabel:[{type:r}],value:[{type:r}],label:[{type:r}],showPercentage:[{type:r}],trackClassName:[{type:r}],indicatorClassName:[{type:r}]});(typeof ngDevMode>"u"||ngDevMode)&&D(n,{className:"Progressbar",filePath:"Progressbar.ts",lineNumber:66});const i=class i{};t(i,"ɵfac",function(e){return new(e||i)}),t(i,"ɵmod",k({type:i})),t(i,"ɵinj",x({imports:[b]}));let p=i;(typeof ngDevMode>"u"||ngDevMode)&&_(p,[{type:j,args:[{declarations:[n],imports:[b],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&T(p,{declarations:[n],imports:[b],exports:[n]})})();export{p as ProgressbarModule,n as default};

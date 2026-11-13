var w=Object.defineProperty;var C=(t,n,e)=>n in t?w(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e;var s=(t,n,e)=>C(t,typeof n!="symbol"?n+"":n,e);import{ɵ as I,a as M,b as L,d as v,e as p,s as y,I as r,C as D,f as j,N as k,g as z,i as u,r as m,m as g,t as c,j as h,z as b,p as x,u as d}from"./core.vpEFnhB-.js";import{a as S}from"./theme.CecfD-Na.js";import{C as _,a as T}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";function P(t,n){if(t&1&&(u(0),h(1,"div",1),b(2,"div"),x(),m()),t&2){const e=g(2);c(),d(e.cn("absolute top-4 left-1/2 -translate-y-1/2 w-full h-0.5",e.orientation==="responsive"&&"hidden md:block",e.className)),c(),d(e.cn("h-full w-full",e.status==="completed"?"bg-success-foreground":"bg-border-default"))}}function E(t,n){if(t&1&&(u(0),h(1,"div",1),b(2,"div"),x(),m()),t&2){const e=g(2);c(),d(e.cn("h-8 w-8 flex-row items-center justify-center",e.orientation==="vertical"?"flex":"flex md:hidden",e.className)),c(),d(e.cn("h-8 w-0.5",e.status==="completed"?"bg-success-foreground":"bg-border-default"))}}function F(t,n){if(t&1&&(u(0),v(1,P,3,4,"ng-container",0)(2,E,3,4,"ng-container",0),m()),t&2){const e=g();c(),p("ngIf",e.orientation!=="vertical"),c(),p("ngIf",e.orientation!=="horizontal")}}const l={status:"upcoming",orientation:"horizontal",isLast:!1,className:""},i=class i{constructor(){s(this,"cn",S);s(this,"isLast",l.isLast);s(this,"orientation",l.orientation);s(this,"className",l.className);s(this,"status",l.status)}};s(i,"ɵfac",function(e){return new(e||i)}),s(i,"ɵcmp",I({type:i,selectors:[["kd-stepper-connector"],["stepper-connector"]],inputs:{isLast:"isLast",orientation:"orientation",className:"className",status:"status"},standalone:!1,decls:1,vars:1,consts:[[4,"ngIf"],["aria-hidden","true"]],template:function(e,N){e&1&&v(0,F,3,2,"ng-container",0),e&2&&p("ngIf",!N.isLast)},dependencies:[T],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=i;(typeof ngDevMode>"u"||ngDevMode)&&y(a,[{type:D,args:[{standalone:!1,selector:"kd-stepper-connector, stepper-connector",template:`
    <ng-container *ngIf="!isLast"
      ><ng-container *ngIf="orientation !== 'vertical'"
        ><div
          aria-hidden="true"
          [class]="cn('absolute top-4 left-1/2 -translate-y-1/2 w-full h-0.5', orientation === 'responsive' && 'hidden md:block', className)"
        >
          <div
            [class]="cn('h-full w-full', status === 'completed' ? 'bg-success-foreground' : 'bg-border-default')"
          ></div></div
      ></ng-container>
      <ng-container *ngIf="orientation !== 'horizontal'"
        ><div
          aria-hidden="true"
          [class]="cn('h-8 w-8 flex-row items-center justify-center', orientation === 'vertical' ? 'flex' : 'flex md:hidden', className)"
        >
          <div
            [class]="cn('h-8 w-0.5', status === 'completed' ? 'bg-success-foreground' : 'bg-border-default')"
          ></div></div></ng-container
    ></ng-container>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{isLast:[{type:r}],orientation:[{type:r}],className:[{type:r}],status:[{type:r}]});(typeof ngDevMode>"u"||ngDevMode)&&j(a,{className:"StepperConnector",filePath:"StepperConnector.ts",lineNumber:52});const o=class o{};s(o,"ɵfac",function(e){return new(e||o)}),s(o,"ɵmod",M({type:o})),s(o,"ɵinj",L({imports:[_]}));let f=o;(typeof ngDevMode>"u"||ngDevMode)&&y(f,[{type:k,args:[{declarations:[a],imports:[_],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&z(f,{declarations:[a],imports:[_],exports:[a]})})();export{f as StepperConnectorModule,a as default};

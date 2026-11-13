var C=Object.defineProperty;var h=(e,n,t)=>n in e?C(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t;var o=(e,n,t)=>h(e,typeof n!="symbol"?n+"":n,t);import{ɵ as b,a as N,b as I,c as k,j as m,d as g,q as M,p as f,u as j,t as r,e as d,s as v,I as l,C as D,f as S,N as O,g as T,i as _,r as x,m as w,y as L,z as P,o as B,ao as E,A as F}from"./core.vpEFnhB-.js";import{a as J}from"./theme.CecfD-Na.js";import{C as y,N as q,a as z}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const A=[[["","icon",""],["","slot","icon"]]],G=["[icon],[slot=icon]"];function V(e,n){e&1&&F(0)}function H(e,n){if(e&1&&(_(0),g(1,V,1,0,"ng-container",1),x()),e&2){const t=w();r(),d("ngComponentOutlet",t.icon)}}function K(e,n){e&1&&(_(0),L(),m(1,"svg",2),P(2,"path",3),f(),x())}function Q(e,n){if(e&1&&(_(0),m(1,"span",4),B(2),f(),x()),e&2){const t=w();r(2),E((t.index??0)+1)}}const u={index:0,status:"upcoming",className:""},c=class c{constructor(){o(this,"cn",J);o(this,"status",u.status);o(this,"className",u.className);o(this,"icon");o(this,"index",u.index)}};o(c,"ɵfac",function(t){return new(t||c)}),o(c,"ɵcmp",b({type:c,selectors:[["kd-stepper-indicator"],["stepper-indicator"]],inputs:{status:"status",className:"className",icon:"icon",index:"index"},standalone:!1,ngContentSelectors:G,decls:5,vars:5,consts:[[4,"ngIf"],[4,"ngComponentOutlet"],["viewBox","0 0 16 16","fill","none","xmlns","http://www.w3.org/2000/svg","aria-hidden","true",1,"w-4","h-4"],["d","M13.3334 4L6.00008 11.3333L2.66675 8","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],[1,"text-center"]],template:function(t,s){t&1&&(k(A),m(0,"div"),g(1,H,2,1,"ng-container",0),M(2),g(3,K,3,0,"ng-container",0)(4,Q,3,1,"ng-container",0),f()),t&2&&(j(s.cn("flex h-8 w-8 shrink-0 flex-row items-center justify-center rounded-full font-body text-xs font-semibold leading-4",s.status==="completed"&&"bg-success-subtle text-success-foreground",s.status==="active"&&"bg-primary-default text-primary-foreground",(s.status==="upcoming"||!s.status)&&"bg-background-muted text-foreground-muted",s.className)),r(),d("ngIf",s.icon),r(2),d("ngIf",!s.icon&&s.status==="completed"),r(),d("ngIf",!s.icon&&s.status!=="completed"))},dependencies:[q,z],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=c;(typeof ngDevMode>"u"||ngDevMode)&&v(a,[{type:D,args:[{standalone:!1,selector:"kd-stepper-indicator, stepper-indicator",template:`
    <div
      [class]="cn('flex h-8 w-8 shrink-0 flex-row items-center justify-center rounded-full font-body text-xs font-semibold leading-4', status === 'completed' && 'bg-success-subtle text-success-foreground', status === 'active' && 'bg-primary-default text-primary-foreground', (status === 'upcoming' || !status) && 'bg-background-muted text-foreground-muted', className)"
    >
      <ng-container *ngIf="icon"><ng-container *ngComponentOutlet="icon"></ng-container></ng-container><ng-content select="[icon],[slot=icon]"></ng-content>
      <ng-container *ngIf="!icon && status === 'completed'"
        ><svg
          class="w-4 h-4"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M13.3334 4L6.00008 11.3333L2.66675 8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path></svg
      ></ng-container>
      <ng-container *ngIf="!icon && status !== 'completed'"
        ><span class="text-center">{{(index ?? 0) + 1}}</span></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{status:[{type:l}],className:[{type:l}],icon:[{type:l}],index:[{type:l}]});(typeof ngDevMode>"u"||ngDevMode)&&S(a,{className:"StepperIndicator",filePath:"StepperIndicator.ts",lineNumber:52});const i=class i{};o(i,"ɵfac",function(t){return new(t||i)}),o(i,"ɵmod",N({type:i})),o(i,"ɵinj",I({imports:[y]}));let p=i;(typeof ngDevMode>"u"||ngDevMode)&&v(p,[{type:O,args:[{declarations:[a],imports:[y],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&T(p,{declarations:[a],imports:[y],exports:[a]})})();export{p as StepperIndicatorModule,a as default};

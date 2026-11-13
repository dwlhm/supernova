var I=Object.defineProperty;var T=(t,n,e)=>n in t?I(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e;var s=(t,n,e)=>T(t,typeof n!="symbol"?n+"":n,e);import{ɵ as C,a as M,b as j,c as k,j as f,d as v,q as D,p as u,u as y,t as d,e as p,s as h,I as c,C as S,f as F,N as P,g as E,i as m,o as N,r as _,m as x,ao as w,z as J,an as q}from"./core.vpEFnhB-.js";import{a as z,e as L}from"./theme.CecfD-Na.js";import{C as b,a as O}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const A=["*"],B=()=>({"series-1":"bg-chart-series-1","series-2":"bg-chart-series-2","series-3":"bg-chart-series-3",muted:"bg-foreground-muted"});function G(t,n){if(t&1&&(m(0),f(1,"span",3),N(2),u(),_()),t&2){const e=x();d(2),w(e.badge)}}function H(t,n){if(t&1&&(m(0),J(1,"span",4),_()),t&2){const e=x();d(),y(e.cn("h-1.5 w-1.5 shrink-0 rounded-full",e.cva(e.dotTone,q(2,B),"series-1")))}}function K(t,n){if(t&1&&(m(0),f(1,"span",5),N(2),u(),_()),t&2){const e=x();d(2),w(e.value)}}const l={value:"",badge:"",dotTone:"series-1",className:""},i=class i{constructor(){s(this,"cn",z);s(this,"cva",L);s(this,"className",l.className);s(this,"badge",l.badge);s(this,"dotTone",l.dotTone);s(this,"value",l.value)}};s(i,"ɵfac",function(e){return new(e||i)}),s(i,"ɵcmp",C({type:i,selectors:[["kd-list-item"],["list-item"]],inputs:{className:"className",badge:"badge",dotTone:"dotTone",value:"value"},standalone:!1,ngContentSelectors:A,decls:7,vars:5,consts:[[1,"flex","min-w-0","flex-row","items-center","justify-start","gap-2"],[4,"ngIf"],[1,"truncate","text-xs","font-normal","text-foreground-default"],[1,"flex","h-5","items-center","justify-center","rounded-sm","bg-background-muted","px-1","py-0.5","text-xs","font-semibold","text-foreground-default"],["aria-hidden","true"],[1,"shrink-0","text-xs","font-semibold","text-foreground-default"]],template:function(e,r){e&1&&(k(),f(0,"div")(1,"div",0),v(2,G,3,1,"ng-container",1)(3,H,2,3,"ng-container",1),f(4,"span",2),D(5),u()(),v(6,K,3,1,"ng-container",1),u()),e&2&&(y(r.cn("flex w-full flex-row items-center justify-between gap-2",r.className)),d(2),p("ngIf",r.badge),d(),p("ngIf",!r.badge&&r.dotTone!=="none"),d(3),p("ngIf",r.value))},dependencies:[O],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=i;(typeof ngDevMode>"u"||ngDevMode)&&h(a,[{type:S,args:[{standalone:!1,selector:"kd-list-item, list-item",template:`
    <div
      [class]="cn('flex w-full flex-row items-center justify-between gap-2', className)"
    >
      <div class="flex min-w-0 flex-row items-center justify-start gap-2">
        <ng-container *ngIf="badge"
          ><span
            class="flex h-5 items-center justify-center rounded-sm bg-background-muted px-1 py-0.5 text-xs font-semibold text-foreground-default"
            >{{badge}}</span
          ></ng-container
        >
        <ng-container *ngIf="!badge && dotTone !== 'none'"
          ><span
            aria-hidden="true"
            [class]="cn('h-1.5 w-1.5 shrink-0 rounded-full', cva(dotTone, {
          'series-1': 'bg-chart-series-1',
          'series-2': 'bg-chart-series-2',
          'series-3': 'bg-chart-series-3',
          muted: 'bg-foreground-muted'
        }, 'series-1'))"
          ></span
        ></ng-container>
        <span class="truncate text-xs font-normal text-foreground-default"
          ><ng-content></ng-content
        ></span>
      </div>
      <ng-container *ngIf="value"
        ><span
          class="shrink-0 text-xs font-semibold text-foreground-default"
          >{{value}}</span
        ></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:c}],badge:[{type:c}],dotTone:[{type:c}],value:[{type:c}]});(typeof ngDevMode>"u"||ngDevMode)&&F(a,{className:"ListItem",filePath:"ListItem.ts",lineNumber:65});const o=class o{};s(o,"ɵfac",function(e){return new(e||o)}),s(o,"ɵmod",M({type:o})),s(o,"ɵinj",j({imports:[b]}));let g=o;(typeof ngDevMode>"u"||ngDevMode)&&h(g,[{type:P,args:[{declarations:[a],imports:[b],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&E(g,{declarations:[a],imports:[b],exports:[a]})})();export{g as ListItemModule,a as default};

var C=Object.defineProperty;var j=(n,a,e)=>a in n?C(n,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[a]=e;var s=(n,a,e)=>j(n,typeof a!="symbol"?a+"":a,e);import{ɵ as k,a as M,b as L,c as S,j as p,d as h,p as f,q as D,u as c,t as o,w,v as b,e as g,s as N,I as u,C as T,f as P,N as O,g as z,i as _,y as A,z as I,r as x,m as v,o as H,am as F}from"./core.BqS-lykr.js";import{a as B,d as E,I as J}from"./utils.BBpd638g.js";import{C as y,N as q}from"./common_module-chunk.DvGwmKFp.js";const G=["*"],V=()=>({completed:"bg-success-subtle text-success-foreground",active:"bg-primary-default text-primary-foreground",upcoming:"bg-background-muted text-foreground-muted"}),K=()=>({completed:"font-medium text-foreground-default",active:"font-semibold text-foreground-default",upcoming:"font-medium text-foreground-muted"});function Q(n,a){if(n&1&&(_(0),A(),p(1,"svg",1),I(2,"path",2),f(),x()),n&2){const e=v();o(2),b("d",e.ICON_PATHS.check)}}function R(n,a){if(n&1&&(_(0),H(1),x()),n&2){const e=v();o(),F(e.step)}}function U(n,a){if(n&1&&(_(0),p(1,"div",3),I(2,"span"),f(),x()),n&2){const e=v();o(),c(e.cn("flex items-center justify-center",e.orientation==="vertical"?"h-8 w-8 flex-row":"h-8 flex-1 flex-col")),o(),c(e.cn(e.orientation==="vertical"?"h-8 w-0.5":"h-0.5 w-full",e.status==="completed"?"bg-success-foreground":"bg-border-default"))}}const d={step:1,status:"upcoming",orientation:"horizontal",isLast:!1,className:""},l=class l{constructor(){s(this,"cn",B);s(this,"cva",E);s(this,"ICON_PATHS",J);s(this,"orientation",d.orientation);s(this,"isLast",d.isLast);s(this,"className",d.className);s(this,"status",d.status);s(this,"step",d.step)}};s(l,"ɵfac",function(e){return new(e||l)}),s(l,"ɵcmp",k({type:l,selectors:[["spn-stepper-item"],["stepper-item"]],inputs:{orientation:"orientation",isLast:"isLast",className:"className",status:"status",step:"step"},standalone:!1,ngContentSelectors:G,decls:8,vars:14,consts:[[4,"ngIf"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2",1,"h-4","w-4"],["stroke-linecap","round","stroke-linejoin","round"],["aria-hidden","true"]],template:function(e,t){e&1&&(S(),p(0,"li")(1,"div")(2,"span"),h(3,Q,3,1,"ng-container",0)(4,R,2,1,"ng-container",0),f(),p(5,"span"),D(6),f()(),h(7,U,3,4,"ng-container",0),f()),e&2&&(c(t.cn("flex items-start justify-start",t.orientation==="vertical"?"flex-col":t.isLast?"flex-row":"flex-1 flex-row",t.className)),o(),c(t.cn("flex items-center justify-start gap-2",t.orientation==="vertical"?"flex-row":"flex-col")),o(),c(t.cn("flex h-8 w-8 shrink-0 flex-row items-center justify-center rounded-full text-center text-xs font-semibold",t.cva(t.status,w(12,V),"upcoming"))),b("aria-current",t.status==="active"?"step":void 0),o(),g("ngIf",t.status==="completed"),o(),g("ngIf",t.status!=="completed"),o(),c(t.cn("text-sm",t.orientation==="horizontal"&&"text-center",t.cva(t.status,w(13,K),"upcoming"))),o(2),g("ngIf",!t.isLast))},dependencies:[q],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let i=l;(typeof ngDevMode>"u"||ngDevMode)&&N(i,[{type:T,args:[{standalone:!1,selector:"spn-stepper-item, stepper-item",template:`
    <li
      [class]="cn('flex items-start justify-start', orientation === 'vertical' ? 'flex-col' : !isLast ? 'flex-1 flex-row' : 'flex-row', className)"
    >
      <div
        [class]="cn('flex items-center justify-start gap-2', orientation === 'vertical' ? 'flex-row' : 'flex-col')"
      >
        <span
          [class]="cn('flex h-8 w-8 shrink-0 flex-row items-center justify-center rounded-full text-center text-xs font-semibold', cva(status, {
          completed: 'bg-success-subtle text-success-foreground',
          active: 'bg-primary-default text-primary-foreground',
          upcoming: 'bg-background-muted text-foreground-muted'
        }, 'upcoming'))"
          [attr.aria-current]="status === 'active' ? 'step' : undefined"
          ><ng-container *ngIf="status === 'completed'"
            ><svg
              aria-hidden="true"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                [attr.d]="ICON_PATHS.check"
              ></path></svg
          ></ng-container>
          <ng-container
            *ngIf="status !== 'completed'"
            >{{step}}</ng-container
          ></span
        >
        <span
          [class]="cn('text-sm', orientation === 'horizontal' && 'text-center', cva(status, {
          completed: 'font-medium text-foreground-default',
          active: 'font-semibold text-foreground-default',
          upcoming: 'font-medium text-foreground-muted'
        }, 'upcoming'))"
          ><ng-content></ng-content
        ></span>
      </div>
      <ng-container *ngIf="!isLast"
        ><div
          aria-hidden="true"
          [class]="cn('flex items-center justify-center', orientation === 'vertical' ? 'h-8 w-8 flex-row' : 'h-8 flex-1 flex-col')"
        >
          <span
            [class]="cn(orientation === 'vertical' ? 'h-8 w-0.5' : 'h-0.5 w-full', status === 'completed' ? 'bg-success-foreground' : 'bg-border-default')"
          ></span></div
      ></ng-container>
    </li>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{orientation:[{type:u}],isLast:[{type:u}],className:[{type:u}],status:[{type:u}],step:[{type:u}]});(typeof ngDevMode>"u"||ngDevMode)&&P(i,{className:"StepperItem",filePath:"StepperItem.ts",lineNumber:87});const r=class r{};s(r,"ɵfac",function(e){return new(e||r)}),s(r,"ɵmod",M({type:r})),s(r,"ɵinj",L({imports:[y]}));let m=r;(typeof ngDevMode>"u"||ngDevMode)&&N(m,[{type:O,args:[{declarations:[i],imports:[y],exports:[i]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&z(m,{declarations:[i],imports:[y],exports:[i]})})();export{m as StepperItemModule,i as default};

var b=Object.defineProperty;var M=(r,i,n)=>i in r?b(r,i,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[i]=n;var t=(r,i,n)=>M(r,typeof i!="symbol"?i+"":i,n);import{E as N,ɵ as L,a as z,b as D,c as I,j as g,k as S,z as x,i as E,q as j,p as m,r as O,u,v as y,t as d,e as w,s as C,O as P,I as l,C as T,f as F,N as J,g as q}from"./core.vpEFnhB-.js";import{a as $}from"./theme.CMj9otVT.js";import A,{StepperIndicatorModule as f}from"./StepperIndicator.bXy6fA4k.js";import B,{StepperConnectorModule as v}from"./StepperConnector.BWgrYSce.js";import{C as k}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const G=["*"],c={index:0,status:"upcoming",orientation:"horizontal",isLast:!1,className:""},a=class a{constructor(){t(this,"cn",$);t(this,"status",c.status);t(this,"orientation",c.orientation);t(this,"className",c.className);t(this,"index",c.index);t(this,"isLast",c.isLast);t(this,"onClick",new N)}};t(a,"ɵfac",function(n){return new(n||a)}),t(a,"ɵcmp",L({type:a,selectors:[["kd-stepper-item"],["stepper-item"]],inputs:{status:"status",orientation:"orientation",className:"className",index:"index",isLast:"isLast"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:G,decls:7,vars:13,consts:[["role","button",3,"click","keydown"],[3,"index","status"],[3,"status","orientation","isLast"]],template:function(n,e){n&1&&(I(),g(0,"li")(1,"div",0),S("click",function(){return e.onClick&&e.onClick.emit()})("keydown",function(_){return(_.key==="Enter"||_.key===" ")&&e.onClick&&e.onClick.emit()}),x(2,"kd-stepper-indicator",1),E(3),g(4,"span"),j(5),m(),O(),m(),x(6,"kd-stepper-connector",2),m()),n&2&&(u(e.cn(e.orientation==="vertical"&&"flex w-full flex-col items-start",e.orientation==="horizontal"&&"relative flex flex-1 flex-col items-center min-w-[4.5rem] sm:min-w-0 shrink-0 sm:shrink",e.orientation==="responsive"&&"relative flex w-full flex-col items-start md:flex-1 md:items-center md:min-w-0 md:shrink",e.className)),y("aria-current",e.status==="active"?"step":void 0),d(),u(e.cn("relative z-10 flex cursor-pointer items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",e.orientation==="vertical"&&"flex-row",e.orientation==="horizontal"&&"flex-col",e.orientation==="responsive"&&"flex-row md:flex-col")),y("tabIndex",0),d(),w("index",e.index)("status",e.status),d(2),u(e.cn("font-body text-sm font-medium leading-5 px-1",e.orientation==="vertical"&&"text-left",e.orientation==="horizontal"&&"text-center whitespace-nowrap",e.orientation==="responsive"&&"text-left md:text-center whitespace-nowrap",e.status==="upcoming"?"text-foreground-muted":"text-foreground-default")),d(2),w("status",e.status)("orientation",e.orientation)("isLast",e.isLast))},dependencies:[A,B],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=a;(typeof ngDevMode>"u"||ngDevMode)&&C(s,[{type:T,args:[{standalone:!1,selector:"kd-stepper-item, stepper-item",template:`
    <li
      [attr.aria-current]="status === 'active' ? 'step' : undefined"
      [class]="cn(orientation === 'vertical' && 'flex w-full flex-col items-start', orientation === 'horizontal' && 'relative flex flex-1 flex-col items-center min-w-[4.5rem] sm:min-w-0 shrink-0 sm:shrink', orientation === 'responsive' && 'relative flex w-full flex-col items-start md:flex-1 md:items-center md:min-w-0 md:shrink', className)"
    >
      <div
        role="button"
        [attr.tabIndex]="0"
        (click)="onClick && this.onClick.emit()"
        (keydown)="($event.key === 'Enter' || $event.key === ' ') && onClick && this.onClick.emit()"
        [class]="cn('relative z-10 flex cursor-pointer items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', orientation === 'vertical' && 'flex-row', orientation === 'horizontal' && 'flex-col', orientation === 'responsive' && 'flex-row md:flex-col')"
      >
        <kd-stepper-indicator
          [index]="index"
          [status]="status"
        ></kd-stepper-indicator>
        <ng-container><span
            [class]="cn('font-body text-sm font-medium leading-5 px-1', orientation === 'vertical' && 'text-left', orientation === 'horizontal' && 'text-center whitespace-nowrap', orientation === 'responsive' && 'text-left md:text-center whitespace-nowrap', status === 'upcoming' ? 'text-foreground-muted' : 'text-foreground-default')"
            ><ng-content></ng-content></span
        ></ng-container>
      </div>
      <kd-stepper-connector
        [status]="status"
        [orientation]="orientation"
        [isLast]="isLast"
      ></kd-stepper-connector>
    </li>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{status:[{type:l}],orientation:[{type:l}],className:[{type:l}],index:[{type:l}],isLast:[{type:l}],onClick:[{type:P}]});(typeof ngDevMode>"u"||ngDevMode)&&F(s,{className:"StepperItem",filePath:"StepperItem.ts",lineNumber:65});const o=class o{};t(o,"ɵfac",function(n){return new(n||o)}),t(o,"ɵmod",z({type:o})),t(o,"ɵinj",D({imports:[k,f,v]}));let p=o;(typeof ngDevMode>"u"||ngDevMode)&&C(p,[{type:J,args:[{declarations:[s],imports:[k,f,v],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&q(p,{declarations:[s],imports:[k,f,v],exports:[s]})})();export{p as StepperItemModule,s as default};

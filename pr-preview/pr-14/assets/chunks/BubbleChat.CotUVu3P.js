var g=Object.defineProperty;var m=(d,o,e)=>o in d?g(d,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[o]=e;var t=(d,o,e)=>m(d,typeof o!="symbol"?o+"":o,e);import{ɵ as b,a as y,b as x,c as v,j as _,q as N,p as M,u as f,v as j,t as C,s as p,I as l,C as D,f as P,N as k,g as w}from"./core.vpEFnhB-.js";import{a as h,d as I}from"./theme.CecfD-Na.js";import{C as u}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const S=["*"],c={direction:"incoming",state:"default",className:""},r=class r{constructor(){t(this,"cn",h);t(this,"bindControllerProps",I);t(this,"direction",c.direction);t(this,"className",c.className);t(this,"state",c.state)}};t(r,"ɵfac",function(e){return new(e||r)}),t(r,"ɵcmp",b({type:r,selectors:[["kd-bubble-chat"],["bubble-chat"]],inputs:{direction:"direction",className:"className",state:"state"},standalone:!1,ngContentSelectors:S,decls:3,vars:5,template:function(e,n){e&1&&(v(),_(0,"div")(1,"div"),N(2),M()()),e&2&&(f(n.cn("flex w-full",n.direction==="outgoing"?"justify-end":"justify-start",n.className)),j("data-ctrl",typeof n.bindControllerProps),C(),f(n.cn("flex max-w-xs flex-col justify-start gap-1 rounded-2xl text-sm font-normal",n.direction==="outgoing"?"items-end px-4 py-4":"items-start px-3 py-3",n.state==="error"?"border border-destructive-border bg-destructive-subtle text-foreground-default":n.direction==="outgoing"?"border border-border-default bg-background-default text-foreground-default":"bg-background-muted text-foreground-default")))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=r;(typeof ngDevMode>"u"||ngDevMode)&&p(s,[{type:D,args:[{standalone:!1,selector:"kd-bubble-chat, bubble-chat",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full', direction === 'outgoing' ? 'justify-end' : 'justify-start', className)"
    >
      <div
        [class]="cn('flex max-w-xs flex-col justify-start gap-1 rounded-2xl text-sm font-normal', direction === 'outgoing' ? 'items-end px-4 py-4' : 'items-start px-3 py-3', state === 'error' ? 'border border-destructive-border bg-destructive-subtle text-foreground-default' : direction === 'outgoing' ? 'border border-border-default bg-background-default text-foreground-default' : 'bg-background-muted text-foreground-default')"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{direction:[{type:l}],className:[{type:l}],state:[{type:l}]});(typeof ngDevMode>"u"||ngDevMode)&&P(s,{className:"BubbleChat",filePath:"BubbleChat.ts",lineNumber:42});const a=class a{};t(a,"ɵfac",function(e){return new(e||a)}),t(a,"ɵmod",y({type:a})),t(a,"ɵinj",x({imports:[u]}));let i=a;(typeof ngDevMode>"u"||ngDevMode)&&p(i,[{type:k,args:[{declarations:[s],imports:[u],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&w(i,{declarations:[s],imports:[u],exports:[s]})})();export{i as BubbleChatModule,s as default};

var m=Object.defineProperty;var u=(l,t,e)=>t in l?m(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var n=(l,t,e)=>u(l,typeof t!="symbol"?t+"":t,e);import{ɵ as g,a as y,b,c as _,j as N,q as M,p as x,u as v,s as p,I as d,C as w,f as j,N as D,g as C}from"./core.vpEFnhB-.js";import{a as h}from"./theme.CMj9otVT.js";import{C as f}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const I=["*"],r={align:"end",className:""},o=class o{constructor(){n(this,"cn",h);n(this,"align",r.align);n(this,"className",r.className)}};n(o,"ɵfac",function(e){return new(e||o)}),n(o,"ɵcmp",g({type:o,selectors:[["kd-bubble-chat-footer"],["bubble-chat-footer"]],inputs:{align:"align",className:"className"},standalone:!1,ngContentSelectors:I,decls:2,vars:2,template:function(e,c){e&1&&(_(),N(0,"div"),M(1),x()),e&2&&v(c.cn("flex w-full flex-row items-center gap-1 text-xs font-normal text-foreground-muted",c.align==="between"?"justify-between":"justify-end",c.className))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=o;(typeof ngDevMode>"u"||ngDevMode)&&p(s,[{type:w,args:[{standalone:!1,selector:"kd-bubble-chat-footer, bubble-chat-footer",template:`
    <div
      [class]="cn('flex w-full flex-row items-center gap-1 text-xs font-normal text-foreground-muted', align === 'between' ? 'justify-between' : 'justify-end', className)"
    >
      <ng-content></ng-content>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{align:[{type:d}],className:[{type:d}]});(typeof ngDevMode>"u"||ngDevMode)&&j(s,{className:"BubbleChatFooter",filePath:"BubbleChatFooter.ts",lineNumber:32});const a=class a{};n(a,"ɵfac",function(e){return new(e||a)}),n(a,"ɵmod",y({type:a})),n(a,"ɵinj",b({imports:[f]}));let i=a;(typeof ngDevMode>"u"||ngDevMode)&&p(i,[{type:D,args:[{declarations:[s],imports:[f],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&C(i,{declarations:[s],imports:[f],exports:[s]})})();export{i as BubbleChatFooterModule,s as default};

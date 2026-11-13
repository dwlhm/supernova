var m=Object.defineProperty;var u=(l,s,e)=>s in l?m(l,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[s]=e;var t=(l,s,e)=>u(l,typeof s!="symbol"?s+"":s,e);import{ɵ as _,a as g,b as v,c as N,j as r,y as h,z as y,p,aq as C,q as M,u as b,t as k,v as x,s as f,I,C as w,f as D,N as S,g as j}from"./core.vpEFnhB-.js";import{a as P,I as T}from"./theme.CMj9otVT.js";import{C as d}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const H=["*"],O={className:""},o=class o{constructor(){t(this,"cn",P);t(this,"ICON_PATHS",T);t(this,"className",O.className)}};t(o,"ɵfac",function(e){return new(e||o)}),t(o,"ɵcmp",_({type:o,selectors:[["kd-bubble-chat-file"],["bubble-chat-file"]],inputs:{className:"className"},standalone:!1,ngContentSelectors:H,decls:5,vars:3,consts:[["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-5","w-5","shrink-0"],["stroke-linecap","round","stroke-linejoin","round"],[1,"flex","flex-col","items-start","gap-0.5"]],template:function(e,c){e&1&&(N(),r(0,"div"),h(),r(1,"svg",0),y(2,"path",1),p(),C(),r(3,"div",2),M(4),p()()),e&2&&(b(c.cn("flex items-center gap-2",c.className)),k(2),x("d",c.ICON_PATHS.file))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=o;(typeof ngDevMode>"u"||ngDevMode)&&f(a,[{type:w,args:[{standalone:!1,selector:"kd-bubble-chat-file, bubble-chat-file",template:`
    <div [class]="cn('flex items-center gap-2', className)">
      <svg
        aria-hidden="true"
        class="h-5 w-5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          [attr.d]="ICON_PATHS.file"
        ></path>
      </svg>
      <div class="flex flex-col items-start gap-0.5">
        <ng-content></ng-content>
      </div>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:I}]});(typeof ngDevMode>"u"||ngDevMode)&&D(a,{className:"BubbleChatFile",filePath:"BubbleChatFile.ts",lineNumber:44});const n=class n{};t(n,"ɵfac",function(e){return new(e||n)}),t(n,"ɵmod",g({type:n})),t(n,"ɵinj",v({imports:[d]}));let i=n;(typeof ngDevMode>"u"||ngDevMode)&&f(i,[{type:S,args:[{declarations:[a],imports:[d],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&j(i,{declarations:[a],imports:[d],exports:[a]})})();export{i as BubbleChatFileModule,a as default};

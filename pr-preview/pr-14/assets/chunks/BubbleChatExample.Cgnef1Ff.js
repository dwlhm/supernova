var v=Object.defineProperty;var y=(s,t,o)=>t in s?v(s,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):s[t]=o;var i=(s,t,o)=>y(s,typeof t!="symbol"?t+"":t,o);import{ɵ as w,a as C,b as B,j as n,o as e,p as a,k as D,d as N,t as c,e as u,s as _,C as A,f as F,N as I,g as T,i as x,r as M}from"./core.vpEFnhB-.js";import j,{BubbleChatModule as f}from"./BubbleChat.CotUVu3P.js";import E,{BubbleChatFileModule as m}from"./BubbleChatFile.8aeCE9Wk.js";import S,{BubbleChatMediaModule as h}from"./BubbleChatMedia.IqwNJriv.js";import q,{BubbleChatFooterModule as g}from"./BubbleChatFooter.DgFNLNwF.js";import{C as k,a as H}from"./common_module-chunk.B8w5oXjf.js";import"./theme.CecfD-Na.js";import"./framework.DPU9SBEx.js";function J(s,t){s&1&&(x(0),e(1,"Delivered (Undo)"),M())}function L(s,t){s&1&&(x(0),e(1,"Failed to send • Tap to retry"),M())}const d=class d{constructor(){i(this,"resent",!1)}};i(d,"ɵfac",function(o){return new(o||d)}),i(d,"ɵcmp",w({type:d,selectors:[["kd-bubble-chat-example"],["bubble-chat-example"]],standalone:!1,decls:36,vars:4,consts:[[1,"flex","w-full","flex-col","gap-3"],["direction","incoming"],[1,"whitespace-pre-wrap","text-sm","font-normal"],["direction","outgoing"],[1,"truncate","text-sm","font-medium"],[1,"text-xs","font-normal","text-foreground-muted"],["align","between"],["kind","video"],["direction","outgoing",3,"state"],["align","between",3,"className"],["type","button",1,"cursor-pointer","text-xs","font-medium","underline",3,"click"],[4,"ngIf"]],template:function(o,b){o&1&&(n(0,"div",0)(1,"kd-bubble-chat",1)(2,"p",2),e(3," Hello, can you share the latest invoice? "),a(),n(4,"kd-bubble-chat-footer")(5,"span"),e(6,"10:24 AM"),a()()(),n(7,"kd-bubble-chat",3)(8,"kd-bubble-chat-file")(9,"span",4),e(10,"invoice-q3.pdf"),a(),n(11,"span",5),e(12,"2.4 MB"),a()(),n(13,"kd-bubble-chat-footer",6)(14,"span"),e(15,"Delivered"),a(),n(16,"span"),e(17,"10:26 AM"),a()()(),n(18,"kd-bubble-chat",1)(19,"kd-bubble-chat-media",7)(20,"span",4),e(21,"walkthrough.mp4"),a(),n(22,"span",5),e(23,"24.8 MB • 01:08"),a()(),n(24,"kd-bubble-chat-footer")(25,"span"),e(26,"10:27 AM"),a()()(),n(27,"kd-bubble-chat",8)(28,"p",2),e(29," Let me know once you review it. "),a(),n(30,"kd-bubble-chat-footer",9)(31,"button",10),D("click",function(){return b.resent=!b.resent}),N(32,J,2,0,"ng-container",11)(33,L,2,0,"ng-container",11),a(),n(34,"span"),e(35,"10:28 AM"),a()()()()),o&2&&(c(27),u("state",b.resent?"default":"error"),c(3),u("className",b.resent?"":"text-destructive-default"),c(2),u("ngIf",b.resent),c(),u("ngIf",!b.resent))},dependencies:[H,j,q,E,S],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let l=d;(typeof ngDevMode>"u"||ngDevMode)&&_(l,[{type:A,args:[{standalone:!1,selector:"kd-bubble-chat-example, bubble-chat-example",template:`
    <div class="flex w-full flex-col gap-3">
      <kd-bubble-chat direction="incoming"
        ><p class="whitespace-pre-wrap text-sm font-normal">
          Hello, can you share the latest invoice?
        </p>
        <kd-bubble-chat-footer
          ><span>10:24 AM</span></kd-bubble-chat-footer
        ></kd-bubble-chat
      >
      <kd-bubble-chat direction="outgoing"
        ><kd-bubble-chat-file
          ><span class="truncate text-sm font-medium">invoice-q3.pdf</span>
          <span class="text-xs font-normal text-foreground-muted"
            >2.4 MB</span
          ></kd-bubble-chat-file
        >
        <kd-bubble-chat-footer align="between"
          ><span>Delivered</span> <span>10:26 AM</span></kd-bubble-chat-footer
        ></kd-bubble-chat
      >
      <kd-bubble-chat direction="incoming"
        ><kd-bubble-chat-media kind="video"
          ><span class="truncate text-sm font-medium">walkthrough.mp4</span>
          <span class="text-xs font-normal text-foreground-muted"
            >24.8 MB • 01:08</span
          ></kd-bubble-chat-media
        >
        <kd-bubble-chat-footer
          ><span>10:27 AM</span></kd-bubble-chat-footer
        ></kd-bubble-chat
      >
      <kd-bubble-chat
        direction="outgoing"
        [state]="resent ? 'default' : 'error'"
        ><p class="whitespace-pre-wrap text-sm font-normal">
          Let me know once you review it.
        </p>
        <kd-bubble-chat-footer
          align="between"
          [className]="resent ? '' : 'text-destructive-default'"
          ><button
            type="button"
            class="cursor-pointer text-xs font-medium underline"
            (click)="
          resent = !resent;
        "
          >
            <ng-container *ngIf="resent">Delivered (Undo)</ng-container
            ><ng-container *ngIf="!(resent)"
              >Failed to send • Tap to retry</ng-container
            >
          </button>
          <span>10:28 AM</span></kd-bubble-chat-footer
        ></kd-bubble-chat
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&F(l,{className:"BubbleChatExample",filePath:"BubbleChatExample.ts",lineNumber:79});const r=class r{};i(r,"ɵfac",function(o){return new(o||r)}),i(r,"ɵmod",C({type:r})),i(r,"ɵinj",B({imports:[k,f,g,m,h]}));let p=r;(typeof ngDevMode>"u"||ngDevMode)&&_(p,[{type:I,args:[{declarations:[l],imports:[k,f,g,m,h],exports:[l]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&T(p,{declarations:[l],imports:[k,f,g,m,h],exports:[l]})})();export{p as BubbleChatExampleModule,l as default};

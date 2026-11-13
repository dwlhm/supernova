var y=Object.defineProperty;var C=(n,t,e)=>t in n?y(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var a=(n,t,e)=>C(n,typeof t!="symbol"?t+"":t,e);import{ɵ as N,a as I,b as j,c as M,j as d,d as S,p as l,q as P,u as T,t as c,e as p,s as _,I as g,C as D,f as O,N as A,g as H,i as h,y as k,z as v,r as x,m as b,v as w}from"./core.vpEFnhB-.js";import{a as B,I as E}from"./theme.CMj9otVT.js";import{C as u,a as F}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const J=["*"];function q(n,t){if(n&1&&(h(0),d(1,"div",2),k(),d(2,"svg",3),v(3,"path",4),l()(),x()),n&2){const e=b();c(3),w("d",e.ICON_PATHS.video)}}function z(n,t){if(n&1&&(h(0),k(),d(1,"svg",5),v(2,"path",4),l(),x()),n&2){const e=b();c(2),w("d",e.ICON_PATHS.image)}}const m={kind:"image",className:""},i=class i{constructor(){a(this,"cn",B);a(this,"ICON_PATHS",E);a(this,"className",m.className);a(this,"kind",m.kind)}};a(i,"ɵfac",function(e){return new(e||i)}),a(i,"ɵcmp",N({type:i,selectors:[["kd-bubble-chat-media"],["bubble-chat-media"]],inputs:{className:"className",kind:"kind"},standalone:!1,ngContentSelectors:J,decls:5,vars:4,consts:[[1,"flex","h-32","w-60","flex-col","items-center","justify-center","rounded-xl","bg-background-subtle","px-4","py-12","text-foreground-muted"],[4,"ngIf"],[1,"flex","h-10","w-10","flex-row","items-center","justify-center","rounded-full","bg-background-default","p-1.5","shadow-md"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4","shrink-0","text-foreground-default"],["stroke-linecap","round","stroke-linejoin","round"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-8","w-8","shrink-0"]],template:function(e,r){e&1&&(M(),d(0,"div")(1,"div",0),S(2,q,4,1,"ng-container",1)(3,z,3,1,"ng-container",1),l(),P(4),l()),e&2&&(T(r.cn("flex w-full flex-col items-start gap-1",r.className)),c(2),p("ngIf",r.kind==="video"),c(),p("ngIf",r.kind==="image"))},dependencies:[F],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=i;(typeof ngDevMode>"u"||ngDevMode)&&_(s,[{type:D,args:[{standalone:!1,selector:"kd-bubble-chat-media, bubble-chat-media",template:`
    <div [class]="cn('flex w-full flex-col items-start gap-1', className)">
      <div
        class="flex h-32 w-60 flex-col items-center justify-center rounded-xl bg-background-subtle px-4 py-12 text-foreground-muted"
      >
        <ng-container *ngIf="kind === 'video'"
          ><div
            class="flex h-10 w-10 flex-row items-center justify-center rounded-full bg-background-default p-1.5 shadow-md"
          >
            <svg
              aria-hidden="true"
              class="h-4 w-4 shrink-0 text-foreground-default"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                [attr.d]="ICON_PATHS.video"
              ></path>
            </svg></div
        ></ng-container>
        <ng-container *ngIf="kind === 'image'"
          ><svg
            aria-hidden="true"
            class="h-8 w-8 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="ICON_PATHS.image"
            ></path></svg
        ></ng-container>
      </div>
      <ng-content></ng-content>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:g}],kind:[{type:g}]});(typeof ngDevMode>"u"||ngDevMode)&&O(s,{className:"BubbleChatMedia",filePath:"BubbleChatMedia.ts",lineNumber:68});const o=class o{};a(o,"ɵfac",function(e){return new(e||o)}),a(o,"ɵmod",I({type:o})),a(o,"ɵinj",j({imports:[u]}));let f=o;(typeof ngDevMode>"u"||ngDevMode)&&_(f,[{type:A,args:[{declarations:[s],imports:[u],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&H(f,{declarations:[s],imports:[u],exports:[s]})})();export{f as BubbleChatMediaModule,s as default};

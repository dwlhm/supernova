var k=Object.defineProperty;var B=(t,o,e)=>o in t?k(t,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[o]=e;var a=(t,o,e)=>B(t,typeof o!="symbol"?o+"":o,e);import{ɵ as j,a as P,b as A,j as c,d as T,p as g,u as p,v as h,t as n,e as d,s as w,I as s,C as H,f as O,N as D,g as F,i as u,o as f,r as l,m,x as N,y as C,z as M,ao as I,am as x}from"./core.BqS-lykr.js";import{a as E,I as J,b as z}from"./utils.BBpd638g.js";import{C as S,N as G}from"./common_module-chunk.DvGwmKFp.js";function L(t,o){if(t&1&&(u(0),c(1,"p",2),f(2),g(),l()),t&2){const e=m();n(2),N(" ",e.text," ")}}function R(t,o){if(t&1&&(u(0),c(1,"div",3),C(),c(2,"svg",4),M(3,"path",5),g(),I(),c(4,"span",6)(5,"span",7),f(6),g(),c(7,"span"),f(8),g()()(),l()),t&2){const e=m();n(3),h("d",e.ICON_PATHS.file),n(3),x(e.fileName),n(),p(e.cn("text-xs",e.messageState==="error"?"text-destructive-foreground":"text-foreground-muted")),n(),x(e.fileMeta)}}function V(t,o){if(t&1&&(u(0),f(1),l()),t&2){const e=m(2);n(),x(e.imageName)}}function q(t,o){if(t&1&&(u(0),f(1),l()),t&2){const e=m(2);n(),x(e.videoName)}}function K(t,o){if(t&1&&(u(0),f(1),l()),t&2){const e=m(2);n(),x(e.imageMeta)}}function Q(t,o){if(t&1&&(u(0),f(1),l()),t&2){const e=m(2);n(),x(e.videoMeta)}}function U(t,o){if(t&1&&(u(0),c(1,"div",8)(2,"div"),C(),c(3,"svg",9),M(4,"path",5),g()(),I(),c(5,"span",6)(6,"span",7),T(7,V,2,1,"ng-container",0)(8,q,2,1,"ng-container",0),g(),c(9,"span"),T(10,K,2,1,"ng-container",0)(11,Q,2,1,"ng-container",0),g()()(),l()),t&2){const e=m();n(2),p(e.cn("flex h-32 w-60 items-center justify-center rounded-xl bg-background-subtle",e.messageState==="error"?"text-destructive-foreground":"text-foreground-muted")),n(2),h("d",e.type==="image"?e.ICON_PATHS.image:e.ICON_PATHS.video),n(3),d("ngIf",e.type==="image"),n(),d("ngIf",e.type!=="image"),n(),p(e.cn("text-xs",e.messageState==="error"?"text-destructive-foreground":"text-foreground-muted")),n(),d("ngIf",e.type==="image"),n(),d("ngIf",e.type!=="image")}}function W(t,o){if(t&1&&(u(0),c(1,"p"),f(2),g(),l()),t&2){const e=m();n(),p(e.cn("mt-2 text-xs",e.messageState==="error"?"text-destructive-foreground":"text-foreground-muted")),n(),N(" ",e.customText," ")}}function X(t,o){if(t&1&&(u(0),c(1,"span"),f(2),g(),l()),t&2){const e=m();n(),p(e.cn("text-xs",e.messageState==="error"?"text-destructive-foreground":"text-foreground-muted")),n(),x(e.timeText)}}function Y(t,o){if(t&1&&(u(0),f(1),l()),t&2){const e=m(2);n(),x(e.errorStatusText)}}function Z(t,o){if(t&1&&(u(0),f(1),l()),t&2){const e=m(2);n(),x(e.statusText)}}function $(t,o){if(t&1&&(u(0),c(1,"span"),T(2,Y,2,1,"ng-container",0)(3,Z,2,1,"ng-container",0),g(),l()),t&2){const e=m();n(),p(e.cn("text-xs",e.messageState==="error"?"text-destructive-foreground":"text-foreground-muted")),n(),d("ngIf",e.messageState==="error"),n(),d("ngIf",e.messageState!=="error")}}const r={direction:"incoming",type:"text",messageState:"default",text:"Message",customText:"Additional information",showCustomText:!1,showTime:!0,showStatus:!1,timeText:"10:24 AM",statusText:"Received",errorStatusText:"Failed to send",fileName:"document.pdf",fileMeta:"2.4 MB",imageName:"image.jpg",imageMeta:"3.4 MB",videoName:"video.mp4",videoMeta:"24.8 MB • 01:08",className:""},b=class b{constructor(){a(this,"cn",E);a(this,"ICON_PATHS",J);a(this,"bindControllerProps",z);a(this,"direction",r.direction);a(this,"className",r.className);a(this,"messageState",r.messageState);a(this,"type",r.type);a(this,"text",r.text);a(this,"fileName",r.fileName);a(this,"fileMeta",r.fileMeta);a(this,"videoName",r.videoName);a(this,"imageName",r.imageName);a(this,"videoMeta",r.videoMeta);a(this,"imageMeta",r.imageMeta);a(this,"showCustomText",r.showCustomText);a(this,"customText",r.customText);a(this,"showTime",r.showTime);a(this,"timeText",r.timeText);a(this,"showStatus",r.showStatus);a(this,"statusText",r.statusText);a(this,"errorStatusText",r.errorStatusText)}};a(b,"ɵfac",function(e){return new(e||b)}),a(b,"ɵcmp",j({type:b,selectors:[["spn-bubble-chat"],["bubble-chat"]],inputs:{direction:"direction",className:"className",messageState:"messageState",type:"type",text:"text",fileName:"fileName",fileMeta:"fileMeta",videoName:"videoName",imageName:"imageName",videoMeta:"videoMeta",imageMeta:"imageMeta",showCustomText:"showCustomText",customText:"customText",showTime:"showTime",timeText:"timeText",showStatus:"showStatus",statusText:"statusText",errorStatusText:"errorStatusText"},standalone:!1,decls:10,vars:13,consts:[[4,"ngIf"],[1,"flex","w-full","items-center","justify-between","gap-2"],[1,"whitespace-pre-wrap","text-sm","leading-relaxed"],[1,"flex","items-center","gap-2"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-5","w-5","shrink-0"],["stroke-linecap","round","stroke-linejoin","round"],[1,"flex","flex-col"],[1,"truncate","text-sm","font-medium"],[1,"flex","flex-col","gap-2"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-8","w-8","shrink-0"]],template:function(e,i){e&1&&(c(0,"div")(1,"div")(2,"div"),T(3,L,3,1,"ng-container",0)(4,R,9,5,"ng-container",0)(5,U,12,9,"ng-container",0)(6,W,3,3,"ng-container",0),g(),c(7,"div",1),T(8,X,3,3,"ng-container",0)(9,$,4,4,"ng-container",0),g()()()),e&2&&(p(i.cn("flex w-full",i.direction==="outgoing"?"justify-end":"justify-start",i.className)),h("data-ctrl",typeof i.bindControllerProps),n(),p(i.cn("flex max-w-xs flex-col gap-1",i.direction==="outgoing"&&"items-end")),n(),p(i.cn("rounded-2xl p-4",i.messageState==="error"?"border border-destructive-border bg-destructive-subtle text-destructive-foreground":i.direction==="outgoing"?"border border-border-default bg-background-default text-foreground-default":"bg-background-muted text-foreground-default")),n(),d("ngIf",i.type==="text"),n(),d("ngIf",i.type==="file"),n(),d("ngIf",i.type==="image"||i.type==="video"),n(),d("ngIf",i.showCustomText),n(2),d("ngIf",i.showTime),n(),d("ngIf",i.showStatus||i.messageState==="error"))},dependencies:[G],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let _=b;(typeof ngDevMode>"u"||ngDevMode)&&w(_,[{type:H,args:[{standalone:!1,selector:"spn-bubble-chat, bubble-chat",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full', direction === 'outgoing' ? 'justify-end' : 'justify-start', className)"
    >
      <div
        [class]="cn('flex max-w-xs flex-col gap-1', direction === 'outgoing' && 'items-end')"
      >
        <div
          [class]="cn('rounded-2xl p-4', messageState === 'error' ? 'border border-destructive-border bg-destructive-subtle text-destructive-foreground' : direction === 'outgoing' ? 'border border-border-default bg-background-default text-foreground-default' : 'bg-background-muted text-foreground-default')"
        >
          <ng-container *ngIf="type === 'text'"
            ><p class="whitespace-pre-wrap text-sm leading-relaxed">
              {{text}}
            </p></ng-container
          >
          <ng-container *ngIf="type === 'file'"
            ><div class="flex items-center gap-2">
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
              <span class="flex flex-col"
                ><span class="truncate text-sm font-medium">{{fileName}}</span>
                <span
                  [class]="cn('text-xs', messageState === 'error' ? 'text-destructive-foreground' : 'text-foreground-muted')"
                  >{{fileMeta}}</span
                ></span
              >
            </div></ng-container
          >
          <ng-container *ngIf="type === 'image' || type === 'video'"
            ><div class="flex flex-col gap-2">
              <div
                [class]="cn('flex h-32 w-60 items-center justify-center rounded-xl bg-background-subtle', messageState === 'error' ? 'text-destructive-foreground' : 'text-foreground-muted')"
              >
                <svg
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
                    [attr.d]="type === 'image' ? ICON_PATHS.image : ICON_PATHS.video"
                  ></path>
                </svg>
              </div>
              <span class="flex flex-col"
                ><span class="truncate text-sm font-medium"
                  ><ng-container
                    *ngIf="type === 'image'"
                    >{{imageName}}</ng-container
                  ><ng-container
                    *ngIf="!(type === 'image')"
                    >{{videoName}}</ng-container
                  ></span
                >
                <span
                  [class]="cn('text-xs', messageState === 'error' ? 'text-destructive-foreground' : 'text-foreground-muted')"
                  ><ng-container
                    *ngIf="type === 'image'"
                    >{{imageMeta}}</ng-container
                  ><ng-container
                    *ngIf="!(type === 'image')"
                    >{{videoMeta}}</ng-container
                  ></span
                ></span
              >
            </div></ng-container
          >
          <ng-container *ngIf="showCustomText"
            ><p
              [class]="cn('mt-2 text-xs', messageState === 'error' ? 'text-destructive-foreground' : 'text-foreground-muted')"
            >
              {{customText}}
            </p></ng-container
          >
        </div>
        <div class="flex w-full items-center justify-between gap-2">
          <ng-container *ngIf="showTime"
            ><span
              [class]="cn('text-xs', messageState === 'error' ? 'text-destructive-foreground' : 'text-foreground-muted')"
              >{{timeText}}</span
            ></ng-container
          >
          <ng-container *ngIf="showStatus || messageState === 'error'"
            ><span
              [class]="cn('text-xs', messageState === 'error' ? 'text-destructive-foreground' : 'text-foreground-muted')"
              ><ng-container
                *ngIf="messageState === 'error'"
                >{{errorStatusText}}</ng-container
              ><ng-container
                *ngIf="!(messageState === 'error')"
                >{{statusText}}</ng-container
              ></span
            ></ng-container
          >
        </div>
      </div>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{direction:[{type:s}],className:[{type:s}],messageState:[{type:s}],type:[{type:s}],text:[{type:s}],fileName:[{type:s}],fileMeta:[{type:s}],videoName:[{type:s}],imageName:[{type:s}],videoMeta:[{type:s}],imageMeta:[{type:s}],showCustomText:[{type:s}],customText:[{type:s}],showTime:[{type:s}],timeText:[{type:s}],showStatus:[{type:s}],statusText:[{type:s}],errorStatusText:[{type:s}]});(typeof ngDevMode>"u"||ngDevMode)&&O(_,{className:"BubbleChat",filePath:"BubbleChat.ts",lineNumber:174});const v=class v{};a(v,"ɵfac",function(e){return new(e||v)}),a(v,"ɵmod",P({type:v})),a(v,"ɵinj",A({imports:[S]}));let y=v;(typeof ngDevMode>"u"||ngDevMode)&&w(y,[{type:D,args:[{declarations:[_],imports:[S],exports:[_]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&F(y,{declarations:[_],imports:[S],exports:[_]})})();export{y as BubbleChatModule,_ as default};

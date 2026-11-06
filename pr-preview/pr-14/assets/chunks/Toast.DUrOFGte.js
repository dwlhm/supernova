var E=Object.defineProperty;var H=(o,s,e)=>s in o?E(o,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[s]=e;var t=(o,s,e)=>H(o,typeof s!="symbol"?s+"":s,e);import{E as T,ɵ as B,a as V,b as F,j as l,y as N,z as D,p as c,ao as J,o as h,d as k,u as y,v as b,t as r,w as I,am as v,e as m,s as P,O as A,I as i,C as z,f as G,N as L,g as U,i as w,r as x,m as f,h as M,k as j,l as S,n as O,x as q}from"./core.BqS-lykr.js";import{a as K,d as Q,w as R,I as W,b as X}from"./utils.BBpd638g.js";import{C,N as Y}from"./common_module-chunk.DvGwmKFp.js";const Z=()=>({success:"bg-success-subtle text-success-foreground",error:"bg-destructive-subtle text-destructive-foreground",warning:"bg-warning-subtle text-warning-foreground",info:"bg-info-subtle text-info-foreground",default:"bg-background-muted text-foreground-default"}),$=()=>({success:"text-success-foreground",error:"text-destructive-foreground",warning:"text-warning-foreground",info:"text-info-foreground",default:"text-foreground-default"});function ee(o,s){if(o&1&&(w(0),l(1,"span",5),h(2),c(),x()),o&2){const e=f();r(2),v(e.description)}}function te(o,s){if(o&1&&(w(0),l(1,"span",6),h(2),c(),x()),o&2){const e=f();r(2),v(e.timestamp)}}function ne(o,s){if(o&1){const e=M();w(0),l(1,"button",7),j("click",function(){S(e);const g=f();return O(g.onAction&&g.onAction.emit())}),h(2),c(),x()}if(o&2){const e=f();r(2),q(" ",e.actionText," ")}}function oe(o,s){if(o&1){const e=M();w(0),l(1,"button",8),j("click",function(){S(e);const g=f();return O(g.onClose&&g.onClose.emit())}),N(),l(2,"svg",9),D(3,"path",10),c()(),x()}if(o&2){const e=f();r(3),b("d",e.ICON_PATHS.close)}}const a={type:"default",title:"Toast Text",description:"Toast description text here",showDescription:!1,actionText:"Undo",showAction:!1,showClose:!1,timestamp:"11.29.45 AM",showTimestamp:!0,className:""},p=class p{constructor(){t(this,"cn",K);t(this,"cva",Q);t(this,"getToastIconPath",R);t(this,"ICON_PATHS",W);t(this,"bindControllerProps",X);t(this,"type",a.type);t(this,"showDescription",a.showDescription);t(this,"className",a.className);t(this,"title",a.title);t(this,"description",a.description);t(this,"showTimestamp",a.showTimestamp);t(this,"timestamp",a.timestamp);t(this,"showAction",a.showAction);t(this,"actionText",a.actionText);t(this,"showClose",a.showClose);t(this,"onAction",new T);t(this,"onClose",new T)}};t(p,"ɵfac",function(e){return new(e||p)}),t(p,"ɵcmp",B({type:p,selectors:[["spn-toast"],["toast"]],inputs:{type:"type",showDescription:"showDescription",className:"className",title:"title",description:"description",showTimestamp:"showTimestamp",timestamp:"timestamp",showAction:"showAction",actionText:"actionText",showClose:"showClose"},outputs:{onAction:"onAction",onClose:"onClose"},standalone:!1,decls:11,vars:16,consts:[["aria-hidden","true"],["viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2",1,"h-4","w-4"],["stroke-linecap","round","stroke-linejoin","round"],[1,"flex","min-w-0","flex-1","flex-col"],[4,"ngIf"],[1,"text-xs","text-foreground-muted"],[1,"shrink-0","text-xs","text-foreground-muted"],["type","button",1,"shrink-0","rounded-md","bg-secondary-default","px-2","py-1","text-xs","font-medium","text-secondary-foreground","transition-colors","hover:bg-secondary-hover","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"],["type","button","aria-label","Dismiss notification",1,"inline-flex","h-6","w-6","shrink-0","items-center","justify-center","rounded-full","text-foreground-muted","transition-colors","hover:bg-background-muted","hover:text-foreground-default","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2",1,"h-3.5","w-3.5"],["stroke-linecap","round"]],template:function(e,n){e&1&&(l(0,"div")(1,"span",0),N(),l(2,"svg",1),D(3,"path",2),c()(),J(),l(4,"span",3)(5,"span"),h(6),c(),k(7,ee,3,1,"ng-container",4),c(),k(8,te,3,1,"ng-container",4)(9,ne,3,1,"ng-container",4)(10,oe,4,1,"ng-container",4),c()),e&2&&(y(n.cn("flex w-full max-w-md items-center gap-1.5 bg-background-default px-3 py-2 shadow-md transition-shadow hover:shadow-lg",n.showDescription?"rounded-xl":"rounded-full",n.className)),b("data-ctrl",typeof n.bindControllerProps)("role",n.type==="error"?"alert":"status"),r(),y(n.cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full p-1.5",n.cva(n.type,I(14,Z),"default"))),r(2),b("d",n.getToastIconPath(n.type)),r(2),y(n.cn("truncate text-sm font-semibold",n.cva(n.type,I(15,$),"default"))),r(),v(n.title),r(),m("ngIf",n.showDescription),r(),m("ngIf",n.showTimestamp&&n.timestamp!==""),r(),m("ngIf",n.showAction),r(),m("ngIf",n.showClose))},dependencies:[Y],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let u=p;(typeof ngDevMode>"u"||ngDevMode)&&P(u,[{type:z,args:[{standalone:!1,selector:"spn-toast, toast",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.role]="type === 'error' ? 'alert' : 'status'"
      [class]="cn('flex w-full max-w-md items-center gap-1.5 bg-background-default px-3 py-2 shadow-md transition-shadow hover:shadow-lg', showDescription ? 'rounded-xl' : 'rounded-full', className)"
    >
      <span
        aria-hidden="true"
        [class]="cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full p-1.5', cva(type, {
          success: 'bg-success-subtle text-success-foreground',
          error: 'bg-destructive-subtle text-destructive-foreground',
          warning: 'bg-warning-subtle text-warning-foreground',
          info: 'bg-info-subtle text-info-foreground',
          default: 'bg-background-muted text-foreground-default'
        }, 'default'))"
        ><svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            [attr.d]="getToastIconPath(type)"
          ></path></svg
      ></span>
      <span class="flex min-w-0 flex-1 flex-col"
        ><span
          [class]="cn('truncate text-sm font-semibold', cva(type, {
          success: 'text-success-foreground',
          error: 'text-destructive-foreground',
          warning: 'text-warning-foreground',
          info: 'text-info-foreground',
          default: 'text-foreground-default'
        }, 'default'))"
          >{{title}}</span
        >
        <ng-container *ngIf="showDescription"
          ><span
            class="text-xs text-foreground-muted"
            >{{description}}</span
          ></ng-container
        ></span
      >
      <ng-container *ngIf="showTimestamp && timestamp !== ''"
        ><span
          class="shrink-0 text-xs text-foreground-muted"
          >{{timestamp}}</span
        ></ng-container
      >
      <ng-container *ngIf="showAction"
        ><button
          type="button"
          class="shrink-0 rounded-md bg-secondary-default px-2 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          (click)="onAction && this.onAction.emit()"
        >
          {{actionText}}
        </button></ng-container
      >
      <ng-container *ngIf="showClose"
        ><button
          type="button"
          aria-label="Dismiss notification"
          class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          (click)="onClose && this.onClose.emit()"
        >
          <svg
            aria-hidden="true"
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" [attr.d]="ICON_PATHS.close"></path>
          </svg></button
      ></ng-container>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{type:[{type:i}],showDescription:[{type:i}],className:[{type:i}],title:[{type:i}],description:[{type:i}],showTimestamp:[{type:i}],timestamp:[{type:i}],showAction:[{type:i}],actionText:[{type:i}],showClose:[{type:i}],onAction:[{type:A}],onClose:[{type:A}]});(typeof ngDevMode>"u"||ngDevMode)&&G(u,{className:"Toast",filePath:"Toast.ts",lineNumber:132});const d=class d{};t(d,"ɵfac",function(e){return new(e||d)}),t(d,"ɵmod",V({type:d})),t(d,"ɵinj",F({imports:[C]}));let _=d;(typeof ngDevMode>"u"||ngDevMode)&&P(_,[{type:L,args:[{declarations:[u],imports:[C],exports:[u]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&U(_,{declarations:[u],imports:[C],exports:[u]})})();export{_ as ToastModule,u as default};

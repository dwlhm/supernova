var E=Object.defineProperty;var P=(n,i,e)=>i in n?E(n,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[i]=e;var t=(n,i,e)=>P(n,typeof i!="symbol"?i+"":i,e);import{E as B,ɵ as z,a as V,b as F,c as O,d as x,e as h,s as A,O as T,I as a,C as J,f as q,N as G,g as $,h as M,i as v,j as l,k as _,l as m,m as f,n as b,o as C,p as c,q as H,r as y,t as r,u as L,v as w,w as k,x as D,y as K,z as Q}from"./core.BqS-lykr.js";import{a as R,c as U,b as W}from"./utils.BBpd638g.js";import{C as N,N as X}from"./common_module-chunk.DvGwmKFp.js";const Y=["*"],I=()=>({id:"alert-dialog"});function Z(n,i){if(n&1){const e=M();v(0),l(1,"div",8),_("click",function(){m(e);const o=f(2);return b(o.onCancel&&o.onCancel.emit())}),c(),y()}}function ee(n,i){if(n&1){const e=M();v(0),l(1,"button",9),_("click",function(){m(e);const o=f(2);return b(o.onCancel&&o.onCancel.emit())}),K(),l(2,"svg",10),Q(3,"path",11),c()(),y()}}function te(n,i){if(n&1&&(v(0),l(1,"p",12),C(2),c(),y()),n&2){const e=f(2);r(),w("id",e.createDialogState(k(2,I)).descriptionId),r(),D(" ",e.description," ")}}function ne(n,i){if(n&1){const e=M();v(0),l(1,"div"),x(2,Z,2,0,"ng-container",0),l(3,"div",1),_("keydown",function(o){m(e);const S=f();return b(o.key==="Escape"&&S.onCancel&&S.onCancel.emit())}),l(4,"div",2)(5,"div",3)(6,"h2",4),C(7),c(),x(8,ee,4,0,"ng-container",0),c(),x(9,te,3,3,"ng-container",0),c(),v(10),H(11),y(),l(12,"div",5)(13,"button",6),_("click",function(){m(e);const o=f();return b(o.onCancel&&o.onCancel.emit())}),C(14),c(),l(15,"button",7),_("click",function(){m(e);const o=f();return b(o.onConfirm&&o.onConfirm.emit())}),C(16),c()()()(),y()}if(n&2){const e=f();r(),L(e.inline?"relative flex w-full items-center justify-center p-4":"fixed inset-0 z-50 flex items-center justify-center p-4"),w("data-ctrl",typeof e.bindControllerProps),r(),h("ngIf",!e.inline),r(),L(e.cn("relative z-10 flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border-default bg-background-default p-6 shadow-lg",e.className)),w("tabIndex",-1)("aria-labelledby",e.createDialogState(k(17,I)).titleId)("aria-describedby",e.showDescription?e.createDialogState(k(18,I)).descriptionId:void 0),r(3),w("id",e.createDialogState(k(19,I)).titleId),r(),D(" ",e.heading," "),r(),h("ngIf",e.showCloseButton),r(),h("ngIf",e.showDescription),r(5),D(" ",e.cancelLabel," "),r(),L(e.cn("inline-flex h-9 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",e.destructive?"bg-destructive-background hover:bg-destructive-hover active:bg-destructive-pressed":"bg-primary-default hover:bg-primary-hover active:bg-primary-pressed")),r(),D(" ",e.confirmLabel," ")}}const s={open:!0,inline:!1,heading:"",description:"",showDescription:!0,showCloseButton:!0,cancelLabel:"Cancel",confirmLabel:"Continue",destructive:!1,className:""},p=class p{constructor(){t(this,"cn",R);t(this,"createDialogState",U);t(this,"bindControllerProps",W);t(this,"open",s.open);t(this,"inline",s.inline);t(this,"showDescription",s.showDescription);t(this,"className",s.className);t(this,"heading",s.heading);t(this,"showCloseButton",s.showCloseButton);t(this,"description",s.description);t(this,"cancelLabel",s.cancelLabel);t(this,"destructive",s.destructive);t(this,"confirmLabel",s.confirmLabel);t(this,"onCancel",new B);t(this,"onConfirm",new B)}};t(p,"ɵfac",function(e){return new(e||p)}),t(p,"ɵcmp",z({type:p,selectors:[["spn-alert-dialog"],["alert-dialog"]],inputs:{open:"open",inline:"inline",showDescription:"showDescription",className:"className",heading:"heading",showCloseButton:"showCloseButton",description:"description",cancelLabel:"cancelLabel",destructive:"destructive",confirmLabel:"confirmLabel"},outputs:{onCancel:"onCancel",onConfirm:"onConfirm"},standalone:!1,ngContentSelectors:Y,decls:1,vars:1,consts:[[4,"ngIf"],["role","alertdialog","aria-modal","true",3,"keydown"],[1,"flex","flex-col","gap-2"],[1,"flex","items-center","justify-between","gap-2.5"],[1,"flex-1","text-xl","leading-6","font-semibold","text-foreground-default"],[1,"flex","items-center","justify-end","gap-2"],["type","button",1,"inline-flex","h-9","items-center","justify-center","rounded-lg","bg-secondary-default","px-4","py-2","text-sm","font-medium","text-secondary-foreground","shadow-xs","transition-colors","hover:bg-secondary-hover","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"],["type","button",3,"click"],["aria-hidden","true",1,"absolute","inset-0","bg-overlay-backdrop",3,"click"],["type","button","aria-label","Close",1,"inline-flex","h-6","w-6","items-center","justify-center","rounded-md","text-foreground-muted","transition-colors","hover:text-foreground-default","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"],["viewBox","0 0 14 14","fill","none","stroke","currentColor","stroke-width","1.5","stroke-linecap","round","stroke-linejoin","round","aria-hidden","true",1,"h-3.5","w-3.5"],["d","M11 3L3 11M3 3l8 8"],[1,"text-sm","leading-5","text-foreground-muted"]],template:function(e,g){e&1&&(O(),x(0,ne,17,20,"ng-container",0)),e&2&&h("ngIf",g.open)},dependencies:[X],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let d=p;(typeof ngDevMode>"u"||ngDevMode)&&A(d,[{type:J,args:[{standalone:!1,selector:"spn-alert-dialog, alert-dialog",template:`
    <ng-container *ngIf="open"
      ><div
        [attr.data-ctrl]="typeof bindControllerProps"
        [class]="inline ? 'relative flex w-full items-center justify-center p-4' : 'fixed inset-0 z-50 flex items-center justify-center p-4'"
      >
        <ng-container *ngIf="!inline"
          ><div
            class="absolute inset-0 bg-overlay-backdrop"
            aria-hidden="true"
            (click)="onCancel && this.onCancel.emit()"
          ></div
        ></ng-container>
        <div
          role="alertdialog"
          aria-modal="true"
          [attr.tabIndex]="-1"
          [attr.aria-labelledby]="createDialogState({
          id: 'alert-dialog'
        }).titleId"
          [attr.aria-describedby]="showDescription ? createDialogState({
          id: 'alert-dialog'
        }).descriptionId : undefined"
          (keydown)="$event.key === 'Escape' && onCancel && this.onCancel.emit()"
          [class]="cn('relative z-10 flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border-default bg-background-default p-6 shadow-lg', className)"
        >
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2.5">
              <h2
                class="flex-1 text-xl leading-6 font-semibold text-foreground-default"
                [attr.id]="createDialogState({
          id: 'alert-dialog'
        }).titleId"
              >
                {{heading}}
              </h2>
              <ng-container *ngIf="showCloseButton"
                ><button
                  type="button"
                  aria-label="Close"
                  class="inline-flex h-6 w-6 items-center justify-center rounded-md text-foreground-muted transition-colors hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                  (click)="onCancel && this.onCancel.emit()"
                >
                  <svg
                    class="h-3.5 w-3.5"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M11 3L3 11M3 3l8 8"></path>
                  </svg></button
              ></ng-container>
            </div>
            <ng-container *ngIf="showDescription"
              ><p
                class="text-sm leading-5 text-foreground-muted"
                [attr.id]="createDialogState({
          id: 'alert-dialog'
        }).descriptionId"
              >
                {{description}}
              </p></ng-container
            >
          </div>
          <ng-container><ng-content></ng-content
          ></ng-container>
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              class="inline-flex h-9 items-center justify-center rounded-lg bg-secondary-default px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              (click)="onCancel && this.onCancel.emit()"
            >
              {{cancelLabel}}
            </button>
            <button
              type="button"
              [class]="cn('inline-flex h-9 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', destructive ? 'bg-destructive-background hover:bg-destructive-hover active:bg-destructive-pressed' : 'bg-primary-default hover:bg-primary-hover active:bg-primary-pressed')"
              (click)="onConfirm && this.onConfirm.emit()"
            >
              {{confirmLabel}}
            </button>
          </div>
        </div>
      </div></ng-container
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{open:[{type:a}],inline:[{type:a}],showDescription:[{type:a}],className:[{type:a}],heading:[{type:a}],showCloseButton:[{type:a}],description:[{type:a}],cancelLabel:[{type:a}],destructive:[{type:a}],confirmLabel:[{type:a}],onCancel:[{type:T}],onConfirm:[{type:T}]});(typeof ngDevMode>"u"||ngDevMode)&&q(d,{className:"AlertDialog",filePath:"AlertDialog.ts",lineNumber:136});const u=class u{};t(u,"ɵfac",function(e){return new(e||u)}),t(u,"ɵmod",V({type:u})),t(u,"ɵinj",F({imports:[N]}));let j=u;(typeof ngDevMode>"u"||ngDevMode)&&A(j,[{type:G,args:[{declarations:[d],imports:[N],exports:[d]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&$(j,{declarations:[d],imports:[N],exports:[d]})})();export{j as AlertDialogModule,d as default};

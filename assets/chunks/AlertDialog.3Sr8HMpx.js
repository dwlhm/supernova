var O=Object.defineProperty;var P=(n,o,e)=>o in n?O(n,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[o]=e;var t=(n,o,e)=>P(n,typeof o!="symbol"?o+"":o,e);import{E as T,ɵ as z,a as V,b as F,c as J,d as f,e as p,s as B,O as A,I as r,C as q,f as G,N as $,g as H,h as N,i as _,j as l,k as y,l as x,m as d,n as h,o as w,p as s,q as E,r as m,t as i,u as j,v as C,w as I,x as k,y as K,z as Q,A as R}from"./core.vpEFnhB-.js";import{a as U,b as W,d as X}from"./theme.CMj9otVT.js";import{C as M,N as Y,a as Z}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const ee=["*",[["","closeIcon",""],["","slot","closeicon"]]],ne=["*","[closeIcon],[slot=closeIcon]"],D=n=>({id:n});function te(n,o){if(n&1){const e=N();_(0),l(1,"div",8),y("click",function(){x(e);const a=d(2);return h(a.onCancel&&a.onCancel.emit())}),s(),m()}}function oe(n,o){n&1&&R(0)}function ie(n,o){if(n&1&&(_(0),f(1,oe,1,0,"ng-container",10),m()),n&2){const e=d(3);i(),p("ngComponentOutlet",e.closeIcon)}}function ae(n,o){n&1&&(_(0),K(),l(1,"svg",11),Q(2,"path",12),s(),m())}function re(n,o){if(n&1){const e=N();_(0),l(1,"button",9),y("click",function(){x(e);const a=d(2);return h(a.onCancel&&a.onCancel.emit())}),f(2,ie,2,1,"ng-container",0),E(3,1),f(4,ae,3,0,"ng-container",0),s(),m()}if(n&2){const e=d(2);i(),C("aria-label",e.closeLabel),i(),p("ngIf",e.closeIcon),i(2),p("ngIf",!e.closeIcon)}}function ce(n,o){if(n&1&&(_(0),l(1,"p",13),w(2),s(),m()),n&2){const e=d(2);i(),C("id",e.createDialogState(I(2,D,e.id||"alert-dialog")).descriptionId),i(),k(" ",e.description," ")}}function le(n,o){if(n&1){const e=N();_(0),l(1,"div"),f(2,te,2,0,"ng-container",0),l(3,"div",1),y("keydown",function(a){x(e);const S=d();return h(a.key==="Escape"&&S.onCancel&&S.onCancel.emit())}),l(4,"div",2)(5,"div",3)(6,"h2",4),w(7),s(),f(8,re,5,3,"ng-container",0),s(),f(9,ce,3,4,"ng-container",0),s(),_(10),E(11),m(),l(12,"div",5)(13,"button",6),y("click",function(){x(e);const a=d();return h(a.onCancel&&a.onCancel.emit())}),w(14),s(),l(15,"button",7),y("click",function(){x(e);const a=d();return h(a.onConfirm&&a.onConfirm.emit())}),w(16),s()()()(),m()}if(n&2){const e=d();i(),j(e.inline?"relative flex w-full items-center justify-center p-4":"fixed inset-0 z-50 flex items-center justify-center p-4"),C("data-ctrl",typeof e.bindControllerProps),i(),p("ngIf",!e.inline),i(),j(e.cn("relative z-10 flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border-default bg-background-default p-6 shadow-lg",e.className)),C("tabIndex",-1)("aria-labelledby",e.createDialogState(I(17,D,e.id||"alert-dialog")).titleId)("aria-describedby",e.showDescription?e.createDialogState(I(19,D,e.id||"alert-dialog")).descriptionId:void 0),i(3),C("id",e.createDialogState(I(21,D,e.id||"alert-dialog")).titleId),i(),k(" ",e.heading," "),i(),p("ngIf",e.showCloseButton),i(),p("ngIf",e.showDescription),i(5),k(" ",e.cancelLabel," "),i(),j(e.cn("inline-flex h-9 cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs select-none transition-all duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",e.destructive?"bg-destructive-background hover:bg-destructive-hover active:bg-destructive-pressed":"bg-primary-default hover:bg-primary-hover active:bg-primary-pressed")),i(),k(" ",e.confirmLabel," ")}}const c={id:"alert-dialog",open:!0,inline:!1,heading:"",description:"",showDescription:!0,showCloseButton:!0,closeLabel:"Close",cancelLabel:"Cancel",confirmLabel:"Continue",destructive:!1,className:""},v=class v{constructor(){t(this,"cn",U);t(this,"createDialogState",W);t(this,"bindControllerProps",X);t(this,"open",c.open);t(this,"inline",c.inline);t(this,"id",c.id);t(this,"showDescription",c.showDescription);t(this,"className",c.className);t(this,"heading",c.heading);t(this,"showCloseButton",c.showCloseButton);t(this,"closeLabel",c.closeLabel);t(this,"closeIcon");t(this,"description",c.description);t(this,"cancelLabel",c.cancelLabel);t(this,"destructive",c.destructive);t(this,"confirmLabel",c.confirmLabel);t(this,"onCancel",new T);t(this,"onConfirm",new T)}};t(v,"ɵfac",function(e){return new(e||v)}),t(v,"ɵcmp",z({type:v,selectors:[["kd-alert-dialog"],["alert-dialog"]],inputs:{open:"open",inline:"inline",id:"id",showDescription:"showDescription",className:"className",heading:"heading",showCloseButton:"showCloseButton",closeLabel:"closeLabel",closeIcon:"closeIcon",description:"description",cancelLabel:"cancelLabel",destructive:"destructive",confirmLabel:"confirmLabel"},outputs:{onCancel:"onCancel",onConfirm:"onConfirm"},standalone:!1,ngContentSelectors:ne,decls:1,vars:1,consts:[[4,"ngIf"],["role","alertdialog","aria-modal","true",3,"keydown"],[1,"flex","flex-col","gap-2"],[1,"flex","items-center","justify-between","gap-2.5"],[1,"flex-1","text-xl","leading-6","font-semibold","text-foreground-default"],[1,"flex","items-center","justify-end","gap-2"],["type","button",1,"inline-flex","h-9","cursor-pointer","items-center","justify-center","rounded-lg","bg-secondary-default","px-4","py-2","text-sm","font-medium","text-secondary-foreground","shadow-xs","select-none","transition-all","duration-150","hover:bg-secondary-hover","active:bg-background-interactive","active:scale-[0.97]","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"],["type","button",3,"click"],["aria-hidden","true",1,"absolute","inset-0","bg-overlay-backdrop",3,"click"],["type","button",1,"inline-flex","h-6","w-6","cursor-pointer","items-center","justify-center","rounded-md","text-foreground-muted","select-none","transition-all","duration-150","hover:bg-background-muted","hover:text-foreground-default","active:scale-[0.95]","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"],[4,"ngComponentOutlet"],["viewBox","0 0 14 14","fill","none","stroke","currentColor","stroke-width","1.5","stroke-linecap","round","stroke-linejoin","round","aria-hidden","true",1,"h-3.5","w-3.5"],["d","M11 3L3 11M3 3l8 8"],[1,"text-sm","leading-5","text-foreground-muted"]],template:function(e,b){e&1&&(J(ee),f(0,le,17,23,"ng-container",0)),e&2&&p("ngIf",b.open)},dependencies:[Y,Z],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let u=v;(typeof ngDevMode>"u"||ngDevMode)&&B(u,[{type:q,args:[{standalone:!1,selector:"kd-alert-dialog, alert-dialog",template:`
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
          id: id || 'alert-dialog'
        }).titleId"
          [attr.aria-describedby]="showDescription ? createDialogState({
          id: id || 'alert-dialog'
        }).descriptionId : undefined"
          (keydown)="$event.key === 'Escape' && onCancel && this.onCancel.emit()"
          [class]="cn('relative z-10 flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border-default bg-background-default p-6 shadow-lg', className)"
        >
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2.5">
              <h2
                class="flex-1 text-xl leading-6 font-semibold text-foreground-default"
                [attr.id]="createDialogState({
          id: id || 'alert-dialog'
        }).titleId"
              >
                {{heading}}
              </h2>
              <ng-container *ngIf="showCloseButton"
                ><button
                  type="button"
                  class="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-foreground-muted select-none transition-all duration-150 hover:bg-background-muted hover:text-foreground-default active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                  [attr.aria-label]="closeLabel"
                  (click)="onCancel && this.onCancel.emit()"
                >
                  <ng-container *ngIf="closeIcon"><ng-container *ngComponentOutlet="closeIcon"></ng-container></ng-container><ng-content select="[closeIcon],[slot=closeIcon]"></ng-content>
                  <ng-container *ngIf="!closeIcon"
                    ><svg
                      class="h-3.5 w-3.5"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M11 3L3 11M3 3l8 8"></path></svg
                  ></ng-container></button
              ></ng-container>
            </div>
            <ng-container *ngIf="showDescription"
              ><p
                class="text-sm leading-5 text-foreground-muted"
                [attr.id]="createDialogState({
          id: id || 'alert-dialog'
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
              class="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-secondary-default px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs select-none transition-all duration-150 hover:bg-secondary-hover active:bg-background-interactive active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              (click)="onCancel && this.onCancel.emit()"
            >
              {{cancelLabel}}
            </button>
            <button
              type="button"
              [class]="cn('inline-flex h-9 cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs select-none transition-all duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', destructive ? 'bg-destructive-background hover:bg-destructive-hover active:bg-destructive-pressed' : 'bg-primary-default hover:bg-primary-hover active:bg-primary-pressed')"
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
    `]}]}],null,{open:[{type:r}],inline:[{type:r}],id:[{type:r}],showDescription:[{type:r}],className:[{type:r}],heading:[{type:r}],showCloseButton:[{type:r}],closeLabel:[{type:r}],closeIcon:[{type:r}],description:[{type:r}],cancelLabel:[{type:r}],destructive:[{type:r}],confirmLabel:[{type:r}],onCancel:[{type:A}],onConfirm:[{type:A}]});(typeof ngDevMode>"u"||ngDevMode)&&G(u,{className:"AlertDialog",filePath:"AlertDialog.ts",lineNumber:143});const g=class g{};t(g,"ɵfac",function(e){return new(e||g)}),t(g,"ɵmod",V({type:g})),t(g,"ɵinj",F({imports:[M]}));let L=g;(typeof ngDevMode>"u"||ngDevMode)&&B(L,[{type:$,args:[{declarations:[u],imports:[M],exports:[u]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&H(L,{declarations:[u],imports:[M],exports:[u]})})();export{L as AlertDialogModule,u as default};

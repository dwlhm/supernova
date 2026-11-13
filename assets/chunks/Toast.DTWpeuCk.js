var X=Object.defineProperty;var Y=(t,o,e)=>o in t?X(t,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[o]=e;var n=(t,o,e)=>Y(t,typeof o!="symbol"?o+"":o,e);import{E as P,ɵ as V,a as $,b as F,c as J,d as f,e as l,s as B,O as E,I as s,C as U,f as q,N as G,g as Q,h as O,i as _,j as g,k as S,l as h,m as r,n as x,q as D,p as d,r as m,t as i,u as w,an as T,v as I,y as z,z as H,o as k,ao as N,x as W,A as j}from"./core.vpEFnhB-.js";import{a as Z,e as K,S as R,I as ee,d as te,Q as ne,T as oe,U as ie,V as M,W as se,X as ae,Y as re,Z as ce,_ as le,O as ge,P as de}from"./theme.CMj9otVT.js";import{C as A,N as pe,a as ue,c as fe}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const _e=[[["","icon",""],["","slot","icon"]],"*",[["","closeIcon",""],["","slot","closeicon"]]],me=["[icon],[slot=icon]","*","[closeIcon],[slot=closeIcon]"],he=()=>({inline:"","top-left":"fixed top-4 left-4 z-50","top-center":"fixed top-4 left-1/2 z-50 -translate-x-1/2","top-right":"fixed top-4 right-4 z-50","bottom-left":"fixed bottom-4 left-4 z-50","bottom-center":"fixed bottom-4 left-1/2 z-50 -translate-x-1/2","bottom-right":"fixed bottom-4 right-4 z-50"}),xe=()=>({success:"bg-success-default",error:"bg-destructive-default",warning:"bg-warning-default",info:"bg-info-default",default:"bg-foreground-subtle"}),L=()=>({success:"text-success-default",error:"text-destructive-default",warning:"text-warning-default",info:"text-info-default",default:"text-foreground-default"});function be(t,o){t&1&&j(0)}function ve(t,o){if(t&1&&(_(0),f(1,be,1,0,"ng-container",4),m()),t&2){const e=r(2);i(),l("ngComponentOutlet",e.icon)}}function ye(t,o){if(t&1&&(_(0),z(),g(1,"svg",5),H(2,"path",6),d(),m()),t&2){const e=r(2);i(2),I("d",e.getToastIconPath(e.type))}}function we(t,o){if(t&1&&(_(0),g(1,"span"),k(2),d(),m()),t&2){const e=r(2);i(),w(e.cn("truncate text-sm font-semibold",e.cva(e.type,T(3,L),"default"))),i(),N(e.title)}}function Te(t,o){if(t&1&&(_(0),g(1,"span",7),k(2),d(),m()),t&2){const e=r(2);i(2),N(e.description)}}function Ce(t,o){if(t&1&&(_(0),g(1,"span",8),k(2),d(),m()),t&2){const e=r(2);i(2),N(e.timestamp)}}function Ie(t,o){if(t&1){const e=O();_(0),g(1,"button",9),S("click",function(){h(e);const a=r(2);return x(a.onAction&&a.onAction.emit())}),k(2),d(),m()}if(t&2){const e=r(2);i(2),W(" ",e.actionText," ")}}function ke(t,o){t&1&&j(0)}function De(t,o){if(t&1&&(_(0),f(1,ke,1,0,"ng-container",4),m()),t&2){const e=r(3);i(),l("ngComponentOutlet",e.closeIcon)}}function Oe(t,o){if(t&1&&(_(0),z(),g(1,"svg",11),H(2,"path",12),d(),m()),t&2){const e=r(3);i(2),I("d",e.ICON_PATHS.close)}}function Se(t,o){if(t&1){const e=O();_(0),g(1,"button",10),S("click",function(){h(e);const a=r(2);return x(a.onClose&&a.onClose.emit())}),f(2,De,2,1,"ng-container",0),D(3,2),f(4,Oe,3,1,"ng-container",0),d(),m()}if(t&2){const e=r(2);i(),I("aria-label",e.closeLabel),i(),l("ngIf",e.closeIcon),i(2),l("ngIf",!e.closeIcon)}}function Ne(t,o){if(t&1){const e=O();_(0),g(1,"div",1),S("mouseenter",function(){h(e);const a=r();return x(a.onEnter())})("mouseleave",function(){h(e);const a=r();return x(a.onLeave())})("pointerdown",function(a){h(e);const u=r();return x(u.onDown(a))})("pointermove",function(a){h(e);const u=r();return x(u.onMove(a))})("pointerup",function(a){h(e);const u=r();return x(u.onEnd(a,!1))})("pointercancel",function(a){h(e);const u=r();return x(u.onEnd(a,!0))})("keydown",function(a){h(e);const u=r();return x(a.key==="Escape"&&u.onClose&&u.onClose.emit())}),g(2,"span",2),f(3,ve,2,1,"ng-container",0),D(4),f(5,ye,3,1,"ng-container",0),d(),g(6,"span",3),f(7,we,3,4,"ng-container",0),g(8,"span"),D(9,1),d(),f(10,Te,3,1,"ng-container",0),d(),f(11,Ce,3,1,"ng-container",0)(12,Ie,3,1,"ng-container",0)(13,Se,5,3,"ng-container",0),d(),m()}if(t&2){const e=r();i(),w(e.cn("flex w-full max-w-md items-center gap-1.5 bg-background-default px-3 py-2 shadow-md transition-shadow hover:shadow-lg active:shadow-sm",e.draggable!==!1&&"touch-none select-none",e.draggable!==!1&&(e.isDragging?"cursor-grabbing":"cursor-grab"),e.showDescription?"rounded-xl":"rounded-full",e.cva(e.placement,T(18,he),"inline"),e.className)),l("ngStyle",e.mergeDragStyle(e.inlineStyle,e.isDragging,e.dragX,e.dragY,e.placement,e.swipeThreshold)),I("id",e.id||void 0)("data-ctrl",typeof e.bindControllerProps)("role",e.type==="error"?"alert":"status")("aria-live",e.type==="error"?"assertive":"polite"),i(),w(e.cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full p-1.5 text-foreground-on-accent",e.cva(e.type,T(19,xe),"default"))),i(),l("ngIf",e.icon),i(2),l("ngIf",!e.icon),i(2),l("ngIf",e.title!==""),i(),w(e.cn("text-sm font-semibold empty:hidden",e.cva(e.type,T(20,L),"default"))),i(2),l("ngIf",e.showDescription),i(),l("ngIf",e.showTimestamp&&e.timestamp!==""),i(),l("ngIf",e.showAction),i(),l("ngIf",e.showClose)}}const c={id:"",open:!0,type:"default",placement:"inline",title:"",description:"",showDescription:!1,actionText:"Undo",showAction:!1,showClose:!1,closeLabel:"Dismiss notification",timestamp:"",showTimestamp:!0,duration:0,pauseOnHover:!0,draggable:!0,swipeThreshold:88,className:""},y=class y{constructor(){n(this,"cn",Z);n(this,"cva",K);n(this,"getToastIconPath",R);n(this,"ICON_PATHS",ee);n(this,"bindControllerProps",te);n(this,"mergeDragStyle",ne);n(this,"duration",c.duration);n(this,"open",c.open);n(this,"pauseOnHover",c.pauseOnHover);n(this,"draggable",c.draggable);n(this,"placement",c.placement);n(this,"swipeThreshold",c.swipeThreshold);n(this,"id",c.id);n(this,"inlineStyle");n(this,"type",c.type);n(this,"showDescription",c.showDescription);n(this,"className",c.className);n(this,"icon");n(this,"title",c.title);n(this,"description",c.description);n(this,"showTimestamp",c.showTimestamp);n(this,"timestamp",c.timestamp);n(this,"showAction",c.showAction);n(this,"actionText",c.actionText);n(this,"showClose",c.showClose);n(this,"closeLabel",c.closeLabel);n(this,"closeIcon");n(this,"onClose",new P);n(this,"onAction",new P);n(this,"bag",oe());n(this,"isDragging",!1);n(this,"dragX",0);n(this,"dragY",0)}onEnter(){this.pauseOnHover!==!1&&ie(this.bag)}onLeave(){this.pauseOnHover!==!1&&M(this.bag,this.open,()=>this.onClose&&this.onClose.emit())}onDown(o){se(this.bag,o,this.draggable)&&(this.isDragging=!0,this.dragX=0,this.dragY=0)}onMove(o){ae(this.bag,o)&&(this.dragX=re(this.bag),this.dragY=ce(this.bag))}onEnd(o,e){this.isDragging&&(this.isDragging=!1,this.dragX=0,this.dragY=0,le(this.bag,o,this.placement,this.swipeThreshold,e)?this.onClose&&this.onClose.emit():(e||this.pauseOnHover!==!1)&&M(this.bag,this.open,()=>this.onClose&&this.onClose.emit()))}ngOnInit(){typeof window<"u"&&(this.duration||0)>0&&ge(this.bag,this.duration||0,this.open,()=>this.onClose&&this.onClose.emit())}ngOnDestroy(){de(this.bag)}};n(y,"ɵfac",function(e){return new(e||y)}),n(y,"ɵcmp",V({type:y,selectors:[["kd-toast"],["toast"]],inputs:{duration:"duration",open:"open",pauseOnHover:"pauseOnHover",draggable:"draggable",placement:"placement",swipeThreshold:"swipeThreshold",id:"id",inlineStyle:"inlineStyle",type:"type",showDescription:"showDescription",className:"className",icon:"icon",title:"title",description:"description",showTimestamp:"showTimestamp",timestamp:"timestamp",showAction:"showAction",actionText:"actionText",showClose:"showClose",closeLabel:"closeLabel",closeIcon:"closeIcon"},outputs:{onClose:"onClose",onAction:"onAction"},standalone:!1,ngContentSelectors:me,decls:1,vars:1,consts:[[4,"ngIf"],[3,"mouseenter","mouseleave","pointerdown","pointermove","pointerup","pointercancel","keydown","ngStyle"],["aria-hidden","true"],[1,"flex","min-w-0","flex-1","flex-col","gap-0.5"],[4,"ngComponentOutlet"],["viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2",1,"h-4","w-4"],["stroke-linecap","round","stroke-linejoin","round"],[1,"text-xs","text-foreground-muted"],[1,"shrink-0","text-xs","text-foreground-muted"],["type","button",1,"shrink-0","cursor-pointer","rounded-md","bg-secondary-default","px-2","py-1","text-xs","font-medium","text-secondary-foreground","select-none","transition-all","duration-150","hover:bg-secondary-hover","active:bg-background-interactive","active:scale-[0.97]","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"],["type","button",1,"inline-flex","h-6","w-6","shrink-0","cursor-pointer","items-center","justify-center","rounded-full","text-foreground-muted","select-none","transition-all","duration-150","hover:bg-background-muted","hover:text-foreground-default","active:bg-background-interactive","active:scale-[0.95]","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2",1,"h-3.5","w-3.5"],["stroke-linecap","round"]],template:function(e,p){e&1&&(J(_e),f(0,Ne,14,21,"ng-container",0)),e&2&&l("ngIf",p.open)},dependencies:[pe,ue,fe],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let b=y;(typeof ngDevMode>"u"||ngDevMode)&&B(b,[{type:U,args:[{standalone:!1,selector:"kd-toast, toast",template:`
    <ng-container *ngIf="open"
      ><div
        [attr.id]="id || undefined"
        [attr.data-ctrl]="typeof bindControllerProps"
        [ngStyle]="mergeDragStyle(inlineStyle, isDragging, dragX, dragY, placement, swipeThreshold)"
        [attr.role]="type === 'error' ? 'alert' : 'status'"
        [attr.aria-live]="type === 'error' ? 'assertive' : 'polite'"
        (mouseenter)="onEnter()"
        (mouseleave)="onLeave()"
        (pointerdown)="onDown($event)"
        (pointermove)="onMove($event)"
        (pointerup)="onEnd($event, false)"
        (pointercancel)="onEnd($event, true)"
        (keydown)="$event.key === 'Escape' && onClose && this.onClose.emit()"
        [class]="cn('flex w-full max-w-md items-center gap-1.5 bg-background-default px-3 py-2 shadow-md transition-shadow hover:shadow-lg active:shadow-sm', draggable !== false && 'touch-none select-none', draggable !== false && (isDragging ? 'cursor-grabbing' : 'cursor-grab'), showDescription ? 'rounded-xl' : 'rounded-full', cva(placement, {
          inline: '',
          'top-left': 'fixed top-4 left-4 z-50',
          'top-center': 'fixed top-4 left-1/2 z-50 -translate-x-1/2',
          'top-right': 'fixed top-4 right-4 z-50',
          'bottom-left': 'fixed bottom-4 left-4 z-50',
          'bottom-center': 'fixed bottom-4 left-1/2 z-50 -translate-x-1/2',
          'bottom-right': 'fixed bottom-4 right-4 z-50'
        }, 'inline'), className)"
      >
        <span
          aria-hidden="true"
          [class]="cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full p-1.5 text-foreground-on-accent', cva(type, {
          success: 'bg-success-default',
          error: 'bg-destructive-default',
          warning: 'bg-warning-default',
          info: 'bg-info-default',
          default: 'bg-foreground-subtle'
        }, 'default'))"
          ><ng-container *ngIf="icon"><ng-container *ngComponentOutlet="icon"></ng-container></ng-container><ng-content select="[icon],[slot=icon]"></ng-content>
          <ng-container *ngIf="!icon"
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
              ></path></svg></ng-container
        ></span>
        <span class="flex min-w-0 flex-1 flex-col gap-0.5"
          ><ng-container *ngIf="title !== ''"
            ><span
              [class]="cn('truncate text-sm font-semibold', cva(type, {
          success: 'text-success-default',
          error: 'text-destructive-default',
          warning: 'text-warning-default',
          info: 'text-info-default',
          default: 'text-foreground-default'
        }, 'default'))"
              >{{title}}</span
            ></ng-container
          >
          <span
            [class]="cn('text-sm font-semibold empty:hidden', cva(type, {
          success: 'text-success-default',
          error: 'text-destructive-default',
          warning: 'text-warning-default',
          info: 'text-info-default',
          default: 'text-foreground-default'
        }, 'default'))"
            ><ng-content></ng-content
          ></span>
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
            class="shrink-0 cursor-pointer rounded-md bg-secondary-default px-2 py-1 text-xs font-medium text-secondary-foreground select-none transition-all duration-150 hover:bg-secondary-hover active:bg-background-interactive active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            (click)="onAction && this.onAction.emit()"
          >
            {{actionText}}
          </button></ng-container
        >
        <ng-container *ngIf="showClose"
          ><button
            type="button"
            class="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-muted select-none transition-all duration-150 hover:bg-background-muted hover:text-foreground-default active:bg-background-interactive active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            [attr.aria-label]="closeLabel"
            (click)="onClose && this.onClose.emit()"
          >
            <ng-container *ngIf="closeIcon"><ng-container *ngComponentOutlet="closeIcon"></ng-container></ng-container><ng-content select="[closeIcon],[slot=closeIcon]"></ng-content>
            <ng-container *ngIf="!closeIcon"
              ><svg
                aria-hidden="true"
                class="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  [attr.d]="ICON_PATHS.close"
                ></path></svg
            ></ng-container></button
        ></ng-container></div
    ></ng-container>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{duration:[{type:s}],open:[{type:s}],pauseOnHover:[{type:s}],draggable:[{type:s}],placement:[{type:s}],swipeThreshold:[{type:s}],id:[{type:s}],inlineStyle:[{type:s}],type:[{type:s}],showDescription:[{type:s}],className:[{type:s}],icon:[{type:s}],title:[{type:s}],description:[{type:s}],showTimestamp:[{type:s}],timestamp:[{type:s}],showAction:[{type:s}],actionText:[{type:s}],showClose:[{type:s}],closeLabel:[{type:s}],closeIcon:[{type:s}],onClose:[{type:E}],onAction:[{type:E}]});(typeof ngDevMode>"u"||ngDevMode)&&q(b,{className:"Toast",filePath:"Toast.ts",lineNumber:207});const v=class v{};n(v,"ɵfac",function(e){return new(e||v)}),n(v,"ɵmod",$({type:v})),n(v,"ɵinj",F({imports:[A]}));let C=v;(typeof ngDevMode>"u"||ngDevMode)&&B(C,[{type:G,args:[{declarations:[b],imports:[A],exports:[b]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&Q(C,{declarations:[b],imports:[A],exports:[b]})})();export{C as ToastModule,b as default};

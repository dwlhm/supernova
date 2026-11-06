var k=Object.defineProperty;var N=(t,o,e)=>o in t?k(t,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[o]=e;var n=(t,o,e)=>N(t,typeof o!="symbol"?o+"":o,e);import{E as j,ɵ as T,a as M,b as P,j as c,d as y,p as d,u as L,v,t as s,e as m,s as I,O as E,I as p,C as S,f as D,N as O,g as A,i as _,y as H,z as V,r as x,m as u,o as b,am as w,h as B,k as F,l as J,n as z,x as G}from"./core.BqS-lykr.js";import{a as q,I as K,b as Q}from"./utils.BBpd638g.js";import{C,N as R}from"./common_module-chunk.DvGwmKFp.js";function U(t,o){if(t&1&&(_(0),c(1,"span",2),H(),c(2,"svg",3),V(3,"path",4),d()(),x()),t&2){const e=u();s(3),v("d",e.ICON_PATHS.search)}}function W(t,o){if(t&1&&(_(0),c(1,"span",5),b(2),d(),x()),t&2){const e=u();s(2),w(e.title)}}function X(t,o){if(t&1&&(_(0),c(1,"span",6),b(2),d(),x()),t&2){const e=u();s(2),w(e.description)}}function Y(t,o){if(t&1){const e=B();_(0),c(1,"button",7),F("click",function(){J(e);const h=u();return z(h.onCtaClick&&h.onCtaClick.emit())}),b(2),d(),x()}if(t&2){const e=u();s(2),G(" ",e.ctaLabel," ")}}const f={title:"",description:"",ctaLabel:"",showIcon:!0,className:""},l=class l{constructor(){n(this,"cn",q);n(this,"ICON_PATHS",K);n(this,"bindControllerProps",Q);n(this,"className",f.className);n(this,"showIcon",f.showIcon);n(this,"title",f.title);n(this,"description",f.description);n(this,"ctaLabel",f.ctaLabel);n(this,"onCtaClick",new j)}};n(l,"ɵfac",function(e){return new(e||l)}),n(l,"ɵcmp",T({type:l,selectors:[["spn-table-empty"],["table-empty"]],inputs:{className:"className",showIcon:"showIcon",title:"title",description:"description",ctaLabel:"ctaLabel"},outputs:{onCtaClick:"onCtaClick"},standalone:!1,decls:6,vars:7,consts:[[4,"ngIf"],[1,"flex","flex-col","items-center","justify-center","gap-2"],["aria-hidden","true",1,"flex","h-16","w-16","flex-col","items-center","justify-center","rounded-full","bg-background-muted"],["viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-6","w-6","text-foreground-muted"],["stroke-linecap","round","stroke-linejoin","round"],[1,"text-center","text-base","font-semibold","text-foreground-default"],[1,"max-w-sm","text-center","text-sm","font-normal","text-foreground-muted"],["type","button",1,"flex","flex-row","items-center","justify-center","gap-2","rounded-lg","bg-secondary-default","px-4","py-2","text-center","text-sm","font-medium","text-secondary-foreground","transition-colors","hover:bg-secondary-hover","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"]],template:function(e,a){e&1&&(c(0,"div"),y(1,U,4,1,"ng-container",0),c(2,"div",1),y(3,W,3,1,"ng-container",0)(4,X,3,1,"ng-container",0),d(),y(5,Y,3,1,"ng-container",0),d()),e&2&&(L(a.cn("flex flex-col items-center justify-center gap-4 rounded-lg bg-background-default px-8 py-10 text-center",a.className)),v("data-ctrl",typeof a.bindControllerProps),s(),m("ngIf",a.showIcon),s(2),m("ngIf",a.title),s(),m("ngIf",a.description),s(),m("ngIf",a.ctaLabel))},dependencies:[R],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let r=l;(typeof ngDevMode>"u"||ngDevMode)&&I(r,[{type:S,args:[{standalone:!1,selector:"spn-table-empty, table-empty",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex flex-col items-center justify-center gap-4 rounded-lg bg-background-default px-8 py-10 text-center', className)"
    >
      <ng-container *ngIf="showIcon"
        ><span
          class="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-background-muted"
          aria-hidden="true"
          ><svg
            class="h-6 w-6 text-foreground-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="ICON_PATHS.search"
            ></path></svg></span
      ></ng-container>
      <div class="flex flex-col items-center justify-center gap-2">
        <ng-container *ngIf="title"
          ><span
            class="text-center text-base font-semibold text-foreground-default"
            >{{title}}</span
          ></ng-container
        >
        <ng-container *ngIf="description"
          ><span
            class="max-w-sm text-center text-sm font-normal text-foreground-muted"
            >{{description}}</span
          ></ng-container
        >
      </div>
      <ng-container *ngIf="ctaLabel"
        ><button
          type="button"
          class="flex flex-row items-center justify-center gap-2 rounded-lg bg-secondary-default px-4 py-2 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          (click)="onCtaClick && this.onCtaClick.emit()"
        >
          {{ctaLabel}}
        </button></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:p}],showIcon:[{type:p}],title:[{type:p}],description:[{type:p}],ctaLabel:[{type:p}],onCtaClick:[{type:E}]});(typeof ngDevMode>"u"||ngDevMode)&&D(r,{className:"TableEmpty",filePath:"TableEmpty.ts",lineNumber:81});const i=class i{};n(i,"ɵfac",function(e){return new(e||i)}),n(i,"ɵmod",M({type:i})),n(i,"ɵinj",P({imports:[C]}));let g=i;(typeof ngDevMode>"u"||ngDevMode)&&I(g,[{type:O,args:[{declarations:[r],imports:[C],exports:[r]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&A(g,{declarations:[r],imports:[C],exports:[r]})})();export{g as TableEmptyModule,r as default};

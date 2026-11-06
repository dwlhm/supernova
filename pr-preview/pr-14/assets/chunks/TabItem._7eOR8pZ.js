var C=Object.defineProperty;var k=(s,a,t)=>a in s?C(s,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[a]=t;var e=(s,a,t)=>k(s,typeof a!="symbol"?a+"":a,t);import{E as x,ɵ as N,a as I,b as M,c as P,j as u,k as S,d as g,q as T,p as d,u as D,v as h,t as m,e as _,s as b,O as j,I as r,C as O,f as E,N as A,g as H,i as v,y as B,z as F,r as y,m as w,o as J,am as q}from"./core.BqS-lykr.js";import{a as z,I as G,b as V}from"./utils.BBpd638g.js";import{C as f,N as K}from"./common_module-chunk.DvGwmKFp.js";const L=["*"];function Q(s,a){if(s&1&&(v(0),u(1,"span",3),B(),u(2,"svg",4),F(3,"path",5),d()(),y()),s&2){const t=w();m(3),h("d",t.ICON_PATHS.menu)}}function R(s,a){if(s&1&&(v(0),u(1,"span",6),J(2),d(),y()),s&2){const t=w();m(2),q(t.num)}}const c={active:!1,state:"default",showIcon:!1,showNum:!1,num:"",className:""},l=class l{constructor(){e(this,"cn",z);e(this,"ICON_PATHS",G);e(this,"bindControllerProps",V);e(this,"active",c.active);e(this,"state",c.state);e(this,"className",c.className);e(this,"showIcon",c.showIcon);e(this,"showNum",c.showNum);e(this,"num",c.num);e(this,"onClick",new x)}};e(l,"ɵfac",function(t){return new(t||l)}),e(l,"ɵcmp",N({type:l,selectors:[["spn-tab-item"],["tab-item"]],inputs:{active:"active",state:"state",className:"className",showIcon:"showIcon",showNum:"showNum",num:"num"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:L,decls:5,vars:7,consts:[["type","button","role","tab",3,"click"],[4,"ngIf"],[1,"truncate"],[1,"flex","shrink-0","items-center","text-foreground-muted"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-3.5","w-3.5"],["stroke-linecap","round"],[1,"inline-flex","shrink-0","items-center","rounded-full","bg-background-muted","px-1.5","py-0.5","text-xs","font-medium","leading-none","text-foreground-muted"]],template:function(t,n){t&1&&(P(),u(0,"button",0),S("click",function(){return n.onClick&&n.onClick.emit()}),g(1,Q,4,1,"ng-container",1),u(2,"span",2),T(3),d(),g(4,R,3,1,"ng-container",1),d()),t&2&&(D(n.cn("inline-flex h-7 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",n.active||n.state==="active"?"border border-border-default bg-background-default text-foreground-default shadow-sm":"text-foreground-muted hover:text-foreground-default",n.className)),h("data-ctrl",typeof n.bindControllerProps)("aria-selected",n.active||n.state==="active")("tabIndex",n.active||n.state==="active"?0:-1),m(),_("ngIf",n.showIcon),m(3),_("ngIf",n.showNum))},dependencies:[K],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let o=l;(typeof ngDevMode>"u"||ngDevMode)&&b(o,[{type:O,args:[{standalone:!1,selector:"spn-tab-item, tab-item",template:`
    <button
      type="button"
      role="tab"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-selected]="active || state === 'active'"
      [attr.tabIndex]="active || state === 'active' ? 0 : -1"
      [class]="cn('inline-flex h-7 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', active || state === 'active' ? 'border border-border-default bg-background-default text-foreground-default shadow-sm' : 'text-foreground-muted hover:text-foreground-default', className)"
      (click)="onClick && this.onClick.emit()"
    >
      <ng-container *ngIf="showIcon"
        ><span class="flex shrink-0 items-center text-foreground-muted"
          ><svg
            aria-hidden="true"
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              [attr.d]="ICON_PATHS.menu"
            ></path></svg></span
      ></ng-container>
      <span class="truncate"><ng-content></ng-content></span>
      <ng-container *ngIf="showNum"
        ><span
          class="inline-flex shrink-0 items-center rounded-full bg-background-muted px-1.5 py-0.5 text-xs font-medium leading-none text-foreground-muted"
          >{{num}}</span
        ></ng-container
      >
    </button>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{active:[{type:r}],state:[{type:r}],className:[{type:r}],showIcon:[{type:r}],showNum:[{type:r}],num:[{type:r}],onClick:[{type:j}]});(typeof ngDevMode>"u"||ngDevMode)&&E(o,{className:"TabItem",filePath:"TabItem.ts",lineNumber:71});const i=class i{};e(i,"ɵfac",function(t){return new(t||i)}),e(i,"ɵmod",I({type:i})),e(i,"ɵinj",M({imports:[f]}));let p=i;(typeof ngDevMode>"u"||ngDevMode)&&b(p,[{type:A,args:[{declarations:[o],imports:[f],exports:[o]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&H(p,{declarations:[o],imports:[f],exports:[o]})})();export{p as TabItemModule,o as default};

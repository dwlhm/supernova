var v=Object.defineProperty;var C=(t,n,a)=>n in t?v(t,n,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[n]=a;var e=(t,n,a)=>C(t,typeof n!="symbol"?n+"":n,a);import{E as x,ɵ as I,a as N,b as P,c as k,j as c,k as T,d as z,i as b,q as M,p as u,r as _,u as h,w as m,v as y,t as g,e as S,s as w,O as D,I as r,C as L,f as j,N as O,g as E,y as A,z as H,m as F}from"./core.BqS-lykr.js";import{a as B,d as J,I as q,b as G}from"./utils.BBpd638g.js";import{C as f,N as V}from"./common_module-chunk.DvGwmKFp.js";const K=["*"],Q=()=>({small:"px-2 py-1 gap-1.5 text-xs",medium:"px-3 py-1.5 gap-2 text-sm",large:"px-4 py-2 gap-2.5 text-base"}),R=()=>({small:"h-4 w-4 gap-0.5 px-0.5 py-0.5",medium:"h-6 w-6 gap-1 px-1 py-1",large:"h-9 w-9 gap-1 px-2 py-2"}),U=()=>({small:"h-3 w-3",medium:"h-4 w-4",large:"h-5 w-5"});function W(t,n){if(t&1&&(b(0),A(),c(1,"svg",3),H(2,"path",4),u(),_()),t&2){const a=F();g(),h(a.cn("shrink-0",a.cva(a.size,m(3,U),"medium"))),g(),y("d",a.ICON_PATHS.plus)}}const i={pressed:!1,disabled:!1,size:"medium",showText:!1,showIcon:!0,className:"",ariaLabel:"Toggle"},d=class d{constructor(){e(this,"cn",B);e(this,"cva",J);e(this,"ICON_PATHS",q);e(this,"bindControllerProps",G);e(this,"pressed",i.pressed);e(this,"ariaLabel",i.ariaLabel);e(this,"disabled",i.disabled);e(this,"showText",i.showText);e(this,"size",i.size);e(this,"className",i.className);e(this,"showIcon",i.showIcon);e(this,"onPressedChange",new x)}};e(d,"ɵfac",function(a){return new(a||d)}),e(d,"ɵcmp",I({type:d,selectors:[["spn-toggle"],["toggle"]],inputs:{pressed:"pressed",ariaLabel:"ariaLabel",disabled:"disabled",showText:"showText",size:"size",className:"className",showIcon:"showIcon"},outputs:{onPressedChange:"onPressedChange"},standalone:!1,ngContentSelectors:K,decls:5,vars:9,consts:[["type","button",3,"click"],[4,"ngIf"],[1,"truncate","font-medium"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["stroke-linecap","round"]],template:function(a,s){a&1&&(k(),c(0,"button",0),T("click",function(){return!s.disabled&&s.onPressedChange&&s.onPressedChange.emit(!s.pressed)}),z(1,W,3,4,"ng-container",1),b(2),c(3,"span",2),M(4),u(),_(),u()),a&2&&(h(s.cn("inline-flex flex-row items-center justify-center rounded-lg text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50",s.showText?s.cva(s.size,m(7,Q),"medium"):s.cva(s.size,m(8,R),"medium"),s.pressed?"bg-background-muted shadow-sm":"bg-transparent",s.className)),y("data-ctrl",typeof s.bindControllerProps)("aria-pressed",s.pressed)("aria-label",s.ariaLabel)("disabled",s.disabled?"":null),g(),S("ngIf",s.showIcon))},dependencies:[V],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let o=d;(typeof ngDevMode>"u"||ngDevMode)&&w(o,[{type:L,args:[{standalone:!1,selector:"spn-toggle, toggle",template:`
    <button
      type="button"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-pressed]="pressed"
      [attr.aria-label]="ariaLabel"
      [attr.disabled]="(disabled) ? '' : null"
      [class]="cn('inline-flex flex-row items-center justify-center rounded-lg text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50', showText ? cva(size, {
          small: 'px-2 py-1 gap-1.5 text-xs',
          medium: 'px-3 py-1.5 gap-2 text-sm',
          large: 'px-4 py-2 gap-2.5 text-base'
        }, 'medium') : cva(size, {
          small: 'h-4 w-4 gap-0.5 px-0.5 py-0.5',
          medium: 'h-6 w-6 gap-1 px-1 py-1',
          large: 'h-9 w-9 gap-1 px-2 py-2'
        }, 'medium'), pressed ? 'bg-background-muted shadow-sm' : 'bg-transparent', className)"
      (click)="!disabled && onPressedChange && this.onPressedChange.emit(!pressed)"
    >
      <ng-container *ngIf="showIcon"
        ><svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          [class]="cn('shrink-0', cva(size, {
          small: 'h-3 w-3',
          medium: 'h-4 w-4',
          large: 'h-5 w-5'
        }, 'medium'))"
        >
          <path stroke-linecap="round" [attr.d]="ICON_PATHS.plus"></path></svg
      ></ng-container>
      <ng-container><span class="truncate font-medium"><ng-content></ng-content></span
      ></ng-container>
    </button>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{pressed:[{type:r}],ariaLabel:[{type:r}],disabled:[{type:r}],showText:[{type:r}],size:[{type:r}],className:[{type:r}],showIcon:[{type:r}],onPressedChange:[{type:D}]});(typeof ngDevMode>"u"||ngDevMode)&&j(o,{className:"Toggle",filePath:"Toggle.ts",lineNumber:76});const l=class l{};e(l,"ɵfac",function(a){return new(a||l)}),e(l,"ɵmod",N({type:l})),e(l,"ɵinj",P({imports:[f]}));let p=l;(typeof ngDevMode>"u"||ngDevMode)&&w(p,[{type:O,args:[{declarations:[o],imports:[f],exports:[o]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&E(p,{declarations:[o],imports:[f],exports:[o]})})();export{p as ToggleModule,o as default};

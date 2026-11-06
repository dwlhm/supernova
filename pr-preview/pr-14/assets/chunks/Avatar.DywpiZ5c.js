var C=Object.defineProperty;var k=(a,n,e)=>n in a?C(a,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[n]=e;var t=(a,n,e)=>k(a,typeof n!="symbol"?n+"":n,e);import{ɵ as S,a as I,b as M,j as _,d as T,p as h,u as b,w as y,v,t as o,e as d,s as N,I as i,C as z,f as j,N as A,g as D,i as p,z as w,r as f,m,y as P,o as B,am as F}from"./core.BqS-lykr.js";import{a as E,d as J,g as G,b as O}from"./utils.BBpd638g.js";import{C as x,N as V}from"./common_module-chunk.DvGwmKFp.js";const q=()=>({mini:"h-6 w-6 text-xs",small:"h-8 w-8 text-xs",regular:"h-9 w-9 text-sm",large:"h-10 w-10 text-base","x-large":"h-14 w-14 text-lg"}),H=()=>({mini:"h-3 w-3",small:"h-4 w-4",regular:"h-4 w-4",large:"h-5 w-5","x-large":"h-7 w-7"}),K=()=>({offline:"bg-background-interactive",busy:"bg-destructive-default",away:"bg-warning-default",online:"bg-success-default"});function L(a,n){if(a&1&&(p(0),w(1,"img",2),f()),a&2){const e=m();o(),v("src",e.src)}}function Q(a,n){if(a&1&&(p(0),P(),_(1,"svg",3),w(2,"circle",4)(3,"path",5),h(),f()),a&2){const e=m();o(),b(e.cn("shrink-0 text-foreground-subtle",e.cva(e.size,y(2,H),"mini")))}}function R(a,n){if(a&1&&(p(0),_(1,"span",6),B(2),h(),f()),a&2){const e=m();o(2),F(e.initialsText)}}function U(a,n){if(a&1&&(p(0),w(1,"span",7),f()),a&2){const e=m();o(),b(e.cn("absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background-default",e.cva(e.status,y(2,K),"online")))}}const r={size:"mini",type:"image",showStatus:!0,initialsText:"AB",src:"",alt:"",status:"online",className:""},u=class u{constructor(){t(this,"alt",r.alt);t(this,"cn",E);t(this,"cva",J);t(this,"getAvatarState",G);t(this,"bindControllerProps",O);t(this,"size",r.size);t(this,"className",r.className);t(this,"type",r.type);t(this,"src",r.src);t(this,"initialsText",r.initialsText);t(this,"showStatus",r.showStatus);t(this,"status",r.status)}get props(){return this}};t(u,"ɵfac",function(e){return new(e||u)}),t(u,"ɵcmp",S({type:u,selectors:[["spn-avatar"],["avatar"]],inputs:{alt:"alt",size:"size",className:"className",type:"type",src:"src",initialsText:"initialsText",showStatus:"showStatus",status:"status"},standalone:!1,decls:5,vars:9,consts:[["role","img"],[4,"ngIf"],["alt","",1,"h-full","w-full","rounded-full","object-cover"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["cx","12","cy","8","r","3.5"],["d","M4.5 20a7.5 7.5 0 0 1 15 0","stroke-linecap","round"],["aria-hidden","true",1,"font-medium","uppercase","leading-none","text-foreground-subtle"],["aria-hidden","true"]],template:function(e,s){e&1&&(_(0,"span",0),T(1,L,2,1,"ng-container",1)(2,Q,4,3,"ng-container",1)(3,R,3,1,"ng-container",1)(4,U,2,3,"ng-container",1),h()),e&2&&(b(s.cn("relative inline-flex shrink-0 items-center justify-center rounded-full bg-background-muted",s.cva(s.size,y(8,q),"mini"),s.className)),v("data-ctrl",typeof s.bindControllerProps)("aria-label",s.getAvatarState(s.props).accessibleName),o(),d("ngIf",s.type==="image"),o(),d("ngIf",s.type==="icon"),o(),d("ngIf",s.type==="initials"),o(),d("ngIf",s.showStatus))},dependencies:[V],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let l=u;(typeof ngDevMode>"u"||ngDevMode)&&N(l,[{type:z,args:[{standalone:!1,selector:"spn-avatar, avatar",template:`
    <span
      role="img"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-label]="getAvatarState(props).accessibleName"
      [class]="cn('relative inline-flex shrink-0 items-center justify-center rounded-full bg-background-muted', cva(size, {
          mini: 'h-6 w-6 text-xs',
          small: 'h-8 w-8 text-xs',
          regular: 'h-9 w-9 text-sm',
          large: 'h-10 w-10 text-base',
          'x-large': 'h-14 w-14 text-lg'
        }, 'mini'), className)"
      ><ng-container *ngIf="type === 'image'"
        ><img
          alt=""
          class="h-full w-full rounded-full object-cover"
          [attr.src]="src"
      /></ng-container>
      <ng-container *ngIf="type === 'icon'"
        ><svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          [class]="cn('shrink-0 text-foreground-subtle', cva(size, {
          mini: 'h-3 w-3',
          small: 'h-4 w-4',
          regular: 'h-4 w-4',
          large: 'h-5 w-5',
          'x-large': 'h-7 w-7'
        }, 'mini'))"
        >
          <circle cx="12" cy="8" r="3.5"></circle>
          <path
            d="M4.5 20a7.5 7.5 0 0 1 15 0"
            stroke-linecap="round"
          ></path></svg
      ></ng-container>
      <ng-container *ngIf="type === 'initials'"
        ><span
          aria-hidden="true"
          class="font-medium uppercase leading-none text-foreground-subtle"
          >{{initialsText}}</span
        ></ng-container
      >
      <ng-container *ngIf="showStatus"
        ><span
          aria-hidden="true"
          [class]="cn('absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background-default', cva(status, {
          offline: 'bg-background-interactive',
          busy: 'bg-destructive-default',
          away: 'bg-warning-default',
          online: 'bg-success-default'
        }, 'online'))"
        ></span></ng-container
    ></span>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{alt:[{type:i}],size:[{type:i}],className:[{type:i}],type:[{type:i}],src:[{type:i}],initialsText:[{type:i}],showStatus:[{type:i}],status:[{type:i}]});(typeof ngDevMode>"u"||ngDevMode)&&j(l,{className:"Avatar",filePath:"Avatar.ts",lineNumber:97});const c=class c{};t(c,"ɵfac",function(e){return new(e||c)}),t(c,"ɵmod",I({type:c})),t(c,"ɵinj",M({imports:[x]}));let g=c;(typeof ngDevMode>"u"||ngDevMode)&&N(g,[{type:A,args:[{declarations:[l],imports:[x],exports:[l]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&D(g,{declarations:[l],imports:[x],exports:[l]})})();export{g as AvatarModule,l as default};

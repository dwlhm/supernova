var N=Object.defineProperty;var k=(e,a,t)=>a in e?N(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t;var n=(e,a,t)=>k(e,typeof a!="symbol"?a+"":a,t);import{ɵ as S,a as T,b as M,c as z,j as h,d as _,p as x,u as b,an as y,v as C,t as i,e as g,s as I,I as o,C as A,f as j,N as D,g as P,i as d,z as v,r as p,m as f,q as O,o as B,ao as F,y as E,A as J}from"./core.vpEFnhB-.js";import{a as q,e as G,g as V,d as H}from"./theme.CMj9otVT.js";import{C as w,N as K,a as L}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const Q=[[["","icon",""],["","slot","icon"]]],R=["[icon],[slot=icon]"],U=()=>({mini:"h-6 w-6 text-xs",small:"h-8 w-8 text-xs",regular:"h-9 w-9 text-sm",large:"h-10 w-10 text-base","x-large":"h-14 w-14 text-xl"}),W=()=>({mini:"h-3 w-3",small:"h-4 w-4",regular:"h-4 w-4",large:"h-5 w-5","x-large":"h-7 w-7"}),X=()=>({offline:"bg-background-interactive",busy:"bg-destructive-default",away:"bg-warning-default",online:"bg-success-default"});function Y(e,a){if(e&1&&(d(0),v(1,"img",2),p()),e&2){const t=f();i(),C("src",t.src)}}function Z(e,a){e&1&&J(0)}function $(e,a){if(e&1&&(d(0),_(1,Z,1,0,"ng-container",3),p()),e&2){const t=f(2);i(),g("ngComponentOutlet",t.icon)}}function tt(e,a){if(e&1&&(d(0),E(),h(1,"svg",4),v(2,"circle",5)(3,"path",6),x(),p()),e&2){const t=f(2);i(),b(t.cn("shrink-0 text-foreground-subtle",t.cva(t.size,y(2,W),"mini")))}}function et(e,a){if(e&1&&(d(0),_(1,$,2,1,"ng-container",1),O(2),_(3,tt,4,3,"ng-container",1),p()),e&2){const t=f();i(),g("ngIf",t.icon),i(2),g("ngIf",!t.icon)}}function nt(e,a){if(e&1&&(d(0),h(1,"span",7),B(2),x(),p()),e&2){const t=f();i(2),F(t.initialsText)}}function at(e,a){if(e&1&&(d(0),v(1,"span",8),p()),e&2){const t=f();i(),b(t.cn("absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background-default",t.cva(t.status,y(2,X),"online")))}}const r={size:"mini",type:"image",showStatus:!0,initialsText:"AB",src:"",alt:"",status:"online",className:""},u=class u{constructor(){n(this,"alt",r.alt);n(this,"cn",q);n(this,"cva",G);n(this,"getAvatarState",V);n(this,"bindControllerProps",H);n(this,"size",r.size);n(this,"className",r.className);n(this,"type",r.type);n(this,"src",r.src);n(this,"icon");n(this,"initialsText",r.initialsText);n(this,"showStatus",r.showStatus);n(this,"status",r.status)}get props(){return this}};n(u,"ɵfac",function(t){return new(t||u)}),n(u,"ɵcmp",S({type:u,selectors:[["kd-avatar"],["avatar"]],inputs:{alt:"alt",size:"size",className:"className",type:"type",src:"src",icon:"icon",initialsText:"initialsText",showStatus:"showStatus",status:"status"},standalone:!1,ngContentSelectors:R,decls:5,vars:9,consts:[["role","img"],[4,"ngIf"],["alt","",1,"h-full","w-full","rounded-full","object-cover"],[4,"ngComponentOutlet"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["cx","12","cy","8","r","3.5"],["d","M4.5 20a7.5 7.5 0 0 1 15 0","stroke-linecap","round"],["aria-hidden","true",1,"text-center","font-semibold","uppercase","leading-none","text-foreground-subtle"],["aria-hidden","true"]],template:function(t,s){t&1&&(z(Q),h(0,"span",0),_(1,Y,2,1,"ng-container",1)(2,et,4,2,"ng-container",1)(3,nt,3,1,"ng-container",1)(4,at,2,3,"ng-container",1),x()),t&2&&(b(s.cn("relative inline-flex shrink-0 items-center justify-center rounded-full bg-background-muted",s.cva(s.size,y(8,U),"mini"),s.className)),C("data-ctrl",typeof s.bindControllerProps)("aria-label",s.getAvatarState(s.props).accessibleName),i(),g("ngIf",s.type==="image"),i(),g("ngIf",s.type==="icon"),i(),g("ngIf",s.type==="initials"),i(),g("ngIf",s.showStatus))},dependencies:[K,L],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let c=u;(typeof ngDevMode>"u"||ngDevMode)&&I(c,[{type:A,args:[{standalone:!1,selector:"kd-avatar, avatar",template:`
    <span
      role="img"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-label]="getAvatarState(props).accessibleName"
      [class]="cn('relative inline-flex shrink-0 items-center justify-center rounded-full bg-background-muted', cva(size, {
          mini: 'h-6 w-6 text-xs',
          small: 'h-8 w-8 text-xs',
          regular: 'h-9 w-9 text-sm',
          large: 'h-10 w-10 text-base',
          'x-large': 'h-14 w-14 text-xl'
        }, 'mini'), className)"
      ><ng-container *ngIf="type === 'image'"
        ><img
          alt=""
          class="h-full w-full rounded-full object-cover"
          [attr.src]="src"
      /></ng-container>
      <ng-container *ngIf="type === 'icon'"
        ><ng-container *ngIf="icon"><ng-container *ngComponentOutlet="icon"></ng-container></ng-container><ng-content select="[icon],[slot=icon]"></ng-content>
        <ng-container *ngIf="!icon"
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
            ></path></svg></ng-container
      ></ng-container>
      <ng-container *ngIf="type === 'initials'"
        ><span
          aria-hidden="true"
          class="text-center font-semibold uppercase leading-none text-foreground-subtle"
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
    `]}]}],null,{alt:[{type:o}],size:[{type:o}],className:[{type:o}],type:[{type:o}],src:[{type:o}],icon:[{type:o}],initialsText:[{type:o}],showStatus:[{type:o}],status:[{type:o}]});(typeof ngDevMode>"u"||ngDevMode)&&j(c,{className:"Avatar",filePath:"Avatar.ts",lineNumber:100});const l=class l{};n(l,"ɵfac",function(t){return new(t||l)}),n(l,"ɵmod",T({type:l})),n(l,"ɵinj",M({imports:[w]}));let m=l;(typeof ngDevMode>"u"||ngDevMode)&&I(m,[{type:D,args:[{declarations:[c],imports:[w],exports:[c]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&P(m,{declarations:[c],imports:[w],exports:[c]})})();export{m as AvatarModule,c as default};

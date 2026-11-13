var C=Object.defineProperty;var N=(t,n,e)=>n in t?C(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e;var s=(t,n,e)=>N(t,typeof n!="symbol"?n+"":n,e);import{E as j,ɵ as M,a as S,b as O,c as P,j as r,y as x,z as _,p as i,aq as H,q as R,d as w,k as A,o as y,u as T,t as o,v as m,e as p,x as B,s as I,O as D,I as c,C as E,f as F,N as U,g as q,i as v,r as h,m as b,ao as J}from"./core.vpEFnhB-.js";import{a as z,I as G}from"./theme.CMj9otVT.js";import{C as k,a as L}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const V=["*"];function K(t,n){if(t&1&&(v(0),r(1,"span"),y(2),i(),h()),t&2){const e=b();o(),T(e.cn("shrink-0 text-xs font-normal",e.status==="error"?"text-destructive-default":"text-foreground-muted")),o(),J(e.statusText)}}function Q(t,n){if(t&1&&(v(0),x(),r(1,"svg",8),_(2,"path",1),i(),h()),t&2){const e=b();o(2),m("d",e.ICON_PATHS.check)}}function W(t,n){t&1&&(v(0),x(),r(1,"svg",9),_(2,"path",10),i(),h())}function X(t,n){if(t&1&&(v(0),x(),r(1,"svg",11),_(2,"path",1),i(),h()),t&2){const e=b();o(2),m("d",e.ICON_PATHS.close)}}const f={statusText:"",status:"completed",removeText:"Remove",disabled:!1,className:""},u=class u{constructor(){s(this,"cn",z);s(this,"ICON_PATHS",G);s(this,"className",f.className);s(this,"statusText",f.statusText);s(this,"status",f.status);s(this,"disabled",f.disabled);s(this,"removeText",f.removeText);s(this,"onRemove",new j)}};s(u,"ɵfac",function(e){return new(e||u)}),s(u,"ɵcmp",M({type:u,selectors:[["kd-input-multiple-file-upload-item"],["input-multiple-file-upload-item"]],inputs:{className:"className",statusText:"statusText",status:"status",disabled:"disabled",removeText:"removeText"},outputs:{onRemove:"onRemove"},standalone:!1,ngContentSelectors:V,decls:14,vars:9,consts:[["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-6","w-6","shrink-0","text-foreground-muted"],["stroke-linecap","round","stroke-linejoin","round"],[1,"flex","min-w-0","flex-1","flex-col","items-start","justify-start","gap-2"],[1,"flex","w-full","flex-row","items-start","justify-between","gap-2"],[1,"truncate","text-sm","font-medium","text-foreground-default"],[4,"ngIf"],[1,"flex","h-6","w-6","shrink-0","flex-row","items-center","justify-center"],["type","button",1,"inline-flex","shrink-0","flex-row","items-center","justify-center","gap-1.5","rounded-lg","px-2","py-0.5","text-center","text-sm","font-medium","text-foreground-muted","hover:bg-background-subtle","hover:text-foreground-default","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary","disabled:pointer-events-none","disabled:opacity-50",3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2",1,"h-6","w-6","text-success-default"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2",1,"h-6","w-6","animate-spin","text-primary-default"],["d","M21 12a9 9 0 1 1-6.219-8.56","stroke-linecap","round"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2",1,"h-6","w-6","text-destructive-default"]],template:function(e,a){e&1&&(P(),r(0,"li"),x(),r(1,"svg",0),_(2,"path",1),i(),H(),r(3,"div",2)(4,"div",3)(5,"span",4),R(6),i(),w(7,K,3,3,"ng-container",5),i()(),r(8,"span",6),w(9,Q,3,1,"ng-container",5)(10,W,3,0,"ng-container",5)(11,X,3,1,"ng-container",5),i(),r(12,"button",7),A("click",function(){return!a.disabled&&a.onRemove&&a.onRemove.emit()}),y(13),i()()),e&2&&(T(a.cn("flex w-full flex-row items-center justify-start gap-2 rounded-lg border border-border-default bg-background-default px-3 py-3",a.className)),o(2),m("d",a.ICON_PATHS.file),o(5),p("ngIf",a.statusText!==""),o(2),p("ngIf",a.status==="completed"),o(),p("ngIf",a.status==="uploading"),o(),p("ngIf",a.status==="error"),o(),m("disabled",a.disabled?"":null),o(),B(" ",a.removeText," "))},dependencies:[L],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let l=u;(typeof ngDevMode>"u"||ngDevMode)&&I(l,[{type:E,args:[{standalone:!1,selector:"kd-input-multiple-file-upload-item, input-multiple-file-upload-item",template:`
    <li
      [class]="cn('flex w-full flex-row items-center justify-start gap-2 rounded-lg border border-border-default bg-background-default px-3 py-3', className)"
    >
      <svg
        aria-hidden="true"
        class="h-6 w-6 shrink-0 text-foreground-muted"
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
      <div class="flex min-w-0 flex-1 flex-col items-start justify-start gap-2">
        <div class="flex w-full flex-row items-start justify-between gap-2">
          <span class="truncate text-sm font-medium text-foreground-default"
            ><ng-content></ng-content
          ></span>
          <ng-container *ngIf="statusText !== ''"
            ><span
              [class]="cn('shrink-0 text-xs font-normal', status === 'error' ? 'text-destructive-default' : 'text-foreground-muted')"
              >{{statusText}}</span
            ></ng-container
          >
        </div>
      </div>
      <span class="flex h-6 w-6 shrink-0 flex-row items-center justify-center"
        ><ng-container *ngIf="status === 'completed'"
          ><svg
            aria-hidden="true"
            class="h-6 w-6 text-success-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="ICON_PATHS.check"
            ></path></svg
        ></ng-container>
        <ng-container *ngIf="status === 'uploading'"
          ><svg
            aria-hidden="true"
            class="h-6 w-6 animate-spin text-primary-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21 12a9 9 0 1 1-6.219-8.56"
              stroke-linecap="round"
            ></path></svg
        ></ng-container>
        <ng-container *ngIf="status === 'error'"
          ><svg
            aria-hidden="true"
            class="h-6 w-6 text-destructive-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="ICON_PATHS.close"
            ></path></svg></ng-container
      ></span>
      <button
        type="button"
        class="inline-flex shrink-0 flex-row items-center justify-center gap-1.5 rounded-lg px-2 py-0.5 text-center text-sm font-medium text-foreground-muted hover:bg-background-subtle hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50"
        [attr.disabled]="(disabled) ? '' : null"
        (click)="!disabled && onRemove && this.onRemove.emit()"
      >
        {{removeText}}
      </button>
    </li>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:c}],statusText:[{type:c}],status:[{type:c}],disabled:[{type:c}],removeText:[{type:c}],onRemove:[{type:D}]});(typeof ngDevMode>"u"||ngDevMode)&&F(l,{className:"InputMultipleFileUploadItem",filePath:"InputMultipleFileUploadItem.ts",lineNumber:120});const d=class d{};s(d,"ɵfac",function(e){return new(e||d)}),s(d,"ɵmod",S({type:d})),s(d,"ɵinj",O({imports:[k]}));let g=d;(typeof ngDevMode>"u"||ngDevMode)&&I(g,[{type:U,args:[{declarations:[l],imports:[k],exports:[l]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&q(g,{declarations:[l],imports:[k],exports:[l]})})();export{g as InputMultipleFileUploadItemModule,l as default};

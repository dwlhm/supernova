var y=Object.defineProperty;var F=(o,n,t)=>n in o?y(o,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[n]=t;var l=(o,n,t)=>F(o,typeof n!="symbol"?n+"":n,t);import{ɵ as U,a as T,b as A,j as p,d as x,k as g,p as c,t as i,e as s,s as C,C as N,f as S,N as D,g as B,h as v,i as m,l as b,m as w,n as I,o as f,r as _}from"./core.vpEFnhB-.js";import j,{InputMultipleFileUploadModule as M}from"./InputMultipleFileUpload.CFC3cE4o.js";import O,{InputMultipleFileUploadItemModule as k}from"./InputMultipleFileUploadItem.860PVq91.js";import{C as E,a as V}from"./common_module-chunk.B8w5oXjf.js";import"./theme.CMj9otVT.js";import"./framework.CbUgrr79.js";function q(o,n){if(o&1){const t=v();m(0),p(1,"button",3),g("click",function(){b(t);const r=w();return r.showInvoice=!0,r.showCatalog=!0,I(r.showArchive=!0)}),f(2," Restore All Files "),c(),_()}}function z(o,n){o&1&&(m(0),f(1,"Clear Error State"),_())}function J(o,n){o&1&&(m(0),f(1,"Simulate Error State"),_())}function P(o,n){if(o&1){const t=v();m(0),p(1,"kd-input-multiple-file-upload-item",5),g("remove",function(){b(t);const r=w();return I(r.showInvoice=!1)}),f(2," invoice-q3.pdf "),c(),_()}}function R(o,n){if(o&1){const t=v();m(0),p(1,"kd-input-multiple-file-upload-item",6),g("remove",function(){b(t);const r=w();return I(r.showCatalog=!1)}),f(2," product-catalog.zip "),c(),_()}}function G(o,n){if(o&1){const t=v();m(0),p(1,"kd-input-multiple-file-upload-item",7),g("remove",function(){b(t);const r=w();return I(r.showArchive=!1)}),f(2," raw-footage-4k.mov "),c(),_()}}const d=class d{constructor(){l(this,"Number",Number);l(this,"hasError",!1);l(this,"showInvoice",!0);l(this,"showCatalog",!0);l(this,"showArchive",!0)}};l(d,"ɵfac",function(t){return new(t||d)}),l(d,"ɵcmp",U({type:d,selectors:[["kd-input-multiple-file-upload-example"],["input-multiple-file-upload-example"]],standalone:!1,decls:10,vars:10,consts:[[1,"flex","w-full","flex-col","gap-3"],[1,"flex","items-center","justify-end","gap-1.5"],[4,"ngIf"],["type","button",1,"rounded-md","border","border-border-default","bg-background-default","px-2.5","py-1","text-xs","font-medium","text-foreground-default","hover:bg-background-muted",3,"click"],["label","Attachments","hint","Up to 5 files, 10 MB each.",3,"fileCount","state","error","errorMessage"],["status","completed","statusText","Uploaded • 2.4 MB",3,"remove"],["status","uploading","statusText","Uploading 64%...",3,"remove"],["status","error","statusText","File exceeds 10 MB limit",3,"remove"]],template:function(t,e){t&1&&(p(0,"div",0)(1,"div",1),x(2,q,3,0,"ng-container",2),p(3,"button",3),g("click",function(){return e.hasError=!e.hasError}),x(4,z,2,0,"ng-container",2)(5,J,2,0,"ng-container",2),c()(),p(6,"kd-input-multiple-file-upload",4),x(7,P,3,0,"ng-container",2)(8,R,3,0,"ng-container",2)(9,G,3,0,"ng-container",2),c()()),t&2&&(i(2),s("ngIf",!e.showInvoice||!e.showCatalog||!e.showArchive),i(2),s("ngIf",e.hasError),i(),s("ngIf",!e.hasError),i(),s("fileCount",e.Number(e.showInvoice)+e.Number(e.showCatalog)+e.Number(e.showArchive)+" of 5")("state",e.hasError?"error":"filled")("error",e.hasError)("errorMessage",e.hasError?"One or more files failed verification.":""),i(),s("ngIf",e.showInvoice),i(),s("ngIf",e.showCatalog),i(),s("ngIf",e.showArchive))},dependencies:[V,j,O],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=d;(typeof ngDevMode>"u"||ngDevMode)&&C(a,[{type:N,args:[{standalone:!1,selector:"kd-input-multiple-file-upload-example, input-multiple-file-upload-example",template:`
    <div class="flex w-full flex-col gap-3">
      <div class="flex items-center justify-end gap-1.5">
        <ng-container *ngIf="!showInvoice || !showCatalog || !showArchive"
          ><button
            type="button"
            class="rounded-md border border-border-default bg-background-default px-2.5 py-1 text-xs font-medium text-foreground-default hover:bg-background-muted"
            (click)="
          showInvoice = true;
          showCatalog = true;
          showArchive = true;
        "
          >
            Restore All Files
          </button></ng-container
        >
        <button
          type="button"
          class="rounded-md border border-border-default bg-background-default px-2.5 py-1 text-xs font-medium text-foreground-default hover:bg-background-muted"
          (click)="
          hasError = !hasError;
        "
        >
          <ng-container *ngIf="hasError">Clear Error State</ng-container
          ><ng-container *ngIf="!(hasError)">Simulate Error State</ng-container>
        </button>
      </div>
      <kd-input-multiple-file-upload
        label="Attachments"
        hint="Up to 5 files, 10 MB each."
        [fileCount]="Number(showInvoice) + Number(showCatalog) + Number(showArchive) + ' of 5'"
        [state]="hasError ? 'error' : 'filled'"
        [error]="hasError"
        [errorMessage]="hasError ? 'One or more files failed verification.' : ''"
        ><ng-container *ngIf="showInvoice"
          ><kd-input-multiple-file-upload-item
            status="completed"
            statusText="Uploaded • 2.4 MB"
            (remove)="
          showInvoice = false;
        "
          >
            invoice-q3.pdf
          </kd-input-multiple-file-upload-item></ng-container
        >
        <ng-container *ngIf="showCatalog"
          ><kd-input-multiple-file-upload-item
            status="uploading"
            statusText="Uploading 64%..."
            (remove)="
          showCatalog = false;
        "
          >
            product-catalog.zip
          </kd-input-multiple-file-upload-item></ng-container
        >
        <ng-container *ngIf="showArchive"
          ><kd-input-multiple-file-upload-item
            status="error"
            statusText="File exceeds 10 MB limit"
            (remove)="
          showArchive = false;
        "
          >
            raw-footage-4k.mov
          </kd-input-multiple-file-upload-item></ng-container
        ></kd-input-multiple-file-upload
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&S(a,{className:"InputMultipleFileUploadExample",filePath:"InputMultipleFileUploadExample.ts",lineNumber:89});const u=class u{};l(u,"ɵfac",function(t){return new(t||u)}),l(u,"ɵmod",T({type:u})),l(u,"ɵinj",A({imports:[E,M,k]}));let h=u;(typeof ngDevMode>"u"||ngDevMode)&&C(h,[{type:D,args:[{declarations:[a],imports:[E,M,k],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&B(h,{declarations:[a],imports:[E,M,k],exports:[a]})})();export{h as InputMultipleFileUploadExampleModule,a as default};

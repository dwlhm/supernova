var T=Object.defineProperty;var k=(a,s,t)=>s in a?T(a,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[s]=t;var n=(a,s,t)=>k(a,typeof s!="symbol"?s+"":s,t);import{ɵ as M,a as E,b as P,j as d,d as h,o as b,p as l,k as I,u as m,v as c,t as i,e as _,am as x,s as S,I as r,C as H,f as q,N as D,g as L,i as w,r as v,m as y,x as j,h as O,l as A,n as V,y as G,z as J}from"./core.BqS-lykr.js";import{a as B,l as R,m as $,n as z,I as K,b as Q}from"./utils.BBpd638g.js";import{C,N as U}from"./common_module-chunk.DvGwmKFp.js";function W(a,s){a&1&&(w(0),d(1,"span",4),b(2,"*"),l(),v())}function X(a,s){if(a&1&&(w(0),d(1,"label",3),b(2),h(3,W,3,0,"ng-container",0),l(),v()),a&2){const t=y();i(),c("for",t.id),i(),j("",t.label," "),i(),_("ngIf",t.required)}}function Y(a,s){if(a&1){const t=O();w(0),d(1,"button",5),I("click",function(N){A(t);const f=y();return V(!f.disabled&&f.clearFileInputEvent(N,f.onFileNameChange,f.onFilesChange))}),G(),d(2,"svg",6),J(3,"path",7),l()(),v()}if(a&2){const t=y();i(),c("disabled",t.disabled?"":null),i(2),c("d",t.ICON_PATHS.close)}}function Z(a,s){if(a&1&&(w(0),d(1,"span"),b(2),l(),v()),a&2){const t=y();i(),m(t.cn("text-sm",t.getFileState(t.props).hasError?"text-destructive-foreground":"text-foreground-muted")),c("id",t.id+"-hint"),i(),x(t.getFileState(t.props).helpText)}}const o={id:"input-file",name:"file",label:"Picture",buttonText:"Choose File",fileName:"",hint:"Supported formats: PNG, JPG, or PDF.",errorMessage:"",accept:"image/png,image/jpeg,application/pdf",disabled:!1,required:!1,showLabel:!0,showHint:!0,className:""},g=class g{constructor(){n(this,"fileName",o.fileName);n(this,"hint",o.hint);n(this,"errorMessage",o.errorMessage);n(this,"cn",B);n(this,"getFileState",R);n(this,"handleFileSelectEvent",$);n(this,"clearFileInputEvent",z);n(this,"ICON_PATHS",K);n(this,"bindControllerProps",Q);n(this,"className",o.className);n(this,"showLabel",o.showLabel);n(this,"label",o.label);n(this,"id",o.id);n(this,"required",o.required);n(this,"disabled",o.disabled);n(this,"buttonText",o.buttonText);n(this,"name",o.name);n(this,"accept",o.accept);n(this,"showHint",o.showHint);n(this,"onFileNameChange");n(this,"onFilesChange")}get props(){return this}};n(g,"ɵfac",function(t){return new(t||g)}),n(g,"ɵcmp",M({type:g,selectors:[["spn-input-file-input"],["input-file-input"]],inputs:{fileName:"fileName",hint:"hint",errorMessage:"errorMessage",className:"className",showLabel:"showLabel",label:"label",id:"id",required:"required",disabled:"disabled",buttonText:"buttonText",name:"name",accept:"accept",showHint:"showHint",onFileNameChange:"onFileNameChange",onFilesChange:"onFilesChange"},standalone:!1,decls:11,vars:22,consts:[[4,"ngIf"],[1,"inline-flex","h-7","shrink-0","items-center","rounded-sm","bg-secondary-default","px-3","text-sm","font-medium","text-secondary-foreground"],["type","file",1,"sr-only",3,"change"],[1,"flex","items-center","gap-1","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],["type","button","aria-label","Remove file",1,"ml-auto","inline-flex","h-6","w-6","shrink-0","items-center","justify-center","rounded-full","text-foreground-default","hover:bg-background-muted","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary","disabled:pointer-events-none",3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2",1,"h-3.5","w-3.5"],["stroke-linecap","round"]],template:function(t,e){t&1&&(d(0,"div"),h(1,X,4,3,"ng-container",0),d(2,"div")(3,"label")(4,"span",1),b(5),l(),d(6,"span"),b(7),l(),d(8,"input",2),I("change",function(f){return!e.disabled&&e.handleFileSelectEvent(f,e.onFileNameChange,e.onFilesChange)}),l()(),h(9,Y,4,2,"ng-container",0),l(),h(10,Z,3,4,"ng-container",0),l()),t&2&&(m(e.cn("flex w-full flex-col gap-3",e.className)),c("data-ctrl",typeof e.bindControllerProps),i(),_("ngIf",e.showLabel&&e.label!==""),i(),m(e.cn("flex items-center gap-3 rounded-lg border bg-background-default px-3 py-1 shadow-xs transition-colors",e.getFileState(e.props).hasError?"border-destructive-border focus-within:ring-2 focus-within:ring-focus-ring-error":"border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary",e.disabled&&"cursor-not-allowed opacity-50")),i(),m(e.cn("flex min-w-0 flex-1 items-center gap-3",e.disabled?"cursor-not-allowed":"cursor-pointer")),c("for",e.id),i(2),x(e.buttonText),i(),m(e.cn("truncate py-1 text-sm",e.getFileState(e.props).hasFile?"text-foreground-default":"text-foreground-subtle")),i(),x(e.getFileState(e.props).displayName),i(),c("id",e.id)("name",e.name)("accept",e.accept)("disabled",e.disabled?"":null)("required",e.required?"":null)("aria-invalid",e.getFileState(e.props).hasError)("aria-describedby",e.showHint?e.id+"-hint":void 0),i(),_("ngIf",e.getFileState(e.props).hasFile),i(),_("ngIf",e.showHint))},dependencies:[U],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let u=g;(typeof ngDevMode>"u"||ngDevMode)&&S(u,[{type:H,args:[{standalone:!1,selector:"spn-input-file-input, input-file-input",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-3', className)"
    >
      <ng-container *ngIf="showLabel && label !== ''"
        ><label
          class="flex items-center gap-1 text-sm font-medium text-foreground-default"
          [attr.for]="id"
          >{{label}}
          <ng-container *ngIf="required"
            ><span aria-hidden="true" class="text-destructive-default"
              >*</span
            ></ng-container
          ></label
        ></ng-container
      >
      <div
        [class]="cn('flex items-center gap-3 rounded-lg border bg-background-default px-3 py-1 shadow-xs transition-colors', getFileState(props).hasError ? 'border-destructive-border focus-within:ring-2 focus-within:ring-focus-ring-error' : 'border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary', disabled && 'cursor-not-allowed opacity-50')"
      >
        <label
          [attr.for]="id"
          [class]="cn('flex min-w-0 flex-1 items-center gap-3', disabled ? 'cursor-not-allowed' : 'cursor-pointer')"
          ><span
            class="inline-flex h-7 shrink-0 items-center rounded-sm bg-secondary-default px-3 text-sm font-medium text-secondary-foreground"
            >{{buttonText}}</span
          >
          <span
            [class]="cn('truncate py-1 text-sm', getFileState(props).hasFile ? 'text-foreground-default' : 'text-foreground-subtle')"
            >{{getFileState(props).displayName}}</span
          >
          <input
            type="file"
            class="sr-only"
            [attr.id]="id"
            [attr.name]="name"
            [attr.accept]="accept"
            [attr.disabled]="(disabled) ? '' : null"
            [attr.required]="(required) ? '' : null"
            [attr.aria-invalid]="getFileState(props).hasError"
            [attr.aria-describedby]="showHint ? id + '-hint' : undefined"
            (change)="!disabled && handleFileSelectEvent($event, onFileNameChange, onFilesChange)"
        /></label>
        <ng-container *ngIf="getFileState(props).hasFile"
          ><button
            type="button"
            aria-label="Remove file"
            class="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none"
            [attr.disabled]="(disabled) ? '' : null"
            (click)="!disabled && clearFileInputEvent($event, onFileNameChange, onFilesChange)"
          >
            <svg
              aria-hidden="true"
              class="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" [attr.d]="ICON_PATHS.close"></path>
            </svg></button
        ></ng-container>
      </div>
      <ng-container *ngIf="showHint"
        ><span
          [attr.id]="id + '-hint'"
          [class]="cn('text-sm', getFileState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
          >{{getFileState(props).helpText}}</span
        ></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{fileName:[{type:r}],hint:[{type:r}],errorMessage:[{type:r}],className:[{type:r}],showLabel:[{type:r}],label:[{type:r}],id:[{type:r}],required:[{type:r}],disabled:[{type:r}],buttonText:[{type:r}],name:[{type:r}],accept:[{type:r}],showHint:[{type:r}],onFileNameChange:[{type:r}],onFilesChange:[{type:r}]});(typeof ngDevMode>"u"||ngDevMode)&&q(u,{className:"InputFileInput",filePath:"InputFileInput.ts",lineNumber:130});const p=class p{};n(p,"ɵfac",function(t){return new(t||p)}),n(p,"ɵmod",E({type:p})),n(p,"ɵinj",P({imports:[C]}));let F=p;(typeof ngDevMode>"u"||ngDevMode)&&S(F,[{type:D,args:[{declarations:[u],imports:[C],exports:[u]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&L(F,{declarations:[u],imports:[C],exports:[u]})})();export{F as InputFileInputModule,u as default};

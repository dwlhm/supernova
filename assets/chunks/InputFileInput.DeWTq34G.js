var T=Object.defineProperty;var E=(i,o,n)=>o in i?T(i,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[o]=n;var t=(i,o,n)=>E(i,typeof o!="symbol"?o+"":o,n);import{E as k,ɵ as M,a as H,b as q,j as p,d as b,o as h,p as d,k as S,u as m,v as g,t as l,e as _,ao as x,s as I,O as P,I as a,C as B,f as V,N as L,g as R,i as F,r as w,m as v,x as D,h as O,l as j,n as A,y as $,z as J}from"./core.vpEFnhB-.js";import{a as z,v as G,x as K,w as Q,I as U,d as W}from"./theme.CMj9otVT.js";import{C as N,a as X}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";function Y(i,o){i&1&&(F(0),p(1,"span",4),h(2,"*"),d(),w())}function Z(i,o){if(i&1&&(F(0),p(1,"label",3),h(2),b(3,Y,3,0,"ng-container",0),d(),w()),i&2){const n=v();l(),g("for",n.id),l(),D("",n.label," "),l(),_("ngIf",n.required)}}function ee(i,o){if(i&1){const n=O();F(0),p(1,"button",5),S("click",function(C){j(n);const s=v();return A(!s.disabled&&s.clearFileInputEvent(C,s.onFileNameChange,s.onFilesChange,s.onRemove,void 0,s.onValueChange))}),$(),p(2,"svg",6),J(3,"path",7),d()(),w()}if(i&2){const n=v();l(),g("disabled",n.disabled?"":null),l(2),g("d",n.ICON_PATHS.close)}}function te(i,o){if(i&1&&(F(0),p(1,"span"),h(2),d(),w()),i&2){const n=v();l(),m(n.cn("text-sm",n.getFileState(n.props).hasError?"text-destructive-foreground":"text-foreground-muted")),g("id",n.id+"-hint"),l(),x(n.getFileState(n.props).helpText)}}const r={id:"input-file",name:"file",label:"",buttonText:"Choose File",placeholder:"No file chosen",value:"",fileName:"",hint:"",error:!1,errorMessage:"",validating:!1,accept:"image/png,image/jpeg,application/pdf",disabled:!1,required:!1,showLabel:!0,showHint:!0,className:""},f=class f{constructor(){t(this,"placeholder",r.placeholder);t(this,"value",r.value);t(this,"fileName",r.fileName);t(this,"hint",r.hint);t(this,"error",r.error);t(this,"errorMessage",r.errorMessage);t(this,"validating",r.validating);t(this,"cn",z);t(this,"getFileState",G);t(this,"handleFileSelectEvent",K);t(this,"clearFileInputEvent",Q);t(this,"ICON_PATHS",U);t(this,"bindControllerProps",W);t(this,"className",r.className);t(this,"showLabel",r.showLabel);t(this,"label",r.label);t(this,"id",r.id);t(this,"required",r.required);t(this,"disabled",r.disabled);t(this,"buttonText",r.buttonText);t(this,"name",r.name);t(this,"accept",r.accept);t(this,"showHint",r.showHint);t(this,"onFileNameChange");t(this,"onFilesChange");t(this,"onRemove");t(this,"onValueChange");t(this,"onBlur",new k)}get props(){return this}};t(f,"ɵfac",function(n){return new(n||f)}),t(f,"ɵcmp",M({type:f,selectors:[["kd-input-file-input"],["input-file-input"]],inputs:{placeholder:"placeholder",value:"value",fileName:"fileName",hint:"hint",error:"error",errorMessage:"errorMessage",validating:"validating",className:"className",showLabel:"showLabel",label:"label",id:"id",required:"required",disabled:"disabled",buttonText:"buttonText",name:"name",accept:"accept",showHint:"showHint",onFileNameChange:"onFileNameChange",onFilesChange:"onFilesChange",onRemove:"onRemove",onValueChange:"onValueChange"},outputs:{onBlur:"onBlur"},standalone:!1,decls:11,vars:22,consts:[[4,"ngIf"],[1,"inline-flex","h-7","shrink-0","items-center","rounded-sm","bg-secondary-default","px-3","text-sm","font-medium","text-secondary-foreground"],["type","file",1,"sr-only",3,"change","blur"],[1,"flex","items-center","gap-1","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],["type","button","aria-label","Remove file",1,"ml-auto","inline-flex","h-6","w-6","shrink-0","items-center","justify-center","rounded-full","text-foreground-default","hover:bg-background-muted","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary","disabled:pointer-events-none",3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2",1,"h-3.5","w-3.5"],["stroke-linecap","round"]],template:function(n,e){n&1&&(p(0,"div"),b(1,Z,4,3,"ng-container",0),p(2,"div")(3,"label")(4,"span",1),h(5),d(),p(6,"span"),h(7),d(),p(8,"input",2),S("change",function(s){return!e.disabled&&e.handleFileSelectEvent(s,e.onFileNameChange,e.onFilesChange)})("blur",function(s){return!e.disabled&&e.onBlur&&e.onBlur.emit(s)}),d()(),b(9,ee,4,2,"ng-container",0),d(),b(10,te,3,4,"ng-container",0),d()),n&2&&(m(e.cn("flex w-full flex-col gap-3",e.className)),g("data-ctrl",typeof e.bindControllerProps),l(),_("ngIf",e.showLabel&&e.label!==""),l(),m(e.cn("flex items-center gap-3 rounded-lg border bg-background-default px-3 py-1 shadow-xs transition-colors",e.getFileState(e.props).hasError?"border-destructive-border ring-2 ring-focus-ring-error":"border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary",e.disabled&&"cursor-not-allowed opacity-50")),l(),m(e.cn("flex min-w-0 flex-1 items-center gap-3",e.disabled?"cursor-not-allowed":"cursor-pointer")),g("for",e.id),l(2),x(e.buttonText),l(),m(e.cn("truncate py-1 text-sm",e.getFileState(e.props).hasFile?"text-foreground-default":"text-foreground-subtle")),l(),x(e.getFileState(e.props).displayName),l(),g("id",e.id)("name",e.name)("accept",e.accept)("disabled",e.disabled?"":null)("required",e.required?"":null)("aria-invalid",e.getFileState(e.props).hasError)("aria-describedby",(e.showHint||e.getFileState(e.props).hasError)&&e.getFileState(e.props).helpText!==""?e.id+"-hint":void 0),l(),_("ngIf",e.getFileState(e.props).hasFile),l(),_("ngIf",(e.showHint||e.getFileState(e.props).hasError)&&e.getFileState(e.props).helpText!==""))},dependencies:[X],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let u=f;(typeof ngDevMode>"u"||ngDevMode)&&I(u,[{type:B,args:[{standalone:!1,selector:"kd-input-file-input, input-file-input",template:`
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
        [class]="cn('flex items-center gap-3 rounded-lg border bg-background-default px-3 py-1 shadow-xs transition-colors', getFileState(props).hasError ? 'border-destructive-border ring-2 ring-focus-ring-error' : 'border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary', disabled && 'cursor-not-allowed opacity-50')"
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
            [attr.aria-describedby]="(showHint || getFileState(props).hasError) && getFileState(props).helpText !== '' ? id + '-hint' : undefined"
            (change)="!disabled && handleFileSelectEvent($event, onFileNameChange, onFilesChange)"
            (blur)="!disabled && onBlur && this.onBlur.emit($event)"
        /></label>
        <ng-container *ngIf="getFileState(props).hasFile"
          ><button
            type="button"
            aria-label="Remove file"
            class="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none"
            [attr.disabled]="(disabled) ? '' : null"
            (click)="!disabled && clearFileInputEvent($event, onFileNameChange, onFilesChange, onRemove, undefined, onValueChange)"
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
      <ng-container
        *ngIf="(showHint || getFileState(props).hasError) && getFileState(props).helpText !== ''"
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
    `]}]}],null,{placeholder:[{type:a}],value:[{type:a}],fileName:[{type:a}],hint:[{type:a}],error:[{type:a}],errorMessage:[{type:a}],validating:[{type:a}],className:[{type:a}],showLabel:[{type:a}],label:[{type:a}],id:[{type:a}],required:[{type:a}],disabled:[{type:a}],buttonText:[{type:a}],name:[{type:a}],accept:[{type:a}],showHint:[{type:a}],onFileNameChange:[{type:a}],onFilesChange:[{type:a}],onRemove:[{type:a}],onValueChange:[{type:a}],onBlur:[{type:P}]});(typeof ngDevMode>"u"||ngDevMode)&&V(u,{className:"InputFileInput",filePath:"InputFileInput.ts",lineNumber:143});const c=class c{};t(c,"ɵfac",function(n){return new(n||c)}),t(c,"ɵmod",H({type:c})),t(c,"ɵinj",q({imports:[N]}));let y=c;(typeof ngDevMode>"u"||ngDevMode)&&I(y,[{type:L,args:[{declarations:[u],imports:[N],exports:[u]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&R(y,{declarations:[u],imports:[N],exports:[u]})})();export{y as InputFileInputModule,u as default};

var T=Object.defineProperty;var j=(s,i,n)=>i in s?T(s,i,{enumerable:!0,configurable:!0,writable:!0,value:n}):s[i]=n;var t=(s,i,n)=>j(s,typeof i!="symbol"?i+"":i,n);import{E,ɵ as I,a as N,b as q,c as H,j as d,d as _,o as g,p as o,k as B,i as b,q as D,r as h,u as y,v as c,t as l,e as w,ao as m,s as S,O as L,I as a,C as k,f as P,N as U,g as V,m as F}from"./core.vpEFnhB-.js";import{a as O,v as J,x as $,d as z}from"./theme.CecfD-Na.js";import{C,a as A}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const G=["*"];function K(s,i){s&1&&(b(0),d(1,"span",6),g(2,"*"),o(),h())}function Q(s,i){if(s&1&&(b(0),d(1,"span",7),g(2),o(),h()),s&2){const n=F(2);l(2),m(n.getFileState(n.props).resolvedFileCount)}}function R(s,i){if(s&1&&(b(0),d(1,"div",4)(2,"label",5)(3,"span"),g(4),o(),_(5,K,3,0,"ng-container",0),o(),_(6,Q,3,1,"ng-container",0),o(),h()),s&2){const n=F();l(2),c("for",n.id),l(2),m(n.label),l(),w("ngIf",n.required),l(),w("ngIf",n.getFileState(n.props).resolvedFileCount!=="")}}function W(s,i){if(s&1&&(b(0),d(1,"div",8)(2,"span"),g(3),o()(),h()),s&2){const n=F();l(2),y(n.cn("text-sm font-normal",n.getFileState(n.props).hasError?"text-destructive-foreground":"text-foreground-muted")),c("id",n.id+"-hint"),l(),m(n.getFileState(n.props).helpText)}}const r={id:"multiple-file-upload",name:"files",value:"",label:"",instruction:"Choose one or more files",browseText:"Browse",fileCount:"",hint:"",error:!1,errorMessage:"",validating:!1,accept:"image/png,image/jpeg,application/pdf,application/zip",state:"default",disabled:!1,required:!0,showLabel:!0,showHint:!0,className:""},f=class f{constructor(){t(this,"value",r.value);t(this,"fileCount",r.fileCount);t(this,"hint",r.hint);t(this,"error",r.error);t(this,"errorMessage",r.errorMessage);t(this,"validating",r.validating);t(this,"onValueChange");t(this,"cn",O);t(this,"getFileState",J);t(this,"handleFileSelectEvent",$);t(this,"bindControllerProps",z);t(this,"className",r.className);t(this,"showLabel",r.showLabel);t(this,"label",r.label);t(this,"id",r.id);t(this,"required",r.required);t(this,"state",r.state);t(this,"disabled",r.disabled);t(this,"instruction",r.instruction);t(this,"browseText",r.browseText);t(this,"name",r.name);t(this,"accept",r.accept);t(this,"showHint",r.showHint);t(this,"onFilesChange");t(this,"onBlur",new E)}get props(){return this}};t(f,"ɵfac",function(n){return new(n||f)}),t(f,"ɵcmp",I({type:f,selectors:[["kd-input-multiple-file-upload"],["input-multiple-file-upload"]],inputs:{value:"value",fileCount:"fileCount",hint:"hint",error:"error",errorMessage:"errorMessage",validating:"validating",onValueChange:"onValueChange",className:"className",showLabel:"showLabel",label:"label",id:"id",required:"required",state:"state",disabled:"disabled",instruction:"instruction",browseText:"browseText",name:"name",accept:"accept",showHint:"showHint",onFilesChange:"onFilesChange"},outputs:{onBlur:"onBlur"},standalone:!1,ngContentSelectors:G,decls:12,vars:20,consts:[[4,"ngIf"],[1,"inline-flex","h-8","shrink-0","flex-row","items-center","justify-center","gap-1.5","rounded-lg","bg-secondary-default","px-3","py-1","text-center","text-sm","font-medium","text-secondary-foreground","hover:bg-secondary-hover"],["type","file",1,"sr-only",3,"change","blur"],[1,"flex","w-full","flex-col","items-start","justify-start","gap-2"],[1,"flex","w-full","flex-row","items-start","justify-between","gap-3"],[1,"flex","flex-row","items-start","justify-start","gap-1","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-sm","font-medium","text-destructive-default"],[1,"text-sm","font-normal","text-foreground-muted"],[1,"flex","flex-col","items-start","justify-start"]],template:function(n,e){n&1&&(H(),d(0,"div"),_(1,R,7,4,"ng-container",0),d(2,"label")(3,"span"),g(4),o(),d(5,"span",1),g(6),o(),d(7,"input",2),B("change",function(x){return!(e.disabled||e.state==="disabled")&&e.handleFileSelectEvent(x,void 0,e.onFilesChange)})("blur",function(x){return!(e.disabled||e.state==="disabled")&&e.onBlur&&e.onBlur.emit(x)}),o()(),b(8),d(9,"ul",3),D(10),o(),h(),_(11,W,4,4,"ng-container",0),o()),n&2&&(y(e.cn("flex w-full flex-col items-start justify-start gap-3",e.className)),c("data-ctrl",typeof e.bindControllerProps),l(),w("ngIf",e.showLabel&&e.label!==""),l(),y(e.cn("flex h-[52px] w-full flex-row items-center justify-start gap-3 rounded-lg border bg-background-default px-3 shadow-sm transition-colors",e.getFileState(e.props).hasError?"border-destructive-border ring-2 ring-focus-ring-error":e.state==="focus"?"border-primary-border-emphasis ring-2 ring-focus-ring-primary":"border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary",e.disabled||e.state==="disabled"?"pointer-events-none cursor-not-allowed opacity-50":"cursor-pointer")),c("for",e.id),l(),y(e.cn("flex-1 truncate text-base font-normal",e.state==="filled"?"text-foreground-default":"text-foreground-muted")),l(),m(e.instruction),l(2),m(e.browseText),l(),c("id",e.id)("name",e.name)("multiple","")("accept",e.accept)("disabled",e.disabled||e.state==="disabled"?"":null)("required",e.required?"":null)("aria-invalid",e.getFileState(e.props).hasError)("aria-describedby",(e.showHint||e.getFileState(e.props).hasError)&&e.getFileState(e.props).helpText!==""?e.id+"-hint":void 0),l(4),w("ngIf",(e.showHint||e.getFileState(e.props).hasError)&&e.getFileState(e.props).helpText!==""))},dependencies:[A],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let p=f;(typeof ngDevMode>"u"||ngDevMode)&&S(p,[{type:k,args:[{standalone:!1,selector:"kd-input-multiple-file-upload, input-multiple-file-upload",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col items-start justify-start gap-3', className)"
    >
      <ng-container *ngIf="showLabel && label !== ''"
        ><div class="flex w-full flex-row items-start justify-between gap-3">
          <label
            class="flex flex-row items-start justify-start gap-1 text-sm font-medium text-foreground-default"
            [attr.for]="id"
            ><span>{{label}}</span>
            <ng-container *ngIf="required"
              ><span
                aria-hidden="true"
                class="text-sm font-medium text-destructive-default"
                >*</span
              ></ng-container
            ></label
          >
          <ng-container *ngIf="getFileState(props).resolvedFileCount !== ''"
            ><span
              class="text-sm font-normal text-foreground-muted"
              >{{getFileState(props).resolvedFileCount}}</span
            ></ng-container
          >
        </div></ng-container
      >
      <label
        [attr.for]="id"
        [class]="cn('flex h-[52px] w-full flex-row items-center justify-start gap-3 rounded-lg border bg-background-default px-3 shadow-sm transition-colors', getFileState(props).hasError ? 'border-destructive-border ring-2 ring-focus-ring-error' : state === 'focus' ? 'border-primary-border-emphasis ring-2 ring-focus-ring-primary' : 'border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary', disabled || state === 'disabled' ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer')"
        ><span
          [class]="cn('flex-1 truncate text-base font-normal', state === 'filled' ? 'text-foreground-default' : 'text-foreground-muted')"
          >{{instruction}}</span
        >
        <span
          class="inline-flex h-8 shrink-0 flex-row items-center justify-center gap-1.5 rounded-lg bg-secondary-default px-3 py-1 text-center text-sm font-medium text-secondary-foreground hover:bg-secondary-hover"
          >{{browseText}}</span
        >
        <input
          type="file"
          class="sr-only"
          [attr.id]="id"
          [attr.name]="name"
          [attr.multiple]="(true) ? '' : null"
          [attr.accept]="accept"
          [attr.disabled]="(disabled || state === 'disabled') ? '' : null"
          [attr.required]="(required) ? '' : null"
          [attr.aria-invalid]="getFileState(props).hasError"
          [attr.aria-describedby]="(showHint || getFileState(props).hasError) && getFileState(props).helpText !== '' ? id + '-hint' : undefined"
          (change)="!(disabled || state === 'disabled') && handleFileSelectEvent($event, undefined, onFilesChange)"
          (blur)="!(disabled || state === 'disabled') && onBlur && this.onBlur.emit($event)"
      /></label>
      <ng-container><ul class="flex w-full flex-col items-start justify-start gap-2">
          <ng-content></ng-content></ul
      ></ng-container>
      <ng-container
        *ngIf="(showHint || getFileState(props).hasError) && getFileState(props).helpText !== ''"
        ><div class="flex flex-col items-start justify-start">
          <span
            [attr.id]="id + '-hint'"
            [class]="cn('text-sm font-normal', getFileState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
            >{{getFileState(props).helpText}}</span
          >
        </div></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{value:[{type:a}],fileCount:[{type:a}],hint:[{type:a}],error:[{type:a}],errorMessage:[{type:a}],validating:[{type:a}],onValueChange:[{type:a}],className:[{type:a}],showLabel:[{type:a}],label:[{type:a}],id:[{type:a}],required:[{type:a}],state:[{type:a}],disabled:[{type:a}],instruction:[{type:a}],browseText:[{type:a}],name:[{type:a}],accept:[{type:a}],showHint:[{type:a}],onFilesChange:[{type:a}],onBlur:[{type:L}]});(typeof ngDevMode>"u"||ngDevMode)&&P(p,{className:"InputMultipleFileUpload",filePath:"InputMultipleFileUpload.ts",lineNumber:134});const u=class u{};t(u,"ɵfac",function(n){return new(n||u)}),t(u,"ɵmod",N({type:u})),t(u,"ɵinj",q({imports:[C]}));let v=u;(typeof ngDevMode>"u"||ngDevMode)&&S(v,[{type:U,args:[{declarations:[p],imports:[C],exports:[p]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&V(v,{declarations:[p],imports:[C],exports:[p]})})();export{v as InputMultipleFileUploadModule,p as default};

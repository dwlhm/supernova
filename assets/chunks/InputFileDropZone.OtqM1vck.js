var N=Object.defineProperty;var E=(a,l,n)=>l in a?N(a,l,{enumerable:!0,configurable:!0,writable:!0,value:n}):a[l]=n;var t=(a,l,n)=>E(a,typeof l!="symbol"?l+"":l,n);import{E as M,ɵ as k,a as j,b as O,c as Z,j as d,d as _,k as C,q as H,p as g,u as w,v,t as i,e as p,s as I,O as q,I as r,C as B,f as L,N as P,g as R,i as f,o as u,r as m,m as c,x as S,y as V,z,ao as F,h as $,l as A,n as J,A as G}from"./core.vpEFnhB-.js";import{a as K,v as Q,x as U,w as W,B as X,A as Y,z as ee,y as te,I as ne,d as ae}from"./theme.CMj9otVT.js";import{C as D,N as re,a as ie}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const oe=[[["","icon",""],["","slot","icon"]]],le=["[icon],[slot=icon]"];function se(a,l){a&1&&(f(0),d(1,"span",4),u(2,"*"),g(),m())}function de(a,l){if(a&1&&(f(0),d(1,"label",3),u(2),_(3,se,3,0,"ng-container",0),g(),m()),a&2){const n=c();i(),v("for",n.id),i(),S("",n.label," "),i(),p("ngIf",n.required)}}function ge(a,l){a&1&&G(0)}function pe(a,l){if(a&1&&(f(0),_(1,ge,1,0,"ng-container",5),m()),a&2){const n=c();i(),p("ngComponentOutlet",n.icon)}}function ue(a,l){if(a&1&&(f(0),V(),d(1,"svg",6),z(2,"path",7),g(),m()),a&2){const n=c();i(2),v("d",n.ICON_PATHS.upload)}}function ce(a,l){if(a&1&&(f(0),d(1,"span",10),u(2),g(),m()),a&2){const n=c(2);i(2),F(n.supportingText)}}function fe(a,l){if(a&1&&(f(0),d(1,"span",8)(2,"span"),u(3),g(),d(4,"span",9),u(5),g()(),_(6,ce,3,1,"ng-container",0),m()),a&2){const n=c();i(3),F(n.primaryText),i(2),F(n.browseText),i(),p("ngIf",n.supportingText!=="")}}function me(a,l){if(a&1&&(f(0),d(1,"span",10),u(2),g(),m()),a&2){const n=c(2);i(2),F(n.fileMetadata)}}function _e(a,l){if(a&1){const n=$();f(0),d(1,"span",11),u(2),g(),_(3,me,3,1,"ng-container",0),d(4,"span",12)(5,"span",9),u(6),g(),d(7,"button",13),C("click",function(h){A(n);const s=c();return J(!(s.disabled||s.state==="disabled")&&s.clearFileInputEvent(h,s.onFileNameChange,s.onFilesChange,s.onRemove))}),u(8),g()(),m()}if(a&2){const n=c();i(2),F(n.fileName),i(),p("ngIf",n.fileMetadata!==""),i(3),F(n.replaceText),i(),v("disabled",n.disabled||n.state==="disabled"?"":null),i(),S(" ",n.removeText," ")}}function be(a,l){if(a&1&&(f(0),d(1,"span"),u(2),g(),m()),a&2){const n=c();i(),w(n.cn("text-sm",n.getFileState(n.props).hasError?"text-destructive-foreground":"text-foreground-muted")),v("id",n.id+"-hint"),i(),F(n.getFileState(n.props).helpText)}}const o={id:"file-drop-zone",name:"drop-file",label:"",primaryText:"Drag and drop files here, or",supportingText:"",browseText:"Browse",replaceText:"Replace",removeText:"Remove",value:"",fileName:"",fileMetadata:"",hint:"",error:!1,errorMessage:"",validating:!1,accept:"",state:"default",isDragging:!1,disabled:!1,required:!1,showLabel:!0,showHint:!0,className:""},x=class x{constructor(){t(this,"value",o.value);t(this,"hint",o.hint);t(this,"error",o.error);t(this,"errorMessage",o.errorMessage);t(this,"validating",o.validating);t(this,"onValueChange");t(this,"cn",K);t(this,"getFileState",Q);t(this,"handleFileSelectEvent",U);t(this,"clearFileInputEvent",W);t(this,"handleFileDragEnter",X);t(this,"handleFileDragOver",Y);t(this,"handleFileDragLeave",ee);t(this,"handleFileDropEvent",te);t(this,"ICON_PATHS",ne);t(this,"bindControllerProps",ae);t(this,"disabled",o.disabled);t(this,"state",o.state);t(this,"className",o.className);t(this,"showLabel",o.showLabel);t(this,"label",o.label);t(this,"id",o.id);t(this,"required",o.required);t(this,"isDragging",o.isDragging);t(this,"onDragStateChange");t(this,"onFileNameChange");t(this,"onFilesChange");t(this,"icon");t(this,"primaryText",o.primaryText);t(this,"browseText",o.browseText);t(this,"supportingText",o.supportingText);t(this,"fileName",o.fileName);t(this,"fileMetadata",o.fileMetadata);t(this,"replaceText",o.replaceText);t(this,"onRemove");t(this,"removeText",o.removeText);t(this,"name",o.name);t(this,"accept",o.accept);t(this,"showHint",o.showHint);t(this,"onBlur",new M)}get props(){return this}};t(x,"ɵfac",function(n){return new(n||x)}),t(x,"ɵcmp",k({type:x,selectors:[["kd-input-file-drop-zone"],["input-file-drop-zone"]],inputs:{value:"value",hint:"hint",error:"error",errorMessage:"errorMessage",validating:"validating",onValueChange:"onValueChange",disabled:"disabled",state:"state",className:"className",showLabel:"showLabel",label:"label",id:"id",required:"required",isDragging:"isDragging",onDragStateChange:"onDragStateChange",onFileNameChange:"onFileNameChange",onFilesChange:"onFilesChange",icon:"icon",primaryText:"primaryText",browseText:"browseText",supportingText:"supportingText",fileName:"fileName",fileMetadata:"fileMetadata",replaceText:"replaceText",onRemove:"onRemove",removeText:"removeText",name:"name",accept:"accept",showHint:"showHint"},outputs:{onBlur:"onBlur"},standalone:!1,ngContentSelectors:le,decls:10,vars:20,consts:[[4,"ngIf"],[3,"dragenter","dragover","dragleave","drop"],["type","file",1,"sr-only",3,"change","blur"],[1,"flex","items-center","gap-1","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],[4,"ngComponentOutlet"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-6","w-6","shrink-0","text-foreground-default","transition-colors","group-data-[dragging=true]:text-primary-default"],["stroke-linecap","round","stroke-linejoin","round"],[1,"inline-flex","flex-wrap","items-center","justify-center","gap-1","text-sm","font-medium","text-foreground-default"],[1,"inline-flex","items-center","justify-center","gap-1.5","rounded-lg","bg-secondary-default","px-2","py-0.5","text-sm","font-medium","text-secondary-foreground"],[1,"text-sm","font-normal","text-foreground-muted"],[1,"inline-flex","items-center","gap-1","text-sm","font-medium","text-foreground-default"],[1,"flex","flex-row","items-start","justify-start","gap-2"],["type","button",1,"inline-flex","items-center","justify-center","gap-1.5","rounded-lg","bg-destructive-background","px-2","py-0.5","text-sm","font-medium","text-primary-foreground","hover:bg-destructive-hover",3,"click"]],template:function(n,e){n&1&&(Z(oe),d(0,"div"),_(1,de,4,3,"ng-container",0),d(2,"label",1),C("dragenter",function(s){return!(e.disabled||e.state==="disabled")&&e.handleFileDragEnter(s,e.onDragStateChange)})("dragover",function(s){return!(e.disabled||e.state==="disabled")&&e.handleFileDragOver(s)})("dragleave",function(s){return!(e.disabled||e.state==="disabled")&&e.handleFileDragLeave(s,e.onDragStateChange)})("drop",function(s){return!(e.disabled||e.state==="disabled")&&e.handleFileDropEvent(s,e.onFileNameChange,e.onFilesChange,e.onDragStateChange)}),_(3,pe,2,1,"ng-container",0),H(4),_(5,ue,3,1,"ng-container",0)(6,fe,7,3,"ng-container",0)(7,_e,9,5,"ng-container",0),d(8,"input",2),C("change",function(s){return!(e.disabled||e.state==="disabled")&&e.handleFileSelectEvent(s,e.onFileNameChange,e.onFilesChange)})("blur",function(s){return!(e.disabled||e.state==="disabled")&&e.onBlur&&e.onBlur.emit(s)}),g()(),_(9,be,3,4,"ng-container",0),g()),n&2&&(w(e.cn("flex w-full flex-col gap-3",(e.disabled||e.state==="disabled")&&"cursor-not-allowed opacity-50",e.className)),v("data-ctrl",typeof e.bindControllerProps),i(),p("ngIf",e.showLabel&&e.label!==""),i(),w(e.cn("group flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-background-default px-6 py-6 text-center shadow-sm transition-colors","data-[dragging=true]:border-primary-default data-[dragging=true]:bg-primary-subtle data-[dragging=true]:ring-2 data-[dragging=true]:ring-focus-ring-primary",e.getFileState(e.props).hasError?"border-destructive-border ring-2 ring-focus-ring-error":e.state==="focus"?"border-primary-default ring-2 ring-focus-ring-primary":"border-border-default focus-within:border-primary-default focus-within:ring-2 focus-within:ring-focus-ring-primary",e.disabled||e.state==="disabled"?"pointer-events-none cursor-not-allowed":"cursor-pointer")),v("for",e.id)("data-dragging",e.isDragging?"true":void 0),i(),p("ngIf",e.icon),i(2),p("ngIf",!e.icon),i(),p("ngIf",!e.getFileState(e.props).hasFile&&e.state!=="filled"),i(),p("ngIf",e.getFileState(e.props).hasFile||e.state==="filled"),i(),v("id",e.id)("name",e.name)("accept",e.accept)("disabled",e.disabled||e.state==="disabled"?"":null)("required",e.required?"":null)("aria-invalid",e.getFileState(e.props).hasError)("aria-describedby",(e.showHint||e.getFileState(e.props).hasError)&&e.getFileState(e.props).helpText!==""?e.id+"-hint":void 0),i(),p("ngIf",(e.showHint||e.getFileState(e.props).hasError)&&e.getFileState(e.props).helpText!==""))},dependencies:[re,ie],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let b=x;(typeof ngDevMode>"u"||ngDevMode)&&I(b,[{type:B,args:[{standalone:!1,selector:"kd-input-file-drop-zone, input-file-drop-zone",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-3', (disabled || state === 'disabled') && 'cursor-not-allowed opacity-50', className)"
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
      <label
        [attr.for]="id"
        [attr.data-dragging]="isDragging ? 'true' : undefined"
        [class]="cn('group flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-background-default px-6 py-6 text-center shadow-sm transition-colors', 'data-[dragging=true]:border-primary-default data-[dragging=true]:bg-primary-subtle data-[dragging=true]:ring-2 data-[dragging=true]:ring-focus-ring-primary', getFileState(props).hasError ? 'border-destructive-border ring-2 ring-focus-ring-error' : state === 'focus' ? 'border-primary-default ring-2 ring-focus-ring-primary' : 'border-border-default focus-within:border-primary-default focus-within:ring-2 focus-within:ring-focus-ring-primary', disabled || state === 'disabled' ? 'pointer-events-none cursor-not-allowed' : 'cursor-pointer')"
        (dragenter)="!(disabled || state === 'disabled') && handleFileDragEnter($event, onDragStateChange)"
        (dragover)="!(disabled || state === 'disabled') && handleFileDragOver($event)"
        (dragleave)="!(disabled || state === 'disabled') && handleFileDragLeave($event, onDragStateChange)"
        (drop)="!(disabled || state === 'disabled') && handleFileDropEvent($event, onFileNameChange, onFilesChange, onDragStateChange)"
        ><ng-container *ngIf="icon"><ng-container *ngComponentOutlet="icon"></ng-container></ng-container><ng-content select="[icon],[slot=icon]"></ng-content>
        <ng-container *ngIf="!icon"
          ><svg
            aria-hidden="true"
            class="h-6 w-6 shrink-0 text-foreground-default transition-colors group-data-[dragging=true]:text-primary-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="ICON_PATHS.upload"
            ></path></svg
        ></ng-container>
        <ng-container *ngIf="!getFileState(props).hasFile && state !== 'filled'"
          ><span
            class="inline-flex flex-wrap items-center justify-center gap-1 text-sm font-medium text-foreground-default"
            ><span>{{primaryText}}</span>
            <span
              class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground"
              >{{browseText}}</span
            ></span
          >
          <ng-container *ngIf="supportingText !== ''"
            ><span
              class="text-sm font-normal text-foreground-muted"
              >{{supportingText}}</span
            ></ng-container
          ></ng-container
        >
        <ng-container *ngIf="getFileState(props).hasFile || state === 'filled'"
          ><span
            class="inline-flex items-center gap-1 text-sm font-medium text-foreground-default"
            >{{fileName}}</span
          >
          <ng-container *ngIf="fileMetadata !== ''"
            ><span
              class="text-sm font-normal text-foreground-muted"
              >{{fileMetadata}}</span
            ></ng-container
          >
          <span class="flex flex-row items-start justify-start gap-2"
            ><span
              class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground"
              >{{replaceText}}</span
            >
            <button
              type="button"
              class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-destructive-background px-2 py-0.5 text-sm font-medium text-primary-foreground hover:bg-destructive-hover"
              [attr.disabled]="(disabled || state === 'disabled') ? '' : null"
              (click)="!(disabled || state === 'disabled') && clearFileInputEvent($event, onFileNameChange, onFilesChange, onRemove)"
            >
              {{removeText}}
            </button></span
          ></ng-container
        >
        <input
          type="file"
          class="sr-only"
          [attr.id]="id"
          [attr.name]="name"
          [attr.accept]="accept"
          [attr.disabled]="(disabled || state === 'disabled') ? '' : null"
          [attr.required]="(required) ? '' : null"
          [attr.aria-invalid]="getFileState(props).hasError"
          [attr.aria-describedby]="(showHint || getFileState(props).hasError) && getFileState(props).helpText !== '' ? id + '-hint' : undefined"
          (change)="!(disabled || state === 'disabled') && handleFileSelectEvent($event, onFileNameChange, onFilesChange)"
          (blur)="!(disabled || state === 'disabled') && onBlur && this.onBlur.emit($event)"
      /></label>
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
    `]}]}],null,{value:[{type:r}],hint:[{type:r}],error:[{type:r}],errorMessage:[{type:r}],validating:[{type:r}],onValueChange:[{type:r}],disabled:[{type:r}],state:[{type:r}],className:[{type:r}],showLabel:[{type:r}],label:[{type:r}],id:[{type:r}],required:[{type:r}],isDragging:[{type:r}],onDragStateChange:[{type:r}],onFileNameChange:[{type:r}],onFilesChange:[{type:r}],icon:[{type:r}],primaryText:[{type:r}],browseText:[{type:r}],supportingText:[{type:r}],fileName:[{type:r}],fileMetadata:[{type:r}],replaceText:[{type:r}],onRemove:[{type:r}],removeText:[{type:r}],name:[{type:r}],accept:[{type:r}],showHint:[{type:r}],onBlur:[{type:q}]});(typeof ngDevMode>"u"||ngDevMode)&&L(b,{className:"InputFileDropZone",filePath:"InputFileDropZone.ts",lineNumber:193});const y=class y{};t(y,"ɵfac",function(n){return new(n||y)}),t(y,"ɵmod",j({type:y})),t(y,"ɵinj",O({imports:[D]}));let T=y;(typeof ngDevMode>"u"||ngDevMode)&&I(T,[{type:P,args:[{declarations:[b],imports:[D],exports:[b]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&R(T,{declarations:[b],imports:[D],exports:[b]})})();export{T as InputFileDropZoneModule,b as default};

var M=Object.defineProperty;var E=(t,i,n)=>i in t?M(t,i,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[i]=n;var a=(t,i,n)=>E(t,typeof i!="symbol"?i+"":i,n);import{E as B,ɵ as q,a as P,b as k,c as U,j as f,d as u,p as m,k as w,u as T,v as b,t as r,e as l,s as C,O as R,I as o,C as j,f as H,N as O,g as V,i as d,o as _,r as p,m as g,ao as h,z as N,q as D,h as L,l as A,n as G,x as J,y as $,A as z}from"./core.vpEFnhB-.js";import{a as K,v as Q,x as W,w as X,I as Y,d as Z}from"./theme.CecfD-Na.js";import{C as S,N as ee,a as ne}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const te=[[["","icon",""],["","slot","icon"]]],ae=["[icon],[slot=icon]"];function re(t,i){t&1&&(d(0),f(1,"span",8),_(2,"*"),m(),p())}function oe(t,i){if(t&1&&(d(0),f(1,"label",7)(2,"span"),_(3),m(),u(4,re,3,0,"ng-container",0),m(),p()),t&2){const n=g();r(),b("for",n.id),r(2),h(n.labelText||n.label),r(),l("ngIf",n.showRequired!==!1&&(n.required||n.showRequired))}}function ie(t,i){if(t&1&&(d(0),N(1,"img",9),p()),t&2){const n=g();r(),b("src",n.imageSrc)}}function se(t,i){t&1&&z(0)}function le(t,i){if(t&1&&(d(0),u(1,se,1,0,"ng-container",10),p()),t&2){const n=g(2);r(),l("ngComponentOutlet",n.icon)}}function ge(t,i){if(t&1&&(d(0),$(),f(1,"svg",11),N(2,"path",12),m(),p()),t&2){const n=g(2);r(),T(n.cn("h-6 w-6",n.disabled||n.state==="disabled"?"text-foreground-subtle":"text-foreground-default")),r(),b("d",n.ICON_PATHS.imageUpload||n.ICON_PATHS.image)}}function de(t,i){if(t&1&&(d(0),u(1,le,2,1,"ng-container",0),D(2),u(3,ge,3,3,"ng-container",0),p()),t&2){const n=g();r(),l("ngIf",n.icon),r(2),l("ngIf",!n.icon)}}function pe(t,i){if(t&1&&(d(0),_(1),p()),t&2){const n=g();r(),h(n.fileName||n.getFileState(n.props).displayName)}}function ce(t,i){if(t&1&&(d(0),_(1),p()),t&2){const n=g();r(),h(n.primaryText)}}function ue(t,i){if(t&1&&(d(0),_(1),p()),t&2){const n=g();r(),h(n.fileMetadata||n.supportingText)}}function me(t,i){if(t&1&&(d(0),_(1),p()),t&2){const n=g();r(),h(n.supportingText)}}function fe(t,i){if(t&1&&(d(0),_(1),p()),t&2){const n=g();r(),h(n.replaceText)}}function _e(t,i){if(t&1&&(d(0),_(1),p()),t&2){const n=g();r(),h(n.chooseText)}}function he(t,i){if(t&1){const n=L();d(0),f(1,"button",13),w("click",function(F){A(n);const c=g();return G(!(c.disabled||c.state==="disabled")&&c.clearFileInputEvent(F,c.onFileNameChange,c.onFilesChange,c.onRemove,c.onPreviewChange,c.onValueChange))}),_(2),m(),p()}if(t&2){const n=g();r(),T(n.cn("inline-flex items-center justify-center gap-1.5 rounded-lg bg-destructive-background px-2 py-0.5 text-sm font-medium text-primary-foreground hover:bg-destructive-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-error",(n.disabled||n.state==="disabled")&&"pointer-events-none cursor-not-allowed opacity-50")),b("disabled",n.disabled||n.state==="disabled"?"":null),r(),J(" ",n.removeText," ")}}function be(t,i){if(t&1&&(d(0),_(1),p()),t&2){const n=g(2);r(),h(n.errorMessage)}}function ve(t,i){if(t&1&&(d(0),_(1),p()),t&2){const n=g(2);r(),h(n.hintErrorText||n.getFileState(n.props).helpText||"For best results, use a 1:1 image.")}}function ye(t,i){if(t&1&&(d(0),f(1,"span"),u(2,be,2,1,"ng-container",0)(3,ve,2,1,"ng-container",0),m(),p()),t&2){const n=g();r(),T(n.cn("text-sm font-normal",n.state==="error"||n.getFileState(n.props).hasError?"text-destructive-foreground":"text-foreground-muted")),b("id",n.id+"-hint"),r(),l("ngIf",n.errorMessage&&n.errorMessage!==""),r(),l("ngIf",!(n.errorMessage&&n.errorMessage!==""))}}const s={id:"image-uploader",name:"image-file",label:"Profile image",primaryText:"Upload an image",supportingText:"Square JPG or PNG, up to 5 MB",chooseText:"Choose image",replaceText:"Replace",removeText:"Remove",value:"",fileName:"",fileMetadata:"",imageSrc:"",state:"default",hint:"For best results, use a 1:1 image.",error:!1,errorMessage:"",validating:!1,accept:"image/png,image/jpeg",disabled:!1,required:!0,showRequired:!0,showLabel:!0,showHint:!0,className:""},I=class I{constructor(){a(this,"Boolean",Boolean);a(this,"value",s.value);a(this,"hint",s.hint);a(this,"error",s.error);a(this,"validating",s.validating);a(this,"cn",K);a(this,"getFileState",Q);a(this,"handleFileSelectEvent",W);a(this,"clearFileInputEvent",X);a(this,"ICON_PATHS",Y);a(this,"bindControllerProps",Z);a(this,"className",s.className);a(this,"showLabel",s.showLabel);a(this,"labelText");a(this,"label",s.label);a(this,"id",s.id);a(this,"showRequired",s.showRequired);a(this,"required",s.required);a(this,"state",s.state);a(this,"disabled",s.disabled);a(this,"imageSrc",s.imageSrc);a(this,"icon");a(this,"fileName",s.fileName);a(this,"primaryText",s.primaryText);a(this,"supportingText",s.supportingText);a(this,"fileMetadata",s.fileMetadata);a(this,"chooseText",s.chooseText);a(this,"replaceText",s.replaceText);a(this,"name",s.name);a(this,"accept",s.accept);a(this,"showHint",s.showHint);a(this,"onFileNameChange");a(this,"onFilesChange");a(this,"onPreviewChange");a(this,"onRemove");a(this,"onValueChange");a(this,"removeText",s.removeText);a(this,"errorMessage",s.errorMessage);a(this,"hintErrorText");a(this,"onBlur",new B)}get props(){return this}};a(I,"ɵfac",function(n){return new(n||I)}),a(I,"ɵcmp",q({type:I,selectors:[["kd-input-image-uploader"],["input-image-uploader"]],inputs:{value:"value",hint:"hint",error:"error",validating:"validating",className:"className",showLabel:"showLabel",labelText:"labelText",label:"label",id:"id",showRequired:"showRequired",required:"required",state:"state",disabled:"disabled",imageSrc:"imageSrc",icon:"icon",fileName:"fileName",primaryText:"primaryText",supportingText:"supportingText",fileMetadata:"fileMetadata",chooseText:"chooseText",replaceText:"replaceText",name:"name",accept:"accept",showHint:"showHint",onFileNameChange:"onFileNameChange",onFilesChange:"onFilesChange",onPreviewChange:"onPreviewChange",onRemove:"onRemove",onValueChange:"onValueChange",removeText:"removeText",errorMessage:"errorMessage",hintErrorText:"hintErrorText"},outputs:{onBlur:"onBlur"},standalone:!1,ngContentSelectors:ae,decls:20,vars:26,consts:[[4,"ngIf"],["aria-hidden","true",1,"flex","h-24","w-24","shrink-0","items-center","justify-center","overflow-hidden","rounded-lg","bg-background-muted"],[1,"flex","min-w-0","flex-1","flex-col","gap-2.5"],[1,"truncate","text-base","font-normal","text-foreground-default"],[1,"truncate","text-sm","font-normal","text-foreground-muted"],[1,"flex","items-center","gap-2"],["type","file",1,"sr-only",3,"change","blur"],[1,"flex","items-center","gap-1","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-foreground"],["alt","",1,"h-full","w-full","object-cover"],[4,"ngComponentOutlet"],["viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["stroke-linecap","round","stroke-linejoin","round"],["type","button",3,"click"]],template:function(n,e){n&1&&(U(te),f(0,"div"),u(1,oe,5,3,"ng-container",0),f(2,"div")(3,"span",1),u(4,ie,2,1,"ng-container",0)(5,de,4,2,"ng-container",0),m(),f(6,"span",2)(7,"span",3),u(8,pe,2,1,"ng-container",0)(9,ce,2,1,"ng-container",0),m(),f(10,"span",4),u(11,ue,2,1,"ng-container",0)(12,me,2,1,"ng-container",0),m(),f(13,"span",5)(14,"label"),u(15,fe,2,1,"ng-container",0)(16,_e,2,1,"ng-container",0),f(17,"input",6),w("change",function(c){return!(e.disabled||e.state==="disabled")&&e.handleFileSelectEvent(c,e.onFileNameChange,e.onFilesChange,e.onPreviewChange)})("blur",function(c){return!(e.disabled||e.state==="disabled")&&e.onBlur&&e.onBlur.emit(c)}),m()(),u(18,he,3,4,"ng-container",0),m()()(),u(19,ye,4,5,"ng-container",0),m()),n&2&&(T(e.cn("flex w-full flex-col gap-3",e.className)),b("data-ctrl",typeof e.bindControllerProps),r(),l("ngIf",e.showLabel&&(e.labelText||e.label)),r(),T(e.cn("flex items-center gap-4 rounded-lg border bg-background-default p-3 shadow-sm transition-colors",e.state==="error"||e.getFileState(e.props).hasError?"border-destructive-border ring-2 ring-focus-ring-error":"border-border-default",(e.disabled||e.state==="disabled")&&"pointer-events-none cursor-not-allowed opacity-50")),r(2),l("ngIf",e.imageSrc!==""),r(),l("ngIf",e.imageSrc===""),r(3),l("ngIf",e.Boolean(e.fileName||e.imageSrc||e.getFileState(e.props).hasFile)),r(),l("ngIf",!e.Boolean(e.fileName||e.imageSrc||e.getFileState(e.props).hasFile)),r(2),l("ngIf",e.Boolean(e.fileName||e.imageSrc||e.getFileState(e.props).hasFile)),r(),l("ngIf",!e.Boolean(e.fileName||e.imageSrc||e.getFileState(e.props).hasFile)),r(2),T(e.cn("inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover focus-within:ring-2 focus-within:ring-focus-ring-primary",e.disabled||e.state==="disabled"?"pointer-events-none cursor-not-allowed opacity-50":"cursor-pointer")),b("for",e.id),r(),l("ngIf",e.Boolean(e.fileName||e.imageSrc||e.getFileState(e.props).hasFile)),r(),l("ngIf",!e.Boolean(e.fileName||e.imageSrc||e.getFileState(e.props).hasFile)),r(),b("id",e.id)("name",e.name)("accept",e.accept)("disabled",e.disabled||e.state==="disabled"?"":null)("required",e.required?"":null)("aria-invalid",e.state==="error"||e.getFileState(e.props).hasError)("aria-describedby",e.showHint||e.state==="error"||e.getFileState(e.props).hasError?e.id+"-hint":void 0),r(),l("ngIf",e.Boolean(e.fileName||e.imageSrc||e.getFileState(e.props).hasFile)),r(),l("ngIf",e.showHint||e.state==="error"||e.getFileState(e.props).hasError))},dependencies:[ee,ne],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let v=I;(typeof ngDevMode>"u"||ngDevMode)&&C(v,[{type:j,args:[{standalone:!1,selector:"kd-input-image-uploader, input-image-uploader",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-3', className)"
    >
      <ng-container *ngIf="showLabel && (labelText || label)"
        ><label
          class="flex items-center gap-1 text-sm font-medium text-foreground-default"
          [attr.for]="id"
          ><span>{{labelText || label}}</span>
          <ng-container
            *ngIf="showRequired !== false && (required || showRequired)"
            ><span aria-hidden="true" class="text-destructive-foreground"
              >*</span
            ></ng-container
          ></label
        ></ng-container
      >
      <div
        [class]="cn('flex items-center gap-4 rounded-lg border bg-background-default p-3 shadow-sm transition-colors', state === 'error' || getFileState(props).hasError ? 'border-destructive-border ring-2 ring-focus-ring-error' : 'border-border-default', (disabled || state === 'disabled') && 'pointer-events-none cursor-not-allowed opacity-50')"
      >
        <span
          aria-hidden="true"
          class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background-muted"
          ><ng-container *ngIf="imageSrc !== ''"
            ><img
              alt=""
              class="h-full w-full object-cover"
              [attr.src]="imageSrc"
          /></ng-container>
          <ng-container *ngIf="imageSrc === ''"
            ><ng-container *ngIf="icon"><ng-container *ngComponentOutlet="icon"></ng-container></ng-container><ng-content select="[icon],[slot=icon]"></ng-content>
            <ng-container *ngIf="!icon"
              ><svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                [class]="cn('h-6 w-6', disabled || state === 'disabled' ? 'text-foreground-subtle' : 'text-foreground-default')"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  [attr.d]="ICON_PATHS.imageUpload || ICON_PATHS.image"
                ></path></svg></ng-container></ng-container
        ></span>
        <span class="flex min-w-0 flex-1 flex-col gap-2.5"
          ><span class="truncate text-base font-normal text-foreground-default"
            ><ng-container
              *ngIf="Boolean(fileName || imageSrc || getFileState(props).hasFile)"
              >{{fileName || getFileState(props).displayName}}</ng-container
            ><ng-container
              *ngIf="!(Boolean(fileName || imageSrc || getFileState(props).hasFile))"
              >{{primaryText}}</ng-container
            ></span
          >
          <span class="truncate text-sm font-normal text-foreground-muted"
            ><ng-container
              *ngIf="Boolean(fileName || imageSrc || getFileState(props).hasFile)"
              >{{fileMetadata || supportingText}}</ng-container
            ><ng-container
              *ngIf="!(Boolean(fileName || imageSrc || getFileState(props).hasFile))"
              >{{supportingText}}</ng-container
            ></span
          >
          <span class="flex items-center gap-2"
            ><label
              [attr.for]="id"
              [class]="cn('inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover focus-within:ring-2 focus-within:ring-focus-ring-primary', disabled || state === 'disabled' ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer')"
              ><ng-container
                *ngIf="Boolean(fileName || imageSrc || getFileState(props).hasFile)"
                >{{replaceText}}</ng-container
              ><ng-container
                *ngIf="!(Boolean(fileName || imageSrc || getFileState(props).hasFile))"
                >{{chooseText}}</ng-container
              >
              <input
                type="file"
                class="sr-only"
                [attr.id]="id"
                [attr.name]="name"
                [attr.accept]="accept"
                [attr.disabled]="(disabled || state === 'disabled') ? '' : null"
                [attr.required]="(required) ? '' : null"
                [attr.aria-invalid]="state === 'error' || getFileState(props).hasError"
                [attr.aria-describedby]="showHint || state === 'error' || getFileState(props).hasError ? id + '-hint' : undefined"
                (change)="!(disabled || state === 'disabled') && handleFileSelectEvent($event, onFileNameChange, onFilesChange, onPreviewChange)"
                (blur)="!(disabled || state === 'disabled') && onBlur && this.onBlur.emit($event)"
            /></label>
            <ng-container
              *ngIf="Boolean(fileName || imageSrc || getFileState(props).hasFile)"
              ><button
                type="button"
                [attr.disabled]="(disabled || state === 'disabled') ? '' : null"
                [class]="cn('inline-flex items-center justify-center gap-1.5 rounded-lg bg-destructive-background px-2 py-0.5 text-sm font-medium text-primary-foreground hover:bg-destructive-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-error', (disabled || state === 'disabled') && 'pointer-events-none cursor-not-allowed opacity-50')"
                (click)="!(disabled || state === 'disabled') && clearFileInputEvent($event, onFileNameChange, onFilesChange, onRemove, onPreviewChange, onValueChange)"
              >
                {{removeText}}
              </button></ng-container
            ></span
          ></span
        >
      </div>
      <ng-container
        *ngIf="showHint || state === 'error' || getFileState(props).hasError"
        ><span
          [attr.id]="id + '-hint'"
          [class]="cn('text-sm font-normal', state === 'error' || getFileState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
          ><ng-container
            *ngIf="errorMessage && errorMessage !== ''"
            >{{errorMessage}}</ng-container
          ><ng-container
            *ngIf="!(errorMessage && errorMessage !== '')"
            >{{hintErrorText || getFileState(props).helpText || 'For best results,
                use a 1:1 image.'}}</ng-container
          ></span
        ></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{value:[{type:o}],hint:[{type:o}],error:[{type:o}],validating:[{type:o}],className:[{type:o}],showLabel:[{type:o}],labelText:[{type:o}],label:[{type:o}],id:[{type:o}],showRequired:[{type:o}],required:[{type:o}],state:[{type:o}],disabled:[{type:o}],imageSrc:[{type:o}],icon:[{type:o}],fileName:[{type:o}],primaryText:[{type:o}],supportingText:[{type:o}],fileMetadata:[{type:o}],chooseText:[{type:o}],replaceText:[{type:o}],name:[{type:o}],accept:[{type:o}],showHint:[{type:o}],onFileNameChange:[{type:o}],onFilesChange:[{type:o}],onPreviewChange:[{type:o}],onRemove:[{type:o}],onValueChange:[{type:o}],removeText:[{type:o}],errorMessage:[{type:o}],hintErrorText:[{type:o}],onBlur:[{type:R}]});(typeof ngDevMode>"u"||ngDevMode)&&H(v,{className:"InputImageUploader",filePath:"InputImageUploader.ts",lineNumber:207});const y=class y{};a(y,"ɵfac",function(n){return new(n||y)}),a(y,"ɵmod",P({type:y})),a(y,"ɵinj",k({imports:[S]}));let x=y;(typeof ngDevMode>"u"||ngDevMode)&&C(x,[{type:O,args:[{declarations:[v],imports:[S],exports:[v]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&V(x,{declarations:[v],imports:[S],exports:[v]})})();export{x as InputImageUploaderModule,v as default};

var M=Object.defineProperty;var k=(n,r,t)=>r in n?M(n,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[r]=t;var a=(n,r,t)=>k(n,typeof r!="symbol"?r+"":r,t);import{ɵ as P,a as E,b as q,j as p,d as m,p as c,k as C,u as I,v as h,t as i,e as l,s as N,I as o,C as U,f as H,N as j,g as L,i as d,o as f,r as g,m as u,x as D,z as T,y as O,am as F,h as A,l as R,n as V}from"./core.BqS-lykr.js";import{a as B,l as G,m as J,n as $,I as z,b as K}from"./utils.BBpd638g.js";import{C as v,N as Q}from"./common_module-chunk.DvGwmKFp.js";function W(n,r){n&1&&(d(0),p(1,"span",8),f(2,"*"),c(),g())}function X(n,r){if(n&1&&(d(0),p(1,"label",7),f(2),m(3,W,3,0,"ng-container",0),c(),g()),n&2){const t=u();i(),h("for",t.id),i(),D("",t.label," "),i(),l("ngIf",t.required)}}function Y(n,r){if(n&1&&(d(0),T(1,"img",9),g()),n&2){const t=u();i(),h("src",t.imageSrc)}}function Z(n,r){if(n&1&&(d(0),O(),p(1,"svg",10),T(2,"path",11),c(),g()),n&2){const t=u();i(2),h("d",t.ICON_PATHS.image)}}function ee(n,r){if(n&1&&(d(0),f(1),g()),n&2){const t=u();i(),F(t.fileName)}}function ne(n,r){if(n&1&&(d(0),f(1),g()),n&2){const t=u();i(),F(t.primaryText)}}function te(n,r){if(n&1&&(d(0),f(1),g()),n&2){const t=u();i(),F(t.fileMetadata)}}function ae(n,r){if(n&1&&(d(0),f(1),g()),n&2){const t=u();i(),F(t.supportingText)}}function ie(n,r){n&1&&(d(0),f(1,"Replace"),g())}function re(n,r){n&1&&(d(0),f(1,"Choose image"),g())}function oe(n,r){if(n&1){const t=A();d(0),p(1,"button",12),C("click",function(S){R(t);const y=u();return V(!y.disabled&&y.clearFileInputEvent(S,y.onFileNameChange,y.onFilesChange))}),f(2," Remove "),c(),g()}if(n&2){const t=u();i(),h("disabled",t.disabled?"":null)}}function se(n,r){if(n&1&&(d(0),p(1,"span"),f(2),c(),g()),n&2){const t=u();i(),I(t.cn("text-sm",t.getFileState(t.props).hasError?"text-destructive-foreground":"text-foreground-muted")),h("id",t.id+"-hint"),i(),F(t.getFileState(t.props).helpText)}}const s={id:"image-uploader",name:"image-file",label:"Profile image",primaryText:"Upload an image",supportingText:"Square JPG or PNG, up to 5 MB",fileName:"",fileMetadata:"",imageSrc:"",hint:"For best results, use a 1:1 image.",errorMessage:"",accept:"image/png,image/jpeg",disabled:!1,required:!0,showLabel:!0,showHint:!0,className:""},x=class x{constructor(){a(this,"hint",s.hint);a(this,"errorMessage",s.errorMessage);a(this,"cn",B);a(this,"getFileState",G);a(this,"handleFileSelectEvent",J);a(this,"clearFileInputEvent",$);a(this,"ICON_PATHS",z);a(this,"bindControllerProps",K);a(this,"className",s.className);a(this,"showLabel",s.showLabel);a(this,"label",s.label);a(this,"id",s.id);a(this,"required",s.required);a(this,"disabled",s.disabled);a(this,"imageSrc",s.imageSrc);a(this,"primaryText",s.primaryText);a(this,"fileName",s.fileName);a(this,"fileMetadata",s.fileMetadata);a(this,"supportingText",s.supportingText);a(this,"name",s.name);a(this,"accept",s.accept);a(this,"onFileNameChange");a(this,"onFilesChange");a(this,"onPreviewChange");a(this,"showHint",s.showHint)}get props(){return this}};a(x,"ɵfac",function(t){return new(t||x)}),a(x,"ɵcmp",P({type:x,selectors:[["spn-input-image-uploader"],["input-image-uploader"]],inputs:{hint:"hint",errorMessage:"errorMessage",className:"className",showLabel:"showLabel",label:"label",id:"id",required:"required",disabled:"disabled",imageSrc:"imageSrc",primaryText:"primaryText",fileName:"fileName",fileMetadata:"fileMetadata",supportingText:"supportingText",name:"name",accept:"accept",onFileNameChange:"onFileNameChange",onFilesChange:"onFilesChange",onPreviewChange:"onPreviewChange",showHint:"showHint"},standalone:!1,decls:20,vars:25,consts:[[4,"ngIf"],["aria-hidden","true",1,"flex","h-24","w-24","shrink-0","items-center","justify-center","overflow-hidden","rounded-lg","bg-background-muted"],[1,"flex","min-w-0","flex-1","flex-col","gap-2"],[1,"truncate","text-sm","font-medium","text-foreground-default"],[1,"truncate","text-sm","text-foreground-muted"],[1,"flex","items-center","gap-2"],["type","file",1,"sr-only",3,"change"],[1,"flex","items-center","gap-1","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],["alt","",1,"h-full","w-full","object-cover"],["viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-8","w-8","text-foreground-subtle"],["stroke-linecap","round","stroke-linejoin","round"],["type","button",1,"inline-flex","items-center","rounded-lg","px-2","py-0.5","text-sm","font-medium","text-foreground-default","hover:bg-background-muted","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"]],template:function(t,e){t&1&&(p(0,"div"),m(1,X,4,3,"ng-container",0),p(2,"div")(3,"span",1),m(4,Y,2,1,"ng-container",0)(5,Z,3,1,"ng-container",0),c(),p(6,"span",2)(7,"span",3),m(8,ee,2,1,"ng-container",0)(9,ne,2,1,"ng-container",0),c(),p(10,"span",4),m(11,te,2,1,"ng-container",0)(12,ae,2,1,"ng-container",0),c(),p(13,"span",5)(14,"label"),m(15,ie,2,0,"ng-container",0)(16,re,2,0,"ng-container",0),p(17,"input",6),C("change",function(y){return!e.disabled&&e.handleFileSelectEvent(y,e.onFileNameChange,e.onFilesChange,e.onPreviewChange)}),c()(),m(18,oe,3,1,"ng-container",0),c()()(),m(19,se,3,4,"ng-container",0),c()),t&2&&(I(e.cn("flex w-full flex-col gap-3",e.className)),h("data-ctrl",typeof e.bindControllerProps),i(),l("ngIf",e.showLabel&&e.label!==""),i(),I(e.cn("flex items-center gap-4 rounded-lg border bg-background-default p-3 shadow-xs transition-colors",e.getFileState(e.props).hasError?"border-destructive-border focus-within:ring-2 focus-within:ring-focus-ring-error":"border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary",e.disabled&&"cursor-not-allowed opacity-50")),i(2),l("ngIf",e.imageSrc!==""),i(),l("ngIf",e.imageSrc===""),i(3),l("ngIf",e.getFileState(e.props).hasFile),i(),l("ngIf",!e.getFileState(e.props).hasFile),i(2),l("ngIf",e.getFileState(e.props).hasFile&&e.fileMetadata!==""),i(),l("ngIf",!(e.getFileState(e.props).hasFile&&e.fileMetadata!=="")),i(2),I(e.cn("inline-flex items-center rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover focus-within:ring-2 focus-within:ring-focus-ring-primary",e.disabled?"pointer-events-none cursor-not-allowed":"cursor-pointer")),h("for",e.id),i(),l("ngIf",e.getFileState(e.props).hasFile),i(),l("ngIf",!e.getFileState(e.props).hasFile),i(),h("id",e.id)("name",e.name)("accept",e.accept)("disabled",e.disabled?"":null)("required",e.required?"":null)("aria-invalid",e.getFileState(e.props).hasError),i(),l("ngIf",e.getFileState(e.props).hasFile),i(),l("ngIf",e.showHint))},dependencies:[Q],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let _=x;(typeof ngDevMode>"u"||ngDevMode)&&N(_,[{type:U,args:[{standalone:!1,selector:"spn-input-image-uploader, input-image-uploader",template:`
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
        [class]="cn('flex items-center gap-4 rounded-lg border bg-background-default p-3 shadow-xs transition-colors', getFileState(props).hasError ? 'border-destructive-border focus-within:ring-2 focus-within:ring-focus-ring-error' : 'border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary', disabled && 'cursor-not-allowed opacity-50')"
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
            ><svg
              class="h-8 w-8 text-foreground-subtle"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                [attr.d]="ICON_PATHS.image"
              ></path></svg></ng-container
        ></span>
        <span class="flex min-w-0 flex-1 flex-col gap-2"
          ><span class="truncate text-sm font-medium text-foreground-default"
            ><ng-container
              *ngIf="getFileState(props).hasFile"
              >{{fileName}}</ng-container
            ><ng-container
              *ngIf="!(getFileState(props).hasFile)"
              >{{primaryText}}</ng-container
            ></span
          >
          <span class="truncate text-sm text-foreground-muted"
            ><ng-container
              *ngIf="getFileState(props).hasFile && fileMetadata !== ''"
              >{{fileMetadata}}</ng-container
            ><ng-container
              *ngIf="!(getFileState(props).hasFile && fileMetadata !== '')"
              >{{supportingText}}</ng-container
            ></span
          >
          <span class="flex items-center gap-2"
            ><label
              [attr.for]="id"
              [class]="cn('inline-flex items-center rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover focus-within:ring-2 focus-within:ring-focus-ring-primary', disabled ? 'pointer-events-none cursor-not-allowed' : 'cursor-pointer')"
              ><ng-container *ngIf="getFileState(props).hasFile"
                >Replace</ng-container
              ><ng-container *ngIf="!(getFileState(props).hasFile)"
                >Choose image</ng-container
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
                (change)="!disabled && handleFileSelectEvent($event, onFileNameChange, onFilesChange, onPreviewChange)"
            /></label>
            <ng-container *ngIf="getFileState(props).hasFile"
              ><button
                type="button"
                class="inline-flex items-center rounded-lg px-2 py-0.5 text-sm font-medium text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                [attr.disabled]="(disabled) ? '' : null"
                (click)="!disabled && clearFileInputEvent($event, onFileNameChange, onFilesChange)"
              >
                Remove
              </button></ng-container
            ></span
          ></span
        >
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
    `]}]}],null,{hint:[{type:o}],errorMessage:[{type:o}],className:[{type:o}],showLabel:[{type:o}],label:[{type:o}],id:[{type:o}],required:[{type:o}],disabled:[{type:o}],imageSrc:[{type:o}],primaryText:[{type:o}],fileName:[{type:o}],fileMetadata:[{type:o}],supportingText:[{type:o}],name:[{type:o}],accept:[{type:o}],onFileNameChange:[{type:o}],onFilesChange:[{type:o}],onPreviewChange:[{type:o}],showHint:[{type:o}]});(typeof ngDevMode>"u"||ngDevMode)&&H(_,{className:"InputImageUploader",filePath:"InputImageUploader.ts",lineNumber:169});const b=class b{};a(b,"ɵfac",function(t){return new(t||b)}),a(b,"ɵmod",E({type:b})),a(b,"ɵinj",q({imports:[v]}));let w=b;(typeof ngDevMode>"u"||ngDevMode)&&N(w,[{type:j,args:[{declarations:[_],imports:[v],exports:[_]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&L(w,{declarations:[_],imports:[v],exports:[_]})})();export{w as InputImageUploaderModule,_ as default};

var M=Object.defineProperty;var S=(a,o,t)=>o in a?M(a,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[o]=t;var n=(a,o,t)=>S(a,typeof o!="symbol"?o+"":o,t);import{ɵ as D,a as H,b as E,j as l,d as y,k as N,y as P,z as k,p as d,ao as q,u as T,v as u,t as i,e as g,s as I,I as r,C as j,f as L,N as Z,g as z,i as _,o as p,r as b,m as w,x as O,am as h}from"./core.BqS-lykr.js";import{a as A,l as B,m as G,I as J,b as $}from"./utils.BBpd638g.js";import{C as v,N as V}from"./common_module-chunk.DvGwmKFp.js";function Y(a,o){a&1&&(_(0),l(1,"span",6),p(2,"*"),d(),b())}function K(a,o){if(a&1&&(_(0),l(1,"label",5),p(2),y(3,Y,3,0,"ng-container",0),d(),b()),a&2){const t=w();i(),u("for",t.id),i(),O("",t.label," "),i(),g("ngIf",t.required)}}function Q(a,o){if(a&1&&(_(0),l(1,"span",7)(2,"span",8)(3,"span",9),p(4),d(),l(5,"span"),p(6),d()(),l(7,"span",10),p(8),d()(),b()),a&2){const t=w();i(4),h(t.browseText),i(2),h(t.primaryText),i(2),h(t.supportingText)}}function R(a,o){if(a&1&&(_(0),l(1,"span",12),p(2),d(),b()),a&2){const t=w(2);i(2),h(t.fileMetadata)}}function U(a,o){if(a&1&&(_(0),l(1,"span",7)(2,"span",11),p(3),d(),y(4,R,3,1,"ng-container",0),d(),b()),a&2){const t=w();i(3),h(t.fileName),i(),g("ngIf",t.fileMetadata!=="")}}function W(a,o){if(a&1&&(_(0),l(1,"span"),p(2),d(),b()),a&2){const t=w();i(),T(t.cn("text-sm",t.getFileState(t.props).hasError?"text-destructive-default":"text-foreground-muted")),u("id",t.id+"-hint"),i(),h(t.getFileState(t.props).helpText)}}const s={id:"file-drop-zone",name:"drop-file",label:"Documents",primaryText:"or drag and drop files here",supportingText:"PNG, JPG, or PDF up to 10 MB",browseText:"Browse",fileName:"",fileMetadata:"",hint:"You can upload one file.",errorMessage:"",accept:"image/png,image/jpeg,application/pdf",disabled:!1,required:!1,showLabel:!0,showHint:!0,className:""},m=class m{constructor(){n(this,"hint",s.hint);n(this,"errorMessage",s.errorMessage);n(this,"cn",A);n(this,"getFileState",B);n(this,"handleFileSelectEvent",G);n(this,"ICON_PATHS",J);n(this,"bindControllerProps",$);n(this,"className",s.className);n(this,"showLabel",s.showLabel);n(this,"label",s.label);n(this,"id",s.id);n(this,"required",s.required);n(this,"disabled",s.disabled);n(this,"onFileNameChange");n(this,"onFilesChange");n(this,"browseText",s.browseText);n(this,"primaryText",s.primaryText);n(this,"supportingText",s.supportingText);n(this,"fileName",s.fileName);n(this,"fileMetadata",s.fileMetadata);n(this,"name",s.name);n(this,"accept",s.accept);n(this,"showHint",s.showHint)}get props(){return this}};n(m,"ɵfac",function(t){return new(t||m)}),n(m,"ɵcmp",D({type:m,selectors:[["spn-input-file-drop-zone"],["input-file-drop-zone"]],inputs:{hint:"hint",errorMessage:"errorMessage",className:"className",showLabel:"showLabel",label:"label",id:"id",required:"required",disabled:"disabled",onFileNameChange:"onFileNameChange",onFilesChange:"onFilesChange",browseText:"browseText",primaryText:"primaryText",supportingText:"supportingText",fileName:"fileName",fileMetadata:"fileMetadata",name:"name",accept:"accept",showHint:"showHint"},standalone:!1,decls:9,vars:18,consts:[[4,"ngIf"],[3,"dragover","drop"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-6","w-6","shrink-0","text-foreground-default"],["stroke-linecap","round","stroke-linejoin","round"],["type","file",1,"sr-only",3,"change"],[1,"flex","items-center","gap-1","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],[1,"flex","flex-col","items-center","gap-1"],[1,"inline-flex","flex-wrap","items-center","justify-center","gap-1.5","text-base","text-foreground-default"],[1,"inline-flex","items-center","rounded-lg","bg-secondary-default","px-2","py-0.5","text-sm","font-medium","text-secondary-foreground"],[1,"text-sm","text-foreground-muted"],[1,"text-sm","font-medium","text-foreground-default"],[1,"text-xs","text-foreground-muted"]],template:function(t,e){t&1&&(l(0,"div"),y(1,K,4,3,"ng-container",0),l(2,"label",1),N("dragover",function(x){return x.preventDefault()})("drop",function(x){return!e.disabled&&e.handleFileSelectEvent(x,e.onFileNameChange,e.onFilesChange)}),P(),l(3,"svg",2),k(4,"path",3),d(),y(5,Q,9,3,"ng-container",0)(6,U,5,2,"ng-container",0),q(),l(7,"input",4),N("change",function(x){return!e.disabled&&e.handleFileSelectEvent(x,e.onFileNameChange,e.onFilesChange)}),d()(),y(8,W,3,4,"ng-container",0),d()),t&2&&(T(e.cn("flex w-full flex-col gap-3",e.className)),u("data-ctrl",typeof e.bindControllerProps),i(),g("ngIf",e.showLabel&&e.label!==""),i(),T(e.cn("flex flex-col items-center justify-center gap-3 rounded-lg border bg-background-default px-6 py-6 text-center shadow-sm transition-colors",e.getFileState(e.props).hasError?"border-destructive-default focus-within:ring-2 focus-within:ring-focus-ring-error":"border-border-default border-dashed focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary",e.disabled?"cursor-not-allowed opacity-50":"cursor-pointer")),u("for",e.id),i(2),u("d",e.ICON_PATHS.upload),i(),g("ngIf",!e.getFileState(e.props).hasFile),i(),g("ngIf",e.getFileState(e.props).hasFile),i(),u("id",e.id)("name",e.name)("accept",e.accept)("disabled",e.disabled?"":null)("required",e.required?"":null)("aria-invalid",e.getFileState(e.props).hasError)("aria-describedby",e.showHint?e.id+"-hint":void 0),i(),g("ngIf",e.showHint))},dependencies:[V],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let f=m;(typeof ngDevMode>"u"||ngDevMode)&&I(f,[{type:j,args:[{standalone:!1,selector:"spn-input-file-drop-zone, input-file-drop-zone",template:`
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
      <label
        [attr.for]="id"
        [class]="cn('flex flex-col items-center justify-center gap-3 rounded-lg border bg-background-default px-6 py-6 text-center shadow-sm transition-colors', getFileState(props).hasError ? 'border-destructive-default focus-within:ring-2 focus-within:ring-focus-ring-error' : 'border-border-default border-dashed focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')"
        (dragover)="$event.preventDefault()"
        (drop)="!disabled && handleFileSelectEvent($event, onFileNameChange, onFilesChange)"
        ><svg
          aria-hidden="true"
          class="h-6 w-6 shrink-0 text-foreground-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            [attr.d]="ICON_PATHS.upload"
          ></path>
        </svg>
        <ng-container *ngIf="!getFileState(props).hasFile"
          ><span class="flex flex-col items-center gap-1"
            ><span
              class="inline-flex flex-wrap items-center justify-center gap-1.5 text-base text-foreground-default"
              ><span
                class="inline-flex items-center rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground"
                >{{browseText}}</span
              >
              <span>{{primaryText}}</span></span
            >
            <span
              class="text-sm text-foreground-muted"
              >{{supportingText}}</span
            ></span
          ></ng-container
        >
        <ng-container *ngIf="getFileState(props).hasFile"
          ><span class="flex flex-col items-center gap-1"
            ><span
              class="text-sm font-medium text-foreground-default"
              >{{fileName}}</span
            >
            <ng-container *ngIf="fileMetadata !== ''"
              ><span
                class="text-xs text-foreground-muted"
                >{{fileMetadata}}</span
              ></ng-container
            ></span
          ></ng-container
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
      <ng-container *ngIf="showHint"
        ><span
          [attr.id]="id + '-hint'"
          [class]="cn('text-sm', getFileState(props).hasError ? 'text-destructive-default' : 'text-foreground-muted')"
          >{{getFileState(props).helpText}}</span
        ></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{hint:[{type:r}],errorMessage:[{type:r}],className:[{type:r}],showLabel:[{type:r}],label:[{type:r}],id:[{type:r}],required:[{type:r}],disabled:[{type:r}],onFileNameChange:[{type:r}],onFilesChange:[{type:r}],browseText:[{type:r}],primaryText:[{type:r}],supportingText:[{type:r}],fileName:[{type:r}],fileMetadata:[{type:r}],name:[{type:r}],accept:[{type:r}],showHint:[{type:r}]});(typeof ngDevMode>"u"||ngDevMode)&&L(f,{className:"InputFileDropZone",filePath:"InputFileDropZone.ts",lineNumber:150});const c=class c{};n(c,"ɵfac",function(t){return new(t||c)}),n(c,"ɵmod",H({type:c})),n(c,"ɵinj",E({imports:[v]}));let F=c;(typeof ngDevMode>"u"||ngDevMode)&&I(F,[{type:Z,args:[{declarations:[f],imports:[v],exports:[f]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&z(F,{declarations:[f],imports:[v],exports:[f]})})();export{F as InputFileDropZoneModule,f as default};

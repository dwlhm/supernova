var N=Object.defineProperty;var E=(r,i,e)=>i in r?N(r,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[i]=e;var n=(r,i,e)=>E(r,typeof i!="symbol"?i+"":i,e);import{E as H,ɵ as j,a as P,b as q,j as l,d as y,o as c,p as d,k as T,u as C,v as u,t as a,e as h,am as m,s as M,O as B,I as s,C as O,f as R,N as L,g as A,i as x,r as w,m as _,x as D,h as U,y as I,z as S,ao as V,l as $,n as z}from"./core.BqS-lykr.js";import{a as J,l as G,m as K,I as Q,b as W}from"./utils.BBpd638g.js";import{C as F,a as X,N as Y}from"./common_module-chunk.DvGwmKFp.js";function Z(r,i){r&1&&(x(0),l(1,"span",7),c(2,"*"),d(),w())}function ee(r,i){if(r&1&&(x(0),l(1,"span",4)(2,"label",5),c(3),y(4,Z,3,0,"ng-container",0),d(),l(5,"span",6),c(6),d()(),w()),r&2){const e=_();a(2),u("for",e.id),a(),D("",e.label," "),a(),h("ngIf",e.required),a(2),m(e.fileCount)}}function te(r,i){if(r&1){const e=U();x(0),l(1,"li",10)(2,"span",11),I(),l(3,"svg",12),S(4,"path",13),d(),V(),l(5,"span",14)(6,"span",15),c(7),d(),l(8,"span",16),c(9),d()()(),l(10,"button",17),T("click",function(){const k=$(e).$implicit,b=_(2);return z(!b.disabled&&b.onRemove&&b.onRemove.emit(k.id))}),I(),l(11,"svg",18),S(12,"path",19),d()()(),w()}if(r&2){const e=i.$implicit,t=_(2);a(4),u("d",t.ICON_PATHS.file),a(3),m(e.name),a(2),m(e.status),a(),u("disabled",t.disabled?"":null)("aria-label","Remove "+e.name),a(2),u("d",t.ICON_PATHS.close)}}function ne(r,i){if(r&1&&(x(0),l(1,"ul",8),y(2,te,13,6,"ng-container",9),d(),w()),r&2){const e=_();a(2),h("ngForOf",e.getFileState(e.props).files)("ngForTrackBy",e.trackByFile0)}}function re(r,i){if(r&1&&(x(0),l(1,"span"),c(2),d(),w()),r&2){const e=_();a(),C(e.cn("text-sm",e.getFileState(e.props).hasError?"text-destructive-default":"text-foreground-muted")),u("id",e.id+"-hint"),a(),m(e.getFileState(e.props).helpText)}}const o={id:"multiple-file-upload",name:"files",label:"Attachments",instruction:"Choose one or more files",browseText:"Browse",files:[],fileCount:"0 of 5",hint:"Up to 5 files, 10 MB each.",errorMessage:"",accept:"image/png,image/jpeg,application/pdf,application/zip",disabled:!1,required:!0,showLabel:!0,showHint:!0,className:""},g=class g{constructor(){n(this,"files",o.files);n(this,"hint",o.hint);n(this,"errorMessage",o.errorMessage);n(this,"cn",J);n(this,"getFileState",G);n(this,"handleFileSelectEvent",K);n(this,"ICON_PATHS",Q);n(this,"bindControllerProps",W);n(this,"className",o.className);n(this,"showLabel",o.showLabel);n(this,"label",o.label);n(this,"id",o.id);n(this,"required",o.required);n(this,"fileCount",o.fileCount);n(this,"disabled",o.disabled);n(this,"instruction",o.instruction);n(this,"browseText",o.browseText);n(this,"name",o.name);n(this,"accept",o.accept);n(this,"onFilesChange");n(this,"showHint",o.showHint);n(this,"onRemove",new H)}get props(){return this}trackByFile0(i,e){return e.id}};n(g,"ɵfac",function(e){return new(e||g)}),n(g,"ɵcmp",j({type:g,selectors:[["spn-input-multiple-file-upload"],["input-multiple-file-upload"]],inputs:{files:"files",hint:"hint",errorMessage:"errorMessage",className:"className",showLabel:"showLabel",label:"label",id:"id",required:"required",fileCount:"fileCount",disabled:"disabled",instruction:"instruction",browseText:"browseText",name:"name",accept:"accept",onFilesChange:"onFilesChange",showHint:"showHint"},outputs:{onRemove:"onRemove"},standalone:!1,decls:10,vars:18,consts:[[4,"ngIf"],[1,"flex-1","truncate","text-base","text-foreground-muted"],[1,"inline-flex","shrink-0","items-center","justify-center","rounded-lg","bg-secondary-default","px-3","py-1","text-sm","font-medium","text-secondary-foreground","hover:bg-secondary-hover"],["type","file",1,"sr-only",3,"change"],[1,"flex","items-center","justify-between","gap-3"],[1,"flex","items-center","gap-1","text-sm","font-medium","text-foreground-default"],[1,"text-sm","text-foreground-muted"],["aria-hidden","true",1,"text-destructive-default"],[1,"flex","flex-col","gap-2"],[4,"ngFor","ngForOf","ngForTrackBy"],[1,"flex","items-center","justify-between","gap-2","rounded-md","border","border-border-default","bg-background-subtle","p-3"],[1,"flex","min-w-0","items-center","gap-2"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4","shrink-0","text-foreground-muted"],["stroke-linecap","round","stroke-linejoin","round"],[1,"flex","min-w-0","flex-col"],[1,"truncate","text-sm","font-medium","text-foreground-default"],[1,"truncate","text-xs","text-foreground-muted"],["type","button",1,"inline-flex","h-6","w-6","shrink-0","items-center","justify-center","rounded-full","text-foreground-muted","hover:bg-background-muted","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2",1,"h-3.5","w-3.5"],["stroke-linecap","round"]],template:function(e,t){e&1&&(l(0,"div"),y(1,ee,7,4,"ng-container",0),l(2,"label")(3,"span",1),c(4),d(),l(5,"span",2),c(6),d(),l(7,"input",3),T("change",function(b){return!t.disabled&&t.handleFileSelectEvent(b,void 0,t.onFilesChange)}),d()(),y(8,ne,3,2,"ng-container",0)(9,re,3,4,"ng-container",0),d()),e&2&&(C(t.cn("flex w-full flex-col gap-3",t.className)),u("data-ctrl",typeof t.bindControllerProps),a(),h("ngIf",t.showLabel&&t.label!==""),a(),C(t.cn("flex h-[52px] w-full items-center gap-3 rounded-lg border bg-background-default px-3 shadow-sm transition-colors",t.getFileState(t.props).hasError?"border-destructive-default focus-within:ring-2 focus-within:ring-focus-ring-error":"border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary",t.disabled?"pointer-events-none cursor-not-allowed opacity-50":"cursor-pointer")),u("for",t.id),a(2),m(t.instruction),a(2),m(t.browseText),a(),u("id",t.id)("name",t.name)("multiple","")("accept",t.accept)("disabled",t.disabled?"":null)("required",t.required?"":null)("aria-invalid",t.getFileState(t.props).hasError),a(),h("ngIf",t.getFileState(t.props).files.length>0),a(),h("ngIf",t.showHint))},dependencies:[X,Y],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let p=g;(typeof ngDevMode>"u"||ngDevMode)&&M(p,[{type:O,args:[{standalone:!1,selector:"spn-input-multiple-file-upload, input-multiple-file-upload",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-3', className)"
    >
      <ng-container *ngIf="showLabel && label !== ''"
        ><span class="flex items-center justify-between gap-3"
          ><label
            class="flex items-center gap-1 text-sm font-medium text-foreground-default"
            [attr.for]="id"
            >{{label}}
            <ng-container *ngIf="required"
              ><span aria-hidden="true" class="text-destructive-default"
                >*</span
              ></ng-container
            ></label
          >
          <span class="text-sm text-foreground-muted">{{fileCount}}</span></span
        ></ng-container
      >
      <label
        [attr.for]="id"
        [class]="cn('flex h-[52px] w-full items-center gap-3 rounded-lg border bg-background-default px-3 shadow-sm transition-colors', getFileState(props).hasError ? 'border-destructive-default focus-within:ring-2 focus-within:ring-focus-ring-error' : 'border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary', disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer')"
        ><span
          class="flex-1 truncate text-base text-foreground-muted"
          >{{instruction}}</span
        >
        <span
          class="inline-flex shrink-0 items-center justify-center rounded-lg bg-secondary-default px-3 py-1 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover"
          >{{browseText}}</span
        >
        <input
          type="file"
          class="sr-only"
          [attr.id]="id"
          [attr.name]="name"
          [attr.multiple]="(true) ? '' : null"
          [attr.accept]="accept"
          [attr.disabled]="(disabled) ? '' : null"
          [attr.required]="(required) ? '' : null"
          [attr.aria-invalid]="getFileState(props).hasError"
          (change)="!disabled && handleFileSelectEvent($event, undefined, onFilesChange)"
      /></label>
      <ng-container *ngIf="getFileState(props).files.length > 0"
        ><ul class="flex flex-col gap-2">
          <ng-container
            *ngFor="let file of getFileState(props).files; trackBy: trackByFile0"
            ><li
              class="flex items-center justify-between gap-2 rounded-md border border-border-default bg-background-subtle p-3"
            >
              <span class="flex min-w-0 items-center gap-2"
                ><svg
                  aria-hidden="true"
                  class="h-4 w-4 shrink-0 text-foreground-muted"
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
                <span class="flex min-w-0 flex-col"
                  ><span
                    class="truncate text-sm font-medium text-foreground-default"
                    >{{file.name}}</span
                  >
                  <span
                    class="truncate text-xs text-foreground-muted"
                    >{{file.status}}</span
                  ></span
                ></span
              >
              <button
                type="button"
                class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-foreground-muted hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                [attr.disabled]="(disabled) ? '' : null"
                [attr.aria-label]="'Remove ' + file.name"
                (click)="!disabled && onRemove && this.onRemove.emit(file.id)"
              >
                <svg
                  aria-hidden="true"
                  class="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    [attr.d]="ICON_PATHS.close"
                  ></path>
                </svg>
              </button></li
          ></ng-container></ul
      ></ng-container>
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
    `]}]}],null,{files:[{type:s}],hint:[{type:s}],errorMessage:[{type:s}],className:[{type:s}],showLabel:[{type:s}],label:[{type:s}],id:[{type:s}],required:[{type:s}],fileCount:[{type:s}],disabled:[{type:s}],instruction:[{type:s}],browseText:[{type:s}],name:[{type:s}],accept:[{type:s}],onFilesChange:[{type:s}],showHint:[{type:s}],onRemove:[{type:B}]});(typeof ngDevMode>"u"||ngDevMode)&&R(p,{className:"InputMultipleFileUpload",filePath:"InputMultipleFileUpload.ts",lineNumber:174});const f=class f{};n(f,"ɵfac",function(e){return new(e||f)}),n(f,"ɵmod",P({type:f})),n(f,"ɵinj",q({imports:[F]}));let v=f;(typeof ngDevMode>"u"||ngDevMode)&&M(v,[{type:L,args:[{declarations:[p],imports:[F],exports:[p]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&A(v,{declarations:[p],imports:[F],exports:[p]})})();export{v as InputMultipleFileUploadModule,p as default};

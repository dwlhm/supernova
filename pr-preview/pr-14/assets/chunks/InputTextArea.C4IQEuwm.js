var H=Object.defineProperty;var M=(n,s,e)=>s in n?H(n,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[s]=e;var r=(n,s,e)=>M(n,typeof s!="symbol"?s+"":s,e);import{E as T,ɵ as V,a as q,b as P,c as B,j as u,d as g,k as j,p as d,u as h,v as b,t as o,e as l,s as k,O as S,I as a,C as F,f as D,N as R,g as z,i as p,o as y,r as c,m as f,x as $,q as E,y as L,z as O,ao as N,A}from"./core.vpEFnhB-.js";import{a as G,G as J,H as K,I as Q,d as U}from"./theme.CecfD-Na.js";import{C,N as W,a as X}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const Y=[[["","leftIcon",""],["","slot","lefticon"]],[["","rightIcon",""],["","slot","righticon"]]],Z=["[leftIcon],[slot=leftIcon]","[rightIcon],[slot=rightIcon]"];function ee(n,s){n&1&&(p(0),u(1,"span",3),y(2,"*"),d(),c())}function te(n,s){if(n&1&&(p(0),u(1,"label",2),y(2),g(3,ee,3,0,"ng-container",0),d(),c()),n&2){const e=f();o(),b("for",e.id),o(),$("",e.label," "),o(),l("ngIf",e.required)}}function ne(n,s){n&1&&A(0)}function re(n,s){if(n&1&&(p(0),g(1,ne,1,0,"ng-container",4),c()),n&2){const e=f(2);o(),l("ngComponentOutlet",e.leftIcon)}}function oe(n,s){if(n&1&&(p(0),u(1,"span"),g(2,re,2,1,"ng-container",0),E(3),d(),c()),n&2){const e=f();o(),h(e.cn("mt-2 inline-flex shrink-0",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),o(),l("ngIf",e.leftIcon)}}function ae(n,s){if(n&1&&(p(0),L(),u(1,"svg",5),O(2,"path",6),d(),c()),n&2){const e=f();o(),h(e.cn("mt-2 h-4 w-4 shrink-0",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),o(),b("d",e.ICON_PATHS.file)}}function se(n,s){n&1&&A(0)}function ie(n,s){if(n&1&&(p(0),g(1,se,1,0,"ng-container",4),c()),n&2){const e=f(2);o(),l("ngComponentOutlet",e.rightIcon)}}function le(n,s){if(n&1&&(p(0),u(1,"span"),g(2,ie,2,1,"ng-container",0),E(3,1),d(),c()),n&2){const e=f();o(),h(e.cn("mt-2 inline-flex shrink-0",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),o(),l("ngIf",e.rightIcon)}}function ue(n,s){if(n&1&&(p(0),L(),u(1,"svg",5),O(2,"path",6),d(),c()),n&2){const e=f();o(),h(e.cn("mt-2 h-4 w-4 shrink-0",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),o(),b("d",e.ICON_PATHS.checkCircle)}}function de(n,s){if(n&1&&(p(0),u(1,"span"),y(2),d(),c()),n&2){const e=f(2);o(),h(e.cn("text-sm",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),b("id",e.id+"-hint"),o(),N(e.getInputState(e.props).helpText)}}function pe(n,s){if(n&1&&(p(0),u(1,"span"),y(2),d(),c()),n&2){const e=f(2);o(),h(e.cn("ml-auto shrink-0 text-sm",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),o(),N(e.getInputState(e.props).countText)}}function ce(n,s){if(n&1&&(p(0),u(1,"div",7),g(2,de,3,4,"ng-container",0)(3,pe,3,3,"ng-container",0),d(),c()),n&2){const e=f();o(2),l("ngIf",(e.showHint||e.getInputState(e.props).hasError)&&e.getInputState(e.props).helpText!==""),o(),l("ngIf",e.showCharacterCount)}}const i={value:"",defaultValue:"",name:"input-textarea",id:"input-textarea",label:"",placeholder:"",hint:"",error:!1,errorMessage:"",validating:!1,disabled:!1,readOnly:!1,required:!1,rows:4,showLabel:!0,showHint:!0,showCharacterCount:!0,maxLength:200,showLeftIcon:!1,showRightIcon:!1,className:""},m=class m{constructor(){r(this,"defaultValue",i.defaultValue);r(this,"hint",i.hint);r(this,"error",i.error);r(this,"errorMessage",i.errorMessage);r(this,"validating",i.validating);r(this,"cn",G);r(this,"getInputState",J);r(this,"handleTextInput",K);r(this,"ICON_PATHS",Q);r(this,"bindControllerProps",U);r(this,"className",i.className);r(this,"showLabel",i.showLabel);r(this,"label",i.label);r(this,"id",i.id);r(this,"required",i.required);r(this,"disabled",i.disabled);r(this,"leftIcon");r(this,"showLeftIcon",i.showLeftIcon);r(this,"name",i.name);r(this,"rows",i.rows);r(this,"value",i.value);r(this,"placeholder",i.placeholder);r(this,"maxLength",i.maxLength);r(this,"readOnly",i.readOnly);r(this,"showHint",i.showHint);r(this,"onValueChange");r(this,"onChange");r(this,"rightIcon");r(this,"showRightIcon",i.showRightIcon);r(this,"showCharacterCount",i.showCharacterCount);r(this,"onBlur",new T);r(this,"onFocus",new T)}get props(){return this}};r(m,"ɵfac",function(e){return new(e||m)}),r(m,"ɵcmp",V({type:m,selectors:[["kd-input-text-area"],["input-text-area"]],inputs:{defaultValue:"defaultValue",hint:"hint",error:"error",errorMessage:"errorMessage",validating:"validating",className:"className",showLabel:"showLabel",label:"label",id:"id",required:"required",disabled:"disabled",leftIcon:"leftIcon",showLeftIcon:"showLeftIcon",name:"name",rows:"rows",value:"value",placeholder:"placeholder",maxLength:"maxLength",readOnly:"readOnly",showHint:"showHint",onValueChange:"onValueChange",onChange:"onChange",rightIcon:"rightIcon",showRightIcon:"showRightIcon",showCharacterCount:"showCharacterCount"},outputs:{onBlur:"onBlur",onFocus:"onFocus"},standalone:!1,ngContentSelectors:Z,decls:9,vars:23,consts:[[4,"ngIf"],[1,"w-full","resize-y","bg-transparent","py-2","text-base","text-foreground-default","outline-none","placeholder:text-foreground-subtle","disabled:cursor-not-allowed",3,"input","blur","focus"],[1,"flex","items-center","gap-2","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],[4,"ngComponentOutlet"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["stroke-linecap","round","stroke-linejoin","round"],[1,"flex","items-center","justify-between","gap-2.5"]],template:function(e,t){e&1&&(B(Y),u(0,"div"),g(1,te,4,3,"ng-container",0),u(2,"div"),g(3,oe,4,3,"ng-container",0)(4,ae,3,3,"ng-container",0),u(5,"textarea",1),j("input",function(x){return t.handleTextInput(x,t.disabled,t.onValueChange,t.onChange)})("blur",function(x){return!t.disabled&&t.onBlur&&t.onBlur.emit(x)})("focus",function(x){return!t.disabled&&t.onFocus&&t.onFocus.emit(x)}),d(),g(6,le,4,3,"ng-container",0)(7,ue,3,3,"ng-container",0),d(),g(8,ce,4,2,"ng-container",0),d()),e&2&&(h(t.cn("flex w-full flex-col gap-3",t.className)),b("data-ctrl",typeof t.bindControllerProps),o(),l("ngIf",t.showLabel&&t.label!==""),o(),h(t.cn("flex items-start gap-3 rounded-lg border px-3 py-1 shadow-sm transition-colors",t.disabled?"border-border-default bg-background-muted cursor-not-allowed opacity-50":t.getInputState(t.props).hasError?"border-destructive-border bg-background-default ring-2 ring-focus-ring-error":"border-border-default bg-background-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary")),o(),l("ngIf",t.leftIcon),o(),l("ngIf",t.showLeftIcon&&!t.leftIcon),o(),b("id",t.id)("name",t.name)("rows",t.rows)("value",t.value)("placeholder",t.placeholder)("maxLength",t.maxLength)("disabled",t.disabled?"":null)("readOnly",t.readOnly)("required",t.required?"":null)("aria-invalid",t.getInputState(t.props).hasError)("aria-busy",t.getInputState(t.props).isValidating||void 0)("aria-describedby",(t.showHint||t.getInputState(t.props).hasError)&&t.getInputState(t.props).helpText!==""?t.id+"-hint":void 0),o(),l("ngIf",t.rightIcon),o(),l("ngIf",t.showRightIcon&&!t.rightIcon),o(),l("ngIf",(t.showHint||t.getInputState(t.props).hasError)&&t.getInputState(t.props).helpText!==""||t.showCharacterCount))},dependencies:[W,X],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let _=m;(typeof ngDevMode>"u"||ngDevMode)&&k(_,[{type:F,args:[{standalone:!1,selector:"kd-input-text-area, input-text-area",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-3', className)"
    >
      <ng-container *ngIf="showLabel && label !== ''"
        ><label
          class="flex items-center gap-2 text-sm font-medium text-foreground-default"
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
        [class]="cn('flex items-start gap-3 rounded-lg border px-3 py-1 shadow-sm transition-colors', disabled ? 'border-border-default bg-background-muted cursor-not-allowed opacity-50' : getInputState(props).hasError ? 'border-destructive-border bg-background-default ring-2 ring-focus-ring-error' : 'border-border-default bg-background-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary')"
      >
        <ng-container *ngIf="leftIcon"
          ><span
            [class]="cn('mt-2 inline-flex shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
            ><ng-container *ngIf="leftIcon"><ng-container *ngComponentOutlet="leftIcon"></ng-container></ng-container><ng-content select="[leftIcon],[slot=leftIcon]"></ng-content></span
          ></ng-container
        >
        <ng-container *ngIf="showLeftIcon && !leftIcon"
          ><svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            [class]="cn('mt-2 h-4 w-4 shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="ICON_PATHS.file"
            ></path></svg
        ></ng-container>
        <textarea
          class="w-full resize-y bg-transparent py-2 text-base text-foreground-default outline-none placeholder:text-foreground-subtle disabled:cursor-not-allowed"
          [attr.id]="id"
          [attr.name]="name"
          [attr.rows]="rows"
          [attr.value]="value"
          [attr.placeholder]="placeholder"
          [attr.maxLength]="maxLength"
          [attr.disabled]="(disabled) ? '' : null"
          [attr.readOnly]="readOnly"
          [attr.required]="(required) ? '' : null"
          [attr.aria-invalid]="getInputState(props).hasError"
          [attr.aria-busy]="getInputState(props).isValidating || undefined"
          [attr.aria-describedby]="(showHint || getInputState(props).hasError) && getInputState(props).helpText !== '' ? id + '-hint' : undefined"
          (input)="handleTextInput($event, disabled, onValueChange, onChange)"
          (blur)="!disabled && onBlur && this.onBlur.emit($event)"
          (focus)="!disabled && onFocus && this.onFocus.emit($event)"
        ></textarea>
        <ng-container *ngIf="rightIcon"
          ><span
            [class]="cn('mt-2 inline-flex shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
            ><ng-container *ngIf="rightIcon"><ng-container *ngComponentOutlet="rightIcon"></ng-container></ng-container><ng-content select="[rightIcon],[slot=rightIcon]"></ng-content></span
          ></ng-container
        >
        <ng-container *ngIf="showRightIcon && !rightIcon"
          ><svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            [class]="cn('mt-2 h-4 w-4 shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="ICON_PATHS.checkCircle"
            ></path></svg
        ></ng-container>
      </div>
      <ng-container
        *ngIf="(showHint || getInputState(props).hasError) && getInputState(props).helpText !== '' || showCharacterCount"
        ><div class="flex items-center justify-between gap-2.5">
          <ng-container
            *ngIf="(showHint || getInputState(props).hasError) && getInputState(props).helpText !== ''"
            ><span
              [attr.id]="id + '-hint'"
              [class]="cn('text-sm', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
              >{{getInputState(props).helpText}}</span
            ></ng-container
          >
          <ng-container *ngIf="showCharacterCount"
            ><span
              [class]="cn('ml-auto shrink-0 text-sm', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
              >{{getInputState(props).countText}}</span
            ></ng-container
          >
        </div></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{defaultValue:[{type:a}],hint:[{type:a}],error:[{type:a}],errorMessage:[{type:a}],validating:[{type:a}],className:[{type:a}],showLabel:[{type:a}],label:[{type:a}],id:[{type:a}],required:[{type:a}],disabled:[{type:a}],leftIcon:[{type:a}],showLeftIcon:[{type:a}],name:[{type:a}],rows:[{type:a}],value:[{type:a}],placeholder:[{type:a}],maxLength:[{type:a}],readOnly:[{type:a}],showHint:[{type:a}],onValueChange:[{type:a}],onChange:[{type:a}],rightIcon:[{type:a}],showRightIcon:[{type:a}],showCharacterCount:[{type:a}],onBlur:[{type:S}],onFocus:[{type:S}]});(typeof ngDevMode>"u"||ngDevMode)&&D(_,{className:"InputTextArea",filePath:"InputTextArea.ts",lineNumber:179});const I=class I{};r(I,"ɵfac",function(e){return new(e||I)}),r(I,"ɵmod",q({type:I})),r(I,"ɵinj",P({imports:[C]}));let w=I;(typeof ngDevMode>"u"||ngDevMode)&&k(w,[{type:R,args:[{declarations:[_],imports:[C],exports:[_]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&z(w,{declarations:[_],imports:[C],exports:[_]})})();export{w as InputTextAreaModule,_ as default};

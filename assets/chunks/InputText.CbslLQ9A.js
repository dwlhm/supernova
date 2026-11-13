var V=Object.defineProperty;var M=(n,i,e)=>i in n?V(n,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[i]=e;var r=(n,i,e)=>M(n,typeof i!="symbol"?i+"":i,e);import{E as k,ɵ as P,a as q,b as B,c as F,j as u,d as f,k as j,p,u as h,v as m,t as o,e as l,s as O,O as E,I as a,C as A,f as D,N as R,g as $,i as d,o as y,r as g,m as c,x as G,q as L,y as v,z as C,ao as N,A as H}from"./core.vpEFnhB-.js";import{a as J,G as z,H as K,I as Q,d as U}from"./theme.CMj9otVT.js";import{C as S,N as W,a as X}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const Y=[[["","leftIcon",""],["","slot","lefticon"]],[["","rightIcon",""],["","slot","righticon"]]],Z=["[leftIcon],[slot=leftIcon]","[rightIcon],[slot=rightIcon]"];function ee(n,i){n&1&&(d(0),u(1,"span",3),y(2,"*"),p(),g())}function te(n,i){if(n&1&&(d(0),u(1,"label",2),y(2),f(3,ee,3,0,"ng-container",0),p(),g()),n&2){const e=c();o(),m("for",e.id),o(),G("",e.label," "),o(),l("ngIf",e.required)}}function ne(n,i){n&1&&H(0)}function re(n,i){if(n&1&&(d(0),f(1,ne,1,0,"ng-container",4),g()),n&2){const e=c(2);o(),l("ngComponentOutlet",e.leftIcon)}}function oe(n,i){if(n&1&&(d(0),u(1,"span"),f(2,re,2,1,"ng-container",0),L(3),p(),g()),n&2){const e=c();o(),h(e.cn("inline-flex shrink-0",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),o(),l("ngIf",e.leftIcon)}}function ae(n,i){if(n&1&&(d(0),v(),u(1,"svg",5),C(2,"path",6),p(),g()),n&2){const e=c();o(),h(e.cn("h-4 w-4 shrink-0",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),o(),m("d",e.ICON_PATHS.search)}}function ie(n,i){if(n&1&&(d(0),v(),u(1,"svg",7),C(2,"path",6),p(),g()),n&2){const e=c();o(2),m("d",e.ICON_PATHS.loader)}}function se(n,i){n&1&&H(0)}function le(n,i){if(n&1&&(d(0),f(1,se,1,0,"ng-container",4),g()),n&2){const e=c(2);o(),l("ngComponentOutlet",e.rightIcon)}}function ue(n,i){if(n&1&&(d(0),u(1,"span"),f(2,le,2,1,"ng-container",0),L(3,1),p(),g()),n&2){const e=c();o(),h(e.cn("inline-flex shrink-0",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),o(),l("ngIf",e.rightIcon)}}function pe(n,i){if(n&1&&(d(0),v(),u(1,"svg",5),C(2,"path",8),p(),g()),n&2){const e=c();o(),h(e.cn("h-4 w-4 shrink-0",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),o(),m("d",e.ICON_PATHS.checkCircle)}}function de(n,i){if(n&1&&(d(0),u(1,"span"),y(2),p(),g()),n&2){const e=c(2);o(),h(e.cn("text-sm",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),m("id",e.id+"-hint"),o(),N(e.getInputState(e.props).helpText)}}function ge(n,i){if(n&1&&(d(0),u(1,"span"),y(2),p(),g()),n&2){const e=c(2);o(),h(e.cn("ml-auto shrink-0 text-sm",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),o(),N(e.getInputState(e.props).countText)}}function ce(n,i){if(n&1&&(d(0),u(1,"div",9),f(2,de,3,4,"ng-container",0)(3,ge,3,3,"ng-container",0),p(),g()),n&2){const e=c();o(2),l("ngIf",(e.showHint||e.getInputState(e.props).hasError)&&e.getInputState(e.props).helpText!==""),o(),l("ngIf",e.showCharacterCount)}}const s={value:"",defaultValue:"",name:"input-text",id:"input-text",type:"text",label:"",placeholder:"",hint:"",error:!1,errorMessage:"",validating:!1,disabled:!1,readOnly:!1,required:!1,showLabel:!0,showHint:!0,showCharacterCount:!1,maxLength:200,showLeftIcon:!1,showRightIcon:!1,className:""},b=class b{constructor(){r(this,"defaultValue",s.defaultValue);r(this,"hint",s.hint);r(this,"error",s.error);r(this,"errorMessage",s.errorMessage);r(this,"validating",s.validating);r(this,"cn",J);r(this,"getInputState",z);r(this,"handleTextInput",K);r(this,"ICON_PATHS",Q);r(this,"bindControllerProps",U);r(this,"className",s.className);r(this,"showLabel",s.showLabel);r(this,"label",s.label);r(this,"id",s.id);r(this,"required",s.required);r(this,"disabled",s.disabled);r(this,"leftIcon");r(this,"showLeftIcon",s.showLeftIcon);r(this,"name",s.name);r(this,"type",s.type);r(this,"value",s.value);r(this,"placeholder",s.placeholder);r(this,"maxLength",s.maxLength);r(this,"readOnly",s.readOnly);r(this,"showHint",s.showHint);r(this,"onValueChange");r(this,"onChange");r(this,"rightIcon");r(this,"showRightIcon",s.showRightIcon);r(this,"showCharacterCount",s.showCharacterCount);r(this,"onBlur",new k);r(this,"onFocus",new k)}get props(){return this}};r(b,"ɵfac",function(e){return new(e||b)}),r(b,"ɵcmp",P({type:b,selectors:[["kd-input-text"],["input-text"]],inputs:{defaultValue:"defaultValue",hint:"hint",error:"error",errorMessage:"errorMessage",validating:"validating",className:"className",showLabel:"showLabel",label:"label",id:"id",required:"required",disabled:"disabled",leftIcon:"leftIcon",showLeftIcon:"showLeftIcon",name:"name",type:"type",value:"value",placeholder:"placeholder",maxLength:"maxLength",readOnly:"readOnly",showHint:"showHint",onValueChange:"onValueChange",onChange:"onChange",rightIcon:"rightIcon",showRightIcon:"showRightIcon",showCharacterCount:"showCharacterCount"},outputs:{onBlur:"onBlur",onFocus:"onFocus"},standalone:!1,ngContentSelectors:Z,decls:10,vars:24,consts:[[4,"ngIf"],[1,"h-9","w-full","bg-transparent","text-base","text-foreground-default","outline-none","placeholder:text-foreground-subtle","disabled:cursor-not-allowed",3,"input","blur","focus"],[1,"flex","items-center","gap-2","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],[4,"ngComponentOutlet"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["stroke-linecap","round"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2",1,"h-4","w-4","shrink-0","animate-spin","text-foreground-muted"],["stroke-linecap","round","stroke-linejoin","round"],[1,"flex","items-start","justify-between","gap-2.5"]],template:function(e,t){e&1&&(F(Y),u(0,"div"),f(1,te,4,3,"ng-container",0),u(2,"div"),f(3,oe,4,3,"ng-container",0)(4,ae,3,3,"ng-container",0),u(5,"input",1),j("input",function(x){return t.handleTextInput(x,t.disabled,t.onValueChange,t.onChange)})("blur",function(x){return!t.disabled&&t.onBlur&&t.onBlur.emit(x)})("focus",function(x){return!t.disabled&&t.onFocus&&t.onFocus.emit(x)}),p(),f(6,ie,3,1,"ng-container",0)(7,ue,4,3,"ng-container",0)(8,pe,3,3,"ng-container",0),p(),f(9,ce,4,2,"ng-container",0),p()),e&2&&(h(t.cn("flex w-full flex-col gap-3",t.className)),m("data-ctrl",typeof t.bindControllerProps),o(),l("ngIf",t.showLabel&&t.label!==""),o(),h(t.cn("flex items-center gap-3 rounded-lg border px-3 shadow-xs transition-colors",t.disabled?"border-border-default bg-background-muted cursor-not-allowed opacity-50":t.getInputState(t.props).hasError?"border-destructive-border bg-background-default ring-2 ring-focus-ring-error":"border-border-default bg-background-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary")),o(),l("ngIf",t.leftIcon),o(),l("ngIf",t.showLeftIcon&&!t.leftIcon),o(),m("id",t.id)("name",t.name)("type",t.type)("value",t.value)("placeholder",t.placeholder)("maxLength",t.maxLength)("disabled",t.disabled?"":null)("readOnly",t.readOnly)("required",t.required?"":null)("aria-invalid",t.getInputState(t.props).hasError)("aria-busy",t.getInputState(t.props).isValidating||void 0)("aria-describedby",(t.showHint||t.getInputState(t.props).hasError)&&t.getInputState(t.props).helpText!==""?t.id+"-hint":void 0),o(),l("ngIf",t.getInputState(t.props).isValidating),o(),l("ngIf",!t.getInputState(t.props).isValidating&&t.rightIcon),o(),l("ngIf",!t.getInputState(t.props).isValidating&&t.showRightIcon&&!t.rightIcon),o(),l("ngIf",(t.showHint||t.getInputState(t.props).hasError)&&t.getInputState(t.props).helpText!==""||t.showCharacterCount))},dependencies:[W,X],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let _=b;(typeof ngDevMode>"u"||ngDevMode)&&O(_,[{type:A,args:[{standalone:!1,selector:"kd-input-text, input-text",template:`
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
        [class]="cn('flex items-center gap-3 rounded-lg border px-3 shadow-xs transition-colors', disabled ? 'border-border-default bg-background-muted cursor-not-allowed opacity-50' : getInputState(props).hasError ? 'border-destructive-border bg-background-default ring-2 ring-focus-ring-error' : 'border-border-default bg-background-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary')"
      >
        <ng-container *ngIf="leftIcon"
          ><span
            [class]="cn('inline-flex shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
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
            [class]="cn('h-4 w-4 shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
          >
            <path
              stroke-linecap="round"
              [attr.d]="ICON_PATHS.search"
            ></path></svg
        ></ng-container>
        <input
          class="h-9 w-full bg-transparent text-base text-foreground-default outline-none placeholder:text-foreground-subtle disabled:cursor-not-allowed"
          [attr.id]="id"
          [attr.name]="name"
          [attr.type]="type"
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
        />
        <ng-container *ngIf="getInputState(props).isValidating"
          ><svg
            aria-hidden="true"
            class="h-4 w-4 shrink-0 animate-spin text-foreground-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              [attr.d]="ICON_PATHS.loader"
            ></path></svg
        ></ng-container>
        <ng-container *ngIf="!getInputState(props).isValidating && rightIcon"
          ><span
            [class]="cn('inline-flex shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
            ><ng-container *ngIf="rightIcon"><ng-container *ngComponentOutlet="rightIcon"></ng-container></ng-container><ng-content select="[rightIcon],[slot=rightIcon]"></ng-content></span
          ></ng-container
        >
        <ng-container
          *ngIf="!getInputState(props).isValidating && showRightIcon && !rightIcon"
          ><svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            [class]="cn('h-4 w-4 shrink-0', getInputState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
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
        ><div class="flex items-start justify-between gap-2.5">
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
    `]}]}],null,{defaultValue:[{type:a}],hint:[{type:a}],error:[{type:a}],errorMessage:[{type:a}],validating:[{type:a}],className:[{type:a}],showLabel:[{type:a}],label:[{type:a}],id:[{type:a}],required:[{type:a}],disabled:[{type:a}],leftIcon:[{type:a}],showLeftIcon:[{type:a}],name:[{type:a}],type:[{type:a}],value:[{type:a}],placeholder:[{type:a}],maxLength:[{type:a}],readOnly:[{type:a}],showHint:[{type:a}],onValueChange:[{type:a}],onChange:[{type:a}],rightIcon:[{type:a}],showRightIcon:[{type:a}],showCharacterCount:[{type:a}],onBlur:[{type:E}],onFocus:[{type:E}]});(typeof ngDevMode>"u"||ngDevMode)&&D(_,{className:"InputText",filePath:"InputText.ts",lineNumber:193});const I=class I{};r(I,"ɵfac",function(e){return new(e||I)}),r(I,"ɵmod",q({type:I})),r(I,"ɵinj",B({imports:[S]}));let w=I;(typeof ngDevMode>"u"||ngDevMode)&&O(w,[{type:R,args:[{declarations:[_],imports:[S],exports:[_]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&$(w,{declarations:[_],imports:[S],exports:[_]})})();export{w as InputTextModule,_ as default};

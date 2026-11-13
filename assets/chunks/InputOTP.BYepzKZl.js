var k=Object.defineProperty;var P=(a,r,t)=>r in a?k(a,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[r]=t;var n=(a,r,t)=>P(a,typeof r!="symbol"?r+"":r,t);import{E as N,ɵ as D,a as B,b as V,j as f,d as _,k as T,p as m,u as E,v,t as d,e as b,s as M,O as F,I as o,C as H,f as q,N as L,g as $,i as x,o as I,r as w,m as c,x as K,h as j,l as O,n as C,ao as J}from"./core.vpEFnhB-.js";import{a as z,E as A,C as G,D as Q,F as R,d as U}from"./theme.CMj9otVT.js";import{C as S,b as W,a as X}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";function Y(a,r){a&1&&(x(0),f(1,"span",4),I(2,"*"),m(),w())}function Z(a,r){if(a&1&&(x(0),f(1,"span",3),I(2),_(3,Y,3,0,"ng-container",0),m(),w()),a&2){const t=c();d(2),K("",t.label," "),d(),b("ngIf",t.required)}}function ee(a,r){if(a&1){const t=j();x(0),f(1,"input",5),T("keydown",function(g){const l=O(t).$implicit,s=c();return C(!s.disabled&&s.handleOtpKeyDownEvent(g,l.index,s.value,s.length||6,s.onValueChange||s.onChange))})("input",function(g){const l=O(t).$implicit,s=c();return C(!s.disabled&&s.handleOtpInputEvent(g,l.index,s.value,s.length||6,s.onValueChange||s.onChange))})("blur",function(g){O(t);const l=c();return C(!l.disabled&&l.onBlur&&l.onBlur.emit(g))}),m(),w()}if(a&2){const t=r.$implicit,e=c();d(),E(e.cn("h-9 w-9 shrink-0 rounded-md border bg-background-default text-center text-base font-medium text-foreground-default shadow-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10 sm:text-sm",e.getOtpState(e.props).hasError?"border-destructive-border ring-2 ring-focus-ring-error":"border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary")),v("value",t.char)("disabled",e.disabled?"":null)("aria-label",e.label+" digit "+(t.index+1))("aria-invalid",e.getOtpState(e.props).hasError)("aria-describedby",(e.showHint||e.getOtpState(e.props).hasError)&&e.getOtpState(e.props).helpText!==""?e.id+"-hint":void 0)}}function te(a,r){if(a&1&&(x(0),f(1,"span"),I(2),m(),w()),a&2){const t=c();d(),E(t.cn("text-sm font-normal",t.getOtpState(t.props).hasError?"text-destructive-foreground":"text-foreground-muted")),v("id",t.id+"-hint"),d(),J(t.getOtpState(t.props).helpText)}}const i={value:"",length:6,id:"input-otp",name:"otp",label:"",hint:"",error:!1,errorMessage:"",validating:!1,disabled:!1,required:!1,showLabel:!0,showHint:!0,className:""},h=class h{constructor(){n(this,"name",i.name);n(this,"hint",i.hint);n(this,"error",i.error);n(this,"errorMessage",i.errorMessage);n(this,"validating",i.validating);n(this,"cn",z);n(this,"getOtpState",A);n(this,"handleOtpInputEvent",G);n(this,"handleOtpKeyDownEvent",Q);n(this,"handleOtpPasteEvent",R);n(this,"bindControllerProps",U);n(this,"id",i.id);n(this,"className",i.className);n(this,"showLabel",i.showLabel);n(this,"label",i.label);n(this,"required",i.required);n(this,"disabled",i.disabled);n(this,"length",i.length);n(this,"onValueChange");n(this,"onChange");n(this,"showHint",i.showHint);n(this,"value",i.value);n(this,"onBlur",new N)}get props(){return this}trackByDigit0(r,t){return t.index}};n(h,"ɵfac",function(t){return new(t||h)}),n(h,"ɵcmp",D({type:h,selectors:[["kd-input-otp"],["input-otp"]],inputs:{name:"name",hint:"hint",error:"error",errorMessage:"errorMessage",validating:"validating",id:"id",className:"className",showLabel:"showLabel",label:"label",required:"required",disabled:"disabled",length:"length",onValueChange:"onValueChange",onChange:"onChange",showHint:"showHint",value:"value"},outputs:{onBlur:"onBlur"},standalone:!1,decls:5,vars:9,consts:[[4,"ngIf"],["role","group",1,"flex","max-w-full","flex-wrap","items-center","gap-2","sm:gap-2.5",3,"paste"],[4,"ngFor","ngForOf","ngForTrackBy"],[1,"flex","items-center","gap-2","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],["type","text","inputmode","numeric","autocomplete","one-time-code","maxlength","1",3,"keydown","input","blur"]],template:function(t,e){t&1&&(f(0,"div"),_(1,Z,4,2,"ng-container",0),f(2,"div",1),T("paste",function(l){return!e.disabled&&e.handleOtpPasteEvent(l,e.length||6,e.onValueChange||e.onChange)}),_(3,ee,2,7,"ng-container",2),m(),_(4,te,3,4,"ng-container",0),m()),t&2&&(E(e.cn("flex w-full flex-col gap-3",e.className)),v("id",e.id)("data-ctrl",typeof e.bindControllerProps),d(),b("ngIf",e.showLabel&&e.label!==""),d(),v("aria-label",e.label),d(),b("ngForOf",e.getOtpState(e.props).digits)("ngForTrackBy",e.trackByDigit0),d(),b("ngIf",(e.showHint||e.getOtpState(e.props).hasError)&&e.getOtpState(e.props).helpText!==""))},dependencies:[W,X],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let p=h;(typeof ngDevMode>"u"||ngDevMode)&&M(p,[{type:H,args:[{standalone:!1,selector:"kd-input-otp, input-otp",template:`
    <div
      [attr.id]="id"
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-3', className)"
    >
      <ng-container *ngIf="showLabel && label !== ''"
        ><span
          class="flex items-center gap-2 text-sm font-medium text-foreground-default"
          >{{label}}
          <ng-container *ngIf="required"
            ><span aria-hidden="true" class="text-destructive-default"
              >*</span
            ></ng-container
          ></span
        ></ng-container
      >
      <div
        class="flex max-w-full flex-wrap items-center gap-2 sm:gap-2.5"
        role="group"
        [attr.aria-label]="label"
        (paste)="!disabled && handleOtpPasteEvent($event, length || 6, onValueChange || onChange)"
      >
        <ng-container
          *ngFor="let digit of getOtpState(props).digits; trackBy: trackByDigit0"
          ><input
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="1"
            [attr.value]="digit.char"
            [attr.disabled]="(disabled) ? '' : null"
            [attr.aria-label]="label + ' digit ' + (digit.index + 1)"
            [attr.aria-invalid]="getOtpState(props).hasError"
            [attr.aria-describedby]="(showHint || getOtpState(props).hasError) && getOtpState(props).helpText !== '' ? id + '-hint' : undefined"
            [class]="cn('h-9 w-9 shrink-0 rounded-md border bg-background-default text-center text-base font-medium text-foreground-default shadow-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10 sm:text-sm', getOtpState(props).hasError ? 'border-destructive-border ring-2 ring-focus-ring-error' : 'border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary')"
            (keydown)="!disabled && handleOtpKeyDownEvent($event, digit.index, value, length || 6, onValueChange || onChange)"
            (input)="!disabled && handleOtpInputEvent($event, digit.index, value, length || 6, onValueChange || onChange)"
            (blur)="!disabled && onBlur && this.onBlur.emit($event)"
        /></ng-container>
      </div>
      <ng-container
        *ngIf="(showHint || getOtpState(props).hasError) && getOtpState(props).helpText !== ''"
        ><span
          [attr.id]="id + '-hint'"
          [class]="cn('text-sm font-normal', getOtpState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
          >{{getOtpState(props).helpText}}</span
        ></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{name:[{type:o}],hint:[{type:o}],error:[{type:o}],errorMessage:[{type:o}],validating:[{type:o}],id:[{type:o}],className:[{type:o}],showLabel:[{type:o}],label:[{type:o}],required:[{type:o}],disabled:[{type:o}],length:[{type:o}],onValueChange:[{type:o}],onChange:[{type:o}],showHint:[{type:o}],value:[{type:o}],onBlur:[{type:F}]});(typeof ngDevMode>"u"||ngDevMode)&&q(p,{className:"InputOTP",filePath:"InputOTP.ts",lineNumber:112});const u=class u{};n(u,"ɵfac",function(t){return new(t||u)}),n(u,"ɵmod",B({type:u})),n(u,"ɵinj",V({imports:[S]}));let y=u;(typeof ngDevMode>"u"||ngDevMode)&&M(y,[{type:L,args:[{declarations:[p],imports:[S],exports:[p]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&$(y,{declarations:[p],imports:[S],exports:[p]})})();export{y as InputOTPModule,p as default};

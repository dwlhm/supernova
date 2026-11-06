var T=Object.defineProperty;var S=(a,r,e)=>r in a?T(a,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[r]=e;var n=(a,r,e)=>S(a,typeof r!="symbol"?r+"":r,e);import{ɵ as D,a as k,b as H,j as g,d as _,k as N,p as c,u as O,v as y,t as l,e as b,s as P,I as i,C as q,f as F,N as L,g as B,i as x,o as C,r as w,m as h,x as $,h as K,l as E,n as M,am as j}from"./core.BqS-lykr.js";import{a as V,q as J,o as z,p as A,r as G,b as Q}from"./utils.BBpd638g.js";import{C as I,a as R,N as U}from"./common_module-chunk.DvGwmKFp.js";function W(a,r){a&1&&(x(0),g(1,"span",4),C(2,"*"),c(),w())}function X(a,r){if(a&1&&(x(0),g(1,"span",3),C(2),_(3,W,3,0,"ng-container",0),c(),w()),a&2){const e=h();l(2),$("",e.label," "),l(),b("ngIf",e.required)}}function Y(a,r){if(a&1){const e=K();x(0),g(1,"input",5),N("keydown",function(m){const f=E(e).$implicit,s=h();return M(!s.disabled&&s.handleOtpKeyDownEvent(m,f.index,s.value,s.length||6,s.onChange))})("input",function(m){const f=E(e).$implicit,s=h();return M(!s.disabled&&s.handleOtpInputEvent(m,f.index,s.value,s.length||6,s.onChange))}),c(),w()}if(a&2){const e=r.$implicit,t=h();l(),O(t.cn("h-9 w-9 rounded-md border bg-background-default text-center text-base font-medium text-foreground-default shadow-xs outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",t.getOtpState(t.props).hasError?"border-destructive-border focus:ring-2 focus:ring-focus-ring-error":"border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary")),y("value",e.char)("disabled",t.disabled?"":null)("aria-label",t.label+" digit "+(e.index+1))("aria-invalid",t.getOtpState(t.props).hasError)("aria-describedby",t.showHint?t.id+"-hint":void 0)}}function Z(a,r){if(a&1&&(x(0),g(1,"span"),C(2),c(),w()),a&2){const e=h();l(),O(e.cn("text-sm",e.getOtpState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),y("id",e.id+"-hint"),l(),j(e.getOtpState(e.props).helpText)}}const o={value:"",length:6,id:"input-otp",name:"otp",label:"Label",hint:"Please enter the one-time password sent to your phone.",errorMessage:"",disabled:!1,required:!1,showLabel:!0,showHint:!0,className:""},u=class u{constructor(){n(this,"name",o.name);n(this,"hint",o.hint);n(this,"errorMessage",o.errorMessage);n(this,"cn",V);n(this,"getOtpState",J);n(this,"handleOtpInputEvent",z);n(this,"handleOtpKeyDownEvent",A);n(this,"handleOtpPasteEvent",G);n(this,"bindControllerProps",Q);n(this,"id",o.id);n(this,"className",o.className);n(this,"showLabel",o.showLabel);n(this,"label",o.label);n(this,"required",o.required);n(this,"disabled",o.disabled);n(this,"length",o.length);n(this,"onChange");n(this,"showHint",o.showHint);n(this,"value",o.value)}get props(){return this}trackByDigit0(r,e){return e.index}};n(u,"ɵfac",function(e){return new(e||u)}),n(u,"ɵcmp",D({type:u,selectors:[["spn-input-otp"],["input-otp"]],inputs:{name:"name",hint:"hint",errorMessage:"errorMessage",id:"id",className:"className",showLabel:"showLabel",label:"label",required:"required",disabled:"disabled",length:"length",onChange:"onChange",showHint:"showHint",value:"value"},standalone:!1,decls:5,vars:9,consts:[[4,"ngIf"],["role","group",1,"flex","items-center","gap-2.5",3,"paste"],[4,"ngFor","ngForOf","ngForTrackBy"],[1,"flex","items-center","gap-1","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],["type","text","inputmode","numeric","autocomplete","one-time-code","maxlength","1",3,"keydown","input"]],template:function(e,t){e&1&&(g(0,"div"),_(1,X,4,2,"ng-container",0),g(2,"div",1),N("paste",function(f){return!t.disabled&&t.handleOtpPasteEvent(f,t.length||6,t.onChange)}),_(3,Y,2,7,"ng-container",2),c(),_(4,Z,3,4,"ng-container",0),c()),e&2&&(O(t.cn("flex w-full flex-col gap-3",t.className)),y("id",t.id)("data-ctrl",typeof t.bindControllerProps),l(),b("ngIf",t.showLabel&&t.label!==""),l(),y("aria-label",t.label),l(),b("ngForOf",t.getOtpState(t.props).digits)("ngForTrackBy",t.trackByDigit0),l(),b("ngIf",t.showHint))},dependencies:[R,U],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let d=u;(typeof ngDevMode>"u"||ngDevMode)&&P(d,[{type:q,args:[{standalone:!1,selector:"spn-input-otp, input-otp",template:`
    <div
      [attr.id]="id"
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-3', className)"
    >
      <ng-container *ngIf="showLabel && label !== ''"
        ><span
          class="flex items-center gap-1 text-sm font-medium text-foreground-default"
          >{{label}}
          <ng-container *ngIf="required"
            ><span aria-hidden="true" class="text-destructive-default"
              >*</span
            ></ng-container
          ></span
        ></ng-container
      >
      <div
        class="flex items-center gap-2.5"
        role="group"
        [attr.aria-label]="label"
        (paste)="!disabled && handleOtpPasteEvent($event, length || 6, onChange)"
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
            [attr.aria-describedby]="showHint ? id + '-hint' : undefined"
            [class]="cn('h-9 w-9 rounded-md border bg-background-default text-center text-base font-medium text-foreground-default shadow-xs outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50', getOtpState(props).hasError ? 'border-destructive-border focus:ring-2 focus:ring-focus-ring-error' : 'border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary')"
            (keydown)="!disabled && handleOtpKeyDownEvent($event, digit.index, value, length || 6, onChange)"
            (input)="!disabled && handleOtpInputEvent($event, digit.index, value, length || 6, onChange)"
        /></ng-container>
      </div>
      <ng-container *ngIf="showHint"
        ><span
          [attr.id]="id + '-hint'"
          [class]="cn('text-sm', getOtpState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
          >{{getOtpState(props).helpText}}</span
        ></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{name:[{type:i}],hint:[{type:i}],errorMessage:[{type:i}],id:[{type:i}],className:[{type:i}],showLabel:[{type:i}],label:[{type:i}],required:[{type:i}],disabled:[{type:i}],length:[{type:i}],onChange:[{type:i}],showHint:[{type:i}],value:[{type:i}]});(typeof ngDevMode>"u"||ngDevMode)&&F(d,{className:"InputOTP",filePath:"InputOTP.ts",lineNumber:104});const p=class p{};n(p,"ɵfac",function(e){return new(e||p)}),n(p,"ɵmod",k({type:p})),n(p,"ɵinj",H({imports:[I]}));let v=p;(typeof ngDevMode>"u"||ngDevMode)&&P(v,[{type:L,args:[{declarations:[d],imports:[I],exports:[d]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&B(v,{declarations:[d],imports:[I],exports:[d]})})();export{v as InputOTPModule,d as default};

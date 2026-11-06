var T=Object.defineProperty;var N=(r,o,e)=>o in r?T(r,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[o]=e;var n=(r,o,e)=>N(r,typeof o!="symbol"?o+"":o,e);import{E as M,ɵ as H,a as E,b as q,j as l,d as f,k as P,p as d,u as _,v as b,t as a,e as c,s as v,O,I as s,C as V,f as R,N as j,g as D,i as g,o as I,r as h,m as w,x as A,y as C,z as S,am as k}from"./core.BqS-lykr.js";import{a as B,s as F,I as J,b as $}from"./utils.BBpd638g.js";import{C as y,N as z}from"./common_module-chunk.DvGwmKFp.js";function G(r,o){r&1&&(g(0),l(1,"span",3),I(2,"*"),d(),h())}function U(r,o){if(r&1&&(g(0),l(1,"label",2),I(2),f(3,G,3,0,"ng-container",0),d(),h()),r&2){const e=w();a(),b("for",e.id),a(),A("",e.label," "),a(),c("ngIf",e.required)}}function K(r,o){if(r&1&&(g(0),C(),l(1,"svg",4),S(2,"path",5),d(),h()),r&2){const e=w();a(),_(e.cn("h-4 w-4 shrink-0",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),a(),b("d",e.ICON_PATHS.search)}}function Q(r,o){if(r&1&&(g(0),C(),l(1,"svg",4),S(2,"path",6),d(),h()),r&2){const e=w();a(),_(e.cn("h-4 w-4 shrink-0",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),a(),b("d",e.ICON_PATHS.checkCircle)}}function W(r,o){if(r&1&&(g(0),l(1,"span"),I(2),d(),h()),r&2){const e=w(2);a(),_(e.cn("text-sm",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),b("id",e.id+"-hint"),a(),k(e.getInputState(e.props).helpText)}}function X(r,o){if(r&1&&(g(0),l(1,"span"),I(2),d(),h()),r&2){const e=w(2);a(),_(e.cn("ml-auto shrink-0 text-sm",e.getInputState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),a(),k(e.getInputState(e.props).countText)}}function Y(r,o){if(r&1&&(g(0),l(1,"div",7),f(2,W,3,4,"ng-container",0)(3,X,3,3,"ng-container",0),d(),h()),r&2){const e=w();a(2),c("ngIf",e.showHint),a(),c("ngIf",e.showCharacterCount)}}const i={value:"",name:"input-text",id:"input-text",type:"text",label:"Username",placeholder:"Max Leiter",hint:"Choose a unique username for your account.",errorMessage:"",disabled:!1,required:!0,showLabel:!0,showHint:!0,showCharacterCount:!1,maxLength:200,showLeftIcon:!1,showRightIcon:!0,className:""},m=class m{constructor(){n(this,"hint",i.hint);n(this,"errorMessage",i.errorMessage);n(this,"cn",B);n(this,"getInputState",F);n(this,"ICON_PATHS",J);n(this,"bindControllerProps",$);n(this,"className",i.className);n(this,"showLabel",i.showLabel);n(this,"label",i.label);n(this,"id",i.id);n(this,"required",i.required);n(this,"disabled",i.disabled);n(this,"showLeftIcon",i.showLeftIcon);n(this,"name",i.name);n(this,"type",i.type);n(this,"value",i.value);n(this,"placeholder",i.placeholder);n(this,"maxLength",i.maxLength);n(this,"showHint",i.showHint);n(this,"showRightIcon",i.showRightIcon);n(this,"showCharacterCount",i.showCharacterCount);n(this,"onValueChange",new M)}get props(){return this}};n(m,"ɵfac",function(e){return new(e||m)}),n(m,"ɵcmp",H({type:m,selectors:[["spn-input-text"],["input-text"]],inputs:{hint:"hint",errorMessage:"errorMessage",className:"className",showLabel:"showLabel",label:"label",id:"id",required:"required",disabled:"disabled",showLeftIcon:"showLeftIcon",name:"name",type:"type",value:"value",placeholder:"placeholder",maxLength:"maxLength",showHint:"showHint",showRightIcon:"showRightIcon",showCharacterCount:"showCharacterCount"},outputs:{onValueChange:"onValueChange"},standalone:!1,decls:7,vars:19,consts:[[4,"ngIf"],[1,"h-9","w-full","bg-transparent","text-base","text-foreground-default","outline-none","placeholder:text-foreground-subtle","disabled:cursor-not-allowed",3,"input"],[1,"flex","items-center","gap-1","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["stroke-linecap","round"],["stroke-linecap","round","stroke-linejoin","round"],[1,"flex","items-start","justify-between","gap-2.5"]],template:function(e,t){e&1&&(l(0,"div"),f(1,U,4,3,"ng-container",0),l(2,"div"),f(3,K,3,3,"ng-container",0),l(4,"input",1),P("input",function(L){return!t.disabled&&t.onValueChange&&t.onValueChange.emit(L.target.value)}),d(),f(5,Q,3,3,"ng-container",0),d(),f(6,Y,4,2,"ng-container",0),d()),e&2&&(_(t.cn("flex w-full flex-col gap-3",t.className)),b("data-ctrl",typeof t.bindControllerProps),a(),c("ngIf",t.showLabel&&t.label!==""),a(),_(t.cn("flex items-center gap-3 rounded-lg border px-3 shadow-xs transition-colors",t.disabled?"border-border-default bg-background-muted cursor-not-allowed opacity-50":t.getInputState(t.props).hasError?"border-destructive-border bg-background-default focus-within:ring-2 focus-within:ring-focus-ring-error":"border-border-default bg-background-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary")),a(),c("ngIf",t.showLeftIcon),a(),b("id",t.id)("name",t.name)("type",t.type)("value",t.value)("placeholder",t.placeholder)("maxLength",t.maxLength)("disabled",t.disabled?"":null)("required",t.required?"":null)("aria-invalid",t.getInputState(t.props).hasError)("aria-describedby",t.showHint?t.id+"-hint":void 0),a(),c("ngIf",t.showRightIcon),a(),c("ngIf",t.showHint||t.showCharacterCount))},dependencies:[z],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let u=m;(typeof ngDevMode>"u"||ngDevMode)&&v(u,[{type:V,args:[{standalone:!1,selector:"spn-input-text, input-text",template:`
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
        [class]="cn('flex items-center gap-3 rounded-lg border px-3 shadow-xs transition-colors', disabled ? 'border-border-default bg-background-muted cursor-not-allowed opacity-50' : getInputState(props).hasError ? 'border-destructive-border bg-background-default focus-within:ring-2 focus-within:ring-focus-ring-error' : 'border-border-default bg-background-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary')"
      >
        <ng-container *ngIf="showLeftIcon"
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
          [attr.required]="(required) ? '' : null"
          [attr.aria-invalid]="getInputState(props).hasError"
          [attr.aria-describedby]="showHint ? id + '-hint' : undefined"
          (input)="!disabled && onValueChange && this.onValueChange.emit($any($event.target).value)"
        />
        <ng-container *ngIf="showRightIcon"
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
      <ng-container *ngIf="showHint || showCharacterCount"
        ><div class="flex items-start justify-between gap-2.5">
          <ng-container *ngIf="showHint"
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
    `]}]}],null,{hint:[{type:s}],errorMessage:[{type:s}],className:[{type:s}],showLabel:[{type:s}],label:[{type:s}],id:[{type:s}],required:[{type:s}],disabled:[{type:s}],showLeftIcon:[{type:s}],name:[{type:s}],type:[{type:s}],value:[{type:s}],placeholder:[{type:s}],maxLength:[{type:s}],showHint:[{type:s}],showRightIcon:[{type:s}],showCharacterCount:[{type:s}],onValueChange:[{type:O}]});(typeof ngDevMode>"u"||ngDevMode)&&R(u,{className:"InputText",filePath:"InputText.ts",lineNumber:141});const p=class p{};n(p,"ɵfac",function(e){return new(e||p)}),n(p,"ɵmod",E({type:p})),n(p,"ɵinj",q({imports:[y]}));let x=p;(typeof ngDevMode>"u"||ngDevMode)&&v(x,[{type:j,args:[{declarations:[u],imports:[y],exports:[u]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&D(x,{declarations:[u],imports:[y],exports:[u]})})();export{x as InputTextModule,u as default};

var k=Object.defineProperty;var T=(l,s,t)=>s in l?k(l,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[s]=t;var a=(l,s,t)=>T(l,typeof s!="symbol"?s+"":s,t);import{E as N,ɵ as E,a as q,b as H,j as o,d as h,z as L,k as B,p as d,u as f,v as S,t as i,e as g,s as I,O as V,I as r,C as D,f as P,N as j,g as z,i as c,r as b,m as y,o as v,ao as M,x as O}from"./core.vpEFnhB-.js";import{a as $,L as F,d as J}from"./theme.CecfD-Na.js";import{C,a as A,c as G}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";function K(l,s){l&1&&(c(0),o(1,"span",6),v(2,"*"),d(),b())}function Q(l,s){if(l&1&&(c(0),o(1,"label",5),v(2),h(3,K,3,0,"ng-container",0),d(),b()),l&2){const t=y(2);i(),S("for",t.id),i(),O("",t.getSliderState(t.props).resolvedLabel," "),i(),g("ngIf",t.required)}}function R(l,s){if(l&1&&(c(0),o(1,"span",7),v(2),d(),b()),l&2){const t=y(2);i(2),M(t.getSliderState(t.props).displayValue)}}function U(l,s){if(l&1&&(c(0),o(1,"div",4),h(2,Q,4,3,"ng-container",0)(3,R,3,1,"ng-container",0),d(),b()),l&2){const t=y();i(2),g("ngIf",t.showLabel&&t.getSliderState(t.props).resolvedLabel!==""),i(),g("ngIf",t.showValue)}}function W(l,s){if(l&1&&(c(0),o(1,"span"),v(2),d(),b()),l&2){const t=y();i(),f(t.cn("text-sm",t.getSliderState(t.props).hasError?"text-destructive-foreground":"text-foreground-muted")),S("id",t.id+"-hint"),i(),M(t.getSliderState(t.props).helpText)}}const n={id:"slider",name:"slider",value:0,min:0,max:100,step:1,label:"",showLabel:!0,showValue:!1,hint:"",showHint:!0,required:!1,error:!1,errorMessage:"",validating:!1,disabled:!1,ariaLabel:"Slider",trackClassName:"",indicatorClassName:"",className:""},m=class m{constructor(){a(this,"Number",Number);a(this,"label",n.label);a(this,"formatValue");a(this,"hint",n.hint);a(this,"error",n.error);a(this,"errorMessage",n.errorMessage);a(this,"validating",n.validating);a(this,"cn",$);a(this,"getSliderState",F);a(this,"bindControllerProps",J);a(this,"className",n.className);a(this,"showLabel",n.showLabel);a(this,"showValue",n.showValue);a(this,"id",n.id);a(this,"required",n.required);a(this,"disabled",n.disabled);a(this,"trackClassName",n.trackClassName);a(this,"indicatorClassName",n.indicatorClassName);a(this,"name",n.name);a(this,"min",n.min);a(this,"max",n.max);a(this,"step",n.step);a(this,"value",n.value);a(this,"ariaLabel",n.ariaLabel);a(this,"showHint",n.showHint);a(this,"onValueChange",new N);a(this,"onBlur",new N)}get props(){return this}};a(m,"ɵfac",function(t){return new(t||m)}),a(m,"ɵcmp",E({type:m,selectors:[["kd-slider"],["slider"]],inputs:{label:"label",formatValue:"formatValue",hint:"hint",error:"error",errorMessage:"errorMessage",validating:"validating",className:"className",showLabel:"showLabel",showValue:"showValue",id:"id",required:"required",disabled:"disabled",trackClassName:"trackClassName",indicatorClassName:"indicatorClassName",name:"name",min:"min",max:"max",step:"step",value:"value",ariaLabel:"ariaLabel",showHint:"showHint"},outputs:{onValueChange:"onValueChange",onBlur:"onBlur"},standalone:!1,decls:8,vars:24,consts:[[4,"ngIf"],[3,"ngStyle"],["type","range",1,"peer","absolute","inset-0","z-10","h-5","w-full","cursor-pointer","opacity-0","disabled:cursor-not-allowed",3,"input","blur"],["aria-hidden","true",1,"pointer-events-none","absolute","top-1/2","h-5","w-5","-translate-x-1/2","-translate-y-1/2","rounded-full","border","border-primary-default","bg-background-default","shadow-sm","peer-focus-visible:ring-2","peer-focus-visible:ring-focus-ring-primary",3,"ngStyle"],[1,"flex","items-center","justify-between","gap-2"],[1,"flex","items-center","gap-1","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],[1,"ml-auto","text-sm","font-medium","text-foreground-muted"]],template:function(t,e){t&1&&(o(0,"div"),h(1,U,4,2,"ng-container",0),o(2,"div"),L(3,"div")(4,"div",1),o(5,"input",2),B("input",function(w){return!e.disabled&&e.onValueChange&&e.onValueChange.emit(e.Number(w.target.value))})("blur",function(w){return!e.disabled&&e.onBlur&&e.onBlur.emit(w)}),d(),L(6,"div",3),d(),h(7,W,3,4,"ng-container",0),d()),t&2&&(f(e.cn("flex w-full flex-col gap-2",e.className)),S("data-ctrl",typeof e.bindControllerProps),i(),g("ngIf",e.showLabel&&e.getSliderState(e.props).resolvedLabel!==""||e.showValue),i(),f(e.cn("relative flex h-5 w-full items-center rounded-full",e.disabled&&"opacity-50")),i(),f(e.cn("absolute inset-x-0 h-1.5 rounded-full bg-background-muted",e.trackClassName)),i(),f(e.cn("absolute left-0 h-1.5 rounded-full bg-primary-default",e.indicatorClassName)),g("ngStyle",e.getSliderState(e.props).barStyle),i(),S("id",e.id)("name",e.name)("min",e.min)("max",e.max)("step",e.step)("value",e.value)("disabled",e.disabled?"":null)("required",e.required?"":null)("aria-label",e.getSliderState(e.props).resolvedLabel||e.ariaLabel)("aria-invalid",e.getSliderState(e.props).hasError||void 0)("aria-describedby",(e.showHint||e.getSliderState(e.props).hasError)&&e.getSliderState(e.props).helpText!==""?e.id+"-hint":void 0),i(),g("ngStyle",e.getSliderState(e.props).thumbStyle),i(),g("ngIf",(e.showHint||e.getSliderState(e.props).hasError)&&e.getSliderState(e.props).helpText!==""))},dependencies:[A,G],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let u=m;(typeof ngDevMode>"u"||ngDevMode)&&I(u,[{type:D,args:[{standalone:!1,selector:"kd-slider, slider",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-2', className)"
    >
      <ng-container
        *ngIf="showLabel && getSliderState(props).resolvedLabel !== '' || showValue"
        ><div class="flex items-center justify-between gap-2">
          <ng-container
            *ngIf="showLabel && getSliderState(props).resolvedLabel !== ''"
            ><label
              class="flex items-center gap-1 text-sm font-medium text-foreground-default"
              [attr.for]="id"
              >{{getSliderState(props).resolvedLabel}}
              <ng-container *ngIf="required"
                ><span aria-hidden="true" class="text-destructive-default"
                  >*</span
                ></ng-container
              ></label
            ></ng-container
          >
          <ng-container *ngIf="showValue"
            ><span
              class="ml-auto text-sm font-medium text-foreground-muted"
              >{{getSliderState(props).displayValue}}</span
            ></ng-container
          >
        </div></ng-container
      >
      <div
        [class]="cn('relative flex h-5 w-full items-center rounded-full', disabled && 'opacity-50')"
      >
        <div
          [class]="cn('absolute inset-x-0 h-1.5 rounded-full bg-background-muted', trackClassName)"
        ></div>
        <div
          [class]="cn('absolute left-0 h-1.5 rounded-full bg-primary-default', indicatorClassName)"
          [ngStyle]="getSliderState(props).barStyle"
        ></div>
        <input
          type="range"
          class="peer absolute inset-0 z-10 h-5 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          [attr.id]="id"
          [attr.name]="name"
          [attr.min]="min"
          [attr.max]="max"
          [attr.step]="step"
          [attr.value]="value"
          [attr.disabled]="(disabled) ? '' : null"
          [attr.required]="(required) ? '' : null"
          [attr.aria-label]="getSliderState(props).resolvedLabel || ariaLabel"
          [attr.aria-invalid]="getSliderState(props).hasError || undefined"
          [attr.aria-describedby]="(showHint || getSliderState(props).hasError) && getSliderState(props).helpText !== '' ? id + '-hint' : undefined"
          (input)="!disabled && onValueChange && this.onValueChange.emit(Number($any($event.target).value))"
          (blur)="!disabled && onBlur && this.onBlur.emit($event)"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-default bg-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
          [ngStyle]="getSliderState(props).thumbStyle"
        ></div>
      </div>
      <ng-container
        *ngIf="(showHint || getSliderState(props).hasError) && getSliderState(props).helpText !== ''"
        ><span
          [attr.id]="id + '-hint'"
          [class]="cn('text-sm', getSliderState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
          >{{getSliderState(props).helpText}}</span
        ></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{label:[{type:r}],formatValue:[{type:r}],hint:[{type:r}],error:[{type:r}],errorMessage:[{type:r}],validating:[{type:r}],className:[{type:r}],showLabel:[{type:r}],showValue:[{type:r}],id:[{type:r}],required:[{type:r}],disabled:[{type:r}],trackClassName:[{type:r}],indicatorClassName:[{type:r}],name:[{type:r}],min:[{type:r}],max:[{type:r}],step:[{type:r}],value:[{type:r}],ariaLabel:[{type:r}],showHint:[{type:r}],onValueChange:[{type:V}],onBlur:[{type:V}]});(typeof ngDevMode>"u"||ngDevMode)&&P(u,{className:"Slider",filePath:"Slider.ts",lineNumber:138});const p=class p{};a(p,"ɵfac",function(t){return new(t||p)}),a(p,"ɵmod",q({type:p})),a(p,"ɵinj",H({imports:[C]}));let _=p;(typeof ngDevMode>"u"||ngDevMode)&&I(_,[{type:j,args:[{declarations:[u],imports:[C],exports:[u]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&z(_,{declarations:[u],imports:[C],exports:[u]})})();export{_ as SliderModule,u as default};

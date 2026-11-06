var C=Object.defineProperty;var N=(i,l,t)=>l in i?C(i,l,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[l]=t;var a=(i,l,t)=>N(i,typeof l!="symbol"?l+"":l,t);import{E as x,ɵ as V,a as M,b as I,j as p,d as D,z as c,k as P,p as m,u as y,v,t as o,e as b,s as S,O as j,I as n,C as k,f as E,N as z,g as O,i as T,o as _,r as F,m as J,am as h}from"./core.BqS-lykr.js";import{a as $,v as q,b as A}from"./utils.BBpd638g.js";import{C as g,N as B,b as G}from"./common_module-chunk.DvGwmKFp.js";function H(i,l){if(i&1&&(T(0),p(1,"div",5)(2,"span"),_(3),m(),p(4,"span"),_(5),m()(),F()),i&2){const t=J();o(3),h(t.label),o(2),h(t.value)}}const s={id:"slider",name:"slider",value:0,min:0,max:100,step:1,disabled:!1,label:"Slider",showValue:!1,className:""},u=class u{constructor(){a(this,"Number",Number);a(this,"cn",$);a(this,"getSliderState",q);a(this,"bindControllerProps",A);a(this,"className",s.className);a(this,"showValue",s.showValue);a(this,"label",s.label);a(this,"value",s.value);a(this,"disabled",s.disabled);a(this,"id",s.id);a(this,"name",s.name);a(this,"min",s.min);a(this,"max",s.max);a(this,"step",s.step);a(this,"onValueChange",new x)}get props(){return this}};a(u,"ɵfac",function(t){return new(t||u)}),a(u,"ɵcmp",V({type:u,selectors:[["spn-slider"],["slider"]],inputs:{className:"className",showValue:"showValue",label:"label",value:"value",disabled:"disabled",id:"id",name:"name",min:"min",max:"max",step:"step"},outputs:{onValueChange:"onValueChange"},standalone:!1,decls:7,vars:16,consts:[[4,"ngIf"],[1,"absolute","inset-x-0","h-1.5","rounded-full","bg-background-muted"],[1,"absolute","left-0","h-1.5","rounded-full","bg-primary-default",3,"ngStyle"],["type","range",1,"peer","absolute","inset-0","z-10","h-5","w-full","cursor-pointer","opacity-0","disabled:cursor-not-allowed",3,"input"],["aria-hidden","true",1,"pointer-events-none","absolute","top-1/2","h-5","w-5","-translate-x-1/2","-translate-y-1/2","rounded-full","border","border-primary-default","bg-background-default","shadow-sm","peer-focus-visible:ring-2","peer-focus-visible:ring-focus-ring-primary",3,"ngStyle"],[1,"flex","items-center","justify-between","text-xs","text-foreground-muted"]],template:function(t,e){t&1&&(p(0,"div"),D(1,H,6,2,"ng-container",0),p(2,"div"),c(3,"div",1)(4,"div",2),p(5,"input",3),P("input",function(w){return!e.disabled&&e.onValueChange&&e.onValueChange.emit(e.Number(w.target.value))}),m(),c(6,"div",4),m()()),t&2&&(y(e.cn("flex w-full flex-col gap-2",e.className)),v("data-ctrl",typeof e.bindControllerProps),o(),b("ngIf",e.showValue),o(),y(e.cn("relative flex h-5 w-full items-center",e.disabled&&"opacity-50")),o(2),b("ngStyle",e.getSliderState(e.props).barStyle),o(),v("id",e.id)("name",e.name)("min",e.min)("max",e.max)("step",e.step)("value",e.value)("disabled",e.disabled?"":null)("aria-label",e.label),o(),b("ngStyle",e.getSliderState(e.props).thumbStyle))},dependencies:[B,G],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let r=u;(typeof ngDevMode>"u"||ngDevMode)&&S(r,[{type:k,args:[{standalone:!1,selector:"spn-slider, slider",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col gap-2', className)"
    >
      <ng-container *ngIf="showValue"
        ><div
          class="flex items-center justify-between text-xs text-foreground-muted"
        >
          <span>{{label}}</span> <span>{{value}}</span>
        </div></ng-container
      >
      <div
        [class]="cn('relative flex h-5 w-full items-center', disabled && 'opacity-50')"
      >
        <div
          class="absolute inset-x-0 h-1.5 rounded-full bg-background-muted"
        ></div>
        <div
          class="absolute left-0 h-1.5 rounded-full bg-primary-default"
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
          [attr.aria-label]="label"
          (input)="!disabled && onValueChange && this.onValueChange.emit(Number($any($event.target).value))"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-default bg-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
          [ngStyle]="getSliderState(props).thumbStyle"
        ></div>
      </div>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:n}],showValue:[{type:n}],label:[{type:n}],value:[{type:n}],disabled:[{type:n}],id:[{type:n}],name:[{type:n}],min:[{type:n}],max:[{type:n}],step:[{type:n}],onValueChange:[{type:j}]});(typeof ngDevMode>"u"||ngDevMode)&&E(r,{className:"Slider",filePath:"Slider.ts",lineNumber:87});const d=class d{};a(d,"ɵfac",function(t){return new(t||d)}),a(d,"ɵmod",M({type:d})),a(d,"ɵinj",I({imports:[g]}));let f=d;(typeof ngDevMode>"u"||ngDevMode)&&S(f,[{type:z,args:[{declarations:[r],imports:[g],exports:[r]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&O(f,{declarations:[r],imports:[g],exports:[r]})})();export{f as SliderModule,r as default};

var z=Object.defineProperty;var I=(t,l,n)=>l in t?z(t,l,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[l]=n;var a=(t,l,n)=>I(t,typeof l!="symbol"?l+"":l,n);import{E as S,ɵ as M,a as q,b as j,j as c,d as m,k as D,p,u as b,w as h,v as w,t as r,e as g,s as k,O as P,I as s,C as R,f as E,N as O,g as T,i as _,o as L,r as y,m as v,am as N,z as F}from"./core.BqS-lykr.js";import{a as B,d as J,i as A,b as G}from"./utils.BBpd638g.js";import{C,N as H}from"./common_module-chunk.DvGwmKFp.js";const K=()=>({small:"gap-1.5",medium:"gap-2",large:"gap-2.5"}),Q=()=>({small:"h-3 w-3",medium:"h-3.5 w-3.5",large:"h-4 w-4"}),U=()=>({small:"h-1.5 w-1.5",medium:"h-2 w-2",large:"h-2.5 w-2.5"});function V(t,l){if(t&1&&(_(0),c(1,"span",4),L(2),p(),y()),t&2){const n=v();r(2),N(n.label)}}function W(t,l){if(t&1&&(_(0),F(1,"span"),y()),t&2){const n=v();r(),b(n.cn("rounded-full bg-primary-default",n.cva(n.size,h(2,U),"medium")))}}function X(t,l){if(t&1&&(_(0),c(1,"span",4),L(2),p(),y()),t&2){const n=v();r(2),N(n.label)}}const i={id:"radio-button",checked:!1,disabled:!1,required:!1,size:"medium",label:"Label",leftLabel:!1,rightLabel:!1,name:"radio-group",value:"",className:""},u=class u{constructor(){a(this,"leftLabel",i.leftLabel);a(this,"rightLabel",i.rightLabel);a(this,"cn",B);a(this,"cva",J);a(this,"getChoiceState",A);a(this,"bindControllerProps",G);a(this,"size",i.size);a(this,"disabled",i.disabled);a(this,"className",i.className);a(this,"label",i.label);a(this,"id",i.id);a(this,"name",i.name);a(this,"value",i.value);a(this,"checked",i.checked);a(this,"required",i.required);a(this,"onChange",new S)}get props(){return this}};a(u,"ɵfac",function(n){return new(n||u)}),a(u,"ɵcmp",M({type:u,selectors:[["spn-radio-button"],["radio-button"]],inputs:{leftLabel:"leftLabel",rightLabel:"rightLabel",size:"size",disabled:"disabled",className:"className",label:"label",id:"id",name:"name",value:"value",checked:"checked",required:"required"},outputs:{onChange:"onChange"},standalone:!1,decls:7,vars:17,consts:[[4,"ngIf"],[1,"relative","inline-flex","shrink-0","items-center","justify-center"],["type","radio",1,"peer","absolute","inset-0","h-full","w-full","cursor-pointer","appearance-none","rounded-full","opacity-0","disabled:cursor-not-allowed",3,"change"],["aria-hidden","true"],[1,"text-sm","text-foreground-default"]],template:function(n,e){n&1&&(c(0,"label"),m(1,V,3,1,"ng-container",0),c(2,"span",1)(3,"input",2),D("change",function(){return!e.disabled&&e.onChange&&e.onChange.emit(e.value||e.label||"")}),p(),c(4,"span",3),m(5,W,2,3,"ng-container",0),p()(),m(6,X,3,1,"ng-container",0),p()),n&2&&(b(e.cn("inline-flex items-center",e.cva(e.size,h(15,K),"medium"),e.disabled?"cursor-not-allowed opacity-50":"cursor-pointer",e.className)),w("data-ctrl",typeof e.bindControllerProps),r(),g("ngIf",e.getChoiceState(e.props).showLeft),r(2),w("id",e.id)("name",e.name)("value",e.value)("checked",e.checked?"":null)("disabled",e.disabled?"":null)("required",e.required?"":null)("aria-label",!e.getChoiceState(e.props).showLeft&&!e.getChoiceState(e.props).showRight?e.label||"Option":void 0),r(),b(e.cn("inline-flex items-center justify-center rounded-full border bg-background-default shadow-xs peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary",e.cva(e.size,h(16,Q),"medium"),e.checked?"border-primary-default":"border-border-default")),r(),g("ngIf",e.checked),r(),g("ngIf",e.getChoiceState(e.props).showRight))},dependencies:[H],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let o=u;(typeof ngDevMode>"u"||ngDevMode)&&k(o,[{type:R,args:[{standalone:!1,selector:"spn-radio-button, radio-button",template:`
    <label
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('inline-flex items-center', cva(size, {
          small: 'gap-1.5',
          medium: 'gap-2',
          large: 'gap-2.5'
        }, 'medium'), disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', className)"
      ><ng-container *ngIf="getChoiceState(props).showLeft"
        ><span
          class="text-sm text-foreground-default"
          >{{label}}</span
        ></ng-container
      >
      <span class="relative inline-flex shrink-0 items-center justify-center"
        ><input
          type="radio"
          class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full opacity-0 disabled:cursor-not-allowed"
          [attr.id]="id"
          [attr.name]="name"
          [attr.value]="value"
          [attr.checked]="(checked) ? '' : null"
          [attr.disabled]="(disabled) ? '' : null"
          [attr.required]="(required) ? '' : null"
          [attr.aria-label]="!getChoiceState(props).showLeft && !getChoiceState(props).showRight ? label || 'Option' : undefined"
          (change)="!disabled && onChange && this.onChange.emit(value || label || '')" />
        <span
          aria-hidden="true"
          [class]="cn('inline-flex items-center justify-center rounded-full border bg-background-default shadow-xs peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary', cva(size, {
          small: 'h-3 w-3',
          medium: 'h-3.5 w-3.5',
          large: 'h-4 w-4'
        }, 'medium'), checked ? 'border-primary-default' : 'border-border-default')"
          ><ng-container *ngIf="checked"
            ><span
              [class]="cn('rounded-full bg-primary-default', cva(size, {
          small: 'h-1.5 w-1.5',
          medium: 'h-2 w-2',
          large: 'h-2.5 w-2.5'
        }, 'medium'))"
            ></span></ng-container></span
      ></span>
      <ng-container *ngIf="getChoiceState(props).showRight"
        ><span
          class="text-sm text-foreground-default"
          >{{label}}</span
        ></ng-container
      ></label
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{leftLabel:[{type:s}],rightLabel:[{type:s}],size:[{type:s}],disabled:[{type:s}],className:[{type:s}],label:[{type:s}],id:[{type:s}],name:[{type:s}],value:[{type:s}],checked:[{type:s}],required:[{type:s}],onChange:[{type:P}]});(typeof ngDevMode>"u"||ngDevMode)&&E(o,{className:"RadioButton",filePath:"RadioButton.ts",lineNumber:96});const d=class d{};a(d,"ɵfac",function(n){return new(n||d)}),a(d,"ɵmod",q({type:d})),a(d,"ɵinj",j({imports:[C]}));let f=d;(typeof ngDevMode>"u"||ngDevMode)&&k(f,[{type:O,args:[{declarations:[o],imports:[C],exports:[o]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&T(f,{declarations:[o],imports:[C],exports:[o]})})();export{f as RadioButtonModule,o as default};

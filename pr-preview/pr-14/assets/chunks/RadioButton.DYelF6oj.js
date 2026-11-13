var M=Object.defineProperty;var N=(i,t,n)=>t in i?M(i,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[t]=n;var a=(i,t,n)=>N(i,typeof t!="symbol"?t+"":t,n);import{E as f,ɵ as P,a as j,b as B,c as q,j as m,k as z,p as u,d as D,i as _,q as I,r as v,u as g,v as y,t as c,an as C,e as V,s as w,O as b,I as r,C as E,f as S,N as T,g as F,z as O,m as J}from"./core.vpEFnhB-.js";import{a as R,e as $,d as A}from"./theme.CecfD-Na.js";import{C as h,a as G}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const H=["*"],K=()=>({small:"h-3 w-3",medium:"h-3.5 w-3.5",large:"h-4 w-4"}),Q=()=>({small:"h-1.5 w-1.5",medium:"h-2 w-2",large:"h-2.5 w-2.5"});function U(i,t){if(i&1&&(_(0),O(1,"span"),v()),i&2){const n=J();c(),g(n.cn("rounded-full bg-primary-default",n.cva(n.size,C(2,Q),"medium")))}}const l={id:"radio-button",checked:!1,disabled:!1,required:!1,error:!1,errorMessage:"",validating:!1,size:"medium",labelPosition:"right",leftLabel:!1,rightLabel:!1,name:"",value:"",ariaLabel:"",className:""},d=class d{constructor(){a(this,"Boolean",Boolean);a(this,"validating",l.validating);a(this,"cn",R);a(this,"cva",$);a(this,"bindControllerProps",A);a(this,"labelPosition",l.labelPosition);a(this,"leftLabel",l.leftLabel);a(this,"rightLabel",l.rightLabel);a(this,"disabled",l.disabled);a(this,"className",l.className);a(this,"id",l.id);a(this,"name",l.name);a(this,"value",l.value);a(this,"checked",l.checked);a(this,"required",l.required);a(this,"error",l.error);a(this,"errorMessage",l.errorMessage);a(this,"ariaLabel",l.ariaLabel);a(this,"size",l.size);a(this,"onChange",new f);a(this,"onValueChange",new f);a(this,"onBlur",new f)}};a(d,"ɵfac",function(n){return new(n||d)}),a(d,"ɵcmp",P({type:d,selectors:[["kd-radio-button"],["radio-button"]],inputs:{validating:"validating",labelPosition:"labelPosition",leftLabel:"leftLabel",rightLabel:"rightLabel",disabled:"disabled",className:"className",id:"id",name:"name",value:"value",checked:"checked",required:"required",error:"error",errorMessage:"errorMessage",ariaLabel:"ariaLabel",size:"size"},outputs:{onChange:"onChange",onValueChange:"onValueChange",onBlur:"onBlur"},standalone:!1,ngContentSelectors:H,decls:8,vars:15,consts:[[1,"relative","inline-flex","shrink-0","items-center","justify-center"],["type","radio",1,"peer","absolute","inset-0","h-full","w-full","cursor-pointer","appearance-none","rounded-full","opacity-0","disabled:cursor-not-allowed",3,"change","blur"],["aria-hidden","true"],[4,"ngIf"],[1,"text-sm","text-foreground-default"]],template:function(n,e){n&1&&(q(),m(0,"label")(1,"span",0)(2,"input",1),z("change",function(){return!e.disabled&&(e.onChange?e.onChange.emit(e.value||""):e.onValueChange&&e.onValueChange.emit(e.value||""))})("blur",function(k){return!e.disabled&&e.onBlur&&e.onBlur.emit(k)}),u(),m(3,"span",2),D(4,U,2,3,"ng-container",3),u()(),_(5),m(6,"span",4),I(7),u(),v(),u()),n&2&&(g(e.cn("inline-flex items-center gap-2",e.labelPosition==="left"||e.leftLabel&&!e.rightLabel?"flex-row-reverse justify-end":"flex-row justify-start",e.disabled?"cursor-not-allowed opacity-50":"cursor-pointer",e.className)),y("data-ctrl",typeof e.bindControllerProps),c(2),y("id",e.id)("name",e.name)("value",e.value)("checked",e.checked?"":null)("disabled",e.disabled?"":null)("required",e.required?"":null)("aria-invalid",e.error||e.Boolean(e.errorMessage)||void 0)("aria-label",e.ariaLabel||void 0),c(),g(e.cn("inline-flex items-center justify-center rounded-full border bg-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary",e.cva(e.size,C(14,K),"medium"),e.checked?"border-primary-default":"border-border-default")),c(),V("ngIf",e.checked))},dependencies:[G],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=d;(typeof ngDevMode>"u"||ngDevMode)&&w(s,[{type:E,args:[{standalone:!1,selector:"kd-radio-button, radio-button",template:`
    <label
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('inline-flex items-center gap-2', labelPosition === 'left' || leftLabel && !rightLabel ? 'flex-row-reverse justify-end' : 'flex-row justify-start', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', className)"
      ><span class="relative inline-flex shrink-0 items-center justify-center"
        ><input
          type="radio"
          class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full opacity-0 disabled:cursor-not-allowed"
          [attr.id]="id"
          [attr.name]="name"
          [attr.value]="value"
          [attr.checked]="(checked) ? '' : null"
          [attr.disabled]="(disabled) ? '' : null"
          [attr.required]="(required) ? '' : null"
          [attr.aria-invalid]="error || Boolean(errorMessage) || undefined"
          [attr.aria-label]="ariaLabel || undefined"
          (change)="!disabled && (onChange ? this.onChange.emit(value || '') : onValueChange && this.onValueChange.emit(value || ''))"
          (blur)="!disabled && onBlur && this.onBlur.emit($event)" />
        <span
          aria-hidden="true"
          [class]="cn('inline-flex items-center justify-center rounded-full border bg-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary', cva(size, {
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
      <ng-container><span class="text-sm text-foreground-default"
          ><ng-content></ng-content></span></ng-container
    ></label>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{validating:[{type:r}],labelPosition:[{type:r}],leftLabel:[{type:r}],rightLabel:[{type:r}],disabled:[{type:r}],className:[{type:r}],id:[{type:r}],name:[{type:r}],value:[{type:r}],checked:[{type:r}],required:[{type:r}],error:[{type:r}],errorMessage:[{type:r}],ariaLabel:[{type:r}],size:[{type:r}],onChange:[{type:b}],onValueChange:[{type:b}],onBlur:[{type:b}]});(typeof ngDevMode>"u"||ngDevMode)&&S(s,{className:"RadioButton",filePath:"RadioButton.ts",lineNumber:95});const o=class o{};a(o,"ɵfac",function(n){return new(n||o)}),a(o,"ɵmod",j({type:o})),a(o,"ɵinj",B({imports:[h]}));let p=o;(typeof ngDevMode>"u"||ngDevMode)&&w(p,[{type:T,args:[{declarations:[s],imports:[h],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&F(p,{declarations:[s],imports:[h],exports:[s]})})();export{p as RadioButtonModule,s as default};

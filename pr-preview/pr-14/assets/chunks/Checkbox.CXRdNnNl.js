var N=Object.defineProperty;var P=(l,t,n)=>t in l?N(l,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):l[t]=n;var a=(l,t,n)=>P(l,typeof t!="symbol"?t+"":t,n);import{E as g,ɵ as M,a as I,b as B,c as z,j as m,k as j,p as c,d as q,i as y,q as S,r as v,u as f,an as b,v as _,t as u,e as T,s as C,O as h,I as r,C as O,f as V,N as D,g as A,y as H,z as E,m as F}from"./core.vpEFnhB-.js";import{a as J,e as x,I as G,d as $}from"./theme.CecfD-Na.js";import{C as k,a as K}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const Q=["*"],R=()=>({small:"gap-1.5",medium:"gap-2",large:"gap-2.5"}),U=()=>({small:"h-3.5 w-3.5 rounded",medium:"h-4 w-4 rounded-md",large:"h-5 w-5 rounded-lg"}),W=()=>({small:"h-2.5 w-2.5",medium:"h-3 w-3",large:"h-3.5 w-3.5"});function X(l,t){if(l&1&&(y(0),H(),m(1,"svg",5),E(2,"path",6),c(),v()),l&2){const n=F();u(),f(n.cn("shrink-0",n.cva(n.size,b(3,W),"medium"))),u(),_("d",n.indeterminate?n.ICON_PATHS.minus:n.ICON_PATHS.check)}}const i={id:"checkbox",checked:!1,indeterminate:!1,disabled:!1,required:!1,error:!1,errorMessage:"",validating:!1,size:"medium",labelPosition:"right",leftLabel:!1,rightLabel:!1,name:"checkbox",value:"",ariaLabel:"",className:""},d=class d{constructor(){a(this,"Boolean",Boolean);a(this,"validating",i.validating);a(this,"cn",J);a(this,"cva",x);a(this,"ICON_PATHS",G);a(this,"bindControllerProps",$);a(this,"labelPosition",i.labelPosition);a(this,"leftLabel",i.leftLabel);a(this,"rightLabel",i.rightLabel);a(this,"size",i.size);a(this,"disabled",i.disabled);a(this,"className",i.className);a(this,"id",i.id);a(this,"name",i.name);a(this,"value",i.value);a(this,"checked",i.checked);a(this,"required",i.required);a(this,"indeterminate",i.indeterminate);a(this,"error",i.error);a(this,"errorMessage",i.errorMessage);a(this,"ariaLabel",i.ariaLabel);a(this,"onCheckedChange",new g);a(this,"onValueChange",new g);a(this,"onBlur",new g)}};a(d,"ɵfac",function(n){return new(n||d)}),a(d,"ɵcmp",M({type:d,selectors:[["kd-checkbox"],["checkbox"]],inputs:{validating:"validating",labelPosition:"labelPosition",leftLabel:"leftLabel",rightLabel:"rightLabel",size:"size",disabled:"disabled",className:"className",id:"id",name:"name",value:"value",checked:"checked",required:"required",indeterminate:"indeterminate",error:"error",errorMessage:"errorMessage",ariaLabel:"ariaLabel"},outputs:{onCheckedChange:"onCheckedChange",onValueChange:"onValueChange",onBlur:"onBlur"},standalone:!1,ngContentSelectors:Q,decls:8,vars:17,consts:[[1,"relative","inline-flex","shrink-0","items-center","justify-center"],["type","checkbox",1,"peer","absolute","inset-0","h-full","w-full","cursor-pointer","appearance-none","opacity-0","disabled:cursor-not-allowed",3,"change","blur"],["aria-hidden","true"],[4,"ngIf"],[1,"text-sm","text-foreground-default"],["viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2.5"],["stroke-linecap","round","stroke-linejoin","round"]],template:function(n,e){n&1&&(z(),m(0,"label")(1,"span",0)(2,"input",1),j("change",function(){return!e.disabled&&(e.onCheckedChange?e.onCheckedChange.emit(!e.checked):e.onValueChange&&e.onValueChange.emit(!e.checked))})("blur",function(L){return!e.disabled&&e.onBlur&&e.onBlur.emit(L)}),c(),m(3,"span",2),q(4,X,3,4,"ng-container",3),c()(),y(5),m(6,"span",4),S(7),c(),v(),c()),n&2&&(f(e.cn("inline-flex items-center",e.labelPosition==="left"||e.leftLabel&&!e.rightLabel?"flex-row-reverse":"flex-row",e.cva(e.size,b(15,R),"medium"),e.disabled?"cursor-not-allowed opacity-50":"cursor-pointer",e.className)),_("data-ctrl",typeof e.bindControllerProps),u(2),_("id",e.id)("name",e.name)("value",e.value)("checked",e.checked?"":null)("disabled",e.disabled?"":null)("required",e.required?"":null)("aria-checked",e.indeterminate?"mixed":e.checked)("aria-invalid",e.error||e.Boolean(e.errorMessage)||void 0)("aria-label",e.ariaLabel||void 0),u(),f(e.cn("inline-flex items-center justify-center border shadow-xs transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary",e.cva(e.size,b(16,U),"medium"),e.checked||e.indeterminate?"border-primary-default bg-primary-default text-primary-foreground":"border-border-default bg-background-default")),u(),T("ngIf",e.checked||e.indeterminate))},dependencies:[K],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=d;(typeof ngDevMode>"u"||ngDevMode)&&C(s,[{type:O,args:[{standalone:!1,selector:"kd-checkbox, checkbox",template:`
    <label
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('inline-flex items-center', labelPosition === 'left' || leftLabel && !rightLabel ? 'flex-row-reverse' : 'flex-row', cva(size, {
          small: 'gap-1.5',
          medium: 'gap-2',
          large: 'gap-2.5'
        }, 'medium'), disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', className)"
      ><span class="relative inline-flex shrink-0 items-center justify-center"
        ><input
          type="checkbox"
          class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
          [attr.id]="id"
          [attr.name]="name"
          [attr.value]="value"
          [attr.checked]="(checked) ? '' : null"
          [attr.disabled]="(disabled) ? '' : null"
          [attr.required]="(required) ? '' : null"
          [attr.aria-checked]="indeterminate ? 'mixed' : checked"
          [attr.aria-invalid]="error || Boolean(errorMessage) || undefined"
          [attr.aria-label]="ariaLabel || undefined"
          (change)="!disabled && (onCheckedChange ? this.onCheckedChange.emit(!checked) : onValueChange && this.onValueChange.emit(!checked))"
          (blur)="!disabled && onBlur && this.onBlur.emit($event)" />
        <span
          aria-hidden="true"
          [class]="cn('inline-flex items-center justify-center border shadow-xs transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary', cva(size, {
          small: 'h-3.5 w-3.5 rounded',
          medium: 'h-4 w-4 rounded-md',
          large: 'h-5 w-5 rounded-lg'
        }, 'medium'), checked || indeterminate ? 'border-primary-default bg-primary-default text-primary-foreground' : 'border-border-default bg-background-default')"
          ><ng-container *ngIf="checked || indeterminate"
            ><svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              [class]="cn('shrink-0', cva(size, {
          small: 'h-2.5 w-2.5',
          medium: 'h-3 w-3',
          large: 'h-3.5 w-3.5'
        }, 'medium'))"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                [attr.d]="indeterminate ? ICON_PATHS.minus : ICON_PATHS.check"
              ></path></svg></ng-container></span
      ></span>
      <ng-container><span class="text-sm text-foreground-default"
          ><ng-content></ng-content></span></ng-container
    ></label>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{validating:[{type:r}],labelPosition:[{type:r}],leftLabel:[{type:r}],rightLabel:[{type:r}],size:[{type:r}],disabled:[{type:r}],className:[{type:r}],id:[{type:r}],name:[{type:r}],value:[{type:r}],checked:[{type:r}],required:[{type:r}],indeterminate:[{type:r}],error:[{type:r}],errorMessage:[{type:r}],ariaLabel:[{type:r}],onCheckedChange:[{type:h}],onValueChange:[{type:h}],onBlur:[{type:h}]});(typeof ngDevMode>"u"||ngDevMode)&&V(s,{className:"Checkbox",filePath:"Checkbox.ts",lineNumber:111});const o=class o{};a(o,"ɵfac",function(n){return new(n||o)}),a(o,"ɵmod",I({type:o})),a(o,"ɵinj",B({imports:[k]}));let p=o;(typeof ngDevMode>"u"||ngDevMode)&&C(p,[{type:D,args:[{declarations:[s],imports:[k],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&A(p,{declarations:[s],imports:[k],exports:[s]})})();export{p as CheckboxModule,s as default};

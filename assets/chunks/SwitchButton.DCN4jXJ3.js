var w=Object.defineProperty;var L=(d,s,l)=>s in d?w(d,s,{enumerable:!0,configurable:!0,writable:!0,value:l}):d[s]=l;var a=(d,s,l)=>L(d,typeof s!="symbol"?s+"":s,l);import{E as u,ɵ as M,a as P,b as N,c as z,j as f,k as B,z as D,p as b,i as V,q,r as j,u as m,v,t as y,an as p,s as _,O as g,I as n,C as E,f as I,N as S,g as F}from"./core.vpEFnhB-.js";import{a as O,e as T,d as J}from"./theme.CMj9otVT.js";import{C as h}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const $=["*"],A=()=>({small:"h-5 w-9 p-0.5",medium:"h-6 w-11 p-0.5",large:"h-8 w-14 p-0.5"}),G=()=>({small:"h-4 w-4",medium:"h-5 w-5",large:"h-7 w-7"}),H=()=>({small:"translate-x-4",medium:"translate-x-5",large:"translate-x-6"}),t={id:"switch-button",name:"switch",value:"on",checked:!1,disabled:!1,required:!1,error:!1,errorMessage:"",validating:!1,size:"medium",labelPosition:"right",leftLabel:!1,rightLabel:!1,ariaLabel:"",className:""},o=class o{constructor(){a(this,"Boolean",Boolean);a(this,"name",t.name);a(this,"value",t.value);a(this,"required",t.required);a(this,"validating",t.validating);a(this,"cn",O);a(this,"cva",T);a(this,"bindControllerProps",J);a(this,"labelPosition",t.labelPosition);a(this,"leftLabel",t.leftLabel);a(this,"rightLabel",t.rightLabel);a(this,"disabled",t.disabled);a(this,"className",t.className);a(this,"id",t.id);a(this,"checked",t.checked);a(this,"error",t.error);a(this,"errorMessage",t.errorMessage);a(this,"ariaLabel",t.ariaLabel);a(this,"size",t.size);a(this,"onCheckedChange",new u);a(this,"onValueChange",new u);a(this,"onBlur",new u)}};a(o,"ɵfac",function(l){return new(l||o)}),a(o,"ɵcmp",M({type:o,selectors:[["kd-switch-button"],["switch-button"]],inputs:{name:"name",value:"value",required:"required",validating:"validating",labelPosition:"labelPosition",leftLabel:"leftLabel",rightLabel:"rightLabel",disabled:"disabled",className:"className",id:"id",checked:"checked",error:"error",errorMessage:"errorMessage",ariaLabel:"ariaLabel",size:"size"},outputs:{onCheckedChange:"onCheckedChange",onValueChange:"onValueChange",onBlur:"onBlur"},standalone:!1,ngContentSelectors:$,decls:6,vars:15,consts:[["type","button","role","switch",3,"click","blur"],["aria-hidden","true"],[1,"text-sm","text-foreground-default"]],template:function(l,e){l&1&&(z(),f(0,"label")(1,"button",0),B("click",function(){return!e.disabled&&(e.onCheckedChange?e.onCheckedChange.emit(!e.checked):e.onValueChange&&e.onValueChange.emit(!e.checked))})("blur",function(C){return!e.disabled&&e.onBlur&&e.onBlur.emit(C)}),D(2,"span",1),b(),V(3),f(4,"span",2),q(5),b(),j(),b()),l&2&&(m(e.cn("inline-flex items-center gap-2",e.labelPosition==="left"||e.leftLabel&&!e.rightLabel?"flex-row-reverse":"flex-row",e.disabled?"cursor-not-allowed opacity-50":"cursor-pointer",e.className)),v("data-ctrl",typeof e.bindControllerProps),y(),m(e.cn("relative inline-flex shrink-0 items-center rounded-full shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none",e.cva(e.size,p(12,A),"medium"),e.checked?"bg-primary-default":"bg-background-interactive")),v("id",e.id)("aria-checked",e.checked)("aria-invalid",e.error||e.Boolean(e.errorMessage)||void 0)("aria-label",e.ariaLabel||void 0)("disabled",e.disabled?"":null),y(),m(e.cn("inline-block rounded-full bg-background-default shadow-sm transition-transform",e.cva(e.size,p(13,G),"medium"),e.checked?e.cva(e.size,p(14,H),"medium"):"translate-x-0")))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let i=o;(typeof ngDevMode>"u"||ngDevMode)&&_(i,[{type:E,args:[{standalone:!1,selector:"kd-switch-button, switch-button",template:`
    <label
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('inline-flex items-center gap-2', labelPosition === 'left' || leftLabel && !rightLabel ? 'flex-row-reverse' : 'flex-row', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', className)"
      ><button
        type="button"
        role="switch"
        [attr.id]="id"
        [attr.aria-checked]="checked"
        [attr.aria-invalid]="error || Boolean(errorMessage) || undefined"
        [attr.aria-label]="ariaLabel || undefined"
        [attr.disabled]="(disabled) ? '' : null"
        [class]="cn('relative inline-flex shrink-0 items-center rounded-full shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none', cva(size, {
          small: 'h-5 w-9 p-0.5',
          medium: 'h-6 w-11 p-0.5',
          large: 'h-8 w-14 p-0.5'
        }, 'medium'), checked ? 'bg-primary-default' : 'bg-background-interactive')"
        (click)="!disabled && (onCheckedChange ? this.onCheckedChange.emit(!checked) : onValueChange && this.onValueChange.emit(!checked))"
        (blur)="!disabled && onBlur && this.onBlur.emit($event)"
      >
        <span
          aria-hidden="true"
          [class]="cn('inline-block rounded-full bg-background-default shadow-sm transition-transform', cva(size, {
          small: 'h-4 w-4',
          medium: 'h-5 w-5',
          large: 'h-7 w-7'
        }, 'medium'), checked ? cva(size, {
          small: 'translate-x-4',
          medium: 'translate-x-5',
          large: 'translate-x-6'
        }, 'medium') : 'translate-x-0')"
        ></span>
      </button>
      <ng-container><span class="text-sm text-foreground-default"
          ><ng-content></ng-content></span></ng-container
    ></label>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{name:[{type:n}],value:[{type:n}],required:[{type:n}],validating:[{type:n}],labelPosition:[{type:n}],leftLabel:[{type:n}],rightLabel:[{type:n}],disabled:[{type:n}],className:[{type:n}],id:[{type:n}],checked:[{type:n}],error:[{type:n}],errorMessage:[{type:n}],ariaLabel:[{type:n}],size:[{type:n}],onCheckedChange:[{type:g}],onValueChange:[{type:g}],onBlur:[{type:g}]});(typeof ngDevMode>"u"||ngDevMode)&&I(i,{className:"SwitchButton",filePath:"SwitchButton.ts",lineNumber:94});const r=class r{};a(r,"ɵfac",function(l){return new(l||r)}),a(r,"ɵmod",P({type:r})),a(r,"ɵinj",N({imports:[h]}));let c=r;(typeof ngDevMode>"u"||ngDevMode)&&_(c,[{type:S,args:[{declarations:[i],imports:[h],exports:[i]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&F(c,{declarations:[i],imports:[h],exports:[i]})})();export{c as SwitchButtonModule,i as default};

var m=Object.defineProperty;var b=(d,s,t)=>s in d?m(d,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):d[s]=t;var e=(d,s,t)=>b(d,typeof s!="symbol"?s+"":s,t);import{E as g,ɵ as y,a as _,b as v,c as N,j as p,k as w,q as M,p as k,u as S,v as x,s as f,O as C,I as i,C as j,f as D,N as h,g as E}from"./core.vpEFnhB-.js";import{a as O}from"./theme.CecfD-Na.js";import{C as u}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const P=["*"],c={value:"",selected:!1,disabled:!1,className:""},l=class l{constructor(){e(this,"cn",O);e(this,"selected",c.selected);e(this,"disabled",c.disabled);e(this,"className",c.className);e(this,"value",c.value);e(this,"onSelect",new g)}};e(l,"ɵfac",function(t){return new(t||l)}),e(l,"ɵcmp",y({type:l,selectors:[["kd-input-dropdown-item"],["input-dropdown-item"]],inputs:{selected:"selected",disabled:"disabled",className:"className",value:"value"},outputs:{onSelect:"onSelect"},standalone:!1,ngContentSelectors:P,decls:3,vars:4,consts:[["type","button","role","option",3,"click"],[1,"truncate"]],template:function(t,n){t&1&&(N(),p(0,"button",0),w("click",function(){return!n.disabled&&n.onSelect&&n.onSelect.emit(n.value||"")}),p(1,"span",1),M(2),k()()),t&2&&(S(n.cn("flex w-full flex-row items-center justify-start gap-2.5 rounded-sm px-2 py-2 text-left text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",n.selected?"bg-background-muted font-medium text-foreground-default":"text-foreground-default hover:bg-background-muted",n.className)),x("aria-selected",n.selected)("disabled",n.disabled?"":null))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=l;(typeof ngDevMode>"u"||ngDevMode)&&f(a,[{type:j,args:[{standalone:!1,selector:"kd-input-dropdown-item, input-dropdown-item",template:`
    <button
      type="button"
      role="option"
      [attr.aria-selected]="selected"
      [attr.disabled]="(disabled) ? '' : null"
      [class]="cn('flex w-full flex-row items-center justify-start gap-2.5 rounded-sm px-2 py-2 text-left text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50', selected ? 'bg-background-muted font-medium text-foreground-default' : 'text-foreground-default hover:bg-background-muted', className)"
      (click)="!disabled && onSelect && this.onSelect.emit(value || '')"
    >
      <span class="truncate"><ng-content></ng-content></span>
    </button>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{selected:[{type:i}],disabled:[{type:i}],className:[{type:i}],value:[{type:i}],onSelect:[{type:C}]});(typeof ngDevMode>"u"||ngDevMode)&&D(a,{className:"InputDropdownItem",filePath:"InputDropdownItem.ts",lineNumber:45});const o=class o{};e(o,"ɵfac",function(t){return new(t||o)}),e(o,"ɵmod",_({type:o})),e(o,"ɵinj",v({imports:[u]}));let r=o;(typeof ngDevMode>"u"||ngDevMode)&&f(r,[{type:h,args:[{declarations:[a],imports:[u],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&E(r,{declarations:[a],imports:[u],exports:[a]})})();export{r as InputDropdownItemModule,a as default};

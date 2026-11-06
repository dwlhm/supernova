var z=Object.defineProperty;var M=(s,n,t)=>n in s?z(s,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[n]=t;var a=(s,n,t)=>M(s,typeof n!="symbol"?n+"":n,t);import{E as S,ɵ as I,a as D,b as P,j as p,k as x,d as b,z as T,p as u,u as g,v as _,t as d,e as C,w as h,s as k,O as E,I as l,C as j,f as F,N as O,g as J,i as y,o as w,r as v,m as L,am as N}from"./core.BqS-lykr.js";import{a as R,d as B,i as q,b as A}from"./utils.BBpd638g.js";import{C as f,N as G}from"./common_module-chunk.DvGwmKFp.js";const H=()=>({small:"h-5 w-9 p-0.5",medium:"h-6 w-11 p-0.5",large:"h-8 w-[52px] p-1"}),K=()=>({small:"h-4 w-4",medium:"h-5 w-5",large:"h-6 w-6"}),Q=()=>({small:"translate-x-4",medium:"translate-x-5",large:"translate-x-5"});function U(s,n){if(s&1&&(y(0),p(1,"span",4),w(2),u(),v()),s&2){const t=L();d(2),N(t.label)}}function V(s,n){if(s&1&&(y(0),p(1,"span",4),w(2),u(),v()),s&2){const t=L();d(2),N(t.label)}}const i={id:"switch-button",name:"switch",value:"on",checked:!1,disabled:!1,size:"medium",label:"Label",leftLabel:!1,rightLabel:!1,className:""},c=class c{constructor(){a(this,"name",i.name);a(this,"value",i.value);a(this,"leftLabel",i.leftLabel);a(this,"rightLabel",i.rightLabel);a(this,"cn",R);a(this,"cva",B);a(this,"getChoiceState",q);a(this,"bindControllerProps",A);a(this,"disabled",i.disabled);a(this,"className",i.className);a(this,"checked",i.checked);a(this,"label",i.label);a(this,"id",i.id);a(this,"size",i.size);a(this,"onCheckedChange",new S)}get props(){return this}};a(c,"ɵfac",function(t){return new(t||c)}),a(c,"ɵcmp",I({type:c,selectors:[["spn-switch-button"],["switch-button"]],inputs:{name:"name",value:"value",leftLabel:"leftLabel",rightLabel:"rightLabel",disabled:"disabled",className:"className",checked:"checked",label:"label",id:"id",size:"size"},outputs:{onCheckedChange:"onCheckedChange"},standalone:!1,decls:5,vars:16,consts:[[3,"click"],[4,"ngIf"],["type","button","role","switch"],["aria-hidden","true"],[1,"text-sm","text-foreground-default"]],template:function(t,e){t&1&&(p(0,"span",0),x("click",function(){return!e.disabled&&e.onCheckedChange&&e.onCheckedChange.emit(!e.checked)}),b(1,U,3,1,"ng-container",1),p(2,"button",2),T(3,"span",3),u(),b(4,V,3,1,"ng-container",1),u()),t&2&&(g(e.cn("inline-flex items-center gap-2",e.disabled?"cursor-not-allowed opacity-50":"cursor-pointer",e.className)),_("data-ctrl",typeof e.bindControllerProps),d(),C("ngIf",e.getChoiceState(e.props).showLeft),d(),g(e.cn("relative inline-flex shrink-0 items-center rounded-full shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none",e.cva(e.size,h(13,H),"medium"),e.checked?"bg-primary-default":"bg-background-interactive")),_("id",e.id)("aria-checked",e.checked)("aria-label",e.getChoiceState(e.props).hasLabel?e.label:"Toggle setting")("disabled",e.disabled?"":null),d(),g(e.cn("inline-block rounded-full bg-background-default shadow-sm transition-transform",e.cva(e.size,h(14,K),"medium"),e.checked?e.cva(e.size,h(15,Q),"medium"):"translate-x-0")),d(),C("ngIf",e.getChoiceState(e.props).showRight))},dependencies:[G],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let o=c;(typeof ngDevMode>"u"||ngDevMode)&&k(o,[{type:j,args:[{standalone:!1,selector:"spn-switch-button, switch-button",template:`
    <span
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('inline-flex items-center gap-2', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', className)"
      (click)="!disabled && onCheckedChange && this.onCheckedChange.emit(!checked)"
      ><ng-container *ngIf="getChoiceState(props).showLeft"
        ><span
          class="text-sm text-foreground-default"
          >{{label}}</span
        ></ng-container
      >
      <button
        type="button"
        role="switch"
        [attr.id]="id"
        [attr.aria-checked]="checked"
        [attr.aria-label]="getChoiceState(props).hasLabel ? label : 'Toggle setting'"
        [attr.disabled]="(disabled) ? '' : null"
        [class]="cn('relative inline-flex shrink-0 items-center rounded-full shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none', cva(size, {
          small: 'h-5 w-9 p-0.5',
          medium: 'h-6 w-11 p-0.5',
          large: 'h-8 w-[52px] p-1'
        }, 'medium'), checked ? 'bg-primary-default' : 'bg-background-interactive')"
      >
        <span
          aria-hidden="true"
          [class]="cn('inline-block rounded-full bg-background-default shadow-sm transition-transform', cva(size, {
          small: 'h-4 w-4',
          medium: 'h-5 w-5',
          large: 'h-6 w-6'
        }, 'medium'), checked ? cva(size, {
          small: 'translate-x-4',
          medium: 'translate-x-5',
          large: 'translate-x-5'
        }, 'medium') : 'translate-x-0')"
        ></span>
      </button>
      <ng-container *ngIf="getChoiceState(props).showRight"
        ><span
          class="text-sm text-foreground-default"
          >{{label}}</span
        ></ng-container
      ></span
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{name:[{type:l}],value:[{type:l}],leftLabel:[{type:l}],rightLabel:[{type:l}],disabled:[{type:l}],className:[{type:l}],checked:[{type:l}],label:[{type:l}],id:[{type:l}],size:[{type:l}],onCheckedChange:[{type:E}]});(typeof ngDevMode>"u"||ngDevMode)&&F(o,{className:"SwitchButton",filePath:"SwitchButton.ts",lineNumber:89});const r=class r{};a(r,"ɵfac",function(t){return new(t||r)}),a(r,"ɵmod",D({type:r})),a(r,"ɵinj",P({imports:[f]}));let m=r;(typeof ngDevMode>"u"||ngDevMode)&&k(m,[{type:O,args:[{declarations:[o],imports:[f],exports:[o]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&J(m,{declarations:[o],imports:[f],exports:[o]})})();export{m as SwitchButtonModule,o as default};

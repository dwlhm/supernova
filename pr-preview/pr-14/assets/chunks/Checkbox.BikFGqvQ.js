var S=Object.defineProperty;var L=(t,i,n)=>i in t?S(t,i,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[i]=n;var a=(t,i,n)=>L(t,typeof i!="symbol"?i+"":i,n);import{E as z,ɵ as P,a as x,b as M,j as p,d as h,k as T,p as u,u as g,w as b,v as _,t as l,e as f,s as w,O as q,I as s,C as j,f as O,N as D,g as A,i as k,o as N,r as C,m as y,am as I,y as H,z as E}from"./core.BqS-lykr.js";import{a as R,d as F,i as B,I as J,b as G}from"./utils.BBpd638g.js";import{C as v,N as V}from"./common_module-chunk.DvGwmKFp.js";const K=()=>({small:"gap-1.5",medium:"gap-2",large:"gap-2.5"}),Q=()=>({small:"h-3.5 w-3.5",medium:"h-4 w-4",large:"h-5 w-5"}),U=()=>({small:"h-2.5 w-2.5",medium:"h-3 w-3",large:"h-3.5 w-3.5"});function W(t,i){if(t&1&&(k(0),p(1,"span",4),N(2),u(),C()),t&2){const n=y();l(2),I(n.label)}}function X(t,i){if(t&1&&(k(0),H(),p(1,"svg",5),E(2,"path",6),u(),C()),t&2){const n=y();l(),g(n.cn("shrink-0",n.cva(n.size,b(3,U),"medium"))),l(),_("d",n.indeterminate?n.ICON_PATHS.minus:n.ICON_PATHS.check)}}function Y(t,i){if(t&1&&(k(0),p(1,"span",4),N(2),u(),C()),t&2){const n=y();l(2),I(n.label)}}const r={id:"checkbox",checked:!1,indeterminate:!1,disabled:!1,required:!1,size:"medium",label:"Label",leftLabel:!1,rightLabel:!1,name:"checkbox",value:"",className:""},c=class c{constructor(){a(this,"leftLabel",r.leftLabel);a(this,"rightLabel",r.rightLabel);a(this,"cn",R);a(this,"cva",F);a(this,"getChoiceState",B);a(this,"ICON_PATHS",J);a(this,"bindControllerProps",G);a(this,"size",r.size);a(this,"disabled",r.disabled);a(this,"className",r.className);a(this,"label",r.label);a(this,"id",r.id);a(this,"name",r.name);a(this,"value",r.value);a(this,"checked",r.checked);a(this,"required",r.required);a(this,"indeterminate",r.indeterminate);a(this,"onCheckedChange",new z)}get props(){return this}};a(c,"ɵfac",function(n){return new(n||c)}),a(c,"ɵcmp",P({type:c,selectors:[["spn-checkbox"],["checkbox"]],inputs:{leftLabel:"leftLabel",rightLabel:"rightLabel",size:"size",disabled:"disabled",className:"className",label:"label",id:"id",name:"name",value:"value",checked:"checked",required:"required",indeterminate:"indeterminate"},outputs:{onCheckedChange:"onCheckedChange"},standalone:!1,decls:7,vars:18,consts:[[4,"ngIf"],[1,"relative","inline-flex","shrink-0","items-center","justify-center"],["type","checkbox",1,"peer","absolute","inset-0","h-full","w-full","cursor-pointer","appearance-none","opacity-0","disabled:cursor-not-allowed",3,"change"],["aria-hidden","true"],[1,"text-sm","text-foreground-default"],["viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2.5"],["stroke-linecap","round","stroke-linejoin","round"]],template:function(n,e){n&1&&(p(0,"label"),h(1,W,3,1,"ng-container",0),p(2,"span",1)(3,"input",2),T("change",function(){return!e.disabled&&e.onCheckedChange&&e.onCheckedChange.emit(!e.checked)}),u(),p(4,"span",3),h(5,X,3,4,"ng-container",0),u()(),h(6,Y,3,1,"ng-container",0),u()),n&2&&(g(e.cn("inline-flex items-center",e.cva(e.size,b(16,K),"medium"),e.disabled?"cursor-not-allowed opacity-50":"cursor-pointer",e.className)),_("data-ctrl",typeof e.bindControllerProps),l(),f("ngIf",e.getChoiceState(e.props).showLeft),l(2),_("id",e.id)("name",e.name)("value",e.value)("checked",e.checked?"":null)("disabled",e.disabled?"":null)("required",e.required?"":null)("aria-checked",e.indeterminate?"mixed":e.checked)("aria-label",!e.getChoiceState(e.props).showLeft&&!e.getChoiceState(e.props).showRight?e.label||"Checkbox":void 0),l(),g(e.cn("inline-flex items-center justify-center rounded-sm border shadow-xs transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary",e.cva(e.size,b(17,Q),"medium"),e.checked||e.indeterminate?"border-primary-default bg-primary-default text-primary-foreground":"border-border-default bg-background-default")),l(),f("ngIf",e.checked||e.indeterminate),l(),f("ngIf",e.getChoiceState(e.props).showRight))},dependencies:[V],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let o=c;(typeof ngDevMode>"u"||ngDevMode)&&w(o,[{type:j,args:[{standalone:!1,selector:"spn-checkbox, checkbox",template:`
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
          type="checkbox"
          class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
          [attr.id]="id"
          [attr.name]="name"
          [attr.value]="value"
          [attr.checked]="(checked) ? '' : null"
          [attr.disabled]="(disabled) ? '' : null"
          [attr.required]="(required) ? '' : null"
          [attr.aria-checked]="indeterminate ? 'mixed' : checked"
          [attr.aria-label]="!getChoiceState(props).showLeft && !getChoiceState(props).showRight ? label || 'Checkbox' : undefined"
          (change)="!disabled && onCheckedChange && this.onCheckedChange.emit(!checked)" />
        <span
          aria-hidden="true"
          [class]="cn('inline-flex items-center justify-center rounded-sm border shadow-xs transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary', cva(size, {
          small: 'h-3.5 w-3.5',
          medium: 'h-4 w-4',
          large: 'h-5 w-5'
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
    `]}]}],null,{leftLabel:[{type:s}],rightLabel:[{type:s}],size:[{type:s}],disabled:[{type:s}],className:[{type:s}],label:[{type:s}],id:[{type:s}],name:[{type:s}],value:[{type:s}],checked:[{type:s}],required:[{type:s}],indeterminate:[{type:s}],onCheckedChange:[{type:q}]});(typeof ngDevMode>"u"||ngDevMode)&&O(o,{className:"Checkbox",filePath:"Checkbox.ts",lineNumber:114});const d=class d{};a(d,"ɵfac",function(n){return new(n||d)}),a(d,"ɵmod",x({type:d})),a(d,"ɵinj",M({imports:[v]}));let m=d;(typeof ngDevMode>"u"||ngDevMode)&&w(m,[{type:D,args:[{declarations:[o],imports:[v],exports:[o]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&A(m,{declarations:[o],imports:[v],exports:[o]})})();export{m as CheckboxModule,o as default};

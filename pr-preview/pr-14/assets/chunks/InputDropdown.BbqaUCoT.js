var E=Object.defineProperty;var j=(n,a,t)=>a in n?E(n,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[a]=t;var o=(n,a,t)=>j(n,typeof a!="symbol"?a+"":a,t);import{E as D,ɵ as B,a as F,b as q,j as l,d as f,k as C,p as d,u as m,v as w,t as r,e as c,s as L,O as k,I as s,C as Q,f as R,N as A,g as V,i as u,o as y,r as g,m as p,x as $,y as N,z as T,am as I,h as M,l as H,n as P}from"./core.BqS-lykr.js";import{a as z,k as J,I as G,b as K}from"./utils.BBpd638g.js";import{C as O,a as U,N as W}from"./common_module-chunk.DvGwmKFp.js";function X(n,a){n&1&&(u(0),l(1,"span",6),y(2,"*"),d(),g())}function Y(n,a){if(n&1&&(u(0),l(1,"span",5),y(2),f(3,X,3,0,"ng-container",0),d(),g()),n&2){const t=p();r(2),$("",t.label," "),r(),c("ngIf",t.required)}}function Z(n,a){if(n&1&&(u(0),N(),l(1,"svg",7),T(2,"path",8),d(),g()),n&2){const t=p();r(2),w("d",t.ICON_PATHS.menu)}}function ee(n,a){if(n&1&&(u(0),y(1),g()),n&2){const t=p();r(),I(t.getDropdownState(t.props).selectedLabel)}}function te(n,a){if(n&1&&(u(0),y(1),g()),n&2){const t=p();r(),I(t.placeholder)}}function ne(n,a){if(n&1&&(u(0),N(),l(1,"svg",7),T(2,"path",9),d(),g()),n&2){const t=p();r(2),w("d",t.ICON_PATHS.chevronDown)}}function oe(n,a){if(n&1){const t=M();u(0),l(1,"div",10)(2,"input",11),C("input",function(x){H(t);const v=p();return P(v.onSearchChange&&v.onSearchChange.emit(x.target.value))}),d()(),g()}if(n&2){const t=p();r(2),w("value",t.searchQuery)}}function re(n,a){if(n&1){const t=M();u(0),l(1,"button",12),C("click",function(){const x=H(t).$implicit,v=p();return P(v.onSelect&&v.onSelect.emit(x.value))}),l(2,"span",13),y(3),d()(),g()}if(n&2){const t=a.$implicit,e=p();r(),m(e.cn("flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",t.value===e.value?"bg-background-muted text-foreground-default":"text-foreground-default hover:bg-background-muted")),w("aria-selected",t.value===e.value)("disabled",t.disabled?"":null),r(2),I(t.label)}}function ae(n,a){if(n&1&&(u(0),l(1,"span"),y(2),d(),g()),n&2){const t=p();r(),m(t.cn("text-sm",t.getDropdownState(t.props).hasError?"text-destructive-foreground":"text-foreground-muted")),r(),I(t.getDropdownState(t.props).helpText)}}const i={open:!1,value:"",options:[],searchQuery:"",id:"input-dropdown",name:"dropdown",label:"Department",placeholder:"Choose department",hint:"Select your department or area of work.",errorMessage:"",disabled:!1,required:!1,showLabel:!0,showHint:!1,showSearch:!0,showLeftIcon:!1,showRightIcon:!0,className:""},_=class _{constructor(){o(this,"options",i.options);o(this,"name",i.name);o(this,"hint",i.hint);o(this,"errorMessage",i.errorMessage);o(this,"cn",z);o(this,"getDropdownState",J);o(this,"ICON_PATHS",G);o(this,"bindControllerProps",K);o(this,"id",i.id);o(this,"className",i.className);o(this,"showLabel",i.showLabel);o(this,"label",i.label);o(this,"required",i.required);o(this,"disabled",i.disabled);o(this,"open",i.open);o(this,"showLeftIcon",i.showLeftIcon);o(this,"placeholder",i.placeholder);o(this,"showRightIcon",i.showRightIcon);o(this,"showSearch",i.showSearch);o(this,"searchQuery",i.searchQuery);o(this,"value",i.value);o(this,"showHint",i.showHint);o(this,"onOpenChange",new D);o(this,"onSearchChange",new D);o(this,"onSelect",new D)}get props(){return this}trackByOption0(a,t){return t.value}};o(_,"ɵfac",function(t){return new(t||_)}),o(_,"ɵcmp",B({type:_,selectors:[["spn-input-dropdown"],["input-dropdown"]],inputs:{options:"options",name:"name",hint:"hint",errorMessage:"errorMessage",id:"id",className:"className",showLabel:"showLabel",label:"label",required:"required",disabled:"disabled",open:"open",showLeftIcon:"showLeftIcon",placeholder:"placeholder",showRightIcon:"showRightIcon",showSearch:"showSearch",searchQuery:"searchQuery",value:"value",showHint:"showHint"},outputs:{onOpenChange:"onOpenChange",onSearchChange:"onSearchChange",onSelect:"onSelect"},standalone:!1,decls:14,vars:23,consts:[[4,"ngIf"],["type","button","aria-haspopup","listbox",3,"click"],[1,"flex","items-center","gap-1.5","truncate"],["role","listbox",1,"flex","max-h-60","flex-col","overflow-y-auto","p-1"],[4,"ngFor","ngForOf","ngForTrackBy"],[1,"flex","items-center","gap-1","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4","shrink-0","text-foreground-muted"],["stroke-linecap","round"],["stroke-linecap","round","stroke-linejoin","round"],[1,"flex","items-center","gap-2","border-b","border-border-default","px-3","py-2"],["type","search","placeholder","Search","aria-label","Search options",1,"w-full","bg-transparent","text-sm","text-foreground-default","outline-none","placeholder:text-foreground-subtle",3,"input"],["type","button","role","option",3,"click"],[1,"truncate"]],template:function(t,e){t&1&&(l(0,"div"),f(1,Y,4,2,"ng-container",0),l(2,"button",1),C("click",function(){return!e.disabled&&e.onOpenChange&&e.onOpenChange.emit(!e.open)}),l(3,"span",2),f(4,Z,3,1,"ng-container",0),l(5,"span"),f(6,ee,2,1,"ng-container",0)(7,te,2,1,"ng-container",0),d()(),f(8,ne,3,1,"ng-container",0),d(),l(9,"div"),f(10,oe,3,1,"ng-container",0),l(11,"div",3),f(12,re,4,5,"ng-container",4),d()(),f(13,ae,3,3,"ng-container",0),d()),t&2&&(m(e.cn("relative flex w-full flex-col gap-3",e.className)),w("id",e.id)("data-ctrl",typeof e.bindControllerProps),r(),c("ngIf",e.showLabel&&e.label!==""),r(),m(e.cn("flex h-9 w-full items-center justify-between gap-1.5 rounded-lg border bg-background-default px-3 text-left shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50",e.getDropdownState(e.props).hasError?"border-destructive-border focus:ring-2 focus:ring-focus-ring-error":e.getDropdownState(e.props).isOpen?"border-primary-border-emphasis ring-2 ring-focus-ring-primary":"border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary")),w("aria-expanded",e.getDropdownState(e.props).isOpen)("aria-invalid",e.getDropdownState(e.props).hasError)("disabled",e.disabled?"":null),r(2),c("ngIf",e.showLeftIcon),r(),m(e.cn("truncate text-sm",e.getDropdownState(e.props).selectedLabel!==""?"text-foreground-default":"text-foreground-subtle")),r(),c("ngIf",e.getDropdownState(e.props).selectedLabel!==""),r(),c("ngIf",e.getDropdownState(e.props).selectedLabel===""),r(),c("ngIf",e.showRightIcon),r(),m(e.cn("absolute top-full z-50 mt-2 w-full overflow-hidden rounded-md border border-border-default bg-background-default shadow-lg",e.getDropdownState(e.props).isOpen?"block":"hidden")),r(),c("ngIf",e.showSearch),r(),w("aria-label",e.label),r(),c("ngForOf",e.getDropdownState(e.props).filtered)("ngForTrackBy",e.trackByOption0),r(),c("ngIf",e.showHint))},dependencies:[U,W],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let h=_;(typeof ngDevMode>"u"||ngDevMode)&&L(h,[{type:Q,args:[{standalone:!1,selector:"spn-input-dropdown, input-dropdown",template:`
    <div
      [attr.id]="id"
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('relative flex w-full flex-col gap-3', className)"
    >
      <ng-container *ngIf="showLabel && label !== ''"
        ><span
          class="flex items-center gap-1 text-sm font-medium text-foreground-default"
          >{{label}}
          <ng-container *ngIf="required"
            ><span aria-hidden="true" class="text-destructive-default"
              >*</span
            ></ng-container
          ></span
        ></ng-container
      >
      <button
        type="button"
        aria-haspopup="listbox"
        [attr.aria-expanded]="getDropdownState(props).isOpen"
        [attr.aria-invalid]="getDropdownState(props).hasError"
        [attr.disabled]="(disabled) ? '' : null"
        [class]="cn('flex h-9 w-full items-center justify-between gap-1.5 rounded-lg border bg-background-default px-3 text-left shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50', getDropdownState(props).hasError ? 'border-destructive-border focus:ring-2 focus:ring-focus-ring-error' : getDropdownState(props).isOpen ? 'border-primary-border-emphasis ring-2 ring-focus-ring-primary' : 'border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary')"
        (click)="!disabled && onOpenChange && this.onOpenChange.emit(!open)"
      >
        <span class="flex items-center gap-1.5 truncate"
          ><ng-container *ngIf="showLeftIcon"
            ><svg
              aria-hidden="true"
              class="h-4 w-4 shrink-0 text-foreground-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                [attr.d]="ICON_PATHS.menu"
              ></path></svg
          ></ng-container>
          <span
            [class]="cn('truncate text-sm', getDropdownState(props).selectedLabel !== '' ? 'text-foreground-default' : 'text-foreground-subtle')"
            ><ng-container
              *ngIf="getDropdownState(props).selectedLabel !== ''"
              >{{getDropdownState(props).selectedLabel}}</ng-container
            ><ng-container
              *ngIf="!(getDropdownState(props).selectedLabel !== '')"
              >{{placeholder}}</ng-container
            ></span
          ></span
        >
        <ng-container *ngIf="showRightIcon"
          ><svg
            aria-hidden="true"
            class="h-4 w-4 shrink-0 text-foreground-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="ICON_PATHS.chevronDown"
            ></path></svg
        ></ng-container>
      </button>
      <div
        [class]="cn('absolute top-full z-50 mt-2 w-full overflow-hidden rounded-md border border-border-default bg-background-default shadow-lg', getDropdownState(props).isOpen ? 'block' : 'hidden')"
      >
        <ng-container *ngIf="showSearch"
          ><div
            class="flex items-center gap-2 border-b border-border-default px-3 py-2"
          >
            <input
              type="search"
              placeholder="Search"
              aria-label="Search options"
              class="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-foreground-subtle"
              [attr.value]="searchQuery"
              (input)="onSearchChange && this.onSearchChange.emit($any($event.target).value)"
            /></div
        ></ng-container>
        <div
          role="listbox"
          class="flex max-h-60 flex-col overflow-y-auto p-1"
          [attr.aria-label]="label"
        >
          <ng-container
            *ngFor="let option of getDropdownState(props).filtered; trackBy: trackByOption0"
            ><button
              type="button"
              role="option"
              [attr.aria-selected]="option.value === value"
              [attr.disabled]="(option.disabled) ? '' : null"
              [class]="cn('flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50', option.value === value ? 'bg-background-muted text-foreground-default' : 'text-foreground-default hover:bg-background-muted')"
              (click)="onSelect && this.onSelect.emit(option.value)"
            >
              <span class="truncate">{{option.label}}</span>
            </button></ng-container
          >
        </div>
      </div>
      <ng-container *ngIf="showHint"
        ><span
          [class]="cn('text-sm', getDropdownState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
          >{{getDropdownState(props).helpText}}</span
        ></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{options:[{type:s}],name:[{type:s}],hint:[{type:s}],errorMessage:[{type:s}],id:[{type:s}],className:[{type:s}],showLabel:[{type:s}],label:[{type:s}],required:[{type:s}],disabled:[{type:s}],open:[{type:s}],showLeftIcon:[{type:s}],placeholder:[{type:s}],showRightIcon:[{type:s}],showSearch:[{type:s}],searchQuery:[{type:s}],value:[{type:s}],showHint:[{type:s}],onOpenChange:[{type:k}],onSearchChange:[{type:k}],onSelect:[{type:k}]});(typeof ngDevMode>"u"||ngDevMode)&&R(h,{className:"InputDropdown",filePath:"InputDropdown.ts",lineNumber:179});const b=class b{};o(b,"ɵfac",function(t){return new(t||b)}),o(b,"ɵmod",F({type:b})),o(b,"ɵinj",q({imports:[O]}));let S=b;(typeof ngDevMode>"u"||ngDevMode)&&L(S,[{type:A,args:[{declarations:[h],imports:[O],exports:[h]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&V(S,{declarations:[h],imports:[O],exports:[h]})})();export{S as InputDropdownModule,h as default};

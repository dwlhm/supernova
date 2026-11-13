var L=Object.defineProperty;var V=(o,i,t)=>i in o?L(o,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[i]=t;var n=(o,i,t)=>V(o,typeof i!="symbol"?i+"":i,t);import{E as C,ɵ as B,a as q,b as A,c as Q,j as l,d as p,k as P,q as x,o as S,p as d,u as m,v as f,t as a,e as u,ao as j,s as H,O as D,I as r,C as R,f as $,N as z,g as F,i as w,r as _,m as g,x as J,y as k,z as O,h as G,aq as K,l as N,n as E,A as M}from"./core.vpEFnhB-.js";import{a as U,t as W,I as X,d as Y}from"./theme.CMj9otVT.js";import{C as T,N as Z,a as ee}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const te=[[["","leftIcon",""],["","slot","lefticon"]],[["","rightIcon",""],["","slot","righticon"]],"*"],ne=["[leftIcon],[slot=leftIcon]","[rightIcon],[slot=rightIcon]","*"];function oe(o,i){o&1&&(w(0),l(1,"span",6),S(2,"*"),d(),_())}function re(o,i){if(o&1&&(w(0),l(1,"span",5),S(2),p(3,oe,3,0,"ng-container",0),d(),_()),o&2){const t=g();a(2),J("",t.label," "),a(),u("ngIf",t.required)}}function ae(o,i){o&1&&M(0)}function se(o,i){if(o&1&&(w(0),p(1,ae,1,0,"ng-container",7),_()),o&2){const t=g();a(),u("ngComponentOutlet",t.leftIcon)}}function ie(o,i){if(o&1&&(w(0),k(),l(1,"svg",8),O(2,"path",9),d(),_()),o&2){const t=g();a(),m(t.cn("h-4 w-4 shrink-0",t.getDropdownState(t.props).hasError?"text-destructive-foreground":"text-foreground-muted")),a(),f("d",t.ICON_PATHS.menu)}}function le(o,i){o&1&&M(0)}function de(o,i){if(o&1&&(w(0),p(1,le,1,0,"ng-container",7),_()),o&2){const t=g();a(),u("ngComponentOutlet",t.rightIcon)}}function pe(o,i){if(o&1&&(w(0),k(),l(1,"svg",8),O(2,"path",10),d(),_()),o&2){const t=g();a(),m(t.cn("h-4 w-4 shrink-0 transition-transform",t.getDropdownState(t.props).isOpen&&"rotate-180",t.getDropdownState(t.props).hasError?"text-destructive-foreground":"text-foreground-muted")),a(),f("d",t.ICON_PATHS.chevronDown)}}function ue(o,i){if(o&1){const t=G();w(0),l(1,"div",11),k(),l(2,"svg",12),O(3,"path",10),d(),K(),l(4,"input",13),P("input",function(y){N(t);const c=g();return E(c.onSearchChange&&c.onSearchChange.emit(y.target.value))})("keydown",function(y){N(t);const c=g();return E(y.key==="Escape"&&c.onOpenChange&&c.onOpenChange.emit(!1))}),d()(),_()}if(o&2){const t=g();a(3),f("d",t.ICON_PATHS.search),a(),f("value",t.searchQuery)("placeholder",t.searchPlaceholder)}}function ce(o,i){if(o&1&&(w(0),l(1,"span"),S(2),d(),_()),o&2){const t=g();a(),m(t.cn("text-sm",t.getDropdownState(t.props).hasError?"text-destructive-foreground":"text-foreground-muted")),f("id",t.id+"-hint"),a(),j(t.getDropdownState(t.props).helpText)}}const s={open:!1,value:"",displayValue:"",searchQuery:"",searchPlaceholder:"Search",id:"input-dropdown",name:"dropdown",label:"",placeholder:"Select option",hint:"",error:!1,errorMessage:"",validating:!1,disabled:!1,required:!1,showLabel:!0,showHint:!1,showSearch:!0,showLeftIcon:!1,showRightIcon:!0,state:"default",className:""},I=class I{constructor(){n(this,"displayValue",s.displayValue);n(this,"name",s.name);n(this,"placeholder",s.placeholder);n(this,"hint",s.hint);n(this,"error",s.error);n(this,"errorMessage",s.errorMessage);n(this,"validating",s.validating);n(this,"onValueChange");n(this,"cn",U);n(this,"getDropdownState",W);n(this,"ICON_PATHS",X);n(this,"bindControllerProps",Y);n(this,"id",s.id);n(this,"className",s.className);n(this,"showLabel",s.showLabel);n(this,"label",s.label);n(this,"required",s.required);n(this,"disabled",s.disabled);n(this,"state",s.state);n(this,"showHint",s.showHint);n(this,"open",s.open);n(this,"leftIcon");n(this,"showLeftIcon",s.showLeftIcon);n(this,"value",s.value);n(this,"rightIcon");n(this,"showRightIcon",s.showRightIcon);n(this,"showSearch",s.showSearch);n(this,"searchQuery",s.searchQuery);n(this,"searchPlaceholder",s.searchPlaceholder);n(this,"onOpenChange",new C);n(this,"onBlur",new C);n(this,"onSearchChange",new C)}get props(){return this}};n(I,"ɵfac",function(t){return new(t||I)}),n(I,"ɵcmp",B({type:I,selectors:[["kd-input-dropdown"],["input-dropdown"]],inputs:{displayValue:"displayValue",name:"name",placeholder:"placeholder",hint:"hint",error:"error",errorMessage:"errorMessage",validating:"validating",onValueChange:"onValueChange",id:"id",className:"className",showLabel:"showLabel",label:"label",required:"required",disabled:"disabled",state:"state",showHint:"showHint",open:"open",leftIcon:"leftIcon",showLeftIcon:"showLeftIcon",value:"value",rightIcon:"rightIcon",showRightIcon:"showRightIcon",showSearch:"showSearch",searchQuery:"searchQuery",searchPlaceholder:"searchPlaceholder"},outputs:{onOpenChange:"onOpenChange",onBlur:"onBlur",onSearchChange:"onSearchChange"},standalone:!1,ngContentSelectors:ne,decls:18,vars:24,consts:[[4,"ngIf"],[1,"relative","w-full"],["type","button","aria-haspopup","listbox",3,"click","keydown","blur"],[1,"flex","items-center","gap-2.5","truncate"],["role","listbox",1,"flex","max-h-60","w-full","flex-col","items-start","justify-start","overflow-y-auto","px-1","py-1"],[1,"flex","flex-row","items-center","justify-start","gap-2","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],[4,"ngComponentOutlet"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],["stroke-linecap","round"],["stroke-linecap","round","stroke-linejoin","round"],[1,"flex","w-full","flex-row","items-center","justify-start","gap-2","border-b","border-border-default","px-3","py-2"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4","shrink-0","text-foreground-muted"],["type","search","aria-label","Search options",1,"w-full","bg-transparent","text-sm","text-foreground-default","outline-none","placeholder:text-foreground-subtle",3,"input","keydown"]],template:function(t,e){t&1&&(Q(te),l(0,"div"),p(1,re,4,2,"ng-container",0),l(2,"div",1)(3,"button",2),P("click",function(){return!(e.disabled||e.state==="disabled")&&e.onOpenChange&&e.onOpenChange.emit(!e.open)})("keydown",function(c){return c.key==="Escape"&&e.open&&e.onOpenChange&&e.onOpenChange.emit(!1)})("blur",function(c){return!(e.disabled||e.state==="disabled")&&e.onBlur&&e.onBlur.emit(c)}),l(4,"span",3),p(5,se,2,1,"ng-container",0),x(6),p(7,ie,3,3,"ng-container",0),l(8,"span"),S(9),d()(),p(10,de,2,1,"ng-container",0),x(11,1),p(12,pe,3,3,"ng-container",0),d(),l(13,"div"),p(14,ue,5,3,"ng-container",0),l(15,"div",4),x(16,2),d()()(),p(17,ce,3,4,"ng-container",0),d()),t&2&&(m(e.cn("flex w-full flex-col items-start justify-start gap-3",e.className)),f("id",e.id)("data-ctrl",typeof e.bindControllerProps),a(),u("ngIf",e.showLabel&&e.label!==""),a(2),m(e.cn("flex h-9 w-full flex-row items-center justify-between gap-1.5 rounded-lg border px-3 py-2 text-left shadow-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",e.disabled||e.state==="disabled"?"cursor-not-allowed opacity-50 bg-background-muted border-border-default":e.cn("cursor-pointer bg-background-default hover:bg-background-subtle",e.getDropdownState(e.props).hasError?"border-destructive-border ring-2 ring-focus-ring-error":e.getDropdownState(e.props).isOpen?"border-primary-border-emphasis ring-2 ring-focus-ring-primary":"border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary"))),f("disabled",e.disabled||e.state==="disabled"?"":null)("aria-expanded",e.getDropdownState(e.props).isOpen)("aria-invalid",e.getDropdownState(e.props).hasError)("aria-busy",e.getDropdownState(e.props).isValidating||void 0)("aria-describedby",(e.showHint||e.getDropdownState(e.props).hasError)&&e.getDropdownState(e.props).helpText!==""?e.id+"-hint":void 0),a(2),u("ngIf",e.leftIcon),a(2),u("ngIf",e.showLeftIcon&&!e.leftIcon),a(),m(e.cn("truncate text-base font-normal",e.value!==""||e.state==="filled"?"text-foreground-default":"text-foreground-subtle")),a(),j(e.getDropdownState(e.props).displayText),a(),u("ngIf",e.rightIcon),a(2),u("ngIf",e.showRightIcon&&!e.rightIcon),a(),m(e.cn("absolute left-0 top-full z-50 mt-1.5 flex w-full flex-col items-start justify-start overflow-hidden rounded-lg border border-border-default bg-background-default shadow-md",e.getDropdownState(e.props).isOpen?"flex":"hidden")),a(),u("ngIf",e.showSearch),a(),f("aria-label",e.label||"Options"),a(2),u("ngIf",(e.showHint||e.getDropdownState(e.props).hasError)&&e.getDropdownState(e.props).helpText!==""))},dependencies:[Z,ee],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let h=I;(typeof ngDevMode>"u"||ngDevMode)&&H(h,[{type:R,args:[{standalone:!1,selector:"kd-input-dropdown, input-dropdown",template:`
    <div
      [attr.id]="id"
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('flex w-full flex-col items-start justify-start gap-3', className)"
    >
      <ng-container *ngIf="showLabel && label !== ''"
        ><span
          class="flex flex-row items-center justify-start gap-2 text-sm font-medium text-foreground-default"
          >{{label}}
          <ng-container *ngIf="required"
            ><span aria-hidden="true" class="text-destructive-default"
              >*</span
            ></ng-container
          ></span
        ></ng-container
      >
      <div class="relative w-full">
        <button
          type="button"
          aria-haspopup="listbox"
          [attr.disabled]="(disabled || state === 'disabled') ? '' : null"
          [attr.aria-expanded]="getDropdownState(props).isOpen"
          [attr.aria-invalid]="getDropdownState(props).hasError"
          [attr.aria-busy]="getDropdownState(props).isValidating || undefined"
          [attr.aria-describedby]="(showHint || getDropdownState(props).hasError) && getDropdownState(props).helpText !== '' ? id + '-hint' : undefined"
          [class]="cn('flex h-9 w-full flex-row items-center justify-between gap-1.5 rounded-lg border px-3 py-2 text-left shadow-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50', disabled || state === 'disabled' ? 'cursor-not-allowed opacity-50 bg-background-muted border-border-default' : cn('cursor-pointer bg-background-default hover:bg-background-subtle', getDropdownState(props).hasError ? 'border-destructive-border ring-2 ring-focus-ring-error' : getDropdownState(props).isOpen ? 'border-primary-border-emphasis ring-2 ring-focus-ring-primary' : 'border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary'))"
          (click)="!(disabled || state === 'disabled') && onOpenChange && this.onOpenChange.emit(!open)"
          (keydown)="$event.key === 'Escape' && open && onOpenChange && this.onOpenChange.emit(false)"
          (blur)="!(disabled || state === 'disabled') && onBlur && this.onBlur.emit($event)"
        >
          <span class="flex items-center gap-2.5 truncate"
            ><ng-container *ngIf="leftIcon"><ng-container *ngComponentOutlet="leftIcon"></ng-container></ng-container><ng-content select="[leftIcon],[slot=leftIcon]"></ng-content>
            <ng-container *ngIf="showLeftIcon && !leftIcon"
              ><svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                [class]="cn('h-4 w-4 shrink-0', getDropdownState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
              >
                <path
                  stroke-linecap="round"
                  [attr.d]="ICON_PATHS.menu"
                ></path></svg
            ></ng-container>
            <span
              [class]="cn('truncate text-base font-normal', value !== '' || state === 'filled' ? 'text-foreground-default' : 'text-foreground-subtle')"
              >{{getDropdownState(props).displayText}}</span
            ></span
          >
          <ng-container *ngIf="rightIcon"><ng-container *ngComponentOutlet="rightIcon"></ng-container></ng-container><ng-content select="[rightIcon],[slot=rightIcon]"></ng-content>
          <ng-container *ngIf="showRightIcon && !rightIcon"
            ><svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              [class]="cn('h-4 w-4 shrink-0 transition-transform', getDropdownState(props).isOpen && 'rotate-180', getDropdownState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                [attr.d]="ICON_PATHS.chevronDown"
              ></path></svg
          ></ng-container>
        </button>
        <div
          [class]="cn('absolute left-0 top-full z-50 mt-1.5 flex w-full flex-col items-start justify-start overflow-hidden rounded-lg border border-border-default bg-background-default shadow-md', getDropdownState(props).isOpen ? 'flex' : 'hidden')"
        >
          <ng-container *ngIf="showSearch"
            ><div
              class="flex w-full flex-row items-center justify-start gap-2 border-b border-border-default px-3 py-2"
            >
              <svg
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
                  [attr.d]="ICON_PATHS.search"
                ></path>
              </svg>
              <input
                type="search"
                aria-label="Search options"
                class="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-foreground-subtle"
                [attr.value]="searchQuery"
                [attr.placeholder]="searchPlaceholder"
                (input)="onSearchChange && this.onSearchChange.emit($any($event.target).value)"
                (keydown)="$event.key === 'Escape' && onOpenChange && this.onOpenChange.emit(false)"
              /></div
          ></ng-container>
          <div
            role="listbox"
            class="flex max-h-60 w-full flex-col items-start justify-start overflow-y-auto px-1 py-1"
            [attr.aria-label]="label || 'Options'"
          >
            <ng-content></ng-content>
          </div>
        </div>
      </div>
      <ng-container
        *ngIf="(showHint || getDropdownState(props).hasError) && getDropdownState(props).helpText !== ''"
        ><span
          [attr.id]="id + '-hint'"
          [class]="cn('text-sm', getDropdownState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
          >{{getDropdownState(props).helpText}}</span
        ></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{displayValue:[{type:r}],name:[{type:r}],placeholder:[{type:r}],hint:[{type:r}],error:[{type:r}],errorMessage:[{type:r}],validating:[{type:r}],onValueChange:[{type:r}],id:[{type:r}],className:[{type:r}],showLabel:[{type:r}],label:[{type:r}],required:[{type:r}],disabled:[{type:r}],state:[{type:r}],showHint:[{type:r}],open:[{type:r}],leftIcon:[{type:r}],showLeftIcon:[{type:r}],value:[{type:r}],rightIcon:[{type:r}],showRightIcon:[{type:r}],showSearch:[{type:r}],searchQuery:[{type:r}],searchPlaceholder:[{type:r}],onOpenChange:[{type:D}],onBlur:[{type:D}],onSearchChange:[{type:D}]});(typeof ngDevMode>"u"||ngDevMode)&&$(h,{className:"InputDropdown",filePath:"InputDropdown.ts",lineNumber:193});const b=class b{};n(b,"ɵfac",function(t){return new(t||b)}),n(b,"ɵmod",q({type:b})),n(b,"ɵinj",A({imports:[T]}));let v=b;(typeof ngDevMode>"u"||ngDevMode)&&H(v,[{type:z,args:[{declarations:[h],imports:[T],exports:[h]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&F(v,{declarations:[h],imports:[T],exports:[h]})})();export{v as InputDropdownModule,h as default};

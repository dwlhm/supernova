var N=Object.defineProperty;var k=(i,n,o)=>n in i?N(i,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):i[n]=o;var t=(i,n,o)=>k(i,typeof n!="symbol"?n+"":n,o);import{ɵ as w,a as M,b as T,c as O,j as m,k as j,q as x,p as g,o as P,z as D,u as d,v as y,t as c,w as h,an as S,ao as I,s as v,I as s,C as H,f as E,N as F,g as L}from"./core.vpEFnhB-.js";import{a as z,e as K,h as J,d as q}from"./theme.CecfD-Na.js";import{C}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const $=["*"],_=i=>({id:i}),A=()=>({top:"bottom-full left-1/2 mb-1.5 -translate-x-1/2 flex-col",bottom:"top-full left-1/2 mt-1.5 -translate-x-1/2 flex-col-reverse",left:"right-full top-1/2 mr-1.5 -translate-y-1/2 flex-row",right:"left-full top-1/2 ml-1.5 -translate-y-1/2 flex-row-reverse"}),l={text:"Label",position:"top",trigger:"hover",id:"tooltip",contentClassName:"",dotClassName:"",className:""},p=class p{constructor(){t(this,"cn",z);t(this,"cva",K);t(this,"createTooltipState",J);t(this,"bindControllerProps",q);t(this,"trigger",l.trigger);t(this,"open");t(this,"onOpenChange");t(this,"className",l.className);t(this,"id",l.id);t(this,"position",l.position);t(this,"contentClassName",l.contentClassName);t(this,"text",l.text);t(this,"dotClassName",l.dotClassName);t(this,"isHovered",!1);t(this,"isClickedOpen",!1)}handleMouseEnter(){this.trigger!=="click"&&(this.isHovered=!0)}handleMouseLeave(){this.trigger!=="click"&&(this.isHovered=!1)}handleClick(){var n;this.trigger==="click"&&(this.isClickedOpen=!(this.open??this.isClickedOpen),(n=this.onOpenChange)==null||n.call(this,this.isClickedOpen))}handleKeyDown(n){var o;n.key==="Escape"&&(this.isHovered=!1,this.isClickedOpen=!1,(o=this.onOpenChange)==null||o.call(this,!1))}};t(p,"ɵfac",function(o){return new(o||p)}),t(p,"ɵcmp",w({type:p,selectors:[["kd-tooltip"],["tooltip"]],inputs:{trigger:"trigger",open:"open",onOpenChange:"onOpenChange",className:"className",id:"id",position:"position",contentClassName:"contentClassName",text:"text",dotClassName:"dotClassName"},standalone:!1,ngContentSelectors:$,decls:7,vars:21,consts:[[3,"mouseenter","mouseleave","click","keydown"],[1,"inline-flex","h-full","w-full","cursor-pointer","select-none","items-center","justify-center","focus:outline-none"],["aria-hidden","true"]],template:function(o,e){o&1&&(O(),m(0,"span",0),j("mouseenter",function(){return e.handleMouseEnter()})("mouseleave",function(){return e.handleMouseLeave()})("click",function(){return e.handleClick()})("keydown",function(b){return e.handleKeyDown(b)}),m(1,"span",1),x(2),g(),m(3,"span")(4,"span"),P(5),g(),D(6,"span",2),g()()),o&2&&(d(e.cn("group relative inline-flex items-center justify-center",e.className)),y("data-ctrl",typeof e.bindControllerProps),c(),y("tabIndex",0)("aria-describedby",e.createTooltipState(h(14,_,e.id)).getTriggerProps()["aria-describedby"]),c(2),d(e.cn("pointer-events-none absolute z-50 inline-flex items-center justify-center gap-0.5 whitespace-nowrap transition-all duration-150",e.open===!0||e.open!==!1&&(e.trigger==="click"?e.isClickedOpen:e.isHovered)?"scale-100 opacity-100":"scale-95 opacity-0",e.trigger!=="click"&&e.open===void 0?"group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100":"",e.cva(e.position,S(16,A),"top"))),y("role",e.createTooltipState(h(17,_,e.id)).getContentProps().role)("id",e.createTooltipState(h(19,_,e.id)).getContentProps().id),c(),d(e.cn("inline-flex items-center justify-center rounded-lg bg-primary-default px-3 py-2 font-body text-sm font-normal leading-5 text-primary-foreground",e.contentClassName)),c(),I(e.text),c(),d(e.cn("h-1.5 w-1.5 shrink-0 rounded-full bg-primary-default",e.dotClassName||e.contentClassName)))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=p;(typeof ngDevMode>"u"||ngDevMode)&&v(a,[{type:H,args:[{standalone:!1,selector:"kd-tooltip, tooltip",template:`
    <span
      [attr.data-ctrl]="typeof bindControllerProps"
      (mouseenter)="handleMouseEnter()"
      (mouseleave)="handleMouseLeave()"
      (click)="handleClick()"
      (keydown)="handleKeyDown($event)"
      [class]="cn('group relative inline-flex items-center justify-center', className)"
      ><span
        class="inline-flex h-full w-full cursor-pointer select-none items-center justify-center focus:outline-none"
        [attr.tabIndex]="0"
        [attr.aria-describedby]="createTooltipState({
          id: id
        }).getTriggerProps()['aria-describedby']"
        ><ng-content></ng-content
      ></span>
      <span
        [attr.role]="createTooltipState({
          id: id
        }).getContentProps().role"
        [attr.id]="createTooltipState({
          id: id
        }).getContentProps().id"
        [class]="cn('pointer-events-none absolute z-50 inline-flex items-center justify-center gap-0.5 whitespace-nowrap transition-all duration-150', open === true || open !== false && (trigger === 'click' ? isClickedOpen : isHovered) ? 'scale-100 opacity-100' : 'scale-95 opacity-0', trigger !== 'click' && open === undefined ? 'group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100' : '', cva(position, {
          top: 'bottom-full left-1/2 mb-1.5 -translate-x-1/2 flex-col',
          bottom: 'top-full left-1/2 mt-1.5 -translate-x-1/2 flex-col-reverse',
          left: 'right-full top-1/2 mr-1.5 -translate-y-1/2 flex-row',
          right: 'left-full top-1/2 ml-1.5 -translate-y-1/2 flex-row-reverse'
        }, 'top'))"
        ><span
          [class]="cn('inline-flex items-center justify-center rounded-lg bg-primary-default px-3 py-2 font-body text-sm font-normal leading-5 text-primary-foreground', contentClassName)"
          >{{text}}</span
        >
        <span
          aria-hidden="true"
          [class]="cn('h-1.5 w-1.5 shrink-0 rounded-full bg-primary-default', dotClassName || contentClassName)"
        ></span></span
    ></span>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{trigger:[{type:s}],open:[{type:s}],onOpenChange:[{type:s}],className:[{type:s}],id:[{type:s}],position:[{type:s}],contentClassName:[{type:s}],text:[{type:s}],dotClassName:[{type:s}]});(typeof ngDevMode>"u"||ngDevMode)&&E(a,{className:"Tooltip",filePath:"Tooltip.ts",lineNumber:78});const r=class r{};t(r,"ɵfac",function(o){return new(o||r)}),t(r,"ɵmod",M({type:r})),t(r,"ɵinj",T({imports:[C]}));let f=r;(typeof ngDevMode>"u"||ngDevMode)&&v(f,[{type:F,args:[{declarations:[a],imports:[C],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&L(f,{declarations:[a],imports:[C],exports:[a]})})();export{f as TooltipModule,a as default};

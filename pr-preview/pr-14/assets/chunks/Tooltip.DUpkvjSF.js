var b=Object.defineProperty;var v=(s,o,n)=>o in s?b(s,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):s[o]=n;var e=(s,o,n)=>v(s,typeof o!="symbol"?o+"":o,n);import{ɵ as N,a as h,b as w,c as P,j as u,i as M,q as S,r as j,o as T,p as g,z as D,u as y,v as _,ap as c,t as x,w as I,am as F,s as C,I as l,C as z,f as k,N as E,g as J}from"./core.BqS-lykr.js";import{a as q,d as O,x as A,b as B}from"./utils.BBpd638g.js";import{C as m}from"./common_module-chunk.DvGwmKFp.js";const G=["*"],f=s=>({id:s}),H=()=>({top:"flex-col",bottom:"flex-col-reverse",left:"flex-row",right:"flex-row-reverse"}),p={text:"",textContent:"",position:"top",id:"tooltip",className:""},r=class r{constructor(){e(this,"cn",q);e(this,"cva",O);e(this,"createTooltipState",A);e(this,"bindControllerProps",B);e(this,"id",p.id);e(this,"className",p.className);e(this,"position",p.position);e(this,"textContent",p.textContent);e(this,"text",p.text)}};e(r,"ɵfac",function(n){return new(n||r)}),e(r,"ɵcmp",N({type:r,selectors:[["spn-tooltip"],["tooltip"]],inputs:{id:"id",className:"className",position:"position",textContent:"textContent",text:"text"},standalone:!1,ngContentSelectors:G,decls:7,vars:16,consts:[[1,"inline-flex","items-center","justify-center","rounded-lg","bg-primary-default","px-3","py-2","font-body","text-sm","font-normal","leading-5","text-primary-foreground"],["aria-hidden","true",1,"h-1.5","w-1.5","shrink-0","rounded-full","bg-primary-default"]],template:function(n,t){n&1&&(P(),u(0,"span"),M(1),S(2),j(),u(3,"span")(4,"span",0),T(5),g(),D(6,"span",1),g()()),n&2&&(y(t.cn("group relative inline-flex items-center justify-center",t.className)),_("data-ctrl",typeof t.bindControllerProps)("aria-describedby",t.createTooltipState(c(9,f,t.id)).getTriggerProps()["aria-describedby"]),x(3),y(t.cn("pointer-events-none z-50 inline-flex items-center justify-center gap-0.5 whitespace-nowrap transition-opacity",t.cva(t.position,I(11,H),"top"))),_("role",t.createTooltipState(c(12,f,t.id)).getContentProps().role)("id",t.createTooltipState(c(14,f,t.id)).getContentProps().id),x(2),F(t.textContent||t.text))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=r;(typeof ngDevMode>"u"||ngDevMode)&&C(a,[{type:z,args:[{standalone:!1,selector:"spn-tooltip, tooltip",template:`
    <span
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-describedby]="createTooltipState({
          id: id
        }).getTriggerProps()['aria-describedby']"
      [class]="cn('group relative inline-flex items-center justify-center', className)"
      ><ng-container><ng-content></ng-content></ng-container>
      <span
        [attr.role]="createTooltipState({
          id: id
        }).getContentProps().role"
        [attr.id]="createTooltipState({
          id: id
        }).getContentProps().id"
        [class]="cn('pointer-events-none z-50 inline-flex items-center justify-center gap-0.5 whitespace-nowrap transition-opacity', cva(position, {
          top: 'flex-col',
          bottom: 'flex-col-reverse',
          left: 'flex-row',
          right: 'flex-row-reverse'
        }, 'top'))"
        ><span
          class="inline-flex items-center justify-center rounded-lg bg-primary-default px-3 py-2 font-body text-sm font-normal leading-5 text-primary-foreground"
          >{{textContent || text}}</span
        >
        <span
          aria-hidden="true"
          class="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-default"
        ></span></span
    ></span>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{id:[{type:l}],className:[{type:l}],position:[{type:l}],textContent:[{type:l}],text:[{type:l}]});(typeof ngDevMode>"u"||ngDevMode)&&k(a,{className:"Tooltip",filePath:"Tooltip.ts",lineNumber:64});const i=class i{};e(i,"ɵfac",function(n){return new(n||i)}),e(i,"ɵmod",h({type:i})),e(i,"ɵinj",w({imports:[m]}));let d=i;(typeof ngDevMode>"u"||ngDevMode)&&C(d,[{type:E,args:[{declarations:[a],imports:[m],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&J(d,{declarations:[a],imports:[m],exports:[a]})})();export{d as TooltipModule,a as default};

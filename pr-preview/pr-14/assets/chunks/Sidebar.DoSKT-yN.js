var b=Object.defineProperty;var m=(d,t,e)=>t in d?b(d,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[t]=e;var a=(d,t,e)=>m(d,typeof t!="symbol"?t+"":t,e);import{ɵ as u,a as g,b as y,c as _,j as x,q as N,p as C,u as M,v,s as f,I as i,C as w,f as D,N as L,g as h}from"./core.vpEFnhB-.js";import{a as j,d as P}from"./theme.CecfD-Na.js";import{C as c}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const k=["*"],p={expanded:!0,ariaLabel:"Sidebar",className:""},o=class o{constructor(){a(this,"cn",j);a(this,"bindControllerProps",P);a(this,"expanded",p.expanded);a(this,"ariaLabel",p.ariaLabel);a(this,"className",p.className)}};a(o,"ɵfac",function(e){return new(e||o)}),a(o,"ɵcmp",u({type:o,selectors:[["kd-sidebar"],["sidebar"]],inputs:{expanded:"expanded",ariaLabel:"ariaLabel",className:"className"},standalone:!1,ngContentSelectors:k,decls:2,vars:5,template:function(e,r){e&1&&(_(),x(0,"aside"),N(1),C()),e&2&&(M(r.cn("flex h-full shrink-0 flex-col justify-between border-r border-border-default bg-background-default pt-0 pb-2",r.expanded?"w-60 items-start":"w-16 items-center",r.className)),v("data-ctrl",typeof r.bindControllerProps)("data-expanded",r.expanded?"true":"false")("aria-label",r.ariaLabel))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=o;(typeof ngDevMode>"u"||ngDevMode)&&f(s,[{type:w,args:[{standalone:!1,selector:"kd-sidebar, sidebar",template:`
    <aside
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.data-expanded]="expanded ? 'true' : 'false'"
      [attr.aria-label]="ariaLabel"
      [class]="cn('flex h-full shrink-0 flex-col justify-between border-r border-border-default bg-background-default pt-0 pb-2', expanded ? 'w-60 items-start' : 'w-16 items-center', className)"
    >
      <ng-content></ng-content>
    </aside>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{expanded:[{type:i}],ariaLabel:[{type:i}],className:[{type:i}]});(typeof ngDevMode>"u"||ngDevMode)&&D(s,{className:"Sidebar",filePath:"Sidebar.ts",lineNumber:39});const n=class n{};a(n,"ɵfac",function(e){return new(e||n)}),a(n,"ɵmod",g({type:n})),a(n,"ɵinj",y({imports:[c]}));let l=n;(typeof ngDevMode>"u"||ngDevMode)&&f(l,[{type:L,args:[{declarations:[s],imports:[c],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&h(l,{declarations:[s],imports:[c],exports:[s]})})();export{l as SidebarModule,s as default};

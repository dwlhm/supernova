var m=Object.defineProperty;var u=(o,a,e)=>a in o?m(o,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[a]=e;var t=(o,a,e)=>u(o,typeof a!="symbol"?a+"":a,e);import{ɵ as g,a as y,b as _,c as b,j as x,q as v,p as M,u as N,v as C,s as f,I as d,C as D,f as L,N as j,g as w}from"./core.vpEFnhB-.js";import{a as I}from"./theme.CecfD-Na.js";import{C as c}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const h=["*"],p={expanded:!0,ariaLabel:"Main",className:""},l=class l{constructor(){t(this,"cn",I);t(this,"ariaLabel",p.ariaLabel);t(this,"expanded",p.expanded);t(this,"className",p.className)}};t(l,"ɵfac",function(e){return new(e||l)}),t(l,"ɵcmp",g({type:l,selectors:[["kd-sidebar-nav"],["sidebar-nav"]],inputs:{ariaLabel:"ariaLabel",expanded:"expanded",className:"className"},standalone:!1,ngContentSelectors:h,decls:2,vars:3,template:function(e,i){e&1&&(b(),x(0,"nav"),v(1),M()),e&2&&(N(i.cn("flex w-full flex-1 flex-col justify-start gap-2 px-2 py-2",i.expanded?"items-start":"items-center",i.className)),C("aria-label",i.ariaLabel))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=l;(typeof ngDevMode>"u"||ngDevMode)&&f(s,[{type:D,args:[{standalone:!1,selector:"kd-sidebar-nav, sidebar-nav",template:`
    <nav
      [attr.aria-label]="ariaLabel"
      [class]="cn('flex w-full flex-1 flex-col justify-start gap-2 px-2 py-2', expanded ? 'items-start' : 'items-center', className)"
    >
      <ng-content></ng-content>
    </nav>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{ariaLabel:[{type:d}],expanded:[{type:d}],className:[{type:d}]});(typeof ngDevMode>"u"||ngDevMode)&&L(s,{className:"SidebarNav",filePath:"SidebarNav.ts",lineNumber:33});const n=class n{};t(n,"ɵfac",function(e){return new(e||n)}),t(n,"ɵmod",y({type:n})),t(n,"ɵinj",_({imports:[c]}));let r=n;(typeof ngDevMode>"u"||ngDevMode)&&f(r,[{type:j,args:[{declarations:[s],imports:[c],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&w(r,{declarations:[s],imports:[c],exports:[s]})})();export{r as SidebarNavModule,s as default};

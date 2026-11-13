var m=Object.defineProperty;var g=(d,t,e)=>t in d?m(d,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[t]=e;var s=(d,t,e)=>g(d,typeof t!="symbol"?t+"":t,e);import{ɵ as y,a as x,b as _,c as v,j as N,q as M,p as j,u as p,t as b,s as u,I as r,C,f as w,N as D,g as h}from"./core.vpEFnhB-.js";import{a as k}from"./theme.CecfD-Na.js";import{C as i}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const I=["*"],f={expanded:!0,className:""},o=class o{constructor(){s(this,"cn",k);s(this,"expanded",f.expanded);s(this,"className",f.className)}};s(o,"ɵfac",function(e){return new(e||o)}),s(o,"ɵcmp",y({type:o,selectors:[["kd-sidebar-account"],["sidebar-account"]],inputs:{expanded:"expanded",className:"className"},standalone:!1,ngContentSelectors:I,decls:3,vars:4,template:function(e,l){e&1&&(v(),N(0,"div")(1,"div"),M(2),j()()),e&2&&(p(l.cn("flex w-full flex-col justify-start gap-2.5 px-2",l.expanded?"items-start":"h-12 items-center",l.className)),b(),p(l.cn("flex flex-row items-center gap-2 rounded-xl bg-background-muted px-2 py-2",l.expanded?"w-full justify-start":"justify-center")))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=o;(typeof ngDevMode>"u"||ngDevMode)&&u(a,[{type:C,args:[{standalone:!1,selector:"kd-sidebar-account, sidebar-account",template:`
    <div
      [class]="cn('flex w-full flex-col justify-start gap-2.5 px-2', expanded ? 'items-start' : 'h-12 items-center', className)"
    >
      <div
        [class]="cn('flex flex-row items-center gap-2 rounded-xl bg-background-muted px-2 py-2', expanded ? 'w-full justify-start' : 'justify-center')"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{expanded:[{type:r}],className:[{type:r}]});(typeof ngDevMode>"u"||ngDevMode)&&w(a,{className:"SidebarAccount",filePath:"SidebarAccount.ts",lineNumber:35});const n=class n{};s(n,"ɵfac",function(e){return new(e||n)}),s(n,"ɵmod",x({type:n})),s(n,"ɵinj",_({imports:[i]}));let c=n;(typeof ngDevMode>"u"||ngDevMode)&&u(c,[{type:D,args:[{declarations:[a],imports:[i],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&h(c,{declarations:[a],imports:[i],exports:[a]})})();export{c as SidebarAccountModule,a as default};

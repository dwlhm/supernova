var m=Object.defineProperty;var u=(l,a,e)=>a in l?m(l,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[a]=e;var t=(l,a,e)=>u(l,typeof a!="symbol"?a+"":a,e);import{ɵ as b,a as g,b as y,c as _,j as N,q as C,p as M,u as v,v as x,s as f,I as d,C as w,f as D,N as L,g as j}from"./core.vpEFnhB-.js";import{a as P,d as I}from"./theme.CMj9otVT.js";import{C as c}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const h=["*"],p={ariaLabel:"Breadcrumb",className:""},o=class o{constructor(){t(this,"cn",P);t(this,"bindControllerProps",I);t(this,"ariaLabel",p.ariaLabel);t(this,"className",p.className)}};t(o,"ɵfac",function(e){return new(e||o)}),t(o,"ɵcmp",b({type:o,selectors:[["kd-breadcrumb"],["breadcrumb"]],inputs:{ariaLabel:"ariaLabel",className:"className"},standalone:!1,ngContentSelectors:h,decls:3,vars:4,consts:[[1,"flex","flex-row","flex-wrap","justify-start","items-center","gap-1.5","text-sm","font-normal","text-foreground-muted"]],template:function(e,r){e&1&&(_(),N(0,"nav")(1,"ol",0),C(2),M()()),e&2&&(v(r.cn("w-full",r.className)),x("data-ctrl",typeof r.bindControllerProps)("aria-label",r.ariaLabel))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=o;(typeof ngDevMode>"u"||ngDevMode)&&f(s,[{type:w,args:[{standalone:!1,selector:"kd-breadcrumb, breadcrumb",template:`
    <nav
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-label]="ariaLabel"
      [class]="cn('w-full', className)"
    >
      <ol
        class="flex flex-row flex-wrap justify-start items-center gap-1.5 text-sm font-normal text-foreground-muted"
      >
        <ng-content></ng-content>
      </ol>
    </nav>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{ariaLabel:[{type:d}],className:[{type:d}]});(typeof ngDevMode>"u"||ngDevMode)&&D(s,{className:"Breadcrumb",filePath:"Breadcrumb.ts",lineNumber:37});const n=class n{};t(n,"ɵfac",function(e){return new(e||n)}),t(n,"ɵmod",g({type:n})),t(n,"ɵinj",y({imports:[c]}));let i=n;(typeof ngDevMode>"u"||ngDevMode)&&f(i,[{type:L,args:[{declarations:[s],imports:[c],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&j(i,{declarations:[s],imports:[c],exports:[s]})})();export{i as BreadcrumbModule,s as default};

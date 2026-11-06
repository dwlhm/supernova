var m=Object.defineProperty;var u=(l,t,e)=>t in l?m(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var s=(l,t,e)=>u(l,typeof t!="symbol"?t+"":t,e);import{ɵ as y,a as g,b,c as w,j as _,q as N,p as h,u as C,v as M,s as f,I as i,C as v,f as E,N as D,g as j}from"./core.BqS-lykr.js";import{a as x,b as P}from"./utils.BBpd638g.js";import{C as d}from"./common_module-chunk.DvGwmKFp.js";const I=["*"],c={type:"2",showEllipsis:!0,className:""},o=class o{constructor(){s(this,"cn",x);s(this,"bindControllerProps",P);s(this,"type",c.type);s(this,"showEllipsis",c.showEllipsis);s(this,"className",c.className)}};s(o,"ɵfac",function(e){return new(e||o)}),s(o,"ɵcmp",y({type:o,selectors:[["spn-breadcrumb"],["breadcrumb"]],inputs:{type:"type",showEllipsis:"showEllipsis",className:"className"},standalone:!1,ngContentSelectors:I,decls:3,vars:5,consts:[["aria-label","Breadcrumb"],[1,"flex","flex-row","flex-wrap","justify-start","items-center","gap-1.5","text-sm","font-normal"]],template:function(e,r){e&1&&(w(),_(0,"nav",0)(1,"ol",1),N(2),h()()),e&2&&(C(r.cn("w-full",r.className)),M("data-ctrl",typeof r.bindControllerProps)("data-type",r.type)("data-show-ellipsis",r.showEllipsis))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=o;(typeof ngDevMode>"u"||ngDevMode)&&f(a,[{type:v,args:[{standalone:!1,selector:"spn-breadcrumb, breadcrumb",template:`
    <nav
      aria-label="Breadcrumb"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.data-type]="type"
      [attr.data-show-ellipsis]="showEllipsis"
      [class]="cn('w-full', className)"
    >
      <ol
        class="flex flex-row flex-wrap justify-start items-center gap-1.5 text-sm font-normal"
      >
        <ng-content></ng-content>
      </ol>
    </nav>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{type:[{type:i}],showEllipsis:[{type:i}],className:[{type:i}]});(typeof ngDevMode>"u"||ngDevMode)&&E(a,{className:"Breadcrumb",filePath:"Breadcrumb.ts",lineNumber:40});const n=class n{};s(n,"ɵfac",function(e){return new(e||n)}),s(n,"ɵmod",g({type:n})),s(n,"ɵinj",b({imports:[d]}));let p=n;(typeof ngDevMode>"u"||ngDevMode)&&f(p,[{type:D,args:[{declarations:[a],imports:[d],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&j(p,{declarations:[a],imports:[d],exports:[a]})})();export{p as BreadcrumbModule,a as default};

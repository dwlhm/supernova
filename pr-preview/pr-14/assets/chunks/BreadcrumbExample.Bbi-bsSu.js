var g=Object.defineProperty;var _=(o,s,e)=>s in o?g(o,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[s]=e;var r=(o,s,e)=>_(o,typeof s!="symbol"?s+"":s,e);import{ɵ as C,a as M,b as h,j as i,o as p,p as d,z as v,e as c,t as f,s as y,C as x,f as D,N,g as w}from"./core.BqS-lykr.js";import E,{BreadcrumbModule as l}from"./Breadcrumb.DtdtmrmH.js";import B,{BreadcrumbItemModule as u}from"./BreadcrumbItem.julvPRvL.js";import{C as b}from"./common_module-chunk.DvGwmKFp.js";import"./utils.BBpd638g.js";const a=class a{};r(a,"ɵfac",function(e){return new(e||a)}),r(a,"ɵcmp",C({type:a,selectors:[["spn-breadcrumb-example"],["breadcrumb-example"]],standalone:!1,decls:8,vars:3,consts:[["type","deep",3,"showEllipsis"],["href","/"],[3,"isEllipsis"],["href","/components"],[3,"isCurrent"]],template:function(e,I){e&1&&(i(0,"spn-breadcrumb",0)(1,"spn-breadcrumb-item",1),p(2,"Home"),d(),v(3,"spn-breadcrumb-item",2),i(4,"spn-breadcrumb-item",3),p(5,"Components"),d(),i(6,"spn-breadcrumb-item",4),p(7,"Breadcrumb"),d()()),e&2&&(c("showEllipsis",!0),f(3),c("isEllipsis",!0),f(3),c("isCurrent",!0))},dependencies:[E,B],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let t=a;(typeof ngDevMode>"u"||ngDevMode)&&y(t,[{type:x,args:[{standalone:!1,selector:"spn-breadcrumb-example, breadcrumb-example",template:`
    <spn-breadcrumb type="deep" [showEllipsis]="true"
      ><spn-breadcrumb-item href="/">Home</spn-breadcrumb-item>
      <spn-breadcrumb-item [isEllipsis]="true"></spn-breadcrumb-item>
      <spn-breadcrumb-item href="/components">Components</spn-breadcrumb-item>
      <spn-breadcrumb-item [isCurrent]="true"
        >Breadcrumb</spn-breadcrumb-item
      ></spn-breadcrumb
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&D(t,{className:"BreadcrumbExample",filePath:"BreadcrumbExample.ts",lineNumber:29});const n=class n{};r(n,"ɵfac",function(e){return new(e||n)}),r(n,"ɵmod",M({type:n})),r(n,"ɵinj",h({imports:[b,l,u]}));let m=n;(typeof ngDevMode>"u"||ngDevMode)&&y(m,[{type:N,args:[{declarations:[t],imports:[b,l,u],exports:[t]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&w(m,{declarations:[t],imports:[b,l,u],exports:[t]})})();export{m as BreadcrumbExampleModule,t as default};

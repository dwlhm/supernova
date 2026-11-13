var f=Object.defineProperty;var u=(i,s,e)=>s in i?f(i,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[s]=e;var a=(i,s,e)=>u(i,typeof s!="symbol"?s+"":s,e);import{ɵ as g,a as y,b,y as h,j as _,z as C,p as N,u as v,v as M,s as m,I as c,C as z,f as k,N as w,g as L}from"./core.vpEFnhB-.js";import{a as D,d as P}from"./theme.CecfD-Na.js";import{C as p}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const d={size:12,ariaLabel:"Placeholder icon",className:""},l=class l{constructor(){a(this,"cn",D);a(this,"bindControllerProps",P);a(this,"ariaLabel",d.ariaLabel);a(this,"size",d.size);a(this,"className",d.className)}};a(l,"ɵfac",function(e){return new(e||l)}),a(l,"ɵcmp",g({type:l,selectors:[["kd-icon-placeholder"],["icon-placeholder"]],inputs:{ariaLabel:"ariaLabel",size:"size",className:"className"},standalone:!1,decls:2,vars:6,consts:[["role","img","viewBox","0 0 12 12","fill","none","stroke","currentColor","stroke-width","1"],["cx","6","cy","6","r","5"]],template:function(e,o){e&1&&(h(),_(0,"svg",0),C(1,"circle",1),N()),e&2&&(v(o.cn("inline-block shrink-0 text-foreground-muted",o.className)),M("data-ctrl",typeof o.bindControllerProps)("aria-label",o.ariaLabel)("width",o.size)("height",o.size))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let t=l;(typeof ngDevMode>"u"||ngDevMode)&&m(t,[{type:z,args:[{standalone:!1,selector:"kd-icon-placeholder, icon-placeholder",template:`
    <svg
      role="img"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      stroke-width="1"
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.aria-label]="ariaLabel"
      [attr.width]="size"
      [attr.height]="size"
      [class]="cn('inline-block shrink-0 text-foreground-muted', className)"
    >
      <circle cx="6" cy="6" r="5"></circle>
    </svg>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{ariaLabel:[{type:c}],size:[{type:c}],className:[{type:c}]});(typeof ngDevMode>"u"||ngDevMode)&&k(t,{className:"IconPlaceholder",filePath:"IconPlaceholder.ts",lineNumber:45});const n=class n{};a(n,"ɵfac",function(e){return new(e||n)}),a(n,"ɵmod",y({type:n})),a(n,"ɵinj",b({imports:[p]}));let r=n;(typeof ngDevMode>"u"||ngDevMode)&&m(r,[{type:w,args:[{declarations:[t],imports:[p],exports:[t]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&L(r,{declarations:[t],imports:[p],exports:[t]})})();export{r as IconPlaceholderModule,t as default};

var g=Object.defineProperty;var v=(l,s,e)=>s in l?g(l,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[s]=e;var a=(l,s,e)=>v(l,typeof s!="symbol"?s+"":s,e);import{ɵ as h,a as b,b as w,j as p,y as M,z as N,p as f,aq as L,o as k,u,v as C,t as _,an as z,ao as j,s as y,I as c,C as x,f as D,N as I,g as F}from"./core.vpEFnhB-.js";import{a as P,e as B}from"./theme.CecfD-Na.js";import{C as m}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const J=()=>({12:"h-3 w-3",16:"h-4 w-4",24:"h-6 w-6",32:"h-8 w-8"}),d={size:"24",ariaLabel:"Loading",className:""},o=class o{constructor(){a(this,"cn",P);a(this,"cva",B);a(this,"ariaLabel",d.ariaLabel);a(this,"className",d.className);a(this,"size",d.size)}};a(o,"ɵfac",function(e){return new(e||o)}),a(o,"ɵcmp",h({type:o,selectors:[["kd-spinner"],["spinner"]],inputs:{ariaLabel:"ariaLabel",className:"className",size:"size"},standalone:!1,decls:5,vars:7,consts:[["role","status","aria-live","polite"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],["d","M21 12a9 9 0 1 1-6.219-8.56"],[1,"sr-only"]],template:function(e,n){e&1&&(p(0,"span",0),M(),p(1,"svg",1),N(2,"path",2),f(),L(),p(3,"span",3),k(4),f()()),e&2&&(u(n.cn("inline-flex flex-row items-center justify-center gap-2",n.className)),C("aria-label",n.ariaLabel),_(),u(n.cn("animate-spin text-primary-default",n.cva(n.size,z(6,J),"24"))),_(3),j(n.ariaLabel))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let t=o;(typeof ngDevMode>"u"||ngDevMode)&&y(t,[{type:x,args:[{standalone:!1,selector:"kd-spinner, spinner",template:`
    <span
      role="status"
      aria-live="polite"
      [attr.aria-label]="ariaLabel"
      [class]="cn('inline-flex flex-row items-center justify-center gap-2', className)"
      ><svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        [class]="cn('animate-spin text-primary-default', cva(size, {
          '12': 'h-3 w-3',
          '16': 'h-4 w-4',
          '24': 'h-6 w-6',
          '32': 'h-8 w-8'
        }, '24'))"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
      </svg>
      <span class="sr-only">{{ariaLabel}}</span></span
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{ariaLabel:[{type:c}],className:[{type:c}],size:[{type:c}]});(typeof ngDevMode>"u"||ngDevMode)&&D(t,{className:"Spinner",filePath:"Spinner.ts",lineNumber:51});const i=class i{};a(i,"ɵfac",function(e){return new(e||i)}),a(i,"ɵmod",b({type:i})),a(i,"ɵinj",w({imports:[m]}));let r=i;(typeof ngDevMode>"u"||ngDevMode)&&y(r,[{type:I,args:[{declarations:[t],imports:[m],exports:[t]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&F(r,{declarations:[t],imports:[m],exports:[t]})})();export{r as SpinnerModule,t as default};

var g=Object.defineProperty;var h=(r,a,s)=>a in r?g(r,a,{enumerable:!0,configurable:!0,writable:!0,value:s}):r[a]=s;var e=(r,a,s)=>h(r,typeof a!="symbol"?a+"":a,s);import{ɵ as v,a as b,b as w,j as c,y as C,z as M,p as f,ao as N,o as k,u,v as z,t as y,w as x,am as D,s as _,I as p,C as P,f as j,N as I,g as F}from"./core.BqS-lykr.js";import{a as B,d as J,b as L}from"./utils.BBpd638g.js";import{C as m}from"./common_module-chunk.DvGwmKFp.js";const T=()=>({12:"h-3 w-3",16:"h-4 w-4",24:"h-6 w-6",32:"h-8 w-8"}),d={size:"12",label:"Loading",className:""},l=class l{constructor(){e(this,"cn",B);e(this,"cva",J);e(this,"bindControllerProps",L);e(this,"className",d.className);e(this,"size",d.size);e(this,"label",d.label)}};e(l,"ɵfac",function(s){return new(s||l)}),e(l,"ɵcmp",v({type:l,selectors:[["spn-spinner"],["spinner"]],inputs:{className:"className",size:"size",label:"label"},standalone:!1,decls:6,vars:7,consts:[["role","status","aria-live","polite"],["aria-hidden","true","viewBox","0 0 24 24","fill","none"],["cx","12","cy","12","r","10","stroke","currentColor","stroke-width","2",1,"opacity-25"],["d","M22 12a10 10 0 0 0-10-10","stroke","currentColor","stroke-width","2","stroke-linecap","round"],[1,"sr-only"]],template:function(s,n){s&1&&(c(0,"span",0),C(),c(1,"svg",1),M(2,"circle",2)(3,"path",3),f(),N(),c(4,"span",4),k(5),f()()),s&2&&(u(n.cn("inline-flex items-center justify-center",n.className)),z("data-ctrl",typeof n.bindControllerProps),y(),u(n.cn("animate-spin text-primary-default",n.cva(n.size,x(6,T),"12"))),y(4),D(n.label))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let t=l;(typeof ngDevMode>"u"||ngDevMode)&&_(t,[{type:P,args:[{standalone:!1,selector:"spn-spinner, spinner",template:`
    <span
      role="status"
      aria-live="polite"
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('inline-flex items-center justify-center', className)"
      ><svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        [class]="cn('animate-spin text-primary-default', cva(size, {
          '12': 'h-3 w-3',
          '16': 'h-4 w-4',
          '24': 'h-6 w-6',
          '32': 'h-8 w-8'
        }, '12'))"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
          class="opacity-25"
        ></circle>
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        ></path>
      </svg>
      <span class="sr-only">{{label}}</span></span
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:p}],size:[{type:p}],label:[{type:p}]});(typeof ngDevMode>"u"||ngDevMode)&&j(t,{className:"Spinner",filePath:"Spinner.ts",lineNumber:60});const o=class o{};e(o,"ɵfac",function(s){return new(s||o)}),e(o,"ɵmod",b({type:o})),e(o,"ɵinj",w({imports:[m]}));let i=o;(typeof ngDevMode>"u"||ngDevMode)&&_(i,[{type:I,args:[{declarations:[t],imports:[m],exports:[t]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&F(i,{declarations:[t],imports:[m],exports:[t]})})();export{i as SpinnerModule,t as default};

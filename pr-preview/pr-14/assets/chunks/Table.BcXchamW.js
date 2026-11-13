var g=Object.defineProperty;var b=(a,t,e)=>t in a?g(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e;var n=(a,t,e)=>b(a,typeof t!="symbol"?t+"":t,e);import{ɵ as y,a as C,b as N,c as v,j as f,d as M,q as x,p as _,u as D,v as I,t as u,e as w,s as m,I as d,C as P,f as j,N as k,g as S,i as h,o as E,r as F,m as J,x as q}from"./core.vpEFnhB-.js";import{a as O,d as T}from"./theme.CecfD-Na.js";import{C as i,a as z}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const A=["*"];function B(a,t){if(a&1&&(h(0),f(1,"caption",2),E(2),_(),F()),a&2){const e=J();u(2),q(" ",e.caption," ")}}const p={caption:"Data table",className:""},l=class l{constructor(){n(this,"cn",O);n(this,"bindControllerProps",T);n(this,"className",p.className);n(this,"caption",p.caption)}};n(l,"ɵfac",function(e){return new(e||l)}),n(l,"ɵcmp",y({type:l,selectors:[["kd-table"]],inputs:{className:"className",caption:"caption"},standalone:!1,ngContentSelectors:A,decls:4,vars:4,consts:[[1,"w-full","border-collapse"],[4,"ngIf"],[1,"sr-only"]],template:function(e,r){e&1&&(v(),f(0,"div")(1,"table",0),M(2,B,3,1,"ng-container",1),x(3),_()()),e&2&&(D(r.cn("w-full overflow-x-auto rounded-lg border border-border-default bg-background-default",r.className)),I("data-ctrl",typeof r.bindControllerProps),u(2),w("ngIf",r.caption))},dependencies:[z],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let o=l;(typeof ngDevMode>"u"||ngDevMode)&&m(o,[{type:P,args:[{standalone:!1,selector:"kd-table",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('w-full overflow-x-auto rounded-lg border border-border-default bg-background-default', className)"
    >
      <table class="w-full border-collapse">
        <ng-container *ngIf="caption"
          ><caption class="sr-only">
            {{caption}}
          </caption></ng-container
        >
        <ng-content></ng-content>
      </table>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:d}],caption:[{type:d}]});(typeof ngDevMode>"u"||ngDevMode)&&j(o,{className:"Table",filePath:"Table.ts",lineNumber:39});const s=class s{};n(s,"ɵfac",function(e){return new(e||s)}),n(s,"ɵmod",C({type:s})),n(s,"ɵinj",N({imports:[i]}));let c=s;(typeof ngDevMode>"u"||ngDevMode)&&m(c,[{type:k,args:[{declarations:[o],imports:[i],exports:[o]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&S(c,{declarations:[o],imports:[i],exports:[o]})})();export{c as TableModule,o as default};

var y=Object.defineProperty;var C=(i,t,n)=>t in i?y(i,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[t]=n;var a=(i,t,n)=>C(i,typeof t!="symbol"?t+"":t,n);import{E as _,ɵ as v,a as w,b as N,j as f,k as M,p as b,z as g,y as P,u,v as h,t as c,s as k,O as I,I as d,C as L,f as S,N as j,g as D}from"./core.BqS-lykr.js";import{a as O,I as x,b as T}from"./utils.BBpd638g.js";import{C as m}from"./common_module-chunk.DvGwmKFp.js";const l={checked:!1,indeterminate:!1,ariaLabel:"Select all rows",className:""},s=class s{constructor(){a(this,"cn",O);a(this,"ICON_PATHS",x);a(this,"bindControllerProps",T);a(this,"className",l.className);a(this,"checked",l.checked);a(this,"indeterminate",l.indeterminate);a(this,"ariaLabel",l.ariaLabel);a(this,"onCheckedChange",new _)}};a(s,"ɵfac",function(n){return new(n||s)}),a(s,"ɵcmp",v({type:s,selectors:[["spn-table-checkbox-header-cell"],["table-checkbox-header-cell"]],inputs:{className:"className",checked:"checked",indeterminate:"indeterminate",ariaLabel:"ariaLabel"},outputs:{onCheckedChange:"onCheckedChange"},standalone:!1,decls:6,vars:11,consts:[["scope","col"],[1,"relative","inline-flex","h-4","w-4","items-center","justify-center"],["type","checkbox",1,"peer","absolute","inset-0","h-4","w-4","cursor-pointer","appearance-none","rounded-sm","border","border-border-default","bg-background-default","checked:border-primary-default","checked:bg-primary-default","peer-focus-visible:ring-2","peer-focus-visible:ring-focus-ring-primary",3,"change"],["aria-hidden","true"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","3"],["stroke-linecap","round","stroke-linejoin","round"]],template:function(n,e){n&1&&(f(0,"th",0)(1,"span",1)(2,"input",2),M("change",function(){return e.onCheckedChange&&e.onCheckedChange.emit(!e.checked)}),b(),g(3,"span",3),P(),f(4,"svg",4),g(5,"path",5),b()()()),n&2&&(u(e.cn("w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center",e.className)),h("data-ctrl",typeof e.bindControllerProps),c(2),h("checked",e.checked?"":null)("aria-checked",e.indeterminate?"mixed":e.checked)("aria-label",e.ariaLabel),c(),u(e.cn("pointer-events-none absolute h-0.5 w-2 rounded-full bg-primary-foreground",e.indeterminate?"opacity-100":"opacity-0")),c(),u(e.cn("pointer-events-none relative h-3 w-3 text-primary-foreground",e.checked&&!e.indeterminate?"opacity-100":"opacity-0")),c(),h("d",e.ICON_PATHS.check))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let r=s;(typeof ngDevMode>"u"||ngDevMode)&&k(r,[{type:L,args:[{standalone:!1,selector:"spn-table-checkbox-header-cell, table-checkbox-header-cell",template:`
    <th
      scope="col"
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center', className)"
    >
      <span class="relative inline-flex h-4 w-4 items-center justify-center"
        ><input
          type="checkbox"
          class="peer absolute inset-0 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-border-default bg-background-default checked:border-primary-default checked:bg-primary-default peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
          [attr.checked]="(checked) ? '' : null"
          [attr.aria-checked]="indeterminate ? 'mixed' : checked"
          [attr.aria-label]="ariaLabel"
          (change)="onCheckedChange && this.onCheckedChange.emit(!checked)" />
        <span
          aria-hidden="true"
          [class]="cn('pointer-events-none absolute h-0.5 w-2 rounded-full bg-primary-foreground', indeterminate ? 'opacity-100' : 'opacity-0')"
        ></span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          [class]="cn('pointer-events-none relative h-3 w-3 text-primary-foreground', checked && !indeterminate ? 'opacity-100' : 'opacity-0')"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            [attr.d]="ICON_PATHS.check"
          ></path></svg
      ></span>
    </th>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:d}],checked:[{type:d}],indeterminate:[{type:d}],ariaLabel:[{type:d}],onCheckedChange:[{type:I}]});(typeof ngDevMode>"u"||ngDevMode)&&S(r,{className:"TableCheckboxHeaderCell",filePath:"TableCheckboxHeaderCell.ts",lineNumber:66});const o=class o{};a(o,"ɵfac",function(n){return new(n||o)}),a(o,"ɵmod",w({type:o})),a(o,"ɵinj",N({imports:[m]}));let p=o;(typeof ngDevMode>"u"||ngDevMode)&&k(p,[{type:j,args:[{declarations:[r],imports:[m],exports:[r]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&D(p,{declarations:[r],imports:[m],exports:[r]})})();export{p as TableCheckboxHeaderCellModule,r as default};

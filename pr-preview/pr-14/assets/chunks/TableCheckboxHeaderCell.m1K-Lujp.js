var y=Object.defineProperty;var C=(i,t,n)=>t in i?y(i,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[t]=n;var a=(i,t,n)=>C(i,typeof t!="symbol"?t+"":t,n);import{E as _,ɵ as v,a as w,b as N,j as m,k as M,p as f,z as g,y as P,u as c,v as b,t as p,s as k,O as I,I as o,C as L,f as S,N as j,g as D}from"./core.vpEFnhB-.js";import{a as O,I as T,d as A}from"./theme.CecfD-Na.js";import{C as h}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const l={checked:!1,indeterminate:!1,disabled:!1,ariaLabel:"Select all rows",className:""},s=class s{constructor(){a(this,"cn",O);a(this,"ICON_PATHS",T);a(this,"bindControllerProps",A);a(this,"className",l.className);a(this,"checked",l.checked);a(this,"disabled",l.disabled);a(this,"indeterminate",l.indeterminate);a(this,"ariaLabel",l.ariaLabel);a(this,"onCheckedChange",new _)}};a(s,"ɵfac",function(n){return new(n||s)}),a(s,"ɵcmp",v({type:s,selectors:[["kd-table-checkbox-header-cell"],["table-checkbox-header-cell"]],inputs:{className:"className",checked:"checked",disabled:"disabled",indeterminate:"indeterminate",ariaLabel:"ariaLabel"},outputs:{onCheckedChange:"onCheckedChange"},standalone:!1,decls:6,vars:14,consts:[["scope","col"],[1,"relative","inline-flex","h-3.5","w-3.5","items-center","justify-center"],["type","checkbox",3,"change"],["aria-hidden","true"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","3"],["stroke-linecap","round","stroke-linejoin","round"]],template:function(n,e){n&1&&(m(0,"th",0)(1,"span",1)(2,"input",2),M("change",function(){return!e.disabled&&e.onCheckedChange&&e.onCheckedChange.emit(!e.checked)}),f(),g(3,"span",3),P(),m(4,"svg",4),g(5,"path",5),f()()()),n&2&&(c(e.cn("w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center",e.className)),b("data-ctrl",typeof e.bindControllerProps),p(2),c(e.cn("peer absolute inset-0 h-3.5 w-3.5 cursor-pointer appearance-none rounded-xs border border-border-default bg-background-default checked:border-primary-default checked:bg-primary-default peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-background-muted",e.indeterminate&&"border-primary-default bg-primary-default")),b("checked",e.checked?"":null)("disabled",e.disabled?"":null)("aria-checked",e.indeterminate?"mixed":e.checked)("aria-label",e.ariaLabel),p(),c(e.cn("pointer-events-none absolute h-0.5 w-2 rounded-full bg-primary-foreground",e.indeterminate?"opacity-100":"opacity-0")),p(),c(e.cn("pointer-events-none relative h-3 w-3 text-primary-foreground",e.checked&&!e.indeterminate?"opacity-100":"opacity-0")),p(),b("d",e.ICON_PATHS.check))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let r=s;(typeof ngDevMode>"u"||ngDevMode)&&k(r,[{type:L,args:[{standalone:!1,selector:"kd-table-checkbox-header-cell, table-checkbox-header-cell",template:`
    <th
      scope="col"
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center', className)"
    >
      <span class="relative inline-flex h-3.5 w-3.5 items-center justify-center"
        ><input
          type="checkbox"
          [attr.checked]="(checked) ? '' : null"
          [attr.disabled]="(disabled) ? '' : null"
          [attr.aria-checked]="indeterminate ? 'mixed' : checked"
          [attr.aria-label]="ariaLabel"
          [class]="cn('peer absolute inset-0 h-3.5 w-3.5 cursor-pointer appearance-none rounded-xs border border-border-default bg-background-default checked:border-primary-default checked:bg-primary-default peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-background-muted', indeterminate && 'border-primary-default bg-primary-default')"
          (change)="!disabled && onCheckedChange && this.onCheckedChange.emit(!checked)" />
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
    `]}]}],null,{className:[{type:o}],checked:[{type:o}],disabled:[{type:o}],indeterminate:[{type:o}],ariaLabel:[{type:o}],onCheckedChange:[{type:I}]});(typeof ngDevMode>"u"||ngDevMode)&&S(r,{className:"TableCheckboxHeaderCell",filePath:"TableCheckboxHeaderCell.ts",lineNumber:69});const d=class d{};a(d,"ɵfac",function(n){return new(n||d)}),a(d,"ɵmod",w({type:d})),a(d,"ɵinj",N({imports:[h]}));let u=d;(typeof ngDevMode>"u"||ngDevMode)&&k(u,[{type:j,args:[{declarations:[r],imports:[h],exports:[r]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&D(u,{declarations:[r],imports:[h],exports:[r]})})();export{u as TableCheckboxHeaderCellModule,r as default};

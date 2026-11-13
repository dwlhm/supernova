var g=Object.defineProperty;var y=(c,n,a)=>n in c?g(c,n,{enumerable:!0,configurable:!0,writable:!0,value:a}):c[n]=a;var e=(c,n,a)=>y(c,typeof n!="symbol"?n+"":n,a);import{E as C,ɵ as _,a as v,b as w,j as b,k as N,p as f,y as M,z as P,u as m,v as l,t as d,s as k,O as I,I as p,C as x,f as L,N as S,g as j}from"./core.vpEFnhB-.js";import{a as D,I as O,d as T}from"./theme.CMj9otVT.js";import{C as h}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const u={checked:!1,ariaLabel:"Select row",className:""},s=class s{constructor(){e(this,"cn",D);e(this,"ICON_PATHS",O);e(this,"bindControllerProps",T);e(this,"className",u.className);e(this,"checked",u.checked);e(this,"ariaLabel",u.ariaLabel);e(this,"onCheckedChange",new C)}};e(s,"ɵfac",function(a){return new(a||s)}),e(s,"ɵcmp",_({type:s,selectors:[["kd-table-checkbox-body-cell"],["table-checkbox-body-cell"]],inputs:{className:"className",checked:"checked",ariaLabel:"ariaLabel"},outputs:{onCheckedChange:"onCheckedChange"},standalone:!1,decls:5,vars:8,consts:[[1,"relative","inline-flex","h-3.5","w-3.5","items-center","justify-center"],["type","checkbox",1,"peer","absolute","inset-0","h-3.5","w-3.5","cursor-pointer","appearance-none","rounded-sm","border","border-border-default","bg-background-default","checked:border-primary-default","checked:bg-primary-default","peer-focus-visible:ring-2","peer-focus-visible:ring-focus-ring-primary",3,"change"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","3"],["stroke-linecap","round","stroke-linejoin","round"]],template:function(a,t){a&1&&(b(0,"td")(1,"span",0)(2,"input",1),N("change",function(){return t.onCheckedChange&&t.onCheckedChange.emit(!t.checked)}),f(),M(),b(3,"svg",2),P(4,"path",3),f()()()),a&2&&(m(t.cn("w-12 whitespace-nowrap border-t border-border-default px-4 py-3 text-center",t.className)),l("data-ctrl",typeof t.bindControllerProps),d(2),l("checked",t.checked?"":null)("aria-label",t.ariaLabel),d(),m(t.cn("pointer-events-none relative h-2.5 w-2.5 text-primary-foreground",t.checked?"opacity-100":"opacity-0")),d(),l("d",t.ICON_PATHS.check))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let r=s;(typeof ngDevMode>"u"||ngDevMode)&&k(r,[{type:x,args:[{standalone:!1,selector:"kd-table-checkbox-body-cell, table-checkbox-body-cell",template:`
    <td
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('w-12 whitespace-nowrap border-t border-border-default px-4 py-3 text-center', className)"
    >
      <span class="relative inline-flex h-3.5 w-3.5 items-center justify-center"
        ><input
          type="checkbox"
          class="peer absolute inset-0 h-3.5 w-3.5 cursor-pointer appearance-none rounded-sm border border-border-default bg-background-default checked:border-primary-default checked:bg-primary-default peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
          [attr.checked]="(checked) ? '' : null"
          [attr.aria-label]="ariaLabel"
          (change)="onCheckedChange && this.onCheckedChange.emit(!checked)" />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          [class]="cn('pointer-events-none relative h-2.5 w-2.5 text-primary-foreground', checked ? 'opacity-100' : 'opacity-0')"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            [attr.d]="ICON_PATHS.check"
          ></path></svg
      ></span>
    </td>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{className:[{type:p}],checked:[{type:p}],ariaLabel:[{type:p}],onCheckedChange:[{type:I}]});(typeof ngDevMode>"u"||ngDevMode)&&L(r,{className:"TableCheckboxBodyCell",filePath:"TableCheckboxBodyCell.ts",lineNumber:58});const o=class o{};e(o,"ɵfac",function(a){return new(a||o)}),e(o,"ɵmod",v({type:o})),e(o,"ɵinj",w({imports:[h]}));let i=o;(typeof ngDevMode>"u"||ngDevMode)&&k(i,[{type:S,args:[{declarations:[r],imports:[h],exports:[r]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&j(i,{declarations:[r],imports:[h],exports:[r]})})();export{i as TableCheckboxBodyCellModule,r as default};

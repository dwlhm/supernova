var g=Object.defineProperty;var y=(c,n,t)=>n in c?g(c,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[n]=t;var e=(c,n,t)=>y(c,typeof n!="symbol"?n+"":n,t);import{E as C,ɵ as w,a as _,b as v,j as b,k as I,p as f,y as N,z as M,u as m,v as p,t as u,s as k,O as P,I as d,C as L,f as S,N as j,g as x}from"./core.BqS-lykr.js";import{a as D,I as O,b as T}from"./utils.BBpd638g.js";import{C as h}from"./common_module-chunk.DvGwmKFp.js";const l={checked:!1,rowId:"",ariaLabel:"Select row",className:""},s=class s{constructor(){e(this,"cn",D);e(this,"ICON_PATHS",O);e(this,"bindControllerProps",T);e(this,"className",l.className);e(this,"checked",l.checked);e(this,"ariaLabel",l.ariaLabel);e(this,"rowId",l.rowId);e(this,"onCheckedChange",new C)}};e(s,"ɵfac",function(t){return new(t||s)}),e(s,"ɵcmp",w({type:s,selectors:[["spn-table-checkbox-body-cell"],["table-checkbox-body-cell"]],inputs:{className:"className",checked:"checked",ariaLabel:"ariaLabel",rowId:"rowId"},outputs:{onCheckedChange:"onCheckedChange"},standalone:!1,decls:5,vars:8,consts:[[1,"relative","inline-flex","h-3.5","w-3.5","items-center","justify-center"],["type","checkbox",1,"peer","absolute","inset-0","h-3.5","w-3.5","cursor-pointer","appearance-none","rounded-sm","border","border-border-default","bg-background-default","checked:border-primary-default","checked:bg-primary-default","peer-focus-visible:ring-2","peer-focus-visible:ring-focus-ring-primary",3,"change"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","3"],["stroke-linecap","round","stroke-linejoin","round"]],template:function(t,a){t&1&&(b(0,"td")(1,"span",0)(2,"input",1),I("change",function(){return a.onCheckedChange&&a.onCheckedChange.emit({rowId:a.rowId||"",checked:!a.checked})}),f(),N(),b(3,"svg",2),M(4,"path",3),f()()()),t&2&&(m(a.cn("w-12 whitespace-nowrap border-t border-border-default px-4 py-3 text-center",a.className)),p("data-ctrl",typeof a.bindControllerProps),u(2),p("checked",a.checked?"":null)("aria-label",a.ariaLabel),u(),m(a.cn("pointer-events-none relative h-2.5 w-2.5 text-primary-foreground",a.checked?"opacity-100":"opacity-0")),u(),p("d",a.ICON_PATHS.check))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let r=s;(typeof ngDevMode>"u"||ngDevMode)&&k(r,[{type:L,args:[{standalone:!1,selector:"spn-table-checkbox-body-cell, table-checkbox-body-cell",template:`
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
          (change)="onCheckedChange && this.onCheckedChange.emit({
          rowId: rowId || '',
          checked: !checked
        })" />
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
    `]}]}],null,{className:[{type:d}],checked:[{type:d}],ariaLabel:[{type:d}],rowId:[{type:d}],onCheckedChange:[{type:P}]});(typeof ngDevMode>"u"||ngDevMode)&&S(r,{className:"TableCheckboxBodyCell",filePath:"TableCheckboxBodyCell.ts",lineNumber:63});const o=class o{};e(o,"ɵfac",function(t){return new(t||o)}),e(o,"ɵmod",_({type:o})),e(o,"ɵinj",v({imports:[h]}));let i=o;(typeof ngDevMode>"u"||ngDevMode)&&k(i,[{type:j,args:[{declarations:[r],imports:[h],exports:[r]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&x(i,{declarations:[r],imports:[h],exports:[r]})})();export{i as TableCheckboxBodyCellModule,r as default};

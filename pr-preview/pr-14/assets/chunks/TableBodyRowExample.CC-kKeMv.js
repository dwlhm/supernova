var f=Object.defineProperty;var u=(p,l,e)=>l in p?f(p,l,{enumerable:!0,configurable:!0,writable:!0,value:e}):p[l]=e;var d=(p,l,e)=>u(p,typeof l!="symbol"?l+"":l,e);import{ɵ as g,a as w,b as _,j as t,o,p as s,t as M,e as C,s as m,C as N,f as x,N as h,g as v}from"./core.BqS-lykr.js";import D,{TableBodyRowModule as y}from"./TableBodyRow.VxeVvVie.js";import I,{TableBodyCellModule as r}from"./TableBodyCell.CL5jZmDL.js";import{C as i}from"./common_module-chunk.DvGwmKFp.js";import"./utils.BBpd638g.js";const b=class b{};d(b,"ɵfac",function(e){return new(e||b)}),d(b,"ɵcmp",g({type:b,selectors:[["spn-table-body-row-example"],["table-body-row-example"]],standalone:!1,decls:20,vars:1,consts:[[1,"w-full","border-collapse"],["align","right"],[3,"selected"]],template:function(e,P){e&1&&(t(0,"table",0)(1,"tbody")(2,"spn-table-body-row")(3,"spn-table-body-cell"),o(4,"INV-2025-001"),s(),t(5,"spn-table-body-cell"),o(6,"Komship Express"),s(),t(7,"spn-table-body-cell"),o(8,"Paid"),s(),t(9,"spn-table-body-cell",1),o(10,"Rp 450.000"),s()(),t(11,"spn-table-body-row",2)(12,"spn-table-body-cell"),o(13,"INV-2025-002"),s(),t(14,"spn-table-body-cell"),o(15,"Kompack Fulfillment"),s(),t(16,"spn-table-body-cell"),o(17,"Pending"),s(),t(18,"spn-table-body-cell",1),o(19,"Rp 1.200.000"),s()()()()),e&2&&(M(11),C("selected",!0))},dependencies:[D,I],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=b;(typeof ngDevMode>"u"||ngDevMode)&&m(n,[{type:N,args:[{standalone:!1,selector:"spn-table-body-row-example, table-body-row-example",template:`
    <table class="w-full border-collapse">
      <tbody>
        <spn-table-body-row
          ><spn-table-body-cell>INV-2025-001</spn-table-body-cell>
          <spn-table-body-cell>Komship Express</spn-table-body-cell>
          <spn-table-body-cell>Paid</spn-table-body-cell>
          <spn-table-body-cell align="right"
            >Rp 450.000</spn-table-body-cell
          ></spn-table-body-row
        >
        <spn-table-body-row [selected]="true"
          ><spn-table-body-cell>INV-2025-002</spn-table-body-cell>
          <spn-table-body-cell>Kompack Fulfillment</spn-table-body-cell>
          <spn-table-body-cell>Pending</spn-table-body-cell>
          <spn-table-body-cell align="right"
            >Rp 1.200.000</spn-table-body-cell
          ></spn-table-body-row
        >
      </tbody>
    </table>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&x(n,{className:"TableBodyRowExample",filePath:"TableBodyRowExample.ts",lineNumber:41});const a=class a{};d(a,"ɵfac",function(e){return new(e||a)}),d(a,"ɵmod",w({type:a})),d(a,"ɵinj",_({imports:[i,y,r]}));let c=a;(typeof ngDevMode>"u"||ngDevMode)&&m(c,[{type:h,args:[{declarations:[n],imports:[i,y,r],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&v(c,{declarations:[n],imports:[i,y,r],exports:[n]})})();export{c as TableBodyRowExampleModule,n as default};

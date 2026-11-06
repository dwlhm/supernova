var g=Object.defineProperty;var M=(p,a,n)=>a in p?g(p,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):p[a]=n;var d=(p,a,n)=>M(p,typeof a!="symbol"?a+"":a,n);import{ɵ as w,a as C,b as v,j as e,o as l,p as t,s as u,C as D,f as _,N as T,g as N}from"./core.BqS-lykr.js";import x,{TableModule as r}from"./Table.DG96ChnA.js";import J,{TableHeaderRowModule as i}from"./TableHeaderRow.A1QSbcHt.js";import R,{TableHeaderCellModule as y}from"./TableHeaderCell.DwPBIcUQ.js";import S,{TableBodyRowModule as m}from"./TableBodyRow.VxeVvVie.js";import A,{TableBodyCellModule as f}from"./TableBodyCell.CL5jZmDL.js";import{C as h}from"./common_module-chunk.DvGwmKFp.js";import"./utils.BBpd638g.js";const b=class b{};d(b,"ɵfac",function(n){return new(n||b)}),d(b,"ɵcmp",w({type:b,selectors:[["spn-table-example"],["table-example"]],standalone:!1,decls:30,vars:0,consts:[["caption","Recent invoices"],["align","right"]],template:function(n,B){n&1&&(e(0,"spn-table",0)(1,"thead")(2,"spn-table-header-row")(3,"spn-table-header-cell"),l(4,"Name"),t(),e(5,"spn-table-header-cell"),l(6,"Status"),t(),e(7,"spn-table-header-cell",1),l(8,"Amount"),t(),e(9,"spn-table-header-cell"),l(10,"Date"),t()()(),e(11,"tbody")(12,"spn-table-body-row")(13,"spn-table-body-cell"),l(14,"John Doe"),t(),e(15,"spn-table-body-cell"),l(16,"Active"),t(),e(17,"spn-table-body-cell",1),l(18,"$1,200"),t(),e(19,"spn-table-body-cell"),l(20,"2024-01-15"),t()(),e(21,"spn-table-body-row")(22,"spn-table-body-cell"),l(23,"Jane Smith"),t(),e(24,"spn-table-body-cell"),l(25,"Pending"),t(),e(26,"spn-table-body-cell",1),l(27,"$850"),t(),e(28,"spn-table-body-cell"),l(29,"2024-02-20"),t()()()())},dependencies:[x,J,R,S,A],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let o=b;(typeof ngDevMode>"u"||ngDevMode)&&u(o,[{type:D,args:[{standalone:!1,selector:"spn-table-example, table-example",template:`
    <spn-table caption="Recent invoices"
      ><thead>
        <spn-table-header-row
          ><spn-table-header-cell>Name</spn-table-header-cell>
          <spn-table-header-cell>Status</spn-table-header-cell>
          <spn-table-header-cell align="right">Amount</spn-table-header-cell>
          <spn-table-header-cell
            >Date</spn-table-header-cell
          ></spn-table-header-row
        >
      </thead>
      <tbody>
        <spn-table-body-row
          ><spn-table-body-cell>John Doe</spn-table-body-cell>
          <spn-table-body-cell>Active</spn-table-body-cell>
          <spn-table-body-cell align="right">$1,200</spn-table-body-cell>
          <spn-table-body-cell
            >2024-01-15</spn-table-body-cell
          ></spn-table-body-row
        >
        <spn-table-body-row
          ><spn-table-body-cell>Jane Smith</spn-table-body-cell>
          <spn-table-body-cell>Pending</spn-table-body-cell>
          <spn-table-body-cell align="right">$850</spn-table-body-cell>
          <spn-table-body-cell
            >2024-02-20</spn-table-body-cell
          ></spn-table-body-row
        >
      </tbody></spn-table
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&_(o,{className:"TableExample",filePath:"TableExample.ts",lineNumber:54});const s=class s{};d(s,"ɵfac",function(n){return new(n||s)}),d(s,"ɵmod",C({type:s})),d(s,"ɵinj",v({imports:[h,r,i,y,m,f]}));let c=s;(typeof ngDevMode>"u"||ngDevMode)&&u(c,[{type:T,args:[{declarations:[o],imports:[h,r,i,y,m,f],exports:[o]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&N(c,{declarations:[o],imports:[h,r,i,y,m,f],exports:[o]})})();export{c as TableExampleModule,o as default};

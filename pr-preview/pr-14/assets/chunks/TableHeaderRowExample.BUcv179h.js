var f=Object.defineProperty;var h=(o,e,l)=>e in o?f(o,e,{enumerable:!0,configurable:!0,writable:!0,value:l}):o[e]=l;var n=(o,e,l)=>h(o,typeof e!="symbol"?e+"":e,l);import{ɵ as g,a as C,b as y,j as r,o as d,p,s as u,C as M,f as w,N as _,g as v}from"./core.BqS-lykr.js";import x,{TableHeaderRowModule as i}from"./TableHeaderRow.A1QSbcHt.js";import D,{TableHeaderCellModule as m}from"./TableHeaderCell.DwPBIcUQ.js";import{C as b}from"./common_module-chunk.DvGwmKFp.js";import"./utils.BBpd638g.js";const s=class s{};n(s,"ɵfac",function(l){return new(l||s)}),n(s,"ɵcmp",g({type:s,selectors:[["spn-table-header-row-example"],["table-header-row-example"]],standalone:!1,decls:13,vars:0,consts:[[1,"w-full","border-collapse"],["align","right"]],template:function(l,N){l&1&&(r(0,"table",0)(1,"thead")(2,"spn-table-header-row")(3,"spn-table-header-cell"),d(4,"Column 1"),p(),r(5,"spn-table-header-cell"),d(6,"Column 2"),p(),r(7,"spn-table-header-cell"),d(8,"Column 3"),p(),r(9,"spn-table-header-cell"),d(10,"Column 4"),p(),r(11,"spn-table-header-cell",1),d(12,"Column 5"),p()()()())},dependencies:[x,D],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=s;(typeof ngDevMode>"u"||ngDevMode)&&u(a,[{type:M,args:[{standalone:!1,selector:"spn-table-header-row-example, table-header-row-example",template:`
    <table class="w-full border-collapse">
      <thead>
        <spn-table-header-row
          ><spn-table-header-cell>Column 1</spn-table-header-cell>
          <spn-table-header-cell>Column 2</spn-table-header-cell>
          <spn-table-header-cell>Column 3</spn-table-header-cell>
          <spn-table-header-cell>Column 4</spn-table-header-cell>
          <spn-table-header-cell align="right"
            >Column 5</spn-table-header-cell
          ></spn-table-header-row
        >
      </thead>
    </table>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&w(a,{className:"TableHeaderRowExample",filePath:"TableHeaderRowExample.ts",lineNumber:34});const t=class t{};n(t,"ɵfac",function(l){return new(l||t)}),n(t,"ɵmod",C({type:t})),n(t,"ɵinj",y({imports:[b,i,m]}));let c=t;(typeof ngDevMode>"u"||ngDevMode)&&u(c,[{type:_,args:[{declarations:[a],imports:[b,i,m],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&v(c,{declarations:[a],imports:[b,i,m],exports:[a]})})();export{c as TableHeaderRowExampleModule,a as default};

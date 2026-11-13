var h=Object.defineProperty;var y=(d,s,e)=>s in d?h(d,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[s]=e;var a=(d,s,e)=>y(d,typeof s!="symbol"?s+"":s,e);import{ɵ as M,a as T,b as v,j as r,k as g,o as p,p as m,t as u,e as f,s as k,C as z,f as L,N as D,g as I}from"./core.vpEFnhB-.js";import N,{ToggleGroupModule as _}from"./ToggleGroup.BZ4BNv-i.js";import B,{ToggleModule as c}from"./Toggle.CM7AU88Y.js";import{C}from"./common_module-chunk.B8w5oXjf.js";import"./theme.CMj9otVT.js";import"./framework.CbUgrr79.js";const o=class o{constructor(){a(this,"bold",!0);a(this,"italic",!1);a(this,"underline",!1)}};a(o,"ɵfac",function(e){return new(e||o)}),a(o,"ɵcmp",M({type:o,selectors:[["kd-toggle-group-example"],["toggle-group-example"]],standalone:!1,decls:7,vars:3,consts:[["size","medium","ariaLabel","Text formatting"],["size","medium","ariaLabel","Bold",3,"pressedChange","pressed"],["size","medium","ariaLabel","Italic",3,"pressedChange","pressed"],["size","medium","ariaLabel","Underline",3,"pressedChange","pressed"]],template:function(e,t){e&1&&(r(0,"kd-toggle-group",0)(1,"kd-toggle",1),g("pressedChange",function(){return t.bold=!t.bold}),p(2," B "),m(),r(3,"kd-toggle",2),g("pressedChange",function(){return t.italic=!t.italic}),p(4," I "),m(),r(5,"kd-toggle",3),g("pressedChange",function(){return t.underline=!t.underline}),p(6," U "),m()()),e&2&&(u(),f("pressed",t.bold),u(2),f("pressed",t.italic),u(2),f("pressed",t.underline))},dependencies:[N,B],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let n=o;(typeof ngDevMode>"u"||ngDevMode)&&k(n,[{type:z,args:[{standalone:!1,selector:"kd-toggle-group-example, toggle-group-example",template:`
    <kd-toggle-group size="medium" ariaLabel="Text formatting"
      ><kd-toggle
        size="medium"
        ariaLabel="Bold"
        [pressed]="bold"
        (pressedChange)="
          bold = !bold;
        "
      >
        B
      </kd-toggle>
      <kd-toggle
        size="medium"
        ariaLabel="Italic"
        [pressed]="italic"
        (pressedChange)="
          italic = !italic;
        "
      >
        I
      </kd-toggle>
      <kd-toggle
        size="medium"
        ariaLabel="Underline"
        [pressed]="underline"
        (pressedChange)="
          underline = !underline;
        "
      >
        U
      </kd-toggle></kd-toggle-group
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&L(n,{className:"ToggleGroupExample",filePath:"ToggleGroupExample.ts",lineNumber:53});const l=class l{};a(l,"ɵfac",function(e){return new(e||l)}),a(l,"ɵmod",T({type:l})),a(l,"ɵinj",v({imports:[C,_,c]}));let i=l;(typeof ngDevMode>"u"||ngDevMode)&&k(i,[{type:D,args:[{declarations:[n],imports:[C,_,c],exports:[n]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&I(i,{declarations:[n],imports:[C,_,c],exports:[n]})})();export{i as ToggleGroupExampleModule,n as default};

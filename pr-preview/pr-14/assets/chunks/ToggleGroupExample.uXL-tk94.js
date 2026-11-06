var _=Object.defineProperty;var b=(p,s,e)=>s in p?_(p,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):p[s]=e;var n=(p,s,e)=>b(p,typeof s!="symbol"?s+"":s,e);import{ɵ as M,a as x,b as v,j as i,o as r,p as g,t as d,e as m,s as y,C as z,f as C,N as I,g as L}from"./core.BqS-lykr.js";import h,{ToggleGroupModule as u}from"./ToggleGroup.D83KWiwL.js";import D,{ToggleGroupItemModule as c}from"./ToggleGroupItem.BqVNCEOr.js";import{C as f}from"./common_module-chunk.DvGwmKFp.js";import"./utils.BBpd638g.js";const o=class o{};n(o,"ɵfac",function(e){return new(e||o)}),n(o,"ɵcmp",M({type:o,selectors:[["spn-toggle-group-example"],["toggle-group-example"]],standalone:!1,decls:10,vars:3,consts:[["size","medium","ariaLabel","Text formatting"],["size","medium","ariaLabel","Bold",3,"pressed"],[1,"font-paragraph-weight-bold"],["size","medium","ariaLabel","Italic",3,"pressed"],[1,"italic"],["size","medium","ariaLabel","Underline",3,"pressed"],[1,"underline"]],template:function(e,N){e&1&&(i(0,"spn-toggle-group",0)(1,"spn-toggle-group-item",1)(2,"span",2),r(3,"B"),g()(),i(4,"spn-toggle-group-item",3)(5,"span",4),r(6,"I"),g()(),i(7,"spn-toggle-group-item",5)(8,"span",6),r(9,"U"),g()()()),e&2&&(d(),m("pressed",!0),d(3),m("pressed",!1),d(3),m("pressed",!1))},dependencies:[h,D],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let t=o;(typeof ngDevMode>"u"||ngDevMode)&&y(t,[{type:z,args:[{standalone:!1,selector:"spn-toggle-group-example, toggle-group-example",template:`
    <spn-toggle-group size="medium" ariaLabel="Text formatting"
      ><spn-toggle-group-item size="medium" ariaLabel="Bold" [pressed]="true"
        ><span class="font-paragraph-weight-bold"
          >B</span
        ></spn-toggle-group-item
      >
      <spn-toggle-group-item size="medium" ariaLabel="Italic" [pressed]="false"
        ><span class="italic">I</span></spn-toggle-group-item
      >
      <spn-toggle-group-item
        size="medium"
        ariaLabel="Underline"
        [pressed]="false"
        ><span class="underline">U</span></spn-toggle-group-item
      ></spn-toggle-group
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&C(t,{className:"ToggleGroupExample",filePath:"ToggleGroupExample.ts",lineNumber:37});const a=class a{};n(a,"ɵfac",function(e){return new(e||a)}),n(a,"ɵmod",x({type:a})),n(a,"ɵinj",v({imports:[f,u,c]}));let l=a;(typeof ngDevMode>"u"||ngDevMode)&&y(l,[{type:I,args:[{declarations:[t],imports:[f,u,c],exports:[t]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&L(l,{declarations:[t],imports:[f,u,c],exports:[t]})})();export{l as ToggleGroupExampleModule,t as default};

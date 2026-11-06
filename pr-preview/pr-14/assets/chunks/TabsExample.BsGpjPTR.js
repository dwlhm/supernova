var g=Object.defineProperty;var y=(i,t,e)=>t in i?g(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var n=(i,t,e)=>y(i,typeof t!="symbol"?t+"":t,e);import{ɵ as _,a as M,b as C,j as l,o as c,p as m,t as r,e as d,s as v,C as x,f as D,N,g as w}from"./core.BqS-lykr.js";import A,{TabsModule as f}from"./Tabs.DxyPvahu.js";import I,{TabItemModule as u}from"./TabItem._7eOR8pZ.js";import{C as b}from"./common_module-chunk.DvGwmKFp.js";import"./utils.BBpd638g.js";const o=class o{};n(o,"ɵfac",function(e){return new(e||o)}),n(o,"ɵcmp",_({type:o,selectors:[["spn-tabs-example"],["tabs-example"]],standalone:!1,decls:7,vars:3,consts:[["ariaLabel","Account sections"],[3,"active"]],template:function(e,S){e&1&&(l(0,"spn-tabs",0)(1,"spn-tab-item",1),c(2,"Overview"),m(),l(3,"spn-tab-item",1),c(4,"Analytics"),m(),l(5,"spn-tab-item",1),c(6,"Settings"),m()()),e&2&&(r(),d("active",!0),r(2),d("active",!1),r(2),d("active",!1))},dependencies:[A,I],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let s=o;(typeof ngDevMode>"u"||ngDevMode)&&v(s,[{type:x,args:[{standalone:!1,selector:"spn-tabs-example, tabs-example",template:`
    <spn-tabs ariaLabel="Account sections"
      ><spn-tab-item [active]="true">Overview</spn-tab-item>
      <spn-tab-item [active]="false">Analytics</spn-tab-item>
      <spn-tab-item [active]="false">Settings</spn-tab-item></spn-tabs
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&D(s,{className:"TabsExample",filePath:"TabsExample.ts",lineNumber:26});const a=class a{};n(a,"ɵfac",function(e){return new(e||a)}),n(a,"ɵmod",M({type:a})),n(a,"ɵinj",C({imports:[b,f,u]}));let p=a;(typeof ngDevMode>"u"||ngDevMode)&&v(p,[{type:N,args:[{declarations:[s],imports:[b,f,u],exports:[s]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&w(p,{declarations:[s],imports:[b,f,u],exports:[s]})})();export{p as TabsExampleModule,s as default};

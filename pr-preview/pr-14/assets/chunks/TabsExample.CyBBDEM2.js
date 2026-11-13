var T=Object.defineProperty;var y=(o,t,e)=>t in o?T(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var i=(o,t,e)=>y(o,typeof t!="symbol"?t+"":t,e);import{ɵ as M,a as w,b as C,j as d,k as r,o as m,p as v,t as b,e as p,s as g,C as D,f as N,N as x,g as A}from"./core.vpEFnhB-.js";import I,{TabsModule as _}from"./Tabs.DLn0D5Cr.js";import S,{TabItemModule as f}from"./TabItem.C16HowVL.js";import{C as k}from"./common_module-chunk.B8w5oXjf.js";import"./theme.CecfD-Na.js";import"./framework.DPU9SBEx.js";const c=class c{constructor(){i(this,"activeTab","overview")}};i(c,"ɵfac",function(e){return new(e||c)}),i(c,"ɵcmp",M({type:c,selectors:[["kd-tabs-example"],["tabs-example"]],standalone:!1,decls:7,vars:3,consts:[["ariaLabel","Account sections"],[3,"click","active"]],template:function(e,n){e&1&&(d(0,"kd-tabs",0)(1,"kd-tab-item",1),r("click",function(){return n.activeTab="overview"}),m(2," Overview "),v(),d(3,"kd-tab-item",1),r("click",function(){return n.activeTab="activity"}),m(4," Activity "),v(),d(5,"kd-tab-item",1),r("click",function(){return n.activeTab="settings"}),m(6," Settings "),v()()),e&2&&(b(),p("active",n.activeTab==="overview"),b(2),p("active",n.activeTab==="activity"),b(2),p("active",n.activeTab==="settings"))},dependencies:[I,S],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let a=c;(typeof ngDevMode>"u"||ngDevMode)&&g(a,[{type:D,args:[{standalone:!1,selector:"kd-tabs-example, tabs-example",template:`
    <kd-tabs ariaLabel="Account sections"
      ><kd-tab-item
        [active]="activeTab === 'overview'"
        (click)="
          activeTab = 'overview';
        "
      >
        Overview
      </kd-tab-item>
      <kd-tab-item
        [active]="activeTab === 'activity'"
        (click)="
          activeTab = 'activity';
        "
      >
        Activity
      </kd-tab-item>
      <kd-tab-item
        [active]="activeTab === 'settings'"
        (click)="
          activeTab = 'settings';
        "
      >
        Settings
      </kd-tab-item></kd-tabs
    >
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&N(a,{className:"TabsExample",filePath:"TabsExample.ts",lineNumber:47});const s=class s{};i(s,"ɵfac",function(e){return new(e||s)}),i(s,"ɵmod",w({type:s})),i(s,"ɵinj",C({imports:[k,_,f]}));let l=s;(typeof ngDevMode>"u"||ngDevMode)&&g(l,[{type:x,args:[{declarations:[a],imports:[k,_,f],exports:[a]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&A(l,{declarations:[a],imports:[k,_,f],exports:[a]})})();export{l as TabsExampleModule,a as default};

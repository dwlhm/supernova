var y=Object.defineProperty;var C=(t,e,a)=>e in t?y(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a;var o=(t,e,a)=>C(t,typeof e!="symbol"?e+"":e,a);import{ɵ as M,a as S,b as w,j as D,z as F,p as O,t as b,e as m,ar as x,w as n,aq as N,s as _,C as R,f as T,N as k,g as L}from"./core.BqS-lykr.js";import W,{ChartModule as i}from"./Chart.e-S83_-z.js";import j,{ChartBarModule as d}from"./ChartBar.BouINcQg.js";import B,{ChartLegendModule as u}from"./ChartLegend.BFGbis8P.js";import{C as p}from"./common_module-chunk.DvGwmKFp.js";import"./utils.BBpd638g.js";const I=()=>({label:"Mon",value:120}),J=()=>({label:"Tue",value:160}),P=()=>({label:"Wed",value:140}),q=()=>({label:"Thu",value:190}),z=()=>({label:"Fri",value:175}),A=()=>({label:"Sat",value:110}),G=()=>({label:"Sun",value:95}),H=(t,e,a,v,f,h,g)=>[t,e,a,v,f,h,g],K=()=>({label:"Online Sales",colorClass:"bg-chart-series-1"}),Q=()=>({label:"Retail Store",colorClass:"bg-chart-series-2"}),U=(t,e)=>[t,e],r=class r{};o(r,"ɵfac",function(a){return new(a||r)}),o(r,"ɵcmp",M({type:r,selectors:[["spn-chart-example"],["chart-example"]],standalone:!1,decls:3,vars:22,consts:[["title","Revenue Overview","description","Weekly revenue breakdown by day"],["ariaLabel","Revenue Overview",3,"data"],[3,"items"]],template:function(a,v){a&1&&(D(0,"spn-chart",0),F(1,"spn-chart-bar",1)(2,"spn-chart-legend",2),O()),a&2&&(b(),m("data",x(9,H,n(2,I),n(3,J),n(4,P),n(5,q),n(6,z),n(7,A),n(8,G))),b(),m("items",N(19,U,n(17,K),n(18,Q))))},dependencies:[W,j,B],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let l=r;(typeof ngDevMode>"u"||ngDevMode)&&_(l,[{type:R,args:[{standalone:!1,selector:"spn-chart-example, chart-example",template:`
    <spn-chart
      title="Revenue Overview"
      description="Weekly revenue breakdown by day"
      ><spn-chart-bar
        ariaLabel="Revenue Overview"
        [data]="[{
          label: 'Mon',
          value: 120
        }, {
          label: 'Tue',
          value: 160
        }, {
          label: 'Wed',
          value: 140
        }, {
          label: 'Thu',
          value: 190
        }, {
          label: 'Fri',
          value: 175
        }, {
          label: 'Sat',
          value: 110
        }, {
          label: 'Sun',
          value: 95
        }]"
      ></spn-chart-bar>
      <spn-chart-legend
        [items]="[{
          label: 'Online Sales',
          colorClass: 'bg-chart-series-1'
        }, {
          label: 'Retail Store',
          colorClass: 'bg-chart-series-2'
        }]"
      ></spn-chart-legend
    ></spn-chart>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&T(l,{className:"ChartExample",filePath:"ChartExample.ts",lineNumber:60});const s=class s{};o(s,"ɵfac",function(a){return new(a||s)}),o(s,"ɵmod",S({type:s})),o(s,"ɵinj",w({imports:[p,i,d,u]}));let c=s;(typeof ngDevMode>"u"||ngDevMode)&&_(c,[{type:k,args:[{declarations:[l],imports:[p,i,d,u],exports:[l]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&L(c,{declarations:[l],imports:[p,i,d,u],exports:[l]})})();export{c as ChartExampleModule,l as default};

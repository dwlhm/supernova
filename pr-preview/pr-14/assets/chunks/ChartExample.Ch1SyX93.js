var ee=Object.defineProperty;var ae=(e,t,l)=>t in e?ee(e,t,{enumerable:!0,configurable:!0,writable:!0,value:l}):e[t]=l;var _=(e,t,l)=>ae(e,typeof t!="symbol"?t+"":t,l);import{ɵ as te,a as le,b as ne,j as b,d as H,p,o as m,t as r,e as c,s as j,C as re,f as ce,N as se,g as oe,h as ie,i as o,k as ue,l as de,m as y,n as _e,r as i,u as be,x as ge,z as u,an as a,aw as C,ax as S,w as s,ay as ve,ar as A}from"./core.vpEFnhB-.js";import{a as pe}from"./theme.CecfD-Na.js";import fe,{ChartModule as M}from"./Chart.DLusQoPM.js";import me,{ChartBarModule as I}from"./ChartBar.DCogsuJO.js";import he,{ChartLineModule as w}from"./ChartLine.CNY5IMDh.js";import ye,{ChartPieModule as F}from"./ChartPie.DAIBepfF.js";import ke,{ChartHorizontalBarModule as P}from"./ChartHorizontalBar.DCGoBpjw.js";import xe,{ChartScatterModule as V}from"./ChartScatter.CrvtcIMF.js";import Te,{ChartRadarModule as B}from"./ChartRadar.BrS3yYhn.js";import Ce,{ChartGaugeModule as D}from"./ChartGauge._XUd-IPm.js";import Se,{ChartFunnelModule as E}from"./ChartFunnel.CZorzHrd.js";import Me,{ChartWaterfallModule as L}from"./ChartWaterfall.CDyUSTF8.js";import Ie,{ChartLegendModule as R}from"./ChartLegend._zR2vBJ6.js";import we,{ChartLegendItemModule as W}from"./ChartLegendItem.DuO5BHNn.js";import{C as z,b as Fe,a as Pe}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";import"./Tooltip.NGGisPuL.js";const x=()=>[200,150,100,50,0],G=()=>({label:"Mon",value:120}),J=()=>({label:"Tue",value:80}),Ve=()=>({label:"Wed",value:165}),Be=()=>({label:"Thu",value:25}),De=()=>({label:"Fri",value:145}),K=()=>({label:"Sat",value:60}),Ee=()=>({label:"Sun",value:135}),N=(e,t,l,n,d,v,T)=>[e,t,l,n,d,v,T],Le=()=>({label:"Wed",value:160}),Re=()=>({label:"Thu",value:100}),We=()=>({label:"Fri",value:140}),ze=()=>({label:"Sun",value:130}),Ne=()=>({label:"Series 1",value:30}),Oe=()=>({label:"Series 2",value:24}),He=()=>({label:"Series 3",value:18}),je=()=>({label:"Series 4",value:15}),Ae=()=>({label:"Series 5",value:13}),O=(e,t,l,n,d)=>[e,t,l,n,d],Ge=()=>[50,35,35],Je=e=>({label:"Mon",values:e}),Ke=()=>[30,25,25],Qe=e=>({label:"Tue",values:e}),$e=()=>[60,45,60],qe=e=>({label:"Wed",values:e}),Ue=()=>[40,35,25],Xe=e=>({label:"Thu",values:e}),Ye=()=>[55,40,50],Ze=e=>({label:"Fri",values:e}),ea=()=>[25,15,20],aa=e=>({label:"Sat",values:e}),ta=()=>[50,35,50],la=e=>({label:"Sun",values:e}),na=()=>({label:"Product A",value:85}),ra=()=>({label:"Product B",value:65}),ca=()=>({label:"Product C",value:50}),sa=()=>({label:"Product D",value:40}),oa=()=>({label:"Product E",value:30}),ia=()=>[100,75,50,25,0],ua=()=>[0,20,40,60,80,100],da=()=>({x:12,y:28,series:0}),_a=()=>({x:26,y:48,series:0}),ba=()=>({x:52,y:60,series:0}),ga=()=>({x:68,y:72,series:0}),va=()=>({x:94,y:76,series:0}),pa=()=>({x:18,y:18,series:1}),fa=()=>({x:42,y:44,series:1}),ma=()=>({x:74,y:50,series:1}),ha=()=>({x:88,y:65,series:1}),ya=()=>({x:28,y:24,series:2}),ka=()=>({x:44,y:12,series:2}),xa=()=>({x:70,y:26,series:2}),Ta=()=>({x:92,y:18,series:2}),Ca=(e,t,l,n,d,v,T,$,q,U,X,Y,Z)=>[e,t,l,n,d,v,T,$,q,U,X,Y,Z],Sa=()=>[85,65],Ma=e=>({label:"Speed",values:e}),Ia=()=>[75,80],wa=e=>({label:"Power",values:e}),Fa=()=>[65,85],Pa=e=>({label:"Range",values:e}),Va=()=>[80,60],Ba=e=>({label:"Defense",values:e}),Da=()=>[70,75],Ea=e=>({label:"Health",values:e}),La=()=>[75,85],Ra=e=>({label:"Magic",values:e}),Q=(e,t,l,n,d,v)=>[e,t,l,n,d,v],Wa=()=>({label:"Visitors",value:12500}),za=()=>({label:"Leads",value:8200}),Na=()=>({label:"Qualified",value:4100}),Oa=()=>({label:"Proposals",value:1800}),Ha=()=>({label:"Closed",value:620}),ja=()=>({label:"Start",value:120}),Aa=()=>({label:"+Rev",value:35}),Ga=()=>({label:"+Svc",value:20}),Ja=e=>({label:"-Cost",value:e}),Ka=e=>({label:"-Tax",value:e}),Qa=()=>({label:"Total",value:125,isTotal:!0});function $a(e,t){if(e&1){const l=ie();o(0),b(1,"button",10),ue("click",function(){const d=de(l).$implicit,v=y();return _e(v.activeType=d.id)}),m(2),p(),i()}if(e&2){const l=t.$implicit,n=y();r(),be(n.cn("cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",n.activeType===l.id?"border-primary-default bg-primary-default text-primary-foreground":"border-border-default bg-background-default text-foreground-muted hover:text-foreground-default")),r(),ge(" ",l.label," ")}}function qa(e,t){e&1&&(o(0),u(1,"kd-chart-bar",11),i()),e&2&&(r(),c("yTicks",a(3,x))("maxValue",200)("data",C(11,N,a(4,G),a(5,J),a(6,Ve),a(7,Be),a(8,De),a(9,K),a(10,Ee))))}function Ua(e,t){if(e&1&&(o(0),u(1,"kd-chart-line",12),i()),e&2){const l=y();r(),c("yTicks",a(5,x))("maxValue",200)("area",l.activeType==="area")("showDataLabels",!0)("data",C(13,N,a(6,G),a(7,J),a(8,Le),a(9,Re),a(10,We),a(11,K),a(12,ze)))}}function Xa(e,t){if(e&1&&(o(0),u(1,"kd-chart-pie",13),i()),e&2){const l=y();r(),c("innerRadius",l.activeType==="donut"?30:0)("data",S(7,O,a(2,Ne),a(3,Oe),a(4,He),a(5,je),a(6,Ae)))}}function Ya(e,t){e&1&&(o(0),u(1,"kd-chart-bar",14),i()),e&2&&(r(),c("yTicks",a(4,x))("maxValue",200)("stacked",!0)("data",C(26,N,s(6,Je,a(5,Ge)),s(9,Qe,a(8,Ke)),s(12,qe,a(11,$e)),s(15,Xe,a(14,Ue)),s(18,Ze,a(17,Ye)),s(21,aa,a(20,ea)),s(24,la,a(23,ta)))))}function Za(e,t){e&1&&(o(0),u(1,"kd-chart-horizontal-bar",15),i()),e&2&&(r(),c("data",S(6,O,a(1,na),a(2,ra),a(3,ca),a(4,sa),a(5,oa))))}function et(e,t){e&1&&(o(0),u(1,"kd-chart-scatter",16),i()),e&2&&(r(),c("yTicks",a(3,ia))("xTicks",a(4,ua))("data",ve(18,Ca,[a(5,da),a(6,_a),a(7,ba),a(8,ga),a(9,va),a(10,pa),a(11,fa),a(12,ma),a(13,ha),a(14,ya),a(15,ka),a(16,xa),a(17,Ta)])))}function at(e,t){e&1&&(o(0),u(1,"kd-chart-radar",15),i()),e&2&&(r(),c("data",A(19,Q,s(2,Ma,a(1,Sa)),s(5,wa,a(4,Ia)),s(8,Pa,a(7,Fa)),s(11,Ba,a(10,Va)),s(14,Ea,a(13,Da)),s(17,Ra,a(16,La)))))}function tt(e,t){e&1&&(o(0),u(1,"kd-chart-gauge",17),i()),e&2&&(r(),c("value",75)("min",0)("max",100))}function lt(e,t){e&1&&(o(0),u(1,"kd-chart-funnel",15),i()),e&2&&(r(),c("data",S(6,O,a(1,Wa),a(2,za),a(3,Na),a(4,Oa),a(5,Ha))))}function nt(e,t){e&1&&(o(0),u(1,"kd-chart-waterfall",11),i()),e&2&&(r(),c("yTicks",a(3,x))("maxValue",200)("data",A(12,Q,a(4,ja),a(5,Aa),a(6,Ga),s(7,Ja,-30),s(9,Ka,-20),a(11,Qa))))}const h=class h{constructor(){_(this,"cn",pe);_(this,"activeType","bar");_(this,"chartTypes",[{id:"bar",label:"Bar"},{id:"line",label:"Line"},{id:"area",label:"Area"},{id:"donut",label:"Donut"},{id:"pie",label:"Pie"},{id:"stacked-bar",label:"Stacked Bar"},{id:"horizontal-bar",label:"Horizontal Bar"},{id:"scatter",label:"Scatter"},{id:"radar",label:"Radar"},{id:"gauge",label:"Gauge"},{id:"funnel",label:"Funnel"},{id:"waterfall",label:"Waterfall"}])}trackByT0(t,l){return l.id}};_(h,"ɵfac",function(l){return new(l||h)}),_(h,"ɵcmp",te({type:h,selectors:[["kd-chart-example"],["chart-example"]],standalone:!1,decls:25,vars:12,consts:[[1,"flex","w-full","flex-col","gap-4"],[1,"flex","flex-wrap","items-center","gap-1.5"],[4,"ngFor","ngForOf","ngForTrackBy"],["title","Revenue Overview","description","Weekly revenue breakdown by day"],[4,"ngIf"],["colorClass","bg-chart-series-1"],["colorClass","bg-chart-series-2"],["colorClass","bg-chart-series-3"],["colorClass","bg-chart-series-4"],["colorClass","bg-chart-series-5"],["type","button",3,"click"],[3,"yTicks","maxValue","data"],[3,"yTicks","maxValue","area","showDataLabels","data"],["centerLabel","45.2K",3,"innerRadius","data"],[3,"yTicks","maxValue","stacked","data"],[3,"data"],[3,"yTicks","xTicks","data"],[3,"value","min","max"]],template:function(l,n){l&1&&(b(0,"div",0)(1,"div",1),H(2,$a,3,3,"ng-container",2),p(),b(3,"kd-chart",3),H(4,qa,2,19,"ng-container",4)(5,Ua,2,21,"ng-container",4)(6,Xa,2,13,"ng-container",4)(7,Ya,2,34,"ng-container",4)(8,Za,2,12,"ng-container",4)(9,et,2,32,"ng-container",4)(10,at,2,26,"ng-container",4)(11,tt,2,3,"ng-container",4)(12,lt,2,12,"ng-container",4)(13,nt,2,19,"ng-container",4),b(14,"kd-chart-legend")(15,"kd-chart-legend-item",5),m(16,"Series 1"),p(),b(17,"kd-chart-legend-item",6),m(18,"Series 2"),p(),b(19,"kd-chart-legend-item",7),m(20,"Series 3"),p(),b(21,"kd-chart-legend-item",8),m(22,"Series 4"),p(),b(23,"kd-chart-legend-item",9),m(24,"Series 5"),p()()()()),l&2&&(r(2),c("ngForOf",n.chartTypes)("ngForTrackBy",n.trackByT0),r(2),c("ngIf",n.activeType==="bar"),r(),c("ngIf",n.activeType==="line"||n.activeType==="area"),r(),c("ngIf",n.activeType==="donut"||n.activeType==="pie"),r(),c("ngIf",n.activeType==="stacked-bar"),r(),c("ngIf",n.activeType==="horizontal-bar"),r(),c("ngIf",n.activeType==="scatter"),r(),c("ngIf",n.activeType==="radar"),r(),c("ngIf",n.activeType==="gauge"),r(),c("ngIf",n.activeType==="funnel"),r(),c("ngIf",n.activeType==="waterfall"))},dependencies:[Fe,Pe,fe,me,he,ye,ke,xe,Te,Ce,Se,Me,Ie,we],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let g=h;(typeof ngDevMode>"u"||ngDevMode)&&j(g,[{type:re,args:[{standalone:!1,selector:"kd-chart-example, chart-example",template:`
    <div class="flex w-full flex-col gap-4">
      <div class="flex flex-wrap items-center gap-1.5">
        <ng-container *ngFor="let t of chartTypes; trackBy: trackByT0"
          ><button
            type="button"
            (click)="
          activeType = t.id;
        "
            [class]="cn('cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors', activeType === t.id ? 'border-primary-default bg-primary-default text-primary-foreground' : 'border-border-default bg-background-default text-foreground-muted hover:text-foreground-default')"
          >
            {{t.label}}
          </button></ng-container
        >
      </div>
      <kd-chart
        title="Revenue Overview"
        description="Weekly revenue breakdown by day"
        ><ng-container *ngIf="activeType === 'bar'"
          ><kd-chart-bar
            [yTicks]="[200, 150, 100, 50, 0]"
            [maxValue]="200"
            [data]="[{
          label: 'Mon',
          value: 120
        }, {
          label: 'Tue',
          value: 80
        }, {
          label: 'Wed',
          value: 165
        }, {
          label: 'Thu',
          value: 25
        }, {
          label: 'Fri',
          value: 145
        }, {
          label: 'Sat',
          value: 60
        }, {
          label: 'Sun',
          value: 135
        }]"
          ></kd-chart-bar
        ></ng-container>
        <ng-container *ngIf="activeType === 'line' || activeType === 'area'"
          ><kd-chart-line
            [yTicks]="[200, 150, 100, 50, 0]"
            [maxValue]="200"
            [area]="activeType === 'area'"
            [showDataLabels]="true"
            [data]="[{
          label: 'Mon',
          value: 120
        }, {
          label: 'Tue',
          value: 80
        }, {
          label: 'Wed',
          value: 160
        }, {
          label: 'Thu',
          value: 100
        }, {
          label: 'Fri',
          value: 140
        }, {
          label: 'Sat',
          value: 60
        }, {
          label: 'Sun',
          value: 130
        }]"
          ></kd-chart-line
        ></ng-container>
        <ng-container *ngIf="activeType === 'donut' || activeType === 'pie'"
          ><kd-chart-pie
            centerLabel="45.2K"
            [innerRadius]="activeType === 'donut' ? 30 : 0"
            [data]="[{
          label: 'Series 1',
          value: 30
        }, {
          label: 'Series 2',
          value: 24
        }, {
          label: 'Series 3',
          value: 18
        }, {
          label: 'Series 4',
          value: 15
        }, {
          label: 'Series 5',
          value: 13
        }]"
          ></kd-chart-pie
        ></ng-container>
        <ng-container *ngIf="activeType === 'stacked-bar'"
          ><kd-chart-bar
            [yTicks]="[200, 150, 100, 50, 0]"
            [maxValue]="200"
            [stacked]="true"
            [data]="[{
          label: 'Mon',
          values: [50, 35, 35]
        }, {
          label: 'Tue',
          values: [30, 25, 25]
        }, {
          label: 'Wed',
          values: [60, 45, 60]
        }, {
          label: 'Thu',
          values: [40, 35, 25]
        }, {
          label: 'Fri',
          values: [55, 40, 50]
        }, {
          label: 'Sat',
          values: [25, 15, 20]
        }, {
          label: 'Sun',
          values: [50, 35, 50]
        }]"
          ></kd-chart-bar
        ></ng-container>
        <ng-container *ngIf="activeType === 'horizontal-bar'"
          ><kd-chart-horizontal-bar
            [data]="[{
          label: 'Product A',
          value: 85
        }, {
          label: 'Product B',
          value: 65
        }, {
          label: 'Product C',
          value: 50
        }, {
          label: 'Product D',
          value: 40
        }, {
          label: 'Product E',
          value: 30
        }]"
          ></kd-chart-horizontal-bar
        ></ng-container>
        <ng-container *ngIf="activeType === 'scatter'"
          ><kd-chart-scatter
            [yTicks]="[100, 75, 50, 25, 0]"
            [xTicks]="[0, 20, 40, 60, 80, 100]"
            [data]="[{
          x: 12,
          y: 28,
          series: 0
        }, {
          x: 26,
          y: 48,
          series: 0
        }, {
          x: 52,
          y: 60,
          series: 0
        }, {
          x: 68,
          y: 72,
          series: 0
        }, {
          x: 94,
          y: 76,
          series: 0
        }, {
          x: 18,
          y: 18,
          series: 1
        }, {
          x: 42,
          y: 44,
          series: 1
        }, {
          x: 74,
          y: 50,
          series: 1
        }, {
          x: 88,
          y: 65,
          series: 1
        }, {
          x: 28,
          y: 24,
          series: 2
        }, {
          x: 44,
          y: 12,
          series: 2
        }, {
          x: 70,
          y: 26,
          series: 2
        }, {
          x: 92,
          y: 18,
          series: 2
        }]"
          ></kd-chart-scatter
        ></ng-container>
        <ng-container *ngIf="activeType === 'radar'"
          ><kd-chart-radar
            [data]="[{
          label: 'Speed',
          values: [85, 65]
        }, {
          label: 'Power',
          values: [75, 80]
        }, {
          label: 'Range',
          values: [65, 85]
        }, {
          label: 'Defense',
          values: [80, 60]
        }, {
          label: 'Health',
          values: [70, 75]
        }, {
          label: 'Magic',
          values: [75, 85]
        }]"
          ></kd-chart-radar
        ></ng-container>
        <ng-container *ngIf="activeType === 'gauge'"
          ><kd-chart-gauge [value]="75" [min]="0" [max]="100"></kd-chart-gauge
        ></ng-container>
        <ng-container *ngIf="activeType === 'funnel'"
          ><kd-chart-funnel
            [data]="[{
          label: 'Visitors',
          value: 12500
        }, {
          label: 'Leads',
          value: 8200
        }, {
          label: 'Qualified',
          value: 4100
        }, {
          label: 'Proposals',
          value: 1800
        }, {
          label: 'Closed',
          value: 620
        }]"
          ></kd-chart-funnel
        ></ng-container>
        <ng-container *ngIf="activeType === 'waterfall'"
          ><kd-chart-waterfall
            [yTicks]="[200, 150, 100, 50, 0]"
            [maxValue]="200"
            [data]="[{
          label: 'Start',
          value: 120
        }, {
          label: '+Rev',
          value: 35
        }, {
          label: '+Svc',
          value: 20
        }, {
          label: '-Cost',
          value: -30
        }, {
          label: '-Tax',
          value: -20
        }, {
          label: 'Total',
          value: 125,
          isTotal: true
        }]"
          ></kd-chart-waterfall
        ></ng-container>
        <kd-chart-legend
          ><kd-chart-legend-item colorClass="bg-chart-series-1"
            >Series 1</kd-chart-legend-item
          >
          <kd-chart-legend-item colorClass="bg-chart-series-2"
            >Series 2</kd-chart-legend-item
          >
          <kd-chart-legend-item colorClass="bg-chart-series-3"
            >Series 3</kd-chart-legend-item
          >
          <kd-chart-legend-item colorClass="bg-chart-series-4"
            >Series 4</kd-chart-legend-item
          >
          <kd-chart-legend-item colorClass="bg-chart-series-5"
            >Series 5</kd-chart-legend-item
          ></kd-chart-legend
        ></kd-chart
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&ce(g,{className:"ChartExample",filePath:"ChartExample.ts",lineNumber:328});const f=class f{};_(f,"ɵfac",function(l){return new(l||f)}),_(f,"ɵmod",le({type:f})),_(f,"ɵinj",ne({imports:[z,M,I,w,F,P,V,B,D,E,L,R,W]}));let k=f;(typeof ngDevMode>"u"||ngDevMode)&&j(k,[{type:se,args:[{declarations:[g],imports:[z,M,I,w,F,P,V,B,D,E,L,R,W],exports:[g]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&oe(k,{declarations:[g],imports:[z,M,I,w,F,P,V,B,D,E,L,R,W],exports:[g]})})();export{k as ChartExampleModule,g as default};

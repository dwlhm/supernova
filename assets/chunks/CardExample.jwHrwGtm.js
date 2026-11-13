var D=Object.defineProperty;var L=(t,a,e)=>a in t?D(t,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[a]=e;var o=(t,a,e)=>L(t,typeof a!="symbol"?a+"":a,e);import{ɵ as T,a as z,b as F,j as r,o as c,p as s,z as m,k as B,t as u,e as p,au as R,an as i,x as W,av as $,at as S,s as P,C as U,f as A,N as G,g as I}from"./core.vpEFnhB-.js";import O,{CardModule as k}from"./Card.DXwh8wXl.js";import H,{CardHeaderModule as b}from"./CardHeader.CLneIP3b.js";import j,{CardFooterModule as v}from"./CardFooter.U48l1ac7.js";import J,{StatModule as h}from"./Stat.HqDIlTU1.js";import Q,{DividerModule as _}from"./Divider.B7t7MmUb.js";import q,{ListItemModule as x}from"./ListItem.CUNqvfz6.js";import E,{BadgeModule as C}from"./Badge.0GC7UITL.js";import K,{ProgressbarModule as M}from"./Progressbar.oxETpzJM.js";import V,{ChartLineModule as w}from"./ChartLine.RK_2RATs.js";import X,{ChartHorizontalBarModule as y}from"./ChartHorizontalBar.DDb3GXwl.js";import{C as N}from"./common_module-chunk.B8w5oXjf.js";import"./theme.CMj9otVT.js";import"./framework.CbUgrr79.js";import"./Tooltip.BddMW6yj.js";const Y=()=>({label:"W1",value:28}),Z=()=>({label:"W2",value:42}),ee=()=>({label:"W3",value:36}),ae=()=>({label:"W4",value:64}),te=(t,a,e,d)=>[t,a,e,d],re=()=>({label:"Organic",value:54}),se=()=>({label:"Direct",value:31}),de=()=>({label:"Referral",value:15}),le=(t,a,e)=>[t,a,e],oe=(t,a)=>e=>`${e}% completed`,g=class g{constructor(){o(this,"goalProgress",76)}};o(g,"ɵfac",function(e){return new(e||g)}),o(g,"ɵcmp",T({type:g,selectors:[["kd-card-example"],["card-example"]],standalone:!1,decls:32,vars:32,consts:[[1,"grid","w-full","grid-cols-1","gap-4","md:grid-cols-2"],["title","Total Revenue"],["variant","success"],["value","$45,231.89","size","lg"],["chartClassName","h-10",3,"data","showGridLines","showAxisLabels","showDots","area"],["title","Quarterly Goal","subtitle","Target $50,000"],["type","button",1,"cursor-pointer","rounded-md","border","border-border-default","bg-background-default","px-2","py-0.5","text-xs","font-medium","text-foreground-default","hover:bg-background-muted",3,"click"],["value","$38,400","size","lg"],["indicatorClassName","bg-chart-series-1",3,"value","showLabel","showPercentage","label"],["title","User Balance Comparison"],[1,"flex","flex-row","items-center","gap-3"],["value","Rp 2.45M","label","User A","className","flex-1",3,"reversed"],["orientation","vertical","className","h-9"],["value","Rp 1.80M","label","User B","className","flex-1",3,"reversed","muted"],[1,"text-xs","text-foreground-muted"],["title","Top Channels","subtitle","12,480 total"],["barClassName","h-2",3,"stacked","data"],[1,"flex","flex-col","gap-1.5"],["badge","#1","value","5,420"],["dotTone","series-2","value","4,110"]],template:function(e,d){e&1&&(r(0,"div",0)(1,"kd-card")(2,"kd-card-header",1)(3,"kd-badge",2),c(4,"↑ +20.1%"),s()(),m(5,"kd-stat",3)(6,"kd-chart-line",4),s(),r(7,"kd-card")(8,"kd-card-header",5)(9,"button",6),B("click",function(){return d.goalProgress=d.goalProgress>=100?60:d.goalProgress+12}),c(10),s()(),m(11,"kd-stat",7)(12,"kd-progressbar",8),s(),r(13,"kd-card"),m(14,"kd-card-header",9),r(15,"div",10),m(16,"kd-stat",11)(17,"kd-divider",12)(18,"kd-stat",13),s(),r(19,"kd-card-footer")(20,"kd-badge",2),c(21,"↑ +36%"),s(),r(22,"span",14),c(23,"higher balance"),s()()(),r(24,"kd-card"),m(25,"kd-card-header",15)(26,"kd-chart-horizontal-bar",16),r(27,"div",17)(28,"kd-list-item",18),c(29,"Organic Search"),s(),r(30,"kd-list-item",19),c(31,"Direct Traffic"),s()()()()),e&2&&(u(6),p("data",R(20,te,i(16,Y),i(17,Z),i(18,ee),i(19,ae)))("showGridLines",!1)("showAxisLabels",!1)("showDots",!1)("area",!0),u(4),W(" + ",d.goalProgress," % "),u(2),p("value",d.goalProgress)("showLabel",!0)("showPercentage",!1)("label",$(15,oe,d)),u(4),p("reversed",!0),u(2),p("reversed",!0)("muted",!0),u(8),p("stacked",!0)("data",S(28,le,i(25,re),i(26,se),i(27,de))))},dependencies:[O,H,E,J,V,K,Q,j,X,q],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let l=g;(typeof ngDevMode>"u"||ngDevMode)&&P(l,[{type:U,args:[{standalone:!1,selector:"kd-card-example, card-example",template:`
    <div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      <kd-card
        ><kd-card-header title="Total Revenue"
          ><kd-badge variant="success">↑ +20.1%</kd-badge></kd-card-header
        >
        <kd-stat value="$45,231.89" size="lg"></kd-stat>
        <kd-chart-line
          chartClassName="h-10"
          [data]="[{
          label: 'W1',
          value: 28
        }, {
          label: 'W2',
          value: 42
        }, {
          label: 'W3',
          value: 36
        }, {
          label: 'W4',
          value: 64
        }]"
          [showGridLines]="false"
          [showAxisLabels]="false"
          [showDots]="false"
          [area]="true"
        ></kd-chart-line
      ></kd-card>
      <kd-card
        ><kd-card-header title="Quarterly Goal" subtitle="Target $50,000"
          ><button
            type="button"
            class="cursor-pointer rounded-md border border-border-default bg-background-default px-2 py-0.5 text-xs font-medium text-foreground-default hover:bg-background-muted"
            (click)="
          goalProgress = goalProgress >= 100 ? 60 : goalProgress + 12;
        "
          >
            + {{goalProgress}} %
          </button></kd-card-header
        >
        <kd-stat value="$38,400" size="lg"></kd-stat>
        <kd-progressbar
          indicatorClassName="bg-chart-series-1"
          [value]="goalProgress"
          [showLabel]="true"
          [showPercentage]="false"
          [label]="pct => \`\${pct}% completed\`"
        ></kd-progressbar
      ></kd-card>
      <kd-card
        ><kd-card-header title="User Balance Comparison"></kd-card-header>
        <div class="flex flex-row items-center gap-3">
          <kd-stat
            value="Rp 2.45M"
            label="User A"
            className="flex-1"
            [reversed]="true"
          ></kd-stat>
          <kd-divider orientation="vertical" className="h-9"></kd-divider>
          <kd-stat
            value="Rp 1.80M"
            label="User B"
            className="flex-1"
            [reversed]="true"
            [muted]="true"
          ></kd-stat>
        </div>
        <kd-card-footer
          ><kd-badge variant="success">↑ +36%</kd-badge>
          <span class="text-xs text-foreground-muted"
            >higher balance</span
          ></kd-card-footer
        ></kd-card
      >
      <kd-card
        ><kd-card-header
          title="Top Channels"
          subtitle="12,480 total"
        ></kd-card-header>
        <kd-chart-horizontal-bar
          barClassName="h-2"
          [stacked]="true"
          [data]="[{
          label: 'Organic',
          value: 54
        }, {
          label: 'Direct',
          value: 31
        }, {
          label: 'Referral',
          value: 15
        }]"
        ></kd-chart-horizontal-bar>
        <div class="flex flex-col gap-1.5">
          <kd-list-item badge="#1" value="5,420">Organic Search</kd-list-item>
          <kd-list-item dotTone="series-2" value="4,110"
            >Direct Traffic</kd-list-item
          >
        </div></kd-card
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&A(l,{className:"CardExample",filePath:"CardExample.ts",lineNumber:129});const n=class n{};o(n,"ɵfac",function(e){return new(e||n)}),o(n,"ɵmod",z({type:n})),o(n,"ɵinj",F({imports:[N,k,b,C,h,w,M,_,v,y,x]}));let f=n;(typeof ngDevMode>"u"||ngDevMode)&&P(f,[{type:G,args:[{declarations:[l],imports:[N,k,b,C,h,w,M,_,v,y,x],exports:[l]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&I(f,{declarations:[l],imports:[N,k,b,C,h,w,M,_,v,y,x],exports:[l]})})();export{f as CardExampleModule,l as default};

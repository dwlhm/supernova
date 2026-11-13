var b=Object.defineProperty;var C=(r,a,n)=>a in r?b(r,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[a]=n;var t=(r,a,n)=>C(r,typeof a!="symbol"?a+"":a,n);import{E as _,ɵ as k,a as h,b as N,c as w,j as v,k as M,z as D,q as j,p as P,u,v as E,t as m,s as y,O as I,I as l,C as O,f as S,N as T,g as F}from"./core.vpEFnhB-.js";import{a as J,d as q}from"./theme.CMj9otVT.js";import{C as p}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const z=["*"],c={colorClass:"bg-chart-series-1",interactive:!1,active:!0,disabled:!1,className:""},o=class o{constructor(){t(this,"cn",J);t(this,"bindControllerProps",q);t(this,"interactive",c.interactive);t(this,"disabled",c.disabled);t(this,"active",c.active);t(this,"className",c.className);t(this,"colorClass",c.colorClass);t(this,"onClick",new _)}};t(o,"ɵfac",function(n){return new(n||o)}),t(o,"ɵcmp",k({type:o,selectors:[["kd-chart-legend-item"],["chart-legend-item"]],inputs:{interactive:"interactive",disabled:"disabled",active:"active",className:"className",colorClass:"colorClass"},outputs:{onClick:"onClick"},standalone:!1,ngContentSelectors:z,decls:4,vars:11,consts:[[3,"click","keydown"]],template:function(n,e){n&1&&(w(),v(0,"div",0),M("click",function(){return e.interactive&&!e.disabled&&e.onClick&&e.onClick.emit()})("keydown",function(f){return e.interactive&&!e.disabled&&(f.key==="Enter"||f.key===" ")&&e.onClick&&e.onClick.emit()}),D(1,"span"),v(2,"span"),j(3),P()()),n&2&&(u(e.cn("flex flex-row items-center justify-start gap-2",e.interactive&&"rounded-md px-1.5 py-0.5 select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",e.interactive&&(e.disabled?"cursor-not-allowed opacity-50":"cursor-pointer hover:bg-background-muted active:scale-[0.98]"),!e.active&&"opacity-50",e.className)),E("data-ctrl",typeof e.bindControllerProps)("role",e.interactive?"button":void 0)("tabIndex",e.interactive&&!e.disabled?0:void 0)("aria-pressed",e.interactive?e.active:void 0)("aria-disabled",e.interactive&&e.disabled?!0:void 0),m(),u(e.cn("h-2 w-2 shrink-0 rounded-full transition-opacity",e.colorClass,!e.active&&"opacity-40")),m(),u(e.cn("text-xs font-normal text-foreground-muted",!e.active&&"line-through")))},styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let i=o;(typeof ngDevMode>"u"||ngDevMode)&&y(i,[{type:O,args:[{standalone:!1,selector:"kd-chart-legend-item, chart-legend-item",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [attr.role]="interactive ? 'button' : undefined"
      [attr.tabIndex]="interactive && !disabled ? 0 : undefined"
      [attr.aria-pressed]="interactive ? active : undefined"
      [attr.aria-disabled]="interactive && disabled ? true : undefined"
      (click)="interactive && !disabled && onClick && this.onClick.emit()"
      (keydown)="interactive && !disabled && ($event.key === 'Enter' || $event.key === ' ') && onClick && this.onClick.emit()"
      [class]="cn('flex flex-row items-center justify-start gap-2', interactive && 'rounded-md px-1.5 py-0.5 select-none transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', interactive && (disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-background-muted active:scale-[0.98]'), !active && 'opacity-50', className)"
    >
      <span
        [class]="cn('h-2 w-2 shrink-0 rounded-full transition-opacity', colorClass, !active && 'opacity-40')"
      ></span>
      <span
        [class]="cn('text-xs font-normal text-foreground-muted', !active && 'line-through')"
        ><ng-content></ng-content
      ></span>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{interactive:[{type:l}],disabled:[{type:l}],active:[{type:l}],className:[{type:l}],colorClass:[{type:l}],onClick:[{type:I}]});(typeof ngDevMode>"u"||ngDevMode)&&S(i,{className:"ChartLegendItem",filePath:"ChartLegendItem.ts",lineNumber:55});const s=class s{};t(s,"ɵfac",function(n){return new(n||s)}),t(s,"ɵmod",h({type:s})),t(s,"ɵinj",N({imports:[p]}));let d=s;(typeof ngDevMode>"u"||ngDevMode)&&y(d,[{type:T,args:[{declarations:[i],imports:[p],exports:[i]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&F(d,{declarations:[i],imports:[p],exports:[i]})})();export{d as ChartLegendItemModule,i as default};

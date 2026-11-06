var j=Object.defineProperty;var B=(o,a,t)=>a in o?j(o,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[a]=t;var n=(o,a,t)=>B(o,typeof a!="symbol"?a+"":a,t);import{E as C,ɵ as H,a as L,b as F,j as s,d as v,k as w,o as m,p as l,y as P,z as D,ao as N,u as x,v as u,t as r,e as h,am as b,s as O,O as M,I as i,C as V,f as A,N as E,g as $,i as _,r as y,m as f,h as z,l as W,n as J,x as R}from"./core.BqS-lykr.js";import{a as G,j as q,I as K,b as Q}from"./utils.BBpd638g.js";import{C as T,a as U,N as X}from"./common_module-chunk.DvGwmKFp.js";function Y(o,a){if(o&1&&(_(0),s(1,"span",12),m(2),l(),y()),o&2){const t=f();r(2),b(t.label)}}function Z(o,a){if(o&1&&(_(0),s(1,"span",13),m(2),l(),y()),o&2){const t=a.$implicit;r(2),b(t)}}function ee(o,a){if(o&1){const t=z();_(0),s(1,"button",15),w("click",function(){W(t);const k=f().$implicit,I=f();return J(I.onSelect&&I.onSelect.emit(k.day))}),m(2),l(),y()}if(o&2){const t=f().$implicit,e=f();r(),x(e.cn("flex h-8 w-8 items-center justify-center rounded-sm text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",t.isSelected?"bg-primary-default text-primary-foreground":"text-foreground-default hover:bg-background-muted")),u("aria-pressed",t.isSelected),r(),R(" ",t.day," ")}}function te(o,a){if(o&1&&(_(0),s(1,"span",14),v(2,ee,3,4,"ng-container",0),l(),y()),o&2){const t=a.$implicit;r(2),h("ngIf",!t.isBlank)}}function ne(o,a){if(o&1&&(_(0),s(1,"span",16),m(2),l(),y()),o&2){const t=f();r(2),b(t.hint)}}const c={open:!1,value:0,month:1,year:2025,label:"Date of Birth",placeholder:"Select a date",hint:"Choose a date from the calendar.",showHint:!1,showLabel:!0,displayValue:"",className:""},g=class g{constructor(){n(this,"value",c.value);n(this,"month",c.month);n(this,"year",c.year);n(this,"placeholder",c.placeholder);n(this,"displayValue",c.displayValue);n(this,"cn",G);n(this,"getDatePickerState",q);n(this,"ICON_PATHS",K);n(this,"bindControllerProps",Q);n(this,"className",c.className);n(this,"showLabel",c.showLabel);n(this,"label",c.label);n(this,"open",c.open);n(this,"showHint",c.showHint);n(this,"hint",c.hint);n(this,"onOpenChange",new C);n(this,"onMonthStep",new C);n(this,"onSelect",new C)}get props(){return this}trackByWeekday0(a,t){return t}trackByCell1(a,t){return t.key}};n(g,"ɵfac",function(t){return new(t||g)}),n(g,"ɵcmp",H({type:g,selectors:[["spn-date-picker"],["date-picker"]],inputs:{value:"value",month:"month",year:"year",placeholder:"placeholder",displayValue:"displayValue",className:"className",showLabel:"showLabel",label:"label",open:"open",showHint:"showHint",hint:"hint"},outputs:{onOpenChange:"onOpenChange",onMonthStep:"onMonthStep",onSelect:"onSelect"},standalone:!1,decls:21,vars:20,consts:[[4,"ngIf"],["type","button","aria-haspopup","dialog",1,"flex","h-9","w-full","items-center","justify-between","gap-2","rounded-lg","border","border-border-default","bg-background-default","px-3","text-left","shadow-xs","transition-colors","hover:bg-background-subtle","focus:outline-none","focus-visible:ring-2","focus-visible:ring-focus-ring-primary",3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4","shrink-0","text-foreground-muted"],["stroke-linecap","round","stroke-linejoin","round"],["role","dialog"],[1,"mb-3","flex","items-center","justify-between","gap-2","px-1"],["type","button","aria-label","Previous month",1,"inline-flex","h-7","w-7","items-center","justify-center","rounded-sm","text-foreground-default","hover:bg-background-muted",3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4"],[1,"text-sm","font-semibold","text-foreground-default"],["type","button","aria-label","Next month",1,"inline-flex","h-7","w-7","items-center","justify-center","rounded-sm","text-foreground-default","hover:bg-background-muted",3,"click"],[1,"grid","grid-cols-7","gap-1"],[4,"ngFor","ngForOf","ngForTrackBy"],[1,"text-sm","font-medium","text-foreground-default"],[1,"py-1","text-center","text-xs","font-medium","text-foreground-muted"],[1,"flex","items-center","justify-center"],["type","button",3,"click"],[1,"text-sm","text-foreground-muted"]],template:function(t,e){t&1&&(s(0,"div"),v(1,Y,3,1,"ng-container",0),s(2,"button",1),w("click",function(){return e.onOpenChange&&e.onOpenChange.emit(!e.open)}),s(3,"span"),m(4),l(),P(),s(5,"svg",2),D(6,"path",3),l()(),N(),s(7,"div",4)(8,"div",5)(9,"button",6),w("click",function(){return e.onMonthStep&&e.onMonthStep.emit(-1)}),P(),s(10,"svg",7),D(11,"path",3),l()(),N(),s(12,"span",8),m(13),l(),s(14,"button",9),w("click",function(){return e.onMonthStep&&e.onMonthStep.emit(1)}),P(),s(15,"svg",7),D(16,"path",3),l()()(),N(),s(17,"div",10),v(18,Z,3,1,"ng-container",11)(19,te,3,1,"ng-container",11),l()(),v(20,ne,3,1,"ng-container",0),l()),t&2&&(x(e.cn("relative flex w-full flex-col gap-3",e.className)),u("data-ctrl",typeof e.bindControllerProps),r(),h("ngIf",e.showLabel&&e.label!==""),r(),u("aria-expanded",e.open),r(),x(e.cn("truncate text-sm",e.getDatePickerState(e.props).hasValue?"text-foreground-default":"text-foreground-subtle")),r(),b(e.getDatePickerState(e.props).displayText),r(2),u("d",e.ICON_PATHS.calendar),r(),x(e.cn("absolute top-full z-50 mt-2 w-full rounded-xl border border-border-default bg-background-default p-3 shadow-lg",e.open?"block":"hidden")),u("aria-label",e.label),r(4),u("d",e.ICON_PATHS.chevronLeft),r(2),b(e.getDatePickerState(e.props).monthLabel),r(3),u("d",e.ICON_PATHS.chevronRight),r(2),h("ngForOf",e.getDatePickerState(e.props).weekdays)("ngForTrackBy",e.trackByWeekday0),r(),h("ngForOf",e.getDatePickerState(e.props).cells)("ngForTrackBy",e.trackByCell1),r(),h("ngIf",e.showHint))},dependencies:[U,X],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let d=g;(typeof ngDevMode>"u"||ngDevMode)&&O(d,[{type:V,args:[{standalone:!1,selector:"spn-date-picker, date-picker",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('relative flex w-full flex-col gap-3', className)"
    >
      <ng-container *ngIf="showLabel && label !== ''"
        ><span
          class="text-sm font-medium text-foreground-default"
          >{{label}}</span
        ></ng-container
      >
      <button
        type="button"
        aria-haspopup="dialog"
        class="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-background-default px-3 text-left shadow-xs transition-colors hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
        [attr.aria-expanded]="open"
        (click)="onOpenChange && this.onOpenChange.emit(!open)"
      >
        <span
          [class]="cn('truncate text-sm', getDatePickerState(props).hasValue ? 'text-foreground-default' : 'text-foreground-subtle')"
          >{{getDatePickerState(props).displayText}}</span
        >
        <svg
          aria-hidden="true"
          class="h-4 w-4 shrink-0 text-foreground-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            [attr.d]="ICON_PATHS.calendar"
          ></path>
        </svg>
      </button>
      <div
        role="dialog"
        [attr.aria-label]="label"
        [class]="cn('absolute top-full z-50 mt-2 w-full rounded-xl border border-border-default bg-background-default p-3 shadow-lg', open ? 'block' : 'hidden')"
      >
        <div class="mb-3 flex items-center justify-between gap-2 px-1">
          <button
            type="button"
            aria-label="Previous month"
            class="inline-flex h-7 w-7 items-center justify-center rounded-sm text-foreground-default hover:bg-background-muted"
            (click)="onMonthStep && this.onMonthStep.emit(-1)"
          >
            <svg
              aria-hidden="true"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                [attr.d]="ICON_PATHS.chevronLeft"
              ></path>
            </svg>
          </button>
          <span
            class="text-sm font-semibold text-foreground-default"
            >{{getDatePickerState(props).monthLabel}}</span
          >
          <button
            type="button"
            aria-label="Next month"
            class="inline-flex h-7 w-7 items-center justify-center rounded-sm text-foreground-default hover:bg-background-muted"
            (click)="onMonthStep && this.onMonthStep.emit(1)"
          >
            <svg
              aria-hidden="true"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                [attr.d]="ICON_PATHS.chevronRight"
              ></path>
            </svg>
          </button>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <ng-container
            *ngFor="let weekday of getDatePickerState(props).weekdays; trackBy: trackByWeekday0"
            ><span
              class="py-1 text-center text-xs font-medium text-foreground-muted"
              >{{weekday}}</span
            ></ng-container
          >
          <ng-container
            *ngFor="let cell of getDatePickerState(props).cells; trackBy: trackByCell1"
            ><span class="flex items-center justify-center"
              ><ng-container *ngIf="!cell.isBlank"
                ><button
                  type="button"
                  [attr.aria-pressed]="cell.isSelected"
                  [class]="cn('flex h-8 w-8 items-center justify-center rounded-sm text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', cell.isSelected ? 'bg-primary-default text-primary-foreground' : 'text-foreground-default hover:bg-background-muted')"
                  (click)="onSelect && this.onSelect.emit(cell.day)"
                >
                  {{cell.day}}
                </button></ng-container
              ></span
            ></ng-container
          >
        </div>
      </div>
      <ng-container *ngIf="showHint"
        ><span
          class="text-sm text-foreground-muted"
          >{{hint}}</span
        ></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{value:[{type:i}],month:[{type:i}],year:[{type:i}],placeholder:[{type:i}],displayValue:[{type:i}],className:[{type:i}],showLabel:[{type:i}],label:[{type:i}],open:[{type:i}],showHint:[{type:i}],hint:[{type:i}],onOpenChange:[{type:M}],onMonthStep:[{type:M}],onSelect:[{type:M}]});(typeof ngDevMode>"u"||ngDevMode)&&A(d,{className:"DatePicker",filePath:"DatePicker.ts",lineNumber:176});const p=class p{};n(p,"ɵfac",function(t){return new(t||p)}),n(p,"ɵmod",L({type:p})),n(p,"ɵinj",F({imports:[T]}));let S=p;(typeof ngDevMode>"u"||ngDevMode)&&O(S,[{type:E,args:[{declarations:[d],imports:[T],exports:[d]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&$(S,{declarations:[d],imports:[T],exports:[d]})})();export{S as DatePickerModule,d as default};

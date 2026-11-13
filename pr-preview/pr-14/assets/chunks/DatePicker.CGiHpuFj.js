var E=Object.defineProperty;var L=(o,d,e)=>d in o?E(o,d,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[d]=e;var r=(o,d,e)=>L(o,typeof d!="symbol"?d+"":d,e);import{E as y,ɵ as Y,a as G,b as A,j as s,k as _,d as S,p as u,u as m,v as g,t as a,an as F,e as b,s as j,O as w,I as i,C as R,f as $,N as q,g as z,i as k,o as v,r as x,m as c,x as V,h as T,l as f,n as h,y as D,z as P,ao as O,aq as H}from"./core.vpEFnhB-.js";import{a as W,e as J,q as U,I as K,d as Q}from"./theme.CecfD-Na.js";import{C as N,b as X,a as Z}from"./common_module-chunk.B8w5oXjf.js";import"./framework.DPU9SBEx.js";const ee=()=>({single:"w-48",range:"w-60",month:"w-48",year:"w-48"});function te(o,d){o&1&&(k(0),s(1,"span",5),v(2,"*"),u(),x())}function ne(o,d){if(o&1&&(k(0),s(1,"span",4),v(2),S(3,te,3,0,"ng-container",2),u(),x()),o&2){const e=c();a(2),V("",e.getDatePickerState(e.props).resolvedLabel," "),a(),b("ngIf",e.required)}}function re(o,d){if(o&1){const e=T();k(0),s(1,"div")(2,"input",6),_("input",function(n){f(e);const p=c();return h(!p.getDatePickerState(p.props).isDisabled&&p.onInputChange&&p.onInputChange.emit(n.target.value))})("blur",function(n){f(e);const p=c();return h(!p.getDatePickerState(p.props).isOpen&&p.onBlur&&p.onBlur.emit(n))}),u(),s(3,"button",7),_("click",function(){f(e);const n=c();return h(!n.getDatePickerState(n.props).isDisabled&&n.onOpenChange&&n.onOpenChange.emit(!n.getDatePickerState(n.props).isOpen))}),D(),s(4,"svg",8),P(5,"path",9),u()()(),x()}if(o&2){const e=c();a(),m(e.cn("flex h-9 w-full items-center justify-between gap-2 rounded-lg border py-1 pl-3 pr-1.5 shadow-xs transition-colors",e.getDatePickerState(e.props).isDisabled?"cursor-not-allowed border-border-default bg-background-muted opacity-50":e.getDatePickerState(e.props).hasError?"border-destructive-border bg-input-default ring-2 ring-focus-ring-error":"border-border-default bg-input-default focus-within:ring-2 focus-within:ring-focus-ring-primary")),a(),g("id",e.id)("name",e.name)("disabled",e.getDatePickerState(e.props).isDisabled?"":null)("aria-invalid",e.getDatePickerState(e.props).hasError)("aria-describedby",e.getDatePickerState(e.props).showHintText?e.id+"-hint":void 0)("aria-label",e.getDatePickerState(e.props).resolvedLabel)("value",e.getDatePickerState(e.props).inputText)("placeholder",e.placeholder),a(),m(e.cn("inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md hover:bg-background-muted disabled:cursor-not-allowed",e.getDatePickerState(e.props).hasError?"text-destructive-foreground":"text-foreground-default")),g("disabled",e.getDatePickerState(e.props).isDisabled?"":null)("aria-expanded",e.getDatePickerState(e.props).isOpen),a(2),g("d",e.ICON_PATHS.calendar)}}function ae(o,d){if(o&1){const e=T();k(0),s(1,"button",10),_("click",function(){f(e);const n=c();return h(!n.getDatePickerState(n.props).isDisabled&&n.onOpenChange&&n.onOpenChange.emit(!n.getDatePickerState(n.props).isOpen))})("blur",function(n){f(e);const p=c();return h(!p.getDatePickerState(p.props).isOpen&&p.onBlur&&p.onBlur.emit(n))}),s(2,"span"),v(3),u(),D(),s(4,"svg",11),P(5,"path",9),u()(),x()}if(o&2){const e=c();a(),m(e.cn("flex h-9 w-full items-center justify-between gap-2 rounded-lg border px-3 py-1 text-left shadow-xs transition-colors focus:outline-none",e.getDatePickerState(e.props).isDisabled?"cursor-not-allowed border-border-default bg-background-muted opacity-50":e.getDatePickerState(e.props).hasError?"border-destructive-border bg-input-default ring-2 ring-focus-ring-error":"border-border-default bg-input-default hover:bg-background-subtle focus-visible:ring-2 focus-visible:ring-focus-ring-primary")),g("id",e.id)("name",e.name)("disabled",e.getDatePickerState(e.props).isDisabled?"":null)("aria-expanded",e.getDatePickerState(e.props).isOpen)("aria-invalid",e.getDatePickerState(e.props).hasError)("aria-describedby",e.getDatePickerState(e.props).showHintText?e.id+"-hint":void 0),a(),m(e.cn("truncate text-sm",e.getDatePickerState(e.props).hasValue?"text-foreground-default":"text-foreground-muted")),a(),O(e.getDatePickerState(e.props).displayText),a(),m(e.cn("h-4 w-4 shrink-0",e.getDatePickerState(e.props).hasError?"text-destructive-foreground":"text-foreground-default")),a(),g("d",e.getDatePickerState(e.props).isOpen?e.ICON_PATHS.chevronUp:e.ICON_PATHS.chevronDown)}}function oe(o,d){if(o&1){const e=T();k(0),s(1,"button",18),_("click",function(){const n=f(e).$implicit,p=c(2);return h(p.onGridSelect&&p.onGridSelect.emit(n.value))}),v(2),u(),x()}if(o&2){const e=d.$implicit,t=c(2);a(),m(t.cn("flex h-8 w-full items-center justify-center rounded-md px-3 text-xs transition-colors",e.isSelected?"bg-primary-default font-medium text-primary-foreground shadow-xs":"font-normal text-foreground-default hover:bg-background-muted")),g("aria-pressed",e.isSelected),a(),V(" ",e.label," ")}}function ie(o,d){if(o&1){const e=T();k(0),s(1,"div",12)(2,"button",13),_("click",function(){f(e);const n=c();return h(n.onMonthStep&&n.onMonthStep.emit(-1))}),D(),s(3,"svg",8),P(4,"path",9),u()(),H(),s(5,"button",14),_("click",function(){f(e);const n=c();return h(n.onViewModeChange&&n.onViewModeChange.emit(n.getDatePickerState(n.props).viewMode==="months"?"years":"days"))}),v(6),u(),s(7,"button",15),_("click",function(){f(e);const n=c();return h(n.onMonthStep&&n.onMonthStep.emit(1))}),D(),s(8,"svg",8),P(9,"path",9),u()()(),H(),s(10,"div",16),S(11,oe,3,4,"ng-container",17),u(),x()}if(o&2){const e=c();a(4),g("d",e.ICON_PATHS.chevronLeft),a(2),V(" ",e.getDatePickerState(e.props).gridTitle," "),a(3),g("d",e.ICON_PATHS.chevronRight),a(2),b("ngForOf",e.getDatePickerState(e.props).gridEntries)("ngForTrackBy",e.trackByItem0)}}function se(o,d){if(o&1&&(k(0),s(1,"span",26),v(2),u(),x()),o&2){const e=c().$implicit;a(2),O(e.monthLabel)}}function le(o,d){if(o&1){const e=T();k(0),s(1,"div",27)(2,"button",28),_("click",function(){f(e);const n=c(3);return h(n.onViewModeChange&&n.onViewModeChange.emit("months"))}),s(3,"span"),v(4),u(),D(),s(5,"svg",29),P(6,"path",9),u()(),H(),s(7,"button",30),_("click",function(){f(e);const n=c(3);return h(n.onViewModeChange&&n.onViewModeChange.emit("years"))}),s(8,"span"),v(9),u(),D(),s(10,"svg",29),P(11,"path",9),u()()(),x()}if(o&2){const e=c().$implicit,t=c(2);a(4),O(e.monthShortLabel),a(2),g("d",t.ICON_PATHS.chevronDown),a(3),O(e.yearLabel),a(2),g("d",t.ICON_PATHS.chevronDown)}}function de(o,d){if(o&1&&(k(0),s(1,"span",31),v(2),u(),x()),o&2){const e=d.$implicit;a(2),O(e)}}function ce(o,d){if(o&1){const e=T();k(0),s(1,"span")(2,"button",32),_("mouseenter",function(){const n=f(e).$implicit,p=c(3);return h(p.onHoverDate&&p.onHoverDate.emit({year:n.year,month:n.month,day:n.day}))})("click",function(){const n=f(e).$implicit,p=c(3);return h(p.onSelect&&p.onSelect.emit({year:n.year,month:n.month,day:n.day}))}),v(3),u()(),x()}if(o&2){const e=d.$implicit,t=c(3);a(),m(t.cn("flex h-8 w-8 items-center justify-center",e.isInRange&&"bg-primary-subtle",e.isRangeStart&&"rounded-l-md",e.isRangeEnd&&"rounded-r-md")),a(),m(t.cn("flex h-8 w-8 items-center justify-center rounded-md text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",e.isSelected?"bg-primary-default font-medium text-primary-foreground":e.isInRange?"font-normal text-foreground-default hover:bg-background-muted":e.isToday?"bg-background-muted font-normal text-foreground-default":e.isOutside?"font-normal text-foreground-muted hover:bg-background-muted":"font-normal text-foreground-default hover:bg-background-muted")),g("aria-pressed",e.isSelected),a(),V(" ",e.day," ")}}function ue(o,d){if(o&1){const e=T();k(0),s(1,"div",20)(2,"div",21)(3,"button",22),_("click",function(){f(e);const n=c(2);return h(n.onMonthStep&&n.onMonthStep.emit(-1))}),D(),s(4,"svg",23),P(5,"path",9),u()(),S(6,se,3,1,"ng-container",2)(7,le,12,4,"ng-container",2),H(),s(8,"button",24),_("click",function(){f(e);const n=c(2);return h(n.onMonthStep&&n.onMonthStep.emit(1))}),D(),s(9,"svg",23),P(10,"path",9),u()()(),H(),s(11,"div",25),S(12,de,3,1,"ng-container",17)(13,ce,4,6,"ng-container",17),u()(),x()}if(o&2){const e=d.$implicit,t=c(2);a(3),m(t.cn("inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-default hover:bg-background-muted",!e.showPrev&&"invisible")),a(2),g("d",t.ICON_PATHS.chevronLeft),a(),b("ngIf",t.getDatePickerState(t.props).isRangeMode),a(),b("ngIf",!t.getDatePickerState(t.props).isRangeMode),a(),m(t.cn("inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-default hover:bg-background-muted",!e.showNext&&"invisible")),a(2),g("d",t.ICON_PATHS.chevronRight),a(2),b("ngForOf",t.getDatePickerState(t.props).weekdays)("ngForTrackBy",t.trackByWeekday2),a(),b("ngForOf",e.cells)("ngForTrackBy",t.trackByCell3)}}function pe(o,d){if(o&1&&(k(0),s(1,"div",19),S(2,ue,14,12,"ng-container",17),u(),x()),o&2){const e=c();a(2),b("ngForOf",e.getDatePickerState(e.props).panels)("ngForTrackBy",e.trackByPanel1)}}function ge(o,d){if(o&1&&(k(0),s(1,"span"),v(2),u(),x()),o&2){const e=c();a(),m(e.cn("px-0.5 text-xs",e.getDatePickerState(e.props).hasError?"text-destructive-foreground":"text-foreground-muted")),g("id",e.id+"-hint"),a(),O(e.getDatePickerState(e.props).resolvedHint)}}const l={id:"date-picker",name:"date",mode:"single",editable:!1,open:!1,showLabel:!0,showHint:!1,required:!1,disabled:!1,error:!1,errorMessage:"",validating:!1,viewMode:"",value:0,month:6,year:2025,selectedMonth:0,selectedYear:0,startMonth:0,startYear:0,endValue:9,endMonth:0,endYear:0,hoverValue:0,hoverMonth:0,hoverYear:0,yearGridTitle:"Select Year",inputText:"",label:"",placeholder:"Select a date",hint:"",displayValue:"",className:""},I=class I{constructor(){r(this,"open",l.open);r(this,"showLabel",l.showLabel);r(this,"showHint",l.showHint);r(this,"disabled",l.disabled);r(this,"error",l.error);r(this,"errorMessage",l.errorMessage);r(this,"validating",l.validating);r(this,"viewMode",l.viewMode);r(this,"value",l.value);r(this,"month",l.month);r(this,"year",l.year);r(this,"selectedMonth",l.selectedMonth);r(this,"selectedYear",l.selectedYear);r(this,"startMonth",l.startMonth);r(this,"startYear",l.startYear);r(this,"endValue",l.endValue);r(this,"endMonth",l.endMonth);r(this,"endYear",l.endYear);r(this,"hoverValue",l.hoverValue);r(this,"hoverMonth",l.hoverMonth);r(this,"hoverYear",l.hoverYear);r(this,"yearGridTitle",l.yearGridTitle);r(this,"inputText",l.inputText);r(this,"label",l.label);r(this,"hint",l.hint);r(this,"displayValue",l.displayValue);r(this,"onValueChange");r(this,"cn",W);r(this,"cva",J);r(this,"getDatePickerState",U);r(this,"ICON_PATHS",K);r(this,"bindControllerProps",Q);r(this,"className",l.className);r(this,"editable",l.editable);r(this,"mode",l.mode);r(this,"required",l.required);r(this,"id",l.id);r(this,"name",l.name);r(this,"placeholder",l.placeholder);r(this,"onOpenChange",new y);r(this,"onInputChange",new y);r(this,"onBlur",new y);r(this,"onHoverDate",new y);r(this,"onMonthStep",new y);r(this,"onViewModeChange",new y);r(this,"onGridSelect",new y);r(this,"onSelect",new y)}get props(){return this}trackByItem0(d,e){return e.key}trackByPanel1(d,e){return e.key}trackByWeekday2(d,e){return e}trackByCell3(d,e){return e.key}};r(I,"ɵfac",function(e){return new(e||I)}),r(I,"ɵcmp",Y({type:I,selectors:[["kd-date-picker"],["date-picker"]],inputs:{open:"open",showLabel:"showLabel",showHint:"showHint",disabled:"disabled",error:"error",errorMessage:"errorMessage",validating:"validating",viewMode:"viewMode",value:"value",month:"month",year:"year",selectedMonth:"selectedMonth",selectedYear:"selectedYear",startMonth:"startMonth",startYear:"startYear",endValue:"endValue",endMonth:"endMonth",endYear:"endYear",hoverValue:"hoverValue",hoverMonth:"hoverMonth",hoverYear:"hoverYear",yearGridTitle:"yearGridTitle",inputText:"inputText",label:"label",hint:"hint",displayValue:"displayValue",onValueChange:"onValueChange",className:"className",editable:"editable",mode:"mode",required:"required",id:"id",name:"name",placeholder:"placeholder"},outputs:{onOpenChange:"onOpenChange",onInputChange:"onInputChange",onBlur:"onBlur",onHoverDate:"onHoverDate",onMonthStep:"onMonthStep",onViewModeChange:"onViewModeChange",onGridSelect:"onGridSelect",onSelect:"onSelect"},standalone:!1,decls:10,vars:15,consts:[[3,"keydown"],[1,"relative","inline-flex","flex-col","items-start"],[4,"ngIf"],["role","dialog",3,"mouseleave"],[1,"flex","items-center","gap-1","px-0.5","text-sm","font-medium","text-foreground-default"],["aria-hidden","true",1,"text-destructive-default"],["type","text",1,"w-full","bg-transparent","text-sm","text-foreground-default","focus:outline-none","disabled:cursor-not-allowed",3,"input","blur"],["type","button","aria-label","Toggle calendar",3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-3.5","w-3.5"],["stroke-linecap","round","stroke-linejoin","round"],["type","button","aria-haspopup","dialog",3,"click","blur"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5"],[1,"flex","w-full","items-center","justify-between","gap-2"],["type","button","aria-label","Previous",1,"inline-flex","h-6","w-6","items-center","justify-center","rounded-md","text-foreground-muted","hover:bg-background-muted","hover:text-foreground-default",3,"click"],["type","button",1,"text-xs","font-medium","text-foreground-default","hover:underline",3,"click"],["type","button","aria-label","Next",1,"inline-flex","h-6","w-6","items-center","justify-center","rounded-md","text-foreground-muted","hover:bg-background-muted","hover:text-foreground-default",3,"click"],[1,"grid","grid-cols-3","gap-x-1.5","gap-y-2.5","rounded-lg","border","border-border-subtle","bg-background-default","p-2","shadow-xs"],[4,"ngFor","ngForOf","ngForTrackBy"],["type","button",3,"click"],[1,"flex","flex-col","gap-4","sm:flex-row"],[1,"flex","w-[224px]","flex-col","gap-3"],[1,"flex","h-8","w-full","items-center","justify-between","gap-1.5"],["type","button","aria-label","Previous month",3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-4","w-4"],["type","button","aria-label","Next month",3,"click"],[1,"grid","grid-cols-7","gap-y-1.5"],[1,"text-sm","font-medium","text-foreground-default"],[1,"flex","items-center","gap-1.5"],["type","button","aria-label","Select month",1,"inline-flex","h-8","items-center","gap-1.5","rounded-lg","border","border-border-default","bg-background-default","px-2.5","text-xs","font-medium","text-foreground-default","shadow-xs","hover:bg-background-muted",3,"click"],["aria-hidden","true","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","1.5",1,"h-3.5","w-3.5","text-foreground-default"],["type","button","aria-label","Select year",1,"inline-flex","h-8","items-center","gap-1.5","rounded-lg","border","border-border-default","bg-background-default","px-2.5","text-xs","font-medium","text-foreground-default","shadow-xs","hover:bg-background-muted",3,"click"],[1,"flex","h-5","w-8","items-center","justify-center","text-xs","font-normal","text-foreground-muted"],["type","button",3,"mouseenter","click"]],template:function(e,t){e&1&&(s(0,"div",0),_("keydown",function(p){return p.key==="Escape"&&t.getDatePickerState(t.props).isOpen&&t.onOpenChange&&t.onOpenChange.emit(!1)}),s(1,"div",1)(2,"div"),S(3,ne,4,2,"ng-container",2)(4,re,6,15,"ng-container",2)(5,ae,6,14,"ng-container",2),u(),s(6,"div",3),_("mouseleave",function(){return t.onHoverDate&&t.onHoverDate.emit({year:0,month:0,day:0})}),S(7,ie,12,5,"ng-container",2)(8,pe,3,2,"ng-container",2),u()(),S(9,ge,3,4,"ng-container",2),u()),e&2&&(m(t.cn("relative inline-flex flex-col items-start gap-2",t.className)),g("data-ctrl",typeof t.bindControllerProps),a(2),m(t.cn("flex flex-col items-start gap-2",t.editable?"w-60":t.cva(t.mode,F(14,ee),"w-48"))),a(),b("ngIf",t.getDatePickerState(t.props).hasLabel),a(),b("ngIf",t.getDatePickerState(t.props).isInputMode),a(),b("ngIf",!t.getDatePickerState(t.props).isInputMode),a(),m(t.cn("absolute left-0 top-full z-50 mt-2 flex flex-col gap-3 rounded-xl border border-border-default bg-background-default p-3 shadow-md",t.getDatePickerState(t.props).isGridMode?"w-[287px]":t.getDatePickerState(t.props).isRangeMode?"w-max":"w-[250px]",t.getDatePickerState(t.props).isOpen?"flex":"hidden")),g("aria-label",t.getDatePickerState(t.props).resolvedLabel||"Calendar"),a(),b("ngIf",t.getDatePickerState(t.props).isGridMode),a(),b("ngIf",!t.getDatePickerState(t.props).isGridMode),a(),b("ngIf",t.getDatePickerState(t.props).showHintText))},dependencies:[X,Z],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let M=I;(typeof ngDevMode>"u"||ngDevMode)&&j(M,[{type:R,args:[{standalone:!1,selector:"kd-date-picker, date-picker",template:`
    <div
      [attr.data-ctrl]="typeof bindControllerProps"
      [class]="cn('relative inline-flex flex-col items-start gap-2', className)"
      (keydown)="$event.key === 'Escape' && getDatePickerState(props).isOpen && onOpenChange && this.onOpenChange.emit(false)"
    >
      <div class="relative inline-flex flex-col items-start">
        <div
          [class]="cn('flex flex-col items-start gap-2', editable ? 'w-60' : cva(mode, {
          single: 'w-48',
          range: 'w-60',
          month: 'w-48',
          year: 'w-48'
        }, 'w-48'))"
        >
          <ng-container *ngIf="getDatePickerState(props).hasLabel"
            ><span
              class="flex items-center gap-1 px-0.5 text-sm font-medium text-foreground-default"
              >{{getDatePickerState(props).resolvedLabel}}
              <ng-container *ngIf="required"
                ><span aria-hidden="true" class="text-destructive-default"
                  >*</span
                ></ng-container
              ></span
            ></ng-container
          >
          <ng-container *ngIf="getDatePickerState(props).isInputMode"
            ><div
              [class]="cn('flex h-9 w-full items-center justify-between gap-2 rounded-lg border py-1 pl-3 pr-1.5 shadow-xs transition-colors', getDatePickerState(props).isDisabled ? 'cursor-not-allowed border-border-default bg-background-muted opacity-50' : getDatePickerState(props).hasError ? 'border-destructive-border bg-input-default ring-2 ring-focus-ring-error' : 'border-border-default bg-input-default focus-within:ring-2 focus-within:ring-focus-ring-primary')"
            >
              <input
                type="text"
                class="w-full bg-transparent text-sm text-foreground-default focus:outline-none disabled:cursor-not-allowed"
                [attr.id]="id"
                [attr.name]="name"
                [attr.disabled]="(getDatePickerState(props).isDisabled) ? '' : null"
                [attr.aria-invalid]="getDatePickerState(props).hasError"
                [attr.aria-describedby]="getDatePickerState(props).showHintText ? id + '-hint' : undefined"
                [attr.aria-label]="getDatePickerState(props).resolvedLabel"
                [attr.value]="getDatePickerState(props).inputText"
                [attr.placeholder]="placeholder"
                (input)="!getDatePickerState(props).isDisabled && onInputChange && this.onInputChange.emit($any($event.target).value)"
                (blur)="!getDatePickerState(props).isOpen && onBlur && this.onBlur.emit($event)"
              />
              <button
                type="button"
                aria-label="Toggle calendar"
                [attr.disabled]="(getDatePickerState(props).isDisabled) ? '' : null"
                [attr.aria-expanded]="getDatePickerState(props).isOpen"
                [class]="cn('inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md hover:bg-background-muted disabled:cursor-not-allowed', getDatePickerState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-default')"
                (click)="!getDatePickerState(props).isDisabled && onOpenChange && this.onOpenChange.emit(!getDatePickerState(props).isOpen)"
              >
                <svg
                  aria-hidden="true"
                  class="h-3.5 w-3.5"
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
              </button></div
          ></ng-container>
          <ng-container *ngIf="!getDatePickerState(props).isInputMode"
            ><button
              type="button"
              aria-haspopup="dialog"
              [attr.id]="id"
              [attr.name]="name"
              [attr.disabled]="(getDatePickerState(props).isDisabled) ? '' : null"
              [attr.aria-expanded]="getDatePickerState(props).isOpen"
              [attr.aria-invalid]="getDatePickerState(props).hasError"
              [attr.aria-describedby]="getDatePickerState(props).showHintText ? id + '-hint' : undefined"
              [class]="cn('flex h-9 w-full items-center justify-between gap-2 rounded-lg border px-3 py-1 text-left shadow-xs transition-colors focus:outline-none', getDatePickerState(props).isDisabled ? 'cursor-not-allowed border-border-default bg-background-muted opacity-50' : getDatePickerState(props).hasError ? 'border-destructive-border bg-input-default ring-2 ring-focus-ring-error' : 'border-border-default bg-input-default hover:bg-background-subtle focus-visible:ring-2 focus-visible:ring-focus-ring-primary')"
              (click)="!getDatePickerState(props).isDisabled && onOpenChange && this.onOpenChange.emit(!getDatePickerState(props).isOpen)"
              (blur)="!getDatePickerState(props).isOpen && onBlur && this.onBlur.emit($event)"
            >
              <span
                [class]="cn('truncate text-sm', getDatePickerState(props).hasValue ? 'text-foreground-default' : 'text-foreground-muted')"
                >{{getDatePickerState(props).displayText}}</span
              >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                [class]="cn('h-4 w-4 shrink-0', getDatePickerState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-default')"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  [attr.d]="getDatePickerState(props).isOpen ? ICON_PATHS.chevronUp : ICON_PATHS.chevronDown"
                ></path>
              </svg></button
          ></ng-container>
        </div>
        <div
          role="dialog"
          [attr.aria-label]="getDatePickerState(props).resolvedLabel || 'Calendar'"
          [class]="cn('absolute left-0 top-full z-50 mt-2 flex flex-col gap-3 rounded-xl border border-border-default bg-background-default p-3 shadow-md', getDatePickerState(props).isGridMode ? 'w-[287px]' : getDatePickerState(props).isRangeMode ? 'w-max' : 'w-[250px]', getDatePickerState(props).isOpen ? 'flex' : 'hidden')"
          (mouseleave)="onHoverDate && this.onHoverDate.emit({
          year: 0,
          month: 0,
          day: 0
        })"
        >
          <ng-container *ngIf="getDatePickerState(props).isGridMode"
            ><div class="flex w-full items-center justify-between gap-2">
              <button
                type="button"
                aria-label="Previous"
                class="inline-flex h-6 w-6 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted hover:text-foreground-default"
                (click)="onMonthStep && this.onMonthStep.emit(-1)"
              >
                <svg
                  aria-hidden="true"
                  class="h-3.5 w-3.5"
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
              <button
                type="button"
                class="text-xs font-medium text-foreground-default hover:underline"
                (click)="onViewModeChange && this.onViewModeChange.emit(getDatePickerState(props).viewMode === 'months' ? 'years' : 'days')"
              >
                {{getDatePickerState(props).gridTitle}}
              </button>
              <button
                type="button"
                aria-label="Next"
                class="inline-flex h-6 w-6 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted hover:text-foreground-default"
                (click)="onMonthStep && this.onMonthStep.emit(1)"
              >
                <svg
                  aria-hidden="true"
                  class="h-3.5 w-3.5"
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
            <div
              class="grid grid-cols-3 gap-x-1.5 gap-y-2.5 rounded-lg border border-border-subtle bg-background-default p-2 shadow-xs"
            >
              <ng-container
                *ngFor="let item of getDatePickerState(props).gridEntries; trackBy: trackByItem0"
                ><button
                  type="button"
                  [attr.aria-pressed]="item.isSelected"
                  [class]="cn('flex h-8 w-full items-center justify-center rounded-md px-3 text-xs transition-colors', item.isSelected ? 'bg-primary-default font-medium text-primary-foreground shadow-xs' : 'font-normal text-foreground-default hover:bg-background-muted')"
                  (click)="onGridSelect && this.onGridSelect.emit(item.value)"
                >
                  {{item.label}}
                </button></ng-container
              >
            </div></ng-container
          >
          <ng-container *ngIf="!getDatePickerState(props).isGridMode"
            ><div class="flex flex-col gap-4 sm:flex-row">
              <ng-container
                *ngFor="let panel of getDatePickerState(props).panels; trackBy: trackByPanel1"
                ><div class="flex w-[224px] flex-col gap-3">
                  <div
                    class="flex h-8 w-full items-center justify-between gap-1.5"
                  >
                    <button
                      type="button"
                      aria-label="Previous month"
                      [class]="cn('inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-default hover:bg-background-muted', !panel.showPrev && 'invisible')"
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
                    <ng-container *ngIf="getDatePickerState(props).isRangeMode"
                      ><span
                        class="text-sm font-medium text-foreground-default"
                        >{{panel.monthLabel}}</span
                      ></ng-container
                    >
                    <ng-container *ngIf="!getDatePickerState(props).isRangeMode"
                      ><div class="flex items-center gap-1.5">
                        <button
                          type="button"
                          aria-label="Select month"
                          class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-default bg-background-default px-2.5 text-xs font-medium text-foreground-default shadow-xs hover:bg-background-muted"
                          (click)="onViewModeChange && this.onViewModeChange.emit('months')"
                        >
                          <span>{{panel.monthShortLabel}}</span>
                          <svg
                            aria-hidden="true"
                            class="h-3.5 w-3.5 text-foreground-default"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              [attr.d]="ICON_PATHS.chevronDown"
                            ></path>
                          </svg>
                        </button>
                        <button
                          type="button"
                          aria-label="Select year"
                          class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-default bg-background-default px-2.5 text-xs font-medium text-foreground-default shadow-xs hover:bg-background-muted"
                          (click)="onViewModeChange && this.onViewModeChange.emit('years')"
                        >
                          <span>{{panel.yearLabel}}</span>
                          <svg
                            aria-hidden="true"
                            class="h-3.5 w-3.5 text-foreground-default"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              [attr.d]="ICON_PATHS.chevronDown"
                            ></path>
                          </svg>
                        </button></div
                    ></ng-container>
                    <button
                      type="button"
                      aria-label="Next month"
                      [class]="cn('inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-default hover:bg-background-muted', !panel.showNext && 'invisible')"
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
                  <div class="grid grid-cols-7 gap-y-1.5">
                    <ng-container
                      *ngFor="let weekday of getDatePickerState(props).weekdays; trackBy: trackByWeekday2"
                      ><span
                        class="flex h-5 w-8 items-center justify-center text-xs font-normal text-foreground-muted"
                        >{{weekday}}</span
                      ></ng-container
                    >
                    <ng-container
                      *ngFor="let cell of panel.cells; trackBy: trackByCell3"
                      ><span
                        [class]="cn('flex h-8 w-8 items-center justify-center', cell.isInRange && 'bg-primary-subtle', cell.isRangeStart && 'rounded-l-md', cell.isRangeEnd && 'rounded-r-md')"
                        ><button
                          type="button"
                          [attr.aria-pressed]="cell.isSelected"
                          [class]="cn('flex h-8 w-8 items-center justify-center rounded-md text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary', cell.isSelected ? 'bg-primary-default font-medium text-primary-foreground' : cell.isInRange ? 'font-normal text-foreground-default hover:bg-background-muted' : cell.isToday ? 'bg-background-muted font-normal text-foreground-default' : cell.isOutside ? 'font-normal text-foreground-muted hover:bg-background-muted' : 'font-normal text-foreground-default hover:bg-background-muted')"
                          (mouseenter)="onHoverDate && this.onHoverDate.emit({
          year: cell.year,
          month: cell.month,
          day: cell.day
        })"
                          (click)="onSelect && this.onSelect.emit({
          year: cell.year,
          month: cell.month,
          day: cell.day
        })"
                        >
                          {{cell.day}}
                        </button></span
                      ></ng-container
                    >
                  </div>
                </div></ng-container
              >
            </div></ng-container
          >
        </div>
      </div>
      <ng-container *ngIf="getDatePickerState(props).showHintText"
        ><span
          [attr.id]="id + '-hint'"
          [class]="cn('px-0.5 text-xs', getDatePickerState(props).hasError ? 'text-destructive-foreground' : 'text-foreground-muted')"
          >{{getDatePickerState(props).resolvedHint}}</span
        ></ng-container
      >
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{open:[{type:i}],showLabel:[{type:i}],showHint:[{type:i}],disabled:[{type:i}],error:[{type:i}],errorMessage:[{type:i}],validating:[{type:i}],viewMode:[{type:i}],value:[{type:i}],month:[{type:i}],year:[{type:i}],selectedMonth:[{type:i}],selectedYear:[{type:i}],startMonth:[{type:i}],startYear:[{type:i}],endValue:[{type:i}],endMonth:[{type:i}],endYear:[{type:i}],hoverValue:[{type:i}],hoverMonth:[{type:i}],hoverYear:[{type:i}],yearGridTitle:[{type:i}],inputText:[{type:i}],label:[{type:i}],hint:[{type:i}],displayValue:[{type:i}],onValueChange:[{type:i}],className:[{type:i}],editable:[{type:i}],mode:[{type:i}],required:[{type:i}],id:[{type:i}],name:[{type:i}],placeholder:[{type:i}],onOpenChange:[{type:w}],onInputChange:[{type:w}],onBlur:[{type:w}],onHoverDate:[{type:w}],onMonthStep:[{type:w}],onViewModeChange:[{type:w}],onGridSelect:[{type:w}],onSelect:[{type:w}]});(typeof ngDevMode>"u"||ngDevMode)&&$(M,{className:"DatePicker",filePath:"DatePicker.ts",lineNumber:444});const C=class C{};r(C,"ɵfac",function(e){return new(e||C)}),r(C,"ɵmod",G({type:C})),r(C,"ɵinj",A({imports:[N]}));let B=C;(typeof ngDevMode>"u"||ngDevMode)&&j(B,[{type:q,args:[{declarations:[M],imports:[N],exports:[M]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&z(B,{declarations:[M],imports:[N],exports:[M]})})();export{B as DatePickerModule,M as default};

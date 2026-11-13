var k=Object.defineProperty;var N=(e,o,t)=>o in e?k(e,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[o]=t;var n=(e,o,t)=>N(e,typeof o!="symbol"?o+"":o,t);import{ɵ as D,a as S,b as j,c as M,j as d,d as _,p as f,q as T,t as i,v as L,u as A,e as p,s as I,I as c,C as E,f as B,N as O,g as V,i as u,r as y,m,o as w,x as b,h as P,k as F,l as J,n as q,y as z,z as G,A as H}from"./core.vpEFnhB-.js";import{a as K}from"./theme.CMj9otVT.js";import{C,N as Q,a as R}from"./common_module-chunk.B8w5oXjf.js";import"./framework.CbUgrr79.js";const U=["*",[["","icon",""],["","slot","icon"]]],W=["*","[icon],[slot=icon]"];function X(e,o){e&1&&H(0)}function Y(e,o){if(e&1&&(u(0),_(1,X,1,0,"ng-container",4),y()),e&2){const t=m(2);i(),p("ngComponentOutlet",t.icon)}}function Z(e,o){e&1&&(u(0),z(),d(1,"svg",5),G(2,"circle",6)(3,"path",7),f(),y())}function $(e,o){if(e&1&&(u(0),d(1,"div",3),_(2,Y,2,1,"ng-container",1),T(3,1),_(4,Z,4,0,"ng-container",1),f(),y()),e&2){const t=m();i(2),p("ngIf",t.icon),i(2),p("ngIf",!t.icon)}}function ee(e,o){if(e&1&&(u(0),d(1,"p",8),w(2),f(),y()),e&2){const t=m();i(2),b(" ",t.title," ")}}function te(e,o){if(e&1&&(u(0),d(1,"p",9),w(2),f(),y()),e&2){const t=m();i(2),b(" ",t.description," ")}}function ne(e,o){if(e&1){const t=P();u(0),d(1,"button",10),F("click",function(){var v;J(t);const h=m();return q((v=h.onCtaClick)==null?void 0:v.call(h))}),w(2),f(),y()}if(e&2){const t=m();i(2),b(" ",t.ctaLabel," ")}}const s={title:"",description:"",ctaLabel:"",showIcon:!0,showTitle:!0,showDescription:!0,showCTA:!1,colSpan:5,className:""},g=class g{constructor(){n(this,"Boolean",Boolean);n(this,"cn",K);n(this,"colSpan",s.colSpan);n(this,"className",s.className);n(this,"showIcon",s.showIcon);n(this,"icon");n(this,"showTitle",s.showTitle);n(this,"title",s.title);n(this,"showDescription",s.showDescription);n(this,"description",s.description);n(this,"showCTA",s.showCTA);n(this,"ctaLabel",s.ctaLabel);n(this,"onCtaClick")}};n(g,"ɵfac",function(t){return new(t||g)}),n(g,"ɵcmp",D({type:g,selectors:[["kd-table-empty"],["table-empty"]],inputs:{colSpan:"colSpan",className:"className",showIcon:"showIcon",icon:"icon",showTitle:"showTitle",title:"title",showDescription:"showDescription",description:"description",showCTA:"showCTA",ctaLabel:"ctaLabel",onCtaClick:"onCtaClick"},standalone:!1,ngContentSelectors:W,decls:9,vars:7,consts:[[1,"p-0"],[4,"ngIf"],[1,"flex","flex-col","items-center","justify-center","gap-2"],[1,"flex","h-16","w-16","flex-col","items-center","justify-center","rounded-full","bg-background-muted","text-foreground-muted"],[4,"ngComponentOutlet"],["viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","aria-hidden","true",1,"h-6","w-6"],["cx","11","cy","11","r","8"],["d","m21 21-4.3-4.3"],[1,"text-center","text-base","font-semibold","text-foreground-default"],[1,"text-center","text-sm","font-normal","text-foreground-muted"],["type","button",1,"flex","cursor-pointer","flex-row","items-center","justify-center","gap-2","rounded-lg","bg-primary-default","px-4","py-2","text-center","text-sm","font-medium","text-primary-foreground","select-none","transition-all","duration-150","hover:bg-primary-hover","active:bg-primary-pressed","active:scale-[0.97]",3,"click"]],template:function(t,a){t&1&&(M(U),d(0,"tr")(1,"td",0)(2,"div"),_(3,$,5,2,"ng-container",1),d(4,"div",2),_(5,ee,3,1,"ng-container",1)(6,te,3,1,"ng-container",1),f(),_(7,ne,3,1,"ng-container",1),T(8),f()()()),t&2&&(i(),L("colSpan",a.colSpan),i(),A(a.cn("flex flex-col items-center justify-center gap-4 rounded-lg px-8 py-10",a.className)),i(),p("ngIf",a.showIcon||a.Boolean(a.icon)),i(2),p("ngIf",a.showTitle&&a.title),i(),p("ngIf",a.showDescription&&a.description),i(),p("ngIf",a.showCTA&&a.ctaLabel))},dependencies:[Q,R],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let r=g;(typeof ngDevMode>"u"||ngDevMode)&&I(r,[{type:E,args:[{standalone:!1,selector:"kd-table-empty, table-empty",template:`
    <tr>
      <td class="p-0" [attr.colSpan]="colSpan">
        <div
          [class]="cn('flex flex-col items-center justify-center gap-4 rounded-lg px-8 py-10', className)"
        >
          <ng-container *ngIf="showIcon || Boolean(icon)"
            ><div
              class="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-background-muted text-foreground-muted"
            >
              <ng-container *ngIf="icon"><ng-container *ngComponentOutlet="icon"></ng-container></ng-container><ng-content select="[icon],[slot=icon]"></ng-content>
              <ng-container *ngIf="!icon"
                ><svg
                  class="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path></svg
              ></ng-container></div
          ></ng-container>
          <div class="flex flex-col items-center justify-center gap-2">
            <ng-container *ngIf="showTitle && title"
              ><p
                class="text-center text-base font-semibold text-foreground-default"
              >
                {{title}}
              </p></ng-container
            >
            <ng-container *ngIf="showDescription && description"
              ><p class="text-center text-sm font-normal text-foreground-muted">
                {{description}}
              </p></ng-container
            >
          </div>
          <ng-container *ngIf="showCTA && ctaLabel"
            ><button
              type="button"
              class="flex cursor-pointer flex-row items-center justify-center gap-2 rounded-lg bg-primary-default px-4 py-2 text-center text-sm font-medium text-primary-foreground select-none transition-all duration-150 hover:bg-primary-hover active:bg-primary-pressed active:scale-[0.97]"
              (click)="onCtaClick?.()"
            >
              {{ctaLabel}}
            </button></ng-container
          >
          <ng-content></ng-content>
        </div>
      </td>
    </tr>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,{colSpan:[{type:c}],className:[{type:c}],showIcon:[{type:c}],icon:[{type:c}],showTitle:[{type:c}],title:[{type:c}],showDescription:[{type:c}],description:[{type:c}],showCTA:[{type:c}],ctaLabel:[{type:c}],onCtaClick:[{type:c}]});(typeof ngDevMode>"u"||ngDevMode)&&B(r,{className:"TableEmpty",filePath:"TableEmpty.ts",lineNumber:95});const l=class l{};n(l,"ɵfac",function(t){return new(t||l)}),n(l,"ɵmod",S({type:l})),n(l,"ɵinj",j({imports:[C]}));let x=l;(typeof ngDevMode>"u"||ngDevMode)&&I(x,[{type:O,args:[{declarations:[r],imports:[C],exports:[r]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&V(x,{declarations:[r],imports:[C],exports:[r]})})();export{x as TableEmptyModule,r as default};

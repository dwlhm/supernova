var D=Object.defineProperty;var S=(n,e,t)=>e in n?D(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var s=(n,e,t)=>S(n,typeof e!="symbol"?e+"":e,t);import{ɵ as j,a as B,b as N,j as d,o as c,p as o,k as f,d as h,t as l,x as q,e as p,s as w,C as F,f as E,N as O,g as A,h as T,i as _,l as v,m as C,n as I,r as x}from"./core.vpEFnhB-.js";import K,{ToastModule as k}from"./Toast.DTWpeuCk.js";import V,{ToastViewportModule as y}from"./ToastViewport.H4yy0wMN.js";import{C as b,b as P,a as R}from"./common_module-chunk.B8w5oXjf.js";import"./theme.CMj9otVT.js";import"./framework.CbUgrr79.js";function G(n,e){if(n&1){const t=T();_(0),d(1,"button",9),f("click",function(){v(t);const m=C();return I(m.items=[])}),c(2," Clear "),o(),x()}}function J(n,e){n&1&&(_(0),d(1,"div",10),c(2," Tidak ada toast aktif. Klik tombol di atas untuk memicu notifikasi. "),o(),x())}function $(n,e){if(n&1){const t=T();_(0),d(1,"kd-toast",11),f("close",function(){const m=v(t).$implicit,M=C();return I(M.removeItem(m.id))}),o(),x()}if(n&2){const t=e.$implicit;l(),p("id",t.id)("open",!0)("type",t.type==="success"?"success":t.type==="error"?"error":t.type==="warning"?"warning":t.type==="info"?"info":"default")("title",t.title)("description",t.description)("showDescription",!0)("showClose",!0)("timestamp",t.timestamp)("showTimestamp",!0)("duration",t.duration)("draggable",!0)("swipeThreshold",72)}}const u=class u{constructor(){s(this,"seq",4);s(this,"items",[{id:"t-1",type:"success",title:"Manifest ORD-401 Tersinkronisasi",description:"Geser kartu ke samping (drag) atau tunggu 5 detik untuk auto-dismiss.",duration:5e3,timestamp:"Baru saja"},{id:"t-2",type:"info",title:"Kurir Menuju Gudang Sortir",description:"Toast persistent (duration=0) tetap aktif hingga di-dismiss.",duration:0,timestamp:"1m lalu"},{id:"t-3",type:"warning",title:"Kapasitas Rak Hampir Penuh",description:'Klik "+ Burst 4 Toast" di atas untuk menguji scroll daftar aktif.',duration:0,timestamp:"2m lalu"}])}removeItem(e){this.items=this.items.filter(t=>t.id!==e)}addTimed(){this.seq=this.seq+1,this.items=[{id:"t-"+String(this.seq),type:"success",title:"Auto-Dismiss ORD-"+String(this.seq)+" (3.5s)",description:"Akan tertutup sendiri dalam 3.5 detik (jeda saat hover/drag).",duration:3500,timestamp:"3.5s"},...this.items]}burstScrollable(){const e=["info","success","warning","error"],t=[0,1,2,3].map(i=>(this.seq=this.seq+1,{id:"t-"+String(this.seq),type:e[i]||"info",title:"Antrean Paket ORD-"+String(this.seq),description:"Scroll daftar aktif atau drag mouse ke kanan/kiri untuk dismiss.",duration:i%2===0?6e3:0,timestamp:i%2===0?"6s":"Tetap"}));this.items=[...t,...this.items]}trackByItem0(e,t){return t.id}};s(u,"ɵfac",function(t){return new(t||u)}),s(u,"ɵcmp",j({type:u,selectors:[["kd-toast-example"],["toast-example"]],standalone:!1,decls:13,vars:8,consts:[[1,"flex","w-full","flex-col","gap-3"],[1,"flex","flex-wrap","items-center","justify-between","gap-2"],[1,"text-xs","font-medium","text-foreground-muted"],[1,"flex","flex-wrap","items-center","gap-1.5"],["type","button",1,"cursor-pointer","rounded-md","bg-primary-default","px-2.5","py-1","text-xs","font-medium","text-primary-foreground","hover:bg-primary-hover",3,"click"],["type","button",1,"cursor-pointer","rounded-md","border","border-border-default","bg-background-default","px-2.5","py-1","text-xs","font-medium","text-foreground-default","hover:bg-background-muted",3,"click"],[4,"ngIf"],["placement","top-right","className","max-h-60 max-w-none",3,"inline","expanded","scrollable"],[4,"ngFor","ngForOf","ngForTrackBy"],["type","button",1,"cursor-pointer","rounded-md","px-2","py-1","text-xs","font-medium","text-foreground-muted","hover:bg-background-muted","hover:text-foreground-default",3,"click"],[1,"flex","w-full","items-center","justify-center","py-8","text-xs","text-foreground-muted"],["placement","inline",3,"close","id","open","type","title","description","showDescription","showClose","timestamp","showTimestamp","duration","draggable","swipeThreshold"]],template:function(t,i){t&1&&(d(0,"div",0)(1,"div",1)(2,"span",2),c(3),o(),d(4,"div",3)(5,"button",4),f("click",function(){return i.addTimed()}),c(6," + Timed (3.5s) "),o(),d(7,"button",5),f("click",function(){return i.burstScrollable()}),c(8," + Burst 4 Toast "),o(),h(9,G,3,0,"ng-container",6),o()(),d(10,"kd-toast-viewport",7),h(11,J,3,0,"ng-container",6)(12,$,2,12,"ng-container",8),o()()),t&2&&(l(3),q("Aktif: ",i.items.length," toast (scroll & drag mouse untuk dismiss)"),l(6),p("ngIf",i.items.length>0),l(),p("inline",!0)("expanded",!0)("scrollable",!0),l(),p("ngIf",i.items.length===0),l(),p("ngForOf",i.items)("ngForTrackBy",i.trackByItem0))},dependencies:[P,R,V,K],styles:[`[_nghost-%COMP%] {
        display: contents;
      }`]}));let r=u;(typeof ngDevMode>"u"||ngDevMode)&&w(r,[{type:F,args:[{standalone:!1,selector:"kd-toast-example, toast-example",template:`
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xs font-medium text-foreground-muted"
          >Aktif: {{items.length}} toast (scroll &amp; drag mouse untuk
          dismiss)</span
        >
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            class="cursor-pointer rounded-md bg-primary-default px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary-hover"
            (click)="addTimed()"
          >
            + Timed (3.5s)
          </button>
          <button
            type="button"
            class="cursor-pointer rounded-md border border-border-default bg-background-default px-2.5 py-1 text-xs font-medium text-foreground-default hover:bg-background-muted"
            (click)="burstScrollable()"
          >
            + Burst 4 Toast
          </button>
          <ng-container *ngIf="items.length > 0"
            ><button
              type="button"
              class="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-foreground-muted hover:bg-background-muted hover:text-foreground-default"
              (click)="
          items = [];
        "
            >
              Clear
            </button></ng-container
          >
        </div>
      </div>
      <kd-toast-viewport
        placement="top-right"
        className="max-h-60 max-w-none"
        [inline]="true"
        [expanded]="true"
        [scrollable]="true"
        ><ng-container *ngIf="items.length === 0"
          ><div
            class="flex w-full items-center justify-center py-8 text-xs text-foreground-muted"
          >
            Tidak ada toast aktif. Klik tombol di atas untuk memicu notifikasi.
          </div></ng-container
        >
        <ng-container *ngFor="let item of items; trackBy: trackByItem0"
          ><kd-toast
            placement="inline"
            [id]="item.id"
            [open]="true"
            [type]="item.type === 'success' ? 'success' : item.type === 'error' ? 'error' : item.type === 'warning' ? 'warning' : item.type === 'info' ? 'info' : 'default'"
            [title]="item.title"
            [description]="item.description"
            [showDescription]="true"
            [showClose]="true"
            [timestamp]="item.timestamp"
            [showTimestamp]="true"
            [duration]="item.duration"
            [draggable]="true"
            [swipeThreshold]="72"
            (close)="removeItem(item.id)"
          ></kd-toast></ng-container
      ></kd-toast-viewport>
    </div>
  `,styles:[`
      :host {
        display: contents;
      }
    `]}]}],null,null);(typeof ngDevMode>"u"||ngDevMode)&&E(r,{className:"ToastExample",filePath:"ToastExample.ts",lineNumber:96});const a=class a{};s(a,"ɵfac",function(t){return new(t||a)}),s(a,"ɵmod",B({type:a})),s(a,"ɵinj",N({imports:[b,y,k]}));let g=a;(typeof ngDevMode>"u"||ngDevMode)&&w(g,[{type:O,args:[{declarations:[r],imports:[b,y,k],exports:[r]}]}],null,null);(function(){(typeof ngJitMode>"u"||ngJitMode)&&A(g,{declarations:[r],imports:[b,y,k],exports:[r]})})();export{g as ToastExampleModule,r as default};

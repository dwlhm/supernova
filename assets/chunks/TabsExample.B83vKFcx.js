import r from"./Tabs.C-QwYX2b.js";import v from"./TabItem.B3n7beUq.js";import"./theme.CMj9otVT.js";import"./framework.CbUgrr79.js";const i={name:"tabs-example",components:{Tabs:r,TabItem:v},data(){return{activeTab:"overview"}}};var n=function(){var t=this,e=t._self._c;return e("Tabs",{attrs:{ariaLabel:"Account sections"}},[e("TabItem",{attrs:{active:t.activeTab==="overview",onClick:a=>{t.activeTab="overview"}}},[t._v(`
    Overview `)]),e("TabItem",{attrs:{active:t.activeTab==="activity",onClick:a=>{t.activeTab="activity"}}},[t._v(`
    Activity `)]),e("TabItem",{attrs:{active:t.activeTab==="settings",onClick:a=>{t.activeTab="settings"}}},[t._v(`
    Settings
  `)])],1)},c=[];i.render=n;i.staticRenderFns=c;export{i as default};

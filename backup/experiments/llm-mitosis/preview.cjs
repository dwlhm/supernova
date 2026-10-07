const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const ROOT = __dirname;
const REPO = path.resolve(ROOT, '../..');
const targets = ['react', 'vue', 'vue2', 'svelte'];
async function build() {
  const { build: viteBuild } = require('vite');
  for (const target of targets) {
    const dir = path.join(ROOT, 'preview', target);
    fs.mkdirSync(dir, {recursive:true});
    const extension = target === 'react' ? 'tsx' : target === 'svelte' ? 'svelte' : 'vue';
    let entry = `import App from '../../generated/${target}/ExperimentDemo.${extension}';\nimport '../../context/tokens.css';\nimport '../style.css';\n`;
    const plugins = [];
    const alias = [];
    if (target === 'react') {
      entry += `import React from 'react'; import { createRoot } from 'react-dom/client'; createRoot(document.getElementById('app')).render(React.createElement(App));`;
      alias.push({find:/^react$/,replacement:path.join(REPO,'packages/react/node_modules/react')},{find:/^react-dom\/(.*)$/,replacement:path.join(REPO,'packages/react/node_modules/react-dom/$1')});
    } else if (target === 'vue') {
      plugins.push(require('@vitejs/plugin-vue')());
      entry += `import { createApp } from 'vue'; createApp(App).mount('#app');`;
    } else if (target === 'vue2') {
      const vue2Compiler = require(path.join(REPO, 'packages/vue2/node_modules/vue/compiler-sfc'));
      plugins.push(require(path.join(REPO,'packages/vue2/node_modules/@vitejs/plugin-vue2'))({ compiler: vue2Compiler }));
      alias.push({find:/^vue$/,replacement:path.join(REPO,'packages/vue2/node_modules/vue/dist/vue.runtime.esm.js')});
      entry += `import Vue from 'vue'; new Vue({render: h => h(App)}).$mount('#app');`;
    } else {
      const compiler = require('svelte/compiler');
      const esbuild = require('esbuild');
      plugins.push({name:'experiment-svelte',async transform(code,id){if(!id.endsWith('.svelte'))return; const preprocessed=await compiler.preprocess(code,{script:async({content,attributes})=>attributes.lang==='ts'?{code:(await esbuild.transform(content,{loader:'ts'})).code}:{code:content}},{filename:id});return compiler.compile(preprocessed.code,{filename:id,generate:'dom'}).js;}});
      entry += `new App({target:document.getElementById('app')});`;
    }
    fs.writeFileSync(path.join(dir,'main.js'),entry);
    fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Component lab · ${target}</title><script src="https://cdn.tailwindcss.com"></script></head><body><nav><strong>komerce<span style="color:#5b8587"> / lab</span></strong><div>${targets.map(t=>`<a href="/${t}/" ${t===target?'aria-current="page"':''}>${({react:'React',vue:'Vue 3',vue2:'Vue 2',svelte:'Svelte'})[t]}</a>`).join('')}</div></nav><div id="app"></div><script type="module" src="./main.js"></script></body></html>`);
    await viteBuild({configFile:false,root:dir,base:`/${target}/`,plugins,resolve:{alias},build:{outDir:path.join(ROOT,'preview/dist',target),emptyOutDir:true},logLevel:'warn'});
  }
}
function serve(port=4179) {
  const base=path.join(ROOT,'preview/dist');
  const server=http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}if(pathname==='/'){res.writeHead(302,{Location:'/react/'}).end();return;}const file=path.resolve(base,'.'+pathname+(pathname.endsWith('/')?'index.html':''));if(!file.startsWith(base+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end('Not found');return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
  return new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',()=>resolve(server));});
}
module.exports={build,serve,targets};
if(require.main===module)(async()=>{await build();if(!process.argv.includes('--build')){const server=await serve(Number(process.env.PORT||4179));console.log(`Preview: http://127.0.0.1:${server.address().port}/`);for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));}})().catch(error=>{console.error(error);process.exitCode=1;});

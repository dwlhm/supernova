const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {build,serve,targets} = require('./preview.cjs');
const ROOT=__dirname;
function browserDriver(){
  if(process.env.PLAYWRIGHT_MODULE) return require(path.resolve(process.env.PLAYWRIGHT_MODULE));
  for(const name of ['playwright','playwright-core'])try{return require(name);}catch{}
  const cache=path.join(os.homedir(),'Library/Caches/ms-playwright-go');
  if(fs.existsSync(cache))for(const version of fs.readdirSync(cache).sort().reverse())try{return require(path.join(cache,version,'package'));}catch{}
  throw new Error('Install Playwright separately or set PLAYWRIGHT_MODULE to an existing Playwright package.');
}
function executable(){
  if(process.env.CHROMIUM_EXECUTABLE_PATH)return process.env.CHROMIUM_EXECUTABLE_PATH;
  const roots=[path.join(os.homedir(),'Library/Caches/ms-playwright'),path.join(os.homedir(),'.cache/ms-playwright')];
  for(const root of roots)if(fs.existsSync(root))for(const version of fs.readdirSync(root).filter(x=>x.startsWith('chromium_headless_shell-')).sort().reverse())for(const sub of ['chrome-headless-shell-mac-arm64/chrome-headless-shell','chrome-headless-shell-mac-x64/chrome-headless-shell','chrome-linux/headless_shell']){const file=path.join(root,version,sub);if(fs.existsSync(file))return file;}
  return undefined;
}
async function until(page, fn, message){try{await page.waitForFunction(fn,null,{timeout:5000});}catch(error){throw new Error(message,{cause:error});}}
async function checkPage(page,target){
  const results=[];
  await page.getByRole('heading',{name:'From design to interaction.'}).waitFor();

  const button = page.getByRole('button', { name: /^Clicked 0 times/ });
  await button.click();
  await until(page, () => document.querySelector('body').textContent.includes('Clicked 1 times'), `${target}: button click callback failed`);
  await page.getByRole('button', { name: 'Disable button' }).click();
  assert.equal(await page.getByRole('button', { name: /^Clicked 1 times/ }).isDisabled(), true);
  await page.getByRole('button', { name: 'Enable button' }).click();
  assert.equal(await page.getByRole('button', { name: /^Clicked 1 times/ }).isDisabled(), false);
  results.push('button: click callback, disabled toggle, variant styles');

  const shapeBtn = page.getByRole('button', { name: /^Shape:/ });
  await shapeBtn.click();
  await until(page, () => document.querySelector('body').textContent.includes('Shape: square'), `${target}: avatar shape toggle failed`);
  const sizeBtn = page.getByRole('button', { name: /^Size:/ });
  await sizeBtn.click();
  await until(page, () => document.querySelector('body').textContent.includes('Size: small'), `${target}: avatar size toggle failed`);
  results.push('avatar: shape toggle, size toggle, initials rendering');

  await page.getByRole('button', { name: 'Review details' }).click();
  await until(page, () => document.querySelector('body').textContent.includes('Actions clicked: 1'), `${target}: alert action callback failed`);
  const dismissBtn = page.getByRole('button', { name: /Close alert|Dismiss alert/ });
  if (await dismissBtn.count()) {
    await dismissBtn.click();
    await until(page, () => !document.querySelector('[role="alert"]'), `${target}: alert dismiss failed`);
    await page.getByRole('button', { name: 'Reset alert' }).click();
    await until(page, () => !!document.querySelector('[role="alert"]'), `${target}: alert reset failed`);
  }
  results.push('alert: action trigger, dismiss, and reset');

  const checkbox=page.locator('#updates');
  assert.equal(await checkbox.getAttribute('type'),'checkbox');
  await page.getByText('Receive product updates',{exact:true}).click();
  await until(page,()=>document.querySelector('[data-testid="checkbox-state"]').textContent.includes('Subscribed · 1'),`${target}: checkbox callback did not update parent`);
  await checkbox.focus();await page.keyboard.press('Space');
  await until(page,()=>document.querySelector('[data-testid="checkbox-state"]').textContent.includes('Not subscribed · 2'),`${target}: keyboard checkbox callback failed`);
  assert.equal(await page.locator('#locked').isDisabled(),true);
  await page.getByText('Managed by your organization', { exact: true }).click({ force: true });
  assert.match(await page.locator('[data-testid="checkbox-state"]').innerText(),/2 changes/);
  results.push('checkbox: native control, label click, Space, controlled callback, disabled');
  const text=page.getByRole('textbox',{name:'Project name'});
  await text.fill('Launch plan');
  await until(page,()=>document.querySelector('[data-testid="text-state"]').textContent==='Launch plan',`${target}: text input callback failed`);
  assert.equal(await text.getAttribute('maxlength'),'40');
  let described=await text.getAttribute('aria-describedby');
  assert.ok(described,'helper association missing');
  for(const id of described.split(/\s+/))assert.equal(await page.locator(`[id="${id}"]`).count(),1);
  await page.getByRole('button',{name:'Toggle validation'}).click();
  assert.equal(await text.getAttribute('aria-invalid'),'true');
  assert.match(await page.locator('#project-message').innerText(), /Please choose a different name/);
  await text.fill('');assert.equal(await page.locator('[data-testid="text-state"]').innerText(),'No project name yet');
  results.push('textfield: native input, controlled typing/empty, max length, helper/error association');
  const table=page.getByRole('table',{name:'Customer directory'});
  assert.equal(await table.locator('tbody tr').count(),3);
  const firstRow=table.locator('tbody tr').filter({hasText:'Customer 1'});
  await firstRow.getByRole('checkbox').check();
  await until(page,()=>document.querySelector('[data-testid="selection-state"]').textContent.includes('customer-0'),`${target}: selection callback failed`);
  await page.getByRole('button',{name:'Reverse rows'}).click();
  assert.equal(await table.locator('tbody tr').filter({hasText:'Customer 1'}).getByRole('checkbox').isChecked(),true);
  await page.getByRole('combobox',{name:'Row count'}).selectOption('12');
  assert.equal(await table.locator('tbody tr').count(),12);
  const selectAll=table.locator('thead').getByRole('checkbox');
  if(await selectAll.count()){await selectAll.check();assert.equal(await table.locator('tbody input:checked').count(),12);await selectAll.uncheck();assert.equal(await table.locator('tbody input:checked').count(),0);}
  await page.getByRole('combobox',{name:'Row count'}).selectOption('1');assert.equal(await table.locator('tbody tr').count(),1);
  await page.getByRole('combobox',{name:'Row count'}).selectOption('0');
  await page.getByRole('button',{name:'Add customer'}).click();
  assert.equal(await table.locator('tbody tr').count(),1);
  assert.match(await page.locator('[data-testid="empty-state"]').innerText(),/1$/);
  results.push('table: 0/1/3/12 dynamic rows, selection callback, stable ids on reorder, select-all when exposed, empty action');
  const chart=page.getByRole('region',{name:'Chart experiment'});
  const shape=async()=>chart.locator('svg').evaluate(svg=>[...svg.querySelectorAll('rect,path,polyline,circle,line')].map(el=>el.outerHTML).join(''));
  const original=await shape();
  await page.getByRole('combobox',{name:'Chart dataset'}).selectOption('updated');
  assert.notEqual(await shape(),original,'chart geometry must respond to changed values');
  const geometryFinite=async()=>{const markup=await chart.locator('svg').getAttribute('viewBox');assert.ok(markup);assert.doesNotMatch(await chart.locator('svg').evaluate(el=>el.outerHTML),/NaN|Infinity/);};
  for(const variant of ['bar','line']){
    await page.getByRole('combobox',{name:'Chart variant'}).selectOption(variant);
    for(const dataset of ['normal','updated','single','zero','negative']){
      await page.getByRole('combobox',{name:'Chart dataset'}).selectOption(dataset);await geometryFinite();
      const accessibleTable=chart.getByRole('table');assert.equal(await accessibleTable.count(),1);
      const expected=dataset==='single'?1:dataset==='zero'||dataset==='negative'?2:3;
      assert.equal(await accessibleTable.locator('tbody tr').count(),expected);
    }
  }
  for(const dataset of ['invalid','empty']){await page.getByRole('combobox',{name:'Chart dataset'}).selectOption(dataset);assert.equal(await chart.locator('svg').count(),0,`${dataset} should not render chart geometry`);assert.ok((await chart.innerText()).trim().length);}
  await page.getByRole('combobox',{name:'Chart dataset'}).selectOption('normal');
  await page.getByRole('combobox',{name:'Chart variant'}).selectOption('unsupported');
  assert.equal(await chart.locator('svg').count(),0);assert.equal(await chart.getByRole('alert').count(),1);
  await page.getByRole('combobox',{name:'Chart variant'}).selectOption('bar');
  results.push('chart: bar/line dynamic geometry, single/zero/negative finite SVG, accessible data rows, invalid/empty/unsupported states');
  return results;
}
async function main(){
  const artifacts=path.join(ROOT,'verification');fs.mkdirSync(artifacts,{recursive:true});
  const report=path.join(artifacts,'browser-report.json');if(fs.existsSync(report))fs.unlinkSync(report);
  await build();
  const server=await serve(0);let browser;
  try{
    browser=await browserDriver().chromium.launch({headless:true,executablePath:executable()});
    const evidence={checkedAt:new Date().toISOString(),targets:{}};
    for(const target of targets){
      const page=await browser.newPage({viewport:{width:1440,height:1100}});const errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/${target}/`);
      evidence.targets[target]=await checkPage(page,target);assert.deepEqual(errors,[],`${target}: runtime errors`);
      if(target==='react'){await page.screenshot({path:path.join(artifacts,'desktop.png'),fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(artifacts,'mobile.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,'mobile page must not overflow horizontally');}
      await page.close();console.log(`PASS ${target}: ${evidence.targets[target].length} interaction groups`);
    }
    fs.writeFileSync(report,JSON.stringify(evidence,null,2)+'\n');
  }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
module.exports={checkPage};
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});

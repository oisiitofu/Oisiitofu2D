'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=__dirname,url=process.env.TEST_URL||'http://localhost:4173';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
 await page.goto(url);await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
 const roster=await page.evaluate(()=>({definitions:Roster.definitions.map(d=>({id:d.id,name:d.name})),selectable:Roster.selectable.map(d=>d.id),loaded:Object.keys(characterArt)}));
 assert.deepEqual(roster.loaded.sort(),roster.definitions.map(d=>d.id).sort());assert.equal(await page.locator('.fighter-card').last().getAttribute('data-id'),'random');
 const scripts=require('./script-bundle.cjs').files(root);let assets=0,requires=0,fixtures=0;
 for(const file of scripts){assert.ok(fs.existsSync(path.join(root,file)),file);assert.equal((await page.request.get(url+'/'+file)).status(),200,file);}
 for(const {id}of roster.definitions){const dir=path.join(root,'characters',id);assert.ok(fs.statSync(dir).isDirectory(),id);
  const names=fs.readdirSync(path.join(dir,'assets'));assert.ok(names.some(n=>n.endsWith('.png')),id+' source images');assets+=names.length;
  const image=names.find(n=>n.endsWith('.png')),response=await page.request.head(url+'/characters/'+id+'/assets/'+image);assert.equal(response.status(),200,id);assert.equal(response.headers()['content-type'],'image/png');
  function inspect(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory()){if(!['assets','docs','previews'].includes(item.name))inspect(file);continue;}if(!/\.(js|cjs)$/.test(item.name))continue;
   const text=fs.readFileSync(file,'utf8');for(const m of text.matchAll(/require\(['"](\.[^'"]+)['"]\)/g)){assert.ok(fs.existsSync(path.resolve(path.dirname(file),m[1])),file+' requires '+m[1]);requires++;}
   for(const m of text.matchAll(/['"](characters\/[a-z0-9-]+\/assets\/[a-zA-Z0-9_-]+\.(?:png|svg|webp))['"]/g))assert.ok(fs.existsSync(path.join(root,m[1])),m[1]);
   if(item.name.endsWith('-test.cjs')&&text.includes('run-native-test.cjs'))for(const suffix of ['config.json','checks.js']){assert.ok(fs.existsSync(path.join(root,'characters',id,'tests',id+'-'+suffix)),id+' '+suffix);fixtures++;}
  }}inspect(dir);
 }
 for(const file of ['characters/midna/tests/midna-test.cjs','characters/eve/tests/eve-config.json','characters/haseo/docs/private.md','characters/haseo/other.js','characters/haseo/assets/secret.json','.tools/build-art.cjs','server.cjs'])assert.equal((await page.request.get(url+'/'+file)).status(),404,file+' stays private');
 const rawScripts=await page.request.get(url+'/game-bundle.js'),body=await rawScripts.text();assert.ok(body.includes('/* characters/midna/midna-data.js */'));assert.ok(body.includes('/* characters/haseo/haseo-art.js */'));
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 fs.writeFileSync(path.join(root,'.tools/character-layout-report.json'),JSON.stringify({roster,scripts:scripts.length,assets,requires,fixtures,errors,failed},null,2));
 console.log(JSON.stringify({characters:roster.definitions.length,scripts:scripts.length,assets,requires,fixtures,errors,failed}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

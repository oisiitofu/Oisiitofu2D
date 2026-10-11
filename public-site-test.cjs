'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto'),{spawn}=require('node:child_process');
const {chromium}=require('playwright');
const root=__dirname,site=path.join(root,'.tools/local-public-site'),dist=path.join(site,'dist');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.wav':'audio/wav'};
const server=http.createServer((req,res)=>{
 let file;try{file=path.resolve(dist,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}catch{res.writeHead(400).end();return;}
 if(file===dist)file=path.join(dist,'index.html');
 if(!file.startsWith(dist+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
 const size=fs.statSync(file).size,match=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||''),start=match?+match[1]:0,end=match&&match[2]?Math.min(+match[2],size-1):size-1;
 if(start>end){res.writeHead(416).end();return;}
 res.writeHead(match?206:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':end-start+1,'Accept-Ranges':'bytes',...(match?{'Content-Range':`bytes ${start}-${end}/${size}`}:{})});
 if(req.method==='HEAD')res.end();else fs.createReadStream(file,{start,end}).pipe(res);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url='http://127.0.0.1:'+server.address().port;
 if(process.argv.includes('--serve')){console.log(url);return;}
 let browser;
 try{
  const inventory=JSON.parse(fs.readFileSync(path.join(site,'asset-inputs.json')));
  for(const item of inventory.files){const source=fs.readFileSync(path.join(root,item.source)),output=fs.readFileSync(path.join(dist,item.target));assert.deepEqual(output,item.range?source.subarray(...item.range):source,item.target);assert.ok(output.length<=25*1024*1024);}
  console.log('Identical asset bytes: '+inventory.files.length);
  browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[],missing=[],sockets=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+' '+r.url());});page.on('websocket',w=>sockets.push(w.url()));
  page.on('request',r=>assert.ok(!r.url().includes('/api/'),'Static edition requested a server API'));
  await page.goto(url);await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
  assert.equal(await page.locator('#battle-mode option[value=online]').count(),0);
  await page.click('#enter-roster');await page.click('#start');await page.waitForFunction(()=>state==='battle'&&countdown===0,null,{timeout:15000});
  const before=await page.evaluate(()=>({frame,cpu:!training&&fighters.some(f=>f.control==='cpu')}));await page.waitForTimeout(500);
  assert.ok(before.cpu);assert.ok(await page.evaluate(f=>frame>f,before.frame));
  await page.reload();await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
  await page.click('#enter-training');await page.click('#start');assert.ok(await page.evaluate(()=>training));
  await page.evaluate(()=>{countdown=0;state='battle';GameAudio.unlock();void GameAudio.begin('3');});
  const chunked=await page.evaluate(async()=>{for(const id of ['0','1','2','3','4','5','6','7','8','9','10']){const m=await(await fetch('/assets/audio/bgm-manifests/'+id+'.json')).json();if(m.tracks.some(t=>t.parts))return id;}});
  assert.ok(chunked);await page.evaluate(id=>GameAudio.begin(id),chunked);
  await page.waitForFunction(()=>GameAudio.bgm.src.startsWith('blob:')&&GameAudio.bgm.readyState>=2,null,{timeout:30000});
  await page.reload();await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});
  const expected=JSON.parse(fs.readFileSync(path.join(root,'public-site.json'))).onlineUrl;
  let destination;await page.route(expected+'/**',route=>{destination=route.request().url();return route.abort();});
  await page.click('#enter-online');await page.waitForTimeout(300);assert.equal(destination.replace(/\/$/,''),expected);
  assert.deepEqual(sockets,[]);assert.deepEqual(missing,[]);assert.deepEqual(errors,[]);
  console.log('CPU, training, lossless BGM parts, online link, no API/WebSocket: passed');
  await browser.close();browser=null;
  await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['battle-movement-test.cjs'],{cwd:root,env:{...process.env,TEST_URL:url},stdio:'inherit'});child.on('exit',code=>code===0?resolve():reject(Error('Movement regression failed: '+code)));});
 }finally{await browser?.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});

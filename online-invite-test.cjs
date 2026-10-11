const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),checks=[],errors=[];
 const check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});
 const base=process.env.GAME_URL||'http://localhost:4173';
 async function page(url=base){const p=await browser.newPage();p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>{window.inviteSockets=[];const NativeWebSocket=WebSocket;window.WebSocket=class extends NativeWebSocket{constructor(...args){super(...args);window.inviteSockets.push(this);}};});await p.goto(url);await p.waitForFunction(()=>document.querySelector('#fighter-grid').children.length>0);return p;}
 async function roomState(p){return p.evaluate(()=>({code:Net.code,input:document.querySelector('#room-code').value,label:document.querySelector('#room-id').textContent,url:new URL(location.href).searchParams.get('room'),summary:document.querySelector('#open-room').textContent}));}
 try{
  const host=await page(base+'/?room=A1B2C3&test=invite#lobby');await host.click('#open-room');
  check('invite link fills the supplied code',(await roomState(host)).input==='A1B2C3');
  await host.click('#create-room');await host.waitForFunction(()=>Net.code.length===6);const first=await roomState(host);
  check('new room replaces old invitation in URL',first.url===first.code,first);
  check('room input and displayed code match server',first.input===first.code&&first.label===first.code,first);
  const copied=[];await host.exposeFunction('recordInvite',s=>copied.push(s));await host.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:s=>window.recordInvite(s)}}));await host.click('#copy-room');
  check('copied invitation uses current server code',new URL(copied[0]).searchParams.get('room')===first.code,copied);
  const guest=await page();await guest.click('#enter-online');await guest.click('#open-room');
  await guest.evaluate(code=>{document.querySelector('#room-code').value=code;document.querySelector('#join-room').click();document.querySelector('#room-code').value='BADBAD';},first.code);
  await guest.waitForFunction(()=>Net.code.length===6||document.querySelector('#online-status').textContent.includes('見つからない'));
  check('join captures code when clicked, before WebSocket opens',(await roomState(guest)).code===first.code,await roomState(guest));
  await guest.evaluate(()=>Net.leave());await host.click('#leave-room');const left=await roomState(host);
  check('leaving clears displayed and editable codes',left.code===''&&left.input===''&&left.label==='',left);
  check('leaving removes stale invitation from URL',left.url===null,left);
  check('unrelated URL parameters and hash survive',await host.evaluate(()=>new URL(location.href).searchParams.get('test')==='invite'&&location.hash==='#lobby'));
  await host.reload();await host.waitForFunction(()=>document.querySelector('#fighter-grid').children.length>0);
  check('reload cannot restore an exited room',(await roomState(host)).input==='',await roomState(host));
  if(await host.locator('#enter-online').isVisible())await host.click('#enter-online');await host.click('#open-room');await host.evaluate(()=>{document.querySelector('#create-room').click();document.querySelector('#create-room').click();});await host.waitForFunction(()=>Net.code.length===6);const second=await roomState(host);
  check('recreated room has one consistent invitation',second.code!==first.code&&second.url===second.code&&second.label===second.code,second);
  check('double click opens only one connection',await host.evaluate(()=>inviteSockets.length===1));
  await guest.reload();await guest.waitForFunction(()=>document.querySelector('#fighter-grid').children.length>0);await guest.click('#enter-online');await guest.click('#open-room');await guest.fill('#room-code','XYZ');await guest.click('#join-room');
  check('invalid codes cannot open a connection',await guest.evaluate(()=>inviteSockets.length===0&&document.querySelector('#online-status').textContent.includes('6文字')));
  await guest.fill('#room-code','FFFFFF');await guest.click('#join-room');await guest.waitForFunction(()=>document.querySelector('#online-status').textContent.includes('見つからない'));
  check('unknown code never replaces the invitation',(await roomState(guest)).code===''&&(await roomState(guest)).url===null);
  await guest.fill('#room-code',second.code.toLowerCase());await guest.click('#join-room');await guest.waitForFunction(()=>Net.code.length===6);
  check('lowercase codes join the exact room',(await roomState(guest)).code===second.code,await roomState(guest));
  check('failed join can retry on the same open connection',await guest.evaluate(()=>inviteSockets.length===1));
  await host.click('#ready-room');await guest.click('#ready-room');await Promise.all([host,guest].map(p=>p.waitForFunction(()=>Net.active&&state==='battle')));
  check('both sessions can start the invited match',true);await guest.evaluate(()=>Net.leave());await host.waitForFunction(()=>!Net.active);
  check('peer exit retains the host room code',(await roomState(host)).code===second.code);
  await host.evaluate(()=>inviteSockets[0].close());await host.waitForFunction(()=>!Net.code);const disconnected=await roomState(host);
  check('disconnection clears the invitation everywhere',disconnected.input===''&&disconnected.label===''&&disconnected.url===null&&!disconnected.summary.includes(second.code),disconnected);
  const pending=await page();await pending.click('#enter-online');await pending.click('#open-room');await pending.evaluate(()=>{document.querySelector('#create-room').click();Net.leave();});
  await pending.waitForTimeout(200);check('cancelled connection cannot repopulate a stale code',(await roomState(pending)).code==='');
  check('no browser errors',errors.length===0,errors);fs.writeFileSync('.tools/online-invite-results.json',JSON.stringify({base,checks,errors},null,2));console.log(JSON.stringify({passed:checks.filter(c=>c.pass).length,total:checks.length,failed:checks.filter(c=>!c.pass)}));assert.ok(checks.every(c=>c.pass));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

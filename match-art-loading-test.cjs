'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),{WebSocket}=require('ws'),{chromium}=require('playwright');
(async()=>{
 let checks=0;const eq=(a,b)=>{checks++;assert.deepEqual(a,b);},ok=a=>{checks++;assert.ok(a);};
 const server=http.createServer(),online=require('./online-server.cjs').attachOnline(server),clients=[];
 const wait=async fn=>{const deadline=Date.now()+5000;while(!fn()){assert.ok(Date.now()<deadline,'server response timed out');await new Promise(r=>setTimeout(r,10));}};
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const send=(ws,m)=>ws.send(JSON.stringify(m));
 async function connect(){const ws=new WebSocket(`ws://127.0.0.1:${server.address().port}/online`);clients.push(ws);ws.messages=[];ws.on('message',bytes=>ws.messages.push(JSON.parse(bytes)));await new Promise(resolve=>ws.once('open',resolve));return ws;}
 try{
  const a=await connect(),b=await connect();send(a,{type:'create'});await wait(()=>a.messages.some(m=>m.type==='joined'));const code=a.messages.find(m=>m.type==='joined').code,room=online.rooms.get(code);send(b,{type:'join',code});await wait(()=>room.players.every(Boolean));
  const ready=()=>{for(const ws of clients)send(ws,{type:'ready',character:'tifa',stage:'random',stocks:3,timeLimit:0});};
  ready();await wait(()=>room.preparing);const first=room.pendingConfig;eq(room.playing,false);eq(first.players.map(p=>p.character),['tifa','tifa']);
  send(a,{type:'loaded',matchId:first.matchId});await new Promise(r=>setTimeout(r,100));eq(room.playing,false);eq(a.messages.filter(m=>m.type==='frame').length,0);
  send(b,{type:'loaded',matchId:first.matchId-1});await new Promise(r=>setTimeout(r,30));eq(room.playing,false);
  send(b,{type:'loaded',matchId:first.matchId});await wait(()=>a.messages.some(m=>m.type==='frame'));eq(a.messages.find(m=>m.type==='start').config,first);eq(a.messages.find(m=>m.type==='frame').frame,1);
  send(a,{type:'lobby',matchId:first.matchId});await wait(()=>!room.playing);ready();await wait(()=>room.preparing);send(a,{type:'load-error',matchId:room.matchId});await wait(()=>!room.preparing);eq(room.players.map(p=>p.ready),[false,false]);eq(room.playing,false);
  ready();await wait(()=>room.preparing);room.touched=Date.now()-61000;await wait(()=>a.messages.some(m=>m.type==='error'&&m.message.includes('タイムアウト')));eq(room.preparing,false);eq(room.playing,false);ok(a.messages.some(m=>m.type==='error'&&m.message.includes('タイムアウト')));
  ready();await wait(()=>room.preparing);const retryId=room.matchId;send(a,{type:'lobby',matchId:retryId});await wait(()=>!room.preparing);for(const ws of clients)send(ws,{type:'loaded',matchId:retryId});await new Promise(r=>setTimeout(r,40));eq(room.playing,false);
 }finally{for(const ws of clients)ws.close();await new Promise(resolve=>server.close(resolve));}
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.stack));
  await p.addInitScript(()=>{window.artProbe={decodes:[],readbacks:0};const decode=HTMLImageElement.prototype.decode;HTMLImageElement.prototype.decode=async function(){await decode.call(this);artProbe.decodes.push(this.src);};const read=CanvasRenderingContext2D.prototype.getImageData;CanvasRenderingContext2D.prototype.getImageData=function(){artProbe.readbacks++;return read.apply(this,arguments);};});
  await p.goto(process.env.TEST_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);
  eq(await p.evaluate(()=>ArtLoader.diagnostics.resident),[]);eq(await p.evaluate(()=>artProbe.decodes.filter(u=>/-atlas-|palette-/.test(u)).length),0);eq(await p.evaluate(()=>Object.values(characterArt).every(a=>a.pending&&a.frames[0].width>0)),true);
  await p.click('#enter-training');await p.click('[data-id="tifa"]');eq(await p.evaluate(()=>ArtLoader.diagnostics.resident),[]);
  await p.evaluate(()=>{$('#cpu-character').value='battlemage';$('#color2').value='2';$('#stage').value='0';});await p.click('#start');await p.waitForFunction(()=>state==='battle');
  eq(await p.evaluate(()=>ArtLoader.diagnostics.resident.sort()),['battlemage','tifa']);eq(await p.evaluate(()=>ArtLoader.prepared(fighters.map(f=>({character:f.characterId,color:f.color})))),true);
  const motion=await p.evaluate(()=>{state='menu';const before=artProbe.readbacks;for(const f of fighters)for(let pose=0;pose<characterArt[f.characterId].frames.length;pose++){f.pose=pose;f.attack=null;drawSprite(f);}return{readbacks:artProbe.readbacks-before,ids:fighters.map(f=>f.characterId)};});eq(motion.readbacks,0);
  // Metadata dimensions remain identical when textures are released. Old canvases
  // lose their backing stores, including references held by an earlier frame.
  const released=await p.evaluate(async()=>{const old=characterArt.tifa.frames[0],dimensions=[old.width,old.height];const players=[{character:'agumon',color:1},{character:'hanajs',color:3}];await ArtLoader.prepare(players);ArtLoader.retain(players);await StageVisuals.load('2');StageVisuals.retain('2');return{old:[old.width,old.height],dimensions,metadata:[characterArt.tifa.frames[0].width,characterArt.tifa.frames[0].height],pending:characterArt.tifa.pending,ids:ArtLoader.diagnostics.resident.sort(),prepared:ArtLoader.prepared(players),stages:StageVisuals.diagnostics.images};});
  eq(released.old,[1,1]);eq(released.metadata,released.dimensions);eq(released.pending,true);eq(released.ids,['agumon','greymon','hanajd','hanajk','hanajs','metalgreymon','omegamon','wargreymon']);eq(released.prepared,true);eq(released.stages,3);
  eq(await p.evaluate(async()=>{const players=[{character:'isaac',color:0,team:['tifa','battlemage']},{character:'tifa',color:4,team:['isaac','tifa']}];await ArtLoader.prepare(players);ArtLoader.retain(players);return{ids:ArtLoader.diagnostics.resident.sort(),ready:ArtLoader.prepared(players),colors:ArtLoader.diagnostics.warmed.find(a=>a.id==='tifa').colors.sort()};}),{ids:['battlemage','isaac','tifa'],ready:true,colors:[0,4]});
  // A single failed texture can be retried; it must not poison the load promise.
  await p.route('**/assets/ready/*karateka*atlas*',route=>route.abort());eq(await p.evaluate(async()=>{try{await ArtLoader.prepare([{character:'karateka',color:0}]);return false;}catch{return true;}}),true);await p.unroute('**/assets/ready/*karateka*atlas*');
  eq(await p.evaluate(async()=>{await ArtLoader.prepare([{character:'karateka',color:0}]);return ArtLoader.prepared([{character:'karateka',color:0}]);}),true);
  eq(errors,[]);console.log(JSON.stringify({checks,bootAtlases:0,prewarmedReadbacks:0,releasedCanvases:true,evolutionForms:8,squadAndColors:true,delayedPeerAndRetry:true,errors}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

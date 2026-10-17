'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),{WebSocket}=require('ws'),{chromium}=require('playwright'),SquadRules=require('./squad-rules.js');
(async()=>{
 let checks=0;const eq=(a,b)=>{checks++;assert.deepEqual(a,b);},roster=['tifa','isaac','chiikawa','chocobo','ulgrim','vivi'];
 eq(SquadRules.duplicate(['random','random','tifa']),false);eq(SquadRules.duplicate(['tifa','random','tifa']),true);assert.throws(()=>SquadRules.resolve(['tifa','tifa'],roster));checks++;
 eq(SquadRules.resolve(['random','tifa','random','isaac','random'],roster,()=>0),['chiikawa','tifa','chocobo','isaac','ulgrim']);
 for(const count of [3,5])for(let n=0;n<100;n++){const lineup=SquadRules.resolve(Array(count).fill('random'),roster);eq(new Set(lineup).size,count);}
 for(const count of [3,5])eq(SquadRules.resolve(Array(count).fill('random'),roster,()=>0),roster.slice(0,count));
 const server=http.createServer(),online=require('./online-server.cjs').attachOnline(server),clients=[];
 const wait=async fn=>{const deadline=Date.now()+5000;while(!fn()){assert.ok(Date.now()<deadline,'server response timed out');await new Promise(r=>setTimeout(r,10));}},send=(ws,m)=>ws.send(JSON.stringify(m));
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 async function connect(){const ws=new WebSocket(`ws://127.0.0.1:${server.address().port}/online`);clients.push(ws);ws.messages=[];ws.on('message',bytes=>ws.messages.push(JSON.parse(bytes)));await new Promise(resolve=>ws.once('open',resolve));return ws;}
 try{
  const a=await connect();send(a,{type:'create',playerCount:4,squadSize:5});await wait(()=>a.messages.some(m=>m.type==='joined'));const code=a.messages.find(m=>m.type==='joined').code,room=online.rooms.get(code);
  for(let n=1;n<4;n++){const ws=await connect();send(ws,{type:'join',code});await wait(()=>ws.messages.some(m=>m.type==='joined'));}
  send(a,{type:'ready',squadSize:5,character:'tifa',team:['tifa','isaac','chiikawa','random','random']});await wait(()=>room.players[0].ready);
  const bad=clients[1];send(bad,{type:'ready',character:'vivi',team:['vivi','vivi','random','random','random']});await wait(()=>bad.messages.some(m=>m.type==='error'));eq(room.players[1].ready,false);eq(!!room.preparing,false);
  const crypto=require('node:crypto'),originalDraw=crypto.randomInt;crypto.randomInt=()=>0;
  try{for(let n=1;n<4;n++)send(clients[n],{type:'ready',character:'tifa',team:n===1?['random','tifa','random','random','random']:Array(5).fill('random')});await wait(()=>clients.every(ws=>ws.messages.some(m=>m.type==='prepare')));}finally{crypto.randomInt=originalDraw;}
  for(let viewer=0;viewer<4;viewer++)for(const status of clients[viewer].messages.filter(m=>m.type==='room'&&m.squadSize===5&&!m.revealed))for(let n=0;n<4;n++){const p=status.players[n];if(p&&n!==viewer){eq(Object.hasOwn(p,'team'),false);eq(Object.hasOwn(p,'character'),false);}}
  const config=clients[0].messages.find(m=>m.type==='prepare').config;for(const p of config.players){eq(p.team.length,5);eq(new Set(p.team).size,5);}eq(config.players[0].team.slice(0,3),['tifa','isaac','chiikawa']);eq(config.players[1].team[1],'tifa');for(let viewer=0;viewer<4;viewer++){const revealed=clients[viewer].messages.find(m=>m.type==='room'&&m.revealed);eq(revealed.players.map(p=>p.team),config.players.map(p=>p.team));eq(revealed.preparing,true);}
  for(const ws of clients)send(ws,{type:'loaded',matchId:config.matchId});await wait(()=>room.playing);for(const ws of clients)send(ws,{type:'lobby',matchId:config.matchId});await wait(()=>!room.playing&&clients.every(ws=>ws.messages.at(-1)?.type==='room'&&!ws.messages.at(-1).revealed));eq(room.revealedConfig,null);for(let viewer=0;viewer<4;viewer++)for(let n=0;n<4;n++)if(n!==viewer){eq(Object.hasOwn(clients[viewer].messages.at(-1).players[n],'team'),false);eq(Object.hasOwn(clients[viewer].messages.at(-1).players[n],'character'),false);}
 }finally{for(const ws of clients)ws.close();await new Promise(resolve=>server.close(resolve));}
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>{navigator.getGamepads=()=>[];});await p.goto(process.env.TEST_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#enter-squad');
  await p.click('[data-id="tifa"]');await p.click('#squad-lineup [data-slot="1"]');eq(await p.locator('[data-id="tifa"]').isDisabled(),true);await p.evaluate(()=>Roster.chooseForSlot('tifa'));eq(await p.evaluate(()=>SquadBattle.teams.player.slice(0,3)),['tifa','random','random']);await p.click('[data-id="isaac"]');
  await p.click('#select-cpu');eq(await p.locator('[data-id="tifa"]').isEnabled(),true);await p.click('[data-id="tifa"]');await p.click('#squad-lineup [data-slot="1"]');eq(await p.locator('[data-id="tifa"]').isDisabled(),true);
  eq(await p.evaluate(()=>{for(let n=0;n<100;n++){const c=SquadBattle.config();if(c.teams.some(team=>new Set(team).size!==3))return false;}return true;}),true);
  await p.click('#select-player');await p.click('#squad-lineup [data-slot="0"]');eq(await p.locator('[data-id="tifa"]').isEnabled(),true);await p.click('[data-id="chocobo"]');await p.click('#squad-lineup [data-slot="2"]');eq(await p.locator('[data-id="tifa"]').isEnabled(),true);await p.click('[data-id="tifa"]');
  await p.screenshot({path:'.tools/squad-rules-selection.png'});await p.click('#back-home');await p.click('#enter-training');eq(await p.locator('[data-id="tifa"]').isEnabled(),true);eq(await p.locator('[data-id="isaac"]').isEnabled(),true);await p.click('#back-home');await p.click('#enter-squad');eq(await p.evaluate(()=>SquadBattle.valid()),true);eq(await p.evaluate(()=>{SquadBattle.teams.player.splice(0,5,'tifa','isaac','chiikawa','chocobo','ulgrim');SquadBattle.refresh();document.querySelector('#squad-lineup [data-slot="0"]').click();Roster.chooseForSlot('chocobo');document.querySelector('#battle-mode').value='squad5';SquadBattle.refresh();return{valid:SquadBattle.valid(),first:SquadBattle.teams.player[0],newSlot:SquadBattle.teams.player[3]};}),{valid:true,first:'chocobo',newSlot:'random'});eq(errors,[]);
 }finally{await browser.close();}
 console.log(JSON.stringify({checks,uniqueRandomDraws:200,revealedWhenAllReady:true,hiddenAgainOnRematch:true,localAndCpu:true,duplicatesRejected:true,fourClientsPrivateBeforeLock:true,errors:[]}));
})().catch(e=>{console.error(e);process.exitCode=1;});

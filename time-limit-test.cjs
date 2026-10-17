'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),{WebSocket}=require('ws'),{chromium}=require('playwright'),MatchRules=require('./match-rules.js');
(async()=>{
 let checks=0;const eq=(a,b)=>{checks++;assert.deepEqual(a,b);};
 for(const t of MatchRules.times){eq(MatchRules.time(t),t);eq(MatchRules.time(String(t)),t);}for(const t of [-1,22,100000,undefined,'bad'])eq(MatchRules.time(t),0);
 const server=http.createServer(),online=require('./online-server.cjs').attachOnline(server),clients=[];
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 async function connect(){const ws=new WebSocket(`ws://127.0.0.1:${server.address().port}/online`);clients.push(ws);ws.messages=[];ws.on('message',bytes=>{const m=JSON.parse(bytes);ws.messages.push(m);if(m.type==='prepare')ws.send(JSON.stringify({type:'loaded',matchId:m.config.matchId}));});await new Promise(resolve=>ws.once('open',resolve));return ws;}
 async function wait(fn){const deadline=Date.now()+5000;while(!fn()){assert.ok(Date.now()<deadline,'server response timed out');await new Promise(r=>setTimeout(r,10));}}
 const send=(ws,m)=>ws.send(JSON.stringify(m));
 try{
  const a=await connect(),b=await connect();send(a,{type:'create',playerCount:2,timeLimit:600,squadSize:3});await wait(()=>a.messages.some(m=>m.type==='joined'));const code=a.messages.find(m=>m.type==='joined').code,room=online.rooms.get(code);
  send(b,{type:'join',code});await wait(()=>room.players.every(Boolean));eq(room.timeLimit,600);eq(room.squadSize,3);
  send(b,{type:'settings',timeLimit:60,squadSize:5,stocks:1});send(b,{type:'ready',timeLimit:60,squadSize:5,stocks:1,character:'tifa'});await wait(()=>room.players[1].ready);eq(room.timeLimit,600);eq(room.squadSize,3);
  send(a,{type:'settings',timeLimit:900,squadSize:5,stocks:4});await wait(()=>room.timeLimit===900);eq(room.players[1].ready,false);
  for(const ws of [b,a])send(ws,{type:'ready',timeLimit:900,squadSize:5,stocks:4,character:'random',team:['tifa','random','hanajk','greymon','chocobo']});await wait(()=>room.playing);
  const config=a.messages.find(m=>m.type==='start').config;eq(config.timeLimit,900);eq(config.squadSize,5);eq(config.players.map(p=>p.team.length),[5,5]);eq(config.players.some(p=>p.team.includes('hanajk')||p.team.includes('greymon')),false);
  // Long or unlimited games must not inherit the former 260-second cutoff.
  room.started=Date.now()-1000000;room.players.forEach(p=>p.lastInput=Date.now());const before=room.frame;await wait(()=>room.frame>before+2);eq(room.playing,true);
  send(a,{type:'lobby',matchId:config.matchId});await wait(()=>!room.playing);eq(room.players.map(p=>p.ready),[false,false]);eq(online.rooms.get(code),room);
  send(a,{type:'settings',timeLimit:0,squadSize:1,stocks:3});await wait(()=>room.timeLimit===0);for(const ws of [b,a])send(ws,{type:'ready',timeLimit:0,squadSize:1,stocks:3,character:'chocobo'});await wait(()=>room.playing);eq(room.timeLimit,0);eq(room.matchId,config.matchId+1);
  for(const ws of [a,b])send(ws,{type:'finished',matchId:config.matchId});send(a,{type:'input',matchId:config.matchId,input:{x:1,jab:true}});await new Promise(r=>setTimeout(r,40));eq(room.playing,true);eq(room.players[0].input.x,0);
 }finally{for(const ws of clients)ws.close();await new Promise(resolve=>server.close(resolve));}
 const browser=await chromium.launch({channel:'msedge',headless:true});try{
  const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.stack));await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});await p.click('#enter-roster');eq(await p.inputValue('#stock-count'),'3');eq(await p.inputValue('#time-limit'),'0');
  const result=await p.evaluate(async()=>{
   const rows=[];Roster.chooseForSlot('tifa');document.querySelector('#cpu-character').value='battlemage';document.querySelector('#stage').value='0';SquadBattle.teams.player.fill('tifa');SquadBattle.teams.cpu.fill('battlemage');simulationSpeed=0;const read=BattlePlayers.localInput;BattlePlayers.localInput=()=>emptyInput();
   try{for(const mode of ['battle','squad3','squad5'])for(const time of MatchRules.times){document.querySelector('#battle-mode').value=mode;document.querySelector('#time-limit').value=String(time);await start();const initial=matchTime;countdown=0;hitstop=0;for(let n=0;n<60;n++)update(true);const after=matchTime;let expired=null;if(time){matchTime=1/60;update(true);expired=state==='result';}rows.push({mode,time,initial:time===0?initial===Infinity:initial===time,elapsed:time===0?after===Infinity:Math.abs(after-(time-1))<1e-7,expired:time===0?state==='battle':expired});}
   document.querySelector('#battle-mode').value='training';await start();for(let n=0;n<120;n++)update(true);rows.push({training:training&&state==='battle'});
   }finally{BattlePlayers.localInput=read;state='pause';}return rows;
  });for(const r of result){assert.ok(Object.values(r).filter(v=>typeof v==='boolean').every(Boolean),JSON.stringify(r));checks++;}eq(errors,[]);
 }finally{await browser.close();}
 console.log(JSON.stringify({checks,hostTimeEnforced:true,longRounds:true,staleRoundPacketsIgnored:true,offlineSquadTime:true}));
})().catch(e=>{console.error(e);process.exitCode=1});

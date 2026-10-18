'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),{WebSocket}=require('ws'),{attachOnline}=require('./online-server.cjs');
(async()=>{
 const server=http.createServer(),online=attachOnline(server),clients=[];await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='ws://127.0.0.1:'+server.address().port+'/online';let checks=0;
 const eq=(a,b)=>{checks++;assert.deepEqual(a,b);};
 async function client(){const ws=new WebSocket(url),messages=[];ws.on('message',b=>messages.push(JSON.parse(b)));await new Promise(r=>ws.once('open',r));const c={ws,messages,send:m=>ws.send(JSON.stringify(m)),async next(type,after=0){for(let n=0;n<150;n++){const m=messages.slice(after).find(m=>m.type===type);if(m)return m;await new Promise(r=>setTimeout(r,10));}throw Error('Missing '+type);}};clients.push(c);return c;}
 async function request(c,m,type){const cursor=c.messages.length;c.send(m);return c.next(type,cursor);}
 try{
  const host=await client(),guest=await client(),browser=await client();eq((await request(browser,{type:'list'},'rooms')).rooms,[]);
  const joined=await request(host,{type:'create',playerCount:4,format:'teams',stocks:5,timeLimit:180,squadSize:3,teamAttack:false,oneOnOne:true},'joined'),code=joined.code;
  const directory=await browser.next('rooms',1);eq(directory.rooms.map(r=>[r.code,r.members,r.playerCount,r.squadSize,r.timeLimit,r.teamAttack]),[[code,1,4,3,180,false]]);eq(Object.hasOwn(directory.rooms[0],'players'),false);
  await request(guest,{type:'join',code},'joined');const room=online.rooms.get(code);
  guest.send({type:'settings',stocks:1,timeLimit:0,playerCount:2,format:'free',squadSize:1,teamAttack:true,oneOnOne:false,battleTeams:[1,0]});
  await request(guest,{type:'ping'},'pong');eq([room.stocks,room.timeLimit,room.players.length,room.format,room.squadSize,room.teamAttack,room.oneOnOne],[5,180,4,'teams',3,false,true]);
  const choice={type:'ready',character:'random',team:['random','random','random'],stage:'1',color:2,stocks:1,timeLimit:0,squadSize:1,teamAttack:true,oneOnOne:false,battleTeam:0};
  await request(guest,choice,'room');eq([room.stocks,room.timeLimit,room.squadSize,room.players[1].battleTeam],[5,180,3,1]);
  await request(host,{type:'settings',stocks:4,timeLimit:120,playerCount:3,battleTeams:[1,0]},'room');eq(room.players.map(p=>p?.ready??null),[false,false,null]);eq([room.stocks,room.timeLimit,room.players.length,room.players[0].battleTeam,room.players[1].battleTeam],[4,120,3,1,0]);
  const third=await client();await request(third,{type:'join',code},'joined');await request(host,{type:'settings',playerCount:2,stocks:1},'error');eq([room.players.length,room.stocks],[3,4]);
  third.send({type:'leave'});await request(third,{type:'ping'},'pong');
  await request(host,{type:'settings',playerCount:2,format:'free',squadSize:1},'room');eq([room.players.length,room.format,room.squadSize],[2,'free',1]);
  await request(host,{...choice,stage:'0'},'room');const before=host.messages.length;await request(guest,choice,'prepare');const prepare=await host.next('prepare',before);eq(prepare.config.oneOnOne,true);eq(prepare.config.stocks,4);eq(['0','1'].includes(prepare.config.stage),true);
  eq((await request(browser,{type:'list'},'rooms')).rooms[0].playing,true);
  const intruder=await client();eq((await request(intruder,{type:'join',code},'error')).message.includes('対戦中'),true);
  const matchId=room.matchId;host.send({type:'loaded',matchId});await request(guest,{type:'loaded',matchId},'start');eq(room.playing,true);
  await request(host,{type:'lobby',matchId},'ended');eq(room.players.every(p=>!p.ready),true);eq(room.playing,false);
  const old=guest.messages.length;host.send({type:'leave'});await guest.next('room-closed',old);eq(online.rooms.has(code),false);eq((await request(browser,{type:'list'},'rooms')).rooms,[]);eq(guest.ws.readyState,WebSocket.OPEN);
  await request(guest,{type:'create',stocks:3,playerCount:2},'joined');eq(guest.ws.readyState,WebSocket.OPEN);
  console.log(JSON.stringify({checks,hostAuthority:true,directory:true,hostExitClosesRoom:true,stageVote:true,protocol:'existing WebSocket'}));
 }finally{clients.forEach(c=>c.ws.terminate());await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});

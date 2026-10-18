const {WebSocketServer,WebSocket}=require('ws');
const crypto=require('node:crypto');
const StageCatalog=require('./stage-data.js');
const MatchRules=require('./match-rules.js');
const SquadRules=require('./squad-rules.js');
const characters=['dragoon','isaac','ulgrim','chiikawa','chocobo','monokuma','riki','roxas','twob','okami','gundam','vivi','zero','rin','nia','lightning','colette','rean','estelle','noctis','clive','makoto','neku','narukami','naegi','rex','luke','will','kosmos','fayt','emma','ryza','noah','midna','bomberman','sans','lloyd','shiren','pokoa','hunter','adol','terry','valkyrie','agumon','pawapuro','headmaster','sakuna','haseo','terrarian','horse','chef','akira','morphie','fei','human','kitten','elma','goemon','bayleef','metabee','nier','miku','naruhodo','jibanyan','layton','dante','leon','tifa','zidane','yuffie','vincent','kiryu','crash','charlotta','ryofu','mametchi','piposaru','twinbee','aruru','maruku','dietrich','edf','edelgard','guile','sukapon','pneuma','arus','knight','maelle','sumino','rocbouquet','frog','tressa','eve','odio','laharl','deemo','kasane','shadow','saki','aerith','doshin','moogle','greymon','metalgreymon','wargreymon','omegamon','donchan','shizuna','hanajs','hanajk','hanajd','kisuke','ray','alain','hinako','cojicoji','megamanexe','krystal','yuri','hornet','toro','melia','fiora','c4621','malenia','hayabusa','klonoa','katamari','kingbonby','alucard','kurabe','battlemage','karateka','aiai'];
const selectableCharacters=characters.filter(id=>!['greymon','metalgreymon','wargreymon','omegamon','hanajk','hanajd'].includes(id));
const axes=['x','y','rx','ry'],flags=['shareStock','jump','jumpHeld','twoJumps','attackHeld','jab','heavy','heavyHeld','forceTilt','smash','smashHeld','charge','special','specialHeld','guard','guardHeld','grab','grabHeld'];
const edges=['shareStock','jump','jab','heavy','smash','special','grab','forceTilt'];
function attachOnline(server){
 const wss=new WebSocketServer({server,path:'/online',maxPayload:4096}),rooms=new Map();
 const send=(ws,data)=>{if(ws?.readyState===WebSocket.OPEN&&ws.bufferedAmount<256000)ws.send(JSON.stringify(data));},all=(room,data)=>room.players.forEach(p=>p&&send(p.ws,data));
 const status=room=>room.players.forEach((viewer,slot)=>viewer&&send(viewer.ws,{type:'room',code:room.code,playing:room.playing,preparing:!!room.preparing,revealed:!!room.revealedConfig,matchId:room.matchId,playerCount:room.players.length,format:room.format,teamAttack:room.teamAttack,stocks:room.stocks,timeLimit:room.timeLimit,squadSize:room.squadSize,players:room.players.map((p,n)=>p?{color:p.color,ready:p.ready,battleTeam:p.battleTeam,stage:p.settings?.stage??null,...(room.revealedConfig?{character:room.revealedConfig.players[n].character,team:room.revealedConfig.players[n].team}:room.squadSize===1||n===slot?{character:p.character,team:p.team?.slice(0,room.squadSize)}:{})}:null)}));
 const resetLobby=room=>{room.playing=room.preparing=false;room.pendingConfig=room.revealedConfig=null;room.touched=Date.now();room.players.forEach(p=>{if(p){p.ready=p.artReady=false;p.input=neutral();p.pending={};}});};
 function hostRules(room,m){
  const stocks=Number.isInteger(m.stocks)&&m.stocks>=1&&m.stocks<=10?m.stocks:3,timeLimit=MatchRules.time(m.timeLimit),squadSize=[3,5].includes(+m.squadSize)?+m.squadSize:1,teamAttack=MatchRules.teamAttack(m.teamAttack);
  if(room.stocks!==stocks||room.timeLimit!==timeLimit||room.squadSize!==squadSize||room.teamAttack!==teamAttack){Object.assign(room,{stocks,timeLimit,squadSize,teamAttack});room.players.forEach(p=>{if(p)p.ready=false;});}
 }
 function leave(ws){let room=ws.room;if(!room)return;ws.room=null;room.players[ws.slot]=null;resetLobby(room);all(room,{type:'ended',message:'相手がルームを退出しました。'});if(room.players.every(p=>!p))rooms.delete(room.code);else status(room);}
 const neutral=()=>({x:0,y:0,rx:0,ry:0});
 wss.on('connection',(ws,req)=>{
  const origin=req.headers.origin,allowed=(process.env.ALLOWED_ORIGINS||'').split(',');
  if(origin&&origin!==`http://${req.headers.host}`&&origin!==`https://${req.headers.host}`&&!allowed.includes(origin)){ws.close(1008,'Origin not allowed');return;}
  if(wss.clients.size>100){ws.close(1013,'Server full');return;}ws.alive=true;ws.on('pong',()=>ws.alive=true);let budget=0,windowStart=Date.now();
  ws.on('message',bytes=>{if(Date.now()-windowStart>1000){budget=0;windowStart=Date.now();}if(++budget>160){ws.close(1008,'Rate limit');return;}
   let m;try{m=JSON.parse(bytes);}catch{return;}if(!m||typeof m!=='object')return;
   if(m.type==='ping'){send(ws,{type:'pong',time:m.time});return;}if(m.type==='leave'){leave(ws);return;}
   if(m.type==='create'||m.type==='join'){
    if(ws.room)return;let room,slot=0;
    if(m.type==='create'){if(rooms.size>=40){send(ws,{type:'error',message:'ルームが満員です。'});return;}let code;do{code=crypto.randomBytes(4).toString('hex').slice(0,6).toUpperCase();}while(rooms.has(code));room={code,stocks:Number.isInteger(m.stocks)&&m.stocks>=1&&m.stocks<=10?m.stocks:3,players:Array.from({length:[3,4].includes(+m.playerCount)?+m.playerCount:2},()=>null),format:m.format==='teams'&&+m.playerCount>2?'teams':'free',teamAttack:MatchRules.teamAttack(m.teamAttack),playing:false,frame:0,matchId:0,timeLimit:MatchRules.time(m.timeLimit),squadSize:[3,5].includes(+m.squadSize)?+m.squadSize:1,created:Date.now(),touched:Date.now()};rooms.set(code,room);}
    else{room=rooms.get(String(m.code||'').toUpperCase());if(!room||room.playing||room.preparing||room.players.every(Boolean)){send(ws,{type:'error',message:'ルームが見つからないか、対戦中・満員です。'});return;}slot=room.players.findIndex(p=>!p);}
    ws.room=room;ws.slot=slot;room.players[slot]={ws,color:slot?2:0,character:'dragoon',battleTeam:slot%2,ready:false,input:neutral(),pending:{},lastInput:Date.now(),finished:false};send(ws,{type:'joined',slot,code:room.code});status(room);return;
   }
   const room=ws.room,p=room?.players[ws.slot];if(!p)return;
   if(m.matchId!==undefined&&m.matchId!==room.matchId)return;
   if(m.type==='lobby'){if(room.playing||room.preparing){resetLobby(room);all(room,{type:'ended',message:'キャラクター選択へ戻りました。同じ部屋で再戦できます。'});}p.ready=false;status(room);return;}
   if(m.type==='load-error'&&room.preparing&&m.matchId===room.matchId){resetLobby(room);all(room,{type:'error',message:'画像を準備できませんでした。準備完了を押して再試行してください。'});status(room);return;}
   if(m.type==='loaded'&&room.preparing&&m.matchId===room.matchId){p.artReady=true;if(room.players.every(q=>q?.artReady)){room.preparing=false;room.playing=true;room.frame=0;room.started=room.touched=Date.now();room.players.forEach(q=>{q.input=neutral();q.pending={};q.lastInput=room.started;});all(room,{type:'start',config:room.pendingConfig});room.pendingConfig=null;}return;}
   if(m.type==='settings'&&!room.playing&&!room.preparing&&ws.slot===0){hostRules(room,m);status(room);return;}
   if(m.type==='unready'&&!room.playing&&!room.preparing){p.ready=false;status(room);return;}
   if(m.type==='ready'&&!room.playing&&!room.preparing){if(ws.slot===0)hostRules(room,m);p.color=Number.isInteger(m.color)&&m.color>=0&&m.color<5?m.color:0;p.character=m.character==='random'||selectableCharacters.includes(m.character)?m.character:'dragoon';p.battleTeam=m.battleTeam===0||m.battleTeam===1?m.battleTeam:ws.slot%2;const team=Array.from({length:5},(_,n)=>m.team?.[n]==='random'||selectableCharacters.includes(m.team?.[n])?m.team[n]:'random');if(room.squadSize>1&&SquadRules.duplicate(team.slice(0,room.squadSize))){p.ready=false;send(ws,{type:'error',message:'編成内で同じキャラは選べません。出場順を変更してください。'});status(room);return;}p.ready=true;p.team=team;p.settings={stage:StageCatalog.normalize(m.stage),oneOnOne:m.oneOnOne===true};status(room);
    if(room.players.every(q=>q?.ready)){if(room.format==='teams'&&new Set(room.players.map(q=>q.battleTeam)).size<2){room.players.forEach(q=>q.ready=false);all(room,{type:'error',message:'赤・青の両方に参加者を設定してください。'});status(room);return;}room.preparing=true;room.matchId++;room.touched=Date.now();room.players.forEach(q=>{q.artReady=false;q.finished=false;});room.pendingConfig={...room.players[0].settings,matchId:room.matchId,stocks:room.stocks,timeLimit:room.timeLimit,squadSize:room.squadSize,playerCount:room.players.length,format:room.format,teamAttack:room.teamAttack,stage:StageCatalog.chooseOnline(room.players.map(q=>q.settings.stage),n=>crypto.randomInt(n)),players:room.players.map(q=>{const draw=id=>id==='random'?selectableCharacters[crypto.randomInt(selectableCharacters.length)]:id,team=room.squadSize>1?SquadRules.resolve(q.team.slice(0,room.squadSize),selectableCharacters,n=>crypto.randomInt(n)):q.team.slice(0,1).map(draw);return{battleTeam:q.battleTeam,color:q.color,character:room.squadSize>1?team[0]:draw(q.character),team};})};room.revealedConfig=room.squadSize>1?room.pendingConfig:null;status(room);all(room,{type:'prepare',config:room.pendingConfig});}return;
   }
   if(m.type==='input'&&room.playing&&m.input&&typeof m.input==='object'){const input={};for(const k of axes)input[k]=Number.isFinite(m.input[k])?Math.max(-1,Math.min(1,m.input[k])):0;for(const k of flags)input[k]=m.input[k]===true;input.rightStickMode=m.input.rightStickMode==='smash'?'smash':'tilt';input.holdBuffer=false;for(const k of edges)p.pending[k] ||= input[k];p.input=input;p.lastInput=Date.now();return;}
   if(m.type==='finished'&&room.playing){p.finished=true;if(room.players.every(q=>q?.finished)){resetLobby(room);status(room);}return;}
  });ws.on('close',()=>leave(ws));ws.on('error',()=>{});
 });
 function tick(){const now=Date.now();for(const room of rooms.values()){if(room.preparing&&now-room.touched>60000){resetLobby(room);all(room,{type:'error',message:'画像の準備がタイムアウトしました。準備完了を押して再試行してください。'});status(room);}if(!room.playing)continue;if(room.players.every(p=>!p||now-p.lastInput>120000)){resetLobby(room);all(room,{type:'ended',message:'入力がないためロビーへ戻りました。同じ部屋で再戦できます。'});status(room);continue;}
  const inputs=room.players.map(p=>{if(!p||now-p.lastInput>500)return neutral();const i={...p.input,...p.pending};for(const k of edges){i[k]=!!p.pending[k];p.input[k]=false;}p.pending={};return i;});all(room,{type:'frame',matchId:room.matchId,frame:++room.frame,inputs});}}
 let previous=performance.now(),accumulator=0;const timer=setInterval(()=>{const now=performance.now();accumulator+=Math.min(100,now-previous);previous=now;while(accumulator>=1000/60){tick();accumulator-=1000/60;}},4);
 const heartbeat=setInterval(()=>{for(const ws of wss.clients){if(!ws.alive){ws.terminate();continue;}ws.alive=false;ws.ping();}for(const room of rooms.values())if(!room.playing&&Date.now()-room.touched>3600000)room.players.forEach(p=>p?.ws.close(1000,'Room expired'));},15000);
 server.on('close',()=>{clearInterval(timer);clearInterval(heartbeat);wss.close();});return{rooms,wss};
}
module.exports={attachOnline};

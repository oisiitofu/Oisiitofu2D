const {WebSocketServer,WebSocket}=require('ws');
const crypto=require('node:crypto');
const InputCodec=require('./input-codec.js');
const StageCatalog=require('./stage-data.js');
const MatchRules=require('./match-rules.js');
const SquadRules=require('./squad-rules.js');
const BingoRules=require('./bingo-rules.js');
const characters=['tails','etna','django','ratchet','astro','enoch','sam','parappa','octane','jett','reimu','zack','presea','hachiware','tidus','terra','onionknight','arthur','sakura','viewtifuljoe','shionne','genis','ellen','billy','narmaya','wonder','rena','gran','welch','zoe','ky','alphen','ash','judas','rion','sol','miyabi','zero3','dana','edea','riesz','viridi','octoling','chibirobo','dragoon','isaac','ulgrim','chiikawa','chocobo','monokuma','riki','roxas','twob','okami','gundam','vivi','zero','rin','nia','lightning','colette','rean','estelle','noctis','clive','makoto','neku','narukami','naegi','rex','luke','will','kosmos','fayt','emma','ryza','noah','midna','bomberman','sans','lloyd','shiren','pokoa','hunter','adol','terry','valkyrie','agumon','pawapuro','headmaster','sakuna','haseo','terrarian','horse','chef','akira','morphie','fei','human','kitten','elma','goemon','bayleef','metabee','nier','miku','naruhodo','jibanyan','layton','dante','leon','tifa','zidane','yuffie','vincent','kiryu','crash','charlotta','ryofu','mametchi','piposaru','twinbee','aruru','maruku','dietrich','edf','edelgard','guile','sukapon','pneuma','arus','knight','maelle','sumino','rocbouquet','frog','tressa','eve','odio','laharl','deemo','kasane','shadow','saki','aerith','doshin','moogle','greymon','metalgreymon','wargreymon','omegamon','donchan','shizuna','hanajs','hanajk','hanajd','kisuke','ray','alain','hinako','cojicoji','megamanexe','krystal','yuri','hornet','toro','melia','fiora','c4621','malenia','hayabusa','klonoa','katamari','kingbonby','alucard','kurabe','battlemage','karateka','aiai'];
const selectableCharacters=characters.filter(id=>!['greymon','metalgreymon','wargreymon','omegamon','hanajk','hanajd'].includes(id));
const edges=['shareStock','jump','jab','heavy','smash','special','grab','forceTilt'];
function attachOnline(server){
 const wss=new WebSocketServer({server,path:'/online',maxPayload:4096}),rooms=new Map();
 const send=(ws,data)=>{if(ws?.readyState===WebSocket.OPEN&&ws.bufferedAmount<256000)ws.send(JSON.stringify(data));},all=(room,data)=>room.players.forEach(p=>p&&send(p.ws,data));
 const roomList=()=>({type:'rooms',rooms:[...rooms.values()].map(r=>({code:r.code,playerCount:r.players.length,members:r.players.filter(Boolean).length,playing:!!(r.playing||r.preparing),format:r.format,teamAttack:r.teamAttack,stocks:r.stocks,timeLimit:r.timeLimit,squadSize:r.squadSize,ruleSet:r.ruleSet}))});
 const publishRooms=()=>{const data=roomList();for(const ws of wss.clients)if(ws.watchingRooms&&!ws.room)send(ws,data);};
 const status=room=>{
  room.players.forEach((viewer,slot)=>{if(!viewer)return;send(viewer.ws,{type:'room',code:room.code,playing:room.playing,preparing:!!room.preparing,revealed:!!room.revealedConfig,matchId:room.matchId,playerCount:room.players.length,format:room.format,teamAttack:room.teamAttack,stocks:room.stocks,timeLimit:room.timeLimit,squadSize:room.squadSize,oneOnOne:!!room.oneOnOne,ruleSet:room.ruleSet,bingo:BingoRules.view(room.bingo,slot),notice:room.notice||'',players:room.players.map((p,n)=>{
   if(!p)return null;const result={color:p.color,ready:p.ready,battleTeam:p.battleTeam,stage:p.settings?.stage??null};
   if(room.bingo&&!room.bingo.revealed&&n!==slot)return result;
   return{...result,...(room.revealedConfig?{character:room.revealedConfig.players[n].character,team:room.revealedConfig.players[n].team}:room.squadSize===1||n===slot?{character:p.character,team:p.team?.slice(0,room.squadSize)}:{})};
  })});});publishRooms();
 };
 function resetBingo(room,notice=''){
  room.bingoGeneration=(room.bingoGeneration||0)+1;room.bingo=room.ruleSet==='bingo'?BingoRules.create(room.players.map((p,n)=>({battleTeam:p?.battleTeam??n%2})),selectableCharacters,{format:room.format,generation:room.bingoGeneration,choose:n=>crypto.randomInt(n)}):null;
  room.notice=notice;room.revealedConfig=null;room.players.forEach(p=>{if(p)p.ready=false;});
 }
 function cancelBingo(room){if(room.bingo&&!room.bingo.result)BingoRules.cancel(room.bingo);}
 function beginMatch(room){
  if(!room.players.every(p=>p?.ready))return;
  if(room.format==='teams'&&new Set(room.players.map(p=>p.battleTeam)).size<2){room.players.forEach(p=>p.ready=false);cancelBingo(room);all(room,{type:'error',message:'赤・青の両方に参加者を設定してください。'});status(room);return;}
  room.preparing=true;room.matchId++;room.touched=Date.now();room.players.forEach(p=>{p.artReady=false;p.finished=false;p.reportedWinner=undefined;});
  room.pendingConfig={oneOnOne:!!room.oneOnOne,matchId:room.matchId,stocks:room.stocks,timeLimit:room.timeLimit,squadSize:room.squadSize,playerCount:room.players.length,format:room.format,teamAttack:room.teamAttack,ruleSet:room.ruleSet,bingo:BingoRules.view(room.bingo,-1),stage:StageCatalog.chooseOnline(room.players.map(p=>p.settings.stage),n=>crypto.randomInt(n)),players:room.players.map(p=>{
   const draw=id=>id==='random'?selectableCharacters[crypto.randomInt(selectableCharacters.length)]:id,team=room.squadSize>1?SquadRules.resolve(p.team.slice(0,room.squadSize),selectableCharacters,n=>crypto.randomInt(n)):p.team.slice(0,1).map(draw);
   return{battleTeam:p.battleTeam,color:p.color,character:room.squadSize>1?team[0]:draw(p.character),team};
  })};room.revealedConfig=room.squadSize>1||room.bingo?room.pendingConfig:null;status(room);all(room,{type:'prepare',config:room.pendingConfig});
 }
 const resetLobby=room=>{room.playing=room.preparing=false;room.pendingConfig=room.revealedConfig=null;room.touched=Date.now();room.players.forEach(p=>{if(p){p.ready=p.artReady=false;p.input=neutral();p.pending={};}});};
 function hostRules(room,m){
  if(room.bingo&&!room.bingo.result&&room.bingo.picks.some(Boolean)){send(room.players[0].ws,{type:'error',message:'ビンゴの選択確定後はルールを変更できません。カードを配り直すと解除できます。'});return false;}
  const oldIdentity=JSON.stringify([room.players.length,room.format,room.players.map((p,n)=>p?.battleTeam??n%2),room.ruleSet]);
  const count=[2,3,4].includes(+m.playerCount)?+m.playerCount:room.players.length;
  if(room.players.slice(count).some(Boolean)){send(room.players[0].ws,{type:'error',message:'参加者がいる枠は減らせません。'});return false;}
  const next={ruleSet:m.ruleSet===undefined?room.ruleSet:m.ruleSet==='bingo'?'bingo':'normal',stocks:Number.isInteger(m.stocks)&&m.stocks>=1&&m.stocks<=10?m.stocks:room.stocks,timeLimit:m.timeLimit===undefined?room.timeLimit:MatchRules.time(m.timeLimit),squadSize:m.squadSize===undefined?room.squadSize:[3,5].includes(+m.squadSize)?+m.squadSize:1,teamAttack:m.teamAttack===undefined?room.teamAttack:MatchRules.teamAttack(m.teamAttack),oneOnOne:m.oneOnOne===undefined?room.oneOnOne:m.oneOnOne===true,format:count>2?(m.format===undefined?room.format:m.format==='teams'?'teams':'free'):'free'};
  if(next.ruleSet==='bingo')next.squadSize=1;
  let changed=count!==room.players.length||Object.keys(next).some(k=>room[k]!==next[k]);
  room.players.length=count;for(let n=0;n<count;n++)room.players[n]??=null;
  if(Array.isArray(m.battleTeams))room.players.forEach((p,n)=>{if(p&&[0,1].includes(m.battleTeams[n])&&p.battleTeam!==m.battleTeams[n]){p.battleTeam=m.battleTeams[n];changed=true;}});
  Object.assign(room,next);if(changed){room.revealedConfig=null;room.players.forEach(p=>{if(p)p.ready=false;});}if(oldIdentity!==JSON.stringify([room.players.length,room.format,room.players.map((p,n)=>p?.battleTeam??n%2),room.ruleSet]))resetBingo(room,'ルール変更のためカードを配り直しました。');room.touched=Date.now();return true;
 }
 function leave(ws){let room=ws.room;if(!room)return;ws.room=null;room.players[ws.slot]=null;
  if(ws.slot===0){rooms.delete(room.code);for(const p of room.players)if(p){p.ws.room=null;send(p.ws,{type:'room-closed',message:'部屋主が退出したため、ルームを閉じました。'});}publishRooms();return;}
  resetLobby(room);if(room.bingo)resetBingo(room,'参加者の退出によりカードを配り直しました。');all(room,{type:'ended',message:'相手がルームを退出しました。'});status(room);
 }
 const neutral=()=>({x:0,y:0,rx:0,ry:0});
 wss.on('connection',(ws,req)=>{
  const origin=req.headers.origin,allowed=(process.env.ALLOWED_ORIGINS||'').split(',');
  if(origin&&origin!==`http://${req.headers.host}`&&origin!==`https://${req.headers.host}`&&!allowed.includes(origin)){ws.close(1008,'Origin not allowed');return;}
  if(wss.clients.size>100){ws.close(1013,'Server full');return;}ws.alive=true;ws.on('pong',()=>ws.alive=true);let budget=0,windowStart=Date.now();
  ws.on('message',bytes=>{if(Date.now()-windowStart>1000){budget=0;windowStart=Date.now();}if(++budget>160){ws.close(1008,'Rate limit');return;}
   let m;try{m=JSON.parse(bytes);}catch{return;}if(!m||typeof m!=='object')return;
   if(m.type==='ping'){send(ws,{type:'pong',time:m.time});return;}if(m.type==='leave'){leave(ws);return;}
   if(m.type==='list'){ws.watchingRooms=true;send(ws,roomList());return;}
   if(m.type==='create'||m.type==='join'){
    if(ws.room)return;let room,slot=0;
    if(m.type==='create'){if(rooms.size>=40){send(ws,{type:'error',message:'ルームが満員です。'});return;}let code;do{code=crypto.randomBytes(4).toString('hex').slice(0,6).toUpperCase();}while(rooms.has(code));room={code,ruleSet:m.ruleSet==='bingo'?'bingo':'normal',stocks:Number.isInteger(m.stocks)&&m.stocks>=1&&m.stocks<=10?m.stocks:3,players:Array.from({length:[3,4].includes(+m.playerCount)?+m.playerCount:2},()=>null),format:m.format==='teams'&&+m.playerCount>2?'teams':'free',teamAttack:MatchRules.teamAttack(m.teamAttack),oneOnOne:m.oneOnOne===true,playing:false,frame:0,matchId:0,timeLimit:MatchRules.time(m.timeLimit),squadSize:[3,5].includes(+m.squadSize)?+m.squadSize:1,created:Date.now(),touched:Date.now()};if(room.ruleSet==='bingo')room.squadSize=1;resetBingo(room);rooms.set(code,room);}
    else{room=rooms.get(String(m.code||'').toUpperCase());if(!room||room.playing||room.preparing||room.players.every(Boolean)){send(ws,{type:'error',message:'ルームが見つからないか、対戦中・満員です。'});return;}slot=room.players.findIndex(p=>!p);}
    if(m.type==='join'&&room.bingo&&(room.bingo.round>1||room.bingo.result))resetBingo(room,'参加者が変わったためカードを配り直しました。');ws.room=room;ws.slot=slot;ws.compactInput=m.inputFormat===InputCodec.format;room.players[slot]={ws,color:slot?2:0,character:'dragoon',battleTeam:slot%2,ready:false,input:neutral(),pending:{},lastInput:Date.now(),finished:false};send(ws,{type:'joined',slot,code:room.code,...(ws.compactInput?{inputFormat:InputCodec.format}:{})});status(room);return;
   }
   const room=ws.room,p=room?.players[ws.slot];if(!p)return;
   if(m.matchId!==undefined&&m.matchId!==room.matchId)return;
   if(m.type==='lobby'){if(room.bingo&&room.playing&&p.finished){send(ws,{type:'error',message:'全員の対戦結果を集計しています。完了までお待ちください。'});return;}if(room.playing||room.preparing){cancelBingo(room);resetLobby(room);all(room,{type:'ended',message:'キャラクター選択へ戻りました。同じ部屋で再戦できます。'});}if(room.bingo?.result&&!room.bingo.champion){BingoRules.next(room.bingo);resetLobby(room);}if(!room.bingo?.picks[ws.slot])p.ready=false;status(room);return;}
   if(m.type==='load-error'&&room.preparing&&m.matchId===room.matchId){cancelBingo(room);resetLobby(room);all(room,{type:'error',message:'画像を準備できませんでした。準備完了を押して再試行してください。'});status(room);return;}
   if(m.type==='loaded'&&room.preparing&&m.matchId===room.matchId){p.artReady=true;if(room.players.every(q=>q?.artReady)){room.preparing=false;room.playing=true;room.frame=0;room.started=room.touched=Date.now();room.players.forEach(q=>{q.input=neutral();q.pending={};q.lastInput=room.started;});all(room,{type:'start',config:room.pendingConfig});room.pendingConfig=null;publishRooms();}return;}
   if(m.type==='settings'&&!room.playing&&!room.preparing&&ws.slot===0){hostRules(room,m);status(room);return;}
   if(m.type==='unready'&&!room.playing&&!room.preparing){if(room.bingo?.picks[ws.slot])return;p.ready=false;status(room);return;}
   if(m.type==='ready'&&!room.playing&&!room.preparing){if(room.bingo){send(ws,{type:'error',message:'ビンゴカードのマスを選んでください。'});return;}p.color=Number.isInteger(m.color)&&m.color>=0&&m.color<5?m.color:0;p.character=m.character==='random'||selectableCharacters.includes(m.character)?m.character:'dragoon';const team=Array.from({length:5},(_,n)=>m.team?.[n]==='random'||selectableCharacters.includes(m.team?.[n])?m.team[n]:'random');if(room.squadSize>1&&SquadRules.duplicate(team.slice(0,room.squadSize))){p.ready=false;send(ws,{type:'error',message:'編成内で同じキャラは選べません。出場順を変更してください。'});status(room);return;}p.ready=true;p.team=team;p.settings={stage:StageCatalog.normalize(m.stage)};status(room);
    beginMatch(room);return;
   }
   if(m.type==='bingo-next'&&room.bingo&&!room.playing&&!room.preparing){if(BingoRules.next(room.bingo)){resetLobby(room);status(room);}return;}
   if(m.type==='bingo-reset'&&ws.slot===0&&!room.playing&&!room.preparing){resetBingo(room,'新しいビンゴカードを配りました。');status(room);return;}
   if(m.type==='bingo-cancel'&&room.bingo&&!room.playing&&!room.preparing){if(m.generation!==room.bingo.generation||m.bingoRound!==room.bingo.round)return;if(BingoRules.unpick(room.bingo,ws.slot)){p.ready=false;status(room);}return;}
   if(m.type==='bingo-pick'&&room.bingo&&!room.playing&&!room.preparing){
    if(m.generation!==room.bingo.generation||m.bingoRound!==room.bingo.round){send(ws,{type:'error',message:'カードが更新されています。現在のカードから選び直してください。'});return;}
    const choice=BingoRules.pick(room.bingo,ws.slot,m.cell);if(!choice.ok){send(ws,{type:'error',message:choice.message});return;}
    p.character=room.bingo.picks[ws.slot].character;p.team=[p.character];p.color=Number.isInteger(m.color)&&m.color>=0&&m.color<5?m.color:0;p.settings={stage:StageCatalog.normalize(m.stage)};p.ready=true;room.notice='';room.touched=Date.now();status(room);beginMatch(room);return;
   }
   if(m.type==='input'&&room.playing&&m.input&&typeof m.input==='object'){const input=InputCodec.decode(m.input);for(const k of edges)p.pending[k] ||= input[k];p.input=input;p.lastInput=Date.now();return;}
   if(m.type==='finished'&&room.playing){
    if(p.finished)return;
    if(room.bingo&&(!Number.isInteger(m.winner)||!(m.winner===-1||(room.format==='teams'?[0,1].includes(m.winner):m.winner>=0&&m.winner<room.players.length)))){send(ws,{type:'error',message:'対戦結果を確認できませんでした。'});return;}
    p.finished=true;p.reportedWinner=m.winner;
    if(room.players.every(q=>q?.finished)){
     if(room.bingo){if(new Set(room.players.map(q=>q.reportedWinner)).size===1)BingoRules.settle(room.bingo,m.winner);else{BingoRules.cancel(room.bingo);all(room,{type:'error',message:'対戦結果が一致しなかったため、マスを開かず同じ試合をやり直します。'});}}
     if(room.bingo?.result&&!room.bingo.champion)BingoRules.next(room.bingo);
     resetLobby(room);status(room);
    }return;
   }

  });ws.on('close',()=>leave(ws));ws.on('error',()=>{});
 });
 function broadcastFrame(room,inputs){const base={type:'frame',matchId:room.matchId,frame:++room.frame};let plain,compact;for(const p of room.players){const ws=p?.ws;if(ws?.readyState!==WebSocket.OPEN||ws.bufferedAmount>=256000)continue;const wire=ws.compactInput?(compact??=JSON.stringify({...base,inputFormat:InputCodec.format,inputs:inputs.map(InputCodec.encode)})):(plain??=JSON.stringify({...base,inputs}));ws.send(wire);}}
 function tick(){const now=Date.now();for(const room of rooms.values()){if(room.preparing&&now-room.touched>60000){cancelBingo(room);resetLobby(room);all(room,{type:'error',message:'画像の準備がタイムアウトしました。準備完了を押して再試行してください。'});status(room);}if(!room.playing)continue;if(room.players.every(p=>!p||now-p.lastInput>120000)){cancelBingo(room);resetLobby(room);all(room,{type:'ended',message:'入力がないためロビーへ戻りました。同じ部屋で再戦できます。'});status(room);continue;}
  const inputs=room.players.map(p=>{if(!p||now-p.lastInput>500)return neutral();const i={...p.input,...p.pending};for(const k of edges){i[k]=!!p.pending[k];p.input[k]=false;}p.pending={};return i;});broadcastFrame(room,inputs);}}
 let previous=performance.now(),accumulator=0;const timer=setInterval(()=>{const now=performance.now();accumulator+=Math.min(100,now-previous);previous=now;while(accumulator>=1000/60){tick();accumulator-=1000/60;}},4);
 const heartbeat=setInterval(()=>{for(const ws of wss.clients){if(!ws.alive){ws.terminate();continue;}ws.alive=false;ws.ping();}for(const room of rooms.values())if(!room.playing&&Date.now()-room.touched>3600000)room.players.forEach(p=>p?.ws.close(1000,'Room expired'));},15000);
 server.on('close',()=>{clearInterval(timer);clearInterval(heartbeat);wss.close();});return{rooms,wss};
}
module.exports={attachOnline};

'use strict';
const Net=(()=>{
 let socket=null,active=false,starting=false,applying=false,slot=0,code='',inputs=null,config=null,pingTimer=null,lastFrame=0,pending=false,roomPlaying=false,matchId=0,queuedReady=null,loadingReady=false,readyRequestPending=false,preparation=null,roomState=null,outbox=[],compactInput=false;
 const pacing=NetworkPacing.create();
 const $=id=>document.getElementById(id);
 const ruleIds=['match-kind','player-count','battle-format','stock-count','time-limit','squad-size','team-attack','one-on-one'];
 const playerName=id=>PlayerNames.normalize((active?config:roomState)?.players?.[id]?.name)||PlayerNames.normalize(roomState?.players?.[id]?.name)||(id===slot?PlayerNames.current:(id+1)+'P');
 const status=message=>{document.querySelector('#roster-online-status').textContent=message;Roster.summary();document.querySelector('#online-status').textContent=message;document.querySelector('.live').textContent=active?'● ONLINE · '+playerName(slot):'● '+message;};
 const send=data=>{if(socket?.readyState===WebSocket.OPEN)socket.send(JSON.stringify(data));};
 function invitation(value){const url=new URL(location.href);url.searchParams.delete('room');if(value)url.searchParams.set('room',value);if(url.href!==location.href)history.replaceState(history.state,'',url);}
 function refreshResult(){ResultReadiness.refresh({code,slot,pending:readyRequestPending||!!queuedReady||loadingReady,result:state==='result',online:$('battle-mode').value==='online'});}
 function clearRoom(){ResultReadiness.clear();readyRequestPending=false;NetworkStatus.reset();PlayerNames.lock(false);pacing.reset();compactInput=false;BingoBattle.accept(null);roomState=null;preparation=null;roomPlaying=false;matchId=0;queuedReady=null;loadingReady=false;code='';$('open-match-settings').classList.remove('hidden');document.querySelector('#room-code').value='';document.querySelector('#room-id').textContent='';document.querySelector('#network-ping').textContent='';document.querySelector('#room-players').replaceChildren();document.querySelector('#room-match-rule').textContent='';document.querySelector('#room-connect').classList.remove('hidden');document.querySelector('#room-lobby').classList.add('hidden');invitation('');BattlePlayers.refresh();SquadBattle.refresh();refreshResult();}
 function rules(prefix=''){
  const value=id=>$(prefix+id).value;
  return{ruleSet:value('match-kind'),playerCount:+value('player-count'),format:value('battle-format'),stocks:+value('stock-count'),timeLimit:+value('time-limit'),squadSize:+value('squad-size'),teamAttack:value('team-attack')==='on',oneOnOne:$(prefix+'one-on-one').checked};
 }
 function browse(){
  if(!code){$('battle-mode').value='online';$('online-panel').classList.remove('hidden');$('room-create').classList.add('hidden');}
  if(!$('online-room').open)$('online-room').showModal();
  if(!code)openConnection({type:'list'});
 }
 function connect(type,roomCode){
  if(pending||code)return;
  const request={...rules('create-'),type,name:PlayerNames.current,inputFormat:InputCodec.format,code:(roomCode??$('room-code').value).trim().toUpperCase()};
  if(type==='join'&&!/^[A-F0-9]{6}$/.test(request.code)){status('6文字のルームコードを入力してください（0〜9・A〜F）。');return;}
  pending=true;openConnection(request);
 }
 function openConnection(request){
  if(socket?.readyState===WebSocket.OPEN){send(request);return;}
  outbox.push(request);if(socket?.readyState===WebSocket.CONNECTING)return;
  const protocol=location.protocol==='https:'?'wss:':'ws:';socket=new WebSocket(`${protocol}//${location.host}/online`);status('サーバーに接続しています…');const connection=socket;
  socket.onopen=()=>{if(socket!==connection)return;for(const item of outbox.splice(0))send(item);clearInterval(pingTimer);pingTimer=setInterval(()=>send({type:'ping',time:Date.now()}),3000);};
  socket.onmessage=e=>{if(socket!==connection)return;let m=JSON.parse(e.data);
   if(m.type==='rooms')renderRooms(m.rooms);
   if(m.type==='joined'){compactInput=m.inputFormat===InputCodec.format;pending=false;slot=m.slot;$('online-team').value=String(slot%2);code=m.code;$('room-code').value=code;$('room-id').textContent=code;invitation(code);$('room-lobby').classList.remove('hidden');$('room-connect').classList.add('hidden');Roster.open('online');$('online-room').close();status('キャラとステージを選び、ルームで準備完了を押してください。');}
   if(m.type==='room')renderRoom(m);
   if(m.type==='room-closed'){clearRoom();end(m.message);if(state==='menu'){showBrowser();status(m.message);}}
   if(m.type==='prepare'){const ticket={connection,code,matchId:m.config.matchId};preparation=ticket;matchId=ticket.matchId;roomPlaying=true;status('対戦の画像を準備しています…');prepareMatchArt(matchArtPlayers(m.config),m.config.stage).then(()=>{if(preparation!==ticket||socket!==connection||code!==ticket.code)return;send({type:'loaded',matchId:ticket.matchId});status('画像の準備完了 · 相手を待っています');}).catch(()=>{if(preparation!==ticket||socket!==connection)return;preparation=null;send({type:'load-error',matchId:ticket.matchId});status('画像を準備できませんでした。もう一度お試しください。');});}
   if(m.type==='start'){readyRequestPending=false;ResultReadiness.begin(m.config,code);preparation=null;config=m.config;matchId=config.matchId||0;roomPlaying=true;queuedReady=null;document.querySelector('#time-limit').value=String(MatchRules.time(config.timeLimit));document.querySelector('#team-attack').value=MatchRules.teamAttack(config.teamAttack)?'on':'off';document.querySelector('#squad-size').value=String(config.squadSize||1);SquadBattle.refresh();for(const b of document.querySelectorAll('#result .restart')){b.disabled=false;b.textContent='再戦する →';}document.querySelector('#stock-count').value=String(config.stocks||3);document.querySelector('#player-count').value=String(config.players.length);document.querySelector('#battle-format').value=config.format||'free';active=true;starting=true;lastFrame=0;pacing.reset();NetworkStatus.begin(performance.now());document.querySelector('#one-on-one').checked=config.oneOnOne;document.querySelector('#color2').value=String(config.players[1].color);start();frame=0;starting=false;status('対戦中 · '+playerName(slot));refreshResult();}
   if(m.type==='frame'&&(m.matchId===undefined||m.matchId===matchId)&&active&&state==='battle'){if(m.frame!==lastFrame+1){end('通信の遅延で同期が途切れました。ルームから再戦してください。');return;}lastFrame=m.frame;try{pacing.receive(m,performance.now());}catch{end('通信の遅延が大きいため同期を続けられません。ルームから再戦してください。');return;}if(document.hidden)pump(performance.now());}
   if(m.type==='ended')end(m.message);if(m.type==='error'){pending=false;readyRequestPending=false;queuedReady=null;loadingReady=false;status(m.message);BingoBattle.message(m.message);refreshResult();}if(m.type==='pong')document.querySelector('#network-ping').textContent=`${Math.max(0,Date.now()-m.time)} ms`;
  };
  socket.onclose=()=>{if(socket!==connection)return;clearInterval(pingTimer);socket=null;outbox=[];pending=false;const joined=!!(code||active);if(joined){clearRoom();end('接続が切れました。ルームを作成・参加し直してください。');}else status('接続が切れました。「更新」で接続し直せます。');};socket.onerror=()=>{if(socket===connection)status('接続できません。サーバーの起動を確認してください。');};
 }
 function applyFrame(m){inputs=m.inputFormat===InputCodec.format?m.inputs.map(InputCodec.decode):m.inputs;applying=true;try{update();effects();}finally{applying=false;}NetworkStatus.applied(performance.now());dispatchEvent(new CustomEvent('online-frame',{detail:m.frame}));return active&&state==='battle';}
 function pump(now){if(!active||state!=='battle'){NetworkStatus.reset();return 0;}const steps=document.hidden?pacing.flush(applyFrame):pacing.advance(now,applyFrame);NetworkStatus.pump(now,active&&state==='battle',document.hidden);return steps;}
 function capture(){Controls.poll();const input=Controls.read();send({type:'input',matchId,input:compactInput?InputCodec.encode(input):input});Controls.consume();}
 function ready(){if(active||readyRequestPending||queuedReady)return;if(BingoBattle.online&&code){BingoBattle.openOnline();return;}if(!SquadBattle.valid()){status('編成内で同じキャラは選べません。出場枠を変更してください。');return;}if(!code){if(state==='result')document.querySelector('#result .back').click();browse();status('先に部屋を作成するか、一覧から参加してください。');return;}if(!loaded){if(!loadingReady){loadingReady=true;refreshResult();status('画像を読み込んでいます… 完了後に準備完了になります');const wait=()=>{if(!loadingReady)return;if(loaded){loadingReady=false;ready();}else setTimeout(wait,100);};setTimeout(wait,100);}return;}const request={type:'ready',team:SquadBattle.teams.player.slice(),color:selected,character:Roster.selected,stage:document.querySelector('#stage').value};readyRequestPending=true;if(roomPlaying)queuedReady=request;else send({...request,matchId});status('準備完了 · 相手を待っています');refreshResult();}
 function end(message){readyRequestPending=false;NetworkStatus.reset();pacing.reset();preparation=null;queuedReady=null;loadingReady=false;active=false;status(message);if(state==='battle'||state==='pause'){state='result';document.querySelector('#winner').textContent=code?'対戦終了':'接続終了';document.querySelector('#resultdetail').textContent=message;document.querySelector('#stats').textContent='';document.querySelector('#result').classList.remove('hidden');}refreshResult();}
 function leave(){NetworkStatus.reset();const connected=!!(socket||code||active);active=false;pending=false;outbox=[];clearInterval(pingTimer);const connection=socket;socket=null;connection?.close();clearRoom();if(connected)status('部屋を選んで参加するか、ルールを設定して作成してください。');}
 function finished(winner){NetworkStatus.reset();pacing.reset();send({type:'finished',matchId,winner});active=false;status('対戦終了 · 同じ部屋で再戦できます');}
 function returnToSelection(){loadingReady=false;readyRequestPending=false;NetworkStatus.reset();preparation=null;active=false;queuedReady=null;send({type:'lobby',matchId});status('同じ部屋でキャラクターを選び直せます。出場順・ステージを選んで準備完了を押してください。');}
 function selectionChanged(event){
  if(!code||roomPlaying||$('battle-mode').value!=='online')return;
  loadingReady=false;readyRequestPending=false;queuedReady=null;
  const id=event.target.id;
  if(ruleIds.includes(id)){
   if(slot===0)send({type:'settings',matchId,...rules()});
   else if(roomState)renderRoom(roomState);
  }else if(!roomState?.bingo)send({type:'unready',matchId});
 }
 function showBrowser(){
  state='menu';$('menu').classList.remove('hidden');$('result').classList.add('hidden');$('pause').classList.add('hidden');$('home-screen').classList.remove('hidden');$('character-screen').classList.add('hidden');browse();
 }
 function ruleLabel(m){return(m.ruleSet==='bingo'?'ビンゴ対戦 · 2ビンゴ優勝 · '+m.stocks+'ストック':m.squadSize>1?m.squadSize+'キャラ団体戦 · 各1ストック':'通常対戦 · '+m.stocks+'ストック')+' / '+m.playerCount+'人 / '+(m.format==='teams'?'チーム戦 · チームアタック'+(MatchRules.teamAttack(m.teamAttack)?'あり':'なし'):'個人戦')+' / '+MatchRules.timeLabel(m.timeLimit);}
 function renderRooms(rooms){
  const list=$('room-list');list.replaceChildren();
  for(const room of rooms){
   const row=document.createElement('div');row.className='room-list-row';
   const info=document.createElement('div'),title=document.createElement('b'),detail=document.createElement('small');
   title.textContent='ROOM '+room.code+' · '+room.members+'/'+room.playerCount+'人';detail.textContent=ruleLabel(room);info.append(title,detail);
   const button=document.createElement('button');button.className='join-listed-room';button.dataset.code=room.code;button.disabled=room.playing||room.members>=room.playerCount;button.textContent=room.playing?'対戦中':button.disabled?'満員':'参加 →';button.onclick=()=>connect('join',room.code);row.append(info,button);list.append(row);
  }
  if(!rooms.length){const empty=document.createElement('p');empty.textContent='募集中の部屋はありません。部屋をつくって対戦相手を待てます。';list.append(empty);}
  $('refresh-rooms').disabled=false;if(!code&&!pending)status('部屋を選んで参加するか、ルールを設定して作成してください。');
 }
 function renderRoom(m){
  ResultReadiness.accept(m,code);if(m.players[slot]?.ready&&!queuedReady)readyRequestPending=false;
  roomState=m;roomPlaying=!!(m.playing||m.preparing);if(!roomPlaying)preparation=null;matchId=m.matchId||0;
  for(const [id,value] of Object.entries({'match-kind':m.ruleSet||'normal','time-limit':MatchRules.time(m.timeLimit),'team-attack':MatchRules.teamAttack(m.teamAttack)?'on':'off','squad-size':m.squadSize||1,'player-count':m.playerCount||2,'battle-format':m.format||'free','stock-count':m.stocks||3}))$(id).value=String(value);
  $('one-on-one').checked=!!m.oneOnOne;const mine=m.players[slot];if(mine)$('online-team').value=String(mine.battleTeam);
  SquadBattle.refresh();BattlePlayers.refresh();
  $('open-match-settings').classList.toggle('hidden',slot!==0);$('online-lineup-controls').classList.toggle('hidden',slot!==0||!!m.bingo);
  const bingoLocked=!!(m.bingo&&!m.bingo.result&&m.bingo.picks.some(Boolean));
  $('random-room-teams').classList.toggle('hidden',slot!==0||m.format!=='teams');
  $('random-room-teams').disabled=roomPlaying||bingoLocked||m.players.filter(Boolean).length<2;
  for(const id of [...ruleIds,'online-lineup-size'])if(roomPlaying||bingoLocked)$(id).disabled=true;
  PlayerNames.lock(roomPlaying);$('ready-room').disabled=roomPlaying;$('edit-online-lineup').disabled=roomPlaying;
  $('edit-room-rules').classList.toggle('hidden',slot!==0);$('edit-room-rules').disabled=roomPlaying||bingoLocked;$('open-bingo-card').classList.toggle('hidden',!m.bingo);$('open-bingo-card').disabled=roomPlaying;
  $('room-role').textContent=slot===0?'あなたが部屋主です。ルール・チーム分けを変更できます。':'参加者 · ルールとチーム分けは部屋主が設定します。';
  $('edit-online-lineup').textContent=m.bingo?'← ビンゴカードに戻る':'← キャラ・ステージ選択に戻る';
  $('ready-room').textContent=m.bingo?(mine?.ready?'選択確定 · 全員を待っています':'ビンゴのマスを選んで準備完了 →'):m.revealed?'全員準備完了 · 出場順決定':mine?.ready?'準備完了 · 全員を待っています':m.squadSize>1?'出場順を確定 · 準備完了':'準備完了';
  $('room-match-rule').textContent=ruleLabel(m);
  const list=$('room-players');list.replaceChildren();m.players.forEach((p,n)=>{
   const el=document.createElement('div');el.className='room-player';el.textContent=p?`${playerName(n)} ${n===0?'部屋主':n===slot?'あなた':'参加者'}${m.format==='teams'?' / '+(p.battleTeam===0?'赤':'青'):''} · ${p.ready?'準備完了':'キャラ選択中'}${p.stage===null||p.stage===undefined?'':' · 希望：'+StageCatalog.name(p.stage)}`:`${n+1}P · 参加待ち`;
   if(p&&m.format==='teams'&&slot===0){const team=document.createElement('select');team.className='room-team';team.setAttribute('aria-label',playerName(n)+'のチーム');for(const [value,text] of [[0,'赤チーム'],[1,'青チーム']])team.add(new Option(text,value));team.value=String(p.battleTeam);team.disabled=roomPlaying||bingoLocked;team.onchange=()=>send({type:'settings',matchId,battleTeams:m.players.map((q,k)=>k===n?+team.value:q?.battleTeam??k%2)});el.append(team);}
   if((n===slot||m.revealed)&&p?.ready&&m.squadSize>1&&p.team){const lineup=document.createElement('span');lineup.className='room-lineup';lineup.textContent=p.team.map((id,n)=>(n+1)+'. '+(Roster.definitions.find(d=>d.id===id)?.name||'おまかせ')).join(' → ');el.append(lineup);}else if(p&&n!==slot&&m.squadSize>1){const hidden=document.createElement('span');hidden.className='room-lineup concealed';hidden.textContent='出場キャラは全員の準備完了後に公開';el.append(hidden);}list.append(el);
  });Roster.fit();BingoBattle.accept(m.bingo||null);if(m.notice&&m.bingo)status(m.notice);
  if(!roomPlaying&&queuedReady){const request=queuedReady;queuedReady=null;send({...request,matchId});}
  refreshResult();
 }
 function init(){PlayerNames.init();addEventListener('online-name-change',()=>{if(code&&!roomPlaying)send({type:'profile',matchId,name:PlayerNames.current});Roster.refreshSelection();});
  const labels={'match-kind':'対戦ルール','player-count':'対戦人数','battle-format':'対戦形式','stock-count':'ストック数','time-limit':'制限時間','squad-size':'編成','team-attack':'チームアタック','one-on-one':'1対1ダメージ補正（1.2倍）'};
  for(const id of ruleIds){const label=document.createElement('label');label.textContent=labels[id];const field=$(id).cloneNode(true);field.id='create-'+id;field.disabled=false;label.append(field);if(id==='one-on-one')label.className='check-row';$('room-create-fields').append(label);}
  const updateCreate=()=>{const bingo=$('create-match-kind').value==='bingo';if(bingo)$('create-squad-size').value='1';$('create-squad-size').disabled=bingo;const teams=$('create-battle-format').value==='teams';if(teams&&+$('create-player-count').value<3)$('create-player-count').value='4';$('create-team-attack').closest('label').classList.toggle('hidden',!teams);$('create-stock-count').disabled=+$('create-squad-size').value>1;};
  for(const id of ruleIds)$('create-'+id).addEventListener('change',updateCreate);updateCreate();
  $('open-room-create').onclick=()=>{$('room-create').classList.remove('hidden');$('create-player-count').focus();};$('cancel-room-create').onclick=()=>$('room-create').classList.add('hidden');
  $('refresh-rooms').onclick=()=>openConnection({type:'list'});
  $('edit-room-rules').onclick=()=>{$('online-room').close();$('match-settings').showModal();};
  $('random-room-teams').onclick=()=>{
   const m=roomState;if(!m||slot!==0||roomPlaying||m.format!=='teams'||m.bingo&&!m.bingo.result&&m.bingo.picks.some(Boolean))return;
   const members=m.players.flatMap((p,n)=>p?[n]:[]);if(members.length<2)return;
   const teams=MatchRules.randomTeams(members.length),battleTeams=m.players.map((p,n)=>p?.battleTeam??n%2);
   members.forEach((n,k)=>battleTeams[n]=teams[k]);send({type:'settings',matchId,battleTeams});
  };
  document.addEventListener('change',event=>{if(event.target.closest('#match-settings')||['stage','squad-lineup'].includes(event.target.id))selectionChanged(event);});document.addEventListener('click',event=>{if(event.target.closest('.fighter-card,.squad-slot,.stage-card,#swatches button'))selectionChanged(event);});
  $('online-exit').onclick=()=>$('pause').querySelector('.back').click();$('create-room').onclick=()=>connect('create');$('join-room').onclick=()=>connect('join');$('ready-room').onclick=ready;
  $('open-bingo-card').onclick=()=>BingoBattle.openOnline(false);
  $('edit-online-lineup').onclick=()=>{if(BingoBattle.online){BingoBattle.openOnline(false);return;}$('online-room').close();(document.querySelector('#squad-lineup .squad-slot.active')||document.querySelector('.fighter-card.selected'))?.focus();};
  $('leave-room').onclick=()=>{leave();showBrowser();};
  $('copy-room').onclick=async()=>{const inviteCode=code;if(!inviteCode)return;const url=new URL(location.href);url.searchParams.delete('room');url.searchParams.set('room',inviteCode);try{await navigator.clipboard.writeText(url.href);if(code===inviteCode)status('招待リンクをコピーしました');}catch{if(code===inviteCode)status('ルームコード '+inviteCode+' を相手に伝えてください');}};
  const entry=new URLSearchParams(location.search);if(entry.get('mode')==='online'||/^[A-Fa-f0-9]{6}$/.test(entry.get('room')||'')){browse();if(entry.get('room')){$('room-code').value=entry.get('room').toUpperCase();$('room-code').closest('details').open=true;}}
 }
 return{init,browse,ready,pump,playerName,refreshResult,get lineupLocked(){return roomPlaying||active;},get quality(){return {...pacing.metrics,inputFormat:compactInput?InputCodec.format:'legacy'};},bingo(type,data={}){if(roomPlaying){status('対戦の準備中・対戦中はカードを変更できません。');return;}send({type,matchId,...data});},returnToSelection,leave,capture,finished,status,get active(){return active},get starting(){return starting},get applying(){return applying},get inputs(){return inputs},get slot(){return slot},get code(){return code},get config(){return config}};
})();

'use strict';
const Net=(()=>{
 let socket=null,active=false,starting=false,applying=false,slot=0,code='',inputs=null,config=null,pingTimer=null,lastFrame=0,pending=false;
 const status=message=>{document.querySelector('#roster-online-status').textContent=message;Roster.summary();document.querySelector('#online-status').textContent=message;document.querySelector('.live').textContent=active?'● ONLINE · '+(slot+1)+'P':'● '+message;};
 const send=data=>{if(socket?.readyState===WebSocket.OPEN)socket.send(JSON.stringify(data));};
 function invitation(value){const url=new URL(location.href);url.searchParams.delete('room');if(value)url.searchParams.set('room',value);if(url.href!==location.href)history.replaceState(history.state,'',url);}
 function clearRoom(){code='';document.querySelector('#room-code').value='';document.querySelector('#room-id').textContent='';document.querySelector('#network-ping').textContent='';document.querySelector('#room-players').replaceChildren();document.querySelector('#room-connect').classList.remove('hidden');document.querySelector('#room-lobby').classList.add('hidden');invitation('');}
 function connect(type){
  if(pending||code)return;
  // Capture the invitation at the click, not after an asynchronous connection.
  const request={stocks:BattlePlayers.stockCount(),playerCount:BattlePlayers.count(),format:document.querySelector('#battle-format').value,type,code:document.querySelector('#room-code').value.trim().toUpperCase()};
  if(type==='join'&&!/^[A-F0-9]{6}$/.test(request.code)){status('6文字のルームコードを入力してください（0〜9・A〜F）。');return;}
  pending=true;
  if(socket?.readyState===WebSocket.OPEN){send(request);return;}
  const protocol=location.protocol==='https:'?'wss:':'ws:';socket=new WebSocket(`${protocol}//${location.host}/online`);status('サーバーに接続しています…');const connection=socket;
  socket.onopen=()=>{if(socket!==connection)return;send(request);clearInterval(pingTimer);pingTimer=setInterval(()=>send({type:'ping',time:Date.now()}),3000);};
  socket.onmessage=e=>{if(socket!==connection)return;let m=JSON.parse(e.data);
   if(m.type==='joined'){pending=false;slot=m.slot;document.querySelector('#online-team').value=String(slot%2);code=m.code;document.querySelector('#room-code').value=code;document.querySelector('#room-id').textContent=code;invitation(code);document.querySelector('#room-lobby').classList.remove('hidden');document.querySelector('#room-connect').classList.add('hidden');status('ルームに参加しました。準備完了を押してください。');}
   if(m.type==='room'){document.querySelector('#player-count').value=String(m.playerCount||2);document.querySelector('#battle-format').value=m.format||'free';if(m.stocks)document.querySelector('#stock-count').value=String(m.stocks);BattlePlayers.refresh();const list=document.querySelector('#room-players');list.replaceChildren();m.players.forEach((p,n)=>{let el=document.createElement('div');el.className='room-player';el.textContent=p?`${n+1}P ${n===slot?'あなた':'相手'}${m.format==='teams'?' / '+(p.battleTeam===0?'赤':'青'):''} · ${p.ready?'準備完了':'キャラ選択中'}${p.stage===null||p.stage===undefined?'':' · 希望：'+StageCatalog.name(p.stage)}`:`${n+1}P · 参加待ち`;list.append(el);});}
   if(m.type==='start'){config=m.config;document.querySelector('#stock-count').value=String(config.stocks||3);document.querySelector('#player-count').value=String(config.players.length);document.querySelector('#battle-format').value=config.format||'free';active=true;starting=true;lastFrame=0;document.querySelector('#one-on-one').checked=config.oneOnOne;document.querySelector('#color2').value=String(config.players[1].color);start();frame=0;starting=false;status('対戦中 · '+(slot+1)+'P');}
   if(m.type==='frame'&&active&&state==='battle'){if(m.frame!==lastFrame+1){end('通信の遅延で同期が途切れました。ルームから再戦してください。');return;}lastFrame=m.frame;inputs=m.inputs;applying=true;update();effects();applying=false;dispatchEvent(new CustomEvent('online-frame',{detail:m.frame}));}
   if(m.type==='ended')end(m.message);if(m.type==='error'){pending=false;status(m.message);}if(m.type==='pong')document.querySelector('#network-ping').textContent=`${Math.max(0,Date.now()-m.time)} ms`;
  };
  socket.onclose=()=>{if(socket!==connection)return;clearInterval(pingTimer);socket=null;pending=false;const joined=!!(code||active);if(joined){clearRoom();end('接続が切れました。ルームを作成・参加し直してください。');}};socket.onerror=()=>{if(socket===connection)status('接続できません。サーバーの起動を確認してください。');};
 }
 function capture(){Controls.poll();send({type:'input',input:Controls.read()});Controls.consume();}
 function ready(){if(!code){document.querySelector('#online-room').showModal();status('先にルームを作成するか、コードで参加してください。');return;}send({type:'ready',stocks:BattlePlayers.stockCount(),battleTeam:+document.querySelector('#online-team').value,squadSize:SquadBattle.size(),team:SquadBattle.teams.player.slice(),color:selected,character:Roster.selected,stage:document.querySelector('#stage').value,oneOnOne:document.querySelector('#one-on-one').checked});status('準備完了 · 相手を待っています');}
 function end(message){active=false;status(message);if(state==='battle'||state==='pause'){state='result';document.querySelector('#winner').textContent='接続終了';document.querySelector('#resultdetail').textContent=message;document.querySelector('#stats').textContent='';document.querySelector('#result').classList.remove('hidden');}}
 function leave(){const connected=!!(socket||code||active);active=false;pending=false;clearInterval(pingTimer);const connection=socket;socket=null;connection?.close();clearRoom();if(connected)status('ルームを作成するか、コードで参加してください。');}
 function finished(){send({type:'finished'});active=false;}
 function init(){document.querySelector('#online-exit').onclick=()=>document.querySelector('#pause .back').click();document.querySelector('#create-room').onclick=()=>connect('create');document.querySelector('#join-room').onclick=()=>connect('join');document.querySelector('#ready-room').onclick=ready;document.querySelector('#leave-room').onclick=leave;document.querySelector('#copy-room').onclick=async()=>{const inviteCode=code;if(!inviteCode)return;const url=new URL(location.href);url.searchParams.delete('room');url.searchParams.set('room',inviteCode);try{await navigator.clipboard.writeText(url.href);if(code===inviteCode)status('招待リンクをコピーしました');}catch{if(code===inviteCode)status('ルームコード '+inviteCode+' を相手に伝えてください');}};}
 return{init,ready,leave,capture,finished,status,get active(){return active},get starting(){return starting},get applying(){return applying},get inputs(){return inputs},get slot(){return slot},get code(){return code},get config(){return config}};
})();

'use strict';
const BingoBattle=(()=>{
 let online=null,waitingResult=false,menuWasHidden=false,topbarWasInert=false,draft=null,pendingAction=null;
 const $=id=>document.getElementById(id),isOnline=()=>$('battle-mode').value==='online';
 const enabled=()=>isOnline()&&!!online&&!!Net.code;
 const current=()=>online,seat=()=>Net.slot;
 const ownerName=key=>key.startsWith('team:')?(key==='team:0'?'赤チーム':'青チーム'):Net.playerName(+key.split(':')[1]);
 const name=id=>Roster.definitions.find(d=>d.id===id)?.name||id;
 function picture(id){const img=document.createElement('img');img.alt='';const url=ArtLoader.thumbnail(id)?.src||ArtLoader.portrait(id,0,0,true);if(url)img.src=url;return img;}
 function isOpen(){return !$('bingo-select').classList.contains('hidden');}
 function close(){if(!isOpen())return;$('bingo-select').classList.add('hidden');document.querySelector('.topbar').inert=topbarWasInert;if(!menuWasHidden)$('menu').classList.remove('hidden');}
 function message(value){if(isOpen())$('bingo-help').textContent=value;if(state==='result'&&enabled())$('resultdetail').textContent=value;}
 function progress(s,container){container.replaceChildren();for(const b of s.boards){const chip=document.createElement('span');chip.className='bingo-score';chip.textContent=ownerName(b.key)+' · '+b.lines+' / 2 BINGO'+(s.champion===b.key?' · 優勝！':'');container.append(chip);}}
 function renderBoards(s,container,selecting){
  container.replaceChildren();container.dataset.count=String(s.boards.length);
  const n=seat(),myKey=BingoRules.key(s,n),allowed=new Set(selecting?BingoRules.available(s,n):[]);
  for(const b of s.boards){
   const mine=b.key===myKey,panel=document.createElement('section');panel.className='bingo-board'+(mine?' mine':'');panel.dataset.board=b.key;
   const head=document.createElement('header'),title=document.createElement('h3'),score=document.createElement('span');title.textContent=ownerName(b.key)+(mine?' · あなた':'');
   const members=s.picks.flatMap((_,k)=>BingoRules.key(s,k)===b.key?[Net.playerName(k)]:[]);if(s.format==='teams')title.textContent+=' ('+members.join(' / ')+')';
   score.className='bingo-board-score';score.textContent=b.lines+' / 2 BINGO · '+b.open.filter(Boolean).length+' / 25 OPEN';head.append(title,score);panel.append(head);
   const grid=document.createElement('div');grid.className='bingo-grid';if(selecting&&mine)grid.id='bingo-grid';grid.setAttribute('aria-label',ownerName(b.key)+'のビンゴカード');
   const completed=new Set(BingoRules.complete(b).flat()),chosen=new Set(s.picks.flatMap((p,k)=>p?.character&&BingoRules.key(s,k)===b.key&&(!selecting||k!==n||draft===null)?[p.cell]:[]));if(selecting&&mine&&draft!==null)chosen.add(draft);
   b.cells.forEach((id,index)=>{
    const button=document.createElement('button');button.className='bingo-cell'+(!selecting||!mine?' bingo-watch':'');button.dataset.cell=index;button.disabled=!selecting||!mine||!allowed.has(index);button.classList.toggle('opened',b.open[index]);button.classList.toggle('bingo-line',completed.has(index));button.classList.toggle('chosen',chosen.has(index));
    const badge=document.createElement('small');badge.className='bingo-cell-badge';badge.textContent=b.open[index]?'✓ OPEN':chosen.has(index)?s.revealed?'使用決定':'選択中':b.previous.includes(id)?'前の試合':'';
    if(id){button.append(picture(id));const label=document.createElement('span');label.textContent=name(id);button.append(label);button.setAttribute('aria-label',name(id)+(b.open[index]?' 開放済み':b.previous.includes(id)?' 連続使用不可':chosen.has(index)?s.revealed?' 選択確定':' 選択中・全員が選ぶまで変更可能':mine&&selecting?' このキャラを選ぶ':''));}else{button.classList.add('free');button.textContent='★';const label=document.createElement('span');label.textContent='FREE';button.append(label);button.setAttribute('aria-label','中央 FREE 開放済み');}
    button.title=button.getAttribute('aria-label');button.append(badge);if(selecting&&mine)button.onclick=()=>choose(index);grid.append(button);
   });panel.append(grid);container.append(panel);
  }
 }
 function render(){
  const s=current();if(!s||!isOpen())return;
  const n=seat(),b=BingoRules.board(s,n);if(!b)return;
  $('bingo-round').textContent='ROUND '+s.round;$('bingo-owner').textContent='全員のビンゴカード';
  $('bingo-help').textContent=s.champion?ownerName(s.champion)+'が2ビンゴで優勝！':s.revealed?'全員の選択が確定しました。対戦を準備しています。':s.picks[n]?'決定済み · 全員が決定するまではキャンセル・変更できます。':draft!==null?name(b.cells[draft])+'を選択中。「決定」で準備完了になります。':'マスを選んでから「決定」を押してください。選択は全員が決定するまで秘密です。';
  progress(s,$('bingo-progress'));const list=$('bingo-picks');list.replaceChildren();s.picks.forEach((p,k)=>{const chip=document.createElement('div');chip.className='bingo-player-pick';const who=Net.playerName(k);chip.textContent=who+' · '+(p?.selected||p?.character?s.revealed?'確定済み':'選択済み':'選択中');if(s.revealed&&p?.character){chip.textContent='';chip.append(picture(p.character),document.createTextNode(who+' · '+name(p.character)));}list.append(chip);});
  renderBoards(s,$('bingo-boards'),true);
  $('bingo-stage').value=$('stage').value;$('bingo-stage').disabled=!!s.picks[n]||!!s.result||!!s.champion;
  $('bingo-reset').classList.toggle('hidden',Net.slot!==0);$('bingo-reset').disabled=!!Net.active;
  $('bingo-next').classList.add('hidden');$('bingo-confirm').disabled=s.revealed||!!s.champion||!!s.result||draft===null||!!s.picks[n]||!!pendingAction;$('bingo-confirm').textContent=s.picks[n]?'決定済み · 他のプレイヤーを待っています':'このキャラで決定';$('bingo-cancel').disabled=s.revealed||!!s.champion||!!pendingAction||draft===null&&!s.picks[n];
 }
 function show(){if($('online-room').open)$('online-room').close();if($('match-settings').open)$('match-settings').close();if(!isOpen()){menuWasHidden=$('menu').classList.contains('hidden');topbarWasInert=document.querySelector('.topbar').inert;}$('menu').classList.add('hidden');document.querySelector('.topbar').inert=true;$('bingo-select').classList.remove('hidden');render();}
 function openOnline(next=true){
  if(!online||!Net.code)return;
  if(next&&online.champion){if(Net.slot===0)Net.bingo('bingo-reset');}else if(next&&online.result)Net.bingo('bingo-next');
  show();
 }
 function sendChoice(type,data={}){Net.bingo(type,{generation:online.generation,bingoRound:online.round,...data});}
 function choose(cell){if(!enabled()||online.revealed||online.result||online.champion||!BingoRules.available(online,seat()).includes(cell)||pendingAction)return;if(online.picks[seat()]){pendingAction='cancel';sendChoice('bingo-cancel');}draft=cell;render();}
 function confirm(){if(draft===null||pendingAction||online?.picks[seat()]||!enabled()||online.revealed||!BingoRules.available(online,seat()).includes(draft))return;pendingAction='pick';sendChoice('bingo-pick',{cell:draft,color:selected,stage:$('stage').value});render();}
 function cancel(){if(!enabled()||online.revealed||pendingAction)return;draft=null;if(online.picks[seat()]){pendingAction='cancel';sendChoice('bingo-cancel');}render();}
 function accept(s){
  const previous=online;online=s;const changed=!previous||!s||s.generation!==previous.generation||s.round!==previous.round;if(changed){draft=null;pendingAction=null;}else if(pendingAction==='pick'&&s.picks[seat()]||pendingAction==='cancel'&&!s.picks[seat()])pendingAction=null;const locked=!!(isOnline()&&s?.picks[Net.slot]&&!s.result);for(const field of document.querySelectorAll('#stage,.stage-card,#swatches button'))field.disabled=locked;if(!s){$('result').querySelector('.back').disabled=false;waitingResult=false;if(isOnline())close();$('bingo-result-summary').classList.add('hidden');return;}
  if(s.result||!s.revealed)waitingResult=false;
  const returned=state==='result'&&previous?.revealed&&!s.revealed&&!s.champion;
  if((changed||returned)&&!s.champion&&(state==='menu'||state==='result')){if(returned||previous&&s.generation===previous.generation&&s.round>previous.round){state='menu';$('result').classList.add('hidden');$('battlebar').classList.add('hidden');$('result').classList.remove('presentation-pending');}show();}else render();
  decorateResult();
 }
 function finished(){if(!enabled()){$('bingo-result-summary').classList.add('hidden');$('result').querySelector('.back').disabled=false;$('result').querySelector('.back').textContent='キャラクター選択へ';for(const b of document.querySelectorAll('#result .restart')){b.disabled=false;b.textContent='再戦する →';}return;}waitingResult=true;decorateResult();}
 function decorateResult(){
  if(typeof state==='undefined'||state!=='result')return;const s=current(),summary=$('bingo-result-summary');summary.classList.toggle('hidden',!enabled()||!s);if(!enabled()||!s)return;
  progress(s,summary);const boards=document.createElement('div');boards.className='bingo-boards bingo-result-boards';renderBoards(s,boards,false);summary.append(boards);const pending=isOnline()&&(waitingResult||!s.result&&!s.champion&&s.revealed);
  if(s.champion){$('winner').textContent=ownerName(s.champion)+' · 2 BINGO!';$('resultdetail').textContent=ownerName(s.champion)+'のビンゴ対戦優勝！';}
  else if(s.result)$('resultdetail').textContent=(s.result.winner<0?'引き分け。マスは開きません。':'1位の使用マスを開きました。')+' 2ビンゴで優勝。前の試合に自分・相方が使ったキャラは次の試合に使えません。';
  else if(pending)$('resultdetail').textContent='全員の対戦結果を集計しています…';
  for(const button of document.querySelectorAll('#result .restart')){button.disabled=pending||!!(isOnline()&&s.champion&&Net.slot!==0);button.textContent=pending?'結果を集計中…':s.champion?isOnline()&&Net.slot!==0?'部屋主のカード配布を待っています':'新しいカードでビンゴ対戦':'次の試合のマスを選ぶ →';}
  $('result').querySelector('.back').disabled=pending;$('result').querySelector('.back').textContent='ビンゴカード / 設定へ';
 }
 function drawReveal(){
  const c=Net.active?Net.config:null;if(c?.ruleSet!=='bingo'||countdown<=0)return false;
  const height=110+fighters.length*74,top=(H-height)/2;ctx.save();path([[250,top],[1190,top],[1190,top+height],[250,top+height]],'#0b1424f2','#ffcc6699',1);text('ビンゴ対戦 · 使用キャラ決定',720,top+34,23,'#ffdc95');text('ROUND '+c.bingo.round+' / '+Math.ceil(countdown/60),720,top+58,12,'#d1e3ff');
  fighters.forEach((f,n)=>{const y=top+80+n*74,img=ArtLoader.hudPortrait(f.characterId,f.color);if(img)ctx.drawImage(img,440,y,60,46);text(playerLabel(n),370,y+30,15,BattlePlayers.color(f));text(name(f.characterId),710,y+30,20,'#f5f8ff');});ctx.restore();return true;
 }
 function init(){
  for(const [value,label] of [['random','おまかせ'],...StageCatalog.stages.map(s=>[s.id,s.name])])$('bingo-stage').add(new Option(label,value));
  $('bingo-stage').onchange=()=>{$('stage').value=$('bingo-stage').value;$('stage').dispatchEvent(new Event('change',{bubbles:true}));};
  $('bingo-next').onclick=()=>openOnline();
  $('bingo-confirm').onclick=confirm;$('bingo-cancel').onclick=cancel;
  $('bingo-room').onclick=()=>Net.browse();
  $('bingo-reset').onclick=()=>Net.bingo('bingo-reset');
  $('match-kind').onchange=()=>{if($('match-kind').value==='bingo')$('squad-size').value='1';SquadBattle.refresh();BattlePlayers.refresh();Roster.summary();};
  addEventListener('keydown',e=>{if(isOpen()&&e.code==='Escape'&&!document.querySelector('dialog[open]')){e.preventDefault();Net.browse();}});
  for(const button of document.querySelectorAll('#result .back'))button.addEventListener('click',()=>{if(enabled())openOnline(false);});
 }
 return{init,enabled,openOnline,accept,finished,decorateResult,drawReveal,message,close,isOpen,get round(){return current()?.round||1},get online(){return online}};
})();

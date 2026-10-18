'use strict';
const BingoBattle=(()=>{
 let online=null,waitingResult=false;
 const $=id=>document.getElementById(id),isOnline=()=>$('battle-mode').value==='online';
 const enabled=()=>isOnline()&&!!online&&!!Net.code;
 const current=()=>online,seat=()=>Net.slot;
 const ownerName=key=>key.startsWith('team:')?(key==='team:0'?'赤チーム':'青チーム'):(+key.split(':')[1]+1)+'P';
 const name=id=>Roster.definitions.find(d=>d.id===id)?.name||id;
 function picture(id){const img=document.createElement('img');img.alt='';const url=ArtLoader.thumbnail(id)?.src||ArtLoader.portrait(id,0,0,true);if(url)img.src=url;return img;}
 function close(){if($('bingo-select').open)$('bingo-select').close();}
 function message(value){if($('bingo-select').open)$('bingo-help').textContent=value;if(state==='result'&&enabled())$('resultdetail').textContent=value;}
 function progress(s,container){container.replaceChildren();for(const b of s.boards){const chip=document.createElement('span');chip.className='bingo-score';chip.textContent=ownerName(b.key)+' · '+b.lines+' / 2 BINGO'+(s.champion===b.key?' · 優勝！':'');container.append(chip);}}
 function render(){
  const s=current();if(!s||!$('bingo-select').open)return;
  const n=seat(),b=BingoRules.board(s,n);if(!b)return;
  $('bingo-round').textContent='ROUND '+s.round;$('bingo-owner').textContent=ownerName(b.key)+'のビンゴカード';
  $('bingo-help').textContent=s.champion?ownerName(s.champion)+'が2ビンゴで優勝！':s.result?'勝った側の使用マスが開きました。次の試合へ進めます。':s.picks[n]?'選択確定 · 変更できません。全員の選択を待っています。':'マスを押すと使用キャラを確定します。全員が選ぶまで、味方にも相手にも秘密です。';
  progress(s,$('bingo-progress'));const list=$('bingo-picks');list.replaceChildren();s.picks.forEach((p,k)=>{const chip=document.createElement('div');chip.className='bingo-player-pick';const who=(k+1)+'P';chip.textContent=who+' · '+(p?.locked||p?.character?'確定済み':'選択中');if(s.revealed&&p?.character){chip.textContent='';chip.append(picture(p.character),document.createTextNode(who+' · '+name(p.character)+' / '+String.fromCharCode(65+p.cell%5)+(Math.floor(p.cell/5)+1)));}list.append(chip);});
  const cards=$('bingo-grid');cards.replaceChildren();const allowed=new Set(BingoRules.available(s,n)),completed=new Set(BingoRules.complete(b).flat());
  b.cells.forEach((id,index)=>{
   const button=document.createElement('button');button.className='bingo-cell';button.dataset.cell=index;button.disabled=!allowed.has(index);button.classList.toggle('opened',b.open[index]);button.classList.toggle('bingo-line',completed.has(index));button.classList.toggle('chosen',s.picks[n]?.cell===index);
   const coordinate=String.fromCharCode(65+index%5)+(Math.floor(index/5)+1),badge=document.createElement('small');badge.className='bingo-cell-badge';badge.textContent=b.open[index]?'✓ OPEN':s.picks[n]?.cell===index?'使用決定':b.previous.includes(id)?'前の試合':coordinate;
   if(id){button.append(picture(id));const label=document.createElement('span');label.textContent=name(id);button.append(label);button.setAttribute('aria-label',coordinate+' '+name(id)+(b.open[index]?' 開放済み':b.previous.includes(id)?' 連続使用不可':s.picks[n]?.cell===index?' 選択確定':' 使用を確定'));}else{button.classList.add('free');button.textContent='★';const label=document.createElement('span');label.textContent='FREE';button.append(label);button.setAttribute('aria-label','中央 FREE 開放済み');}
   button.append(badge);button.onclick=()=>choose(index);cards.append(button);
  });
  $('bingo-stage').value=$('stage').value;$('bingo-stage').disabled=!!s.picks[n]||!!s.result||!!s.champion;
  $('bingo-reset').classList.toggle('hidden',Net.slot!==0);$('bingo-reset').disabled=!!Net.active;
  $('bingo-next').classList.toggle('hidden',!s.result||!!s.champion);$('bingo-next').textContent='次の試合のマスを選ぶ →';
 }
 function show(){if($('online-room').open)$('online-room').close();if($('match-settings').open)$('match-settings').close();if(!$('bingo-select').open)$('bingo-select').showModal();render();}
 function openOnline(next=true){
  if(!online||!Net.code)return;
  if(next&&online.champion){if(Net.slot===0)Net.bingo('bingo-reset');}else if(next&&online.result)Net.bingo('bingo-next');
  show();
 }
 function choose(cell){if(enabled())Net.bingo('bingo-pick',{generation:online.generation,bingoRound:online.round,cell,color:selected,stage:$('stage').value});}
 function accept(s){
  const previous=online;online=s;const locked=!!(isOnline()&&s?.picks[Net.slot]&&!s.result);for(const field of document.querySelectorAll('#stage,.stage-card,#swatches button'))field.disabled=locked;if(!s){$('result').querySelector('.back').disabled=false;waitingResult=false;if(isOnline())close();$('bingo-result-summary').classList.add('hidden');return;}
  if(s.result||!s.revealed)waitingResult=false;
  if(state==='menu'&&(!previous||s.generation!==previous.generation))show();else render();
  decorateResult();
 }
 function finished(){if(!enabled()){$('bingo-result-summary').classList.add('hidden');$('result').querySelector('.back').disabled=false;$('result').querySelector('.back').textContent='キャラクター選択へ';for(const b of document.querySelectorAll('#result .restart')){b.disabled=false;b.textContent='再戦する →';}return;}waitingResult=true;decorateResult();}
 function decorateResult(){
  if(typeof state==='undefined'||state!=='result')return;const s=current(),summary=$('bingo-result-summary');summary.classList.toggle('hidden',!enabled()||!s);if(!enabled()||!s)return;
  progress(s,summary);const pending=isOnline()&&(waitingResult||!s.result&&!s.champion&&s.revealed);
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
  $('close-bingo').onclick=close;$('bingo-next').onclick=()=>openOnline();
  $('bingo-room').onclick=()=>{close();Net.browse();};
  $('bingo-reset').onclick=()=>Net.bingo('bingo-reset');
  $('match-kind').onchange=()=>{if($('match-kind').value==='bingo')$('squad-size').value='1';SquadBattle.refresh();BattlePlayers.refresh();Roster.summary();};
  for(const button of document.querySelectorAll('#result .back'))button.addEventListener('click',()=>{if(enabled())openOnline(false);});
 }
 return{init,enabled,openOnline,accept,finished,decorateResult,drawReveal,message,close,get round(){return current()?.round||1},get online(){return online}};
})();

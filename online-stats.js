'use strict';

addEventListener('DOMContentLoaded',()=>{
 const dialog=document.createElement('dialog');
 dialog.id='online-stats';
 dialog.className='setup-dialog';
 dialog.setAttribute('aria-labelledby','online-stats-title');
 dialog.innerHTML='<button type="button" class="close" aria-label="戦績を閉じる">×</button><h2 id="online-stats-title">オンライン戦績</h2><div class="online-stats-tools"><label>プレイヤー名<select id="online-stats-player"></select></label><button type="button" id="refresh-online-stats">更新</button></div><p id="online-stats-summary" role="status"></p><table><thead><tr><th scope="col">キャラ</th><th scope="col">使用回数</th><th scope="col">勝利数</th><th scope="col">使用率</th></tr></thead><tbody></tbody></table>';
 document.body.append(dialog);
 const select=dialog.querySelector('select'),summary=dialog.querySelector('[role="status"]'),body=dialog.querySelector('tbody'),refresh=dialog.querySelector('#refresh-online-stats');
 let data=null;
 function render(){
  body.replaceChildren();
  if(!data)return;
  const player=select.value?data.players[Number(select.value)-1]:null;
  const characters=player?.characters??data.characters;
  const total=characters.reduce((n,c)=>n+c.uses,0);
  summary.textContent=player?player.matches+'戦 · '+player.wins+'勝 · '+player.draws+'引き分け':data.matches?'完了 '+data.matches+'試合 · キャラ使用 '+total+'回':'集計済みのオンライン対戦はまだありません。';
  const names=new Map(Roster.definitions.map(f=>[f.id,f.name]));
  for(const c of [...characters].sort((a,b)=>b.uses-a.uses||b.wins-a.wins||a.id.localeCompare(b.id))){
   const row=body.insertRow();
   for(const value of [names.get(c.id)||c.id,c.uses,c.wins,(100*c.uses/total).toFixed(1)+'%'])row.insertCell().textContent=value;
  }
 }
 async function load(){
  refresh.disabled=true;summary.textContent='戦績を読み込んでいます…';
  try{
   const response=await fetch('/api/online-stats',{cache:'no-store',signal:AbortSignal.timeout(10000)});
   if(!response.ok)throw Error('Statistics unavailable');
   const previous=select.selectedOptions[0]?.textContent;
   data=await response.json();
   data.players.sort((a,b)=>a.name.localeCompare(b.name,'ja'));
   select.replaceChildren(new Option('全体の人気キャラ',''),...data.players.map((p,n)=>new Option(p.name,n+1)));
   const sameName=data.players.findIndex(p=>p.name===previous);
   if(sameName>=0)select.value=String(sameName+1);
   render();
  }catch{
   data=null;body.replaceChildren();select.replaceChildren();summary.textContent='戦績を読み込めませんでした。更新ボタンから再試行できます。';
  }finally{refresh.disabled=false;}
 }
 function open(){dialog.showModal();if(!refresh.disabled)void load();}
 dialog.querySelector('.close').onclick=()=>dialog.close();
 select.onchange=render;refresh.onclick=load;
 for(const target of [document.querySelector('.home-utilities'),document.querySelector('#online-room h2')]){
  const button=document.createElement('button');button.type='button';button.textContent='オンライン戦績';button.onclick=open;
  if(target.tagName==='H2')target.after(button);else target.append(button);
 }
});

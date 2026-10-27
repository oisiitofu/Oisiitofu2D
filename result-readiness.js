'use strict';
// Result presentation only: retain public names/readiness, never lineups or card choices.
const ResultReadiness=(()=>{
 function create(){
  let room=null,finishedMatch=0;
  function clear(){room=null;finishedMatch=0;}
  function accept(value,code){
   if(!value||value.code!==code||room&&room.code===code&&value.matchId<room.matchId)return false;
   if(room?.code!==code)clear();
   room={code,matchId:value.matchId||0,playing:!!value.playing,preparing:!!value.preparing,
    bingo:!!value.bingo,players:value.players.map(p=>p?{name:String(p.name||''),ready:!!p.ready}:null)};
   return true;
  }
  function begin(config,code){
   clear();accept({code,matchId:config.matchId,playing:true,bingo:config.ruleSet==='bingo',players:config.players},code);
   finishedMatch=config.matchId||0;
  }
  function describe({code,slot=0,pending=false,result=false,online=false}={}){
   if(!result||!online)return{visible:false};
   if(!code||!room||room.code!==code)return{visible:false,rejoin:!code};
   const busy=room.playing||room.preparing,next=busy&&room.matchId>finishedMatch;
   const members=room.players.filter(Boolean).length,total=room.players.length;
   const ready=busy&&!next?0:room.players.filter(p=>p?.ready).length;
   const mine=room.players[slot],disabled=next||!!mine?.ready&&!busy||pending;
   const title=room.bingo?'ビンゴの進行状況':busy?(next?'全員準備完了 · 次の試合を準備中':'全員の終了を確認中…'):`準備完了 ${ready}/${total}人`;
   const rows=room.players.map((p,n)=>({name:p?.name||`${n+1}P`,self:n===slot,ready:!!p?.ready&&(!busy||next),
    status:!p?'参加待ち':room.bingo?'ビンゴの進行を確認中':next?'画像を準備中':busy?(n===slot&&pending?'再戦予約済み':'終了確認中'):p.ready?'準備完了':n===slot&&pending?'準備を送信中':'選択・準備中'}));
   return{visible:true,bingo:room.bingo,title,members,total,rows,disabled,
    button:next?'次の試合を準備中…':pending||mine?.ready&&!busy?'準備完了 · 全員を待っています':'同じキャラで再戦 →',
    hint:room.bingo?'次のマス選択・カードの配り直しは、下のボタンから進めます。':next?'全員の画像の準備が終わると対戦を開始します。':busy?'再戦を押すと、全員の終了確認後に準備完了を送ります。':'同じキャラで再戦、またはキャラ・ステージを選び直せます。'};
  }
  return{clear,accept,begin,describe,get snapshot(){return room?JSON.parse(JSON.stringify(room)):null;}};
 }
 const view=create();
 function refresh(context){
  if(typeof document==='undefined')return;
  const panel=document.getElementById('result-readiness'),model=view.describe(context);
  if(!panel)return;
  panel.classList.toggle('hidden',!model.visible);
  if(model.rejoin){
   for(const b of document.querySelectorAll('#result .restart')){b.disabled=false;b.textContent='ルームを選んで再戦 →';}
   for(const b of document.querySelectorAll('#result .back')){b.disabled=false;b.textContent='キャラ選択へ';}
  }
  if(!model.visible)return;
  document.getElementById('result-ready-title').textContent=model.title;
  document.getElementById('result-ready-count').textContent=`参加 ${model.members}/${model.total}人`;
  document.getElementById('result-ready-hint').textContent=model.hint;
  const list=document.getElementById('result-ready-players');list.replaceChildren();
  for(const row of model.rows){
   const li=document.createElement('li'),name=document.createElement('span'),status=document.createElement('b');
   name.textContent=row.name+(row.self?'（あなた）':'');status.textContent=row.status;
   li.classList.toggle('ready',row.ready);li.append(name,status);list.append(li);
  }
  // Bingo owns its next-round/champion buttons and concealment rules.
  if(!model.bingo)for(const b of document.querySelectorAll('#result .restart')){b.disabled=model.disabled;b.textContent=model.button;}
 }
 return{create,begin:(config,code)=>view.begin(config,code),accept:(room,code)=>view.accept(room,code),clear:()=>{view.clear();if(typeof document!=='undefined')document.getElementById('result-readiness')?.classList.add('hidden');},refresh};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=ResultReadiness;

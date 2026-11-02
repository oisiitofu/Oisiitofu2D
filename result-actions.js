'use strict';
const ResultActions=(()=>{
 let lastMatch=null;
 function begin(participants,squads,stage){lastMatch=JSON.parse(JSON.stringify({participants:{...participants,oneOnOne:StageRules.oneOnOne},squads,stage}));if(!Net.active)lastMatch.participants.players.forEach((p,n)=>{p.character=fighters[n].squad?.[0]||fighters[n].characterId;});}
 function refresh(){const online=document.getElementById('battle-mode').value==='online';document.getElementById('result-room').hidden=!online;if(!BingoBattle.enabled())document.querySelector('#result .back').textContent='キャラを変更';if(!online&&!BingoBattle.enabled()){const b=document.querySelector('#result .restart');b.disabled=false;b.textContent='同じ条件で再戦';}document.getElementById('result-actions-help').textContent=online?'再戦は全員の準備完了後に開始。キャラ変更・ルームへ戻る操作でも参加中の部屋を維持します。':'同じ条件で再戦：キャラ・カラー・ステージ・ルールをそのまま使います。';}
 function rematch(){if(state!=='result')return;if(state==='result'&&lastMatch&&document.getElementById('battle-mode').value!=='online')return start({...JSON.parse(JSON.stringify(lastMatch)),artPrepared:true});return start();}
 function init(){document.getElementById('result-room').onclick=()=>{document.querySelector('#result .back').click();Net.browse();};document.querySelector('#result .restart').addEventListener('click',e=>{if(BingoBattle.enabled())return;e.stopImmediatePropagation();rematch();},{capture:true});}
 return{begin,refresh,init,rematch};
})();

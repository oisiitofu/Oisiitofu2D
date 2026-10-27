'use strict';
// One real training action, using existing attack, physics, rules and VFX clocks.
const TrainingDemo=(()=>{
 const direct=new Set(['jab','heavy','up','low','dashAttack','smash','upsmash','downsmash','air','fair','bair','uair','dair','dragon','dash','rise','gale']);
 const aerial=new Set(['air','fair','bair','uair','dair']);
 let job=null,lastMove=null;
 const enabled=()=>training&&!Net.active&&['battle','pause'].includes(state)&&fighters.length>=2;
 function reason(key){
  if(!enabled())return '実演はトレーニング専用です。';
  const f=fighters[0],kit=movesFor(f),a=kit[key],base=movesFor({characterId:f.evolutionRoot||f.characterId,id:Symbol('demo-inspect')});
  if(!direct.has(key))return '派生技・投げ・反撃などは必要な操作から手動で確認してください。';
  if(!a)return '現在の技データにありません。';
  if(a.counterWindow)return '相手の攻撃を受ける反撃技です。手動で確認してください。';
  if((f.evolutionRoot&&f.characterId!==f.evolutionRoot)||kit!==base)return '形態・装備が初期状態と異なります。リセットして技表を開き直してください。';
  return '';
 }
 function display(message){const panel=document.getElementById('training-demo');panel.classList.remove('hidden');document.getElementById('training-tools').classList.add('demo-view');document.getElementById('training-demo-status').textContent=message;document.getElementById('demo-cancel').disabled=!job;}
 function clear(){job=null;lastMove=null;document.getElementById('training-demo')?.classList.add('hidden');document.getElementById('training-tools')?.classList.remove('demo-view');}
 function launch(request){
  if(!enabled()||request.round!==round||request.characterId!==(fighters[0].evolutionRoot||fighters[0].characterId))return false;
  const initial=movesFor({characterId:request.characterId,id:Symbol('demo-inspect')}),a=initial[request.key];
  if(!direct.has(request.key)||!a||a.counterWindow||a.name!==request.name)return false;
  resetTraining();const f=fighters[0],main=platforms.find(p=>p.main);
  fighters.forEach((q,n)=>{q.x=main.x+main.w*(n?(fighters.length===2?.80:.68+(n-1)*.13):.48);q.y=main.y;q.face=n?-1:1;q.grounded=true;q.vx=q.vy=0;PlayerStates.enter(q,'Idle');});
  if(aerial.has(request.key)){f.y=main.y-240;f.grounded=false;f.jumps=1;PlayerStates.enter(f,'Fall');}
  lastMove={...request};keys.clear();pressed.clear();Controls.clear();Controls.consume();countdown=0;
  document.getElementById('frame-guide').close();document.getElementById('pause').classList.add('hidden');state='battle';
  if(!attack(f,request.key,emptyInput())||f.attack?.name!==request.name){resetTraining();lastMove={...request};display('使用条件を満たせず開始できませんでした。通常の練習で確認してください。');return false;}
  job={...request,age:0,tail:0,limit:Math.min(1200,Math.max(360,f.attack.totalFrames+180))};
  display(request.name+' · 実演中');return true;
 }
 function start(key){const why=reason(key);if(why)return false;const f=fighters[0];return launch({key,name:movesFor(f)[key].name,characterId:f.characterId,round});}
 function replay(){return lastMove?launch({...lastMove}):false;}
 function cancel(){if(!enabled()||!lastMove)return;const previous={...lastMove};resetTraining();lastMove=previous;display('実演を中止し、初期位置へ戻しました。');}
 function tick(){
  if(!job)return;if(!enabled()||job.round!==round){clear();return;}
  const f=fighters[0];job.age++;
  // Leave a short tail so a released projectile can be observed normally.
  if(!f.attack&&!f.hitlag&&!hitstop)job.tail++;else job.tail=0;
  if(job.tail>=60||job.age>=job.limit||f.respawn){const message=job.age>=job.limit?'実演の自動操作を終了しました。長い持続や追加入力は手動で確認してください。':f.respawn?'場外で実演を終了しました。':job.name+' · 実演終了';job=null;Controls.clear();Controls.consume();display(message);}
 }
 function input(){return job&&enabled()?emptyInput():null;}
 addEventListener('DOMContentLoaded',()=>{document.getElementById('demo-replay').onclick=replay;document.getElementById('demo-cancel').onclick=cancel;});
 return{enabled,reason,start,replay,cancel,clear,tick,input,get status(){return job?{key:job.key,name:job.name,age:job.age,running:true}:lastMove?{key:lastMove.key,name:lastMove.name,running:false}:null;}};
})();

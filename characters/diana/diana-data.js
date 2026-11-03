'use strict';
const DianaNames=['ジャブ','連打','ハックショック','電子パルス','上昇ハック','足元干渉','突進スライド','巨体操作','浮遊拘束','電磁バースト','空中ハック','ハック薙ぎ','バックキック','上方展開','ダウンパルス'];
const DianaMotion=Object.fromEntries(['jab','jab2','jab3','heavy','up','low','dashAttack','smash','upsmash','downsmash','air','fair','bair','uair','dair'].map((type,n)=>[type,{
 windup:[14,6,14,6,14,4,3,14,6,4,5,5,5,5,5][n],strike:[24+n],recovery:[6,6,15,13,8,22,4,15,8,9,5,5,5,5,22][n]
}]));
const DianaMoves=(()=>{
 const m=CombatData.createMove,opt={special:true,newcomerHit:true,soundFamily:'electric',pose:21};
 const moves=NewcomerCore.moves(DianaNames,{
  dragon:m('グリッドハック',12,[],48,0,{...opt,tether:true,damage:0}),
  dash:m('ミサイルジャック',12,[],45,0,{...opt,tether:true,projectile:true,soundFamily:'rocket',damage:8}),
  rise:m('ヒューのスラスター・レスキュー',7,[],54,0,{...opt,airControlMultiplier:0,gravityMultiplier:.55,helpless:true,ledgeGrabStart:19}),
  gale:m('マルチハック',20,[],45,0,{...opt,damage:8}),
  airDrop:m('マルチハック',20,[],45,0,{...opt,aerial:true,damage:8})
 },'punch',100);
 for(const [type,seq] of Object.entries(DianaMotion)){
  const a=moves[type];a.pose=seq.strike[0];a.authoredEffectCoverage=true;
  if(['jab3','heavy','up','low','smash','upsmash','downsmash','air','uair','dair'].includes(type))a.soundFamily='electric';
  for(const window of a.activeFrames)window.pose=a.pose;
  Object.assign(a.animation,{anticipationPose:seq.windup,accelerationPose:a.pose,recoveryPose:seq.recovery});
 }
 for(const [type,pose] of Object.entries({grab:12,pummel:6,forwardThrow:13,backThrow:10,upThrow:8,downThrow:9,ledge:6,getupAttack:15})){
  const a=moves[type];a.pose=pose;
  for(const w of a.activeFrames)w.pose=pose;
  Object.assign(a.animation,{anticipationPose:21,accelerationPose:pose,recoveryPose:0});
 }
 return moves;
})();
function dianaGate(f,type){
 if(type==='dash')return (f.grounded||!f.newSideUsed)&&!DianaRules.objects.some(q=>q.owner===f.id);
 if(type==='airDrop')return !f.newDownUsed;
 return true;
}
function dianaMarked(f,o){return (f.dianaMarks?.[o.id]??0)>frame&&!o.respawn;}
function dianaCanScan(f,o){
 return !o.respawn&&!o.grabbed&&!CombatSystem.protection(o).intangible&&!CombatSystem.protection(o).invincible&&
  (o.x-f.x)*f.face>=-8&&Math.abs(o.x-f.x)<=300&&Math.abs(o.y-f.y)<=124;
}
function dianaFinish(f,a,end){
 const d=end-a.totalFrames;
 a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;
}
function dianaTouch(f,o,a,box,damage){
 const hit=CombatSystem.contact(box,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,box);
 if(!hit&&!shield||CombatSystem.protection(o).intangible)return false;
 CombatSystem.hit(f,o,{...a,projectile:true,charge:0,damage,launchDirection:Math.sign(o.x-f.x)||f.face},box,hit);
 return true;
}
const DianaRules=NewcomerCore.create('diana',DianaMoves,{
 reset(){for(const f of fighters)if(f.characterId==='diana')f.dianaMarks={};},
 status(f){if(f.respawn)f.dianaMarks={};for(const o of fighters)if(o.respawn&&f.dianaMarks)delete f.dianaMarks[o.id];},
 action(f,i,r){
  const a=f.attack,t=f.timer;
  if(a.type==='dragon'){
   f.vx=moveToward(f.vx,0,.7);
   a.pose=t<12?21:15;
   if(t===12)a.scanId=BattlePlayers.targets(f).filter(o=>dianaCanScan(f,o)).sort((x,y)=>Math.abs(x.x-f.x)-Math.abs(y.x-f.x))[0]?.id;
   const o=fighters.find(o=>o.id===a.scanId);
   if(o&&!dianaCanScan(f,o))a.scanId=undefined;
   if(t>=18&&t<=35&&i.special&&!a.scanDone){
    a.scanDone=true;
    if(a.scanId!==undefined){f.dianaMarks??={};f.dianaMarks[a.scanId]=frame+300;a.exposeAt=t;}
    dianaFinish(f,a,t+14);
   }
  }
  if(a.type==='dash'){
   f.vx=moveToward(f.vx,0,.6);a.pose=t<12?6:15;
   if(t===12){
    if(!f.grounded)f.newSideUsed=true;
    const q=r.spawn(f,{kind:'missile',x:f.x+33*f.face,y:f.y-53,vx:f.face*10,vy:-1,life:76,radius:10,damage:8});
    a.missileId=q.id;
   }
   if(t>=16&&t<=34&&i.special&&!a.command){
    const q=r.objects.find(q=>q.id===a.missileId),marked=BattlePlayers.targets(f).filter(o=>dianaMarked(f,o));
    if(q&&marked.length){
     marked.sort((x,y)=>Math.hypot(x.x-q.x,x.y-q.y)-Math.hypot(y.x-q.x,y.y-q.y));
     q.target=marked[0].id;q.redirected=true;a.command=t;
    }
   }
  }
  if(a.type==='rise'){
   a.pose=t<7?4:t<13?16:17;
   if(t===7){
    f.grounded=false;f.y-=3;
    const p=platforms.find(p=>p.main);
    if(f.y>p.y+70&&f.x>p.x&&f.x<p.x+p.w)NewcomerCore.escape(f,a);
    else f.vy=-15.5;
   }
   if(a.escapeSide){
    NewcomerCore.escapeAction(f,a,0);
    if(!a.escapeSide){a.gravityMultiplier=.55;f.vy=-16;}
   }else if(t>=7&&!a.detached){
    f.vx=moveToward(f.vx,i.x*6.9,.58);
    if(Math.abs(i.x)>.3)f.face=Math.sign(i.x);
    if(t>=21&&i.special||t>=43){
     a.detached=true;a.gravityMultiplier=1;a.airControlMultiplier=.5;
     dianaFinish(f,a,t+12);
    }
   }
   if(a.detached)a.pose=5;
  }
  if(a.type==='gale'||a.type==='airDrop'){
   a.pose=t<20?21:9;
   if(t<20)a.motionLastEvent=39;
   if(t===20)for(const o of BattlePlayers.targets(f)){
    const marked=dianaMarked(f,o),r=marked?137:55;
    if(Math.abs(o.x-f.x)>r+16||Math.abs(o.y-f.y)>65)continue;
    const box={x1:f.x,y1:f.y-33,x2:f.x+Math.sign(o.x-f.x)*r,y2:f.y-33,radius:marked?23:14};
    dianaTouch(f,o,a,box,marked?13:5);
   }
  }
 },
 projectile(q,f){
  if(q.kind!=='missile')return false;
  if(f.respawn||q.age>=q.life){q.dead=true;return true;}
  const target=fighters.find(o=>o.id===q.target);
  if(target&&dianaMarked(f,target)){
   const aim=Math.atan2(target.y-42-q.y,target.x-q.x);
   const from=Math.atan2(q.vy,q.vx),turn=Math.atan2(Math.sin(aim-from),Math.cos(aim-from));
   const heading=from+clamp(turn,-.35,.35);
   q.vx=Math.cos(heading)*13;q.vy=Math.sin(heading)*13;
  }
  const oldX=q.x,oldY=q.y;q.x+=q.vx;q.y+=q.vy;q.face=Math.sign(q.vx)||q.face;
  if(platforms.some(p=>q.x>p.x&&q.x<p.x+p.w&&q.y>=p.y&&oldY<p.y)){q.dead=true;return true;}
  const box={x1:oldX,y1:oldY,x2:q.x,y2:q.y,radius:q.radius};
  for(const o of BattlePlayers.targets(f)){
   if(dianaTouch(f,o,{...DianaMoves.dash,type:'dash',sourceType:'dash',staleMultiplier:q.stale},box,dianaMarked(f,o)?21:8)){q.dead=true;break;}
  }
  return true;
 },
 onHit(f,o,a){if(a.projectile&&['dash','gale','airDrop'].includes(a.type)&&f.dianaMarks)delete f.dianaMarks[o.id];},
 boxes(f,a,w){
  const d=f.face,y=f.y;
  const s={
   front:[6,-45,a.type==='smash'?67:45,-46,14],back:[-5,-40,-48,-37,14],
   up:[6,-51,12,-83,17],low:[4,-17,43,-13,14],
   down:[6,-35,14,10,16],spin:[-35,-43,35,-43,16]
  }[w.shape];
  if(!s)return;
  const [x1,y1,x2,y2,radius]=s;
  return[{x1:f.x+x1*d,y1:y+y1,x2:f.x+x2*d,y2:y+y2,radius,window:w,modifiers:w}];
 },
 hurtboxes(f){
  const low=['crouch','down'].includes(f.state)||f.attack?.type==='dashAttack';
  return [{part:'head',x:f.x+3*f.face,y:f.y-(low?31:62),r:13},{part:'torso',x:f.x,y:f.y-(low?21:42),r:16},{part:'legs',x:f.x,y:f.y-11,r:12}];
 },
 cpu(f,o,i,clear){
  const a=f.attack,d=Math.abs(f.x-o.x);
  if(a?.type==='dragon'){i.special=f.timer===21;return;}
  if(a?.type==='dash'){i.special=f.timer===20;return;}
  if(a?.type==='rise'){i.special=f.timer===33;return;}
  if(a||!f.grounded)return;
  if((frame+19*f.id)%65>3)return;
  if(d<116&&dianaMarked(f,o)){clear();i.x=0;i.y=1;i.special=true;}
  else if(d<340&&dianaMarked(f,o)){clear();i.x=Math.sign(o.x-f.x);i.y=0;i.special=true;}
  else if(d>76&&d<275){clear();f.face=Math.sign(o.x-f.x);i.x=i.y=0;i.special=true;}
 }
});
function dianaPose(f){
 if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;
 if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 20;
 if(['ForwardRoll','BackwardRoll','SpotDodge'].includes(f.mode))return 23;
 return {idle:0,walk:[1,2][Math.floor(frame/7)%2],run:[2,3][Math.floor(frame/5)%2],crouch:4,jump:5,double:5,fall:5,land:22,guard:21,dodge:23,hit:18,fly:18,down:19,getup:22,grab:12,caught:18,throw:13}[f.state]??0;
}
MoveMotion.define('diana',DianaMotion);
CharacterGuide.define('diana',{
 strength:'NBで照準を合わせ、必殺を押し直して弱点を露出。横Bのミサイルは飛行中の必殺で露出した相手を追う。下Bで周囲の弱点をまとめて攻撃できる。',
 caution:'解析中に射程を外れるとロックが切れる。上Bはヒューが救助し、途中で必殺を押すと離脱する。救助中に攻撃判定は出ない。'
});

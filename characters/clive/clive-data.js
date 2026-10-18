'use strict';
const CliveMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,s,e,damage,reach,pose=9,shape='front',opts={})=>m(name,s,[w(s,e,shape)],10,0,{damage,reach,pose,...opts});
 const moves={
  jab:cut('右からの斬撃',5,6,3,137,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:cut('返しの斬撃',5,6,4,145,7,'front',{cancel:{start:7,end:16,input:'jab',next:'jab3'}}),
  jab3:cut('突き・マジックバースト',8,10,8,167,9),
  heavy:cut('踏み込み横薙ぎ',8,11,11,187),
  up:cut('炎のすくい上げ',7,11,9,163,8,'up',{angle:-1.4}),
  low:cut('低い払い',7,8,7,175,17,'low',{angle:-.25}),
  dashAttack:m('滑り込み斬り',12,[w(12,15)],13,0,{damage:12,reach:184,pose:15,impulse:4.5}),
  smash:m('タイタンの拳',14,[w(14,17)],22,0,{damage:22,reach:215,pose:9,baseKnockback:6.5,knockbackGrowth:.105,chargeFrame:5,chargeMaxFrames:60,soundFamily:'earth'}),
  upsmash:m('ライジングフレイム',13,[w(13,17,'up')],20,0,{damage:18,reach:190,pose:8,angle:-1.48,baseKnockback:6,knockbackGrowth:.096,chargeFrame:4,chargeMaxFrames:60,soundFamily:'fire'}),
  downsmash:m('スカーレットサイクロン',11,[w(11,13,'low'),w(20,23,'back')],19,0,{damage:16,reach:197,pose:17,baseKnockback:5.5,knockbackGrowth:.09,chargeFrame:3,chargeMaxFrames:60,soundFamily:'fire'}),
  air:m('回転斬り・バースト',6,[w(6,7,'front',{damage:3,baseKnockback:1.4,knockbackGrowth:.015}),w(14,17,'spin',{damage:7})],10,7,{damage:7,reach:164,pose:10,aerial:true}),
  fair:m('斜めの強斬り',7,[w(7,9)],10,10,{damage:11,reach:185,pose:9,aerial:true}),
  bair:m('返し斬り',8,[w(8,11,'back')],10,10,{damage:12,reach:176,pose:7,aerial:true}),
  uair:m('炎の追撃',6,[w(6,9,'up')],10,8,{damage:10,reach:161,pose:8,aerial:true,angle:-1.5}),
  dair:m('アップヒーバル',10,[w(10,14,'plunge')],12,14,{damage:13,reach:126,pose:11,aerial:true,diveSpeed:12,bounceOnHit:-6.5,meteorFrame:12,meteorAngle:1.45,meteorMultiplier:1.2,soundFamily:'earth'}),
  magicBurst:m('マジックバースト追撃',3,[w(3,4)],10,10,{damage:4,reach:154,pose:13,special:true,soundFamily:'light',baseKnockback:2.6,knockbackGrowth:.044}),
  dragon:m('マジック',12,[],17,12,{pose:13,spellShots:[12,18],projectile:true,chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,soundFamily:'light',shotSpeed:10,shotLife:58}),
  dash:m('フェニックスシフト',6,[],22,14,{pose:15,spellShots:[24],shiftStart:6,shiftEnd:13,shiftRange:310,shiftSpeed:40,emptyShiftRange:140,branchStart:14,branchEnd:24,airControlMultiplier:0,gravityMultiplier:0,ledgeGrabStart:14,soundFamily:'fire'}),
  sideSlash:m('フェニックスシフト・斬撃',6,[w(6,8)],15,14,{damage:12,reach:190,pose:9,special:true,soundFamily:'sword',baseKnockback:4.7,knockbackGrowth:.079}),
  sideMagic:m('フェニックスシフト・マジック',6,[],14,14,{pose:13,spellShots:[6],projectile:true,special:true,soundFamily:'light',shotSpeed:12,shotLife:45}),
  sideBackstep:m('フェニックスシフト・キャンセル',2,[],11,14,{pose:19,spellShots:[2],special:true,backStart:2,backEnd:8,backSpeed:8,intangibleFrames:[[3,6]],airControlMultiplier:0,soundFamily:'wind'}),
  rise:m('デッドリーエンブレイス',8,[w(8,15,'up')],22,18,{damage:4,reach:300,pose:16,garudaClaw:true,pull:true,fixedKnockback:13,clawStart:8,clawEnd:15,clawRange:390,clawRadius:12,hookStart:16,hookEnd:25,hookSpeed:15,wheelFrame:26,airControlMultiplier:0,gravityMultiplier:0,ledgeGrabStart:15,soundFamily:'wind',autoCancelWindow:[],landingFlag:[1,Infinity]}),
  garudaWheel:m('ウィケッドホイール',4,[w(4,6,'spin',{damage:3,baseKnockback:1.4,knockbackGrowth:.016}),w(10,13,'up',{damage:7,pose:8})],12,18,{damage:7,reach:161,pose:16,special:true,aerial:true,verticalImpulse:-12,airControlMultiplier:.6,angle:-1.4,soundFamily:'wind',actionCancelFrame:17,ledgeGrabStart:4,autoCancelWindow:[],landingFlag:[1,Infinity]}),
  gale:m('パイルドライブ',18,[w(18,21,'shockwave')],20,0,{damage:15,reach:240,pose:17,angle:-1.35,baseKnockback:5.3,knockbackGrowth:.084,chargeFrame:5,chargeButton:'special',chargeMaxFrames:60,soundFamily:'thunder',preserveVelocity:false}),
  airPile:m('パイルドライブ・空中落雷',14,[w(14,90,'plunge')],10,18,{damage:11,reach:98,pose:11,special:true,aerial:true,diveSpeed:12,airControlMultiplier:.2,velocityMultiplier:.25,velocityYOverride:-2,gravityMultiplier:.3,landingMove:'pileLanding',soundFamily:'thunder',autoCancelWindow:[],landingFlag:[1,Infinity],canClank:false}),
  pileLanding:m('パイルドライブ・接地衝撃',1,[w(1,4,'shockwave')],20,0,{damage:12,reach:240,pose:17,special:true,angle:-1.35,baseKnockback:5.1,knockbackGrowth:.079,preserveVelocity:false,soundFamily:'thunder',canClank:false})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e}))};}
 for(const [id,name]of Object.entries({grab:'片手のつかみ',pummel:'肘打ち',forwardThrow:'剣の押し出し',backThrow:'蹴り飛ばし',upThrow:'炎の打ち上げ',downThrow:'地面への叩きつけ'}))moves[id].name=name;
 for(const [id,a]of Object.entries(moves)){a.motionEndFrames=a.totalFrames;a.animation={...a.animation,anticipationPose:14};if(['jab','jab2','jab3','heavy','up','low','dashAttack','air','fair','bair','uair'].includes(id))a.burstCancel={start:a.activeEnd+1,end:a.activeEnd+5,next:'magicBurst'};}
 moves.rise.animation={...moves.rise.animation,anticipationPose:14,accelerationPose:16,recoveryPose:5,lunge:0};
 return moves;
})();

const CliveRules=(()=>{
 let objects=[];
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='clive'){f.cliveShiftUsed=false;f.clivePileUsed=false;}}
 function spawn(f,kind,values={}){objects.push({kind,owner:f.id,face:f.face,x:f.x+f.face*30,y:f.y-37,age:0,life:58,stale:f.attack?.staleMultiplier??1,hits:new Set(),...values});}
 function pathClear(f,q,body=true){const p=platforms.find(p=>p.main),e=body?f.character.ecb:{radius:0,height:0},fromY=body?f.y:f.y-40,dx=q.x-f.x,dy=q.y-fromY,n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/6));for(let j=1;j<=n;j++){const x=f.x+dx*j/n,y=fromY+dy*j/n;if(x>p.x-e.radius&&x<p.x+p.w+e.radius&&y>p.y+1&&y-e.height<p.y+90)return false;}return true;}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;
  if(a.type==='dash'){const o=BattlePlayers.target(f),dx=o.x-f.x,valid=!o.respawn&&dx*f.face>0&&Math.abs(dx)<=a.shiftRange&&Math.abs(o.y-f.y)<100;a.shiftDestination=valid?{x:o.x-f.face*55,y:o.y-10}:{x:f.x+f.face*a.emptyShiftRange,y:f.y};a.shiftTarget=valid?o.id:null;if(!f.grounded)f.cliveShiftUsed=true;}
  if(a.type==='rise'){a.clawOrigin={x:f.x,y:f.y-40};const o=BattlePlayers.target(f),off=f.x<StageRules.ledges[0].x||f.x>StageRules.ledges[1].x;
   const enemy={x:o.x,y:o.y-37},ledge=StageRules.ledges.reduce((best,l)=>Math.hypot(l.x-f.x,l.y-f.y)<Math.hypot(best.x-f.x,best.y-f.y)?l:best),grip={x:ledge.x-ledge.face*18,y:ledge.y+35};
   if(off&&Math.hypot(ledge.x-f.x,ledge.y-f.y)<=a.clawRange&&pathClear(f,grip)){a.clawTarget={x:ledge.x,y:ledge.y};a.hookLedge=ledge;}
   else if(!o.respawn&&Math.hypot(enemy.x-f.x,enemy.y-(f.y-40))<=a.clawRange&&enemy.y<f.y+40&&pathClear(f,enemy,false)){a.clawTarget=enemy;a.hookCandidate=o.id;}
   else a.clawTarget={x:f.x+f.face*80,y:f.y-260};
  }
  if(a.type==='airPile')f.clivePileUsed=true;
 }
 function claw(f,t=f.timer){const a=f.attack,u=clamp((t-a.clawStart+1)/(a.clawEnd-a.clawStart+1),0,1),p=a.clawOrigin,q=a.clawTarget;return{x:lerp(p.x,q.x,u),y:lerp(p.y,q.y,u)};}
 function onHit(f,o,a){if(a.garudaClaw&&f.attack?.garudaClaw){f.attack.hookTarget=o.id;f.attack.hookConfirmed=true;}}
 function action(f,i=emptyInput()){let a=f.attack;if(!a)return;const t=f.timer;
  if(a.burstCancel&&t>=a.burstCancel.start&&t<=a.burstCancel.end&&(i.special||f.buffer?.key==='special')){attack(f,a.burstCancel.next);return;}
  if(a.type==='dash'){
   if(t>=a.shiftStart&&t<=a.shiftEnd){const remaining=a.shiftEnd-t+1;f.vx=clamp((a.shiftDestination.x-f.x)/remaining,-a.shiftSpeed,a.shiftSpeed);f.vy=clamp((a.shiftDestination.y-f.y)/remaining,-a.shiftSpeed,a.shiftSpeed);f.fastFall=false;}
   else if(t>a.shiftEnd){f.vx=0;f.vy=Math.min(0,f.vy);a.gravityMultiplier=1;}
   if(t>=a.branchStart&&t<=a.branchEnd){const b=f.buffer,next=i.guardPressed||b?.key==='guard'?'sideBackstep':i.jab||i.heavy||b&&['jab','heavy','smash'].includes(b.key)?'sideSlash':i.special||b?.key==='special'?'sideMagic':null;if(next){attack(f,next);return;}}
  }
  if(a.type==='sideBackstep'){if(t>=a.backStart&&t<=a.backEnd)f.vx=-f.face*a.backSpeed;else if(t>a.backEnd)f.vx=0;}
  if(a.type==='dragon'&&a.spellShots.includes(t)&&!a.eventsDone.has('shot:'+t)&&(t===a.startupFrames||a.charge>=.5)){a.eventsDone.add('shot:'+t);spawn(f,'magic',{vx:f.face*a.shotSpeed,vy:0,life:a.shotLife,damage:6+a.charge*3,charged:a.charge>=.5});}
  if(a.type==='sideMagic'&&t===a.startupFrames&&!a.objectSpawned){a.objectSpawned=true;spawn(f,'magic',{vx:f.face*a.shotSpeed,vy:0,life:a.shotLife,damage:8,charged:false});}
  if(a.garudaClaw){
   if(t===a.clawStart){f.recovered=true;f.fastFall=false;if(f.grounded)f.y-=2;f.grounded=false;f.vx=f.vy=0;a.clawOrigin={x:f.x,y:f.y-40};f.specialLandingLag=a.landingLagFrames;}
   if(t>=a.clawStart&&t<=a.clawEnd){f.vx=f.vy=0;if(t===a.clawEnd&&a.hookLedge)a.hookConfirmed=true;}
   if(t>=a.hookStart&&t<=a.hookEnd&&a.hookConfirmed){const o=fighters[a.hookTarget],q=a.hookLedge?{x:a.hookLedge.x-a.hookLedge.face*18,y:a.hookLedge.y+35}:o&&!o.respawn?{x:o.x-f.face*40,y:o.y-30}:null;
    if(q&&pathClear(f,q)){const dx=q.x-f.x,dy=q.y-f.y,d=Math.max(1,Math.hypot(dx,dy)),speed=Math.min(d,a.hookSpeed);f.vx=dx/d*speed;f.vy=dy/d*speed;}else{a.hookConfirmed=false;f.vx=f.vy=0;}
   }
   if(t>=a.wheelFrame){attack(f,'garudaWheel');f.attack.hookConfirmed=a.hookConfirmed;return;}
  }
 }
 function box(o){return{x1:o.previousX??o.x,y1:o.previousY??o.y,x2:o.x,y2:o.y,radius:o.charged?15:11};}
 function tick(){for(const f of fighters)if(f.characterId==='clive'&&(f.grounded||f.ledge||f.respawn)){f.cliveShiftUsed=false;f.clivePileUsed=false;}
  for(const o of objects){const f=fighters[o.owner],enemy=BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}o.age++;o.previousX=o.x;o.previousY=o.y;o.x+=o.vx;o.y+=o.vy;const p=platforms.find(p=>p.main);if(o.x>p.x&&o.x<p.x+p.w&&o.y>p.y&&o.y<p.y+90)o.dead=true;
   for(const enemy of BattlePlayers.targets(f)){if(o.dead)break;if(!o.dead&&!enemy.respawn&&!o.hits.has(enemy.id)){const b=box(o),touch=CombatSystem.contact(b,enemy),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(enemy.mode)&&CombatSystem.shieldCovers(enemy,b);if((touch||shield)&&!CombatSystem.protection(enemy).intangible){o.hits.add(enemy.id);const counter=enemy.attack;if(counter?.counterWindow&&enemy.timer>=counter.counterWindow[0]&&enemy.timer<=counter.counterWindow[1]){attack(enemy,counter.counterMove);enemy.inv=enemy.attack.totalFrames;}else CombatSystem.hit(f,enemy,{...CliveMoves.dragon,type:'dragon',damage:o.damage,charge:0,staleMultiplier:o.stale,projectile:true,soundFamily:'light',baseKnockback:3,knockbackGrowth:.05,angle:-.45,launchDirection:o.face},b,touch);o.dead=true;}}
   }if(o.age>=o.life||o.x<-900||o.x>2300)o.dead=true;
  }objects=objects.filter(o=>!o.dead);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main),under=f.y>p.y+25&&f.x>p.x-20&&f.x<p.x+p.w+20;
  if(f.attack?.type==='dash'&&f.timer>=f.attack.branchStart){i.special=i.smash=false;if(['ShieldStart','ShieldHold'].includes(o.mode))i.guard=true;else if(Math.abs(o.x-f.x)<160)i.jab=true;else i.special=true;}
  if(!f.attack&&under&&!f.recovered){const direction=f.x<p.x+p.w/2?-1:1,distance=direction<0?f.x-p.x:p.x+p.w-f.x;i.x=direction;i.y=distance<=60?-1:0;i.special=distance<=60;i.jump=distance>60&&f.airJumps>0&&f.vy>0;i.jab=i.heavy=i.smash=i.guard=false;}
  return i;
 }
 return{reset,prepare,action,onHit,tick,cpu,claw,pathClear,box,get objects(){return objects;}};
})();

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('clive',{"jab2":{"strike":[6,7],"windup":14},"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"fair":{"strike":[13],"windup":14},"smash":{"strike":[13,9],"windup":14},"jab3":{"strike":[7,9],"windup":14},"downsmash":{"strike":[17,7],"windup":14}});

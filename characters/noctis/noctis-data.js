'use strict';
// Inclusive one-based move frames. Motion, collision and warp events share this clock.
const NoctisMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,s,e,damage,reach,pose=9,shape='front',opts={})=>m(name,s,[w(s,e,shape)],9,0,{damage,reach,pose,...opts});
 const moves={
  jab:cut('エンジンブレード・突き',5,6,3,125,6,'front',{baseKnockback:1.5,knockbackGrowth:.02,cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:cut('返し斬り',4,5,4,138,7,'front',{cancel:{start:6,end:14,input:'jab',next:'jab3'}}),
  jab3:cut('幻剣フィニッシュ',7,9,7,162,9),
  heavy:cut('エンジンブレード・横斬り',7,10,9,178),
  up:cut('召喚剣・打ち上げ',6,10,8,155,8,'up',{angle:-1.4}),
  low:cut('低い払い',7,8,7,167,17,'low',{angle:-.25}),
  dashAttack:m('ワープスライドカット',12,[w(12,15)],12,0,{damage:11,reach:180,pose:15,impulse:4}),
  smash:m('王の剣・大斬撃',12,[w(12,15)],20,0,{damage:19,reach:211,pose:9,baseKnockback:6,knockbackGrowth:.1,chargeFrame:4,chargeMaxFrames:60}),
  upsmash:m('ファントムソード・昇撃',14,[w(14,18,'up')],20,0,{damage:18,reach:195,pose:8,angle:-1.48,baseKnockback:6,knockbackGrowth:.096,chargeFrame:4,chargeMaxFrames:60}),
  downsmash:m('幻剣旋回',10,[w(10,12,'low'),w(20,22,'back')],18,0,{damage:15,reach:195,pose:17,angle:-.3,baseKnockback:5.5,knockbackGrowth:.09,chargeFrame:3,chargeMaxFrames:60}),
  air:m('ファントムサークル',6,[w(6,7,'front',{damage:3,baseKnockback:1.3,knockbackGrowth:.015}),w(14,17,'spin',{damage:6})],10,7,{damage:6,reach:164,pose:10,aerial:true}),
  fair:m('ワープ斜め斬り',6,[w(6,8)],10,10,{damage:10,reach:177,pose:9,aerial:true}),
  bair:m('後方の返し斬り',7,[w(7,10,'back')],10,10,{damage:11,reach:167,pose:10,aerial:true}),
  uair:m('幻剣・天昇',5,[w(5,8,'up')],10,8,{damage:9,reach:159,pose:8,aerial:true,angle:-1.5}),
  dair:m('ワープ降撃',9,[w(9,13,'plunge')],12,14,{damage:12,reach:120,pose:11,aerial:true,diveSpeed:12,bounceOnHit:-6.5,meteorFrame:11,meteorAngle:1.45,meteorMultiplier:1.2}),
  dragon:m('ファントムソード',12,[],16,12,{pose:13,spellShots:[12],projectile:true,chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,swordSpeed:10,swordLife:50,swordSteering:.018}),
  dash:m('ワープストライク・剣設置',8,[],16,14,{pose:13,spellShots:[8],projectile:true,airControlMultiplier:.5,markerSpeed:11,markerFlight:26,markerLife:100}),
  warpStrike:m('ワープストライク・転移斬り',7,[w(7,9)],16,14,{damage:11,reach:165,pose:15,special:true,warpFrame:4,intangibleFrames:[[4,5]],airControlMultiplier:0,ledgeGrabStart:6,baseKnockback:4.7,knockbackGrowth:.078}),
  rise:m('エアステップ',19,[w(19,22,'up')],12,18,{damage:8,reach:160,pose:16,angle:-1.4,aerial:true,selectionStart:5,selectionEnd:15,warpFrame:16,anchors:[[-180,-90],[0,-210],[180,-90]],airControlMultiplier:0,actionCancelFrame:25,ledgeGrabStart:16,autoCancelWindow:[],landingFlag:[1,Infinity]}),
  gale:m('エレメントフラスク',16,[],18,14,{pose:13,spellShots:[16],projectile:true,chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,flaskFuse:24,burstFrames:3,burstLife:14,burstRadius:[65,58,55],flaskDamage:[14,11,12],flaskGravity:.25})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e}))};}
 for(const [id,name]of Object.entries({grab:'片手のつかみ',pummel:'膝打ち',forwardThrow:'ワープ追撃投げ',backThrow:'背後の斬り返し投げ',upThrow:'幻剣打ち上げ',downThrow:'地面への追撃'}))moves[id].name=name;
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;a.animation={...a.animation,anticipationPose:14};}
 moves.rise.animation={...moves.rise.animation,anticipationPose:14,accelerationPose:16,recoveryPose:5,lunge:0};
 return moves;
})();

const NoctisRules=(()=>{
 let objects=[];
 function marker(f){return objects.find(o=>o.owner===f.id&&o.kind==='marker'&&!o.dead);}
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='noctis'){f.noctisSideUsed=false;f.noctisElementIndex=0;}}
 function spawn(f,kind,values={}){const o={kind,owner:f.id,face:f.face,x:f.x+f.face*28,y:f.y-36,age:0,life:60,stale:f.attack?.staleMultiplier??1,hits:new Set(),...values};objects.push(o);return o;}
 function blocked(f,x,y){const p=platforms.find(p=>p.main),e=f.character.ecb;return StageGeometry.overlaps(p,x,y,e.radius,e.height);}
 // Sample the whole path, including the ECB: warps cannot tunnel through the solid main island.
 function safeWarp(f,target){const dx=target.x-f.x,dy=target.y-f.y,n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/6));let point={x:f.x,y:f.y,blocked:false};for(let j=1;j<=n;j++){const x=f.x+dx*j/n,y=f.y+dy*j/n;if(blocked(f,x,y)){point.blocked=true;break;}point={x,y,blocked:false};}return point;}
 function teleport(f,target){const from={x:f.x,y:f.y},q=safeWarp(f,target);f.x=q.x;f.y=q.y;f.grounded=false;f.fastFall=false;f.vx=0;f.vy=-1.5;for(const p of [from,q])spawn(f,'warpFlash',{x:p.x,y:p.y-36,life:12});GameAudio.cue('light-cast',.6,f);return q;}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;
  if(a.type==='gale'){a.elementIndex=f.noctisElementIndex||0;a.element=['burn','ice','thunder'][a.elementIndex];a.soundFamily=['fire','ice','thunder'][a.elementIndex];f.noctisElementIndex=(a.elementIndex+1)%3;}
  if(a.type==='warpStrike'){const q=marker(f);a.warpTarget=q?{x:q.x,y:q.y+22}:null;if(q)q.dead=true;if(!f.grounded)f.noctisSideUsed=true;f.vx=0;}
 }
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.type==='dragon'&&t===a.startupFrames&&!a.objectSpawned){a.objectSpawned=true;const tier=a.charge>=1?2:a.charge>=.5?1:0,count=[1,3,5][tier];for(let j=0;j<count;j++){const angle=(j-(count-1)/2)*.11;spawn(f,'sword',{vx:Math.cos(angle)*a.swordSpeed*f.face,vy:Math.sin(angle)*a.swordSpeed,damage:[7,5,4.5][tier],life:a.swordLife,steering:a.swordSteering});}}
  if(a.type==='dash'&&t===a.startupFrames&&!a.objectSpawned){a.objectSpawned=true;spawn(f,'marker',{vx:f.face*a.markerSpeed,vy:0,flight:a.markerFlight,life:a.markerLife,anchored:false,damage:3});}
  if(a.type==='warpStrike'&&t===a.warpFrame&&!a.warped){a.warped=true;if(a.warpTarget){const distance=Math.hypot(a.warpTarget.x-f.x,a.warpTarget.y-f.y),q=teleport(f,a.warpTarget);a.warpBlocked=q.blocked;a.damage+=Math.min(5,distance/100);a.gravityMultiplier=.4;f.specialLandingLag=a.landingLagFrames;}}
  if(a.type==='warpStrike'&&t>a.activeEnd)a.gravityMultiplier=1;
  if(a.type==='rise'){
   if(t===a.selectionStart&&!a.anchorOrigin){a.anchorOrigin={x:f.x,y:f.y};a.anchorPoints=a.anchors.map(([x,y])=>({x:f.x+x,y:f.y+y}));a.anchorIndex=1;f.recovered=true;if(f.grounded)f.y-=2;f.grounded=false;f.specialLandingLag=a.landingLagFrames;}
   if(t>=a.selectionStart&&t<=a.selectionEnd){a.anchorIndex=i.x<-.2?0:i.x>.2?2:1;a.gravityMultiplier=0;f.vx=f.vy=0;f.fastFall=false;}
   if(t===a.warpFrame&&!a.warped){a.warped=true;const q=teleport(f,a.anchorPoints[a.anchorIndex]);a.warpBlocked=q.blocked;a.gravityMultiplier=1;f.vx=(a.anchorIndex-1)*1.5;}
  }
  if(a.type==='gale'&&t===a.startupFrames&&!a.objectSpawned){a.objectSpawned=true;spawn(f,'flask',{vx:f.face*5.5,vy:f.grounded?-3.2:1,elementIndex:a.elementIndex,charge:a.charge,life:80,fuse:a.flaskFuse,gravity:a.flaskGravity,burstFrames:a.burstFrames,burstLife:a.burstLife,radius:a.burstRadius[a.elementIndex]+a.charge*25,damage:a.flaskDamage[a.elementIndex]+a.charge*6,element:a.element});}
 }
 function terrain(o){const p=platforms.find(p=>p.main);return o.x>p.x&&o.x<p.x+p.w&&o.y>p.y&&o.y<p.y+90;}
 function box(o){return {x1:o.burst?o.x:o.previousX??o.x,y1:o.burst?o.y:o.previousY??o.y,x2:o.x,y2:o.y,radius:o.burst?o.radius:o.kind==='marker'?9:o.kind==='sword'?10:8};}
 function collision(o,f,unused){let result=false;for(const enemy of BattlePlayers.targets(f)){if(o.kind!=='flask'&&o.hits.size)break;if(collisionOne(o,f,enemy)){o.lastContact=enemy.id;result=true;}}return result;}
 function collisionOne(o,f,enemy){if(enemy.respawn||o.hits.has(enemy.id))return false;const b=box(o),touch=CombatSystem.contact(b,enemy),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(enemy.mode)&&CombatSystem.shieldCovers(enemy,b);if(!(touch||shield)||CombatSystem.protection(enemy).intangible)return false;
  o.hits.add(enemy.id);const counter=enemy.attack,before=enemy.damage;
  if(counter?.counterWindow&&enemy.timer>=counter.counterWindow[0]&&enemy.timer<=counter.counterWindow[1]){attack(enemy,counter.counterMove);enemy.inv=enemy.attack.totalFrames;}
  else CombatSystem.hit(f,enemy,{...NoctisMoves[o.kind==='flask'?'gale':'dragon'],type:o.kind==='flask'?'gale':'dragon',damage:o.damage,charge:0,staleMultiplier:o.stale,projectile:true,soundFamily:o.kind==='flask'?['fire','ice','thunder'][o.elementIndex]:'light',element:o.element,baseKnockback:o.burst?4.6:2.2,knockbackGrowth:o.burst?.073:.035,angle:o.elementIndex===2?-1.45:-.5,launchDirection:Math.sign(enemy.x-o.x)||o.face},b,touch);
  return enemy.damage>before;
 }
 function burst(o){o.burst=1;o.hits.clear();o.vx=o.vy=0;GameAudio.cue(['fire-hit','ice-hit','thunder-hit'][o.elementIndex],.75,fighters[o.owner]);ring(o.x,o.y,['#ff935c','#9bdcff','#cab2ff'][o.elementIndex],o.radius);}
 function tick(){
  for(const f of fighters)if(f.characterId==='noctis'&&(f.grounded||f.ledge||f.respawn))f.noctisSideUsed=false;
  for(const o of objects){const f=fighters[o.owner],enemy=o.target!==undefined?fighters[o.target]:BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}o.age++;o.previousX=o.x;o.previousY=o.y;
   if(o.kind==='warpFlash'){if(o.age>=o.life)o.dead=true;continue;}
   if(o.kind==='marker'){
    if(o.target!==undefined&&!enemy.respawn){o.x=enemy.x-o.face*45;o.y=enemy.y-36;}
    else if(!o.anchored){o.x+=o.vx;if(terrain(o)){o.x=o.previousX;o.anchored=true;}else if(collision(o,f,enemy)){o.target=o.lastContact;o.anchored=true;}else if(o.age>=o.flight)o.anchored=true;}
   }else if(o.kind==='sword'){
    if(!enemy.respawn&&!o.hits.size){const dx=enemy.x-o.x,dy=enemy.y-36-o.y,angle=Math.atan2(o.vy,o.vx),wanted=Math.atan2(dy,dx),delta=Math.atan2(Math.sin(wanted-angle),Math.cos(wanted-angle)),next=angle+clamp(delta,-o.steering,o.steering);o.vx=Math.cos(next)*10;o.vy=Math.sin(next)*10;}
    o.x+=o.vx;o.y+=o.vy;if(terrain(o))o.dead=true;else if(collision(o,f,enemy)||o.hits.size)o.dead=true;
   }else if(o.kind==='flask'){
    if(o.burst){if(++o.burst>o.burstLife)o.dead=true;else if(o.burst<=o.burstFrames)collision(o,f,enemy);}
    else{o.vy+=o.gravity;o.x+=o.vx;o.y+=o.vy;const floor=platforms.find(p=>o.x>=p.x&&o.x<=p.x+p.w&&o.previousY<=p.y&&o.y>=p.y&&o.vy>=0);if(floor||terrain(o)||o.age>=o.fuse||!enemy.respawn&&CombatSystem.contact(box(o),enemy)){if(floor)o.y=floor.y-5;else if(terrain(o)){o.x=o.previousX;o.y=o.previousY;}burst(o);collision(o,f,enemy);}}
   }
   if(o.age>=o.life||o.x<-900||o.x>2300||o.y>1600||o.y<-1100)o.dead=true;
  }
  objects=objects.filter(o=>!o.dead);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main),center=p.x+p.w/2,under=f.y>p.y+25&&f.x>p.x-20&&f.x<p.x+p.w+20;
  if(f.attack?.type==='rise'){i.x=under?(f.x<center?-1:1):f.x<p.x?1:f.x>p.x+p.w?-1:0;i.special=i.guard=i.guardPressed=i.jab=i.heavy=i.smash=false;}
  else if(!f.attack&&under&&!f.recovered){const direction=f.x<center?-1:1,distance=direction<0?f.x-p.x:p.x+p.w-f.x;i.x=direction;i.y=distance<=90?-1:0;i.special=distance<=90;i.jump=distance>90&&f.airJumps>0&&f.vy>0;i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&marker(f)&&!f.noctisSideUsed){i.x=marker(f).face;i.y=0;i.special=true;i.jab=i.heavy=i.smash=i.guard=false;}
  return i;
 }
 return{reset,prepare,action,tick,cpu,marker,safeWarp,box,get objects(){return objects;}};
})();

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(NoctisMoves.dragon,{rangedInterval:40,rangedRearm:20});

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(NoctisMoves.dash,{rangedInterval:32,rangedRearm:16});

'use strict';
// Inclusive one-based frames at 60 Hz; animation, contact and Persona events share this clock.
const NarukamiMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,s,e,damage,reach,pose=9,shape='front',opts={})=>m(name,s,[w(s,e,shape)],10,0,{damage,reach,pose,...opts});
 const moves={
  jab:cut('右からの斜め斬り',5,6,3,132,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:cut('返し斬り',4,5,4,141,7,'front',{cancel:{start:6,end:15,input:'jab',next:'jab3'}}),
  jab3:cut('踏み込み突き',7,9,8,168,9),
  heavy:cut('水平一閃',8,11,10,183),
  up:cut('イザナギの斬り上げ',6,12,8,154,8,'up',{angle:-1.42,persona:1}),
  low:cut('足払い追撃',7,8,7,165,17,'low',{angle:-.23}),
  dashAttack:m('ショルダー・斬り上げ',12,[w(12,15)],14,0,{damage:11,reach:177,pose:15,impulse:4}),
  smash:m('ジオンガブレイク',13,[w(13,16)],23,0,{damage:21,reach:220,pose:9,baseKnockback:6.2,knockbackGrowth:.1,chargeFrame:4,chargeMaxFrames:60,persona:3,soundFamily:'thunder'}),
  upsmash:m('マハスクカジャ',14,[w(14,18,'up')],22,0,{damage:18,reach:195,pose:8,angle:-1.5,baseKnockback:5.8,knockbackGrowth:.094,chargeFrame:4,chargeMaxFrames:60,persona:0,soundFamily:'wind'}),
  downsmash:m('マハラギ・雷陣',12,[w(12,14,'low'),w(20,23,'back')],22,0,{damage:16,reach:198,pose:17,baseKnockback:5.5,knockbackGrowth:.09,chargeFrame:4,chargeMaxFrames:60,persona:5,soundFamily:'fire'}),
  air:m('ペルソナ斬り',6,[w(6,9,'spin')],12,7,{damage:8,reach:161,pose:10,aerial:true,persona:3}),
  fair:m('ジオ',6,[w(6,8)],12,10,{damage:10,reach:178,pose:9,aerial:true,soundFamily:'thunder'}),
  bair:m('ガル',7,[w(7,11,'back')],12,10,{damage:11,reach:170,pose:7,aerial:true,soundFamily:'wind'}),
  uair:m('マハスクカ',5,[w(5,9,'up')],13,8,{damage:9,reach:165,pose:8,aerial:true,angle:-1.5,soundFamily:'wind'}),
  dair:m('マハラギ',9,[w(9,13,'plunge')],16,14,{damage:13,reach:129,pose:11,aerial:true,meteorFrame:11,meteorAngle:1.45,soundFamily:'fire',persona:5}),
  dragon:m('ガル → ガルダイン',13,[],17,12,{pose:13,spellShots:[13,19],projectile:true,chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,soundFamily:'wind',shotLife:65}),
  dash:m('刑死者の鎖',9,[w(9,16)],22,15,{damage:4,reach:320,pose:12,spectralChain:true,chainRadius:13,chainStart:9,chainEnd:16,branchStart:18,branchEnd:36,pull:true,fixedKnockback:13,canClank:false,soundFamily:'chain',airControlMultiplier:.3}),
  chainSlash:m('刑死者の鎖・追撃斬り',7,[w(7,10)],16,15,{damage:13,reach:210,pose:9,special:true,persona:7,soundFamily:'sword',chaseStart:1,chaseEnd:5,chaseSpeed:18,baseKnockback:4.8,knockbackGrowth:.079}),
  rise:m('イザナギ・跳躍斬',5,[w(5,8,'up',{damage:3,baseKnockback:1.3,knockbackGrowth:.015}),w(28,31,'spin',{damage:8})],12,22,{damage:8,reach:170,pose:16,persona:1,soundFamily:'sword',verticalImpulse:-11,selectionStart:11,selectionEnd:22,warpFrame:25,warpDistance:200,warpDefault:170,vanishStart:23,vanishEnd:24,vanishAlpha:.08,intangibleFrames:[[23,26]],airControlMultiplier:0,helpless:true,animation:{anticipationEnd:2,anticipationPose:14,accelerationPose:16,followThroughFrames:4,recoveryPose:5,lean:-.03,lunge:0,impactScale:1.07}}),
  gale:m('ペルソナチェンジ・ラッシュ',8,[],16,12,{pose:18,preserveVelocity:false,soundFamily:'light',formDuration:360})
 };
 moves.rise.ledgeGrabStart=moves.rise.warpFrame;
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e}))};}
 for(const[id,name]of Object.entries({grab:'片手のつかみ',pummel:'柄の打撃',forwardThrow:'掴んで蹴り飛ばす',backThrow:'旋回投げ',upThrow:'イザナギの打ち上げ',downThrow:'地面への雷撃'}))moves[id].name=name;
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;if(a!==moves.rise)a.animation={...a.animation,anticipationPose:14};}
 return moves;
})();
const NarukamiRules=(()=>{
 const forms=[{name:'イザナギ',family:'wind',effect:2,persona:0,speed:11,damage:7,normalDamage:1.05,growth:1.05,count:1},{name:'ジライヤ',family:'wind',effect:2,persona:4,speed:12,damage:6,normalDamage:.92,growth:.92,count:2},{name:'コノハナサクヤ',family:'fire',effect:3,persona:5,speed:8,damage:11,normalDamage:1.18,growth:1.08,count:1},{name:'ジャックフロスト',family:'ice',effect:4,persona:6,speed:9,damage:8,normalDamage:1,growth:.96,count:1}];
 let objects=[];
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='narukami'){f.narukamiForm=0;f.narukamiFormTime=0;f.narukamiSideUsed=false;}}
 function form(f){return forms[f.narukamiForm||0];}
 function spawn(f,kind,v={}){const o={kind,owner:f.id,face:f.face,x:f.x+f.face*35,y:f.y-37,vx:0,vy:0,age:0,life:65,stale:f.attack?.staleMultiplier??1,hits:new Set(),...v};objects.push(o);return o;}
 function terrain(x,y,r=0){const p=platforms.find(p=>p.main);return x>p.x-r&&x<p.x+p.w+r&&y>p.y-r&&y<p.y+90+r;}
 function safeWarp(f,target){const p=platforms.find(p=>p.main),e=f.character.ecb,dx=target.x-f.x,dy=target.y-f.y,n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/6));let q={x:f.x,y:f.y,blocked:false};for(let j=1;j<=n;j++){const x=f.x+dx*j/n,y=f.y+dy*j/n;if(x>p.x-e.radius&&x<p.x+p.w+e.radius&&y>p.y+1&&y-e.height<p.y+90){q.blocked=true;break;}q={x,y,blocked:false};}return q;}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;a.formIndex=f.narukamiForm||0;
  if(a.type==='dash'){const o=BattlePlayers.target(f);a.chainOrigin={x:f.x+f.face*20,y:f.y-38};a.chainDy=!o.respawn&&(o.x-f.x)*f.face>0&&Math.abs(o.y-f.y)<100?clamp(o.y-f.y,-70,70):0;if(!f.grounded)f.narukamiSideUsed=true;}
  if(f.narukamiFormTime>0&&!['gale','dash','grab','pummel','rise'].includes(a.type)&&!a.type.endsWith('Throw')){const c=form(f);a.damage*=c.normalDamage;a.knockbackGrowth*=c.growth;a.activeFrames=a.activeFrames.map(w=>({...w,...(w.damage===undefined?{}:{damage:w.damage*c.normalDamage})}));a.rushForm=c;a.soundFamily=c.family;if(a.aerial&&a.formIndex===1)a.airControlMultiplier=1.25;}
 }
 function chain(f,t=f.timer){const a=f.attack,u=clamp((t-a.chainStart+1)/(a.chainEnd-a.chainStart+1),0,1),p=a.chainOrigin,end={x:p.x+f.face*a.reach*u,y:p.y+a.chainDy*u},n=Math.max(1,Math.ceil(Math.hypot(end.x-p.x,end.y-p.y)/5));let q={...p,blocked:false};for(let j=1;j<=n;j++){const x=lerp(p.x,end.x,j/n),y=lerp(p.y,end.y,j/n);if(terrain(x,y,a.chainRadius))return{...q,blocked:true};q={x,y,blocked:false};}return q;}
 function chainBox(f,a,w,t){const p=chain(f,t),q=chain(f,Math.max(w.start-1,t-1));if(p.blocked||q.blocked)return[];const n=Math.max(1,Math.ceil(Math.hypot(p.x-q.x,p.y-q.y)/5));for(let j=1;j<=n;j++)if(terrain(lerp(q.x,p.x,j/n),lerp(q.y,p.y,j/n)))return[];return[{x1:q.x,y1:q.y,x2:p.x,y2:p.y,radius:a.chainRadius,window:w}];}
 function onHit(f,o,a){if(a.spectralChain&&f.attack?.spectralChain){f.attack.chainTarget=o.id;f.attack.chainConfirmed=true;}}
 function teleport(f,target){const from={x:f.x,y:f.y},q=safeWarp(f,target);f.x=q.x;f.y=q.y;f.vx=0;f.vy=-2;f.grounded=false;f.fastFall=false;for(const v of[from,q])spawn(f,'portal',{x:v.x,y:v.y-38,life:13});GameAudio.cue('light-cast',.7,f);return q;}
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.spectralChain&&a.chainConfirmed&&t>=a.branchStart&&t<=a.branchEnd&&(i.jab||i.heavy||i.special||['jab','heavy','special'].includes(f.buffer?.key))){const target=a.chainTarget;attack(f,'chainSlash');f.attack.chainTarget=target;return;}
  if(a.type==='chainSlash'&&t>=a.chaseStart&&t<=a.chaseEnd){const o=fighters[a.chainTarget],p=o&&CombatSystem.protection(o);if(o&&!o.respawn&&!p.intangible&&!p.invincible&&Math.hypot(o.x-f.x,o.y-f.y)<300){const dx=o.x-f.x;f.face=Math.sign(dx)||f.face;const step=f.face*Math.max(0,Math.min(a.chaseSpeed,Math.abs(dx)-58)),q=safeWarp(f,{x:f.x+step,y:f.y});f.vx=q.x-f.x;}else f.vx=0;}else if(a.type==='chainSlash'&&t>a.chaseEnd)f.vx*=.6;
  if(a.type==='rise'){
   if(t===a.startupFrames){f.recovered=true;f.fastFall=false;}
   if(t===a.selectionStart&&!a.warpOrigin){a.warpOrigin={x:f.x,y:f.y};a.warpTarget={x:f.x,y:f.y-a.warpDefault};}
   if(t>=a.selectionStart&&t<=a.selectionEnd){if(Math.hypot(i.x,i.y)>.25){const len=Math.hypot(i.x,i.y);a.warpTarget={x:a.warpOrigin.x+i.x/len*a.warpDistance,y:a.warpOrigin.y+i.y/len*a.warpDistance};}a.gravityMultiplier=0;f.vx=f.vy=0;f.fastFall=false;}
   if(t===a.warpFrame&&!a.warped){a.warped=true;const q=teleport(f,a.warpTarget);a.warpBlocked=q.blocked;a.gravityMultiplier=1;}
  }
  if(a.type==='gale'&&t===a.startupFrames&&!a.objectSpawned){a.objectSpawned=true;f.narukamiForm=((f.narukamiForm||0)+1)%forms.length;f.narukamiFormTime=a.formDuration;f.narukamiFormFlash=frame+25;label(f.x,f.y-105,form(f).name,['#78ccff','#87dff3','#ffb172','#a0d9ff'][f.narukamiForm]);spawn(f,'change',{x:f.x,y:f.y-38,life:25,formIndex:f.narukamiForm});}
  if(a.type==='dragon'&&a.spellShots.includes(t)&&!a.eventsDone.has('spell:'+t)){const c=forms[a.formIndex],charged=a.charge>=.5,second=t!==a.startupFrames;if(second&&!charged&&c.count<2)return;a.eventsDone.add('spell:'+t);spawn(f,'spell',{vx:f.face*c.speed,vy:second?-.5:0,damage:c.damage+(charged?3:0),family:c.family,element:c.family==='ice'?'ice':null,effect:c.effect,persona:c.persona,charged,life:a.shotLife});}
 }
 function box(o){return{x1:o.previousX??o.x,y1:o.previousY??o.y,x2:o.x,y2:o.y,radius:o.charged?18:13};}
 function collide(o,f,unused){for(const e of BattlePlayers.targets(f)){if(o.dead)break;collideOne(o,f,e);}}
 function collideOne(o,f,e){if(e.respawn||e.hitlag||o.hits.has(e.id))return;const b=box(o),touch=CombatSystem.contact(b,e),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(e.mode)&&CombatSystem.shieldCovers(e,b);if(!(touch||shield)||CombatSystem.protection(e).intangible)return;o.hits.add(e.id);const counter=e.attack;if(counter?.counterWindow&&e.timer>=counter.counterWindow[0]&&e.timer<=counter.counterWindow[1]){attack(e,counter.counterMove);e.inv=e.attack.totalFrames;}else CombatSystem.hit(f,e,{...NarukamiMoves.dragon,type:'dragon',damage:o.damage,charge:0,staleMultiplier:o.stale,projectile:true,soundFamily:o.family,element:o.element,baseKnockback:3.3,knockbackGrowth:o.family==='fire'?.078:.06,angle:o.family==='wind'?-.65:-.4,launchDirection:o.face},b,touch);o.dead=true;spawn(f,'spark',{x:o.x,y:o.y,effect:o.effect,life:10});}
 function tick(){for(const f of fighters)if(f.characterId==='narukami'){if(f.grounded||f.ledge||f.respawn)f.narukamiSideUsed=false;if(f.respawn){f.narukamiForm=f.narukamiFormTime=0;}else if(!f.hitlag&&f.narukamiFormTime>0&&--f.narukamiFormTime===0)f.narukamiForm=0;}
  for(const o of objects){const f=fighters[o.owner],e=BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}o.age++;o.previousX=o.x;o.previousY=o.y;if(o.kind==='spell'){const n=Math.max(1,Math.ceil(Math.hypot(o.vx,o.vy)/5));for(let j=0;j<n;j++){o.x+=o.vx/n;o.y+=o.vy/n;if(terrain(o.x,o.y)){o.dead=true;break;}}if(!o.dead)collide(o,f,e);}if(o.age>=o.life||o.x<-900||o.x>2300||o.y>1600||o.y<-1100)o.dead=true;}objects=objects.filter(o=>!o.dead);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main),under=f.y>p.y+25&&f.x>p.x-20&&f.x<p.x+p.w+20;if(f.attack?.type==='rise'){i.x=f.x<p.x?1:f.x>p.x+p.w?-1:0;i.y=-1;i.special=i.guard=i.guardPressed=i.jab=i.heavy=i.smash=false;}else if(!f.attack&&under&&!f.recovered){const dir=f.x<p.x+p.w/2?-1:1,dist=dir<0?f.x-p.x:p.x+p.w-f.x;i.x=dir;i.y=dist<55?-1:0;i.special=dist<55;i.jump=dist>=55&&f.airJumps>0&&f.vy>0;i.jab=i.heavy=i.smash=i.guard=false;}else if(f.attack?.spectralChain&&f.attack.chainConfirmed&&f.timer>=f.attack.branchStart){i.jab=true;i.special=i.guard=false;}else if(!f.attack&&f.grounded&&Math.abs(o.x-f.x)>240&&frame%180===0&&f.narukamiFormTime<60){i.x=0;i.y=1;i.special=true;i.jab=i.heavy=i.smash=i.guard=false;}if(f.attack?.type==='dragon')i.specialHeld=Math.abs(o.x-f.x)>220&&f.attack.chargeFrames<45;return i;}
 return{forms,form,reset,prepare,action,onHit,tick,cpu,chain,chainBox,safeWarp,terrain,box,get objects(){return objects;}};
})();

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('narukami',{"jab2":{"strike":[6,7],"windup":14},"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"fair":{"strike":[13],"windup":14},"smash":{"strike":[13,9],"windup":14},"jab3":{"strike":[7,9],"windup":14},"downsmash":{"strike":[17,7],"windup":14}});

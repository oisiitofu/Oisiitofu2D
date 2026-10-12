'use strict';
// Inclusive one-based simulation frames at 60 Hz, shared by motion and collision.
const KosmosMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,s,e,damage,reach,pose=9,shape='front',opts={})=>m(name,s,[w(s,e,shape)],10,0,{damage,reach,pose,soundFamily:'sword',...opts});
 const link={damage:3,baseKnockback:1.4,knockbackGrowth:.015};
 const moves={
  jab:cut('Rブレード I',5,6,3,130,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:cut('エルボーブレード',4,5,4,138,7,'front',{cancel:{start:6,end:15,input:'jab',next:'jab3'}}),
  jab3:cut('掌の小型ビーム',7,9,8,164,13,'front',{soundFamily:'light'}),
  heavy:cut('Rブレード・薙ぎ',8,11,10,180,6),up:cut('Rブレード・アッパー',6,12,8,153,8,'up',{angle:-1.4}),low:cut('低い蹴り払い',7,8,7,158,17,'low',{soundFamily:'punch',angle:-.2}),
  dashAttack:m('スライド・ショルダー',12,[w(12,15)],13,0,{damage:11,reach:161,pose:15,impulse:4,soundFamily:'punch'}),
  smash:m('R-CANNON BREAK',14,[w(14,17,'front')],25,0,{damage:22,reach:252,pose:9,chargeFrame:4,chargeMaxFrames:60,baseKnockback:6.4,knockbackGrowth:.103,cannonMelee:true,soundFamily:'light'}),
  upsmash:m('G-SHELL ARRAY',13,[w(13,17,'up')],24,0,{damage:19,reach:218,pose:8,angle:-1.5,chargeFrame:4,chargeMaxFrames:60,nodeArray:true,soundFamily:'light'}),
  downsmash:m('DRAGON TOOTH SWEEP',10,[w(10,12,'low'),w(20,23,'back',{pose:17})],23,0,{damage:17,reach:205,pose:17,chargeFrame:4,chargeMaxFrames:60,soundFamily:'sword'}),
  air:m('Gシェル・周回',6,[w(6,7,'spin',{...link}),w(15,20,'spin',{damage:7})],12,7,{damage:7,reach:165,pose:10,aerial:true,nodeOrbit:true,soundFamily:'light'}),
  fair:m('大振りブレード',6,[w(6,8)],12,10,{damage:10,reach:183,pose:6,aerial:true,soundFamily:'sword'}),
  bair:m('後方キャノン',7,[w(7,11,'back')],12,10,{damage:12,reach:189,pose:7,aerial:true,cannonMelee:true,soundFamily:'light'}),
  uair:m('Gシェル・クロス',5,[w(5,9,'up')],13,8,{damage:9,reach:170,pose:8,aerial:true,nodeArray:true,angle:-1.5,soundFamily:'light'}),
  dair:m('下方キャノン・反動',9,[w(9,13,'down')],16,14,{damage:13,reach:157,pose:11,aerial:true,meteorFrame:11,meteorAngle:1.45,meteorMultiplier:1.15,cannonMelee:true,timeline:[{frame:9,type:'SetVelocity',y:-5}],soundFamily:'light'}),
  dragon:m('エックスバスター',11,[],19,14,{pose:13,beamShot:true,spellShots:[11],chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,beamLife:38,beamLevels:[{threshold:0,damage:8,speed:21,radius:8,length:95},{threshold:.33,damage:13,speed:24,radius:13,length:150},{threshold:.75,damage:21,speed:27,radius:19,length:210}],soundFamily:'light'}),
  dash:m('Sチェイン・マニューバ',9,[w(9,16,'front')],20,14,{damage:4,reach:325,pose:12,energyChain:true,chainStart:9,chainEnd:16,chainReturn:24,chainRadius:12,branchStart:17,branchEnd:33,feintStart:10,pull:true,fixedKnockback:12,canClank:false,airControlMultiplier:.3,soundFamily:'chain'}),
  chainReel:m('Sチェイン・引き寄せ斬り',8,[w(8,11)],16,14,{damage:13,reach:180,pose:6,special:true,reel:true,reelFrames:[1,7],pullSpeed:13,stopDistance:62,preserveVelocity:false,soundFamily:'sword'}),
  chainSwing:m('Sチェイン・スイング斬り',24,[w(24,27,'front')],17,16,{damage:15,reach:195,pose:16,special:true,swing:true,swingStart:3,swingEnd:23,swingHeight:110,swingDistance:145,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:24,soundFamily:'sword',animationWindows:[{start:3,end:23,pose:16}],animation:{anticipationEnd:2,anticipationPose:3,accelerationPose:16,followThroughFrames:5,recoveryPose:5,lean:0,lunge:0,impactScale:1.1}}),
  chainFeint:m('Sチェイン・離脱',1,[],9,8,{pose:15,special:true,feint:true,retreatEnd:8,retreatSpeed:5.3,airControlMultiplier:0,soundFamily:'wind',animationWindows:[{start:1,end:8,pose:15}]}),
  rise:m('Gシェル・グラビティステップ',6,[w(13,15,'spin',{...link}),w(31,33,'spin',{...link}),w(49,52,'spin',{damage:10})],15,22,{damage:10,reach:155,pose:16,gravityStep:true,nodeDeployFrame:6,stepFrames:[12,30,48],selectionFrames:[[6,11],[16,27],[34,45]],branchFrames:[[16,27],[34,45]],nodeDistances:[200,125,125],nodeRadius:36,vanishFrames:[[12,12],[30,30],[48,48]],gravityMultiplier:0,airControlMultiplier:0,helpless:true,ledgeGrabStart:12,canClank:false,soundFamily:'light',animationWindows:[{start:6,end:12,pose:13},{start:16,end:30,pose:5},{start:34,end:48,pose:5}],animation:{anticipationEnd:2,anticipationPose:3,accelerationPose:13,followThroughFrames:5,recoveryPose:5,lean:0,lunge:0,impactScale:1.08}}),
  gale:m('Rドリル・地上',12,[w(12,14,'front',{...link}),w(19,21,'front',{...link}),w(25,27,'front',{damage:11})],18,14,{damage:11,reach:176,pose:15,drill:true,drillSpeed:6.5,driveFrames:[8,27],soundFamily:'saber'}),
  airDrill:m('Rドリル・空中',10,[w(10,64,'plunge')],14,16,{damage:12,reach:122,pose:11,special:true,drill:true,airDrill:true,drillSpeed:5,diveSpeed:14,gravityMultiplier:0,airControlMultiplier:0,landingMove:'drillImpact',autoCancelWindow:[],landingFlag:[1,Infinity],canClank:false,soundFamily:'saber'}),
  drillImpact:m('Rドリル・着地衝撃',1,[w(1,4,'shockwave')],15,0,{damage:9,reach:193,pose:17,special:true,preserveVelocity:false,canClank:false,soundFamily:'hammer'})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:'light'};}
 moves.grab.name='エネルギーテザー';moves.grab.reach=82;moves.pummel.name='瞬間電撃';moves.forwardThrow.name='引き寄せブレード';moves.backThrow.name='背後射出';moves.upThrow.name='浮遊・上方射出';moves.downThrow.name='叩きつけ砲撃';
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;if(!a.gravityStep&&!a.swing)a.animation={...a.animation,anticipationPose:14,accelerationPose:14};}
 return moves;
})();
const KosmosRules=(()=>{
 let objects=[];
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='kosmos'){f.kosmosSideUsed=f.kosmosDrillUsed=false;}}
 function terrain(x,y,r=0){const p=platforms.find(p=>p.main);return x>p.x-r&&x<p.x+p.w+r&&y>p.y+1&&y<p.y+90+r;}
 function fresh(f,i,key='special'){return !!i[key]||f.buffer?.key===key;}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;if(a.energyChain&&!f.grounded)f.kosmosSideUsed=true;if(a.airDrill)f.kosmosDrillUsed=true;
  if(a.beamShot)a.animation={...a.animation,anticipationPose:13,accelerationPose:13};
  if(a.energyChain){const o=BattlePlayers.target(f);a.launchDirection=-f.face;a.chainOrigin={x:f.x+f.face*20,y:f.y-40};a.chainDy=!o.respawn&&(o.x-f.x)*f.face>0?clamp(o.y-f.y,-80,80):0;}
  if(a.gravityStep){a.stepIndex=0;a.stepConfirmed=[true,false,false];a.nodeTargets=[];a.stepOrigins=[];a.nodeDirection={x:0,y:-1};a.nodeStatus=[];}
 }
 function tip(f,t=f.timer){const a=f.attack,range=a.reach,u=t<=a.chainEnd?clamp((t-a.chainStart+1)/(a.chainEnd-a.chainStart+1),0,1):1-clamp((t-a.chainEnd)/(a.chainReturn-a.chainEnd),0,1),from=a.chainOrigin,to={x:f.x+f.face*(24+range*u),y:f.y-40+a.chainDy*u},n=Math.max(1,Math.ceil(Math.hypot(to.x-from.x,to.y-from.y)/5));let q={...from,blocked:false};for(let j=1;j<=n;j++){const x=lerp(from.x,to.x,j/n),y=lerp(from.y,to.y,j/n);if(terrain(x,y,a.chainRadius))return{...q,blocked:true};q={x,y,blocked:false};}return q;}
 function chainBox(f,a,w,t){const p=tip(f,t),q=tip(f,Math.max(w.start-1,t-1));if(p.blocked)return[];return[{x1:q.x,y1:q.y,x2:p.x,y2:p.y,radius:a.chainRadius,window:w}];}
 function onHit(f,o,a){if(a.energyChain&&f.attack?.energyChain){f.attack.chainConfirmed=true;f.attack.chainTarget=o.id;}
  if(a.airDrill&&!f.grounded){f.attack=null;f.gravityOff=false;f.fastFall=false;f.vy=-8;f.vx*=.45;f.specialLandingLag=0;PlayerStates.enter(f,'Fall');GameAudio.cue('double-jump',.65,f);}
 }
 function targetValid(f,id){const o=fighters[id],p=o&&CombatSystem.protection(o);return o&&!o.respawn&&!p.intangible&&!p.invincible&&Math.hypot(o.x-f.x,o.y-f.y)<440&&!['ShieldHold','ShieldStart','Grabbed'].includes(o.mode)?o:null;}
 function node(f,index,direction){const a=f.attack,from=a.stepOrigins[index]||{x:f.x,y:f.y},d=Math.hypot(direction.x,direction.y)||1,to={x:from.x+direction.x/d*a.nodeDistances[index],y:from.y+direction.y/d*a.nodeDistances[index]},q=NaegiRules.safeStep(f,to);return{...q};}
 function stopSteps(f,a,index){a.stepsStopped=true;a.gravityMultiplier=1;a.helpless=true;f.timer=a.activeFrames[index].end+1;a.totalFrames=f.timer+a.recoveryFrames-1;a.FAF=a.totalFrames+1;a.motionEndFrames=a.totalFrames;a.activeFrames=a.activeFrames.slice(0,index+1);a.activeEnd=a.activeFrames.at(-1).end;a.animationWindows=(a.animationWindows||[]).filter(w=>w.start<=a.activeEnd);a.nodeStatus[index]='done';f.stateDuration=a.totalFrames;f.stateEnd=frame+a.recoveryFrames;f.faf=a.FAF;}
 function action(f,i=emptyInput()){
  const a=f.attack;if(!a)return;const t=f.timer;if(a.beamShot)a.pose=a.charge>=.75?9:13;
  if(a.energyChain){if(t>=a.feintStart&&i.guardPressed){attack(f,'chainFeint');return;}
   if(a.chainConfirmed&&t>=a.branchStart&&t<=a.branchEnd&&fresh(f,i)){const id=a.chainTarget,o=targetValid(f,id);if(!o){a.chainConfirmed=false;return;}const swing=i.y<-.4;attack(f,swing?'chainSwing':'chainReel');f.attack.chainTarget=id;if(swing){f.attack.swingOrigin={x:f.x,y:f.y};f.attack.swingTarget={x:o.x+f.face*f.attack.swingDistance,y:o.y-15};f.attack.swingDirection=f.face;f.grounded=false;f.vy=-1;}return;}
  }
  if(a.reel){const o=targetValid(f,a.chainTarget);if(o&&t>=a.reelFrames[0]&&t<=a.reelFrames[1]&&!o.hitlag){const dx=f.x-o.x,dist=Math.abs(dx),step=Math.sign(dx)*Math.min(a.pullSpeed,Math.max(0,dist-a.stopDistance)),q=NaegiRules.safeStep(o,{x:o.x+step,y:o.y});o.vx=q.x-o.x;}}
  if(a.swing&&t>=a.swingStart&&t<=a.swingEnd){const u=(t-a.swingStart+1)/(a.swingEnd-a.swingStart+1),from=a.swingOrigin,to=a.swingTarget,target={x:lerp(from.x,to.x,u),y:lerp(from.y,to.y,u)-Math.sin(u*Math.PI)*a.swingHeight},q=WillRules.slideStep(f,target);f.vx=q.x-f.x;f.vy=q.y-f.y;f.grounded=false;f.fastFall=false;a.swingBlocked ||= q.blocked;f.face=-a.swingDirection;}
  if(a.swing&&t>a.swingEnd){a.gravityMultiplier=t<=a.activeEnd?0:1;f.vx*=.5;if(t<=a.activeEnd)f.vy=-.2;}
  if(a.feint&&t<=a.retreatEnd){f.vx=-f.face*a.retreatSpeed;if(!f.grounded)f.vy*=.7;}
  if(a.gravityStep&&!a.stepsStopped){f.fastFall=false;
   if(t===a.nodeDeployFrame){f.recovered=true;f.specialLandingLag=a.landingLagFrames;f.grounded=false;}
   const index=a.selectionFrames.findIndex(([s,e])=>t>=s&&t<=e);if(index>=0){a.stepIndex=index;if(!a.stepOrigins[index])a.stepOrigins[index]={x:f.x,y:f.y};if(Math.hypot(i.x,i.y)>.3)a.nodeDirection={x:i.x,y:i.y};a.nodeTargets[index]=node(f,index,a.nodeDirection);f.vx=0;f.vy=-.3;a.gravityMultiplier=0;f.grounded=false;
    if(index>0&&!a.stepConfirmed[index]&&fresh(f,i)){a.stepConfirmed[index]=true;a.nodeStatus[index]='locked';}if(index>0&&a.stepConfirmed[index])f.buffer=null;
   }
   for(let n=0;n<a.stepFrames.length;n++){if(t!==a.stepFrames[n]||!a.stepConfirmed[n])continue;const from={x:f.x,y:f.y},q=NaegiRules.safeStep(f,a.nodeTargets[n]||node(f,n,a.nodeDirection));f.x=q.x;f.y=q.y;f.vx=f.vy=0;f.grounded=false;a.nodeStatus[n]=q.blocked?'blocked':'used';a.stepIndex=n;a.stepOrigins[n+1]={x:f.x,y:f.y};a.nodeDirection={x:0,y:-1};a.nodeTargets[n+1]=n<2?node(f,n+1,a.nodeDirection):null;objects.push({kind:'stepFlash',owner:f.id,x:from.x,y:from.y-40,age:0,life:10},{kind:'stepFlash',owner:f.id,x:q.x,y:q.y-40,age:0,life:10});GameAudio.cue('double-jump',.65,f);}
   if(t===a.selectionFrames[1][1]+1&&!a.stepConfirmed[1]){stopSteps(f,a,0);return;}if(t===a.selectionFrames[2][1]+1&&!a.stepConfirmed[2]){stopSteps(f,a,1);return;}if(t>a.activeEnd){a.gravityMultiplier=1;}
  }
  if(a.drill){if(a.airDrill&&t>=a.startupFrames)f.vx=f.face*a.drillSpeed;else if(!a.airDrill&&t>=a.driveFrames[0]&&t<=a.driveFrames[1])f.vx=f.face*a.drillSpeed;}
  if(a.beamShot&&a.spellShots.includes(t)&&!a.eventsDone.has('beam:'+t)){a.eventsDone.add('beam:'+t);const level=a.beamLevels.filter(l=>a.charge>=l.threshold).at(-1);objects.push({kind:'beam',owner:f.id,face:f.face,x:f.x+f.face*40,y:f.y-41,originX:f.x+f.face*40,previousX:f.x+f.face*40,age:0,life:a.beamLife,charge:a.charge,stale:a.staleMultiplier,hits:new Set(),vx:f.face*level.speed,radius:level.radius,length:level.length,damage:level.damage});f.vx-=f.face*(1+a.charge*2);}
 }
 function beamBox(q){const tail=q.face>0?Math.max(q.originX,q.x-q.length):Math.min(q.originX,q.x+q.length);return{x1:tail,y1:q.y,x2:q.x,y2:q.y,radius:q.radius};}
 function collide(q){for(const o of BattlePlayers.targets(fighters[q.owner])){if(q.dead)break;collideOne(q,o);}}
 function collideOne(q,o){const f=fighters[q.owner];if(o.respawn||o.hitlag||q.hits.has(o.id))return;const b=beamBox(q),contact=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(!(contact||shield)||CombatSystem.protection(o).intangible)return;q.hits.add(o.id);const counter=o.attack;if(counter?.counterWindow&&o.timer>=counter.counterWindow[0]&&o.timer<=counter.counterWindow[1]){attack(o,counter.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,{...KosmosMoves.dragon,type:'dragon',damage:q.damage,charge:0,staleMultiplier:q.stale,projectile:true,soundFamily:'light',angle:-.4,baseKnockback:q.charge>=.75?5:3.4,knockbackGrowth:q.charge>=.75?.082:.06,launchDirection:q.face},b,contact);if(shield||q.charge<.75)q.dead=true;}
 function tick(){for(const f of fighters)if(f.characterId==='kosmos'&&(f.grounded||f.ledge||f.respawn)){f.kosmosSideUsed=f.kosmosDrillUsed=false;}
  for(const q of objects){const f=fighters[q.owner];if(!f||f.respawn){q.dead=true;continue;}q.age++;if(q.kind==='beam'){q.previousX=q.x;const n=Math.max(1,Math.ceil(Math.abs(q.vx)/5));for(let j=0;j<n;j++){q.x+=q.vx/n;if(terrain(q.x,q.y,q.radius)){q.dead=true;break;}}if(!q.dead)collide(q);}if(q.age>=q.life)q.dead=true;}objects=objects.filter(q=>!q.dead);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main),under=!f.grounded&&f.y>p.y+35&&f.x>p.x-20&&f.x<p.x+p.w+20;
  if(f.attack?.gravityStep){const a=f.attack,index=a.stepIndex||0;i.jump=i.jab=i.heavy=i.smash=i.guard=false;i.special=index>0&&a.branchFrames[index-1]&&f.timer===a.branchFrames[index-1][0]+2;const dy=p.y-f.y,dx=f.x<p.x?p.x-f.x:f.x>p.x+p.w?p.x+p.w-f.x:0;i.x=Math.abs(dx)>30&&f.y<p.y+95?Math.sign(dx)*.7:0;i.y=-1;}
  else if(f.attack?.energyChain){i.special=!!f.attack.chainConfirmed&&f.timer===f.attack.branchStart+2;i.y=o.y<f.y-50?-1:0;i.x=0;i.jump=i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&under&&!f.recovered){i.x=f.x<p.x+p.w/2?-1:1;i.y=0;i.special=i.jump=i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&!f.grounded&&!f.recovered&&f.y>p.y-100&&(f.x<p.x||f.x>p.x+p.w)){const inward=Math.sign(p.x+p.w/2-f.x);i.x=f.y>p.y+90+f.character.ecb.height+8?-inward*.2:inward;i.special=f.airJumps<=0&&f.vy>=-2;i.y=i.special?-1:0;i.jump=f.airJumps>0&&f.vy>=0;if(i.special)i.x=0;i.jab=i.heavy=i.smash=i.guard=false;}
  if(f.attack?.beamShot)i.specialHeld=Math.abs(o.x-f.x)>260&&f.attack.chargeFrames<48;return i;
 }
 function arrayBoxes(f,a,w){return [-1,0,1].map(dir=>({x1:f.x+dir*35,y1:f.y-45,x2:f.x+dir*85,y2:f.y-(w.reach??a.reach)*FIGHTER_SCALE-45,radius:10,window:w}));}
 return{reset,prepare,action,onHit,tick,cpu,terrain,tip,chainBox,arrayBoxes,node,beamBox,get objects(){return objects;}};
})();

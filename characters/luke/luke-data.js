'use strict';
// One-based inclusive 60 Hz windows drive the poses, collisions and branches.
const LukeMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,s,e,d,r,p=9,shape='front',extra={})=>m(name,s,[w(s,e,shape)],10,0,{damage:d,reach:r,pose:p,soundFamily:'sword',...extra});
 const link={damage:4,baseKnockback:1.5,knockbackGrowth:.016};
 const moves={
  jab:cut('叩き斬り',5,6,3,122,6,'front',{cancel:{start:7,end:16,input:'jab',next:'jab2'}}),
  jab2:cut('連続斬り',4,5,4,132,7,'front',{cancel:{start:6,end:15,input:'jab',next:'jab3'}}),
  jab3:cut('跳び斬り',7,9,8,151,8,'up',{impulse:2,angle:-1.1}),
  heavy:cut('烈空斬',8,11,10,178),up:cut('飛燕斬',6,11,8,148,8,'up',{angle:-1.4}),low:cut('円閃',7,8,7,160,17,'low',{angle:-.2}),
  dashAttack:m('滑り斬り',12,[w(12,15)],13,0,{damage:11,reach:174,pose:15,impulse:5,soundFamily:'sword'}),
  smash:m('爪竜連牙斬',12,[w(12,14,'front',{...link,pose:7}),w(20,23,'front',{damage:16,pose:9})],24,0,{damage:16,reach:215,pose:9,chargeFrame:4,chargeMaxFrames:60,baseKnockback:6.2,knockbackGrowth:.1,soundFamily:'sword'}),
  upsmash:m('絶風刃',13,[w(13,17,'up')],24,0,{damage:19,reach:220,pose:8,angle:-1.5,chargeFrame:4,chargeMaxFrames:60,soundFamily:'wind'}),
  downsmash:m('魔神剣・双牙',11,[w(11,13,'low'),w(20,23,'back',{pose:17})],23,0,{damage:17,reach:193,pose:17,chargeFrame:4,chargeMaxFrames:60,soundFamily:'fire'}),
  air:m('空中連斬',6,[w(6,7,'front',{...link,damage:3,pose:6}),w(15,20,'spin',{damage:7})],12,7,{damage:7,reach:152,pose:10,aerial:true,soundFamily:'sword'}),
  fair:m('空中・烈空斬',6,[w(6,8)],12,10,{damage:10,reach:174,pose:9,aerial:true,soundFamily:'sword'}),
  bair:m('双牙・散華',7,[w(7,11,'back')],12,10,{damage:12,reach:161,pose:7,aerial:true,soundFamily:'sword'}),
  uair:m('飛燕連脚',5,[w(5,9,'up')],13,8,{damage:9,reach:146,pose:16,aerial:true,angle:-1.5,soundFamily:'punch'}),
  dair:m('魔神剣・落星',9,[w(9,13,'down')],16,14,{damage:13,reach:153,pose:11,aerial:true,meteorFrame:11,meteorAngle:1.45,meteorMultiplier:1.15,soundFamily:'sword'}),
  dragon:m('虎牙破斬',9,[w(9,11)],15,12,{damage:11,reach:176,pose:13,chargeFrame:4,chargeButton:'special',chargeMaxFrames:55,tigerBlade:true,waveFrame:9,waveSpeed:11,waveLife:32,waveRadius:19,spellShots:[9],soundFamily:'sword'}),
  dash:m('獅子戦吼 I',9,[w(9,11,'front',{...link,damage:5})],20,12,{damage:5,reach:164,pose:6,lionChain:true,step:1,branchStart:12,branchEnd:26,advanceFrames:[6,11],advanceSpeed:3,soundFamily:'sword'}),
  lionAdvance:m('獅子戦吼 II・連斬',5,[w(5,8)],17,12,{damage:6,reach:178,pose:7,lionChain:true,step:2,branchStart:9,branchEnd:23,advanceFrames:[3,8],advanceSpeed:4,special:true,soundFamily:'sword'}),
  lionFeint:m('獅子戦吼 II・引き斬り',14,[w(14,16)],12,12,{damage:9,reach:220,pose:9,lionChain:true,step:2,branchStart:17,branchEnd:26,retreatFrames:[1,8],retreatSpeed:6,special:true,soundFamily:'sword',animationWindows:[{start:1,end:8,pose:15,phase:'anticipation'},{start:9,end:13,pose:14,phase:'acceleration'}]}),
  lionFinish:m('獅子戦吼 III・咆哮',12,[w(12,14,'front')],24,14,{damage:10,reach:151,pose:9,lionRoar:true,spellShots:[12],roarFrame:12,roarLife:14,roarSpeed:9,roarRadius:38,special:true,baseKnockback:5.8,knockbackGrowth:.093,soundFamily:'fire'}),
  rise:m('飛燕連脚・翔',5,[w(5,7,'up',{...link,damage:3,pose:16}),w(11,13,'front',{damage:5,pose:8})],18,20,{damage:5,reach:151,pose:16,falcon:true,aimEnd:4,flightStart:5,flightEnd:18,flightSpeed:9.5,flightLift:17.5,turnControl:2,branchStart:19,branchEnd:26,hoverFrames:[19,26],hoverFall:.4,airControlMultiplier:0,ledgeGrabStart:5,canClank:false,autoCancelWindow:[],landingFlag:[1,Infinity],soundFamily:'punch',animationWindows:[{start:8,end:10,pose:16},{start:14,end:18,pose:16},{start:19,end:26,pose:5}]}),
  falconKick:m('飛燕連脚・横蹴り',4,[w(4,7,'front')],14,18,{damage:10,reach:168,pose:16,falconKick:true,kickFrames:[4,11],kickSpeed:10,kickLift:3,gravityMultiplier:1,airControlMultiplier:0,special:true,canClank:false,soundFamily:'punch'}),
  falconFall:m('飛燕連脚・落星',6,[w(6,38,'plunge')],12,16,{damage:12,reach:128,pose:11,diveSpeed:15,gravityMultiplier:0,airControlMultiplier:.2,landingMove:'falconImpact',special:true,autoCancelWindow:[],landingFlag:[1,Infinity],canClank:false,soundFamily:'sword'}),
  falconImpact:m('落星・衝撃',1,[w(1,4,'shockwave')],16,0,{damage:8,reach:195,pose:17,preserveVelocity:false,special:true,canClank:false,soundFamily:'fire'}),
  gale:m('魔神剣・強化',12,[],14,14,{pose:14,activationFrame:12,demonDuration:360,demonCooldown:480,speedMultiplier:1.12,reachMultiplier:1.16,damageMultiplier:1.08,preserveVelocity:false,soundFamily:'fire'}),
  demonStop:m('魔神剣・解除',4,[],6,10,{pose:18,activationFrame:4,special:true,preserveVelocity:false,soundFamily:'fire'})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:id==='pummel'?'punch':'sword'};}
 for(const[id,name]of Object.entries({grab:'片手つかみ',pummel:'柄打ち',forwardThrow:'蹴り飛ばし',backThrow:'後方返し斬り',upThrow:'天高く斬り上げ',downThrow:'地面への叩きつけ'}))moves[id].name=name;
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;a.animation={...a.animation,anticipationPose:14,accelerationPose:14};}
 moves.rise.animation={...moves.rise.animation,anticipationPose:3,accelerationPose:16,lunge:0,lean:0};
 moves.lionFeint.animation={...moves.lionFeint.animation,anticipationEnd:8,anticipationPose:15,accelerationPose:7,lunge:0,lean:.08};
 return moves;
})();
const LukeRules=(()=>{
 let objects=[];
 const speedKeys=['walkSpeed','initialDashSpeed','runSpeed','airSpeed'];
 function speeds(f){for(const k of speedKeys)f.character[k]=CharacterData.luke[k]*(f.lukeDemonTime?LukeMoves.gale.speedMultiplier:1);}
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='luke'){f.lukeSideUsed=false;f.lukeDemonTime=0;f.lukeDemonCooldown=0;speeds(f);}}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;
  if(a.type==='dash'&&!f.grounded)f.lukeSideUsed=true;
  if(a.falcon){a.flightDirection=Math.abs(f.input?.x||0)>.2?Math.sign(f.input.x):f.x<320?1:f.x>1120?-1:f.face;}
  if(f.lukeDemonTime&&!['gale','demonStop','grab','pummel'].includes(a.type)&&!a.type.endsWith('Throw')){a.demonBoost=true;a.damage*=LukeMoves.gale.damageMultiplier;a.reach*=LukeMoves.gale.reachMultiplier;a.activeFrames=a.activeFrames.map(w=>({...w,...(w.damage!==undefined?{damage:w.damage*LukeMoves.gale.damageMultiplier}:{}),...(w.reach!==undefined?{reach:w.reach*LukeMoves.gale.reachMultiplier}:{})}));}
 }
 function spawn(f,kind,a){const roar=kind==='roar';objects.push({kind,owner:f.id,x:f.x+f.face*40,y:f.y-37,previousX:f.x+f.face*40,face:f.face,vx:f.face*(roar?a.roarSpeed:a.waveSpeed),age:0,life:roar?a.roarLife:a.waveLife,radius:roar?a.roarRadius:a.waveRadius+(a.charge||0)*10,damage:(roar?12:7+(a.charge||0)*5)*(a.demonBoost?LukeMoves.gale.damageMultiplier:1),stale:a.staleMultiplier,hits:new Set(),charge:a.charge||0});}
 function fresh(f,i){return i.special||f.buffer?.key==='special';}
 function slideStep(f,target){const q=NaegiRules.safeStep(f,target);if(!q.blocked)return q;const vertical=NaegiRules.safeStep(f,{x:f.x,y:target.y}),horizontal=NaegiRules.safeStep({...f,x:vertical.x,y:vertical.y},{x:target.x,y:vertical.y});return{...horizontal,blocked:true};}
 function action(f,i=emptyInput()){
  const a=f.attack;if(!a)return;const t=f.timer;
  if(a.lionChain){if(a.advanceFrames&&t>=a.advanceFrames[0]&&t<=a.advanceFrames[1])f.vx=f.face*a.advanceSpeed;
   if(a.retreatFrames&&t>=a.retreatFrames[0]&&t<=a.retreatFrames[1])f.vx=-f.face*a.retreatSpeed;
   if(a.retreatFrames&&t===a.retreatFrames[1]+1)f.vx=0;
   if(t>=a.branchStart&&t<=a.branchEnd&&fresh(f,i)){if(a.step===1)attack(f,i.x*f.face<-.4?'lionFeint':'lionAdvance');else attack(f,'lionFinish');return;}
  }
  if(a.tigerBlade&&t===a.waveFrame&&!a.objectSpawned){a.objectSpawned=true;if(a.charge>=.5)spawn(f,'tiger',a);}
  if(a.lionRoar&&t===a.roarFrame&&!a.objectSpawned){a.objectSpawned=true;spawn(f,'roar',a);}
  if(a.falcon){if(t<=a.aimEnd&&Math.abs(i.x)>.2)a.flightDirection=Math.sign(i.x);
   if(t===a.flightStart){f.face=a.flightDirection;f.grounded=false;f.recovered=true;f.fastFall=false;f.specialLandingLag=a.landingLagFrames;GameAudio.cue('double-jump',.8,f);}
   if(t>=a.flightStart&&t<=a.flightEnd){a.gravityMultiplier=0;f.fastFall=false;const u=(t-a.flightStart)/(a.flightEnd-a.flightStart),vx=a.flightDirection*a.flightSpeed*(1-u*.4)+(i.x||0)*a.turnControl,vy=-a.flightLift*(1-u*.24),q=slideStep(f,{x:f.x+vx,y:f.y+vy});f.vx=q.x-f.x;f.vy=q.y-f.y;f.grounded=false;if(q.blocked)a.flightBlocked=true;}
   if(t>=a.hoverFrames[0]&&t<=a.hoverFrames[1]){a.gravityMultiplier=0;f.vx*=.85;f.vy=a.hoverFall;f.fastFall=false;}
   if(t>=a.branchStart&&t<=a.branchEnd&&fresh(f,i)){if(i.y>.4)attack(f,'falconFall');else{if(Math.abs(i.x)>.2)f.face=Math.sign(i.x);attack(f,'falconKick');}return;}
   if(t>a.hoverFrames[1])a.gravityMultiplier=1;
  }
  if(a.falconKick&&t>=a.kickFrames[0]&&t<=a.kickFrames[1]){f.vx=f.face*a.kickSpeed;f.vy=-a.kickLift;f.grounded=false;f.fastFall=false;}
  if(a.type==='gale'&&t===a.activationFrame&&!a.activated){a.activated=true;f.lukeDemonTime=a.demonDuration;f.lukeDemonCooldown=a.demonCooldown;speeds(f);label(f.x,f.y-108,'魔神剣','#ff7795');}
  if(a.type==='demonStop'&&t===a.activationFrame&&!a.activated){a.activated=true;f.lukeDemonTime=0;speeds(f);}
 }
 function box(q){return{x1:q.previousX,y1:q.y,x2:q.x,y2:q.y,radius:q.radius};}
 function tick(){
  for(const f of fighters)if(f.characterId==='luke'){if(f.grounded||f.ledge||f.respawn)f.lukeSideUsed=false;if(f.respawn)f.lukeDemonTime=0;if(!f.hitlag){f.lukeDemonTime=Math.max(0,(f.lukeDemonTime||0)-1);f.lukeDemonCooldown=Math.max(0,(f.lukeDemonCooldown||0)-1);}speeds(f);}
  for(const q of objects){const f=fighters[q.owner],o=BattlePlayers.projectileTarget(q);if(!f||f.respawn){q.dead=true;continue;}q.age++;q.previousX=q.x;q.x+=q.vx;
   const p=platforms.find(p=>p.main);if(q.y>p.y&&q.y-q.radius<p.y+90&&Math.max(q.previousX,q.x)+q.radius>p.x&&Math.min(q.previousX,q.x)-q.radius<p.x+p.w)q.dead=true;
   for(const o of BattlePlayers.targets(f)){if(q.dead)break;const b=box(q),touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b),protection=CombatSystem.protection(o);
   if(!q.dead&&!o.respawn&&!o.hitlag&&!q.hits.has(o.id)&&(touch||shield)&&!protection.intangible){q.hits.add(o.id);q.dead=true;const counter=o.attack;if(counter?.counterWindow&&o.timer>=counter.counterWindow[0]&&o.timer<=counter.counterWindow[1]){attack(o,counter.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,{...LukeMoves.dragon,type:q.kind==='roar'?'lionFinish':'dragon',damage:q.damage,charge:0,staleMultiplier:q.stale,projectile:true,soundFamily:q.kind==='roar'?'fire':'sword',angle:-.4,baseKnockback:q.kind==='roar'?5.8:3.5,knockbackGrowth:q.kind==='roar'?.09:.067,launchDirection:q.face},b,touch);}
   }if(q.age>q.life)q.dead=true;
  }objects=objects.filter(q=>!q.dead);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main),under=!f.grounded&&f.y>p.y+35&&f.x>p.x-20&&f.x<p.x+p.w+20;
  if(f.attack?.falcon){i.special=false;i.jump=i.jab=i.heavy=i.smash=i.guard=false;i.x=under?(f.x<p.x+p.w/2?-1:1):Math.sign(p.x+p.w/2-f.x);i.y=0;if(f.timer===f.attack.branchStart+1&&f.y<p.y-35&&Math.abs(o.x-f.x)<190){i.special=true;i.y=o.y>f.y+80?1:0;}}
  else if(f.attack?.lionChain){i.special=f.timer===f.attack.branchStart+1;i.x=f.attack.step===1&&o.attack?-f.face:f.face;i.y=0;i.jump=i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&under&&!f.recovered){i.x=f.x<p.x+p.w/2?-1:1;i.y=0;i.special=i.jump=false;i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&!f.grounded&&!f.recovered&&f.y>p.y-100&&(f.x<p.x||f.x>p.x+p.w)){const inward=Math.sign(p.x+p.w/2-f.x);i.x=f.y>p.y+90+f.character.ecb.height+8?-inward*.2:inward;i.special=f.airJumps<=0&&f.vy>=-2;i.y=i.special?-1:0;i.jump=f.airJumps>0&&f.vy>=0;if(i.special)i.x=inward;i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&f.grounded&&!f.lukeDemonTime&&!f.lukeDemonCooldown&&Math.abs(o.x-f.x)>230&&frame%180===0){i.y=1;i.x=0;i.special=true;}
  return i;
 }
 return{reset,prepare,action,tick,box,cpu,slideStep,get objects(){return objects}};
})();

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('luke',{"jab2":{"strike":[6,7],"windup":14},"upsmash":{"strike":[16,8],"windup":14},"jab3":{"strike":[6,9],"windup":14},"fair":{"strike":[13],"windup":14},"downsmash":{"strike":[17,7],"windup":14}});

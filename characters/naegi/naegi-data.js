'use strict';
// One-based inclusive frames at 60 Hz; every event shares the attack clock.
const NaegiMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const normal=(name,s,e,damage,reach,pose=6,shape='front',extra={})=>m(name,s,[w(s,e,shape)],10,0,{damage,reach,pose,soundFamily:'punch',...extra});
 const moves={
  jab:normal('掌打',5,6,3,103,6,'front',{cancel:{start:7,end:16,input:'jab',next:'jab2'}}),
  jab2:normal('連続掌打',4,5,4,112,7,'front',{cancel:{start:6,end:15,input:'jab',next:'jab3'}}),
  jab3:normal('蹴り上げ',7,9,7,128,17),
  heavy:normal('リュック薙ぎ',8,11,10,162,7,'front',{prop:5,soundFamily:'staff'}),
  up:normal('ノート振り上げ',6,11,8,134,8,'up',{prop:6,soundFamily:'staff',angle:-1.4}),
  low:normal('足払い・書類散らし',7,8,6,143,17,'low',{angle:-.2}),
  dashAttack:m('ノート突き',12,[w(12,15)],13,0,{damage:10,reach:155,pose:15,prop:6,impulse:4,soundFamily:'staff'}),
  smash:m('希望の一撃',13,[w(13,16)],23,0,{damage:20,reach:211,pose:9,chargeFrame:4,chargeMaxFrames:60,baseKnockback:6.1,knockbackGrowth:.098,soundFamily:'light'}),
  upsmash:m('議論の打ち上げ',14,[w(14,18,'up')],22,0,{damage:18,reach:188,pose:8,angle:-1.5,chargeFrame:4,chargeMaxFrames:60,prop:7,soundFamily:'light'}),
  downsmash:m('モノクマハンマー・床叩き',15,[w(15,18,'low'),w(21,23,'back')],23,0,{damage:18,reach:190,pose:17,companion:1,chargeFrame:4,chargeMaxFrames:60,soundFamily:'hammer'}),
  air:m('回転蹴り',6,[w(6,9,'spin')],12,7,{damage:8,reach:137,pose:10,aerial:true,soundFamily:'punch'}),
  fair:m('ノートスラッシュ',6,[w(6,8)],12,10,{damage:9,reach:159,pose:13,prop:6,aerial:true,soundFamily:'staff'}),
  bair:m('モノクマ後方投げ',7,[w(7,11,'back')],12,10,{damage:11,reach:158,pose:7,companion:2,aerial:true,soundFamily:'punch'}),
  uair:m('上向き書類弾',5,[w(5,9,'up')],13,8,{damage:9,reach:144,pose:8,prop:7,aerial:true,angle:-1.5,soundFamily:'light'}),
  dair:m('証拠・叩き下ろし',9,[w(9,13,'plunge')],16,14,{damage:13,reach:120,pose:11,prop:7,aerial:true,meteorFrame:11,meteorAngle:1.45,soundFamily:'punch'}),
  dragon:m('コトダマ：それは違うよ！',11,[],16,12,{pose:13,spellShots:[11],chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,soundFamily:'light',shotLife:65,shotSpeed:10,shotRadius:13,shotLength:28,kotodama:true,aimRange:.6}),
  dash:m('議論スクランブル',10,[],35,14,{pose:13,spellShots:[10,17,24],soundFamily:'light',debate:true,evidenceOffsets:[90,155,220],evidenceWarning:12,evidenceActive:3,evidenceLife:28,branchStart:20,branchEnd:45,debateDamage:3}),
  debateFinish:m('論破・フィニッシュ',8,[w(8,11)],18,14,{damage:15,reach:275,pose:9,canClank:false,baseKnockback:5.1,knockbackGrowth:.082,soundFamily:'light',special:true}),
  rise:m('希望の跳躍',6,[w(6,8,'spin',{damage:3}),w(28,31,'spin',{damage:7})],14,18,{damage:7,reach:130,pose:16,soundFamily:'wind',airControlMultiplier:0,gravityMultiplier:0,hopeStep:true,aimEnd:5,firstStart:6,firstEnd:17,secondInputStart:18,secondInputEnd:23,secondStart:24,secondEnd:35,firstDistance:105,firstHeight:155,secondDistance:135,secondHeight:170,hopArc:35,ledgeGrabStart:18,helpless:false,animation:{anticipationEnd:2,anticipationPose:3,accelerationPose:16,followThroughFrames:4,recoveryPose:5,lean:-.08,lunge:0,impactScale:1.1}}),
  gale:m('モノクマ召喚',12,[],16,14,{pose:12,spellShots:[12],soundFamily:'light',supportWarning:18,supportLife:95,supportActive:4,supportDamage:10,supportCooldown:100,supportRadii:[38,56,32]})
 };
 // The second hop's endpoint is an event after the last hitbox.
 moves.rise.totalFrames=moves.rise.secondEnd+moves.rise.recoveryFrames;moves.rise.FAF=moves.rise.totalFrames+1;
 moves.rise.animationWindows=[{start:moves.rise.firstStart,end:moves.rise.firstEnd,pose:16},{start:moves.rise.secondInputStart,end:moves.rise.secondInputEnd,pose:3},{start:moves.rise.secondStart,end:moves.rise.secondEnd,pose:16}];
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:'punch'};}
 for(const[id,name]of Object.entries({grab:'証拠を突きつけるつかみ',pummel:'拳の打撃',forwardThrow:'議論で押し出す',backThrow:'モノクマ投げ',upThrow:'証拠で打ち上げる',downThrow:'床への叩きつけ'}))moves[id].name=name;
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;if(a!==moves.rise)a.animation={...a.animation,anticipationPose:14,accelerationPose:14};}
 return moves;
})();
const NaegiRules=(()=>{
 let objects=[];
 const supports=[{name:'ハンマー',family:'hammer',pose:0},{name:'メガホン',family:'light',pose:2},{name:'ガード',family:'shield',pose:4}];
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='naegi'){f.naegiSupport=0;f.naegiSupportCooldown=0;f.naegiSideUsed=false;f.naegiSerial=0;}}
 function terrain(x,y,r=0){const p=platforms.find(p=>p.main);return x>p.x-r&&x<p.x+p.w+r&&y>p.y-r&&y<p.y+90+r;}
 function safeStep(f,target){const p=platforms.find(p=>p.main),e=f.character.ecb,n=Math.max(1,Math.ceil(Math.hypot(target.x-f.x,target.y-f.y)/5));let q={x:f.x,y:f.y,blocked:false};for(let j=1;j<=n;j++){const x=lerp(f.x,target.x,j/n),y=lerp(f.y,target.y,j/n);if(StageGeometry.overlaps(p,x,y,e.radius,e.height)){q.blocked=true;break;}q={x,y,blocked:false};}return q;}
 function spawn(f,kind,v={}){const q={kind,owner:f.id,x:f.x+f.face*28,y:f.y-36,face:f.face,age:0,life:65,vx:0,vy:0,damage:7,hits:new Set(),stale:f.attack?.staleMultiplier??1,...v};objects.push(q);return q;}
 function prepare(f){const a=f.attack;f.naegiSerial=(f.naegiSerial||0)+1;a.serial=f.naegiSerial;a.originGrounded=f.grounded;
  if(a.type==='dragon')a.aimY=clamp(f.input?.y||0,-a.aimRange,a.aimRange);
  if(a.type==='dash'&&!f.grounded)f.naegiSideUsed=true;
  if(a.hopeStep){a.hopOrigin={x:f.x,y:f.y};a.hopDirection=f.x<320?1:f.x>1120?-1:0;a.firstTarget={x:f.x+a.hopDirection*a.firstDistance,y:f.y-a.firstHeight};}
 }
 function hop(f,a,origin,target,start,end,t){const u=clamp((t-start+1)/(end-start+1),0,1),p={x:lerp(origin.x,target.x,u),y:lerp(origin.y,target.y,u)-Math.sin(Math.PI*u)*a.hopArc},q=safeStep(f,p);if(q.blocked)a.hopBlocked=true;f.vx=q.x-f.x;f.vy=q.y-f.y;f.grounded=false;f.fastFall=false;}
 function releaseHope(f){f.attack=null;f.gravityOff=false;f.vx*=.3;f.vy=0;PlayerStates.enter(f,'Fall');}
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.type==='dragon'){if(t<a.startupFrames&&Math.abs(i.y)>.15)a.aimY=clamp(i.y,-a.aimRange,a.aimRange);if(t===a.startupFrames&&!a.objectSpawned){a.objectSpawned=true;const speed=a.shotSpeed*(1+a.charge*.3),angle=a.aimY*.85;spawn(f,'shot',{vx:f.face*Math.cos(angle)*speed,vy:Math.sin(angle)*speed,damage:7+a.charge*7,radius:a.shotRadius+a.charge*7,length:a.shotLength*(1+a.charge*.5),kotodama:true,life:a.shotLife,charged:a.charge,family:'light'});label(f.x,f.y-110,'それは違うよ！','#ffe16a');}}
  if(a.debate){if(a.spellShots.includes(t)&&!a.eventsDone.has('evidence:'+t)){a.eventsDone.add('evidence:'+t);const n=a.spellShots.indexOf(t),x=f.x+f.face*a.evidenceOffsets[n],y=f.y-36;if(!terrain(x,y,16))spawn(f,'evidence',{x,y,serial:a.serial,warning:a.evidenceWarning,active:a.evidenceActive,life:a.evidenceLife,damage:a.debateDamage,n,family:'light'});}
   if(a.debateConfirmed&&t>=a.branchStart&&t<=a.branchEnd&&(i.special||f.buffer?.key==='special')){const serial=a.serial;objects=objects.filter(q=>!(q.owner===f.id&&q.kind==='evidence'&&q.serial===serial));attack(f,'debateFinish');return;}}
  if(a.hopeStep){if(t<=a.aimEnd&&Math.abs(i.x)>.2){a.hopDirection=Math.sign(i.x);a.firstTarget={x:a.hopOrigin.x+a.hopDirection*a.firstDistance,y:a.hopOrigin.y-a.firstHeight};}
   if(t===a.firstStart&&!a.firstSpawned){a.firstSpawned=true;f.recovered=true;f.specialLandingLag=a.landingLagFrames;spawn(f,'foothold',{x:a.hopOrigin.x,y:a.hopOrigin.y,life:40});GameAudio.cue('double-jump',.7,f);}
   if(t>=a.firstStart&&t<=a.firstEnd)hop(f,a,a.hopOrigin,a.firstTarget,a.firstStart,a.firstEnd,t);
   if(t>=a.secondInputStart&&t<=a.secondInputEnd){f.vx=f.vy=0;f.grounded=false;if(!a.midOrigin){a.midOrigin={x:f.x,y:f.y};spawn(f,'foothold',{x:f.x,y:f.y,life:25});}if(Math.abs(i.x)>.2)a.secondDirection=Math.sign(i.x);if(i.special||f.buffer?.key==='special')a.secondRequested=true;}
   if(t===a.secondStart){if(!a.secondRequested){releaseHope(f);return;}const dir=a.secondDirection??a.hopDirection;a.secondTarget={x:a.midOrigin.x+dir*a.secondDistance,y:a.midOrigin.y-a.secondHeight};spawn(f,'foothold',{x:a.midOrigin.x,y:a.midOrigin.y,life:35});GameAudio.cue('double-jump',.9,f);}
   if(t>=a.secondStart&&t<=a.secondEnd&&a.secondTarget)hop(f,a,a.midOrigin,a.secondTarget,a.secondStart,a.secondEnd,t);
   if(t>a.secondEnd){a.gravityMultiplier=1;f.vx*=.65;}
  }
  if(a.type==='gale'&&t===a.startupFrames&&!a.objectSpawned){a.objectSpawned=true;const type=f.naegiSupport||0;f.naegiSupport=(type+1)%supports.length;f.naegiSupportCooldown=a.supportCooldown;spawn(f,'support',{x:f.x+f.face*(type===2?-24:110),y:f.y-34,type,radius:a.supportRadii[type],warning:a.supportWarning,active:a.supportActive,life:a.supportLife,damage:a.supportDamage,family:supports[type].family});label(f.x,f.y-100,supports[type].name,'#fca6e5');}
 }
 function box(o){const r=o.kind==='evidence'?21:o.radius||13;if(o.kotodama){const speed=Math.hypot(o.vx,o.vy)||1,length=Math.max(o.length,speed);return{x1:o.x-o.vx/speed*length,y1:o.y-o.vy/speed*length,x2:o.x,y2:o.y,radius:r};}return{x1:o.previousX??o.x,y1:o.previousY??o.y,x2:o.x,y2:o.y,radius:r};}
 function collide(q,f,unused){for(const o of BattlePlayers.targets(f)){if(q.dead)break;collideOne(q,f,o);}}
 function collideOne(q,f,o){if(o.respawn||o.hitlag||q.hits.has(o.id))return;const b=box(q),touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b),p=CombatSystem.protection(o);if(!(touch||shield)||p.intangible)return;
  q.hits.add(o.id);const counter=o.attack;if(counter?.counterWindow&&o.timer>=counter.counterWindow[0]&&o.timer<=counter.counterWindow[1]){attack(o,counter.counterMove);o.inv=o.attack.totalFrames;}else{CombatSystem.hit(f,o,{...NaegiMoves.dragon,type:q.kind==='evidence'?'dash':q.kind==='support'?'gale':'dragon',damage:q.damage,charge:0,projectile:true,staleMultiplier:q.stale,soundFamily:q.family,baseKnockback:q.kind==='evidence'?1.5:3.8,knockbackGrowth:q.kind==='evidence'?.018:.067,angle:q.kind==='support'&&q.type===1?-1.25:-.4,launchDirection:q.face},b,touch);if(q.kind==='evidence'&&!shield&&!p.invincible&&!p.armor&&f.attack?.debate&&f.attack.serial===q.serial)f.attack.debateConfirmed=true;}
  if(q.kind==='shot'){q.dead=true;if(q.kotodama&&touch&&!shield&&!p.invincible&&!p.armor&&!counter?.counterWindow)spawn(f,'refutation',{x:o.x,y:o.y-65,life:22});}spawn(f,'spark',{x:q.x,y:q.y,life:10});
 }
 function tick(){for(const f of fighters)if(f.characterId==='naegi'){if(f.grounded||f.ledge||f.respawn)f.naegiSideUsed=false;if(f.respawn){f.naegiSupport=0;f.naegiSupportCooldown=0;}else if(!f.hitlag)f.naegiSupportCooldown=Math.max(0,(f.naegiSupportCooldown||0)-1);}
  for(const q of [...objects]){const f=fighters[q.owner],o=BattlePlayers.projectileTarget(q);if(!f||f.respawn){q.dead=true;continue;}q.age++;q.previousX=q.x;q.previousY=q.y;
   if(q.kind==='shot'){const n=Math.max(1,Math.ceil(Math.hypot(q.vx,q.vy)/5));for(let j=0;j<n;j++){q.x+=q.vx/n;q.y+=q.vy/n;if(terrain(q.x,q.y,q.radius)){q.dead=true;break;}}if(!q.dead)collide(q,f,o);}
   if(q.kind==='evidence'&&q.age>=q.warning&&q.age<q.warning+q.active)collide(q,f,o);
   if(q.kind==='support'){if(q.age===q.warning)GameAudio.cue(q.type===0?'hammer-hit':q.type===1?'light-cast':'shield-on',.8,f);if(q.type===2&&q.age>=q.warning&&q.age<q.warning+50){q.x=f.x-f.face*24;q.y=f.y-34;if(!f.hitlag)f.shield=Math.min(f.character.shieldHP,f.shield+.5);}else if(q.type!==2&&q.age>=q.warning&&q.age<q.warning+q.active)collide(q,f,o);}
   if(q.age>=q.life||q.x<-900||q.x>2300||q.y>1600||q.y<-1100)q.dead=true;
  }objects=objects.filter(q=>!q.dead);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main),under=f.y>p.y+25&&f.x>p.x-20&&f.x<p.x+p.w+20;
  if(f.attack?.hopeStep){i.x=f.x<p.x?1:f.x>p.x+p.w?-1:0;i.y=0;i.special=f.timer===f.attack.secondInputStart;i.jab=i.heavy=i.smash=i.guard=false;}
  else if(f.attack?.debate){i.x=0;i.special=!!f.attack.debateConfirmed&&f.timer===f.attack.branchStart;i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&under&&!f.recovered){const dir=f.x<p.x+p.w/2?-1:1,dist=dir<0?f.x-p.x:p.x+p.w-f.x;i.x=dir;i.y=dist<55?-1:0;i.special=dist<55;i.jump=dist>=55&&f.airJumps>0&&f.vy>0;i.jab=i.heavy=i.smash=i.guard=false;}
  if(f.attack?.type==='dragon')i.specialHeld=Math.abs(o.x-f.x)>240&&f.attack.chargeFrames<40;return i;
 }
 return{supports,reset,prepare,action,tick,cpu,terrain,safeStep,box,get objects(){return objects;}};
})();

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(NaegiMoves.dragon,{rangedInterval:40,rangedRearm:20});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('naegi',{"bair":{"strike":[7,10],"windup":14},"jab2":{"strike":[6,7],"windup":14},"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"jab3":{"strike":[7,9],"windup":14},"downsmash":{"strike":[17,7],"windup":14}});

'use strict';
const TerraPoseMap={jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30,grab:46,pummel:47,ledge:57,getupAttack:57,forwardThrow:48,backThrow:49,upThrow:50,downThrow:51};
const TerraMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword',tether:true};
 const a=NewcomerCore.moves(['水平斬り','逆袈裟斬り','剣と火花','ロングスラッシュ','斬り上げ・氷結','低い横薙ぎ','滑り込み斬り','ライトソード','サンダガ','グラビガ','風まとい円舞','ホーリー五光','背面剣閃','頭上氷晶','氷槍・水圧リバウンド'],{
 dragon:m('メルトン',10,[],125,0,{...opt,terraMeltdown:true,pose:31,projectile:true,damage:7,gravityMultiplier:.85}),
 dash:m('フラッド',12,[],90,0,{...opt,terraFlood:true,pose:34,projectile:true,damage:4,gravityMultiplier:.85}),
 rise:m('トルネド・スパイラル',7,[],100,15,{...opt,tether:false,terraTornado:true,pose:37,damage:4,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:10}),
 gale:m('トランス / アルテマ・リリース',12,[],38,0,{...opt,terraTrance:true,pose:40,damage:0,gravityMultiplier:.9}),
 airDrop:m('空中トランス / アルテマ・リリース',12,[],38,12,{...opt,terraTrance:true,pose:40,damage:0,aerial:true,gravityMultiplier:.9})
 },'sword',139);
 for(const[k,n]of Object.entries(TerraPoseMap)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;
 a.upsmash=m('サンダガ',20,[w(20,22,'up',{index:0,pose:24,damage:5,angle:-1.3,baseKnockback:1.7,knockbackGrowth:.02}),w(26,28,'up',{index:1,pose:24,damage:5,angle:-1.5,baseKnockback:1.7,knockbackGrowth:.02}),w(32,35,'up',{index:2,pose:24,damage:12,angle:-1.5})],24,0,{damage:12,pose:24,newcomerHit:true,soundFamily:'sword',chargeFrame:6,chargeMaxFrames:60});
 a.downsmash.damage=5;for(const v of a.downsmash.activeFrames){v.pose=25;v.baseKnockback=1.2;v.knockbackGrowth=.015;v.angle=-1.2;}
 a.fair.damage=3;a.fair.activeFrames[0].shape='front';
 for(const k of['jab','jab2','jab3','heavy','up','low','dashAttack','smash','upsmash','downsmash','air','fair','bair','uair','dair','rise'])a[k].authoredEffectCoverage=true;
 for(const v of Object.values(a)){v.motionEndFrames=v.totalFrames;v.FAF=v.totalFrames+1;v.animation={...v.animation,anticipationPose:v.special?v.pose:0,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};if(v.chargeFrame)v.chargeHoldFrames=v.chargeMaxFrames;}return a;
})();
function terraGauge(f){return Math.max(0,Math.min(100,f.terraGauge||0));}
function terraTrans(f){return f.terraTrance>0;}
function terraImagePose(f,n){return n>=0&&n<=60&&terraTrans(f)?n+62:n;}
function terraDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function terraLand(){return false;}
function terraGate(f,type){if(['gale','airDrop'].includes(type))return terraTrans(f)||terraGauge(f)>=100;if(type==='dash')return!TerraRules.objects.some(q=>q.owner===f.id&&!q.dead&&q.kind==='flood');if(type==='dragon')return TerraRules.objects.filter(q=>q.owner===f.id&&!q.dead&&q.kind==='meltdown').length<2;return true;}
function terraGround(x,y){return platforms.filter(p=>x>=p.x&&x<=p.x+p.w&&p.y>=y-120).sort((a,b)=>a.y-b.y)[0];}
function terraCast(f,r,v){return r.spawn(f,{vx:0,vy:0,life:25,radius:20,damage:4,base:3.5,growth:.06,powered:terraTrans(f),...v});}
function terraLift(f,a,t){a.phase='spiral';a.launchAt=t;a.pose=37;f.grounded=false;f.recovered=true;const end=a.powered?42:34;a.activeFrames=[CombatData.window(t,t+8,'up',{pose:37,index:0,damage:3,angle:-1.3,baseKnockback:1.4,knockbackGrowth:.018}),CombatData.window(t+14,t+22,'up',{pose:38,index:1,damage:3,angle:-1.3,baseKnockback:1.4,knockbackGrowth:.018}),CombatData.window(t+end-2,t+end+7,'front',{pose:39,index:2,damage:a.powered?12:8,angle:-1.15})];a.activeStart=t;a.activeEnd=t+end+7;a.motionLastEvent=a.motionCommitEnd=a.activeEnd;terraDuration(f,a,t+end+24);}
const TerraRules=NewcomerCore.create('terra',TerraMoves,{
 reset(){for(const f of fighters)if(f.characterId==='terra'){f.terraGauge=0;f.terraTrance=0;f.terraLastDamage=f.damage;f.terraStatForm=null;}},
 status(f){if(f.respawn){f.terraGauge=0;f.terraTrance=0;f.terraLastDamage=f.damage;}else if(f.terraTrance>0)f.terraTrance--;else{f.terraGauge=Math.min(100,terraGauge(f)+.025+Math.max(0,f.damage-(f.terraLastDamage??f.damage))*.45);}f.terraLastDamage=f.damage;
  const form=terraTrans(f);if(f.terraStatForm!==form){f.terraStatForm=form;for(const k of['walkSpeed','initialDashSpeed','runSpeed','airSpeed'])f.character[k]=CharacterData.terra[k]*(form?1.12:1);}
 },
 prepare(f,a){a.activeFrames=a.activeFrames.map(v=>({...v}));a.powered=terraTrans(f);if(a.powered&&!a.terraTrance){a.damage*=1.15;for(const w of a.activeFrames)if(w.damage!==undefined)w.damage*=1.15;}if(a.special){a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];a.motionLastEvent=a.motionCommitEnd=a.totalFrames-10;}if(a.terraTornado)a.phase='start';a.terraSpawned=new Set();},
 action(f,i,r){const a=f.attack,t=f.timer,held=!!(i.special||i.specialHeld);
  if(a.terraMeltdown&&!a.released){if(t>=28)a.pose=32;if(t>=10&&(!held||t>=80)){a.released=t;a.level=t>=55?3:t>=28?2:1;a.pose=33;for(let n=0;n<(a.powered?2:1);n++)terraCast(f,r,{kind:'meltdown',fx:8,x:f.x+a.originFace*48,y:f.y-43,vx:a.originFace*12,delay:n*11,life:72,radius:15,damage:7,level:a.level,stage:a.level,bounced:false,powered:a.powered});a.motionLastEvent=a.motionCommitEnd=t+(a.powered?11:0);terraDuration(f,a,t+(a.powered?38:27));}}
  if(a.terraFlood&&!a.released){a.range=i.y>.45||i.x*a.originFace<-.4?1:i.y<-.45||i.x*a.originFace>.4?3:(a.range||2);a.pose=33+a.range;if(t>=12&&(!held||t>=36)){a.released=t;const count=a.powered?4:a.range,columns=[];for(let n=0;n<count;n++){const x=f.x+a.originFace*(65+n*64),p=terraGround(x,f.y);if(p)columns.push({x,y:p.y});}const path=columns.map((_,n)=>n);if(a.powered)for(let n=columns.length-2;n>=0;n--)path.push(n);if(path.length)terraCast(f,r,{kind:'flood',x:columns[0].x,y:columns[0].y,vx:0,vy:0,life:path.length*6+10,columns,path,powered:a.powered,counts:{},damage:3,radius:25});a.motionLastEvent=a.motionCommitEnd=t;terraDuration(f,a,t+25);}}
  if(a.terraTrance&&!a.released&&t>=12){a.released=t;if(a.powered){a.pose=41;f.terraTrance=0;terraCast(f,r,{kind:'ultima',x:f.x,y:f.y-43,vx:0,vy:0,life:18,radius:150,damage:25,base:5.2,growth:.095,noGauge:true,powered:true});}else{f.terraGauge=0;f.terraTrance=540;a.pose=41;terraCast(f,r,{kind:'transform',x:f.x,y:f.y-43,life:22,damage:0,radius:55});}a.motionLastEvent=a.motionCommitEnd=t;terraDuration(f,a,t+26);}
  if(a.terraTornado){f.fastFall=false;if(a.phase==='start'){f.vx*=.35;f.vy=0;if(t>=7){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);a.phase='escape';terraDuration(f,a,t+150);}else terraLift(f,a,t);}}
   if(a.phase==='escape'){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)terraLift(f,a,t);return;}
   if(a.phase==='spiral'){const d=t-a.launchAt,end=a.powered?42:34;a.pose=d<13?37:38;f.vx=(i.x||0)*(a.powered?6.8:5.8)+a.originFace*Math.sin(d*.23)*2;f.vy=d<14?-15+d*.3:-5+(i.y||0)*2;if(d>=end){a.phase='merge';a.mergeAt=t;a.pose=39;f.vx=(Math.abs(i.x)>.15?i.x:a.originFace)*8;f.vy=-2;}}
   if(a.phase==='merge'){const d=t-a.mergeAt;a.pose=39;f.vx=(Math.abs(i.x)>.15?i.x:a.originFace)*(a.powered?9:8);f.vy=d<7?-2:-12;if(d>=8){a.phase='exit';a.exitAt=t;a.gravityMultiplier=1;a.airControlMultiplier=1;a.motionLastEvent=a.motionCommitEnd=t;terraDuration(f,a,t+10);}}
   if(a.phase==='exit')a.pose=t-a.exitAt<5?39:60;
  }
  // Aerial Holy lights share one victim set: spread covers angles rather than
  // multiplying the complete normal hit five times against a single target.
  if(a.type==='fair'&&t===a.activeStart&&!a.terraSpawned.has('holy')){a.terraSpawned.add('holy');const shared=new Set();for(const angle of[-.36,-.18,0,.18,.36])terraCast(f,r,{kind:'holy',x:f.x+a.originFace*46,y:f.y-47,vx:a.originFace*Math.cos(angle)*8,vy:Math.sin(angle)*8,life:16,radius:12,damage:a.powered?10:8,base:3.7,growth:.065,shared});}
  if(a.type==='downsmash')for(const w of a.activeFrames)if(t===w.start&&!a.terraSpawned.has(w.index)){a.terraSpawned.add(w.index);terraCast(f,r,{kind:'gravity',x:f.x+a.originFace*(w.index===1?-84:84),y:f.y-30,life:14,radius:45,damage:(a.powered?15:13)*(1+(a.charge||0)*.4),base:4.1,growth:.075,noGauge:true});}
  if(a.special)a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];
 },
 onHit(f,o,a){if(!terraTrans(f)&&!a.terraNoGauge)f.terraGauge=Math.min(100,terraGauge(f)+3+(a.damage||0)*.35);const actual=f.attack;if(a.type==='dair'&&actual&&!actual.terraRebound){actual.terraRebound=true;f.vy=-9;f.fastFall=false;terraCast(f,TerraRules,{kind:'icepop',x:o.x,y:o.y-28,life:9,radius:40,damage:3,base:2.5,growth:.025,noGauge:true});}},
 projectile(q,f){if(f.respawn||q.age>=q.life||q.x<-900||q.x>2340||q.y>1400){q.dead=true;return true;}if(q.age<=(q.delay||0)||q.kind==='transform')return true;q.previousX=q.x;q.previousY=q.y;
  let box=null,damage=q.damage,base=q.base,growth=q.growth,angle=-.85,keySuffix='';
  if(q.kind==='meltdown'){const age=q.age-(q.delay||0);q.stage=Math.max(q.level,age>=29?3:age>=15?2:1);q.radius=[15,23,32][q.stage-1];damage=[7,11,15][q.stage-1]*(q.powered?1.15:1);base=[3.3,3.9,4.6][q.stage-1];growth=[.06,.07,.085][q.stage-1];q.vx=q.face*[12,10,8][q.stage-1];if(q.stage===2){const target=BattlePlayers.projectileTarget(q);q.vy=clamp((target.y-40-q.y)*.025,-2,2);}if(q.stage===3)q.vy+=.32;q.x+=q.vx;q.y+=q.vy;const floor=platforms.find(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY+q.radius<=p.y+3&&q.y+q.radius>=p.y);if(floor){if(q.stage===3&&!q.bounced){q.bounced=true;q.y=floor.y-q.radius-1;q.vy=-6;}else{q.dead=true;return true;}}const main=platforms.find(p=>p.main);if(StageGeometry.overlaps(main,q.x,q.y,q.radius,q.radius*2)){q.dead=true;return true;}}
  else if(q.kind==='holy'){q.x+=q.vx;q.y+=q.vy;}
  else if(q.kind==='flood'){const stage=Math.min(q.path.length-1,Math.floor((q.age-1)/6)),p=q.columns[q.path[stage]],last=stage===q.path.length-1;q.x=p.x;q.y=p.y;keySuffix=':'+stage;damage=last?(q.powered?10:8):3;base=last?4.4:1.7;growth=last?.075:.018;angle=-1.35;box={x1:p.x,y1:p.y-8,x2:p.x,y2:p.y-(q.powered?142:118),radius:q.radius};}
  else if(q.kind==='gravity'){if(q.age<7){for(const o of BattlePlayers.targets(f))if(!CombatSystem.protection(o).intangible&&!['ShieldStart','ShieldHold','ShieldDrop','Grabbed'].includes(o.mode)&&Math.hypot(o.x-q.x,o.y-35-q.y)<q.radius+15){o.vx+=clamp((q.x-o.x)*.045,-1.6,1.6);o.vy-=.16;}return true;}q.radius=52;angle=-1.1;}
  else if(q.kind==='ultima'){q.radius=lerp(45,150,Math.min(1,q.age/7));angle=-1.05;}
  box??={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};
  for(const o of BattlePlayers.targets(f)){const key=o.id+keySuffix;if(q.hits.has(key)||q.shared?.has(o.id)||q.kind==='flood'&&(q.counts[o.id]||0)>=4||CombatSystem.protection(o).intangible)continue;const touch=CombatSystem.contact(box,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,box);if(touch||shield){q.hits.add(key);q.shared?.add(o.id);if(q.counts)q.counts[o.id]=(q.counts[o.id]||0)+1;CombatSystem.hit(f,o,{...TerraMoves.dragon,type:q.sourceType||'dragon',sourceType:q.sourceType,projectile:true,charge:0,terraNoGauge:q.noGauge,damage,staleMultiplier:q.stale,launchDirection:Math.sign(q.vx)||q.face,angle,baseKnockback:base,knockbackGrowth:growth},box,touch);if(['holy','meltdown'].includes(q.kind)){q.dead=true;break;}}}return true;
 },
 boxes(f,a,w){if(a.special&&!a.terraTornado)return[];let p,reach=({jab:104,jab2:117,jab3:123,heavy:150,low:123,dashAttack:137,smash:158,fair:77,bair:134})[a.type]||133;p=w.shape==='back'?[0,-44,-reach,-45]:w.shape==='low'?[0,-15,reach,-15]:w.shape==='up'?[-42,-65,42,-142]:w.shape==='down'?[2,-35,74,65]:[0,-45,reach,-46];
  if(a.type==='air')p=[-95,-48,100,-48];if(a.type==='downsmash')p=w.index===1?[0,-18,-100,-24]:[0,-18,100,-24];if(a.terraTornado)p=w.index===2?[-34,-45,86,-85]:[-34,-25,34,-104];
  const make=(p,r=24)=>({x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:r,window:w,modifiers:w});
  if(a.type==='upsmash'){const x=[74,0,-74][w.index];return[make([x,-23,x,-154],25),make([0,-38,x,-93],22)];}
  if(a.type==='uair')return[-35,0,35].map(x=>make([x*.35,-45,x,-144],19));
  if(a.type==='dair')return[-25,0,25].map(x=>make([x*.3,-29,70+x,68],19));return[make(p)];
 },
 hurtboxes(f){const low=[11,13,21,22,25,32,34,43,44,45,51,53,56,57].includes(terraPose(f));return[{part:'head',x:f.x,y:f.y-(low?38:77),r:14},{part:'torso',x:f.x,y:f.y-(low?25:45),r:18},{part:'legs',x:f.x,y:f.y-12,r:14}];},
 cpu(f,o,i,clear){const a=f.attack;if(a?.terraMeltdown)i.specialHeld=Math.abs(o.x-f.x)>220&&f.timer<59;if(a?.terraFlood){i.specialHeld=f.timer<14;i.y=Math.abs(o.x-f.x)>210?-1:Math.abs(o.x-f.x)<110?1:0;}if(a?.terraTornado){i.x=Math.sign(720-f.x);i.y=-1;}if(!a&&f.grounded&&terraGauge(f)>=100&&!terraTrans(f)){clear();i.special=true;i.y=1;}else if(!a&&terraTrans(f)&&f.terraTrance<100&&Math.abs(o.x-f.x)<140){clear();i.special=true;i.y=1;}}
});
function terraPose(f){if(f.mode==='Pummel')return 47;if(f.mode==='SpotDodge')return 11;if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 58;if(f.mode==='LedgeGetup')return 59;if(f.mode==='JumpSquat')return 13;if(f.mode==='ForwardRoll')return 44;if(f.mode==='BackwardRoll')return 45;if(f.mode==='Helpless'||f.recovered&&!f.grounded)return 60;if(f.state==='walk')return[1,2,3,4][Math.floor(frame/6)%4];if(f.state==='run')return[5,6,7,8][Math.floor(frame/3)%4];return({idle:0,crouch:11,jump:14,double:15,fall:42,land:43,guard:52,dodge:53,hit:54,fly:55,down:56,getup:57,grab:46,caught:54,throw:48})[f.state]??0;}
MoveMotion.define('terra',Object.fromEntries(Object.entries(TerraPoseMap).filter(([k])=>['jab','jab2','jab3','heavy','up','low','dashAttack','smash','upsmash','downsmash','air','fair','bair','uair','dair'].includes(k)).map(([k,n])=>[k,{windup:['air','fair','bair','uair','dair'].includes(k)?14:0,strike:[n],recovery:['air','fair','bair','uair','dair'].includes(k)?42:0}])));

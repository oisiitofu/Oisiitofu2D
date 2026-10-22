'use strict';
const GenisMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'magic',tether:true},a=NewcomerCore.moves(['けん玉・横振り','返し打ち','受け止め打ち','ロングスイング','リフトアップ','低いスイープ','転がり込み打ち','サンダーブレード','グランドダッシャー','イラプション','けん玉大回転','アクアエッジ','玉射出・戻り','ライトニング','ストーンブラスト'],{
 dragon:m('ファイアボール → イラプション → エクスプロージョン',12,[],100,0,{...opt,genisFire:true,pose:31,damage:7,projectile:true,rangedInterval:30,gravityMultiplier:.7}),
 dash:m('スプレッド → アクアレーザー',12,[],90,0,{...opt,genisSpread:true,pose:34,damage:8,projectile:true,rangedInterval:50,gravityMultiplier:.8}),
 rise:m('エアスラスト → サイクロン',7,[],100,12,{...opt,genisCyclone:true,pose:36,damage:6,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:8}),
 gale:m('グラビティ',18,[],65,0,{...opt,genisGravity:true,pose:39,damage:5,projectile:true,rangedInterval:80,gravityMultiplier:.7}),
 airDrop:m('空中グラビティ',18,[],65,12,{...opt,genisGravity:true,pose:39,damage:5,projectile:true,rangedInterval:80,aerial:true,gravityMultiplier:.7})
 },'punch',118),p={jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30,grab:46,pummel:47,ledge:57,getupAttack:57,forwardThrow:48,backThrow:49,upThrow:50,downThrow:51};
 for(const[k,n]of Object.entries(p)){a[k].pose=n;for(const e of a[k].activeFrames)e.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=25;a.downsmash.activeFrames[1].shape='low';a.upsmash.authoredEffectCoverage=true;a.downsmash.authoredEffectCoverage=true;a.smash.authoredEffectCoverage=true;a.dair.authoredEffectCoverage=true;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:0,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function genisTP(f){return clamp(f.genisTP??30,0,100);}
function genisSpend(f,cost){const enough=genisTP(f)>=cost;if(enough)f.genisTP=genisTP(f)-cost;return enough;}
function genisGate(f,type){return !(['dragon','dash','gale','airDrop'].includes(type)&&GenisRules.objects.filter(q=>q.owner===f.id&&!q.dead).length>=8);}
function genisLand(){return false;}
function genisDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function genisObject(f,r,v){if(r.objects.filter(q=>q.owner===f.id&&!q.dead).length>=8)return;r.spawn(f,{kind:'fire',vx:0,vy:0,life:65,damage:7,fx:2,base:3.5,growth:.065,...v});}
function genisLift(f,a,t,i){a.launchAt=t;a.phase='rise';f.grounded=false;f.recovered=true;a.activeFrames=[CombatData.window(t,t+7,'up',{pose:36,index:0,damage:6,angle:-1.3,meleeCoverage:true})];a.activeStart=t;a.activeEnd=t+7;genisDuration(f,a,t+76);}
const GenisRules=NewcomerCore.create('genis',GenisMoves,{
 reset(){for(const f of fighters)if(f.characterId==='genis')f.genisTP=30;},
 status(f){if(f.respawn)f.genisTP=30;else f.genisTP=clamp(genisTP(f)+.018,0,100);},
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));if(a.special){a.motionLastEvent=a.motionCommitEnd=a.totalFrames-8;a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];}if(a.genisCyclone)a.phase='start';
  if(a.type==='upsmash'&&genisTP(f)>=100){f.genisTP=0;a.indignation=true;a.name='インディグネイション';a.pose=41;for(const w of a.activeFrames){w.pose=41;w.damage=32;w.baseKnockback=6.4;w.knockbackGrowth=.105;}a.motionLastEvent=a.motionCommitEnd=a.activeEnd;}
 },
 action(f,i,r){const a=f.attack,t=f.timer,held=!!(i.special||i.specialHeld);if(a.indignation){for(const w of a.activeFrames){w.pose=41;if(w.motionPoseFrames)w.motionPoseFrames.fill(41);}a.animation.anticipationPose=a.animation.accelerationPose=41;}if(a.type==='downsmash')f.face=t>=a.activeFrames[1].start&&t<=a.activeEnd?-a.originFace:a.originFace;
  if(a.genisFire&&!a.released){f.vx*=.75;if(t>=12&&(!held||t>=72)){a.released=t;a.level=t>=62?2:t>=32?1:0;a.powered=genisSpend(f,[6,14,24][a.level]);a.pose=31+a.level;const scale=a.powered?1:.72;
    if(a.level===0)for(let n=0;n<3;n++)genisObject(f,r,{x:f.x+f.face*(35+n*8),y:f.y-33,vx:f.face*(7+n*.5),vy:(n-1)*.55,delay:n*6,damage:5*scale,life:55+n*6,sourceType:a.type});
    else genisObject(f,r,{kind:a.level===1?'pillar':'blast',fx:a.level===1?3:4,x:f.x+f.face*(a.level===1?145:195),y:f.y-35,delay:10,radius:a.level===1?42:75,damage:[0,16,24][a.level]*scale,life:32,base:a.level===2?5:4.2,growth:.085});
    a.motionLastEvent=a.motionCommitEnd=t;genisDuration(f,a,t+25);
  }else if(t>=32)a.pose=32;}
  if(a.genisSpread&&!a.released){f.vx*=.7;if(!a.aimX)a.aimX=f.x+f.face*150;if(t<50)a.aimX=clamp(a.aimX+(i.x||0)*3,f.x-260,f.x+260);
   if(t>=12&&(!held||t>=50)){a.released=t;a.laser=t>=38;a.powered=genisSpend(f,a.laser?18:12);a.pose=a.laser?35:34;const main=platforms.find(p=>p.main),floor=platforms.filter(p=>a.aimX>p.x&&a.aimX<p.x+p.w&&p.y>=f.y-40).sort((x,y)=>x.y-y.y)[0],gy=floor?.y??Math.min(main.y,f.y+95);
    genisObject(f,r,{kind:a.laser?'laser':'ice',fx:a.laser?13:6,x:a.aimX,y:gy-38,face:a.originFace,delay:14,damage:(a.laser?16:10)*(a.powered?1:.72),radius:a.laser?25:35,life:a.laser?32:48,base:4,growth:.07,split:!a.laser});a.motionLastEvent=a.motionCommitEnd=t;genisDuration(f,a,t+25);
   }}
  if(a.genisCyclone){f.fastFall=false;if(a.phase==='start'){f.vx*=.4;f.vy=0;if(t>=7){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);a.phase='escape';genisDuration(f,a,t+130);}else genisLift(f,a,t,i);}}
   if(a.phase==='escape'){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)genisLift(f,a,t,i);return;}
   const d=t-a.launchAt;if(a.phase==='rise'){a.pose=36;f.vx=(i.x||0)*4;f.vy=-16+d*.3;if(d>=14){a.phase='cyclone';a.cycloneAt=t;a.pose=37;}}
   if(a.phase==='cyclone'){a.pose=37;f.vx=(i.x||0)*5.5;f.vy=-3+(i.y||0)*2;if(t-a.cycloneAt>=8&&(!held||t-a.cycloneAt>=30)){a.phase='exit';a.exitAt=t;a.exitX=Math.abs(i.x)>.2?Math.sign(i.x):a.originFace;f.face=a.exitX;f.vx=a.exitX*7;f.vy=-10;a.pose=38;a.gravityMultiplier=1;a.motionLastEvent=a.motionCommitEnd=t;genisDuration(f,a,t+19);}}
   if(a.phase==='exit'){a.pose=t-a.exitAt<7?38:60;a.gravityMultiplier=1;}}
  if(a.genisGravity&&!a.cast&&t>=18){a.cast=true;a.powered=genisSpend(f,18);genisObject(f,r,{kind:'gravity',fx:11,x:f.x+a.originFace*140,y:f.y-40,damage:a.powered?14:10,life:64,radius:65,base:3,growth:.04});a.motionLastEvent=a.motionCommitEnd=t;genisDuration(f,a,t+24);}
  if(a.special)a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];
 },
 onHit(f){f.genisTP=clamp(genisTP(f)+3,0,100);},
 projectile(q,f,o,r){if(f.respawn||q.age>=q.life||q.x<-900||q.x>2340||q.y>1400){q.dead=true;return true;}if(q.age<=(q.delay||0))return true;const d=q.age-(q.delay||0);q.previousX=q.x;q.previousY=q.y;
  if(q.kind==='fire'){q.x+=q.vx;q.y+=q.vy;const main=platforms.find(p=>p.main);if(StageGeometry.overlaps(main,q.x,q.y,q.radius,q.radius*2)){q.dead=true;return true;}}
  if(q.kind==='ice'&&d===14&&q.split){for(const sign of[-1,1])genisObject(f,r,{kind:'shard',fx:7,x:q.x,y:q.y,face:sign,vx:sign*7,damage:6,life:28,radius:13});}
  if(q.kind==='shard')q.x+=q.vx;
  if(q.kind==='gravity'&&d<42){for(const target of BattlePlayers.targets(f)){if(CombatSystem.protection(target).intangible||target.grabOwner||target.grabbed||target.hitlag||target.hitstun||BattlePlayers.out(target))continue;const dx=q.x-target.x,dy=q.y-(target.y-28);if(Math.hypot(dx,dy)<q.radius+26){target.vx+=clamp(dx*.012,-.7,.7);if(!target.grounded)target.vy+=clamp(dy*.01,-.5,.5);}}return true;}
  if(q.kind==='gravity'&&d>47)return true;
  const b=q.kind==='laser'?{x1:q.x-85,y1:q.y,x2:q.x+85,y2:q.y,radius:23}:['pillar','ice'].includes(q.kind)?{x1:q.x,y1:q.y+35,x2:q.x,y2:q.y-65,radius:q.radius}: {x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};
  for(const target of BattlePlayers.targets(f)){if(q.hits.has(target.id)||CombatSystem.protection(target).intangible)continue;const touch=CombatSystem.contact(b,target),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(target.mode)&&CombatSystem.shieldCovers(target,b);if(!touch&&!shield)continue;q.hits.add(target.id);CombatSystem.hit(f,target,{...GenisMoves.dragon,type:'dragon',sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,angle:q.kind==='gravity'?1.35:-.95,baseKnockback:q.base,knockbackGrowth:q.growth},b,touch);if(['fire','shard'].includes(q.kind))q.dead=true;}return true;
 },
 boxes(f,a,w){if(a.genisFire||a.genisSpread||a.genisGravity)return[];if(a.type==='upsmash'){const x=f.x+f.face*55;return[{x1:x,y1:f.y-5,x2:x,y2:f.y-130,radius:a.indignation?50:45,window:w,modifiers:w}];}if(a.type==='smash')return[{x1:f.x,y1:f.y-35,x2:f.x+f.face*150,y2:f.y-43,radius:25,window:w,modifiers:w}];
  if(a.type==='downsmash')return[{x1:f.x,y1:f.y-15,x2:f.x+f.face*135,y2:f.y-65,radius:30,window:w,modifiers:w}];if(a.type==='dair')return[{x1:f.x,y1:f.y-18,x2:f.x+f.face*24,y2:f.y+55,radius:25,window:w,modifiers:w}];const s=w.shape,reach=({jab:96,jab2:100,jab3:111,heavy:122,low:113,dashAttack:122,fair:131,bair:133})[a.type]||108,p=s==='up'?[0,-28,0,-126]:s==='back'?[0,-31,-reach,-34]:s==='low'?[0,-12,reach,-12]:s==='spin'?[-65,-34,65,-34]:[0,-32,reach,-35];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='up'?26:19,window:w,modifiers:w}];},
 hurtboxes(f){const low=[11,13,21,22,25,39,40,43,44,45,51,53,56,57].includes(genisPose(f));return[{part:'head',x:f.x,y:f.y-(low?30:65),r:13},{part:'torso',x:f.x,y:f.y-(low?20:38),r:16},{part:'legs',x:f.x,y:f.y-10,r:12}];},
 cpu(f,o,i){if(f.attack?.genisFire)i.specialHeld=f.timer<38;if(f.attack?.genisSpread)i.x=Math.sign(o.x-f.x);if(f.attack?.genisCyclone){i.x=Math.sign(720-f.x);i.specialHeld=f.y>300;}}
});
function genisPose(f){if(f.mode==='Pummel')return 47;if(f.mode==='SpotDodge')return 11;if(f.attack)return f.attack.indignation?41:f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 58;if(f.mode==='LedgeGetup')return 59;if(f.mode==='JumpSquat')return 13;if(f.mode==='ForwardRoll')return 44;if(f.mode==='BackwardRoll')return 45;if(f.mode==='Helpless'||f.recovered&&!f.grounded)return 60;if(f.state==='walk')return[1,2,3,4][Math.floor(frame/6)%4];if(f.state==='run')return[5,6,7,8][Math.floor(frame/3)%4];return({idle:0,crouch:11,jump:14,double:15,fall:42,land:43,guard:52,dodge:53,hit:54,fly:55,down:56,getup:57,grab:46,caught:54,throw:48})[f.state]??0;}
MoveMotion.define('genis',Object.fromEntries(Object.entries({jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30}).map(([k,n])=>[k,{windup:0,strike:[n],recovery:['air','fair','bair','uair','dair'].includes(k)?42:0}])));

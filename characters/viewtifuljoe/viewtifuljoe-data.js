'use strict';
const ViewtifulJoeMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'punch',tether:true};
 const a=NewcomerCore.moves(['ジャブ','バックハンド','ヒーローキック','エクセレントタックル','ブリリアントアッパー','スイープキック','スライディングキック','ZOOMパンチ','グルーヴィーアッパー','ショッキングピンクキック','エアジョー','フライングキック','スピンヒール','ダブルアップキック','レッドホットキック'],{
  dragon:m('ブーメラン',9,[],75,0,{...opt,joeBoomerang:true,pose:31,projectile:true,damage:7,gravityMultiplier:.8}),
  dash:m('マックスピード',8,[],75,0,{...opt,joeMach:true,pose:34,damage:5,gravityMultiplier:.45,airControlMultiplier:0}),
  rise:m('シックスマシン・スパイラルレスキュー',7,[],75,14,{...opt,tether:false,joeRescue:true,pose:37,damage:6,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:10}),
  gale:m('VFXコントロール',10,[],65,0,{...opt,joeControl:true,pose:40,damage:0,projectile:true,gravityMultiplier:.7}),
  airDrop:m('空中VFXコントロール',10,[],65,12,{...opt,joeControl:true,pose:40,damage:0,projectile:true,aerial:true,gravityMultiplier:.7})
 },'punch',110),p={jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30,grab:46,pummel:47,ledge:57,getupAttack:57,forwardThrow:48,backThrow:49,upThrow:50,downThrow:51};
 for(const[k,n]of Object.entries(p)){a[k].pose=n;for(const e of a[k].activeFrames)e.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=25;a.air.activeFrames[0].shape='front';
 for(const key of['jab','jab2','jab3','heavy','up','low','dashAttack','smash','upsmash','downsmash','air','fair','bair','uair','dair'])a[key].authoredEffectCoverage=true;
 a.dash.authoredEffectCoverage=a.rise.authoredEffectCoverage=true;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:0,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function viewtifuljoeFilm(f){return clamp(f.joeFilm??100,0,100);}
function viewtifuljoeGate(f,type){if(f.joeCivilian>0&&type!=='rise')return false;if(['gale','airDrop'].includes(type))return viewtifuljoeFilm(f)>=12&&!ViewtifulJoeRules.objects.some(q=>q.owner===f.id&&q.kind==='slow'&&!q.dead);if(type==='dragon')return !ViewtifulJoeRules.objects.some(q=>q.owner===f.id&&q.kind==='boomerang'&&!q.dead);return true;}
function viewtifuljoeLand(){return false;}
function viewtifuljoeDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function viewtifuljoeStage(f,a,t){a.stage++;a.stageAt=t;a.confirmed=a.next=false;a.pose=[34,35,18,36][a.stage-1];const last=a.stage===4;a.activeFrames.push(CombatData.window(t,t+5,last?'up':'front',{pose:a.pose,index:a.stage-1,damage:last?12:4,angle:last?-1.12:-.72,meleeCoverage:true}));a.activeStart=a.activeFrames[0].start;a.activeEnd=t+5;a.motionLastEvent=a.motionCommitEnd=t+15;viewtifuljoeDuration(f,a,t+30);f.vx=a.originFace*(last?7:13);f.vy=last?-8:Math.min(f.vy,-1);if(last)f.grounded=false;f.joeFilm=Math.max(0,viewtifuljoeFilm(f)-9);}
function viewtifuljoeLaunch(f,a,t,i){a.phase='ride';a.launchAt=t;a.pose=37;f.grounded=false;f.recovered=true;a.activeFrames=a.civilian?[]:[CombatData.window(t,t+19,'up',{pose:37,index:0,damage:6,angle:-1.2,meleeCoverage:true})];a.activeStart=t;a.activeEnd=t+19;a.motionLastEvent=a.motionCommitEnd=t+31;viewtifuljoeDuration(f,a,t+49);}
const ViewtifulJoeRules=NewcomerCore.create('viewtifuljoe',ViewtifulJoeMoves,{
 reset(){for(const f of fighters)if(f.characterId==='viewtifuljoe'){f.joeFilm=100;f.joeZoom=f.joeCivilian=0;}},
 status(f,r){if(f.respawn){f.joeFilm=100;f.joeZoom=f.joeCivilian=0;return;}if(f.joeCivilian>0){f.joeCivilian--;if(!f.joeCivilian)f.joeFilm=20;return;}
  const slow=r.objects.some(q=>q.owner===f.id&&q.kind==='slow'&&!q.dead);if(f.joeZoom>0){f.joeZoom--;f.joeFilm=viewtifuljoeFilm(f)-.5;}else if(!slow&&!f.attack?.joeMach)f.joeFilm=clamp(viewtifuljoeFilm(f)+.12,0,100);
  if(viewtifuljoeFilm(f)<=0){f.joeFilm=0;f.joeCivilian=45;f.joeZoom=0;for(const q of r.objects)if(q.owner===f.id&&q.kind==='slow')q.dead=true;if(f.attack?.joeMach||f.attack?.joeControl)viewtifuljoeDuration(f,f.attack,f.timer+1);}
 },
 prepare(f,a){a.activeFrames=a.activeFrames.map(v=>({...v}));a.joeZoom=!!(f.joeZoom>0&&!a.special);if(a.joeZoom){a.damage*=1.18;for(const v of a.activeFrames)if(v.damage)v.damage*=1.18;}
  if(a.special){a.motionLastEvent=a.motionCommitEnd=a.totalFrames-10;a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];}if(a.joeMach){a.stage=0;a.phase='start';}if(a.joeRescue){a.phase='start';a.civilian=!!f.joeCivilian;}
 },
 action(f,i,r){const a=f.attack,t=f.timer,held=!!(i.special||i.specialHeld),pressed=held&&!a.specialWas;a.specialWas=held;
  if(a.joeZoom){const n=({smash:76,air:77,dair:78})[a.type];if(n!==undefined)for(const w of a.activeFrames){w.pose=n;if(w.motionPoseFrames)w.motionPoseFrames.fill(n);}}
  if(a.joeBoomerang&&!a.released&&t>=9&&(!held||t>=34)){a.released=t;a.high=t>=24;a.pose=a.high?33:31;r.spawn(f,{kind:'boomerang',x:f.x+a.originFace*30,y:f.y-45,vx:a.originFace*(a.high?11:9),vy:a.high?-6:-1,life:100,radius:14,damage:7,high:a.high,leg:'out',returnAt:a.high?35:26});a.motionLastEvent=a.motionCommitEnd=t;viewtifuljoeDuration(f,a,t+23);}else if(a.joeBoomerang&&!a.released&&t>=24)a.pose=32;
  if(a.joeMach){if(a.phase==='start'&&t>=8){a.phase='rush';viewtifuljoeStage(f,a,t);}if(a.phase==='rush'){const d=t-a.stageAt;if(pressed&&d>=2){a.next=true;if(f.buffer?.key==='special')f.buffer=null;}f.vx=a.originFace*(a.stage===4?7:13)*Math.max(.35,1-d*.055);if(d>=9){if(a.confirmed&&a.next&&a.stage<4&&viewtifuljoeFilm(f)>=9)viewtifuljoeStage(f,a,t);else{a.phase='finish';a.motionLastEvent=a.motionCommitEnd=t;viewtifuljoeDuration(f,a,t+17);}}}}
  if(a.joeRescue){f.fastFall=false;if(a.phase==='start'){f.vx*=.35;f.vy=0;if(t>=7){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);a.phase='escape';viewtifuljoeDuration(f,a,t+130);}else viewtifuljoeLaunch(f,a,t,i);}}
   if(a.phase==='escape'){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)viewtifuljoeLaunch(f,a,t,i);return;}
   if(a.phase==='ride'){const d=t-a.launchAt;a.pose=37;f.vx=(i.x||0)*5.5+Math.sin(d*.45)*1.8;f.vy=-15+d*.26;if(d>=16&&i.jump||d>=26){a.phase='jump';a.jumpAt=t;a.pose=38;f.vx=(Math.abs(i.x)>.15?i.x:a.originFace)*7;f.vy=-12;a.activeFrames=[];a.motionLastEvent=a.motionCommitEnd=t;viewtifuljoeDuration(f,a,t+17);}}
   if(a.phase==='jump'){a.pose=t-a.jumpAt<7?38:60;a.gravityMultiplier=1;a.airControlMultiplier=1;}
  }
  if(a.joeControl&&!a.released&&t>=10&&(!held||t>=32)){a.released=t;a.zoom=t>=24;if(a.zoom){a.pose=41;f.joeZoom=180;f.joeFilm=Math.max(0,viewtifuljoeFilm(f)-12);}else{a.pose=40;r.spawn(f,{kind:'slow',x:f.x,y:f.y-40,vx:0,vy:0,life:120,radius:160,damage:0});}a.motionLastEvent=a.motionCommitEnd=t;viewtifuljoeDuration(f,a,t+22);}
  if(a.special)a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];
 },
 onHit(f,o,a){f.joeFilm=clamp(viewtifuljoeFilm(f)+2,0,100);if(a?.joeMach&&f.attack?.joeMach)f.attack.confirmed=true;},
 projectile(q,f,o,r){if(f.respawn||q.age>=q.life||q.y>1400){q.dead=true;return true;}
  if(q.kind==='slow'){if(f.joeCivilian>0||viewtifuljoeFilm(f)<=0){q.dead=true;return true;}f.joeFilm=Math.max(0,viewtifuljoeFilm(f)-.7);for(const target of BattlePlayers.targets(f)){if(BattlePlayers.out(target)||CombatSystem.protection(target).intangible||target.grabOwner||target.grabbed||target.hitlag||target.hitstun)continue;if(Math.hypot(target.x-q.x,target.y-40-q.y)<q.radius){target.vx*=.88;if(!target.grounded)target.vy*=.96;}}return true;}
  q.previousX=q.x;q.previousY=q.y;if(q.leg==='out'){q.x+=q.vx;q.y+=q.vy;q.vy+=q.high?.18:.06;const main=platforms.find(p=>p.main);if(q.age>=q.returnAt||StageGeometry.overlaps(main,q.x,q.y,q.radius,q.radius*2)){q.leg='return';q.hits.clear();}}
  else{const dx=f.x-q.x,dy=f.y-42-q.y,d=Math.hypot(dx,dy);if(d<20){q.dead=true;return true;}q.x+=dx/d*12;q.y+=dy/d*12;}
  const box={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};for(const target of BattlePlayers.targets(f)){if(q.hits.has(target.id)||CombatSystem.protection(target).intangible)continue;const touch=CombatSystem.contact(box,target),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(target.mode)&&CombatSystem.shieldCovers(target,box);if(touch||shield){q.hits.add(target.id);CombatSystem.hit(f,target,{...ViewtifulJoeMoves.dragon,type:'dragon',sourceType:q.sourceType,projectile:true,charge:0,damage:q.leg==='out'?7:5,staleMultiplier:q.stale,launchDirection:Math.sign(q.x-q.previousX)||q.face,angle:-.8,baseKnockback:3.4,knockbackGrowth:.06},box,touch);}}return true;
 },
 boxes(f,a,w){if(a.joeBoomerang||a.joeControl)return[];const reach=({jab:90,jab2:96,jab3:118,heavy:108,low:114,dashAttack:135,smash:145,fair:135,bair:139})[a.type]||115;
  let p=w.shape==='up'?[0,-35,8,-137]:w.shape==='back'?[0,-39,-reach,-44]:w.shape==='low'?[0,-15,reach,-15]:w.shape==='down'?[7,-20,48,61]:[0,-40,reach,-44];
  if(a.type==='air'){const n=CombatData.sample(a,f.timer).pose;p=n===62?[2,-38,108,-42]:n===63?[3,-27,92,-12]:[3,-42,90,-84];}
  if(a.type==='downsmash')p=[-95,-13,95,-13];if(a.joeRescue)p=[-25,-35,25,-110];
  return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:w.shape==='up'?29:21,window:w,modifiers:w}];
 },
 hurtboxes(f){const riding=f.attack?.joeRescue&&f.attack.phase==='ride'&&!f.joeCivilian,low=[11,13,21,22,25,43,44,45,51,53,56,57,71,72].includes(viewtifuljoePose(f));return[{part:'head',x:f.x,y:f.y-(riding?122:low?38:73),r:17},{part:'torso',x:f.x,y:f.y-(riding?90:low?25:43),r:19},{part:'legs',x:f.x,y:f.y-(riding?50:12),r:15}];},
 cpu(f,o,i){if(f.attack?.joeBoomerang)i.specialHeld=f.timer<26;if(f.attack?.joeControl)i.specialHeld=viewtifuljoeFilm(f)>65&&f.timer<26;if(f.attack?.joeMach)i.specialHeld=i.special=f.timer%9>=1&&f.timer%9<=2;if(f.attack?.joeRescue){i.x=Math.sign(720-f.x);i.jump=f.timer>=28;}}
});
function viewtifuljoePose(f){if(f.joeCivilian>0){if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 74;if(f.mode==='Helpless'||f.recovered&&!f.grounded)return 75;if(['ForwardRoll','BackwardRoll','SpotDodge'].includes(f.mode))return 72;return({idle:64,walk:65,run:66,jump:67,double:67,fall:68,land:71,crouch:71,guard:70,dodge:72,hit:69,fly:73,down:73,getup:71})[f.state]??64;}
 if(f.mode==='Pummel')return 47;if(f.mode==='SpotDodge')return 11;if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 58;if(f.mode==='LedgeGetup')return 59;if(f.mode==='JumpSquat')return 13;if(f.mode==='ForwardRoll')return 44;if(f.mode==='BackwardRoll')return 45;if(f.mode==='Helpless'||f.recovered&&!f.grounded)return 60;if(f.state==='walk')return[1,2,3,4][Math.floor(frame/6)%4];if(f.state==='run')return[5,6,7,8][Math.floor(frame/3)%4];return({idle:0,crouch:11,jump:14,double:15,fall:42,land:43,guard:52,dodge:53,hit:54,fly:55,down:56,getup:57,grab:46,caught:54,throw:48})[f.state]??0;
}
MoveMotion.define('viewtifuljoe',Object.fromEntries(Object.entries({jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30}).map(([k,n])=>[k,{windup:['air','fair','bair','uair','dair'].includes(k)?15:0,strike:k==='air'?[26,62,63]:[n],recovery:['air','fair','bair','uair','dair'].includes(k)?42:0}])));

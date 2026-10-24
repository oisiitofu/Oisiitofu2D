'use strict';
const ShionneMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'magic',tether:true};
 const a=NewcomerCore.moves(['銃床殴り','銃の跳ね上げ','至近射撃','ライフルスイープ','軽やかな銃床上げ','スライドキック','月華の一閃','アンニヒレーション','ウィングクリップ','グラビタスフィールド','銃回し','スピアスイープ','バックショット','昇空射撃','スコーチアース'],{
  dragon:m('マグナレイ',10,[],75,0,{...opt,shionneRay:true,pose:31,projectile:true,damage:5,gravityMultiplier:.7}),
  dash:m('イグニス・セレステ',10,[],90,0,{...opt,shionneBomb:true,pose:34,projectile:true,damage:12,gravityMultiplier:.75}),
  rise:m('スコーチ・リコイル',6,[],65,14,{...opt,tether:false,shionneRecoil:true,pose:37,helpless:true,damage:6,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:8}),
  gale:m('ヒーリングサークル',24,[],65,0,{...opt,shionneHeal:true,pose:40,projectile:true,damage:0,gravityMultiplier:.5}),
  airDrop:m('空中ヒーリングサークル',24,[],65,12,{...opt,shionneHeal:true,pose:40,projectile:true,damage:0,aerial:true,gravityMultiplier:.5})
 },'punch',126);
 const poses={jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30,grab:46,pummel:47,ledge:57,getupAttack:57,forwardThrow:48,backThrow:49,upThrow:50,downThrow:51};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}
 a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=25;
 for(const[type,family]of Object.entries({jab:'staff',jab2:'staff',jab3:'gun',heavy:'staff',up:'staff',smash:'beam',upsmash:'light',downsmash:'dark',air:'staff',fair:'staff',bair:'gun',uair:'gun',dair:'fire',dragon:'beam',dash:'fire',rise:'gun',gale:'light',airDrop:'light'}))a[type].soundFamily=family;
 for(const key of['smash','upsmash','downsmash','air','uair','dair'])a[key].authoredEffectCoverage=true;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:0,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};
 return a;
})();
function shionneBlast(f){return clamp(f.shionneBlast??1,0,3);}
function shionneDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function shionneGate(f,type){if(['gale','airDrop'].includes(type))return shionneBlast(f)>=1&&(f.shionneHealed||0)<15&&!ShionneRules.objects.some(q=>q.owner===f.id&&q.kind==='heal'&&!q.dead);return !(['dragon','dash'].includes(type)&&ShionneRules.objects.filter(q=>q.owner===f.id&&!q.dead).length>=10);}
function shionneLand(){return false;}
function shionneSpawn(f,r,v){if(r.objects.filter(q=>q.owner===f.id&&!q.dead).length>=10)return null;return r.spawn(f,{kind:'ray',fx:2,vx:0,vy:0,life:55,damage:5,base:3.5,growth:.065,...v});}
function shionneExplode(q){q.kind='explosion';q.fx=5;q.age=0;q.life=9;q.radius=q.strong?70:53;q.damage=q.strong?23:15;q.base=q.strong?5.7:4.6;q.growth=.08;q.vx=q.vy=0;q.hits.clear();}
function shionneLaunch(f,a,t,i){a.launchAt=t;a.phase='recoil';a.aim=clamp(i.x||0,-1,1);a.pose=37;f.grounded=false;f.recovered=true;f.vx=a.aim*6;f.vy=-18;a.activeFrames=[CombatData.window(t,t+6,'down',{pose:37,index:0,damage:6,angle:1.35,meleeCoverage:true})];a.activeStart=t;a.activeEnd=t+6;a.motionLastEvent=a.motionCommitEnd=t+21;shionneDuration(f,a,t+36);}
const ShionneRules=NewcomerCore.create('shionne',ShionneMoves,{
 reset(){for(const f of fighters)if(f.characterId==='shionne'){f.shionneBlast=1;f.shionneHealed=0;f.shionneThorns=0;}},
 status(f){if(f.respawn){f.shionneBlast=1;f.shionneHealed=0;}else f.shionneBlast=clamp(shionneBlast(f)+1/600,0,3);if(f.shionneThorns>0)f.shionneThorns--;},
 prepare(f,a,r){a.activeFrames=a.activeFrames.map(v=>({...v}));if(a.special){a.motionLastEvent=a.motionCommitEnd=a.totalFrames-10;a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];}if(a.shionneBomb)a.remote=r.objects.find(q=>q.owner===f.id&&q.kind==='bomb'&&!q.dead)?.id;if(a.shionneRecoil)a.phase='start';},
 action(f,i,r){const a=f.attack,t=f.timer,held=!!(i.special||i.specialHeld),pressed=held&&!a.specialWas;a.specialWas=held;
  if(a.shionneRay&&!a.released&&t>=10&&(!held||t>=45)){a.released=t;a.pose=t>=30?32:31;for(let n=0;n<3;n++)shionneSpawn(f,r,{x:f.x+f.face*48,y:f.y-52,vx:f.face*(12+n*.3),vy:0,delay:n*5,life:48+n*5,damage:t>=30?6:4.5});a.motionLastEvent=a.motionCommitEnd=t;shionneDuration(f,a,t+25);}
  if(a.shionneBomb&&!a.released&&t>=10&&(!held||t>=40)){
   a.released=t;const q=r.objects.find(q=>q.id===a.remote&&!q.dead);a.sniper=t>=30&&shionneBlast(f)>=1;
   if(a.sniper){f.shionneBlast=shionneBlast(f)-1;a.pose=36;shionneSpawn(f,r,{kind:'snipe',fx:6,x:f.x+f.face*60,y:f.y-52,vx:f.face*34,life:12,radius:15,damage:22,base:5.7,growth:.085});if(q){q.strong=true;shionneExplode(q);}}
   else if(q){a.pose=35;shionneExplode(q);}
   else{a.pose=34;shionneSpawn(f,r,{kind:'bomb',fx:4,x:f.x+f.face*28,y:f.y-62,vx:f.face*7,vy:-4.6,life:150,radius:11,damage:15});}
   a.motionLastEvent=a.motionCommitEnd=t;shionneDuration(f,a,t+22);
  }
  if(a.shionneRecoil){f.fastFall=false;
   if(a.phase==='start'){f.vx*=.35;f.vy=0;if(t>=6){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);a.phase='escape';shionneDuration(f,a,t+120);}else shionneLaunch(f,a,t,i);}}
   if(a.phase==='escape'){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)shionneLaunch(f,a,t,i);return;}
   if(a.phase==='recoil'){
    const d=t-a.launchAt;f.vx=a.aim*6;f.vy=-18+d*.5;
    // Buffer a second press during the first recoil; consume no meter and
    // execute it during ascent, without a stationary follow-up waiting phase.
    if(pressed&&d>=2&&d<=18)a.followBuffered=true;
    if(a.followBuffered&&!a.followed&&d>=8){a.followed=true;a.followAt=t;a.aim=clamp(Math.abs(i.x)>.15?i.x:a.aim,-1,1);f.vx=a.aim*9;f.vy=-12;a.pose=38;shionneSpawn(f,r,{kind:'recoil',fx:8,x:f.x-a.aim*20,y:f.y+10,vx:-a.aim*5,vy:10,life:12,radius:18,damage:7,base:4,growth:.06});}
    if(a.followed){a.pose=38;f.vx=a.aim*9;f.vy=-12+(t-a.followAt)*.55;}
    if(d>=23){a.phase='exit';a.pose=60;a.gravityMultiplier=1;a.airControlMultiplier=1;a.motionLastEvent=a.motionCommitEnd=t;shionneDuration(f,a,t+5);}
   }
  }
  if(a.shionneHeal&&!a.cast&&t>=24){a.cast=true;a.pose=41;if(shionneBlast(f)>=1){f.shionneBlast=shionneBlast(f)-1;const floor=platforms.filter(p=>f.x>=p.x&&f.x<=p.x+p.w&&p.y>=f.y-18).sort((a,b)=>a.y-b.y)[0];shionneSpawn(f,r,{kind:'heal',fx:9,x:f.x,y:floor?.y??f.y+75,life:120,radius:65,damage:0});}a.motionLastEvent=a.motionCommitEnd=t;shionneDuration(f,a,t+28);}
  if(a.special)a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];
 },
 onHit(f,o,a){f.shionneBlast=clamp(shionneBlast(f)+.07,0,3);if(!a?.projectile)f.shionneThorns=12;},
 projectile(q,f,o,r){if(f.respawn||q.age>=q.life||q.x<-900||q.x>2340||q.y>1400){q.dead=true;return true;}if(q.age<=(q.delay||0))return true;q.previousX=q.x;q.previousY=q.y;
  if(q.kind==='heal'){if(q.age%12===0&&f.damage>0&&(f.shionneHealed||0)<15&&Math.hypot(f.x-q.x,f.y-q.y)<q.radius&&f.grounded){const amount=Math.min(.8,f.damage,15-(f.shionneHealed||0));f.damage-=amount;f.shionneHealed=(f.shionneHealed||0)+amount;}return true;}
  if(q.kind==='bomb'){q.vy+=.3;q.x+=q.vx;q.y+=q.vy;const floor=platforms.find(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY<=p.y&&q.y>=p.y);if(floor){q.y=floor.y-3;q.vx*=.5;q.vy=-Math.abs(q.vy)*.36;}if(q.age>=140)shionneExplode(q);else return true;}
  if(q.kind!=='explosion'){q.x+=q.vx;q.y+=q.vy;const p=platforms.find(p=>p.main);if(StageGeometry.overlaps(p,q.x,q.y,q.radius,q.radius*2)){q.dead=true;return true;}}
  const box={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};
  for(const target of BattlePlayers.targets(f)){if(q.hits.has(target.id)||CombatSystem.protection(target).intangible)continue;const touch=CombatSystem.contact(box,target),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(target.mode)&&CombatSystem.shieldCovers(target,box);if(!touch&&!shield)continue;q.hits.add(target.id);CombatSystem.hit(f,target,{...ShionneMoves.dragon,soundFamily:q.kind==='explosion'?'fire':q.kind==='recoil'||q.kind==='snipe'?'gun':'beam',type:'dragon',sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,angle:q.kind==='recoil'?1.3:-.8,baseKnockback:q.base,knockbackGrowth:q.growth},box,touch);}
  return true;
 },
 boxes(f,a,w){if(a.shionneRay||a.shionneBomb||a.shionneHeal)return[];
  const h=48,reach=({jab:104,jab2:110,jab3:123,heavy:135,low:112,dashAttack:120,smash:154,fair:142,bair:147})[a.type]||122;
  let p=w.shape==='up'?[0,-32,0,-150]:w.shape==='back'?[0,-h,-reach,-h]:w.shape==='low'?[0,-14,reach,-14]:w.shape==='down'?[0,-20,35,65]:[0,-h,reach,-h];
  // The twirling rifle controls the space in front of her hand; it is not
  // the shared all-around body-spin capsule used by unrelated fighters.
  if(a.type==='air')p=[-8,-55,110,-55];if(a.type==='downsmash')p=[-100,-14,100,-14];
  return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:w.shape==='up'?29:a.type==='air'?22:20,window:w,modifiers:w}];
 },
 hurtboxes(f){const low=[11,13,21,23,25,36,40,43,44,45,51,53,56,57].includes(shionnePose(f));return[{part:'head',x:f.x,y:f.y-(low?43:82),r:13},{part:'torso',x:f.x,y:f.y-(low?29:48),r:18},{part:'legs',x:f.x,y:f.y-13,r:15}];},
 cpu(f,o,i){if(f.attack?.shionneRay)i.specialHeld=f.timer<13;if(f.attack?.shionneBomb)i.specialHeld=shionneBlast(f)>=1&&f.timer<32;if(f.attack?.shionneRecoil){i.x=Math.sign(720-f.x);i.specialHeld=f.timer>14&&f.timer<17;i.special=i.specialHeld;}}
});
function shionnePose(f){if(f.mode==='Pummel')return 47;if(f.mode==='SpotDodge')return 11;if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 58;if(f.mode==='LedgeGetup')return 59;if(f.mode==='JumpSquat')return 13;if(f.mode==='ForwardRoll')return 44;if(f.mode==='BackwardRoll')return 45;if(f.mode==='Helpless'||f.recovered&&!f.grounded)return 60;if(f.state==='walk')return[1,2,3,4][Math.floor(frame/6)%4];if(f.state==='run')return[5,6,7,8][Math.floor(frame/3)%4];return({idle:0,crouch:11,jump:14,double:15,fall:42,land:43,guard:52,dodge:53,hit:54,fly:55,down:56,getup:57,grab:46,caught:54,throw:48})[f.state]??0;}
MoveMotion.define('shionne',Object.fromEntries(Object.entries({jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30}).map(([k,n])=>[k,{windup:['air','fair','bair','uair','dair'].includes(k)?14:['smash','low','downsmash'].includes(k)?11:0,strike:[n],recovery:['air','fair','bair','uair','dair'].includes(k)?42:0}])));

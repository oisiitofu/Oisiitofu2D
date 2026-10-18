'use strict';
const KatamariMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'punch'};
 const a=NewcomerCore.moves(['小さく転がす','左右に押す','跳ねてぶつける','大きくなぎ払う','持ち上げて落とす','その場で回転','転がり突進','大きく押し出す','持ち上げて投げる','高速巻き込み','くるっと回る','塊体当たり','後ろに転がす','すくい上げる','真下に押しつぶす'],{
  dragon:m('モノを巻き込む',14,[w(14,20,'front',{pose:41,damage:4,baseKnockback:1.5,knockbackGrowth:.025})],16,0,{...opt,kataSuction:true,pose:40,damage:4}),
  dash:m('転がり成長タックル',10,[w(10,31,'front',{pose:42,damage:10})],14,0,{...opt,kataRoll:true,pose:42,damage:10,gravityMultiplier:.8,airControlMultiplier:0}),
  rise:m('塊ジャンプ',8,[w(10,16,'up',{pose:45,damage:6})],50,14,{...opt,kataBounce:true,pose:44,damage:6,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:10}),
  gale:m('アイテム呼び込み',16,[],20,0,{...opt,kataItems:true,pose:47,damage:0}),
  airDrop:m('空中アイテム呼び込み',16,[],20,10,{...opt,kataItems:true,aerial:true,pose:47,damage:0})
 },'punch',95),poses={jab:6,jab2:7,jab3:8,heavy:9,up:10,low:11,dashAttack:2,smash:12,upsmash:13,downsmash:11,air:10,fair:9,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:13,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=a.getupAttack.activeFrames[1].pose=14;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function katamariGrowth(f){return clamp(f.kataGrowth||0,0,100);}
function katamariRadius(f){return 28+katamariGrowth(f)*.5;}
function katamariGrow(f,n){f.kataGrowth=clamp(katamariGrowth(f)+n,0,100);}
function katamariBall(f){const r=katamariRadius(f),a=f.attack,w=a&&CombatData.activeWindow(a,f.timer),shape=w?.shape;
 if(shape==='up')return{x:f.x,y:f.y-68-r*.65,r};if(shape==='down')return{x:f.x+f.face*8,y:f.y+r*.1,r};
 if(shape==='back')return{x:f.x-f.face*(r*.75+16),y:f.y-r,r};
 if(shape==='spin')return{x:f.x+Math.cos(f.timer*.35)*(r*.65+20),y:f.y-35-Math.sin(f.timer*.35)*18,r};
 return{x:f.x+(f.kataBallDX??f.face*(r*.75+16))+(a?.type==='smash'?f.face*35:0),y:f.y-r,r};
}
function katamariGate(f,type){return true;}
function katamariDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function katamariCliffStop(f){if(!f.grounded)return;const p=platforms.find(p=>Math.abs(f.y-p.y)<3&&f.x>=p.x-3&&f.x<=p.x+p.w+3);if(p)f.vx=clamp(f.vx,p.x+2-f.x,p.x+p.w-2-f.x);}
function katamariBeginBounce(f,a,i,t){a.bounceAt=t;a.bounceFace=Math.abs(i.x)>.2?Math.sign(i.x):f.face;f.face=a.bounceFace;f.recovered=true;f.grounded=false;f.fastFall=false;f.vx=a.bounceFace*3;f.vy=-14-(a.chargeTicks||0)*.25-katamariGrowth(f)*.02;a.gravityMultiplier=.8;a.pose=45;katamariDuration(f,a,t+55);a.activeFrames=[CombatData.window(t,t+7,'up',{pose:45,damage:a.damage})];}
const KatamariRules=NewcomerCore.create('katamari',KatamariMoves,{
 reset(){for(const f of fighters)if(f.characterId==='katamari')Object.assign(f,{kataGrowth:0,kataSeenDamage:f.damage,kataLastX:f.x,kataSpin:0,kataBallDX:f.face*37,kataPickDistance:0,kataPickCount:0,kataSuctionCooldown:0,kataRollCooldown:0,kataItemsCooldown:0,kataShed:0});},
 status(f,r){
  for(const k of['kataSuctionCooldown','kataRollCooldown','kataItemsCooldown','kataShed'])f[k]=Math.max(0,(f[k]||0)-1);
  if(f.respawn){f.kataGrowth=0;f.kataSeenDamage=f.damage;f.kataLastX=f.x;f.kataPickDistance=0;f.kataSuctionCooldown=f.kataRollCooldown=f.kataItemsCooldown=0;return;}
  const received=Math.max(0,f.damage-(f.kataSeenDamage??f.damage));f.kataSeenDamage=f.damage;const dx=f.x-(f.kataLastX??f.x);f.kataLastX=f.x;
  if(received>0){katamariGrow(f,-received*1.2);f.kataShed=18;}
  // Only real self-controlled travel grows the ball. Launches, grabs and teleports do not.
  const moving=!received&&!f.hitlag&&!f.hitstun&&!f.pendingLaunch&&!f.tumbling&&!f.grabOwner&&!f.ledge&&Math.abs(f.vx)>.01&&!['Dead','Respawn','LedgeGetup','LedgeRoll','ForwardRoll','BackwardRoll'].includes(f.mode)&&Math.abs(dx)<=13;
  if(moving&&Math.abs(dx)>.01){const distance=Math.abs(dx);katamariGrow(f,distance*(f.attack?.kataRoll ? .07 : .015));f.kataSpin=(f.kataSpin||0)+dx/katamariRadius(f);f.kataPickDistance=(f.kataPickDistance||0)+distance;if(f.kataPickDistance>=45){f.kataPickDistance-=45;const p=katamariBall(f);r.spawn(f,{kind:'pickup',x:p.x+f.face*(p.r+35),y:f.y-12,vx:0,vy:0,damage:0,life:12,gain:0,variant:(f.kataPickCount||0)%3});f.kataPickCount=(f.kataPickCount||0)+1;}}
  const g=katamariGrowth(f),radius=katamariRadius(f);f.kataBallDX=moveToward(f.kataBallDX??f.face*(radius*.75+16),f.face*(radius*.75+16),12);
  f.character.weight=85+g*.2;f.character.runSpeed=6.8-g*.008;f.character.airSpeed=5.8-g*.006;f.character.shieldSize=radius+36;
 },
 prepare(f,a,r){a.activeFrames=a.activeFrames.map(w=>({...w}));const growth=katamariGrowth(f);if(!a.kataSuction&&!a.kataItems){a.damage*=1+growth*.0025;for(const w of a.activeFrames)if(w.damage!=null)w.damage*=1+growth*.0025;}
  if(a.kataRoll){f.kataRollCooldown=0;a.motionLastEvent=31;}
  if(a.kataSuction){f.kataSuctionCooldown=0;a.motionLastEvent=26;for(const w of a.activeFrames)w.pull=true;}
  if(a.kataItems){f.kataItemsCooldown=0;a.motionLastEvent=28;}
  if(a.kataBounce){a.chargeTicks=0;a.activeFrames=[];}
 },
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.kataRoll){a.pose=t<8?3:t<25?42:43;f.fastFall=false;if(t>=8&&t<=31){f.vx=f.face*(6.5+katamariGrowth(f)*.045);katamariCliffStop(f);}else f.vx=moveToward(f.vx,0,.9);}
  if(a.kataSuction||a.kataItems){f.fastFall=false;f.vx=moveToward(f.vx,0,.6);a.suctionHeld=!!i.specialHeld;a.pose=a.kataItems?47:t<14?40:41;
   const frames=a.kataItems?[16,22,28]:[14,20,26];if(frames.includes(t)&&!a.eventsDone.has('collect'+t)){a.eventsDone.add('collect'+t);const p=katamariBall(f),side=a.kataItems?((t-16)/6%2?-1:1):f.face;r.spawn(f,{kind:'pickup',x:p.x+side*(a.kataItems?115:i.specialHeld?155:95),y:p.y-(a.kataItems?75:10),vx:0,vy:0,damage:0,life:12,gain:a.kataItems?2.5:i.specialHeld?2:1.5,variant:t%3});a.motionLastEvent=frames.at(-1);}
  }
  if(a.kataBounce){f.fastFall=false;
   if(a.bounceAt==null){f.vx*=.65;f.vy=0;if(t<8)return;if(i.specialHeld&&t<24&&!a.escapeSide){a.chargeTicks++;return;}
    if(!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);katamariDuration(f,a,t+110);}else katamariBeginBounce(f,a,i,t);}
    if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)katamariBeginBounce(f,a,i,t);return;}
   }
   const dt=t-a.bounceAt;if(dt>=8&&dt<=20&&i.special&&!a.specialWas&&!a.redirected){a.redirected=true;a.bounceFace=Math.abs(i.x)>.2?Math.sign(i.x):-a.bounceFace;f.face=a.bounceFace;f.vx=a.bounceFace*7;f.vy=-8;}
   a.pose=dt<12?45:a.redirected&&dt<27?46:35;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*5.8,.3);a.gravityMultiplier=dt<30?.8:1;a.specialWas=!!i.special;
  }
 },
 onHit(f,o,strike){const a=f.attack;if(a&&!a.kataCollected&&strike.type!=='pummel'){a.kataCollected=true;katamariGrow(f,a.kataRoll?8:a.kataSuction?4:1.5);}},
 boxes(f,a,w){if(a.kataSuction)return[{x1:f.x,y1:f.y-30,x2:f.x+f.face*((a.suctionHeld?150:95)+katamariGrowth(f)*.3),y2:f.y-35,radius:20+katamariGrowth(f)*.06,window:w,modifiers:w}];const p=katamariBall(f),r=Math.max(17,p.r*.78);return[{x1:f.x,y1:f.y-30,x2:p.x,y2:p.y,radius:r,window:w,modifiers:w}];},
 projectile(q,f){if(f.respawn){q.dead=true;return true;}if(q.kind!=='pickup')return false;const p=katamariBall(f),left=Math.max(1,q.life-q.age+1);q.x+=(p.x-q.x)/left;q.y+=(p.y-q.y)/left;if(q.age>=q.life){katamariGrow(f,q.gain||0);q.dead=true;}return true;},
 hurtboxes(f){const p=katamariBall(f),low=[3,11,22,32,36,44].includes(katamariPose(f));return[{part:'head',x:f.x,y:f.y-(low?34:58),r:22},{part:'torso',x:f.x,y:f.y-(low?20:30),r:15},{part:'legs',x:f.x,y:f.y-9,r:12},{part:'body',x:p.x,y:p.y,r:p.r*.8}];},
 cpu(f,o,i,clear){if(f.attack?.kataBounce){i.x=Math.sign(720-f.x);return;}if(!f.attack&&f.grounded&&Math.abs(o.x-f.x)>95&&Math.abs(o.x-f.x)<280&&katamariGate(f,'dash')&&frame%37===f.id){clear();i.x=Math.sign(o.x-f.x);i.y=0;i.special=true;}else if(!f.attack&&f.grounded&&Math.abs(o.x-f.x)>300&&katamariGate(f,'gale')&&frame%101===f.id){clear();i.x=0;i.y=1;i.special=true;}}
});
function katamariPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('katamari',{"fair":{"strike":[12,13],"windup":3},"air":{"strike":[10,7],"windup":3}});

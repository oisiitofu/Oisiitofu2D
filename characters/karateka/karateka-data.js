'use strict';
const KaratekaMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'punch'},soft={fixedKnockback:12,baseKnockback:1,knockbackGrowth:.015},a=NewcomerCore.moves(['ジャブ','ストレート','連打ラッシュ','回し蹴り','アッパー','下段キック','突進パンチ','強烈な回し蹴り','両手打ち上げ','低姿勢連続打撃','空中パンチ','飛び蹴り','後ろ回し蹴り','上昇キック','下落キック'],{
 dragon:m('ジャストラッシュ',8,[w(8,10,'front',{...soft,pose:6,damage:3})],12,0,{...opt,karateRush:true,tether:true,pose:40,damage:3,airControlMultiplier:.3}),
 dash:m('ステップカウンター',4,[],12,0,{...opt,karateStep:true,tether:true,pose:41,damage:0,counterWindow:[4,11],counterMove:'stepCounter',airControlMultiplier:0,gravityMultiplier:.6}),
 stepCounter:m('ステップカウンター・ジャスト反撃',5,[w(5,9,'front',{pose:44})],15,0,{...opt,karateCounter:true,pose:44,damage:13,baseKnockback:4,knockbackGrowth:.075,airControlMultiplier:.2}),
 stepPunch:m('ステップ・返しパンチ',6,[w(6,9,'front',{pose:7})],12,0,{...opt,karateCounter:true,pose:7,damage:8,baseKnockback:3.2,knockbackGrowth:.06,airControlMultiplier:.2}),
 rise:m('かべけりジャンプ',8,[w(8,14,'up',{pose:42,damage:5})],52,18,{...opt,karateLeap:true,pose:42,damage:5,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:13}),
 gale:m('きあい！',18,[],12,0,{...opt,karateKi:true,pose:43,damage:0}),
 airDrop:m('空中きあい！',18,[],12,16,{...opt,karateKi:true,aerial:true,pose:43,damage:0})
 },'punch',106),poses={jab:6,jab2:7,jab3:8,heavy:13,up:10,low:11,dashAttack:9,smash:13,upsmash:10,downsmash:11,air:12,fair:13,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:10,downThrow:16};for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const e of a[k].activeFrames)e.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=a.getupAttack.activeFrames[1].pose=14;for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};return a;})();
function karatekaKi(f){return(f.karateKiTime||0)>0;}
function karatekaGate(f,type){return !(['gale','airDrop'].includes(type)&&(f.karateKiCooldown>0||karatekaKi(f)));}
function karatekaDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function karatekaApply(f){const c=CharacterData.karateka,s=karatekaKi(f)?1.12:1;f.character.walkSpeed=c.walkSpeed*s;f.character.runSpeed=c.runSpeed*s;f.character.initialDashSpeed=c.initialDashSpeed*s;}
function karatekaLaunch(f,a,t,i){a.launchAt=t;f.grounded=false;f.recovered=true;f.fastFall=false;f.vx=clamp(i.x,-1,1)*6;f.vy=-14;a.activeFrames=[CombatData.window(t,t+7,'up',{pose:42,damage:5})];a.activeStart=t;a.activeEnd=t+7;karatekaDuration(f,a,t+52);}
function karatekaKick(f,a,t,side,wall){a.kickUsed=true;a.wallKick=wall;a.kickAt=t;f.vx=side*7;f.vy=-18;f.fastFall=false;a.activeFrames.push(CombatData.window(t+2,t+7,'up',{pose:42,damage:4}));a.activeEnd=t+7;karatekaDuration(f,a,t+44);ring(f.x,f.y-35,'#ffeb52',45);}
const KaratekaRules=NewcomerCore.create('karateka',KaratekaMoves,{
 reset(){for(const f of fighters)if(f.characterId==='karateka'){Object.assign(f,{karateKiTime:0,karateKiCooldown:0});karatekaApply(f);}},
 status(f){if(!f.hitlag){for(const k of['karateKiTime','karateKiCooldown'])f[k]=f.respawn?0:Math.max(0,(f[k]||0)-1);}if(f.respawn)f.karateKiTime=f.karateKiCooldown=0;karatekaApply(f);},
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));a.karatePowered=karatekaKi(f);if(a.karatePowered&&!a.special&&a.activeFrames.length){const shift=Math.min(2,a.startupFrames-3);a.startupFrames-=shift;for(const w of a.activeFrames){w.start-=shift;w.end-=shift;}a.activeStart=a.activeFrames[0].start;a.activeEnd=a.activeFrames.at(-1).end;a.timeline=a.timeline.map(e=>({...e,frame:Math.max(1,e.frame-shift)}));karatekaDuration(f,a,a.totalFrames-shift);a.baseKnockback*=1.12;a.knockbackGrowth*=1.08;}
  if(a.karateRush){a.stage=1;a.lastSpecial=true;a.queued=false;a.motionLastEvent=10;karatekaDuration(f,a,24);}
  if(a.karateStep){a.lastSpecial=true;a.motionLastEvent=18;karatekaDuration(f,a,24);}
  if(a.karateCounter){a.motionLastEvent=a.activeEnd;}
  if(a.karateKi)a.motionLastEvent=18;
 },
 action(f,i){const a=f.attack,t=f.timer;
  if(a.karateRush){f.buffer=null;const press=!!i.special&&!a.lastSpecial;a.lastSpecial=!!i.special;f.face=a.originFace;f.vx=moveToward(f.vx,0,.6);
   if(a.stage===1&&t>=13&&t<=19&&press){a.stage=2;a.pose=7;a.activeFrames.push(CombatData.window(20,22,'front',{pose:7,damage:3,fixedKnockback:12}));a.activeEnd=22;a.motionLastEvent=22;karatekaDuration(f,a,36);}
   if(a.stage===2&&t>=25&&t<=31&&press){a.stage=3;a.pose=44;a.activeFrames.push(CombatData.window(32,35,'front',{pose:44,damage:8,fixedKnockback:0,baseKnockback:4,knockbackGrowth:.07}));a.activeEnd=35;a.motionLastEvent=35;karatekaDuration(f,a,45);}
   if([8,20,32].includes(t)&&a.stage>=1+(t-8)/12){f.vx=a.originFace*2.5;}
   if(t>=8&&t<=10)a.pose=6;else if(t>=20&&t<=22&&a.stage>=2)a.pose=7;else if(t>=32&&a.stage===3)a.pose=44;else a.pose=40;
  }
  if(a.karateStep){f.buffer=null;const press=!!i.special&&!a.lastSpecial;a.lastSpecial=!!i.special;f.face=a.originFace;f.vx=t<=8?-a.originFace*3.3:moveToward(f.vx,0,.9);if(a.originGrounded&&f.grounded){const p=platforms.find(p=>Math.abs(p.y-f.y)<3&&f.x>=p.x&&f.x<=p.x+p.w);if(p)f.vx=clamp(f.vx,p.x+3-f.x,p.x+p.w-3-f.x);}if(t>=12&&t<=18&&press){attack(f,'stepPunch');return;}}
  if(a.karateCounter){if(t===a.startupFrames)f.vx=a.originFace*4.5;else if(t>a.activeEnd)f.vx=moveToward(f.vx,0,1);}
  if(a.karateKi&&t===18&&!a.activated){a.activated=true;f.karateKiTime=240;f.karateKiCooldown=600;karatekaApply(f);ring(f.x,f.y-40,'#fff061',100);}
  if(a.karateLeap){f.buffer=null;f.fastFall=false;if(t<8){f.vx*=.6;f.vy=0;return;}if(a.launchAt==null&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);a.activeFrames=[];karatekaDuration(f,a,t+110);}else karatekaLaunch(f,a,t,i);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)karatekaLaunch(f,a,t,{x:Math.sign(720-f.x)});return;}
   const dt=t-a.launchAt;a.gravityMultiplier=dt<8?0:.75;if(dt<8&&!a.kickUsed)f.vy=-12;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*6,.35);
   if(dt>=4&&dt<=26&&!a.kickUsed){const p=platforms.find(p=>p.main),near=Math.min(Math.abs(f.x-p.x),Math.abs(f.x-p.x-p.w))<48&&f.y>p.y-45;if(near)karatekaKick(f,a,t,Math.sign(720-f.x),true);}
  }
 },
 collision(f,i,v){const a=f.attack;if(a?.karateLeap&&!a.ceilingEscaped&&v.oldVy<-1&&f.vy===0&&!f.grounded){a.ceilingEscaped=true;NewcomerCore.escape(f,a);a.launchAt=null;a.activeFrames=[];karatekaDuration(f,a,f.timer+110);}},
 onHit(f,o,hit){const a=f.attack;if(a?.karateLeap&&!a.kickUsed)karatekaKick(f,a,f.timer,Math.sign(f.x-o.x)||-f.face,false);},
 boxes(f,a,w){const s=w.shape,h=44,reach=({jab:56,jab2:60,jab3:64,heavy:72,low:68,dashAttack:68,smash:80,fair:74,bair:68,stepCounter:76,stepPunch:64,dragon:a.stage===3?72:62})[a.type]??66,p=s==='up'?[0,-25,0,-112]:s==='down'?[0,-30,8,18]:s==='back'?[0,-h,-reach,-h]:s==='low'?[0,-15,reach,-15]:s==='spin'?[-44,-h,44,-h]:[0,-h,reach,-h];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='spin'?26:18,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,11,22,32,36,41].includes(karatekaPose(f));return[{part:'head',x:f.x,y:f.y-(low?40:81),r:17},{part:'torso',x:f.x,y:f.y-(low?23:46),r:21},{part:'legs',x:f.x,y:f.y-12,r:15}];},
 cpu(f,o,i,clear){const a=f.attack;if(a?.karateRush){i.special=f.timer===15||f.timer===27;i.specialHeld=i.special;}if(a?.karateStep){i.special=f.timer===14;i.specialHeld=i.special;}if(a?.karateLeap){i.x=Math.sign(720-f.x);i.y=-1;return;}if(!a&&f.grounded&&Math.abs(o.x-f.x)<180&&!(f.karateKiCooldown>0)&&frame%71===f.id){clear();i.x=0;i.y=1;i.special=true;}}
});
function karatekaPose(f){if(f.attack){const a=f.attack;if(a.special)return a.pose;return CombatData.sample(a,f.timer).pose;}if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}

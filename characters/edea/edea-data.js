'use strict';
const EdeaMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'};
 const a=NewcomerCore.moves(['横斬り','逆横斬り','突き','薙ぎ払い','浮かせ斬り','足払い','滑り込み斬り','ハックアンドスラッシュ','クレセントムーン','スベルフェンサー','横薙ぎ','空中突き','後方薙ぎ','斜め上薙ぎ','槍突き落とし'],{
 dragon:m('ブレイブラッシュ',9,[w(9,12,'front',{pose:40})],14,0,{...opt,edeaBrave:true,tether:true,pose:40,damage:7,reach:140}),
 dash:m('クレセントムーンボルト',12,[w(19,28,'spin',{pose:41,damage:11})],22,0,{...opt,edeaVault:true,tether:true,pose:41,damage:11,gravityMultiplier:0,airControlMultiplier:0}),
 rise:m('ヴァルキリージャンプ',10,[w(10,18,'up',{pose:42,damage:7})],47,16,{...opt,edeaLeap:true,pose:42,damage:7,gravityMultiplier:0,airControlMultiplier:0,helpless:true,ledgeGrabStart:13}),
 gale:m('デフォルト',8,[],40,0,{...opt,edeaDefault:true,tether:true,pose:43,damage:0,armor:0}),
 airDrop:m('空中デフォルト',8,[],40,14,{...opt,edeaDefault:true,tether:true,aerial:true,pose:43,damage:0})
 },'sword',142),p={jab:6,jab2:7,jab3:9,heavy:49,up:8,low:11,dashAttack:15,smash:12,upsmash:13,downsmash:46,air:10,fair:44,bair:14,uair:45,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:8,downThrow:16};
 for(const[k,n]of Object.entries(p)){a[k].pose=n;for(const e of a[k].activeFrames)e.pose=n;}a.grab.newcomerHit=false;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function edeaGate(){return true;}
function edeaDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
const EdeaRules=NewcomerCore.create('edea',EdeaMoves,{
 reset(){for(const f of fighters)if(f.characterId==='edea')Object.assign(f,{edeaBP:0});},
 status(f){if(f.respawn)f.edeaBP=0;},
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));
  if(a.edeaBrave){a.bp=clamp(f.edeaBP||0,0,3);f.edeaBP=0;a.count=1+a.bp;a.activeFrames=Array.from({length:a.count},(_,n)=>CombatData.window(9+n*10,12+n*10,'front',{pose:n%2?7:40,damage:n===a.count-1?7:3,...(n===a.count-1?{}:{fixedKnockback:12,baseKnockback:1,knockbackGrowth:.015})}));a.activeStart=9;a.activeEnd=12+a.bp*10;edeaDuration(f,a,a.activeEnd+14);a.motionLastEvent=a.activeEnd;}
  if(a.edeaVault){a.pivotX=f.x+f.face*74;a.pivotY=f.y;a.lastX=f.x;a.lastY=f.y;a.motionLastEvent=28;}
  if(a.edeaDefault){a.motionLastEvent=40;edeaDuration(f,a,52);}
 },
 action(f,i){const a=f.attack,t=f.timer;
  if(a.edeaBrave){const stage=Math.min(a.bp,Math.max(0,Math.floor((t-9)/10)));a.pose=stage%2?7:40;f.vx=t>=9&&t<=a.activeEnd?a.originFace*1.4:moveToward(f.vx,0,.8);}
  if(a.edeaDefault){f.vx=moveToward(f.vx,0,.9);if(t===40&&!a.banked){a.banked=true;f.edeaBP=Math.min(3,(f.edeaBP||0)+1);}if(t>=12&&t<40&&!i.specialHeld&&!i.special&&!a.released){a.released=true;edeaDuration(f,a,t+12);a.motionLastEvent=t;}if(t<40&&!a.released){a.armor=0; /* Damage reduction is explicit in root incoming hook, never invulnerability. */}}
  if(a.edeaVault){f.fastFall=false;if(t<12){f.vx*=.6;f.vy=0;return;}if(t===12){f.grounded=false;a.vaultStart=t;}
   const u=clamp((t-11)/22,0,1),angle=Math.PI*(1-u),x=a.pivotX+Math.cos(angle)*74*a.originFace,y=a.pivotY-Math.sin(angle)*84;
   if(t<=34){f.vx=clamp(x-f.x,-12,12);f.vy=clamp(y-f.y,-14,14);a.pose=41;}else{a.gravityMultiplier=.8;f.vx=moveToward(f.vx,i.x*3,.3);a.pose=5;}}
  if(a.edeaLeap){f.fastFall=false;if(t<10){f.vx*=.65;f.vy=0;return;}if(!a.launchAt&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);edeaDuration(f,a,t+110);}else{a.launchAt=t;f.grounded=false;f.recovered=true;f.vy=-16;f.vx=clamp(i.x,-1,1)*6;a.activeFrames=[CombatData.window(t,t+8,'up',{pose:42,damage:7})];edeaDuration(f,a,t+48);}}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);return;}const dt=t-a.launchAt;if(dt<14){a.gravityMultiplier=0;f.vy=-14+dt*.25;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*6,.35);}else if(dt<23){a.gravityMultiplier=0;f.vy=-.5;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*5,.35);}else{a.gravityMultiplier=.9;a.pose=51;}}
 },
 boxes(f,a,w){const s=w.shape,reach=({jab:101,jab2:106,jab3:116,heavy:112,dashAttack:110,smash:137,fair:118,bair:110})[a.type]??112,p=s==='up'?[0,-32,0,-114]:s==='down'?[0,-32,5,35]:s==='back'?[0,-44,-reach,-44]:s==='low'?[0,-13,reach,-13]:s==='spin'?[-54,-44,54,-44]:[0,-44,reach,-44];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='up'?27:s==='spin'?25:18,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,11,22,32,36].includes(edeaPose(f));return[{part:'head',x:f.x,y:f.y-(low?38:78),r:14},{part:'torso',x:f.x,y:f.y-(low?23:46),r:18},{part:'legs',x:f.x,y:f.y-12,r:13}];},
 cpu(f,o,i,clear){if(f.attack?.edeaLeap){i.x=Math.sign(720-f.x);return;}if(f.attack?.edeaDefault){i.specialHeld=true;return;}if(!f.attack&&f.grounded){const d=Math.abs(o.x-f.x);if((f.edeaBP||0)<3&&d>170&&frame%79===f.id){clear();i.x=0;i.y=1;i.special=true;i.specialHeld=true;}else if((f.edeaBP||0)>0&&d<135&&frame%31===f.id){clear();i.x=i.y=0;i.special=true;}}}
});
function edeaDefaultReduction(f){return f.attack?.edeaDefault&&f.timer>=8&&f.timer<40&&!f.attack.released ? .45 : 1;}
function edeaPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return [1,52,53,24][Math.floor(frame/6)%4];if(f.state==='run')return [2,54,55,29][Math.floor(frame/3)%4];if(f.recovered&&!f.grounded&&f.state==='fall')return 51;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
MoveMotion.define('edea',{heavy:{windup:3,strike:[49,50],recovery:0},fair:{windup:34,strike:[44,6],recovery:5}});

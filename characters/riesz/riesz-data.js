'use strict';
const RieszMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'staff'};
 const a=NewcomerCore.moves(['突き','柄打ち','横薙ぎ','長槍突き','突き上げ','足払い','低い突進','真空波','ライトランス','百花繚乱','回転薙ぎ','二段突き','かかと蹴りと柄打ち','上薙ぎ','フライングスピア'],{
 dragon:m('旋風槍',14,[],22,0,{...opt,rieszVortex:true,pose:40,damage:3}),
 dash:m('マルドゥーク召喚',22,[],18,0,{...opt,rieszBird:true,pose:41,damage:12}),
 rise:m('メテオラッシュ',10,[w(10,18,'up',{pose:42,damage:7})],42,16,{...opt,rieszLeap:true,pose:42,damage:7,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:12}),
 gale:m('パワーアップ',24,[],12,0,{...opt,rieszPower:true,pose:43,damage:0}),
 airDrop:m('空中パワーアップ',24,[],12,12,{...opt,rieszPower:true,aerial:true,pose:43,damage:0})
 },'staff',155),p={jab:6,jab2:7,jab3:9,heavy:49,up:8,low:11,dashAttack:15,smash:12,upsmash:13,downsmash:46,air:10,fair:44,bair:14,uair:45,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:14,upThrow:8,downThrow:16};
 // Heavy and fair use distinct complete-pose sequences rather than recolors.
 for(const[k,n]of Object.entries(p)){a[k].pose=n;for(const e of a[k].activeFrames)e.pose=n;}a.grab.newcomerHit=false;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function rieszGate(f,type){return !(type==='dragon'&&(f.rieszWindCooldown>0||RieszRules.objects.some(q=>q.owner===f.id&&q.kind==='vortex'&&!q.dead))||type==='dash'&&RieszRules.objects.some(q=>q.owner===f.id&&q.kind==='bird'&&!q.dead)||['gale','airDrop'].includes(type)&&(f.rieszPowerTime>0||f.rieszPowerCooldown>0));}
function rieszDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
const RieszRules=NewcomerCore.create('riesz',RieszMoves,{
 reset(){for(const f of fighters)if(f.characterId==='riesz')Object.assign(f,{rieszPowerTime:0,rieszPowerCooldown:0,rieszWindCooldown:0});},
 status(f){if(!f.hitlag)for(const k of['rieszPowerTime','rieszPowerCooldown','rieszWindCooldown'])f[k]=f.respawn?0:Math.max(0,(f[k]||0)-1);},
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));if(f.rieszPowerTime>0&&!a.rieszPower){a.damage*=1.12;a.baseKnockback*=1.07;}a.motionLastEvent=a.rieszBird?22:a.rieszVortex?14:a.rieszPower?24:a.activeEnd;},
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.rieszVortex&&t===14&&!a.fired){a.fired=true;f.rieszWindCooldown=70;r.spawn(f,{kind:'vortex',x:f.x+f.face*78,y:f.y-35,vx:f.face*1.7,vy:0,damage:2.5,radius:32,life:52});}
  if(a.rieszBird){f.vx=moveToward(f.vx,0,.9);if(t===22&&!a.fired){a.fired=true;r.spawn(f,{kind:'bird',x:f.x+f.face*35,y:f.y-170,vx:f.face*7.5,vy:5.2,damage:12,radius:28,life:56});}}
  if(a.rieszPower&&t===24&&!a.powered){a.powered=true;f.rieszPowerTime=360;f.rieszPowerCooldown=720;}
  if(a.rieszLeap){f.fastFall=false;if(t<10){f.vx*=.65;f.vy=0;return;}if(!a.launchAt&&!a.escapeSide){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);rieszDuration(f,a,t+110);}else{a.launchAt=t;f.grounded=false;f.recovered=true;f.vy=-17;f.vx=clamp(i.x,-1,1)*6;a.activeFrames=[CombatData.window(t,t+9,'up',{pose:42,damage:7})];rieszDuration(f,a,t+48);}}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);return;}const dt=t-a.launchAt;if(dt<16){a.gravityMultiplier=0;f.vy=-15+dt*.4;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*6,.45);}else{a.gravityMultiplier=.8;f.vx=moveToward(f.vx,clamp(i.x,-1,1)*4,.2);a.pose=51;}}
 },
 projectile(q,f){if(f.respawn||q.age>=q.life){q.dead=true;return true;}q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;q.y+=q.vy;
  if(q.kind==='vortex'){if(![1,15,29,43].includes(q.age))return true;q.hits.clear();q.damage=q.age===43?6:2.5;const b={x1:q.x,y1:q.y+20,x2:q.x,y2:q.y-32,radius:30};for(const o of BattlePlayers.targets(f))rieszObjectHit(q,f,o,b,q.age===43);return true;}
  if(q.kind==='bird'){const p=platforms.find(p=>q.x>=p.x&&q.x<=p.x+p.w&&q.y>=p.y-24);if(p){q.vy=-3.8;q.y=p.y-25;}const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:28};for(const o of BattlePlayers.targets(f))rieszObjectHit(q,f,o,b,true);return true;}return true;
 },
 boxes(f,a,w){const s=w.shape,reach=({jab:108,jab2:90,jab3:114,heavy:122,dashAttack:125,smash:147,fair:126,bair:105})[a.type]??113,p=s==='up'?[0,-32,0,-115]:s==='down'?[0,-32,6,34]:s==='back'?[0,-44,-reach,-44]:s==='low'?[0,-14,reach,-14]:s==='spin'?[-58,-45,58,-45]:[0,-44,reach,-44];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='up'?27:s==='spin'?24:18,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,11,22,32,36].includes(rieszPose(f));return[{part:'head',x:f.x,y:f.y-(low?38:78),r:14},{part:'torso',x:f.x,y:f.y-(low?23:46),r:18},{part:'legs',x:f.x,y:f.y-12,r:13}];},
 cpu(f,o,i,clear){if(f.attack?.rieszLeap){i.x=Math.sign(720-f.x);return;}if(!f.attack&&f.grounded){const d=Math.abs(o.x-f.x);if(d>170&&d<420&&rieszGate(f,'dash')&&frame%41===f.id){clear();i.x=Math.sign(o.x-f.x);i.y=0;i.special=true;}else if(d>120&&d<280&&rieszGate(f,'dragon')&&frame%37===f.id){clear();i.x=i.y=0;i.special=true;}else if(!f.rieszPowerTime&&!f.rieszPowerCooldown&&frame%73===f.id){clear();i.x=0;i.y=1;i.special=true;}}}
});
function rieszObjectHit(q,f,o,b,finish){if(q.hits.has(o.id)||o.respawn)return false;const protection=CombatSystem.protection(o);if(protection.intangible||protection.invincible)return false;const touch=CombatSystem.contact(b,o),mode=o.mode==='Hitlag'?o.frozen?.mode:o.mode,shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(mode)&&CombatSystem.shieldCovers(o,b);if(!touch&&!shield)return false;q.hits.add(o.id);CombatSystem.hit(f,o,{...RieszMoves.dragon,type:'riesz'+q.kind,sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,baseKnockback:finish?3.7:1,knockbackGrowth:finish?.067:.015,angle:finish?-.7:-1.3,...(!finish?{fixedKnockback:12}:{})},b,touch);return true;}
function rieszPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return [1,52,53,24][Math.floor(frame/6)%4];if(f.state==='run')return [2,54,55,29][Math.floor(frame/3)%4];if(f.recovered&&!f.grounded&&f.state==='fall')return 51;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
MoveMotion.define('riesz',{heavy:{windup:3,strike:[49,50],recovery:0},fair:{windup:34,strike:[44,6],recovery:5}});

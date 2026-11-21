'use strict';
const LidMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'punch'};
 const a=NewcomerCore.moves(['スパナ振り','工具連打','ハンマー返し','メカハンマー','スパナ打ち上げ','足払い','ショルダータックル','メカハンマー叩きつけ','ハンマー打ち上げ','地響き','空中回転打撃','空中ハンマー','振り返りキック','空中打ち上げ','急降下ハンマー'],{
 dragon:m('メカハンマー',12,[],120,0,{...opt,lidHammer:true,pose:37,damage:12,reach:150}),
 dash:m('メカボキック',10,[],62,0,{...opt,lidMechabo:true,pose:40,damage:8,projectile:true}),
 rise:m('メカボエスケプ',8,[],72,15,{...opt,lidEscape:true,pose:42,damage:0,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:18}),
 gale:m('ストンガ',18,[],43,0,{...opt,lidStone:true,pose:45,damage:12,soundFamily:'magic',projectile:true}),
 airDrop:m('ストンガ',18,[],43,12,{...opt,lidStone:true,pose:45,damage:12,soundFamily:'magic',projectile:true,aerial:true})
 },'punch',115);
 const poses={jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30,grab:31,pummel:32,forwardThrow:33,backThrow:34,upThrow:35,downThrow:36,ledge:19,getupAttack:21};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const win of a[k].activeFrames)win.pose=n;}
 a.downsmash.activeFrames=a.downsmash.activeFrames.slice(0,1);a.downsmash.activeFrames[0].shape='shockwave';a.downsmash.soundFamily='magic';
 a.grab.newcomerHit=false;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:8,accelerationPose:v.pose,recoveryPose:v.aerial?11:0,lean:0,lunge:0,impactScale:1};
 return a;
})();
function lidGate(f,type){return type!=='dash'||!LidRules.objects.some(q=>q.owner===f.id&&q.kind==='bot'&&!q.dead);}
function lidLand(){return false;}
function lidBot(f){return LidRules.objects.find(q=>q.owner===f.id&&q.kind==='bot'&&!q.dead);}
function lidWindows(a,t,level){a.level=level;a.pose=38;a.activeFrames=[CombatData.window(t+5,t+11,'front',{pose:38,index:0,damage:12+level*4,meleeCoverage:true})];a.activeStart=t+5;a.activeEnd=t+11;a.motionLastEvent=t+11;a.motionCommitEnd=t+11;}
const LidRules=NewcomerCore.create('lid',LidMoves,{
 reset(){for(const f of fighters)if(f.characterId==='lid')f.lidInvent=0;},
 status(f){if(f.respawn)f.lidInvent=0;},
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));a.motionLastEvent=a.motionCommitEnd=a.lidHammer?110:a.lidMechabo?48:a.lidStone?25:0;},
 action(f,i,r){const a=f.attack,t=f.timer,held=!!(i.specialHeld||i.special);
  if(a.lidHammer){f.vx*=.6;if(!a.release){a.pose=37;if(t>=12){if(held&&t<100){if(t%8===0)f.lidInvent=Math.min(100,(f.lidInvent||0)+5);}else{a.release=t;lidWindows(a,t,Math.min(2,Math.floor((f.lidInvent||0)/35)));f.lidInvent=0;sound('swing',1,f);}}}else a.pose=t<a.release+5?37:38;}
  if(a.lidMechabo){a.motionLastEvent=48;f.vx*=.7;a.pose=40;if(t===10)r.spawn(f,{kind:'bot',x:f.x+f.face*42,y:f.y-28,vx:f.face*5,vy:0,life:120,damage:7,radius:21,phase:'out',steer:0});const q=lidBot(f);if(q){q.steer=clamp(i.y||0,-1,1);if(t>=16&&(!held||t>=48)&&q.phase==='out'){q.phase='kick';q.phaseAge=0;q.hits.clear();q.damage=11;q.vx=q.face*10;sound('swing',.8,f);}if(q.phase!=='out')a.motionLastEvent=22;}}
  if(a.lidEscape){f.fastFall=false;if(t<8){f.vx*=.5;f.vy=0;}else{if(!a.started){a.started=true;a.flyStart=8;f.grounded=false;f.recovered=true;const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y>p.y+100){NewcomerCore.escape(f,a);const end=a.escapeLimit+80,d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}sound('jump',1,f);}if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)a.flyStart=t;return;}const flight=t-a.flyStart+8;if(!a.exit&&flight>17&&(i.jump||i.special||flight>=49)){a.exit=t;sound('jump',.7,f);}if(a.exit){a.pose=44;a.gravityMultiplier=1;if(t===a.exit){f.vy=-5;f.vx=clamp(i.x||0,-1,1)*7;}}else{a.pose=flight<18?42:43;f.vx=lerp(f.vx,(i.x||0)*7,.18);f.vy=flight<18?-13:flight<30?-6.8:-2.8;}}}
  if(a.lidStone){a.pose=t<18?45:46;if(t===18){const p=platforms.find(p=>p.main),x=f.x+f.face*105;
   if(f.grounded)r.spawn(f,{kind:'stone',x,y:f.y,warning:12,life:35,radius:29,damage:12,level:0});
   else r.spawn(f,{kind:'ore',x,y:f.y-30,vx:f.face*2,vy:3,life:95,radius:16,damage:7});
   const q=lidBot(f);if(q&&q.x>p.x&&q.x<p.x+p.w)r.spawn(f,{kind:'stone',x:q.x,y:p.y,warning:24,life:47,radius:24,damage:7,level:1});sound('magic',.8,f);}}
  if(a.special)a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose,phase:'follow-through'}];
 },
 onHit(f,o,a){if(!a.lidInventAwarded){f.lidInvent=Math.min(100,(f.lidInvent||0)+8);a.lidInventAwarded=true;}},
 projectile(q,f,o,r){if(f.respawn||q.age>=q.life){q.dead=true;return true;}q.previousX=q.x;q.previousY=q.y;
  if(q.kind==='bot'){q.phaseAge=(q.phaseAge||0)+1;
   if(q.phase==='out'){q.x+=q.vx;q.y=clamp(q.y+q.steer*2.6,f.y-135,f.y-20);if(q.age>=55){q.phase='kick';q.phaseAge=0;q.hits.clear();q.damage=11;}}
   else if(q.phase==='kick'){q.x+=q.face*10;if(q.phaseAge>9){q.phase='return';q.hits.clear();}}
   else{const dx=f.x-q.x,dy=f.y-30-q.y,d=Math.hypot(dx,dy);if(d<24){q.dead=true;return true;}q.x+=dx/d*11;q.y+=dy/d*11;return true;}
  }else if(q.kind==='ore'){q.x+=q.vx;q.vy+=.35;q.y+=q.vy;const p=platforms.find(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY<=p.y&&q.y>=p.y);if(p){q.dead=true;r.spawn(f,{kind:'stone',x:q.x,y:p.y,warning:8,life:30,radius:28,damage:11});return true;}}
  else if(q.kind==='stone'){if(q.age<q.warning||q.age>q.warning+10)return true;}
  else return true;
  const b=q.kind==='stone'?{x1:q.x,y1:q.y-10,x2:q.x,y2:q.y-105,radius:q.radius}:{x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};
  for(const victim of BattlePlayers.targets(f)){if(q.hits.has(victim.id)||CombatSystem.protection(victim).intangible)continue;const touch=CombatSystem.contact(b,victim),mode=victim.mode==='Hitlag'?victim.frozen?.mode:victim.mode,shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(mode)&&CombatSystem.shieldCovers(victim,b);if(!touch&&!shield)continue;q.hits.add(victim.id);CombatSystem.hit(f,victim,{...LidMoves.dragon,type:'dragon',sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,soundFamily:q.kind==='bot'?'punch':'magic',launchDirection:q.face,angle:q.kind==='stone'?-1.2:-.65,baseKnockback:q.kind==='bot'?3:3.5,knockbackGrowth:.065},b,touch);if(q.kind==='ore')q.dead=true;}
  return true;
 },
 boxes(f,a,w){if(a.lidMechabo||a.lidStone||a.lidEscape)return[];
  const back=w.shape==='back',s=w.shape,reach=a.lidHammer?110+(a.level||0)*22:({jab:65,jab2:82,jab3:105,heavy:112,smash:136,fair:115,bair:100})[a.type]||100;
  const p=s==='up'?[0,-35,12,-145]:s==='down'?[0,-35,14,38]:s==='low'?[0,-17,88,-17]:s==='spin'?[-70,-46,78,-46]:s==='shockwave'?[-93,-12,100,-12]:[0,-43,(back?-1:1)*reach,-43];
  return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='up'?26:s==='shockwave'?25:22,window:w,modifiers:w}];
 },
 cpu(f,o,i){if(f.attack?.lidHammer)i.specialHeld=(f.lidInvent||0)<40&&f.timer<60;if(f.attack?.lidMechabo){i.specialHeld=f.timer<28;i.y=clamp((o.y-f.y)/80,-1,1);}if(f.attack?.lidEscape){i.x=Math.sign(720-f.x);i.special=false;i.jump=f.timer>35&&f.y<platforms.find(p=>p.main).y-50;}}
});
function lidPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.mode==='Pummel')return 32;if(f.ledge)return 10;if(f.mode==='Helpless')return 11;if(f.mode==='JumpSquat')return 9;if(f.state==='walk')return[1,2,3,2][Math.floor(frame/6)%4];if(f.state==='run')return[4,5,6,7][Math.floor(frame/4)%4];return({idle:0,crouch:8,jump:10,double:12,fall:11,land:8,guard:13,dodge:8,hit:14,fly:14,down:15,getup:8,grab:31,caught:14,throw:33})[f.state]??0;}
MoveMotion.define('lid',Object.fromEntries(Object.entries({jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30}).map(([k,n])=>[k,{windup:['smash','upsmash','downsmash'].includes(k)?37:8,strike:[n],recovery:['air','fair','bair','uair','dair'].includes(k)?11:0}])));

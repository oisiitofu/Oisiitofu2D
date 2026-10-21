'use strict';
// Rena fights with palms/knuckles. Symbology spends MP, never locks normal attacks.
const RenaMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'magic',tether:true};
 const a=NewcomerCore.moves(['パームストライク','バックフィスト','スピニングキック','サイドキック','ライジングパーム','スイープキック','スライディングパーム','双掌撃','レーザービーム','スターフレア','スピニングキック・空中','ダブルキック','バックヒール','サマーソルトキック','ヒールドロップ'],{
  dragon:m('ライトクロス',10,[],65,0,{...opt,renaCross:true,pose:40,damage:8,projectile:true,gravityMultiplier:.7}),
  dash:m('グラビティクラッシュ',16,[],30,0,{...opt,renaGravity:true,pose:42,damage:12,projectile:true,gravityMultiplier:.6}),
  rise:m('トラクタービーム',9,[w(10,29,'up',{pose:48,damage:7,index:0,angle:-1.42})],49,0,{...opt,tether:false,renaTractor:true,pose:48,damage:7,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:12}),
  gale:m('フェアリーライト',26,[],25,0,{...opt,renaHeal:true,pose:43,damage:0,gravityMultiplier:.75}),
  airDrop:m('空中フェアリーライト',26,[],25,0,{...opt,renaHeal:true,pose:43,damage:0,aerial:true,gravityMultiplier:.75})
 },'punch',94),p={jab:6,jab2:7,jab3:9,heavy:41,up:8,low:11,dashAttack:15,smash:12,upsmash:13,downsmash:46,air:10,fair:44,bair:14,uair:45,dair:16,grab:17,pummel:18,ledge:37,getupAttack:37,forwardThrow:19,backThrow:49,upThrow:8,downThrow:11};
 for(const[k,n]of Object.entries(p)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}a.grab.newcomerHit=false;a.downsmash.activeFrames[1].pose=46;
 // Laser and star flare are deliberately non-curved magic, a single shared hit ID per window.
 a.upsmash.soundFamily=a.downsmash.soundFamily='magic';a.upsmash.authoredEffectCoverage=true;a.rise.authoredEffectCoverage=true;
 for(const v of Object.values(a))v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};return a;
})();
function renaMP(f){return clamp(f.renaMP??100,0,100);}
function renaGate(f,type){if(type==='dragon')return renaMP(f)>=10&&!RenaRules.objects.some(q=>q.owner===f.id&&q.kind==='cross'&&!q.dead);if(type==='dash')return renaMP(f)>=20&&!RenaRules.objects.some(q=>q.owner===f.id&&q.kind==='gravity'&&!q.dead);if(['gale','airDrop'].includes(type))return renaMP(f)>=20;return true;}
function renaDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function renaLand(f){const a=f.attack;if(!(a?.renaCross&&!a.fired||a?.renaGravity&&f.timer<16||a?.renaHeal&&!a.healed))return false;Object.assign(f,{mode:'GroundSpecial',state:PlayerStates.visual.GroundSpecial,airJumps:f.character.airJumpCount,jumps:0,airDodged:false,ledgeGrabs:0,recovered:false,helpless:false,fastFall:false,gravityOff:false,specialLandingLag:0,landingLag:0});return true;}
const RenaRules=NewcomerCore.create('rena',RenaMoves,{
 reset(){for(const f of fighters)if(f.characterId==='rena')Object.assign(f,{renaMP:100,renaBuff:0,renaLastDamage:f.damage});},
 status(f){if(f.respawn){f.renaMP=100;f.renaBuff=0;}else{f.renaMP=clamp(renaMP(f)+(f.attack?.special ? .045 : .14),0,100);if(f.renaBuff>0)f.renaBuff--;}},
 prepare(f,a){a.activeFrames=a.activeFrames.map(v=>({...v}));if(a.renaCross){f.renaMP=renaMP(f)-10;a.motionCommitEnd=a.motionLastEvent=48;}if(a.renaGravity){f.renaMP=renaMP(f)-20;a.motionCommitEnd=a.motionLastEvent=16;a.placeX=f.x+a.originFace*clamp(Math.abs(BattlePlayers.target(f)?.x-f.x||180),110,260);a.placeY=f.y-42;}
  if(a.renaTractor){a.powered=renaMP(f)>=20;if(a.powered)f.renaMP-=20;a.motionLastEvent=29;}
  if(a.renaHeal){f.renaMP=renaMP(f)-20;a.motionCommitEnd=a.motionLastEvent=26;}
  if(!a.special&&f.renaBuff>0){a.damage*=1.12;for(const w of a.activeFrames)if(w.damage!==undefined)w.damage*=1.12;}
 },
 action(f,i,r){const a=f.attack,t=f.timer,held=!!(i.special||i.specialHeld);
  if(a.renaCross){f.vx*=.65;if(!a.releaseAt&&t>=10&&(!held||t>=42)){a.releaseAt=t;a.charged=t>=25&&renaMP(f)>=10;if(a.charged)f.renaMP-=10;a.pose=a.charged?50:40;a.fireAt=t+5;renaDuration(f,a,a.fireAt+18);}if(a.releaseAt)a.pose=a.charged?50:40;if(!a.fired&&a.fireAt&&t>=a.fireAt){a.fired=true;for(const [k,dist]of(a.charged?[75,150,225]:[105]).entries())r.spawn(f,{kind:'cross',x:f.x+f.face*dist,y:f.y-48,vx:0,vy:0,life:18,radius:a.charged?24:28,damage:a.charged?6:9,delay:k*3,sourceType:'dragon',charged:a.charged});}}
  if(a.renaGravity){f.vx*=.6;if(t<16)f.vy*=.8;if(!a.placed&&t>=16){a.placed=true;r.spawn(f,{kind:'gravity',x:a.placeX,y:a.placeY,vx:0,vy:0,life:43,radius:68,damage:13,sourceType:'dash'});}}
  if(a.renaTractor){f.fastFall=false;if(t<9){f.vx*=.4;f.vy=0;return;}if(!a.started){a.started=true;a.beamX=f.x;a.beamY=f.y;a.launchAt=t;f.grounded=false;f.recovered=true;const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);renaDuration(f,a,t+110);}r.spawn(f,{kind:'tractor',x:f.x,y:f.y-25,vx:0,vy:0,life:31,damage:0});}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide){a.launchAt=t;renaDuration(f,a,t+42);}return;}const dt=t-a.launchAt;if(dt<22){a.pose=48;f.vx=clamp((f.vx||0)*.8+i.x*.8,-6.4,6.4);f.vy=(a.powered?-17.5:-13.5)+dt*.46;}else if(dt<29){a.pose=51;f.vx=clamp(f.vx+i.x*.5,-6.4,6.4);f.vy=-3+(dt-22)*.7;}else{a.pose=35;a.gravityMultiplier=1;}}
  if(a.renaHeal){f.vx*=.65;if(t>=26&&!a.healed){a.healed=true;f.damage=Math.max(0,f.damage-6);f.renaBuff=360;a.pose=52;r.spawn(f,{kind:'heal',x:f.x,y:f.y-45,vx:0,vy:0,life:28,damage:0});}}
 },
 onHit(f,o,a){if(!a.special&&!a.projectile)f.renaMP=clamp(renaMP(f)+Math.min(5,(a.damage||4)*.35),0,100);},
 projectile(q,f){if(f.respawn||q.age>=q.life){q.dead=true;return true;}if(q.kind==='tractor'||q.kind==='heal')return true;if(q.kind==='cross'&&q.age<q.delay+2)return true;
  if(q.kind==='gravity'&&q.age<22){for(const o of BattlePlayers.targets(f)){if(o.hitlag||o.hitstun||o.pendingLaunch||o.respawn||o.ledge||['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode))continue;const dx=q.x-o.x,dy=q.y-(o.y-40),dist=Math.hypot(dx,dy);if(dist<q.radius+35&&dist>10){o.x+=clamp(dx*.018,-1.4,1.4);if(!o.grounded)o.y+=clamp(dy*.012,-.9,.9);}}return true;}
  const b={x1:q.x,y1:q.kind==='gravity'?q.y-50:q.y-22,x2:q.x,y2:q.kind==='gravity'?q.y+45:q.y+22,radius:q.kind==='gravity'?q.radius:q.radius};for(const o of BattlePlayers.targets(f)){if(q.hits.has(o.id)||CombatSystem.protection(o).intangible)continue;const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(touch||shield){q.hits.add(o.id);CombatSystem.hit(f,o,{...RenaMoves.dragon,type:q.sourceType,sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,launchDirection:q.face,angle:q.kind==='gravity'?-1.5:-.7,baseKnockback:q.kind==='gravity'?4.6:3.5,knockbackGrowth:.075,staleMultiplier:q.stale},b,touch);}}return true;
 },
 boxes(f,a,w){if(a.renaCross||a.renaHeal||a.renaGravity)return[];if(a.type==='upsmash')return[-40,0,40].map(dx=>({x1:f.x+dx,y1:f.y-35,x2:f.x+dx,y2:f.y-149,radius:23,window:w,modifiers:w}));const s=w.shape,reach=({jab:61,jab2:72,jab3:91,heavy:99,low:86,dashAttack:100,smash:118,fair:105,bair:102})[a.type]||90,p=s==='up'?[0,-29,0,a.type==='up'?-110:-132]:s==='down'?[0,-34,16,45]:s==='back'?[0,-42,-reach,-42]:s==='low'?[0,-15,reach,-15]:s==='spin'?[-57,-44,57,-44]:[0,-44,reach,-44];return[{x1:f.x+p[0]*f.face,y1:f.y+p[1],x2:f.x+p[2]*f.face,y2:f.y+p[3],radius:s==='up'?28:s==='spin'?25:18,window:w,modifiers:w}];},
 hurtboxes(f){const low=[3,11,15,22,32,36,46].includes(renaPose(f));return[{part:'head',x:f.x,y:f.y-(low?37:77),r:14},{part:'torso',x:f.x,y:f.y-(low?22:46),r:17},{part:'legs',x:f.x,y:f.y-12,r:13}];},
 cpu(f,o,i,clear){if(f.attack?.renaCross){i.specialHeld=f.timer<29;return;}if(!f.attack&&f.grounded&&f.damage>35&&renaMP(f)>=40&&Math.abs(o.x-f.x)>250){clear();i.x=0;i.y=1;i.special=true;}if(f.attack?.renaTractor)i.x=Math.sign(720-f.x);}
});
function renaPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return[1,24,25,26][Math.floor(frame/6)%4];if(f.state==='run')return[2,28,29,27][Math.floor(frame/3)%4];if(f.recovered&&!f.grounded)return 35;return({idle:0,crouch:3,jump:33,double:34,fall:5,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,grab:17,caught:21,throw:19})[f.state]??0;}
MoveMotion.define('rena',{jab:{windup:0,strike:[6],recovery:0},jab2:{windup:6,strike:[7],recovery:0},jab3:{windup:7,strike:[9],recovery:0},heavy:{windup:3,strike:[41],recovery:0},up:{windup:3,strike:[8],recovery:0},low:{windup:3,strike:[11],recovery:3},dashAttack:{windup:27,strike:[15],recovery:31},smash:{windup:3,strike:[12],recovery:0},upsmash:{windup:32,strike:[13],recovery:36},downsmash:{windup:3,strike:[46],recovery:3},air:{windup:34,strike:[10],recovery:5},fair:{windup:34,strike:[44],recovery:5},bair:{windup:5,strike:[14],recovery:5},uair:{windup:34,strike:[45],recovery:5},dair:{windup:5,strike:[16],recovery:5}});


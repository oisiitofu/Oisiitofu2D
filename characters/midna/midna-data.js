'use strict';
// All timelines are inclusive 60 Hz frames; hand sprites and collisions share geometry.
const MidnaMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const hand=(name,s,e,damage,reach,pose=6,shape='front',extra={})=>m(name,s,[w(s,e,shape)],11,0,{damage,reach,pose,midnaHand:true,soundFamily:'claw',...extra});
 const moves={
  jab:hand('影の手・ひっぱたき',5,6,3,115,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:hand('影の手・返し払い',4,5,4,120,7,'back',{cancel:{start:6,end:15,input:'jab',next:'jab3'}}),
  jab3:hand('影の魔撃',8,10,8,165,9,'front',{soundFamily:'dark'}),
  heavy:hand('髪の手・横薙ぎ',9,12,10,220),up:hand('髪の手・切り上げ',7,11,8,165,8,'up',{angle:-1.4}),low:hand('影の足払い',7,9,7,160,15,'low'),
  dashAttack:hand('影のショルダータックル',11,14,10,155,15,'front',{impulse:4}),
  smash:hand('影の巨腕',15,18,22,255,9,'front',{chargeFrame:5,chargeMaxFrames:60,baseKnockback:6.3,recoveryFrames:26,totalFrames:44,FAF:45}),
  upsmash:m('影晶昇起',14,[w(14,18,'up')],25,0,{damage:19,reach:200,pose:8,midnaPillar:true,angle:-1.5,chargeFrame:5,chargeMaxFrames:60,soundFamily:'dark'}),
  downsmash:hand('黄昏旋撃',12,16,17,225,10,'spin',{chargeFrame:4,chargeMaxFrames:60,recoveryFrames:25,totalFrames:41,FAF:42}),
  air:m('影の手・空中旋回',6,[w(6,8,'spin',{damage:3,baseKnockback:1.3,knockbackGrowth:.02}),w(16,20,'spin',{damage:7})],12,8,{damage:7,reach:165,pose:10,midnaHand:true,aerial:true,soundFamily:'claw'}),
  fair:hand('斜め爪払い',7,10,10,180,6,'front',{aerial:true,landingLagFrames:10}),bair:hand('背面髪払い',8,11,11,185,7,'back',{aerial:true,landingLagFrames:11}),
  uair:hand('頭上髪払い',6,10,9,180,8,'up',{aerial:true,landingLagFrames:9,angle:-1.5}),
  dair:hand('影の斜降撃',10,14,12,175,11,'down',{aerial:true,landingLagFrames:15,midnaBounce:true,meteorFrame:12,meteorAngle:1.4}),
  dragon:m('影界フィールド',16,[w(16,19,'spin')],23,14,{damage:10,reach:200,pose:13,midnaField:true,chargeFrame:5,chargeButton:'special',chargeMaxFrames:60,fieldRadius:56,fieldGrowth:62,soundFamily:'dark'}),
  dash:m('影髪グラップル',10,[w(10,14,'front',{damage:4,pull:true,baseKnockback:1.5,knockbackGrowth:.02}),w(28,30,'front',{damage:12,baseKnockback:4.8,knockbackGrowth:.075})],18,18,{damage:12,reach:325,pose:12,hairGrapple:true,hookFrame:15,reelEnd:35,releaseMin:19,releaseBoost:9,handOffset:60,handX:5,anchorReach:325,emptyReach:325,feintEnd:6,gravityMultiplier:.4,airControlMultiplier:.15,soundFamily:'chain',animationWindows:[{start:15,end:27,pose:10}],animation:{anticipationEnd:3,anticipationPose:14,accelerationPose:12,followThroughFrames:5,recoveryPose:0,lean:0,lunge:0,impactScale:1}}),
  grappleCancel:m('髪の手・中止',1,[],10,10,{special:true,pose:18,soundFamily:'wind'}),
  grappleRelease:m('髪の手・離脱',1,[],12,16,{special:true,pose:4,gravityMultiplier:1,soundFamily:'wind'}),
  rise:m('黄昏ワープ',22,[w(22,25,'front')],20,24,{damage:10,reach:170,pose:16,midnaWarp:true,aimFrames:[2,12],vanishFrames:[13,19],warpFrame:20,range:345,intangibleFrames:[[13,19]],gravityMultiplier:0,airControlMultiplier:0,helpless:true,ledgeGrabStart:20,soundFamily:'dark',animationWindows:[{start:20,end:25,pose:8}],animation:{anticipationEnd:4,anticipationPose:13,accelerationPose:16,followThroughFrames:4,recoveryPose:5,lean:0,lunge:0,impactScale:1}}),
  gale:m('影の裁腕',19,[w(19,23,'shockwave')],25,0,{damage:17,reach:245,pose:17,shadowCrush:true,chargeFrame:5,chargeButton:'special',chargeMaxFrames:55,soundFamily:'dark'}),
  airCrush:m('影の裁腕・斜降',16,[w(16,72,'down')],14,24,{damage:13,reach:150,pose:11,special:true,midnaHand:true,crushDive:true,diveSpeed:12,airControlMultiplier:.2,gravityMultiplier:0,landingMove:'crushLanding',midnaBounce:true,meteorFrame:18,meteorAngle:1.4,soundFamily:'dark'}),
  crushLanding:m('影晶衝撃',1,[w(1,6,'shockwave')],25,0,{damage:15,reach:255,pose:17,shadowCrush:true,special:true,soundFamily:'dark'}),
  hairBounce:m('髪の手・反動浮遊',1,[],8,15,{pose:4,aerial:true,special:true,verticalImpulse:-5,soundFamily:'wind'})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:'claw'};}
 moves.grab.name='髪の手つかみ';moves.grab.reach=120;moves.grab.midnaHand=true;moves.forwardThrow.name='影髪・前投げ';moves.backThrow.name='影髪・背面投げ';moves.upThrow.name='影髪・上投げ';moves.downThrow.name='影髪・叩きつけ';
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;a.FAF=a.totalFrames+1;if(!a.hairGrapple&&!a.midnaWarp)a.animation={...a.animation,anticipationPose:14,accelerationPose:14,lean:0,lunge:0,impactScale:1};if(!a.helpless&&!a.crushDive){a.landingFlag=[Math.max(2,a.startupFrames-1),a.totalFrames];a.autoCancelWindow=[[1,a.autoCancelEnd],[a.totalFrames,Infinity]];}}
 return moves;
})();
const MidnaRules=(()=>{
 function reset(){for(const f of fighters)if(f.characterId==='midna')f.midnaSideUsed=f.midnaCrushUsed=false;}
 function solid(f,x,y){const p=platforms.find(p=>p.main),c=f.character.ecb;return x+c.radius>p.x&&x-c.radius<p.x+p.w&&y>p.y+1&&y-c.height<p.y+90;}
 // Warp traverses shadows, but an occupied destination is backed out along its last segment.
 function destination(f,a){const d=a.warpDirection,len=Math.hypot(d.x,d.y)||1;for(let n=a.range;n>=0;n-=5){const q={x:a.origin.x+d.x/len*n,y:a.origin.y+d.y/len*n};if(!solid(f,q.x,q.y))return{...q,blocked:n<a.range};}return{...a.origin,blocked:true};}
 function anchor(f,a){const hand={x:f.x+f.face*a.handX,y:f.y-a.handOffset};return platforms.flatMap(p=>[{x:p.x,y:p.y},{x:p.x+p.w,y:p.y}]).filter(p=>(p.x-hand.x)*f.face>=0&&p.y<hand.y+30&&Math.hypot(p.x-hand.x,p.y-hand.y)<=a.anchorReach&&!Array.from({length:24},(_,n)=>EmmaRules.terrain(lerp(hand.x,p.x,(n+1)/25),lerp(hand.y,p.y,(n+1)/25))).some(Boolean)).sort((p,q)=>Math.hypot(p.x-hand.x,p.y-hand.y)-Math.hypot(q.x-hand.x,q.y-hand.y))[0]||null;}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;if(a.hairGrapple){if(!f.grounded)f.midnaSideUsed=true;a.origin={x:f.x,y:f.y};a.targetId=null;a.hook=null;f.vx*=.2;}
  if(a.midnaWarp){a.origin={x:f.x,y:f.y};a.warpDirection={x:0,y:-1};a.target=destination(f,a);f.vx=f.vy=0;}
  if(a.crushDive)f.midnaCrushUsed=true;
 }
 function release(f,i={}){const a=f.attack;if(!a?.hairGrapple||!a.hook)return;const side=Math.sign(i.x)||Math.sign(a.hook.x-f.x)||f.face;attack(f,'grappleRelease');f.grounded=false;f.vx=side*6;f.vy=-a.releaseBoost;f.fastFall=false;f.specialLandingLag=a.landingLagFrames;GameAudio.cue('double-jump',.6,f);}
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.midnaField&&t===a.startupFrames&&!a.eventsDone.has('field')){a.eventsDone.add('field');a.damage*=1+a.charge*.8;a.reach*=1+a.charge;}
  if(a.shadowCrush&&t===a.startupFrames&&!a.eventsDone.has('crush')){a.eventsDone.add('crush');a.damage*=1+a.charge*.4;a.reach*=1+a.charge*.5;}
  if(a.hairGrapple){if(t<=a.feintEnd&&i.guardPressed){f.buffer=null;attack(f,'grappleCancel');return;}
   if(t===a.hookFrame&&a.targetId===null&&!a.originGrounded){a.hook=anchor(f,a);if(a.hook){a.activeFrames=[];a.activeStart=a.activeEnd=null;a.ropeOrigin={x:f.x,y:f.y};GameAudio.cue('chain',.7,f);}}
   if(a.hook&&t>=a.hookFrame&&t<=a.reelEnd){f.grounded=false;f.fastFall=false;a.gravityMultiplier=0;const target={x:a.hook.x-Math.sign(a.hook.x-a.ropeOrigin.x)*(f.character.ecb.radius+4),y:a.hook.y-8},dx=target.x-f.x,dy=target.y-f.y,len=Math.hypot(dx,dy),step=Math.min(9,len),q=NaegiRules.safeStep(f,{x:f.x+dx/(len||1)*step,y:f.y+dy/(len||1)*step});f.vx=q.x-f.x;f.vy=q.y-f.y;if(t>=a.releaseMin&&(i.jump||i.special||i.guardPressed||len<12)){release(f,i);return;}}
   if(t===a.reelEnd+1){if(a.hook){release(f,i);return;}a.gravityMultiplier=1;}
  }
  if(a.midnaWarp){if(t>=a.aimFrames[0]&&t<=a.aimFrames[1]){if(Math.hypot(i.x,i.y)>.3)a.warpDirection={x:i.x,y:i.y};a.target=destination(f,a);}if(t<=a.warpFrame){f.vx=f.vy=0;f.fastFall=false;}
   // Vanishing does not take off: becoming airborne on the floor would immediately
   // trigger landing and cancel the warp. Change grounding at the destination instead.
   if(t===a.vanishFrames[0]){f.recovered=true;f.specialLandingLag=a.landingLagFrames;GameAudio.cue('dark-cast',.75,f);}
   if(t===a.warpFrame){const q=destination(f,a);f.x=q.x;f.y=q.y;a.target=q;f.face=Math.sign(a.warpDirection.x)||f.face;f.grounded=false;a.gravityMultiplier=1;GameAudio.cue('dark-hit',.6,f);}
  }
 }
 function onHit(f,o,a){if(a.hairGrapple&&f.attack?.hairGrapple&&f.timer<=14&&f.attack.targetId===null){f.attack.targetId=o.id;f.attack.catchPoint={x:o.x,y:o.y-35};}if(a.midnaBounce&&f.attack?.midnaBounce){const recovered=f.recovered;attack(f,'hairBounce');f.grounded=false;f.vy=-5;f.recovered=recovered;}}
 const geometry={front:{angles:[-.2,.15],origin:[0,-46]},back:{angles:[-3,-3.3],origin:[0,-46]},up:{angles:[-1.05,-1.5],origin:[0,-45]},low:{angles:[.05,.2],origin:[0,-20]},down:{angles:[.7,.95],origin:[0,-35]},spin:{angles:[-3,3],origin:[0,-45]}};
 function handPoint(f,a=f.attack,t=f.timer){if(a.hairGrapple){if(a.hook)return{x:a.hook.x,y:a.hook.y};if(a.targetId!==null&&t>14){const o=fighters[a.targetId],u=clamp((t-15)/12,0,1);return{x:lerp(a.catchPoint.x,f.x-f.face*38,u),y:lerp(a.catchPoint.y,f.y-50,u)-Math.sin(u*Math.PI)*55};}const u=t<10?clamp((t-4)/6,0,1):t<=14?1:clamp((27-t)/13,0,1);return{x:f.x+f.face*a.emptyReach*u,y:f.y-46};}const w=CombatData.activeWindow(a,t),g=geometry[w?.shape||'front'],u=w?(t-w.start)/Math.max(1,w.end-w.start):0,angle=lerp(...g.angles,u),reach=(w?.reach??a.reach)*FIGHTER_SCALE*.72;return{x:f.x+Math.cos(angle)*reach*f.face,y:f.y+g.origin[1]+Math.sin(angle)*reach};}
 function boxes(f,a,w,t){if(a.midnaPillar)return[-50,0,50].map(dx=>({x1:f.x+dx,y1:f.y-5,x2:f.x+dx,y2:f.y-140,radius:16,window:w}));if(a.midnaField){const r=a.fieldRadius+a.fieldGrowth*a.charge;return[{x1:f.x-r*.65,y1:f.y-40,x2:f.x+r*.65,y2:f.y-40,radius:r*.35,window:w}];}if(a.hairGrapple){if(t>=28){if(a.targetId===null)return[];const o=fighters[a.targetId];if(Math.hypot(o.x-f.x,o.y-f.y)>145)return[];return[{x1:o.x,y1:o.y-35,x2:o.x,y2:o.y-35,radius:24,window:w}];}const p=handPoint(f,a,t);return[{x1:f.x,y1:f.y-46,x2:p.x,y2:p.y,radius:18,window:w}];}const g=geometry[w.shape],p=handPoint(f,a,t);return[{x1:f.x+g.origin[0]*f.face,y1:f.y+g.origin[1],x2:p.x,y2:p.y,radius:a.type==='smash'?24:12,window:w}];}
 function tick(){for(const f of fighters)if(f.characterId==='midna'&&(f.grounded||f.ledge||f.respawn))f.midnaSideUsed=f.midnaCrushUsed=false;}
 function cpu(f,o,i){const p=platforms.find(p=>p.main);if(f.attack?.midnaWarp){const a=f.attack,target={x:clamp(f.x,p.x+30,p.x+p.w-30),y:p.y-65},dx=target.x-a.origin.x,dy=target.y-a.origin.y,len=Math.hypot(dx,dy);i.x=dx/(len||1);i.y=dy/(len||1);i.jump=i.guard=i.special=i.jab=i.heavy=i.smash=false;}else if(f.attack?.hairGrapple){i.x=Math.sign(720-f.x);i.y=0;i.jump=!!f.attack.hook&&f.timer>=30;i.special=i.jab=i.heavy=i.smash=i.guard=false;}else if(!f.attack&&!f.grounded&&!f.recovered&&(f.y>p.y-100&&(f.x<p.x||f.x>p.x+p.w)||f.y>p.y+30)){i.x=Math.sign(720-f.x)*.4;i.y=-1;i.special=true;i.jump=i.guard=i.jab=i.heavy=i.smash=false;}if(f.attack?.midnaField)i.specialHeld=Math.abs(o.x-f.x)>130&&f.attack.chargeFrames<40;return i;}
 return{reset,prepare,solid,destination,anchor,release,action,onHit,geometry,handPoint,boxes,tick,cpu};
})();

'use strict';
// One-based 60 Hz timings; branching, rope physics and poses use this same clock.
const RexMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const sword=(name,s,e,d,r,p=9,shape='front',extra={})=>m(name,s,[w(s,e,shape)],10,0,{damage:d,reach:r,pose:p,soundFamily:'sword',...extra});
 const moves={
  jab:sword('エッジ I',5,6,3,119,6,'front',{cancel:{start:7,end:16,input:'jab',next:'jab2'}}),
  jab2:sword('エッジ II',4,5,4,130,7,'front',{cancel:{start:6,end:15,input:'jab',next:'jab3'}}),
  jab3:sword('ショルダーバッシュ',7,9,7,132,15,'front',{soundFamily:'punch',impulse:3}),
  heavy:sword('ワイドエッジ',8,11,10,176),up:sword('ライジングエッジ',6,11,8,145,8,'up',{angle:-1.4}),low:sword('ロードライバーカット',7,8,7,162,17,'low'),
  dashAttack:sword('スライディングエッジ',12,15,11,170,15,'front',{impulse:5,recoveryFrames:13,totalFrames:28,FAF:29}),
  smash:m('ダブルスピニングエッジ',13,[w(13,15,'front',{damage:6,baseKnockback:1.4,knockbackGrowth:.015}),w(20,23,'spin',{damage:15})],23,0,{damage:15,reach:212,pose:10,chargeFrame:4,chargeMaxFrames:60,baseKnockback:6.2,knockbackGrowth:.1,soundFamily:'sword'}),
  upsmash:m('プロミネンスリボルト',14,[w(14,18,'up')],24,0,{damage:19,reach:225,pose:8,angle:-1.5,chargeFrame:4,chargeMaxFrames:60,soundFamily:'fire'}),
  downsmash:m('ローリングスマッシュ',12,[w(12,15,'spin'),w(20,22,'back')],23,0,{damage:17,reach:188,pose:10,chargeFrame:4,chargeMaxFrames:60,soundFamily:'sword'}),
  air:m('エアスピンエッジ',6,[w(6,7,'front',{damage:3,baseKnockback:1.4,knockbackGrowth:.015}),w(15,20,'spin',{damage:7})],12,7,{damage:7,reach:154,pose:10,aerial:true,soundFamily:'sword'}),
  fair:m('ドライバークロス',6,[w(6,8)],12,10,{damage:10,reach:171,pose:9,aerial:true,soundFamily:'sword'}),
  bair:m('リバースエッジ',7,[w(7,11,'back')],12,10,{damage:11,reach:163,pose:7,aerial:true,soundFamily:'sword'}),
  uair:m('ライジングエーギス',5,[w(5,9,'up')],13,8,{damage:9,reach:148,pose:8,aerial:true,angle:-1.5,soundFamily:'sword'}),
  dair:m('アンカードロップ',9,[w(9,65,'plunge')],12,14,{damage:13,reach:115,pose:11,aerial:true,diveSpeed:16,airControlMultiplier:.35,gravityMultiplier:0,landingMove:'anchorImpact',bounceOnHit:-9,meteorFrame:11,meteorAngle:1.5,soundFamily:'hammer',anchorDive:true}),
  anchorImpact:m('アンカー・着地衝撃',1,[w(1,4,'shockwave')],12,0,{damage:8,reach:190,pose:17,canClank:false,preserveVelocity:false,soundFamily:'hammer',special:true}),
  dragon:m('アンカーショット',12,[w(12,19,'front')],16,12,{damage:6,reach:250,pose:13,anchorShot:true,anchorRange:230,anchorChargeRange:150,anchorRadius:14,returnEnd:27,pull:true,canClank:false,chargeFrame:4,chargeButton:'special',chargeMaxFrames:50,baseKnockback:1.5,knockbackGrowth:.012,soundFamily:'staff'}),
  anchorFollow:m('アンカー・追撃',6,[w(6,9)],14,12,{damage:12,reach:180,pose:9,special:true,impulse:4,soundFamily:'sword'}),
  dash:m('ダブルスピニングエッジ I',9,[w(9,11)],23,12,{damage:5,reach:162,pose:9,edgeCombo:true,comboStep:1,branchStart:12,branchEnd:28,impulse:2,soundFamily:'sword'}),
  edgeChase:m('エッジ II・追撃',5,[w(5,8)],22,12,{damage:6,reach:177,pose:15,edgeCombo:true,comboStep:2,branchStart:9,branchEnd:22,impulse:7,special:true,soundFamily:'sword'}),
  edgeReverse:m('エッジ II・反転',6,[w(6,9)],22,12,{damage:7,reach:179,pose:7,edgeCombo:true,comboStep:2,branchStart:10,branchEnd:23,impulse:1,special:true,soundFamily:'sword'}),
  edgeLift:m('エッジ II・打ち上げ',7,[w(7,11,'up')],22,12,{damage:7,reach:171,pose:8,angle:-1.45,edgeCombo:true,comboStep:2,branchStart:12,branchEnd:25,impulse:0,preserveVelocity:false,special:true,soundFamily:'sword'}),
  edgeFinish:m('エッジ III・フィニッシュ',9,[w(9,12,'spin')],23,14,{damage:13,reach:210,pose:10,special:true,baseKnockback:5.5,knockbackGrowth:.083,soundFamily:'sword'}),
  rise:m('サルベージアンカー',5,[],14,18,{pose:13,tether:true,hookFrame:10,swingEnd:68,anchorReach:380,handOffset:120.44014925373135,handX:41.239880597014924,reelSpeed:5.2,minRope:68,pumpAcceleration:.005,angularGravity:.58,releaseMin:14,releaseBoost:13,releaseSpeed:7,gravityMultiplier:0,airControlMultiplier:0,soundFamily:'staff',animation:{anticipationEnd:2,anticipationPose:14,accelerationPose:14,followThroughFrames:4,recoveryPose:0,lean:0,lunge:0,impactScale:1}}),
  gale:m('ローリングスマッシュ・飛び込み',18,[w(18,65,'spin')],16,18,{damage:12,reach:145,pose:10,rollDive:true,diveSpeed:15,airControlMultiplier:0,gravityMultiplier:0,landingMove:'rollImpact',bounceOnHit:-9,chargeFrame:4,chargeButton:'special',chargeMaxFrames:45,launchFrame:8,rollSpeed:5.5,rollChargeSpeed:3,soundFamily:'sword'}),
  rollImpact:m('ローリングスマッシュ・地面衝撃',1,[w(1,5,'shockwave')],17,0,{damage:10,reach:215,pose:17,canClank:false,preserveVelocity:false,soundFamily:'fire',special:true})
 };
 moves.rise.totalFrames=moves.rise.swingEnd+moves.rise.recoveryFrames;moves.rise.FAF=moves.rise.totalFrames+1;
 moves.rise.animationWindows=[{start:5,end:9,pose:13},{start:10,end:68,pose:16}];
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:'staff'};}
 moves.grab.name='アンカーつかみ';moves.grab.reach=95;
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;a.animation={...a.animation,anticipationPose:14,accelerationPose:14};}
 return moves;
})();
const RexRules=(()=>{
 function reset(){for(const f of fighters)if(f.characterId==='rex'){f.rexSideUsed=false;f.rexRollUsed=false;}}
 function terrain(x,y,r=0){const p=platforms.find(p=>p.main);return x>p.x-r&&x<p.x+p.w+r&&y>p.y+1&&y<p.y+90+r;}
 function safeStep(f,target){return NaegiRules.safeStep(f,target);}
 function anchorTarget(f,a){const hand={x:f.x+f.face*a.handX,y:f.y-a.handOffset},candidates=platforms.flatMap(p=>[{x:p.x,y:p.y},{x:p.x+p.w,y:p.y}]);
  return candidates.filter(p=>p.y<hand.y+20&&Math.hypot(p.x-hand.x,p.y-hand.y)<=a.anchorReach&&!Array.from({length:20},(_,n)=>terrain(lerp(hand.x,p.x,(n+1)/21),lerp(hand.y,p.y,(n+1)/21),0)).some(Boolean)).sort((p,q)=>Math.hypot(p.x-hand.x,p.y-hand.y)-Math.hypot(q.x-hand.x,q.y-hand.y))[0]||null;
 }
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;if(a.type==='dash'&&!f.grounded)f.rexSideUsed=true;if(a.rollDive&&!f.grounded)f.rexRollUsed=true;
  if(a.tether){a.hook=anchorTarget(f,a);a.castOrigin={x:f.x+f.face*28,y:f.y-38};a.swingAngle=0;a.swingOmega=0;}
 }
 function anchorTip(f,a,t=f.timer){const end=a.activeEnd,range=a.anchorRange+a.anchorChargeRange*a.charge,u=t<=end?clamp((t-a.startupFrames+1)/(end-a.startupFrames+1),0,1):1-clamp((t-end)/(a.returnEnd-end),0,1),distance=24+range*u,y=f.y-38;let x=f.x;for(let d=0;d<=distance;d+=5){const next=f.x+f.face*Math.min(distance,d+5);if(terrain(next,y,a.anchorRadius))break;x=next;}return{x,y};}
 function anchorBox(f,a,w,t){const p=anchorTip(f,a,t),q=anchorTip(f,a,Math.max(w.start,t-1));return[{x1:q.x,y1:q.y,x2:p.x,y2:p.y,radius:a.anchorRadius,window:w}];}
 function release(f,i={x:0},automatic=false){const a=f.attack;if(!a?.tether)return;const tangent={x:Math.cos(a.swingAngle)*a.ropeLength*a.swingOmega,y:-Math.sin(a.swingAngle)*a.ropeLength*a.swingOmega};
  const dir=Math.abs(i.x)>.15?Math.sign(i.x):a.hook?Math.sign(a.hook.x-f.x)||f.face:f.face;f.vx=clamp(tangent.x*.7+dir*a.releaseSpeed,-13,13);f.vy=Math.min(-a.releaseBoost,tangent.y-a.releaseBoost*.65);f.attack=null;f.gravityOff=false;f.fastFall=false;f.recovered=true;f.specialLandingLag=a.landingLagFrames;PlayerStates.enter(f,'Fall');GameAudio.cue('double-jump',.8,f);if(automatic)f.vx*=.8;
 }
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;const t=f.timer,press=i.special||i.jab||['special','jab'].includes(f.buffer?.key);
  if(a.anchorShot&&a.anchorConfirmed&&t>a.activeEnd&&press){attack(f,'anchorFollow');return;}
  if(a.edgeCombo&&t>=a.branchStart&&t<=a.branchEnd&&press){if(a.comboStep===1){const branch=i.y<-.4?'edgeLift':i.x*f.face<-.4?'edgeReverse':'edgeChase';if(branch==='edgeReverse')f.face*=-1;attack(f,branch);}else{const perfect=t<=a.branchStart+2;attack(f,'edgeFinish');f.attack.damage+=perfect?3:0;f.attack.perfect=perfect;}return;}
  if(a.tether){f.fastFall=false;
   if(t<a.hookFrame){f.vx*=.8;f.vy*=.7;}
   if(t===a.hookFrame){f.recovered=true;f.grounded=false;f.specialLandingLag=a.landingLagFrames;if(a.hook){const dx=f.x+f.face*a.handX-a.hook.x,dy=f.y-a.handOffset-a.hook.y;a.ropeLength=Math.max(a.minRope,Math.hypot(dx,dy));a.swingAngle=Math.atan2(dx,dy);a.swingOmega=clamp(f.vx/a.ropeLength,-.06,.06);GameAudio.cue('staff-hit',.7,f);}else{a.ropeLength=0;f.vy=-8;}}
   if(t>a.hookFrame&&t<=a.swingEnd){if(a.hook){a.ropeLength=Math.max(a.minRope,a.ropeLength-a.reelSpeed);a.swingOmega=clamp(a.swingOmega-Math.sin(a.swingAngle)*a.angularGravity/a.ropeLength+i.x*a.pumpAcceleration,-.11,.11);a.swingAngle+=a.swingOmega;const desired={x:a.hook.x+Math.sin(a.swingAngle)*a.ropeLength-f.face*a.handX,y:a.hook.y+Math.cos(a.swingAngle)*a.ropeLength+a.handOffset},q=safeStep(f,desired);f.vx=q.x-f.x;f.vy=q.y-f.y;f.grounded=false;if(q.blocked){a.swingOmega*=-.5;a.swingAngle=Math.atan2(q.x+f.face*a.handX-a.hook.x,q.y-a.handOffset-a.hook.y);}}
    else{f.vx=i.x*3;f.vy+=f.character.gravity;}
    if(t>=a.releaseMin&&(i.special||i.jump||i.guardPressed)){release(f,i);return;}
   }
   if(t===a.swingEnd+1){release(f,i,true);return;}
  }
  if(a.rollDive){if(t===a.launchFrame){f.grounded=false;f.vy=-8;f.vx=f.face*(a.rollSpeed+a.charge*a.rollChargeSpeed);f.fastFall=false;}if(t>=a.startupFrames){f.vx=f.face*(a.rollSpeed+a.charge*a.rollChargeSpeed);f.grounded=false;}}
 }
 function onHit(f,o,a){if(a.anchorShot&&f.attack?.anchorShot)f.attack.anchorConfirmed=true;if((a.anchorDive||a.rollDive)&&!f.grounded){f.attack=null;f.gravityOff=false;f.vy=-9;f.fastFall=false;f.specialLandingLag=0;PlayerStates.enter(f,'Fall');}}
 function tick(){for(const f of fighters)if(f.characterId==='rex'&&(f.grounded||f.ledge||f.respawn)){f.rexSideUsed=false;f.rexRollUsed=false;}}
 function cpu(f,o,i){if(f.attack?.tether){const a=f.attack,hook=a.hook,side=hook&&hook.x<720?-1:1,outside=hook?(f.x-hook.x)*side>f.character.ecb.radius+2:true,release=f.timer>=a.releaseMin&&(outside&&f.y<=(hook?.y??platforms[0].y)+165||f.timer>=a.swingEnd-2);i.x=release&&hook?-side:hook?Math.sign(side*1.25-a.swingAngle-a.swingOmega*14):f.x<720?1:-1;i.y=0;i.special=release;i.jump=i.guard=i.jab=i.smash=i.heavy=false;}
  else if(f.attack?.edgeCombo){i.special=f.timer===f.attack.branchStart+1;i.y=o.y<f.y-65?-1:0;i.x=Math.sign(o.x-f.x);i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&!f.grounded&&!f.recovered&&f.y>platforms[0].y+60&&f.x>platforms[0].x-Math.max(0,f.face*RexMoves.rise.handX)-f.character.ecb.radius-10&&f.x<platforms[0].x+platforms[0].w+Math.max(0,-f.face*RexMoves.rise.handX)+f.character.ecb.radius+10){const p=platforms[0],dir=f.x<p.x+p.w/2?-1:1;i.x=dir;i.y=0;i.special=false;i.jump=f.airJumps>0&&f.vy>=0;i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&!f.grounded&&!f.recovered&&f.y>platforms[0].y-80&&(f.x<platforms[0].x||f.x>platforms[0].x+platforms[0].w)){i.y=-1;i.x=0;i.special=true;i.jump=false;i.jab=i.heavy=i.smash=i.guard=false;}
  return i;
 }
 return{reset,prepare,action,anchorTarget,anchorTip,anchorBox,terrain,safeStep,release,onHit,tick,cpu};
})();

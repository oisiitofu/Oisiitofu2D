'use strict';
// All timings are inclusive, one-based simulation frames at 60 Hz.
// Frame 1 is the accepted input frame. First actionable frame = totalFrames + 1.
const CombatData=(()=>{
 const movement={bufferFrames:9,jumpSpeed:13.5,doubleJumpSpeed:12.5,gravity:.56,fallSpeed:19,fastFallSpeed:24,walkSpeed:3.7,runSpeed:6.8,runThreshold:14,landingFrames:3,knockdownFrames:12};
 const geometry={plunge:{origin:[0,-20],angles:[Math.PI/2,Math.PI/2],radius:18},shockwave:{origin:[0,-14],angles:[0,0],radius:17},front:{origin:[10,-37],angles:[-.35,.15],radius:12},up:{origin:[0,-37],angles:[-2.2,-.8],radius:15},low:{origin:[10,-13],angles:[-.08,.05],radius:10},back:{origin:[-10,-39],angles:[-2.8,-3.5],radius:14},down:{origin:[0,-35],angles:[1.2,1.9],radius:14},spin:{origin:[0,-38],angles:[-3.3,.3],radius:17}};
 function window(start,end,shape='front',extra={}){return {start,end,shape,...extra};}
 function move(name,start,windows,recovery,landing,options={}){
  const last=windows.length?Math.max(...windows.map(w=>w.end)):options.spellShots?.at(-1)??options.counterWindow?.[1]??start;
  const data={name,startupFrames:start,activeFrames:windows,recoveryFrames:recovery,landingLagFrames:landing,totalFrames:last+recovery,FAF:last+recovery+1,activeStart:windows[0]?.start??null,activeEnd:windows.at(-1)?.end??null,damage:8,baseKnockback:3.2,knockbackGrowth:.065,fixedKnockback:0,hitlagMultiplier:1,SDIMultiplier:1,shieldDamage:0,shieldstunMultiplier:1,hitboxSize:1,hitboxOffset:[0,0],rehitRate:0,groundOnly:false,airOnly:false,clangMode:'normal',priorityType:'normal',canClank:true,reboundOnClank:true,transcendent:false,armorFrames:[],invincibleFrames:[],intangibleFrames:[],hitboxes:[],timeline:[],airControlMultiplier:1,velocityXOverride:null,velocityYOverride:null,gravityMultiplier:1,preserveVelocity:true,velocityMultiplier:1,autoCancelStart:1,autoCancelEnd:Math.max(1,start-2),autoCancelWindow:[[1,Math.max(1,start-2)],[last+Math.ceil(recovery*.7),Infinity]],landingFlag:[Math.max(2,start-1),last+recovery],hitstunBase:3,hitstunScale:1.35,angle:-.45,reach:150,pose:9,aerial:false,animation:{anticipationEnd:Math.max(1,Math.floor((start-1)*.4)),anticipationPose:3,accelerationPose:14,followThroughFrames:Math.min(5,recovery),recoveryPose:0,lean:-.12,lunge:12,impactScale:1.13},...options};
  if(options.chargeFrame)data.chargeHoldFrames=180;
  if(options.impulse)data.timeline.push({frame:start,type:'SetVelocity',x:options.impulse});
  if(options.verticalImpulse)data.timeline.push({frame:start,type:'SetVelocity',y:options.verticalImpulse});
  if(options.helpless){data.landingFlag=[1,Infinity];data.autoCancelWindow=[];data.ledgeGrabStart=start;}
  return data;
 }
 const moves={
  jab:move('弱1',5,[window(5,6)],19,0,{damage:3,baseKnockback:1.7,knockbackGrowth:.026,reach:123,pose:6,cancel:{start:7,end:25,input:'jab',next:'jab2'}}),
  jab2:move('弱2',4,[window(4,5)],23,0,{damage:5,baseKnockback:2.5,knockbackGrowth:.04,reach:135,pose:7}),
  heavy:move('横強',8,[window(8,11)],22,0,{damage:10,baseKnockback:4,knockbackGrowth:.068,reach:167}),
  up:move('上強',6,[window(6,12,'up')],21,0,{damage:8,baseKnockback:3.8,knockbackGrowth:.064,reach:137,angle:-1.38,pose:8}),
  low:move('下強',7,[window(7,8,'low')],15,0,{damage:7,baseKnockback:2.8,knockbackGrowth:.052,reach:158,angle:-.2,pose:17}),
  dashAttack:move('ダッシュ攻撃',13,[window(13,16)],33,0,{damage:11,baseKnockback:4.5,knockbackGrowth:.073,reach:168,pose:15,impulse:5}),
  smash:move('横スマッシュ',10,[window(10,13)],38,0,{damage:18,baseKnockback:6.2,knockbackGrowth:.1,reach:194,chargeFrame:3,chargeMaxFrames:60,impulse:3}),
  upsmash:move('上スマッシュ',13,[window(13,17,'up')],41,0,{damage:17,baseKnockback:6,knockbackGrowth:.095,reach:163,angle:-1.48,pose:8,chargeFrame:4,chargeMaxFrames:60}),
  downsmash:move('下スマッシュ',6,[window(6,7,'low'),window(21,23,'back',{damage:18,pose:17})],32,0,{damage:15,baseKnockback:5.4,knockbackGrowth:.088,reach:174,angle:-.32,pose:17,chargeFrame:2,chargeMaxFrames:60}),
  air:move('空N',6,[window(6,7,'front',{damage:3,baseKnockback:1.5,knockbackGrowth:.02}),window(15,21,'spin',{damage:7})],28,7,{damage:7,baseKnockback:3.6,knockbackGrowth:.06,reach:145,pose:10,aerial:true}),
  fair:move('空前',6,[window(6,8)],29,10,{damage:9,baseKnockback:3.8,knockbackGrowth:.065,reach:168,aerial:true}),
  bair:move('空後',7,[window(7,11,'back')],28,10,{damage:11,baseKnockback:4.4,knockbackGrowth:.075,reach:164,pose:10,aerial:true}),
  uair:move('空上',5,[window(5,9,'up')],36,8,{damage:9,baseKnockback:3.8,knockbackGrowth:.067,reach:140,pose:8,angle:-1.5,aerial:true}),
  dair:move('竜騎士ジャンプ・急降下',9,[window(9,98,'plunge')],10,14,{damage:13,baseKnockback:4.5,knockbackGrowth:.074,reach:115,pose:11,angle:1.48,aerial:true,diveSpeed:34,airControlMultiplier:.2,velocityMultiplier:.3,velocityYOverride:-2,gravityMultiplier:0,landingMove:'diveLanding',autoCancelWindow:[],landingFlag:[1,Infinity],timeline:[{frame:9,type:'SetVelocity',y:34}],canClank:false}),
  diveLanding:move('竜騎士ジャンプ・衝撃波',1,[window(1,5,'shockwave')],14,0,{damage:8,baseKnockback:4.2,knockbackGrowth:.065,reach:220,pose:17,angle:-.95,preserveVelocity:false,canClank:false}),
  rise:move('ハイジャンプ',5,[window(5,11,'up')],10,12,{damage:10,baseKnockback:4.8,knockbackGrowth:.064,reach:133,pose:16,angle:-1.35,verticalImpulse:-19,helpless:false,aerial:true,actionCancelFrame:12,ledgeGrabStart:5}),
  dragon:move('竜牙貫通',12,[window(12,14)],28,12,{damage:13,baseKnockback:4.8,knockbackGrowth:.075,reach:205,pose:6}),
  dash:move('ドラゴンダイブ・突撃',9,[window(9,22)],12,12,{damage:12,baseKnockback:4.8,knockbackGrowth:.075,reach:160,pose:15,rushSpeed:16,airControlMultiplier:0,velocityMultiplier:.3,ledgeGrabStart:23,timeline:[{frame:9,type:'DisableGravity'},{frame:9,type:'SetVelocity',x:16,y:0},{frame:23,type:'EnableGravity'},{frame:23,type:'SetVelocity',x:3}]}),
  gale:move('竜鱗カウンター',6,[],33,14,{damage:0,reach:0,pose:18,counterWindow:[6,27],counterMove:'counter'}),
  counter:move('カウンター反撃',4,[window(4,6)],24,14,{damage:14,baseKnockback:5.8,knockbackGrowth:.092,reach:181,pose:9}),
  grab:move('つかみ',7,[window(7,8)],25,0,{damage:0,baseKnockback:0,reach:67,pose:12}),
  ledge:move('崖攻撃',8,[window(8,10)],22,0,{damage:8,baseKnockback:3.8,knockbackGrowth:.06,reach:133,pose:7}),
  getupAttack:move('起き上がり攻撃',7,[window(7,9),window(12,14,'back')],19,0,{damage:7,baseKnockback:4,knockbackGrowth:.06,reach:136,pose:17,intangibleFrames:[[1,6]]}),
  pummel:move('つかみ打撃',2,[window(2,2)],9,0,{damage:1.3,baseKnockback:0,knockbackGrowth:0,reach:40,pose:12}),
  forwardThrow:move('前投げ',1,[window(1,1)],18,0,{damage:8,baseKnockback:4.8,knockbackGrowth:.07,angle:-.5,reach:70,pose:13}),
  backThrow:move('後投げ',1,[window(1,1,'back')],20,0,{damage:9,baseKnockback:5,knockbackGrowth:.075,angle:-.5,reach:70,pose:13}),
  upThrow:move('上投げ',1,[window(1,1,'up')],21,0,{damage:8,baseKnockback:4.6,knockbackGrowth:.068,angle:-1.45,reach:70,pose:13}),
  downThrow:move('下投げ',1,[window(1,1,'low')],19,0,{damage:6,baseKnockback:3.6,knockbackGrowth:.047,angle:-1.05,reach:70,pose:13})
 };
 // Action resumes with the final visible return pose; no neutral-pose lockout.
 for(const [id,a]of Object.entries(moves)){
  a.referenceRecoveryFrames=a.recoveryFrames;
  const end=a.activeEnd??a.counterWindow?.[1]??a.startupFrames;
  const returnFrames=a.chargeFrame?11:id==='dashAttack'?7:a.aerial?5:4;
  if(!a.helpless&&!a.diveSpeed&&id!=='diveLanding'&&!id.endsWith('Throw')&&id!=='pummel'){
   a.recoveryFrames=Math.min(a.recoveryFrames,a.animation.followThroughFrames+returnFrames);
   a.totalFrames=end+a.recoveryFrames;a.FAF=a.totalFrames+1;
   if(a.cancel)a.cancel={...a.cancel,end:Math.min(a.cancel.end,a.totalFrames)};
   a.autoCancelWindow=[[1,a.autoCancelEnd],[end+Math.ceil(a.recoveryFrames*.7),Infinity]];
   a.landingFlag=[Math.max(2,a.startupFrames-1),a.totalFrames];
  }
  a.motionEndFrames=a.totalFrames;
 }
 function activeWindow(a,frame){let index=a.activeFrames.findIndex(w=>frame>=w.start&&frame<=w.end);return index<0?null:{...a.activeFrames[index],index};}
 const ordinaryAttacks=new Set(['jab','jab2','jab3','heavy','up','low','dashAttack','smash','upsmash','downsmash','air','fair','bair','uair','dair','grab','ledge','getupAttack']);
 function alignRecovery(a){
  if(!ordinaryAttacks.has(a.type)||a.special||a.helpless||a.tether||a.diveSpeed||a.landingMove)return;
  // The last return frame is actionable. Do not stretch a short return to fit
  // a copied recovery duration, or shorten an authored hit/event/animation.
  const end=Math.max(a.startupFrames,...a.activeFrames.map(w=>w.end),...(a.timeline||[]).map(e=>e.frame),...(a.animationWindows||[]).map(w=>w.end));
  const follow=a.animation.followThroughFrames,back=a.animation.returnFrames??(a.chargeFrame?11:a.type==='dashAttack'?7:a.aerial?5:4);
  const total=Math.min(a.totalFrames,end+follow+back-1);
  a.referenceRecoveryFrames??=a.recoveryFrames;a.recoveryFrames=total-end;a.totalFrames=a.motionEndFrames=total;a.FAF=total+1;
  if(a.cancel)a.cancel={...a.cancel,end:Math.min(a.cancel.end,total)};
  a.animation={...a.animation,returnFrames:back};
  a.landingFlag=[a.landingFlag[0],Math.min(a.landingFlag[1],total)];
  a.autoCancelWindow=a.autoCancelWindow.map(([s,e])=>[e===Infinity?Math.min(s,end+Math.ceil(a.recoveryFrames*.7)):s,e]);
 }
 function finishedMotion(f){
  const a=f.attack;if(!a||a.hold||a.helpless||a.tether||a.escapeSide||f.grabbed)return false;
  // Older authored sequences explicitly switched to idle but kept locking the
  // owner. Object lifetime is independent; a later hit or input phase is not.
  const t=f.timer,windows=a.animationWindows||[];
  if(t<a.startupFrames||pose(f)!==0)return false;
  if(a.activeFrames.some(w=>w.end>=t)||a.spellShots?.some(at=>at>=t)||a.counterWindow?.[1]>=t||a.motionCommitEnd>=t)return false;
  if(windows.some(w=>w.start>t&&w.pose!==0))return false;
  return !(a.timeline||[]).some(e=>e.frame>=t&&!a.eventsDone.has(e));
 }
 function sample(a,frame){let active=activeWindow(a,frame),ani=a.animation;if(active)return{phase:'attack',pose:active.pose??a.pose,progress:(frame-active.start)/Math.max(1,active.end-active.start),active};if(frame<a.startupFrames){let anticipation=frame<=ani.anticipationEnd;return{phase:anticipation?'anticipation':'acceleration',pose:anticipation?ani.anticipationPose:ani.accelerationPose,progress:anticipation?frame/ani.anticipationEnd:(frame-ani.anticipationEnd)/Math.max(1,a.startupFrames-ani.anticipationEnd-1)};}
  const animation=a.animationWindows?.find(w=>frame>=w.start&&frame<=w.end);
  if(animation)return{phase:animation.phase||'follow-through',pose:animation.pose,progress:(frame-animation.start)/Math.max(1,animation.end-animation.start)};
  if(a.counterWindow&&frame<=a.counterWindow[1])return{phase:'counter',pose:a.pose,progress:0};
  // Casting poses follow spawn events without adding a melee hitbox.
  if(a.spellShots&&frame<=a.spellShots.at(-1))return{phase:'attack',pose:a.pose,progress:(frame-a.startupFrames)/Math.max(1,a.spellShots.at(-1)-a.startupFrames)};
  let prior=a.activeFrames.filter(w=>w.end<frame).at(-1),end=Math.max(prior?.end??a.spellShots?.at(-1)??a.counterWindow?.[1]??a.startupFrames,a.motionCommitEnd||0),elapsed=frame-end,follow=elapsed<=ani.followThroughFrames;
  if(a.motionCommitEnd&&frame<=a.motionCommitEnd&&!a.activeFrames.some(w=>w.start>frame))return{phase:'attack',pose:a.pose,progress:0};
  let next=a.activeFrames.find(w=>w.start>frame);
  if(next&&!follow){let begin=end+ani.followThroughFrames+1,span=next.start-begin,t=frame-begin+1,anticipation=Math.min(ani.anticipationEnd,Math.max(1,Math.floor(span*.4)));return t<=anticipation?{phase:'anticipation',pose:ani.anticipationPose,progress:t/anticipation}:{phase:'acceleration',pose:ani.accelerationPose,progress:(t-anticipation)/Math.max(1,span-anticipation)};}
  return{phase:follow?'follow-through':'recovery',pose:prior?.pose??a.pose,returnPose:ani.recoveryPose,returnBlend:follow?0:Math.min(1,(elapsed-ani.followThroughFrames)/Math.max(1,a.totalFrames+1-end-ani.followThroughFrames)),progress:follow?elapsed/Math.max(1,ani.followThroughFrames):Math.min(1,(elapsed-ani.followThroughFrames)/Math.max(1,a.totalFrames+1-end-ani.followThroughFrames))};
 }
 function launch(a,percent,charge=0,weight=90,attackerPercent=0){let damage=(a.damage??0)*1.05*(1+charge*(CharacterData.dragoon.smashMultiplier-1))*(StageRules.oneOnOne?1.2:1),raw=CombatSystem.calculateKnockback(a,Math.min(999,percent+damage),weight,attackerPercent,damage);return{damage,rawKnockback:raw,knockback:CombatSystem.launchSpeed(a,raw),hitstun:Math.max(4,Math.floor(raw*.4)-1),hitstop:BattleFeel.hitlag({...a,damage:(a.damage??0)*(1+charge*(CharacterData.dragoon.smashMultiplier-1))})};}
 return{moves,movement,geometry,activeWindow,sample,launch,alignRecovery,finishedMotion,createMove:move,window};
})();

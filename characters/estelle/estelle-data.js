'use strict';
// All windows and motion events use inclusive, one-based frames at 60 Hz.
const EstelleMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,start,end,damage,reach,pose=9,shape='front',opts={})=>m(name,start,[w(start,end,shape)],9,0,{damage,reach,pose,...opts});
 const soft={baseKnockback:1.3,knockbackGrowth:.015};
 const moves={
  jab:cut('棒突き',5,6,3,144,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:cut('返し薙ぎ',4,5,4,153,7,'front',{cancel:{start:6,end:14,input:'jab',next:'jab3'}}),
  jab3:cut('フィニッシュ突き',7,9,7,177,9,'front',{impulse:2.5,baseKnockback:4.2,knockbackGrowth:.067}),
  heavy:cut('長柄の横薙ぎ',8,11,10,190,9),
  up:cut('すくい上げ',6,10,8,168,8,'up',{angle:-1.4}),
  low:cut('低い払い',7,8,7,177,17,'low',{angle:-.23}),
  dashAttack:cut('踏み込み連突',12,15,11,183,15,'front',{impulse:5,recoveryFrames:12,totalFrames:27,FAF:28}),
  smash:m('ハードブレイク',13,[w(13,16,'front')],20,0,{damage:20,reach:217,pose:9,baseKnockback:6.3,knockbackGrowth:.102,chargeFrame:4,chargeMaxFrames:60,impulse:2.5,shieldDamage:3}),
  upsmash:m('ハリケーン',12,[w(12,14,'spin',{...soft,damage:3,pose:10}),w(20,23,'up',{damage:15,pose:8})],19,0,{damage:15,reach:187,pose:8,angle:-1.48,baseKnockback:5.8,knockbackGrowth:.094,chargeFrame:4,chargeMaxFrames:60}),
  downsmash:m('桜吹雪',10,[w(10,12,'low'),w(19,21,'back',{pose:17})],18,0,{damage:16,reach:195,pose:17,angle:-.3,baseKnockback:5.5,knockbackGrowth:.09,chargeFrame:3,chargeMaxFrames:60}),
  air:m('周旋薙ぎ',6,[w(6,9,'spin')],10,7,{damage:8,reach:166,pose:10,aerial:true}),
  fair:m('斜め下の払い',6,[w(6,8,'front')],10,10,{damage:10,reach:182,pose:9,aerial:true}),
  bair:m('後ろ蹴り・払い返し',7,[w(7,10,'back')],10,10,{damage:11,reach:179,pose:10,aerial:true}),
  uair:m('天への突き上げ',5,[w(5,8,'up')],10,8,{damage:9,reach:170,pose:8,aerial:true,angle:-1.5}),
  dair:m('棒落とし',9,[w(9,13,'down')],12,14,{damage:12,reach:165,pose:11,aerial:true,bounceOnHit:-7.8,meteorFrame:11,meteorAngle:1.45,meteorMultiplier:1.2,timeline:[{frame:9,type:'SetVelocity',y:12}]}),
  dragon:m('モラルブレイク',12,[w(12,14,'front')],16,12,{damage:11,reach:216,pose:13,baseKnockback:4.8,knockbackGrowth:.073,shieldDamage:4,chargeFrame:4,chargeButton:'special',chargeMaxFrames:60}),
  dash:m('突進クラフト・突き',9,[w(9,11,'front')],17,14,{damage:4,reach:174,pose:15,angle:-1.25,fixedKnockback:16,airControlMultiplier:0,rushStart:5,rushEnd:10,approachSpeed:6.5,followupMove:'sideLift',followupFrame:12,ledgeGrabStart:12}),
  sideLift:m('突進クラフト・飛燕返し',5,[w(5,7,'front')],12,14,{damage:3,reach:185,pose:8,angle:-1.4,fixedKnockback:22,airControlMultiplier:0,gravityMultiplier:.5,liftVelocity:-5.8,chaseFrames:[1,7],chaseSpeed:6,followupMove:'sideFinish',followupFrame:8,ledgeGrabStart:8}),
  sideFinish:m('突進クラフト・追撃',6,[w(6,9,'front')],16,14,{damage:10,reach:194,pose:9,angle:-.55,baseKnockback:5,knockbackGrowth:.077,preserveVelocity:true,airControlMultiplier:0,gravityMultiplier:.6,chaseFrames:[1,3],chaseSpeed:4.5,ledgeGrabStart:10}),
  rise:m('はね上げジャンプ',8,[w(8,10,'up',{...soft,damage:3,pose:16}),w(18,21,'up',{damage:7,pose:8})],12,18,{damage:7,reach:157,pose:16,angle:-1.4,baseKnockback:4.6,knockbackGrowth:.07,aerial:true,airControlMultiplier:.5,poleStart:8,poleEnd:17,poleRadiusX:45,poleRadiusY:65,poleReleaseFrame:18,poleLaunchSpeed:13.8,poleHorizontalSpeed:8,poleAirMultiplier:.9,poleEarlyReleaseFrame:12,actionCancelFrame:25,ledgeGrabStart:18,autoCancelWindow:[],landingFlag:[1,Infinity]}),
  gale:m('ホイールクラフト',9,[w(9,10,'front',{...soft,damage:2,pose:10}),w(14,15,'back',{...soft,damage:2,pose:10}),w(19,20,'front',{...soft,damage:2,pose:10}),w(27,30,'spin',{damage:8,pose:9})],16,14,{damage:8,reach:180,pose:10,baseKnockback:4.7,knockbackGrowth:.076,wheelSpeed:1.7,wheelStart:9,wheelEnd:30,airControlMultiplier:0,gravityMultiplier:.65,wheelAirLift:-3.5})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){
  const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e}))};
 }
 const names={grab:'片手・棒つかみ',pummel:'棒の柄打ち',forwardThrow:'押し出し投げ',backThrow:'回転返し投げ',upThrow:'棒の打ち上げ',downThrow:'足払い投げ'};
 for(const[id,name]of Object.entries(names))moves[id].name=name;
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;a.animation={...a.animation,anticipationPose:14};}
 moves.rise.animation={...moves.rise.animation,anticipationEnd:3,anticipationPose:3,accelerationPose:16,followThroughFrames:4,recoveryPose:5,lunge:0};
 return moves;
})();

const EstelleRules=(()=>{
 function reset(){for(const f of fighters)if(f.characterId==='estelle'){f.estelleSideUsed=false;f.estelleWheelUsed=false;}}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;if(a.type==='dash'&&!f.grounded)f.estelleSideUsed=true;if(a.type==='gale'&&!f.grounded)f.estelleWheelUsed=true;}
 function onHit(f,o,a){
  if(!a.followupMove||!f.attack||f.attack.type!==a.type)return;
  f.attack.followupTarget=o.id;
 }
 function transition(f,a){
  if(a.followupTarget===undefined||f.timer<a.followupFrame)return false;
  const o=fighters[a.followupTarget];if(!o||o.respawn||Math.abs(o.x-f.x)>230||Math.abs(o.y-f.y)>150)return false;
  if(!attack(f,a.followupMove))return false;
  f.attack.followupTarget=undefined;f.attack.chaseTarget=o.id;f.face=Math.sign(o.x-f.x)||f.face;
  action(f);return true;
 }
 function chase(f,a){
  const o=fighters[a.chaseTarget];if(!o||o.respawn||!a.chaseFrames||f.timer<a.chaseFrames[0]||f.timer>a.chaseFrames[1])return;
  const delta=o.x-f.x-f.face*28;if(Math.abs(o.x-f.x)>230)return;
  f.vx=clamp(delta*.16,-a.chaseSpeed,a.chaseSpeed);
 }
 function pole(f,a,i){const t=f.timer;
  if(t<a.poleStart)return;
  if(t===a.poleStart){a.poleFace=f.face;a.poleOrigin={x:f.x,y:f.y};a.poleAnchor={x:f.x+f.face*a.poleRadiusX,y:f.y+(a.originGrounded?0:22)};f.grounded=false;f.recovered=true;f.specialLandingLag=a.landingLagFrames;f.fastFall=false;ring(f.x,f.y,'#b9efff',60);}
  if(t<=a.poleEnd){a.gravityMultiplier=0;f.fastFall=false;
   const u=(t-a.poleStart+1)/(a.poleEnd-a.poleStart+1),theta=u*Math.PI/2;
   const x=a.poleOrigin.x+a.poleFace*a.poleRadiusX*(1-Math.cos(theta)),y=a.poleOrigin.y-a.poleRadiusY*Math.sin(theta);
   // The pendulum supplies velocity; normal swept floor/wall/ceiling collision still applies.
   f.vx=x-f.x;f.vy=y-f.y;
   if(t>=a.poleEarlyReleaseFrame&&(i.special||i.guardPressed)){f.timer=a.poleReleaseFrame;f.buffer=null;}
  }
  if(f.timer>=a.poleReleaseFrame&&!a.poleReleased){a.poleReleased=true;a.gravityMultiplier=1;const x=clamp(i.x||0,-1,1),strength=a.originGrounded?1:a.poleAirMultiplier;
   f.vx=x*a.poleHorizontalSpeed;f.vy=-a.poleLaunchSpeed*strength;f.fastFall=false;if(Math.abs(x)>.1)f.face=Math.sign(x);a.poleDirection=x;ring(f.x,f.y,'#c4f7ff',75);
  }
 }
 function action(f,i=emptyInput()){
  const a=f.attack;if(!a)return;if(a.followupMove&&transition(f,a))return;
  if(a.type==='dash'){if(f.timer>=a.rushStart&&f.timer<=a.rushEnd)f.vx=f.face*a.approachSpeed;else if(f.timer>a.rushEnd)f.vx=0;}
  if(a.type==='sideLift'&&f.timer===a.startupFrames){f.grounded=false;f.fastFall=false;f.vy=a.liftVelocity;}
  if(a.type.startsWith('side'))chase(f,a);
  if(a.type==='rise')pole(f,a,i);
  if(a.type==='gale'&&f.timer>=a.wheelStart&&f.timer<=a.wheelEnd){f.vx=(i.x||0)*a.wheelSpeed;if(f.timer===a.wheelStart&&!f.grounded){f.vy=a.wheelAirLift;f.fastFall=false;}}
 }
 function tick(){for(const f of fighters)if(f.characterId==='estelle'&&(f.grounded||f.ledge||f.respawn)){f.estelleSideUsed=false;f.estelleWheelUsed=false;}}
 function cpu(f,o,i){
  const p=platforms.find(p=>p.main),under=f.y>p.y+25&&f.x>p.x-20&&f.x<p.x+p.w+20;
  if(f.attack?.type==='rise'&&f.timer<=f.attack.poleReleaseFrame){i.x=under?(f.x<p.x+p.w/2?-1:1):Math.sign(p.x+p.w/2-f.x);i.special=false;i.guard=i.jab=i.heavy=i.smash=false;}
  else if(!f.attack&&under&&!f.recovered){i.x=f.x<p.x+p.w/2?-1:1;i.y=0;i.special=!f.estelleSideUsed;i.jump=false;}
  return i;
 }
 return{reset,prepare,onHit,action,tick,cpu};
})();

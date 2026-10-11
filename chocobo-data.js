'use strict';
const ChocoboMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const strike=(name,start,end,damage,reach,pose=6,shape='front',opts={})=>m(name,start,[w(start,end,shape)],9,0,{damage,reach,pose,...opts});
 const moves={
 jab:strike('くちばしペック',5,6,3,90,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
 jab2:strike('ペレッ・ウィングスラップ',4,6,4,112,7,'front',{cancel:{start:7,end:15,input:'jab',next:'jab3'}}),
 jab3:strike('がんばり突き',7,9,7,126,6,'front',{impulse:3,baseKnockback:4.1}),
 heavy:strike('つばさスイング',8,11,10,142,7),
 up:strike('ばんざい突き',6,11,8,127,8,'up',{angle:-1.4}),
 low:strike('すべりこみ小突き',7,9,7,126,17,'low',{impulse:2,angle:-.25}),
 dashAttack:strike('討伐ダッシュ',11,14,11,137,15,'front',{impulse:6}),
 smash:m('チョコボキック',13,[w(13,16)],17,0,{damage:20,reach:167,pose:9,chargeFrame:4,chargeMaxFrames:60,baseKnockback:6.4,knockbackGrowth:.1}),
 upsmash:m('うわァッ！ふり上げ',12,[w(12,16,'up')],17,0,{damage:17,reach:151,pose:8,chargeFrame:4,chargeMaxFrames:60,angle:-1.5,baseKnockback:5.8,knockbackGrowth:.095}),
 downsmash:m('ぐるっといやッ！',10,[w(10,12,'low'),w(18,21,'back',{pose:10})],16,0,{damage:16,reach:145,pose:17,chargeFrame:3,chargeMaxFrames:60,baseKnockback:5.4,knockbackGrowth:.085}),
 air:m('じたばたスピン',6,[w(6,7,'front',{damage:3,baseKnockback:1.2,knockbackGrowth:.01}),w(14,18,'spin',{damage:6})],10,7,{damage:6,reach:128,pose:10,aerial:true}),
 fair:m('えいっ',6,[w(6,9)],10,10,{damage:10,reach:137,pose:9,aerial:true}),
 bair:m('ふりむきしっぽキック',7,[w(7,11,'back')],10,10,{damage:12,reach:146,pose:10,aerial:true}),
 uair:m('つばさリフト',5,[w(5,9,'up')],10,8,{damage:8,reach:133,pose:8,angle:-1.5,aerial:true}),
 dair:m('チョコスタンプ',10,[w(10,14,'down')],12,14,{damage:13,reach:120,pose:11,angle:-.55,meteorFrame:12,meteorAngle:1.5,meteorMultiplier:1.3,bounceOnHit:-10,aerial:true}),
 dragon:m('チョコメテオ',24,[w(24,31,'down',{damage:7}),w(32,36,'shockwave',{damage:11})],12,12,{damage:11,reach:155,pose:8,targetedMeteor:true,targetLockFrame:7,meteorFallStart:16,meteorImpactStart:32,chargeFrame:6,chargeButton:'special',chargeMaxFrames:60,baseKnockback:5,knockbackGrowth:.08,angle:-1.1,projectile:true,canClank:false}),
 dash:m('チョコダッシュ',9,[w(9,13,'front',{damage:4,baseKnockback:1.5,knockbackGrowth:.01}),w(19,24,'front',{damage:11})],12,12,{damage:11,reach:144,pose:15,chocoDash:true,airControlMultiplier:0,baseKnockback:4.8,knockbackGrowth:.077,ledgeGrabStart:25,timeline:[{frame:9,type:'SetVelocity',x:13},{frame:14,type:'SetVelocity',x:10,y:-6},{frame:19,type:'SetVelocity',x:12,y:2},{frame:25,type:'SetVelocity',x:3}]}),
 rise:m('チョコフラップグライド',7,[w(7,12,'up')],56,15,{damage:8,reach:132,pose:16,verticalImpulse:-17.5,aerial:true,angle:-1.4,glideStart:13,glideEnd:58,glideFallSpeed:2.2,glideGravity:.15,airControlMultiplier:1.3,actionCancelFrame:13,ledgeGrabStart:7,animation:{anticipationEnd:2,anticipationPose:3,accelerationPose:4,followThroughFrames:5,recoveryPose:5,lean:-.12,lunge:5,impactScale:1.07}}),
 gale:m('黒魔道のまほう',16,[w(16,21,'front')],14,12,{damage:15,reach:198,pose:42,baseKnockback:5.2,knockbackGrowth:.085,projectile:true,canClank:false,animation:{anticipationEnd:5,anticipationPose:40,accelerationPose:41,followThroughFrames:5,recoveryPose:0,lean:-.08,lunge:5,impactScale:1.08}})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow'])moves[id]={...CombatData.moves[id],animation:{...CombatData.moves[id].animation},timeline:[...CombatData.moves[id].timeline]};
 moves.grab.name='つばさでつかむ';moves.pummel.name='こつこつペック';moves.forwardThrow.name='押しだし投げ';moves.backThrow.name='ぐるっと投げ';moves.upThrow.name='ひょい上げ';moves.downThrow.name='あまえっポンッ';
 for(const a of Object.values(moves))a.motionEndFrames=a.totalFrames;
 return moves;
})();
const ChocoboRules={
 target(f,offset=145){const x=f.x+f.face*offset,floors=platforms.filter(p=>x>=p.x&&x<=p.x+p.w&&p.y>=f.y-25).sort((a,b)=>a.y-b.y);return{x,y:floors[0]?.y??Math.max(560,f.y+170)};},
 meteor(f,t=f.timer){const a=f.attack,target=a.meteorTarget||this.target(f),p=clamp((t-a.meteorFallStart)/(a.meteorImpactStart-a.meteorFallStart),0,1);return{x:target.x,y:target.y-230*(1-p*p)-18,radius:21+(a.charge||0)*13,target};},
 tick(f,i){const a=f.attack;if(!a)return;if(a.targetedMeteor&&f.timer<a.targetLockFrame){a.targetOffset=clamp((a.targetOffset??145)+i.x*f.face*3,55,300);a.meteorTarget=this.target(f,a.targetOffset);}if(a.chocoDash&&f.timer>=9&&f.timer<=24){f.vx=f.face*(f.timer<14?13:f.timer<19?10:12);if(f.timer===14)f.grounded=false;}if(a.glideStart&&f.timer>=a.glideStart&&f.timer<=a.glideEnd){f.fastFall=false;f.vy=Math.min(f.vy,a.glideFallSpeed);a.gravityMultiplier=a.glideGravity;f.state='fall';}else if(a.glideStart)a.gravityMultiplier=1;}
};

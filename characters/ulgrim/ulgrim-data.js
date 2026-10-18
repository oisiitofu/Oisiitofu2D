'use strict';
// Ulgrim uses explicit inclusive 60 Hz hit windows, independent of the other fighters.
const UlgrimMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,start,end,damage,reach,pose=9,shape='front',opts={})=>m(name,start,[w(start,end,shape)],9,0,{damage,reach,pose,...opts});
 const moves={
 jab:cut('横斬り',5,6,3,128,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
 jab2:cut('斜め斬り上げ',4,6,4,138,7,'front',{cancel:{start:7,end:15,input:'jab',next:'jab3'}}),
 jab3:cut('踏み込み突き',7,9,7,162,15,'front',{impulse:3,baseKnockback:4.3,knockbackGrowth:.067}),
 heavy:cut('大振り横薙ぎ',8,11,11,174),
 up:cut('逆袈裟斬り',6,12,9,149,8,'up',{angle:-1.4}),
 low:cut('低い薙ぎ払い',7,9,7,160,17,'low',{angle:-.2}),
 dashAttack:cut('斬り抜け',12,15,12,169,15,'front',{impulse:6}),
 smash:m('最初の剣・断空',13,[w(13,16)],18,0,{damage:20,reach:202,pose:9,baseKnockback:6.5,knockbackGrowth:.102,chargeFrame:4,chargeMaxFrames:60}),
 upsmash:m('天断ち',12,[w(12,16,'up')],18,0,{damage:18,reach:175,pose:8,angle:-1.48,baseKnockback:6,knockbackGrowth:.095,chargeFrame:4,chargeMaxFrames:60}),
 downsmash:m('双刃一閃',10,[w(10,12,'low'),w(18,20,'back',{pose:17})],17,0,{damage:16,reach:179,pose:17,angle:-.35,baseKnockback:5.5,knockbackGrowth:.09,chargeFrame:3,chargeMaxFrames:60}),
 air:m('空N・水平斬り',6,[w(6,9,'spin')],10,7,{damage:8,reach:149,pose:10,aerial:true}),
 fair:m('空前・突き下ろし',7,[w(7,10)],10,10,{damage:11,reach:174,pose:9,aerial:true}),
 bair:m('空後・振り返り斬り',7,[w(7,11,'back')],10,10,{damage:12,reach:168,pose:10,aerial:true}),
 uair:m('空上・天に裂く斬撃',5,[w(5,9,'up')],10,8,{damage:9,reach:156,pose:8,angle:-1.5,aerial:true}),
 dair:m('空下・急降下斬り',10,[w(10,15,'down')],12,14,{damage:13,reach:151,pose:11,angle:-.5,meteorFrame:12,meteorAngle:1.5,meteorMultiplier:1.25,aerial:true,timeline:[{frame:10,type:'SetVelocity',y:14}]}),
 dragon:m('覚悟の連斬',6,[w(6,7,'front',{damage:3,baseKnockback:1.2,knockbackGrowth:.012,pose:6}),w(12,13,'up',{damage:3,baseKnockback:1.5,knockbackGrowth:.015,pose:7}),w(20,23,'front',{damage:8,pose:9})],12,12,{damage:8,reach:170,pose:9,baseKnockback:4.6,knockbackGrowth:.075}),
 dash:m('影渡りの剣',9,[w(9,18)],13,12,{damage:12,reach:158,pose:15,rushSpeed:15,airControlMultiplier:0,velocityMultiplier:.3,intangibleFrames:[[7,10]],ledgeGrabStart:19,timeline:[{frame:9,type:'DisableGravity'},{frame:9,type:'SetVelocity',x:15,y:0},{frame:19,type:'EnableGravity'},{frame:19,type:'SetVelocity',x:3}]}),
 rise:m('天翔の引き上げ',6,[w(6,9,'up',{damage:4,baseKnockback:1.7,knockbackGrowth:.015}),w(12,16,'up',{damage:8})],11,18,{damage:8,reach:151,pose:16,angle:-1.4,verticalImpulse:-18.5,aerial:true,ledgeGrabStart:6,actionCancelFrame:17}),
 gale:m('鋼の構え',6,[],16,14,{damage:0,reach:0,pose:18,counterWindow:[6,27],counterMove:'counter'}),
 counter:m('鋼の反撃',4,[w(4,7)],13,12,{damage:16,reach:186,pose:9,baseKnockback:6.1,knockbackGrowth:.097})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow'])moves[id]={...CombatData.moves[id],animation:{...CombatData.moves[id].animation},timeline:[...CombatData.moves[id].timeline]};
 for(const a of Object.values(moves)){a.animation={...a.animation,anticipationPose:14};a.motionEndFrames=a.totalFrames;}
 return moves;
})();

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('ulgrim',{"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"fair":{"strike":[13],"windup":14},"smash":{"strike":[13,9],"windup":14},"bair":{"strike":[7,10],"windup":14},"jab3":{"strike":[6,7],"windup":14},"downsmash":{"strike":[17,7],"windup":14}});

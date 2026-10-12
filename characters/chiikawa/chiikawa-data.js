'use strict';
const ChiikawaMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const poke=(name,start,end,damage,reach,pose=6,shape='front',opts={})=>m(name,start,[w(start,end,shape)],8,0,{damage,reach,pose,...opts});
 const moves={
 jab:poke('ぺしっ',5,6,2.5,84,6,'front',{cancel:{start:7,end:14,input:'jab',next:'jab2'}}),
 jab2:poke('ぺしぺし',4,5,3,97,7,'front',{cancel:{start:6,end:13,input:'jab',next:'jab3'}}),
 jab3:poke('がんばり突き',7,9,7,146,15,'front',{impulse:2,baseKnockback:4,knockbackGrowth:.065}),
 heavy:poke('さすまたスイング',8,11,9,153,9),
 up:poke('ばんざい突き',6,10,8,128,8,'up',{angle:-1.45}),
 low:poke('すべりこみ小突き',7,8,6,140,17,'low',{angle:-.25,impulse:2}),
 dashAttack:poke('討伐ダッシュ',11,14,10,154,15,'front',{impulse:5}),
 smash:m('本気の討伐！',13,[w(13,16)],17,0,{damage:19,reach:173,pose:9,chargeFrame:4,chargeMaxFrames:60,baseKnockback:6.2,knockbackGrowth:.1}),
 upsmash:m('うわァッ！ふり上げ',12,[w(12,16,'up')],17,0,{damage:17,reach:153,pose:8,chargeFrame:4,chargeMaxFrames:60,angle:-1.48,baseKnockback:5.8,knockbackGrowth:.095}),
 downsmash:m('ぐるっといやッ！',10,[w(10,12,'low'),w(18,20,'back',{pose:10})],16,0,{damage:15,reach:151,pose:17,chargeFrame:3,chargeMaxFrames:60,angle:-.4,baseKnockback:5.2,knockbackGrowth:.088}),
 air:m('じたばたスピン',6,[w(6,7,'front',{damage:3,baseKnockback:1.3,knockbackGrowth:.015}),w(13,17,'spin',{damage:6})],10,7,{damage:6,reach:119,pose:10,aerial:true}),
 fair:m('えいっ',6,[w(6,9)],10,10,{damage:9,reach:143,pose:9,aerial:true}),
 bair:m('ふりむきしりもちアタック',7,[w(7,11,'back')],10,10,{damage:11,reach:98,pose:10,aerial:true,baseKnockback:4.3}),
 uair:m('おててのびーる',5,[w(5,9,'up')],10,8,{damage:8,reach:125,pose:8,angle:-1.5,aerial:true}),
 dair:m('さすまた落とし',9,[w(9,13,'down')],11,14,{damage:11,reach:126,pose:11,angle:-.5,meteorFrame:11,meteorAngle:1.5,meteorMultiplier:1.2,bounceOnHit:-9,aerial:true}),
 dragon:m('なんとかなれーッ!!',10,[w(10,12,'front',{damage:3,baseKnockback:1.2,knockbackGrowth:.01}),w(17,19,'front',{damage:3,baseKnockback:1.4,knockbackGrowth:.012}),w(25,28,'front',{damage:9,pose:9})],12,12,{damage:9,reach:160,pose:15,chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,baseKnockback:4.8,knockbackGrowth:.079,timeline:[{frame:10,type:'SetVelocity',x:8},{frame:17,type:'SetVelocity',x:6},{frame:25,type:'SetVelocity',x:4}]}),
 dash:m('ハチワレヘルプ',14,[w(14,17,'front',{damage:5,reach:142}),w(23,26,'front',{damage:9,helper:true})],14,12,{damage:9,reach:154,pose:15,helperAttack:true,preserveVelocity:false,baseKnockback:4.2,knockbackGrowth:.073}),
 rise:m('さすまたポールジャンプ',7,[w(7,12,'up')],12,14,{damage:8,reach:132,pose:16,verticalImpulse:-19,angle:-1.4,aerial:true,actionCancelFrame:13,ledgeGrabStart:7}),
 gale:m('草むしりラッシュ',8,[w(8,9,'low',{damage:2,baseKnockback:1,knockbackGrowth:.008}),w(14,15,'low',{damage:2,baseKnockback:1.2,knockbackGrowth:.01}),w(23,27,'shockwave',{damage:8})],12,12,{damage:8,reach:165,pose:17,angle:-1.1,baseKnockback:4.5,knockbackGrowth:.07}),
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow'])moves[id]={...CombatData.moves[id],animation:{...CombatData.moves[id].animation},timeline:[...CombatData.moves[id].timeline]};
 moves.grab.name='さすまたでひっかける';moves.grab.reach=100;moves.pummel.name='こつこつ';
 moves.forwardThrow.name='押しだし投げ';moves.backThrow.name='ぐるっと投げ';moves.upThrow.name='ひょい上げ';moves.downThrow.name='おさえポンッ';
 for(const a of Object.values(moves))a.motionEndFrames=a.totalFrames;
 return moves;
})();

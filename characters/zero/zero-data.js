'use strict';
const ZeroMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,moves={};
 for(const[id,a]of Object.entries(UlgrimMoves))moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e}))};
 const names={jab:'Zセイバー・一閃',jab2:'Zセイバー・返し',jab3:'Zセイバー・三連斬',heavy:'セイバースラッシュ',up:'ライジングセイバー',low:'チェインロッド・足払い',dashAttack:'ロッドダッシュ',smash:'チャージセイバー',upsmash:'昇龍セイバー',downsmash:'旋回セイバー',air:'ローリングセイバー',fair:'エアスラッシュ',bair:'リバースセイバー',uair:'エアライジング',dair:'落下突き'};
 for(const[id,name]of Object.entries(names))moves[id].name=name;
 moves.jab3.pose=9;moves.grab={...moves.grab,name:'チェインロッド・つかみ',reach:105,pose:12};
 moves.dragon=m('バスターショット',12,[],16,12,{pose:13,spellShots:[12],zeroWeapon:'buster',chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,projectile:true});
 moves.dash=m('駆走りスラッシュ',16,[w(16,19)],13,12,{damage:12,reach:166,pose:15,bodyPassFrames:[[7,13]],intangibleFrames:[[7,13]],airControlMultiplier:0,velocityMultiplier:.3,ledgeGrabStart:20,timeline:[{frame:7,type:'DisableGravity'},{frame:7,type:'SetVelocity',x:16,y:0},{frame:16,type:'EnableGravity'},{frame:20,type:'SetVelocity',x:3}]});
 moves.rise=m('チェインロッドリフト',8,[w(8,10,'up',{damage:3,baseKnockback:1.4,knockbackGrowth:.015}),w(15,18,'up',{damage:9})],13,18,{damage:9,reach:166,pose:16,angle:-1.4,verticalImpulse:-19,aerial:true,actionCancelFrame:19,ledgeGrabStart:8});
 moves.gale=m('シールドブーメラン',13,[],17,12,{pose:13,spellShots:[13],zeroWeapon:'shield',projectile:true});
 moves.dragon.pose=41;moves.dragon.animation={...moves.dragon.animation,anticipationPose:40,accelerationPose:42};moves.gale.pose=45;moves.gale.animation={...moves.gale.animation,anticipationPose:44,accelerationPose:44};
 delete moves.counter;for(const a of Object.values(moves))a.motionEndFrames=a.totalFrames;return moves;
})();
const ZeroRules=(()=>{
 let objects=[];function reset(){objects=[];}
 function action(f){const a=f.attack;if(!a?.zeroWeapon||f.timer!==a.startupFrames||a.objectSpawned)return;a.objectSpawned=true;objects=objects.filter(o=>o.owner!==f.id||o.kind!==a.zeroWeapon);objects.push({kind:a.zeroWeapon,owner:f.id,face:f.face,x:f.x+f.face*(a.zeroWeapon==='buster'?55:40),y:f.y-(a.zeroWeapon==='buster'?65:36),vx:f.face*(a.zeroWeapon==='buster'?12:9),vy:0,age:0,charge:a.charge,tier:a.charge>=1?2:a.charge>=.5?1:0,returning:false,hits:new Set(),stale:a.staleMultiplier});}
 function box(o){return{x1:o.x-o.vx,y1:o.y-o.vy,x2:o.x,y2:o.y,radius:o.kind==='shield'?18:9+o.tier*6};}
 function tick(){for(const o of objects){const f=fighters[o.owner],enemy=BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}o.age++;if(o.kind==='shield'&&o.age>=27)o.returning=true;
 if(o.returning){const dx=f.x-o.x,dy=f.y-36-o.y,d=Math.hypot(dx,dy);if(d<22){f.zeroCatchUntil=frame+6;o.dead=true;continue;}o.vx=dx/d*11;o.vy=dy/d*11;}
 const old=o.x;o.x+=o.vx;o.y+=o.vy;const p=platforms[0];if(o.y>p.y&&o.y<p.y+90&&Math.max(old,o.x)>p.x&&Math.min(old,o.x)<p.x+p.w){if(o.kind==='shield')o.returning=true;else o.dead=true;}
 for(const enemy of BattlePlayers.targets(f)){if(o.dead)break;const phase=o.returning?'return':'out',b=box(o),touch=CombatSystem.contact(b,enemy),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(enemy.mode)&&CombatSystem.shieldCovers(enemy,b);
 if(!o.dead&&!o.hits.has(phase+':'+enemy.id)&&!enemy.respawn&&(touch||shield)&&!CombatSystem.protection(enemy).intangible){o.hits.add(phase+':'+enemy.id);const counter=enemy.attack;if(counter?.counterWindow&&enemy.timer>=counter.counterWindow[0]&&enemy.timer<=counter.counterWindow[1]){attack(enemy,counter.counterMove);enemy.inv=enemy.attack.totalFrames;}else CombatSystem.hit(f,enemy,{...CombatData.moves.dragon,type:o.kind==='buster'?'dragon':'gale',damage:o.kind==='buster'?5+o.tier*5:o.returning?6:7,charge:0,staleMultiplier:o.stale,projectile:true,angle:-.4,baseKnockback:o.kind==='buster'?2.8+o.tier:3.4,knockbackGrowth:.06+o.tier*.008,launchDirection:Math.sign(o.vx)||o.face},b,touch);if(o.kind==='buster')o.dead=true;}
 }if(o.age>110||o.x<-900||o.x>2300)o.dead=true;}objects=objects.filter(o=>!o.dead);}
 function hook(f){const t=f.timer;return{x:f.x+f.face*(30+Math.min(1,t/8)*42),y:f.y-40-Math.min(1,t/8)*150};}
 return{reset,action,tick,box,hook,get objects(){return objects}};
})();

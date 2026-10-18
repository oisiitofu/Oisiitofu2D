'use strict';
const RinMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,moves={};
 for(const[id,a]of Object.entries(UlgrimMoves))moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e}))};
 const names={jab:'マニ・カティ・一閃',jab2:'返し斬り',jab3:'交差斬り',heavy:'水平斬り',up:'すくい上げ',low:'足払い',dashAttack:'駆け抜け斬り',smash:'マニ・カティ斬',upsmash:'流星剣',downsmash:'双燕斬',air:'風の舞',fair:'前方斬り',bair:'振り向き斬り',uair:'昇り斬り',dair:'疾風突き'};
 for(const[id,name]of Object.entries(names))moves[id].name=name;moves.jab3.pose=9;moves.dair={...moves.dair,bounceOnHit:-8};
 moves.dragon=m('烈風刃',14,[],16,12,{pose:9,spellShots:[14],chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,projectile:true});
 const slash=(name,start,end,pose,next,opts={})=>m(name,start,[w(start,end,'front')],next?12:17,12,{damage:next?4:10,reach:next?151:181,pose,impulse:next?7:5,baseKnockback:next?1.6:5.2,knockbackGrowth:next?.018:.08,...(next?{cancel:{start:end+1,end:end+12,input:'special',next}}:{}),...opts});
 moves.dash=slash('流星連斬・一の太刀',9,11,15,'side2');
 moves.side2=slash('流星連斬・二の太刀',4,6,7,'side3');
 moves.side3=slash('流星連斬・三の太刀',6,8,9,'side4');
 moves.side4=slash('流星連斬・終の太刀',7,11,15,null);
 moves.rise=m('疾風翔輪',6,[w(6,9,'up',{damage:3,baseKnockback:1.2,knockbackGrowth:.01}),w(13,17,'up',{damage:8})],13,18,{damage:8,reach:158,pose:16,angle:-1.45,verticalImpulse:-19,aerial:true,airControlMultiplier:1.3,actionCancelFrame:18,ledgeGrabStart:6});
 moves.gale=m('回天剣',9,[w(9,10,'spin',{damage:3,baseKnockback:1.2,knockbackGrowth:.012}),w(14,15,'spin',{damage:3,baseKnockback:1.2,knockbackGrowth:.012}),w(21,24,'front',{damage:10,pose:15})],17,14,{damage:10,reach:172,pose:10,chargeFrame:3,chargeButton:'special',chargeMaxFrames:45,baseKnockback:5,knockbackGrowth:.08,timeline:[{frame:21,type:'SetVelocity',x:8}]});
 delete moves.counter;for(const a of Object.values(moves))a.motionEndFrames=a.totalFrames;return moves;
})();
const RinRules=(()=>{
 let objects=[];function reset(){objects=[];}
 function action(f){const a=f.attack;if(a?.type!=='dragon'||f.timer!==a.startupFrames||a.objectSpawned)return;a.objectSpawned=true;objects=objects.filter(o=>o.owner!==f.id);objects.push({kind:'wind',owner:f.id,face:f.face,x:f.x+f.face*46,y:f.y-37,vx:f.face*(10+a.charge*3),charge:a.charge,tier:a.charge>=1?2:a.charge>=.5?1:0,age:0,stale:a.staleMultiplier});}
 function box(o){return{x1:o.x-o.vx,y1:o.y,x2:o.x,y2:o.y,radius:12+o.tier*7};}
 function tick(){for(const o of objects){const f=fighters[o.owner],enemy=BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}o.age++;const old=o.x;o.x+=o.vx;const p=platforms[0];if(o.y>p.y&&o.y<p.y+90&&Math.max(old,o.x)>p.x&&Math.min(old,o.x)<p.x+p.w)o.dead=true;
 for(const enemy of BattlePlayers.targets(f)){if(o.dead)break;const b=box(o),touch=CombatSystem.contact(b,enemy),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(enemy.mode)&&CombatSystem.shieldCovers(enemy,b);if(!o.dead&&!enemy.respawn&&(touch||shield)&&!CombatSystem.protection(enemy).intangible){o.dead=true;const counter=enemy.attack;if(counter?.counterWindow&&enemy.timer>=counter.counterWindow[0]&&enemy.timer<=counter.counterWindow[1]){attack(enemy,counter.counterMove);enemy.inv=enemy.attack.totalFrames;}else CombatSystem.hit(f,enemy,{...CombatData.moves.dragon,type:'dragon',damage:6+o.tier*5,charge:0,staleMultiplier:o.stale,projectile:true,angle:-.4,baseKnockback:3.2+o.tier,knockbackGrowth:.065+o.tier*.009,launchDirection:o.face},b,touch);}
 }if(o.age>85||o.x<-900||o.x>2300)o.dead=true;}objects=objects.filter(o=>!o.dead);}
 return{reset,action,tick,box,get objects(){return objects}};
})();

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(RinMoves.dragon,{rangedInterval:40,rangedRearm:20});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('rin',{"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"fair":{"strike":[13],"windup":14},"smash":{"strike":[13,9],"windup":14},"jab3":{"strike":[6,7],"windup":14},"bair":{"strike":[7,10],"windup":14},"downsmash":{"strike":[17,7],"windup":14}});

'use strict';
const NiaMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,moves={};
 for(const[id,a]of Object.entries(UlgrimMoves))moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e}))};
 const names={jab:'リングブレード・一閃',jab2:'リングブレード・返し',jab3:'エーテルクロス',heavy:'バタフライスラッシュ',up:'アクアリフト',low:'リングスイープ',dashAttack:'リングダッシュ',smash:'バタフライエッジ',upsmash:'アクアスパイラル',downsmash:'エーテルサークル',air:'リングスピン',fair:'フロントエッジ',bair:'バックエッジ',uair:'アクアアッパー',dair:'エーテルダイブ'};
 for(const[id,name]of Object.entries(names))moves[id].name=name;moves.jab3.pose=9;moves.dair={...moves.dair,bounceOnHit:-8};
 moves.dragon=m('ヒーリングサークル',15,[],16,12,{pose:9,spellShots:[15],chargeFrame:5,chargeButton:'special',chargeMaxFrames:60,projectile:true});
 moves.dash=m('バタフライステップ',14,[w(14,18)],14,12,{damage:11,reach:161,pose:15,bodyPassFrames:[[5,10]],intangibleFrames:[[5,8]],airControlMultiplier:.3,velocityMultiplier:.3,timeline:[{frame:5,type:'SetVelocity',x:13},{frame:14,type:'SetVelocity',x:4}]});
 moves.rise=m('ドロマーチジャンプ',7,[w(7,10,'up',{damage:3,baseKnockback:1.3,knockbackGrowth:.015}),w(14,18,'up',{damage:8})],13,18,{damage:8,reach:151,pose:16,angle:-1.4,verticalImpulse:-19.5,aerial:true,airControlMultiplier:1.25,actionCancelFrame:19,ledgeGrabStart:7});
 moves.gale=m('アクアバースト',20,[w(20,25,'shockwave')],22,16,{damage:12,reach:190,pose:17,healOnHit:2,baseKnockback:4.8,knockbackGrowth:.075,angle:-.8});
 delete moves.counter;for(const a of Object.values(moves))a.motionEndFrames=a.totalFrames;return moves;
})();
const NiaRules=(()=>{
 let objects=[];function reset(){objects=[];}
 function heal(f,amount){const actual=Math.min(f.damage,amount);if(actual<=0)return;f.damage-=actual;f.niaHealUntil=frame+24;ring(f.x,f.y-35,'#8fffe1',75);label(f.x,f.y-100,'−'+actual.toFixed(1)+'%','#91ffe1');}
 function action(f){const a=f.attack;if(a?.type!=='dragon'||f.timer!==a.startupFrames||a.objectSpawned)return;a.objectSpawned=true;objects=objects.filter(o=>o.owner!==f.id);objects.push({kind:'healingRing',owner:f.id,face:f.face,x:f.x+f.face*44,y:f.y-35,vx:f.face*(8+a.charge*3),tier:a.charge>=1?2:a.charge>=.5?1:0,age:0,stale:a.staleMultiplier});}
 function box(o){return{x1:o.x-o.vx,y1:o.y,x2:o.x,y2:o.y,radius:15+o.tier*8};}
 function tick(){for(const o of objects){const f=fighters[o.owner],enemy=BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}o.age++;const old=o.x;o.x+=o.vx;const p=platforms[0];if(o.y>p.y&&o.y<p.y+90&&Math.max(old,o.x)>p.x&&Math.min(old,o.x)<p.x+p.w)o.dead=true;
 for(const enemy of BattlePlayers.targets(f)){if(o.dead)break;const b=box(o),touch=CombatSystem.contact(b,enemy),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(enemy.mode)&&CombatSystem.shieldCovers(enemy,b);if(!o.dead&&!enemy.respawn&&(touch||shield)&&!CombatSystem.protection(enemy).intangible){o.dead=true;const counter=enemy.attack;if(counter?.counterWindow&&enemy.timer>=counter.counterWindow[0]&&enemy.timer<=counter.counterWindow[1]){attack(enemy,counter.counterMove);enemy.inv=enemy.attack.totalFrames;}else CombatSystem.hit(f,enemy,{...CombatData.moves.dragon,type:'dragon',damage:6+o.tier*4,healOnHit:1+o.tier,charge:0,staleMultiplier:o.stale,projectile:true,angle:-.4,baseKnockback:3+o.tier,knockbackGrowth:.065+o.tier*.008,launchDirection:o.face},b,touch);}
 }if(o.age>85||o.x<-900||o.x>2300)o.dead=true;}objects=objects.filter(o=>!o.dead);}
 return{reset,action,tick,box,heal,get objects(){return objects}};
})();

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(NiaMoves.dragon,{rangedInterval:40,rangedRearm:20});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('nia',{"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"fair":{"strike":[13],"windup":14},"smash":{"strike":[13,9],"windup":14},"jab3":{"strike":[6,7],"windup":14},"bair":{"strike":[7,10],"windup":14},"downsmash":{"strike":[17,7],"windup":14}});

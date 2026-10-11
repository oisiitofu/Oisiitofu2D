'use strict';
const RikiMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,moves={};
 for(const[id,a]of Object.entries(UlgrimMoves))moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(v=>({...v}))};
 const names={jab:'ぽんっ',jab2:'つんつん',jab3:'かぶりんちょ',heavy:'なぎはらい',up:'もちあげ',low:'したばたき',dashAttack:'もふもふタックル',smash:'タンクラム',upsmash:'フリーズネイト',downsmash:'ごろごろスイープ',air:'もふもふスピン',fair:'どんっ',bair:'みみキック',uair:'ふわりリフト',dair:'くるくるっん',grab:'つかみ',pummel:'こつん',forwardThrow:'えいっ',backThrow:'くるりん',upThrow:'ぽよーっ',downThrow:'ぺたん'};
 for(const[id,name]of Object.entries(names)){moves[id].name=name;moves[id].reach*=.86;}
 moves.jab3.pose=9;moves.dair={...moves.dair,timeline:[],bounceOnHit:-8};moves.upsmash.element='ice';
 moves.dragon=m('バーニネイト',17,[],14,12,{pose:9,chargeFrame:5,chargeButton:'special',chargeMaxFrames:60,spawnObject:'fire',projectile:true,canClank:false});
 moves.dash=m('スニーキー',23,[w(23,27)],15,12,{damage:14,reach:160,pose:9,sneakStart:6,sneakEnd:22,sneakSpeed:6.5,airControlMultiplier:.3,baseKnockback:5.2,knockbackGrowth:.08,ledgeGrabStart:28,timeline:[{frame:6,type:'SetVelocity',x:6.5},{frame:23,type:'SetVelocity',x:10},{frame:28,type:'SetVelocity',x:2}]});
 moves.rise=m('ハッピーハッピーバルーン',10,[w(10,15,'up')],53,15,{damage:6,reach:132,pose:16,verticalImpulse:-16.5,aerial:true,angle:-1.4,glideStart:16,glideEnd:58,glideFallSpeed:1.6,glideGravity:.12,airControlMultiplier:1.4,actionCancelFrame:16,ledgeGrabStart:10,animation:{anticipationEnd:3,anticipationPose:3,accelerationPose:16,followThroughFrames:5,recoveryPose:5,lean:-.08,lunge:4,impactScale:1.12}});
 moves.gale=m('ラーギ',18,[],15,12,{pose:17,spawnObject:'poison',preserveVelocity:false});
 delete moves.counter;for(const a of Object.values(moves))a.motionEndFrames=a.totalFrames;
 return moves;
})();
const RikiRules=(()=>{
 let objects=[];
 function reset(){objects=[];for(const f of fighters)f.rikiStatus=null;}
 function onHit(f,o,a){if(a.element==='ice'){CombatSystem.freeze(o,Math.min(30,o.hitlag+8));return;}if(a.element==='burn'||a.element==='poison')o.rikiStatus={kind:a.element,owner:f.id,time:a.element==='burn'?90:120,age:0};}
 function action(f,i){const a=f.attack;if(!a)return;ChocoboRules.tick(f,i);if(a.sneakStart&&f.timer>=a.sneakStart&&f.timer<=a.sneakEnd)f.vx=f.face*a.sneakSpeed;if(!a.spawnObject||f.timer!==a.startupFrames||a.objectSpawned)return;a.objectSpawned=true;objects=objects.filter(o=>o.owner!==f.id||o.kind!==a.spawnObject);objects.push({kind:a.spawnObject,owner:f.id,face:f.face,x:f.x+f.face*40,y:f.y-32,vx:f.face*(7+4*a.charge),charge:a.charge,age:0,burst:0,hits:new Set(),stale:a.staleMultiplier});}
 function box(o){const r=o.kind==='fire'?18+o.charge*12:56;return{x1:o.x,y1:o.y,x2:o.x,y2:o.y,radius:r};}
 function tick(){for(const f of fighters){const s=f.rikiStatus;if(!s)continue;if(f.respawn||--s.time<0){f.rikiStatus=null;continue;}if(++s.age%30===0&&!f.inv){const amount=s.kind==='burn'?1.5:1.2,owner=fighters[s.owner];f.damage=Math.min(999,f.damage+amount);f.lastHit=s.owner;if(owner)owner.stats.damage+=amount;}}
 for(const o of objects){const f=fighters[o.owner],enemy=BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}o.age++;if(o.burst){if(++o.burst>14)o.dead=true;continue;}
 if(o.kind==='fire'){const prev=o.x;o.x+=o.vx;const main=platforms[0];if(o.y>main.y&&o.y<main.y+90&&Math.max(prev,o.x)>main.x&&Math.min(prev,o.x)<main.x+main.w){o.burst=1;continue;}}
 for(const enemy of BattlePlayers.targets(f)){if(o.dead)break;const b=box(o),touch=CombatSystem.contact(b,enemy),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(enemy.mode)&&CombatSystem.shieldCovers(enemy,b);
 if(!enemy.respawn&&!o.hits.has(enemy.id)&&(touch||shield)&&!CombatSystem.protection(enemy).intangible){o.hits.add(enemy.id);const counter=enemy.attack;if(counter?.counterWindow&&enemy.timer>=counter.counterWindow[0]&&enemy.timer<=counter.counterWindow[1]){attack(enemy,counter.counterMove);enemy.inv=enemy.attack.totalFrames;}else CombatSystem.hit(f,enemy,{...CombatData.moves.dragon,type:o.kind==='fire'?'dragon':'gale',damage:o.kind==='fire'?9+8*o.charge:3,charge:0,staleMultiplier:o.stale,projectile:true,element:o.kind==='fire'?'burn':'poison',angle:-.65,baseKnockback:o.kind==='fire'?4.5:1.3,knockbackGrowth:o.kind==='fire'?.075:.015,launchDirection:Math.sign(enemy.x-o.x)||o.face},b,touch);if(o.kind==='fire')o.burst=1;}
 }if(o.age>(o.kind==='fire'?90:180)||o.x<-900||o.x>2300)o.dead=true;}objects=objects.filter(o=>!o.dead);}
 return{reset,action,tick,onHit,box,get objects(){return objects}};
})();

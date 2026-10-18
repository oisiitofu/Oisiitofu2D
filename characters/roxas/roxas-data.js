'use strict';
const RoxasMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,moves={};
 for(const[id,a]of Object.entries(UlgrimMoves))moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(v=>({...v}))};
 const names={jab:'二刀連撃・一閃',jab2:'二刀連撃・返し',jab3:'二刀連撃・クロス',heavy:'デュアルスラッシュ',up:'ライジングスラッシュ',low:'ロースイープ',dashAttack:'ダッシュクロス',smash:'デュアルブレイク',upsmash:'ライトバースト',downsmash:'トワイライトスピン',air:'エアスピン',fair:'エリアルクロス',bair:'リバーススラッシュ',uair:'ライトリフト',dair:'ストライクフォール'};
 for(const[id,name]of Object.entries(names))moves[id].name=name;
 moves.dragon=m('マジックアワー',18,[],15,12,{pose:13,chargeFrame:5,chargeButton:'special',chargeMaxFrames:60,spawnLight:'orbs',projectile:true,canClank:false});
 moves.dash={...moves.dash,name:'スライドダッシュ',activeFrames:[w(16,19)],startupFrames:16,activeStart:16,activeEnd:19,totalFrames:32,FAF:33,recoveryFrames:13,pose:15,rushSpeed:15,bodyPassFrames:[[7,12]],intangibleFrames:[[7,12]],timeline:[{frame:7,type:'DisableGravity'},{frame:7,type:'SetVelocity',x:15,y:0},{frame:16,type:'EnableGravity'},{frame:20,type:'SetVelocity',x:3}]};
 moves.rise=m('アサルトアセンション',6,[w(6,9,'up',{damage:3,baseKnockback:1.2,knockbackGrowth:.01}),w(12,14,'up',{damage:3,baseKnockback:1.2,knockbackGrowth:.01}),w(17,20,'up',{damage:8})],12,18,{damage:8,reach:155,pose:16,angle:-1.45,verticalImpulse:-18.5,aerial:true,ledgeGrabStart:6,actionCancelFrame:21});
 moves.gale=m('ライトサークル',17,[],15,12,{pose:8,spawnLight:'circle',preserveVelocity:false});
 delete moves.counter;for(const a of Object.values(moves))a.motionEndFrames=a.totalFrames;return moves;
})();
const RoxasRules=(()=>{
 let objects=[];
 function reset(){objects=[];}
 function action(f){const a=f.attack;if(!a?.spawnLight||f.timer!==a.startupFrames||a.objectSpawned)return;a.objectSpawned=true;const kind=a.spawnLight;objects=objects.filter(o=>o.owner!==f.id||o.kind!==kind);const n=kind==='orbs'?3+Math.floor(a.charge*2):1;for(let j=0;j<n;j++){const x=f.x+f.face*(kind==='circle'?75:32),floor=platforms.filter(p=>x>=p.x&&x<=p.x+p.w&&p.y>=f.y-15).sort((a,b)=>a.y-b.y)[0];objects.push({kind,owner:f.id,face:f.face,x,y:kind==='circle'?(floor?.y??f.y+150):f.y-40+(j-(n-1)/2)*13,vx:f.face*9,age:kind==='orbs'?-j*4:0,charge:a.charge,hit:false,stale:a.staleMultiplier});}}
 function box(o){return o.kind==='orbs'?{x1:o.x,y1:o.y,x2:o.x,y2:o.y,radius:13}:{x1:o.x,y1:o.y-15,x2:o.x,y2:o.y-145,radius:48};}
 function tick(){for(const o of objects){const f=fighters[o.owner],enemy=BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}if(++o.age<0)continue;if(o.kind==='orbs')o.x+=o.vx;const active=o.kind==='orbs'?o.age<70:o.age>=45&&o.age<=52;
 for(const enemy of BattlePlayers.targets(f)){if(o.dead)break;if(active&&!o.hitTargets?.has(enemy.id)&&!enemy.respawn){const b=box(o),touch=CombatSystem.contact(b,enemy),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(enemy.mode)&&CombatSystem.shieldCovers(enemy,b);if((touch||shield)&&!CombatSystem.protection(enemy).intangible){(o.hitTargets??=new Set()).add(enemy.id);o.hit=true;const counter=enemy.attack;if(counter?.counterWindow&&enemy.timer>=counter.counterWindow[0]&&enemy.timer<=counter.counterWindow[1]){attack(enemy,counter.counterMove);enemy.inv=enemy.attack.totalFrames;}else CombatSystem.hit(f,enemy,{...CombatData.moves.dragon,type:o.kind==='orbs'?'dragon':'gale',damage:o.kind==='orbs'?3.5:14,charge:0,staleMultiplier:o.stale,projectile:true,angle:o.kind==='orbs'?-.35:-1.45,baseKnockback:o.kind==='orbs'?1.6:5,knockbackGrowth:o.kind==='orbs'?.025:.083,launchDirection:Math.sign(enemy.x-o.x)||o.face},b,touch);}}
 }if(o.age>(o.kind==='orbs'?75:62)||o.x<-900||o.x>2300)o.dead=true;}objects=objects.filter(o=>!o.dead);}
 return{reset,action,tick,box,get objects(){return objects}};
})();

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('roxas',{"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"fair":{"strike":[13],"windup":14},"smash":{"strike":[13,9],"windup":14},"bair":{"strike":[7,10],"windup":14},"jab3":{"strike":[6,7],"windup":14},"downsmash":{"strike":[17,7],"windup":14}});

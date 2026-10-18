'use strict';
const TwoBMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,moves={};
 for(const[id,a]of Object.entries(UlgrimMoves))moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(v=>({...v}))};
 const names={jab:'白の契約・一閃',jab2:'白の契約・返し',jab3:'白の約定・フィニッシュ',heavy:'横薙ぎ',up:'斬り上げ',low:'足元払い',dashAttack:'踏み込み連斬',smash:'白の約定・重斬',upsmash:'剣陣展開',downsmash:'旋回斬り',air:'浮遊剣・連続斬り',fair:'踏み込み斜め斬り',bair:'振り向き斬り',uair:'頭上斬り',dair:'落下斬り',grab:'ポッドアーム',pummel:'ポッド打撃'};for(const[id,name]of Object.entries(names))moves[id].name=name;
 moves.dragon=m('ポッド・プログラム：ガトリング',6,[],19,8,{pose:13,podShots:[6,10,14,18],shootWalkSpeed:2.3,projectile:true,canClank:false});
 moves.dash=m('ミラージュ・スライド',17,[w(17,20)],13,12,{damage:12,reach:170,pose:15,bodyPassFrames:[[6,12]],intangibleFrames:[[6,12]],airControlMultiplier:0,ledgeGrabStart:21,timeline:[{frame:6,type:'DisableGravity'},{frame:6,type:'SetVelocity',x:14,y:0},{frame:17,type:'EnableGravity'},{frame:21,type:'SetVelocity',x:2}]});
 moves.rise=m('アサルトホバー',6,[w(6,9,'up',{damage:3,baseKnockback:1.2,knockbackGrowth:.01}),w(12,14,'up',{damage:3,baseKnockback:1.2,knockbackGrowth:.01}),w(17,20,'up',{damage:7})],12,18,{damage:7,reach:151,pose:16,angle:-1.45,verticalImpulse:-18,aerial:true,ledgeGrabStart:6,actionCancelFrame:21});
 moves.gale=m('ポッド・プログラム：トラップサークル',16,[],16,12,{pose:8,podTrap:true,preserveVelocity:false});
 delete moves.counter;for(const a of Object.values(moves))a.motionEndFrames=a.totalFrames;return moves;
})();
const TwoBRules=(()=>{
 let objects=[];function reset(){objects=[];}
 function pod(f){return{x:f.x+f.face*37,y:f.y-82};}
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;
 if(a.podShots){if(f.grounded)f.vx=i.x*a.shootWalkSpeed;const event='pod-'+f.timer;if(a.podShots.includes(f.timer)&&!a.eventsDone.has(event)){a.eventsDone.add(event);const p=pod(f);objects.push({kind:'bullet',owner:f.id,face:f.face,x:p.x+f.face*13,y:p.y+28,vx:f.face*13,age:0,hit:false,stale:a.staleMultiplier});}}
 if(a.podTrap&&f.timer===a.startupFrames&&!a.objectSpawned){a.objectSpawned=true;objects=objects.filter(o=>o.owner!==f.id||o.kind!=='trap');const x=f.x+f.face*72,floor=platforms.filter(p=>x>=p.x&&x<=p.x+p.w&&p.y>=f.y-15).sort((a,b)=>a.y-b.y)[0];objects.push({kind:'trap',owner:f.id,face:f.face,x,y:floor?.y??f.y+150,age:0,hit:false,stale:a.staleMultiplier});}}
 function box(o){return o.kind==='bullet'?{x1:o.x-o.face*14,y1:o.y,x2:o.x,y2:o.y,radius:7}:{x1:o.x,y1:o.y-12,x2:o.x,y2:o.y-120,radius:49};}
 function tick(){for(const o of objects){const f=fighters[o.owner],enemy=BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}o.age++;if(o.kind==='bullet'){const old=o.x;o.x+=o.vx;const p=platforms[0];if(o.y>p.y&&o.y<p.y+90&&Math.max(old,o.x)>p.x&&Math.min(old,o.x)<p.x+p.w)o.dead=true;}
 const active=o.kind==='bullet'?o.age<55:o.age>=36&&o.age<=45;
 for(const enemy of BattlePlayers.targets(f)){if(o.dead)break;if(active&&!o.dead&&!o.hitTargets?.has(enemy.id)&&!enemy.respawn){const b=box(o),touch=CombatSystem.contact(b,enemy),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(enemy.mode)&&CombatSystem.shieldCovers(enemy,b);if((touch||shield)&&!CombatSystem.protection(enemy).intangible){(o.hitTargets??=new Set()).add(enemy.id);o.hit=true;const counter=enemy.attack;if(counter?.counterWindow&&enemy.timer>=counter.counterWindow[0]&&enemy.timer<=counter.counterWindow[1]){attack(enemy,counter.counterMove);enemy.inv=enemy.attack.totalFrames;}else CombatSystem.hit(f,enemy,{...CombatData.moves.dragon,type:o.kind==='bullet'?'dragon':'gale',damage:o.kind==='bullet'?2.2:13,charge:0,staleMultiplier:o.stale,projectile:true,hitlagMultiplier:o.kind==='bullet'?.35:1,angle:o.kind==='bullet'?-.25:-1.4,baseKnockback:o.kind==='bullet'?1:4.8,knockbackGrowth:o.kind==='bullet'?.015:.08,launchDirection:Math.sign(enemy.x-o.x)||o.face},b,touch);if(o.kind==='bullet')o.dead=true;}}
 }if(o.age>(o.kind==='bullet'?55:58)||o.x<-900||o.x>2300)o.dead=true;}objects=objects.filter(o=>!o.dead);}
 return{reset,action,tick,box,pod,get objects(){return objects}};
})();

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(TwoBMoves.dragon,{rangedInterval:48,rangedRearm:24});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('twob',{"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"fair":{"strike":[13],"windup":14},"smash":{"strike":[13,9],"windup":14},"bair":{"strike":[7,10],"windup":14},"jab3":{"strike":[6,7],"windup":14},"downsmash":{"strike":[17,7],"windup":14}});

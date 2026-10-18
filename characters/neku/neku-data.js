'use strict';
// Inclusive one-based 60 Hz timings. All hit, casting and warp events use the move clock.
const NekuMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,s,e,damage,reach,pose=9,shape='front',opts={})=>m(name,s,[w(s,e,shape)],10,0,{damage,reach,pose,...opts});
 const moves={
  jab:cut('ショックウェーブ1',5,6,3,123,6,'front',{baseKnockback:1.5,knockbackGrowth:.022,cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:cut('ショックウェーブ2',4,5,4,139,7,'front',{cancel:{start:6,end:15,input:'jab',next:'jab3'}}),
  jab3:cut('フォースラウンド',7,9,8,170,9,'front',{soundFamily:'dark'}),
  heavy:cut('サイコスラッシュ',8,11,10,178),
  up:cut('サイコキネシス・リフト',6,12,8,146,8,'up',{angle:-1.42,soundFamily:'earth'}),
  low:cut('スライドショック',7,8,7,154,17,'low',{angle:-.22,soundFamily:'punch'}),
  dashAttack:m('ベロシティアタック',12,[w(12,15)],13,0,{damage:11,reach:174,pose:15,impulse:4}),
  smash:m('ヴォルテックスセイバー',13,[w(13,16)],23,0,{damage:20,reach:216,pose:9,baseKnockback:6,knockbackGrowth:.1,chargeFrame:4,chargeMaxFrames:60}),
  upsmash:m('サンダーボルト',15,[w(15,19,'up')],23,0,{damage:19,reach:205,pose:8,angle:-1.5,baseKnockback:6,knockbackGrowth:.095,chargeFrame:5,chargeMaxFrames:60,soundFamily:'thunder'}),
  downsmash:m('グレイブマーカー',12,[w(12,14,'low'),w(20,23,'back')],22,0,{damage:16,reach:193,pose:17,baseKnockback:5.4,knockbackGrowth:.09,chargeFrame:4,chargeMaxFrames:60,soundFamily:'dark'}),
  air:m('ショックウェーブ・スピン',6,[w(6,9,'spin')],12,7,{damage:8,reach:158,pose:10,aerial:true}),
  fair:m('パイロキネシス・スイープ',6,[w(6,8)],12,10,{damage:10,reach:173,pose:9,aerial:true,soundFamily:'fire'}),
  bair:m('サイコキネシス・バックキック',7,[w(7,11,'back')],12,10,{damage:11,reach:166,pose:10,aerial:true,soundFamily:'punch'}),
  uair:m('ライトニング・スパーク',5,[w(5,9,'up')],13,8,{damage:9,reach:161,pose:8,aerial:true,angle:-1.5,soundFamily:'thunder'}),
  dair:m('グラビティドロップ',9,[w(9,13,'plunge')],16,14,{damage:13,reach:128,pose:11,aerial:true,meteorFrame:11,meteorAngle:1.45,soundFamily:'dark'}),
  dragon:m('パイロキネシス',12,[w(12,14)],15,12,{damage:7,reach:150,pose:13,chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,soundFamily:'fire',trailSpacing:48,trailCount:5,trailDelay:3,trailActive:3,trailLife:22,canClank:false}),
  dash:m('サイコキネシス・ロック',10,[w(10,12)],20,14,{damage:3,reach:300,pose:12,psychicLock:true,pull:true,fixedKnockback:12,canClank:false,soundFamily:'dark',lockRadius:25,branchStart:14,branchEnd:30,airControlMultiplier:.2}),
  psyThrow:m('サイコキネシス・スロー',4,[],16,14,{pose:13,special:true,projectile:true,spellShots:[4],soundFamily:'earth',rockSpeed:12,rockLife:40}),
  psyReel:m('サイコキネシス・リポジション',6,[w(6,8)],16,14,{damage:10,reach:165,pose:15,special:true,repositionFrame:4,intangibleFrames:[[4,4]],soundFamily:'punch',airControlMultiplier:.3}),
  rise:m('テレポート',24,[w(24,26,'spin')],12,18,{damage:7,reach:140,pose:16,soundFamily:'light',selectionStart:4,selectionEnd:19,selectionSpeed:11,selectionRadius:320,warpFrame:22,intangibleFrames:[[20,23]],airControlMultiplier:0,gravityMultiplier:0,helpless:true,ledgeGrabStart:22,animation:{anticipationEnd:3,anticipationPose:14,accelerationPose:16,followThroughFrames:4,recoveryPose:5,lean:0,lunge:0,impactScale:1.07}}),
  gale:m('ライトニングルーク',15,[],20,16,{pose:8,spellShots:[15],projectile:true,chargeFrame:5,chargeButton:'special',chargeMaxFrames:60,soundFamily:'thunder',nearDistance:80,farDistance:270,warningFrames:10,strikeFrames:3,strikeHeight:175,strikeRadius:24,airSpeed:20,airLife:22,airControlMultiplier:.3})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e}))};}
 for(const[id,name]of Object.entries({grab:'サイコグリップ',pummel:'掌打',forwardThrow:'サイコプッシュ',backThrow:'リバースキネシス',upThrow:'サンダーリフト',downThrow:'グラウンドクラッシュ'}))moves[id].name=name;
 moves.rise.ledgeGrabStart=moves.rise.warpFrame;
 moves.rise.vanishStart=20;moves.rise.vanishEnd=21;moves.rise.vanishAlpha=.08;
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;if(a!==moves.rise)a.animation={...a.animation,anticipationPose:14};}
 return moves;
})();
const NekuRules=(()=>{
 let objects=[];
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='neku')f.nekuSideUsed=false;}
 function terrain(x,y){const p=platforms.find(p=>p.main);return x>p.x&&x<p.x+p.w&&y>p.y&&y<p.y+90;}
 function clearLine(x,y,tx,ty){const n=Math.max(1,Math.ceil(Math.hypot(tx-x,ty-y)/6));for(let j=1;j<=n;j++)if(terrain(lerp(x,tx,j/n),lerp(y,ty,j/n)))return false;return true;}
 function surface(x,y,maxDrop=1000){return platforms.filter(p=>x>=p.x&&x<=p.x+p.w&&p.y>=y-5&&p.y<=y+maxDrop).sort((a,b)=>a.y-b.y)[0];}
 // Sweep the complete body, not just the destination, against the solid island.
 function safeWarp(f,target){const p=platforms.find(p=>p.main),e=f.character.ecb,dx=target.x-f.x,dy=target.y-f.y,n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/6));let q={x:f.x,y:f.y,blocked:false};for(let j=1;j<=n;j++){const x=f.x+dx*j/n,y=f.y+dy*j/n;if(StageGeometry.overlaps(p,x,y,e.radius,e.height)){q.blocked=true;break;}q={x,y,blocked:false};}return q;}
 function spawn(f,kind,v={}){const o={kind,owner:f.id,face:f.face,x:f.x+f.face*35,y:f.y-35,vx:0,vy:0,age:0,life:35,hits:new Set(),stale:f.attack?.staleMultiplier??1,...v};objects.push(o);return o;}
 function teleport(f,target){const from={x:f.x,y:f.y},q=safeWarp(f,target);f.x=q.x;f.y=q.y;f.grounded=false;f.fastFall=false;f.vx=f.vy=0;for(const v of[from,q])spawn(f,'warpFlash',{x:v.x,y:v.y-35,life:13});GameAudio.cue('light-cast',.75,f);return q;}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;
  if(a.type==='dash'){const o=BattlePlayers.target(f),dx=o.x-f.x;a.lockPoint=!o.respawn&&dx*f.face>0&&Math.abs(dx)<=a.reach&&Math.abs(o.y-f.y)<100&&clearLine(f.x,f.y-35,o.x,o.y-35)?{x:o.x,y:o.y-35}:{x:f.x+f.face*160,y:f.y-35};if(!f.grounded)f.nekuSideUsed=true;}
  if(a.type==='rise'){a.warpOrigin={x:f.x,y:f.y};a.warpTarget={x:f.x,y:f.y-185};if(f.grounded)f.y-=2;f.grounded=false;f.recovered=true;f.fastFall=false;f.vx=f.vy=0;f.specialLandingLag=a.landingLagFrames;}
 }
 function onHit(f,o,a){if(a.type==='dash'&&f.attack?.type==='dash')f.attack.lockedTarget=o.id;}
 function branch(f,id,i){const old=f.attack,target=old.lockedTarget,point=old.lockPoint;attack(f,id);f.attack.lockedTarget=target;f.attack.lockPoint=point;f.attack.aimY=clamp(i.y,-1,1);if(i.x)f.face=Math.sign(i.x);}
 function action(f,i=emptyInput()){let a=f.attack;if(!a)return;const t=f.timer;
  if(a.type==='dash'&&t>=a.branchStart&&t<=a.branchEnd){const b=f.buffer;if(i.special||b?.key==='special'){branch(f,'psyThrow',i);return;}if(i.jab||i.heavy||['jab','heavy'].includes(b?.key)){branch(f,'psyReel',i);return;}}
  if(a.type==='psyReel'&&t===a.repositionFrame&&!a.warped){a.warped=true;const o=a.lockedTarget!==undefined?fighters[a.lockedTarget]:null,protectedTarget=o&&(CombatSystem.protection(o).invincible||CombatSystem.protection(o).intangible||['ShieldHold','ShieldStart'].includes(o.mode));const q=teleport(f,o&&!o.respawn&&!protectedTarget&&Math.hypot(o.x-f.x,o.y-f.y)<230?{x:o.x+f.face*55,y:o.y}:{x:f.x+f.face*65,y:f.y});a.warpBlocked=q.blocked;if(a.originGrounded&&surface(f.x,f.y,5)){f.grounded=true;f.vy=0;}if(o&&!protectedTarget)f.face=Math.sign(o.x-f.x)||-f.face;}
  if(a.type==='rise'){
   if(t>=a.selectionStart&&t<=a.selectionEnd){const v=Math.max(1,Math.hypot(i.x,i.y)),dx=a.warpTarget.x-a.warpOrigin.x+i.x/v*a.selectionSpeed,dy=a.warpTarget.y-a.warpOrigin.y+i.y/v*a.selectionSpeed,r=Math.hypot(dx,dy),s=Math.min(1,a.selectionRadius/Math.max(1,r));a.warpTarget={x:a.warpOrigin.x+dx*s,y:a.warpOrigin.y+dy*s};f.vx=f.vy=0;f.fastFall=false;}
   if(t===a.warpFrame&&!a.warped){a.warped=true;const q=teleport(f,a.warpTarget);a.warpBlocked=q.blocked;a.gravityMultiplier=1;f.vy=-1.5;}
  }
  if(t!==a.startupFrames||a.objectSpawned)return;
  if(a.type==='dragon'){a.objectSpawned=true;if(a.charge>=.2){const group={hits:new Map()},count=1+Math.floor(a.charge*(a.trailCount-1));for(let j=0;j<count;j++){const x=f.x+f.face*(70+j*a.trailSpacing),p=surface(x,f.y,40);if(p&&clearLine(f.x,f.y-20,x,p.y-20))spawn(f,'flame',{x,y:p.y-28,damage:4+3*a.charge,charge:a.charge,group,delay:j*a.trailDelay,activeFrames:a.trailActive,life:a.trailLife+j*a.trailDelay});}}}
  if(a.type==='psyThrow'){a.objectSpawned=true;const angle=a.aimY*.6;spawn(f,'rock',{vx:f.face*Math.cos(angle)*a.rockSpeed,vy:Math.sin(angle)*a.rockSpeed,damage:10,life:a.rockLife});}
  if(a.type==='gale'){a.objectSpawned=true;if(a.originGrounded){const x=f.x+f.face*lerp(a.nearDistance,a.farDistance,a.charge),p=surface(x,f.y);if(p)spawn(f,'lightning',{x,y:p.y,damage:11+6*a.charge,charge:a.charge,delay:a.warningFrames,activeFrames:a.strikeFrames,height:a.strikeHeight,radius:a.strikeRadius,life:a.warningFrames+a.strikeFrames+9});}else spawn(f,'bolt',{x:f.x+f.face*28,y:f.y-35,vx:f.face*a.airSpeed*.55,vy:a.airSpeed*.84,damage:10+5*a.charge,life:a.airLife});}
 }
 function lockBox(f,a,w){const p=a.lockPoint??{x:f.x+f.face*160,y:f.y-35};return[{x1:p.x,y1:p.y,x2:p.x,y2:p.y,radius:a.lockRadius,window:w}];}
 function active(o){return o.kind==='rock'||o.kind==='bolt'||['flame','lightning'].includes(o.kind)&&o.age>=o.delay&&o.age<o.delay+o.activeFrames;}
 function box(o){if(o.kind==='lightning')return{x1:o.x,y1:o.y-8,x2:o.x,y2:o.y-o.height,radius:o.radius};if(o.kind==='flame')return{x1:o.x,y1:o.y+15,x2:o.x,y2:o.y-25,radius:22};return{x1:o.previousX??o.x,y1:o.previousY??o.y,x2:o.x,y2:o.y,radius:o.kind==='rock'?20:13};}
 function collide(o,f,unused){for(const e of BattlePlayers.targets(f)){if(o.dead)break;collideOne(o,f,e);}}
 function collideOne(o,f,e){if(!active(o)||e.respawn||e.hitlag||o.hits.has(e.id)||o.group?.hits.get(e.id)>=2)return;const b=box(o),touch=CombatSystem.contact(b,e),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(e.mode)&&CombatSystem.shieldCovers(e,b);if(!(touch||shield)||CombatSystem.protection(e).intangible)return;o.hits.add(e.id);if(o.group)o.group.hits.set(e.id,(o.group.hits.get(e.id)||0)+1);const counter=e.attack;if(counter?.counterWindow&&e.timer>=counter.counterWindow[0]&&e.timer<=counter.counterWindow[1]){attack(e,counter.counterMove);e.inv=e.attack.totalFrames;}else CombatSystem.hit(f,e,{...NekuMoves.gale,type:o.kind==='flame'?'dragon':o.kind==='rock'?'psyThrow':'gale',damage:o.damage,charge:0,staleMultiplier:o.stale,projectile:true,soundFamily:o.kind==='flame'?'fire':o.kind==='rock'?'earth':'thunder',baseKnockback:4.1,knockbackGrowth:.07,angle:o.kind==='lightning'?-1.4:-.45,launchDirection:o.face},b,touch);if(['rock','bolt'].includes(o.kind))o.dead=true;}
 function tick(){for(const f of fighters)if(f.characterId==='neku'&&(f.grounded||f.ledge||f.respawn))f.nekuSideUsed=false;for(const o of objects){const f=fighters[o.owner],e=BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}o.age++;o.previousX=o.x;o.previousY=o.y;if(['rock','bolt'].includes(o.kind)){const n=Math.max(1,Math.ceil(Math.hypot(o.vx,o.vy)/5));for(let j=0;j<n;j++){o.x+=o.vx/n;o.y+=o.vy/n;if(terrain(o.x,o.y)){spawn(f,'spark',{x:o.x,y:o.y,life:10});o.dead=true;break;}}if(!o.dead)collide(o,f,e);}else{if(o.age===o.delay)GameAudio.cue(o.kind==='flame'?'fire-cast':'thunder-cast',.7,f);collide(o,f,e);}if(o.age>=o.life||o.x<-900||o.x>2300||o.y>1600||o.y<-1100)o.dead=true;}objects=objects.filter(o=>!o.dead);}
 function cpu(f,o,i){const p=platforms.find(p=>p.main),under=f.y>p.y+25&&f.x>p.x-20&&f.x<p.x+p.w+20;if(f.attack?.type==='rise'){const a=f.attack;i.x=f.x<p.x?1:f.x>p.x+p.w?-1:0;i.y=f.y>p.y-80?-1:0;if(a.warpTarget.y<p.y-130)i.y=0;i.special=i.guard=i.guardPressed=i.jab=i.heavy=i.smash=false;}else if(!f.attack&&under&&!f.recovered){const dir=f.x<p.x+p.w/2?-1:1,dist=dir<0?f.x-p.x:p.x+p.w-f.x;i.x=dir;i.y=dist<50?-1:0;i.special=dist<50;i.jump=dist>=50&&f.airJumps>0&&f.vy>0;i.jab=i.heavy=i.smash=i.guard=false;}if(f.attack?.type==='dash'&&f.timer>=f.attack.branchStart){i.special=f.attack.lockedTarget!==undefined||Math.abs(o.x-f.x)>120;i.jab=!i.special;i.y=0;}if(f.attack?.type==='dragon')i.specialHeld=Math.abs(o.x-f.x)>170&&f.attack.chargeFrames<45;if(f.attack?.type==='gale')i.specialHeld=Math.abs(o.x-f.x)>170&&f.attack.chargeFrames<55;return i;}
 return{reset,prepare,action,onHit,tick,cpu,lockBox,safeWarp,terrain,surface,box,active,get objects(){return objects;}};
})();

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('neku',{"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"fair":{"strike":[13],"windup":14},"smash":{"strike":[13,9],"windup":14},"jab3":{"strike":[6,7],"windup":14},"bair":{"strike":[7,10],"windup":14},"downsmash":{"strike":[17,7],"windup":14}});

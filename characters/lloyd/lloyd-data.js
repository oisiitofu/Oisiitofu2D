'use strict';
// One-based inclusive windows drive two sword paths and input branches.
const LloydMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,link={damage:3,baseKnockback:1.4,knockbackGrowth:.014};
 const cut=(name,s,e,d,r,p=6,shape='front',extra={})=>m(name,s,[w(s,e,shape)],11,0,{damage:d,reach:r,pose:p,lloydBlade:true,soundFamily:'sword',...extra});
 const moves={
 jab:cut('右剣の斬り',5,6,3,164,6,'front',{cancel:{start:7,end:16,input:'jab',next:'jab2'}}),
 jab2:cut('左剣の追撃',4,6,4,170,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab3'}}),jab3:cut('両剣の交差',8,10,8,190,9),
 heavy:cut('ソニックスラスト',8,11,10,194),up:cut('両剣すくい上げ',7,11,8,165,8,'up',{angle:-1.45}),low:cut('低い薙ぎ',7,9,7,178,17,'low'),
 dashAttack:cut('滑り込み二連斬り',12,15,10,186,15,'low',{impulse:4}),
 smash:m('虎牙破斬',12,[w(12,14,'front',{...link,pose:6}),w(22,25,'front',{damage:17,pose:9})],25,0,{damage:17,reach:216,pose:9,lloydBlade:true,chargeFrame:4,chargeMaxFrames:60,baseKnockback:6.2,knockbackGrowth:.1,soundFamily:'sword'}),
 upsmash:m('獅吼滅龍閃',13,[w(13,15,'up',{...link,pose:16}),w(21,24,'up',{damage:18,pose:8})],25,0,{damage:18,reach:195,pose:8,lloydBlade:true,chargeFrame:4,chargeMaxFrames:60,angle:-1.5,soundFamily:'sword'}),
 downsmash:m('魔神双破斬',11,[w(11,13,'low',{pose:17}),w(21,24,'back',{damage:17,pose:7})],23,0,{damage:15,reach:195,pose:17,lloydBlade:true,chargeFrame:4,chargeMaxFrames:60,soundFamily:'sword'}),
 air:m('両剣回転',6,[w(6,8,'spin',{...link,pose:10}),w(16,20,'spin',{damage:7,pose:10})],12,8,{damage:7,reach:162,pose:10,lloydBlade:true,aerial:true,soundFamily:'sword'}),
 fair:cut('クロス斬り',7,10,11,180,9,'front',{aerial:true,landingLagFrames:11}),bair:cut('後方回し斬り',8,11,12,177,7,'back',{aerial:true,landingLagFrames:11}),
 uair:cut('頭上かち上げ',6,10,10,165,8,'up',{aerial:true,landingLagFrames:9,angle:-1.5}),dair:cut('落下二刀斬り',10,14,13,180,11,'down',{aerial:true,landingLagFrames:15,meteorFrame:12,meteorAngle:1.48,lloydBounce:true}),
 dragon:m('魔神剣',12,[],18,13,{pose:13,projectile:true,spellShots:[12],majin:true,chargeFrame:4,chargeButton:'special',chargeMaxFrames:55,soundFamily:'sword'}),
 dash:cut('虎牙連斬 I',8,10,4,171,6,'front',{tiger:true,step:1,branch:[11,21],perfect:[14,17],stepFrames:[5,10],stepSpeed:2.5,landingLagFrames:14,recoveryFrames:16,totalFrames:26}),
 tigerTwo:cut('虎牙連斬 II',6,8,4,180,9,'front',{tiger:true,step:2,branch:[9,20],perfect:[12,15],stepFrames:[3,8],stepSpeed:2,special:true,landingLagFrames:14,recoveryFrames:16,totalFrames:24}),
 tigerLift:cut('虎牙連斬 III・斬り上げ',7,10,5,180,16,'up',{tiger:true,step:3,branch:[11,22],perfect:[14,17],angle:-1.4,liftFrame:7,special:true,landingLagFrames:16,recoveryFrames:17,totalFrames:27}),
 tigerFinish:cut('虎牙連斬 IV・二刀落とし',8,12,14,195,11,'down',{tigerFinish:true,special:true,landingLagFrames:18,landingMove:'tigerLanding',recoveryFrames:23,totalFrames:35}),
 tigerLanding:m('虎牙連斬・着地',1,[w(1,3,'shockwave')],17,0,{damage:7,reach:170,pose:17,special:true,soundFamily:'earth'}),
 tigerCancel:m('虎牙連斬・引き構え',1,[],10,10,{pose:18,special:true,soundFamily:'wind'}),
 rise:m('秋沙雨テンペスト',8,[w(8,10,'spin',{...link,damage:2,pose:10}),w(12,14,'up',{...link,damage:2,pose:16}),w(16,18,'spin',{...link,damage:2,pose:10}),w(20,23,'up',{...link,damage:2,pose:16}),w(26,28,'spin',{...link,damage:2,pose:10}),w(30,33,'spin',{...link,damage:2,pose:10})],3,24,{damage:2,reach:162,pose:16,lloydBlade:true,tempest:true,launch:8,ascentEnd:23,branch:[24,35],gravityMultiplier:0,airControlMultiplier:0,helpless:true,ledgeGrabStart:8,soundFamily:'sword',animationWindows:[{start:24,end:35,pose:10}]}),
 tempestSail:m('テンペスト・横旋回',4,[w(4,8,'spin',{...link,pose:10}),w(12,15,'front',{damage:9,pose:9})],18,24,{damage:9,reach:182,pose:10,lloydBlade:true,tempestSail:true,special:true,airControlMultiplier:0,gravityMultiplier:0,helpless:true,ledgeGrabStart:4,soundFamily:'sword'}),
 tempestDrop:cut('テンペスト・落下締め',5,35,11,178,11,'down',{tempestDrop:true,special:true,diveSpeed:10,landingMove:'tempestLanding',helpless:true,ledgeGrabStart:5,landingLagFrames:24,airControlMultiplier:.25}),
 tempestLanding:m('テンペスト・着地',1,[w(1,4,'shockwave')],24,0,{damage:8,reach:182,pose:17,special:true,soundFamily:'earth'}),
 gale:m('守護方陣',18,[],24,0,{pose:18,guardCircle:true,circleCooldown:180,soundFamily:'light'}),
 airRebound:m('落下斬り・反動',1,[],9,15,{pose:4,aerial:true,special:true,soundFamily:'wind'})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:id==='pummel'?'punch':'sword'};}
 moves.ledge.pose=6;moves.getupAttack.pose=17;moves.getupAttack.activeFrames[1].pose=7;
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;a.FAF=a.totalFrames+1;a.animation={...a.animation,anticipationPose:14,accelerationPose:14,lean:0,lunge:0,impactScale:1};if(!a.helpless){a.landingFlag=[Math.max(2,a.startupFrames-1),a.totalFrames];a.autoCancelWindow=[[1,a.autoCancelEnd],[a.totalFrames,Infinity]];}}
 return moves;
})();
const LloydRules=(()=>{
 let objects=[],serial=0;
 function reset(){objects=[];serial=0;for(const f of fighters)if(f.characterId==='lloyd'){f.lloydSideUsed=false;f.lloydCircleCooldown=0;}}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;if(a.tiger){a.rhythm=0;if(a.step===1&&!f.grounded)f.lloydSideUsed=true;}if(a.tempest){a.direction=f.face;a.shifted=false;a.ceilingFrames=0;const p=platforms.find(p=>p.main);a.escapeUnder=f.y>p.y+35&&f.x>p.x-20&&f.x<p.x+p.w+20;f.vx=f.vy=0;}if(a.tempestSail||a.tempestDrop){f.grounded=false;f.recovered=true;f.specialLandingLag=24;}if(a.guardCircle)f.lloydCircleCooldown=a.circleCooldown;}
 function branch(f,id,a,perfect){const rhythm=(a.rhythm||0)+(perfect?1:0),originGrounded=a.originGrounded;f.buffer=null;attack(f,id);const b=f.attack;b.rhythm=rhythm;b.originGrounded=originGrounded;b.damage+=rhythm*(b.tigerFinish?1.5:.5);b.reach*=1+rhythm*.025;if(perfect)GameAudio.cue('light-cast',.45,f);}
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.majin&&t===12&&!a.eventsDone.has('wave')){a.eventsDone.add('wave');spawn(f,{kind:'wave',x:f.x+f.face*35,y:f.y-15,vx:f.face*(10+3*a.charge),radius:13+7*a.charge,damage:7+6*a.charge,life:40,charge:a.charge,groundWave:f.grounded});}
  if(a.tiger){if(a.stepFrames&&t>=a.stepFrames[0]&&t<=a.stepFrames[1])f.vx=f.face*a.stepSpeed;if(a.liftFrame&&t===a.liftFrame){f.grounded=false;f.vy=-7;f.vx=f.face*1.5;f.fastFall=false;}if(i.guardPressed&&(a.step===1&&t<=6||t>=a.branch[0]&&t<=a.branch[1])){f.buffer=null;attack(f,'tigerCancel');f.vx=-f.face*4;return;}if(t>=a.branch[0]&&t<=a.branch[1]&&i.special){branch(f,a.step===1?'tigerTwo':a.step===2?'tigerLift':'tigerFinish',a,t>=a.perfect[0]&&t<=a.perfect[1]);return;}}
  if(a.tigerFinish&&t===8&&!f.grounded){f.vy=7;f.vx=f.face*2;f.fastFall=false;}
  if(a.tempest){f.fastFall=false;if(t<8&&Math.abs(i.x)>.2)a.direction=Math.sign(i.x);if(t===8&&!a.launched){a.launched=true;f.grounded=false;f.recovered=true;f.specialLandingLag=24;GameAudio.cue('double-jump',.7,f);}if(t>=8&&t<=23){const p=platforms.find(p=>p.main),ceiling=p.y+90+f.character.ecb.height,blocked=f.y>=ceiling&&f.y-13<ceiling&&f.x>p.x-BODY_RADIUS&&f.x<p.x+p.w+BODY_RADIUS;const u=(t-8)/15;f.grounded=false;f.vy=-13+4*u;f.vx=a.direction*2+clamp(i.x,-1,1)*3+Math.sin((t-8)*Math.PI/3)*2;if(blocked&&a.ceilingFrames<32&&Math.abs(i.x)>.2){a.ceilingFrames++;f.timer=7;f.vx=Math.sign(i.x)*8;}if(t>=14&&t<=20&&i.special&&!a.shifted){a.shifted=true;a.direction=Math.abs(i.x)>.2?Math.sign(i.x):-a.direction;f.vx=0;GameAudio.cue('wind-cast',.5,f);}}if(t>=24&&t<=35){f.vx=clamp(i.x,-1,1)*5;f.vy=.3;f.grounded=false;if(i.special){if(i.y>.45)attack(f,'tempestDrop');else{f.face=Math.abs(i.x)>.2?Math.sign(i.x):a.direction;attack(f,'tempestSail');}f.buffer=null;return;}}if(t===36){f.face=Math.abs(i.x)>.2?Math.sign(i.x):a.direction;attack(f,'tempestSail');return;}}
  if(a.tempestSail){f.fastFall=false;if(t<=16){f.grounded=false;f.vx=f.face*(6+clamp(i.x*f.face,-1,1)*2);f.vy=-2.5+(t-1)*.4;}else a.gravityMultiplier=1;}
  if(a.guardCircle&&t===18&&!a.eventsDone.has('circle')){a.eventsDone.add('circle');const floor=platforms.filter(p=>f.x>=p.x&&f.x<=p.x+p.w&&p.y>=f.y-6&&p.y-f.y<=220).sort((a,b)=>a.y-b.y)[0];if(floor)spawn(f,{kind:'circle',x:f.x,y:floor.y-12,vx:0,radius:80,damage:3,delay:10,life:90,hitTimes:new Map()});}
 }
 function onHit(f,o,a){if(a.lloydBounce&&f.attack?.lloydBounce){const recovered=f.recovered;attack(f,'airRebound');f.vy=-5;f.grounded=false;f.fastFall=false;f.recovered=recovered;}}
 // Each authored pose has two distinct sword roots and tips; reflect coordinates once.
 const geometry={6:[[10,-69,0],[10,-60,.02]],7:[[-8,-76,Math.PI],[-8,-64,Math.PI]],8:[[-10,-106,-1.57],[10,-105,-1.4]],9:[[-12,-94,-.6],[20,-59,.12]],10:[[8,-72,-.08],[-8,-66,Math.PI+.1]],11:[[10,-60,.75],[14,-55,.85]],13:[[12,-45,0],[2,-48,.05]],15:[[20,-37,0],[14,-44,-.06]],16:[[8,-90,-.85],[12,-96,-.85]],17:[[12,-37,.04],[8,-32,.03]]};
 function bladeBoxes(f,a,w,t){const p=w.pose??a.pose,g=geometry[p]||geometry[6],r=(w.reach??a.reach)*FIGHTER_SCALE*.72;return g.map(([x,y,ang])=>({x1:f.x+x*f.face,y1:f.y+y,x2:f.x+(x+Math.cos(ang)*r)*f.face,y2:f.y+y+Math.sin(ang)*r,radius:9,window:w,hitID:w.index}));}
 function spawn(f,v={}){const q={id:++serial,kind:'wave',owner:f.id,x:f.x,y:f.y-15,vx:f.face*10,face:f.face,age:0,life:40,radius:14,damage:7,hits:new Set(),stale:f.attack?.staleMultiplier||1,...v};objects.push(q);return q;}
 function box(q){return q.kind==='circle'?{x1:q.x-q.radius+15,y1:q.y,x2:q.x+q.radius-15,y2:q.y,radius:15}:{x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};}
 function hit(q,o,b,touch){const f=fighters[q.owner],a={...LloydMoves.dragon,type:q.kind==='circle'?'gale':'dragon',projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,soundFamily:q.kind==='circle'?'light':'sword',baseKnockback:q.kind==='circle'?1.2:3.6,knockbackGrowth:q.kind==='circle'?.012:.065,angle:q.kind==='circle'?-1.3:-.35,launchDirection:q.face};const c=o.attack;if(c?.counterWindow&&o.timer>=c.counterWindow[0]&&o.timer<=c.counterWindow[1]){attack(o,c.counterMove);o.inv=o.attack.totalFrames;return;}CombatSystem.hit(f,o,a,b,touch);}
 function tick(){for(const f of fighters)if(f.characterId==='lloyd'){if(f.grounded||f.ledge||f.respawn)f.lloydSideUsed=false;if(f.lloydCircleCooldown>0)f.lloydCircleCooldown--;if(f.respawn)f.lloydCircleCooldown=0;}
  for(const q of objects){const f=fighters[q.owner],o=BattlePlayers.projectileTarget(q);if(f.respawn){q.dead=true;continue;}q.age++;q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;
   if(q.kind==='wave'){const p=platforms.find(p=>p.main);if(q.y>p.y+1&&q.y<p.y+90&&q.x>p.x&&q.x<p.x+p.w){q.dead=true;continue;}if(q.groundWave&&!platforms.some(p=>q.x>=p.x&&q.x<=p.x+p.w&&Math.abs(q.y-(p.y-15))<3)){q.dead=true;continue;}}
   if(q.kind==='circle'&&q.age===30&&f.grounded&&Math.abs(f.x-q.x)<q.radius&&Math.abs(f.y-q.y-12)<3){f.damage=Math.max(0,f.damage-4);q.healed=true;GameAudio.cue('light-cast',.5,f);}
   for(const o of BattlePlayers.targets(f)){if(q.dead)break;if(q.kind!=='circle'||q.age>q.delay){const b=box(q),touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b),ready=q.kind==='circle'?q.age-(q.hitTimes.get(o.id)??-100)>=18:!q.hits.has(o.id);if(ready&&!o.respawn&&!o.hitlag&&!CombatSystem.protection(o).intangible&&(touch||shield)){if(q.kind==='circle')q.hitTimes.set(o.id,q.age);else{q.hits.add(o.id);q.dead=true;}hit(q,o,b,touch);}}
   }if(q.age>=q.life||q.x<-900||q.x>2340)q.dead=true;
  }objects=objects.filter(q=>!q.dead);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main),under=!f.grounded&&f.y>p.y+35&&f.x>p.x-20&&f.x<p.x+p.w+20;
  if(f.attack?.tiger){i.special=f.timer===f.attack.perfect[0]-1;i.specialHeld=false;i.x=f.face;i.y=0;i.jump=i.guard=i.jab=i.heavy=i.smash=false;}
  else if(f.attack?.tempest){i.x=f.attack.escapeUnder&&f.y>p.y?(f.x<720?-1:1):Math.sign(720-f.x);i.y=0;i.special=f.timer===29;i.specialHeld=false;i.jump=i.guard=i.jab=i.heavy=i.smash=false;}
  else if(f.attack?.tempestSail){i.x=Math.sign(720-f.x);i.y=0;i.special=i.jump=i.guard=i.jab=i.heavy=i.smash=false;}
  else if(!f.attack&&!f.grounded&&!f.recovered){i.jab=i.heavy=i.smash=i.guard=false;if(under){i.x=f.x<720?-1:1;i.y=-1;i.special=true;i.specialHeld=false;i.jump=false;}else if(f.y>p.y-110&&(f.x<p.x||f.x>p.x+p.w)){i.x=Math.sign(720-f.x);i.jump=f.airJumps>0&&f.vy>=0;i.special=!i.jump&&f.vy>=-2;i.y=i.special?-1:0;}}
  if(f.attack?.majin)i.specialHeld=Math.abs(o.x-f.x)>230&&f.attack.chargeFrames<35;return i;
 }
 return{reset,prepare,action,onHit,geometry,bladeBoxes,spawn,box,hit,tick,cpu,get objects(){return objects;}};
})();

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(LloydMoves.dragon,{rangedInterval:40,rangedRearm:20});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('lloyd',{"heavy":{"strike":[7,9],"windup":14},"jab2":{"strike":[6,7],"windup":14},"uair":{"strike":[16],"windup":14},"jab3":{"strike":[13],"windup":14}});

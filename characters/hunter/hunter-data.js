'use strict';
const HunterMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,s,e,d,r,p=6,shape='front',extra={})=>m(name,s,[w(s,e,shape)],19,0,{damage:d,reach:r,pose:p,hunterBlade:true,soundFamily:'sword',...extra});
 const moves={
  jab:cut('横斬り',8,10,5,181,6,'front',{cancel:{start:11,end:21,input:'jab',next:'jab2'}}),jab2:cut('斬り上げ',9,12,6,183,8,'up',{cancel:{start:13,end:24,input:'jab',next:'jab3'},angle:-1.3}),jab3:cut('架突斬り',13,16,11,210,9),heavy:cut('薙ぎ斬り',16,20,14,222),up:cut('縦斬り',12,16,13,195,8,'up',{angle:-1.48}),low:cut('薙ぎ払い',10,14,10,205,17,'low'),dashAttack:cut('肩当て',10,14,10,130,15,'front',{soundFamily:'punch',impulse:3}),
  smash:cut('溜め斬り',26,30,25,250,9,'front',{chargeFrame:8,chargeMaxFrames:65,totalFrames:62,recoveryFrames:32,baseKnockback:6.5,hunterEffect:1}),upsmash:cut('渾身の一撃',21,26,22,220,8,'up',{chargeFrame:7,chargeMaxFrames:60,angle:-1.5}),downsmash:m('叩きつけ',22,[w(22,26,'low',{pose:17}),w(32,36,'back',{pose:7})],30,0,{damage:20,reach:220,pose:17,hunterBlade:true,chargeFrame:7,chargeMaxFrames:60,soundFamily:'earth',hunterEffect:2}),
  air:cut('斬り下ろし',11,17,12,190,10,'spin',{aerial:true,landingLagFrames:16}),fair:cut('突き',13,17,14,223,6,'front',{aerial:true,landingLagFrames:18}),bair:cut('斬り返し',12,16,15,221,7,'back',{aerial:true,landingLagFrames:18}),uair:cut('縦回転斬り',10,15,13,190,8,'up',{aerial:true,angle:-1.5,landingLagFrames:16}),dair:cut('急降下斬り',17,22,17,210,11,'down',{aerial:true,landingLagFrames:22,meteorFrame:19,meteorAngle:1.48}),
  dragon:cut('溜め斬り・強溜め',22,27,15,230,9,'front',{special:true,chargeFrame:7,chargeButton:'special',chargeMaxFrames:65,hunterCharge:true,hunterEffect:1,landingLagFrames:23,totalFrames:56}),
  dash:cut('タックル（ガード）',12,16,8,122,15,'front',{special:true,tackle:true,soundFamily:'punch',totalFrames:37,airControlMultiplier:0,landingLagFrames:18}),
  tackleFinish:cut('受け止め・強溜め追撃',16,20,23,245,9,'front',{special:true,tackleFinish:true,hunterEffect:1,landingLagFrames:25,totalFrames:49}),
  rise:m('翔蟲受け身',10,[w(57,61,'up')],14,24,{pose:16,wirebug:true,hunterBlade:true,damage:9,reach:175,gravityMultiplier:0,airControlMultiplier:0,helpless:true,ledgeGrabStart:57,soundFamily:'wind',animationWindows:[{start:1,end:9,pose:14},{start:10,end:56,pose:16},{start:57,end:61,pose:8},{start:62,end:75,pose:5}]}),
  gale:m('スリンガー',12,[],23,14,{pose:13,slinger:true,chargeFrame:5,chargeButton:'special',chargeMaxFrames:45,projectile:true,spellShots:[12],soundFamily:'gun'})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:'punch'};}
 moves.ledge.pose=6;moves.getupAttack.pose=17;moves.getupAttack.activeFrames[1].pose=7;
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;a.FAF=a.totalFrames+1;a.animation={...a.animation,anticipationPose:12,accelerationPose:14,lean:0,lunge:0,impactScale:1};if(!a.helpless){a.landingFlag=[Math.max(2,a.startupFrames-1),a.totalFrames];a.autoCancelWindow=[[1,a.autoCancelEnd],[a.totalFrames,Infinity]];}if(a.chargeFrame)a.chargeHoldFrames=a.chargeMaxFrames;}
 return moves;
})();
const HunterRules=(()=>{
 let objects=[],serial=0;
 const pods=['stone','flash','sonic','paralysis'];
 function reset(){objects=[];serial=0;for(const f of fighters)if(f.characterId==='hunter'){f.hunterSideUsed=false;f.hunterPod=0;}}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;if(a.tackle){if(!f.grounded)f.hunterSideUsed=true;a.confirmed=false;a.blocked=false;a.specialWas=true;}if(a.wirebug){a.aimX=0;a.aimY=-1;a.tether=false;a.reaimed=false;a.route=[];a.specialWas=true;a.jumpWas=false;}if(a.slinger){a.pod=f.hunterPod||0;a.aimY=0;}}
 // Update ammunition/aim even while the common charge engine pauses the action clock.
 function aim(f,i){const a=f.attack;if(!a?.slinger||f.timer>5)return;if(i.x<-.4)a.pod=1;else if(i.x>.4)a.pod=3;else if(i.y<-.4)a.pod=2;else if(i.y>.4)a.pod=0;a.aimY=clamp(i.y,-1,1)*.45;f.hunterPod=a.pod;}
 function spawn(f,v={}){const q={id:++serial,owner:f.id,kind:'stone',x:f.x+f.face*40,y:f.y-54,face:f.face,vx:f.face*13,vy:0,radius:7,damage:6,age:0,life:42,hits:new Set(),stale:f.attack?.staleMultiplier||1,...v};q.previousX=q.x;q.previousY=q.y;objects.push(q);return q;}
 // A single front block costs shield health. Grabs, rear hits and heavy blows bypass it.
 function guard(f,o,a,box){const c=o.attack;if(o.characterId!=='hunter'||!c?.tackle||c.blocked||o.timer<5||o.timer>17||a.type==='grab'||a.damage>24)return false;const x=box?(box.x1+box.x2)/2:f.x;if((x-o.x)*o.face<0)return false;const cost=Math.max(7,(a.damage||0)*1.3+(a.shieldDamage||0));o.shield=Math.max(0,o.shield-cost);if(o.shield<=0){PlayerController.breakShield(o);GameAudio.cue('shield-break',1,o);return true;}c.blocked=c.confirmed=true;c.confirmUntil=29;o.vx=-o.face*1.5;CombatSystem.freeze(o,5);if(!a.projectile)CombatSystem.freeze(f,5);ring(o.x,o.y-46,'#9bdeff',52);GameAudio.cue('shield-hit',.9,o);return true;}
 function onHit(f,o,a){if(a.tackle&&f.attack?.tackle){f.attack.confirmed=true;f.attack.confirmUntil=29;f.vx=-f.face*2.5;}}
 function node(f,i){const p=platforms.find(p=>p.main),r=f.character.ecb.radius+8,below=f.y>p.y+90+f.character.ecb.height-3&&f.x>p.x-r&&f.x<p.x+p.w+r;
  if(below){const side=Math.abs(i.x)>.2?Math.sign(i.x):f.x<p.x+p.w/2?-1:1,x=side<0?p.x-r:p.x+p.w+r;return[{x,y:f.y},{x,y:p.y-130}];}
  const ix=clamp(i.x,-1,1),iy=i.y>.3?-.25:Math.min(-.35,i.y||-1),len=Math.hypot(ix,iy);return[{x:f.x+ix/len*275,y:f.y+iy/len*275}];
 }
 function release(f,i){const a=f.attack;if(!a?.wirebug||a.released)return;a.released=true;a.tether=false;a.gravityMultiplier=.7;f.timer=56;f.vx=clamp(i.x,-1,1)*9;f.vy=-8;f.fastFall=false;GameAudio.cue('wind-cast',.65,f);}
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.hunterCharge){a.damage=15+12*a.charge;a.reach=230+25*a.charge;}
  if(a.tackle){f.buffer=null;f.fastFall=false;if(!f.grounded)f.hunterSideUsed=true;f.vx=t>=9&&t<=16?(a.confirmed?-f.face*1.5:f.face*(a.originGrounded?5:3)):0;if(!a.originGrounded&&t<=16)f.vy=Math.max(0,f.vy);if(t>=18&&t<=29&&a.confirmed&&i.special&&!a.specialWas){const grounded=f.grounded;attack(f,'tackleFinish');f.attack.originGrounded=grounded;return;}a.specialWas=!!i.special;}
  if(a.wirebug){f.buffer=null;f.fastFall=false;
   if(t<10){a.aimX=i.x;a.aimY=i.y;f.vx=f.vy=0;}
   if(t===10&&!a.launched){a.launched=true;a.route=node(f,{x:a.aimX,y:a.aimY});a.node=a.route.shift();a.tether=true;f.grounded=false;f.recovered=true;f.specialLandingLag=24;GameAudio.cue('chain',.6,f);}
   if(t>=10&&a.launched&&!a.released){f.grounded=false;if(t>=20&&i.special&&!a.specialWas&&!a.reaimed&&!a.route.length){a.reaimed=true;a.node=node(f,i)[0];}
    const dx=a.node.x-f.x,dy=a.node.y-f.y,len=Math.hypot(dx,dy),speed=Math.min(18,len);f.vx=dx/Math.max(1,len)*speed;f.vy=dy/Math.max(1,len)*speed;if(Math.abs(f.vx)>.5)f.face=Math.sign(f.vx);
    if(len<19){if(a.route.length)a.node=a.route.shift();else release(f,i);}else if(t>=18&&i.jump&&!a.jumpWas||t>=56)release(f,i);
   }a.specialWas=!!i.special;a.jumpWas=!!i.jump;
  }
  if(a.slinger&&t===12&&!a.eventsDone.has('pod')){a.eventsDone.add('pod');const kind=pods[a.pod],r=kind==='stone'?7:10;spawn(f,{kind,vx:f.face*(13+3*a.charge),vy:a.aimY*12-1,radius:r,damage:kind==='stone'?6+4*a.charge:kind==='paralysis'?3:2,power:a.charge});}
 }
 // Wall contact converts the remaining tether time to a climb; it does not refresh the wirebug.
 function collision(f,i,v){const a=f.attack;if(!a?.wirebug||!a.tether||a.released)return;const p=platforms.find(p=>p.main);if(Math.abs(v.oldVx)>1&&f.vx===0&&f.y>p.y+1&&f.y-f.character.ecb.height<p.y+90){const side=f.x<p.x+p.w/2?-1:1;a.wall=true;a.route=[];a.node={x:side<0?p.x-f.character.ecb.radius-8:p.x+p.w+f.character.ecb.radius+8,y:p.y-130};f.x=a.node.x;f.vx=0;f.vy=-14;}}
 const geometry={6:[29,-74,0],7:[-14,-56,-2.32],8:[-3,-55,-.88],9:[29,-74,0],10:[0,-42,0],11:[3,-105,1.33],15:[13,-40,0],17:[35,-15,.12]};
 function boxes(f,a,w){const p=w.pose??a.pose,g=geometry[p]||geometry[6],r=(w.reach??a.reach)*FIGHTER_SCALE*([6,9].includes(p)?1:p===7?.5:.73);if(w.shape==='spin')return[{x1:f.x-r*.6,y1:f.y-43,x2:f.x+r*.6,y2:f.y-43,radius:20,window:w}];return[{x1:f.x+g[0]*f.face,y1:f.y+g[1],x2:f.x+(g[0]+Math.cos(g[2])*r)*f.face,y2:f.y+g[1]+Math.sin(g[2])*r,radius:a.tackle?15:11,window:w}];}
 function box(q){return q.kind==='pulse'?{x1:q.x-q.radius*.5,y1:q.y,x2:q.x+q.radius*.5,y2:q.y,radius:q.radius*.7}:{x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};}
 function pulse(q){q.pod=q.kind;q.kind='pulse';q.vx=q.vy=0;q.radius=q.pod==='flash'?65:48;q.age=0;q.life=8;GameAudio.cue(q.pod==='flash'?'light-cast':'wind-cast',.65,fighters[q.owner]);}
 function tick(){for(const f of fighters)if(f.characterId==='hunter'&&(f.grounded||f.ledge||f.respawn))f.hunterSideUsed=false;
  for(const q of objects){if(q.dead)continue;const f=fighters[q.owner],o=BattlePlayers.projectileTarget(q);if(f.respawn){q.dead=true;continue;}q.age++;q.previousX=q.x;q.previousY=q.y;if(q.kind!=='pulse'){q.vy+=.12;const main=platforms.find(p=>p.main);q.x+=q.vx;q.y+=q.vy;const terrain=q.x>main.x&&q.x<main.x+main.w&&q.y>main.y&&q.y<main.y+90;if(terrain){if(q.kind==='flash'||q.kind==='sonic')pulse(q);else q.dead=true;}if((q.kind==='flash'||q.kind==='sonic')&&q.age>=16)pulse(q);}
   if(q.dead)continue;for(const o of BattlePlayers.targets(f)){if(q.dead)break;if(!q.hits.has(o.id)&&!o.respawn&&!CombatSystem.protection(o).intangible){const b=box(q),touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(touch||shield){q.hits.add(o.id);const a={...HunterMoves.gale,type:'gale',projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,soundFamily:q.pod==='flash'?'light':q.pod==='sonic'?'wind':q.kind==='paralysis'?'thunder':'earth',angle:-.5,launchDirection:q.face,hitlagMultiplier:q.kind==='paralysis'?1.5:.65,fixedKnockback:q.pod==='flash'?19:q.pod==='sonic'?30:0};if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,a,b,touch);if(q.kind!=='pulse')q.dead=true;}}}
   if(q.age>=q.life||q.x<-900||q.x>2340||q.y>1800)q.dead=true;
  }objects=objects.filter(q=>!q.dead);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main),a=f.attack,clear=()=>{i.jump=i.guard=i.jab=i.heavy=i.smash=i.grab=i.special=false;};if(a?.wirebug){clear();i.specialHeld=false;i.x=f.y>p.y+90&&f.x>p.x&&f.x<p.x+p.w?(f.x<p.x+p.w/2?-1:1):Math.sign(720-f.x);i.y=-1;}else if(!a&&!f.grounded&&!f.recovered&&(f.y>p.y-90&&(f.x<p.x||f.x>p.x+p.w)||f.y>p.y+35)){clear();i.x=f.y>p.y+90&&f.x>p.x&&f.x<p.x+p.w?(f.x<720?-1:1):Math.sign(720-f.x);i.y=-1;i.special=true;i.specialHeld=false;}else if(a?.tackle){clear();i.specialHeld=false;if(a.confirmed&&f.timer>=19)i.special=true;}if(a?.hunterCharge)i.specialHeld=Math.abs(o.x-f.x)<190&&a.chargeFrames<35;if(a?.slinger){clear();i.x=0;i.y=0;i.specialHeld=a.chargeFrames<18;}return i;}
 return{pods,reset,prepare,aim,spawn,guard,onHit,node,release,action,collision,geometry,boxes,box,pulse,tick,cpu,get objects(){return objects;}};
})();

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('hunter',{"heavy":{"strike":[7,9],"windup":14},"fair":{"strike":[13],"windup":14},"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"jab2":{"strike":[6,7],"windup":14},"jab3":{"strike":[6,7,6],"windup":14},"smash":{"strike":[14,6],"windup":14}});

'use strict';
const ShirenMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,s,e,d,r,p=6,shape='front',extra={})=>m(name,s,[w(s,e,shape)],12,0,{damage:d,reach:r,pose:p,shirenBlade:true,soundFamily:'sword',...extra});
 const moves={jab:cut('横斬り',5,6,3,152,6,'front',{cancel:{start:7,end:16,input:'jab',next:'jab2'}}),jab2:cut('逆横斬り',4,6,4,157,6,'front',{cancel:{start:7,end:16,input:'jab',next:'jab3'}}),jab3:cut('柄打ち・叩き斬り',8,11,8,168,9),heavy:cut('大振り斬り',10,13,11,180),up:cut('斬り上げ',7,11,9,170,8,'up',{angle:-1.45}),low:cut('足払い斬り',7,9,7,170,17,'low'),dashAttack:cut('すべり込み斬り',11,14,10,177,15,'low',{impulse:4}),
 smash:cut('剛剣マンジカブラ',14,18,21,205,9,'front',{chargeFrame:5,chargeMaxFrames:60,recoveryFrames:25,totalFrames:43,baseKnockback:6.2}),upsmash:cut('妖刀かまいたち',12,17,18,185,8,'up',{chargeFrame:4,chargeMaxFrames:60,angle:-1.5}),downsmash:m('つるはし崩し',12,[w(12,15,'low',{pose:17}),w(22,25,'back',{pose:7})],24,0,{damage:17,reach:178,pose:17,shirenBlade:true,chargeFrame:4,chargeMaxFrames:60,soundFamily:'earth'}),
 air:cut('くるり斬り',6,10,8,150,10,'spin',{aerial:true,landingLagFrames:9}),fair:cut('斜め下斬り',8,11,11,174,9,'front',{aerial:true,landingLagFrames:11}),bair:cut('逆脚蹴り斬り',8,11,12,177,7,'back',{aerial:true,landingLagFrames:11}),uair:cut('舞い斬り',6,10,9,155,8,'up',{aerial:true,angle:-1.5,landingLagFrames:9}),dair:cut('壺落とし',10,14,13,160,11,'down',{aerial:true,landingLagFrames:14,meteorFrame:12,meteorAngle:1.48}),
 dragon:m('ドラゴン草',12,[],20,13,{pose:12,dragonHerb:true,spellShots:[12],projectile:true,chargeFrame:4,chargeButton:'special',chargeMaxFrames:50,soundFamily:'fire'}),
 dash:m('飛びつきの杖',10,[],29,16,{pose:13,pounceStaff:true,spellShots:[10],airControlMultiplier:.2,soundFamily:'wind'}),
 staffPull:m('飛びつき・引き寄せ',1,[],23,16,{pose:4,selfPull:true,special:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:1,soundFamily:'wind',animationWindows:[{start:1,end:24,pose:4}]}),
 staffSlash:cut('飛びつき・追撃',5,8,10,174,7,'back',{special:true,landingLagFrames:16}),
 rise:m('爆発の壺・反動跳び',14,[],48,24,{pose:16,blastPot:true,launchFrame:14,gravityMultiplier:0,airControlMultiplier:0,helpless:true,ledgeGrabStart:14,soundFamily:'fire',animationWindows:[{start:14,end:38,pose:16},{start:39,end:62,pose:5}]}),
 gale:m('真空斬りの巻物',16,[w(16,21,'front')],23,0,{pose:6,damage:12,reach:310,vacuumScroll:true,shirenBlade:true,soundFamily:'wind'}),airScroll:cut('空中・真空斬り',13,18,12,205,11,'down',{vacuumScroll:true,aerial:true,special:true,landingLagFrames:17,soundFamily:'wind'})};
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:'punch'};}
 moves.ledge.pose=6;moves.getupAttack.pose=17;moves.getupAttack.activeFrames[1].pose=7;
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;a.FAF=a.totalFrames+1;a.animation={...a.animation,anticipationPose:14,accelerationPose:14,lean:0,lunge:0,impactScale:1};if(!a.helpless){a.landingFlag=[Math.max(2,a.startupFrames-1),a.totalFrames];a.autoCancelWindow=[[1,a.autoCancelEnd],[a.totalFrames,Infinity]];}}
 return moves;
})();
const ShirenRules=(()=>{
 let objects=[],serial=0;
 function reset(){objects=[];serial=0;for(const f of fighters)if(f.characterId==='shiren')f.shirenSideUsed=false;}
 function solid(x,y){const p=platforms.find(p=>p.main);return x>p.x&&x<p.x+p.w&&y>p.y+1&&y<p.y+90;}
 function safePoint(f,x,y){const p=platforms.find(p=>p.main),c=f.character.ecb,from={x:f.x,y:f.y},steps=Math.max(1,Math.ceil(Math.hypot(x-from.x,y-from.y)/4));let q=from;for(let n=1;n<=steps;n++){const next={x:lerp(from.x,x,n/steps),y:lerp(from.y,y,n/steps)};if(next.x+c.radius>p.x&&next.x-c.radius<p.x+p.w&&next.y>p.y+1&&next.y-c.height<p.y+90)break;q=next;}return q;}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;if(a.pounceStaff&&!f.grounded)f.shirenSideUsed=true;if(a.blastPot){const p=platforms.find(p=>p.main);a.aim=0;a.ceilingFrames=0;a.escapeSide=f.y>p.y+35&&f.x>p.x-20&&f.x<p.x+p.w+20?(f.x<720?-1:1):0;}}
 function spawn(f,v={}){const q={id:++serial,owner:f.id,kind:'flame',x:f.x+f.face*35,y:f.y-39,face:f.face,vx:f.face*10,vy:0,radius:13,damage:7,age:0,life:42,hits:new Set(),stale:f.attack?.staleMultiplier||1,...v};q.previousX=q.x;q.previousY=q.y;objects.push(q);return q;}
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.dragonHerb&&t===12&&!a.eventsDone.has('herb')){a.eventsDone.add('herb');spawn(f,{y:f.y-52,vx:f.face*(10-4*a.charge),radius:13+13*a.charge,damage:7+7*a.charge,charge:a.charge,life:34+18*a.charge});}
  if(a.pounceStaff&&t===10&&!a.eventsDone.has('staff')){a.eventsDone.add('staff');spawn(f,{kind:'staff',vx:f.face*17,life:17,radius:8,damage:2});if(!a.originGrounded){f.vx=f.face*2;f.vy=-1;}}
  if(a.selfPull){const o=fighters[a.targetId];if(o.respawn||t>=24){attack(f,'staffSlash');f.buffer=null;return;}const destination={x:o.x+a.originFace*45,y:o.y-3},dx=destination.x-f.x,dy=destination.y-f.y,len=Math.hypot(dx,dy),step=Math.min(17,len);const p=safePoint(f,f.x+dx/Math.max(1,len)*step,f.y+dy/Math.max(1,len)*step);f.vx=p.x-f.x;f.vy=p.y-f.y;f.grounded=false;f.fastFall=false;if(len<20||Math.hypot(f.vx,f.vy)<.5){f.face=a.originFace;attack(f,'staffSlash');f.grounded=false;f.vy=-2;f.buffer=null;return;}}
  if(a.blastPot){f.fastFall=false;if(t<14){a.aim=clamp(i.x,-1,1);f.vy=0;f.vx=a.escapeSide?clamp(i.x,-1,1)*4:0;if(t===3&&!a.eventsDone.has('pot')){a.eventsDone.add('pot');spawn(f,{kind:'pot',x:f.x,y:f.y-5,vx:0,life:11,damage:0,radius:0});}}
   if(t===14&&!a.launched){a.launched=true;f.grounded=false;f.recovered=true;f.specialLandingLag=24;f.vx=a.aim*11;f.vy=-20+Math.abs(a.aim)*3;a.gravityMultiplier=.65;spawn(f,{kind:'blast',x:f.x,y:f.y-5,vx:0,life:10,radius:48,damage:8});GameAudio.cue('fire-heavy',.8,f);}
   if(t>=14&&t<=42){const p=platforms.find(p=>p.main),ceiling=p.y+90+f.character.ecb.height,blocked=f.y>=ceiling&&f.y-14<ceiling&&f.x>p.x-f.character.ecb.radius&&f.x<p.x+p.w+f.character.ecb.radius;if(blocked&&a.ceilingFrames<30&&Math.abs(i.x)>.2){a.ceilingFrames++;f.vx=Math.sign(i.x)*13;f.vy=-13;f.timer=13;}else{if(a.ceilingFrames&&!a.clearedCeiling){a.clearedCeiling=true;f.vy=-18;}f.vx=moveToward(f.vx,clamp(i.x,-1,1)*8,.8);}}
   if(t>42)a.gravityMultiplier=1;
  }
 }
 function onHit(f,o,a){if(a.staffProjectile&&f.attack?.pounceStaff){const originFace=f.face;attack(f,'staffPull');f.attack.targetId=o.id;f.attack.originFace=originFace;f.grounded=false;f.fastFall=false;f.buffer=null;}}
 const geometry={6:[13,-53,0],7:[-12,-52,Math.PI],8:[0,-62,-Math.PI/2],9:[14,-51,.12],10:[10,-42,0],11:[8,-38,1.02],15:[16,-26,.02],17:[12,-18,.02]};
 function boxes(f,a,w){const g=geometry[w.pose??a.pose]||geometry[6],r=(w.reach??a.reach)*FIGHTER_SCALE*(a.vacuumScroll?1:.72);if(w.shape==='spin')return[{x1:f.x-r*.6,y1:f.y-40,x2:f.x+r*.6,y2:f.y-40,radius:18,window:w}];return[{x1:f.x+g[0]*f.face,y1:f.y+g[1],x2:f.x+(g[0]+Math.cos(g[2])*r)*f.face,y2:f.y+g[1]+Math.sin(g[2])*r,radius:a.vacuumScroll?20:9,window:w}];}
 function box(q){return {x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};}
 function tick(){for(const f of fighters)if(f.characterId==='shiren'&&(f.grounded||f.ledge||f.respawn))f.shirenSideUsed=false;
  for(const q of objects){const f=fighters[q.owner],o=BattlePlayers.projectileTarget(q);if(f.respawn){q.dead=true;continue;}q.age++;q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;q.y+=q.vy;
   if(q.kind==='pot'){if(f.attack?.blastPot&&!f.attack.launched){q.x=f.x;q.y=f.y-5;}else q.dead=true;}
   if(['flame','staff'].includes(q.kind)&&solid(q.x,q.y)){q.dead=true;continue;}for(const o of BattlePlayers.targets(f)){if(q.dead)break;if(q.kind!=='pot'&&!q.hits.has(o.id)&&!o.respawn&&!o.hitlag&&!CombatSystem.protection(o).intangible){const b=box(q),touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(touch||shield){q.hits.add(o.id);const a={...ShirenMoves.dragon,type:q.kind==='staff'?'dash':q.kind==='blast'?'rise':'dragon',projectile:true,staffProjectile:q.kind==='staff',charge:0,damage:q.damage,staleMultiplier:q.stale,soundFamily:q.kind==='staff'?'wind':'fire',baseKnockback:q.kind==='staff'?.8:3.8,knockbackGrowth:q.kind==='staff'?.01:.07,angle:q.kind==='blast'?-1.3:-.4,launchDirection:q.face};if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,a,b,touch);if(q.kind!=='blast')q.dead=true;}}}
   if(q.age>=q.life||q.x<-900||q.x>2340)q.dead=true;
  }objects=objects.filter(q=>!q.dead);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main);if(f.attack?.blastPot){i.x=f.attack.escapeSide&&f.y>p.y?f.attack.escapeSide:Math.sign(720-f.x);i.y=0;i.special=i.jump=i.guard=i.jab=i.heavy=i.smash=i.grab=false;}else if(f.attack?.selfPull||f.attack?.pounceStaff){i.x=i.y=0;i.special=i.jump=i.guard=i.jab=i.heavy=i.smash=i.grab=false;}else if(!f.attack&&!f.grounded&&!f.recovered&&(f.y>p.y-90&&(f.x<p.x||f.x>p.x+p.w)||f.y>p.y+35)){i.x=f.y>p.y+35&&f.x>p.x&&f.x<p.x+p.w?(f.x<720?-1:1):Math.sign(720-f.x);i.y=-1;i.special=true;i.specialHeld=false;i.jump=i.guard=i.jab=i.heavy=i.smash=i.grab=false;}if(f.attack?.dragonHerb)i.specialHeld=Math.abs(o.x-f.x)>220&&f.attack.chargeFrames<30;return i;}
 return{reset,prepare,action,onHit,spawn,solid,safePoint,geometry,boxes,box,tick,cpu,get objects(){return objects;}};
})();

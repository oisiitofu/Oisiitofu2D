'use strict';
const BombermanMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const blow=(name,s,e,damage,reach,pose=6,shape='front',extra={})=>m(name,s,[w(s,e,shape)],11,0,{damage,reach,pose,bomberMelee:true,soundFamily:'punch',...extra});
 const moves={
  jab:blow('グローブジャブ',5,6,3,108,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),jab2:blow('リバースグローブ',4,5,4,113,6,'front',{cancel:{start:6,end:14,input:'jab',next:'jab3'}}),jab3:blow('ボムポップ',8,10,7,135,9,'front',{bombGlove:true,soundFamily:'explosion'}),
  heavy:blow('ボムキック',9,12,10,155,9,'front',{bombGlove:true}),up:blow('パンチンググローブ',7,11,8,145,8,'up',{angle:-1.4}),low:blow('スライドキック',7,9,7,140,15,'low'),dashAttack:blow('スピードシューズタックル',11,14,10,145,15,'front',{impulse:4,soundFamily:'punch'}),
  smash:blow('パワーグローブ・メガスイング',14,17,21,205,9,'front',{bombGlove:true,chargeFrame:5,chargeMaxFrames:60,baseKnockback:6.3,recoveryFrames:26,totalFrames:43,FAF:44}),
  upsmash:m('リモコンボム・バースト',14,[],26,0,{pose:8,remoteColumn:true,chargeFrame:5,chargeMaxFrames:60,soundFamily:'explosion'}),downsmash:m('クロスボム',15,[],27,0,{pose:17,crossPlant:true,chargeFrame:5,chargeMaxFrames:60,soundFamily:'explosion'}),
  air:m('ボムオービット',6,[w(6,8,'spin',{damage:3,baseKnockback:1.3,knockbackGrowth:.02}),w(16,20,'spin',{damage:7})],12,8,{damage:7,reach:155,pose:10,bomberMelee:true,bombGlove:true,aerial:true,soundFamily:'explosion'}),
  fair:blow('フライングボムキック',7,10,10,165,9,'front',{bombGlove:true,aerial:true,landingLagFrames:10}),bair:blow('バックグローブ',8,11,11,155,7,'back',{aerial:true,landingLagFrames:11}),uair:blow('ボムリフト',6,10,9,155,8,'up',{bombGlove:true,aerial:true,landingLagFrames:9,angle:-1.5}),
  dair:m('リコイルボムドロップ',10,[],15,14,{pose:11,bombDrop:true,aerial:true,rangedInterval:60,rangedRearm:0,soundFamily:'explosion'}),
  dragon:m('ボムスロー',12,[],19,13,{pose:13,bombThrow:true,chargeFrame:4,chargeButton:'special',chargeMaxFrames:50,shortSpeed:4,longSpeed:10,shortLift:4,longLift:7,maxBombs:4,soundFamily:'explosion'}),
  dash:m('ボムキック・リターン',11,[],21,16,{pose:15,bombKick:true,kickRange:120,kickSpeed:12,kickDamage:5,kickFuse:85,airControlMultiplier:.2,soundFamily:'punch',animation:{anticipationEnd:3,anticipationPose:14,accelerationPose:3,followThroughFrames:5,recoveryPose:0,lean:0,lunge:0,impactScale:1}}),
  rise:m('ルーイ・スプリングジャンプ',13,[w(13,16,'up',{damage:5})],34,24,{damage:5,reach:135,pose:16,louieSpring:true,bomberMelee:true,aimEnd:12,launchFrame:13,launchSpeed:18,launchX:11,prepareSpeed:20,flightEnd:44,bombReleaseStart:24,bombReleaseEnd:36,gravityMultiplier:0,airControlMultiplier:0,helpless:true,ledgeGrabStart:13,soundFamily:'wind',animationWindows:[{start:17,end:37,pose:4}],animation:{anticipationEnd:4,anticipationPose:3,accelerationPose:3,followThroughFrames:4,recoveryPose:5,lean:0,lunge:0,impactScale:1}}),
  gale:m('ボムパンチ',17,[],25,0,{pose:17,crossPlant:true,chargeFrame:5,chargeButton:'special',chargeMaxFrames:50,soundFamily:'explosion'}),
  airPunch:m('ボムパンチ・空中',16,[w(16,72,'down')],14,24,{damage:12,reach:120,pose:11,special:true,bomberMelee:true,bomberBounce:true,punchDive:true,diveSpeed:12,airControlMultiplier:.2,gravityMultiplier:0,landingMove:'punchLanding',meteorFrame:18,meteorAngle:1.4,soundFamily:'explosion'}),
  punchLanding:m('ボムパンチ・着地爆風',1,[],25,0,{pose:17,crossPlant:true,special:true,soundFamily:'explosion'}),bombBounce:m('ボムの反動',1,[],8,15,{pose:4,aerial:true,special:true,soundFamily:'wind'})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:'punch'};}
 moves.grab.name='グローブつかみ';moves.grab.reach=110;moves.forwardThrow.name='ボム押し出し';moves.backThrow.name='振り返り投げ';moves.upThrow.name='ボム持ち上げ';moves.downThrow.name='ボム叩きつけ';
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;a.FAF=a.totalFrames+1;if(!a.louieSpring&&!a.bombKick)a.animation={...a.animation,anticipationPose:14,accelerationPose:14,lean:0,lunge:0,impactScale:1};if(!a.helpless&&!a.punchDive){a.landingFlag=[Math.max(2,a.startupFrames-1),a.totalFrames];a.autoCancelWindow=[[1,a.autoCancelEnd],[a.totalFrames,Infinity]];}}
 return moves;
})();
const BombermanRules=(()=>{
 let objects=[],serial=0;
 const config={fuse:100,blastLife:12,radius:135,powerRadius:185,damage:12,powerDamage:17,bombRadius:12,gravity:.3,maxBombs:4};
 function bombs(f){return objects.filter(q=>q.owner===f.id&&q.kind==='bomb'&&!q.dead);}
 function reset(){objects=[];serial=0;for(const f of fighters)if(f.characterId==='bomberman')f.bomberSideUsed=f.bomberPunchUsed=false;}
 function solid(x,y){const p=platforms.find(p=>p.main);return x>p.x&&x<p.x+p.w&&y>p.y+1&&y<p.y+90;}
 function spawn(f,extra={}){if(bombs(f).length>=config.maxBombs)return null;const q={kind:'bomb',id:++serial,owner:f.id,sourceType:f.attack?.type,x:f.x+f.face*32,y:f.y-38,previousX:f.x+f.face*32,previousY:f.y-38,vx:0,vy:0,face:f.face,age:0,life:config.fuse,radius:config.bombRadius,power:false,bounces:0,returns:0,kicked:false,stale:f.attack?.staleMultiplier||1,hits:new Set(),...extra};objects.push(q);return q;}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;if(a.bombKick&&!f.grounded)f.bomberSideUsed=true;if(a.punchDive)f.bomberPunchUsed=true;if(a.louieSpring){a.aim=0;a.springPoint={x:f.x,y:f.y};f.vx=f.vy=0;a.dropped=false;const p=platforms.find(p=>p.main);a.recoverySide=f.y>p.y+40&&f.x>p.x&&f.x<p.x+p.w?(f.x<720?-1:1):0;}}
 function burst(q){if(q.kind!=='bomb')return;q.kind='blast';q.age=0;q.life=config.blastLife;q.vx=q.vy=0;q.blastRadius=q.blastRadius||(q.power?config.powerRadius:config.radius);q.damage=q.damage||(q.power?config.powerDamage:config.damage);q.hits=q.groupHits||new Set();GameAudio.cue('explosion',.8,fighters[q.owner]);}
 function kick(f,a){let q=bombs(f).filter(q=>Math.hypot(q.x-f.x,q.y-(f.y-20))<=a.kickRange).sort((p,q)=>Math.abs(p.x-f.x)-Math.abs(q.x-f.x))[0];if(!q)q=spawn(f,{x:f.x+f.face*32,y:f.y-13,life:a.kickFuse});if(!q)return null;q.vx=f.face*a.kickSpeed;q.vy=f.grounded?0:2;q.face=f.face;q.kicked=true;q.returns=0;q.kickDamage=a.kickDamage;q.kickHits=new Set();q.hits=new Set();q.life=Math.max(q.life,q.age+50);a.kickedId=q.id;GameAudio.cue('punch-swing',.6,f);return q;}
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;const t=f.timer;
  if((a.bombThrow||a.bombDrop)&&t===a.startupFrames&&!a.eventsDone.has('bomb')){a.eventsDone.add('bomb');const long=a.charge>=.5;spawn(f,{vx:a.bombDrop?f.vx*.2:f.face*(long?a.longSpeed:a.shortSpeed),vy:a.bombDrop?3:-(long?a.longLift:a.shortLift),power:long,life:a.bombDrop?34:config.fuse});if(a.bombDrop){f.vy=Math.min(f.vy,-3);f.fastFall=false;}GameAudio.cue('staff-swing',.55,f);}
  if(a.bombKick&&t===a.startupFrames&&!a.eventsDone.has('kick')){a.eventsDone.add('kick');kick(f,a);}
  if((a.remoteColumn||a.crossPlant)&&t>=a.startupFrames&&!a.eventsDone.has('plant')){a.eventsDone.add('plant');const groupHits=new Set(),offsets=a.remoteColumn?[-46,0,46]:[0];for(const dx of offsets){const q=spawn(f,{x:f.x+dx+(a.remoteColumn?0:f.face*42),y:f.y-(a.remoteColumn?95:10),life:1,power:a.charge>=.5,damage:a.remoteColumn?18:a.type==='punchLanding'?13:16,blastRadius:(a.remoteColumn?80:140)*(1+a.charge*.4),groupHits});if(q)burst(q);}}
  if(a.louieSpring){f.fastFall=false;if(t<=a.aimEnd){a.aim=clamp(i.x,-1,1);const p=platforms.find(p=>p.main),under=f.y-f.character.ecb.height>=p.y+88;f.vx=under?a.aim*a.prepareSpeed:0;f.vy=0;a.springPoint={x:f.x,y:f.y};}
   if(t===a.launchFrame){f.grounded=false;f.recovered=true;f.specialLandingLag=a.landingLagFrames;f.vx=a.aim*a.launchX;f.vy=-a.launchSpeed+Math.abs(a.aim)*3;a.gravityMultiplier=.65;GameAudio.cue('double-jump',.8,f);}
   if(t>a.launchFrame&&t<=a.flightEnd){f.vx=moveToward(f.vx,i.x*a.launchX,.9);if(t>=a.bombReleaseStart&&t<=a.bombReleaseEnd&&i.special&&!a.dropped){a.dropped=true;spawn(f,{x:f.x,y:f.y-5,vx:f.vx*.2,vy:3,life:30});f.vy=Math.min(f.vy,-5);f.vx*=.8;GameAudio.cue('staff-swing',.55,f);}}
   if(t>a.flightEnd)a.gravityMultiplier=1;
  }
 }
 function onHit(f,o,a){if(a.bomberBounce&&f.attack?.bomberBounce){const recovered=f.recovered;attack(f,'bombBounce');f.vy=-5;f.grounded=false;f.fastFall=false;f.recovered=recovered;}}
 const geometry={front:{angles:[-.15,.1],origin:[0,-38]},back:{angles:[-3,-3.3],origin:[0,-40]},up:{angles:[-1.1,-1.5],origin:[0,-35]},low:{angles:[0,.12],origin:[0,-15]},down:{angles:[.8,1.1],origin:[0,-30]},spin:{angles:[-3,3],origin:[0,-38]}};
 function meleeBoxes(f,a,w,t){const g=geometry[w.shape],u=(t-w.start)/Math.max(1,w.end-w.start),angle=lerp(...g.angles,u),reach=(w.reach??a.reach)*FIGHTER_SCALE*.72,x=f.x,y=f.y+g.origin[1];return[{x1:x,y1:y,x2:x+Math.cos(angle)*reach*f.face,y2:y+Math.sin(angle)*reach,radius:a.type==='smash'?18:11,window:w}];}
 function ray(q,dx,dy){let point={x:q.x,y:q.y};for(let s=4;s<=q.blastRadius;s+=4){const x=q.x+dx*s,y=q.y+dy*s;if(solid(x,y))break;point={x,y};}return point;}
 function blastBoxes(q){return[[1,0],[-1,0],[0,-1],[0,1]].map(([dx,dy])=>{const p=ray(q,dx,dy);return{x1:q.x,y1:q.y,x2:p.x,y2:p.y,radius:14};});}
 function strike(q,o,b,contact,kickHit=false){const f=fighters[q.owner],a={...BombermanMoves.gale,type:kickHit?'dash':'dragon',damage:kickHit?q.kickDamage:q.damage,charge:0,sourceType:q.sourceType,staleMultiplier:q.stale,projectile:true,soundFamily:kickHit?'punch':'explosion',launchDirection:Math.sign(o.x-q.x)||q.face,angle:-.65,baseKnockback:kickHit?2:4,knockbackGrowth:kickHit?.03:.08};const counter=o.attack;if(counter?.counterWindow&&o.timer>=counter.counterWindow[0]&&o.timer<=counter.counterWindow[1]){attack(o,counter.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,a,b,contact);}
 function collide(q){for(const o of BattlePlayers.targets(fighters[q.owner])){if(q.dead)break;const before=q.kickHits?.size;collideOne(q,o);if(q.kind==='bomb'&&q.kickHits?.size!==before)break;}}
 function collideOne(q,o){if(o.respawn||o.hitlag)return;const hits=q.kind==='blast'?q.hits:q.kickHits;if(hits.has(o.id)||CombatSystem.protection(o).intangible)return;const boxes=q.kind==='blast'?blastBoxes(q):[{x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius}];for(const b of boxes){const contact=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(!contact&&!shield)continue;hits.add(o.id);strike(q,o,b,contact,q.kind==='bomb');if(q.kind==='bomb')reflect(q);break;}}
 function reflect(q){if(q.returns>=1){burst(q);return;}q.returns++;q.vx*=-1;q.face*=-1;q.kickHits=new Set();q.kickHits.add(1-q.owner);q.vy=-3;GameAudio.cue('punch-hit',.55,fighters[q.owner]);}
 function tick(){for(const f of fighters)if(f.characterId==='bomberman'&&(f.grounded||f.ledge||f.respawn))f.bomberSideUsed=f.bomberPunchUsed=false;
  for(const q of objects){const f=fighters[q.owner];if(!f||f.respawn){q.dead=true;continue;}q.age++;q.previousX=q.x;q.previousY=q.y;
   if(q.kind==='bomb'){q.vy+=config.gravity;const steps=Math.max(1,Math.ceil(Math.hypot(q.vx,q.vy)/4));for(let j=0;j<steps&&q.kind==='bomb';j++){const old={x:q.x,y:q.y},ny=q.y+q.vy/steps,nx=q.x+q.vx/steps,p=platforms.find(p=>q.vy>=0&&old.y<=p.y-q.radius&&ny>=p.y-q.radius&&nx>=p.x&&nx<=p.x+p.w);if(p){q.y=p.y-q.radius;q.x=nx;q.vy=0;if(!q.kicked)q.vx*=.75;}else if(solid(nx+Math.sign(q.vx)*q.radius,ny)||solid(nx,ny+q.radius)){q.x=old.x;q.y=old.y;if(q.kicked)reflect(q);else{q.vx*=-.5;q.vy=-Math.abs(q.vy)*.4;q.bounces++;}}else{q.x=nx;q.y=ny;}}
    if(q.kind==='bomb'&&q.kicked)collide(q);if(q.kind==='bomb'&&q.age>=q.life)burst(q);
   }
   if(q.kind==='blast'){collide(q);if(q.age>=q.life)q.dead=true;for(const other of objects)if(other!==q&&other.kind==='bomb'&&!other.dead&&blastBoxes(q).some(b=>{const dx=b.x2-b.x1,dy=b.y2-b.y1,u=clamp(((other.x-b.x1)*dx+(other.y-b.y1)*dy)/Math.max(1,dx*dx+dy*dy),0,1);return Math.hypot(other.x-b.x1-dx*u,other.y-b.y1-dy*u)<b.radius+other.radius;}))burst(other);}
   if(q.y>1250||q.x<-900||q.x>2340)q.dead=true;
  }objects=objects.filter(q=>!q.dead);
 }
 function cpu(f,o,i){const p=platforms.find(p=>p.main),under=!f.grounded&&f.y>p.y+40&&f.x>p.x&&f.x<p.x+p.w;if(f.attack?.louieSpring){const side=f.x<720?-1:1;i.x=f.attack.recoverySide&&f.y>p.y-20?(f.x>p.x-20&&f.x<p.x+p.w+20?f.attack.recoverySide:0):under?side:Math.sign(720-f.x)*.65;i.y=-1;i.special=i.guard=i.jump=i.jab=i.heavy=i.smash=false;}else if(f.attack?.bombKick){i.x=i.y=0;i.special=i.guard=i.jump=i.jab=i.heavy=i.smash=false;}else if(!f.attack&&!f.grounded&&!f.recovered&&(under||f.y>p.y-90&&(f.x<p.x||f.x>p.x+p.w))){i.x=under?(f.x<720?-1:1):Math.sign(720-f.x)*.65;i.y=-1;i.special=true;i.jump=i.guard=i.jab=i.heavy=i.smash=false;}else if(!f.attack&&f.grounded&&Math.abs(o.x-f.x)>160&&frame%75===0){i.x=bombs(f).some(q=>Math.abs(q.x-f.x)<90)?Math.sign(o.x-f.x):0;i.y=0;i.special=true;i.jab=i.heavy=i.smash=i.guard=false;}if(f.attack?.bombThrow){i.specialHeld=Math.abs(o.x-f.x)>270&&f.attack.chargeFrames<32;i.x=i.y=0;}return i;}
 return{config,bombs,reset,prepare,spawn,burst,kick,action,onHit,geometry,meleeBoxes,solid,ray,blastBoxes,collide,strike,reflect,tick,cpu,get objects(){return objects;}};
})();

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('bomberman',{"jab2":{"strike":[6,7],"windup":14},"upsmash":{"strike":[16],"windup":14},"uair":{"strike":[8,16],"windup":14},"fair":{"strike":[13],"windup":14},"smash":{"strike":[13,9],"windup":14},"jab3":{"strike":[7,9],"windup":14},"dashAttack":{"strike":[2,9],"windup":14}});

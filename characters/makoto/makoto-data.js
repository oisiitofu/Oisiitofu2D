'use strict';
const MakotoMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,s,e,damage,reach,pose=9,shape='front',opts={})=>m(name,s,[w(s,e,shape)],10,0,{damage,reach,pose,...opts});
 const moves={
  jab:cut('素早い斬撃',5,6,3,132,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:cut('返しの斬撃',4,5,4,140,7,'front',{cancel:{start:6,end:15,input:'jab',next:'jab3'}}),
  jab3:cut('オルフェウスの加護',8,10,8,166,9),
  heavy:cut('踏み込み横斬り',8,11,10,183),
  up:cut('ペルソナのすくい上げ',6,11,8,155,8,'up',{angle:-1.4,soundFamily:'light'}),
  low:cut('足払い',7,8,7,164,17,'low',{angle:-.25}),
  dashAttack:m('追い上げ斬り',12,[w(12,15)],14,0,{damage:11,reach:174,pose:15,impulse:4}),
  smash:m('スカーレットハボック',15,[w(15,18)],23,0,{damage:22,reach:226,pose:9,baseKnockback:6.2,knockbackGrowth:.102,chargeFrame:5,chargeMaxFrames:60,soundFamily:'fire'}),
  upsmash:m('ジオダイン',13,[w(13,17,'up')],22,0,{damage:18,reach:205,pose:13,angle:-1.5,baseKnockback:5.8,knockbackGrowth:.095,chargeFrame:4,chargeMaxFrames:60,soundFamily:'thunder'}),
  downsmash:m('マハエイガ',12,[w(12,14,'low'),w(20,23,'back')],21,0,{damage:16,reach:199,pose:17,baseKnockback:5.3,knockbackGrowth:.088,chargeFrame:4,chargeMaxFrames:60,soundFamily:'dark'}),
  air:m('回転斬り',6,[w(6,9,'spin')],12,7,{damage:8,reach:163,pose:10,aerial:true}),
  fair:m('斜め斬り',6,[w(6,8)],11,10,{damage:10,reach:180,pose:9,aerial:true}),
  bair:m('振り向き斬り',7,[w(7,11,'back')],12,10,{damage:11,reach:175,pose:7,aerial:true}),
  uair:m('オルフェウスの炎',5,[w(5,9,'up')],13,8,{damage:9,reach:166,pose:8,aerial:true,angle:-1.5,soundFamily:'fire'}),
  dair:m('打ち下ろし',9,[w(9,13,'plunge')],16,14,{damage:13,reach:128,pose:11,aerial:true,meteorFrame:11,meteorAngle:1.45,bounceOnHit:-5,soundFamily:'light'}),
  dragon:m('アギ → アギラオ',13,[],16,12,{pose:13,spellShots:[13],projectile:true,chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,soundFamily:'fire',shotSpeed:9,shotLife:65}),
  dash:m('ジャックブラザーズ',12,[],19,15,{pose:13,spellShots:[12],projectile:true,soundFamily:'ice',summonDelay:18,summonSpeed:7,summonLife:52,airControlMultiplier:.45}),
  rise:m('カデンツァ',8,[w(8,10,'spin',{damage:3,baseKnockback:1.3,knockbackGrowth:.012}),w(37,40,'up',{damage:8})],10,20,{damage:8,reach:165,pose:16,soundFamily:'wind',flightStart:8,flightEnd:36,flightSpeed:8.8,turnRate:.09,finishFrame:37,earlyFinishFrame:19,helpless:true,airControlMultiplier:0,gravityMultiplier:0,ledgeGrabStart:8,autoCancelWindow:[],landingFlag:[1,Infinity],animation:{anticipationEnd:3,anticipationPose:13,accelerationPose:4,followThroughFrames:4,recoveryPose:5,lean:-.03,lunge:0,impactScale:1.06}}),
  gale:m('キングアンドアイ',17,[],20,15,{pose:13,spellShots:[17],projectile:true,chargeFrame:5,chargeButton:'special',chargeMaxFrames:60,soundFamily:'ice',pillarDelay:12,pillarLife:30,nearDistance:80,farDistance:260,pillarRadius:30,pillarHeight:120,airControlMultiplier:.3})
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e}))};}
 for(const[id,name]of Object.entries({grab:'片手のつかみ',pummel:'柄の打撃',forwardThrow:'斬り上げ投げ',backThrow:'闇の追撃',upThrow:'オルフェウスの打ち上げ',downThrow:'アギの追撃'}))moves[id].name=name;
 for(const a of Object.values(moves)){a.motionEndFrames=a.totalFrames;if(a!==moves.rise)a.animation={...a.animation,anticipationPose:14};}
 return moves;
})();
const MakotoRules=(()=>{
 let objects=[];
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='makoto')f.makotoSideUsed=false;}
 function spawn(f,kind,values={}){const o={kind,owner:f.id,face:f.face,x:f.x+f.face*35,y:f.y-37,vx:0,vy:0,age:0,life:65,stale:f.attack?.staleMultiplier??1,hits:new Set(),...values};if(['fire','jack'].includes(kind)&&terrain(o.x,o.y))o.x=f.x;if(!['fire','jack'].includes(kind)||!terrain(o.x,o.y))objects.push(o);return o;}
 function terrain(x,y){const p=platforms.find(p=>p.main);return x>p.x&&x<p.x+p.w&&y>p.y&&y<p.y+90;}
 function surface(x,y,maxDrop=1000){return platforms.filter(p=>x>=p.x&&x<=p.x+p.w&&p.y>=y-5&&p.y<=y+maxDrop).sort((a,b)=>a.y-b.y)[0];}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;if(a.type==='dash'&&!f.grounded)f.makotoSideUsed=true;if(a.type==='rise'){a.flightAngle=-Math.PI/2;a.flightDistance=0;a.gravityMultiplier=0;}}
 function action(f,i=emptyInput()){const a=f.attack;if(!a)return;const t=f.timer;
  if(a.type==='rise'){
   if(t===a.flightStart){if(f.grounded)f.y-=2;f.grounded=false;f.recovered=true;f.fastFall=false;f.specialLandingLag=a.landingLagFrames;f.vx=f.vy=0;}
   if(t>=a.flightStart&&t<=a.flightEnd){const target=-Math.PI/2+clamp(i.x,-1,1)*1.12;const delta=clamp(target-a.flightAngle,-a.turnRate,a.turnRate);a.flightAngle+=delta;f.vx=Math.cos(a.flightAngle)*a.flightSpeed;f.vy=Math.sin(a.flightAngle)*a.flightSpeed;a.flightDistance+=a.flightSpeed;f.fastFall=false;a.gravityMultiplier=0;if(t>=a.earlyFinishFrame&&(i.special||i.guardPressed)){f.timer=a.finishFrame;f.buffer=null;f.vx*=.45;f.vy=-4;a.gravityMultiplier=1;}}
   else if(t>=a.finishFrame){a.gravityMultiplier=1;f.vx*=.92;if(t===a.finishFrame)f.vy=-4;}
  }
  if(t!==a.startupFrames||a.objectSpawned)return;
  if(a.type==='dragon'){a.objectSpawned=true;spawn(f,'fire',{vx:f.face*a.shotSpeed,damage:7+7*a.charge,charge:a.charge,life:a.shotLife});}
  if(a.type==='dash'){a.objectSpawned=true;const start={x:f.x+f.face*35,y:f.y-24},floor=surface(start.x,f.y,14);spawn(f,'jack',{...start,vx:f.face*a.summonSpeed,damage:4,delay:a.summonDelay,life:a.summonLife,onFloor:!!floor,groundY:floor?.y});}
  if(a.type==='gale'){a.objectSpawned=true;const x=f.x+f.face*lerp(a.nearDistance,a.farDistance,a.charge),p=surface(x,f.y);a.pillarTarget=p?{x,y:p.y}:null;spawn(f,'king',{x:f.x-f.face*35,y:f.y,life:24,charge:a.charge});if(p)spawn(f,'pillar',{x,y:p.y,delay:a.pillarDelay,life:a.pillarLife,charge:a.charge,damage:10+7*a.charge,radius:a.pillarRadius+15*a.charge,height:a.pillarHeight+65*a.charge});}
 }
 function active(o){return o.kind==='fire'&&!o.burst||o.kind==='jack'&&o.age<=o.delay||o.kind==='flame'&&o.age>=o.delay&&o.age<=o.delay+3||o.kind==='pillar'&&o.age>=o.delay&&o.age<=o.delay+4;}
 function box(o){if(o.kind==='pillar')return{x1:o.x,y1:o.y-8,x2:o.x,y2:o.y-o.height,radius:o.radius};if(o.kind==='flame')return{x1:o.x,y1:o.y-30,x2:o.x,y2:o.y-30,radius:46};return{x1:o.previousX??o.x,y1:o.previousY??o.y,x2:o.x,y2:o.y,radius:o.kind==='fire'?12+o.charge*15:19};}
 function collide(o,f,unused){for(const enemy of BattlePlayers.targets(f)){if(o.dead)break;collideOne(o,f,enemy);}}
 function collideOne(o,f,enemy){if(!active(o)||enemy.respawn||o.hits.has(enemy.id))return;const b=box(o),touch=CombatSystem.contact(b,enemy),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(enemy.mode)&&CombatSystem.shieldCovers(enemy,b);if(!(touch||shield)||CombatSystem.protection(enemy).intangible)return;o.hits.add(enemy.id);const counter=enemy.attack;if(counter?.counterWindow&&enemy.timer>=counter.counterWindow[0]&&enemy.timer<=counter.counterWindow[1]){attack(enemy,counter.counterMove);enemy.inv=enemy.attack.totalFrames;}else{const ice=o.kind==='jack'||o.kind==='pillar';CombatSystem.hit(f,enemy,{...MakotoMoves.dragon,type:o.kind==='fire'?'dragon':o.kind==='pillar'?'gale':'dash',damage:o.damage,charge:0,staleMultiplier:o.stale,projectile:true,soundFamily:ice?'ice':'fire',element:ice?'ice':null,baseKnockback:o.kind==='jack'?1.3:o.kind==='pillar'?4.8:3.6,knockbackGrowth:o.kind==='jack'?.015:.065,angle:o.kind==='pillar'?-1.35:-.45,launchDirection:o.face},b,touch);}
  if(o.kind==='fire')o.burst=1;
  if(o.kind==='jack'){o.contactTarget=enemy.id;o.vx=0;}
 }
 function tick(){for(const f of fighters)if(f.characterId==='makoto'&&(f.grounded||f.ledge||f.respawn))f.makotoSideUsed=false;
  const next=[];for(const o of objects){const f=fighters[o.owner],enemy=BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}o.age++;o.previousX=o.x;o.previousY=o.y;
   if(o.kind==='fire'){if(o.burst){if(++o.burst>10)o.dead=true;}else{const dx=o.vx,steps=Math.max(1,Math.ceil(Math.abs(dx)/5));for(let n=0;n<steps;n++){o.x+=dx/steps;if(terrain(o.x,o.y)){o.burst=1;break;}}}}
   if(o.kind==='jack'){
    if(o.age<=o.delay){const nextX=o.x+o.vx;if(terrain(nextX,o.y)){o.vx=0;}else{o.x=nextX;if(o.onFloor){const p=surface(o.x,o.groundY-2,15);if(p){o.groundY=p.y;o.y=p.y-24;}else o.onFloor=false;}if(!o.onFloor){o.vy=Math.min(7,o.vy+.3);o.y+=o.vy;const p=surface(o.x,o.previousY+24,8);if(p&&o.y+24>=p.y){o.y=p.y-24;o.groundY=p.y;o.onFloor=true;}}}}
    if(o.age===o.delay){const target=o.contactTarget!==undefined?fighters[o.contactTarget]:null,x=target&&!target.respawn?target.x:o.x;next.push({...o,kind:'flame',x,y:o.onFloor?o.groundY:o.y+24,age:0,life:20,delay:6,damage:9,hits:new Set(),vx:0,vy:0,previousX:x,previousY:o.y});}
   }
   if(o.kind==='flame'&&o.age===o.delay)GameAudio.cue('fire-cast',.8,f);
   if(o.kind==='pillar'&&o.age===o.delay)GameAudio.cue('ice-hit',.8,f);
   collide(o,f,enemy);if(o.age>=o.life||o.x<-900||o.x>2300||o.y>1600)o.dead=true;
  }objects=objects.filter(o=>!o.dead).concat(next);
 }
 function cpu(f,o,i){if(f.attack?.type==='rise'&&f.timer>=f.attack.flightStart&&f.timer<=f.attack.flightEnd){const p=platforms.find(p=>p.main),under=f.y>p.y&&f.x>p.x-25&&f.x<p.x+p.w+25;i.x=under?(f.x<p.x+p.w/2?-1:1):Math.sign(720-f.x);i.special=!under&&f.x>p.x+30&&f.x<p.x+p.w-30&&f.y<p.y-90&&f.timer>=f.attack.earlyFinishFrame;i.guard=i.jab=i.heavy=i.smash=false;}
  if(f.attack?.type==='dragon')i.specialHeld=Math.abs(o.x-f.x)>270&&f.attack.chargeFrames<40;
  if(f.attack?.type==='gale')i.specialHeld=Math.abs(o.x-f.x)>180&&f.attack.chargeFrames<50;
  if(!f.attack&&f.y>590&&f.x>320&&f.x<1120&&!f.recovered){i.x=f.x<720?-1:1;i.special=false;i.jump=f.airJumps>0&&f.vy>0;}
  return i;
 }
 return{reset,prepare,action,tick,cpu,terrain,surface,box,active,get objects(){return objects;}};
})();

'use strict';
const ColetteMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const cut=(name,start,end,damage,reach,pose,shape='front',options={})=>m(name,start,[w(start,end,shape)],9,0,{damage,reach,pose,...options});
 const moves={
  jab:cut('右チャクラム',5,6,2.5,115,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:cut('左チャクラム',4,5,3,123,7,'front',{cancel:{start:6,end:14,input:'jab',next:'jab3'}}),
  jab3:cut('近接レイトラスト',7,9,6,149,9),
  heavy:cut('チャクラム・横薙ぎ',7,9,8,157,9),
  up:cut('リングリフト',6,10,7,142,8,'up',{angle:-1.4}),
  low:cut('リングスイープ',7,8,6,144,17,'low',{angle:-.25}),
  dashAttack:cut('回転スライド',12,15,9,151,15,'front',{impulse:5,recoveryFrames:12,totalFrames:27,FAF:28}),
  smash:m('デュアルトラスト',13,[w(13,14,'front',{damage:6,baseKnockback:1.5,knockbackGrowth:.015,pose:7}),w(19,21,'front',{damage:13})],18,0,{damage:13,reach:187,pose:9,baseKnockback:6,knockbackGrowth:.095,chargeFrame:4,chargeMaxFrames:60}),
  upsmash:m('グランドクロス',16,[w(16,20,'up')],20,0,{damage:18,reach:188,pose:8,angle:-1.48,baseKnockback:6.2,knockbackGrowth:.095,chargeFrame:5,chargeMaxFrames:60}),
  downsmash:m('リングワールウィンド',11,[w(11,13,'low',{damage:7}),w(18,20,'back',{damage:10})],17,0,{damage:10,reach:174,pose:17,baseKnockback:5,knockbackGrowth:.083,chargeFrame:3,chargeMaxFrames:60}),
  air:m('チャクラム回転',6,[w(6,7,'front',{damage:3,baseKnockback:1.3,knockbackGrowth:.012}),w(13,16,'spin',{damage:6})],9,7,{damage:6,reach:139,pose:10,aerial:true}),
  fair:m('投げて戻す二段斬り',7,[w(7,9,'front',{damage:5,pose:13,baseKnockback:1.5,knockbackGrowth:.015}),w(17,19,'front',{damage:7,pose:9})],10,10,{damage:7,reach:172,pose:9,aerial:true}),
  bair:m('後ろ回し蹴り斬り',7,[w(7,10,'back')],10,10,{damage:10,reach:153,pose:10,aerial:true}),
  uair:m('クロススラッシュ',5,[w(5,8,'up')],10,8,{damage:8,reach:146,pose:8,aerial:true,angle:-1.48}),
  dair:m('リングドロップ',9,[w(9,13,'down')],12,14,{damage:11,reach:140,pose:11,aerial:true,bounceOnHit:-7.5,meteorFrame:11,meteorAngle:1.45,meteorMultiplier:1.15}),
  dragon:m('レイトラスト / ルーンスティア',14,[],18,12,{pose:13,spellShots:[14],chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,projectile:true,ringFlight:{outboundFrames:24,orbitFrames:30,returnSpeed:12,speed:9,orbitRadiusX:46,orbitRadiusY:34}}),
  dash:m('アイテムスティール',22,[w(22,24,'front')],18,14,{damage:6,reach:151,pose:9,orbitStart:7,orbitEnd:21,orbitRange:240,orbitRadius:64,orbitHeight:48,orbitMaxTravel:260,stealEffect:true,bodyPassFrames:[[7,24]],intangibleFrames:[[10,12]],airControlMultiplier:0,baseKnockback:3.1,knockbackGrowth:.045,ledgeGrabStart:25}),
  rise:m('エンジェルフェザー',8,[],18,20,{pose:16,spellShots:[56],flightStart:8,flightEnd:55,flightSpeed:5.9,flightAcceleration:.28,flightExitFrame:56,airControlMultiplier:0,aerial:true,ledgeGrabStart:8,autoCancelWindow:[],landingFlag:[1,Infinity],animation:{anticipationEnd:3,anticipationPose:3,accelerationPose:4,followThroughFrames:5,recoveryPose:5,lean:-.04,lunge:0,impactScale:1.06}}),
  gale:m('ピコピコハンマー',18,[],15,14,{pose:13,spellShots:[18,24,30,36],chargeFrame:4,chargeButton:'special',chargeMaxFrames:45,projectile:true}),
 };
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){
  const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e}))};
 }
 Object.assign(moves.grab,{name:'チャクラムつかみ',reach:76});moves.pummel.name='リングこつん';
 for(const[id,name]of Object.entries({forwardThrow:'光の押し出し',backThrow:'ぐるっと投げ',upThrow:'天使の打ち上げ',downThrow:'ころんと投げ'}))moves[id].name=name;
 for(const a of Object.values(moves))a.motionEndFrames=a.totalFrames;
 return moves;
})();

const ColetteRules=(()=>{
 let objects=[];
 const speedKeys=['walkSpeed','initialDashSpeed','runSpeed','airSpeed'];
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='colette'){for(const key of speedKeys)f.character[key]=CharacterData.colette[key];f.coletteBuff=null;f.coletteSteals=0;}}
 function spawn(f,kind,values={}){objects.push({kind,owner:f.id,face:f.face,x:f.x+f.face*34,y:f.y-36,age:0,stale:f.attack.staleMultiplier,hits:new Map(),...values});}
 function onHit(f,o,a){
  if(!a.stealEffect||f.attack?.stealDone)return;
  if(f.attack)f.attack.stealDone=true;
  const kind=(f.coletteSteals||0)%3;f.coletteSteals=(f.coletteSteals||0)+1;
  f.coletteItemFlash=frame+36;
  if(kind===0){f.damage=Math.max(0,f.damage-3);label(f.x,f.y-100,'ヒール +3%','#ffc9ec');}
  else if(kind===1){f.coletteBuff={time:180};label(f.x,f.y-100,'スピードアップ','#a2ecff');}
  else{f.shield=Math.min(f.character.shieldHP,f.shield+12);label(f.x,f.y-100,'ガード回復','#ffe4a3');}
  ring(f.x,f.y-35,'#ffe6a2',75);
 }
 function orbit(f,a){
  const t=f.timer;if(t<a.orbitStart)return;
  if(t>a.orbitEnd){if(t<=a.activeEnd){a.gravityMultiplier=0;f.vx=f.vy=0;}else a.gravityMultiplier=1;return;}
  if(!a.orbitOrigin){const enemy=BattlePlayers.target(f),dx=enemy.x-f.x;
   const target=!enemy.respawn&&dx*f.face>=0&&Math.abs(dx)<=a.orbitRange&&Math.abs(enemy.y-f.y)<90;
   a.orbitOrigin={x:f.x,y:f.y,face:f.face};a.orbitTarget=target?enemy.id:null;
   a.orbitDestination={x:f.x+f.face*(target?Math.min(a.orbitMaxTravel,Math.abs(dx)+a.orbitRadius):70),y:target?enemy.y:f.y};
  }
  const u=(t-a.orbitStart+1)/(a.orbitEnd-a.orbitStart+1),p=a.orbitOrigin,q=a.orbitDestination;
  const x=lerp(p.x,q.x,u),y=lerp(p.y,q.y,u)-Math.sin(u*Math.PI)*(a.orbitTarget!==null?a.orbitHeight:22)-Math.sin(u*Math.PI/2)*8;
  // Velocity follows the arc through the normal swept stage collision path.
  f.vx=x-f.x;f.vy=y-f.y;a.gravityMultiplier=0;f.fastFall=false;
  if(t===a.orbitEnd&&a.orbitTarget!==null)f.face=-p.face;
 }
 function flight(f,a,i){
  const t=f.timer;if(t<a.flightStart||t>a.flightEnd)return;
  if(t===a.flightStart){f.grounded=false;f.recovered=true;f.specialLandingLag=a.landingLagFrames;f.vy=-a.flightSpeed;f.vx=f.face;ring(f.x,f.y,'#a5eaff',80);}
  a.gravityMultiplier=0;f.fastFall=false;
  let x=i.x||0,y=i.y||0,length=Math.hypot(x,y);
  if(length<.2){x=f.face*.25;y=t<a.flightStart+8?-1:-.12;length=Math.hypot(x,y);}
  a.flightDirection={x:x/length,y:y/length};
  f.vx=lerp(f.vx,a.flightDirection.x*a.flightSpeed,a.flightAcceleration);
  f.vy=lerp(f.vy,a.flightDirection.y*a.flightSpeed,a.flightAcceleration);
  if(Math.abs(x)>.2)f.face=Math.sign(x);
  if(t>=a.flightStart+8&&(i.special||i.guardPressed)){f.timer=a.flightExitFrame;f.buffer=null;}
 }
 function action(f,i=emptyInput()){
  const a=f.attack;if(!a)return;
  if(a.type==='dash')orbit(f,a);
  if(a.type==='rise')flight(f,a,i);
  const t=f.timer;
  if(a.type==='rise'&&t===a.flightExitFrame&&!a.objectSpawned){a.objectSpawned=true;a.gravityMultiplier=1;f.vx*=.5;f.vy=Math.min(1,f.vy);const d=a.flightDirection||{x:f.face,y:-.15},angle=Math.atan2(d.y,d.x);for(const spread of [-.32,0,.32])spawn(f,'feather',{vx:Math.cos(angle+spread)*10,vy:Math.sin(angle+spread)*10,damage:3,angle:angle+spread});}
  if(a.type==='dragon'&&t===a.startupFrames&&!a.objectSpawned){a.objectSpawned=true;objects=objects.filter(o=>o.owner!==f.id||o.kind!=='chakram');const tier=a.charge>=1?2:a.charge>=.5?1:0;for(let j=0;j<(tier===1?2:1);j++)spawn(f,'chakram',{vx:f.face*(a.ringFlight.speed+tier),vy:0,age:-j*5,tier,phase:'out',phaseAge:0,flight:a.ringFlight,damage:tier===2?3.5:tier===1?5:6});}
  if(a.type==='gale'&&a.spellShots.includes(t)&&!a.eventsDone.has('hammer:'+t)){a.eventsDone.add('hammer:'+t);spawn(f,'hammer',{vx:f.face*(6+1.5*a.charge),vy:f.grounded?-5:2,tier:a.charge>=1?1:0,damage:4+1.5*a.charge,burst:0});}
 }
 function box(o){const radius=o.kind==='chakram'?17:o.kind==='feather'?10:o.burst?30:o.tier?23:16;return{x1:o.previousX??o.x,y1:o.previousY??o.y,x2:o.x,y2:o.y,radius};}
 function terrain(o){const p=platforms.find(p=>p.main);return o.x>p.x&&o.x<p.x+p.w&&o.y>p.y&&o.y<p.y+90;}
 function tick(){
  for(const f of fighters)if(f.characterId==='colette'){
   if(f.respawn)f.coletteBuff=null;
   const buff=f.coletteBuff;if(buff&&--buff.time<=0)f.coletteBuff=null;
   for(const key of speedKeys)f.character[key]=CharacterData.colette[key]*(f.coletteBuff?1.15:1);
  }
  for(const o of objects){
   const f=fighters[o.owner],enemy=BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}
   if(++o.age<0)continue;o.previousX=o.x;o.previousY=o.y;const contactPhase=o.phase;
   if(o.kind==='chakram'){
    o.phaseAge++;
    if(o.phase==='out'){o.x+=o.vx;if(o.phaseAge>=o.flight.outboundFrames||terrain(o)){o.phase=o.tier===2&&!terrain(o)?'orbit':'return';o.center={x:o.x-o.face*o.flight.orbitRadiusX,y:o.y};o.phaseAge=0;}}
    else if(o.phase==='orbit'){const angle=o.phaseAge*.35;o.x=o.center.x+Math.cos(angle)*o.flight.orbitRadiusX*o.face;o.y=o.center.y+Math.sin(angle)*o.flight.orbitRadiusY;if(o.phaseAge>=o.flight.orbitFrames){o.phase='return';o.phaseAge=0;}}
    else{const dx=f.x-o.x,dy=f.y-36-o.y,d=Math.hypot(dx,dy);if(d<22){o.dead=true;continue;}o.x+=dx/d*o.flight.returnSpeed;o.y+=dy/d*o.flight.returnSpeed;if(terrain(o))o.dead=true;}
   }else if(o.kind==='hammer'){
    if(o.burst){if(++o.burst>8)o.dead=true;}else{o.vy+=.32;o.x+=o.vx;o.y+=o.vy;const floor=platforms.find(p=>o.x>=p.x&&o.x<=p.x+p.w&&o.previousY<=p.y&&o.y>=p.y&&o.vy>=0);if(floor||terrain(o)){o.y=floor?.y??o.previousY;o.vx=o.vy=0;o.burst=1;ring(o.x,o.y,'#ffd59b',45);}}
   }else{o.x+=o.vx;o.y+=o.vy;if(terrain(o))o.dead=true;}
   for(const enemy of BattlePlayers.targets(f)){if(o.dead)break;const key=o.kind==='chakram'?contactPhase:'contact',previous=o.hits.get(key+':'+enemy.id),active=o.kind!=='hammer'||o.burst<=2;
   if(!o.dead&&active&&!enemy.respawn&&(previous===undefined||o.kind==='chakram'&&key==='orbit'&&o.age-previous>=12)){
    const b=box(o),touch=CombatSystem.contact(b,enemy),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(enemy.mode)&&CombatSystem.shieldCovers(enemy,b);
    if((touch||shield)&&!CombatSystem.protection(enemy).intangible){o.hits.set(key+':'+enemy.id,o.age);const counter=enemy.attack;
     if(counter?.counterWindow&&enemy.timer>=counter.counterWindow[0]&&enemy.timer<=counter.counterWindow[1]){attack(enemy,counter.counterMove);enemy.inv=enemy.attack.totalFrames;}
     else CombatSystem.hit(f,enemy,{...CombatData.moves.dragon,type:o.kind==='hammer'?'gale':o.kind==='feather'?'rise':'dragon',damage:o.damage,charge:0,staleMultiplier:o.stale,projectile:true,baseKnockback:o.kind==='chakram'&&o.phase==='orbit'?1.4:2.8,knockbackGrowth:o.kind==='chakram'&&o.phase==='orbit'?.012:.045,angle:o.kind==='hammer'?-1.1:-.5,launchDirection:Math.sign(enemy.x-o.x)||o.face},b,touch);
     if(o.kind==='feather')o.dead=true;
    }
   }
   }if(o.age>120||o.x<-900||o.x>2300||o.y>1600||o.y<-1100)o.dead=true;
  }
  objects=objects.filter(o=>!o.dead);
 }
 function cpu(f,o,i){if(f.attack?.type==='rise'&&f.timer>=f.attack.flightStart&&f.timer<=f.attack.flightEnd){
  const p=platforms.find(p=>p.main),under=f.y>p.y+25&&f.x>p.x-20&&f.x<p.x+p.w+20;
  i.x=under?(f.x<p.x+p.w/2?-1:1):Math.sign(p.x+p.w/2-f.x);i.y=under?0:f.y>490?-1:-.2;
  i.special=f.x>p.x+30&&f.x<p.x+p.w-30&&f.y<p.y-75;i.guard=i.guardPressed=i.jab=i.heavy=i.smash=false;
 }return i;}
 return{reset,action,tick,onHit,box,cpu,get objects(){return objects}};
})();

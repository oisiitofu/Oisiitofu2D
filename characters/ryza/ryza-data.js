'use strict';
// One-based, inclusive 60 Hz windows drive both art and collisions.
const RyzaMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const tap=(name,s,e,damage,reach,pose=6,shape='front',options={})=>m(name,s,[w(s,e,shape)],10,0,{damage,reach,pose,soundFamily:'staff',...options});
 const moves={
  jab:tap('杖たたき',5,6,3,130,6,'front',{cancel:{start:7,end:15,input:'jab',next:'jab2'}}),
  jab2:tap('振り返し',4,5,4,142,6,'front',{cancel:{start:6,end:15,input:'jab',next:'jab3'}}),
  jab3:tap('回転払い',7,9,7,157,10,'spin'),
  heavy:tap('大きな横薙ぎ',8,11,10,184,6),
  up:tap('杖の振り上げ',6,12,8,250,8,'up',{angle:-1.4}),
  low:tap('低い杖薙ぎ',7,8,7,151,15,'low',{angle:-.2}),
  dashAttack:m('前方スライド',12,[w(12,15)],13,0,{damage:11,reach:169,pose:15,impulse:4,soundFamily:'staff'}),
  smash:m('Blazing Swing',12,[w(12,15)],25,0,{damage:21,reach:225,pose:9,chargeFrame:4,chargeMaxFrames:60,baseKnockback:6.2,knockbackGrowth:.1,soundFamily:'staff'}),
  upsmash:m('Core Drive',13,[w(13,17,'up')],25,0,{damage:19,reach:180,pose:8,corePillar:true,pillarHeight:150,pillarRadius:25,chargeFrame:4,chargeMaxFrames:60,angle:-1.5,soundFamily:'light'}),
  downsmash:m('Item Crash',11,[w(11,14,'shockwave')],24,0,{damage:18,reach:198,pose:17,barrelCrash:true,chargeFrame:4,chargeMaxFrames:60,soundFamily:'explosion'}),
  air:m('杖の回転',6,[w(6,7,'spin',{damage:3,baseKnockback:1.4,knockbackGrowth:.015}),w(15,20,'spin',{damage:7})],12,7,{damage:7,reach:155,pose:10,aerial:true,soundFamily:'staff'}),
  fair:m('杖の突き出し',6,[w(6,8)],12,10,{damage:10,reach:182,pose:9,aerial:true,soundFamily:'staff'}),
  bair:m('背後への杖払い',7,[w(7,11,'back')],12,10,{damage:11,reach:170,pose:7,aerial:true,soundFamily:'staff'}),
  uair:m('錬金エネルギー',5,[w(5,9,'up')],13,8,{damage:9,reach:250,pose:8,aerial:true,angle:-1.5,soundFamily:'light'}),
  dair:m('空中・爆弾落とし',9,[],17,14,{pose:11,aerial:true,dropBomb:true,spellShots:[9],soundFamily:'explosion'}),
  dragon:m('コアアイテム調合',22,[],12,12,{pose:13,synthesis:true,craftFrame:22,chargeFrame:6,chargeButton:'special',chargeMaxFrames:55,animationWindows:[{start:1,end:22,pose:13}],soundFamily:'light'}),
  dash:m('スイングチャージ',12,[w(12,15)],25,16,{damage:14,reach:200,pose:9,swingCharge:true,chargeFrame:5,chargeButton:'special',chargeMaxFrames:55,chargeStride:5,chargedStride:8.5,chargedReach:245,chargedDamage:23,cancelEnd:11,animation:{anticipationEnd:2,anticipationPose:14,accelerationPose:14,followThroughFrames:5,recoveryPose:0,lean:-.15,lunge:14,impactScale:1.15},soundFamily:'staff'}),
  swingCancel:m('スイング・中止',1,[],8,8,{pose:18,special:true,soundFamily:'staff'}),
  rise:m('グライドステップ',5,[],13,18,{pose:4,glideStep:true,launchFrame:5,launchSpeed:18,glideStart:23,glideEnd:61,glideFallSpeed:2.4,glideGravity:.18,glideSpeed:9.2,glideAcceleration:.8,brakeStart:26,airControlMultiplier:0,helpless:true,animationWindows:[{start:5,end:22,pose:4},{start:23,end:61,pose:16}],animation:{anticipationEnd:2,anticipationPose:3,accelerationPose:4,followThroughFrames:4,recoveryPose:5,lean:0,lunge:0,impactScale:1},soundFamily:'wind'}),
  glideEnd:m('グライド・解除',1,[],8,18,{pose:5,special:true,helpless:true,soundFamily:'wind'}),
  gale:m('アイテムスロー',10,[],15,12,{pose:17,itemThrow:true,throwFrame:10,spellShots:[10],soundFamily:'staff'})
 };
 moves.rise.totalFrames=moves.rise.glideEnd+moves.rise.recoveryFrames;moves.rise.FAF=moves.rise.totalFrames+1;
 for(const id of ['grab','ledge','getupAttack','pummel','forwardThrow','backThrow','upThrow','downThrow']){const a=CombatData.moves[id];moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(e=>({...e})),soundFamily:'staff'};}
 for(const[id,name]of Object.entries({grab:'杖つかみ',pummel:'杖の柄打ち',forwardThrow:'前方投げ',backThrow:'後方投げ',upThrow:'杖の打ち上げ',downThrow:'樽の叩きつけ'}))moves[id].name=name;
 for(const[id,a]of Object.entries(moves)){a.motionEndFrames=a.totalFrames;if(a.activeFrames.length&&!a.corePillar&&!a.barrelCrash&&!['grab','pummel','ledge','getupAttack'].includes(id)&&!id.endsWith('Throw'))a.staffSweep=true;if(!a.glideStep&&!a.synthesis&&!a.swingCharge)a.animation={...a.animation,anticipationPose:14,accelerationPose:14};}
 return moves;
})();
const RyzaRules=(()=>{
 const items=[
  {name:'爆弾',family:'explosion',prop:0,damage:11,chargedDamage:17,radius:48,chargedRadius:68,duration:5,gravity:.3,speed:7.5,lift:5,fuse:55,bounces:1},
  {name:'氷の瓶',family:'ice',prop:1,damage:5,chargedDamage:7,radius:59,chargedRadius:80,duration:90,chargedDuration:135,gravity:.3,speed:7,lift:5,fuse:70,bounces:0,rehit:30},
  {name:'フラム',family:'fire',prop:2,damage:3,chargedDamage:4,radius:53,chargedRadius:73,duration:90,chargedDuration:135,gravity:.3,speed:8,lift:4,fuse:65,bounces:0,rehit:24},
  {name:'草の種',family:'earth',prop:3,radius:68,chargedRadius:90,duration:150,chargedDuration:210,gravity:.3,speed:6,lift:5,fuse:70,bounces:0,heal:1,healInterval:30}
 ];
 let objects=[];
 function reset(){objects=[];for(const f of fighters)if(f.characterId==='ryza'){f.ryzaSelection=0;f.ryzaItem=null;f.ryzaFieldSerial=0;}}
 function prepare(f){const a=f.attack;a.originGrounded=f.grounded;
  if(a.synthesis){a.selected=f.ryzaSelection||0;a.selectionDirection=0;a.animation={...a.animation,anticipationPose:13,accelerationPose:13};}
  if(a.itemThrow){a.item=f.ryzaItem?{...f.ryzaItem}:{index:0,charged:false,improvised:true};a.soundFamily=items[a.item.index].family;}
  if(a.swingCharge){a.strideDirection=f.face;f.vx=f.vy=0;}
  if(a.glideStep){f.vx=f.vy=0;a.gravityMultiplier=0;}
 }
 function action(f,i=emptyInput()){
  const a=f.attack;if(!a)return;const t=f.timer;
  if(a.synthesis&&t<=a.craftFrame){const dir=Math.abs(i.x)>.55?Math.sign(i.x):0;if(dir&&dir!==a.selectionDirection){a.selected=(a.selected+dir+items.length)%items.length;GameAudio.cue('menu',.35,f);}a.selectionDirection=dir;if(t===a.craftFrame&&!a.eventsDone.has('craft')){a.eventsDone.add('craft');f.ryzaItem={index:a.selected,charged:a.charge>=.5};f.ryzaSelection=(a.selected+1)%items.length;GameAudio.cue('light-cast',.7,f);}}
  if(a.swingCharge){if(t<=a.cancelEnd&&i.guardPressed){const vx=f.vx;f.buffer=null;attack(f,'swingCancel');f.vx=vx*.25;GameAudio.cue('dodge',.6,f);return;}if(t===a.startupFrames&&!a.eventsDone.has('stride')){a.eventsDone.add('stride');const strong=a.charge>=.5;a.damage=strong?a.chargedDamage:a.damage;a.reach=strong?a.chargedReach:a.reach;f.vx=a.strideDirection*(strong?a.chargedStride:a.chargeStride);}}
  if(a.glideStep){f.fastFall=false;if(t===a.launchFrame){f.grounded=false;f.recovered=true;f.specialLandingLag=a.landingLagFrames;f.vy=-a.launchSpeed;a.gravityMultiplier=.65;GameAudio.cue('double-jump',.8,f);}if(t>=a.launchFrame&&t<=a.glideEnd){f.vx=moveToward(f.vx,clamp(i.x,-1,1)*a.glideSpeed,a.glideAcceleration);if(t>=a.glideStart){a.gravityMultiplier=a.glideGravity;f.vy=moveToward(f.vy,clamp(.8+(i.y||0)*1.6,-.8,2.4),.45);if(t>=a.brakeStart&&(i.special||i.guardPressed)){const vx=f.vx,vy=f.vy;f.buffer=null;attack(f,'glideEnd');f.vx=vx*.5;f.vy=Math.max(vy,1.5);return;}}}if(t>a.glideEnd)a.gravityMultiplier=1;}
  if((a.itemThrow&&t===a.throwFrame||a.dropBomb&&t===a.startupFrames)&&!a.eventsDone.has('throw')){a.eventsDone.add('throw');throwItem(f,a.item||{index:0,charged:false},a.dropBomb,a.staleMultiplier);if(a.itemThrow)f.ryzaItem=null;}
 }
 // Charge is held by the common engine before action(), so selection/cancel
 // remain responsive during the hold without advancing the combat clock.
 function holding(f,i){const a=f.attack;if(a?.synthesis){const dir=Math.abs(i.x)>.55?Math.sign(i.x):0;if(dir&&dir!==a.selectionDirection){a.selected=(a.selected+dir+items.length)%items.length;GameAudio.cue('menu',.35,f);}a.selectionDirection=dir;}if(a?.swingCharge&&i.guardPressed){f.buffer=null;attack(f,'swingCancel');GameAudio.cue('dodge',.6,f);return true;}return false;}
 function throwItem(f,item,drop=false,stale=1){const d=items[item.index],radius=item.charged?d.chargedRadius:d.radius;objects.push({kind:'item',owner:f.id,index:item.index,charged:item.charged,improvised:item.improvised||false,face:f.face,x:f.x+(drop?0:f.face*32),y:f.y-38,previousX:f.x+(drop?0:f.face*32),previousY:f.y-38,vx:drop?f.vx*.3:d.speed*f.face,vy:drop?3:-d.lift,age:0,life:d.fuse,projectileRadius:9,bounces:0,radius,stale,hits:new Map()});GameAudio.cue(d.family==='earth'?'staff-swing':d.family==='explosion'?'staff-swing':d.family+'-cast',.6,f);}
 function terrain(x,y,r=0){const p=platforms.find(p=>p.main);return x>p.x-r&&x<p.x+p.w+r&&y>p.y+1&&y<p.y+90+r;}
 function burst(q){if(q.kind!=='item')return;const d=items[q.index];q.kind=q.index===0?'burst':'field';q.age=0;q.life=q.charged?(d.chargedDuration||d.duration):d.duration;q.vx=q.vy=0;q.healed=0;q.id=fighters[q.owner].ryzaFieldSerial=(fighters[q.owner].ryzaFieldSerial||0)+1;q.hits=new Map();GameAudio.cue(d.family==='earth'?'earth-cast':d.family==='explosion'?'explosion':d.family+'-cast',.8,fighters[q.owner]);}
 function box(q){return{x1:q.x-q.radius*.8,y1:q.y-18,x2:q.x+q.radius*.8,y2:q.y-18,radius:q.index===0?q.radius*.6:22};}
 function collide(q){for(const o of BattlePlayers.targets(fighters[q.owner])){if(q.dead)break;collideOne(q,o);}}
 function collideOne(q,o){if(q.index===3)return;const f=fighters[q.owner],d=items[q.index],last=q.hits.get(o.id);if(o.respawn||o.hitlag||last!==undefined&&(!d.rehit||q.age-last<d.rehit))return;const b=box(q),contact=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(!(contact||shield)||CombatSystem.protection(o).intangible||Array.from({length:20},(_,n)=>terrain(lerp(q.x,o.x,(n+1)/21),lerp(q.y-18,o.y-38,(n+1)/21))).some(Boolean))return;q.hits.set(o.id,q.age);const counter=o.attack;if(counter?.counterWindow&&o.timer>=counter.counterWindow[0]&&o.timer<=counter.counterWindow[1]){attack(o,counter.counterMove);o.inv=o.attack.totalFrames;return;}CombatSystem.hit(f,o,{...RyzaMoves.gale,type:'gale',damage:(q.charged?d.chargedDamage:d.damage)*(q.improvised?.65:1),staleMultiplier:q.stale,charge:0,projectile:true,soundFamily:d.family,element:q.index===1?'ice':null,launchDirection:Math.sign(o.x-q.x)||q.face,angle:q.index===1?-1.25:-.65,baseKnockback:q.index===0?4:1.3,knockbackGrowth:q.index===0?.085:.025,hitlagMultiplier:q.index===2?.6:1},b,contact);}
 function pillarBox(f,a,w){return[{x1:f.x,y1:f.y-8,x2:f.x,y2:f.y-a.pillarHeight,radius:a.pillarRadius,window:w}];}
 const staffGeometry={front:{origin:[8,-60],angles:[-.12,.08],radius:10},up:{origin:[0,-50],angles:[-1.1,-1.55],radius:12},low:{origin:[8,-27],angles:[-.05,.05],radius:9},back:{origin:[-8,-70],angles:[-3,-3.3],radius:11},spin:{origin:[0,-60],angles:[-3.3,.3],radius:12}};
 function staffBoxes(f,a,w,t){const g=staffGeometry[w.shape];if(!g)return[];const angle=lerp(...g.angles,(t-w.start)/Math.max(1,w.end-w.start)),reach=(w.reach??a.reach)*FIGHTER_SCALE*.72,x=f.x+g.origin[0]*f.face,y=f.y+g.origin[1];return[{x1:x,y1:y,x2:x+Math.cos(angle)*reach*f.face,y2:y+Math.sin(angle)*reach,radius:g.radius,window:w}];}
 function tick(){for(const f of fighters)if(f.characterId==='ryza'&&f.respawn){f.ryzaItem=null;f.ryzaSelection=0;}for(const q of objects){const f=fighters[q.owner];if(!f||f.respawn){q.dead=true;continue;}q.age++;q.previousX=q.x;q.previousY=q.y;
   if(q.kind==='item'){const d=items[q.index];q.vy+=d.gravity;const steps=Math.max(1,Math.ceil(Math.hypot(q.vx,q.vy)/4));for(let j=0;j<steps&&q.kind==='item';j++){const old={x:q.x,y:q.y};q.x+=q.vx/steps;q.y+=q.vy/steps;const floor=platforms.find(p=>q.vy>0&&old.y<=p.y-3&&q.y>=p.y-3&&q.x>=p.x&&q.x<=p.x+p.w);if(floor){q.y=floor.y;if(q.bounces<d.bounces){q.bounces++;q.vy=-Math.abs(q.vy)*.5;q.vx*=.7;}else burst(q);}else if(terrain(q.x,q.y,q.projectileRadius)){q.x=old.x;q.y=old.y;burst(q);}}
    if(q.kind==='item'&&q.age>=q.life)burst(q);
   }else{collide(q);if(q.index===3&&q.age%healInterval(q)===0&&Math.abs(f.x-q.x)<q.radius&&Math.abs(f.y-q.y)<70&&!f.hitlag&&!f.respawn){const before=f.damage;f.damage=Math.max(0,f.damage-items[3].heal);q.healed+=before-f.damage;GameAudio.cue('water-cast',.3,f);}if(q.age>=q.life)q.dead=true;}
  }objects=objects.filter(q=>!q.dead);
 }
 function healInterval(q){return items[q.index].healInterval||30;}
 function cpu(f,o,i){const p=platforms.find(p=>p.main),under=!f.grounded&&f.y>p.y+35&&f.x>p.x-25&&f.x<p.x+p.w+25;
  if(f.attack?.glideStep){const side=f.x<p.x+p.w/2?-1:1,outside=side<0?f.x<p.x-f.character.ecb.radius-12:f.x>p.x+p.w+f.character.ecb.radius+12;i.x=f.y>p.y-15?(outside?side*.15:side):-side;i.y=-.4;i.special=i.jump=i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&under&&!f.recovered){i.x=f.x<p.x+p.w/2?-1:1;i.y=0;i.special=i.jab=i.heavy=i.smash=i.guard=false;i.jump=f.airJumps>0&&f.vy>=0;}
  else if(!f.attack&&!f.grounded&&!f.recovered&&f.y>p.y-120&&(f.x<p.x||f.x>p.x+p.w)){i.x=Math.sign(720-f.x);i.y=-1;i.special=true;i.jump=i.jab=i.heavy=i.smash=i.guard=false;}
  else if(!f.attack&&f.grounded&&Math.abs(o.x-f.x)>260&&frame%90===0){i.x=0;i.y=f.ryzaItem?1:0;i.special=true;i.jump=i.jab=i.heavy=i.smash=i.guard=false;}
  if(f.attack?.synthesis){i.x=i.y=0;i.specialHeld=f.attack.chargeFrames<30;}
  if(f.attack?.swingCharge)i.specialHeld=Math.abs(o.x-f.x)>160&&f.attack.chargeFrames<32;return i;
 }
 return{items,reset,prepare,action,holding,throwItem,burst,box,terrain,collide,pillarBox,staffGeometry,staffBoxes,tick,cpu,get objects(){return objects;}};
})();

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('ryza',{"heavy":{"strike":[7,9],"windup":14},"jab2":{"strike":[6,7],"windup":14},"upsmash":{"strike":[16,8],"windup":14},"uair":{"strike":[16],"windup":14},"smash":{"strike":[13,9],"windup":14},"jab3":{"strike":[6,9],"windup":14},"dashAttack":{"strike":[2,9],"windup":14}});

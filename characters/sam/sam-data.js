'use strict';
const SamPoseMap={jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30,grab:54,pummel:55,forwardThrow:56,backThrow:57,upThrow:58,downThrow:59,ledge:61,getupAttack:53};
const SamCargoAttacks=new Set(['jab','heavy','up','low','smash','upsmash','downsmash','air','fair','uair','dair']);
const SamMoves=(()=>{const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,tether:true};const a=NewcomerCore.moves(['カーゴジャブ','ポーターコンボ','ブーツキック','ケーススイング','カーゴリフト','ケースドロップ','ショルダータックル','ヘビーカーゴスイング','カーゴアップスロー','カーゴクラッシュ','カーゴターン','ケースプッシュ','バックキック','エアカーゴリフト','エアカーゴドロップ'],{
 dragon:m('ボーラガン',10,[],36,0,{...opt,samBola:true,projectile:true,pose:31,damage:5,chargeFrame:4,chargeButton:'special',chargeMaxFrames:35,soundFamily:'gun'}),
 dash:m('フローティングキャリア',9,[],21,0,{...opt,samCarrier:true,pose:35,soundFamily:'hammer'}),
 rise:m('クライミングアンカー',6,[],66,14,{...opt,samAnchor:true,pose:40,airControlMultiplier:.3,ledgeGrabStart:6,soundFamily:'spear'}),
 gale:m('荷物管理',12,[],24,0,{...opt,samCargo:true,pose:44,soundFamily:'hammer'}),
 airDrop:m('空中荷物管理',12,[],24,0,{...opt,samCargo:true,pose:44,soundFamily:'hammer',aerial:true})
 },'hammer',100);
 for(const[k,n]of Object.entries(SamPoseMap)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=n;}
 for(const k of['jab2','jab3','dashAttack','bair'])a[k].soundFamily='punch';a.smash.damage=24;a.heavy.damage=12;a.fair.damage=13;a.bair.damage=11;
 a.grab.newcomerHit=false;a.grab.name='ストランドつかみ';a.grab.reach=78;a.forwardThrow.name='押し出し投げ';a.backThrow.name='背負い投げ';a.upThrow.name='荷揚げ投げ';a.downThrow.name='ストランド足払い';
 // One low cargo impact rather than a second backward slash with the same pose.
 a.downsmash.activeFrames=[w(22,28,'shockwave',{index:0,pose:25})];a.downsmash.activeStart=22;a.downsmash.activeEnd=28;a.downsmash.totalFrames=51;
 for(const v of Object.values(a)){v.authoredEffectCoverage=!v.special;v.motionEndFrames=v.totalFrames;v.FAF=v.totalFrames+1;v.animation={...v.animation,anticipationPose:v.special?v.pose:v.aerial?65:63,accelerationPose:v.pose,recoveryPose:v.aerial?66:64,lean:0,lunge:0,impactScale:1};if(v.chargeFrame)v.chargeHoldFrames=v.chargeMaxFrames;}return a;
})();
function samDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function samSpeeds(f){const load=f.samLoad??1,base=CharacterData.sam;for(const k of['walkSpeed','initialDashSpeed','runSpeed','airSpeed'])f.character[k]=base[k]*(1.1-load*.1);f.character.weight=base.weight+load*6;}
function samGate(f,type){if(type==='rise')return !f.samAnchorUsed;if(type==='dragon')return !f.samBolaCooldown;if(type==='dash')return !f.samCarrierCooldown;if(['gale','airDrop'].includes(type))return !f.samCargoCooldown;return true;}
function samLand(f){if(!f.attack?.special)return false;Object.assign(f,{grounded:true,vy:0,fastFall:false,recovered:false,airDodged:false,airJumps:f.character.airJumpCount,jumps:0,mode:'GroundSpecial',state:PlayerStates.visual.GroundSpecial});return true;}
function samAnchorTarget(f,i){
 const hand={x:f.x,y:f.y-72},dir={x:clamp(i.x||0,-1,1),y:Math.min(-.25,i.y||-1)},len=Math.hypot(dir.x,dir.y),choices=[];
 for(const p of platforms){const candidates=[{x:p.x-12,y:p.y-8,edge:-1},{x:p.x+p.w+12,y:p.y-8,edge:1}];if(!p.main)candidates.push({x:clamp(hand.x+dir.x*180,p.x+8,p.x+p.w-8),y:p.y-8,edge:0});for(const q of candidates){const dx=q.x-hand.x,dy=q.y-hand.y,d=Math.hypot(dx,dy),dot=(dx*dir.x+dy*dir.y)/(Math.max(1,d)*len);if(d>35&&d<520&&dy<85&&dot>.46)choices.push({...q,main:!!p.main,top:p.y,d,score:dot*420-d*.35});}}
 return choices.sort((a,b)=>b.score-a.score)[0]||null;
}
function samReleaseAnchor(f,a,jump=false){a.phase='release';a.releasedAt=f.timer;a.tether=false;a.helpless=true;a.gravityMultiplier=1;a.airControlMultiplier=1;a.pose=43;a.motionCommitEnd=f.timer;f.buffer=null;f.grounded=false;f.vy=jump?-12:-8;f.vx=clamp(f.input?.x||0,-1,1)*5;samDuration(f,a,f.timer+9);}
const SamRules=NewcomerCore.create('sam',SamMoves,{
 reset(){for(const f of fighters){f.samBind=0;if(f.characterId==='sam'){f.samLoad=1;f.samAnchorUsed=false;f.samLastDamage=f.damage;f.samBolaCooldown=f.samCarrierCooldown=f.samCargoCooldown=0;samSpeeds(f);}}},
 status(f,r){if(f.respawn){f.samLoad=1;f.samAnchorUsed=false;}for(const k of['samBolaCooldown','samCarrierCooldown','samCargoCooldown'])if(f[k]>0)f[k]--;if((f.grounded||f.ledge)&&!f.attack?.samAnchor)f.samAnchorUsed=false;
  if(f.damage-(f.samLastDamage??f.damage)>=12&&f.samLoad>0&&!f.respawn){f.samLoad--;r.spawn(f,{kind:'cargo',x:f.x-f.face*35,y:f.y-50,vx:-f.face*2,vy:-3,settled:false,life:480,radius:23,damage:0});}f.samLastDamage=f.damage;samSpeeds(f);
 },
 prepare(f,a,r){a.activeFrames=a.activeFrames.map(v=>({...v}));a.timeline=a.timeline.map(e=>({...e}));if(SamCargoAttacks.has(a.type)){a.damage*=1+(f.samLoad??1)*.1;a.cargoLoad=f.samLoad??1;}
  if(a.special){a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];a.motionCommitEnd=a.totalFrames-6;}
  if(a.samCarrier){a.carrier=r.objects.find(q=>q.owner===f.id&&q.kind==='carrier'&&!q.dead);a.recall=!!a.carrier;f.samCarrierCooldown=24;if(a.recall){a.carrier.phase='return';a.carrier.hits.clear();a.carrier.returnedAt=a.carrier.age;}}
  if(a.samAnchor){f.samAnchorUsed=true;f.recovered=true;a.phase='aim';a.target=null;}
  if(a.samCargo){f.samCargoCooldown=24;a.held=0;a.decided=false;}
 },
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.samBola){a.pose=a.hold?33:t<10?31:t<30?32:34;if(t===10){a.burst=a.charge>=.3;f.samBolaCooldown=a.burst?52:32;}if(t===10||a.burst&&(t===18||t===26))r.spawn(f,{kind:'bola',x:f.x+a.originFace*48,y:f.y-55,vx:a.originFace*12,vy:clamp(i.y,-.6,.6)*2,life:45,radius:10,damage:a.burst?3.5:5});}
  if(a.samCarrier){a.pose=a.recall?37:t<9?35:36;if(t===9&&!a.recall)r.spawn(f,{kind:'carrier',x:f.x+a.originFace*45,y:f.y-14,vx:a.originFace*8,vy:0,phase:'out',life:480,radius:36,damage:8,top:f.y-24});}
  if(a.samCargo){if(!a.decided){a.pose=73;if(i.specialHeld&&t<30)a.held++;if(t>=12&&(!i.specialHeld||t>=30)){a.decided=true;a.decidedAt=t;const nearby=r.objects.find(q=>q.owner===f.id&&q.kind==='cargo'&&!q.dead&&Math.hypot(q.x-f.x,q.y-f.y)<100);if(a.held>=18){f.samLoad=Math.min(2,(f.samLoad??1)+1);a.pose=45;}else if(nearby){nearby.dead=true;f.samLoad=Math.min(2,(f.samLoad??1)+1);a.pose=45;}else if(f.samLoad>0){f.samLoad--;a.pose=44;r.spawn(f,{kind:'cargo',x:f.x+a.originFace*43,y:f.y-5,vx:a.originFace*1.5,vy:0,life:600,radius:25,damage:0,settled:false});}else a.pose=45;samDuration(f,a,t+18);samSpeeds(f);}}else if(t>a.decidedAt+9)a.pose=f.grounded?64:66;}
  if(a.samAnchor){if(a.phase==='aim'){a.pose=40;if(t===6){a.target=samAnchorTarget(f,i);a.phase='cast';r.spawn(f,{kind:'hook',x:f.x,y:f.y-72,vx:0,vy:0,life:85,radius:6,damage:0,target:a.target,castAt:t});}}
   if(a.phase==='cast'){a.pose=41;if(t>=23&&!a.target){a.phase='miss';a.tether=false;a.helpless=true;samDuration(f,a,t+9);}}
   if(a.phase==='pull'){a.pose=t%10<5?42:43;const q=a.target,dx=q.x-f.x,dy=q.y+70-f.y,dist=Math.hypot(dx,dy);f.grounded=false;f.fastFall=false;a.gravityMultiplier=0;f.vx=dx/Math.max(1,dist)*12+clamp(i.x,-1,1)*1.2;f.vy=dy/Math.max(1,dist)*15;
    if(i.jump||dist<30||t>=65){if(q.main&&dist<36&&!i.jump){const ledge=StageRules.ledges.find(e=>Math.abs(e.x-(q.edge<0?q.x+12:q.x-12))<3);if(ledge){a.tether=false;f.attack=null;PlayerController.catchLedge(f,ledge);return;}}samReleaseAnchor(f,a,!!i.jump);}}
   if(a.phase==='release'||a.phase==='miss')a.pose=43;
  }
  if(a.special)a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];
 },
 projectile(q,f,o,r){if(f.respawn||q.age>=q.life){q.dead=true;return true;}q.previousX=q.x;q.previousY=q.y;
  if(q.kind==='hook'){const a=f.attack;if(!a?.samAnchor){q.dead=true;return true;}if(a.phase==='release'||a.phase==='miss'){q.dead=true;return true;}const target=q.target||{x:f.x+q.face*70,y:f.y-470},dx=target.x-q.x,dy=target.y-q.y,d=Math.hypot(dx,dy);if(a.phase==='cast'){q.x+=dx/Math.max(1,d)*Math.min(28,d);q.y+=dy/Math.max(1,d)*Math.min(28,d);if(d<=28&&q.target){a.phase='pull';a.attachedAt=f.timer;}}else{q.x=target.x;q.y=target.y;}return true;}
  if(q.kind==='cargo'){const stacks=r.objects.filter(v=>v.owner===q.owner&&v.kind==='cargo'&&!v.dead);if(stacks.length>3){stacks.sort((a,b)=>b.age-a.age)[0].dead=true;if(q.dead)return true;}if(!q.settled){q.vy+=.5;q.x+=q.vx;q.y+=q.vy;const floor=platforms.find(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY<=p.y+8&&q.y>=p.y);if(floor){q.y=floor.y;q.vx=q.vy=0;q.settled=true;}if(q.y>1300)q.dead=true;}return true;}
  if(q.kind==='carrier'){const riders=fighters.filter(v=>!v.hitstun&&!v.hitlag&&!v.pendingLaunch&&!v.ledge&&!v.grabOwner&&v.grounded&&Math.abs(v.y-(q.y-10))<3&&Math.abs(v.x-q.x)<42);if(q.phase==='return'){const dx=f.x-q.x,dy=f.y-30-q.y,d=Math.hypot(dx,dy);q.vx=dx/Math.max(1,d)*11;q.vy=dy/Math.max(1,d)*11;if(d<34){q.dead=true;return true;}}
   else if(q.age>25){q.phase='hover';q.vx=riders.includes(f)?clamp(f.input?.x||0,-1,1)*5.6:q.vx*.8;q.vy=0;}
   q.x+=q.vx;q.y+=q.vy;if(q.phase==='hover')for(const v of riders){v.x+=q.x-q.previousX;v.y+=q.y-q.previousY;if(v.characterId==='sam')v.samRidePose=2;}
   if(q.phase!=='hover'){const main=platforms.find(p=>p.main);if(StageGeometry.overlaps(main,q.x,q.y,3,3)){q.x=q.previousX;q.y=q.previousY;if(q.phase==='out'){q.phase='hover';q.vx=q.vy=0;}else q.dead=true;}samProjectileHits(q,f,r);}if(q.x<-900||q.x>2340||q.y>1300)q.dead=true;return true;}
  if(q.kind==='bola'){q.x+=q.vx;q.y+=q.vy;const main=platforms.find(p=>p.main);if(StageGeometry.overlaps(main,q.x,q.y,3,3)){q.dead=true;return true;}samProjectileHits(q,f,r);return true;}return true;
 },
 boxes(f,a,w){if(a.special)return[];const n=w.pose??a.pose,paths={16:[.45,.38,1.02,.37],17:[.45,.4,1.02,.38],18:[.4,.45,1.02,.35],19:[.3,.38,.96,.35],20:[.5,.48,.53,-.02],21:[.42,.5,.92,.87],22:[.4,.35,.98,.3],23:[.45,.45,1.03,.48],24:[.5,.4,.6,-.02],25:[.12,.84,.96,.84],26:[.2,.4,1.02,.5],27:[.4,.45,1.03,.42],28:[.6,.44,-.04,.48],29:[.5,.42,.53,-.02],30:[.5,.45,.64,1.04]},p=paths[n]||[.4,.4,.98,.4],rect=SamArtRects.frames[n],s=NativeStrikes.scale(f,n,samNativeScale(n),false)*FIGHTER_SCALE,anchor=NewcomerArtAnchors.sam[n],point=(x,y)=>({x:f.x+(x-anchor)*rect[2]*s*f.face,y:f.y+(y-1)*rect[3]*s}),p1=point(p[0],p[1]),p2=point(p[2],p[3]);return[{x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y,radius:14,window:w,modifiers:w}];},
 hurtboxes(f){const low=[11,21,25,30,44,47,48,49,52,53,59,71,73,74,75].includes(samPose(f));return[{part:'head',x:f.x,y:f.y-(low?44:83),r:16},{part:'torso',x:f.x,y:f.y-(low?29:49),r:21},{part:'legs',x:f.x,y:f.y-13,r:17}];},
 cpu(f,o,i,clear){const a=f.attack,p=platforms.find(p=>p.main);if(a?.samAnchor){clear();i.x=Math.sign(p.x+p.w/2-f.x)*.65;i.y=-1;}if(a?.samBola)i.specialHeld=Math.abs(o.x-f.x)>230&&f.timer<=4;if(!a&&f.grounded&&frame%227===f.id&&!f.samCargoCooldown&&Math.abs(o.x-f.x)>170){clear();i.y=1;i.special=true;i.specialHeld=true;}if(a?.samCargo&&!a.decided)i.specialHeld=f.samLoad<2;}
});
function samProjectileHits(q,f){const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};for(const v of BattlePlayers.targets(f)){if(q.hits.has(v.id)||CombatSystem.protection(v).intangible)continue;const touch=CombatSystem.contact(b,v),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(v.mode)&&CombatSystem.shieldCovers(v,b);if(!touch&&!shield)continue;q.hits.add(v.id);const protectedBefore=CombatSystem.protection(v),a={...SamMoves.dragon,type:q.sourceType||'dragon',sourceType:q.sourceType,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,angle:q.kind==='bola'?-.9:-.65,baseKnockback:q.kind==='bola'?3.5:4.1,knockbackGrowth:q.kind==='bola'?.015:.055,soundFamily:q.kind==='bola'?'gun':'hammer'};if(q.kind==='bola')a.throwHitstun=24;CombatSystem.hit(f,v,a,b,touch);if(q.kind==='bola'){if(!shield&&!protectedBefore.invincible)v.samBind=28;q.dead=true;}break;}}
SamRules.support=f=>SamRules.objects.some(q=>!q.dead&&(q.kind==='carrier'&&q.phase==='hover'||q.kind==='cargo'&&q.settled)&&Math.abs(f.y-(q.y-(q.kind==='cargo'?34:10)))<3&&Math.abs(f.x-q.x)<(q.kind==='cargo'?28:42));
SamRules.platform=(f,i,v)=>{if(f.respawn||f.ledge||f.grabOwner||f.mode==='Grabbed')return;const downSpecial=!!(f.attack?.downSpecialInput||['gale','airDrop'].includes(f.attack?.type)||i.special&&i.y>.5),pass=(f.drop||v.wasAir&&i.y>.65)&&!downSpecial&&!f.hitstun&&!f.tumbling;
 for(const q of SamRules.objects){if(q.dead||!(q.kind==='carrier'&&q.phase==='hover'||q.kind==='cargo'&&q.settled))continue;const h=q.kind==='cargo'?34:10,w=q.kind==='cargo'?28:42,top=q.y-h;
  if(!pass&&f.vy>=0&&v.oldY<=top+6&&f.y>=top&&Math.abs(f.x-q.x)<w){f.y=top;f.vy=0;f.grounded=true;if(v.wasAir)PlayerController.land(f,i,v.oldVy);}
  // Cases are solid low obstacles; carrier decks remain one-way platforms.
  else if(q.kind==='cargo'&&Math.abs(f.y-top)>3&&f.y>top+3&&f.y-f.character.ecb.height<q.y){const dx=f.x-v.oldX,edge=q.x+(dx>0?-1:1)*(w+f.character.ecb.radius);if(dx&&(edge-v.oldX)/dx>=0&&(edge-v.oldX)/dx<=1){f.x=edge;f.vx=0;}}
 }};
const samBaseTick=SamRules.tick;SamRules.tick=()=>{samBaseTick();for(const f of fighters){if(f.samBind>0)f.samBind--;if(f.samRidePose>0)f.samRidePose--;}};
function samPose(f){if(f.mode==='Pummel')return 55;if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.samRidePose>0)return 38;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 60;if(f.mode==='LedgeGetup')return 61;if(f.mode==='JumpSquat')return 13;if(f.mode==='ForwardRoll')return 48;if(f.mode==='BackwardRoll')return 49;if(f.state==='walk')return[1,2,3,4][Math.floor(frame/7)%4];if(f.state==='run')return[5,6,7,8][Math.floor(frame/4)%4];return({idle:0,crouch:11,jump:14,double:15,fall:62,land:74,guard:46,dodge:47,hit:50,fly:51,down:52,getup:53,grab:54,caught:50,throw:56})[f.state]??0;}
MoveMotion.define('sam',Object.fromEntries(Object.entries(SamPoseMap).filter(([k])=>['jab','jab2','jab3','heavy','up','low','dashAttack','smash','upsmash','downsmash','air','fair','bair','uair','dair'].includes(k)).map(([k,n])=>[k,{windup:['air','fair','bair','uair','dair'].includes(k)?65:63,strike:[n],recovery:['air','fair','bair','uair','dair'].includes(k)?66:64}])));

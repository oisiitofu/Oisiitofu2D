'use strict';
const DanteMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'},a=NewcomerCore.moves(['リボルバー','二丁拳銃','剣払い','レインストーム','吹き上げ斬り','足払い','突き','スタイル斬撃','ヘルブレイカー','スティンガー連打','銃撃コンボ','エボニー＆アイボリー','円斬り','ライジングスター','ストンプ'],{
 dragon:m('リボルバーショット',9,[],27,14,{...opt,gunVolley:true,projectile:true,pose:7,soundFamily:'saber',airControlMultiplier:.35,preserveVelocity:false}),
 dash:m('スタイルアクション・ソードマスター',10,[w(10,13,'front',{pose:8,damage:4}),w(19,22,'front',{pose:8,damage:4}),w(29,32,'front',{pose:9,damage:9})],18,18,{...opt,styleAction:true,pose:8,damage:4,baseKnockback:1.8,knockbackGrowth:.035,airControlMultiplier:.3,preserveVelocity:false}),
 rise:m('ステインガー・エアトリック',9,[w(9,21,'up')],79,24,{...opt,airStinger:true,pose:19,helpless:true,airControlMultiplier:0,gravityMultiplier:0,preserveVelocity:false,ledgeGrabStart:15}),
 gale:m('デビルトリガー',22,[w(22,24,'shockwave',{pose:18})],24,20,{...opt,devilTrigger:true,pose:18,damage:7,airControlMultiplier:.35,preserveVelocity:false}),
 airDrop:m('デビルトリガー・空中',22,[w(22,24,'shockwave',{pose:18})],24,20,{...opt,devilTrigger:true,pose:18,damage:7,aerial:true,airControlMultiplier:.35,preserveVelocity:false}),
 styleGun:m('スタイルアクション・ガンスリンガー',10,[],31,18,{...opt,styleAction:true,styleIndex:1,pose:7,soundFamily:'saber',airControlMultiplier:.25,preserveVelocity:false}),
 styleTrick:m('スタイルアクション・トリックスター',7,[],28,21,{...opt,styleAction:true,styleIndex:2,pose:2,airControlMultiplier:0,gravityMultiplier:.3,intangibleFrames:[[9,12]],preserveVelocity:false}),
 styleGuard:m('スタイルアクション・ロイヤルガード',6,[],22,20,{...opt,styleAction:true,styleIndex:3,pose:20,counterWindow:[6,23],counterMove:'counter',airControlMultiplier:.15,preserveVelocity:false}),
 counter:m('ロイヤルリリース',4,[w(4,7,'front',{pose:9})],22,18,{...opt,royalRelease:true,pose:9,damage:14,reach:175,baseKnockback:5.5,knockbackGrowth:.085})
 },'sword',155);
 const poses={jab:6,jab2:7,jab3:8,heavy:8,up:10,low:11,dashAttack:9,smash:8,upsmash:10,downsmash:9,air:12,fair:13,bair:14,uair:15,dair:16,grab:17,pummel:6,ledge:8,getupAttack:11,forwardThrow:7,backThrow:14,upThrow:10,downThrow:11};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const win of a[k].activeFrames)win.pose=win.shape==='back'&&k==='getupAttack'?14:n;}
 a.downsmash.activeFrames=[w(22,26,'front',{pose:9}),w(30,34,'back',{pose:14})];a.upsmash.activeFrames=[w(20,26,'up',{pose:10})];a.grab.newcomerHit=false;
 for(const v of Object.values(a)){v.motionEndFrames=v.totalFrames;v.FAF=v.totalFrames+1;v.animation={...v.animation,anticipationPose:3,accelerationPose:v.pose,recoveryPose:0,lean:0,lunge:0,impactScale:1};}
 return a;
})();
const DanteStyles=['ソードマスター','ガンスリンガー','トリックスター','ロイヤルガード'];
// Measured native weapon endpoints, normalized within each extracted pose.
const DanteWeaponPoints={6:[.67,.16,.99,.16],7:[.73,.19,.99,.19],8:[.56,.25,.99,.275],9:[.65,.32,.99,.37],10:[.65,.36,.915,.015],11:[.44,.65,.98,.68],12:[.70,.29,.99,.29],13:[.69,.20,.99,.20],14:[.60,.10,.02,.20],15:[.68,.27,.05,.02],16:[.17,.70,.17,.99],42:[.67,.44,.99,.63],43:[.62,.44,.99,.5],44:[.66,.35,.99,.015],46:[.72,.55,.97,.63]};
function danteWeapon(f,n){const p=DanteWeaponPoints[n];if(!p)return null;const r=DanteArtRects.frames[n],s=danteNativeScale(n)*FIGHTER_SCALE,anchor=NewcomerArtAnchors.dante[n],point=(x,y)=>({x:f.x+(x-anchor)*r[2]*s*f.face,y:f.y+(y-1)*r[3]*s});return[point(p[0],p[1]),point(p[2],p[3])];}
function danteDuration(f,a,total){const diff=total-a.totalFrames;a.totalFrames=a.motionEndFrames=total;a.FAF=total+1;f.faf+=diff;f.stateEnd+=diff;}
function danteBurst(f,a,i,second=false){a.launched=true;a.activeFrames=second?[...a.activeFrames,CombatData.window(f.timer,f.timer+12,'up')]:[CombatData.window(f.timer,f.timer+12,'up')];a.activeStart=f.timer;a.activeEnd=f.timer+12;a.burstAge=0;a.second=second;a.phase='burst';a.gravityMultiplier=0;const ix=Math.abs(i.x)>.15?clamp(i.x,-1,1):0,iy=second?clamp(i.y,-1,1):-1,len=Math.max(.1,Math.hypot(ix,iy));a.burstX=ix/len*(second?13:10);a.burstY=iy/len*(second?13:19);if(second&&Math.hypot(ix,iy)<.2){a.burstX=a.originFace*10;a.burstY=-10;}f.face=Math.sign(a.burstX)||f.face;f.grounded=false;f.vx=a.burstX;f.vy=a.burstY;f.recovered=true;f.fastFall=false;f.specialLandingLag=24;}
function danteReturnPose(n){return n===0?40:[1,2,24,25,26,27,28,29,30,31].includes(n)?41:[8].includes(n)?42:[9].includes(n)?43:[4,10,15,19,33,34].includes(n)?44:[5,35].includes(n)?45:[3,11,32,36].includes(n)?46:n===18?47:n;}
const DanteRules=NewcomerCore.create('dante',DanteMoves,{
 prepare(f,a){f.danteStyle??=0;f.danteDevilTime??=0;f.danteDevilCooldown??=0;
  if(a.styleAction&&a.type==='dash'){const index=f.danteStyle,variant=[DanteMoves.dash,DanteMoves.styleGun,DanteMoves.styleTrick,DanteMoves.styleGuard][index],old=a.totalFrames;Object.assign(a,variant,{type:'dash',styleIndex:index});f.faf+=a.totalFrames-old;f.stateEnd+=a.totalFrames-old;f.danteStyle=(index+1)%4;}
  if(f.danteDevilTime>0&&!a.devilTrigger){a.powered=true;a.damage*=1.2;a.activeFrames=a.activeFrames.map(w=>({...w,...(w.damage!==undefined?{damage:w.damage*1.2}:{})}));}
  if(a.airStinger){a.launched=a.second=a.queued=false;a.phase='startup';a.specialWas=true;a.burstAge=0;}
 },
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.gunVolley){f.vx*=.85;if(t===22&&i.specialHeld){a.extended=true;danteDuration(f,a,55);}if(a.extended&&!i.specialHeld&&!a.releasing){a.releasing=true;danteDuration(f,a,t+16);}if([9,15,21].includes(t)||a.extended&&i.specialHeld&&[27,33,39].includes(t))r.spawn(f,{kind:'bullet',x:f.x+f.face*60,y:f.y-61,vx:f.face*18,vy:clamp(i.y,-1,1)*4,damage:a.powered?4.8:4,radius:6,life:38});}
  if(a.styleAction){f.face=a.originFace;if(a.styleIndex===1&&[10,16,22].includes(t))for(const dy of[-3.5,3.5])r.spawn(f,{kind:'bullet',x:f.x+f.face*60,y:f.y-61,vx:f.face*16,vy:dy+clamp(i.y,-1,1)*2,damage:a.powered?3.6:3,radius:6,life:36});
   if(a.styleIndex===2){f.buffer=null;if(t===7){a.trickX=(Math.abs(i.x)>.15?i.x:a.originFace)*13;a.trickY=a.originGrounded?0:clamp(i.y,-1,1)*6;}if(t>=7&&t<=17){f.vx=a.trickX;f.vy=a.trickY;}else if(t>17){a.gravityMultiplier=1;f.vx*=.7;}}
   else f.vx*=.65;
  }
  if(a.devilTrigger&&t===22&&!a.triggered){a.triggered=true;f.danteDevilTime=480;f.danteDevilCooldown=0;}
  if(a.airStinger){f.buffer=null;f.fastFall=false;const held=!!i.specialHeld,fresh=!!i.special||held&&!a.specialWas;a.specialWas=held;if(fresh&&a.launched&&!a.second){a.queued=true;a.nextInput={x:i.x,y:i.y};}
   if(t<9)f.vx=f.vy=0;if(t===9){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>=p.y+89){f.recovered=true;NewcomerCore.escape(f,a);}else danteBurst(f,a,i);}
   if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)danteBurst(f,a,{...i,x:Math.sign(720-f.x)});return;}
   if(a.phase==='burst'){f.vx=a.burstX;f.vy=a.burstY;f.grounded=false;if(++a.burstAge>=14){a.phase=a.second?'recovery':'hover';a.hoverAge=0;a.gravityMultiplier=a.second?1:0;f.vx=a.burstX*.25;f.vy=a.second?-2:0;if(a.second)danteDuration(f,a,t+22);}}
   else if(a.phase==='hover'){f.vx*=.8;f.vy=0;a.hoverAge++;if(a.queued){danteBurst(f,a,a.nextInput,true);danteDuration(f,a,t+36);}else if(a.hoverAge>=12){a.phase='recovery';a.gravityMultiplier=1;danteDuration(f,a,t+22);}}
  }
 },
 collision(f,i,v){const a=f.attack;if(a?.airStinger&&a.phase==='burst'&&v.oldVy<-2&&f.vy===0&&!f.grounded){a.phase='startup';a.launched=false;NewcomerCore.escape(f,a);}},
 boxes(f,a,w){if(a.devilTrigger)return[{x1:f.x-65,y1:f.y-45,x2:f.x+65,y2:f.y-45,radius:24,window:w}];if(a.airStinger)return a.phase==='burst'?[{x1:f.x,y1:f.y-46,x2:f.x+a.burstX*4,y2:f.y-46+a.burstY*4,radius:15,window:w}]:[];
  const n=w.pose??a.pose,dir=w.shape==='back'?-1:1,up=w.shape==='up',down=w.shape==='down',low=w.shape==='low';if(w.shape==='spin')return[{x1:f.x-55,y1:f.y-50,x2:f.x+55,y2:f.y-50,radius:17,window:w}];
  // Native pose 14 swings backward already. Mirror the measured segment only
  // once, then draw the FX along that same segment.
  const shown=f.danteDevilTime>0?danteReturnPose(n):n,weapon=danteWeapon(f,shown);if(weapon&&!low){const[p,q]=weapon;return[{x1:p.x,y1:p.y,x2:q.x,y2:q.y,radius:12,window:w}];}
  const y=f.y-(low?13:down?30:up?44:52),reach=[8,9].includes(n)?125:n===14?95:[6,7,12,13].includes(n)?65:72;
  return[{x1:f.x+(up||down?0:dir*15)*f.face,y1:y,x2:f.x+(up?20:down?12:dir*reach)*f.face,y2:up?f.y-140:down?f.y+38:y,radius:12,window:w}];
 },
 hurtboxes(f){const n=pose(f),low=[3,11,22,32,36,37,46].includes(n);return[{part:'head',x:f.x,y:f.y-(low?35:82),r:16},{part:'torso',x:f.x,y:f.y-(low?24:46),r:21},{part:'legs',x:f.x,y:f.y-14,r:16}];},
 projectile(q,f,o){if(f.respawn||q.age>=q.life){q.dead=true;return true;}q.previousX=q.x;q.previousY=q.y;q.x+=q.vx;q.y+=q.vy;const main=platforms.find(p=>p.main);if(platforms.some(p=>q.x>p.x&&q.x<p.x+p.w&&q.previousY<=p.y&&q.y>=p.y)||q.x>main.x&&q.x<main.x+main.w&&q.y>main.y&&q.y<main.y+90){q.dead=true;return true;}
  const b={x1:q.previousX,y1:q.previousY,x2:q.x,y2:q.y,radius:q.radius};if(!q.hits.has(o.id)&&!o.respawn&&!CombatSystem.protection(o).intangible){const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(touch||shield){q.hits.add(o.id);if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){o.face=Math.sign(f.x-o.x)||o.face;attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;}else CombatSystem.hit(f,o,{...DanteMoves.dragon,type:'bullet',projectile:true,damage:q.damage,staleMultiplier:q.stale,charge:0,launchDirection:q.face,baseKnockback:1.7,knockbackGrowth:.025},b,touch);q.dead=true;}}return true;
 },
 cpu(f,o,i,clear){const a=f.attack,p=platforms.find(p=>p.main);if(a?.gunVolley){clear();i.specialHeld=Math.abs(o.x-f.x)>200;i.y=clamp((o.y-f.y)/200,-1,1);}if(a?.airStinger){clear();i.x=a.escapeSide||Math.sign(p.x+p.w/2-f.x);i.y=-.75;i.specialHeld=false;i.special=a.phase==='hover'&&!a.second;}if(!a&&f.grounded&&!f.danteDevilTime&&!f.danteDevilCooldown&&Math.abs(o.x-f.x)>180&&frame%150===f.id){clear();i.y=1;i.special=true;}}
});
// Dynamic burst windows follow the actual launch, including underside escape.
(()=>{const reset=DanteRules.reset,tick=DanteRules.tick;function stats(f,powered){f.character={...CharacterData.dante,...(powered?{runSpeed:CharacterData.dante.runSpeed*1.15,initialDashSpeed:CharacterData.dante.initialDashSpeed*1.15,airSpeed:CharacterData.dante.airSpeed*1.15,fullHopVelocity:CharacterData.dante.fullHopVelocity+1.5}: {})};f.dantePoweredState=powered;}
 DanteRules.reset=()=>{reset();for(const f of fighters)if(f.characterId==='dante'){f.danteStyle=f.danteDevilTime=f.danteDevilCooldown=0;stats(f,false);}};
 DanteRules.tick=()=>{tick();for(const f of fighters)if(f.characterId==='dante'){f.danteStyle??=0;f.danteDevilTime??=0;f.danteDevilCooldown??=0;if(f.respawn){f.danteStyle=f.danteDevilTime=f.danteDevilCooldown=0;}else{if(f.danteDevilCooldown>0)f.danteDevilCooldown--;if(f.danteDevilTime>0&&! --f.danteDevilTime)f.danteDevilCooldown=300;}const powered=f.danteDevilTime>0;if(f.dantePoweredState!==powered)stats(f,powered);}};
})();

function dantePose(f){const a=f.attack;let n;if(a?.airStinger)n=a.phase==='burst'?(Math.abs(a.burstX)>Math.abs(a.burstY)?9:19):a.phase==='hover'?34:a.phase==='recovery'?5:3;else if(a)n=CombatData.sample(a,f.timer).pose;else if(['LedgeCatch','LedgeHang'].includes(f.mode))n=38;else if(f.mode==='LedgeGetup')n=39;else if(f.mode==='JumpSquat')n=32;else if(f.state==='walk')n=24+Math.floor(frame/6)%4;else if(f.state==='run')n=28+Math.floor(frame/3)%4;else n=({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:21,fly:21,down:22,getup:37,ledge:38,grab:17,caught:21,throw:7})[f.state]??0;return f.danteDevilTime>0?danteReturnPose(n):n;}

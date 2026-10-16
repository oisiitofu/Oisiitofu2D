'use strict';
const ShizunaMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,opt={special:true,newcomerHit:true,soundFamily:'sword'};
 const a=NewcomerCore.moves(['閃斬','返し斬り','三の太刀','長刀一閃','斬り上げ','足元払い','踏み込み斬り','白銀の一太刀','天翔斬','雪月輪','旋空斬','空中一閃','背面斬り','天舞','落葉'],{
  dragon:m('双影',9,[w(9,12,'front',{pose:41})],12,0,{...opt,shizunaShadow:true,pose:41,damage:7,reach:145}),
  dash:m('乱雪',10,[w(10,13,'front',{pose:42,damage:4}),w(18,21,'spin',{pose:43,damage:4}),w(26,29,'spin',{pose:43,damage:8})],10,0,{...opt,shizunaSnow:true,pose:42,damage:4,reach:140}),
  rise:m('九十九颯',8,[w(8,12,'up',{pose:44,damage:5})],26,13,{...opt,shizunaGale:true,pose:44,damage:5,reach:135,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:8}),
  gale:m('奥義・零月一閃',17,[w(17,21,'front',{pose:47})],12,0,{...opt,shizunaMoon:true,pose:47,damage:10,reach:160}),
  airDrop:m('空中・零月一閃',17,[w(17,21,'front',{pose:47})],12,12,{...opt,shizunaMoon:true,aerial:true,pose:47,damage:10,reach:160})
 },'sword',150),poses={jab:6,jab2:7,jab3:9,heavy:9,up:8,low:11,dashAttack:12,smash:9,upsmash:8,downsmash:11,air:10,fair:13,bair:14,uair:15,dair:16,grab:17,pummel:18,ledge:6,getupAttack:11,forwardThrow:19,backThrow:7,upThrow:8,downThrow:16};
 for(const[k,n]of Object.entries(poses)){a[k].pose=n;for(const v of a[k].activeFrames)v.pose=v.shape==='back'&&['downsmash','getupAttack'].includes(k)?7:n;}
 a.grab.newcomerHit=false;for(const v of Object.values(a)){v.motionEndFrames=v.totalFrames;v.FAF=v.totalFrames+1;v.animation={...v.animation,anticipationPose:v.special?v.pose:3,accelerationPose:v.pose,recoveryPose:v.special?v.pose:0,lean:0,lunge:0,impactScale:1};}return a;
})();
function shizunaFlip(f,n){return[14,43,45].includes(n)||n===7&&(CombatData.activeWindow(f.attack,f.timer)?.shape==='back'||f.attack?.type==='backThrow');}
function shizunaPoint(f,n,x,y){const r=ShizunaArtRects.frames[n],s=BattleSize.native('shizuna',n)*FIGHTER_SCALE*BattleSize.art(f.characterId),flip=shizunaFlip(f,n)?-1:1;return{x:f.x+(x-NewcomerArtAnchors.shizuna[n])*r[2]*s*f.face*flip,y:f.y+((y-1)*r[3]+BattleSize.baseline(f,n))*s};}
const ShizunaStrikes={6:[.4,.5,.99,.39],7:[.4,.5,.99,.4],8:[.4,.4,.2,.01],9:[.4,.5,.99,.49],11:[.35,.65,.99,.85],12:[.35,.55,.99,.5],13:[.4,.5,.99,.5],14:[.4,.5,.99,.5],15:[.4,.6,.45,.01],16:[.45,.4,.6,.99],18:[.4,.5,.88,.4],19:[.4,.5,.99,.4],41:[.4,.5,.99,.5],42:[.4,.6,.99,.5],44:[.4,.7,.99,.03],45:[.4,.7,.99,.03],46:[.4,.7,.6,.02],47:[.4,.5,.99,.5]};
// World-space outer reach, including the blade's radius. Keep grab/throw ranges unchanged.
const ShizunaReach={jab:115,jab2:110,jab3:128,heavy:142,low:120,dashAttack:140,smash:160,downsmash:140,fair:145,bair:135,dragon:145,dash:145,gale:160,airDrop:160};
function shizunaShadowBox(q){return{x1:q.x,y1:q.y-48,x2:q.x+q.face*126,y2:q.y-48,radius:19};}
function shizunaDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;}
function shizunaStep(f,a,i){if(Math.abs(i.x)>.2)f.face=Math.sign(i.x);a.step=(a.step||0)+1;a.stepAt=f.timer;a.pose=[44,45,46][a.step-1];a.activeFrames.push(CombatData.window(f.timer,f.timer+5,'up',{pose:a.pose,damage:a.step===3?8:5}));a.gravityMultiplier=0;f.grounded=false;f.recovered=true;f.fastFall=false;f.vx=(Math.abs(i.x)>.2?i.x:f.face*.45)*[7.5,9,7][a.step-1];f.vy=-[11.8,12.5,13][a.step-1];shizunaDuration(f,a,f.timer+27);}
const ShizunaRules=NewcomerCore.create('shizuna',ShizunaMoves,{
 reset(){for(const f of fighters)if(f.characterId==='shizuna')f.shizunaCP=0;},
 status(f){f.shizunaCP??=0;if(f.respawn)f.shizunaCP=0;},
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));a.phase='startup';if(a.shizunaMoon){a.spentCP=f.shizunaCP||0;f.shizunaCP=0;a.damage=10+a.spentCP*.15;a.reach=160+a.spentCP*.8;for(const w of a.activeFrames)w.damage=a.damage;}},
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.shizunaShadow){a.pose=41;f.vx*=.7;if(t===9)r.spawn(f,{kind:'shadow',x:f.x,y:f.y,face:f.face,damage:6,life:28,originGrounded:f.grounded});}
  if(a.shizunaSnow){a.pose=t<17?42:43;f.vx=t>=10&&t<17?f.face*5:moveToward(f.vx,0,1);}
  if(a.shizunaGale){const p=platforms.find(p=>p.main);if(t===8){if(f.x>p.x&&f.x<p.x+p.w&&f.y-f.character.ecb.height>p.y+89){NewcomerCore.escape(f,a);shizunaDuration(f,a,t+100);}else shizunaStep(f,a,i);}if(a.escapeSide){NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)shizunaStep(f,a,{...i,x:Math.sign(p.x+p.w/2-f.x)});return;}if(a.step){const dt=t-a.stepAt;if(dt>=7&&dt<=15&&a.step<3&&i.special&&!a.specialWas)shizunaStep(f,a,i);else if(dt===15&&a.step<3&&i.specialHeld)shizunaStep(f,a,i);if(t-a.stepAt>8){a.gravityMultiplier=.7;f.vx=moveToward(f.vx,i.x*5,.2);}if(t-a.stepAt>=16)a.pose=35;}a.specialWas=!!i.special;}
  if(a.shizunaMoon){a.pose=47;f.vx*=.65;if(t===17){const b=attackVisualBoxes(f)[0];if(b)r.spawn(f,{kind:'moon',x:b.x2,y:b.y2,vx:0,damage:0,life:9,power:a.spentCP,strike:{x1:b.x1,y1:b.y1,x2:b.x2,y2:b.y2,radius:b.radius}});}}
 },
 onHit(f,o,a){if(a.damage>0&&!a.shizunaMoon)f.shizunaCP=Math.min(100,(f.shizunaCP||0)+Math.min(15,a.damage+4));},
 boxes(f,a,w){
  const n=w.pose??a.pose,make=(b,tip,radius)=>({x1:b.x,y1:b.y,x2:tip.x,y2:tip.y,radius,window:w,modifiers:w});
  if(w.shape==='spin'){
   const half=a.shizunaSnow?(w.damage===8?85:72):70,radius=a.shizunaSnow?27:24;
   return[make({x:f.x-half,y:f.y-48},{x:f.x+half,y:f.y-48},radius)];
  }
  const p=ShizunaStrikes[n];if(!p)return;
  const b=shizunaPoint(f,n,p[0],p[1]),tip=shizunaPoint(f,n,p[2],p[3]);
  const changed=ShizunaReach[a.type]!=null||['up','upsmash','uair','dair','rise'].includes(a.type);
  const radius=changed?(a.type.includes('smash')?22:a.aerial?21:18):11;
  if(ShizunaReach[a.type]!=null){
   const dir=f.face*(w.shape==='back'?-1:1),reach=ShizunaReach[a.type]+(a.shizunaMoon?(a.spentCP||0)*.8:0);
   tip.x=f.x+dir*Math.max(dir*(tip.x-f.x),reach-radius);
  }
  if(w.shape==='up')tip.y=Math.min(changed?f.y-(a.type==='uair'?132:145):tip.y,b.y-65,tip.y);
  if(w.shape==='down')tip.y=Math.max(changed?f.y+40:tip.y,b.y+60,tip.y);
  const boxes=[make(b,tip,radius)];
  // The upward swing crosses above both shoulders before reaching its apex.
  if(['up','upsmash','uair'].includes(a.type)){
   const y=f.y-(a.type==='uair'?110:120),half=a.type==='uair'?43:52;
   boxes.push(make({x:f.x-half*f.face,y},{x:f.x+(half+10)*f.face,y:y-8},radius));
  }
  return boxes;
 },
 projectile(q,f,o){if(q.kind==='moon')return q.dead=q.age>=q.life,true;if(q.kind!=='shadow')return false;if(f.respawn||q.age>=q.life){q.dead=true;return true;}if(q.age<13||q.age>17)return true;const b=shizunaShadowBox(q);if(!q.hits.has(o.id)&&!o.respawn&&!CombatSystem.protection(o).intangible){const c=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(c||shield){q.hits.add(o.id);CombatSystem.hit(f,o,{...ShizunaMoves.dragon,type:'shizunaShadow',sourceType:q.sourceType,damage:q.damage,projectile:false,charge:0,launchDirection:q.face,staleMultiplier:q.stale},b,c);}}return true;},
 cpu(f,o,i,clear){const a=f.attack;if(a?.shizunaGale){clear();i.x=Math.sign(platforms.find(p=>p.main).x+platforms.find(p=>p.main).w/2-f.x)*.8;i.y=-1;i.special=a.step<3&&f.timer-a.stepAt===10;}else if(!a&&f.grounded&&(f.shizunaCP||0)>=65&&Math.abs(o.x-f.x)<210&&frame%90===f.id){clear();i.x=0;i.y=1;i.special=true;}}
});
function shizunaPose(f){const a=f.attack;if(a?.special)return a.pose;if(a)return CombatData.sample(a,f.timer).pose;if(['LedgeCatch','LedgeHang'].includes(f.mode))return 38;if(f.mode==='LedgeGetup')return 39;if(f.mode==='JumpSquat')return 32;if(f.state==='walk')return 24+Math.floor(frame/6)%4;if(f.state==='run')return 28+Math.floor(frame/3)%4;return({idle:0,crouch:3,jump:33,double:34,fall:35,land:36,guard:20,dodge:3,hit:5,fly:21,down:22,getup:37,ledge:38,grab:17,caught:5,throw:19})[f.state]??0;}

'use strict';
const HydaelynNormals=['jab','jab2','jab3','heavy','up','low','dashAttack','smash','upsmash','downsmash','air','fair','bair','uair','dair'];
const HydaelynPoseMap=Object.fromEntries(HydaelynNormals.map((name,n)=>[name,16+n]));
Object.assign(HydaelynPoseMap,{guard:46,grab:57,pummel:58,forwardThrow:59,backThrow:60,upThrow:61,downThrow:62,ledge:74,getupAttack:54});
const HydaelynMotion=Object.fromEntries(HydaelynNormals.map((name,n)=>[name,[76+n,16+n,91+n]]));
const HydaelynMoves=(()=>{
 const m=CombatData.createMove,opt={special:true,newcomerHit:true,tether:true,airControlMultiplier:0,soundFamily:'magic'};
 const moves=NewcomerCore.moves(['クリスタルジャブ','フェザーリフト','フェザー・パーム','翼の薙ぎ払い','ライジングブレード','クリスタルスイープ','翼の滑走斬り','光翼の大斬撃','光の結晶柱','クリスタルバースト','フェザーリング','光刃の突き','背翼の薙ぎ払い','天上の光刃','降下の結晶剣'],{
  dragon:m('クリスタルレイ',12,[],70,0,{...opt,hydaelynRay:true,projectile:true,pose:31,damage:8}),
  dash:m('ウィングラッシュ',10,[],96,0,{...opt,hydaelynWing:true,pose:34,damage:13,gravityMultiplier:0}),
  rise:m('アセンション',10,[],150,0,{...opt,hydaelynAscend:true,pose:37,damage:0,gravityMultiplier:0,helpless:true,ledgeGrabStart:18}),
  gale:m('ハイデリンクリスタル',14,[],25,0,{...opt,hydaelynCrystal:true,pose:41,damage:10}),
  airDrop:m('ハイデリンクリスタル',14,[],25,0,{...opt,hydaelynCrystal:true,pose:41,damage:10,aerial:true})
 },'sword',120);
 for(const [name,n]of Object.entries(HydaelynPoseMap))if(moves[name]){moves[name].pose=n;for(const w of moves[name].activeFrames)w.pose=n;}
 moves.grab.newcomerHit=false;for(const name of ['jab3','heavy','smash','air'])moves[name].soundFamily='magic';
 for(const [name,a]of Object.entries(moves)){const s=HydaelynMotion[name]||[a.pose,a.pose,45];a.authoredEffectCoverage=!a.special;a.animation={...a.animation,anticipationPose:s[0],accelerationPose:a.pose,recoveryPose:s[2],lean:0,lunge:0,impactScale:1};}
 return moves;
})();
function hydaelynDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function hydaelynOwned(f,kind){return HydaelynRules.objects.filter(q=>q.owner===f.id&&q.kind===kind&&!q.dead);}
function hydaelynSegment(x,y,b){const dx=b.x2-b.x1,dy=b.y2-b.y1,t=clamp(((x-b.x1)*dx+(y-b.y1)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(x-b.x1-t*dx,y-b.y1-t*dy);}
function hydaelynBreakable(q,f,radius){return q.age>6&&BattlePlayers.targets(f).some(e=>e.attack&&attackBoxes(e).some(b=>hydaelynSegment(q.x,q.y-(q.kind==='crystal'?32:0),b)<b.radius+radius));}
function hydaelynRemote(q,f,move,box,damage,angle=-1.05){for(const e of BattlePlayers.targets(f)){if(q.hits.has(e.id)||CombatSystem.protection(e).intangible)continue;const contact=CombatSystem.contact(box,e),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(e.mode)&&CombatSystem.shieldCovers(e,box);if(!contact&&!shield)continue;q.hits.add(e.id);CombatSystem.hit(f,e,{...move,type:q.sourceType||'dragon',projectile:true,charge:0,damage,baseKnockback:3.5,knockbackGrowth:.055,sourceType:q.sourceType,staleMultiplier:q.stale,launchDirection:q.face,angle,soundFamily:'magic'},box,contact);}}
function hydaelynGate(f,type){if(type==='rise')return !f.recovered;if(type==='dash')return f.grounded||!f.newSideUsed;if(['gale','airDrop'].includes(type))return f.grounded||!f.newDownUsed;return true;}
function hydaelynFinish(f,a,r){if(a.circleId){const q=r.objects.find(q=>q.id===a.circleId);if(q)q.dead=true;}a.phase='glide';a.glideAt=f.timer;a.gravityMultiplier=.24;a.airControlMultiplier=.8;a.activeFrames=[];f.vx=clamp(f.vx,-6,6);f.vy=Math.max(f.vy,-2);hydaelynDuration(f,a,f.timer+30);}
function hydaelynRise(f,a,r,i){a.phase='ride';a.rideAt=f.timer;f.grounded=false;f.recovered=true;f.y-=4;const anchor=hydaelynOwned(f,'crystal').filter(q=>q.age>=q.delay+8).sort((x,y)=>Math.abs(x.x-f.x)-Math.abs(y.x-f.x))[0];a.anchorId=anchor?.id||0;const q=r.spawn(f,{kind:'circle',x:f.x,y:f.y+3,vx:0,vy:0,life:100,radius:28,damage:0});a.circleId=q.id;}
function hydaelynLand(f){const a=f.attack;if(!a?.special)return false;if(a.hydaelynAscend||a.hydaelynWing){for(const q of HydaelynRules.objects)if(q.id===a.circleId||q.id===a.markerId)q.dead=true;a.phase='land';a.endAt=f.timer;a.activeFrames=[];a.gravityMultiplier=1;hydaelynDuration(f,a,f.timer+13);}
 Object.assign(f,{grounded:true,vy:0,fastFall:false,recovered:false,helpless:false,gravityOff:false,shortHop:false,ledgeGrabs:0,airDodged:false,airJumps:f.character.airJumpCount,jumps:0,mode:'GroundSpecial',state:PlayerStates.visual.GroundSpecial});return true;}
const HydaelynRules=NewcomerCore.create('hydaelyn',HydaelynMoves,{
 prepare(f,a){a.activeFrames=a.activeFrames.map(w=>({...w}));a.phase='wind';if(a.special){a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];a.motionCommitEnd=a.totalFrames-6;}if(a.hydaelynCrystal){a.aimX=f.x+a.originFace*120;f.newDownUsed=true;}},
 action(f,i,r){const a=f.attack,t=f.timer;
  if(a.hydaelynRay){f.vx=moveToward(f.vx,0,.6);a.pose=a.released?(t<a.releaseAt+5?32:33):31;if(!a.released&&t>=12&&(!i.specialHeld||t>=58)){const charge=clamp(t-12,0,46);a.released=true;a.releaseAt=t;let length=340+charge*3,damage=8+charge*.12;const y=f.y-58,anchor=hydaelynOwned(f,'crystal').find(q=>q.age>=q.delay+8&&(q.x-f.x)*a.originFace>0&&(q.x-f.x)*a.originFace<length&&Math.abs(q.y-32-y)<65);if(anchor){anchor.dead=true;length+=135;damage+=5;a.amplified=true;}r.spawn(f,{kind:'ray',x:f.x+a.originFace*25,y,vx:0,vy:0,life:10,length,radius:a.amplified?15:11,damage,charged:charge>=20,amplified:!!a.amplified,family:'magic'});hydaelynDuration(f,a,t+17);}}
  if(a.hydaelynCrystal){f.vx=moveToward(f.vx,0,.5);a.pose=t<14?41:t<20?42:t<28?43:44;if(t<14)a.aimX+=clamp(i.x,-1,1)*4;if(t===14){const p=platforms.filter(p=>a.aimX>=p.x&&a.aimX<=p.x+p.w&&p.y>=f.y-80).sort((x,y)=>Math.abs(x.y-f.y)-Math.abs(y.y-f.y))[0]||platforms.find(p=>p.main);const q=r.spawn(f,{kind:'crystal',x:clamp(a.aimX,p.x+18,p.x+p.w-18),y:p.y,vx:0,vy:0,life:280,delay:30,radius:22,damage:10});const owned=hydaelynOwned(f,'crystal');if(owned.length>2)owned[0].dead=true;a.crystalId=q.id;}}
  if(a.hydaelynWing){f.fastFall=false;if(a.phase==='wind'){a.pose=34;f.vx*=.65;f.vy*=.5;if(t>=10){const anchor=hydaelynOwned(f,'crystal').filter(q=>q.age>=q.delay+8&&Math.abs(q.x-f.x)<380).sort((x,y)=>Math.abs(x.x-f.x)-Math.abs(y.x-f.x))[0];const q=r.spawn(f,{kind:'tracer',x:anchor?.x??f.x+a.originFace*190,y:anchor?anchor.y-74:f.y-74+clamp(i.y,-1,0)*80,vx:0,vy:0,life:58,radius:16,damage:0,anchorId:anchor?.id||0});a.markerId=q.id;a.phase='aim';a.aimAt=t;}}
   else if(a.phase==='aim'){a.pose=34;f.vx*=.6;f.vy=0;if(!i.specialHeld)a.armed=true;const q=r.objects.find(q=>q.id===a.markerId&&!q.dead);if(i.guard||!q||t-a.aimAt>48){if(q)q.dead=true;a.phase='end';a.endAt=t;a.gravityMultiplier=1;hydaelynDuration(f,a,t+13);}else if(a.armed&&i.special){a.phase='fly';a.flyAt=t;a.target={x:q.x,y:q.y};a.powered=!!q.anchorId;const anchor=r.objects.find(v=>v.id===q.anchorId&&!v.dead);if(anchor)anchor.dead=true;q.dead=true;f.grounded=false;f.newSideUsed=true;f.y-=4;}}
   else if(a.phase==='fly'){a.pose=35;const dx=a.target.x-f.x,dy=a.target.y-(f.y-54);f.vx=clamp(dx*.25,-15,15);f.vy=clamp(dy*.25,-12,12);f.face=Math.sign(dx)||f.face;if(Math.hypot(dx,dy)<24||t-a.flyAt>=27){a.phase='cut';a.cutAt=t;a.pose=36;a.gravityMultiplier=.7;f.vx*=.35;f.vy*=.3;a.damage+=a.powered?4:0;a.activeFrames=[CombatData.window(t,t+5,'front',{pose:36,index:0,meleeCoverage:true})];a.activeStart=t;a.activeEnd=t+5;hydaelynDuration(f,a,t+22);}}
   else if(a.phase==='cut'){a.pose=t-a.cutAt<9?36:45;}else a.pose=45;
  }
  if(a.hydaelynAscend){f.fastFall=false;if(a.phase==='wind'){a.pose=37;f.vx*=.5;f.vy=0;if(t>=10){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y>p.y+65){NewcomerCore.escape(f,a);a.phase='escape';}else hydaelynRise(f,a,r,i);}}
   else if(a.phase==='escape'){a.pose=5;NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)hydaelynRise(f,a,r,i);}
   else if(a.phase==='ride'){a.pose=38;const q=r.objects.find(q=>q.id===a.circleId&&!q.dead);if(!q){hydaelynFinish(f,a,r);}else{const guide=r.objects.find(v=>v.id===a.anchorId&&!v.dead);q.y-=4.9;if(guide)q.x+=clamp((guide.x-q.x)*.045,-2,2);f.vx=Math.abs(i.x)>.25?i.x*5:clamp((q.x-f.x)*.3,-4,4);f.vy=clamp(q.y-f.y,-8,8);if(t-a.rideAt>=10&&(!i.specialHeld||Math.abs(f.x-q.x)>29)||t-a.rideAt>=70)hydaelynFinish(f,a,r);}}
   else if(a.phase==='glide'){a.pose=t-a.glideAt<15?39:40;f.vx=moveToward(f.vx,i.x*5,.25);}else if(a.phase==='land')a.pose=40;
  }
 },
 projectile(q,f,o,r){
  if(['crystal','circle','tracer','ray'].includes(q.kind)){if(f.respawn||q.age>=q.life){q.dead=true;return true;}if(q.kind!=='ray'&&hydaelynBreakable(q,f,q.radius)){q.dead=true;return true;}}
  if(q.kind==='crystal'){if(q.age>=q.delay&&q.age<q.delay+8){const b={x1:q.x,y1:q.y-5,x2:q.x,y2:q.y-180,radius:24};hydaelynRemote(q,f,HydaelynMoves.gale,b,q.damage,-1.4);}return true;}
  if(q.kind==='circle'){if(f.attack?.circleId!==q.id)q.dead=true;return true;}
  if(q.kind==='tracer'){if(q.anchorId&&!r.objects.some(v=>v.id===q.anchorId&&!v.dead))q.dead=true;return true;}
  if(q.kind==='ray'){if(q.age<=4){const b={x1:q.x,y1:q.y,x2:q.x+q.face*q.length,y2:q.y,radius:q.radius};hydaelynRemote(q,f,HydaelynMoves.dragon,b,q.damage,-.15);}return true;}
  return false;
 },
 boxes(f,a,w){return hydaelynNativeBox(f,a,w);},
 cpu(f,o,i,clear){const a=f.attack;if(a?.hydaelynAscend){clear();i.x=a.phase==='ride'?0:Math.sign(720-f.x);i.y=-1;i.specialHeld=a.phase!=='ride'||f.timer-a.rideAt<48;return;}if(a?.hydaelynWing){clear();i.specialHeld=a.phase==='wind';i.special=a.phase==='aim'&&!!a.armed;return;}if(a?.hydaelynRay){i.specialHeld=Math.abs(o.x-f.x)>180&&f.timer<32;return;}if(a)return;const d=Math.abs(o.x-f.x);if(f.grounded&&hydaelynOwned(f,'crystal').length<2&&(frame+f.id*7)%137===0){clear();f.face=Math.sign(o.x-f.x)||f.face;i.x=0;i.y=1;i.special=true;}else if(d>120&&d<320&&(frame+f.id*11)%113===0){clear();i.x=Math.sign(o.x-f.x);i.y=0;i.special=true;i.specialHeld=true;}else if(d>180&&d<550&&f.grounded&&(frame+f.id*13)%61===0){clear();f.face=Math.sign(o.x-f.x);i.x=i.y=0;i.special=true;i.specialHeld=true;}}
});
function hydaelynNativeBox(f,a,w){const n=w.pose??a.pose,rect=HydaelynArtRects.frames[n],s=NativeStrikes.scale(f,n,hydaelynNativeScale(n),false)*FIGHTER_SCALE,anchor=NewcomerArtAnchors.hydaelyn[n];const tips={jab:[.5,.31,.99,.29],jab2:[.6,.4,.99,.01],jab3:[.65,.38,.99,.42],heavy:[.65,.4,.99,.43],up:[.5,.65,.5,.02],low:[.6,.64,.99,.85],dashAttack:[.6,.35,.99,.31],smash:[.65,.4,.99,.45],upsmash:[.5,.65,.5,.01],downsmash:[.5,.7,.9,.94],air:[.02,.4,.98,.4],fair:[.6,.35,.99,.33],bair:[.6,.41,.01,.39],uair:[.65,.45,.99,.01],dair:[.5,.5,.66,.99]};let p=tips[a.type]||[.55,.5,.99,.65];if(a.type==='downsmash'&&w.shape==='back')p=[.5,.7,.02,.94];const point=(x,y)=>({x:f.x+(x-anchor)*rect[2]*s*f.face,y:f.y+(y-1)*rect[3]*s+BattleSize.baseline(f,n)*s});const p1=point(p[0],p[1]),p2=point(p[2],p[3]);return[{x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y,radius:15,window:w,modifiers:w}];}
function hydaelynPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 55;if(f.mode==='LedgeGetup')return 56;if(f.mode==='ForwardRoll')return 47;if(f.mode==='BackwardRoll')return 48;if(f.mode==='SpotDodge')return 49;if(f.mode==='JumpSquat')return 3;return({idle:[0,73][Math.floor(frame/18)%2],walk:[1,71][Math.floor(frame/7)%2],run:[2,72][Math.floor(frame/6)%2],crouch:3,jump:6,double:6,fall:[4,69][Math.floor(frame/10)%2],land:70,guard:46,dodge:50,hit:51,fly:52,down:53,getup:54,grab:57,caught:51,throw:59})[f.state]??0;}
MoveMotion.define('hydaelyn',Object.fromEntries(Object.entries(HydaelynMotion).map(([name,s])=>[name,{windup:s[0],strike:[s[1]],recovery:s[2]}])));
CharacterGuide.define('hydaelyn',{strength:'下Bで予告つきの光柱と結晶を設置。NBの光線が結晶を通ると消費して強化。横Bは目印を出した後、必殺を離して押し直すとそこへ飛び斬る。上Bは長押しで光の輪に乗り、左右に降りるか離すと滑空する。',caution:'結晶・横Bの目印・上Bの輪は相手の攻撃で壊れる。横Bの待機はガードで中止。上Bの乗車と滑空、ジャンプ長押しの浮遊には時間制限があり、空中で技を替えても回復しない。'});

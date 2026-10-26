'use strict';
const RyutaPoseMap={jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30,grab:61,pummel:62,forwardThrow:63,backThrow:64,upThrow:65,downThrow:66,ledge:59,getupAttack:55};
const RyutaMotion={jab:[67,16,73],jab2:[16,17,73],jab3:[69,18,73],heavy:[68,19,73],up:[69,20,73],low:[70,21,73],dashAttack:[5,22,73],smash:[68,23,73],upsmash:[69,24,73],downsmash:[70,25,73],air:[71,26,14],fair:[71,27,14],bair:[72,28,14],uair:[12,29,14],dair:[10,30,14]};
const RyutaMoves=(()=>{const m=CombatData.createMove,opt={special:true,newcomerHit:true,tether:true};const a=NewcomerCore.moves(["ジャブ","ストレート","横蹴り","エルボー","アッパー","足払い","ショルダータックル","渾身の正拳突き","天空突き","両側の踏み込み","空中ジャブ","飛び蹴り","後ろ蹴り","突き上げ","両足キック"],{
dragon:m("応援の一喝",8,[],120,0,{...opt,pose:31,projectile:true,soundFamily:"punch"}),
dash:m("団結突撃",8,[],110,0,{...opt,pose:34,soundFamily:"punch"}),
rise:m("応援大ジャンプ",8,[],160,0,{...opt,pose:38,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:12,soundFamily:"punch"}),
gale:m("全力コール",12,[],90,0,{...opt,pose:42,soundFamily:"punch"}),
airDrop:m("全力コール",12,[],90,0,{...opt,pose:42,aerial:true,soundFamily:"punch"})},"punch",94);
for(const[k,n]of Object.entries(RyutaPoseMap)){a[k].pose=n;for(const w of a[k].activeFrames)w.pose=n;}a.grab.newcomerHit=false;
for(const[k,v]of Object.entries(a)){const s=RyutaMotion[k]||[v.pose,v.pose,0];v.authoredEffectCoverage=!v.special;v.animation={...v.animation,anticipationPose:s[0],accelerationPose:v.pose,recoveryPose:s[2],lean:0,lunge:0,impactScale:1};}return a;})();
function ryutaDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function ryutaLand(f){if(!f.attack?.special)return false;Object.assign(f,{grounded:true,vy:0,fastFall:false,recovered:false,helpless:false,gravityOff:false,shortHop:false,ledgeGrabs:0,airDodged:false,airJumps:f.character.airJumpCount,jumps:0,mode:'GroundSpecial',state:PlayerStates.visual.GroundSpecial});return true;}
function ryutaObject(f,kind){return RyutaRules.objects.find(q=>q.owner===f.id&&q.kind===kind&&!q.dead);}
function ryutaShot(r,f,kind,v={}){return r.spawn(f,{kind,x:f.x+f.face*28,y:f.y-98*.55,vx:f.face*8,vy:0,life:65,radius:11,damage:8,base:2.8,growth:.032,angle:-.65,...v});}
function ryutaWindow(f,a,shape,frames=5,values={}){a.activeFrames=[CombatData.window(f.timer,f.timer+frames,shape,{pose:a.pose,index:0,meleeCoverage:true,damage:10,baseKnockback:3,knockbackGrowth:.034,...values})];a.activeStart=f.timer;a.activeEnd=f.timer+frames;}
function ryutaFloor(q){const p=platforms.find(p=>q.x>=p.x&&q.x<=p.x+p.w&&q.previousY<=p.y+1&&q.y>=p.y&&q.vy>=0);if(p){q.y=p.y;q.vy=0;q.grounded=true;}else if(q.grounded&&!platforms.some(p=>q.x>=p.x&&q.x<=p.x+p.w&&Math.abs(q.y-p.y)<2))q.grounded=false;return p;}
function ryutaContact(q,f,y=q.y){const b={x1:q.previousX,y1:q.previousY-(q.y-y),x2:q.x,y2:y,radius:q.radius};for(const o of BattlePlayers.targets(f)){if(q.hits.has(o.id)||CombatSystem.protection(o).intangible)continue;const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(!touch&&!shield)continue;q.hits.add(o.id);if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;q.dead=true;continue;}CombatSystem.hit(f,o,{...RyutaMoves[q.sourceType||'dragon'],type:q.sourceType||'dragon',special:true,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,angle:q.angle,baseKnockback:q.base,knockbackGrowth:q.growth,soundFamily:q.family||"punch"},b,touch);ryutaProjectileHit(q,f,o);if(q.single)q.dead=true;}return q.hits.size;}
function ryutaDamagedObject(q,f,radius=22){return BattlePlayers.targets(f).some(o=>o.attack&&attackBoxes(o).some(b=>{const dx=b.x2-b.x1,dy=b.y2-b.y1,t=clamp(((q.x-b.x1)*dx+(q.y-b.y1)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(q.x-b.x1-t*dx,q.y-b.y1-t*dy)<b.radius+radius;}));}
function ryutaEscape(f,a,begin){if(a.phase==='escape') {NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)begin();return true;}if(a.phase==='start'&&f.timer===8){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y>p.y+65){NewcomerCore.escape(f,a);a.phase='escape';ryutaDuration(f,a,f.timer+190);return true;}}return false;}
function ryutaReset(f){Object.assign(f,{ryutaRiseUsed:false,ryutaCooldown:0,ryutaSquadCD:0,ryutaCallCD:0});}
function ryutaGate(f,type){return type==='rise'?!f.ryutaRiseUsed:type==='dash'?!f.ryutaSquadCD&&!ryutaObject(f,'mate'):['gale','airDrop'].includes(type)?!f.ryutaCallCD:!f.ryutaCooldown;}
function ryutaStatus(f){if(f.ryutaSquadCD>0)f.ryutaSquadCD--;if(f.ryutaCallCD>0)f.ryutaCallCD--;}
function ryutaPrepare(f,a){a.good=0;a.beatInputs=[];}
function ryutaBeat(f,a,t,i){if(!i.special||t<7||a.beatInputs.some(n=>Math.abs(t-n)<6))return;f.buffer=null;a.beatInputs.push(t);if([12,24,36].some(n=>Math.abs(t-n)<=3))a.good++;}
function ryutaAction(f,a,t,i,r){ryutaBeat(f,a,t,i);
if(a.type==='dragon'){f.vx*=.7;a.pose=t<13?31:32;if(t===14&&!a.good||t===28&&a.good<2||t===39){if(!a.fired){a.fired=true;a.phase='voice';a.pose=33;ryutaShot(r,f,'voice',{vx:f.face*7,life:28,radius:20+a.good*9,damage:7+a.good*2});f.ryutaCooldown=55;ryutaDuration(f,a,t+20);}}}
if(a.type==='dash'){f.vx*=.7;a.pose=t<12?34:t<24?35:36;if(t===12){for(let n=0;n<2;n++)ryutaShot(r,f,'mate',{x:f.x+f.face*(60+n*65),y:f.y,vx:0,vy:0,life:85,damage:7,radius:22,member:n,kickAt:24+n*14,up:i.y<-.2,grounded:f.grounded});a.phase='squad';f.ryutaSquadCD=110;}if(t===37){for(const q of r.objects)if(q.owner===f.id&&q.kind==='mate')q.damage+=a.good;a.pose=37;ryutaDuration(f,a,54);}}
if(a.type==='rise'){const begin=()=>{a.phase='platform';a.launchAt=t;a.baseX=f.x;a.baseY=f.y;a.dir=Math.abs(i.x)>.2?i.x:f.face*.4;f.grounded=false;ryutaShot(r,f,'step',{x:f.x,y:f.y,vx:0,vy:0,life:60,damage:0,radius:0});ryutaDuration(f,a,t+90);};if(ryutaEscape(f,a,begin))return;if(a.phase==='start'){a.pose=38;f.vx*=.5;f.vy=0;if(t===8)begin();}else if(a.phase==='platform'){const n=t-a.launchAt;a.pose=n<10?39:n<20?40:41;if(n<26){f.vx=clamp(a.baseX+a.dir*(n*2)-f.x,-7,7);f.vy=-10.5;}if(n===26){a.phase='launch';a.gravityMultiplier=1;f.vx=(Math.abs(i.x)>.2?i.x:a.dir)*(a.good?10:7);f.vy=a.good?-13:-10;ryutaDuration(f,a,t+28);}}}
if(['gale','airDrop'].includes(a.type)){f.vx*=.7;a.pose=t<16?42:t<28?43:44;if(t===39){a.phase='call';ryutaShot(r,f,'call',{x:f.x,y:f.y-25,vx:0,vy:0,life:9,radius:80+a.good*18,damage:9+a.good*2,base:3,growth:.032});f.ryutaCallCD=110;a.pose=45;ryutaDuration(f,a,62);}}
}
function ryutaProjectile(q,f,o,r){if(q.kind==='step')return true;if(q.kind==='mate'){if(ryutaDamagedObject({...q,y:q.y-35},f,23)){q.dead=true;return true;}if(!q.grounded){q.vy+=.5;q.y+=q.vy;ryutaFloor(q);}if(q.age>=q.kickAt&&q.age<q.kickAt+8){q.x+=q.face*3;ryutaContact(q,f,q.y-(q.up?70:40));}return true;}q.x+=q.vx;q.y+=q.vy;ryutaContact(q,f);return true;}
function ryutaCPU(f,o,i,clear){if(f.attack?.special&&[12,24,36].includes(f.timer+1)){i.special=true;i.specialHeld=false;}else if(f.attack?.special)i.special=false;}

function ryutaNormal(f,a,i,r){}

function ryutaOnHit(f,o,a,r){}

function ryutaProjectileHit(q,f,o){}

function ryutaPoints(f,a,w,p){return p;}

const RyutaRules=NewcomerCore.create('ryuta',RyutaMoves,{
reset(r){for(const f of fighters)if(f.characterId==='ryuta')ryutaReset(f,r);},
status(f,r){if((f.grounded||f.ledge||f.respawn)&&f.attack?.type!=='rise')f.ryutaRiseUsed=false;if(f.ryutaCooldown>0)f.ryutaCooldown--;if(f.respawn)ryutaReset(f,r);ryutaStatus(f,r);},
prepare(f,a,r){a.activeFrames=a.activeFrames.map(w=>({...w}));if(!a.special)return;a.phase='start';a.motionCommitEnd=a.totalFrames-5;a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];if(a.type==='rise')f.ryutaRiseUsed=true;ryutaPrepare(f,a,r);},
action(f,i,r){const a=f.attack,t=f.timer;if(!a.special){ryutaNormal(f,a,i,r);return;}ryutaAction(f,a,t,i,r);a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];},
onHit(f,o,a,r){ryutaOnHit(f,o,a,r);},
projectile(q,f,o,r){if(!f||f.respawn||q.age>=q.life||q.x<-1100||q.x>2540||q.y>1550){q.dead=true;return true;}q.previousX=q.x;q.previousY=q.y;return ryutaProjectile(q,f,o,r);},
boxes(f,a,w){if(a.special&&!w.meleeCoverage)return[];return ryutaNativeBox(f,a,w);},
hurtboxes(f){const h=98,low=[4,10,21,25,43,49,54,55,60,66,70].includes(ryutaPose(f));return[{part:'head',x:f.x+f.face*5,y:f.y-h*(low?.52:.86),r:h*.14},{part:'torso',x:f.x,y:f.y-h*(low?.3:.53),r:h*.2},{part:'legs',x:f.x,y:f.y-h*.16,r:h*.18}];},
cpu(f,o,i,clear){const a=f.attack,p=platforms.find(p=>p.main);if(a?.type==='rise'){clear();i.x=Math.sign(p.x+p.w/2-f.x);i.y=-1;i.specialHeld=f.y>p.y-150;}if(!a&&f.grounded){const d=Math.abs(o.x-f.x);if(d>150&&d<450&&ryutaGate(f,'dash')){clear();i.x=Math.sign(o.x-f.x);i.y=0;i.special=true;}else if(d>100&&d<600&&ryutaGate(f,'dragon')){clear();f.face=Math.sign(o.x-f.x);i.x=i.y=0;i.special=true;}else if(d<135&&ryutaGate(f,'gale')){clear();i.x=0;i.y=1;i.special=true;}}ryutaCPU(f,o,i,clear);}
});
function ryutaNativeBox(f,a,w){const n=w.pose??a.pose,rect=RyutaArtRects.frames[n],s=NativeStrikes.scale(f,n,ryutaNativeScale(n),false)*FIGHTER_SCALE,anchor=NewcomerArtAnchors.ryuta[n],shape=w.shape;let p=shape==='up'?[.5,.7,.65,.01]:shape==='low'?[.4,.75,.99,.9]:shape==='down'?[.55,.4,.72,.995]:shape==='back'?[.6,.45,.005,.45]:[.5,.45,.995,.45];if(a.type==='downsmash')p=shape==='back'?[.5,.7,.005,.8]:[.5,.7,.995,.8];p=ryutaPoints(f,a,w,p);const point=(x,y)=>({x:f.x+(x-anchor)*rect[2]*s*f.face,y:f.y+(y-1)*rect[3]*s}),p1=point(p[0],p[1]),p2=point(p[2],p[3]);return[{x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y,radius:Math.min(20,98*.2),window:w,modifiers:w}];}
function ryutaPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 57;if(f.mode==='LedgeGetup')return 58;if(f.mode==='JumpSquat')return 10;if(f.mode==='ForwardRoll')return 47;if(f.mode==='BackwardRoll')return 48;if(f.mode==='SpotDodge')return 49;if(f.state==='walk')return[1,2,3][Math.floor(frame/7)%3];if(f.state==='run')return[5,6,7][Math.floor(frame/4)%3];return({idle:0,crouch:4,jump:11,double:13,fall:14,land:15,guard:46,dodge:50,hit:51,fly:53,down:54,getup:55,grab:61,caught:52,throw:63})[f.state]??0;}
MoveMotion.define('ryuta',Object.fromEntries(Object.entries(RyutaMotion).map(([k,s])=>[k,{windup:s[0],strike:[s[1]],recovery:s[2]}])));

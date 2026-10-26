'use strict';
const IoPoseMap={jab:16,jab2:17,jab3:18,heavy:19,up:20,low:21,dashAttack:22,smash:23,upsmash:24,downsmash:25,air:26,fair:27,bair:28,uair:29,dair:30,grab:61,pummel:62,forwardThrow:63,backThrow:64,upThrow:65,downThrow:66,ledge:59,getupAttack:55};
const IoMotion={jab:[67,16,73],jab2:[16,17,73],jab3:[69,18,73],heavy:[68,19,73],up:[69,20,73],low:[70,21,73],dashAttack:[5,22,73],smash:[68,23,73],upsmash:[69,24,73],downsmash:[70,25,73],air:[71,26,14],fair:[71,27,14],bair:[72,28,14],uair:[12,29,14],dair:[10,30,14]};
const IoMoves=(()=>{const m=CombatData.createMove,opt={special:true,newcomerHit:true,tether:true};const a=NewcomerCore.moves(["小突き","横薙ぎ","回転刺突","大きな薙ぎ払い","天に穿つ光","血の棘払い","槍の突進","血英の大薙ぎ","浄化の光","茨の噴出","回転薙ぎ","前方への突き","振り向き薙ぎ","上への光","急降下突き"],{
dragon:m("遠距離吸血",8,[],120,0,{...opt,pose:31,projectile:true,soundFamily:"spear"}),
dash:m("茨の突進",8,[],110,0,{...opt,pose:34,soundFamily:"spear"}),
rise:m("血英浮遊",8,[],160,0,{...opt,pose:38,helpless:true,gravityMultiplier:0,airControlMultiplier:0,ledgeGrabStart:12,soundFamily:"spear"}),
gale:m("支援・回復のギフト",12,[],90,0,{...opt,pose:42,soundFamily:"spear"}),
airDrop:m("支援・回復のギフト",12,[],90,0,{...opt,pose:42,aerial:true,soundFamily:"spear"})},"spear",125);
for(const[k,n]of Object.entries(IoPoseMap)){a[k].pose=n;for(const w of a[k].activeFrames)w.pose=n;}a.grab.newcomerHit=false;
for(const[k,v]of Object.entries(a)){const s=IoMotion[k]||[v.pose,v.pose,0];v.authoredEffectCoverage=!v.special;v.animation={...v.animation,anticipationPose:s[0],accelerationPose:v.pose,recoveryPose:s[2],lean:0,lunge:0,impactScale:1};}return a;})();
function ioDuration(f,a,end){const d=end-a.totalFrames;a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=d;f.stateEnd+=d;f.stateDuration=end;}
function ioLand(f){if(!f.attack?.special)return false;Object.assign(f,{grounded:true,vy:0,fastFall:false,recovered:false,helpless:false,gravityOff:false,shortHop:false,ledgeGrabs:0,airDodged:false,airJumps:f.character.airJumpCount,jumps:0,mode:'GroundSpecial',state:PlayerStates.visual.GroundSpecial});return true;}
function ioObject(f,kind){return IoRules.objects.find(q=>q.owner===f.id&&q.kind===kind&&!q.dead);}
function ioShot(r,f,kind,v={}){return r.spawn(f,{kind,x:f.x+f.face*28,y:f.y-94*.55,vx:f.face*8,vy:0,life:65,radius:11,damage:8,base:2.8,growth:.032,angle:-.65,...v});}
function ioWindow(f,a,shape,frames=5,values={}){a.activeFrames=[CombatData.window(f.timer,f.timer+frames,shape,{pose:a.pose,index:0,meleeCoverage:true,damage:10,baseKnockback:3,knockbackGrowth:.034,...values})];a.activeStart=f.timer;a.activeEnd=f.timer+frames;}
function ioFloor(q){const p=platforms.find(p=>q.x>=p.x&&q.x<=p.x+p.w&&q.previousY<=p.y+1&&q.y>=p.y&&q.vy>=0);if(p){q.y=p.y;q.vy=0;q.grounded=true;}else if(q.grounded&&!platforms.some(p=>q.x>=p.x&&q.x<=p.x+p.w&&Math.abs(q.y-p.y)<2))q.grounded=false;return p;}
function ioContact(q,f,y=q.y){const b={x1:q.previousX,y1:q.previousY-(q.y-y),x2:q.x,y2:y,radius:q.radius};for(const o of BattlePlayers.targets(f)){if(q.hits.has(o.id)||CombatSystem.protection(o).intangible)continue;const touch=CombatSystem.contact(b,o),shield=['ShieldStart','ShieldHold','ShieldDrop'].includes(o.mode)&&CombatSystem.shieldCovers(o,b);if(!touch&&!shield)continue;q.hits.add(o.id);if(o.attack?.counterWindow&&o.timer>=o.attack.counterWindow[0]&&o.timer<=o.attack.counterWindow[1]){attack(o,o.attack.counterMove);o.inv=o.attack.totalFrames;q.dead=true;continue;}CombatSystem.hit(f,o,{...IoMoves[q.sourceType||'dragon'],type:q.sourceType||'dragon',special:true,projectile:true,charge:0,damage:q.damage,staleMultiplier:q.stale,launchDirection:q.face,angle:q.angle,baseKnockback:q.base,knockbackGrowth:q.growth,soundFamily:q.family||"spear"},b,touch);ioProjectileHit(q,f,o);if(q.single)q.dead=true;}return q.hits.size;}
function ioDamagedObject(q,f,radius=22){return BattlePlayers.targets(f).some(o=>o.attack&&attackBoxes(o).some(b=>{const dx=b.x2-b.x1,dy=b.y2-b.y1,t=clamp(((q.x-b.x1)*dx+(q.y-b.y1)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(q.x-b.x1-t*dx,q.y-b.y1-t*dy)<b.radius+radius;}));}
function ioEscape(f,a,begin){if(a.phase==='escape') {NewcomerCore.escapeAction(f,a,0);if(!a.escapeSide)begin();return true;}if(a.phase==='start'&&f.timer===8){const p=platforms.find(p=>p.main);if(f.x>p.x&&f.x<p.x+p.w&&f.y>p.y+65){NewcomerCore.escape(f,a);a.phase='escape';ioDuration(f,a,f.timer+190);return true;}}return false;}
function ioReset(f){Object.assign(f,{ioRiseUsed:false,ioCooldown:0,ioIchor:50,ioFieldCD:0});}
function ioGate(f,type){return type==='rise'?!f.ioRiseUsed:type==='dash'?ioObject(f,'thorn')?true:!f.ioCooldown:['gale','airDrop'].includes(type)?f.ioIchor>=30&&!f.ioFieldCD:!f.ioCooldown;}
function ioStatus(f){f.ioIchor??=50;if(f.ioFieldCD>0)f.ioFieldCD--;}
function ioPrepare(f,a){if(a.type==='dash'){const q=ioObject(f,'thorn');a.root=q?{x:q.x,y:q.y}:null;}}
function ioAction(f,a,t,i,r){
 if(a.type==='dragon'){f.vx*=.8;a.pose=t<12?31:32;if(t>=12&&(!i.specialHeld||t>=45)&&!a.fired){a.fired=true;a.pose=33;a.phase='shot';ioShot(r,f,'blood',{damage:t>=30?12:7,radius:t>=30?16:10,vx:f.face*(t>=30?10:8),single:true});f.ioCooldown=32;ioDuration(f,a,t+22);}}
 if(a.type==='dash'){if(a.root){a.pose=36;a.phase='slide';if(t===1){a.activeFrames=[];f.vx=0;}ioDuration(f,a,26);if(t>=7&&t<=17){f.vx=clamp((a.root.x-f.x)*.2,-13,13);f.vy=clamp(a.root.y-f.y,-7,9);f.grounded=false;}if(t===18){f.vx*=.2;a.pose=37;}}else{f.vx*=.65;a.pose=t<12?34:35;if(t===12){const ground=platforms.filter(p=>f.x+f.face*150>=p.x&&f.x+f.face*150<=p.x+p.w&&p.y>=f.y-25).sort((a,b)=>a.y-b.y)[0];ioShot(r,f,'thorn',{x:f.x+f.face*150,y:ground?.y??f.y+80,vx:0,vy:0,life:125,radius:27,damage:10,delay:18,base:2.6,growth:.03});f.ioCooldown=55;a.phase='plant';ioDuration(f,a,33);}}}
 if(a.type==='rise'){const begin=()=>{a.phase='veil';a.liftAt=t;a.gravityMultiplier=0;f.grounded=false;f.vy=-10;ioDuration(f,a,t+67);};if(ioEscape(f,a,begin))return;if(a.phase==='start'){f.vx*=.6;f.vy=0;a.pose=38;if(t===8)begin();}else if(a.phase==='veil'){const n=t-a.liftAt;a.pose=n<14?39:40;f.vx=moveToward(f.vx,i.x*6,.5);f.vy=n<18?-10:-3.4;if(n>=22&&(!i.specialHeld||n>=51)){a.phase='fall';a.pose=41;a.gravityMultiplier=1;f.vy=-2;ioDuration(f,a,t+15);}}}
 if(['gale','airDrop'].includes(a.type)){f.vx*=.75;a.pose=t<12?42:t<24?43:44;if(t===16){f.ioIchor-=30;f.ioFieldCD=180;for(const q of r.objects)if(q.owner===f.id&&q.kind==='gift')q.dead=true;ioShot(r,f,'gift',{x:f.x,y:f.y,vx:0,vy:0,life:105,damage:0,healed:[],radius:65});a.phase='gift';ioDuration(f,a,39);}}
}
function ioProjectile(q,f,o,r){if(q.kind==='gift'){if(q.age%15===0){for(const v of fighters){if(BattlePlayers.targets(f).includes(v)||q.healed.includes(v.id)||Math.hypot(v.x-q.x,v.y-q.y)>70)continue;v.damage=Math.max(0,v.damage-6);q.healed.push(v.id);}}if(q.age>12&&ioDamagedObject(q,f,35))q.dead=true;return true;}if(q.kind==='thorn'){if(q.age<q.delay)return true;if(ioDamagedObject({...q,y:q.y-32},f,20)){q.dead=true;return true;}if(q.age<q.delay+12)ioContact(q,f,q.y-34);return true;}q.x+=q.vx;q.y+=q.vy;const main=platforms.find(p=>p.main);if(StageGeometry.overlaps(main,q.x,q.y,3,3)){q.dead=true;return true;}ioContact(q,f);return true;}
function ioProjectileHit(q,f,o){if(q.kind==='blood')f.ioIchor=Math.min(100,f.ioIchor+12);}
function ioOnHit(f,o,a){if(!a.special)f.ioIchor=Math.min(100,(f.ioIchor??50)+4);}
function ioCPU(f,o,i,clear){if(f.attack?.type==='dragon')i.specialHeld=f.timer<30;}

function ioNormal(f,a,i,r){}

function ioPoints(f,a,w,p){return p;}

const IoRules=NewcomerCore.create('io',IoMoves,{
reset(r){for(const f of fighters)if(f.characterId==='io')ioReset(f,r);},
status(f,r){if((f.grounded||f.ledge||f.respawn)&&f.attack?.type!=='rise')f.ioRiseUsed=false;if(f.ioCooldown>0)f.ioCooldown--;if(f.respawn)ioReset(f,r);ioStatus(f,r);},
prepare(f,a,r){a.activeFrames=a.activeFrames.map(w=>({...w}));if(!a.special)return;a.phase='start';a.motionCommitEnd=a.totalFrames-5;a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];if(a.type==='rise')f.ioRiseUsed=true;ioPrepare(f,a,r);},
action(f,i,r){const a=f.attack,t=f.timer;if(!a.special){ioNormal(f,a,i,r);return;}ioAction(f,a,t,i,r);a.animationWindows=[{start:1,end:a.totalFrames,pose:a.pose}];},
onHit(f,o,a,r){ioOnHit(f,o,a,r);},
projectile(q,f,o,r){if(!f||f.respawn||q.age>=q.life||q.x<-1100||q.x>2540||q.y>1550){q.dead=true;return true;}q.previousX=q.x;q.previousY=q.y;return ioProjectile(q,f,o,r);},
boxes(f,a,w){if(a.special&&!w.meleeCoverage)return[];return ioNativeBox(f,a,w);},
hurtboxes(f){const h=94,low=[4,10,21,25,43,49,54,55,60,66,70].includes(ioPose(f));return[{part:'head',x:f.x+f.face*5,y:f.y-h*(low?.52:.86),r:h*.14},{part:'torso',x:f.x,y:f.y-h*(low?.3:.53),r:h*.2},{part:'legs',x:f.x,y:f.y-h*.16,r:h*.18}];},
cpu(f,o,i,clear){const a=f.attack,p=platforms.find(p=>p.main);if(a?.type==='rise'){clear();i.x=Math.sign(p.x+p.w/2-f.x);i.y=-1;i.specialHeld=f.y>p.y-150;}if(!a&&f.grounded){const d=Math.abs(o.x-f.x);if(d>150&&d<450&&ioGate(f,'dash')){clear();i.x=Math.sign(o.x-f.x);i.y=0;i.special=true;}else if(d>100&&d<600&&ioGate(f,'dragon')){clear();f.face=Math.sign(o.x-f.x);i.x=i.y=0;i.special=true;}else if(d<135&&ioGate(f,'gale')){clear();i.x=0;i.y=1;i.special=true;}}ioCPU(f,o,i,clear);}
});
function ioNativeBox(f,a,w){const n=w.pose??a.pose,rect=IoArtRects.frames[n],s=NativeStrikes.scale(f,n,ioNativeScale(n),false)*FIGHTER_SCALE,anchor=NewcomerArtAnchors.io[n],shape=w.shape;let p=shape==='up'?[.5,.7,.65,.01]:shape==='low'?[.4,.75,.99,.9]:shape==='down'?[.55,.4,.72,.995]:shape==='back'?[.6,.45,.005,.45]:[.5,.45,.995,.45];if(a.type==='downsmash')p=shape==='back'?[.5,.7,.005,.8]:[.5,.7,.995,.8];p=ioPoints(f,a,w,p);const point=(x,y)=>({x:f.x+(x-anchor)*rect[2]*s*f.face,y:f.y+(y-1)*rect[3]*s}),p1=point(p[0],p[1]),p2=point(p[2],p[3]);return[{x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y,radius:Math.min(20,94*.2),window:w,modifiers:w}];}
function ioPose(f){if(f.attack)return f.attack.special?f.attack.pose:CombatData.sample(f.attack,f.timer).pose;if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 57;if(f.mode==='LedgeGetup')return 58;if(f.mode==='JumpSquat')return 10;if(f.mode==='ForwardRoll')return 47;if(f.mode==='BackwardRoll')return 48;if(f.mode==='SpotDodge')return 49;if(f.state==='walk')return[1,2,3][Math.floor(frame/7)%3];if(f.state==='run')return[5,6,7][Math.floor(frame/4)%3];return({idle:0,crouch:4,jump:11,double:13,fall:14,land:15,guard:46,dodge:50,hit:51,fly:53,down:54,getup:55,grab:61,caught:52,throw:63})[f.state]??0;}
MoveMotion.define('io',Object.fromEntries(Object.entries(IoMotion).map(([k,s])=>[k,{windup:s[0],strike:[s[1]],recovery:s[2]}])));

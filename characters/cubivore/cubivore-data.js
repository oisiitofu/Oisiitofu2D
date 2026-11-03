'use strict';
const CubivoreNormals=['jab','jab2','jab3','heavy','up','low','dashAttack','smash','upsmash','downsmash','air','fair','bair','uair','dair'];
const CubivoreMotion=Object.fromEntries(CubivoreNormals.map((name,n)=>[name,{
 windup:[6,32,6,14,4,14,24,14,4,14,5,5,10,5,5][n],strike:[36+n],recovery:[35,35,13,21,8,4,25,13,8,15,5,13,5,5,51][n]
}]));
const CubivoreMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window;
 const opt={special:true,newcomerHit:true,soundFamily:'punch'};
 const fold=(aerial)=>m('ニクたたみ',18,[],62,0,{...opt,cubivoreFold:true,aerial,pose:14,damage:10,angle:-.85});
 const moves=NewcomerCore.moves(['かみつき','返しかみ','かみつきフィニッシュ','体当たり','見上げ噛み','踏みつけ','タックル','ニクなぎ払い','持ち上げアッパー','全方位踏みつけ','空中かみつき','前キック','後ろなぎ払い','見上げキック','急降下踏みつけ'],{
  dragon:m('かみつき',7,[w(7,11,'front',{meleeCoverage:true})],16,0,{...opt,pose:34,damage:7}),
  dash:m('とびかかり',8,[w(9,17,'front',{index:0,meleeCoverage:true})],24,0,{...opt,tether:true,airControlMultiplier:0,pose:7,damage:10}),
  rise:m('トリヘンタイ',6,[],48,0,{...opt,pose:16,helpless:true,gravityMultiplier:.65,airControlMultiplier:0,ledgeGrabStart:19}),
  gale:fold(false),airDrop:fold(true)
 },'punch',95);
 for(const [name,seq] of Object.entries(CubivoreMotion)){
  const a=moves[name];a.pose=seq.strike[0];a.authoredEffectCoverage=true;
  for(const window of a.activeFrames)window.pose=a.pose;
  Object.assign(a.animation,{anticipationPose:seq.windup,accelerationPose:a.pose,recoveryPose:seq.recovery});
 }
 for(const [name,pose] of Object.entries({grab:12,pummel:6,forwardThrow:13,backThrow:10,upThrow:8,downThrow:9,ledge:7,getupAttack:15})){
  moves[name].pose=pose;
  for(const window of moves[name].activeFrames)window.pose=pose;
  Object.assign(moves[name].animation,{anticipationPose:14,accelerationPose:pose,recoveryPose:0});
 }
 return moves;
})();
function cubivoreGate(f,type){
 if(type==='dash')return f.grounded||!f.newSideUsed;
 if(type==='airDrop')return !f.newDownUsed;
 return true;
}
function cubivoreForm(f){
 const meat=f.cubivoreMeat??[];
 const red=meat.filter(piece=>piece==='red').length;
 return red>=2?'bear':meat.length-red>=2?'bird':'pig';
}
function cubivoreSync(f){f.cubivoreBird=Number(cubivoreForm(f)==='bird');}
function cubivoreFeed(f,color,o){
 f.cubivoreMeat=[...(f.cubivoreMeat??[]),color].slice(-3);
 f.cubivoreMeal={x:o?.x??f.x+35*f.face,y:(o?.y??f.y)-35,until:frame+24};
 cubivoreSync(f);
}
function cubivoreDuration(f,a,end){
 const delta=end-a.totalFrames;
 a.totalFrames=a.motionEndFrames=end;a.FAF=end+1;f.faf+=delta;f.stateEnd+=delta;f.stateDuration=end;
}
function cubivoreBurst(f,a){
 a.burst=f.timer;a.pose=15;a.powered=!!f.cubivoreMeat?.length;
 if(a.powered){f.cubivoreMeat.shift();cubivoreSync(f);}
 a.damage=a.powered?15:10;
 a.activeFrames=[CombatData.window(f.timer,f.timer+4,'shockwave',{index:0,meleeCoverage:true})];
 a.activeStart=f.timer;a.activeEnd=f.timer+4;
 cubivoreDuration(f,a,f.timer+22);
}
function cubivoreLand(f){
 const a=f.attack;
 if(!a?.cubivoreFold&&a?.type!=='dash')return false;
 Object.assign(f,{grounded:true,vy:0,fastFall:false,recovered:false,helpless:false,gravityOff:false,shortHop:false,ledgeGrabs:0,airDodged:false,airJumps:f.character.airJumpCount,jumps:0,mode:'GroundSpecial',state:PlayerStates.visual.GroundSpecial});
 if(a.cubivoreFold&&!a.burst&&f.timer>=14)cubivoreBurst(f,a);
 if(a.type==='dash'&&!a.pounceHit){f.vx*=.24;a.tether=false;}
 return true;
}
const CubivoreRules=NewcomerCore.create('cubivore',CubivoreMoves,{
 reset(){for(const f of fighters)if(f.characterId==='cubivore'){f.cubivoreMeat=[];f.cubivoreBird=0;f.cubivoreKos=f.stats?.kos??0;}},
 status(f){
  const kos=f.stats?.kos??0;
  if(f.respawn){f.cubivoreMeat=[];f.cubivoreMeal=null;cubivoreSync(f);}
  else if(f.cubivoreKos!==undefined&&kos>f.cubivoreKos)cubivoreFeed(f,f.cubivoreMeat?.at(-1)??'red');
  f.cubivoreKos=kos;
 },
 prepare(f,a){
  if(cubivoreForm(f)==='bear'&&['heavy','smash','upsmash','downsmash'].includes(a.type))a.damage+=3;
  if(a.cubivoreFold){a.motionCommitEnd=a.totalFrames-7;a.activeFrames=[];}
 },
 action(f,i){
  const a=f.attack,t=f.timer;
  if(a.type==='dragon')a.pose=[32,33,34,35][t<4?0:t<7?1:t<12?2:3];
  if(a.type==='dash'){
   a.pose=t<8?5:t<18?7:51;
   if(t===8){f.grounded=false;f.y-=2;f.vx=a.originFace*10;f.vy=-5.4;f.newSideUsed=true;}
   if(a.pounceHit&&!a.hop&&i.special&&t>a.pounceHit&&t<=a.pounceHit+12){
    a.hop=true;a.tether=false;f.grounded=false;f.y-=2;f.vx=(Math.sign(i.x)||a.originFace)*9;f.vy=-8.5;
    a.activeFrames=[];cubivoreDuration(f,a,t+15);
   }
   if(t>=19)a.tether=false;
  }
  if(a.type==='rise'){
   const direction=Math.abs(i.x)>.3?Math.sign(i.x):0;
   a.pose=t<6?14:[28,29,30,31][Math.floor((t-6)/3)%4];
   if(t===6){f.grounded=false;f.y-=3;f.vy=-13.8;}
   if(t>=6){
    f.vx=moveToward(f.vx,direction*7,.65);
    if(direction)f.face=direction;
    if(t>=15&&t<=32&&i.special&&!a.secondBeat){a.secondBeat=t;f.vy=-12;}
   }
  }
  if(a.cubivoreFold){
   if(!a.burst){
    a.pose=14;f.vx*=.7;
    if(!f.grounded&&t>=14)f.vy=Math.max(10,f.vy);
    if(f.grounded&&t>=18||t>=39)cubivoreBurst(f,a);
   }else if(t>a.burst+6)a.pose=9;
  }
 },
 onHit(f,o,a){
  if(a.type==='dragon')cubivoreFeed(f,o.character.weight>=94?'red':'blue',o);
  if(a.type==='dash'&&f.attack?.type==='dash')f.attack.pounceHit=f.timer;
 },
 boxes(f,a,w){
  const y=f.y,d=f.face;
  const front=a.type==='smash'?57:a.type==='dash'?52:43;
  const shape={
   front:[4,-32,front,-31,14],back:[-4,-34,-43,-31,14],
   up:[1,-39,16,-71,17],low:[3,-18,43,-14,14],
   down:[2,-24,12,7,16],spin:[-31,-32,32,-32,16],
   shockwave:a.powered?[-63,-19,63,-19,21]:[-40,-17,40,-17,16]
  }[w.shape];
  if(!shape)return;
  const [x1,y1,x2,y2,radius]=shape;
  return [{x1:f.x+x1*d,y1:y+y1,x2:f.x+x2*d,y2:y+y2,radius,window:w,modifiers:w}];
 },
 hurtboxes(f){
  const folded=f.attack?.cubivoreFold&&!f.attack.burst||f.state==='crouch'||f.state==='down';
  return [{part:'head',x:f.x+15*f.face,y:f.y-(folded?25:42),r:folded?17:22},
   {part:'torso',x:f.x-16*f.face,y:f.y-(folded?22:35),r:19},
   {part:'legs',x:f.x,y:f.y-11,r:13}];
 },
 cpu(f,o,i,clear){
  const a=f.attack;
  if(a?.type==='rise'){i.special=f.timer===21;return;}
  if(a?.type==='dash'&&a.pounceHit){i.x=Math.sign(720-f.x);i.special=f.timer===a.pounceHit+3;return;}
  if(a||!f.grounded)return;
  const d=Math.abs(f.x-o.x),cycle=(frame+17*f.id)%103;
  if(d<66&&cycle<7){clear();i.x=i.y=0;f.face=Math.sign(o.x-f.x)||f.face;i.special=true;}
  else if(d>78&&d<174&&cycle>=80&&cycle<85){clear();i.x=Math.sign(o.x-f.x);i.y=0;i.special=true;}
  else if(d<90&&f.cubivoreMeat?.length&&cycle>=56&&cycle<60){clear();i.x=0;i.y=1;i.special=true;}
 }
});
function cubivorePose(f){
 if(f.attack){
  if(f.attack.special)return f.attack.type==='dash'&&cubivoreForm(f)==='bear'&&f.timer>=8&&f.timer<18?23:f.attack.pose;
  const base=CombatData.sample(f.attack,f.timer).pose;
  if(cubivoreForm(f)==='bear'&&['heavy','smash'].includes(f.attack.type))return base===f.attack.pose?23:22;
  return base;
 }
 if(f.ledge||['LedgeCatch','LedgeHang'].includes(f.mode))return 8;
 if(['ForwardRoll','BackwardRoll','SpotDodge'].includes(f.mode))return 14;
 const form=cubivoreForm(f);
 if(form==='bear'&&['idle','walk','run'].includes(f.state))return f.state==='idle'?22:[22,23][Math.floor(frame/6)%2];
 if(form==='bird'&&['idle','walk','run','jump','double','fall'].includes(f.state))return f.state==='idle'?16:[28,29,30,31][Math.floor(frame/4)%4];
 return {idle:0,walk:[1,2][Math.floor(frame/7)%2],run:[24,25,26,27][Math.floor(frame/4)%4],crouch:4,jump:5,double:5,fall:5,land:51,guard:4,dodge:14,hit:18,fly:18,down:19,getup:9,grab:12,caught:18,throw:13}[f.state]??0;
}
MoveMotion.define('cubivore',CubivoreMotion);
CharacterGuide.define('cubivore',{
 strength:'かみつきや撃墜でニクを集める。同じ色が2個になるとクマかトリにヘンタイ。横Bは命中後に方向＋必殺で跳ね直せる。上Bは方向を選び、上昇中の必殺で二度目の羽ばたき。',
 caution:'かみつきはガードされるとニクを得られない。下Bはニクを1個使うと強くなるが、形態を失うことがある。'
});

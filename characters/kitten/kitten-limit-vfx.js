"use strict";

const KittenLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const profile=KittenLimitProfile;
 const art=assets('kitten',['cutin','court','poses','motion','jupiter','props','effects']);
 const shots=[
  [0,548,751,1072,737,813,421,.97,0,1],
  [31,548,751,1072,737,813,421,.97,0,1],
  [60,872,751,1055,720,951,423,.94,.012,1],
  [79,890,739,1074,697,970,420,.91,-.014,1],
  [94,940,571,1110,601,1012,349,.88,-.055,2],
  [114,1055,462,1144,522,1055,305,.84,-.117,2],
  [141,1287,437,1140,506,1197,321,.83,-.265,3],
  [154,1330,431,1117,496,1220,310,.80,-.30,3],
  [170,1229,405,1061,447,1155,296,.83,-.246,-4],
  [184,1100,349,1023,396,1082,284,.83,-.17,-5],
  [203,952,411,1062,452,1023,308,.83,-.098,5],
  [224,897,467,1074,524,991,366,.87,-.045,6],
  [237,882,495,1083,565,995,382,.89,0,8],
  [251,892,524,1104,614,1006,397,.90,.012,7],
  [276,962,410,1138,709,1047,356,.85,.026,9],
  [294,1060,431,1151,719,1108,374,.84,-.011,10],
  [308,1130,555,1170,720,1118,402,.83,.026,11],
  [324,1183,742,1259,696,1191,419,.81,-.031,11],
  [343,1162,742,1521,478,1329,387,.78,0,12],
  [377,1162,742,1818,296,1430,382,.74,0,12]
 ];
 const atlas=['poses','motion','jupiter'];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));

 function rubble(t){
  const lunar=ease((t-89)/30)*(1-ease((t-216)/22));
  const jupiter=ease((t-248)/28)*(1-ease((t-329)/18));
  for(let i=0;i<8;i++){
   const lane=i%4,depth=Math.floor(i/4);
   const turn=t*.018+i*1.7;
   const lunarX=1350-(175+depth*38)*lunar+lane*49;
   const lunarY=231+i*54+Math.sin(turn)*37;
   art.grid('props',1+i%2,2,2,lunarX,lunarY,106+lane*13,{alpha:lunar*.9,face:i%2?-1:1});
   const fall=ease((t-291-i*1.5)/33);
   const x=mix(933+lane*82,1145+lane*44,fall);
   art.grid('props',1+i%2,2,2,x,mix(108+i*30,702,fall),119+lane*10,{alpha:jupiter*.94});
  }
 }

 function draw({target:opponent,face,time}){
  const t=profile.shotTime(time);
  const [x,y,tx,ty,cx,cy,zoom,roll,signedPose]=camera(shots,t);
  const pose=Math.abs(signedPose)-1;
  const hit=Math.max(...Array.from(profile.combo.keys(),beat=>pulse(t,beat,3,9)));
  const lunar=ease((t-78)/15)*(1-ease((t-229)/18));
  const finish=pulse(t,324,5,25);
  frameClip();
  ctx.fillStyle='#1d1629';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(W*.5,H*.52);ctx.rotate(roll*face*.49);ctx.translate(-W*.5,-H*.52);
  art.image('court',-104-cx*.023,-90-cy*.037,W+293,H+186);ctx.restore();
  world(cx,cy,zoom,roll,face,t,Math.max(hit*.56,finish));
  const wall=ease((t-103)/26)*(1-ease((t-176)/26));
  art.grid('props',0,2,2,1615,737,757,{alpha:wall});
  art.grid('props',3,2,2,1498,499,179,{alpha:wall*.92});
  rubble(t);
  art.glow(0,x,y-161,515,426,lunar*.56);
  art.glow(0,1514,y-120,256,216,pulse(t,154,9,13)*.65);
  art.glow(2,x+14,y-138,453,368,pulse(t,280,28,32)*.55);
  art.strike(3,tx-18,ty-165,866,684,finish);
  target(opponent,tx,ty-hit*10,-.13-hit*.35-lunar*.32-ease((t-325)/32)*1.47,2.78);
  art.grid(atlas[Math.floor(pose/4)],pose%4,2,2,x,y,482,{face:Math.sign(signedPose)});
  for(const [index,beat] of [...profile.combo.keys()].entries()){
   const angle=beat===170?Math.PI-.26:beat===94?-.78:beat===251?.72:-.29;
   art.strike(index<5?1:2,tx-41,ty-149,333+index*12,279+index*9,pulse(t,beat,3,10),angle);
  }
  ctx.restore();
  flash('255,219,189',Math.max(hit*.061,finish*.18));
  bands(t,'#151021');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-17)/12)));
  ctx.restore();
 }

 function drawContact({x,y,time,face}){
  art.strike(1,x,y,175+time*5,149+time*4,1-time/profile.contactHold*.62,0,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

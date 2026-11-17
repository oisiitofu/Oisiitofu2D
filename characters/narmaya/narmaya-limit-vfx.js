'use strict';

const NarmayaLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('narmaya',['cutin','effects','court','motion']);
 const hits=[...NarmayaLimitProfile.combo.keys()];
 const shots=[
  [0,430,675,1088,670,756,431,.93,0,0],[34,627,670,1088,670,856,431,.94,-.008,42],
  [45,829,669,1104,656,970,426,.97,.017,42],[63,941,591,1136,604,1041,392,.9,-.021,46],
  [81,1059,449,1197,537,1122,351,.87,.026,54],[100,1083,364,1228,501,1165,300,.84,-.017,62],
  [118,991,495,1234,592,1114,367,.9,.022,56],[138,1069,668,1276,650,1175,432,.96,-.02,60],
  [163,865,668,1303,654,1071,432,.9,.011,45],[179,685,668,1304,663,937,442,.98,-.01,42],
  [195,737,668,1309,663,994,439,1.02,0,42],[207,907,641,1312,661,1114,425,.97,.025,42],
  [209,1007,631,1328,642,1172,407,1.01,.018,42],[222,1204,633,1611,449,1345,390,.82,.006,45],
  [232,1230,669,1810,353,1465,424,.76,0,45],[246,1210,669,1947,282,1485,425,.74,0,0]
 ];
 const pulse=(t,h,lead,tail)=>ease((t-h+lead)/lead)*(1-ease((t-h-2)/tail));

 function draw({attacker,target:opponent,face,time}){
  const t=NarmayaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(h=>pulse(t,h,3,9))),finish=pulse(t,209,2,22);
  const change=Math.max(pulse(t,36,4,8)*.58,pulse(t,72,5,11),pulse(t,163,6,11),pulse(t,232,4,9)*.74);
  const openingKagura=!!attacker.narmayaKagura;
  const kagura=t<36||t>=232?openingKagura:t>=72&&t<163;
  const resting=t<24||t>=232;
  const bodyPose=resting?(kagura?48:0):pose;
  frameClip();
  const w=W+340,h=w*9/16,floor=H*.51+(669-cy)*z;
  art.image('court',-(w-W)*.5-(cx-1090)*.10,Math.min(-6,floor-h*.82),w,h);
  ctx.fillStyle='rgba(20,7,37,'+(pulse(t,206,18,32)*.49)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.52,finish));
  const sheath=pulse(t,189,18,9),spread=ease((t-209)/16);
  art.strike(1,x+19,y-169,495,435,Math.max(change,sheath*.75),.14);
  art.strike(3,mix(1316,1440,spread),mix(513,462,spread),mix(456,972,spread),mix(418,785,spread),finish*.86,-.16);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0,narmayaKagura:kagura};
  if(!attacker.color&&t>=171&&t<229){
   const stance=t<194?0:t<207?1:2;
   art.grid('motion',stance,3,1,x,y,[319,317,300][stance],{anchorY:.94});
  }else drawSprite(sprite,1,bodyPose,3.11);
  target(opponent,tx,ty-impact*14,-.10-impact*.33-ease((t-209)/25)*1.42,2.52);
  for(const [i,hit] of hits.entries()){
   const strength=pulse(t,hit,4,9);
   art.strike(i===0?2:0,tx-18,ty-115,439+i*20,307,strength,[-.025,-.45,.62,1.01,-.5,-.12][i]);
  }
  const reach=mix(681,1277,spread);
  art.strike(2,x+79+reach*.41,y-138-spread*119,reach,mix(376,555,spread),finish,-.17);
  art.glow(3,1328,511,498+spread*185,348,finish*.44,-.17);
  ctx.restore();
  flash('226,187,255',Math.max(impact*.1,change*.1,pulse(t,209,1,8)*.17));
  bands(t,'#241831');
  portraitPanel(t,-24,(zoom,alpha)=>{
   ctx.translate(0,63);
   art.portrait(zoom*1.08,alpha);
  });
  ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,155+time*4,144,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

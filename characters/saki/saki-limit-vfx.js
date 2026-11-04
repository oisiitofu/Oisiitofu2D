'use strict';
const SakiLimitVFX=(()=>{
 const {assets,ease,mix,camera,frameClip,world,target,bands,flash}=LimitCinematic;
 const art=assets('saki',['cutin','court','poses','effects','ruffian']);
 const shots=[
  [0,452,650,1002,629,719,433,1.10,.016,0],
  [48,477,649,986,622,725,428,1.04,-.018,0],
  [72,543,649,1006,618,756,433,1.10,.026,1],
  [94,491,650,1008,627,749,414,1.01,-.024,2],
  [122,473,648,1020,618,745,368,.84,-.027,2],
  [160,460,649,1058,596,765,361,.79,.019,3],
  [193,459,650,1116,559,823,418,.90,-.022,3],
  [218,506,651,1425,326,919,432,.88,.018,3],
  [248,507,651,1739,185,921,442,.87,0,0]
 ];
 const beat=(t,start,peak,hold,end)=>ease((t-start)/(peak-start))*(1-ease((t-hold)/(end-hold)));
 function draw({target:opponent,face,time}){
  const t=SakiLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const parry=beat(t,64,72,76,86),form=beat(t,96,123,193,217),charge=beat(t,119,148,157,171);
  const beam=beat(t,153,164,183,195),blast=beat(t,180,193,198,225);
  const recoil=-.11-ease((t-188)/41)*1.46;
  const flinch=Math.max(...Array.from(SakiLimitProfile.combo.keys(),frame=>beat(t,frame-1,frame,frame+2,frame+8)));
  frameClip();
  ctx.fillStyle='#242130';ctx.fillRect(0,0,W,H);
  art.image('court',-69-t*.12,-59,W+174,H+120);
  world(cx,cy,z,roll,face,t,Math.max(blast,parry*.55));
  art.glow(1,x+14,y-242,440+charge*230,396+charge*181,Math.max(charge*.66,form*.23));
  art.grid('ruffian',0,1,1,x+11,y+12,517+form*115,{alpha:form});
  art.grid('poses',pose,2,2,x,y,290,{alpha:1-form});
  if(t<199)target(opponent,tx+26*flinch,ty-19*flinch,recoil-.18*flinch);
  for(const start of [34,46]){
   const travel=ease((t-start)/8),shot=beat(t,start,start+2,start+8,start+11);
   art.strike(1,mix(x+101,tx,travel),mix(y-157,ty-112,travel),121,111,shot);
  }
  const turn=ease((t-72)/18),incoming=ease((t-60)/12);
  art.strike(1,mix(mix(1095,x+115,incoming),1068,turn),mix(410,503,incoming)-turn*95,169,161,beat(t,59,64,80,92),0,t<72?-1:1);
  art.strike(0,x+116,486,330+parry*203,281+parry*129,parry,-.13);
  const rayLength=mix(162,789,ease((t-153)/15));
  art.strike(2,x+108+rayLength*.47,465,rayLength,254+beam*131,beam,-.04);
  art.strike(3,tx+13,ty-99,147,138,flinch*.78);
  art.strike(3,1098,470,418+blast*628,380+blast*203,blast);
  if(t>=199)target(opponent,tx,ty,recoil);
  ctx.restore();
  flash('232,151,255',Math.max(blast*.27,parry*.11));bands(t,'#231729');
  art.portrait(1+Math.max(0,t)*.001,ease(t/4)*(1-ease((t-17)/10)));
  ctx.restore();
 }
 function drawContact({x,y,time,face}){
  art.strike(0,x,y,142+time*6,133,1-time/SakiLimitProfile.contactHold*.6,-.09*face,face);
 }
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

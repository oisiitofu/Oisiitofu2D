'use strict';
const VeronicaLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('veronica',['cutin','effects','court','finish'],{revision:3});
 const shots=[
  [0,423,671,1089,670,756,428,.94,0,1],[33,589,671,1089,670,839,433,.96,0,7],
  [47,742,670,1109,660,926,432,1,.019,18],[65,811,639,1147,618,979,409,.96,-.019,24],
  [84,829,554,1201,560,1014,347,.89,.023,30],[104,996,494,1199,536,1098,324,.88,-.025,40],
  [124,1333,459,1210,520,1272,329,.88,.026,-31],[144,1310,606,1166,582,1238,379,.93,-.021,-42],
  [165,1321,671,1170,638,1245,424,.9,0,-43],[190,1372,672,1156,645,1264,429,.88,-.014,-44],
  [199,1387,668,1147,637,1257,424,.95,-.013,-44],[207,1400,659,1141,624,1262,410,.98,.024,-24],
  [219,1459,672,933,526,1215,397,.83,.009,-24],[233,1467,672,705,400,1122,403,.77,0,-43],
  [244,1454,672,573,312,1056,408,.76,0,-1]
 ];
 const pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=VeronicaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...VeronicaLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,207,2,18),charge=pulse(t,190,23,16);
  frameClip();
  const width=W+350;
  art.image('court',-(width-W)*.5-(cx-1030)*.12,-101-(cy-414)*.13,width,width*9/16);
  ctx.fillStyle='rgba(26,8,42,'+pulse(t,206,24,32)*.49+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.59,finish));
  const spread=ease((t-207)/18);
  const focusX=x-(pose===-44?153:198),focusY=y-(pose===-44?244:158);
  const gather=ease((t-170)/27);
  for(const [i,slot] of [0,1,2].entries()){
   const orbit=t*.08+i*Math.PI*2/3;
   const radius=215*(1-gather);
   art.glow(slot,focusX+Math.cos(orbit)*radius,focusY+Math.sin(orbit)*radius*.68,172,193,
    charge*(1-ease((gather-.75)/.25))*.69,orbit);
  }
  art.glow(3,focusX,focusY,275,248,charge*.48);
  const impactX=1141,impactY=506,fanWidth=593+spread*523,fanHeight=438+spread*174;
  art.strike(1,impactX-fanWidth*.42,impactY-fanHeight*.42,fanWidth,fanHeight,pulse(t,210,3,21),-.035,1,'finish');
  art.strike(2,impactX-128-spread*165,637,713+spread*502,231+spread*101,pulse(t,214,4,22),0,1,'finish');
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.37);
  target(opponent,tx,ty-impact*12,-.09-impact*.33+ease((t-208)/29)*1.38,2.56);
  for(const [i,h] of hits.entries()){
   const slot=[3,0,1,2,0,3][i],flight=ease((t-h+10)/10),power=pulse(t,h,slot===0?10:4,9);
   if(slot===0){
    const side=i===4?1:-1;
    art.strike(0,mix(tx+side*332,tx,flight),mix(ty-183,ty-117,flight),307,285,power,-side*.2,-side);
   }else art.strike(slot,tx,ty-(slot===2?276:121),395,slot===2?603:323,power,0);
  }
  const jetWidth=389+spread*207;
  art.strike(0,focusX-jetWidth*.47,focusY,jetWidth,192+spread*57,finish,0,1,'finish');
  art.strike(3,focusX,focusY,177,174,pulse(t,207,12,7),.02,1,'finish');
  ctx.restore();flash('255,185,159',Math.max(impact*.11,finish*.23));bands(t,'#23142c');
  portraitPanel(t,-29,(zoom,alpha)=>art.portrait(zoom,alpha));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(3,x,y,167+time*4,148,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

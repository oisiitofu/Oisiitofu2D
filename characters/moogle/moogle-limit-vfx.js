'use strict';
const MoogleLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('moogle',['cutin','effects','court','motes','finish'],{revision:3});
 const shots=[
  [0,424,672,1090,671,757,426,.94,0,1],[33,693,672,1090,671,891,434,.97,0,30],
  [46,907,668,1098,660,1002,434,1,.018,8],[64,1020,498,1176,598,1098,353,.91,-.021,14],
  [83,1217,398,1170,539,1194,324,.88,.028,-16],[102,1265,601,1089,585,1176,388,.94,-.023,-13],
  [122,1015,656,1114,622,1064,426,.97,.021,46],[142,874,526,1193,622,1034,369,.9,-.02,39],
  [165,815,672,1240,659,1027,425,.88,0,19],[185,873,559,1248,646,1061,381,.93,-.014,19],
  [195,954,512,1253,618,1105,353,.94,.025,24],[207,976,478,1419,512,1194,329,.83,.008,39],
  [220,974,558,1644,414,1281,359,.77,0,24],[230,960,672,1783,351,1337,408,.76,0,1]
 ];
 const pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function draw({attacker,target:opponent,face,time}){
  const t=MoogleLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...MoogleLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,195,2,23);
  frameClip();
  const width=W+359;
  art.image('court',-(width-W)*.5-(cx-1040)*.12,-99-(cy-403)*.14,width,width*9/16);
  ctx.fillStyle='rgba(7,25,39,'+pulse(t,194,25,31)*.43+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.51,finish));
  const lift=ease((t-189)/16),rise=ease((t-193)/22);
  art.glow(1,x+61,y-148,590,369,pulse(t,195,30,12)*.67,-.17);
  const focusX=1253,focusY=507;
  art.strike(0,focusX+84+rise*87,focusY-213-lift*54,411+lift*213,624+lift*173,finish,-.09+rise*.11,1,'finish');
  art.strike(1,focusX+rise*104,623,706+rise*421,221+rise*83,pulse(t,199,4,22),0,1,'finish');
  for(const [i,side] of [-1,1].entries()){
   const orbit=t*.093+i*Math.PI;
   const gustX=tx+Math.cos(orbit)*(83+276*rise),gustY=ty-158-lift*(103+i*107);
   const span=279+lift*(242+100*i);
   ctx.save();ctx.translate(gustX,gustY);ctx.rotate(side*.39+Math.sin(orbit)*.48);
   art.image('motes',-span*.5,-span*.33,span,span*.66,finish*.69);
   ctx.restore();
  }
  const sprite={...attacker,x,y,face:Math.sign(pose),attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose)-1,3.42);
  target(opponent,tx,ty-impact*13,-.12-impact*.35-ease((t-196)/29)*1.37,2.57);
  for(const [i,h] of hits.entries()){
   art.strike(i%3,tx,ty-111,379+i*19,309,pulse(t,h,4,9),[-.28,.65,-.69,.53,-.22,.31][i],i===2||i===3?-1:1);
  }
  art.strike(3,focusX+143+rise*111,focusY+89-lift*37,494+rise*241,231+rise*119,pulse(t,198,3,17),-.18,1,'finish');
  art.strike(2,focusX,focusY,226+rise*86,227,pulse(t,195,1,8),-.14,1,'finish');
  ctx.restore();flash('204,250,230',Math.max(impact*.11,finish*.19));bands(t,'#1b253a');
  portraitPanel(t,27,(zoom,alpha)=>art.portrait(zoom,alpha));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,170+time*4,150,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

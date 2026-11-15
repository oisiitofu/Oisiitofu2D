'use strict';

const TailsLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('tails',['cutin','effects','court','drone'],{revision:2});
 const shots=[
  [0,415,683,1086,671,761,419,.92,0,31],[40,565,683,1085,671,821,422,.97,0,32],
  [48,613,654,1095,654,844,426,.94,.018,33],[65,877,606,1066,622,950,393,.96,-.025,27],
  [83,1082,442,1126,617,1104,366,.92,.011,40],[102,1341,361,1212,553,1276,298,.86,.035,-30],
  [121,1328,296,1229,522,1290,290,.89,-.02,-44],[141,1067,429,1257,546,1162,331,.91,.016,40],
  [170,859,568,1291,612,1081,379,.88,-.014,45],[187,890,510,1305,610,1089,381,.92,.025,44],
  [220,837,683,1754,328,1182,401,.8,0,0]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=TailsLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[48,65,83,102,121,141];
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,3,9))),finish=pulse(t,187,6,27);
  frameClip();
  const width=W+360,height=width*9/16;
  art.image('court',-(width-W)*.5-(cx-1000)*.12,-102-(cy-400)*.17,width,height);
  world(cx,cy,z,roll,face,t,Math.max(impact*.5,finish));
  const ring=ease((t-27)/7)*(1-ease((t-47)/4));
  if(ring>0){
   const flight=ease((t-31)/15);
   ctx.save();ctx.globalAlpha=ring;ctx.strokeStyle='#ffdf59';ctx.lineWidth=11;
   ctx.beginPath();ctx.ellipse(mix(x+92,tx,flight),mix(y-119,ty-113,flight)-150*Math.sin(Math.PI*flight),28,38,t*.27,0,Math.PI*2);ctx.stroke();
   ctx.restore();
  }
  const bob=Math.sin(t*.15)*12,droneX=1320,droneY=255+bob;
  const active=ease((t-106)/24)*(1-ease((t-198)/21));
  const charge=pulse(t,187,15,12);
  art.glow(2,droneX,droneY+30,193,103,active*.44);
  art.image('drone',droneX-95,droneY-57,190,114,active);
  art.glow(1,droneX,droneY+20,184,153,charge*.66);
  const sprite={...attacker,x,y,face:pose<0?-1:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose),3.1);
  target(opponent,tx,ty-impact*16,-.1-impact*.34-ease((t-189)/25)*1.32,2.65);
  for(const [i,hit] of hits.entries()){
   const power=pulse(t,hit,5,9),slot=[0,1,2,1,2,2][i];
   art.strike(slot,tx,ty-(slot===2?173:115),slot===2?495:350,slot===2?512:260,power,i%2===0?-.39:.46);
  }
  for(const [fromX,fromY] of [[droneX,droneY+20],[x+108,y-105]]){
   const dx=tx-fromX,dy=ty-122-fromY;
   const angle=Math.atan2(dy,dx),length=Math.hypot(dx,dy)+130;
   art.glow(3,fromX+dx/2,fromY+dy/2,length+96,244,finish*.63,angle);
   art.strike(3,fromX+dx/2,fromY+dy/2,length,160,finish,angle);
  }
  const spread=ease((t-189)/17);
  art.strike(1,tx,ty-114,385+spread*420,355+spread*74,finish,t*.032);
  art.glow(0,tx,ty-111,464+spread*470,435,finish*.56);
  ctx.restore();flash('198,240,255',Math.max(impact*.12,finish*.19));bands(t,'#0c182b');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(1,x,y,156+time*4,142,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

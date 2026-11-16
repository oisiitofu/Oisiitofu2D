'use strict';

const TailsLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('tails',['cutin','effects','court','drone','finish'],{revision:3});
 const shots=[
  [0,415,683,1086,671,761,419,.92,0,31],[40,565,683,1085,671,821,422,.97,0,32],
  [48,613,654,1095,654,844,426,.94,.018,33],[65,877,606,1066,622,950,393,.96,-.025,27],
  [83,1082,442,1126,617,1104,366,.92,.011,40],[102,1341,361,1212,553,1276,298,.86,.035,-30],
  [121,1328,296,1229,522,1290,290,.89,-.02,-44],[141,1067,429,1257,546,1162,331,.91,.016,40],
  [170,859,568,1291,612,1115,378,.79,-.014,45],[182,868,525,1310,608,1135,392,.83,-.018,44],
  [187,890,510,1305,610,1150,395,1.035,.026,44],[197,826,544,1459,516,1170,391,.85,.013,40],
  [220,837,683,1754,328,1230,417,.76,0,0]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 const bolt=(slot,x,y,w,h,strength,angle=0)=>art.strike(slot,x,y,w,h,strength,angle,1,'finish');
 function beam(fromX,fromY,toX,toY,strength,spread){
  const dx=toX-fromX,dy=toY-fromY;
  const x=fromX+dx*(.56+spread*.065),y=fromY+dy*(.56+spread*.065);
  const angle=Math.atan2(dy,dx),length=Math.hypot(dx,dy)*(1.25+spread*.15);
  art.glow(3,x,y,length+64,234,strength*.39,angle);
  bolt(0,x,y,length,203,strength,angle);
 }
 function draw({attacker,target:opponent,face,time}){
  const t=TailsLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[48,65,83,102,121,141];
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,3,9))),finish=pulse(t,187,6,27);
  frameClip();
  const width=W+360,height=width*9/16;
  art.image('court',-(width-W)*.5-(cx-1000)*.12,-102-(cy-400)*.17,width,height);
  ctx.fillStyle='rgba(12,13,39,'+(pulse(t,184,17,32)*.46)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.5,finish));
  const ring=pulse(t,46,18,4),flight=ease((t-30)/17);
  bolt(3,mix(x+92,tx,flight),mix(y-119,ty-113,flight)-150*Math.sin(Math.PI*flight),146,124,ring,t*.19);
  const sweep=ease((t-151)/32);
  const droneX=mix(1232,1548,sweep),droneY=mix(236,315,sweep)+Math.sin(t*.15)*12;
  const active=ease((t-106)/24)*(1-ease((t-198)/21));
  const charge=pulse(t,187,15,12);
  const handX=x+105,handY=y-132,aimX=1305,aimY=488,spread=ease((t-187)/18);
  bolt(2,aimX,aimY,mix(408,955,spread),mix(366,672,spread),pulse(t,192,5,25)*.88,-.26+spread*.45);
  art.glow(2,droneX,droneY+30,193,103,active*.44);
  art.image('drone',droneX-95,droneY-57,190,114,active);
  bolt(1,droneX-25,droneY+36,132,132,charge*.69,.57);
  const sprite={...attacker,x,y,face:pose<0?-1:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,Math.abs(pose),3.1);
  target(opponent,tx,ty-impact*16,-.1-impact*.34-ease((t-189)/25)*1.32,2.65);
  for(const [i,hit] of hits.entries()){
   const power=pulse(t,hit,5,9),slot=[0,1,2,1,2,2][i];
   art.strike(slot,tx,ty-(slot===2?173:115),slot===2?495:350,slot===2?512:260,power,i%2===0?-.39:.46);
  }
  bolt(1,handX,handY,149,136,charge*.57,-.26);
  beam(handX,handY,aimX,aimY,pulse(t,187,2,12),spread);
  beam(droneX-25,droneY+36,aimX,aimY,pulse(t,187,3,10),spread);
  bolt(1,aimX,aimY,mix(360,663,spread),mix(365,609,spread),pulse(t,187,1,11),-.13);
  ctx.restore();flash('198,240,255',Math.max(impact*.12,finish*.19));bands(t,'#0c182b');
  portraitPanel(t,24,art.portrait);ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(1,x,y,156+time*4,142,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

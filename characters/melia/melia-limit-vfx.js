'use strict';
const MeliaLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('melia',['cutin','effects','terrace','elements'],{revision:2});
 const shots=[
  [0,493,667,1123,669,808,429,.94,0,0],[35,634,665,1123,669,878,428,.96,0,40],
  [46,785,663,1144,654,965,433,1,.016,13],[64,730,527,1192,610,961,379,.9,-.019,41],
  [84,527,412,1233,565,880,336,.85,.021,42],[104,742,253,1263,543,1002,298,.84,-.021,43],
  [124,1012,345,1291,539,1152,329,.88,.025,45],[144,878,484,1326,593,1102,371,.91,-.018,19],
  [169,810,576,1370,644,1090,415,.86,0,40],[202,815,563,1386,643,1100,408,.88,.022,17],
  [238,815,670,1911,324,1290,398,.76,0,0]
 ];
 const pulse=(t,h,a,b)=>ease((t-h+a)/a)*(1-ease((t-h-2)/b));
 function element(i,x,y,size,alpha,angle){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha;
  art.grid('elements',i,3,1,0,0,size,{anchorY:.5});
  ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=MeliaLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...MeliaLimitProfile.combo.keys()],impact=Math.max(...hits.map(h=>pulse(t,h,4,9)));
  const finish=pulse(t,202,6,25);
  frameClip();
  const width=W+344;
  art.image('terrace',-(width-W)*.49-(cx-1000)*.12,-94-(cy-416)*.13,width,width*9/16);
  ctx.fillStyle='rgba(18,18,55,'+(finish*.23)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.56,finish));
  const elements=[0,0,1,2,2,1];
  for(const [i,h] of hits.entries()){
   const flight=ease((t-h+13)/13),angle=t*.047+i*1.98;
   element(elements[i],mix(x+Math.cos(angle)*149,tx,flight),mix(y-162+Math.sin(angle)*98,ty-113,flight),124,pulse(t,h,14,4),angle*.31);
  }
  for(let i=0;i<3;i++){
   const h=198+i*4,fall=ease((t-h+13)/13),ox=tx+(i-1)*245;
   const impactX=tx+(i-1)*103,oy=241-i*39;
   element(i,mix(ox,impactX,fall),mix(oy,ty-118,fall),148+fall*47,pulse(t,h,24,4),t*.028+i);
   const burst=pulse(t,h,3,18);
   art.strike(i,impactX,ty-[357,113,144][i],[372,630,590][i],[790,371,385][i],burst,[-.09,.17,-.19][i]);
   art.glow(i,impactX+(i-1)*35,ty-[360,115,133][i],[450,706,663][i],[826,430,419][i],burst*.28,[-.09,.17,-.19][i]);
  }
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose,3.15);
  target(opponent,tx,ty-impact*14,-.11-impact*.35-ease((t-203)/28)*1.34,2.53);
  for(const [i,h] of hits.entries()){
   const slot=elements[i],width=slot===0?240:408;
   art.strike(slot,tx,ty-118,width+i*9,slot===0?398:316,pulse(t,h,4,9),[-.41,-.24,.23,-.25,.53,.37][i]);
  }
  art.strike(1,tx+76,ty-83,310,226,pulse(t,202,2,10),-.21);
  art.strike(2,tx+97,ty-102,303,249,pulse(t,206,2,11),.28);
  ctx.restore();flash('227,214,255',Math.max(impact*.1,finish*.22));bands(t,'#22283e');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,148+time*4,188,1-time/23,-.4);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';

const AerithLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash}=LimitCinematic;
 const art=assets('aerith',['cutin','effects','court','sigil'],{revision:2});
 const shots=[
  [0,446,673,1073,669,761,429,.94,0,1],[36,582,673,1073,669,826,433,.96,-.017,41],
  [48,743,673,1087,657,916,437,.97,.014,7],[66,732,673,1112,622,919,411,.91,-.018,16],
  [84,681,648,1147,575,913,395,.89,.018,46],[104,598,621,1192,563,909,376,.87,-.017,39],
  [123,569,638,1214,609,891,401,.91,.02,43],[143,628,671,1261,629,946,427,.9,-.014,9],
  [167,702,641,1272,670,986,426,.89,-.022,47],[185,744,558,1271,663,1012,365,.83,0,16],
  [201,747,515,1310,638,1056,362,.92,.018,48],[233,764,673,1702,316,1172,398,.77,0,1]
 ];
 const hits=[48,66,84,104,123,143];
 const circles=[[748,669,41],[449,643,75],[1011,595,130]];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 function circle(x,y,r,t,alpha){
  if(alpha<=0)return;
  ctx.save();ctx.translate(x,y);ctx.scale(1,.34);ctx.rotate(t*.019);
  art.image('sigil',-r,-r,r*2,r*2,alpha);
  ctx.restore();
 }
 function draw({attacker,target:opponent,face,time}){
  const t=AerithLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,4,9))),finish=pulse(t,201,5,27);
  frameClip();
  const width=W+350;
  art.image('court',-(width-W)*.5-(cx-990)*.1,-100-(cy-425)*.12,width,width*9/16);
  world(cx,cy,z,roll,face,t,Math.max(impact*.48,finish));
  const gather=ease((t-175)/22)*(1-ease((t-205)/15));
  const fromX=x+149,fromY=y-306,dx=tx-fromX,dy=ty-120-fromY;
  for(const [i,[px,py,start]] of circles.entries()){
   const glow=ease((t-start)/13)*(1-ease((t-206)/21));
   circle(px,py,145+23*ease((t-start)/23),t,glow*.88);
   const climb=ease((t-176-i*4)/18);
   const lx=mix(px,fromX,climb),ly=mix(py-36,fromY,climb)-92*Math.sin(climb*Math.PI);
   art.glow(2,lx,ly,236,234,gather*(1-ease((climb-.73)/.28))*.75,i*.78);
  }
  const travel=ease((t-201)/19);
  const angle=Math.atan2(dy,dx),length=Math.hypot(dx,dy)+156;
  art.glow(1,fromX,fromY,274,279,gather*.73);
  art.glow(3,tx+180+travel*190,ty-107+travel*47,582+travel*390,440,finish*.53,angle);
  art.strike(3,fromX+dx*.55,fromY+dy*.55,length,212+travel*113,finish,angle);
  art.strike(1,tx,ty-117,356+travel*380,374,finish,t*.031);
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose-1,3.05);
  target(opponent,tx,ty-impact*13,-.08-impact*.32-ease((t-202)/27)*1.32,2.55);
  for(const [i,hit] of hits.entries()){
   const [fromX,fromY]=circles[Math.min(2,Math.floor(i/2))],flight=ease((t-hit+10)/10);
   const power=pulse(t,hit,10,8);
   art.strike(i%3,mix(fromX+78,tx,flight),mix(fromY-91,ty-115,flight),280+i*23,258,power,i*.38);
  }
  art.glow(2,tx+70+travel*116,ty-115,568+travel*323,452,finish*.58,-.23);
  ctx.restore();flash('255,241,183',Math.max(impact*.13,finish*.2));bands(t,'#231b2d');
  art.portrait(1+t*.001,ease(t/4)*(1-ease((t-16)/12)));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,161+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

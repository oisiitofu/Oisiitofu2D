'use strict';

const ChocoboLimitVFX=(()=>{
 const {assets,camera,ease,mix,world,target,frameClip,bands,flash,portraitPanel,unit}=LimitCinematic;
 const art=assets('chocobo',['cutin','effects','court','finish'],{revision:3});
 const shots=[
  [0,310,683,1080,680,762,422,.88,0,0],[28,522,683,1080,680,786,422,.92,0,34],
  [40,791,683,1080,680,935,436,.97,.018,37],[47,942,683,1105,662,1024,433,1,.02,9],
  [63,992,548,1178,606,1085,348,.92,-.035,10],[74,804,437,1219,587,1012,305,.86,-.028,5],
  [82,1057,433,1256,582,1150,315,.9,.02,11],[101,1196,623,1280,664,1238,414,.94,.03,20],
  [120,969,801,1266,667,1117,489,.88,.016,15],[139,1165,677,1350,622,1257,425,.89,-.028,17],
  [160,1270,677,1459,633,1370,361,.84,.01,8],[179,1242,677,1448,683,1507,313,.76,-.02,12],
  [191,1242,677,1448,685,1404,421,1.03,.037,12],[201,1238,677,1615,526,1444,391,.83,.013,15],
  [222,1241,677,1970,506,1578,411,.76,0,0],[225,1241,677,2030,471,1590,424,.76,0,0]
 ];
 const pulse=(t,hit,lead,tail)=>ease((t-hit+lead)/lead)*(1-ease((t-hit-2)/tail));
 const meteorArt=(slot,x,y,w,h,strength,angle=0,face=1)=>art.strike(slot,x,y,w,h,strength,angle,face,'finish');

 function draw({attacker,target:opponent,face,time}){
  const t=ChocoboLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[47,63,82,101,120,139];
  const impact=Math.max(...hits.map(hit=>pulse(t,hit,4,9)));
  const finish=pulse(t,191,5,27);
  frameClip();
  const width=W+290,height=width*9/16;
  art.image('court',-(width-W)*.5-(cx-1095)*.078,-77-(cy-418)*.10,width,height);
  ctx.fillStyle='rgba(39,14,32,'+(pulse(t,190,24,33)*.49)+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(impact*.56,finish));
  const landingX=1448,ground=683,spread=ease((t-191)/23);
  meteorArt(2,landingX+38*spread,ground-82,mix(420,1460,spread),mix(325,511,spread),pulse(t,198,8,28)*.88);
  const eruption=ease((t-190)/12),plumeHeight=mix(403,798,eruption);
  meteorArt(1,landingX,ground-plumeHeight*.30,mix(502,1040,eruption),plumeHeight,pulse(t,193,3,23),.025);
  const rock=ctx.createLinearGradient(710,431,743,488);
  rock.addColorStop(0,'#e9b58b');rock.addColorStop(.42,'#916748');rock.addColorStop(1,'#4c3742');
  ctx.fillStyle=rock;ctx.strokeStyle='#624247';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(687,437);ctx.lineTo(727,426);ctx.lineTo(839,426);ctx.lineTo(875,437);
  ctx.lineTo(844,463);ctx.lineTo(805,475);ctx.lineTo(722,466);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(724,441);ctx.lineTo(752,448);ctx.lineTo(783,439);ctx.lineTo(816,446);ctx.stroke();
  const sprite={...attacker,x,y,face:pose===20?-1:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  const intermediate=ChocoboMotionPreview.limit(t,pose);
  if(!MotionPreview.cinematic(sprite,intermediate,1,3))drawSprite(sprite,1,pose,3);
  target(opponent,tx,ty-impact*16,-.15-impact*.4-ease((t-192)/25)*1.41,2.6);
  for(const [i,hit] of hits.entries()){
   const strength=pulse(t,hit,5,9);
   const angle=[.08,-.44,.74,.95,-.31,-.21][i];
   art.strike(i%3,tx-35,ty-104,358+i*11,265+14*i,strength,angle);
   if(i===2||i===3||i===5)meteorArt(3,tx-12,ty-83,444,360,strength*.83,angle);
  }
  const fall=unit((t-160)/31)**1.68;
  meteorArt(0,landingX+mix(605,308,fall),mix(-148,ground-275,fall),mix(497,828,fall),mix(432,749,fall),
   pulse(t,191,31,4),.10);
  ctx.restore();
  flash('255,190,115',Math.max(impact*.14,finish*.21));bands(t,'#241523');
  portraitPanel(t,-24,art.portrait);ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(0,x,y,164+time*4,145,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

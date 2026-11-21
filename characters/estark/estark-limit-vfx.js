'use strict';
const EstarkLimitVFX=(()=>{
 const {assets,camera,ease,world,target,frameClip,bands,flash,portraitPanel}=LimitCinematic;
 const art=assets('estark',['cutin','effects','court','quake','finish'],{revision:3});
 const shots=[
  [0,411,685,1129,676,797,437,.85,0,1],[32,591,685,1129,676,860,430,.86,-.016,12],
  [47,838,685,1144,663,991,434,.91,.028,17],[67,936,686,1218,634,1091,419,.89,-.026,18],
  [87,1062,682,1304,587,1179,400,.91,.022,21],[108,918,681,1415,631,1170,423,.87,-.024,43],
  [128,1091,681,1438,625,1264,417,.91,.019,35],[149,1209,656,1481,631,1348,405,.89,.025,31],
  [172,1106,686,1548,651,1327,437,.82,0,62],[192,1107,648,1548,651,1328,403,.85,-.02,25],
  [201,1170,669,1540,642,1372,411,.92,-.018,25],[208,1307,685,1534,632,1420,404,.96,.027,19],
  [219,1345,685,1699,529,1510,396,.83,.009,19],[231,1354,685,1910,426,1599,405,.77,0,31],
  [244,1354,685,2021,381,1650,413,.75,0,1]
 ];
 const pulse=(t,h,lead,tail)=>ease((t-h+lead)/lead)*(1-ease((t-h-2)/tail));
 function draw({attacker,target:opponent,face,time}){
  const t=EstarkLimitProfile.shotTime(time),[x,y,tx,ty,cx,cy,z,roll,pose]=camera(shots,t);
  const hits=[...EstarkLimitProfile.combo.keys()],shock=Math.max(...hits.map(h=>pulse(t,h,4,10)));
  const finish=pulse(t,208,2,19);
  frameClip();
  const width=W+392;
  art.image('court',-(width-W)*.5-(cx-1060)*.12,-104-(cy-412)*.14,width,width*9/16);
  ctx.fillStyle='rgba(25,9,40,'+pulse(t,208,23,31)*.48+')';ctx.fillRect(0,0,W,H);
  world(cx,cy,z,roll,face,t,Math.max(shock*.69,finish));
  const spread=ease((t-208)/18);
  const quake=Math.max(pulse(t,47,2,10),pulse(t,149,3,13),finish);
  const fissureWidth=441+spread*762,fissureHeight=138+spread*86;
  art.image('quake',x+241*finish-fissureWidth/2,681-fissureHeight*.53,fissureWidth,fissureHeight,quake);
  art.glow(0,x+133,y-168,585,401,pulse(t,208,17,7)*.78,-.17);
  const focusX=1534,focusY=514;
  art.strike(0,focusX+55,focusY-51,647+spread*331,474+spread*101,pulse(t,204,3,20),-.06,1,'finish');
  art.strike(2,focusX+spread*159,659,821+spread*514,237+spread*90,pulse(t,214,4,23),0,1,'finish');
  const sprite={...attacker,x,y,face:1,attack:null,mode:'Idle',state:'idle',grounded:true,inv:0,intangible:0};
  drawSprite(sprite,1,pose-1,2.83);
  target(opponent,tx,ty-shock*16,-.1-shock*.39-ease((t-209)/27)*1.39,2.49);
  for(const [i,h] of hits.entries()){
   const slot=[0,0,0,1,0,2][i];
   art.strike(slot,tx-28,ty-123,430+i*13,326,pulse(t,h,4,10),[.56,-.7,.28,-.13,.88,-.27][i],slot===0?-1:1);
  }
  art.strike(1,focusX+83+spread*151,focusY+11,629+spread*353,479+spread*94,finish,.06,1,'finish');
  art.strike(3,focusX,focusY,281+spread*106,269,pulse(t,208,1,9),.09,1,'finish');
  ctx.restore();flash('255,166,123',Math.max(shock*.12,finish*.24));bands(t,'#1c1326');
  portraitPanel(t,-28,(zoom,alpha)=>art.portrait(zoom,alpha));ctx.restore();
 }
 function drawContact({x,y,time}){art.strike(2,x,y,171+time*4,149,1-time/23);}
 return {load:art.load,get prepared(){return art.prepared;},draw,drawContact};
})();

'use strict';
// Detailed, prepacked environment art. Presentation does not alter simulation.
const StageVisuals=(()=>{
 const images=new Map(),loading=new Map();let clock=0;
 function urls(id=activeStage){const d=StageArtData[StageCatalog.get(id).theme];return d?[d.background,d.main.image,d.small.image]:[];}
 function prepared(id=activeStage){return urls(id).every(url=>images.has(url));}
 async function load(id=activeStage){await Promise.all(urls(id).map(url=>{if(images.has(url))return;if(!loading.has(url))loading.set(url,(async()=>{const img=new Image();if(typeof TouchControls!=='undefined'&&TouchControls.enabled)img.fetchPriority='high';img.src=url;await img.decode();images.set(url,img);})().finally(()=>loading.delete(url)));return loading.get(url);}));}
 function retain(id=activeStage){const keep=new Set(urls(id));for(const url of images.keys())if(!keep.has(url))images.delete(url);}
 function background(){
  const stage=StageCatalog.get(activeStage),art=StageArtData[stage.theme];if(!art)return false;
  const img=images.get(art.background);if(!img)return false;
  const scale=Math.max(W/img.width,H/img.height);ctx.drawImage(img,(W-img.width*scale)/2,(H-img.height*scale)/2,img.width*scale,img.height*scale);
  // Keep atmosphere and texture, with enough contrast behind tiny fighters.
  const shade=ctx.createLinearGradient(0,0,0,H);shade.addColorStop(0,'#0610260c');shade.addColorStop(.5,'#06102625');shade.addColorStop(1,'#0309136b');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
  ctx.save();
  const color={sky:'#e4faff',adventure:'#ffdf9c',waltz:'#e6d6ff',jazz:'#eecb95',japan:'#ffb68d',cyber:'#6ce7ff',fire:'#ffad53',festival:'#ffe1b2',beauty:'#ffe0ed',factory:'#ffc775',sports:'#e6fff4'}[stage.theme]||stage.color;
  for(let n=0;n<26;n++){
   const x=(n*173.81+clock*(stage.theme==='beauty'?.23:.10))%W,y=(n*71.35-clock*(stage.theme==='fire'?.38:.12)+H*100)%H;
   ctx.globalAlpha=.12+(Math.sin(clock*.018+n)+1)*.08;
   if(stage.theme==='japan'||stage.theme==='beauty'){ctx.save();ctx.translate(x,y);ctx.rotate(n+clock*.008);ellipse(0,0,2.7,1.3,color);ctx.restore();}
   else ellipse(x,y,1+n%3*.35,1+n%3*.35,color);
  }
  if(stage.theme==='factory'){for(let n=0;n<9;n++){const x=110+n*160,y=H-80-((clock*.65+n*47)%190);ctx.globalAlpha=.12;line([[x,y],[x-2,y+5]],'#ffbc5f',1.3);}}
  if(stage.theme==='sports'){for(let n=0;n<7;n++){const x=80+n*207,y=H*.3+(n%2)*45;ctx.globalAlpha=Math.max(0,Math.sin(clock*.035+n*2.1)-.94)*5;line([[x-3,y],[x+3,y]],'#fff',1);line([[x,y-3],[x,y+3]],'#fff',1);}}
  if(stage.theme==='shadow')theatreLights(stage);
  if(stage.layout)atmosphere(stage.theme,color);
  ctx.restore();return true;
 }
 function theatreLights(stage){
  for(const p of stage.platforms){
   if(!p.motion)continue;
   const stops=p.motion.path,t=clock%stops.at(-1)[0];
   const rise=stops.findIndex((stop,n)=>n>0&&stop[2]<stops[n-1][2]);
   const begin=stops[rise-1][0],end=stops[rise][0],fadeStart=begin-45;
   if(t<fadeStart||t>end+24)continue;
   const opacity=Math.min(1,(t-fadeStart)/20,(end+24-t)/24);
   const x=p.x+p.w/2,light=ctx.createLinearGradient(0,165,0,p.y+15);
   light.addColorStop(0,'#ffe5ae00');light.addColorStop(.8,'#ffe5ae8c');light.addColorStop(1,'#ffc97822');
   ctx.globalAlpha=.48*opacity;
   path([[x-10,165],[x+10,165],[x+p.w*.56,p.y+15],[x-p.w*.56,p.y+15]],light);
   ctx.globalAlpha=.65*opacity;
   line([[p.x+11,p.y+10],[p.x+p.w-11,p.y+10]],'#ffcc89',2);
  }
 }
 function atmosphere(theme,color){
  for(let n=0;n<12;n++){
   const rise=theme==='abyss'||theme==='mycelium'||theme==='hollow',drift=theme==='meteobelt'?3.9:theme==='rail'||theme==='rolante'?2.7:theme==='gaur'?1.15:theme==='aurora'?.85:.25;
   const x=(W*100+n*211.7+(theme==='rail'||theme==='meteobelt'?-1:1)*clock*drift)%W;
   const y=(H*100+n*113.7+(rise?-1:1)*clock*(theme==='abyss'?.72:.30))%H;
   ctx.globalAlpha=.13+(Math.sin(clock*.018+n)+1)*.055;
   if(theme==='abyss'){ctx.strokeStyle=color;ctx.beginPath();ctx.arc(x,y,2+n%5,0,TAU);ctx.stroke();}
   else if(theme==='rail'||theme==='aurora'||theme==='salt'||theme==='gaur'||theme==='hylia'||theme==='rolante'||theme==='floatisles'||theme==='meteobelt'||theme==='stone')line([[x,y],[x+7+n%4*3,y+(theme==='stone'?9:theme==='aurora'||theme==='gaur'?2:0)]],color,1);
   else if(theme==='archive'||theme==='origami'||theme==='dusk'||theme==='shrine'||theme==='kamiki'){
    ctx.save();ctx.translate(x,y);ctx.rotate(n+clock*.017);path([[-3,-2],[3,-2],[5,2],[-2,3]],color);ctx.restore();
   }else if(theme==='snowdin'){
    ellipse(x,y,1+n%3*.45,1+n%3*.45,color);
   }else if(theme==='crystal'){
    path([[x,y-4],[x+2,y],[x,y+4],[x-2,y]],color);
   }else if(theme==='chrono'){
    ctx.strokeStyle=color;ctx.beginPath();ctx.arc(x,y,3+n%3,clock*.011+n,clock*.011+n+Math.PI*1.4);ctx.stroke();
   }else ellipse(x,y,2+n%3,2+n%3,color);
  }
 }
 function geometry(p){
  const art=StageArtData[StageCatalog.get(activeStage).theme]?.[p.art??(p.main?'main':'small')];if(!art)return null;
  const scaleX=p.w/(art.surfaceRight-art.surfaceLeft),scaleY=scaleX*(art.verticalScale??(p.main?.76:.60));
  return{art,x:p.x-art.surfaceLeft*scaleX,y:p.y-art.walkY*scaleY,w:art.width*scaleX,h:art.height*scaleY,scaleX,scaleY};
 }
 function platform(p){
  const d=geometry(p);if(!d)return false;const img=images.get(d.art.image);if(!img)return false;
  ctx.save();ctx.drawImage(img,d.x,d.y,d.w,d.h);
  // The subtle rim is exactly at the collision top and follows moving platforms.
  ctx.globalAlpha=.22;line([[p.x+3,p.y+.5],[p.x+p.w-3,p.y+.5]],'#fff5de',1);
  ctx.restore();return true;
 }
 function reset(){clock=0;}
 function motionOffset(motion,time){
  if(motion.path){
   const stops=motion.path,t=time%stops.at(-1)[0];
   const index=stops.findIndex(stop=>stop[0]>t),[begin,x0,y0]=stops[index-1],[end,x1,y1]=stops[index];
   const progress=(t-begin)/(end-begin),smooth=progress*progress*(3-2*progress);
   return[x0+(x1-x0)*smooth,y0+(y1-y0)*smooth];
  }
  const phase=motion.phase||0,phaseY=phase+(motion.phaseY||0),t=time*TAU/motion.period;
  return[(motion.x||0)*(Math.sin(t+phase)-Math.sin(phase)),(motion.y||0)*(Math.sin(t*(motion.harmonicY??1)+phaseY)-Math.sin(phaseY))];
 }
 function tick(){
  // Pick support before moving any platform. Two crossing platforms must never
  // carry the same fighter twice in one simulation frame.
  const riders=fighters.map(f=>f.grounded&&!f.respawn&&!f.ledge?platforms.find(p=>Math.abs(f.y-p.y)<3&&f.x>=p.x-f.character.ecb.radius&&f.x<=p.x+p.w+f.character.ecb.radius):null);
  clock++;for(const p of platforms){
   if(!p.motion)continue;
   p.baseX??=p.x;p.baseY??=p.y;
   const oldX=p.x,oldY=p.y,[dx,dy]=motionOffset(p.motion,clock);
   p.x=p.baseX+dx;p.y=p.baseY+dy;p.dx=p.x-oldX;p.dy=p.y-oldY;
  }
  fighters.forEach((f,n)=>{const p=riders[n];if(p?.motion){f.x+=p.dx;f.y+=p.dy;}});
 }
 return{load,prepared,retain,background,platform,geometry,reset,tick,get ready(){return prepared()},get clock(){return clock},get diagnostics(){return{images:images.size}}};
})();


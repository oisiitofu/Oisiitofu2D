'use strict';
// Detailed, prepacked environment art. Presentation does not alter simulation.
const StageVisuals=(()=>{
 const images=new Map(),loading=new Map();let clock=0;
 function urls(id=activeStage){const d=StageArtData[StageCatalog.get(id).theme];return d?[d.background,d.main.image,d.small.image]:[];}
 function prepared(id=activeStage){return urls(id).every(url=>images.has(url));}
 async function load(id=activeStage){await Promise.all(urls(id).map(url=>{if(images.has(url))return;if(!loading.has(url))loading.set(url,(async()=>{const img=new Image();img.src=url;await img.decode();images.set(url,img);})().finally(()=>loading.delete(url)));return loading.get(url);}));}
 function retain(id=activeStage){const keep=new Set(urls(id));for(const url of images.keys())if(!keep.has(url))images.delete(url);}
 function background(){
  const stage=StageCatalog.get(activeStage),art=StageArtData[stage.theme];if(!art)return false;
  const img=images.get(art.background);if(!img)return false;
  const scale=Math.max(W/img.width,H/img.height);ctx.drawImage(img,(W-img.width*scale)/2,(H-img.height*scale)/2,img.width*scale,img.height*scale);
  // Keep atmosphere and texture, with enough contrast behind tiny fighters.
  const shade=ctx.createLinearGradient(0,0,0,H);shade.addColorStop(0,'#0610260c');shade.addColorStop(.5,'#06102625');shade.addColorStop(1,'#0309136b');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
  ctx.save();
  const color={sky:'#e4faff',adventure:'#ffdf9c',waltz:'#e6d6ff',jazz:'#eecb95',japan:'#ffb68d',cyber:'#6ce7ff',fire:'#ffad53',festival:'#ffe1b2',beauty:'#ffe0ed',factory:'#ffc775',sports:'#e6fff4'}[stage.theme];
  for(let n=0;n<26;n++){
   const x=(n*173.81+clock*(stage.theme==='beauty'?.23:.10))%W,y=(n*71.35-clock*(stage.theme==='fire'?.38:.12)+H*100)%H;
   ctx.globalAlpha=.12+(Math.sin(clock*.018+n)+1)*.08;
   if(stage.theme==='japan'||stage.theme==='beauty'){ctx.save();ctx.translate(x,y);ctx.rotate(n+clock*.008);ellipse(0,0,2.7,1.3,color);ctx.restore();}
   else ellipse(x,y,1+n%3*.35,1+n%3*.35,color);
  }
  if(stage.theme==='factory'){for(let n=0;n<9;n++){const x=110+n*160,y=H-80-((clock*.65+n*47)%190);ctx.globalAlpha=.12;line([[x,y],[x-2,y+5]],'#ffbc5f',1.3);}}
  if(stage.theme==='sports'){for(let n=0;n<7;n++){const x=80+n*207,y=H*.3+(n%2)*45;ctx.globalAlpha=Math.max(0,Math.sin(clock*.035+n*2.1)-.94)*5;line([[x-3,y],[x+3,y]],'#fff',1);line([[x,y-3],[x,y+3]],'#fff',1);}}
  ctx.restore();return true;
 }
 function geometry(p){
  const art=StageArtData[StageCatalog.get(activeStage).theme]?.[p.main?'main':'small'];if(!art)return null;
  const scaleX=p.w/(art.surfaceRight-art.surfaceLeft),scaleY=scaleX*(p.main?.76:.60);
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
 function tick(){
  // Pick support before moving any platform. Two crossing platforms must never
  // carry the same fighter twice in one simulation frame.
  const riders=fighters.map(f=>f.grounded&&!f.respawn&&!f.ledge?platforms.find(p=>Math.abs(f.y-p.y)<3&&f.x>=p.x-f.character.ecb.radius&&f.x<=p.x+p.w+f.character.ecb.radius):null);
  clock++;for(const p of platforms){if(!p.motion)continue;p.baseX??=p.x;p.baseY??=p.y;const oldX=p.x,oldY=p.y,t=clock*TAU/p.motion.period+(p.motion.phase||0),initial=Math.sin(p.motion.phase||0);p.x=p.baseX+(p.motion.x||0)*(Math.sin(t)-initial);p.y=p.baseY+(p.motion.y||0)*(Math.sin(t)-initial);p.dx=p.x-oldX;p.dy=p.y-oldY;}
  fighters.forEach((f,n)=>{const p=riders[n];if(p?.motion){f.x+=p.dx;f.y+=p.dy;}});
 }
 return{load,prepared,retain,background,platform,geometry,reset,tick,get ready(){return prepared()},get clock(){return clock},get diagnostics(){return{images:images.size}}};
})();


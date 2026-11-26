'use strict';

const MotionPreview=(()=>{
 const profiles=new Map();
 let enabled=false,status;

 function register(id,moves,{drawings=[],sample}={}){
  profiles.set(id,{moves,drawings,sample,images:new Map()});
 }

 function init(){
  const section=document.createElement('section');
  section.className='accessibility-settings';
  section.setAttribute('aria-labelledby','motion-preview-title');
  section.innerHTML='<h3 id="motion-preview-title">モーションテスト</h3><label class="access-symbols"><input type="checkbox" id="motion-preview-enabled"> トレーニングで中割りを表示する</label><p id="motion-preview-status" role="status"></p>';
  document.querySelector('#settings .sound-settings').before(section);
  const toggle=section.querySelector('input');
  const rosterToggle=document.querySelector('#roster-motion-preview');
  const toggles=[toggle,rosterToggle];
  status=section.querySelector('[role=status]');
  const names=Roster.selectable.filter(f=>profiles.has(f.id)).map(f=>{
   const profile=profiles.get(f.id);
   if(profile.sample)return f.name+'（技・移動・リアクション）';
   const moves=Object.values(profile.moves).map(move=>move.label);
   return f.name+'（'+moves.join('、')+'）';
  });
  const availability=names.length?names.join('、')+'で試せます。':'準備中です。';
  status.textContent=availability;
  function change(event){
   enabled=event.target.checked;
   for(const control of toggles)control.checked=enabled;
   for(const profile of profiles.values()){
    for(const [src,entry] of profile.images){
     if(!entry.failed)continue;
     profile.images.delete(src);
     profile.warmed=false;
    }
   }
   status.textContent=availability;
   if(training&&state==='pause')render();
  }
  for(const control of toggles){
   control.checked=enabled;
   control.addEventListener('change',change);
  }
 }

 function preload(profile){
  const fixed=Object.values(profile.moves).flatMap(move=>Object.values(move.frames));
  for(const {src} of [...fixed,...profile.drawings]){
   if(profile.images.has(src))continue;
   const img=new Image(),entry={img,ready:false,drawings:new Map()};
   profile.images.set(src,entry);
   img.src=src;
   img.decode().then(()=>{
    entry.ready=true;
    if(enabled&&training&&state==='pause'&&profile.images.get(src)===entry)render();
   },()=>{
    entry.failed=true;
    if(enabled&&profile.images.get(src)===entry)status.textContent='中割り画像を読み込めませんでした。切り替え直すと再試行できます。';
   });
  }
 }

 function readyProfile(f){
  if(!enabled||!training||Net.active||(state!=='battle'&&state!=='pause'))return null;
  const profile=profiles.get(f.characterId);
  if(!profile||characterArt[f.characterId]?.pending)return null;
  if(!profile.warmed){preload(profile);profile.warmed=true;}
  return profile;
 }

 function draw(f,alpha,overridePose,scale){
  if(overridePose!==null)return false;
  const profile=readyProfile(f);
  if(!profile)return false;
  const attack=f.attack;
  if(attack&&(attack.hold||f.timer<=1||f.timer>=attack.totalFrames))return false;
  const move=attack&&profile.moves[attack.type];
  const drawing=(move?.matches(f)&&move.frames[f.timer])||profile.sample?.(f);
  return drawFrame(f,drawing,alpha,scale,profile);
 }

 function drawFrame(f,drawing,alpha,scale,profile){
  if(!drawing||!profile)return false;
  const entry=profile.images.get(drawing.src);
  if(!entry?.ready)return false;
  const color=f.color||0;
  if(!entry.drawings.has(drawing)){
   let source=entry.img;
   if(drawing.rect){
    const [x,y,w,h]=drawing.rect;
    source=document.createElement('canvas');
    source.width=w;
    source.height=h;
    source.getContext('2d').drawImage(entry.img,x,y,w,h,0,0,w,h);
   }
   entry.drawings.set(drawing,new Map([[0,source]]));
  }
  const colors=entry.drawings.get(drawing);
  if(!colors.has(color))colors.set(color,ArtLoader.tint(colors.get(0),f.characterId,color));
  const img=colors.get(color);
  const size=scale*MorphieRules.scale(f),height=drawing.width*img.height/img.width;
  ctx.save();
  const anchor=drawing.ledge&&f.ledge?f.ledge:f;
  ctx.translate(anchor.x,anchor.y);
  ctx.scale(f.face*size,size);
  ctx.imageSmoothingEnabled=true;
  ctx.globalAlpha*=alpha;
  if(f.inv>0&&alpha===1)ctx.globalAlpha*=Accessibility.flash?.64+Math.sin(frame*.5)*.24*Accessibility.flash:.82;
  ctx.drawImage(img,drawing.left,(drawing.bottom??0)-height,drawing.width,height);
  ctx.restore();
  return true;
 }
 function cinematic(f,drawing,alpha,scale){
  return drawing?drawFrame(f,drawing,alpha,scale,readyProfile(f)):false;
 }
 return{register,init,draw,cinematic};
})();

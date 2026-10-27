'use strict';
// Screen-space HUD layout only; character gauge extents are registered by their VFX.
const BattleHud=(()=>{
 const panelTop=691,extents=new Map(),segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('ja',{granularity:'grapheme'}):null;let controlsKey='';
 function reserve(id,top){extents.set(id,Math.max(0,top));}
 const headerInset=f=>extents.get(f.characterId)||0;
 const font=size=>`700 ${size}px 'Noto Sans JP', sans-serif`;
 function fit(context,value,width,size=14,minSize=12){
  const full=String(value);context.save();let label=full;
  try{context.font=font(size);while(size>minSize&&context.measureText(full).width>width){size--;context.font=font(size);}
   if(context.measureText(full).width>width){const parts=segmenter?[...segmenter.segment(full)].map(p=>p.segment):Array.from(full);let low=0,high=parts.length;while(low<high){const mid=Math.ceil((low+high)/2);if(context.measureText(parts.slice(0,mid).join('')+'…').width<=width)low=mid;else high=mid-1;}label=context.measureText('…').width<=width?parts.slice(0,low).join('')+'…':'';}
   return{label,size,width:context.measureText(label).width,full};
  }finally{context.restore();}
 }
 function name(context,value,x,y,color,inset=0){
  const label=fit(context,value,265),top=y-32-inset;context.save();
  context.fillStyle='#101722ed';context.fillRect(x-45,top,293,28);context.fillStyle=color;context.fillRect(x-45,top,3,28);
  context.font=font(label.size);context.fillStyle=color;context.textAlign='left';context.textBaseline='alphabetic';context.fillText(label.label,x-34,top+20);context.restore();return label;
 }
 function overhead(context,value,x,y,color,zoom){
  const label=fit(context,value,120,12,12);context.save();context.translate(x,y);context.scale(1/Math.max(.1,zoom),1/Math.max(.1,zoom));
  context.fillStyle='#0c1827db';context.fillRect(-label.width/2-6,-18,label.width+12,18);context.font=font(label.size);context.fillStyle=color;context.textAlign='center';context.textBaseline='alphabetic';context.fillText(label.label,0,-5);context.restore();return label;
 }
 function controls(canvas,bar,fighters,width,height){
  const inset=Math.max(0,...fighters.map(headerInset)),key=[canvas.width,canvas.height,innerWidth,inset].join('/');if(key===controlsKey)return;controlsKey=key;
  const d=canvas.width/innerWidth,scale=Math.min(canvas.width/width,canvas.height/height),header=panelTop-32-inset;
  // Keep stage/reset/pause controls above the complete HUD, including EDF ammo.
  bar.style.bottom=(((canvas.height-height*scale)/2+(height-header)*scale)/d+10)+'px';
 }
 return{panelTop,reserve,headerInset,fit,name,overhead,controls};
})();

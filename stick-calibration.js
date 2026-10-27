'use strict';
// Read-only view of the pad already chosen by Controls.poll, before its deadzone.
const StickCalibration=(()=>{
 let sample=null,threshold=.25;
 const open=()=>document.getElementById('settings')?.open;
 function draw(){
  if(!open())return;
  const panel=document.getElementById('stick-calibration');
  document.getElementById('calibration-pad').textContent=sample?'表示中：パッド '+(sample.index+1)+'（操作に使用中のパッド）':'パッド未接続：接続してボタンを押してください。';
  for(const[name,offset]of[['left',0],['right',2]]){
   const card=panel.querySelector('[data-stick="'+name+'"]'),zone=card.querySelector('.stick-deadzone'),dot=card.querySelector('.stick-dot'),values=card.querySelector('.stick-values'),state=card.querySelector('.stick-state');
   zone.setAttribute('x',-threshold);zone.setAttribute('y',-threshold);zone.setAttribute('width',threshold*2);zone.setAttribute('height',threshold*2);
   const x=sample?.axes[offset],y=sample?.axes[offset+1],available=Number.isFinite(x)&&Number.isFinite(y);
   dot.style.display=available?'':'none';card.dataset.active='false';
   if(!available){values.textContent='X — / Y —';state.textContent=sample?'入力軸なし':'未接続';continue;}
   const activeX=Math.abs(x)>threshold,activeY=Math.abs(y)>threshold;
   dot.setAttribute('cx',Math.max(-1,Math.min(1,x)));dot.setAttribute('cy',Math.max(-1,Math.min(1,y)));card.dataset.active=String(activeX||activeY);
   const value=n=>(n>=0?'+':'')+n.toFixed(2);values.textContent='X '+value(x)+' / Y '+value(y);
   state.textContent=activeX||activeY?'範囲外：'+[activeX?'X有効':'',activeY?'Y有効':''].filter(Boolean).join('・'):'範囲内：入力なし';
  }
 }
 function update(pad,deadzone){if(!open())return;sample=pad?{index:pad.index,axes:Array.from(pad.axes)}:null;threshold=deadzone;draw();}
 function setThreshold(deadzone){if(!open())return;threshold=deadzone;draw();}
 function holdsStickNavigation(){return open()&&document.getElementById('stick-calibration').contains(document.activeElement);}
 addEventListener('DOMContentLoaded',()=>{document.getElementById('settings').addEventListener('close',()=>{sample=null;});document.getElementById('stick-calibration').addEventListener('pointerdown',e=>{if(!e.target.closest('input,button,select'))document.getElementById('deadzone').focus({preventScroll:true});});});
 return{update,setThreshold,holdsStickNavigation};
})();

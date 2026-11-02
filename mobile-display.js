'use strict';
const MobileDisplay=(()=>{
 let expanded=false,hooks=null,resumeAfterHelp=false,lastTap=null;
 const nativeElement=()=>document.fullscreenElement||document.webkitFullscreenElement;
 const standalone=()=>navigator.standalone===true||matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches;
 function sync(){const on=!!nativeElement()||expanded;document.body.classList.toggle('fullscreen-view',on);const button=document.getElementById('fullscreen');button.setAttribute('aria-pressed',String(on));button.setAttribute('aria-label',on?'全画面表示を解除':'全画面表示');button.title=on?'全画面表示を解除':'全画面表示';document.getElementById('exit-fullscreen').hidden=!on;dispatchEvent(new Event('resize'));}
 function fallback(){expanded=true;sync();if(standalone())return;resumeAfterHelp=hooks?.getState()==='battle'&&typeof Net!=='undefined'&&!Net.active;if(resumeAfterHelp)hooks.pause();const dialog=document.getElementById('fullscreen-help');if(!dialog.open)dialog.showModal();}
 function toggle(){
  if(nativeElement()){const exit=document.fullscreenElement?document.exitFullscreen:document.webkitExitFullscreen;try{Promise.resolve(exit?.call(document)).catch(fallback);}catch{fallback();}return;}
  if(expanded){expanded=false;sync();return;}
  // Keep dialogs in the fullscreen subtree. WebKit's older API returns void.
  const root=document.documentElement,request=root.requestFullscreen||root.webkitRequestFullscreen;
  if(!request){fallback();return;}
  try{Promise.resolve(request.call(root,...(root.requestFullscreen?[{navigationUI:'hide'}]:[]))).then(sync,fallback);}catch{fallback();}
 }
 function touchEnd(e){
  if(!document.body.classList.contains('touch-mode')||e.touches.length||e.changedTouches.length!==1){lastTap=null;return;}
  const target=e.target instanceof Element?e.target:null;if(!target||target.closest('input,textarea,select,[contenteditable=true],[data-touch-action],#touch-stick')){lastTap=null;return;}
  const t=e.changedTouches[0],now=performance.now(),previous=lastTap;lastTap={x:t.clientX,y:t.clientY,time:now};
  if(previous&&now-previous.time<350&&Math.hypot(t.clientX-previous.x,t.clientY-previous.y)<36&&!e.defaultPrevented){
   // Safari may ignore CSS on the canvas/background. Preserve the second UI click.
   e.preventDefault();target.closest('button,a')?.click();
  }
 }
 function init(callbacks){hooks=callbacks;document.getElementById('exit-fullscreen').onclick=toggle;document.getElementById('close-fullscreen-help').onclick=()=>document.getElementById('fullscreen-help').close();document.getElementById('fullscreen-help').addEventListener('close',()=>{if(resumeAfterHelp&&hooks?.getState()==='pause')hooks.pause();resumeAfterHelp=false;});
  document.addEventListener('fullscreenchange',sync);document.addEventListener('webkitfullscreenchange',sync);
  document.addEventListener('touchstart',e=>{if(e.touches.length>1)lastTap=null;},{passive:true});document.addEventListener('touchend',touchEnd,{passive:false});addEventListener('blur',()=>lastTap=null);addEventListener('resize',()=>lastTap=null);sync();
 }
 return{init,toggle};
})();

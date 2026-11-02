'use strict';
const MobileDisplay=(()=>{
 let expanded=false,hooks=null,resumeAfterHelp=false,lastTap=null,wantedFullscreen=false,viewportKey='',retryTimers=[];
 const mobile=()=>document.body.classList.contains('touch-mode');
 // Safari can retain a pinch scale or report its pre-lock viewport briefly on resume.
 // Fit the visible viewport without reloading (and disconnecting) the match.
 function fitViewport(force=false){
  const body=document.body,style=body.style,v=window.visualViewport;
  if(!mobile()){for(const key of['width','height','left','top','inverse','center-x','center-y'])style.removeProperty('--mobile-viewport-'+key);body.classList.remove('touch-zoom-recovery');viewportKey='';return;}
  if(document.hidden)return;
  const scale=Math.max(1,v?.scale||1),width=(v?.width||innerWidth)*scale,height=(v?.height||innerHeight)*scale,left=v?.offsetLeft||0,top=v?.offsetTop||0;
  if(!(width>0&&height>0))return;
  const key=[width,height,left,top,scale].map(n=>Math.round(n*100)/100).join(',');
  if(!force&&key===viewportKey)return;viewportKey=key;
  for(const[name,value]of Object.entries({width:width+'px',height:height+'px',left:left+'px',top:top+'px',inverse:String(1/scale),'center-x':left+width/scale/2+'px','center-y':top+height/scale/2+'px'}))style.setProperty('--mobile-viewport-'+name,value);
  body.classList.toggle('touch-zoom-recovery',scale>1.01);
  dispatchEvent(new Event('resize'));
 }
 function restoreViewport(){lastTap=null;for(const timer of retryTimers)clearTimeout(timer);retryTimers=[];fitViewport(true);if(!mobile())return;for(const delay of[100,350,800])retryTimers.push(setTimeout(()=>fitViewport(true),delay));}
 const nativeElement=()=>document.fullscreenElement||document.webkitFullscreenElement;
 const standalone=()=>navigator.standalone===true||matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches;
 function sync(){const on=!!nativeElement()||expanded;document.body.classList.toggle('fullscreen-view',on);const button=document.getElementById('fullscreen');button.setAttribute('aria-pressed',String(on));button.setAttribute('aria-label',on?'全画面表示を解除':'全画面表示');button.title=on?'全画面表示を解除':'全画面表示';document.getElementById('exit-fullscreen').hidden=!on;dispatchEvent(new Event('resize'));}
 function fallback(){expanded=true;sync();if(standalone())return;resumeAfterHelp=hooks?.getState()==='battle'&&typeof Net!=='undefined'&&!Net.active;if(resumeAfterHelp)hooks.pause();const dialog=document.getElementById('fullscreen-help');if(!dialog.open)dialog.showModal();}
 function toggle(){
  wantedFullscreen=!nativeElement()&&!expanded;
  if(nativeElement()){const exit=document.fullscreenElement?document.exitFullscreen:document.webkitExitFullscreen;try{Promise.resolve(exit?.call(document)).catch(fallback);}catch{fallback();}return;}
  if(expanded){expanded=false;sync();return;}
  // Keep dialogs in the fullscreen subtree. WebKit's older API returns void.
  const root=document.documentElement,request=root.requestFullscreen||root.webkitRequestFullscreen;
  if(!request){fallback();return;}
  try{Promise.resolve(request.call(root,...(root.requestFullscreen?[{navigationUI:'hide'}]:[]))).then(sync,fallback);}catch{fallback();}
 }
 function preventGesture(e){if(mobile()&&e.cancelable)e.preventDefault();}
 function touchGesture(e){
  if(!mobile())return;
  if(e.touches.length>1){lastTap=null;preventGesture(e);return;}
  // The game uses Pointer Events; cancel native pan/zoom without consuming its input.
  if(e.target instanceof Element&&e.target.closest('#game,[data-touch-action],#touch-stick'))preventGesture(e);
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
  const fullscreenChanged=()=>{if(mobile()&&wantedFullscreen&&!nativeElement())expanded=true;sync();restoreViewport();};
  document.addEventListener('fullscreenchange',fullscreenChanged);document.addEventListener('webkitfullscreenchange',fullscreenChanged);
  for(const type of['gesturestart','gesturechange','gestureend'])document.addEventListener(type,preventGesture,{passive:false,capture:true});
  for(const type of['touchstart','touchmove'])document.addEventListener(type,touchGesture,{passive:false,capture:true});
  document.addEventListener('touchend',touchEnd,{passive:false});addEventListener('blur',()=>lastTap=null);
  addEventListener('resize',()=>{lastTap=null;fitViewport();});
  for(const type of['pageshow','focus','orientationchange'])addEventListener(type,restoreViewport);
  document.addEventListener('visibilitychange',()=>{if(mobile()&&!document.hidden){if(wantedFullscreen&&!nativeElement())expanded=true;sync();restoreViewport();}});
  window.visualViewport?.addEventListener('resize',()=>fitViewport());window.visualViewport?.addEventListener('scroll',()=>fitViewport());
  sync();restoreViewport();
 }
 return{init,toggle};
})();

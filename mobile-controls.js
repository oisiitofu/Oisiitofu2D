'use strict';
// Touch is an input source for the primary local seat, using the existing wire format.
const TouchControls=(()=>{
 const key='tofu-touch-mode-v1',pointers=new Map(),edges=new Set(),aims=new Map();
 let preference='auto',enabled=false,active=false,hooks=null,stick=null,x=0,y=0,chord=false,lastState='',lastDialog=false;
 const $=id=>document.getElementById(id),has=a=>[...pointers.values()].some(p=>p.action===a);
 try{const saved=localStorage.getItem(key);if(['auto','on','off'].includes(saved))preference=saved;}catch{}
 function clear(){const ids=[...pointers.keys()];pointers.clear();edges.clear();aims.clear();stick=null;x=y=0;chord=false;for(const id of ids){try{$('touch-controls')?.querySelectorAll('[data-touch-action],#touch-stick').forEach(el=>{if(el.hasPointerCapture(id))el.releasePointerCapture(id);});}catch{}}paint();}
 function paint(){if(!$('touch-stick'))return;$('touch-stick-knob').style.transform=`translate(${x*34}px,${y*34}px)`;for(const b of document.querySelectorAll('[data-touch-action]'))b.classList.toggle('pressed',has(b.dataset.touchAction));}
 function consume(){edges.clear();aims.clear();chord=false;}
 function allowed(){return enabled&&hooks?.getState()==='battle'&&!document.querySelector('dialog[open]')&&!document.hidden;}
 function sync(){
  const state=hooks?.getState(),dialog=!!document.querySelector('dialog[open]'),next=allowed(),battle=enabled&&['battle','pause','result'].includes(state),changed=document.body.classList.contains('touch-battle')!==battle;
  if(next!==active||state!==lastState||dialog!==lastDialog||changed){clear();active=next;lastState=state;lastDialog=dialog;$('touch-controls').hidden=!active;document.body.classList.toggle('touch-battle',battle);if(changed)dispatchEvent(new Event('resize'));}
 }
 function apply(){
  clear();enabled=preference==='on'||preference==='auto'&&(navigator.maxTouchPoints>0||matchMedia('(pointer: coarse)').matches);
  document.body.classList.toggle('touch-mode',enabled);$('touch-mode').value=preference;
  $('touch-toggle').textContent=enabled?'スマホ操作 ON':'スマホ操作 OFF';$('touch-toggle').setAttribute('aria-pressed',String(enabled));
  $('touch-mode-status').textContent=enabled?'タッチ操作が有効です。左スティック＋右ボタンで操作できます。':'タッチ操作は無効です。キーボード・ゲームパッドで操作できます。';
  sync();dispatchEvent(new Event('resize'));
 }
 function setMode(value){if(!['auto','on','off'].includes(value))return;preference=value;try{localStorage.setItem(key,value);}catch{}apply();}
 function move(e){if(e.pointerId!==stick)return;const r=$('touch-stick').getBoundingClientRect(),radius=r.width*.38,dx=(e.clientX-r.x-r.width/2)/radius,dy=(e.clientY-r.y-r.height/2)/radius,len=Math.hypot(dx,dy),m=Math.min(1,Math.max(0,(len-.18)/.82));x=len?dx/len*m:0;y=len?dy/len*m:0;
  // Wide cardinal lanes make up/down specials deliberate; diagonals remain available.
  if(Math.abs(x)<Math.abs(y)*.42)x=0;else if(Math.abs(y)<Math.abs(x)*.42)y=0;
  paint();
 }
 function down(e){
  if(!allowed()||e.button!==0)return;const el=e.target.closest('[data-touch-action],#touch-stick');if(!el)return;e.preventDefault();
  if(el.id==='touch-stick'){if(stick!==null)return;stick=e.pointerId;pointers.set(e.pointerId,{action:'move',el});el.setPointerCapture(e.pointerId);move(e);return;}
  const action=el.dataset.touchAction,fresh=!has(action);pointers.set(e.pointerId,{action,el});el.setPointerCapture(e.pointerId);
  if(fresh){edges.add(action);aims.set(action,{x,y});}if(has('attack')&&has('special'))chord=true;paint();
 }
 function up(e){const p=pointers.get(e.pointerId);if(!p)return;e.preventDefault();pointers.delete(e.pointerId);if(stick===e.pointerId){stick=null;x=y=0;}paint();}
 function read(device){
  if(!active||!allowed()||!['primary','keyboard'].includes(device)||!pointers.size&&!edges.size&&!chord)return null;
  const tap=a=>edges.has(a),attack=tap('attack'),jump=tap('jump'),action=(jump&&['smash','heavy','attack'].some(tap)?['smash','heavy','attack']:['grab','special','smash','heavy','attack']).find(tap),aim=aims.get(action),ax=aim?.x??x,ay=aim?.y??y;
  return{shareStock:chord,x,y,rx:0,ry:0,rightStickMode:'smash',holdBuffer:false,...(aim&&(aim.x!==x||aim.y!==y)?{stickAttack:{...aim}}:{}),jump,jumpHeld:has('jump'),twoJumps:false,attackHeld:has('attack'),jab:attack&&!ax&&!ay,heavy:tap('heavy')||attack&&!!(ax||ay),heavyHeld:has('heavy'),forceTilt:action==='heavy',smash:tap('smash'),smashHeld:has('smash'),charge:has('smash')||has('attack'),special:tap('special'),specialHeld:has('special'),guard:has('guard')||tap('guard'),guardHeld:has('guard'),grab:tap('grab'),grabHeld:has('grab')};
 }
 function init(callbacks){hooks=callbacks;const root=$('touch-controls');root.addEventListener('pointerdown',down);root.addEventListener('pointermove',e=>{if(pointers.has(e.pointerId)){e.preventDefault();move(e);}});root.addEventListener('pointerup',up);root.addEventListener('pointercancel',e=>{up(e);edges.clear();aims.clear();chord=false;});root.addEventListener('lostpointercapture',up);root.addEventListener('contextmenu',e=>e.preventDefault());
  $('touch-toggle').onclick=()=>setMode(enabled?'off':'on');$('touch-mode').onchange=e=>setMode(e.target.value);$('touch-help').onclick=()=>{hooks.pause();$('touch-guide').showModal();};$('close-touch-guide').onclick=()=>$('touch-guide').close();
  $('touch-training-toggle').onclick=()=>{const open=document.body.classList.toggle('touch-training-open');$('touch-training-toggle').setAttribute('aria-expanded',String(open));};
  addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);addEventListener('resize',clear);new MutationObserver(sync).observe($('app'),{subtree:true,attributes:true,attributeFilter:['open','class']});apply();
 }
 return{init,sync,read,consume,clear,setMode,get enabled(){return enabled;}};
})();

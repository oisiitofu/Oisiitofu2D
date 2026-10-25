'use strict';
const PlayerNames=(()=>{
 const presets=['おいしいとうふ','リーマ','ジャン','Lickey','Kento','えだ'],key='tofu-bros.online-name.v1';let current=presets[0];
 function normalize(value,fallback=''){return typeof value==='string'?Array.from(value.normalize('NFKC').replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f<>]/g,'').replace(/\s+/g,' ').trim()).slice(0,20).join('')||fallback:fallback;}
 function choose(value){current=normalize(value,presets[0]);try{localStorage.setItem(key,current);}catch{}if(typeof dispatchEvent==='function')dispatchEvent(new CustomEvent('online-name-change',{detail:current}));return current;}
 function init(){try{current=normalize(localStorage.getItem(key),presets[0]);}catch{}const choices=document.getElementById('online-name-preset'),input=document.getElementById('online-custom-name'),apply=document.getElementById('apply-online-name');choices.replaceChildren();
  const refresh=()=>{input.value=current;for(const b of choices.children)b.setAttribute('aria-pressed',String(b.dataset.onlineName===current));};
  for(const name of presets){const button=document.createElement('button');button.type='button';button.textContent=name;button.dataset.onlineName=name;button.onclick=()=>{choose(name);refresh();};choices.append(button);}
  const commit=()=>{choose(input.value);refresh();};apply.onclick=commit;input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();commit();}});input.addEventListener('change',commit);refresh();
 }
 function lock(value){for(const el of document.querySelectorAll('#online-name-preset button,#online-custom-name,#apply-online-name'))el.disabled=value;}
 return{presets,normalize,choose,init,lock,get current(){return current;}};
})();
if(typeof module!=='undefined')module.exports=PlayerNames;

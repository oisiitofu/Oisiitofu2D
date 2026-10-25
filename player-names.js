'use strict';
const PlayerNames=(()=>{
 const presets=['おいしいとうふ','リーマ','ジャン','Lickey','Kento','えだ'],key='tofu-bros.online-name.v1';let current=presets[0];
 function normalize(value,fallback=''){return typeof value==='string'?Array.from(value.normalize('NFKC').replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f<>]/g,'').replace(/\s+/g,' ').trim()).slice(0,20).join('')||fallback:fallback;}
 function choose(value){current=normalize(value,presets[0]);try{localStorage.setItem(key,current);}catch{}if(typeof dispatchEvent==='function')dispatchEvent(new CustomEvent('online-name-change',{detail:current}));return current;}
 function init(){try{current=normalize(localStorage.getItem(key),presets[0]);}catch{}const select=document.getElementById('online-name-preset'),input=document.getElementById('online-custom-name'),apply=document.getElementById('apply-online-name');for(const name of presets)select.add(new Option(name,name));select.add(new Option('自由入力','custom'));
  const refresh=()=>{select.value=presets.includes(current)?current:'custom';input.value=current;input.closest('label').hidden=select.value!=='custom';apply.hidden=select.value!=='custom';};
  select.onchange=()=>{const custom=select.value==='custom';input.closest('label').hidden=!custom;apply.hidden=!custom;if(custom){input.value=current;input.focus();input.select();}else{choose(select.value);refresh();}};
  const commit=()=>{choose(input.value);refresh();};apply.onclick=commit;input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();commit();}});input.addEventListener('change',commit);refresh();
 }
 function lock(value){for(const id of ['online-name-preset','online-custom-name','apply-online-name'])document.getElementById(id).disabled=value;}
 return{presets,normalize,choose,init,lock,get current(){return current;}};
})();
if(typeof module!=='undefined')module.exports=PlayerNames;

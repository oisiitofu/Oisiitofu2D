'use strict';
// Display preferences only: never change inputs, hitlag, time or match state.
const Accessibility=(()=>{
 const key='tofu-bros.accessibility.v1',reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const defaults={text:1,shake:reduced?0:1,flash:reduced?0:1,markers:'standard',symbols:true};let prefs={...defaults};
 try{const saved=JSON.parse(localStorage.getItem(key)||'{}');for(const k of['text','shake','flash'])if((k==='text'?[1,1.2,1.4]:[0,.35,1]).includes(saved[k]))prefs[k]=saved[k];if(['standard','large','off'].includes(saved.markers))prefs.markers=saved.markers;if(typeof saved.symbols==='boolean')prefs.symbols=saved.symbols;}catch{}
 function apply(){document.body.dataset.textSize=String(prefs.text);document.body.style.setProperty('--readable-scale',prefs.text);for(const k of Object.keys(defaults)){const el=document.getElementById('access-'+k);if(el)el.type==='checkbox'?el.checked=prefs[k]:el.value=String(prefs[k]);}if(typeof Roster!=='undefined')Roster.fit();if(typeof render==='function'&&typeof loaded!=='undefined'&&loaded){resize();render();}}
 function save(){try{localStorage.setItem(key,JSON.stringify(prefs));document.getElementById('access-save').textContent='このブラウザに保存しました。';}catch{document.getElementById('access-save').textContent='保存できないため、この画面を開いている間だけ保持します。';}apply();}
 function init(){
  const section=document.createElement('section');section.className='accessibility-settings';section.setAttribute('aria-labelledby','access-title');section.innerHTML='<h3 id="access-title">見やすさ</h3><div class="accessibility-options"><label>文字サイズ<select id="access-text"><option value="1">標準</option><option value="1.2">大きめ（120%）</option><option value="1.4">大きい（140%）</option></select></label><label>画面揺れ<select id="access-shake"><option value="1">標準</option><option value="0.35">弱め</option><option value="0">なし</option></select></label><label>画面の明滅<select id="access-flash"><option value="1">標準</option><option value="0.35">弱め</option><option value="0">なし</option></select></label><label>プレイヤーマーカー<select id="access-markers"><option value="standard">標準</option><option value="large">大きい</option><option value="off">非表示</option></select></label></div><label class="access-symbols"><input id="access-symbols" type="checkbox"> 記号・プレイヤー番号も表示する</label><p>文字サイズはメニュー・結果・戦闘中の小さな文字に反映します。明滅「なし」は画面全体のフラッシュと無敵中の点滅を抑えます。技の色や形、攻撃判定、ゲーム速度はそのままです。</p><p id="access-save" role="status">設定はこのブラウザに保存されます。</p><button id="access-reset" type="button">見やすさを標準に戻す</button><a href="https://gameaccessibilityguidelines.com/" target="_blank" rel="noopener">Game Accessibility Guidelines</a>';
  document.querySelector('#settings .sound-settings').before(section);
  for(const k of Object.keys(defaults))document.getElementById('access-'+k).onchange=e=>{prefs[k]=k==='symbols'?e.target.checked:['text','shake','flash'].includes(k)?+e.target.value:e.target.value;save();};document.getElementById('access-reset').onclick=()=>{prefs={...defaults};save();};apply();
 }
 function smallText(size){return size<=24?size*prefs.text:size;}
 const symbol=id=>['●','■','▲','◆'][id%4];
 function playerName(f,value){return prefs.symbols?symbol(f.id)+' '+(value===(f.id+1)+'P'?value:(f.id+1)+'P · '+value):value;}
 function marker(f,y){
  if(prefs.markers==='off')return;
  const z=prefs.markers==='large'?1.35:1;ctx.save();ctx.translate(f.x,y);ctx.scale(z,z);BattleHud.overhead(ctx,playerName(f,playerLabel(f.id)),0,0,BattlePlayers.color(f),camera.z);
  ctx.restore();
 }
 return{init,smallText,playerName,marker,get markerMode(){return prefs.markers;},get textScale(){return prefs.text;},get shake(){return prefs.shake;},get flash(){return prefs.flash;},get settings(){return{...prefs};}};
})();

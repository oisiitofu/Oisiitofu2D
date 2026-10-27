'use strict';
// Selection information only. Character-authored notes live beside their move data.
const CharacterGuide=(()=>{
 const notes=new Map();let current=null;
 function define(id,note){notes.set(id,Object.freeze({...note}));}
 const median=values=>{const a=values.filter(Number.isFinite).sort((a,b)=>a-b),n=a.length;return n?(a[(n-1)>>1]+a[n>>1])/2:null;};
 function summary(id,selectable){
  const c=CharacterData[id];if(!c||id==='random')return null;
  const fields=[['runSpeed','走る最高速度'],['airSpeed','空中の横移動'],['weight','重さ']];
  const stats=fields.map(([key,label])=>{const value=c[key],base=median(selectable.map(d=>CharacterData[d.id]?.[key])),ratio=Number.isFinite(value)&&base>0?value/base:null,band=ratio===null?'unknown':ratio>1.05?'high':ratio<.95?'low':'middle';return{key,label,value,base,ratio,band,word:band==='unknown'?'未設定':band==='middle'?'基準付近':key==='weight'?(band==='high'?'重め':'軽め'):(band==='high'?'速め':'遅め')};});
  const facts=stats.filter(s=>s.band==='high'||s.band==='low').map(s=>s.key==='weight'?(s.band==='high'?'重さは基準より上。同じ攻撃・蓄積ダメージなら吹っ飛びにくい傾向。':'軽さに注意。同じ攻撃・蓄積ダメージでは吹っ飛ばされやすい傾向。'):s.key==='runSpeed'?(s.band==='high'?'走り続けたときの最高速度が高く、地上で距離を動かせる。':'走り続けたときの最高速度は低め。追いかける距離に注意。'):(s.band==='high'?'空中の横移動の最高速度が高く、左右へ位置を変えやすい。':'空中の横移動の最高速度は低め。横に離れすぎないよう注意。'));
  const p=c.airMobility,jumps=c.airJumpCount,hover=p?.frames?{seconds:p.frames/60,conditional:!!p.condition}:null;
  return{id,stats,facts:facts.length?facts:['移動速度と重さは基準付近。技の間合いと隙を見て使い分けよう。'],jumps,hover,note:notes.get(id)||null};
 }
 function node(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
 // A separate, unpowered selection snapshot: never inspect or create a live fighter.
 function introduction(id,definition){
  if(!CharacterData[id]||id==='random')return null;
  const kit=movesFor({characterId:id,id:Symbol('guide-only')}),commands=[['dragon','通常必殺','方向なし＋必殺'],['dash','横必殺','横＋必殺'],['rise','上必殺','上＋必殺'],['gale','下必殺','下＋必殺']];
  return{id,name:definition.name,style:definition.style,description:definition.description,specials:commands.map(([key,label,command])=>({key,label,command,name:kit[key]?.name||'技名未設定'}))};
 }
 function appendIntroduction(content,manual=false){
  const{id,definition:d}=current,p=introduction(id,d),section=node('section',undefined,'character-guide-intro');
  section.append(node('h3',manual?'選択中のキャラ：'+d.name:'キャラ紹介・必殺技'));
  if(!p){section.append(node('p','おまかせは対戦開始時にキャラが決まります。キャラを選ぶと、ここで紹介と必殺技を確認できます。'));content.append(section);return;}
  section.dataset.character=id;section.append(node('b',p.style,'character-guide-series'),node('p',p.description));
  const list=node('dl',undefined,'character-guide-specials');
  for(const s of p.specials){const row=node('div');row.dataset.move=s.key;const term=node('dt');term.append(node('b',s.label),node('small',s.command));row.append(term,node('dd',s.name));list.append(row);}section.append(list);
  const binding=Controls.bindingLabels('special');section.append(node('p','現在の必殺ボタン：1Pキー '+binding.keyboard+' ／ パッド '+binding.pad,'character-guide-binding'));
  section.append(node('small','通常形態・初期装備で最初に出す技の名前です。空中・変身・装備・追加入力・残りゲージなどで技や使用条件が変わります。','character-guide-variant'));
  content.append(section);
 }
 function renderManual(){const content=document.getElementById('manual-character');if(!content||!current)return;content.replaceChildren();appendIntroduction(content,true);}
 function refresh(id,definition,selectable){
  current={id,definition,selectable};const dialog=document.getElementById('character-guide-dialog');if(dialog?.open)render();if(document.getElementById('guide')?.open)renderManual();
 }
 function render(){
  if(!current)return;const{id,definition:d,selectable}=current,p=summary(id,selectable),content=document.getElementById('character-guide-content');
  document.getElementById('character-guide-title').textContent=d.name+'の性能・立ち回り';content.replaceChildren();
  appendIntroduction(content);
  if(!p){content.append(node('p','おまかせの性能は抽選されたキャラによって決まります。'));return;}
  const stats=node('div',undefined,'character-guide-stats');
  for(const s of p.stats){const row=node('div',undefined,'character-guide-stat');row.dataset.stat=s.key;row.append(node('b',s.label),node('strong',s.word));const bar=node('div',undefined,'character-guide-bar'),fill=node('span');fill.style.width=(s.ratio===null?0:Math.max(0,Math.min(100,s.ratio*50)))+'%';bar.append(fill);bar.setAttribute('aria-hidden','true');row.append(bar,node('small',s.ratio===null?'比較データなし':'基準比 '+Math.round(s.ratio*100)+'%'));stats.append(row);}content.append(stats);
  content.append(node('p','選択できるキャラの中央値を100%として比較。基準付近は±5%。通常形態・無強化時の値で、加速、技の移動、変身による変化は含みません。','character-guide-reference'));
  const facts=node('ul',undefined,'character-guide-facts');for(const fact of p.facts)facts.append(node('li',fact));content.append(facts);
  const air=node('section',undefined,'character-guide-air');air.append(node('h3','空中でできること'),node('p','空中ジャンプ '+p.jumps+'回（地上からのジャンプを除く）'));
  if(p.hover){air.append(node('p','ジャンプ長押しで浮遊：最大'+p.hover.seconds+'秒'+(p.hover.conditional?'・強化／変身中のみ':'')),node('small','下降中に使用。攻撃中・上必殺使用後など、浮遊できない状態があります。'));}content.append(air);
  if(p.note){const kit=node('section',undefined,'character-guide-kit');kit.append(node('h3','固有の立ち回り'));for(const[key,label]of[['strength','得意な使い方'],['caution','注意点']]){const line=node('p');line.append(node('b',label),node('span',p.note[key]));kit.append(line);}content.append(kit);}
 }
 function open(){if(!current)return;Controls.clear();render();document.getElementById('character-guide-dialog').showModal();}
 function close(){document.getElementById('character-guide-dialog').close();}
 addEventListener('DOMContentLoaded',()=>{document.getElementById('open-character-guide').onclick=open;document.getElementById('close-character-guide').onclick=close;document.getElementById('character-guide-dialog').addEventListener('close',()=>Controls.clear());for(const id of ['home-help','help'])document.getElementById(id).addEventListener('click',()=>{Controls.clear();renderManual();},true);document.getElementById('guide').addEventListener('close',()=>Controls.clear());});
 return{define,summary,introduction,refresh,open,close};
})();

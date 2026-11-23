'use strict';
// Selection information only. Character-authored notes live beside their move data.
const CharacterGuide=(()=>{
 const notes=new Map();let current=null,openingPractice=false;
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
 const compareFields=[
  ['weight','重さ',''],['runSpeed','地上最高速度',' px/F'],['airSpeed','空中横最高速度',' px/F'],
  ['fullHopVelocity','大ジャンプ初速',' px/F'],['airJumpCount','空中ジャンプ','回']
 ],compareMoves=[['jab','弱攻撃'],['heavy','横強'],['smash','横スマッシュ'],['air','空中ニュートラル'],['rise','上必殺']];
 function comparison(id,roster){
  const section=node('details',undefined,'fighter-comparison'),selectors=node('div',undefined,'fighter-comparison-selectors');
  section.append(node('summary','2キャラの性能比較'),selectors);
  const options=roster.filter(d=>d.id!=='random'&&CharacterData[d.id]);
  const picks=['左のキャラ','右のキャラ'].map((label,index)=>{
   const select=node('select'),field=node('label',label);
   select.id='fighter-compare-'+(index?'right':'left');
   select.replaceChildren(...options.map(d=>new Option(d.name,d.id)));
   select.value=index?options.find(d=>d.id!==id)?.id||id:id;
   field.append(select);selectors.append(field);return select;
  });
  const table=node('table');table.id='fighter-compare-table';section.append(table,node('p','通常形態・初期装備の設定値。技は入力からの基準発生で、溜め・派生・発動条件で変わります。','fighter-comparison-note'));
  function fill(){
   const ids=picks.map(p=>p.value),data=ids.map(id=>CharacterData[id]),kits=ids.map(id=>movesFor({characterId:id,id:Symbol('comparison-only')}));
   const heading=node('thead'),top=node('tr');heading.append(top);
   for(const title of ['項目',...ids.map(id=>options.find(d=>d.id===id).name)]){const th=node('th',title);th.scope='col';top.append(th);}
   const body=node('tbody'),number=new Intl.NumberFormat('ja',{maximumFractionDigits:2});
   function row(key,label,cells){
    const tr=node('tr'),th=node('th',label);tr.dataset.compare=key;th.scope='row';tr.append(th);
    for(const value of cells)tr.append(node('td',value));body.append(tr);
   }
   for(const [key,label,unit] of compareFields)row(key,label,data.map(c=>Number.isFinite(c[key])?number.format(c[key])+unit:'—'));
   for(const [key,label] of compareMoves)row(key,label+'の発生',kits.map(kit=>{
    const a=kit[key];return Number.isFinite(a?.startupFrames)?a.startupFrames+'F · '+a.name:'—';
   }));
   table.replaceChildren(heading,body);
  }
  for(const pick of picks)pick.onchange=fill;
  fill();return section;
 }
 async function practice(profile,move,button){
  if(state!=='menu'||openingPractice||Net.code)return;
  openingPractice=true;button.disabled=true;button.textContent='準備中…';
  try{
   const seat=BattlePlayers.selection;
   const color=seat>=2?BattlePlayers.seats[seat].color:Roster.target==='cpu'?+document.getElementById('color2').value:selected;
   Roster.open('training');Roster.setTarget('player');Roster.chooseForSlot(profile.id);Roster.setColor(color);
   const choices=BattlePlayers.config(),stage=StageCatalog.resolve(document.getElementById('stage').value),before=round;
   const players=[
    {...choices.players[0],character:profile.id,color,control:choices.players[0].control==='cpu'?'primary':choices.players[0].control},
    {...choices.players[1],character:Roster.resolve(document.getElementById('cpu-character').value),control:'cpu'}
   ];
   await start({artPrepared:true,participants:{...choices,players,playerCount:2,format:'free',limitBreak:false},squads:{size:1},stage});
   if(state==='battle'&&training&&round!==before)TrainingDemo.practice(move);
  }finally{openingPractice=false;button.disabled=false;button.textContent='この技を練習';}
 }
 // A separate, unpowered selection snapshot: never inspect or create a live fighter.
 function introduction(id,definition){
  if(!CharacterData[id]||id==='random')return null;
  const kit=movesFor({characterId:id,id:Symbol('guide-only')}),commands=[['dragon','通常必殺','方向なし＋必殺'],['dash','横必殺','横＋必殺'],['rise','上必殺','上＋必殺'],['gale','下必殺','下＋必殺']];
  return{id,name:definition.name,origin:definition.origin||'',style:definition.style,description:definition.description,specials:commands.map(([key,label,command])=>({key,label,command,name:kit[key]?.name||'技名未設定'}))};
 }
 function appendIntroduction(content,manual=false){
  const{id,definition:d}=current,p=introduction(id,d),section=node('section',undefined,'character-guide-intro');
  section.append(node('h3',manual?'選択中のキャラ：'+d.name:'キャラ紹介・必殺技'));
  if(!p){section.append(node('p','おまかせは対戦開始時にキャラが決まります。キャラを選ぶと、ここで紹介と必殺技を確認できます。'));content.append(section);return;}
  section.dataset.character=id;if(p.origin)section.append(node('p','登場作品：'+p.origin,'character-guide-origin'));section.append(node('b',p.style,'character-guide-series'),node('p',p.description));
  const list=node('dl',undefined,'character-guide-specials');
  for(const s of p.specials){
   const row=node('div');row.dataset.move=s.key;
   const term=node('dt');term.append(node('b',s.label),node('small',s.command));row.append(term,node('dd',s.name));
   if(!manual){
    const button=node('button','この技を練習','character-guide-practice');button.type='button';
    button.setAttribute('aria-label',s.name+'をトレーニングで練習');
    button.disabled=!!Net.code;button.onclick=()=>void practice(p,s,button);row.append(button);
   }
   list.append(row);
  }
  section.append(list);
  if(!manual&&Net.code)section.append(node('p','トレーニングはルーム退出後に開始できます。'));
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
  const traits=FighterLibrary.traits.filter(trait=>FighterLibrary.hasTrait(id,trait.id));
  if(traits.length){
   const tags=node('ul',undefined,'character-traits');tags.setAttribute('aria-label','図鑑の特性');
   for(const trait of traits)tags.append(node('li',trait.label));content.append(tags);
  }
  if(p.note){const kit=node('section',undefined,'character-guide-kit');kit.append(node('h3','固有の立ち回り'));for(const[key,label]of[['strength','得意な使い方'],['caution','注意点']]){const line=node('p');line.append(node('b',label),node('span',p.note[key]));kit.append(line);}content.append(kit);}
  content.append(comparison(id,selectable));
 }
 function open(){if(!current)return;Controls.clear();render();document.getElementById('character-guide-dialog').showModal();}
 function close(){document.getElementById('character-guide-dialog').close();}
 addEventListener('DOMContentLoaded',()=>{document.getElementById('open-character-guide').onclick=open;document.getElementById('close-character-guide').onclick=close;document.getElementById('character-guide-dialog').addEventListener('close',()=>Controls.clear());for(const id of ['home-help','help'])document.getElementById(id).addEventListener('click',()=>{Controls.clear();renderManual();},true);document.getElementById('guide').addEventListener('close',()=>Controls.clear());});
 return{define,summary,introduction,refresh,open,close};
})();

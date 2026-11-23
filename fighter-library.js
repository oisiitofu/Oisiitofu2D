'use strict';
// Local discovery preferences. Never included in a room, lineup or match packet.
const FighterLibrary=(()=>{
 const favoriteKey='tofu-bros.favorite-fighters.v1',recentKey='tofu-bros.recent-fighters.v1',folderKey='tofu-bros.favorite-folders.v1';
 const order=new Map(Roster.selectable.map((d,n)=>[d.id,n])),valid=new Set(order.keys()),collator=new Intl.Collator('ja');
 let favorites=[],recent=[],folders=[],scope='all',origin='',folderMemoryOnly=false;
 const traits=[
  {id:'tether',label:'フック・引き寄せ復帰',description:'技を支点に掛け、引き寄せや振り子を使って戻れます。',members:'aloy ratchet hornet sackboy terrarian sakuna akira'},
  {id:'warp',label:'ワープ・位置交換',description:'目印や方向を選び、離れた地点へ一気に移動します。',members:'noctis namine magus shadow kasane battlemage aiai megamanexe midna'},
  {id:'setup',label:'設置・罠',description:'場に残る道具や罠を置き、進路や後続の技に影響を与えます。',members:'aloy felyne bomberman ray magus sackboy hydaelyn etna aruru donchan horse lid'},
  {id:'remote',label:'召喚・遠隔操作',description:'本人とは別の仲間や装備を送り、離れた位置から攻められます。',members:'lid yuma elliot mono raguna namine magus akira fiora battlecat'},
  {id:'resources',label:'ゲージ・弾数管理',description:'命中や時間で溜めた資源を、技の強化や使用に消費します。',members:'quote io lid shizuna edf megamanexe knight edea ashley yuma sol ky battlemage octoling'},
  {id:'form',label:'変身・武器の切り替え',description:'形態や武器を切り替え、技の性質と使える間合いを変えます。',members:'agumon hanajs toro kurabe terrarian hunter malenia cubivore hinako enoch onionknight ratchet leon akira kisuke'},
  {id:'air-jumps',label:'追加の空中ジャンプ',description:'通常より空中ジャンプが多く、空中で高さを変えやすいキャラです。',test:c=>c?.airJumpCount>1},
  {id:'hover',label:'ジャンプ長押しで浮遊',description:'ジャンプ長押しで下降を抑えます。形態や強化中だけ使える場合もあります。',test:c=>c?.airMobility?.frames>0}
 ];
 for(const trait of traits)if(trait.members)trait.members=new Set(trait.members.split(' '));
 function hasTrait(id,key){
  const trait=traits.find(t=>t.id===key);
  return !trait||(trait.test?trait.test(CharacterData[id]):trait.members.has(id));
 }
 const read=key=>{try{const a=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(a)?[...new Set(a.filter(id=>valid.has(id)))]:[];}catch{return null;}};
 const folderName=value=>String(value).normalize('NFKC').replace(/[\p{Cc}\p{Cf}]/gu,'').trim();
 function load(){
  favorites=read(favoriteKey)??favorites;recent=(read(recentKey)??recent).slice(0,12);
  if(folderMemoryOnly)return;
  try{
   const saved=JSON.parse(localStorage.getItem(folderKey)||'[]');
   if(Array.isArray(saved))folders=saved.filter(f=>typeof f?.id==='string'&&typeof f.name==='string'&&Array.isArray(f.fighters)).slice(0,30).map(f=>({
    id:f.id,name:folderName(f.name),fighters:[...new Set(f.fighters.filter(id=>valid.has(id)))]
   }));
  }catch{}
 }
 function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
 function series(d){const title=d.origin||CharacterOrigins[d.id]||'作品未設定';return title.startsWith('テイルズ オブ')?'テイルズシリーズ':title;}
 function options(){const counts=new Map();for(const d of Roster.selectable){const key=series(d);counts.set(key,(counts.get(key)||0)+1);}return[...counts].sort(([a],[b])=>collator.compare(a,b));}
 function fill(select){select.replaceChildren(new Option('すべての作品',''),...options().map(([name,count])=>new Option(name==='ファイナルファンタジー'?'FF / ファイナルファンタジー（'+count+'）':name+'（'+count+'）',name)));}
 function matches(d,work='',kind='all'){return(!work||series(d)===work)&&(kind==='favorites'?favorites.includes(d.id):kind==='recent'?recent.includes(d.id):true);}
 function changed(){apply();dispatchEvent(new Event('fighter-library-change'));}
 function toggleFavorite(id){if(!valid.has(id))return false;favorites=favorites.includes(id)?favorites.filter(v=>v!==id):[...favorites,id];const saved=write(favoriteKey,favorites);changed();return saved;}
 function saveFolders(){
  const saved=write(folderKey,folders);
  folderMemoryOnly=!saved;
  dispatchEvent(new Event('fighter-folders-change'));
  return saved;
 }
 function renameFolder(id,value){
  const name=folderName(value),folder=folders.find(f=>f.id===id);
  if(!name||[...name].length>24)return{error:'フォルダ名は1〜24文字にしてください。'};
  if(folders.some(f=>f!==folder&&f.name.toLowerCase()===name.toLowerCase()))return{error:'その名前のフォルダはすでにあります。'};
  if(folder){folder.name=name;return{id,saved:saveFolders()};}
  if(folders.length>=30)return{error:'フォルダは30個まで作成できます。'};
  const newId=crypto.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);
  folders.push({id:newId,name,fighters:[]});
  return{id:newId,saved:saveFolders()};
 }
 function removeFolder(id){folders=folders.filter(f=>f.id!==id);return saveFolders();}
 function toggleFolderFighter(folderId,fighterId){
  const folder=folders.find(f=>f.id===folderId);
  if(!folder||!valid.has(fighterId))return false;
  folder.fighters=folder.fighters.includes(fighterId)?folder.fighters.filter(id=>id!==fighterId):[...folder.fighters,fighterId];
  return saveFolders();
 }
 function record(ids){const clean=[...new Set(ids.filter(id=>valid.has(id)))];recent=[...clean,...recent.filter(id=>!clean.includes(id))].slice(0,12);write(recentKey,recent);changed();}
 function apply(){
  const grid=document.getElementById('fighter-grid');if(!grid)return;
  const cards=[...grid.querySelectorAll('.fighter-card')];if(scope==='recent')cards.sort((a,b)=>recent.indexOf(a.dataset.id)-recent.indexOf(b.dataset.id));else cards.sort((a,b)=>(order.get(a.dataset.id)??999)-(order.get(b.dataset.id)??999));grid.append(...cards,document.getElementById('library-empty'));
  let count=0;for(const card of cards){const d=Roster.selectable.find(d=>d.id===card.dataset.id),show=d?matches(d,origin,scope):!origin&&scope==='all';card.hidden=!show;card.style.order='';if(d&&show)count++;}
  document.getElementById('library-count').textContent=count+'キャラ';document.getElementById('library-empty').hidden=!!count||!origin&&scope==='all';
  for(const b of document.querySelectorAll('[data-library-scope]'))b.setAttribute('aria-pressed',String(b.dataset.libraryScope===scope));
  selected();Roster.fit();
 }
 function selected(){const b=document.getElementById('library-favorite'),id=Roster.selectionContext().characterId;if(!b)return;b.disabled=!valid.has(id);b.textContent=favorites.includes(id)?'★ 登録済み':'☆ 登録';b.setAttribute('aria-pressed',String(favorites.includes(id)));b.setAttribute('aria-label',(Roster.selectionContext().characterName||'選択キャラ')+'のお気に入り');}
 function init(){
  load();const bar=document.createElement('div');bar.className='fighter-discovery';bar.innerHTML='<label>作品<select id="library-origin" aria-label="カードを登場作品で絞り込み"></select></label><div class="library-scopes" role="group" aria-label="キャラの表示範囲"><button type="button" data-library-scope="all" aria-pressed="true">すべて</button><button type="button" data-library-scope="favorites" aria-pressed="false">★ お気に入り</button><button type="button" data-library-scope="recent" aria-pressed="false">最近使った</button></div><button type="button" id="library-favorite">☆ 登録</button><span id="library-count" role="status"></span>';
  document.querySelector('.roster-targets .costume-row').after(bar);
  const grid=document.getElementById('fighter-grid');const empty=document.createElement('p');empty.id='library-empty';empty.hidden=true;empty.textContent='該当するキャラがいません。作品や表示範囲を変更してください。';grid.append(empty);
  fill(document.getElementById('library-origin'));document.getElementById('library-origin').onchange=e=>{origin=e.target.value;apply();};
  for(const b of bar.querySelectorAll('[data-library-scope]'))b.onclick=()=>{scope=b.dataset.libraryScope;apply();};document.getElementById('library-favorite').onclick=()=>toggleFavorite(Roster.selectionContext().characterId);apply();
 }
 addEventListener('roster-context-change',selected);addEventListener('storage',e=>{if([favoriteKey,recentKey].includes(e.key)){load();changed();}if(e.key===folderKey){load();dispatchEvent(new Event('fighter-folders-change'));}});
 return{init,fill,series,matches,record,toggleFavorite,load,renameFolder,removeFolder,toggleFolderFighter,hasTrait,
  get traits(){return traits.map(({id,label,description})=>({id,label,description}));},
  get folders(){return folders.map(f=>({...f,fighters:f.fighters.slice()}));},get recent(){return recent.slice();},get favorites(){return favorites.slice();}};
})();

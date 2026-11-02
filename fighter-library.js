'use strict';
// Local discovery preferences. Never included in a room, lineup or match packet.
const FighterLibrary=(()=>{
 const favoriteKey='tofu-bros.favorite-fighters.v1',recentKey='tofu-bros.recent-fighters.v1';
 const order=new Map(Roster.selectable.map((d,n)=>[d.id,n])),valid=new Set(order.keys()),collator=new Intl.Collator('ja');
 let favorites=[],recent=[],scope='all',origin='';
 const read=key=>{try{const a=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(a)?[...new Set(a.filter(id=>valid.has(id)))]:[];}catch{return null;}};
 function load(){favorites=read(favoriteKey)??favorites;recent=(read(recentKey)??recent).slice(0,12);}
 function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
 function series(d){const title=d.origin||CharacterOrigins[d.id]||'作品未設定';return title.startsWith('テイルズ オブ')?'テイルズシリーズ':title;}
 function options(){const counts=new Map();for(const d of Roster.selectable){const key=series(d);counts.set(key,(counts.get(key)||0)+1);}return[...counts].sort(([a],[b])=>collator.compare(a,b));}
 function fill(select){select.replaceChildren(new Option('すべての作品',''),...options().map(([name,count])=>new Option(name==='ファイナルファンタジー'?'FF / ファイナルファンタジー（'+count+'）':name+'（'+count+'）',name)));}
 function matches(d,work='',kind='all'){return(!work||series(d)===work)&&(kind==='favorites'?favorites.includes(d.id):kind==='recent'?recent.includes(d.id):true);}
 function changed(){apply();dispatchEvent(new Event('fighter-library-change'));}
 function toggleFavorite(id){if(!valid.has(id))return false;favorites=favorites.includes(id)?favorites.filter(v=>v!==id):[...favorites,id];const saved=write(favoriteKey,favorites);changed();return saved;}
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
  const grid=document.getElementById('fighter-grid');grid.before(bar);const empty=document.createElement('p');empty.id='library-empty';empty.hidden=true;empty.textContent='該当するキャラがいません。作品や表示範囲を変更してください。';grid.append(empty);
  fill(document.getElementById('library-origin'));document.getElementById('library-origin').onchange=e=>{origin=e.target.value;apply();};
  for(const b of bar.querySelectorAll('[data-library-scope]'))b.onclick=()=>{scope=b.dataset.libraryScope;apply();};document.getElementById('library-favorite').onclick=()=>toggleFavorite(Roster.selectionContext().characterId);apply();
 }
 addEventListener('roster-context-change',selected);addEventListener('storage',e=>{if([favoriteKey,recentKey].includes(e.key)){load();changed();}});
 return{init,fill,series,matches,record,toggleFavorite,load,get recent(){return recent.slice();},get favorites(){return favorites.slice();}};
})();

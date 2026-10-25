'use strict';
const FighterList=(()=>{
 const storageKey='tofu-bros.favorite-fighters.v1',valid=new Set(Roster.selectable.map(d=>d.id));
 const readings={isaac:'ろびん',okami:'おおかみ',twob:'とぅーびー',makoto:'ゆうきまこと',narukami:'なるかみゆう',naegi:'なえぎまこと',pawapuro:'ぱわぷろくん',headmaster:'じゅくちょう',sakuna:'さくなひめ',human:'ひゅーまん',miku:'はつねみく',naruhodo:'なるほどうりゅういち',layton:'れいとんきょうじゅ',kiryu:'きりゅうかずま',ryofu:'りょふ',edf:'ちきゅうぼうえいぐん',frog:'かえる',sumino:'すみのたくみ',eve:'いゔ',deemo:'でぃーも',hanajs:'はな',kisuke:'きすけ',c4621:'しーふぉーろくにーいち',toro:'とろ',hinako:'しみずひなこ',yuri:'ゆうり',katamari:'かたまりだましい',alucard:'あるかーど',kurabe:'くらべじゅうろう',karateka:'からてか',hayabusa:'りゅうはやぶさ',reimu:'はくれいれいむ',sakura:'しんぐうじさくら',miyabi:'ほしみみやび',agumon:'あぐもん',saki:'さきあまみや',megamanexe:'ろっくまんえぐぜ',kosmos:'こすもす'};
 const normalize=s=>String(s).normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-96)).replace(/[\s・･.ー\-]/g,'');
 const collator=new Intl.Collator('ja',{sensitivity:'base',numeric:true});
 let favorites=new Set(),onlyFavorites=false;
 function load(){try{const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');favorites=new Set(Array.isArray(saved)?saved.filter(id=>valid.has(id)):[]);}catch{/* Keep this page's choices when browser storage is unavailable. */}}
 function save(){try{localStorage.setItem(storageKey,JSON.stringify([...favorites]));document.getElementById('fighter-list-save-status').textContent='お気に入りはこのブラウザに保存されます。';}catch{document.getElementById('fighter-list-save-status').textContent='このブラウザでは保存できないため、今回は開いている間のみ保持します。';}}
 function reading(d){return readings[d.id]||d.name;}
 function render(){const list=document.getElementById('fighter-name-list'),query=normalize(document.getElementById('fighter-list-search').value),sorted=document.getElementById('fighter-list-sort').value==='kana';
  const rows=Roster.selectable.filter(d=>(!onlyFavorites||favorites.has(d.id))&&(!query||[d.name,reading(d)].some(s=>normalize(s).includes(query))));if(sorted)rows.sort((a,b)=>collator.compare(normalize(reading(a)),normalize(reading(b)))||collator.compare(a.name,b.name));
  const fragment=document.createDocumentFragment();for(const d of rows){const row=document.createElement('li'),choose=document.createElement('button'),star=document.createElement('button');choose.type=star.type='button';choose.className='fighter-name-choice';const number=document.createElement('span'),name=document.createElement('span');number.className='fighter-list-number';number.textContent=d.displayNumber;name.className='fighter-name-label';name.textContent=d.name;choose.append(number,name);choose.dataset.fighterId=d.id;choose.onclick=()=>{pick(d.id);};star.className='fighter-favorite';star.textContent=favorites.has(d.id)?'★':'☆';star.setAttribute('aria-pressed',String(favorites.has(d.id)));star.setAttribute('aria-label',d.name+'のお気に入り');star.onclick=()=>{if(favorites.has(d.id))favorites.delete(d.id);else favorites.add(d.id);save();render();const next=list.querySelector('[data-fighter-id="'+d.id+'"]');if(next)next.nextElementSibling.focus();};row.append(choose,star);fragment.append(row);}
  if(!onlyFavorites&&(!query||normalize('おまかせ').includes(query))){const row=document.createElement('li'),choose=document.createElement('button');choose.className='fighter-name-choice';const name=document.createElement('span');name.className='fighter-name-label';name.textContent='おまかせ';choose.append(name);choose.dataset.fighterId='random';choose.onclick=()=>{pick('random');};row.append(choose);fragment.append(row);}
  list.replaceChildren(fragment);document.getElementById('fighter-list-count').textContent=rows.length+'キャラ';document.getElementById('fighter-list-empty').hidden=!!list.children.length;document.getElementById('fighter-list-favorites').setAttribute('aria-pressed',String(onlyFavorites));
 }
 function pick(id){const card=document.querySelector('#fighter-grid [data-id="'+id+'"]');if(card)card.click();else Roster.chooseForSlot(id);close();}
 function close(){document.getElementById('fighter-list-dialog').close();Controls.clear();}
 function open(){Controls.clear();load();onlyFavorites=false;document.getElementById('fighter-list-search').value='';render();document.getElementById('fighter-list-dialog').showModal();document.getElementById('fighter-list-search').focus();}
 document.getElementById('open-fighter-list').onclick=open;document.getElementById('close-fighter-list').onclick=close;
 document.getElementById('fighter-list-search').addEventListener('input',render);document.getElementById('fighter-list-sort').onchange=render;document.getElementById('fighter-list-favorites').onclick=()=>{onlyFavorites=!onlyFavorites;render();};
 document.getElementById('fighter-list-dialog').addEventListener('close',()=>Controls.clear());
 addEventListener('storage',e=>{if(e.key===storageKey){load();if(document.getElementById('fighter-list-dialog').open)render();}});
 return{open,close,readings};
})();

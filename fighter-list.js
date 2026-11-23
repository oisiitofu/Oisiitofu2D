'use strict';
const FighterList=(()=>{
 const storageKey='tofu-bros.favorite-fighters.v1';
 const {readings,reading,normalize,searchPredicate,matchesRandom}=FighterLibrary;
 const collator=new Intl.Collator('ja',{sensitivity:'base',numeric:true});
 let favorites=new Set(),onlyFavorites=false,onlyRecent=false,folderId='';
 function load(){FighterLibrary.load();favorites=new Set(FighterLibrary.favorites);}
 function render(){const list=document.getElementById('fighter-name-list'),query=document.getElementById('fighter-list-search').value,sorted=document.getElementById('fighter-list-sort').value==='kana';
  const work=document.getElementById('fighter-list-origin').value,trait=document.getElementById('fighter-trait-select').value;
  const searchMatches=searchPredicate(query),folder=FighterLibrary.folders.find(f=>f.id===folderId);
  const members=folder?new Set(folder.fighters):null;
  const rows=Roster.selectable.filter(d=>FighterLibrary.matches(d,work,onlyRecent?'recent':onlyFavorites?'favorites':'all')&&searchMatches(d.id)&&(!members||members.has(d.id))&&FighterLibrary.hasTrait(d.id,trait));if(onlyRecent)rows.sort((a,b)=>FighterLibrary.recent.indexOf(a.id)-FighterLibrary.recent.indexOf(b.id));else if(sorted)rows.sort((a,b)=>collator.compare(normalize(reading(a)),normalize(reading(b)))||collator.compare(a.name,b.name));
  const fragment=document.createDocumentFragment();for(const d of rows){const row=document.createElement('li'),choose=document.createElement('button'),star=document.createElement('button');choose.type=star.type='button';choose.className='fighter-name-choice';const number=document.createElement('span'),name=document.createElement('span');number.className='fighter-list-number';number.textContent=d.displayNumber;name.className='fighter-name-label';name.textContent=d.name;choose.append(number,name);choose.dataset.fighterId=d.id;choose.onclick=()=>{pick(d.id);};star.className='fighter-favorite';star.textContent=favorites.has(d.id)?'★':'☆';star.setAttribute('aria-pressed',String(favorites.has(d.id)));star.setAttribute('aria-label',d.name+'のお気に入り');star.onclick=()=>{const saved=FighterLibrary.toggleFavorite(d.id);document.getElementById('fighter-list-save-status').textContent=saved?'お気に入りはこのブラウザに保存されます。':'このブラウザでは保存できないため、今回は開いている間のみ保持します。';load();render();const next=list.querySelector('[data-fighter-id="'+d.id+'"]');if(next)next.nextElementSibling.focus();};row.append(choose,star);fragment.append(row);}
  if(folder)for(const row of fragment.children){
   const choice=row.firstElementChild,id=choice.dataset.fighterId;
   const remove=document.createElement('button');remove.type='button';remove.className='fighter-folder-remove';
   remove.textContent='−';remove.setAttribute('aria-label',choice.querySelector('.fighter-name-label').textContent+'をフォルダから外す');
   remove.onclick=()=>{const saved=FighterLibrary.toggleFolderFighter(folder.id,id);folderMessage('フォルダから外しました。',saved);document.getElementById('fighter-folder-select').focus();};
   row.append(remove);
  }
  if(!folder&&!onlyFavorites&&!onlyRecent&&!work&&!trait&&matchesRandom(query)){const row=document.createElement('li'),choose=document.createElement('button');choose.className='fighter-name-choice';const name=document.createElement('span');name.className='fighter-name-label';name.textContent='おまかせ';choose.append(name);choose.dataset.fighterId='random';choose.onclick=()=>{pick('random');};row.append(choose);fragment.append(row);}
  list.replaceChildren(fragment);document.getElementById('fighter-list-count').textContent=rows.length+'キャラ';document.getElementById('fighter-list-empty').hidden=!!list.children.length;document.getElementById('fighter-list-favorites').setAttribute('aria-pressed',String(onlyFavorites));refreshTarget();
 }
 function refreshTarget(){
  if(!document.getElementById('fighter-list-dialog').open)return;const c=Roster.selectionContext();
  for(const[id,value]of[['fighter-list-owner',c.owner+' を選択中'],['fighter-list-slot',c.slot?c.slot+'人目 / '+c.count+'人':''],['fighter-list-current','現在のキャラ：'+c.characterName],['fighter-list-target-help',c.reason]]){const el=document.getElementById(id);if(el.textContent!==value)el.textContent=value;}
  document.getElementById('fighter-list-slot').hidden=!c.slot;
  for(const button of document.querySelectorAll('#fighter-name-list .fighter-name-choice')){const blocked=!c.editable||!SquadBattle.available(button.dataset.fighterId);button.disabled=blocked;const name=button.querySelector('.fighter-name-label').textContent,reason=!c.editable?c.reason:'別の出場枠で選択済みです';button.title=blocked?reason:name;button.setAttribute('aria-label',name+(blocked?'（'+reason+'）':''));}
 }
 function pick(id){const context=Roster.selectionContext(),card=document.querySelector('#fighter-grid [data-id="'+id+'"]');if(!context.editable||!SquadBattle.available(id)||card?.disabled){refreshTarget();return;}if(card)card.click();else Roster.chooseForSlot(id);if(Roster.selectionContext().characterId===id)close();else refreshTarget();}
 function close(){document.getElementById('fighter-list-dialog').close();Controls.clear();}
 function open(){Controls.clear();load();onlyFavorites=onlyRecent=false;document.getElementById('fighter-list-origin').value='';document.getElementById('fighter-list-search').value='';refreshFolders();render();document.getElementById('fighter-list-dialog').showModal();refreshTarget();document.getElementById('fighter-list-search').focus();}
 const workLabel=document.createElement('label');workLabel.textContent='登場作品';const workSelect=document.createElement('select');workSelect.id='fighter-list-origin';workSelect.setAttribute('aria-label','名前リストを登場作品で絞り込み');FighterLibrary.fill(workSelect);workSelect.onchange=render;workLabel.append(workSelect);document.querySelector('.fighter-list-tools').append(workLabel);const recentButton=document.createElement('button');recentButton.id='fighter-list-recent';recentButton.type='button';recentButton.textContent='最近使った';recentButton.setAttribute('aria-pressed','false');recentButton.onclick=()=>{onlyRecent=!onlyRecent;onlyFavorites=false;render();};document.querySelector('.fighter-list-tools').append(recentButton);
 const foldersPanel=document.createElement('section');
 foldersPanel.className='fighter-folders';
 foldersPanel.innerHTML='<label>お気に入りフォルダ<select id="fighter-folder-select"></select></label><details id="fighter-folder-manage"><summary>フォルダを管理</summary><div class="fighter-folder-actions"><label>フォルダ名<input id="fighter-folder-name" maxlength="48" autocomplete="off"></label><button id="fighter-folder-create" type="button">新規作成</button><button id="fighter-folder-rename" type="button">改名</button><button id="fighter-folder-delete" type="button">削除</button><label>追加するキャラ<select id="fighter-folder-character"></select></label><button id="fighter-folder-add" type="button">追加</button></div></details><p id="fighter-folder-status" role="status"></p>';
 document.querySelector('.fighter-list-tools').after(foldersPanel);
 const traitLabel=document.createElement('label'),traitSelect=document.createElement('select'),traitDescription=document.createElement('p');
 traitLabel.textContent='特性別の図鑑';traitSelect.id='fighter-trait-select';traitDescription.id='fighter-trait-description';
 traitSelect.setAttribute('aria-describedby',traitDescription.id);
 traitLabel.append(traitSelect);foldersPanel.append(traitLabel,traitDescription);
 traitSelect.append(new Option('すべての特性',''),...FighterLibrary.traits.map(t=>new Option(t.label,t.id)));
 traitSelect.onchange=()=>{
  traitDescription.textContent=FighterLibrary.traits.find(t=>t.id===traitSelect.value)?.description||'';
  render();
 };
 const folderField=id=>foldersPanel.querySelector('#fighter-folder-'+id);
 function folderMessage(message,saved=true){folderField('status').textContent=message+(saved?'':' このタブを開いている間のみ保持します。');}
 function refreshFolders(){
  const folders=FighterLibrary.folders,folder=folders.find(f=>f.id===folderId);
  if(!folder)folderId='';
  const select=folderField('select');select.replaceChildren(new Option('指定なし',''),...folders.map(f=>new Option(f.name+'（'+f.fighters.length+'）',f.id)));
  select.value=folderId;
  const characters=folderField('character'),prior=characters.value;
  characters.replaceChildren(new Option('キャラを選ぶ',''),...(folder?Roster.selectable.filter(d=>!folder.fighters.includes(d.id)).map(d=>new Option(d.name,d.id)):[]));
  if([...characters.options].some(option=>option.value===prior))characters.value=prior;
  for(const id of ['rename','delete','add','character'])folderField(id).disabled=!folder;
 }
 folderField('select').onchange=event=>{folderId=event.target.value;onlyFavorites=onlyRecent=false;folderField('name').value=FighterLibrary.folders.find(f=>f.id===folderId)?.name||'';folderMessage('');refreshFolders();render();};
 function saveFolder(id){
  const result=FighterLibrary.renameFolder(id,folderField('name').value);
  if(result.error){folderMessage(result.error);folderField('name').focus();return;}
  folderId=result.id;onlyFavorites=onlyRecent=false;refreshFolders();render();
  folderMessage(id?'フォルダ名を変更しました。':'フォルダを作成しました。キャラを選んで追加できます。',result.saved);
 }
 folderField('create').onclick=()=>saveFolder('');
 folderField('rename').onclick=()=>saveFolder(folderId);
 folderField('delete').onclick=()=>{const saved=FighterLibrary.removeFolder(folderId);folderField('name').value='';folderMessage('フォルダを削除しました。',saved);folderField('select').focus();};
 folderField('add').onclick=()=>{
  const id=folderField('character').value;if(!id){folderMessage('追加するキャラを選んでください。');folderField('character').focus();return;}
  const saved=FighterLibrary.toggleFolderFighter(folderId,id);
  folderMessage(Roster.selectable.find(d=>d.id===id).name+'を追加しました。',saved);
 };
 addEventListener('fighter-folders-change',()=>{refreshFolders();if(document.getElementById('fighter-list-dialog').open)render();});
 addEventListener('fighter-library-change',()=>{load();if(document.getElementById('fighter-list-dialog').open)render();});
 document.getElementById('open-fighter-list').onclick=open;document.getElementById('close-fighter-list').onclick=close;
 document.getElementById('fighter-list-search').addEventListener('input',render);document.getElementById('fighter-list-sort').onchange=render;document.getElementById('fighter-list-favorites').onclick=()=>{onlyFavorites=!onlyFavorites;onlyRecent=false;render();};
 document.getElementById('fighter-list-dialog').addEventListener('close',()=>Controls.clear());
 addEventListener('storage',e=>{if(e.key===storageKey){load();if(document.getElementById('fighter-list-dialog').open)render();}});
 addEventListener('roster-context-change',refreshTarget);
 return{open,close,readings};
})();

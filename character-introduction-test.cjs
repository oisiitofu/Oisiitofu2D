'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),checks=[],errors=[],tag=process.env.INTRO_TAG||'local';
 const check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});
 fs.mkdirSync('previews/quality',{recursive:true});
 try{for(const [width,height]of[[1280,720],[1440,900]]){
  const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.TEST_URL||'http://localhost:4179');await page.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:60000});
  await page.click('#home-help');check('home random has no invented moves '+width,await page.locator('#manual-character').evaluate(e=>e.textContent.includes('対戦開始時にキャラが決まります')&&!e.querySelector('[data-move]')));await page.click('#closehelp');
  await page.click('#enter-training');
  const pure=await page.evaluate(()=>{
   const snap=()=>JSON.stringify([fighters,CharacterData,CombatData.moves,NoctisMoves,IsaacMoves,FioraRules.objects,localStorage,Controls.config,Roster.selectable]);const before=snap();
   const ids=['dragoon','noctis','isaac','enoch','onionknight','fiora','kurabe','malenia','zero3'],data=ids.map(id=>CharacterGuide.introduction(id,Roster.definitions.find(d=>d.id===id)));
   let mapping=[];const original=attack;try{attack=(f,type)=>{mapping.push(type);return true;};for(const [x,y]of[[0,0],[1,0],[0,-1],[0,1]])selectAttack({grounded:true,face:1},{x,y,special:true});}finally{attack=original;}
   const defaults={enoch:EnochKits[0],onionknight:OnionKnightKits[0],fiora:FioraMoves,kurabe:KurabeMoves,malenia:MaleniaMoves,zero3:Zero3Moves},baseEquipment=Object.entries(defaults).every(([id,kit])=>data.find(d=>d.id===id).specials.every(s=>s.name===kit[s.key].name));
   return{data,mapping,baseEquipment,unchanged:before===snap(),random:CharacterGuide.introduction('random',{}),unknown:CharacterGuide.introduction('unregistered',{})};
  });
  check('guide does not mutate data, objects, players, storage or input '+width,pure.unchanged);
  check('command labels follow actual selectAttack routing '+width,JSON.stringify(pure.mapping)===JSON.stringify(['dragon','dash','rise','gale']));
  check('base equipment selectors match initial kits '+width,pure.baseEquipment&&pure.data.every(d=>d.specials.length===4&&d.specials.every(s=>s.name&&s.name!=='技名未設定')));
  check('random and unknown cannot fall back to Dragoon '+width,pure.random===null&&pure.unknown===null);
  const expected={dragoon:['竜牙貫通','ドラゴンダイブ・突撃','ハイジャンプ','竜鱗カウンター'],noctis:['ファントムソード','ワープストライク・剣設置','エアステップ','エレメントフラスク'],isaac:['ストーンスピア','ムーブ','グロウ','グラニト']};
  for(const[id,names]of Object.entries(expected)){
   await page.locator('#fighter-grid [data-id="'+id+'"]').click();
   await page.click('#open-character-guide');
   check('performance includes authored description and actual names '+width+'/'+id,await page.locator('#character-guide-content').evaluate((e,args)=>{const section=e.querySelector('.character-guide-intro'),def=Roster.definitions.find(d=>d.id===args.id);return section.dataset.character===args.id&&section.textContent.includes(def.description)&&JSON.stringify([...section.querySelectorAll('dd')].map(n=>n.textContent))===JSON.stringify(args.names);},{id,names}));
   check('base-state disclaimer is visible '+width+'/'+id,await page.locator('#character-guide-content .character-guide-variant').textContent().then(t=>t.includes('通常形態・初期装備')&&t.includes('空中・変身')));
   await page.keyboard.press('Escape');check('performance Escape restores focus '+width+'/'+id,await page.evaluate(()=>!document.getElementById('character-guide-dialog').open&&document.activeElement.id==='open-character-guide'));
   await page.click('#open-match-settings');await page.click('#help');
   const manual=await page.locator('#guide').evaluate((e,args)=>{const panel=e.querySelector('#manual-character'),r=e.getBoundingClientRect();return{same:panel.querySelector('section').dataset.character===args.id&&JSON.stringify([...panel.querySelectorAll('dd')].map(n=>n.textContent))===JSON.stringify(args.names),general:!e.textContent.includes('横＋必殺は槍を構えて')&&!e.textContent.includes('空下は着地時に左右へ衝撃波')&&e.textContent.includes('メインステージは通過不可'),fits:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&e.scrollWidth<=e.clientWidth+1};},{id,names});
   check('manual tracks selected fighter '+width+'/'+id,manual.same);check('shared manual is generic and fits PC '+width+'/'+id,manual.general&&manual.fits,manual);
   if(id==='noctis')await page.screenshot({path:`previews/quality/character-intro-${tag}-${width}-manual.png`});
   if(id==='noctis'){
    await page.evaluate(()=>{Roster.setTarget('cpu');Roster.chooseForSlot('isaac');});
    check('open manual follows CPU target '+width,(await page.locator('#manual-character h3').textContent()).includes('ロビン'));
   }
   await page.click('#closehelp');await page.evaluate(()=>Roster.setTarget('player'));
  }
  await page.locator('#menu .open-settings:visible').click();await page.locator('[data-group="keyboard"][data-action="special"]').click();await page.keyboard.press('KeyP');
  await page.locator('[data-group="pad"][data-action="special"]').click();
  await page.evaluate(()=>{const pad={index:0,connected:true,mapping:'standard',id:'Guide test pad',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[pad]});Controls.poll();pad.buttons[1].pressed=true;Controls.poll();pad.buttons[1].pressed=false;Controls.poll();});
  await page.click('#close-settings');await page.locator('#fighter-grid [data-id="noctis"]').click();await page.click('#open-character-guide');
  const binding=await page.locator('#character-guide-content .character-guide-binding').textContent();check('actual remapped key and pad labels '+width,binding.includes('キー P')&&binding.includes('2 / B・○'),binding);
  const fit=await page.locator('#character-guide-dialog').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight&&e.scrollWidth<=e.clientWidth+1;});check('introduction fits PC '+width,fit);
  await page.screenshot({path:`previews/quality/character-intro-${tag}-${width}-selected.png`});await page.keyboard.press('Escape');
  await page.click('#open-match-settings');await page.click('#help');check('manual also uses remapped bindings '+width,(await page.locator('#manual-character .character-guide-binding').textContent()).includes('キー P'));await page.click('#closehelp');
  await page.locator('#fighter-grid [data-id="random"]').click();await page.click('#open-character-guide');check('selected random omits move names '+width,await page.locator('#character-guide-content').evaluate(e=>!e.querySelector('[data-move]')&&e.textContent.includes('対戦開始時')));await page.keyboard.press('Escape');
  const configBefore=await page.evaluate(()=>JSON.stringify(Controls.config));await page.click('#back-home');await page.click('#home-help');await page.keyboard.press('KeyP');check('help does not leak combat input '+width,await page.evaluate(()=>!Controls.read().special&&state==='menu'));await page.click('#closehelp');check('guide never saves controls '+width,configBefore===await page.evaluate(()=>JSON.stringify(Controls.config)));
  await page.close();
 }
 const report={checks:checks.length,failed:checks.filter(c=>!c.pass),errors,resolutions:[[1280,720],[1440,900]]};fs.writeFileSync(`previews/quality/character-intro-${tag}.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));assert.deepEqual(report.failed,[]);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

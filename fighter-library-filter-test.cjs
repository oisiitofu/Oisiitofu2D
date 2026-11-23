const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 try{
  for(const [width,height] of [[1440,900],[1024,768]]){
   const page=await browser.newPage({viewport:{width,height}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(process.env.GAME_URL||'http://127.0.0.1:4181');
   await page.waitForFunction(()=>AstralEdge.assetsLoaded);
   await page.click('#enter-roster');
   const hint=page.locator('#roster-selection-hint');
   assert.equal(await hint.textContent(),'');
   await page.click('#select-cpu');assert.equal(await hint.textContent(),'');
   await page.click('#select-player');
   assert(await page.evaluate(()=>{
    const search=document.getElementById('library-search').getBoundingClientRect(),origin=document.getElementById('library-origin').getBoundingClientRect();
    return search.right<origin.left&&search.top===origin.top;
   }));
   assert.equal(await page.locator('[data-library-scope="limit"]').count(),0);
   assert.deepEqual(await page.locator('[data-library-scope]').evaluateAll(buttons=>buttons.map(b=>b.dataset.libraryScope)),['all','favorites','recent']);
   const total=await page.evaluate(()=>Roster.selectable.length);
   assert.equal(await page.locator('.fighter-card:visible').count(),total+1);
   assert.equal(await page.locator('#library-count').innerText(),total+'キャラ');
   const visibleCards=()=>page.locator('.fighter-card:visible').evaluateAll(cards=>cards.map(c=>c.dataset.id));
   for(const query of ['FF7 Tifa','Ｐｈｏｅｎｉｘ　Ｗｒｉｇｈｔ','はくれい','ｼﾞｪｯﾄ','もんはん なるが','random','存在しない文字列']) {
    await page.fill('#library-search',query);
    const grid=await visibleCards();
    await page.click('#open-fighter-list');await page.fill('#fighter-list-search',query);
    const list=await page.locator('.fighter-name-choice').evaluateAll(rows=>rows.map(row=>row.dataset.fighterId));
    await page.click('#close-fighter-list');assert.deepEqual(grid,list,query+' matches the name list');
   }
   assert(await page.locator('#library-empty').isVisible());
   await page.fill('#library-search','FF7 Tifa');await page.selectOption('#library-origin','ファイナルファンタジー');
   assert.deepEqual(await visibleCards(),['tifa']);
   await page.selectOption('#library-origin','モンスターハンター');assert.deepEqual(await visibleCards(),[]);
   await page.fill('#library-search','');await page.selectOption('#library-origin','');
   assert.equal((await visibleCards()).length,total+1);
   await page.locator('[data-id="veronica"]').click();
   await page.locator('#library-favorite').click();
   await page.click('[data-library-scope="favorites"]');
   assert.deepEqual(await page.locator('.fighter-card:visible').evaluateAll(cards=>cards.map(c=>c.dataset.id)),['veronica']);
   await page.selectOption('#library-origin','ファイナルファンタジー');
   assert.ok(await page.locator('#library-empty').isVisible());
   await page.selectOption('#library-origin','');
   await page.evaluate(()=>FighterLibrary.record(['moogle','veronica']));
   await page.click('[data-library-scope="recent"]');
   assert.deepEqual(await page.locator('.fighter-card:visible').evaluateAll(cards=>cards.map(c=>c.dataset.id)),['moogle','veronica']);
   await page.selectOption('#library-origin','ファイナルファンタジー');
   assert.deepEqual(await page.locator('.fighter-card:visible').evaluateAll(cards=>cards.map(c=>c.dataset.id)),['moogle']);
   await page.selectOption('#library-origin','');
   await page.click('[data-library-scope="all"]');
   assert.equal(await page.locator('#limit-break').isChecked(),true);
   assert.equal(await page.locator('.fighter-card:visible').count(),total+1);
   const overflow=await page.locator('.fighter-discovery').evaluate(bar=>[...bar.querySelectorAll('button,select')].some(el=>el.getBoundingClientRect().right>innerWidth));
   assert.equal(overflow,false);
   fs.mkdirSync('previews/limit-revision',{recursive:true});
   await page.screenshot({path:'previews/limit-revision/roster-without-limit-filter-'+width+'.png'});
   await page.reload();await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#enter-roster');
   assert.equal(await page.locator('[data-library-scope="limit"]').count(),0);
   assert.equal(await page.evaluate(()=>FighterLibrary.favorites.includes('veronica')),true);
   assert.deepEqual(errors,[]);
   console.log(JSON.stringify({width,total,filterRemoved:true,originFavoritesRecent:true,overflow:false}));
   await page.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

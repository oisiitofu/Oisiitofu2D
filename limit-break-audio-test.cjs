'use strict';

const assert=require('node:assert/strict');
const {chromium}=require('playwright');

(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 try{
  const page=await browser.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.GAME_URL||'http://localhost:4181');
  await page.waitForFunction(()=>AstralEdge.assetsLoaded);
  await page.click('#enter-roster');
  const result=await page.evaluate(async()=>{
   GameAudio.unlock();
   await GameAudio.preload();
   const aliases={'impact-heavy':'punch-heavy','sword-hit-light':'sword-hit',power:'charge'};
   const missing=[];
   let fightersChecked=0,cuesChecked=0;
   for(const fighter of Roster.selectable){
    const profile=LimitBreak.profile(fighter.id);
    if(!profile)continue;
    fightersChecked++;
    for(const [time,[name]] of profile.cues){
     cuesChecked++;
     if(!GameAudio.bank[aliases[name]||name])missing.push({id:fighter.id,time,name});
    }
   }
   const previous=state;
   const playback=[];
   try{
    state='battle';
    for(const [index,[name,sample]] of Object.entries(aliases).entries()){
     const before=GameAudio.diagnostics.counts[sample]||0;
     sound(name,.8,{id:'limit-audio-test-'+index,x:720});
     playback.push({name,sample,played:(GameAudio.diagnostics.counts[sample]||0)===before+1});
    }
   }finally{state=previous;}
   return {fightersChecked,cuesChecked,missing,playback};
  });
  assert.ok(result.fightersChecked>0);
  assert.deepEqual(result.missing,[],'Every selectable Limit Break cue resolves to an audio sample');
  assert.ok(result.playback.every(cue=>cue.played),'Legacy cue names play through the real sound entry point');
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

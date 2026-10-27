'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true}),errors=[];let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
 try{for(const[width,height]of[[1280,720],[1440,900]]){
  const p=await browser.newPage({viewport:{width,height}});p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>{navigator.getGamepads=()=>[];});await p.goto(process.env.TEST_URL||'http://localhost:4179');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{polling:100});
  await p.click('#enter-training');await p.click('#fighter-grid [data-id="dragoon"]');await p.evaluate(()=>{document.querySelector('#cpu-character').value='dragoon';window.resultSaved=JSON.stringify({...localStorage});});await p.click('#start');await p.waitForFunction(()=>state==='battle',null,{polling:100});await p.evaluate(()=>finish());eq(await p.locator('#result-readiness').isVisible(),false);eq(await p.locator('#result .restart').isEnabled(),true);
  await p.click('#result .restart');await p.waitForFunction(()=>state==='battle',null,{polling:100});eq(await p.locator('#result').isVisible(),false);await p.evaluate(()=>finish());await p.click('#result .back');eq(await p.evaluate(()=>state),'menu');eq(await p.evaluate(()=>JSON.stringify({...localStorage})===resultSaved),true);
  const phase=await p.evaluate(()=>{
   const code='ABCDEF',players=[{name:'自分',ready:true},{name:'相手',ready:false}],context={code,slot:0,result:true,online:true};
   document.querySelector('#result').classList.remove('hidden');ResultReadiness.begin({matchId:3,players},code);ResultReadiness.refresh(context);const old=document.querySelector('#result-ready-title').textContent;
   ResultReadiness.accept({code,matchId:4,preparing:true,players:players.map(p=>({...p,ready:true}))},code);ResultReadiness.refresh(context);const next=document.querySelector('#result-ready-title').textContent,disabled=document.querySelector('#result .restart').disabled;
   ResultReadiness.accept({code,matchId:4,bingo:{champion:'team:0',picks:['private']},players},code);
   const b=document.querySelector('#result .restart');b.disabled=true;b.textContent='部屋主の配り直しを待っています';ResultReadiness.refresh(context);const untouched=b.disabled&&b.textContent==='部屋主の配り直しを待っています';
   ResultReadiness.clear();ResultReadiness.refresh({...context,code:''});return{old,next,disabled,untouched,rejoin:!b.disabled&&b.textContent==='ルームを選んで再戦 →',hidden:document.querySelector('#result-readiness').classList.contains('hidden')};
  });eq(phase,{old:'全員の終了を確認中…',next:'全員準備完了 · 次の試合を準備中',disabled:true,untouched:true,rejoin:true,hidden:true});await p.close();
 }eq(errors,[]);const report={checks,errors,offlineFinishRematch:true,buttonPhaseFixtures:true,bingoButtonOwnership:true};fs.writeFileSync(`previews/quality/result-readiness-ui-${process.env.RESULT_TAG||'local'}.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

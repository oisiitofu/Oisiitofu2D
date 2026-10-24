const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),checks=[],errors=[];
 const legacy={attack:0,special:1,grab:2,guard:4,jump:3,jumpAlt:6,heavy:5,smash:7,pause:9};
 const expected={attack:1,special:0,grab:4,grabAlt:6,guard:5,guardAlt:7,jump:3,jumpAlt:2,heavy:-1,smash:-1,pause:9};
 const check=(name,pass)=>checks.push({name,pass:!!pass});
 try{
  for(const [name,saved] of [['fresh',null],['old default',{pad:legacy,keyboard:{attack:'KeyB'},deadzone:.4}],['custom',{pad:{...legacy,attack:8},keyboard:{special:'KeyQ'}}]]){
   const context=await browser.newContext(),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   if(saved)await page.addInitScript(v=>{if(!localStorage.getItem('astral-controls-v1'))localStorage.setItem('astral-controls-v1',JSON.stringify(v));},saved);
   await page.goto(process.argv[2]||'http://localhost:4173');await page.waitForFunction(()=>typeof Controls!=='undefined');
   const config=await page.evaluate(()=>Controls.config);
   if(name==='custom')check('custom pad retained without new conflicts',config.pad.attack===8&&config.pad.grab===2&&config.pad.guard===4&&config.pad.jumpAlt===6&&config.pad.grabAlt===-1&&config.pad.guardAlt===-1&&config.keyboard.special==='KeyQ');
   else{
    check(name+' new standard mapping',Object.entries(expected).every(([k,v])=>config.pad[k]===v));
    if(saved)check('keyboard and deadzone retained',config.keyboard.attack==='KeyB'&&config.deadzone===.4);
    const inputs=await page.evaluate(()=>{
     document.querySelectorAll('#menu,#pause,#result,#bingo-select').forEach(e=>e.classList.add('hidden'));const pad={index:0,connected:true,mapping:'standard',id:'DualSense test',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};
     Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[pad]});Controls.poll();Controls.consume();
     const samples=[];
     for(const n of [0,1,2,3,4,5,6,7]){
      pad.buttons[n]={pressed:true,value:1};Controls.poll();samples.push({n,input:Controls.read()});
      Controls.consume();pad.buttons[n]={pressed:false,value:0};Controls.poll();Controls.consume();
     }
     pad.buttons[5].pressed=true;pad.buttons[7].pressed=true;Controls.poll();pad.buttons[5].pressed=false;Controls.poll();const oneGuardHeld=Controls.read().guard;
     pad.buttons[7].pressed=false;Controls.poll();const guardReleased=!Controls.read().guard;
     return{samples,oneGuardHeld,guardReleased};
    });
    for(const {n,input}of inputs.samples){
     const action=({0:'special',1:'jab',2:'jump',3:'jump',4:'grab',5:'guard',6:'grab',7:'guard'})[n];
     check(name+' button '+n+' only '+action,input[action]&&!input.heavy&&!input.smash&&['special','jab','jump','grab','guard'].filter(a=>a!==action).every(a=>!input[a]));
    }
    check(name+' guard stays until both shoulders released',inputs.oneGuardHeld&&inputs.guardReleased);
   }
   await page.evaluate(()=>document.querySelector('#reset-bindings').click());
   const reset=await page.evaluate(()=>Controls.config);check(name+' reset defaults',Object.entries(expected).every(([k,v])=>reset.pad[k]===v));
   await page.reload();await page.waitForFunction(()=>typeof Controls!=='undefined');
   const reloaded=await page.evaluate(()=>Controls.config);check(name+' persisted layout',Object.entries(expected).every(([k,v])=>reloaded.pad[k]===v));
   check(name+' aliases visible',await page.locator('[data-action="grabAlt"]').count()===1&&await page.locator('[data-action="guardAlt"]').count()===1);
   await context.close();
  }
  console.log(JSON.stringify({total:checks.length,failed:checks.filter(c=>!c.pass),errors},null,2));
  if(errors.length||checks.some(c=>!c.pass))process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

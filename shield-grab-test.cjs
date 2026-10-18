const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),errors=[];
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>navigator.getGamepads=()=>[]);
  await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.click('#enter-training');await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#start');await page.waitForFunction(()=>state==='battle');
  const result=await page.evaluate(()=>{
   state='pause';countdown=0;const failed=[];let checks=0;
   const check=(name,pass,detail)=>{checks++;if(!pass)failed.push({name,detail});};
   const reset=(id='dragoon',face=1)=>{const f=makeFighter(0,0,id),o=makeFighter(1,0,'dragoon');fighters=[f,o];for(const v of fighters){v.y=560;v.inv=v.intangible=v.hitlag=v.hitstun=0;v.grounded=true;}f.x=720;f.face=face;o.face=-face;o.x=f.x+face*(f.character.ecb.radius+o.character.ecb.radius+8);return f;};
   const tick=(f,i={})=>{frame++;updateFighter(f,{...emptyInput(),...i});};
   for(const {id}of Roster.definitions)for(const face of [-1,1]){
    for(const [x,y]of [[0,0],[face*.9,-.5],[0,-1],[0,1]]){
     const f=reset(id,face);for(let n=0;n<8;n++)tick(f,{guard:true,y:y===-1?-1:0});
     tick(f,{guard:true,attackHeld:true,...(x||y?{heavy:true}:{jab:true}),x,y});
     check(id+'/'+face+'/'+x+'/'+y+' shield cancels directly into grab',f.mode==='Grab'&&f.attack?.type==='grab'&&f.timer===1&&!f.committedDrop,{mode:f.mode,type:f.attack?.type,timer:f.timer});
     const o=fighters[1];let captured=false;
     for(let n=0;n<12;n++){tick(f,{guard:true,attackHeld:true,x,y});resolveCombat();if(f.grabbed===o){captured=true;break;}}
     check(id+'/'+face+'/'+x+'/'+y+' shield grab actually captures',captured);
     for(let n=0;n<15;n++)tick(f,{guard:true});tick(f,{guard:true,jab:true,attackHeld:true});tick(f,{guard:true,attackHeld:true});check(id+'/'+face+'/'+x+'/'+y+' attack while holding guard after capture pummels',f.mode==='Pummel'&&o.damage>0,{mode:f.mode,damage:o.damage});
    }
    let f=reset(id,face);tick(f,{guard:true,jab:true,attackHeld:true});check(id+'/'+face+' simultaneous guard and attack grabs immediately',f.mode==='Grab'&&f.attack?.type==='grab');
    f=reset(id,face);tick(f,{guard:true});tick(f,{guard:true});f.shieldStun=5;
    tick(f,{guard:true,jab:true,attackHeld:true});check(id+'/'+face+' cannot grab during shield stun',!f.attack&&f.mode==='ShieldHold');
    for(let n=0;n<5;n++)tick(f,{guard:true,attackHeld:true});check(id+'/'+face+' queued grab starts after shield stun',f.attack?.type==='grab'&&f.mode==='Grab');
    f=reset(id,face);tick(f,{guard:true});tick(f,{guard:true});f.shieldStun=18;tick(f,{guard:true,jab:true,attackHeld:true});
    for(let n=0;n<25;n++)tick(f,{guard:true,attackHeld:true});check(id+'/'+face+' expired buffered grab does not repeat while held',!f.attack&&f.mode==='ShieldHold');
    f=reset(id,face);f.grounded=false;f.y=180;tick(f,{guard:true,jab:true,attackHeld:true});check(id+'/'+face+' aerial guard plus attack never grabs',f.attack?.type!=='grab');
    f=reset(id,face);tick(f,{guard:true});tick(f,{guard:true,grab:true});check(id+'/'+face+' dedicated grab button still cancels shield',f.attack?.type==='grab');
   }
   let f=reset();const originalAttack=attack;let grabCount=0;try{attack=(v,t)=>{if(t==='grab')grabCount++;return originalAttack(v,t);};tick(f,{guard:true,jab:true,attackHeld:true});for(let n=0;n<120;n++)tick(f,{guard:true,attackHeld:true});check('held buttons do not repeat grab',grabCount===1,grabCount);}finally{attack=originalAttack;}
   const key=(code,down)=>dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));
   f=reset();key('KeyA',true);Controls.poll();tick(f,Controls.read());Controls.consume();key('KeyZ',true);Controls.poll();tick(f,Controls.read());Controls.consume();check('keyboard guard plus normal attack grabs',f.attack?.type==='grab');key('KeyZ',false);key('KeyA',false);Controls.consume();
   const pad={index:0,connected:true,mapping:'standard',id:'DualSense test',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[pad]});
   for(const guardButton of [5,7]){pad.buttons.forEach(b=>{b.pressed=false;b.value=0;});Controls.poll();Controls.consume();f=reset('nier');pad.buttons[guardButton]={pressed:true,value:1};Controls.poll();tick(f,Controls.read());Controls.consume();pad.buttons[1]={pressed:true,value:1};Controls.poll();tick(f,Controls.read());Controls.consume();check('PS5 '+guardButton+' and circle grabs',f.attack?.type==='grab'&&f.mode==='Grab');}
   return{characters:Roster.definitions.length,checks,failed};
  });console.log(JSON.stringify({...result,errors},null,2));if(result.failed.length||errors.length)process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

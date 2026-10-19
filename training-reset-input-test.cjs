const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const results=[],errors=[];
 for(const customBindings of [false,true]){
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(custom=>{window.requestAnimationFrame=()=>0;if(custom)localStorage.setItem('astral-controls-v1',JSON.stringify({padLayoutVersion:2,pad:{special:2,grab:8,grabAlt:10,jumpAlt:0}}));},customBindings);
  await page.goto(process.env.TEST_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,{},{timeout:60000,polling:100});await page.click('#enter-training');await page.click('#start');await page.waitForFunction(()=>state==='battle',null,{polling:100});
  results.push(...await page.evaluate(custom=>{
   const out=[],check=(name,pass)=>out.push({name:(custom?'custom: ':'default: ')+name,pass:!!pass});
   const pads=Array.from({length:4},(_,index)=>({connected:true,index,id:'Reset test '+index,mapping:'standard',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))}));
   Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>pads});
   const button=(slot,n,down,analog=false)=>pads[slot].buttons[n]={pressed:down&&!analog,value:down?1:0};
   const neutral=()=>{pads.forEach(p=>p.buttons.forEach(b=>{b.pressed=false;b.value=0;}));Controls.poll();Controls.poll();Controls.consume();};
   const idleInput=()=>['primary','pad1','pad2','pad3','pad4'].every(device=>{const a=Controls.read(device);return !a.guard&&!a.guardHeld&&!a.special&&!a.specialHeld&&!a.grab&&!a.grabHeld&&!a.jump&&!a.jumpHeld&&!a.jab&&!a.heavy&&!a.smash&&!a.shareStock;});
   const orders=[[4,5,0],[5,4,0],[0,4,5],[0,5,4],[4,0,5],[5,0,4]];
   for(let slot=0;slot<4;slot++)for(const order of orders){
    neutral();const before=fighters[0];before.damage=81;before.x=780;
    button(slot,order[0],true);Controls.poll();Controls.consume();button(slot,order[1],true);Controls.poll();Controls.consume();
    check('pad '+slot+' incomplete '+order.join(','),fighters[0]===before&&fighters[0].damage===81);
    button(slot,order[2],true);Controls.poll();
    check('pad '+slot+' reset '+order.join(','),fighters[0]!==before&&fighters.every(f=>f.damage===0&&!f.attack)&&fighters[0].x===500&&fighters[0].y===560&&state==='battle');
    check('pad '+slot+' chord consumed '+order.join(','),idleInput());
    const reset=fighters[0];reset.damage=31;for(let i=0;i<30;i++){Controls.poll();Controls.consume();}
    check('pad '+slot+' holding does not repeat '+order.join(','),fighters[0]===reset&&fighters[0].damage===31&&idleInput());
    button(slot,0,false);Controls.poll();button(slot,0,true);Controls.poll();
    check('pad '+slot+' hold shoulders and tap cross again '+order.join(','),fighters[0]!==reset&&fighters[0].damage===0);
   }
   neutral();let before=fighters[0];for(const n of [4,5,0,1])button(0,n,true,n===5);Controls.poll();
   check('analog button values and simultaneous attack reset without attack leakage',fighters[0]!==before&&idleInput());
   const reset=fighters[0];for(let i=0;i<60;i++)AstralEdge.step();
   check('held chord never starts an action on later game frames',fighters[0]===reset&&!reset.attack&&reset.damage===0);
   neutral();before=fighters[0];button(0,4,true);button(1,5,true);button(1,0,true);Controls.poll();check('buttons on different controllers cannot combine',fighters[0]===before);
   neutral();before=fighters[0];for(const n of [4,6,0])button(0,n,true);Controls.poll();check('old L1 L2 cross no longer resets',fighters[0]===before);neutral();state='pause';before=fighters[0];for(const n of [4,5,0])button(0,n,true);Controls.poll();check('paused training resets and stays paused',fighters[0]!==before&&state==='pause');
   neutral();document.querySelector('#settings').showModal();before=fighters[0];for(const n of [4,5,0])button(0,n,true);Controls.poll();check('settings dialog cannot reset training',fighters[0]===before);document.querySelector('#settings').close();neutral();
   state='battle';training=false;before=fighters[0];for(const n of [4,5,0])button(0,n,true);Controls.poll();check('normal battle does not reset',fighters[0]===before);check('normal battle retains ordinary button bindings',custom?Controls.read().jump:Controls.read().special&&Controls.read().grab&&Controls.read().guard);
   neutral();training=true;state='menu';before=fighters[0];for(const n of [4,5,0])button(0,n,true);Controls.poll();check('menu does not reset an old training session',fighters[0]===before);
   return out;
  },customBindings));await page.close();
 }
 const failed=results.filter(r=>!r.pass);console.log(JSON.stringify({checks:results.length,failed,errors},null,2));assert.deepEqual(failed,[]);assert.deepEqual(errors,[]);
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

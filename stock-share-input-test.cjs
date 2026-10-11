const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);
 const results=await page.evaluate(()=>{
  state='pause';const checks=[],check=(name,pass)=>checks.push({name,pass:!!pass}),key=(code,down)=>dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));
  for(const [device,attack,special]of [['keyboard','KeyZ','KeyX'],['keyboard2','KeyU','KeyO']])for(const order of [[attack,special],[special,attack]]){
   Controls.clear();Controls.consume();for(const code of order)key(code,true);for(const code of order)key(code,false);check(device+' short chord '+order.join('+'),Controls.read(device).shareStock);Controls.consume();check(device+' chord consumed',!Controls.read(device).shareStock);
  }
  Controls.clear();key('KeyA',true);key('Space',true);check('old guard + jump no longer borrows',!Controls.read('keyboard').shareStock);Controls.clear();
  const pads=Array.from({length:4},(_,index)=>({connected:true,index,id:'Test '+index,mapping:'standard',axes:[0,0,0,0],buttons:Array.from({length:16},()=>({pressed:false,value:0}))}));Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>pads});
  for(let slot=0;slot<4;slot++)for(const order of [[1,0],[0,1]]){
   pads.forEach(p=>p.buttons.forEach(b=>{b.pressed=false;b.value=0;}));Controls.clear();Controls.poll();Controls.consume();pads[slot].buttons[order[0]]={pressed:true,value:1};Controls.poll();Controls.consume();pads[slot].buttons[order[1]]={pressed:true,value:1};Controls.poll();check('pad '+(slot+1)+' attack/special order '+order.join(','),Controls.read('pad'+(slot+1)).shareStock);for(let other=0;other<4;other++)if(other!==slot)check('pad chord isolated '+slot+'/'+other,!Controls.read('pad'+(other+1)).shareStock);
  }
  training=false;setupStage('0');BattlePlayers.start({format:'teams',stocks:3,players:['dragoon','isaac','haseo','doshin'].map((character,id)=>({character,color:0,team:id%2,control:'keyboard'}))});const donor=fighters[0],receiver=fighters[2];receiver.stocks=0;receiver.respawn=100;BattlePlayers.eliminatedInput(receiver,{guard:true,jump:true});check('old action cannot revive eliminated fighter',receiver.stocks===0&&donor.stocks===3);BattlePlayers.eliminatedInput(receiver,{jab:true,special:true});check('attack + special borrows exactly one stock',receiver.stocks===1&&donor.stocks===2);BattlePlayers.eliminatedInput(receiver,{shareStock:true});check('living fighter cannot borrow again',receiver.stocks===1&&donor.stocks===2);receiver.stocks=0;donor.stocks=1;BattlePlayers.eliminatedInput(receiver,{shareStock:true});check('last teammate stock protected',receiver.stocks===0&&donor.stocks===1);
  return checks;
 });for(const r of results)assert.ok(r.pass,r.name);assert.deepEqual(errors,[]);console.log(JSON.stringify({checks:results.length,keyboardBothOrders:true,fourPadsBothOrders:true,oldChordRejected:true,errors},null,2));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});

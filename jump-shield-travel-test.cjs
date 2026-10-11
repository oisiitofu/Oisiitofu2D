const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});try{
 const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#enter-training');await p.click('#start');
 const result=await p.evaluate(()=>{state='pause';let checks=0;const failed=[],check=(name,pass,detail)=>{checks++;if(!pass)failed.push({name,detail});};
 const reset=(id,face,air=false)=>{const f=makeFighter(0,0,id),o=makeFighter(1,2,'ulgrim');fighters=[f,o];for(const a of fighters){a.inv=a.intangible=a.hitlag=a.hitstun=0;a.grounded=!air;a.y=air?-100:560;a.vx=a.vy=0;}f.x=650;f.face=face;o.x=1000;return f;};
 const tick=(f,i={})=>{frame++;PlayerController.tick(f,{...emptyInput(),...i});};
 const launch=(f,i={})=>{for(let n=0;n<4;n++)tick(f,i);};
 for(const {id}of Roster.definitions)for(const face of [-1,1]){
  for(const shield of [false,true])for(const x of [0,face,-face]){
   let f=reset(id,face);if(shield)tick(f,{guard:true});tick(f,{guard:shield,jump:true,jumpHeld:true,jab:true,x});launch(f,{guard:shield,jumpHeld:true});check(id+'/'+face+' simultaneous short aerial shield='+shield+' x='+x,f.shortHop&&!!f.attack&&f.attack.shortHopMultiplier===.85&&f.vy<0,{mode:f.mode,type:f.attack?.type,short:f.shortHop,vy:f.vy});
   f=reset(id,face);if(shield)tick(f,{guard:true});tick(f,{guard:shield,jump:true,jumpHeld:true});tick(f,{guard:shield,jumpHeld:true,jab:true,x});launch(f,{guard:shield,jumpHeld:true});check(id+'/'+face+' staggered full aerial shield='+shield+' x='+x,!f.shortHop&&!!f.attack&&f.attack.shortHopMultiplier===1&&f.vy<0,{mode:f.mode,type:f.attack?.type,short:f.shortHop,vy:f.vy});
  }
  for(const mode of ['AerialLanding','ShieldDrop','ForwardRoll','GroundAttack']){
   const f=reset(id,face);if(mode==='GroundAttack'){attack(f,'jab');f.timer=f.attack.totalFrames-5;}else if(mode==='ForwardRoll'){PlayerController.beginDodge(f,{...emptyInput(),x:face});f.stateFrame=f.stateDuration-5;}else PlayerStates.enter(f,mode,5);
   tick(f,{jump:true,jumpHeld:true,jab:true});for(let n=0;n<9;n++)tick(f,{jumpHeld:true});check(id+'/'+face+' buffered macro '+mode,f.shortHop&&f.attack?.shortHopMultiplier===.85&&f.attack?.aerial,{mode:f.mode,type:f.attack?.type,buffer:f.buffer});
  }
  for(const input of [{y:-1,heavy:true},{ry:-1,rightStickMode:'smash'},{y:-1,smash:true}]){
   const f=reset(id,face);tick(f,{guard:true});tick(f,{guard:true,...input});check(id+'/'+face+' shield up smash '+JSON.stringify(input),f.attack?.type==='upsmash'&&f.mode!=='ShieldDrop',{mode:f.mode,type:f.attack?.type});
  }
  let f=reset(id,face);tick(f,{guard:true});f.shieldStun=4;tick(f,{guard:true,y:-1,heavy:true});for(let n=0;n<4;n++)tick(f,{guard:true});check(id+'/'+face+' shield stun buffers up smash',f.attack?.type==='upsmash',f.attack?.type);
  f=reset(id,face);tick(f,{guard:true});tick(f,{guard:true,jab:true});check(id+'/'+face+' neutral shield attack still grab',f.attack?.type==='grab',f.attack?.type);
  f=reset(id,face);tick(f,{jump:true,jumpHeld:true});tick(f,{});launch(f);check(id+'/'+face+' short tap',f.shortHop);
  f=reset(id,face);tick(f,{jump:true,jumpHeld:true,twoJumps:true});launch(f,{jumpHeld:true});check(id+'/'+face+' two jumps short',f.shortHop);
  f=reset(id,face);tick(f,{jump:true,jumpHeld:true});tick(f,{jump:true,jumpHeld:true,jab:true});launch(f,{jumpHeld:true});check(id+'/'+face+' simultaneous combo during jump squat',f.shortHop&&f.attack?.shortHopMultiplier===.85&&f.airJumps===1);
  f=reset(id,face,true);tick(f,{jump:true,jumpHeld:true,jab:true});check(id+'/'+face+' double jump aerial',f.airJumps===0&&f.attack?.aerial&&!f.shortHop);
  // Body crossing is exercised with the actual pair collision solver every frame.
  for(const dir of [face,-face]){f=reset(id,face);const o=fighters[1],spacing=f.character.ecb.radius+o.character.ecb.radius;o.x=f.x+dir*(spacing+6);const start=f.x;tick(f,{guard:true,x:dir});for(let n=0;n<18;n++){const previous=fighters.map(a=>({x:a.x,y:a.y}));tick(f,{guard:true});resolveFighterBodies(previous);}check(id+'/'+face+' roll crosses opposing body '+dir,(f.x-o.x)*dir>spacing&&Math.abs(o.x-(start+dir*(spacing+6)))<.01,{x:f.x,opponent:o.x,spacing});}
  for(const [x,y]of [[face,0],[0,-1],[face,-1],[-face,1]]){f=reset(id,face,true);const start={x:f.x,y:f.y};tick(f,{guard:true,x,y});for(let n=0;n<20;n++)tick(f);const distance=Math.hypot(f.x-start.x,f.y-start.y);check(id+'/'+face+' aerial dodge reaches 145px '+x+','+y,distance>=145,{distance,mode:f.mode});}
  f=reset(id,face);const l={x:face===1?320:1120,y:560,face};PlayerController.catchLedge(f,l);for(let n=0;n<22;n++)tick(f);const n=pose(f),img=spriteFor(f,n),s=BattleSize.native(id,n)*FIGHTER_SCALE*BattleSize.art(id),d=ledgeArt(f);check(id+'/'+face+' ledge hand to stage',f.x<=l.x&&face===1||f.x>=l.x&&face===-1,{x:f.x,ledge:l.x});check(id+'/'+face+' measured grip aligns edge',Math.abs(f.x+face*Math.abs(d.grip[0])*img.width*s-l.x)<.001&&Math.abs(f.y-d.grip[1]*img.height*s-l.y)<.001);
 }
 // Raw Controls.read() verifies both default PS5 jump/guard buttons and keys.
 const pad={index:0,connected:true,mapping:'standard',id:'DualSense test',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[pad]});
 const release=()=>{pad.buttons.forEach(b=>{b.pressed=false;b.value=0;});pad.axes.fill(0);Controls.poll();Controls.consume();};
 const readTick=f=>{Controls.poll();tick(f,Controls.read());Controls.consume();};
 for(const jump of [2,3])for(const guard of [-1,5,7])for(const delayed of [false,true]){
  release();const f=reset('chiikawa',1);if(guard>=0){pad.buttons[guard].pressed=true;readTick(f);}pad.buttons[jump].pressed=true;if(!delayed)pad.buttons[1].pressed=true;readTick(f);if(delayed)pad.buttons[1].pressed=true;for(let n=0;n<4;n++)readTick(f);check('PS5 '+jump+'/'+guard+' delayed='+delayed,!!f.attack&&f.shortHop===!delayed&&f.attack.shortHopMultiplier===(delayed?1:.85),{mode:f.mode,type:f.attack?.type,short:f.shortHop});
 }
 for(const guard of [5,7]){release();const f=reset('nier',1);pad.buttons[guard].pressed=true;readTick(f);pad.axes[1]=-1;pad.buttons[1].pressed=true;readTick(f);check('PS5 guard '+guard+' up flick circle',f.attack?.type==='upsmash',f.attack?.type);}
 release();const key=(code,down)=>dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));for(const jump of ['Space','KeyV'])for(const delayed of [false,true]){const f=reset('dragoon',1);key(jump,true);if(!delayed)key('KeyZ',true);readTick(f);if(delayed)key('KeyZ',true);for(let n=0;n<4;n++)readTick(f);check('keyboard '+jump+' delayed='+delayed,f.shortHop===!delayed&&f.attack?.shortHopMultiplier===(delayed?1:.85));key(jump,false);key('KeyZ',false);readTick(f);}
 for(const id of ['chiikawa','nier','lightning']){const f=reset(id,1);tick(f,{guard:true});f.shieldStun=4;tick(f,{guard:true,jump:true,jumpHeld:true,jab:true});for(let n=0;n<8;n++)tick(f,{guard:true,jumpHeld:true});check(id+' shield stun buffered short aerial',f.shortHop&&f.attack?.shortHopMultiplier===.85);
 const expired=reset(id,1);PlayerStates.enter(expired,'SpecialLanding',20);tick(expired,{jump:true,jab:true,jumpHeld:true});for(let n=0;n<24;n++)tick(expired,{jumpHeld:true});check(id+' expired combo cannot execute',!expired.attack&&expired.grounded);}
 const originalInput=input;try{for(const id of ['chiikawa','nier']){const f=reset(id,1);hitstop=5;let raw={jump:true,jumpHeld:true,jab:true};input=()=>({...emptyInput(),...raw});update(true);raw={jumpHeld:true};for(let n=0;n<10;n++)update(true);check(id+' KO global stop buffers short aerial',f.shortHop&&f.attack?.shortHopMultiplier===.85);}}finally{input=originalInput;hitstop=0;}
 return{characters:Roster.definitions.length,checks,failed};});console.log(JSON.stringify({...result,errors},null,2));if(result.failed.length||errors.length)process.exitCode=1;
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),errors=[];
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.click('#enter-training');await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#start');
  const result=await page.evaluate(()=>{
   state='pause';countdown=0;const failed=[];let checks=0;
   const check=(name,pass,detail)=>{checks++;if(!pass)failed.push({name,detail});};
   const reset=(id='dragoon',air=false)=>{const f=makeFighter(0,0,id);f.x=720;f.y=air?200:560;f.grounded=!air;f.face=1;f.inv=f.intangible=f.hitlag=f.hitstun=0;fighters=[f,makeFighter(1,0,'dragoon')];fighters[1].x=1400;return f;};
   const tick=(f,i={})=>{frame++;updateFighter(f,{...emptyInput(),...i});};
   const directions=[[-.9,-.45,'smash','dash','heavy','bair'],[-.7,-.7,'smash','dash','heavy','bair'],[-.69,-.71,'upsmash','rise','up','uair'],[-.45,-.9,'upsmash','rise','up','uair'],[.9,-.45,'smash','dash','heavy','fair'],[.45,-.9,'upsmash','rise','up','uair'],[-.9,.45,'smash','dash','heavy','bair'],[-.69,.71,'downsmash','gale','low','dair'],[.9,.45,'smash','dash','heavy','fair'],[.45,.9,'downsmash','gale','low','dair']];
   for(const {id}of Roster.definitions){
    for(const [x,y,smash,special,tilt,aerial]of directions){
     for(const [cmd,expected,air]of [['smash',smash,false],['special',special,false],['tilt',tilt,false],['aerial',aerial,true]]){
      const f=reset(id,air);const i={...emptyInput(),x,y,...(cmd==='smash'?{smash:true}:cmd==='special'?{special:true}:{heavy:true,forceTilt:true})};
      selectAttack(f,i);check(id+'/'+cmd+'/'+x+'/'+y,f.attack?.type===expected,f.attack?.type);if(!air&&x&&Math.abs(x)>=Math.abs(y))check(id+' horizontal ground attack faces input '+cmd+'/'+x,f.face===Math.sign(x),f.face);
     }
    }
    for(const side of [-1,1])for(const delay of [0,3,6]){
     const f=reset(id);tick(f);tick(f,{x:side*.4});tick(f,{x:side*.65});
     for(let n=0;n<delay;n++)tick(f,{x:side*.82});
     tick(f,{x:side*.82,heavy:true,attackHeld:true});check(id+' ramp smash '+side+' delay '+delay,f.attack?.type==='smash',f.attack?.type);
    }
    let f=reset(id);tick(f,{x:1});for(let n=0;n<6;n++)tick(f,{x:1});tick(f,{x:1,heavy:true});check(id+' outside smash window uses ordinary attack',f.attack?.type!=='smash',f.attack?.type);
    f=reset(id);for(let n=0;n<15;n++)tick(f,{x:1});tick(f,{x:1,heavy:true,attackHeld:true});check(id+' held direction does not become smash',f.attack?.type!=='smash',f.attack?.type);
    f=reset(id);tick(f,{x:1});tick(f,{x:1,heavy:true,forceTilt:true});check(id+' explicit tilt retained',f.attack?.type!=='smash',f.attack?.type);
    for(const ledge of StageRules.ledges){
     for(const exit of ['drop','jump']){
      const f=reset(id,true);f.x=ledge.x-ledge.face*40;f.y=ledge.y+60;f.airJumps=0;f.jumps=2;
      PlayerController.catchLedge(f,ledge);check(id+' catch replenishes jumps '+ledge.face,f.mode==='LedgeCatch'&&f.airJumps===f.character.airJumpCount&&f.jumps===0);
      for(let n=0;n<f.character.ledgeCatchFrames+2;n++)tick(f);
      tick(f,exit==='drop'?{x:-ledge.face,y:.6}:{jump:true});check(id+' '+exit+' keeps air jump '+ledge.face,f.airJumps===f.character.airJumpCount);
      tick(f,{jump:true});check(id+' jump after ledge '+exit+' '+ledge.face,f.airJumps===f.character.airJumpCount-1&&f.mode==='Jump'&&f.vy<0,{mode:f.mode,jumps:f.airJumps,vy:f.vy});
     }
     f=reset(id,true);f.ledgeGrabs=f.character.ledgeRegrabLimit;f.airJumps=0;PlayerController.catchLedge(f,ledge);
     check(id+' refused regrab cannot replenish jumps '+ledge.face,!f.ledge&&f.airJumps===0);
    }
   }
   let f=reset();for(let n=0;n<6;n++)tick(f,{rx:-.8,ry:-.7,rightStickMode:'smash'});check('right stick horizontal diagonal selects side smash',f.attack?.type==='smash');
   f=reset();tick(f,{rx:0,ry:0,rightStickMode:'smash'});tick(f,{rx:-.4,ry:-.3,rightStickMode:'smash'});tick(f,{rx:-.55,ry:-.5,rightStickMode:'smash'});check('right stick gradual radial crossing works',f.attack?.type==='smash');
   f=reset();tick(f,{rx:-.8,ry:-.7,rightStickMode:'tilt'});check('right stick tilt mode remains tilt',f.attack?.type==='heavy');
   const originalAttack=attack;let count=0;try{attack=(...args)=>{count++;return originalAttack(...args);};f=reset();for(let n=0;n<140;n++)tick(f,{rx:.75,ry:-.7,rightStickMode:'smash'});check('held right stick triggers once',count===1,count);}finally{attack=originalAttack;}
   const pad={index:0,connected:true,mapping:'standard',id:'DualSense test',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[pad]});
   Controls.poll();Controls.consume();f=reset();for(const x of [0,.35,.55,.75]){pad.axes=[-x,-x*.55,0,0];Controls.poll();tick(f,Controls.read());Controls.consume();}pad.buttons[1]={pressed:true,value:1};Controls.poll();const raw=Controls.read();tick(f,raw);Controls.consume();check('PS5 left stick and circle produces side smash',f.attack?.type==='smash',f.attack?.type);check('raw diagonal axes preserved for steering',raw.x===-.75&&raw.y===-.75*.55);
   const multi=reset('dragoon',true);multi.character.airJumpCount=2;multi.airJumps=0;PlayerController.catchLedge(multi,StageRules.ledges[0]);check('ledge restores character-specific jump count',multi.airJumps===2);
   return{characters:Roster.definitions.length,checks,failed};
  });
  console.log(JSON.stringify({...result,errors},null,2));if(result.failed.length||errors.length)process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

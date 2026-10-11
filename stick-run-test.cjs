const fs=require('fs'),{chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({headless:true,channel:'msedge'}),errors=[];
 try{
  const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.click('#enter-training');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#start');
  const result=await p.evaluate(()=>{
   state='pause';countdown=0;const checks=[];
   const check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});
   const reset=id=>{const f=makeFighter(0,0,id);f.x=720;f.y=560;f.inv=0;f.grounded=true;fighters=[f,makeFighter(1,0,'dragoon')];fighters[1].x=1200;return f;};
   const tick=(f,x,n=1,extra={})=>{for(let j=0;j<n;j++){frame++;f.x=720;f.y=560;f.grounded=true;updateFighter(f,{...emptyInput(),x,...extra});}};
   for(const {id}of Roster.definitions)for(const face of [-1,1]){
    let f=reset(id);f.face=face;tick(f,face*.7);check(id+' normal tilt starts dash '+face,f.mode==='InitialDash'&&Math.abs(f.vx)===f.character.initialDashSpeed);
    tick(f,face*.7,f.character.initialDashFrames+3);check(id+' held tilt runs '+face,f.mode==='Run');
    tick(f,face*.7,1,{jab:true});check(id+' running attack '+face,f.attack?.type==='dashAttack',f.attack?.type);
    f=reset(id);f.face=face;for(const v of [.26,.4,.52,.59])tick(f,v*face,4);
    check(id+' light tilt walks '+face,f.mode==='Walk');tick(f,.7*face);
    check(id+' gradual tilt starts dash without flick '+face,f.mode==='InitialDash'&&!f.input.flickX&&!f.input.smashFlick);
    tick(f,.7*face,f.character.initialDashFrames+3);for(const v of [.56,.61,.57,.62])tick(f,v*face,3);
    check(id+' stick jitter keeps run '+face,f.mode==='Run');tick(f,.4*face,30);
    check(id+' ease back walks '+face,f.mode==='Walk'&&Math.abs(f.vx)<=f.character.walkSpeed*.4+.01);
    tick(f,0,30);check(id+' neutral stops '+face,f.mode==='Idle'&&Math.abs(f.vx)<.01);
    f=reset(id);f.face=face;tick(f,.7*face,f.character.initialDashFrames+3);tick(f,-.7*face,24);
    check(id+' reverse runs '+face,f.mode==='Run'&&f.face===-face&&Math.sign(f.vx)===-face,{mode:f.mode,face:f.face,vx:f.vx});
    f=reset(id);f.face=face;tick(f,.7071*face,1,{y:-.7071});check(id+' diagonal tilt dashes '+face,f.mode==='InitialDash');
   }
   const pad={index:0,connected:true,mapping:'standard',id:'DualSense test',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[pad]});Controls.poll();Controls.consume();
   let f=reset('lightning');for(const v of [0,.26,.4,.55,.7]){pad.axes[0]=v;Controls.poll();tick(f,0,1,Controls.read());Controls.consume();}
   check('DualSense gradual physical axis runs',f.mode==='InitialDash');
   pad.axes[0]=0;Controls.poll();const key=(code,down)=>dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));
   f=reset('nier');key('ShiftLeft',true);key('ArrowRight',true);tick(f,0,25,Controls.read());
   check('keyboard walk modifier stays walking',f.mode==='Walk');key('ShiftLeft',false);tick(f,0,1,Controls.read());
   check('release walk modifier starts dash',f.mode==='InitialDash');key('ArrowRight',false);Controls.consume();
   return{characters:Roster.definitions.length,checks:checks.length,failed:checks.filter(c=>!c.pass)};
  });
  fs.writeFileSync('.tools/stick-run-results.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,errors},null,2));if(result.failed.length||errors.length)process.exitCode=1;
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

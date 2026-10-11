const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});try{
 const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.GAME_URL||'http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded);await p.click('#enter-training');await p.click('#start');
 const result=await p.evaluate(()=>{
  state='pause';let checks=0;const failed=[];const check=(name,pass,detail)=>{checks++;if(!pass)failed.push({name,detail});};
  const reset=(id='dragoon',face=1,air=false)=>{const f=makeFighter(0,0,id);fighters=[f,makeFighter(1,2,'dragoon')];f.face=face;f.x=720;f.y=air?-200:560;f.grounded=!air;f.inv=f.intangible=f.hitlag=f.hitstun=0;f.vx=f.vy=0;return f;};
  const tick=(f,i={})=>{frame++;PlayerController.tick(f,{...emptyInput(),...i});};
  const until=(f,n,i={})=>{while(f.stateFrame<n)tick(f,i);};
  for(const {id}of Roster.definitions)for(const face of [-1,1]){
   for(const key of ['jab','heavy','smash','special']){
    const f=reset(id,face);tick(f,{guard:true,y:1});until(f,18,{guard:true});tick(f,{guard:true,[key]:true});until(f,20,{guard:true});check(id+'/'+face+'/'+key+' not before cancel frame',f.mode==='SpotDodge'&&!f.attack,f.mode);tick(f,{guard:true});check(id+'/'+face+'/'+key+' buffered spot dodge counter at frame 21',!!f.attack&&f.attack.type!=='grab'&&f.stateFrame===1,{mode:f.mode,type:f.attack?.type,frame:f.stateFrame});
   }
   let f=reset(id,face);tick(f,{guard:true,y:1});until(f,10,{guard:true});tick(f,{guard:true,jab:true});until(f,21,{guard:true});check(id+'/'+face+' expired attack does not counter',!f.attack&&f.mode==='SpotDodge');
   f=reset(id,face);tick(f,{guard:true,y:1});until(f,18,{guard:true});tick(f,{guard:true,grab:true});until(f,21,{guard:true});check(id+'/'+face+' grab does not cancel spot dodge early',!f.attack&&f.mode==='SpotDodge');
   for(const [dir,duration]of [[face,29],[-face,34]]){
    f=reset(id,face);tick(f,{guard:true,x:dir});until(f,duration-5,{guard:true});tick(f,{guard:true,jab:true});until(f,duration,{guard:true});check(id+'/'+face+'/'+dir+' roll retains normal total frames',!f.attack&&f.mode.endsWith('Roll'));tick(f,{guard:true});check(id+'/'+face+'/'+dir+' attack starts immediately after roll while guard held',f.attack?.type==='jab'&&f.stateFrame===1,{mode:f.mode,type:f.attack?.type,stateFrame:f.stateFrame});
   }
   for(const [x,y,name,total]of [[0,0,'NeutralAirDodge',36],[face,-1,'DirectionalAirDodge',45]]){
    f=reset(id,face,true);f.dodgeStale=5;tick(f,{guard:true,x,y});check(id+'/'+face+'/'+name+' no extra aerial stale recovery',f.stateDuration===total,f.stateDuration);until(f,total-4);tick(f,{jump:true,jumpHeld:true});until(f,total);check(id+'/'+face+'/'+name+' no premature aerial cancel',!f.airJumps||f.mode===name,f.mode);tick(f,{});check(id+'/'+face+'/'+name+' aerial jump on first actionable frame',f.mode==='Jump'&&f.airJumps===0,{mode:f.mode,jumps:f.airJumps});
   }
   for(const [air,x,y,elapsed,lag]of [[true,face,-1,5,11],[true,face,-1,24,19],[true,0,0,5,10]]){
    f=reset(id,face,air);tick(f,{guard:true,x,y});until(f,elapsed);f.y=560;f.grounded=true;PlayerController.land(f,emptyInput(),4);check(id+'/'+face+' aerial landing '+elapsed+','+x+','+y,f.lastLandingLag===lag&&f.stateDuration===lag,{lag:f.lastLandingLag,duration:f.stateDuration});
   }
   for(const [x,y,total]of [[0,1,31],[face,0,35],[-face,0,40]]){
    f=reset(id,face);f.dodgeStale=5;tick(f,{guard:true,x,y});check(id+'/'+face+' ground stale recovery capped',f.stateDuration===total,f.stateDuration);
   }
  }
  return{characters:Roster.definitions.length,checks,failed};
 });console.log(JSON.stringify({...result,errors},null,2));if(result.failed.length||errors.length)process.exitCode=1;
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

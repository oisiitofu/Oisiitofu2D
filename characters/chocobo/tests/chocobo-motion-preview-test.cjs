'use strict';

const assert=require('node:assert/strict');
const {chromium}=require('playwright');

const gameUrl=process.env.GAME_URL||'http://127.0.0.1:4251';

async function main(){
 const browser=await chromium.launch({channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(gameUrl);
  await page.waitForFunction(()=>AstralEdge.assetsLoaded);
  await page.click('#enter-training');
  const toggle=page.locator('#roster-motion-preview');
  const detailed=page.locator('#motion-preview-enabled');
  assert(await toggle.isVisible());
  assert.equal(await toggle.isChecked(),false);
  await toggle.check();
  await page.locator('.roster-toolbar .open-settings').click();
  assert(await detailed.isChecked());
  await detailed.uncheck();
  await page.click('#close-settings');
  assert.equal(await toggle.isChecked(),false);
  await toggle.check();
  await page.locator('.fighter-card[data-id="chocobo"]').click();
  await page.click('#start');
  await page.waitForFunction(()=>state==='battle'&&training&&!countdown);
  await page.evaluate(()=>{
   state='pause';
   window.chocoMotionFixture=(type,pose,params={})=>{
    const f=makeFighter(0,0,'chocobo');
    Object.assign(f,{x:180,y:150,grounded:true,face:1,inv:0,stateDuration:24},params);
    fighters[0]=f;
    if(type==='attack'){
     f.grounded=!['air','fair','bair','uair','dair','rise'].includes(pose);
     attack(f,pose);
    }else if(type==='state'){
     f.state=pose;
    }else{
     f.mode=pose;
     f.state=PlayerStates.visual[pose];
     if(pose.startsWith('Ledge'))f.ledge={x:210,y:150,face:1};
    }
    return f;
   };
  });
  await page.waitForFunction(()=>{
   const attackProbes={heavy:4,gale:4,forwardThrow:3,smash:2};
   const ready=Object.entries(attackProbes).map(([key,timer])=>{
    const f=chocoMotionFixture('attack',key);
    f.timer=timer;
    return MotionPreview.draw(f,1,null,1);
   });
   window.chocoReadiness=[...ready,...[
    ['state','walk',5],['state','down',3],['mode','LedgeCatch',3]
   ].map(([kind,key,stateFrame])=>MotionPreview.draw(chocoMotionFixture(kind,key,{stateFrame}),1,null,1)),
   MotionPreview.cinematic(chocoMotionFixture('state','idle'),ChocoboMotionPreview.limit(12,0),1,3)];
   return chocoReadiness.every(Boolean);
  },null,{timeout:10000}).catch(async error=>{
   const probes=await page.evaluate(()=>window.chocoReadiness);
   throw Error(error.message+' Ready '+JSON.stringify(probes)+' '+JSON.stringify(errors));
  });
  const result=await page.evaluate(async()=>{
   const failures=[];
   const check=(ok,name)=>{if(!ok)failures.push(name);};
   const mid=(f)=>MotionPreview.draw(f,1,null,1);
   let attacks=0,states=0;
   const stamp=f=>JSON.stringify([f.x,f.y,f.mode,f.state,f.stateFrame,f.timer,f.attack?.activeFrames,f.attack?.totalFrames,f.damage,f.faf]);
   for(const key of Object.keys(ChocoboMoves)){
    for(const face of [-1,1]){
     const f=chocoMotionFixture('attack',key,{face,color:face===1?0:3});
     const info=f.attack;
     check(Boolean(info),key+' is reachable');
     if(!info)continue;
     const mids=[];
     for(let frame=1;frame<=info.totalFrames;frame++){
      f.timer=frame;
      const before=stamp(f);
      const added=mid(f);
      if(added)mids.push(frame);
      check(stamp(f)===before,key+' drawing mutates the fighter');
     }
     check(mids.length>0,key+' has no middle');
     check(mids.every(t=>t>1&&t<info.totalFrames),key+' original endpoints');
    }
    attacks++;
   }
   const visuals={walk:5,run:5,crouch:3,jump:3,double:3,fall:4,guard:3,dodge:4,hit:2,fly:3,land:2,down:3,getup:5,caught:3,grab:3,throw:3};
   const modes={Turn:2,RunTurn:3,RunBrake:3,JumpSquat:2,ShieldDrop:2,Pummel:3,NeutralAirDodge:3,DirectionalAirDodge:3,FastFall:3,Helpless:3,LedgeCatch:3,LedgeHang:3,LedgeGetup:4,LedgeRoll:5,LedgeJump:3,LedgeDrop:3,LedgeTrump:3,HardLanding:3,AerialLanding:3,SpecialLanding:3};
   for(const [type,items] of [['state',visuals],['mode',modes]])for(const [key,tick] of Object.entries(items)){
    const f=chocoMotionFixture(type,key,{stateFrame:1});
    check(!mid(f),key+' first frame');
    f.stateFrame=tick;
    check(mid(f),key+' middle');
    f.stateFrame=f.stateDuration;
    check(!mid(f),key+' last frame');
    states++;
   }
   const f=chocoMotionFixture('state','idle',{stateFrame:5});
   check(!mid(f),'original idle');
   const cinematic=[[12,0],[34,34],[43,37],[54,9],[77,5],[89,11],[127,15],[148,17],[168,8]];
   // World/camera, attack simulation and every key shot stay with the original renderer.
   for(const [tick,pose] of cinematic)check(MotionPreview.cinematic(f,ChocoboMotionPreview.limit(tick,pose),1,3),'cinematic '+tick);
   for(const [tick,pose] of [[0,0],[28,34],[40,37],[47,9],[63,10],[74,5],[82,11],[101,15],[120,17],[139,8],[191,12],[225,0]])check(!ChocoboMotionPreview.limit(tick,pose),'cinematic key '+tick);
   await ChocoboLimitVFX.load();
   const originalCinematic=MotionPreview.cinematic;
   let rendered=0;
   MotionPreview.cinematic=(...args)=>{
    const drawn=originalCinematic(...args);
    if(drawn)rendered++;
    return drawn;
   };
   try{
    for(const face of [-1,1])for(const [time] of cinematic){
     ctx.reset();
     LimitBreak.draw({profile:LimitBreak.profile('chocobo'),attacker:f,target:fighters[1],face,time:time+(time<15?13:33)});
    }
   }finally{MotionPreview.cinematic=originalCinematic;}
   check(rendered===cinematic.length*2,'real cinematic renders every new pose both directions: '+rendered);
   training=false;
   const local=chocoMotionFixture('attack','smash');
   local.timer=2;
   check(!mid(local),'ordinary battle draws the usual sprite');
   return {failures,attacks,states,cinematic:cinematic.length};
  });
  assert.deepEqual(result.failures,[]);
  assert.deepEqual(errors,[]);

  const mobile=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true});
  await mobile.goto(gameUrl);
  await mobile.waitForFunction(()=>AstralEdge.assetsLoaded);
  await mobile.click('#touch-toggle');
  await mobile.click('#enter-training');
  await mobile.check('#roster-motion-preview');
  for(const viewport of [{width:844,height:390},{width:390,height:844}]){
   await mobile.setViewportSize(viewport);
   assert(await mobile.locator('#roster-motion-preview').isVisible());
   const fits=await mobile.locator('.roster-motion-preview').evaluate(label=>{
    const rect=label.getBoundingClientRect(),toolbar=label.parentElement.getBoundingClientRect();
    return rect.right<=Math.min(toolbar.right+1,innerWidth)&&rect.bottom<=toolbar.bottom+1;
   });
   assert(fits,'touch selector checkbox fits '+viewport.width);
  }
  console.log('Chocobo preview',result);
 }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});

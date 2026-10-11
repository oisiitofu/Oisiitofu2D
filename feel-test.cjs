const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#enter-roster');await page.click('#open-match-settings');await page.selectOption('#battle-mode','training');await page.click('#close-match-settings');await page.click('#start');
 const checks=await page.evaluate(()=>{
  const results=[],check=(name,pass,detail)=>results.push({name,pass:!!pass,...(!pass?{detail}:{})}),reset=()=>{resetTraining();return fighters;},tick=(f,i={},n=1)=>{for(let j=0;j<n;j++){frame++;updateFighter(f,{...emptyInput(),...i});}};
  let[f,o]=reset();tick(f,{x:1});tick(f,{},17);check('tap produces a full 18F step',f.mode==='InitialDash'&&f.x-500>120);tick(f);check('tap step brakes rather than running',f.mode==='RunBrake');
  [f,o]=reset();tick(f,{x:1},18);check('held direction remains step through F18',f.mode==='InitialDash');tick(f,{x:1});check('held direction runs on F19',f.mode==='Run');
  [f,o]=reset();tick(f,{x:1},5);tick(f,{x:-1});check('dash dance reverses step immediately',f.mode==='InitialDash'&&f.face===-1&&f.vx<0&&f.stateFrame===1);
  [f,o]=reset();tick(f,{x:.4},8);check('analog light input walks',f.mode==='Walk'&&f.vx<2);
  [f,o]=reset();f.grounded=false;f.y=0;tick(f,{x:1},12);check('air movement reaches useful speed within 12F',f.vx>=6.5);tick(f,{x:-1},10);check('air direction reverses within 10F',f.vx<0);let speed=f.vx;tick(f);check('neutral air input retains momentum',Math.abs(f.vx-speed)<.02);
  for(const name of ['jab','heavy','smash','downsmash','fair']){[f,o]=reset();attack(f,name);const a=f.attack;f.timer=a.totalFrames;let sample=CombatData.sample(a,f.timer);check(name+' return animation completes with action lock',sample.returnBlend===1&&a.motionEndFrames===a.totalFrames);tick(f,{x:1});check(name+' movement resumes immediately after return',!f.attack&&f.x>500);check(name+' has shorter recovery',a.recoveryFrames<a.referenceRecoveryFrames);}
  for(const [name,x,y,vy]of [['left side',255,620,0],['left below',303,720,-12],['right side',1180,620,0],['right below',1137,720,-12]]){[f,o]=reset();f.x=x;f.y=y;f.vy=vy;f.grounded=false;tick(f);check('generous ledge grab '+name,f.mode==='LedgeCatch');tick(f,{},4);const l=f.ledge,p=ledgeHangPosition(f,l);check('hand anchored '+name,Math.abs(f.x-p.x)<.001&&Math.abs(f.y-p.y)<.001&&f.y>l.y+80);}
  [f,o]=reset();f.x=720;f.y=740;f.vy=-19;f.grounded=false;tick(f,{},3);check('central underside remains solid',f.y>=722&&f.vy>=0&&!f.ledge);
  [f,o]=reset();f.x=303;f.y=720;f.vy=-12;f.grounded=false;tick(f);tick(f,{},19);tick(f,{jump:true});check('ledge jump starts outside wall',f.x<=303&&f.vy<0);tick(f,{x:1},5);check('ledge jump slides beside wall without entering slab',f.x<=306||f.y<=561);
  [f,o]=reset();f.x=650;o.x=676;let previous=fighters.map(f=>({x:f.x}));f.x=700;o.x=650;f.vx=50;o.vx=-26;resolveFighterBodies(previous);check('swept ground bodies cannot switch sides',o.x-f.x>=28&&f.vx===0&&o.vx===0);
  [f,o]=reset();f.x=650;o.x=676;f.grounded=false;let x=f.x;resolveFighterBodies(fighters.map(f=>({x:f.x})));check('airborne fighter can pass over opponent',f.x===x);
  [f,o]=reset();camera={x:720,y:395,z:1};f.x=-150;f.y=500;tick(f);check('old side blast boundary now survives with loupe',!f.respawn&&loupePosition(f));f.y=1100;tick(f);check('old bottom blast boundary now survives with loupe',!f.respawn&&loupePosition(f));
  for(const side of ['left','right','top','bottom']){[f,o]=reset();f.grounded=false;f.x=side==='left'?StageRules.blast.left-1:side==='right'?StageRules.blast.right+1:720;f.y=side==='top'?StageRules.blast.top-20:side==='bottom'?StageRules.blast.bottom+1:0;tick(f);check('KO only beyond outer '+side+' boundary',f.respawn>0);}
  return results;
 });
 await page.evaluate(()=>{resetTraining();state='pause';camera={x:720,y:480,z:1.09};for(let n=0;n<2;n++){let f=fighters[n],l=StageRules.ledges[n];f.grounded=false;PlayerController.catchLedge(f,l);Object.assign(f,ledgeHangPosition(f,l));PlayerStates.enter(f,'LedgeHang');}render();});await page.screenshot({path:'ledge-update-preview.png'});
 await page.evaluate(()=>{resetTraining();state='pause';camera={x:720,y:395,z:1};fighters[0].x=-570;fighters[0].y=500;fighters[0].grounded=false;fighters[1].x=1840;fighters[1].y=700;fighters[1].grounded=false;render();});await page.screenshot({path:'loupe-preview.png'});
 console.log(JSON.stringify({total:checks.length,failed:checks.filter(c=>!c.pass),errors},null,2));await browser.close();if(errors.length||checks.some(c=>!c.pass))process.exit(1);
})();

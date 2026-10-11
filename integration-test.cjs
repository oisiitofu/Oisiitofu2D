const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);await page.click('#enter-roster');await page.click('#open-match-settings');await page.selectOption('#battle-mode','training');await page.click('#close-match-settings');await page.click('#start');
 const checks=await page.evaluate(()=>{
  const out=[],check=(name,pass,detail)=>out.push({name,pass:!!pass,...(!pass?{detail}:{})}),reset=()=>{resetTraining();return fighters;},tick=(f,i={},n=1)=>{for(let j=0;j<n;j++){frame++;updateFighter(f,{...emptyInput(),...i});}},thaw=f=>{while(f.hitlag>0)CombatSystem.hitlag(f,emptyInput());};
  let[f,o]=reset();tick(f,{guard:true},4);tick(f,{guard:true,jab:true});check('shield attack commits to 11F drop',f.mode==='ShieldDrop');tick(f,{},10);check('cannot attack before shield drop ends',!f.attack);tick(f,{});check('attack fires after shield drop',f.attack?.type==='jab');
  [f,o]=reset();tick(f,{x:1},15);tick(f,{x:1,heavy:true});check('directional Z during run is dash attack',f.attack?.type==='dashAttack');
  [f,o]=reset();tick(f,{x:1},15);tick(f,{x:1,heavy:true,forceTilt:true});check('dedicated tilt stays tilt during run',f.attack?.type==='heavy');
  [f,o]=reset();tick(f,{x:1,rx:1,rightStickMode:'tilt'});check('right stick tilt overrides flick smash',f.attack?.type==='heavy');
  [f,o]=reset();tick(f,{rx:1,rightStickMode:'smash'});check('right stick smash',f.attack?.type==='smash');
  [f,o]=reset();f.x=290;f.y=610;f.grounded=false;f.vx=25;f.vy=0;f.tumbling=true;f.hitstun=20;PlayerStates.enter(f,'Tumble');tick(f,{guard:true});check('wall tech',f.mode==='WallTech'&&f.vx<0);
  [f,o]=reset();f.x=720;f.y=730;f.grounded=false;f.vy=-25;f.tumbling=true;f.hitstun=20;PlayerStates.enter(f,'Tumble');tick(f,{guard:true});check('ceiling tech',f.mode==='CeilingTech'&&f.vy===0);
  [f,o]=reset();f.x=650;o.x=740;attack(f,'heavy');attack(o,'heavy');f.timer=o.timer=8;resolveCombat();check('equal grounded attacks clank',!f.attack&&!o.attack&&f.damage===0&&o.damage===0);
  [f,o]=reset();f.x=650;o.x=720;attack(f,'grab');attack(o,'grab');f.timer=o.timer=7;resolveCombat();check('simultaneous grabs clash',f.mode==='Clank'&&o.mode==='Clank'&&!f.grabbed&&!o.grabbed);
  [f,o]=reset();CombatSystem.hit(f,o,{...attacks.grab,type:'grab'});tick(f,{},5);tick(f,{x:.7});thaw(f);thaw(o);check('throw keeps recovery after hitlag',f.mode==='Throw'&&f.stateDuration===attacks.forwardThrow.totalFrames);check('analog forward throw has positive launch',o.vx>0&&f.face===1);
  [f,o]=reset();attack(f,'heavy');f.timer=8;let timer=f.timer,stateFrame=f.stateFrame;CombatSystem.hit(f,o,f.attack);tick(f,{},3);check('individual hitlag freezes attack clock',f.timer===timer&&f.stateFrame===stateFrame);thaw(f);tick(f);check('attack resumes after hitlag',f.timer===timer+1);
  [f,o]=reset();CombatSystem.hit(f,o,{...attacks.heavy,type:'heavy'});while(o.hitlag>1)CombatSystem.hitlag(o,emptyInput());CombatSystem.hitlag(o,{...emptyInput(),x:1,y:1});check('DI capped at 18 degrees',Math.abs(o.lastLaunchAngle-attacks.heavy.angle)<=Math.PI*.1+1e-9);
  [f,o]=reset();CombatSystem.hit(f,o,{...attacks.heavy,type:'heavy'});let speed=o.pendingLaunch.speed;while(o.hitlag>1)CombatSystem.hitlag(o,emptyInput());CombatSystem.hitlag(o,{...emptyInput(),y:1});check('down LSI factor',Math.abs(o.lastLaunchSpeed/speed-.92)<1e-9);
  [f,o]=reset();CombatSystem.hit(f,o,{...attacks.up,type:'up'});speed=o.pendingLaunch.speed;while(o.hitlag>1)CombatSystem.hitlag(o,emptyInput());CombatSystem.hitlag(o,{...emptyInput(),y:-1});check('vertical launches exclude LSI',o.lastLaunchSpeed===speed);
  [f,o]=reset();PlayerStates.enter(o,'ShieldHold');o.shield=1;let box={x1:o.x,y1:o.y-75,x2:o.x,y2:o.y-75,radius:1};check('small shield can be poked',!CombatSystem.shieldCovers(o,box)&&CombatSystem.contact(box,o));
  [f,o]=reset();StageRules.oneOnOne=false;CombatSystem.hit(f,o,{...attacks.jab,type:'jab'});let damage=o.damage;[f,o]=reset();StageRules.oneOnOne=true;CombatSystem.hit(f,o,{...attacks.jab,type:'jab'});check('optional 1v1 damage 1.2',Math.abs(o.damage/damage-1.2)<1e-9);StageRules.oneOnOne=false;
  [f,o]=reset();for(let n=0;n<12;n++){attack(f,n%2?'jab':'heavy');o.hitlag=0;o.frozen=null;CombatSystem.hit(f,o,f.attack);f.hitlag=0;f.frozen=null;}check('stale queue stores last nine hits',f.staleQueue.length===9);
  for(let [name,command]of Object.entries({LedgeGetup:{x:1},LedgeRoll:{guard:true},LedgeAttack:{jab:true},LedgeJump:{jump:true},LedgeDrop:{y:1}})){[f,o]=reset();f.x=306;f.y=600;f.grounded=false;PlayerController.catchLedge(f,StageRules.ledges[0]);tick(f,{},19);tick(f,command);check(name+' option',f.mode===name);}
  [f,o]=reset();attack(f,'heavy');tick(f,{jab:true,attackHeld:true});tick(f,{attackHeld:true},40);check('held button does not repeat an attack',f.input.buttons.attack.hold>30&&f.attack===null);
  [f,o]=reset();state='pause';let before=frame;update();check('paused clock does not advance',frame===before);frameAdvance();check('frame advance exactly one tick',frame===before+1&&state==='pause');
  [f,o]=reset();f.frozen={mode:'Grabbed'};f.hitlag=0;f.respawn=1;tick(f);check('respawn clears stale freeze state',!f.frozen&&f.mode==='Respawn');
  return out;
 });
 await page.click('#debug-pause');await page.selectOption('#slow-motion','0.25');let before=await page.evaluate(()=>frame);await page.waitForTimeout(400);let delta=await page.evaluate(()=>frame)-before;checks.push({name:'quarter speed advances about 6 ticks in 400ms',pass:delta>=3&&delta<=10,delta});
 console.log(JSON.stringify({total:checks.length,failed:checks.filter(c=>!c.pass),errors},null,2));await browser.close();if(errors.length||checks.some(c=>!c.pass))process.exit(1);
})();

const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded,{},{timeout:60000});const results=await page.evaluate(()=>{
 const G=AstralEdge,results=[],check=(name,pass)=>results.push({name,pass}),key=(code,down=true)=>dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code})),step=(n=1)=>{for(let j=0;j<n;j++)G.step();};
 const reset=()=>{G.start();G.setCountdown(0);let[a,b]=G.fighters;a.x=550;b.x=900;a.y=b.y=560;a.inv=b.inv=0;b.hitstun=1000;return[a,b];};
 let[a,b]=reset();key('Space');step(4);key('Space',false);check('first jump',a.jumps===1&&a.vy<0);step(5);key('Space');step();key('Space',false);check('double jump',a.jumps===2&&a.vy<0);step(4);key('Space');step();key('Space',false);check('no third jump',a.jumps===2);step(90);check('landing resets jumps',a.grounded&&a.jumps===0);
 [a,b]=reset();b.x=600;key('KeyZ');step(4);check('no hit during jab startup',b.damage===0&&a.timer===4);step();key('KeyZ',false);check('keyboard jab hits at 5F',b.damage>0&&a.timer===5);

 [a,b]=reset();b.x=600;key('KeyC');step(12);key('KeyC',false);check('grab catches',a.grabbed===b&&b.state==='caught');key('ArrowUp');step(12);key('ArrowUp',false);check('throw launches',b.damage>0&&b.vy<0&&a.grabbed===null);if(a.grabbed)results.push({name:'throw diagnostics '+JSON.stringify({timer:a.timer,state:a.state,damage:b.damage,vy:b.vy}),pass:false});
 [a,b]=reset();key('KeyS');step(35);check('charge hold',a.attack?.hold&&a.attack.charge>.4);key('KeyS',false);step();check('charge release',a.attack?.type==='smash'&&a.attack.charge>.4);
 [a,b]=reset();key('KeyA');step();check('guard',a.state==='guard');key('ArrowRight');step(4);check('dodge invulnerability',a.state==='dodge'&&a.intangible>0);key('KeyA',false);key('ArrowRight',false);
 [a,b]=reset();a.x=306;a.y=572;a.grounded=false;a.vy=3;step();check('ledge grab',a.state==='ledge');step(19);key('Space');step();key('Space',false);check('ledge jump',a.state==='jump'&&a.vy<0);
 [a,b]=reset();a.x=200;a.y=670;a.grounded=false;key('ArrowUp');key('KeyX');step(7);key('ArrowUp',false);key('KeyX',false);check('up special recovery',a.recovered&&a.vy<-10);
 [a,b]=reset();a.y=StageRules.blast.bottom+20;step();check('blast zone stock loss',a.stocks===2&&a.respawn>0);step(120);check('respawn',a.damage===0&&a.inv>0&&!a.respawn);
 G.pause();let before=a.x;step(10);check('pause stops simulation',a.x===before&&G.state==='pause');G.pause();check('resume',G.state==='battle');
 return results;});console.log(JSON.stringify(results,null,2));console.log('Runtime errors',errors);await browser.close();if(results.some(x=>!x.pass)||errors.length)process.exit(1);})();

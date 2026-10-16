'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.GAME_URL||'http://localhost:4173');await page.waitForFunction(()=>AstralEdge.assetsLoaded);
  const result=await page.evaluate(()=>{
   state='pause';training=true;setupStage('0');GameAudio.setMuted(true);
   const checks=[],check=(name,pass)=>checks.push({name,pass:!!pass});
   const reset=(type,face=1,cp=0)=>{fighters=[makeFighter(0,0,'shizuna'),makeFighter(1,0,'vivi')];ShizunaRules.reset();hitstop=0;for(const f of fighters)Object.assign(f,{x:f.id?1800:720,y:560,face,inv:0,intangible:0,respawn:0,hitlag:0,hitstun:0,damage:0,vx:0,vy:0,grounded:true,stocks:99});const f=fighters[0];f.shizunaCP=cp;attack(f,type);f.timer=f.attack.activeStart;return fighters;};
   const timing={jab:[4,5,15],jab2:[5,6,17],jab3:[8,9,21],heavy:[11,10,22],up:[10,8,20],low:[8,7,19],dashAttack:[10,10,34],smash:[23,23,43],upsmash:[20,20,41],downsmash:[19,22,49],air:[10,8,24],fair:[12,10,23],bair:[13,9,23],uair:[10,8,22],dair:[15,14,29],dragon:[7,9,24],dash:[4,10,39],rise:[5,8,38],gale:[10,17,33]};
   for(const[type,expected]of Object.entries(timing)){
    const[f]=reset(type);check('unchanged damage/start/total '+type,JSON.stringify([f.attack.damage,f.attack.startupFrames,f.attack.totalFrames])===JSON.stringify(expected));
   }
   for(const face of[-1,1])for(const type of Object.keys(timing)){
    let[f,o]=reset(type,face),boxes=attackBoxes(f),outer=boxes.filter(b=>!b.meleeInner);
    // A small airborne hurtbox placed on the blade's far end must be hit.
    let b=outer[0];o.x=b.x2;o.y=b.y2+o.character.ecb.height*.5;o.grounded=false;
    resolveCombat();check('small target at blade tip '+type+' '+face,o.damage>0);
    [f,o]=reset(type,face);boxes=attackBoxes(f);o.x=f.x+face*8;o.y=f.y;
    if(['uair','up','upsmash'].includes(type)){o.y=f.y-80;o.grounded=false;}
    resolveCombat();check('no close gap '+type+' '+face,o.damage>0);
    [f,o]=reset(type,face);boxes=attackBoxes(f);o.x=f.x+face*600;check('no remote hit '+type+' '+face,!boxes.some(b=>CombatSystem.contact(b,o)));
    for(const b of outer){const g=ShizunaVFX.geometry(b),r=b.radius;check('effect matches blade extent '+type+' '+face,Math.abs(g.w-Math.hypot(b.x2-b.x1,b.y2-b.y1)-r*2)<.001&&g.h===r*2+10);const dx=Math.cos(g.rot)*g.face,dy=Math.sin(g.rot);check('effect direction '+type+' '+face,dx*(b.x2-b.x1)+dy*(b.y2-b.y1)>0);}
   }
   for(const face of[-1,1]){
    for(const type of ['jab','heavy','low','dashAttack','smash','fair','bair','dragon','dash','gale']){
     const[f,o]=reset(type,face),b=attackBoxes(f).find(b=>!b.meleeInner),dir=type==='bair'?-face:face;
     const min={jab:114,heavy:141,low:119,dashAttack:139,smash:159,fair:144,bair:134,dragon:144,dash:144,gale:159}[type];
     check('new outer reach '+type+' '+face,dir*(b.x2-f.x)+b.radius>=min);
     o.x=f.x+dir*(min-7);o.y=b.y2+o.character.ecb.height*.5;o.grounded=false;resolveCombat();check('new reach hits small target '+type+' '+face,o.damage>0);
     const pair=reset(type,face),a=pair[0],target=pair[1];target.x=a.x+dir*(min+70);target.y=b.y2+target.character.ecb.height*.5;target.grounded=false;check('beyond enlarged blade misses '+type+' '+face,!attackBoxes(a).some(box=>CombatSystem.contact(box,target)));
    }
    for(const type of ['up','upsmash','uair']){
     const[f,o]=reset(type,face);o.x=f.x+face*65;o.y=f.y-100;o.grounded=false;resolveCombat();check('upper forward arc '+type+' '+face,o.damage>0);
    }
    let[f,o]=reset('up',face);o.x=f.x+face*25;o.y=f.y-100;o.grounded=false;resolveCombat();const first=o.damage;resolveCombat();check('overlapping arcs hit only once '+face,first>0&&o.damage===first);
    [f,o]=reset('heavy',face);o.x=f.x+face*120;PlayerStates.enter(o,'ShieldHold');const shield=o.shield;resolveCombat();check('extended blade shielded '+face,o.damage===0&&o.shield<shield);
    for(const cp of[0,100]){
     [f,o]=reset('gale',face,cp);const b=attackBoxes(f)[0];check('CP reach bounded '+cp+' '+face,Math.abs((b.x2-f.x)*face+b.radius-(160+cp*.8))<.001);
     const expectedDamage=f.attack.damage*f.attack.staleMultiplier*(StageRules.oneOnOne?1.2:1);ShizunaRules.action(f,{...emptyInput()});const q=ShizunaRules.objects.find(q=>q.kind==='moon');check('finisher effect uses exact hit segment '+cp+' '+face,!!q&&JSON.stringify(q.strike)===JSON.stringify({x1:b.x1,y1:b.y1,x2:b.x2,y2:b.y2,radius:b.radius}));
     o.x=f.x+face*135;resolveCombat();check('CP damage unchanged '+cp+' '+face,Math.abs(o.damage-expectedDamage)<.001);
    }
    [f,o]=reset('dragon',face);ShizunaRules.action(f,{...emptyInput()});const q=ShizunaRules.objects.find(q=>q.kind==='shadow');
    f.x+=face*300;q.age=13;o.x=q.x+face*135;o.y=q.y;ShizunaRules.tick();const firstShadow=o.damage;ShizunaRules.tick();check('fixed shadow extended and single hit '+face,firstShadow>0&&o.damage===firstShadow);
    [f,o]=reset('dragon',face);ShizunaRules.action(f,{...emptyInput()});const guarded=ShizunaRules.objects.find(q=>q.kind==='shadow');f.x+=face*300;guarded.age=13;o.x=guarded.x+face*130;PlayerStates.enter(o,'ShieldHold');const hp=o.shield;ShizunaRules.tick();check('shadow remains guardable '+face,o.damage===0&&o.shield<hp);
    for(const type of ['downsmash','dash'])for(const at of ShizunaMoves[type].activeFrames.map(w=>w.start)){
     [f,o]=reset(type,face);f.timer=at;const boxes=attackVisualBoxes(f),b=boxes[0];o.x=b.x2;o.y=b.y2+o.character.ecb.height*.5;o.grounded=false;resolveCombat();check('later window hits '+type+' '+at+' '+face,o.damage>0);check('later window finite '+type+' '+at+' '+face,boxes.every(b=>[b.x1,b.y1,b.x2,b.y2,b.radius].every(Number.isFinite)));
     if(type==='downsmash'&&at===30)check('rear smash direction '+face,(b.x2-f.x)*face<0);
    }
   }
   return{checks,failed:checks.filter(c=>!c.pass)};
  });
  fs.mkdirSync('characters/shizuna/previews',{recursive:true});fs.writeFileSync('characters/shizuna/previews/reach-tests.json',JSON.stringify({...result,errors},null,2));
  console.log(JSON.stringify({checks:result.checks.length,failed:result.failed,errors}));assert.deepEqual(result.failed,[]);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});


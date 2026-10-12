for(const face of[-1,1]){
 for(let blade=0;blade<3;blade++){
  [f,o]=reset();f.face=face;f.kisukeBlade=blade;attack(f,'dragon');tick(12,{},false);
  check('spirit cost once '+blade+' '+face,f.kisukeSpirit[blade]===100-[22,28,34][blade]);
  check('blade special '+blade+' '+face,blade===0?f.attack.activeFrames.length===3:blade===1?Rules.objects.some(q=>q.kind==='night'):Rules.objects.some(q=>q.kind==='flame'));
  tick(30,{},false);check('neutral ends without idle lock '+blade+' '+face,!f.attack);
 }
 [f,o]=reset();f.face=face;f.kisukeSpirit=[0,10,20];attack(f,'dragon');check('empty blade uses weak slash',f.attack.weak&&f.attack.damage===4);tick(25,{},false);check('empty blade has finite end',!f.attack&&f.kisukeSpirit[0]===0);
 [f,o]=reset();f.face=face;for(let n=1;n<=3;n++){attack(f,'gale');tick(8,{},false);check('switch order '+n+' '+face,f.kisukeBlade===n%3);check('switch cooldown '+n+' '+face,!attack(f,'gale'));tick(25,{},false);check('switch ends '+n+' '+face,!f.attack);}
 [f,o]=reset();f.face=face;f.x=750;o.x=750+face*165;attack(f,'dash');tick(16,{},false);const x=f.x;tick(1,{special:true},false);check('fresh follow input accepted '+face,f.attack?.phase==='cross'||f.attack?.phase==='finish');tick(12,{},false);check('follow crosses enemy '+face,(f.x-o.x)*face>0&&f.face===-face,{x:f.x,enemy:o.x,phase:f.attack?.phase});tick(25,{},false);check('side no standing freeze '+face,!f.attack);
 [f,o]=reset();f.x=750;f.face=face;attack(f,'dash');tick(35,{},false);check('side miss stops without forced return '+face,!f.attack&&(f.x-750)*face>0);
 [f,o]=reset();f.y=280;f.grounded=false;f.face=face;attack(f,'rise');tick(8,{x:face},false);check('first rising slash '+face,f.attack?.step===1&&f.vy<0);tick(8,{x:-face},false);tick(1,{x:-face,special:true},false);check('second rising input redirects '+face,f.attack?.step===2&&Math.sign(f.vx)===-face);tick(8,{x:face},false);tick(1,{x:face,special:true},false);check('third rising input redirects '+face,f.attack?.step===3&&Math.sign(f.vx)===face);tick(28,{},false);check('rising recovery finite '+face,!f.attack&&f.helpless);
 [f,o]=reset();f.y=280;f.grounded=false;attack(f,'rise');tick(24,{specialHeld:true},false);check('holding alone never chains rise '+face,!f.attack||f.attack.step===1);
}
[f,o]=reset();f.kisukeSpirit=[20,20,20];tick(60,{},false);check('only stowed blades recharge',f.kisukeSpirit[0]===20&&f.kisukeSpirit[1]>27&&f.kisukeSpirit[2]>27);
for(const x of[170,1270,500,940]){
 [f,o]=reset();f.x=x;f.y=720;f.grounded=false;f.ledgeCooldown=0;attack(f,'rise');
 for(let n=0;n<120;n++){const a=f.attack,main=platforms.find(p=>p.main);tick(1,{x:a?.escapeSide||Math.sign(main.x+main.w/2-f.x),y:-1,special:!!a?.step&&a.step<3&&f.timer-a.stepAt===9},false);if(f.ledge||f.grounded)break;}
 check('actual stage recovery '+x,!!f.ledge||f.grounded,{x:f.x,y:f.y,mode:f.mode,step:f.attack?.step});
}
[f,o]=reset();f.y=300;f.grounded=false;attack(f,'rise');tick(8,{},false);let input=Rules.cpu(f,o,emptyInput());check('CPU steers recovery',input.y===-1&&Math.abs(input.x)>0);f.timer=f.attack.stepAt+9;input=Rules.cpu(f,o,emptyInput());check('CPU presses next rising slash',input.special);
[f,o]=reset();f.kisukeBlade=2;f.kisukeSpirit=[5,5,5];f.respawn=8;Rules.tick();check('stock resets blades and spirit',f.kisukeBlade===0&&f.kisukeSpirit.every(v=>v===100));

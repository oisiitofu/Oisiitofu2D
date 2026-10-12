for(const face of[-1,1]){
 [f,o]=reset();f.face=face;attack(f,'dragon');tick(11,{},false);check('unique neutral projectile '+face,Rules.objects.some(q=>q.kind===(id==='hanajs'?'storm':id==='hanajk'?'missile':'laser')));tick(18,{},false);check('neutral motion releases '+face,!f.attack);
 [f,o]=reset();f.face=face;f.damage=67;f.airJumps=1;f.recovered=true;f.newSideUsed=true;f.newDownUsed=true;f.grounded=false;f.y=200;attack(f,'airDrop');tick(13,{},false);check('down switches next form '+face,f.characterId===HanaKit.forms[(HanaKit.forms.indexOf(id)+1)%3]);check('switch preserves damage recovery and jumps '+face,f.damage===67&&f.airJumps===1&&f.recovered&&f.newSideUsed);tick(20,{},false);check('air down reusable without landing '+face,NewcomerCore.gate(f,'airDrop'));
 [f,o]=reset();f.face=face;f.grounded=false;f.y=300;attack(f,'rise');tick(17,{x:face},false);check('unique recovery actually rises '+face,f.y<300&&f.recovered);tick(65,{},false);check('up ends finite helpless '+face,!f.attack&&(f.helpless||f.grounded||f.ledge),{mode:f.mode,y:f.y,helpless:f.helpless});
 [f,o]=reset();f.face=face;f.y=300;f.grounded=false;attack(f,'dash');tick(8,{},false);
 if(id!=='hanajs'){tick(9,{},false);tick(1,{special:true},false);check('fresh side followup '+face,f.attack?.step===2);tick(9,{},false);tick(1,{special:true},false);check('three phase combo '+face,f.attack?.step===3);}else{tick(10,{},false);check('JS drill dive '+face,f.attack?.phase==='dive'&&f.vy>0);tick(17,{},false);check('JS rises after drill '+face,f.attack?.phase==='rise'&&f.vy<0);}
 tick(70,{},false);check('side finite no default pose freeze '+face,!f.attack);
}
[f,o]=reset();for(let n=0;n<3;n++){attack(f,'gale');tick(35,{},false);}check('full form cycle returns to starting form',f.characterId===id);

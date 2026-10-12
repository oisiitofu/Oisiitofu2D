const fs=require('fs'),{chromium}=require('playwright');
module.exports=async(id)=>{const cap=id[0].toUpperCase()+id.slice(1),b=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']}),errors=[];try{const pages=await Promise.all([b.newContext(),b.newContext()].map(async c=>(await c).newPage()));for(const p of pages){p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:4173');await p.waitForFunction(()=>AstralEdge.assetsLoaded,null,{timeout:180000});await p.click('#enter-online');await p.click('[data-id="'+id+'"]');}await pages[0].click('#open-room');await pages[0].click('#create-room');await pages[0].waitForFunction(()=>Net.code.length===6);const code=await pages[0].evaluate(()=>Net.code);await pages[1].click('#open-room');await pages[1].fill('#room-code',code);await pages[1].click('#join-room');await pages[1].waitForFunction(()=>Net.code.length===6);await pages[0].click('#ready-room');await pages[1].click('#ready-room');await Promise.all(pages.map(p=>p.waitForFunction(()=>Net.active&&countdown<=0)));const target=Math.max(...await Promise.all(pages.map(p=>p.evaluate(()=>frame))))+90;
for(let slot=0;slot<2;slot++)await pages[slot].evaluate(({id,cap,target,slot})=>{const rules=eval(cap+'Rules');window.nativeSnapshots={};addEventListener('online-frame',e=>{const n=e.detail-target,key=(code,down)=>{if(slot===0)dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));},place=(x=500,y=560)=>{for(const c of['KeyX','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'])key(c,false);fighters=[makeFighter(0,0,id),makeFighter(1,2,id)];for(const v of fighters){v.vx=v.vy=v.inv=v.intangible=v.respawn=v.hitlag=v.hitstun=0;v.stocks=99;v.ledgeCooldown=0;v.face=v.id?-1:1;}Object.assign(fighters[0],{x,y,grounded:y===560});Object.assign(fighters[1],{x:1800,y:560,grounded:true,gravityOff:true});rules.reset?.();hitstop=0;};
if(n===0){place();attack(fighters[0],'dragon');key('KeyX',true);}if(n===70)key('KeyX',false);
if(n===100){place();if(id==='mametchi')fighters[0].damage=20;attack(fighters[0],'dash');}if(id==='yuffie'){if(n===122||n===140)key('KeyX',true);if(n===123||n===141)key('KeyX',false);}if(id==='ryofu'){if(n===122)key('KeyX',true);if(n===123)key('KeyX',false);}if(id==='vincent'){if(n===115)key('ArrowLeft',true);if(n===120)key('KeyZ',true);if(n===121)key('KeyZ',false);}
if(n===200){place(170,690);attack(fighters[0],'rise');key('ArrowRight',true);key('ArrowUp',true);}if(n>200&&n<325){const a=fighters[0].attack;if(a?.escapeSide){key('ArrowRight',false);key('ArrowLeft',true);}else{key('ArrowLeft',false);key('ArrowRight',true);}if(id==='yuffie'&&a?.phase==='flight'&&!a.followed&&fighters[0].timer===a.followStart)key('KeyX',true);else key('KeyX',id==='ryofu'&&n===232||id==='mametchi'&&n===264);}
if(id==='mametchi'&&n===240){place(700,300);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');}if(id==='mametchi'&&n===270){const f=fighters[0],p=platforms.find(p=>p.main);f.attack=null;f.recovered=false;f.ledge=null;f.ledgeCooldown=100;f.x=p.x-f.character.ecb.radius-1;f.y=p.y+70;f.grounded=false;attack(f,'rise');f.timer=12;f.attack.phase='hop';f.attack.launchFrame=10;f.vx=5;f.vy=0;}if(id==='mametchi'&&[450,455,460,465].includes(n)){const t=(n-445)/5;rules.spawn(fighters[0],{kind:'care',itemType:t,x:650+t*50,y:520,vx:t===3?3:0,vy:t===2?-5:0,life:50,radius:12,pulseAt:1});}if(n===350){place();attack(fighters[0],'gale');key('KeyX',true);}if(n===410)key('KeyX',false);if(n===440){fighters[0].attack=null;attack(fighters[0],'gale');}if(id==='ryofu'&&n===450){const f=fighters[0],o=fighters[1];attack(o,'jab');o.timer=o.attack.activeStart;o.attack.canClank=false;o.face=-1;o.x=f.x+40;const q=attackBoxes(o)[0];f.x=q.x2;f.y=q.y2+48;resolveCombat();}if(n===475)fighters[0].respawn=10;

if(id==='doshin'){
 if(n===0)key('ArrowUp',true);
 if(n===100)key('KeyX',false);
 if(n===150){const f=fighters[0];f.attack=null;f.x=500;f.y=560;f.grounded=true;attack(f,'dash');}
 if(n===280){place(700,200);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');}
 if(n===303){key('ArrowUp',false);key('ArrowDown',true);key('KeyX',true);}if(n===305)key('KeyX',false);
 if(n===331){const p=platforms.find(p=>p.main);place(p.x-30,p.y+65);const f=fighters[0];f.ledgeCooldown=100;attack(f,'rise');f.timer=10;rules.action(f,{...emptyInput(),x:1});f.vx=8;f.vy=0;PlayerController.physics(f,emptyInput());}
 if(n===350){fighters[1].x=535;key('KeyX',false);}
 if(n===400){place(700,200);fighters[1].x=735;fighters[1].y=200;fighters[1].grounded=false;attack(fighters[0],'airDrop');}
 if(n===440){place();attack(fighters[0],'dash');}
}
if(id==='moogle'){
 if(n===100)key('KeyX',false);
 if(n===145){const f=fighters[0];f.attack=null;f.x=500;f.y=560;f.grounded=true;attack(f,'dash');}
 if(n===180){place();fighters[0].moogleMP=80;fighters[1].x=620;attack(fighters[0],'dash');key('KeyX',true);}
 if(n>=200&&n<245)key('KeyX',true);if(n===245)key('KeyX',false);
 if(n===280){place(700,200);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');key('KeyX',true);}
 if(n===292){const q=rules.objects.find(q=>q.kind==='aero');fighters[1].x=q.x;fighters[1].y=q.base-20;fighters[1].grounded=false;fighters[1].gravityOff=false;fighters[1].vy=3;}
 if(n>=293&&n<305)key('KeyX',true);if(n===305){key('ArrowRight',false);key('ArrowLeft',true);key('KeyX',false);}
 if(n===350){fighters[0].damage=30;fighters[0].moogleMP=60;key('KeyX',false);}
 if(n===400){place(700,200);fighters[0].damage=30;fighters[0].moogleMP=60;attack(fighters[0],'airDrop');}
 if(n===440){place();fighters[0].moogleMP=60;attack(fighters[0],'gale');}
}
if(id==='aerith'){
 if(n===100)key('KeyX',false);
 if(n===223)key('KeyX',true);if(n===225)key('KeyX',false);
 if(n===280){place(700,200);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');key('ArrowRight',true);key('ArrowUp',true);}
 if(n===305){key('ArrowRight',false);key('ArrowLeft',true);key('KeyX',true);}if(n===307)key('KeyX',false);
 if(n===350){fighters[0].aerithATB=100;fighters[1].x=650;key('KeyX',false);key('ArrowRight',false);key('ArrowUp',false);}
 if(n===400){place();fighters[0].aerithATB=100;fighters[0].damage=30;attack(fighters[0],'gale');key('ArrowRight',true);}
 if(n===440){place(700,200);fighters[0].aerithATB=100;attack(fighters[0],'airDrop');key('ArrowUp',true);}
}
if(id==='saki'){
 if(n===100)key('KeyX',false);
 if(n===150){place();fighters[1].x=660;attack(fighters[0],'dash');}
 if(n===166)key('KeyX',true);if(n===168)key('KeyX',false);
 if(n===280){place(700,300);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');key('ArrowRight',true);key('ArrowUp',true);}
 if(n>=295&&n<325){key('ArrowLeft',true);key('ArrowRight',false);}
 if(n===350){fighters[1].x=535;key('KeyX',false);}
 if(n===380){place();attack(fighters[0],'dragon');}
 if(n===440){place();fighters[1].x=535;attack(fighters[0],'gale');rules.spawn(fighters[1],{kind:'cannon',x:600,y:515,vx:-10,vy:0,damage:4,life:42});}
}
if(id==='shadow'){
 if(n===100)key('KeyX',false);
 if(n===116)key('KeyX',true);if(n===118)key('KeyX',false);
 if(n===150){place();fighters[1].x=655;attack(fighters[0],'dash');}
 if(n===180){place();attack(fighters[0],'dash');}if(n===195)key('KeyA',true);if(n===198)key('KeyA',false);
 if(n===280){place(700,350);fighters[1].x=750;fighters[1].y=350;fighters[1].grounded=false;fighters[1].gravityOff=false;attack(fighters[0],'rise');key('ArrowRight',true);key('ArrowUp',true);}
 if(n>=295&&n<325){key('ArrowLeft',true);key('ArrowRight',false);}
 if(n===331){const p=platforms.find(p=>p.main);place(p.x-45,p.y+50);fighters[0].grounded=false;fighters[0].ledgeCooldown=100;attack(fighters[0],'dash');}
 if(n===350){fighters[1].x=555;key('KeyX',false);}
 if(n===400){place(700,200);fighters[1].x=750;fighters[1].y=200;fighters[1].grounded=false;attack(fighters[0],'airDrop');}
 if(n===440){place();fighters[1].x=555;attack(fighters[0],'gale');}
 if(n===470)rules.spawn(fighters[0],{kind:'spear',x:400,y:510,vx:14,vy:0,damage:7,life:40});
}
if(id==='kasane'){
 if(n===100){fighters[1].x=700;key('KeyX',false);}
 if(n===114){key('ArrowLeft',true);key('KeyX',true);}if(n===115)key('KeyX',false);
 if(n===150){place();attack(fighters[0],'dash');}
 if(n===310){place(700,200);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');key('ArrowRight',true);key('ArrowUp',true);}
 if(n===328){key('ArrowLeft',true);key('ArrowRight',false);key('KeyX',true);}if(n===330)key('KeyX',false);
 if(n===350){fighters[1].x=540;key('KeyX',false);}
 if(n===380){key('KeyX',false);fighters[1].x=605;fighters[1].y=560;fighters[1].grounded=true;fighters[1].hitlag=fighters[1].hitstun=0;fighters[1].frozen=null;attack(fighters[0],'dragon');}
 if(n===405){place(700,200);fighters[0].airJumps=0;fighters[0].airDodged=true;attack(fighters[0],'airDrop');}
 if(n===440){place();fighters[1].x=540;attack(fighters[0],'gale');}
 if(n===470)rules.spawn(fighters[0],{kind:'echo',x:450,y:560,vx:0,vy:0,damage:0,life:30,launchAt:8,target:{x:700,y:512},phase:'waiting'});
}
if(id==='laharl'){
 if(n===100)key('KeyX',false);
 if(n===118){const f=fighters[0],o=fighters[1],q=attackBoxes(f)[0];if(q){o.x=q.x2;o.y=q.y2+30;o.grounded=false;}}
 if(n===150){place();attack(fighters[0],'dash');}
 if(n===310){place(700,350);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');key('ArrowLeft',true);key('ArrowRight',false);key('ArrowUp',true);}
 if(n===350){fighters[1].x=540;key('KeyX',false);}
 if(n===400){place(700,180);attack(fighters[0],'airDrop');}
 if(n===440){place();attack(fighters[0],'gale');}
}
if(id==='deemo'){
 if(n===100){fighters[1].x=700;key('KeyX',false);}
 if(n===150){place();attack(fighters[0],'dash');key('ArrowDown',true);}
 if(n===180)key('ArrowDown',false);
 if(n===290){place(700,200);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');key('ArrowRight',true);key('ArrowUp',true);}
 if(n>=300&&n<=316){key('ArrowRight',false);key('ArrowLeft',true);}if(n>=317&&n<350){key('ArrowLeft',false);key('ArrowRight',true);}
 if(n===350){fighters[1].x=540;key('KeyX',false);}
 if(n===400){place(700,400);fighters[1].x=735;fighters[1].y=500;fighters[1].grounded=false;attack(fighters[0],'airDrop');}
 if(n===440){place();attack(fighters[0],'gale');}
}
if(id==='odio'){
 if(n===100){fighters[1].x=565;key('KeyX',false);}if(n===120||n===132){const o=fighters[1];o.hitlag=o.hitstun=0;o.frozen=null;o.x=n===120?660:765;o.y=560;o.vx=o.vy=0;}
 if(n===310){place(700,350);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');key('ArrowRight',true);}
 if(n===320){const f=fighters[0],o=fighters[1];f.timer=10;const q=attackBoxes(f)[0];o.x=q.x2;o.y=q.y2+44;o.hitlag=o.hitstun=0;o.frozen=null;resolveCombat();}
 if(n===350){fighters[1].x=500;key('KeyX',false);}
}
if(id==='eve'){
 if(n===100){fighters[1].x=650;key('KeyX',false);}if(n===118)key('KeyX',true);if(n===119)key('KeyX',false);
 if(n===310){place(700,400);attack(fighters[0],'rise');key('ArrowLeft',true);key('ArrowRight',false);key('ArrowUp',true);}if(n===325){fighters[1].x=fighters[0].x-80;fighters[1].y=fighters[0].y;key('KeyX',true);}if(n===326)key('KeyX',false);
 if(n===350){fighters[0].eveEnergy=100;attack(fighters[0],'gale');key('KeyX',false);}if(n===390){fighters[0].attack=null;attack(fighters[0],'jab');}
}
if(id==='tressa'){
 if(n===100){fighters[0].tressaLeaves=5;fighters[1].x=650;key('KeyX',true);}if(n===145)key('KeyX',false);
 if(n===250){place(700,400);attack(fighters[0],'rise');key('ArrowRight',true);}if(n>=200&&n<300)key('KeyX',true);if(n===300)key('KeyX',false);
 if(n===310){place(700,400);attack(fighters[0],'rise');key('ArrowRight',true);key('KeyX',true);}if(n===330)key('KeyX',false);
 if(n===350){fighters[0].tressaLeaves=0;fighters[1].x=575;key('KeyX',false);}
 if(n===390){const f=fighters[0],o=fighters[1];f.hitlag=o.hitlag=o.hitstun=0;f.frozen=o.frozen=null;attack(f,'jab');f.timer=f.attack.activeStart;const q=attackBoxes(f)[0];o.x=q.x2;o.y=q.y2+38;resolveCombat();}
}
if(id==='frog'){
 if(n===100){key('KeyX',true);}if(n===145)key('KeyX',false);
 if(n===160){place(700,400);attack(fighters[0],'rise');}if(n===185)key('KeyX',true);if(n===186)key('KeyX',false);
 if(n===310){place(700,530);const f=fighters[0];attack(f,'rise');f.timer=50;f.attack.phase='fall';f.attack.launchAt=8;f.attack.pose=35;f.attack.activeFrames=[];f.vy=12;}
 if(n>=310&&n<345){key('KeyX',true);key('ArrowRight',false);key('ArrowUp',false);}if(n===345)key('KeyX',false);
 if(n===350)fighters[0].damage=20;
 if(n===370){const f=fighters[0],o=fighters[1];attack(o,'jab');o.timer=o.attack.activeStart;const q=attackBoxes(o)[0];f.x=q.x2;f.y=q.y2+37;resolveCombat();}
 if(n===372){const f=fighters[0],o=fighters[1],q=attackBoxes(f)[0];if(q){f.hitlag=o.hitlag=o.hitstun=0;f.frozen=o.frozen=null;o.x=q.x2;o.y=q.y2+37;resolveCombat();}}
}
if(id==='rocbouquet'){
 if(n===310){place(700,180);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');key('ArrowRight',true);key('ArrowUp',true);key('KeyX',true);}
 if(n===328){key('ArrowRight',false);key('ArrowLeft',true);}if(n===335){key('ArrowUp',false);key('ArrowDown',true);}if(n===343)key('KeyX',false);
 if(n===350){fighters[0].damage=20;fighters[1].x=570;}
 if(n===390){const f=fighters[0],o=fighters[1];f.hitlag=o.hitlag=o.hitstun=0;f.frozen=o.frozen=null;attack(f,'jab');f.timer=f.attack.activeStart;const q=attackBoxes(f)[0];o.x=q.x2;o.y=q.y2+42;resolveCombat();}
}
if(id==='sumino'){
 if(n===0)fighters[1].x=590;
 if(n===100){const f=fighters[0],o=fighters[1];f.timer=9;rules.action(f,emptyInput());const q=attackBoxes(f)[0];o.x=q.x2;o.y=q.y2+42;}
 if(n===310){place(700,180);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');key('ArrowRight',true);}
 if(n===331)key('KeyX',true);if(n===332)key('KeyX',false);
 if(n===350||n===440){fighters[0].suminoVoltage=100;fighters[1].x=570;key('KeyX',false);}
}
if(id==='maelle'){
 if(n===100){const f=fighters[0],o=fighters[1];f.timer=9;rules.action(f,emptyInput());const q=attackBoxes(f)[0];o.x=q.x2;o.y=q.y2+43;}
 if(n>100&&n<195){const f=fighters[0];key('KeyX',!!(f.attack?.confirmed&&f.attack.phase==='opening'&&f.timer===15));}
 if(n===310){place(700,200);attack(fighters[0],'rise');}
 if(n===319){const f=fighters[0],o=fighters[1],q=attackBoxes(f)[0];if(q){o.x=q.x2;o.y=q.y2+43;}}
 if(n===350||n===440)fighters[1].x=600;
}
if(id==='knight'){
 if(n===100)key('KeyX',true);if(n===135)key('KeyX',false);
 if(n===310){place(700,180);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');key('ArrowRight',true);}
 if(n===333)key('KeyX',true);if(n===334)key('KeyX',false);
 if(n===350){place(700,200);fighters[1].x=755;attack(fighters[0],'airDrop');}
 if(n===440){place();fighters[1].x=555;attack(fighters[0],'gale');}
}
if(id==='arus'){
 if(n>100&&n<195){const f=fighters[0],a=f.attack;key('KeyX',!!(a?.arusDance&&a.comboStage<3&&f.timer===a.comboEnd+2));}
 if(n===440)fighters[1].x=580;
}
if(id==='pneuma'){
 if(n===245){key('ArrowUp',false);key('ArrowDown',true);}if(n===255)key('ArrowDown',false);
 if(n===100){fighters[1].x=730;key('ArrowUp',true);}
 if(n===108){key('ArrowUp',false);}if(n===114)key('ArrowUp',true);if(n===145)key('ArrowUp',false);
 if(n===270){place(700,180);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');key('ArrowRight',true);key('ArrowUp',true);}
 if(n===305){key('ArrowUp',false);key('ArrowDown',true);}if(n===310)key('ArrowDown',false);
 if(n===350||n===440)fighters[1].x=570;
}
if(id==='sukapon'){if(n===0)fighters[1].x=720;if(n===122)key('KeyX',true);if(n===123)key('KeyX',false);if(n===270){place(700,200);attack(fighters[0],'rise');key('ArrowRight',true);key('ArrowUp',true);}if(n===350)fighters[1].x=550;if(n===365){key('ArrowDown',false);key('ArrowUp',true);key('KeyX',false);}if(n===368)key('KeyX',true);if(n===369)key('KeyX',false);if(n===440){place();fighters[1].x=550;attack(fighters[0],'gale');}}
if(id==='guile'){if(n===100){key('KeyX',true);key('ArrowUp',true);}if(n===135)key('KeyX',false);if(n===180)key('ArrowUp',false);if(n===270){place(700,200);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');key('ArrowRight',true);}}
if(id==='piposaru'){
 if(n===0){fighters[1].x=650;}
 if([100,155,325,390].includes(n)){const gadget={100:0,155:1,325:2,390:3}[n];place();fighters[1].x=gadget===3?680:630;fighters[1].y=gadget===1?500:560;fighters[0].piposaruGadget=gadget;attack(fighters[0],'dash');key('KeyX',true);}
 if([140,190,349,425].includes(n))key('KeyX',false);if(n===140){place();attack(fighters[0],'dash');}
 
 if(n===270){place(700,100);fighters[0].ledgeCooldown=100;attack(fighters[0],'rise');key('ArrowRight',true);key('ArrowUp',true);}if(n>=310&&n<315)key('KeyX',true);if(n===315)key('KeyX',false);
 if(n===350)fighters[1].x=650;
 if(n===440){place();fighters[1].x=650;attack(fighters[0],'dragon');}
}
if(id==='twinbee'){
 if(n===0){fighters[0].twinbeeBells=[0,1,2];fighters[1].x=660;}
 if(n>200&&n<233)key('KeyX',true);if(n===233)key('KeyX',false);
 if(n===240)key('KeyA',true);if(n===241)key('KeyA',false);
 if(n===350){fighters[0].damage=20;}
 if(n===440){fighters[0].twinbeeItemCooldown=0;}
 if([370,385,400,415,430,450].includes(n)){const type=[370,385,400,415,430,450].indexOf(n),f=fighters[0];rules.spawn(f,{kind:'item',itemType:type,x:f.x,y:f.y-34,vx:0,vy:0,radius:13,life:20,collectAfter:0});}
}
if(id==='dietrich'){
 if(n===122)key('KeyX',true);if(n===123)key('KeyX',false);if(n===380){const q=rules.objects.find(q=>q.kind==='field'),o=fighters[1];if(q){o.x=q.x+40;o.y=q.y+12;o.attack=null;o.hitlag=0;o.hitstun=20;PlayerStates.enter(o,'Hitstun',20);}} 
}
if(id==='maruku'){
 if(n===100)fighters[1].x=650;
 if(n===350)fighters[1].x=650;
}
if(id==='aruru'){
 if(n===100)fighters[1].x=820;if(n===122)key('KeyX',true);if(n===123)key('KeyX',false);
 if([150,170,185].includes(n)){place();const f=fighters[0];attack(f,'dragon');f.attack.chargeFrames={150:10,170:20,185:30}[n];f.timer=12;rules.action(f,emptyInput());}
 if(n===232)key('KeyX',true);if(n===233)key('KeyX',false);
 if(n===390){const q=rules.objects.find(q=>q.kind==='field'),f=fighters[0];if(q){f.attack=null;f.x=q.x;f.y=q.y-65;f.vy=5;f.grounded=false;PlayerStates.enter(f,'Fall');}}
 if(n===410)key('Space',true);if(n===411)key('Space',false);
}
if(id==='edelgard'){
 if(n===100){fighters[1].x=680;}
 if(n===132)key('KeyZ',true);if(n===133)key('KeyZ',false);
 if(n===150){place();attack(fighters[0],'dash');}
 if(n===270){place(700,250);attack(fighters[0],'rise');}
 if(n===300)key('KeyZ',true);if(n===301)key('KeyZ',false);
 if(n===330){place();}
 if(n===380){const q=rules.objects.find(q=>q.kind==='flag');if(q){fighters[1].x=q.x+50;fighters[1].y=q.y+5;}}
}
if(id==='edf'){
 if(n===0){key('KeyX',false);}
 if(n===20){key('KeyX',true);}
 if(n===21){key('KeyX',false);}
 if([40,60,80].includes(n)){place();fighters[0].edfWeapon=({40:1,60:2,80:3})[n];attack(fighters[0],'dragon');}
 if(n===100){place();fighters[0].edfWeapon=4;attack(fighters[0],'dragon');}
 if(n===155){place();attack(fighters[0],'dash');key('ArrowUp',true);key('KeyX',true);}
 if(n===181){key('KeyX',false);key('ArrowUp',false);}
 if(n===200){key('KeyX',true);}
 if(n>200&&n<325){const f=fighters[0],p=platforms.find(p=>p.main),flying=!!f.attack?.edfJet,safe=f.y<p.y-55&&f.x>p.x+35&&f.x<p.x+p.w-35;key('KeyX',flying&&!safe);key('KeyA',flying&&safe);if(n===214)key('KeyZ',true);if(n===215)key('KeyZ',false);}
 if(n===325){key('KeyX',false);key('KeyA',false);}
 if(n===350){key('KeyX',false);key('ArrowRight',true);}
 if(n===370){key('ArrowRight',false);}
 if(n===390){const q=rules.objects.find(q=>q.kind==='marker');if(q){fighters[1].x=q.x;fighters[1].y=q.y+8;}}
}
if(id==='edelgard'){
 if(n===510){place();key('ArrowRight',true);}
 if(n===520)key('KeyA',true);
 if(n===530)key('ArrowRight',false);
 if(n===535)key('ArrowRight',true);
 if(n===550){key('ArrowRight',false);key('KeyA',false);}
 if(n===560){place();const f=fighters[0],o=fighters[1];Object.assign(o,{x:700,damage:100,gravityOff:false});CombatSystem.hit(f,o,{...movesFor(f).smash,type:'smash',launchDirection:1});}
}
if(n>=0&&n<=(id==='edelgard'?620:500)&&(n%(['kasane','shadow','saki','aerith','doshin','moogle'].includes(id)?1:5)===0))nativeSnapshots[n]={fighters:fighters.map(v=>({id:v.characterId,x:v.x,y:v.y,vx:v.vx,vy:v.vy,damage:v.damage,mode:v.mode,timer:v.timer,animation:id==='sukapon'?SukaponAnimation.sample(v):id==='chocobo'?ChocoboAnimation.sample(v):undefined,pose:pose(v),attack:v.attack?.type,phase:v.attack?.phase,anchor:v.attack?.anchor,tip:v.attack?.tip,tether:v.attack?.tether,details:id==='doshin'?{grounded:v.grounded,ledge:!!v.ledge,bounced:v.attack?.bounced,bounceAt:v.attack?.bounceAt,launchAt:v.attack?.launchAt,prop:v.attack?.prop,cooldown:v.doshinPlayCooldown}:id==='moogle'?{grounded:v.grounded,ledge:!!v.ledge,rideAt:v.attack?.rideAt,ejectAt:v.attack?.ejectAt,mp:moogleMP(v),cooldown:v.moogleCureCooldown,pending:v.pendingLaunch}:id==='aerith'?{grounded:v.grounded,ledge:!!v.ledge,second:v.attack?.second,perchAt:v.attack?.perchAt,stepAt:v.attack?.stepAt,command:v.attack?.command,castAt:v.attack?.castAt,atb:aerithATB(v),cooldown:v.aerithCommandCooldown}:id==='saki'?{grounded:v.grounded,ledge:!!v.ledge,cutAt:v.attack?.cutAt,cutFace:v.attack?.cutFace,firedMask:v.attack?.firedMask,shotAt:v.attack?.shotAt,steer:v.attack?.steer,reflected:v.attack?.reflected,chargeFrames:v.attack?.chargeFrames}:id==='shadow'?{grounded:v.grounded,ledge:!!v.ledge,segment:v.attack?.segment,direction:v.attack?.direction,reversed:v.attack?.reversed,reverseAt:v.attack?.reverseAt,bounced:v.attack?.bounced,recoilAt:v.attack?.recoilAt,brakeAt:v.attack?.brakeAt,firedMask:v.attack?.firedMask,chargeFrames:v.attack?.chargeFrames,cooldown:v.shadowBlastCooldown,slowed:v.shadowTimeSlowed}:id==='kasane'?{grounded:v.grounded,ledge:!!v.ledge,exit:v.attack?.exit,swapped:v.attack?.swapped,swapAt:v.attack?.swapAt,followed:v.attack?.followed,followAt:v.attack?.followAt,gauge:kasaneGauge(v),fieldTime:v.kasaneFieldTime,empowered:v.attack?.empowered,chargeFrames:v.attack?.chargeFrames,airJumps:v.airJumps}:id==='deemo'?{grounded:v.grounded,ledge:!!v.ledge,step:v.attack?.step,direction:v.attack?.direction,stepAt:v.attack?.stepAt,finalAt:v.attack?.finalAt,range:v.attack?.range,rebounded:v.attack?.rebounded,firedMask:v.attack?.firedMask,chargeFrames:v.attack?.chargeFrames}:id==='laharl'?{grounded:v.grounded,ledge:!!v.ledge,exit:v.attack?.exit,firedMask:v.attack?.firedMask,chargeFrames:v.attack?.chargeFrames}:id==='odio'?{grounded:v.grounded,ledge:!!v.ledge,bounced:v.attack?.bounced,bounceAt:v.attack?.bounceAt,launchAt:v.attack?.launchAt,firedMask:v.attack?.firedMask,chargeFrames:v.attack?.chargeFrames}:id==='eve'?{energy:eveEnergy(v),tachy:v.eveTachyTime,grounded:v.grounded,ledge:!!v.ledge,followed:v.attack?.followed,arriveAt:v.attack?.arriveAt,finishAt:v.attack?.finishAt,exitFace:v.attack?.exitFace,chargeFrames:v.attack?.chargeFrames}:id==='tressa'?{leaves:tressaLeaves(v),grounded:v.grounded,ledge:!!v.ledge,hired:v.attack?.hired,rideAt:v.attack?.rideAt,exitAt:v.attack?.exitAt,exitVelocity:v.attack?.exitVelocity,orbitAngle:v.attack?.orbitAngle,chargeFrames:v.attack?.chargeFrames}:id==='frog'?{grounded:v.grounded,ledge:!!v.ledge,cutCount:v.attack?.cutCount,launchAt:v.attack?.launchAt,plungeAt:v.attack?.plungeAt,bounceAt:v.attack?.bounceAt,bounced:v.attack?.bounced,chargeFrames:v.attack?.chargeFrames}:id==='rocbouquet'?{grounded:v.grounded,ledge:!!v.ledge,rideAt:v.attack?.rideAt,fuel:v.attack?.fuel,center:v.attack?.center,chargeFrames:v.attack?.chargeFrames}:id==='sumino'?{grounded:v.grounded,ledge:!!v.ledge,voltage:suminoVoltage(v),launchAt:v.attack?.launchAt,slashAt:v.attack?.slashAt,exitFace:v.attack?.exitFace,chargeFrames:v.attack?.chargeFrames}:id==='maelle'?{grounded:v.grounded,ledge:!!v.ledge,confirmed:v.attack?.confirmed,confirmPoint:v.attack?.confirmPoint,orbitAt:v.attack?.orbitAt,destination:v.attack?.destination,finishAt:v.attack?.finishAt,launchAt:v.attack?.launchAt,bounceAt:v.attack?.bounceAt,bounced:v.attack?.bounced,chargeFrames:v.attack?.chargeFrames}:id==='knight'?{grounded:v.grounded,ledge:!!v.ledge,soul:knightSoul(v),secondFlap:v.attack?.secondFlap,flapAt:v.attack?.flapAt,reboundUsed:v.attack?.reboundUsed,wallSide:v.attack?.wallSide,spinEnd:v.attack?.spinEnd}:id==='arus'?{grounded:v.grounded,ledge:!!v.ledge,comboStage:v.attack?.comboStage,comboStart:v.attack?.comboStart,comboEnd:v.attack?.comboEnd,rideAt:v.attack?.rideAt,burstAt:v.attack?.burstAt,chargeFrames:v.attack?.chargeFrames}:id==='pneuma'?{grounded:v.grounded,ledge:!!v.ledge,points:v.attack?.points,route:v.attack?.route,confirmed:v.attack?.confirmed,returned:v.attack?.returned,segment:v.attack?.segment,boostAt:v.attack?.boostAt,glideAt:v.attack?.glideAt,chargeFrames:v.attack?.chargeFrames}:id==='sukapon'?{grounded:v.grounded,ledge:!!v.ledge,fuel:v.attack?.fuel,angle:v.attack?.rollAngle,bounced:v.attack?.bounced,victimId:v.attack?.victimId,captureFrame:v.attack?.captureFrame,chargeFrames:v.attack?.chargeFrames}:id==='edelgard'?{lastKnockback:v.lastKnockback,lastLaunchSpeed:v.lastLaunchSpeed,launchDecay:v.launchDecay,pendingLaunch:v.pendingLaunch,grounded:v.grounded,ledge:!!v.ledge,confirmed:v.attack?.confirmed,confirmAt:v.attack?.confirmAt,sweepAt:v.attack?.sweepAt,liftAt:v.attack?.liftAt,apexAt:v.attack?.apexAt,plungeAt:v.attack?.plungeAt,rushFace:v.attack?.rushFace,chargeFrames:v.attack?.chargeFrames}:id==='edf'?{grounded:v.grounded,ledge:!!v.ledge,weapon:v.attack?.weapon,chargeFrames:v.attack?.chargeFrames,jetStart:v.attack?.jetStart,nextShot:v.attack?.nextShot,targetX:v.attack?.targetX}:id==='dietrich'?{slashAt:v.attack?.slashAt,liftAt:v.attack?.liftAt,glideAt:v.attack?.glideAt,rushFace:v.attack?.rushFace}:id==='maruku'?{warpX:v.attack?.warpX,warpY:v.attack?.warpY,destination:v.attack?.destination}:id==='aruru'?{layout:v.attack?.layout,flightX:v.attack?.flightX,flightY:v.attack?.flightY,chargeFrames:v.attack?.chargeFrames}:id==='mametchi'?{second:v.attack?.second,wallUsed:v.attack?.wallUsed,itemType:v.attack?.itemType,launchFrame:v.attack?.launchFrame,charge:v.attack?.charge,chargeFrames:v.attack?.chargeFrames}:undefined,run:v.character.runSpeed,status:Object.fromEntries(Object.entries(v).filter(([k])=>k.startsWith(id)))})),platforms:platforms.filter(p=>p.doshin).map(p=>({...p})),objects:(rules.objects||[]).map(q=>({...q,hits:[...q.hits]}))};if(slot===0)Net.capture();});},{id,cap,target,slot});
await pages[0].bringToFront();await Promise.all(pages.map(p=>p.waitForFunction(id=>nativeSnapshots[id==='edelgard'?620:500],id,{timeout:45000})));const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>nativeSnapshots))),checks=[],check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(!pass?{detail}:{})});for(const[n,s]of Object.entries(snapshots[0]))check('two clients identical '+n,JSON.stringify(s)===JSON.stringify(snapshots[1][n]),snapshots.map(q=>q[n]));const all=Object.values(snapshots[0]);check('server accepts both slots',all[0].fighters.every(f=>f.id===id));if(['yuffie','vincent','mametchi','piposaru'].includes(id))check('neutral projectiles online',all.some(s=>s.objects.length&&s.fighters[0].attack==='dragon'));else check('neutral attack online',all.some(s=>s.fighters[0].attack==='dragon'));check('up special recovery online',snapshots[0][330].fighters[0].y<=560,snapshots[0][330]);if(['yuffie','vincent'].includes(id))check('special objects online',all.some(s=>s.objects.some(q=>['chaos','smoke'].includes(q.kind))));if(id==='yuffie')check('smoke buffs online',all.some(s=>s.fighters[0].status.yuffieHidden));if(id==='charlotta'){check('landing turn branch online',all.some(s=>s.fighters[0].attack==='nobleLanding'));check('ladder art online',all.some(s=>s.fighters[0].attack==='rise'&&[44,45].includes(s.fighters[0].pose)));check('shield brace and thrust online',all.some(s=>s.fighters[0].attack==='gale'&&s.fighters[0].pose===43)&&all.some(s=>s.fighters[0].attack==='gale'&&s.fighters[0].pose===46));}if(id==='piposaru'){
 for(const kind of['net','baton','radar','glove'])check(kind+' objects online',all.some(s=>s.objects.some(q=>q.kind===kind)));
 check('transformation online',all.some(s=>s.fighters[1].status.piposaruMorph>0));
 check('radar tagging online',all.some(s=>s.fighters[1].status.piposaruRadar>0));
 check('hypercap buff online',all.some(s=>s.fighters[0].status.piposaruCap>0));check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<325&&['LedgeCatch','LedgeHang','Idle','SpecialLanding','NormalLanding'].includes(s.fighters[0].mode)&&s.fighters[0].y<=560));
 for(const phase of['ascent','glide','fall'])check('heli '+phase+' online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase===phase));
 check('gadget tap cycles online',all.some(s=>s.fighters[0].status.piposaruGadget===1));
 check('KO clears statuses online',snapshots[0][480].fighters.every(f=>!f.status.piposaruMorph&&!f.status.piposaruRadar));
}if(id==='twinbee'){
 for(const kind of ['spread','missile','laser','bomb','blast','item'])check(kind+' online',all.some(s=>s.objects.some(q=>q.kind===kind)));
 check('bell FIFO online',all.some(s=>s.fighters[0].status.twinbeeBells?.length===3)&&all.some(s=>s.fighters[0].status.twinbeeBells?.length===0));
 check('speed pickup online',all.some(s=>s.fighters[0].status.twinbeeSpeed>0));check('barrier pickup online',all.some(s=>s.fighters[0].status.twinbeeBarrier>0));
 for(const phase of ['lift','float'])check('cloud '+phase+' online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase===phase));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<270&&['LedgeCatch','LedgeHang','Idle','SpecialLanding','NormalLanding'].includes(s.fighters[0].mode)&&s.fighters[0].y<=560));
 check('KO clears resources online',snapshots[0][480].fighters.every(v=>!v.status.twinbeeSpeed&&!v.status.twinbeeBarrier&&!v.status.twinbeeBells?.length));
}
if(id==='edf'){
 for(const kind of ['bullet','plasma','rocket','grenade','marker','missile','blast'])check(kind+' online',all.some(s=>s.objects.some(q=>q.kind===kind)));
 for(let w=0;w<5;w++)check('weapon '+w+' online',all.some(s=>s.objects.some(q=>q.weapon===w)));
 check('fuel used online',all.some(s=>s.fighters[0].status.edfFuel<60));
 check('jet flight online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase==='jet'));
 check('jet rifle shot online',all.some(s=>s.fighters[0].attack==='rise'&&s.objects.some(q=>q.kind==='bullet')));
 check('airstrike warning online',all.some(s=>s.objects.some(q=>q.kind==='marker'&&q.phase==='warning')));
 check('airstrike actual hit online',all.some(s=>s.fighters[1].damage>0));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<350&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('airstrike cooldown online',snapshots[0][445].fighters[0].status.edfStrikeCooldown>0&&!snapshots[0][445].fighters[0].attack);
 check('KO clears resources online',!snapshots[0][480].objects.length&&snapshots[0][480].fighters[0].status.edfFuel===60&&!snapshots[0][480].fighters[0].status.edfStrikeCooldown);
}
if(id==='dietrich'){
 for(const kind of ['swordWave','field'])check(kind+' online',all.some(s=>s.objects.some(q=>q.kind===kind)));
 for(const phase of ['rush','slash','recover'])check('rush '+phase+' online',all.some(s=>s.fighters[0].attack==='dash'&&s.fighters[0].phase===phase));
 for(const phase of ['ascent','glide','fall'])check('wing '+phase+' online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase===phase));
 check('real full charge sword wave online',all.some(s=>s.objects.some(q=>q.kind==='swordWave'&&q.charge===1)));
 check('field gauge builds online',all.some(s=>s.fighters[0].status.dietrichGauge>0));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<350&&['LedgeCatch','LedgeHang','Idle','SpecialLanding','NormalLanding'].includes(s.fighters[0].mode)&&s.fighters[0].y<=560));
 check('field reuse cooldown online',snapshots[0][445].fighters[0].status.dietrichFieldCooldown>0&&!snapshots[0][445].fighters[0].attack);
 check('KO clears resources online',!snapshots[0][480].objects.length&&!snapshots[0][480].fighters[0].status.dietrichGauge&&!snapshots[0][480].fighters[0].status.dietrichFieldCooldown);
}
if(id==='maruku'){
 for(const kind of ['laser','cutter','shadow','hole'])check(kind+' online',all.some(s=>s.objects.some(q=>q.kind===kind)));
 for(const phase of ['out','return'])check('cutter '+phase+' online',all.some(s=>s.objects.some(q=>q.kind==='cutter'&&q.phase===phase)));
 for(const phase of ['warning','pull','burst'])check('hole '+phase+' online',all.some(s=>s.objects.some(q=>q.kind==='hole'&&q.phase===phase)));
 for(const phase of ['aim','vanish','emerge','fall'])check('shadow '+phase+' online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase===phase));
 check('real full charge laser online',all.some(s=>s.objects.some(q=>q.kind==='laser'&&q.length===660)));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<350&&['LedgeCatch','LedgeHang','Idle','SpecialLanding','NormalLanding'].includes(s.fighters[0].mode)&&s.fighters[0].y<=560));
 check('hole reuse cooldown online',snapshots[0][445].fighters[0].status.marukuHoleCooldown>0&&!snapshots[0][445].fighters[0].attack);
 check('KO clears hole and cooldown online',!snapshots[0][480].objects.length&&!snapshots[0][480].fighters[0].status.marukuHoleCooldown);
}if(id==='aruru'){
 for(const color of [1,2,3,4])check('color '+color+' online',all.some(s=>s.objects.some(q=>q.kind==='puyo'&&q.color===color)));
 for(const kind of ['chain','pop','field'])check(kind+' online',all.some(s=>s.objects.some(q=>q.kind===kind)));
 check('chain layout changes online',all.some(s=>s.fighters[0].attack==='dash'&&s.fighters[0].details?.layout===1));
 check('chain order online',all.some(s=>s.objects.some(q=>q.kind==='chain'&&q.chainLevel===3&&q.delay===24)));
 for(const phase of ['ride','flight','fall'])check('Carbuncle '+phase+' online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase===phase));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<350&&['LedgeCatch','LedgeHang','Idle','SpecialLanding','NormalLanding'].includes(s.fighters[0].mode)&&s.fighters[0].y<=560));
 check('field supports fighter online',all.some(s=>s.objects.some(q=>q.kind==='field'&&q.settled&&s.fighters[0].y===q.y-20)));
 check('field remote pop online',Object.entries(snapshots[0]).some(([n,s])=>n>=455&&n<475&&s.objects.some(q=>q.kind==='pop')));
 check('KO clears field online',!snapshots[0][480].objects.length&&!snapshots[0][480].fighters[0].status.aruruFieldCooldown);
}if(id==='mametchi'){check('meal and sharing online',all.some(s=>s.fighters[0].attack==='dash'&&s.fighters[0].pose===42)&&all.some(s=>s.fighters[0].attack==='shareMeal'));check('care item online',all.some(s=>s.objects.some(q=>q.kind==='care')));check('second hop online',all.some(s=>s.fighters[0].details?.second));check('wall cling online',all.some(s=>s.fighters[0].phase==='cling'));check('wall rebound online',all.some(s=>s.fighters[0].details?.wallUsed));for(let t=0;t<5;t++)check('item type online '+t,all.some(s=>s.objects.some(q=>q.kind==='care'&&q.itemType===t)));check('real egg full charge online',all.some(s=>s.objects.some(q=>q.kind==='egg'&&q.damage===15)));check('meal heal online',all.some(s=>s.fighters[0].attack==='shareMeal'&&s.fighters[0].damage===17));}if(id==='ryofu'){for(const type of ['horseSweep','spearDive','musouCounter'])check(type+' online',all.some(s=>s.fighters[0].attack===type));check('mounted art online',all.some(s=>s.fighters[0].pose===42));check('ground shock online',all.some(s=>s.objects.some(q=>q.kind==='groundWave')));check('musou buff online',all.some(s=>s.fighters[0].status.ryofuMusou>0));}if(id==='crash')check('box objects online',all.some(s=>s.objects.some(q=>q.kind==='crate'||q.kind==='fruit')));if(id==='vincent')check('beast art online',all.some(s=>s.fighters[0].pose>=44&&s.fighters[0].pose<=47));if(id==='edelgard'){
 for(const phase of ['rush','sweep','recover'])check('rush '+phase+' online',all.some(s=>s.fighters[0].attack==='dash'&&s.fighters[0].phase===phase));
 for(const phase of ['ascent','apex','plunge'])check('flight '+phase+' online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase===phase));
 check('plunge actual landing online',all.some(s=>s.fighters[0].attack==='edelgardImpact'));
 check('real charge maximum online',all.some(s=>s.fighters[0].attack==='dragon'&&s.fighters[0].details.chargeFrames===60));
 for(const phase of ['warning','pull'])check('flag '+phase+' online',all.some(s=>s.objects.some(q=>q.kind==='flag'&&q.phase===phase)));
 check('flag damages online',all.some(s=>s.objects.some(q=>q.kind==='flag')&&s.fighters[1].damage>0));
 check('actual recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<270&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('flag cooldown prevents reuse online',snapshots[0][445].fighters[0].status.edelgardFlagCooldown>0&&!snapshots[0][445].fighters[0].attack);
 check('KO clears flag online',!snapshots[0][480].objects.length&&!snapshots[0][480].fighters[0].status.edelgardFlagCooldown);
}
if(id==='edelgard'){
 check('online dash guard shields',snapshots[0][525].fighters[0].mode==='ShieldHold',snapshots[0][525]);
 check('online fresh shield gesture rolls',snapshots[0][540].fighters[0].mode==='ForwardRoll',snapshots[0][540]);
 const launched=snapshots[0][595].fighters[1].details;
 check('online smash launch conversion',Math.abs(launched.lastLaunchSpeed-launched.lastKnockback*.12)<1e-8,launched);
 check('online smash decay retained',launched.launchDecay>.075,launched);
}
if(id==='guile'){
 check('charged boom online',all.some(s=>s.objects.some(q=>q.kind==='boom'&&q.charge>.9)));
 check('blade telegraph online',all.some(s=>s.objects.some(q=>q.kind==='blade'&&q.phase==='placed'&&q.vx===0)));
 check('blade angled flight online',all.some(s=>s.objects.some(q=>q.kind==='blade'&&q.phase==='flying'&&q.vy<-5)));
 check('three native flip frames online',[44,45,46].every(p=>all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].pose===p)));
 check('actual ledge or landing recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<325&&['LedgeCatch','LedgeHang','Idle','SpecialLanding','NormalLanding'].includes(s.fighters[0].mode)));
 check('KO clears projectiles online',!snapshots[0][480].objects.length);
}
if(id==='sukapon'){for(const kind of['shotHead','head'])check(kind+' online',all.some(s=>s.objects.some(q=>q.kind===kind)));for(const phase of['out','return'])check('head '+phase+' online',all.some(s=>s.objects.some(q=>q.kind==='head'&&q.phase===phase)));check('full charge online',all.some(s=>s.objects.some(q=>q.kind==='shotHead'&&q.charge===1)));check('headless body online',all.some(s=>s.fighters[0].status.sukaponHeadAway&&s.fighters[0].pose===42));check('spin and steering online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].pose===45));check('command capture online',all.some(s=>s.fighters[0].attack==='gale'&&s.fighters[0].phase==='hold'));check('command throw online',all.some(s=>s.fighters[0].phase==='release'&&s.fighters[1].damage>0));check('actual recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<270&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));check('KO clears head online',!snapshots[0][480].objects.length&&!snapshots[0][480].fighters[0].status.sukaponHeadAway);}

if(id==='pneuma'){
 check('full charge long beam online',all.some(s=>s.objects.some(q=>q.kind==='beam'&&q.charge===1&&q.length===580)));
 for(const phase of['aim','path','recover'])check('flare '+phase+' online',all.some(s=>s.fighters[0].attack==='dash'&&s.fighters[0].phase===phase));
 check('three aimed marks online',all.some(s=>s.fighters[0].details.points?.length===3));
 check('confirmed return online',all.some(s=>s.fighters[0].details.returned));
 for(const phase of['ascent','glide','fall'])check('wings '+phase+' online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase===phase));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<270&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('Genesis both phases online',all.some(s=>s.fighters[0].attack==='gale'&&s.fighters[0].timer>=24&&s.fighters[0].timer<=27)&&all.some(s=>s.fighters[0].attack==='gale'&&s.fighters[1].damage>0));
 check('KO clears beam online',!snapshots[0][480].objects.length);
}
if(id==='arus'){
 check('full charge lightning online',all.some(s=>s.objects.some(q=>q.kind==='giga'&&q.charge===1)));
 for(let stage=0;stage<4;stage++)check('dance stage '+stage+' online',all.some(s=>s.fighters[0].attack==='dash'&&s.fighters[0].details.comboStage===stage));
 for(const phase of['ride','burst','fall'])check('vortex '+phase+' online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase===phase));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<325&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('two purification waves online',all.some(s=>s.objects.filter(q=>q.kind==='purify').length===2));
 check('purification actual damage online',all.some(s=>s.fighters[0].attack==='gale'&&s.fighters[1].damage>0));
 check('KO clears objects online',!snapshots[0][480].objects.length);
}
if(id==='knight'){
 check('Shade Soul online',all.some(s=>s.objects.some(q=>q.kind==='shade')));
 check('soul consumption online',all.some(s=>s.fighters[0].details.soul===66));
 check('cyclone extension online',all.some(s=>s.fighters[0].attack==='dash'&&s.fighters[0].timer>=30));
 check('second wing flap online',all.some(s=>s.fighters[0].details.secondFlap));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<310&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('dark diving body online',all.some(s=>s.fighters[0].attack==='airDrop'&&s.fighters[0].pose===46));
 check('dark ground impact online',all.some(s=>s.fighters[0].attack==='knightImpact'&&s.fighters[0].pose===47&&s.fighters[1].damage>0));
 check('KO resets soul online',!snapshots[0][480].objects.length&&snapshots[0][480].fighters[0].details.soul===99);
}
if(id==='maelle'){
 check('full charge ray online',all.some(s=>s.objects.some(q=>q.kind==='ray'&&q.length===580)));
 for(const phase of['opening','orbit','finish','recover'])check('waltz '+phase+' online',all.some(s=>s.fighters[0].attack==='dash'&&s.fighters[0].phase===phase));
 check('confirmed flank online',all.some(s=>s.fighters[0].details.confirmed&&s.fighters[0].details.destination));
 check('halo ricochet online',all.some(s=>s.fighters[0].details.bounced));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<310&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 for(const phase of['warning','burst'])check('Tomorrow '+phase+' online',all.some(s=>s.objects.some(q=>q.kind==='tomorrow'&&q.phase===phase)));
 check('Tomorrow damages online',all.some(s=>s.objects.some(q=>q.kind==='tomorrow')&&s.fighters[1].damage>0));
 check('owner can act while warning persists',all.some(s=>s.objects.some(q=>q.kind==='tomorrow'&&q.phase==='warning')&&!s.fighters[0].attack));
 check('KO clears objects online',!snapshots[0][480].objects.length);
}
if(id==='sumino'){
 check('stationary blade online',all.some(s=>s.objects.some(q=>q.kind==='blade'&&q.vx===0&&q.vy===0)));
 for(const phase of['warning','slash'])check('echo '+phase+' online',all.some(s=>s.objects.some(q=>q.kind==='echo'&&q.phase===phase)));
 check('echo persists after owner recovery',all.some(s=>s.objects.some(q=>q.kind==='echo')&&!s.fighters[0].attack));
 for(const phase of['recoil','slash','fall'])check('lift '+phase+' online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase===phase));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<310&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('voltage consumed online',all.some(s=>s.objects.some(q=>q.kind==='assault'&&q.voltage===100)&&s.fighters[0].details.voltage===0));
 check('assault final pulse online',all.some(s=>s.objects.some(q=>q.kind==='assault'&&q.phase==='finish')));
 check('KO clears objects and voltage',!snapshots[0][480].objects.length&&snapshots[0][480].fighters[0].details.voltage===0);
}
if(id==='rocbouquet'){
 check('charged twin wind online',all.some(s=>s.objects.filter(q=>q.kind==='wind'&&q.charge===1).length===2));
 for(const phase of['out','return'])check('plasma '+phase+' online',all.some(s=>s.objects.some(q=>q.kind==='plasma'&&q.phase===phase)));
 check('plasma persists after recovery',all.some(s=>s.objects.some(q=>q.kind==='plasma')&&!s.fighters[0].attack));
 for(const phase of['ride','fall'])check('wind '+phase+' online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase===phase));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<310&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('charm owner and lifetime online',all.some(s=>s.fighters[1].status.rocbouquetCharm>0&&s.fighters[1].status.rocbouquetCharmOwner===0));
 check('charmed followup heals online',all.some(s=>s.fighters[0].damage===19));
 check('KO clears charms objects cooldown',!snapshots[0][480].objects.length&&!snapshots[0][480].fighters[1].status.rocbouquetCharm&&!snapshots[0][480].fighters[0].status.rocbouquetTemptCooldown);
}
if(id==='frog'){
 check('five cuts full charge online',all.some(s=>s.fighters[0].details.cutCount===5));
 check('charged water projectile online',all.some(s=>s.objects.some(q=>q.kind==='water'&&q.charge===1)));
 check('plunge branch online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase==='plunge'));
 check('held landing bounce online',all.some(s=>s.fighters[0].details.bounced));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<310&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('water riposte healing online',all.some(s=>s.fighters[0].attack==='frogRiposte'&&s.fighters[0].damage===18));
 check('riposte actual damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=370&&n<440&&s.fighters[1].damage>0));
 check('KO clears water objects online',!snapshots[0][480].objects.length);
}
if(id==='tressa'){
 check('charged storm online',all.some(s=>s.objects.some(q=>q.kind==='storm')));
 check('three mercenaries online',all.some(s=>s.objects.filter(q=>q.kind==='helper').length===3&&s.fighters[0].details.leaves===2));
 check('archer arrow online',all.some(s=>s.objects.some(q=>q.kind==='arrow')));
 check('summon outlives owner recovery online',all.some(s=>!s.fighters[0].attack&&s.objects.some(q=>q.kind==='helper')));
 check('mercenary real damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=100&&n<200&&s.fighters[1].damage>0));
 check('orbit automatic exit online',all.some(s=>s.fighters[0].details.exitVelocity?.y===-10));
 check('timed tangent exit online',Object.entries(snapshots[0]).some(([n,s])=>n>=330&&n<350&&s.fighters[0].details.exitVelocity?.x>0&&s.fighters[0].details.exitVelocity?.y<=-6));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<310&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('bounty earns leaf online',Object.entries(snapshots[0]).some(([n,s])=>n>366&&n<390&&s.fighters[0].details.leaves===1&&s.fighters[1].damage>0));
 check('KO leaves and object reset online',snapshots[0][480].fighters[0].details.leaves===2&&!snapshots[0][480].objects.length);
}
if(id==='eve'){
 check('charged drone laser online',all.some(s=>s.objects.some(q=>q.kind==='laser')));
 check('side wave and cross online',all.some(s=>s.objects.some(q=>q.kind==='wave'))&&all.some(s=>s.objects.some(q=>q.kind==='cross')));
 check('cross actual damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=100&&n<200&&s.fighters[1].damage>0));
 check('blink arrival online',all.some(s=>s.fighters[0].phase==='arrival'));
 check('blink endpoint chase online',all.some(s=>s.fighters[0].details.followed&&s.fighters[0].attack==='rise'));
 check('actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<310&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('Tachy activation online',all.some(s=>s.fighters[0].details.tachy>0&&s.fighters[0].details.energy===0));
 check('Tachy speed online',all.some(s=>s.fighters[0].details.tachy>0&&s.fighters[0].run>7.4));
 check('KO resets transformation online',snapshots[0][480].fighters[0].details.energy===50&&!snapshots[0][480].fighters[0].details.tachy&&!snapshots[0][480].objects.length);
}
if(id==='odio'){
 check('charged dragon online',all.some(s=>s.objects.some(q=>q.kind==='dragonLarge')));
 for(const j of[0,1,2])check('razor distance '+j+' online',all.some(s=>s.objects.some(q=>q.kind==='razor'&&q.index===j)));
 check('razor actual damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=100&&n<200&&s.fighters[1].damage>0));
 check('vault actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<310&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('vault hit rebound online',all.some(s=>s.fighters[0].details.bounced&&s.fighters[1].damage>0));
 check('denial warning and active online',all.some(s=>s.objects.some(q=>q.kind==='denial'&&q.phase==='warning'))&&all.some(s=>s.objects.some(q=>q.kind==='denial'&&q.phase==='active')));
 check('denial owner recovers online',all.some(s=>!s.fighters[0].attack&&s.objects.some(q=>q.kind==='denial')));
 check('denial actual damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=350&&n<440&&s.fighters[1].damage>0));
 check('KO resets denial online',snapshots[0][480].fighters[0].status.odioDenialCooldown===0&&!snapshots[0][480].objects.length);
}
if(id==='laharl'){
 for(const j of[0,1,2])check('charged orb '+j+' online',all.some(s=>s.objects.some(q=>q.kind==='orb'&&q.index===j)));
 for(const phase of['leap','plunge','rebound'])check('knuckle '+phase+' online',all.some(s=>s.fighters[0].attack==='dash'&&s.fighters[0].phase===phase));
 check('knuckle actual hit online',Object.entries(snapshots[0]).some(([n,s])=>n>=100&&n<150&&s.fighters[1].damage>0));
 check('knuckle whiff landing online',all.some(s=>s.fighters[0].attack==='knuckleImpact'));
 for(const phase of['startup','realm','exit','fall'])check('dimension '+phase+' online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase===phase));
 check('dimension stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<310&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('meteor cross online',all.some(s=>s.objects.some(q=>q.kind==='meteorCross')));
 check('meteor real damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=350&&n<400&&s.fighters[1].damage>0));
 check('air meteor landing online',all.some(s=>s.fighters[0].attack==='meteorImpact'));
 check('KO clears objects online',snapshots[0][480].objects.length===0);
}
if(id==='deemo'){
 for(const j of[0,1,2])check('charged note '+j+' online',all.some(s=>s.objects.some(q=>q.kind==='note'&&q.index===j)));
 for(const phase of['warning','fall'])check('falling score '+phase+' online',all.some(s=>s.objects.some(q=>q.kind==='score'&&q.phase===phase)));
 check('falling score real damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=100&&n<150&&s.fighters[1].damage>0));
 check('score outlasts owner recovery',all.some(s=>!s.fighters[0].attack&&s.objects.some(q=>q.kind==='score')));
 check('far score selected online',all.some(s=>s.fighters[0].details.range===310));
 for(const phase of['hop','rest','final','fall'])check('piano stair '+phase+' online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase===phase));
 for(const step of[1,2,3])check('piano step '+step+' online',all.some(s=>s.fighters[0].details.step===step));
 check('step changes direction online',all.some(s=>s.fighters[0].details.direction===-1&&s.fighters[0].details.step===2));
 check('stair actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<310&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('piano keys online',all.some(s=>s.objects.some(q=>q.kind==='key')));
 for(const phase of['warning','active'])check('roots '+phase+' online',all.some(s=>s.objects.some(q=>q.kind==='roots'&&q.phase===phase)));
 check('roots real damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=350&&n<400&&s.fighters[1].damage>0));
 check('air root and recoil online',all.some(s=>s.objects.some(q=>q.kind==='rootRay')&&s.fighters[0].details.rebounded));
 check('air root real damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=400&&n<440&&s.fighters[1].damage>0));
 check('KO clears objects online',snapshots[0][480].objects.length===0);
}
if(id==='kasane'){
 check('charged rock online',all.some(s=>s.objects.some(q=>q.kind==='rock'&&q.charge===1)));
 for(const phase of['waiting','spent'])check('clone '+phase+' online',all.some(s=>s.objects.some(q=>q.kind==='echo'&&q.phase===phase)));
 check('clone swap online',all.some(s=>s.fighters[0].details.swapped));
 check('clone knives online',all.some(s=>s.objects.some(q=>q.kind==='psiKnife')));
 check('cross real damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=100&&n<150&&s.fighters[1].damage>0));
 check('clones outlast owner recovery online',all.some(s=>!s.fighters[0].attack&&s.objects.some(q=>q.kind==='echo')));
 for(const phase of['locked','warp','cut','crescent','fall'])check('warp '+phase+' online',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].phase===phase));
 check('optional reversing followup online',all.some(s=>s.fighters[0].details.followed&&s.fighters[0].vx<0));
 check('warp actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<310&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('Brain Field resource online',all.some(s=>s.fighters[0].details.fieldTime>0&&s.fighters[0].details.gauge===0));
 check('field burst real damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=350&&n<380&&s.fighters[1].damage>0));
 check('instant field attack online',all.some(s=>s.objects.some(q=>q.kind==='mindBlast')));
 check('instant field real damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=395&&n<405&&s.fighters[1].damage>6));
 check('air refresh online',Object.entries(snapshots[0]).some(([n,s])=>n>=425&&n<440&&s.fighters[0].details.airJumps===1));
 check('KO resets field and clears objects online',snapshots[0][480].fighters[0].details.gauge===50&&snapshots[0][480].fighters[0].details.fieldTime===0&&snapshots[0][480].objects.length===0);
}
if(id==='shadow'){
 for(const j of[0,1,2])check('charged spear '+j+' online',all.some(s=>s.objects.some(q=>q.kind==='spear'&&q.index===j&&q.charge===1)));
 check('boost reverse input online',all.some(s=>s.fighters[0].details.reversed&&s.fighters[0].vx<0));
 check('boost hit and recoil online',Object.entries(snapshots[0]).some(([n,s])=>n>=150&&n<180&&s.fighters[0].phase==='hit'&&s.fighters[1].damage>0));
 check('boost deliberate brake online',Object.entries(snapshots[0]).some(([n,s])=>n>=180&&n<200&&s.fighters[0].phase==='brake'));
 check('boost real wall recoil online',Object.entries(snapshots[0]).some(([n,s])=>n>=330&&n<350&&s.fighters[0].phase==='wall'&&s.fighters[0].details.bounced));
 for(const segment of[1,2])check('control segment '+segment+' online',all.some(s=>s.fighters[0].details.segment===segment));
 check('control redirect online',Object.entries(snapshots[0]).some(([n,s])=>n>=302&&n<325&&s.fighters[0].details.segment===2&&s.fighters[0].details.direction.x<0));
 check('control actually slows opponent online',all.some(s=>s.fighters[1].details.slowed));
 check('control clock field online',all.some(s=>s.objects.some(q=>q.kind==='clock')));
 check('control actual stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<280&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('ground blast real damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=350&&n<400&&s.fighters[1].damage>0));
 check('air blast real damage online',Object.entries(snapshots[0]).some(([n,s])=>n>=400&&n<440&&s.fighters[1].damage>0));
 check('blast owner unlocks during cooldown',Object.entries(snapshots[0]).some(([n,s])=>n>=380&&n<400&&!s.fighters[0].attack&&s.fighters[0].details.cooldown>0));
 check('KO clears objects and cooldown online',!snapshots[0][480].objects.length&&snapshots[0][480].fighters[0].details.cooldown===0);
}
if(id==='saki'){
 for(const phase of['vault','cut','recoil','finish','fall'])check('saki '+phase+' online',all.some(s=>s.fighters[0].phase===phase));
 for(const j of[0,1,2])check('saki recoil shot '+j,all.some(s=>s.objects.some(q=>q.kind==='recoil'&&q.index===j)));
 check('saki steering reverses',all.some(s=>s.fighters[0].attack==='rise'&&s.fighters[0].details.steer<0&&s.fighters[0].vx<0));
 check('saki optional early cut',all.some(s=>s.fighters[0].details.cutAt<23));
 check('saki reflection owner transfer',all.some(s=>s.objects.some(q=>q.sakiReflected&&q.owner===0&&q.vx>0)));
 check('saki actual reflected hit',Object.entries(snapshots[0]).some(([n,s])=>n>450&&n<475&&s.fighters[1].damage>0));
 check('saki stage recovery',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<280&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
}
if(id==='aerith'){
 for(const phase of['travel','burst'])check('wind '+phase+' online',all.some(s=>s.objects.some(q=>q.kind==='wind'&&q.phase===phase)));
 check('wind owner recovers independently online',Object.entries(snapshots[0]).some(([n,s])=>n>125&&n<140&&!s.fighters[0].attack&&s.objects.some(q=>q.kind==='wind')));
 for(const phase of['rise','perch','second','cast'])check('flower or ATB '+phase+' online',all.some(s=>s.fighters[0].phase===phase));
 check('flower extra jump online',all.some(s=>s.fighters[0].details.second));
 for(const command of[0,1,2])check('ATB command '+command+' online',all.some(s=>s.fighters[0].phase==='cast'&&s.fighters[0].details.command===command));
 check('cure actual healing online',Object.entries(snapshots[0]).some(([n,s])=>n>400&&n<440&&s.fighters[0].damage===23));
 check('command spends ATB online',all.some(s=>s.fighters[0].details.atb<60&&s.fighters[0].details.cooldown>0));
 check('flower stage recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<280&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
}
if(id==='doshin'){
 check('real platform synced online',all.some(s=>s.platforms.length===1));
 check('terrain destroyed online',Object.entries(snapshots[0]).some(([n,s])=>n>162&&n<180&&!s.platforms.length&&s.objects.some(q=>q.kind==='quake')));
 check('selected tree projectile online',all.some(s=>s.objects.some(q=>q.kind==='prop'&&q.prop===1)));
 for(const phase of['jump','stomp','rebound'])check('giant '+phase+' online',all.some(s=>s.fighters[0].phase===phase));
 for(const phase of['water','wind'])check('play '+phase+' online',all.some(s=>s.objects.some(q=>q.kind==='play'&&q.phase===phase)));
 check('giant actual recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<280&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('KO clears platform online',!snapshots[0][480].platforms.length&&!snapshots[0][480].objects.length);
}
if(id==='moogle'){
 for(const kind of['ice','crystal','shard','stone','aero','heal'])check('moogle '+kind+' online',all.some(s=>s.objects.some(q=>q.kind===kind)));
 for(const phase of['ride','eject','fall'])check('aero '+phase+' online',all.some(s=>s.fighters[0].phase===phase));
 check('aero lifts enemy online',all.some(s=>s.objects.some(q=>q.kind==='aero'&&(q.lifted&2))));
 check('stone long hitstun online',all.some(s=>s.fighters[1].details.pending?.hitstun>=24));
 check('cure heal online',Object.entries(snapshots[0]).some(([n,s])=>n>350&&n<400&&s.fighters[0].damage===25));
 check('cure actual MP cost online',all.some(s=>s.fighters[0].details.mp<30&&s.fighters[0].details.cooldown>0));
 check('moogle actual recovery online',Object.entries(snapshots[0]).some(([n,s])=>n>200&&n<280&&(s.fighters[0].details.grounded||s.fighters[0].details.ledge)));
 check('KO clears spells and cooldown online',!snapshots[0][480].objects.length&&snapshots[0][480].fighters[0].details.cooldown===0);
}
fs.writeFileSync('.tools/'+id+'-online-results.json',JSON.stringify({checks,errors,snapshots},null,2));console.log(JSON.stringify({id,checks:checks.length,failed:checks.filter(c=>!c.pass),errors}));if(errors.length||checks.some(c=>!c.pass))process.exitCode=1;}finally{await b.close();}};



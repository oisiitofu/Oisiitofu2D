'use strict';
const MonokumaMoves=(()=>{
 const m=CombatData.createMove,w=CombatData.window,moves={};
 for(const[id,a]of Object.entries(UlgrimMoves))moves[id]={...a,animation:{...a.animation},timeline:a.timeline.map(e=>({...e})),activeFrames:a.activeFrames.map(v=>({...v}))};
 const names={jab:'素早いひっかき',jab2:'裏拳でビンタ',jab3:'かみつき突進',heavy:'ハンマーの軽打',up:'メガホンで打ち上げ',low:'足払い',dashAttack:'モノクマボール突進',smash:'巨大ハンマーの一撃',upsmash:'論破・打ち上げ',downsmash:'モノクマボール両側攻撃',air:'くるくる回転アタック',fair:'前かみつき',bair:'後ろ脚キック',uair:'上向き小道具攻撃',dair:'たたきつけるドリルタック',grab:'両手でつかむ',pummel:'頭突き',forwardThrow:'笑顔でハンマー',backThrow:'ぐるっと投げる',upThrow:'バネで打ち上げ',downThrow:'叩きつけて上に座る'};
 for(const[id,name]of Object.entries(names)){moves[id].name=name;moves[id].reach*=.88;}
 moves.dair={...moves.dair,timeline:[],bounceOnHit:-7};
 moves.dragon=m('モノクマボール投げ',12,[],13,10,{pose:13,chargeFrame:4,chargeButton:'special',chargeMaxFrames:60,spawnObject:'ball',projectile:true});
 moves.dash=m('モノクマカー',10,[w(10,15,'front',{damage:4,baseKnockback:1.5,knockbackGrowth:.01}),w(22,26,'front',{damage:12})],13,12,{damage:12,reach:155,pose:15,carMove:true,airControlMultiplier:0,baseKnockback:5.2,knockbackGrowth:.08,ledgeGrabStart:27,timeline:[{frame:10,type:'SetVelocity',x:13},{frame:16,type:'SetVelocity',x:10,y:-6},{frame:22,type:'SetVelocity',x:9,y:3},{frame:27,type:'SetVelocity',x:2}]});
 moves.rise=m('おしおきロケット',7,[w(7,16,'up')],11,18,{damage:10,reach:145,pose:16,verticalImpulse:-19,angle:-1.4,aerial:true,actionCancelFrame:17,ledgeGrabStart:7});
 moves.gale=m('学級裁判トラップ',16,[],13,12,{pose:12,spawnObject:'trap',preserveVelocity:false});
 delete moves.counter;
 for(const a of Object.values(moves))a.motionEndFrames=a.totalFrames;
 return moves;
})();
const MonokumaRules=(()=>{
 let objects=[];
 function reset(){objects=[];}
 function action(f){const a=f.attack;if(!a)return;if(a.carMove&&f.timer>=10&&f.timer<=26){f.vx=f.face*(f.timer<16?13:f.timer<22?10:9);if(f.timer===16)f.grounded=false;}if(!a.spawnObject||f.timer!==a.startupFrames||a.objectSpawned)return;a.objectSpawned=true;objects=objects.filter(o=>o.owner!==f.id||o.kind!==a.spawnObject);objects.push({kind:a.spawnObject,owner:f.id,face:f.face,x:f.x+f.face*35,y:f.y-(a.spawnObject==='ball'?45:0),vx:f.face*(7+3*a.charge),vy:a.spawnObject==='ball'?-5:0,charge:a.charge,age:0,bounces:0,burst:0,warning:0,hits:new Set(),stale:a.staleMultiplier});}
 function explode(o){if(o.burst)return;o.burst=1;o.hits.clear();sound('explosion',.9,fighters[o.owner]);shake=Math.max(shake,7);}
 function box(o){const r=o.kind==='ball'?54+o.charge*22:80;return{x1:o.x-r*.45,x2:o.x+r*.45,y1:o.y-25,y2:o.y-25,radius:r*.65};}
 function tick(){for(const o of objects){const f=fighters[o.owner],enemy=BattlePlayers.projectileTarget(o);if(!f||f.respawn){o.dead=true;continue;}o.age++;if(o.burst){for(const enemy of BattlePlayers.targets(f)){if(o.burst<=6&&!o.hits.has(enemy.id)&&!enemy.respawn){const b=box(o),contact=CombatSystem.contact(b,enemy);if(contact&&!CombatSystem.protection(enemy).intangible){o.hits.add(enemy.id);const counter=enemy.attack;if(counter?.counterWindow&&enemy.timer>=counter.counterWindow[0]&&enemy.timer<=counter.counterWindow[1]){attack(enemy,counter.counterMove);}else CombatSystem.hit(f,enemy,{...CombatData.moves.dragon,type:o.kind==='ball'?'dragon':'gale',damage:o.kind==='ball'?11+7*o.charge:16,charge:0,staleMultiplier:o.stale,projectile:true,angle:-.85,baseKnockback:5.4,knockbackGrowth:.084,launchDirection:Math.sign(enemy.x-o.x)||o.face},b,contact);}}}if(++o.burst>22)o.dead=true;continue;}
 if(o.kind==='ball'){const oldY=o.y;o.x+=o.vx;o.vy+=.36;o.y+=o.vy;for(const p of platforms)if(o.vy>0&&o.x>=p.x&&o.x<=p.x+p.w&&oldY+16<=p.y+3&&o.y+16>=p.y){o.y=p.y-16;o.vy=-Math.max(3,Math.abs(o.vy)*.65);o.bounces++;break;}if(o.age>=90||o.bounces>=3||!enemy.respawn&&Math.hypot(enemy.x-o.x,enemy.y-32-o.y)<34){explode(o);}}
 else{if(!o.grounded){const oldY=o.y;o.vy+=.45;o.y+=o.vy;for(const p of platforms)if(o.vy>=0&&o.x>=p.x&&o.x<=p.x+p.w&&oldY<=p.y+6&&o.y>=p.y){o.y=p.y;o.vy=0;o.grounded=true;break;}}if(o.warning){if(++o.warning>=12)explode(o);}else if(o.age>=20&&!enemy.respawn&&Math.abs(enemy.x-o.x)<68&&Math.abs(enemy.y-o.y)<80){o.warning=1;label(o.x,o.y-100,'論破！','#ff3b98');}}
 if(o.age>300||o.y>1800||o.x<-900||o.x>2300)o.dead=true;}objects=objects.filter(o=>!o.dead);}
 return{reset,action,tick,box,get objects(){return objects}};
})();

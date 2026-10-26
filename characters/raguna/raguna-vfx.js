'use strict';
const RagunaVFX=(()=>{const k=CharacterVFXKit.create('raguna'),{stamp}=k;
// Source 0 convex RIGHT, 1 convex UP, 11 thrust RIGHT. Normalize source, rotate
// locally, then reflect by facing. Earth/crop/monster are props, never melee stamps.
function draw(f){if(f.respawn)return;const a=f.attack,e=k.envelope(f);if(e){if(['up','upsmash','uair'].includes(a.type))stamp(1,e.x,e.t+Math.min(25,e.h*.33),e.w,Math.min(60,e.h),1,.96);else if(a.type==='downsmash'){stamp(0,e.l+e.w*.25,e.y,e.w*.5,46,-1,.9);stamp(0,e.r-e.w*.25,e.y,e.w*.5,46,1,.9);}else if(['gale','airDrop'].includes(a.type))stamp(4,e.x,e.y,e.w,e.h,1,.9,0,true);else{const n=['jab3','dashAttack','dair'].includes(a.type)?11:0;stamp(n,e.x,e.y,e.w,Math.min(60,e.h),a.type==='bair'?-f.face:f.face,.95,a.type==='jab2'?-.65:a.type==='dair'?Math.PI/2:a.type==='fair'?.6:a.type==='rise'?-.65:0);}}
if(a?.type==='dragon'&&!a.fired)stamp(2,f.x+f.face*35,f.y-50,18,18,f.face,.6,0,true);}
function drawObjects(){for(const q of RagunaRules.objects){if(q.dead)continue;const fade=Math.min(1,(q.life-q.age)/10);if(q.kind==='fire')stamp(2,q.x,q.y,q.weak?25:48,q.weak?20:38,q.face,fade,0,true);if(q.kind==='moko'){const n=q.launched?(q.hop?7:6):5;stamp(n,q.x,q.y-23,q.hop?66:58,q.hop?48:46,q.face,fade,0,true);}if(q.kind==='plot')stamp(8,q.x,q.y-8,66,25,1,fade,0,true);if(q.kind==='crop'){stamp(12,q.x,q.y-26,58,58,1,fade,0,true);if(q.age>=30)stamp(9,q.x,q.y-50+Math.sin(q.age*.1)*3,22,30,1,fade,0,true);}if(q.kind==='earth')stamp(4,q.x,q.y-9,90,62,q.face,fade,0,true);if(q.kind==='wind'){const h=Math.min(330,q.age*9),r=42+Math.sin(q.age*.14)*7;for(let j=0;j<3;j++)stamp(3,q.x,q.y-h*j/3-12,r*2.5,36,1,fade*.65,0,true);}}}
function impact(v){stamp(13,v.x,v.y,28+v.power*3,28+v.power*3,1,v.life/v.max);}
function hud(f,x,y){k.bar(f.ragunaRP??100,'RP',x,y,'#81e5ff');if(ragunaMoko(f)&&!ragunaMoko(f).ordered)text('横Bでモコモコに指示',x+145,y+42,8,'#e9d7ae','left');}
return{draw,drawObjects,impact,hud};})();

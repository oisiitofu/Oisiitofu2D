'use strict';
// Flight is an explicit character/form capability, never inferred from names.
// extraJumps adds to the ordinary aerial jump; hover uses one shared airtime budget.
const AirMobility=(()=>{
 const profiles={};
 function jumps(ids,extra,reason){for(const id of ids.split(' '))profiles[id]={extraJumps:extra,reason};}
 function hover(ids,frames,fallSpeed,reason,condition){for(const id of ids.split(' '))profiles[id]={frames,fallSpeed,reason,...(condition?{condition}:{})};}
 jumps('maruku moogle colette etna laharl pneuma',3,'翼による羽ばたき');
 jumps('metalgreymon wargreymon omegamon',3,'飛行できる進化形態');
 jumps('valkyrie knight',2,'羽による追加の跳躍');
 jumps('chocobo melia',1,'小さな翼による短い羽ばたき');
 jumps('tails',3,'二本のしっぽによる飛行');
 hover('reimu cojicoji midna rocbouquet viridi lip',90,.6,'空を漂う能力');
 hover('twinbee gundam c4621',75,1,'飛行機構の推力');
 hover('kosmos fiora hanajd ray',60,1.3,'機械の空中制御');
 hover('ashley ratchet chibirobo',60,1.1,'ほうき／ヘリ機構');
 hover('jett ryoku klonoa',60,1.7,'風や耳による滑空');
 hover('mallow',75,.9,'雲の身体');
 hover('kitten saki',75,1,'重力操作／空中浮遊');
 hover('hornet',45,1.7,'マントによる滑空');
 hover('astro',45,1.7,'レーザーホバー');
 hover('terra',75,.7,'トランス中の幻獣の力','terraTrance');
 hover('malenia',75,.9,'腐敗の女神の翼','maleniaRotTime');
 hover('elma',60,1.2,'搭乗機の推力','ocgTime');
 const configured=new WeakMap();
 function configure(c,id){const p=c.airMobility??profiles[id];if(!p)return;const base=configured.get(c)??c.airJumpCount??1;configured.set(c,base);c.airMobility=p;c.airJumpCount=base+Math.max(0,Math.min(3,Math.floor(p.extraJumps||0)));}
 for(const[id,c]of Object.entries(CharacterData))configure(c,id);
 function profile(f){const p=f.character?.airMobility??profiles[f.characterId];return p&&(!p.condition||f[p.condition]>0)?p:null;}
 function reset(f){f.airHoverSpent=0;f.airHoverActive=false;}
 function remaining(f){return Math.max(0,(profile(f)?.frames||0)-(f.airHoverSpent||0));}
 function available(f,i){return !!profile(f)?.frames&&remaining(f)>0&&!f.grounded&&!f.respawn&&!f.hitlag&&!f.hitstun&&!f.pendingLaunch&&!f.tumbling&&!f.grabOwner&&!f.grabbed&&!f.ledge&&!f.attack&&!f.gravityOff&&!f.helpless&&!f.recovered&&!f.fastFall&&['Jump','Fall','FastFall','LedgeJump'].includes(f.mode)&&i.jumpHeld&&i.y<=.5&&f.vy>=0;}
 // Called inside physics, after gravity and before movement/collision. No rise,
 // extra hitstop ticks, altered attack gravity, or cancellation of launch velocity.
 function physics(f,i){f.airHoverActive=false;if(!available(f,i))return;f.airHoverSpent=(f.airHoverSpent||0)+1;f.airHoverActive=true;f.vy=Math.min(f.vy,profile(f).fallSpeed??1);if(f.characterId==='astro')f.astroHoverFuel=remaining(f);}
 function cpu(f,i,floor){if(!profile(f)||f.grounded||f.attack||f.hitstun||f.hitlag||f.helpless||f.recovered||f.tumbling)return i;const off=f.x<floor.x||f.x>floor.x+floor.w;if(off&&f.vy>=0&&f.airJumps>0){i.jump=true;i.jumpHeld=true;i.special=false;i.y=0;}else if(off&&f.y<floor.y+25&&remaining(f)>0&&!i.special){i.jumpHeld=true;i.y=0;}return i;}
 function description(id){const p=CharacterData[id]?.airMobility??profiles[id];if(!p)return '';return p.extraJumps?' 空中ジャンプ＋'+p.extraJumps+'回。':' ジャンプ長押しで浮遊（最大'+(p.frames/60).toFixed(2).replace(/0+$/,'').replace(/\.$/,'')+'秒'+(p.condition?'・飛行形態中のみ':'')+'）。';}
 return{profiles,configure,profile,reset,remaining,available,physics,cpu,description};
})();

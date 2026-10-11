'use strict';
// Simulation frames, shared by local play and the online lockstep clock.
// The clock belongs to the selected Agumon, not to the current stock/form.
const AgumonEvolution=(()=>{
 const forms=['agumon','greymon','metalgreymon','wargreymon','omegamon'],interval=30*60;
 function fresh(id){return id==='agumon'?{evolutionRoot:'agumon',evolutionFrames:0,evolutionStage:0,evolutionFlash:0}:{};}
 function preserve(f){return f.evolutionRoot==='agumon'?{evolutionRoot:f.evolutionRoot,evolutionFrames:f.evolutionFrames,evolutionStage:f.evolutionStage,evolutionFlash:0}:{};}
 function safe(f,id){if(f.respawn||f.stocks<=0||f.attack||f.hitstun||f.hitlag||f.tumbling||f.grabbed||f.grabOwner||f.ledge||f.landingLag)return false;
  if(!['Idle','Walk','Run','RunBrake','InitialDash','Crouch','Turn','RunTurn','Fall','Jump','FastFall','Helpless','Respawn'].includes(f.mode))return false;
  const p=platforms.find(p=>p.main),c=CharacterData[id];return !(f.x>p.x-c.ecb.radius&&f.x<p.x+p.w+c.ecb.radius&&f.y>p.y&&f.y-c.ecb.height<p.y+90);
 }
 function change(f,stage){const id=forms[stage],shield=f.shield;f.characterId=id;f.character={...CharacterData[id]};BattleSize.prepare(f);f.shield=Math.min(shield,f.character.shieldHP);f.evolutionStage=stage;f.evolutionFlash=45;f.digiMode=0;f.digiModeCooldown=0;f.digiShieldStored=0;f.newSideUsed=!!(f.newSideUsed||f.agumonSideUsed);f.newDownUsed=!!f.newDownUsed;f.buffer=null;label(f.x,f.y-f.character.ecb.height-25,Roster.definitions.find(d=>d.id===id).name);ring(f.x,f.y-50,'#c7f4ff',110);sound('power',.8,f);}
 function tick(){for(const f of fighters){if(f.evolutionRoot!=='agumon')continue;if(f.evolutionFlash>0)f.evolutionFlash--;f.evolutionFrames=Math.min(interval*4,(f.evolutionFrames||0)+1);const stage=Math.min(4,Math.floor(f.evolutionFrames/interval));if(stage>f.evolutionStage&&safe(f,forms[stage]))change(f,stage);}}
 function hud(f,x,y){if(f.evolutionRoot!=='agumon')return;const stage=f.evolutionStage||0,seconds=Math.max(0,Math.ceil((interval*(stage+1)-f.evolutionFrames)/60));text(stage===4?'進化完了 · '+(f.digiMode===1?'防御モード':'攻撃モード'):seconds?'進化まで '+seconds+'s':'進化待機',x+50,y+54,10,'#a9e7ff','left');}
 function draw(){for(const f of fighters)if(f.evolutionFlash>0&&!f.respawn){const n=f.evolutionFlash/45;GreymonVFX.stamp(6,f.x,f.y-f.character.ecb.height*.55,125+90*(1-n),f.character.ecb.height*1.7,1,n);}}
 return{forms,interval,fresh,preserve,tick,hud,draw,change};
})();

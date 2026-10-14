'use strict';
// Gameplay rules use simulation frames. Presentation never feeds back into combat.
const BattleFeel=(()=>{
 const tuning=Object.freeze({diAngle:.17,shieldHitlag:.67,directionalDodgeBrake:.94,directionalDodgeFloat:22,neutralDodgeBrake:.88,neutralDodgeFloat:25});
 let trails=[],cameraKick=0;
 function reset(){trails=[];cameraKick=0;}
 function hitlag(a){const damage=a.damage??a.dmg??0,electric=a.element==='thunder'||a.element==='electric';return clamp(Math.floor((damage*.65+6)*(electric?1.5:1)*(a.hitlagMultiplier??1)),0,30);}
 function shieldStun(a,damage){const custom=a.shieldstunMultiplier??1,mult=a.projectile?(custom!==1?custom:.29):custom*(a.aerial?.33:/smash/i.test(a.type)?.725:1);return Math.max(0,Math.floor(damage*.8*mult+3)-1);}
 function impact(f,o,a,damage,raw,lag,touch){
  const x=touch?.x??o.x,y=touch?.y??o.y-o.character.ecb.height*.48,direction=a.launchDirection||f.face;
  const power=clamp((damage-3)/20,0,1),strong=raw>=120&&damage>=10;
  CombatVFX.impact(x,y,f.characterId==='isaac'?4:f.color,damage,direction,f.characterId,lag);
  shake=Math.max(shake,.8+power*7+(strong?3:0));
  // Jabs and multi-hit links remain readable without a full-screen flash.
  flash=Math.max(flash,damage>=12?.025+power*.07:0);
  emit(x,y,colors[f.color],Math.round(5+power*16),2+power*7,lag);
  if(damage>=9)ring(x,y,'#fff5d4',26+power*65,lag);
  if(training)label(o.x,o.y-o.character.ecb.height-16,`${Math.round(damage*10)/10}%`,colors[f.color]);
  if(strong)cameraKick=Math.max(cameraKick,.04+power*.025);
  GameAudio.strike(f,a,damage);
 }
 function updateCamera(){
  const alive=fighters.filter(f=>!f.respawn&&!BattlePlayers.out(f));if(!alive.length)return;
  const rule=StageRules.camera,view=battleViewBounds();
  // Keep the entire viewport inside the camera area, not just its center.
  // Loupe bodies still affect framing, but never expose the blast warning strip.
  const minZoom=Math.max(rule.minZoom,W/(view.right-view.left),H/(view.bottom-view.top));
  const constrain=()=>{camera.z=Math.max(minZoom,camera.z);camera.x=clamp(camera.x,view.left+W/2/camera.z,view.right-W/2/camera.z);camera.y=clamp(camera.y,view.top+H*.47/camera.z,view.bottom-H*.53/camera.z);};
  // Frame every live body, with a little room in its direction of travel.
  // Bounded anticipation handles launches without chasing a distant projectile.
  const bounds=alive.map(f=>{const dx=clamp((f.vx||0)*7,-110,110),dy=clamp((f.vy||0)*5,-90,90);return{
   left:clamp(f.x-f.character.ecb.radius+Math.min(0,dx),view.left,view.right),right:clamp(f.x+f.character.ecb.radius+Math.max(0,dx),view.left,view.right),
   top:clamp(f.y-f.character.ecb.height+Math.min(0,dy),view.top,view.bottom),bottom:clamp(f.y+Math.max(0,dy),view.top,view.bottom)};});
  const left=Math.min(...bounds.map(b=>b.left)),right=Math.max(...bounds.map(b=>b.right));
  const top=Math.min(...bounds.map(b=>b.top)),bottom=Math.max(...bounds.map(b=>b.bottom));
  const target={x:clamp((left+right)/2,rule.minX,rule.maxX),y:clamp((top+bottom)/2-24,rule.minY,rule.maxY)};
  // Reserve attack/recovery space and keep the fixed HUD clear. Close fights
  // can fill the view; the stage center no longer pins offstage fights above us.
  const zoom=clamp(Math.min((W-200)/(right-left+420),(H-210)/(bottom-top+260)),minZoom,rule.maxZoom);
  camera.x=lerp(camera.x,target.x,.085);camera.y=lerp(camera.y,target.y,.08);
  // Pull out promptly when fighters separate, ease in more slowly when they meet.
  // Only 60 Hz effects() updates this state, independent of render frequency.
  camera.z=lerp(camera.z,clamp(zoom+cameraKick,rule.minZoom,rule.maxZoom+cameraKick),cameraKick>0?.2:zoom<camera.z?.15:.035);
  constrain();
  cameraKick*=.84;
 }
 function update(){
  updateCamera();if(hitstop>0)return;
  trails.forEach(p=>p.life--);trails=trails.filter(p=>p.life>0);
  for(const f of fighters){if(!f.respawn&&!f.hitlag&&f.grounded&&f.mode==='InitialDash'&&f.stateFrame===1)emit(f.x-f.face*8,f.y,'#e0dcd4',6,1.8);if(f.respawn||f.hitlag||!f.tumbling||f.hitstun<=0||f.lastKnockback<50||Math.hypot(f.vx,f.vy)<7||frame%2)continue;
   trails.push({x:f.x,y:f.y-f.character.ecb.height*.45,vx:f.vx,vy:f.vy,life:20,power:clamp(f.lastKnockback/140,.4,1.4),color:colors[f.color]});
  }if(trails.length>160)trails.splice(0,trails.length-160);
 }
 function drawWorld(){ctx.save();for(const p of trails){const age=20-p.life,t=age/20,r=(4+age*.55)*p.power;ctx.globalAlpha=(1-t)*.42;ellipse(p.x-p.vx*.025*age,p.y-p.vy*.025*age,r,r*.75,'#e6e9f2');ctx.globalAlpha=(1-t)*.24;ellipse(p.x,p.y,r*.5,r*.5,p.color);}ctx.restore();}
 function landing(f,speed,fast){const heavy=fast||f.tumbling||speed>12;GameAudio.cue(heavy?'land-heavy':'land-light',heavy?.85:.48,f);emit(f.x,f.y,'#e0dcd4',heavy?12:5,heavy?2.8:1.4);}
 function dodgeMotion(f){if(f.mode==='DirectionalAirDodge'&&f.stateFrame<=tuning.directionalDodgeFloat){f.vx*=tuning.directionalDodgeBrake;f.vy*=tuning.directionalDodgeBrake;return true;}if(f.mode==='NeutralAirDodge'&&f.stateFrame<=tuning.neutralDodgeFloat){f.vx*=tuning.neutralDodgeBrake;f.vy*=tuning.neutralDodgeBrake;return true;}return false;}
 return{tuning,reset,hitlag,shieldStun,impact,update,updateCamera,drawWorld,landing,dodgeMotion,get diagnostics(){return{trails:trails.length,cameraKick};}};
})();

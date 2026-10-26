'use strict';
// Generic intentions precede each character's authored CPU rules. Read the
// current resources; the legacy jumps flag cannot represent extra air jumps.
const CPUControl=(()=>{
 function base(f,o,floor,at,difficulty='normal',random=Math.random){
  const i=emptyInput();if(!floor||!o)return i;
  const dx=o.x-f.x,dist=Math.abs(dx),center=floor.x+floor.w/2,right=floor.x+floor.w;
  const rate=difficulty==='hard'?10:difficulty==='easy'?34:20;
  // Crossing the lip horizontally is not a completed recovery while the
  // feet are still below its catch height.
  const outside=f.x<floor.x||f.x>right,below=f.y>floor.y+8;
  const recovering=!f.grounded&&(outside||below),locked=f.hitstun>0||f.hitlag>0||!!f.pendingLaunch||f.respawn>0;
  const helpless=f.helpless||f.mode==='Helpless';
  if(recovering){
   i.x=Math.sign(center-f.x);
   // Preserve the jump until its reaction tick, rather than spending up-B
   // during the intervening frames. Deep falls get an immediate jump.
   if(!locked&&!f.attack&&!helpless&&f.y>floor.y-90){
    if(f.airJumps>0){if(f.vy>=0&&(at%16===0||f.y>floor.y+30))i.jump=true;}
    else if(!f.recovered&&f.vy>=0){i.y=-1;i.special=true;}
   }
   // Recovery does not enter the random offense/guard branch below.
  }else{
   // Keep ordinary defense inputs during stun: guard can buffer a tech.
   i.x=dist>65?Math.sign(dx):0;
   if(f.grounded&&(f.x<floor.x+5||f.x>right-5))i.x=Math.sign(center-f.x);
   if(!helpless&&o.y<f.y-90&&at%50===0&&(f.grounded||f.airJumps>0))i.jump=true;
   if(at%rate===f.id&&f.grounded&&dist<100)i.x=0;
   if(at%rate===0&&dist<240&&Math.abs(o.y-f.y)<125){
    const r=random();i.y=o.y<f.y-50*FIGHTER_SCALE?-1:random()<.2?1:0;
    if(r<.36)i.jab=true;else if(r<.66)i.heavy=true;else if(r<.82)i.special=true;else if(r<.94)i.smash=true;else i.grab=true;
   }
   if(o.attack&&dist<180&&difficulty!=='easy'&&random()<.055){i.guard=true;i.x=random()<.5?-Math.sign(dx):0;}
  }
  if(f.attack?.chargeFrame)i.charge=!recovering&&f.attack.chargeFrames<20;
  if(f.state==='ledge'){i.jump=true;i.x=Math.sign(center-f.x);}
  if(f.state==='grab')i.y=dist<60?-1:0;
  return i;
 }
 return{base};
})();

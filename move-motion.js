'use strict';
// Authored whole-pose sequences. Character files own the reviewed sprite indices.
// Never split a contact window: its index, hit ID and rehit clock stay intact.
const MoveMotion=(()=>{
 const plans=Object.create(null);
 function define(id,data){plans[id]=data;}
 function prepare(f){const a=f.attack,p=plans[f.characterId]?.[a.type];if(!p||a.special||a.ledgeStrike)return;
  const count=a.activeFrames.reduce((sum,w)=>sum+w.end-w.start+1,0);let elapsed=0;
  if(!count)a.pose=p.strike[0];
  a.activeFrames=a.activeFrames.map(w=>{const frames=Array.from({length:w.end-w.start+1},(_,i)=>p.strike[Math.min(p.strike.length-1,Math.floor((elapsed+i)*p.strike.length/count))]);elapsed+=frames.length;return{...w,motionPoseFrames:frames};});
  a.motionPlan=p;a.animation={...a.animation,anticipationPose:p.windup??a.animation.anticipationPose,accelerationPose:p.strike[0]};
 }
 return{define,prepare,plans};
})();

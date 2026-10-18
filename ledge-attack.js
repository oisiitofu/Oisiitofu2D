'use strict';
// A get-off-me strike, separate from the normal/special move kit. Preserve the
// character's existing climb-attack drawing, with one shared hit ID and long endlag.
const LedgeAttackTuning={
 move(f){const old=movesFor(f).ledge;return CombatData.createMove('崖上がり攻撃',8,
  [CombatData.window(8,10,'front',{pose:old.pose,hitID:'ledge'})],34,0,
  {pose:old.pose,soundFamily:old.soundFamily||'punch',damage:7,baseKnockback:2.4,knockbackGrowth:.018,angle:-.7,
   reach:120,preserveVelocity:false,airControlMultiplier:0,animation:{...old.animation,recoveryPose:0},ledgeStrike:true});}
};

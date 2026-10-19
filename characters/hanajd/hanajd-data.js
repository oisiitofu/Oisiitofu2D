'use strict';
const HanajdMoves=HanaKit.moves('hanajd');
const HanajdRules=HanaKit.rules('hanajd',HanajdMoves);
function hanajdPose(f){return HanaKit.pose(f);}
// Ready the same twin blades instead of inserting a deep crouch into every cut.
for(const [type,a]of Object.entries(HanajdMoves))if(!a.special)a.animation={...a.animation,anticipationPose:['low','downsmash'].includes(type)?3:a.aerial?2:20};

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(HanajdMoves.dragon,{rangedInterval:40,rangedRearm:20});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('hanajd',{"jab2":{"strike":[7],"windup":20},"upsmash":{"strike":[8,15],"windup":20},"smash":{"strike":[6,9],"windup":20},"jab3":{"strike":[6,7],"windup":20}});

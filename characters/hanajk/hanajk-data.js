'use strict';
const HanajkMoves=HanaKit.moves('hanajk');
const HanajkRules=HanaKit.rules('hanajk',HanajkMoves);
function hanajkPose(f){return HanaKit.pose(f);}

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(HanajkMoves.dragon,{rangedInterval:48,rangedRearm:24});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('hanajk',{"jab2":{"strike":[7],"windup":3},"upsmash":{"strike":[15,10],"windup":3},"smash":{"strike":[13,9],"windup":3},"jab3":{"strike":[6,7],"windup":3}});

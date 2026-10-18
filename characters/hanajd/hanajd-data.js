'use strict';
const HanajdMoves=HanaKit.moves('hanajd');
const HanajdRules=HanaKit.rules('hanajd',HanajdMoves);
function hanajdPose(f){return HanaKit.pose(f);}

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(HanajdMoves.dragon,{rangedInterval:40,rangedRearm:20});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('hanajd',{"jab2":{"strike":[7],"windup":3},"upsmash":{"strike":[15,10],"windup":3},"smash":{"strike":[13,9],"windup":3},"jab3":{"strike":[6,7],"windup":3}});

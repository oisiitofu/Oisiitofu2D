'use strict';
const HanajsMoves=HanaKit.moves('hanajs');
const HanajsRules=HanaKit.rules('hanajs',HanajsMoves);
function hanajsPose(f){return HanaKit.pose(f);}

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(HanajsMoves.dragon,{rangedInterval:32,rangedRearm:16});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('hanajs',{"jab2":{"strike":[7],"windup":3},"upsmash":{"strike":[15,10],"windup":3},"smash":{"strike":[13,9],"windup":3},"jab3":{"strike":[6,7],"windup":3}});

'use strict';
const MetalgreymonMoves=DigimonKit.moves('metalgreymon');
const MetalgreymonRules=DigimonKit.rules('metalgreymon',MetalgreymonMoves);
function metalgreymonPose(f){return DigimonKit.pose(f);}

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(MetalgreymonMoves.dragon,{rangedInterval:48,rangedRearm:24});

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(MetalgreymonMoves.dash,{rangedInterval:78,rangedRearm:40});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('metalgreymon',{"upsmash":{"strike":[15,10],"windup":3},"smash":{"strike":[13,9],"windup":3},"jab2":{"strike":[7],"windup":3},"jab3":{"strike":[6,7],"windup":3}});

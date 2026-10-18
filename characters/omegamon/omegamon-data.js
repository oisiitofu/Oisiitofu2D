'use strict';
const OmegamonMoves=DigimonKit.moves('omegamon');
const OmegamonRules=DigimonKit.rules('omegamon',OmegamonMoves);
function omegamonPose(f){return DigimonKit.pose(f);}

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(OmegamonMoves.dragon,{rangedInterval:48,rangedRearm:24});

// Reviewed whole-body attack sequences; timings and hit identities stay shared.
MoveMotion.define('omegamon',{"upsmash":{"strike":[15,10],"windup":3},"smash":{"strike":[13,9],"windup":3},"jab2":{"strike":[7],"windup":3},"jab3":{"strike":[6,7],"windup":3}});

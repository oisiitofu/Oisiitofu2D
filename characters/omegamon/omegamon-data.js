'use strict';
const OmegamonMoves=DigimonKit.moves('omegamon');
const OmegamonRules=DigimonKit.rules('omegamon',OmegamonMoves);
function omegamonPose(f){return DigimonKit.pose(f);}

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(OmegamonMoves.dragon,{rangedInterval:48,rangedRearm:24});

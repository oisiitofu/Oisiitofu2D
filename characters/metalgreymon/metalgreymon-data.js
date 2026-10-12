'use strict';
const MetalgreymonMoves=DigimonKit.moves('metalgreymon');
const MetalgreymonRules=DigimonKit.rules('metalgreymon',MetalgreymonMoves);
function metalgreymonPose(f){return DigimonKit.pose(f);}

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(MetalgreymonMoves.dragon,{rangedInterval:48,rangedRearm:24});

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(MetalgreymonMoves.dash,{rangedInterval:78,rangedRearm:40});

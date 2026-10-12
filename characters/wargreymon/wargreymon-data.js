'use strict';
const WargreymonMoves=DigimonKit.moves('wargreymon');
const WargreymonRules=DigimonKit.rules('wargreymon',WargreymonMoves);
function wargreymonPose(f){return DigimonKit.pose(f);}

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(WargreymonMoves.dragon,{rangedInterval:48,rangedRearm:24});

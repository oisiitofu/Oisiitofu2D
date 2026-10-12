'use strict';
const HanajkMoves=HanaKit.moves('hanajk');
const HanajkRules=HanaKit.rules('hanajk',HanajkMoves);
function hanajkPose(f){return HanaKit.pose(f);}

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(HanajkMoves.dragon,{rangedInterval:48,rangedRearm:24});

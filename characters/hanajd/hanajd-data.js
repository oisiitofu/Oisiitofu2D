'use strict';
const HanajdMoves=HanaKit.moves('hanajd');
const HanajdRules=HanaKit.rules('hanajd',HanajdMoves);
function hanajdPose(f){return HanaKit.pose(f);}

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(HanajdMoves.dragon,{rangedInterval:40,rangedRearm:20});

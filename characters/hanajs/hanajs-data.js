'use strict';
const HanajsMoves=HanaKit.moves('hanajs');
const HanajsRules=HanaKit.rules('hanajs',HanajsMoves);
function hanajsPose(f){return HanaKit.pose(f);}

// Measured fast projectile repeat: preserve motion recovery, rearm only ranged casts.
Object.assign(HanajsMoves.dragon,{rangedInterval:32,rangedRearm:16});

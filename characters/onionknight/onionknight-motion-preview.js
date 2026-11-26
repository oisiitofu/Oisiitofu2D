'use strict';

// Normal armor. The original stance and forward thrust remain at frames 1 and 9.
MotionPreview.register('onionknight',{
 smash:{
  label:'横スマッシュ',
  matches:f=>f.grounded&&f.attack.startupFrames===23&&BattleSize.imagePose(f,pose(f))===0,
  frames:{
   6:{src:'characters/onionknight/assets/motion-preview-smash-02.webp',left:-43,width:71,bottom:-2},
   7:{src:'characters/onionknight/assets/motion-preview-smash-03.webp',left:-49,width:85,bottom:-2},
   8:{src:'characters/onionknight/assets/motion-preview-smash-04.webp',left:-58,width:111,bottom:-2}
  }
 }
});

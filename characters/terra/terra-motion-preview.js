'use strict';

// Only the normal form, between the original stance and the palm thrust.
MotionPreview.register('terra',{
 smash:{
  label:'横スマッシュ',
  matches:f=>f.grounded&&f.attack.startupFrames===23&&BattleSize.imagePose(f,pose(f))===0,
  frames:{
   6:{src:'characters/terra/assets/motion-preview-smash-02.webp',left:-42,width:69,bottom:-1},
   7:{src:'characters/terra/assets/motion-preview-smash-03.webp',left:-49,width:92,bottom:-1},
   8:{src:'characters/terra/assets/motion-preview-smash-04.webp',left:-56,width:102,bottom:-1}
  }
 }
});

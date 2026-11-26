'use strict';

// Insert the sword arc between the original windup (69) and lunge (23).
MotionPreview.register('zack',{
 smash:{
  label:'横スマッシュ',
  matches:f=>f.grounded&&f.attack.startupFrames===23&&BattleSize.imagePose(f,pose(f))===69,
  frames:{
   6:{src:'characters/zack/assets/motion-preview-smash-06.webp',left:-68,width:132,bottom:-1},
   7:{src:'characters/zack/assets/motion-preview-smash-07.webp',left:-48,width:140,bottom:-1},
   8:{src:'characters/zack/assets/motion-preview-smash-08.webp',left:-70,width:181,bottom:-1}
  }
 }
});

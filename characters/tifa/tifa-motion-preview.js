'use strict';

// Add steps between the existing raster poses 49 and 50. Keep stance 40 and punch 42.
MotionPreview.register('tifa',{
 smash:{
  label:'横スマッシュ',
  matches:f=>f.grounded&&TifaRasterAnimation.sample(f)?.pose===49,
  frames:{
   6:{src:'characters/tifa/assets/motion-preview-smash-02.webp',left:-44,width:87,bottom:-2},
   7:{src:'characters/tifa/assets/motion-preview-smash-03.webp',left:-44,width:87,bottom:-2},
   8:{src:'characters/tifa/assets/motion-preview-smash-04.webp',left:-44,width:87,bottom:-2}
  }
 }
});

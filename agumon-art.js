'use strict';
// Torso centers relative to each cropped pose, calibrated after visual inspection.
const AgumonArtAnchors=[.48,.48,.52,.51,.48,.5,.45,.62,.48,.45,.5,.5,.48,.46,.59,.55,.5,.58,.48,.5,.5,.5,.55,.5,...Array(16).fill(.56)];
// The lower row is staggered. These source regions keep neighboring fire tips
// out of each effect while retaining its original RGBA pixels.
function extractAgumonEffects(image){
 const boxes=[[0,75,430,354],[442,0,467,447],[915,0,460,430],[1380,0,394,443],[0,429,443,458],[443,447,503,440],[885,447,550,440],[1435,447,339,440]];
 const borders={5:[[443,447],[944,447],[944,700],[885,712],[885,887],[443,887]],6:[[944,447],[1435,447],[1435,887],[885,887],[885,712],[944,700]]};
 return boxes.map(([x,y,w,h],n)=>{const c=document.createElement('canvas'),sx=image.width/1774,sy=image.height/887;c.width=Math.ceil(w*sx);c.height=Math.ceil(h*sy);const g=c.getContext('2d');if(borders[n]){g.beginPath();borders[n].forEach(([px,py],i)=>g[i?'lineTo':'moveTo']((px-x)*sx,(py-y)*sy));g.closePath();g.clip();}g.drawImage(image,-x*sx,-y*sy);return c;});
}

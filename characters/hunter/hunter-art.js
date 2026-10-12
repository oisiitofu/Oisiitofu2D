'use strict';
// Body pivots exclude the large sword and trailing cape. Keeping the torso at
// fighter.x prevents the long forward blade from shifting the hunter backwards.
const HunterArtAnchors=[.633,.65,.65,.70,.62,.65,.424,.567,.51,.424,.65,.682,.70,.527,.60,.60,.68,.40,.509,.50,.50,.50,.57,.50,...Array(8).fill(.69),...Array(8).fill(.66)];
// Soft VFX glows can join across neighboring cells. Preserve authored cell boundaries.
function extractHunterEffects(sheet){return Array.from({length:8},(_,n)=>{const w=sheet.width/4,h=sheet.height/2,c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,n%4*w,Math.floor(n/4)*h,w,h,0,0,w,h);return c;});}

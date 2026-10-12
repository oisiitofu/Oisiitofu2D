'use strict';
const PawapuroArtAnchors=[.5,.5,.5,.5,.5,.5,.4,.6,.5,.4,.5,.5,.5,.5,.5,.5,.4,.45,.5,.5,.5,.5,.5,.5,...Array(16).fill(.5),.5,.5,.5,.5,.5,.5,.4,.5];
// Preserve original RGBA while accounting for the first ball's slightly wider cell.
function extractPawapuroEffects(image){return [[0,0,460,443],[460,0,427,443],[887,0,444,443],[1331,0,443,443],[0,443,444,444],[444,443,443,444],[887,443,444,444],[1331,443,443,444]].map(([x,y,w,h])=>{const c=document.createElement('canvas'),sx=image.width/1774,sy=image.height/887;c.width=Math.ceil(w*sx);c.height=Math.ceil(h*sy);c.getContext('2d').drawImage(image,-x*sx,-y*sy);return c;});}

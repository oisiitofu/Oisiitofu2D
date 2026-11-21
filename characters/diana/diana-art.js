'use strict';
const DianaArtRects={"frames":[[2,2,114,246],[120,2,153,238],[277,2,159,237],[440,2,176,235],[620,2,158,181],[782,2,177,196],[963,2,146,242],[1113,2,153,244],[1270,2,127,251],[1401,2,131,183],[1536,2,213,246],[1753,2,205,221],[2,257,213,214],[219,257,203,226],[426,257,128,243],[558,257,176,244],[738,257,254,357],[996,257,224,354],[1224,257,161,234],[1389,257,238,95],[1631,257,104,247],[1739,257,105,246],[1848,257,194,171],[2,618,179,178],[185,618,206,242],[395,618,231,237],[630,618,218,234],[852,618,268,219],[1124,618,164,243],[1292,618,265,179],[1561,618,265,173],[2,865,220,220],[226,865,173,247],[403,865,177,186],[584,865,205,224],[793,865,251,205],[1048,865,255,212],[1307,865,173,242],[1484,865,185,189],[1673,865,176,174],[2,1116,612,612]],"effects":[],"anchors":[0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5],"pads":[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],"grip":[0.12,0.9],"portrait":40,"body":238,"height":78};
async function loadDianaArt(){
 if(ArtLoader.enabled&&await ArtLoader.load('diana'))return;
 const sheet=new Image();sheet.src='characters/diana/assets/diana-native.png';await sheet.decode();
 const crop=([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;};
 const frames=DianaArtRects.frames.map(crop),effects=DianaArtRects.effects.map(crop);
 characterArt.diana={frames,effects,tints:Array.from({length:5},(_,ci)=>frames.map(img=>ArtLoader.tint(img,'diana',ci)))};
}
function dianaNativeScale(){return 78/(238*FIGHTER_SCALE);}

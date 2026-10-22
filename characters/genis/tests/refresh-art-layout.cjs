'use strict';
const fs=require('fs'),root='characters/genis',meta=JSON.parse(fs.readFileSync(root+'/tests/art-layout.json')),body=JSON.parse(fs.readFileSync(root+'/tests/body-measurements.json'));
function replace(file,pattern,value){const text=fs.readFileSync(file,'utf8');if(!pattern.test(text))throw Error(file+' missing Genis metadata');fs.writeFileSync(file,text.replace(pattern,value));}
replace('newcomer-art.js',/genis:\[[^\]]*\]/,'genis:'+JSON.stringify(meta.anchors));
replace('stage-system.js',/genis:\[[^\]]*\]/,'genis:'+JSON.stringify(meta.grip));
replace('player-system.js',/(CharacterData\.genis=\{[^\n]*?"ledgeGrip":)\[[^\]]*\]/,'$1'+JSON.stringify(meta.grip));
replace('battle-size.js',/(const calibration=\{genis:)\{[^}]*\}/,'$1'+JSON.stringify({height:78,body:body[0].body,neutral:1,pads:meta.pads}));
replace('motion-size.js',/"genis":\{[^}]*\}/,'"genis":'+JSON.stringify({scale:meta.frames.map(()=>1),pad:meta.pads}));
console.log('Updated only Genis anchors, pads and body calibration.');

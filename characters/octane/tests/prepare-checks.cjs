'use strict';const fs=require('fs'),p='characters/octane/tests/';
const f='characters/octane/octane-data.js';fs.writeFileSync(f,fs.readFileSync(f,'utf8').replaceAll("'metal'","'hammer'"));
for(const name of ['visual-test.cjs','motion-video.cjs','cpu-test.cjs','calibrate-throw.cjs','public-check.cjs']){let s=fs.readFileSync('characters/jett/tests/'+name,'utf8').replaceAll('jett','octane').replaceAll('Jett','Octane');fs.writeFileSync(p+name,s);}
// Show the actual slide, its voluntary jump, placed pad, and stim stages.
let s=fs.readFileSync(p+'visual-test.cjs','utf8').replace("{type:'dash',t:16},{type:'dash',t:32,follow:true}","{type:'dash',t:21},{type:'dash',t:26,follow:true}").replace("specialHeld:!!v.held||!!v.follow&&k%10===1","jump:!!v.follow&&k===18,specialHeld:!!v.held");fs.writeFileSync(p+'visual-test.cjs',s);

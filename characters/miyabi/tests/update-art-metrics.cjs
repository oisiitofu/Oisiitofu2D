'use strict';
// Refresh ONLY this character's authored geometry after reviewed art repairs.
const fs=require('fs'),assert=require('assert/strict'),root='characters/miyabi',meta=JSON.parse(fs.readFileSync(root+'/tests/art-layout.json')),measure=JSON.parse(fs.readFileSync(root+'/tests/body-measurements.json'));
function change(file,pattern,value){const s=fs.readFileSync(file,'utf8');assert.ok(pattern.test(s),file);fs.writeFileSync(file,s.replace(pattern,value));}
change('battle-size.js',/miyabi:\{"height":94,"body":\d+,"neutral":1,"pads":\[[^\]]*\]\}/,'miyabi:'+JSON.stringify({height:94,body:measure[0].body,neutral:1,pads:meta.pads}));
change('motion-size.js',/"miyabi":\{"scale":\[[^\]]*\],"pad":\[[^\]]*\]\}/,'"miyabi":'+JSON.stringify({scale:meta.frames.map(()=>1),pad:meta.pads}));
change('stage-system.js',/miyabi:\[[^\]]*\]/,'miyabi:'+JSON.stringify(meta.grip));
const physicsFile='player-system.js',source=fs.readFileSync(physicsFile,'utf8'),match=source.match(/CharacterData\.miyabi=\{\.\.\.CharacterData\.dragoon,\.\.\.(\{[^;]+\})\};/);assert.ok(match);const physics=JSON.parse(match[1]);physics.ledgeGrip=meta.grip;fs.writeFileSync(physicsFile,source.replace(match[0],'CharacterData.miyabi={...CharacterData.dragoon,...'+JSON.stringify(physics)+'};'));
const r=JSON.parse(fs.readFileSync(root+'/tests/registration.json'));r.physics=physics;fs.writeFileSync(root+'/tests/registration.json',JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify({body:measure[0].body,grip:meta.grip,poses:meta.frames.length}));

const fs=require('fs');
let s=fs.readFileSync('.tools/newcomer-test.cjs','utf8').split(' for(const face of [-1,1]){\n [f,o]=reset();f.face=face;attack(f,\'dragon\');')[0];
s=s.replace("terrarian:TerrarianMoves}","terrarian:TerrarianMoves,horse:HorseMoves}").replace("terrarian:TerrarianRules}","terrarian:TerrarianRules,horse:HorseRules}").replace("terrarian:TerrarianVFX}","terrarian:TerrarianVFX,horse:HorseVFX}").replace("terrarian:'50'}","terrarian:'50',horse:'51'}").replace('art.effects.length===8','art.effects.length===16');
if(!s.includes("const tap"))s+=fs.readFileSync('.tools/horse-special-checks.txt','utf8');else throw Error('Failed to cut shared test prefix');
s+="\n return out;},id);console.log(JSON.stringify({id,total:checks.length,failed:checks.filter(c=>!c.pass),errors},null,2));await b.close();if(errors.length||checks.some(c=>!c.pass))process.exitCode=1;};\n";
fs.writeFileSync('.tools/horse-test.cjs',s);fs.writeFileSync('horse-test.cjs',"require('./.tools/horse-test.cjs')('horse').catch(e=>{console.error(e);process.exitCode=1;});\n");
let p=fs.readFileSync('player-system.js','utf8');const grip=JSON.parse(fs.readFileSync('.tools/horse-art-inspection.json','utf8')).result.horse.grip;p=p.replace('CharacterData.horse={...CharacterData.dragoon,','CharacterData.horse={...CharacterData.dragoon,ledgeGrip:'+JSON.stringify(grip)+',');fs.writeFileSync('player-system.js',p);

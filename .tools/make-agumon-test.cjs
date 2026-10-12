const fs=require('fs');
let s=fs.readFileSync('.tools/three-fighter-test.cjs','utf8');
s=s.slice(0,s.indexOf(" if(id==='adol'){"))+fs.readFileSync('.tools/agumon-checks.txt','utf8')+s.slice(s.lastIndexOf(' return out;'));
s=s.replace("{adol:AdolMoves,terry:TerryMoves,valkyrie:ValkyrieMoves}",'{agumon:AgumonMoves}').replace('{adol:AdolRules,terry:TerryRules,valkyrie:ValkyrieRules}','{agumon:AgumonRules}').replace('{adol:AdolVFX,terry:TerryVFX,valkyrie:ValkyrieVFX}','{agumon:AgumonVFX}').replace("{adol:'42',terry:'43',valkyrie:'44'}","{agumon:'45'}");
// Failure details must never contain cyclic fighter/owner references.
s=s.replace('{a:f.attack,damage:o.damage,mode:o.mode}','{a:f.attack?.type,damage:o.damage,mode:o.mode}');
fs.writeFileSync('characters/agumon/tests/helpers/agumon-test.cjs',s);
fs.writeFileSync('characters/agumon/tests/agumon-test.cjs',"require('./characters/agumon/tests/helpers/agumon-test.cjs')('agumon');\n");

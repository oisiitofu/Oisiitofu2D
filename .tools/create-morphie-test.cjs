const fs=require('fs');let s=fs.readFileSync('characters/akira/tests/helpers/akira-test.cjs','utf8');s=s.slice(0,s.indexOf(' for(let k=0;k<4;k++){[f,o]=reset();f.akiraLegion'));
s=s.replaceAll('akira','morphie').replaceAll('Akira','Morphie').replace("morphie:'53'","morphie:'54'");s=s.replace('rules.tick();}};','MorphieRules.statusTick();rules.tick();}};');
s=s.replace('f.timer=t;if(!!attackBoxes',"f.timer=t;if(f.attack.buttRocket){f.attack.launched=f.attack.thrusting=true;f.attack.thrustY=-12;}if(!!attackBoxes");
s=s.replaceAll('x:ix,y:-1','x:ix,y:-1,specialHeld:true').replaceAll('x:-1,y:-1','x:-1,y:-1,specialHeld:true');
s+=fs.readFileSync('.tools/morphie-status-test-extra.txt','utf8')+fs.readFileSync('.tools/morphie-test-extra.txt','utf8');fs.writeFileSync('characters/morphie/tests/helpers/morphie-test.cjs',s);fs.writeFileSync('characters/morphie/tests/morphie-test.cjs',"require('./characters/morphie/tests/helpers/morphie-test.cjs')('morphie');\n");

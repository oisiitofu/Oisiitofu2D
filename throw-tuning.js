'use strict';
// Normal grabs use this table only at release. Specials that borrow a throw
// template keep their authored power and cannot inherit these role changes.
const ThrowTuning=(()=>{
 const directions=['forwardThrow','backThrow','upThrow','downThrow'];
 const groups={
  balanced:'ryuta mono felyne sackboy rayman quote battlecat ringfit qbby ryoku tails etna ratchet astro sam reimu zack presea hachiware tidus terra onionknight arthur sakura billy riesz edea narmaya wonder rena gran welch zoe ky alphen ash judas rion sol miyabi zero3 dana isaac ulgrim monokuma roxas twob zero lightning rean estelle noctis clive narukami rex luke fayt noah lloyd shiren hunter adol terry valkyrie haseo terrarian chef morphie human kitten elma goemon metabee nier dante leon charlotta twinbee edf arus maelle sumino frog tressa eve saki hanajk hanajd kisuke ray alain hinako megamanexe fiora krystal malenia alucard kurabe shizuna',
  rising:'dragoon gundam kosmos pawapuro horse bayleef piposaru pneuma odio laharl kasane greymon metalgreymon wargreymon omegamon hanajs c4621',
  agile:'parappa octane jett viewtifuljoe ellen chibirobo octoling chiikawa chocobo riki rin makoto neku pokoa jibanyan zidane yuffie crash knight shadow moogle cojicoji hornet klonoa karateka aiai hayabusa',
  grappler:'agumon akira fei tifa kiryu ryofu edelgard guile sukapon doshin kingbonby',
  caster:'mallow veronica ashley lip shionne genis viridi vivi nia colette will emma ryza midna bomberman sans headmaster sakuna miku naruhodo layton vincent mametchi aruru maruku dietrich rocbouquet deemo aerith donchan melia yuri toro katamari okami battlemage naegi'
 };
 // Weapon specialists keep useful positioning throws; supernatural and
 // power identities get the designated KO directions below.
 groups.blade='shovelknight aloy io raguna anubis jehuty elza nahobino django enoch zack tidus arthur sakura edea narmaya gran ky alphen ash judas rion sol miyabi zero3 dana ulgrim roxas twob zero lightning rean noctis clive narukami rex luke fayt noah lloyd shiren hunter adol terry valkyrie haseo terrarian nier dante charlotta arus maelle frog eve saki hanajk hanajd kisuke ray alain hinako fiora malenia alucard shizuna knight hornet hayabusa';
 groups.psion='kasane neku midna emma pneuma laharl odio will melia battlemage reimu rocbouquet deemo';
 groups.power='nargacuga nightraven estark agumon akira fei tifa kiryu ryofu edelgard guile sukapon doshin kingbonby presea zoe greymon metalgreymon wargreymon omegamon';
 // Per-character selections, rather than roster-number/modulo assignments.
 const assignments=Object.fromEntries(Object.entries(groups).flatMap(([group,ids])=>ids.split(' ').map(id=>[id,group])));
 const roles={
  balanced:['position','ko','juggle','combo'],
  rising:['position','position','ko','combo'],
  agile:['combo','ko','juggle','combo'],
  grappler:['ko','position','juggle','combo'],
  caster:['position','position','ko','combo'],
  blade:['position','position','ko','combo'],
  psion:['position','position','ko','combo'],
  power:['ko','position','juggle','combo']
 };
 // Every direction gains a useful percent-independent launch. Finishers are
 // calibrated separately so the increased base cannot make low-percent KOs.
 const profiles={
  balanced:[[43,.028],[40,.048],[82,.045],[59,.030]],
  rising:[[36,.028],[48,.028],[85,.058],[62,.030]],
  agile:[[54,.025],[40,.046],[78,.044],[55,.028]],
  grappler:[[37,.050],[46,.028],[84,.046],[61,.032]],
  caster:[[50,.026],[46,.027],[86,.055],[63,.030]],
  blade:[[45,.021],[43,.021],[80,.045],[58,.030]],
  psion:[[43,.029],[46,.029],[86,.058],[62,.032]],
  power:[[37,.047],[46,.027],[84,.048],[60,.032]]
 };
 // These named choices take precedence over broad weapon/group assignments.
 // Keep an existing finisher when a named down/up throw adds a second one.
 const koDirections={};
 for(const id of 'tifa kiryu presea zoe doshin kingbonby kasane odio midna rocbouquet genis'.split(' '))koDirections[id]='downThrow';
 for(const id of 'lloyd zack arthur'.split(' '))koDirections[id]='downThrow';
 for(const id of 'dragoon gundam kosmos pawapuro horse bayleef piposaru pneuma laharl greymon metalgreymon wargreymon omegamon hanajs c4621 fiora narmaya'.split(' '))koDirections[id]='upThrow';
 koDirections.ulgrim='upThrow';
 // Launch coefficients are populated from real grab-release flight checks.
 const koGrowth={forwardThrow:.043,backThrow:.043,upThrow:.065,downThrow:.075};
 const koCalibration={
  "reimu":{"upThrow":{"growth":0.062261,"percent":160}},
  "zack":{"downThrow":{"growth":0.083223,"percent":180}},
  "presea":{"forwardThrow":{"growth":0.052795,"percent":150},"downThrow":{"growth":0.094566,"percent":155}},
  "hachiware":{"backThrow":{"growth":0.051591,"percent":160}},
  "tidus":{"upThrow":{"growth":0.060238,"percent":180}},
  "terra":{"backThrow":{"growth":0.051591,"percent":160}},
  "onionknight":{"backThrow":{"growth":0.051591,"percent":160}},
  "arthur":{"downThrow":{"growth":0.083223,"percent":180}},
  "sakura":{"upThrow":{"growth":0.060238,"percent":180}},
  "viewtifuljoe":{"backThrow":{"growth":0.047831,"percent":175}},
  "shionne":{"upThrow":{"growth":0.061138,"percent":170}},
  "genis":{"upThrow":{"growth":0.061138,"percent":170},"downThrow":{"growth":0.086903,"percent":175}},
  "ellen":{"backThrow":{"growth":0.047831,"percent":175}},
  "billy":{"backThrow":{"growth":0.051591,"percent":160}},
  "narmaya":{"upThrow":{"growth":0.060528,"percent":180}},
  "wonder":{"backThrow":{"growth":0.051591,"percent":160}},
  "rena":{"backThrow":{"growth":0.051591,"percent":160}},
  "gran":{"upThrow":{"growth":0.060238,"percent":180}},
  "welch":{"backThrow":{"growth":0.051591,"percent":160}},
  "zoe":{"forwardThrow":{"growth":0.052795,"percent":150},"downThrow":{"growth":0.094566,"percent":155}},
  "ky":{"upThrow":{"growth":0.060238,"percent":180}},
  "alphen":{"upThrow":{"growth":0.060238,"percent":180}},
  "ash":{"upThrow":{"growth":0.060238,"percent":180}},
  "judas":{"upThrow":{"growth":0.060238,"percent":180}},
  "rion":{"upThrow":{"growth":0.060238,"percent":180}},
  "sol":{"upThrow":{"growth":0.060238,"percent":180}},
  "miyabi":{"upThrow":{"growth":0.060238,"percent":180}},
  "zero3":{"upThrow":{"growth":0.060238,"percent":180}},
  "dana":{"upThrow":{"growth":0.060238,"percent":180}},
  "dragoon":{"upThrow":{"growth":0.064147,"percent":160}},
  "isaac":{"backThrow":{"growth":0.051591,"percent":160}},
  "ulgrim":{"upThrow":{"growth":0.060238,"percent":180}},
  "chiikawa":{"backThrow":{"growth":0.047831,"percent":175}},
  "chocobo":{"backThrow":{"growth":0.047831,"percent":175}},
  "monokuma":{"backThrow":{"growth":0.051591,"percent":160}},
  "riki":{"backThrow":{"growth":0.047831,"percent":175}},
  "roxas":{"upThrow":{"growth":0.060238,"percent":180}},
  "twob":{"upThrow":{"growth":0.060238,"percent":180}},
  "okami":{"upThrow":{"growth":0.061138,"percent":170}},
  "gundam":{"upThrow":{"growth":0.064623,"percent":160}},
  "vivi":{"upThrow":{"growth":0.060913,"percent":170}},
  "zero":{"upThrow":{"growth":0.060238,"percent":180}},
  "rin":{"backThrow":{"growth":0.047831,"percent":175}},
  "nia":{"upThrow":{"growth":0.061138,"percent":170}},
  "lightning":{"upThrow":{"growth":0.060238,"percent":180}},
  "colette":{"upThrow":{"growth":0.061138,"percent":170}},
  "rean":{"upThrow":{"growth":0.060238,"percent":180}},
  "estelle":{"backThrow":{"growth":0.051591,"percent":160}},
  "noctis":{"upThrow":{"growth":0.060238,"percent":180}},
  "clive":{"upThrow":{"growth":0.060238,"percent":180}},
  "makoto":{"backThrow":{"growth":0.047831,"percent":175}},
  "neku":{"upThrow":{"growth":0.062261,"percent":160}},
  "narukami":{"upThrow":{"growth":0.060238,"percent":180}},
  "naegi":{"upThrow":{"growth":0.061138,"percent":170}},
  "rex":{"upThrow":{"growth":0.060238,"percent":180}},
  "luke":{"upThrow":{"growth":0.060238,"percent":180}},
  "will":{"upThrow":{"growth":0.062261,"percent":160}},
  "kosmos":{"upThrow":{"growth":0.064325,"percent":160}},
  "fayt":{"upThrow":{"growth":0.060238,"percent":180}},
  "emma":{"upThrow":{"growth":0.062261,"percent":160}},
  "ryza":{"upThrow":{"growth":0.061138,"percent":170}},
  "noah":{"upThrow":{"growth":0.060238,"percent":180}},
  "midna":{"upThrow":{"growth":0.062261,"percent":160},"downThrow":{"growth":0.089954,"percent":165}},
  "bomberman":{"upThrow":{"growth":0.061138,"percent":170}},
  "sans":{"upThrow":{"growth":0.061138,"percent":170}},
  "lloyd":{"downThrow":{"growth":0.083223,"percent":180}},
  "shiren":{"upThrow":{"growth":0.060238,"percent":180}},
  "pokoa":{"backThrow":{"growth":0.047831,"percent":175}},
  "hunter":{"upThrow":{"growth":0.060238,"percent":180}},
  "adol":{"upThrow":{"growth":0.060238,"percent":180}},
  "terry":{"upThrow":{"growth":0.060238,"percent":180}},
  "valkyrie":{"upThrow":{"growth":0.060238,"percent":180}},
  "agumon":{"forwardThrow":{"growth":0.052795,"percent":150}},
  "pawapuro":{"upThrow":{"growth":0.065485,"percent":160}},
  "headmaster":{"upThrow":{"growth":0.061138,"percent":170}},
  "sakuna":{"upThrow":{"growth":0.061138,"percent":170}},
  "haseo":{"upThrow":{"growth":0.060238,"percent":180}},
  "terrarian":{"upThrow":{"growth":0.060238,"percent":180}},
  "horse":{"upThrow":{"growth":0.064817,"percent":160}},
  "chef":{"backThrow":{"growth":0.051591,"percent":160}},
  "akira":{"forwardThrow":{"growth":0.052795,"percent":150}},
  "morphie":{"backThrow":{"growth":0.051591,"percent":160}},
  "fei":{"forwardThrow":{"growth":0.052795,"percent":150}},
  "human":{"backThrow":{"growth":0.051591,"percent":160}},
  "kitten":{"backThrow":{"growth":0.051591,"percent":160}},
  "elma":{"backThrow":{"growth":0.051591,"percent":160}},
  "goemon":{"backThrow":{"growth":0.051591,"percent":160}},
  "bayleef":{"upThrow":{"growth":0.064221,"percent":160}},
  "metabee":{"backThrow":{"growth":0.051591,"percent":160}},
  "nier":{"upThrow":{"growth":0.060238,"percent":180}},
  "miku":{"upThrow":{"growth":0.061138,"percent":170}},
  "naruhodo":{"upThrow":{"growth":0.061138,"percent":170}},
  "jibanyan":{"backThrow":{"growth":0.047831,"percent":175}},
  "layton":{"upThrow":{"growth":0.061138,"percent":170}},
  "dante":{"upThrow":{"growth":0.060238,"percent":180}},
  "leon":{"backThrow":{"growth":0.051591,"percent":160}},
  "tifa":{"forwardThrow":{"growth":0.056245,"percent":150},"downThrow":{"growth":0.093413,"percent":155}},
  "zidane":{"backThrow":{"growth":0.047831,"percent":175}},
  "yuffie":{"backThrow":{"growth":0.047831,"percent":175}},
  "vincent":{"upThrow":{"growth":0.061138,"percent":170}},
  "kiryu":{"forwardThrow":{"growth":0.051913,"percent":150},"downThrow":{"growth":0.094566,"percent":155}},
  "crash":{"backThrow":{"growth":0.047831,"percent":175}},
  "charlotta":{"upThrow":{"growth":0.060238,"percent":180}},
  "ryofu":{"forwardThrow":{"growth":0.050098,"percent":150}},
  "mametchi":{"upThrow":{"growth":0.061138,"percent":170}},
  "piposaru":{"upThrow":{"growth":0.065198,"percent":160}},
  "twinbee":{"backThrow":{"growth":0.051591,"percent":160}},
  "aruru":{"upThrow":{"growth":0.061138,"percent":170}},
  "maruku":{"upThrow":{"growth":0.061138,"percent":170}},
  "dietrich":{"upThrow":{"growth":0.061138,"percent":170}},
  "edf":{"backThrow":{"growth":0.051591,"percent":160}},
  "edelgard":{"forwardThrow":{"growth":0.052795,"percent":150}},
  "guile":{"forwardThrow":{"growth":0.052795,"percent":150}},
  "sukapon":{"forwardThrow":{"growth":0.052795,"percent":150}},
  "pneuma":{"upThrow":{"growth":0.062261,"percent":160}},
  "arus":{"upThrow":{"growth":0.060238,"percent":180}},
  "knight":{"upThrow":{"growth":0.060238,"percent":180}},
  "maelle":{"upThrow":{"growth":0.060238,"percent":180}},
  "sumino":{"backThrow":{"growth":0.051591,"percent":160}},
  "rocbouquet":{"upThrow":{"growth":0.062157,"percent":160},"downThrow":{"growth":0.089954,"percent":165}},
  "frog":{"upThrow":{"growth":0.060238,"percent":180}},
  "tressa":{"backThrow":{"growth":0.051591,"percent":160}},
  "eve":{"upThrow":{"growth":0.060238,"percent":180}},
  "odio":{"upThrow":{"growth":0.062157,"percent":160},"downThrow":{"growth":0.089954,"percent":165}},
  "laharl":{"upThrow":{"growth":0.062972,"percent":160}},
  "deemo":{"upThrow":{"growth":0.062261,"percent":160}},
  "kasane":{"upThrow":{"growth":0.062972,"percent":160},"downThrow":{"growth":0.089954,"percent":165}},
  "shadow":{"backThrow":{"growth":0.047831,"percent":175}},
  "saki":{"upThrow":{"growth":0.060238,"percent":180}},
  "aerith":{"upThrow":{"growth":0.061138,"percent":170}},
  "doshin":{"forwardThrow":{"growth":0.052795,"percent":150},"downThrow":{"growth":0.094566,"percent":155}},
  "moogle":{"backThrow":{"growth":0.047831,"percent":175}},
  "greymon":{"forwardThrow":{"growth":0.052795,"percent":150},"upThrow":{"growth":0.062753,"percent":160}},
  "metalgreymon":{"forwardThrow":{"growth":0.052795,"percent":150},"upThrow":{"growth":0.062558,"percent":160}},
  "wargreymon":{"forwardThrow":{"growth":0.052795,"percent":150},"upThrow":{"growth":0.062394,"percent":160}},
  "omegamon":{"forwardThrow":{"growth":0.049095,"percent":150},"upThrow":{"growth":0.057883,"percent":160}},
  "donchan":{"upThrow":{"growth":0.061138,"percent":170}},
  "shizuna":{"upThrow":{"growth":0.060238,"percent":180}},
  "hanajs":{"upThrow":{"growth":0.065198,"percent":160}},
  "hanajk":{"upThrow":{"growth":0.060238,"percent":180}},
  "hanajd":{"upThrow":{"growth":0.060238,"percent":180}},
  "kisuke":{"upThrow":{"growth":0.060238,"percent":180}},
  "ray":{"upThrow":{"growth":0.060238,"percent":180}},
  "alain":{"upThrow":{"growth":0.060238,"percent":180}},
  "hinako":{"upThrow":{"growth":0.060238,"percent":180}},
  "cojicoji":{"backThrow":{"growth":0.047831,"percent":175}},
  "megamanexe":{"backThrow":{"growth":0.051591,"percent":160}},
  "melia":{"upThrow":{"growth":0.062038,"percent":160}},
  "fiora":{"upThrow":{"growth":0.060846,"percent":180}},
  "krystal":{"backThrow":{"growth":0.051591,"percent":160}},
  "yuri":{"upThrow":{"growth":0.061138,"percent":170}},
  "hornet":{"upThrow":{"growth":0.060238,"percent":180}},
  "toro":{"upThrow":{"growth":0.061138,"percent":170}},
  "c4621":{"upThrow":{"growth":0.064221,"percent":160}},
  "malenia":{"upThrow":{"growth":0.060238,"percent":180}},
  "hayabusa":{"upThrow":{"growth":0.060238,"percent":180}},
  "klonoa":{"backThrow":{"growth":0.047831,"percent":175}},
  "katamari":{"upThrow":{"growth":0.061138,"percent":170}},
  "kingbonby":{"forwardThrow":{"growth":0.051062,"percent":150},"downThrow":{"growth":0.094566,"percent":155}},
  "alucard":{"upThrow":{"growth":0.060238,"percent":180}},
  "kurabe":{"backThrow":{"growth":0.051591,"percent":160}},
  "battlemage":{"upThrow":{"growth":0.062261,"percent":160}},
  "karateka":{"backThrow":{"growth":0.047831,"percent":175}},
  "aiai":{"backThrow":{"growth":0.047831,"percent":175}},
  "chibirobo":{"backThrow":{"growth":0.047831,"percent":175}},
  "octoling":{"backThrow":{"growth":0.047831,"percent":175}},
  "viridi":{"upThrow":{"growth":0.061138,"percent":170}},
  "riesz":{"backThrow":{"growth":0.051591,"percent":160}},
  "edea":{"upThrow":{"growth":0.060238,"percent":180}},
  "jett":{"backThrow":{"growth":0.047831,"percent":175}},
  "octane":{"backThrow":{"growth":0.047831,"percent":175}},
  "parappa":{"backThrow":{"growth":0.047831,"percent":175}},
  "sam":{"backThrow":{"growth":0.051591,"percent":160}}
 };
 function koTarget(id,type,group){if(group==='blade')return 180;if(type==='upThrow')return group==='caster'?170:group==='agile'?180:160;if(type==='downThrow')return group==='power'||group==='grappler'?155:group==='psion'?165:175;return group==='blade'?175:group==='agile'?175:group==='balanced'||group==='rising'||group==='caster'?160:150;}
 // Named identities, independent of roster/display numbers.
 const identities={
  dragoon:{upThrow:[88,.098]},gundam:{upThrow:[84,.094]},kosmos:{upThrow:[86,.096]},pawapuro:{upThrow:[80,.093]},
  horse:{upThrow:[83,.094]},bayleef:{upThrow:[87,.095]},piposaru:{upThrow:[81,.093]},pneuma:{upThrow:[86,.097]},
  odio:{upThrow:[87,.099]},laharl:{upThrow:[82,.100]},kasane:{upThrow:[82,.092]},greymon:{upThrow:[83,.094]},
  metalgreymon:{upThrow:[84,.096]},wargreymon:{upThrow:[85,.098]},omegamon:{upThrow:[86,.100]},hanajs:{upThrow:[81,.094]},c4621:{upThrow:[87,.096]},
  ryofu:{forwardThrow:[32,.057],backThrow:[48,.036],upThrow:[80,.074],downThrow:[74,.026]},
  tifa:{forwardThrow:[42,.056],backThrow:[50,.036],upThrow:[85,.070],downThrow:[63,.024]},
  kiryu:{forwardThrow:[35,.055],upThrow:[86,.068]},kingbonby:{forwardThrow:[34,.056],upThrow:[83,.073]},
  vivi:{upThrow:[90,.062]},rocbouquet:{upThrow:[87,.065]},melia:{upThrow:[89,.067]},
  fiora:{upThrow:[78,.064]},narmaya:{upThrow:[79,.067]},wonder:{upThrow:[83,.064]},
  zidane:{forwardThrow:[52,.025],upThrow:[76,.059]},hornet:{backThrow:[38,.033],upThrow:[80,.061]}
 };
 function move(f,type){
  const original=movesFor(f)[type],group=assignments[f.characterId]||'balanced',index=directions.indexOf(type);
  if(!original||index<0)return original;
  const primary=koDirections[f.characterId]||directions[roles[group].indexOf('ko')];
  const role=type===primary?'ko':group==='blade'&&roles[group][index]==='ko'?'juggle':roles[group][index];
  const up=type==='upThrow',down=type==='downThrow',profile=profiles[group][index],identity=identities[f.characterId]?.[type];
  const angle=down?(identity?.[0]??profile[0]):identity?.[0]??profile[0];
  const base=group==='blade'?15.5:group==='psion'||group==='power'?17:16;
  const recovery=role==='ko'?26:role==='combo'?14:role==='juggle'?18:21;
  const growth=role==='ko'?(koCalibration[f.characterId]?.[type]?.growth??koGrowth[type]):profile[1];
  return{...original,throwRole:role,throwGroup:group,throwPrimary:primary,baseKnockback:base,knockbackGrowth:growth,
   throwKnockbackCap:undefined,throwBounce:down,throwKOReference:role==='ko'?koTarget(f.characterId,type,group):undefined,
   damage:Math.min(original.damage,role==='combo'?6:role==='juggle'?7:9),angle:-angle*Math.PI/180,
   throwHitstun:role==='combo'?24:0,totalFrames:recovery,recoveryFrames:recovery-1,motionEndFrames:recovery,FAF:recovery+1};
 }
 return{directions,groups,assignments,roles,profiles,identities,koDirections,koGrowth,koCalibration,koTarget,move};
})();

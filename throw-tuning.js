'use strict';
// Normal grabs use this table only at release. Specials that borrow a throw
// template keep their authored power and cannot inherit these role changes.
const ThrowTuning=(()=>{
 const directions=['forwardThrow','backThrow','upThrow','downThrow'];
 const groups={
  balanced:'reimu zack presea hachiware tidus terra onionknight arthur sakura billy riesz edea narmaya wonder rena gran welch zoe ky alphen ash judas rion sol miyabi zero3 dana isaac ulgrim monokuma roxas twob zero lightning rean estelle noctis clive narukami rex luke fayt noah lloyd shiren hunter adol terry valkyrie haseo terrarian chef morphie human kitten elma goemon metabee nier dante leon charlotta twinbee edf arus maelle sumino frog tressa eve saki hanajk hanajd kisuke ray alain hinako megamanexe fiora krystal malenia alucard kurabe shizuna',
  rising:'dragoon gundam kosmos pawapuro horse bayleef piposaru pneuma odio laharl kasane greymon metalgreymon wargreymon omegamon hanajs c4621',
  agile:'viewtifuljoe ellen chibirobo octoling chiikawa chocobo riki rin makoto neku pokoa jibanyan zidane yuffie crash knight shadow moogle cojicoji hornet klonoa karateka aiai hayabusa',
  grappler:'agumon akira fei tifa kiryu ryofu edelgard guile sukapon doshin kingbonby',
  caster:'shionne genis viridi vivi nia colette will emma ryza midna bomberman sans headmaster sakuna miku naruhodo layton vincent mametchi aruru maruku dietrich rocbouquet deemo aerith donchan melia yuri toro katamari okami battlemage naegi'
 };
 // Weapon specialists keep useful positioning throws; supernatural and
 // power identities get the designated KO directions below.
 groups.blade='zack tidus arthur sakura riesz edea narmaya gran ky alphen ash judas rion sol miyabi zero3 dana ulgrim roxas twob zero lightning rean estelle noctis clive narukami rex luke fayt noah lloyd shiren hunter adol terry valkyrie haseo terrarian nier dante charlotta arus maelle frog eve saki hanajk hanajd kisuke ray alain hinako fiora krystal malenia alucard shizuna knight hornet hayabusa';
 groups.psion='kasane neku midna emma pneuma laharl odio will melia battlemage reimu rocbouquet deemo';
 groups.power='agumon akira fei tifa kiryu ryofu edelgard guile sukapon doshin kingbonby presea zoe greymon metalgreymon wargreymon omegamon';
 // Per-character selections, rather than roster-number/modulo assignments.
 const assignments=Object.fromEntries(Object.entries(groups).flatMap(([group,ids])=>ids.split(' ').map(id=>[id,group])));
 const roles={
  balanced:['position','ko','juggle','combo'],
  rising:['position','position','ko','combo'],
  agile:['combo','position','juggle','combo'],
  grappler:['ko','position','juggle','combo'],
  caster:['position','position','juggle','combo'],
  blade:['position','position','juggle','combo'],
  psion:['position','position','ko','combo'],
  power:['ko','position','juggle','combo']
 };
 // [angle in degrees, growth]. Each direction has a different job; up
 // throws keep meaningful percent scaling even when their job is juggling.
 const profiles={
  balanced:[[43,.031],[40,.048],[82,.057],[59,.022]],
  rising:[[36,.030],[48,.032],[85,.0758],[62,.021]],
  agile:[[54,.025],[40,.031],[78,.052],[55,.020]],
  grappler:[[37,.050],[46,.036],[84,.064],[61,.025]],
  caster:[[50,.031],[46,.034],[86,.057],[63,.022]],
  blade:[[45,.024],[43,.027],[80,.043],[58,.019]],
  psion:[[43,.035],[46,.037],[86,.075],[62,.024]],
  power:[[37,.047],[46,.036],[84,.064],[60,.025]]
 };
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
  const original=movesFor(f)[type],group=assignments[f.characterId]||'balanced',role=roles[group][directions.indexOf(type)];
  if(!original||!role)return original;
  const up=type==='upThrow',down=type==='downThrow',profile=profiles[group][directions.indexOf(type)],identity=identities[f.characterId]?.[type];
  const angle=down?profile[0]:identity?.[0]??profile[0];
  // Preserve named angular identities, but calibrate KO growth against the
  // new base launch. Adding base on top of old KO growth would over-buff it.
  const growth=role==='ko'||group==='blade'||down?profile[1]:identity?.[1]??profile[1];
  // Base knockback adds a percent-independent launch while retaining growth.
  // fixedKnockback would replace growth entirely, so normal throws never use it.
  const base=group==='blade'?10.1:group==='psion'||group==='power'?11:10.4;
  const p=role==='ko'?{base,recovery:24}:role==='combo'?{base:base-.35,recovery:13}:role==='juggle'?{base:base-.1,recovery:17}:{base,recovery:20};
  return{...original,throwRole:role,throwGroup:group,baseKnockback:p.base,knockbackGrowth:growth,throwKnockbackCap:down?82:undefined,throwBounce:down,
   damage:Math.min(original.damage,role==='combo'?6:role==='juggle'?7:9),angle:-angle*Math.PI/180,
   throwHitstun:role==='combo'?22:0,totalFrames:p.recovery,recoveryFrames:p.recovery-1,motionEndFrames:p.recovery,FAF:p.recovery+1};
 }
 return{directions,groups,assignments,roles,profiles,identities,move};
})();

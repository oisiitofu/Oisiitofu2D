'use strict';
// Normal grabs use this table only at release. Specials that borrow a throw
// template keep their authored power and cannot inherit these role changes.
const ThrowTuning=(()=>{
 const directions=['forwardThrow','backThrow','upThrow','downThrow'];
 const groups={
  balanced:'alphen ash judas rion sol miyabi zero3 dana isaac ulgrim monokuma roxas twob zero lightning rean estelle noctis clive narukami rex luke fayt noah lloyd shiren hunter adol terry valkyrie haseo terrarian chef morphie human kitten elma goemon metabee nier dante leon charlotta twinbee edf arus maelle sumino frog tressa eve saki hanajk hanajd kisuke ray alain hinako megamanexe fiora krystal malenia alucard kurabe shizuna',
  rising:'dragoon gundam kosmos pawapuro horse bayleef piposaru pneuma odio laharl kasane greymon metalgreymon wargreymon omegamon hanajs c4621',
  agile:'chiikawa chocobo riki rin makoto neku pokoa jibanyan zidane yuffie crash knight shadow moogle cojicoji hornet klonoa karateka aiai hayabusa',
  grappler:'agumon akira fei tifa kiryu ryofu edelgard guile sukapon doshin kingbonby',
  caster:'vivi nia colette will emma ryza midna bomberman sans headmaster sakuna miku naruhodo layton vincent mametchi aruru maruku dietrich rocbouquet deemo aerith donchan melia yuri toro katamari okami battlemage naegi'
 };
 // Per-character selections, rather than roster-number/modulo assignments.
 const assignments=Object.fromEntries(Object.entries(groups).flatMap(([group,ids])=>ids.split(' ').map(id=>[id,group])));
 const roles={
  balanced:['position','ko','juggle','combo'],
  rising:['position','position','ko','combo'],
  agile:['combo','position','juggle','combo'],
  grappler:['ko','position','juggle','combo'],
  caster:['position','position','juggle','combo']
 };
 function move(f,type){
  const original=movesFor(f)[type],group=assignments[f.characterId]||'balanced',role=roles[group][directions.indexOf(type)];
  if(!original||!role)return original;
  const up=type==='upThrow',down=type==='downThrow';
  const p=role==='ko'?{base:2.8,growth:up?.096:type==='forwardThrow'?.054:.047,recovery:24,angle:up?85:40}:
   role==='combo'?{base:3,growth:.012,recovery:12,angle:down?68:58}:
   role==='juggle'?{base:2.6,growth:.019,recovery:17,angle:82}:
   {base:2.8,growth:.027,recovery:20,angle:down?63:43};
  return{...original,throwRole:role,throwGroup:group,baseKnockback:p.base,knockbackGrowth:p.growth,
   damage:Math.min(original.damage,role==='combo'?6:role==='juggle'?7:9),angle:-p.angle*Math.PI/180,
   throwHitstun:role==='combo'?22:0,totalFrames:p.recovery,recoveryFrames:p.recovery-1,motionEndFrames:p.recovery,FAF:p.recovery+1};
 }
 return{directions,groups,assignments,roles,move};
})();

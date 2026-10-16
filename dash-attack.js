'use strict';
// Dash normals retain their authored poses, damage, direction and hit identity.
// Only grounded travel and the existing final hit window are extended.
const DashAttackTuning=(()=>{
 const stationary={
  terry:'足を止めた鞄の振り回し',agumon:'足を据えたマッハジャブ',
  akira:'直立して腕を構えるレギオン突き',morphie:'直立した射撃姿勢',
  saki:'足を据えて構える銃撃姿勢'
 };
 const slides=new Set(['dragoon','isaac','twob','lightning','rean','rex','luke','will','emma','ryza','noah','midna','bomberman','sans','lloyd','shiren','pokoa','adol','valkyrie','haseo','terrarian','human','kitten','elma','goemon','bayleef','metabee','nier','miku','naruhodo','layton','zidane','yuffie','vincent','crash','aruru','tressa','laharl','shizuna','hanajd','kisuke','hinako','cojicoji','megamanexe','krystal','yuri','hornet','toro','melia','fiora','c4621','malenia','hayabusa','klonoa','katamari']);
 const steps=new Set(['chocobo','vivi','colette','naegi','pawapuro','headmaster','chef','arus','frog','deemo','kasane','aerith','rocbouquet']);
 const rushes=new Set(["ulgrim","chiikawa","monokuma","riki","roxas","okami","gundam","zero","rin","nia","estelle","noctis","clive","makoto","neku","narukami","kosmos","fayt","hunter","sakuna","horse","fei","jibanyan","dante","leon","tifa","kiryu","charlotta","ryofu","mametchi","piposaru","twinbee","maruku","dietrich","edf","edelgard","guile","sukapon","pneuma","knight","maelle","sumino","eve","odio","shadow","doshin","moogle","greymon","metalgreymon","wargreymon","omegamon","donchan","hanajs","hanajk","ray","alain"]);
 const profiles={
  slide:{extra:9,friction:.2,run:.95,boost:1.2,min:6.4,max:9.4,decay:.22},
  rush:{extra:7,friction:.3,run:.9,boost:1.3,min:6.2,max:9.6,decay:.25},
  step:{extra:4,friction:.5,run:.78,boost:1.1,min:5.2,max:8.2,decay:.3}
 };
 const review=Object.fromEntries(Roster.definitions.map(d=>[d.id,stationary[d.id]?{kind:'stationary',reason:stationary[d.id]}:slides.has(d.id)?{kind:'slide'}:steps.has(d.id)?{kind:'step'}:rushes.has(d.id)?{kind:'rush'}:{kind:'stationary',reason:'未確認の新規姿勢は個別に見直すまで維持'}]));
 function tune(table,id){
  const kind=review[id].kind,source=table?.dashAttack;if(!source||kind==='stationary'||source.dashSlide)return;
  const p=profiles[kind],a={...source,type:'dashAttack',activeFrames:source.activeFrames.map(w=>({...w})),animation:{...source.animation},timeline:source.timeline.map(e=>({...e})),autoCancelWindow:source.autoCancelWindow.map(w=>[...w]),landingFlag:[...source.landingFlag]};
  // Match the existing real recovery before adding active frames, so the new
  // duration never introduces an idle-pose lockout or hidden extra recovery.
  CombatData.alignRecovery(a);
  const end=a.activeEnd,last=a.activeFrames.at(-1);last.end+=p.extra;
  a.activeEnd=last.end;a.totalFrames+=p.extra;a.motionEndFrames=a.totalFrames;a.FAF=a.totalFrames+1;
  a.landingFlag=a.landingFlag.map(t=>Number.isFinite(t)&&t>end?t+p.extra:t);
  a.autoCancelWindow=a.autoCancelWindow.map(([s,e])=>[s>end?s+p.extra:s,e]);
  a.dashSlide={kind,...p};table.dashAttack=a;
 }
 for(const d of Roster.definitions)tune(movesFor({characterId:d.id}),d.id);
 // Form-specific tables keep their own damage and resource rules.
 tune(GoemonPoweredMoves,'goemon');tune(ElmaOCGMoves,'elma');for(const table of NierSpellMoves)tune(table,'nier');
 function prepare(f){const a=f.attack;if(!a?.dashSlide)return;a.dashDirection=f.face;a.dashGroundLost=!f.grounded;}
 function friction(f){const a=f.attack;return a?.dashSlide&&!a.dashGroundLost&&f.timer<=a.activeEnd?a.dashSlide.friction:1;}
 function motion(f){
  const a=f.attack;if(!a?.dashSlide)return;if(!f.grounded){a.dashGroundLost=true;return;}if(a.dashGroundLost)return;
  if(f.timer<a.activeStart||f.timer>a.activeEnd)return;
  const p=a.dashSlide,speed=clamp(f.character.runSpeed*p.run+p.boost,p.min,p.max),age=f.timer-a.activeStart;
  f.vx=a.dashDirection*Math.max(speed*.55,speed-age*p.decay);
 }
 return{review,profiles,prepare,friction,motion};
})();

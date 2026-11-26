'use strict';

const ChocoboMotionPreview=(()=>{
 const drawings=[];
 function cell(group,index,height,root=.5,bottom=0,ledge=false){
  const rect=ChocoboMotionPreviewArt[group][index-1];
  const width=height*rect[2]/rect[3];
  const drawing={src:'characters/chocobo/assets/motion-preview-'+group+'.webp',rect,width,left:-width*root,bottom,ledge};
  drawings.push(drawing);
  return drawing;
 }
 const ground=(i,h,root)=>cell('ground',i,h,root);
 const air=(i,h,root)=>cell('air',i,h,root);
 const grip=(i,h,root)=>cell('throws',i,h,root);
 const movement=(i,h,root,bottom)=>cell('movement',i,h,root,bottom);
 const reaction=(i,h,root,bottom)=>cell('reactions',i,h,root,bottom);
 const edge=(i,h,root,bottom,anchored)=>cell('ledge',i,h,root,bottom,anchored);
 const attacks={
  jab:{3:ground(1,102,.52)},jab2:{3:ground(2,100,.49)},jab3:{4:ground(3,85,.53)},
  heavy:{4:ground(4,100,.47)},up:{4:ground(5,111,.53)},low:{4:ground(6,83,.53)},
  dashAttack:{7:ground(7,93,.57)},upsmash:{4:ground(8,101,.53)},downsmash:{6:ground(9,81,.52)},
  air:{4:air(1,94,.53),10:edge(8,91,.53)},fair:{4:air(2,103,.51)},bair:{5:air(3,105,.55)},
  uair:{3:air(4,114,.51)},dair:{6:air(5,108,.53)},dragon:{14:air(6,114,.52)},
  dash:{6:air(7,91,.58)},rise:{5:air(8,112,.53)},gale:{4:air(9,125,.49)},
  grab:{4:grip(1,103,.53)},pummel:{3:grip(2,100,.54)},forwardThrow:{3:grip(3,101,.49)},
  backThrow:{3:grip(4,100,.55)},upThrow:{3:grip(5,115,.53)},downThrow:{3:grip(6,84,.55)},
  ledge:{4:grip(7,85,.54)},getupAttack:{4:grip(8,86,.55)}
 };
 const stateTracks={
  walk:[5,movement(1,109,.51),32],run:[5,movement(2,107,.52),18],
  crouch:[3,movement(3,99,.51)],jump:[3,movement(4,108,.52,-3)],
  double:[3,movement(5,110,.52,-3)],fall:[4,movement(6,109,.51,-2)],
  guard:[3,movement(7,109,.49)],dodge:[4,movement(8,96,.51)],
  hit:[2,movement(9,109,.56)],fly:[3,reaction(1,108,.55,-3)],
  land:[2,reaction(2,97,.52)],down:[3,reaction(3,95,.55)],
  getup:[5,reaction(4,87,.53)],caught:[3,reaction(5,108,.52)],
  grab:[3,edge(6,106,.52)],throw:[3,edge(7,103,.52)]
 };
 const airDodge=[3,grip(9,94,.52)];
 const landing=[3,edge(9,98,.51)];
 const modes={
  Turn:[2,reaction(6,108,.54)],RunTurn:[3,reaction(7,107,.54)],RunBrake:[3,reaction(8,101,.56)],
  JumpSquat:[2,reaction(9,101,.52)],ShieldDrop:[2,stateTracks.guard[1]],
  Pummel:[3,attacks.pummel[3]],
  NeutralAirDodge:airDodge,DirectionalAirDodge:airDodge,
  FastFall:[3,stateTracks.fall[1]],Helpless:[3,stateTracks.fall[1]],
  // Align the raised claw in the new sprite to the actual ledge coordinate.
  LedgeCatch:[3,edge(1,104,221/232,104*(1-69/252),true)],
  LedgeHang:[3,edge(2,103,181/191,103*(1-64/252),true)],
  LedgeGetup:[4,edge(3,95,.51)],LedgeRoll:[5,edge(4,84,.52)],LedgeJump:[3,edge(5,116,.55)],
  LedgeDrop:[3,stateTracks.fall[1]],LedgeTrump:[3,stateTracks.fly[1]],
  HardLanding:landing,AerialLanding:landing,SpecialLanding:landing
 };
 const limitTracks=[
  [10,14,0,cell('limit',1,111)], [33,35,34,cell('limit',2,103)],
  [42,44,37,cell('limit',3,103)], [53,55,9,cell('limit',4,113)],
  [76,78,5,cell('limit',5,107)], [88,92,11,cell('limit',6,105)],
  [125,129,15,cell('limit',7,92)], [146,150,17,cell('limit',8,95)],
  [166,170,8,cell('limit',9,107)]
 ];
 attacks.limitBreak={5:limitTracks[2][3]};
 function sample(f){
  if(f.attack)return attacks[f.attack.type]?.[f.timer];
  const tick=f.stateFrame;
  if(tick<=1||tick>=f.stateDuration)return;
  const track=modes[f.mode]||stateTracks[f.state];
  if(!track)return;
  const [at,drawing,period]=track;
  if((period?(tick-1)%period+1:tick)===at)return drawing;
 }
 function limit(time,pose){
  return limitTracks.find(([open,close,from])=>pose===from&&time>=open&&time<close)?.[3];
 }
 // Keep the dedicated 3-frame bridge from the first test for the forward smash.
 MotionPreview.register('chocobo',{
 smash:{
  label:'横スマッシュ',
  matches:f=>f.grounded&&f.attack.startupFrames===13&&pose(f)===14,
  frames:{
   2:{src:'characters/chocobo/assets/motion-preview-smash-02.webp',left:-60,width:116},
   3:{src:'characters/chocobo/assets/motion-preview-smash-03.webp',left:-60,width:118},
   4:{src:'characters/chocobo/assets/motion-preview-smash-04.webp',left:-60,width:119}
  }
 }
 },{drawings,sample});
 return{limit};
})();

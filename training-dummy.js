'use strict';
// Ordinary inputs for offline training CPU slots; never edit shield/attack state.
const TrainingDummy=(()=>{
 let behavior='idle';
 function begin(){behavior='idle';document.getElementById('dummy-behavior').value=behavior;}
 function input(f){
  if(!training||Net.active)return emptyInput();
  if(behavior==='guard')return f.grounded?{...emptyInput(),guard:true,guardHeld:true}:emptyInput();
  const floor=platforms.find(p=>p.main);
  if(f.ledge||CPUControl.offstage(f,floor))return cpu(f,BattlePlayers.target(f));
  return emptyInput();
 }
 addEventListener('DOMContentLoaded',()=>{document.getElementById('dummy-behavior').onchange=e=>{behavior=e.target.value==='guard'?'guard':'idle';e.target.value=behavior;};});
 return{begin,input};
})();

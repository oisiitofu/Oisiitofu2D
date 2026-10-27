'use strict';
// Ordinary inputs for offline training CPU slots; never edit shield/attack state.
const TrainingDummy=(()=>{
 let behavior='idle';
 function begin(){behavior='idle';document.getElementById('dummy-behavior').value=behavior;}
 function input(f){return{...emptyInput(),...(training&&!Net.active&&behavior==='guard'&&f.grounded?{guard:true,guardHeld:true}:{})};}
 addEventListener('DOMContentLoaded',()=>{document.getElementById('dummy-behavior').onchange=e=>{behavior=e.target.value==='guard'?'guard':'idle';e.target.value=behavior;};});
 return{begin,input};
})();

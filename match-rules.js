'use strict';
// Shared validation for the lobby, simulation and online host settings.
const MatchRules=(()=>{
 const times=[0,60,120,180,240,300,420,600,900];
 const time=value=>times.includes(Number(value))?Number(value):0;
 const timeLabel=value=>time(value)===0?'時間無制限':time(value)/60+'分';
 const teamAttack=value=>value!==false&&value!=='off';
 // Lobby randomness only: never draw random numbers during simulation.
 function randomTeams(count,choose=n=>Math.floor(Math.random()*n)){
  const slots=Array.from({length:count},(_,n)=>n),result=Array(count);
  for(let n=count-1;n>0;n--){const k=choose(n+1);[slots[n],slots[k]]=[slots[k],slots[n]];}
  const first=choose(2);slots.forEach((slot,n)=>result[slot]=(n+first)%2);return result;
 }
 return{times,time,timeLabel,teamAttack,randomTeams};
})();
if(typeof module!=='undefined')module.exports=MatchRules;

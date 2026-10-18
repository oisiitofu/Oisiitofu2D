'use strict';
// Shared validation for the lobby, simulation and online host settings.
const MatchRules=(()=>{
 const times=[0,60,120,180,240,300,420,600,900];
 const time=value=>times.includes(Number(value))?Number(value):0;
 const timeLabel=value=>time(value)===0?'時間無制限':time(value)/60+'分';
 const teamAttack=value=>value!==false&&value!=='off';
 return{times,time,timeLabel,teamAttack};
})();
if(typeof module!=='undefined')module.exports=MatchRules;

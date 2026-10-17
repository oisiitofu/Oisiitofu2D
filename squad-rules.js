'use strict';
// Random slots reserve explicit picks, then draw from the remaining roster.
const SquadRules=(()=>{
 function duplicate(lineup){const seen=new Set();for(const id of lineup){if(id==='random')continue;if(seen.has(id))return true;seen.add(id);}return false;}
 function resolve(lineup,roster,draw=n=>Math.floor(Math.random()*n)){
  if(duplicate(lineup))throw Error('同じ編成に同じキャラは選べません。');
  const reserved=new Set(lineup.filter(id=>id!=='random')),pool=roster.filter(id=>!reserved.has(id));
  return lineup.map(id=>{if(id!=='random')return id;if(!pool.length)throw Error('編成できるキャラが足りません。');return pool.splice(draw(pool.length),1)[0];});
 }
 return{duplicate,resolve};
})();
if(typeof module!=='undefined')module.exports=SquadRules;

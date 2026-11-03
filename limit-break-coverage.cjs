'use strict';
// Source coverage in roster order. Distinct works stay distinct even where the
// roster's browse control presents a franchise as a single filter option.
const fs=require('node:fs'),vm=require('node:vm');
const read=file=>fs.readFileSync(file,'utf8');
const roster=vm.runInNewContext(read('character-origins.js')+'\n'+read('roster.js')+'\nRoster.selectable.map(d=>({id:d.id,name:d.name,work:d.origin||CharacterOrigins[d.id]}))',{});
const scripts=[...read('index.html').matchAll(/<script src="([^"]+\.js)"/g)].map(m=>m[1]);
const cinematics=new Set(scripts.flatMap(file=>[...read(file).matchAll(/LimitBreak\.define\(['"]([^'"]+)['"]/g)].map(m=>m[1])));
const works=new Map();
for(const fighter of roster){
 if(!fighter.work)throw Error('Missing work: '+fighter.id);
 if(!works.has(fighter.work))works.set(fighter.work,{work:fighter.work,representative:fighter,cinematics:[]});
 if(cinematics.has(fighter.id))works.get(fighter.work).cinematics.push(fighter);
}
const rows=[...works.values()],completed=rows.filter(row=>row.cinematics.length),remaining=rows.filter(row=>!row.cinematics.length);
console.log(JSON.stringify({total:rows.length,completed:completed.length,remaining:remaining.length,...(process.argv.includes('--all')?{works:rows}:{implemented:completed,next:remaining.slice(0,12)})},null,2));

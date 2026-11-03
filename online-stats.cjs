'use strict';
const fs=require('node:fs'),fsp=require('node:fs/promises'),path=require('node:path');
const endpoint='/api/online-stats',empty={matches:0,updatedAt:null,players:[],characters:[]};
function createOnlineStats(file){
 let data=structuredClone(empty), pending=Promise.resolve(), readError=null;
 try{data=JSON.parse(fs.readFileSync(file,'utf8'));if(!Array.isArray(data.players)||!Array.isArray(data.characters)||!Number.isInteger(data.matches))throw Error('Invalid online statistics');}
 catch(error){if(error.code!=='ENOENT')readError=error;}
 function record(match,winner,played){
  const task=pending.then(async()=>{
   if(readError)throw readError;
   const next=structuredClone(data),players=new Map(next.players.map(p=>[p.name,p])),characters=new Map(next.characters.map(c=>[c.id,c]));
   for(let slot=0;slot<match.players.length;slot++){
    const {name,battleTeam,character,team}=match.players[slot],won=winner===(match.format==='teams'?battleTeam:slot);
    const p=players.get(name)||{name,matches:0,wins:0,draws:0,characters:[]};
    p.matches++;p.wins+=Number(won);p.draws+=Number(winner===-1);
    const used=match.squadSize>1?team.slice(0,played[slot]):[character];
    const personal=new Map(p.characters.map(c=>[c.id,c]));
    for(const id of new Set(used)){
     for(const table of [characters,personal]){
      const c=table.get(id)||{id,uses:0,wins:0};
      c.uses++;c.wins+=Number(won);table.set(id,c);
     }
    }
    p.characters=[...personal.values()];players.set(name,p);
   }
   next.matches++;next.updatedAt=new Date().toISOString();next.players=[...players.values()];next.characters=[...characters.values()];
   await fsp.mkdir(path.dirname(file),{recursive:true});
   const temp=file+'.'+process.pid+'.tmp';
   await fsp.writeFile(temp,JSON.stringify(next));await fsp.rename(temp,file);
   data=next;
  });
  pending=task.catch(()=>{});return task;
 }
 function serve(req,res,pathname){
  if(pathname!==endpoint)return false;
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405).end();return true;}
  res.writeHead(readError?503:200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:JSON.stringify(readError?{error:'Statistics unavailable'}:data));
  return true;
 }
 return{record,serve};
}
module.exports={createOnlineStats};

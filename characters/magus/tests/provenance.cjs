'use strict';
const fs=require('fs'),crypto=require('crypto');
const root='characters/magus',log=JSON.parse(fs.readFileSync(root+'/docs/asset-generation.json'));
const map={basic:'basic-draft','basic-margin-repair':'basic',attacks:'attacks-draft','attack-repair':'attacks',specials:'specials',selection:'selection',effects:'effects',defense:'defense',extra:'extra','jab-correction':'jab-correction',windup:'windup',recovery:'recovery'};
const rows=[];for(const job of log.jobs){const match=job.output_hint.match(/as (C:[\s\S]*?\.png) by default/);if(!match)throw Error('Missing generated path '+job.name);const generated=match[1].replace(/\\/g,'/'),final=root+'/assets/magus-'+map[job.name]+'.png',sha256=crypto.createHash('sha256').update(fs.readFileSync(final)).digest('hex');job.mode='built-in image_gen';job.generated=generated;job.final=final;job.sha256=sha256;rows.push({name:job.name,mode:job.mode,generated,final,sha256});}
fs.writeFileSync(root+'/docs/asset-generation.json',JSON.stringify(log,null,2));fs.writeFileSync(root+'/tests/source-provenance.json',JSON.stringify(rows,null,2));console.log(JSON.stringify(rows.map(({name,sha256})=>({name,sha256}))));

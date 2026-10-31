'use strict';
const fs=require('fs'),assert=require('assert/strict'),sharp=require('sharp'),crypto=require('crypto'),extract=require('../../elza/tests/extract-poses.cjs');
const root='characters/hydaelyn';
(async()=>{
 const m=JSON.parse(fs.readFileSync(root+'/tests/art-layout.json','utf8'));
 assert.equal(m.frames.length,107);assert.equal(m.effects.length,16);assert.equal(m.portrait,106);assert.equal(m.sourcePoses.length,106);
 assert.equal(m.sourcePoses[22].sheet,'strike-completion');
 const native=await sharp(root+'/assets/hydaelyn-native.png').metadata();
 for(const r of [...m.frames,...m.effects]){assert(r[2]>0&&r[3]>0);assert(r[0]>=0&&r[1]>=0&&r[0]+r[2]<=native.width&&r[1]+r[3]<=native.height);}
 const ref=extract(await sharp(root+'/assets/hydaelyn-basic.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),4,4,'basic')[0],locked=await sharp(root+'/assets/hydaelyn-neutral-locked.png').ensureAlpha().raw().toBuffer();assert(ref.pixels.equals(locked),'Locked neutral must be byte identical');
 assert(m.grip[1]>.9&&m.grip[1]<1,'Ledge grip must be on raised hands');
 const selection=await sharp(root+'/assets/hydaelyn-selection.png').metadata();assert(selection.width>=1000&&selection.height>=1000&&selection.hasAlpha);
 const log=JSON.parse(fs.readFileSync(root+'/docs/art-generation.json','utf8').replace(/^\uFEFF/,''));assert(log.generations.length>=9);for(const c of log.generations){assert(c.prompt&&c.original);assert(fs.existsSync(c.original));}
 const hashes={};for(const name of ['basic','attacks','specials','defense','extra','windup','recovery','selection','effects','neutral-locked']){const file=root+'/assets/hydaelyn-'+name+'.png';hashes[file]=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');}fs.writeFileSync(root+'/tests/art-source-hashes.json',JSON.stringify(hashes,null,2));
 console.log(JSON.stringify({frames:m.frames.length,effects:m.effects.length,portrait:m.portrait,lockedNeutral:true,selection:[selection.width,selection.height],generationCalls:log.generations.length,completion:22}));
})().catch(e=>{console.error(e);process.exitCode=1;});

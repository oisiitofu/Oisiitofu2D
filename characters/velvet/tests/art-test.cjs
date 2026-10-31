'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto'),sharp=require('sharp'),extract=require('../../elza/tests/extract-poses.cjs');
const root='characters/velvet',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const meta=JSON.parse(fs.readFileSync(root+'/tests/art-layout.json')),locks=JSON.parse(fs.readFileSync(root+'/tests/locked-source-hashes.json'));
 assert.equal(meta.frames.length,107);assert.equal(meta.effects.length,16);assert.equal(meta.portrait,106);assert.equal(meta.sourcePoses.length,106);
 for(const[name,h]of Object.entries(locks))assert.equal(hash(fs.readFileSync(root+'/assets/velvet-'+name+'.png')),h,name+' locked source');
 const atlas=await sharp(root+'/assets/velvet-native.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const crop=async r=>sharp(atlas.data,{raw:atlas.info}).extract({left:r[0],top:r[1],width:r[2],height:r[3]}).ensureAlpha().raw().toBuffer();
 assert((await crop(meta.frames[0])).equals(await sharp(root+'/assets/velvet-neutral-locked.png').ensureAlpha().raw().toBuffer()),'neutral exact RGBA');
 const attack=extract(await sharp(root+'/assets/velvet-attacks.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),4,4,'attacks'),normalHashes=[];
 for(let i=0;i<15;i++){const g=attack[i+1],expected=await sharp(g.pixels,{raw:{width:g.w,height:g.h,channels:4}}).resize({width:Math.round(g.w*meta.scales.attacks)}).ensureAlpha().raw().toBuffer();assert((await crop(meta.frames[16+i])).equals(expected),'locked strike '+i);normalHashes.push(hash(expected));for(const other of[76+i,91+i])assert.notEqual(hash(await crop(meta.frames[other])),hash(expected),'distinct intermediate '+other);}
 assert.equal(new Set(normalHashes).size,15,'fifteen distinct normal images');
 assert.deepEqual(meta.sourcePoses[80],{sheet:'windup-hand-correction',cell:5});
 for(const[family,rects]of[['frame',meta.frames],['effect',meta.effects]])for(const[n,r]of rects.entries()){const p=await crop(r);let solid=0,transparent=0;for(let i=3;i<p.length;i+=4){if(p[i]>150)solid++;if(p[i]===0)transparent++;}assert(solid>20,family+n+' empty');assert(transparent>20,family+n+' missing transparency');assert(r[0]+r[2]<=atlas.info.width&&r[1]+r[3]<=atlas.info.height,family+n+' bounds');}
 const portrait=await crop(meta.frames[106]);assert(portrait.subarray(0,600*35*4).every(v=>v===0),'portrait headroom');
 const points=JSON.parse(fs.readFileSync(root+'/tests/native-points.json'));assert.equal(points.pelvis.length,106);assert.equal(meta.anchors.length,107);assert.deepEqual(meta.anchors,points.anchors);assert.equal(meta.anchors[106],.5);assert.equal(points.normals.length,15);for(const p of points.normals)for(const key of['grip','tip'])assert(p[key].every(v=>v>=0&&v<=1),p.move+' '+key);assert.deepEqual(meta.grip,points.ledge.grip);assert(Math.abs(meta.grip[0]-(points.ledge.point[0]-meta.anchors[55]))<1e-9,'actual hand versus pelvis');assert.equal(meta.grip[1],1-points.ledge.point[1]);
 const report={frames:107,effects:16,portrait:106,neutral:'exact RGBA',normalStrikes:'15 locked and individually distinct',intermediates:'30 distinct whole-body paintings; frame80 human-right-fist correction',headroom:40,grip:meta.grip,scales:meta.scales};
 fs.writeFileSync(root+'/tests/art-test-result.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1;});

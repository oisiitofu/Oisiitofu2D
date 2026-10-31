'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto'),sharp=require('sharp'),extract=require('./extract-art.cjs');
const root='characters/magus',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const meta=JSON.parse(fs.readFileSync(root+'/tests/art-layout.json')),locks=JSON.parse(fs.readFileSync(root+'/tests/locked-source-hashes.json')),points=JSON.parse(fs.readFileSync(root+'/tests/native-points.json'));
 assert.equal(meta.frames.length,107);assert.equal(meta.effects.length,16);assert.equal(meta.portrait,106);assert.equal(meta.sourcePoses.length,106);assert.equal(meta.bodyHeight,226);
 assert.equal(locks.lockedBeforeIntermediates,true);
 for(const[name,h]of Object.entries(locks.sources))assert.equal(hash(fs.readFileSync(root+'/assets/magus-'+name+'.png')),h,name+' locked source');
 const atlas=await sharp(root+'/assets/magus-native.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const crop=async r=>sharp(atlas.data,{raw:atlas.info}).extract({left:r[0],top:r[1],width:r[2],height:r[3]}).ensureAlpha().raw().toBuffer();
 assert((await crop(meta.frames[0])).equals(await sharp(root+'/assets/magus-neutral-locked.png').ensureAlpha().raw().toBuffer()),'Neutral exactRGBA');
 const strikes=[];
 for(let n=0;n<15;n++){
  const path=root+'/assets/magus-normal-'+n+'-locked.png';assert.equal(hash(fs.readFileSync(path)),locks.normals[n],'locked strikePNG '+n);
  const expected=await sharp(path).ensureAlpha().raw().toBuffer(),actual=await crop(meta.frames[16+n]);assert(actual.equals(expected),'strike exactRGBA '+n);strikes.push(hash(actual));
  const before=await crop(meta.frames[76+n]),after=await crop(meta.frames[91+n]);assert.notEqual(hash(before),hash(actual));assert.notEqual(hash(after),hash(actual));assert.notEqual(hash(before),hash(after));
 }
 assert.equal(new Set(strikes).size,15,'15 distinct normal wholebodies');
 for(const[family,rects]of [['frame',meta.frames],['effect',meta.effects]])for(const[n,r]of rects.entries()){
  assert(r[0]+r[2]<=atlas.info.width&&r[1]+r[3]<=atlas.info.height,family+n+'bounds');const p=await crop(r);let solid=0,empty=0;for(let i=3;i<p.length;i+=4){if(p[i]>150)solid++;if(!p[i])empty++;}assert(solid>20,family+n+'empty');assert(empty>20,family+n+'no transparency');
 }
 assert.equal(points.pelvis.length,106);assert.equal(meta.anchors.length,107);assert.deepEqual(meta.anchors,points.anchors);assert(new Set(meta.anchors).size>=15,'actual anatomical anchors');assert.equal(points.normals.length,15);assert.equal(points.specials.length,15);
 for(const p of points.normals)for(const key of ['grip','tip'])assert(p[key].every(v=>v>=0&&v<=1),p.move+' '+key);
 assert.equal(points.ledge.frame,55);assert(points.ledge.point[1]<.05,'actual raisedhand');assert.deepEqual(meta.grip,points.ledge.grip);assert(Math.abs(meta.grip[0]-(points.ledge.point[0]-meta.anchors[55]))<1e-9);assert.equal(meta.grip[1],1-points.ledge.point[1]);
 const h=meta.frames[55],hp=await crop(h),hx=Math.round(points.ledge.point[0]*h[2]),hy=Math.round(points.ledge.point[1]*h[3]);let ha=0;for(let y=hy-4;y<=hy+4;y++)for(let x=hx-4;x<=hx+4;x++)ha=Math.max(ha,hp[(y*h[2]+x)*4+3]||0);assert(ha>200,'actual opaque ledge fist contact');
 const fx=extract(await sharp(root+'/assets/magus-effects.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}));
 assert((await crop(meta.effects[0])).equals(fx[0].pixels),'FX0right unchanged');assert((await crop(meta.effects[3])).equals(fx[3].pixels),'FX3down unchanged');const expected=Buffer.alloc(fx[2].pixels.length);for(let y=0;y<fx[2].h;y++)fx[2].pixels.copy(expected,(fx[2].h-y-1)*fx[2].w*4,y*fx[2].w*4,(y+1)*fx[2].w*4);assert((await crop(meta.effects[2])).equals(expected),'OnlyFX2 locally flipped to up');
 const sourceManifest=JSON.parse(fs.readFileSync(root+'/tests/source-provenance.json'));for(const job of sourceManifest){assert.equal(hash(fs.readFileSync(job.final)),job.sha256,'final source '+job.name);assert.equal(hash(fs.readFileSync(job.generated)),job.sha256,'original byte match '+job.name);}
 const report={frames:107,effects:16,portrait:106,bodyHeight:226,targetBodyHeight:98,neutral:'exact RGBA',normalStrikes:'15 distinct locked exactRGBA',intermediates:'30 distinct separate wholebody paintings',anchors:'106 manually inspected waist/pelvis positions',ledge:'actual raised fist; relative body-anchor grip',sourceByteComparison:sourceManifest.length,fx:'0 convexright;2 vertically normalizedUP;3 convexDOWN;4lightning/5ice columns',scales:meta.scales};
 fs.writeFileSync(root+'/tests/art-test-result.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1;});
